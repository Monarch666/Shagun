import { NextRequest, NextResponse } from 'next/server';
import { mockStore } from '@/lib/supabase/mock-store';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getFreshGoogleAccessToken, getOrCreateWeddingDriveFolder, uploadPhotoToDrive } from '@/lib/drive/google-drive';

// In-memory rate limiting map: guestSessionId -> lastUploadTimestamp
const rateLimitMap = new Map<string, number>();

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const weddingId = formData.get('weddingId') as string;
    const rollId = formData.get('rollId') as string;
    const guestSessionId = formData.get('guestSessionId') as string;
    const guestName = (formData.get('guestName') as string) || 'Guest';

    // 1. Validate parameters
    if (!file || !weddingId || !rollId || !guestSessionId) {
      return NextResponse.json(
        { error: 'Missing required upload parameters' },
        { status: 400 }
      );
    }

    // 2. Rate limit check (minimum 1.5 seconds between shots per guest)
    const now = Date.now();
    const lastUpload = rateLimitMap.get(guestSessionId) || 0;
    if (now - lastUpload < 1500) {
      return NextResponse.json(
        { error: 'Please wait a moment before capturing another shot' },
        { status: 429 }
      );
    }
    rateLimitMap.set(guestSessionId, now);

    // 3. File validation: type and size
    if (file.type !== 'image/jpeg' && file.type !== 'image/jpg') {
      return NextResponse.json(
        { error: 'Only JPEG photos are accepted' },
        { status: 400 }
      );
    }

    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'Photo exceeds the 10MB size limit' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Magic bytes verification for JPEG: FF D8 FF
    if (buffer.length < 3 || buffer[0] !== 0xff || buffer[1] !== 0xd8 || buffer[2] !== 0xff) {
      return NextResponse.json(
        { error: 'Corrupted or invalid JPEG image data' },
        { status: 400 }
      );
    }

    // 4. Verify roll limit
    let currentRoll = null;
    let wedding = null;

    const supabase = createServerSupabaseClient();
    if (supabase) {
      const { data: rollData } = await supabase
        .from('camera_rolls')
        .select('*')
        .eq('id', rollId)
        .single();
      currentRoll = rollData;

      const { data: wedData } = await supabase
        .from('weddings')
        .select('*')
        .eq('id', weddingId)
        .single();
      wedding = wedData;
    } else {
      wedding = mockStore.getWeddingById(weddingId);
      currentRoll = mockStore.getOrCreateRoll(weddingId, guestSessionId, guestName);
    }

    if (!currentRoll) {
      return NextResponse.json({ error: 'Camera roll not found' }, { status: 404 });
    }

    if (currentRoll.shots_used >= currentRoll.roll_limit) {
      return NextResponse.json(
        { error: `Roll finished! You have used all ${currentRoll.roll_limit} shots.` },
        { status: 403 }
      );
    }

    // 5. Upload directly to couple's Google Drive folder
    const coupleNames = wedding ? `${wedding.partner_1_name} & ${wedding.partner_2_name}` : 'Couple';
    const accessToken = wedding?.encrypted_drive_refresh_token
      ? await getFreshGoogleAccessToken(wedding.encrypted_drive_refresh_token)
      : 'mock_google_access_token_123';

    let driveFolderId = wedding?.drive_folder_id;
    if (!driveFolderId && accessToken) {
      driveFolderId = await getOrCreateWeddingDriveFolder(accessToken, coupleNames);
    }

    const fileName = `shagun-${weddingId}-shot-${currentRoll.shots_used + 1}-${Date.now()}.jpg`;
    const driveUpload = accessToken && driveFolderId
      ? await uploadPhotoToDrive(accessToken, driveFolderId, fileName, buffer)
      : {
          fileId: `drive_file_${Date.now()}`,
          name: fileName,
          webViewLink: '',
          thumbnailLink: '',
        };

    // 6. Record metadata in Supabase (never store image bytes)
    if (supabase) {
      await supabase.from('photos').insert({
        wedding_id: weddingId,
        roll_id: currentRoll.id,
        google_drive_file_id: driveUpload.fileId,
        drive_thumbnail_url: driveUpload.thumbnailLink || null,
        drive_web_content_link: driveUpload.webViewLink || null,
        client_photo_hash: `${Date.now()}_${file.size}`,
        is_hidden_by_couple: false,
        is_deleted: false,
      });

      // Increment roll counter
      await supabase
        .from('camera_rolls')
        .update({
          shots_used: currentRoll.shots_used + 1,
          last_shot_at: new Date().toISOString(),
        })
        .eq('id', currentRoll.id);
    } else {
      mockStore.incrementRollShot(currentRoll.id);
      mockStore.savePhoto({
        wedding_id: weddingId,
        roll_id: currentRoll.id,
        google_drive_file_id: driveUpload.fileId,
        drive_thumbnail_url: driveUpload.thumbnailLink || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=600',
        drive_web_content_link: driveUpload.webViewLink || null,
        is_hidden_by_couple: false,
        is_deleted: false,
      });
    }

    const newShotsUsed = currentRoll.shots_used + 1;
    const shotsRemaining = Math.max(0, currentRoll.roll_limit - newShotsUsed);

    return NextResponse.json({
      success: true,
      fileId: driveUpload.fileId,
      shotsUsed: newShotsUsed,
      shotsRemaining,
    });
  } catch (err: any) {
    console.error('Photo upload handler error:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to upload photo' },
      { status: 500 }
    );
  }
}
