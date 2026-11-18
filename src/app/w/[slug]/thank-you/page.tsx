'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import confetti from 'canvas-confetti';
import { Heart, Camera, CheckCircle2, ArrowLeft, Sparkles, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { formatINR } from '@/lib/utils/currency';

export default function ThankYouPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params?.slug as string || 'aadarsh-and-shivani';

  const guestName = searchParams.get('name') || 'Guest';
  const amountStr = searchParams.get('amount');
  const amount = amountStr ? parseInt(amountStr, 10) : null;
  const fundTitle = searchParams.get('fund') || 'Our Wedding Journey';

  useEffect(() => {
    // Trigger celebratory golden & maroon confetti burst
    const end = Date.now() + 2.5 * 1000;
    const colors = ['#d97706', '#881337', '#eab308', '#f59e0b'];

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-ivory-50 flex items-center justify-center p-4 sm:p-6 indian-pattern-bg">
      <div className="max-w-md w-full">
        <Card className="p-8 text-center border-4 border-amber-300 shadow-2xl relative overflow-hidden bg-white">
          <div className="w-16 h-16 rounded-full bg-maroon-900 text-amber-300 flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Heart className="w-8 h-8 fill-amber-300" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-3">
            <CheckCircle2 className="w-4 h-4" />
            <span>Blessing Confirmed</span>
          </div>

          <h1 className="text-3xl font-serif font-bold text-maroon-950 mb-2">
            Aashirwad &amp; Shagun Received
          </h1>

          <p className="text-sm text-gray-600 mb-6">
            Thank you, <strong className="text-gray-900">{guestName}</strong> ji. Your blessings and generosity bring immense warmth to our new beginning.
          </p>

          <div className="bg-ivory-100 p-4 rounded-2xl border border-amber-200 mb-6 text-left space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-500">Contribution Toward:</span>
              <strong className="text-maroon-900 font-medium">{fundTitle}</strong>
            </div>
            {amount && (
              <div className="flex justify-between items-center text-xs pt-1 border-t border-amber-200">
                <span className="text-gray-500">Shagun Amount:</span>
                <strong className="text-lg font-serif font-bold text-maroon-950">{formatINR(amount)}</strong>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <Link href={`/w/${slug}/camera`} className="block">
              <Button variant="gold" size="lg" className="w-full gap-2 text-sm font-bold">
                <Camera className="w-4 h-4 text-maroon-950" />
                <span>Open 24-Shot Venue Camera</span>
              </Button>
            </Link>

            <Link href={`/w/${slug}`} className="block">
              <Button variant="outline" size="md" className="w-full gap-2 text-xs border-amber-300">
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Wedding Page</span>
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}

