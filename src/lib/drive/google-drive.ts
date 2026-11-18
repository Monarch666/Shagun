import { decryptToken } from '@/lib/crypto/encryption';

export interface DriveFolderResult {
  folderId: string;
  folderName: string;
}

export interface DriveUploadResult {
  fileId: string;
  name: string;
  webViewLink?: string;
  thumbnailLink?: string;
}

/**
 * Exchanges encrypted refresh token for a fresh Google OAuth access token
 */
export async function getFreshGoogleAccessToken(encryptedRefreshToken: string): Promise<string | null> {
  const refreshToken = decryptToken(encryptedRefreshToken);
  if (!refreshToken) {
    console.warn('No decrypted refresh token available');
    return null;
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret || clientId === 'mock-google-client-id') {
    // Development / Mock mode
    return 'mock_google_access_token_123';
  }

  try {
    const res = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      console.error('Google token refresh failed:', data);
      return null;
    }

    return data.access_token;
  } catch (err) {
    console.error('Error refreshing Google token:', err);
    return null;
  }
}

/**
 * Creates or gets the wedding root folder: "Shagun – [Couple Names]"
 * Strictly scoped to drive.file
 */
export async function getOrCreateWeddingDriveFolder(
  accessToken: string,
  coupleNames: string
): Promise<string> {
  if (accessToken === 'mock_google_access_token_123') {
    return 'mock_drive_wedding_folder_123';
  }

  const folderName = `Shagun – ${coupleNames}`;

  // Search if folder already exists
  const query = `mimeType = 'application/vnd.google-apps.folder' and name = '${folderName}' and trashed = false`;
  const searchRes = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=files(id,name)`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  const searchData = await searchRes.json();
  if (searchData.files && searchData.files.length > 0) {
    return searchData.files[0].id;
  }

  // Create new folder
  const createRes = await fetch('https://www.googleapis.com/drive/v3/files', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder',
      description: 'Photos captured by guests using Shagun disposable venue camera.',
    }),
  });

  const folder = await createRes.json();
  return folder.id;
}

/**
 * Uploads a JPEG photo buffer directly to Google Drive under the designated folder
 */
export async function uploadPhotoToDrive(
  accessToken: string,
  folderId: string,
  fileName: string,
  buffer: Buffer,
  mimeType = 'image/jpeg'
): Promise<DriveUploadResult> {
  if (accessToken === 'mock_google_access_token_123') {
    return {
      fileId: `gdrive_mock_file_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      name: fileName,
      webViewLink: 'https://drive.google.com/file/d/mock-preview/view',
      thumbnailLink: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=600',
    };
  }

  // Multipart upload to Google Drive v3
  const boundary = '-------314159265358979323846';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const metadata = {
    name: fileName,
    parents: [folderId],
    mimeType: mimeType,
  };

  const multipartRequestBody = Buffer.concat([
    Buffer.from(
      delimiter +
        'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
        JSON.stringify(metadata) +
        delimiter +
        `Content-Type: ${mimeType}\r\n\r\n`
    ),
    buffer,
    Buffer.from(closeDelimiter),
  ]);

  const res = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink,thumbnailLink',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': `multipart/related; boundary=${boundary}`,
        'Content-Length': multipartRequestBody.length.toString(),
      },
      body: multipartRequestBody,
    }
  );

  const file = await res.json();
  if (!res.ok) {
    throw new Error(file?.error?.message || 'Google Drive upload failed');
  }

  return {
    fileId: file.id,
    name: file.name,
    webViewLink: file.webViewLink,
    thumbnailLink: file.thumbnailLink,
  };
}

