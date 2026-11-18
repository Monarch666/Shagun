'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Printer,
  Download,
  QrCode,
  Heart,
  Camera,
  Sparkles,
  Smartphone,
  CheckCircle2,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { mockStore } from '@/lib/supabase/mock-store';
import { Wedding } from '@/lib/supabase/types';
import { generateQRCodeDataUrl } from '@/lib/utils/qr';

export default function PrintablePosterPage() {
  const [wedding, setWedding] = useState<Wedding | null>(null);
  const [posterType, setPosterType] = useState<'main' | 'camera'>('main');
  const [mainQrUrl, setMainQrUrl] = useState<string>('');
  const [cameraQrUrl, setCameraQrUrl] = useState<string>('');

  useEffect(() => {
    const w = mockStore.getWeddingById('wed-001') || mockStore.getWeddingBySlug('aadarsh-and-shivani');
    if (w) {
      setWedding(w);
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const mainLink = `${origin}/w/${w.slug}`;
      const cameraLink = `${origin}/w/${w.slug}/camera`;

      generateQRCodeDataUrl(mainLink, { width: 500 }).then(setMainQrUrl);
      generateQRCodeDataUrl(cameraLink, { width: 500 }).then(setCameraQrUrl);
    }
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadQr = () => {
    const activeUrl = posterType === 'main' ? mainQrUrl : cameraQrUrl;
    if (!activeUrl) return;

    const link = document.createElement('a');
    link.href = activeUrl;
    link.download = `shagun-${wedding?.slug || 'wedding'}-${posterType}-qr.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const activeQr = posterType === 'main' ? mainQrUrl : cameraQrUrl;

  return (
    <div className="space-y-8">
      {/* Controls Bar (Hidden in Print) */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-amber-200/80 shadow-sm">
        <div>
          <h1 className="text-2xl font-serif font-bold text-maroon-950">Printable QR Code Standees</h1>
          <p className="text-xs text-gray-600 mt-1">
            Display on dining tables, reception counters, and banquet entrances.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Toggle Poster Type */}
          <div className="inline-flex rounded-xl p-1 bg-ivory-200 border border-amber-300">
            <button
              onClick={() => setPosterType('main')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${posterType === 'main'
                  ? 'bg-maroon-900 text-amber-100 shadow-xs'
                  : 'text-gray-700 hover:text-maroon-950'
                }`}
            >
              Wedding &amp; Shagun Standee
            </button>
            <button
              onClick={() => setPosterType('camera')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${posterType === 'camera'
                  ? 'bg-maroon-900 text-amber-100 shadow-xs'
                  : 'text-gray-700 hover:text-maroon-950'
                }`}
            >
              Venue Disposable Camera Standee
            </button>
          </div>

          <Button onClick={handleDownloadQr} variant="outline" size="sm" className="gap-1.5">
            <Download className="w-4 h-4" />
            <span>Download PNG</span>
          </Button>

          <Button onClick={handlePrint} variant="primary" size="sm" className="gap-1.5">
            <Printer className="w-4 h-4" />
            <span>Print Standee</span>
          </Button>
        </div>
      </div>

      {/* The Printable Poster Container */}
      <div className="flex justify-center">
        <div className="poster-container w-full max-w-[550px] bg-white border-4 border-amber-400 p-8 sm:p-12 rounded-3xl shadow-xl text-center relative overflow-hidden">
          {/* Traditional Ornate Border Frame */}
          <div className="absolute inset-2 border-2 border-dashed border-maroon-800/40 rounded-2xl pointer-events-none" />

          {/* Top Marigold Motif */}
          <div className="flex justify-center items-center gap-2 mb-4">
            <div className="h-0.5 w-12 bg-marigold-500" />
            <div className="w-8 h-8 rounded-full bg-maroon-900 flex items-center justify-center text-amber-300 shadow-xs">
              {posterType === 'main' ? <Heart className="w-4 h-4 fill-amber-300" /> : <Camera className="w-4 h-4" />}
            </div>
            <div className="h-0.5 w-12 bg-marigold-500" />
          </div>

          <p className="text-xs uppercase tracking-widest text-maroon-900 font-semibold mb-1">
            {posterType === 'main' ? 'Blessings & Shagun' : 'Venue Disposable Camera'}
          </p>

          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-maroon-950 mb-2">
            {wedding?.partner_1_name} &amp; {wedding?.partner_2_name}
          </h2>

          <p className="text-xs sm:text-sm text-gray-600 mb-6">
            {wedding?.city} &bull; {wedding?.wedding_date ? new Date(wedding.wedding_date).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' }) : ''}
          </p>

          {/* QR Code Presentation */}
          <div className="my-6 inline-block p-4 bg-ivory-50 border-2 border-amber-300 rounded-3xl shadow-inner">
            {activeQr ? (
              <img src={activeQr} alt="Scan QR Code" className="w-56 h-56 sm:w-64 sm:h-64 object-contain rounded-xl mx-auto" />
            ) : (
              <div className="w-56 h-56 bg-gray-100 animate-pulse rounded-xl" />
            )}
          </div>

          {/* Headline & Guidance */}
          <div className="mt-4 mb-6">
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-maroon-900">
              {posterType === 'main'
                ? 'Scan with Any Phone Camera'
                : 'Take 24 Vintage Wedding Photos!'}
            </h3>
            <p className="text-xs sm:text-sm text-gray-700 mt-2 max-w-sm mx-auto">
              {posterType === 'main'
                ? 'Send your blessings, explore our milestone dreams, and contribute via UPI with zero app install.'
                : 'No app download needed. Open in your browser, snap moments with our vintage film filter, and see them after tomorrow morning’s reveal!'}
            </p>
          </div>

          {/* Simple 3-Step Guide for Elders & Guests */}
          <div className="bg-amber-50/70 border border-amber-200/90 rounded-2xl p-4 text-left grid grid-cols-3 gap-2 text-center">
            <div>
              <span className="w-6 h-6 rounded-full bg-maroon-900 text-amber-200 text-xs font-bold inline-flex items-center justify-center mb-1">
                1
              </span>
              <p className="text-[11px] font-semibold text-gray-800">Open Camera</p>
              <p className="text-[10px] text-gray-500">Point phone at QR</p>
            </div>
            <div>
              <span className="w-6 h-6 rounded-full bg-maroon-900 text-amber-200 text-xs font-bold inline-flex items-center justify-center mb-1">
                2
              </span>
              <p className="text-[11px] font-semibold text-gray-800">Tap Notification</p>
              <p className="text-[10px] text-gray-500">Opens in browser</p>
            </div>
            <div>
              <span className="w-6 h-6 rounded-full bg-maroon-900 text-amber-200 text-xs font-bold inline-flex items-center justify-center mb-1">
                3
              </span>
              <p className="text-[11px] font-semibold text-gray-800">Share Blessings</p>
              <p className="text-[10px] text-gray-500">No login or app!</p>
            </div>
          </div>

          {/* Bottom Branding */}
          <div className="mt-6 flex items-center justify-center gap-1 text-[11px] text-gray-400">
            <span>Powered by</span>
            <strong className="text-maroon-900 font-serif">Shagun</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

