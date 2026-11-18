import { createBrowserClient } from '@supabase/ssr';
import { Database } from './types';

export function isSupabaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-supabase-project')
  );
}

export function createClient() {
  if (!isSupabaseConfigured()) {
    // Return null or mock client when not configured
    return null;
  }
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

