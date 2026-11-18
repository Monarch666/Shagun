import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { encryptToken } from '@/lib/crypto/encryption';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const origin = requestUrl.origin;

  if (code) {
    const supabase = createServerSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error && data.session) {
        // If Google returned a provider refresh token, encrypt it at rest
        const providerRefreshToken = data.session.provider_refresh_token;
        if (providerRefreshToken) {
          const encryptedToken = encryptToken(providerRefreshToken);
          // Store encrypted token into weddings table if wedding exists for this user
          await supabase
            .from('weddings')
            .update({ encrypted_drive_refresh_token: encryptedToken })
            .eq('owner_id', data.session.user.id);
        }
      }
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(`${origin}/dashboard`);
}

