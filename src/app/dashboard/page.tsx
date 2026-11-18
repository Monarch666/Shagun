'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Heart,
  TrendingUp,
  Gift,
  Camera,
  Users,
  QrCode,
  Copy,
  Check,
  CheckCircle2,
  ExternalLink,
  Plus,
  ArrowRight,
  ShieldCheck,
  Clock,
  Sparkles,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { mockStore } from '@/lib/supabase/mock-store';
import { Wedding, Fund, LedgerEntry } from '@/lib/supabase/types';
import { formatINR } from '@/lib/utils/currency';
import { generateQRCodeDataUrl } from '@/lib/utils/qr';

export default function DashboardOverviewPage() {
  const [wedding, setWedding] = useState<Wedding | null>(null);
  const [funds, setFunds] = useState<Fund[]>([]);
  const [ledger, setLedger] = useState<LedgerEntry[]>([]);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [isCopied, setIsCopied] = useState(false);
  const [isCodeCopied, setIsCodeCopied] = useState(false);

  useEffect(() => {
    const w = mockStore.getWeddingById('wed-001') || mockStore.getWeddingBySlug('aadarsh-and-shivani');
    if (w) {
      setWedding(w);
      setFunds(mockStore.getFunds(w.id));
      setLedger(mockStore.getLedger(w.id));

      const publicUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/w/${w.slug}`;
      generateQRCodeDataUrl(publicUrl, { width: 180 }).then(setQrDataUrl);
    }
  }, []);

  const totalShagun = ledger.reduce((acc, item) => acc + item.amount, 0);
  const onlineShagun = ledger.filter((i) => i.gift_type === 'online').reduce((acc, i) => acc + i.amount, 0);
  const offlineShagun = totalShagun - onlineShagun;
  const contributorCount = ledger.length;

  const publicUrl = wedding ? `${typeof window !== 'undefined' ? window.location.origin : ''}/w/${wedding.slug}` : '';

  const handleCopyLink = () => {
    if (publicUrl) {
      navigator.clipboard.writeText(publicUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleCopyCode = () => {
    if (wedding?.activation_code) {
      navigator.clipboard.writeText(wedding.activation_code);
      setIsCodeCopied(true);
      setTimeout(() => setIsCodeCopied(false), 2000);
    }
  };

  const calculateDaysLeft = (targetDate: string) => {
    const diff = new Date(targetDate).getTime() - new Date().getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-maroon-900 via-maroon-800 to-maroon-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden border-2 border-amber-400/40">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none indian-pattern-bg" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-200 border border-amber-300/30 text-xs font-semibold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Wedding In {calculateDaysLeft(wedding?.wedding_date || '2026-12-18')} Days</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-amber-100">
              {wedding?.partner_1_name} &amp; {wedding?.partner_2_name}&apos;s Wedding Portal
            </h1>
            <p className="mt-1 text-amber-200/80 text-sm sm:text-base">
              {wedding?.city} &bull; {wedding?.wedding_date ? new Date(wedding.wedding_date).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' }) : ''}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link href="/dashboard/poster">
              <Button variant="gold" size="md" className="gap-2">
                <QrCode className="w-4 h-4" />
                <span>Print QR Poster</span>
              </Button>
            </Link>
            <Link href={`/w/${wedding?.slug}`} target="_blank">
              <Button variant="outline" size="md" className="border-amber-300 text-amber-100 hover:bg-maroon-800 gap-2">
                <ExternalLink className="w-4 h-4" />
                <span>Visit Guest Page</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* 30-Day Activation Code & Access Status */}
      <div className="bg-white rounded-2xl border-2 border-emerald-300 p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0 mt-0.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-700" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif font-bold text-gray-900 text-base">
                Wedding Portal Active &bull; 30-Day Pass
              </h3>
              <Badge variant="green" size="sm">Active for 30 Days</Badge>
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Your Shagun page, UPI contributions, and 24-shot venue disposable camera are fully operational.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-ivory-100 p-2.5 rounded-xl border border-emerald-200">
          <div>
            <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold block">
              Your Activation Code:
            </span>
            <span className="font-mono text-sm font-bold text-emerald-950 tracking-wider">
              {wedding?.activation_code || 'SHAGUN-7777-2026'}
            </span>
          </div>
          <Button onClick={handleCopyCode} variant="outline" size="sm" className="h-9 px-3 text-xs border-emerald-400">
            {isCodeCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="ml-1">{isCodeCopied ? 'Copied' : 'Copy'}</span>
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Shagun Received</span>
            <div className="p-2.5 rounded-xl bg-amber-100 text-amber-900">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-serif font-bold text-maroon-950">{formatINR(totalShagun)}</h3>
            <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
              <span>UPI Online: <strong className="text-gray-700">{formatINR(onlineShagun)}</strong></span>
              <span>&bull;</span>
              <span>Offline: <strong className="text-gray-700">{formatINR(offlineShagun)}</strong></span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Blessings &amp; Gifts</span>
            <div className="p-2.5 rounded-xl bg-rose-100 text-maroon-900">
              <Gift className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-serif font-bold text-maroon-950">{contributorCount}</h3>
            <p className="mt-2 text-xs text-gray-500">From family, friends, and elders</p>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Active Milestone Funds</span>
            <div className="p-2.5 rounded-xl bg-yellow-100 text-yellow-900">
              <Heart className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-serif font-bold text-maroon-950">{funds.length}</h3>
            <p className="mt-2 text-xs text-gray-500">
              {funds.filter((f) => f.status === 'active').length} active goals
            </p>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Venue Disposable Camera</span>
            <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-900">
              <Camera className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-serif font-bold text-maroon-950">24 Shots</h3>
            <p className="mt-2 text-xs text-gray-500">Per guest &bull; Reveal: Next morning 10 AM</p>
          </div>
        </Card>
      </div>

      {/* Shareable Link & QR Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-serif font-bold text-maroon-950">Public Guest Link &amp; Sharing</h3>
            <Badge variant="marigold">Instant Access &bull; No Login Needed</Badge>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Share this link via WhatsApp, your digital wedding invitation, or display the QR code at your venue registration table.
          </p>
          <div className="flex items-center gap-2 bg-ivory-50 p-2 rounded-2xl border border-amber-300">
            <input
              type="text"
              readOnly
              value={publicUrl}
              className="flex-1 bg-transparent px-3 py-2 text-sm text-gray-800 font-mono focus:outline-none"
            />
            <Button onClick={handleCopyLink} variant="primary" size="sm" className="gap-1.5 flex-shrink-0">
              {isCopied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              <span>{isCopied ? 'Copied!' : 'Copy'}</span>
            </Button>
          </div>

          <div className="mt-6 pt-6 border-t border-amber-100 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center text-maroon-900 font-bold text-sm">
                1
              </div>
              <div className="text-xs text-gray-600">
                <p className="font-semibold text-gray-900">Share on WhatsApp</p>
                <p>Send to your wedding guest list</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center text-maroon-900 font-bold text-sm">
                2
              </div>
              <div className="text-xs text-gray-600">
                <p className="font-semibold text-gray-900">Print Table Standees</p>
                <p>Guests scan from dining tables</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center text-maroon-900 font-bold text-sm">
                3
              </div>
              <div className="text-xs text-gray-600">
                <p className="font-semibold text-gray-900">Track in Real-Time</p>
                <p>Ledger updates with zero delay</p>
              </div>
            </div>
          </div>
        </Card>

        {/* QR Code Quick Card */}
        <Card className="p-6 flex flex-col items-center justify-center text-center">
          <h4 className="font-serif font-bold text-maroon-950 mb-1">Venue Quick QR</h4>
          <p className="text-xs text-gray-500 mb-4">Scan with any smartphone camera</p>
          <div className="p-3 bg-white border-2 border-amber-300 rounded-2xl shadow-sm mb-4">
            {qrDataUrl ? (
              <img src={qrDataUrl} alt="Wedding QR Code" className="w-36 h-36 rounded-lg" />
            ) : (
              <div className="w-36 h-36 bg-gray-100 animate-pulse rounded-lg" />
            )}
          </div>
          <Link href="/dashboard/poster" className="w-full">
            <Button variant="outline" size="sm" className="w-full gap-2">
              <QrCode className="w-4 h-4" />
              <span>Full Print Poster</span>
            </Button>
          </Link>
        </Card>
      </div>

      {/* Recent Shagun Ledger Feed */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-serif font-bold text-maroon-950">Recent Blessings &amp; Shagun</h3>
            <p className="text-xs text-gray-500">Live entries from your wedding guests</p>
          </div>
          <Link href="/dashboard/ledger">
            <Button variant="ghost" size="sm" className="gap-1">
              <span>View Full Ledger</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ledger.slice(0, 4).map((entry) => (
            <Card key={entry.id} className="p-5 flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-gray-900">{entry.guest_name}</h4>
                  <Badge variant={entry.gift_type === 'online' ? 'maroon' : 'gold'} size="sm">
                    {entry.gift_type === 'online' ? 'UPI Online' : 'Cash Envelope'}
                  </Badge>
                </div>
                {entry.fund_title && (
                  <p className="text-xs text-marigold-700 font-medium mt-1">For: {entry.fund_title}</p>
                )}
                {entry.notes && (
                  <p className="text-xs text-gray-600 italic mt-2 bg-amber-50/60 p-2 rounded-lg border border-amber-100">
                    &ldquo;{entry.notes}&rdquo;
                  </p>
                )}
                <span className="text-[11px] text-gray-400 mt-2 block">{entry.received_date}</span>
              </div>
              <div className="text-right">
                <span className="text-lg font-serif font-bold text-maroon-900">{formatINR(entry.amount)}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

