import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Lock, EyeOff, FileText, Camera, CreditCard } from 'lucide-react';
import { Card } from '@/components/ui/Card';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-ivory-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-maroon-900 hover:text-maroon-700 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <div className="text-center mb-10">
          <div className="inline-flex p-3 rounded-full bg-maroon-100 text-maroon-900 mb-3">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-maroon-950">
            Privacy &amp; Security Pledge
          </h1>
          <p className="mt-2 text-gray-600 text-sm sm:text-base">
            Weddings are deeply intimate family celebrations. Here is exactly how Shagun protects your data.
          </p>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-2.5 rounded-xl bg-amber-100 text-amber-900 mt-1">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold text-maroon-950 mb-1">
                  1. Strict Google Drive Boundary (drive.file Scope Only)
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  When the couple connects Google Drive, Shagun requests <strong>only</strong> the{' '}
                  <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono text-xs text-amber-900">
                    https://www.googleapis.com/auth/drive.file
                  </code>{' '}
                  scope. Under Google&apos;s security architecture, this permission grants access <em>only</em> to the specific folder and images created directly by the Shagun app. We cannot read, modify, view, or even detect any other folders, photos, or documents in your Drive.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-2.5 rounded-xl bg-rose-100 text-maroon-900 mt-1">
                <EyeOff className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold text-maroon-950 mb-1">
                  2. Zero Guest Logins &amp; Minimal PII
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Wedding guests are never asked to create an account, enter passwords, or install an application. We only collect the guest&apos;s display name and optional blessing message. We never sell, share, or track guest information across the web.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-2.5 rounded-xl bg-amber-100 text-amber-900 mt-1">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold text-maroon-950 mb-1">
                  3. No Escrow or Holding of Funds
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Shagun does not hold your wedding funds in a middleman escrow account or digital wallet. Contributions made through Razorpay UPI settle directly into the couple&apos;s linked verified bank account.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-2.5 rounded-xl bg-yellow-100 text-yellow-900 mt-1">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold text-maroon-950 mb-1">
                  4. Authentic Disposable Camera Privacy &amp; Reveal
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Guest photos taken via the in-browser camera remain locked and undeveloped until the morning after the wedding (or the couple&apos;s configured reveal time). Once revealed, each guest can view only their own 24-shot roll, while the couple receives full ownership of all captured photos directly in their private Google Drive.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-900 mt-1">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold text-maroon-950 mb-1">
                  5. Bank-Grade Token Encryption at Rest
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  All sensitive credentials, including Google OAuth refresh tokens, are encrypted at rest using AES-256-GCM before storage in the database.
                </p>
              </div>
            </div>
          </Card>
        </div>

        <div className="text-center mt-12 text-sm text-gray-500">
          Last updated: November 2026 &bull; Crafted with care for Indian weddings
        </div>
      </div>
    </div>
  );
}

