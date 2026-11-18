'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  QrCode,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  Copy,
  Check,
  ArrowRight,
  Clock,
  KeyRound,
  Smartphone,
  Info,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { mockStore } from '@/lib/supabase/mock-store';
import { generateQRCodeDataUrl } from '@/lib/utils/qr';
import { ActivationPass } from '@/lib/supabase/types';

interface PlatformActivationCardProps {
  platformUpiId?: string;
  price?: number;
  onCodeGenerated?: (code: string) => void;
  className?: string;
}

export function PlatformActivationCard({
  platformUpiId = process.env.NEXT_PUBLIC_ADMIN_UPI_ID || 'shagun.pass@okhdfcbank',
  price = 999,
  onCodeGenerated,
  className = '',
}: PlatformActivationCardProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [utrNumber, setUtrNumber] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedPass, setGeneratedPass] = useState<ActivationPass | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Generate UPI standard payment string for the platform activation fee
    const upiString = `upi://pay?pa=${platformUpiId}&pn=${encodeURIComponent(
      'Shagun Platform'
    )}&am=${price}&cu=INR&tn=${encodeURIComponent('30-Day Wedding Activation Pass')}`;

    generateQRCodeDataUrl(upiString, { width: 350 }).then(setQrCodeUrl);
  }, [platformUpiId, price]);

  const handleSimulatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      // Create a single-use 30-day activation pass tied to 1 couple
      const pass = mockStore.createActivationPass(price);
      setGeneratedPass(pass);
      setIsProcessing(false);
      if (onCodeGenerated) {
        onCodeGenerated(pass.code);
      }
    }, 700);
  };

  const handleCopyCode = () => {
    if (generatedPass) {
      navigator.clipboard.writeText(generatedPass.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Card className={`overflow-hidden border-2 border-amber-300 shadow-xl bg-white ${className}`}>
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-maroon-950 via-maroon-900 to-maroon-950 text-white p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Official 30-Day Wedding Pass</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-amber-100">
              Get Your Activation Code
            </h3>
            <p className="text-xs sm:text-sm text-amber-200/80 mt-1 max-w-xl">
              Pay via your UPI scanner to receive your dedicated activation code. Active for 30 full days of festivities and restricted to 1 couple only.
            </p>
          </div>

          <div className="text-left sm:text-right bg-maroon-900/80 p-3 rounded-2xl border border-amber-400/30">
            <span className="text-xs text-amber-200/80 block uppercase tracking-wider font-semibold">
              One-Time Pass
            </span>
            <span className="text-3xl font-serif font-bold text-amber-300">₹{price}</span>
            <span className="text-[11px] text-amber-200/60 block mt-0.5">30-day full access</span>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8">
        {!generatedPass ? (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Left: Platform Scanner QR */}
            <div className="md:col-span-5 flex flex-col items-center text-center p-6 rounded-2xl bg-[#FAF7F2] border-2 border-dashed border-amber-300">
              <span className="text-xs font-semibold uppercase tracking-wider text-maroon-950 mb-3 flex items-center gap-1.5">
                <QrCode className="w-4 h-4 text-maroon-800" />
                Scan to Pay via Any UPI App
              </span>

              {qrCodeUrl ? (
                <div className="p-3 bg-white rounded-2xl shadow-md border border-amber-200">
                  <img
                    src={qrCodeUrl}
                    alt="Platform UPI Scanner QR"
                    className="w-48 h-48 sm:w-56 sm:h-56 object-contain"
                  />
                </div>
              ) : (
                <div className="w-48 h-48 bg-amber-50 rounded-2xl animate-pulse flex items-center justify-center text-xs text-gray-400">
                  Generating Scanner...
                </div>
              )}

              <div className="mt-4 space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-amber-200 text-xs font-mono text-gray-800 font-semibold shadow-xs">
                  <span>UPI: {platformUpiId}</span>
                </div>
                <p className="text-[11px] text-gray-500">
                  Supports Google Pay, PhonePe, Paytm, BHIM, CRED
                </p>
              </div>
            </div>

            {/* Right: Payment Instructions & Pass Generation */}
            <div className="md:col-span-7 space-y-5">
              <div className="space-y-3">
                <h4 className="font-serif font-bold text-maroon-950 text-lg">
                  How It Works:
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-gray-700">
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-amber-100 text-maroon-900 font-bold flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                      1
                    </span>
                    <span>
                      Scan the QR above with any UPI app and complete the ₹{price} payment.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-amber-100 text-maroon-900 font-bold flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                      2
                    </span>
                    <span>
                      Click below to generate and claim your unique 30-day activation code.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-amber-100 text-maroon-900 font-bold flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                      3
                    </span>
                    <span>
                      Register your wedding and link <strong>your own UPI QR &amp; registered numbers</strong>. All guest gifts go 100% to you.
                    </span>
                  </li>
                </ul>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-maroon-950 space-y-1">
                <p className="font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  Single-Couple Protection:
                </p>
                <p className="text-gray-600">
                  Each issued code is single-use and locked to 1 couple only. It remains active for 30 consecutive days from activation.
                </p>
              </div>

              <form onSubmit={handleSimulatePayment} className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    UPI UTR / Reference No. (Optional for demo)
                  </label>
                  <input
                    type="text"
                    value={utrNumber}
                    onChange={(e) => setUtrNumber(e.target.value)}
                    placeholder="e.g. 432109876543 (12-digit UTR)"
                    className="w-full px-4 py-2.5 rounded-xl border border-amber-300 bg-white text-xs font-mono focus:outline-none focus:ring-2 focus:ring-maroon-800"
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={isProcessing}
                  className="w-full bg-maroon-900 hover:bg-maroon-950 text-amber-100 py-3 text-sm shadow-md flex items-center justify-center gap-2"
                >
                  <KeyRound className="w-4 h-4 text-amber-300" />
                  <span>I Have Paid ₹{price} &bull; Generate Activation Code</span>
                </Button>
              </form>
            </div>
          </div>
        ) : (
          /* Generated Code View */
          <div className="text-center max-w-xl mx-auto py-4 space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-10 h-10 text-emerald-600" />
            </div>

            <div className="space-y-2">
              <Badge variant="green" size="md">Activation Code Issued</Badge>
              <h4 className="text-2xl font-serif font-bold text-maroon-950">
                Your 30-Day Wedding Pass is Ready!
              </h4>
              <p className="text-xs sm:text-sm text-gray-600">
                Copy this code and apply it during your wedding registration. It is valid for 30 days and valid for 1 couple only.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-amber-50 border-2 border-amber-300 space-y-3 shadow-inner">
              <span className="text-xs uppercase tracking-wider font-semibold text-gray-600 block">
                Your Unique Activation Code:
              </span>
              <div className="font-mono text-3xl sm:text-4xl font-extrabold text-maroon-950 tracking-wider">
                {generatedPass.code}
              </div>
              <div className="flex items-center justify-center gap-2 text-xs text-emerald-800 font-medium">
                <Clock className="w-3.5 h-3.5" />
                <span>
                  Valid until{' '}
                  {new Date(generatedPass.expires_at).toLocaleDateString('en-IN', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}{' '}
                  (30 Days)
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                onClick={handleCopyCode}
                variant="outline"
                size="md"
                className="w-full sm:w-auto border-amber-400 gap-2 text-maroon-950"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Code Copied!' : 'Copy Activation Code'}</span>
              </Button>

              <Link href="/dashboard/wedding" className="w-full sm:w-auto">
                <Button
                  variant="primary"
                  size="md"
                  className="w-full sm:w-auto bg-maroon-900 hover:bg-maroon-950 text-amber-100 gap-2 shadow-sm"
                >
                  <span>Register &amp; Link Your UPI QR &rarr;</span>
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

