'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart, ShieldCheck, Sparkles, ArrowRight, Lock, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      if (!supabase) {
        // Fallback: local demo couple session
        if (typeof window !== 'undefined') {
          localStorage.setItem('shagun_user_session', JSON.stringify({
            id: 'couple-user-001',
            email: 'aadarsh.shivani@example.com',
            name: 'Aadarsh & Shivani',
          }));
        }
        setTimeout(() => {
          router.push('/dashboard');
        }, 500);
        return;
      }

      // Live Supabase Google OAuth with drive.file scope strictly
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          scopes: 'https://www.googleapis.com/auth/drive.file',
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) throw error;
    } catch (err: any) {
      console.error('Sign-in error:', err);
      setError(err?.message || 'Failed to initialize Google Sign In');
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('shagun_user_session', JSON.stringify({
        id: 'couple-user-001',
        email: 'aadarsh.shivani@example.com',
        name: 'Aadarsh & Shivani',
      }));
    }
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-ivory-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 indian-pattern-bg">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2 mb-4">
          <div className="w-12 h-12 rounded-full bg-maroon-900 flex items-center justify-center text-amber-300 shadow-md">
            <Heart className="w-6 h-6 fill-amber-300" />
          </div>
          <span className="font-serif text-3xl font-bold tracking-tight text-maroon-950">Shagun</span>
        </Link>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-maroon-950">
          Welcome to Your Wedding Portal
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Create your personalized Shagun page, manage milestone funds, and unlock venue memories.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl shadow-xl border-2 border-amber-300/80">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <Button
              onClick={handleGoogleSignIn}
              isLoading={isLoading}
              variant="primary"
              size="lg"
              className="w-full flex items-center justify-center gap-3 py-3.5 text-base"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"
                />
                <path
                  fill="#4285F4"
                  d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5.1 3.7-8.9z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16c1.8 3.7 5.6 6.3 10.1 6.3z"
                />
              </svg>
              <span>Continue with Google</span>
            </Button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500 font-medium">Or Quick Dev Demo</span>
              </div>
            </div>

            <Button
              onClick={handleDemoLogin}
              variant="outline"
              size="md"
              className="w-full border-amber-500 text-maroon-900 hover:bg-amber-50"
            >
              <Sparkles className="w-4 h-4 text-marigold-600 mr-2" />
              Enter Instant Demo as &quot;Aadarsh &amp; Shivani&quot;
            </Button>
          </div>

          {/* Privacy & Scope Explainer */}
          <div className="mt-8 pt-6 border-t border-amber-100">
            <div className="flex items-start gap-3 bg-amber-50/70 p-3.5 rounded-2xl border border-amber-200">
              <ShieldCheck className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-gray-700 space-y-1">
                <p className="font-semibold text-maroon-950">Our Strict Privacy Guarantee</p>
                <p>
                  We only request Google Drive <code className="bg-amber-100 px-1 py-0.5 rounded font-mono text-[10px]">drive.file</code> scope.
                </p>
                <p className="text-gray-600">
                  This permits Shagun to create a single dedicated folder for your wedding memories. <strong>We can never read, modify, or see your private documents or existing photos.</strong>
                </p>
                <Link href="/privacy" className="text-maroon-800 underline font-medium inline-block mt-1">
                  Read full privacy details &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-gray-500 mt-6">
          By signing in, you agree to our respectful terms and private storage guidelines.
        </p>
      </div>
    </div>
  );
}

