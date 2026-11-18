'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, ArrowLeft, ShieldCheck } from 'lucide-react';
import { PlatformActivationCard } from '@/components/activation/PlatformActivationCard';
import { Button } from '@/components/ui/Button';

export default function ActivatePage() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] text-gray-900 selection:bg-amber-200">
      {/* Navigation Header */}
      <header className="border-b border-amber-200/80 bg-white/95 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-maroon-900 flex items-center justify-center text-amber-300 shadow-sm">
              <Heart className="w-5 h-5 fill-amber-300" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-2xl font-bold tracking-tight text-maroon-950 leading-none">Shagun</span>
              <span className="text-[10px] tracking-wider uppercase text-amber-800 font-medium">Activation Portal</span>
            </div>
          </Link>

          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-maroon-900">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-maroon-950">
            Activate Your Wedding Platform
          </h1>
          <p className="text-sm text-gray-600">
            Scan our platform scanner QR to obtain your single-use 30-day activation code. After activating, you link your own UPI QR and registered numbers so all wedding gifts go directly to you.
          </p>
        </div>

        <PlatformActivationCard />

        <div className="text-center pt-4">
          <Link href="/dashboard/wedding" className="text-xs text-maroon-900 underline hover:text-maroon-950 font-medium">
            Already have an activation code? Go to Wedding Setup &rarr;
          </Link>
        </div>
      </main>
    </div>
  );
}

