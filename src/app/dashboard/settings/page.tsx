'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  CreditCard,
  Camera,
  HardDrive,
  CheckCircle2,
  ExternalLink,
  Save,
  AlertTriangle,
  QrCode,
  Smartphone,
  KeyRound,
  Check,
  Copy,
  Upload,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { mockStore } from '@/lib/supabase/mock-store';
import { Wedding } from '@/lib/supabase/types';
import { generateQRCodeDataUrl } from '@/lib/utils/qr';

export default function CoupleSettingsPage() {
  const [wedding, setWedding] = useState<Wedding | null>(null);
  const [rollLimit, setRollLimit] = useState(24);
  const [revealAt, setRevealAt] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Couple's Own UPI & 2 Registered Numbers
  const [coupleUpiId, setCoupleUpiId] = useState('');
  const [partner1Phone, setPartner1Phone] = useState('');
  const [partner2Phone, setPartner2Phone] = useState('');
  const [coupleUpiQrUrl, setCoupleUpiQrUrl] = useState('');
  const [generatedUpiQr, setGeneratedUpiQr] = useState('');

  // 30-Day Activation Pass Code redemption
  const [activationCodeInput, setActivationCodeInput] = useState('');
  const [activationMsg, setActivationMsg] = useState<{ text: string; success: boolean } | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    const w = mockStore.getWeddingById('wed-001') || mockStore.getWeddingBySlug('aadarsh-and-shivani');
    if (w) {
      setWedding(w);
      setRollLimit(w.default_roll_limit || 24);
      setRevealAt(w.reveal_at.substring(0, 16));
      setCoupleUpiId(w.couple_upi_id || 'aadarsh.shivani@okhdfcbank');
      setPartner1Phone(w.partner_1_phone || '+91 98765 43210');
      setPartner2Phone(w.partner_2_phone || '+91 98123 45678');
      setCoupleUpiQrUrl(w.couple_upi_qr_url || '');
      setActivationCodeInput(w.activation_code || '');

      // Generate preview of couple's UPI QR code
      const upiString = `upi://pay?pa=${w.couple_upi_id || 'aadarsh.shivani@okhdfcbank'}&pn=${encodeURIComponent(
        `${w.partner_1_name} & ${w.partner_2_name}`
      )}&cu=INR&tn=${encodeURIComponent('Wedding Shagun Blessing')}`;
      generateQRCodeDataUrl(upiString, { width: 300 }).then(setGeneratedUpiQr);
    }
  }, []);

  const handleUpiIdChange = (id: string) => {
    setCoupleUpiId(id);
    if (wedding && id.includes('@')) {
      const upiString = `upi://pay?pa=${id}&pn=${encodeURIComponent(
        `${wedding.partner_1_name} & ${wedding.partner_2_name}`
      )}&cu=INR&tn=${encodeURIComponent('Wedding Shagun Blessing')}`;
      generateQRCodeDataUrl(upiString, { width: 300 }).then(setGeneratedUpiQr);
    }
  };

  const handleClaimActivationPass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wedding || !activationCodeInput.trim()) return;

    const res = mockStore.claimActivationPass(activationCodeInput.trim(), wedding.id);
    setActivationMsg({ text: res.message, success: res.success });

    if (res.success) {
      const updated = mockStore.getWeddingById(wedding.id);
      if (updated) setWedding({ ...updated });
    }
    setTimeout(() => setActivationMsg(null), 4000);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wedding) return;

    const updated = mockStore.saveWedding({
      id: wedding.id,
      owner_id: wedding.owner_id,
      default_roll_limit: Number(rollLimit),
      reveal_at: new Date(revealAt).toISOString(),
      couple_upi_id: coupleUpiId,
      partner_1_phone: partner1Phone,
      partner_2_phone: partner2Phone,
      couple_upi_qr_url: coupleUpiQrUrl || null,
    });

    setWedding(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleCopyCurrentCode = () => {
    if (wedding?.activation_code) {
      navigator.clipboard.writeText(wedding.activation_code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-serif font-bold text-maroon-950">Settings &amp; Payout Setup</h1>
        <p className="mt-1 text-sm text-gray-600">
          Set up your personal UPI QR, registered phone numbers (zero redirection to platform), and 30-day activation pass.
        </p>
      </div>

      {/* 30-Day Activation Pass Card */}
      <Card className="p-6 border-2 border-emerald-300 bg-white shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-900 mt-0.5">
              <KeyRound className="w-6 h-6 text-emerald-700" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-serif font-bold text-maroon-950">
                  30-Day Wedding Pass &bull; Active
                </h3>
                <Badge variant="green">1 Couple Only</Badge>
              </div>
              <p className="text-xs text-gray-600 mt-0.5">
                Active for 30 consecutive days from purchase. Strictly single-couple access.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-[#FAF7F2] p-2.5 rounded-xl border border-emerald-200">
            <div>
              <span className="text-[10px] text-gray-500 uppercase tracking-wider block font-semibold">
                Your Activation Code:
              </span>
              <span className="font-mono text-sm font-bold text-emerald-950">
                {wedding?.activation_code || 'SHAGUN-7777-2026'}
              </span>
            </div>
            <Button
              type="button"
              onClick={handleCopyCurrentCode}
              variant="outline"
              size="sm"
              className="border-emerald-300 text-xs py-1 px-2.5 text-emerald-900"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            </Button>
          </div>
        </div>

        {/* Redeem / Renew Input */}
        <div className="pt-2 border-t border-emerald-100">
          <form onSubmit={handleClaimActivationPass} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <input
              type="text"
              value={activationCodeInput}
              onChange={(e) => setActivationCodeInput(e.target.value)}
              placeholder="Enter new 30-day activation code (e.g. SHAGUN-XXXX-30D)"
              className="px-3 py-2 rounded-xl border border-gray-300 text-xs font-mono flex-1 focus:outline-none focus:ring-2 focus:ring-emerald-700 uppercase"
            />
            <Button type="submit" variant="secondary" size="sm" className="text-xs">
              <span>Apply Activation Code</span>
            </Button>
            <Link href="/activate" target="_blank">
              <Button type="button" variant="outline" size="sm" className="text-xs border-amber-400">
                <span>Get New Pass &rarr;</span>
              </Button>
            </Link>
          </form>

          {activationMsg && (
            <div
              className={`mt-2 p-2.5 rounded-xl text-xs flex items-center gap-2 ${
                activationMsg.success
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              <InfoIcon className="w-4 h-4 flex-shrink-0" />
              <span>{activationMsg.text}</span>
            </div>
          )}
        </div>
      </Card>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Couple's Direct UPI & Registered Numbers */}
        <Card className="p-6 sm:p-8 border-2 border-amber-300 bg-white shadow-sm space-y-6">
          <div className="flex items-start justify-between border-b border-amber-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-amber-100 text-maroon-900">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-serif font-bold text-maroon-950">
                  Couple&apos;s Direct UPI &amp; Registered Numbers
                </h3>
                <p className="text-xs text-gray-600 mt-0.5">
                  100% of guest gifts settle directly into your personal UPI. Nothing is redirected to our platform.
                </p>
              </div>
            </div>
            <Badge variant="marigold">Direct Bank Settlement</Badge>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-950 space-y-1">
            <p className="font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              Zero Platform Intermediary Pledge
            </p>
            <p className="text-gray-700">
              When guests pay, money goes directly to your bank account via UPI intent or scanner QR. We never hold, touch, or charge gateway commissions on your Shagun.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Couple&apos;s Primary UPI ID (VPA) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. shivani.aadarsh@okhdfcbank or 9876543210@paytm"
                  value={coupleUpiId}
                  onChange={(e) => handleUpiIdChange(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-amber-300 bg-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-maroon-800"
                />
                <p className="text-[11px] text-gray-500 mt-1">
                  Google Pay, PhonePe, Paytm, or BHIM VPA linked to your wedding account.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Partner 1 Registered Mobile <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center rounded-xl border border-amber-300 bg-white px-3 py-2 text-sm">
                    <Smartphone className="w-4 h-4 text-gray-400 mr-1.5" />
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={partner1Phone}
                      onChange={(e) => setPartner1Phone(e.target.value)}
                      className="w-full bg-transparent focus:outline-none text-xs font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Partner 2 Registered Mobile <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center rounded-xl border border-amber-300 bg-white px-3 py-2 text-sm">
                    <Smartphone className="w-4 h-4 text-gray-400 mr-1.5" />
                    <input
                      type="tel"
                      required
                      placeholder="+91 98123 45678"
                      value={partner2Phone}
                      onChange={(e) => setPartner2Phone(e.target.value)}
                      className="w-full bg-transparent focus:outline-none text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Custom UPI QR Code Image URL (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://... (or leave blank to use auto-generated QR)"
                  value={coupleUpiQrUrl}
                  onChange={(e) => setCoupleUpiQrUrl(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-amber-300 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-maroon-800"
                />
                <p className="text-[11px] text-gray-500 mt-1">
                  Upload an image of your own PhonePe/GPay QR, or the system generates one automatically from your UPI ID below.
                </p>
              </div>
            </div>

            {/* QR Preview Box */}
            <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-[#FAF7F2] border-2 border-dashed border-amber-300 text-center">
              <span className="text-xs font-semibold text-maroon-950 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <QrCode className="w-4 h-4 text-maroon-800" />
                Live Guest Scanner Preview
              </span>

              {generatedUpiQr ? (
                <div className="p-3 bg-white rounded-2xl shadow-sm border border-amber-200">
                  <img
                    src={coupleUpiQrUrl || generatedUpiQr}
                    alt="Couple UPI QR Code"
                    className="w-40 h-40 object-contain"
                  />
                </div>
              ) : (
                <div className="w-40 h-40 bg-amber-50 rounded-2xl flex items-center justify-center text-xs text-gray-400">
                  Enter UPI ID to Preview
                </div>
              )}

              <p className="text-xs font-mono text-gray-700 font-semibold mt-3">
                {coupleUpiId || 'your-upi-id@bank'}
              </p>
              <p className="text-[10px] text-gray-500">
                Guests scan this exact QR to pay Shagun directly to your bank.
              </p>
            </div>
          </div>
        </Card>

        {/* Google Drive Status */}
        <Card className="p-6 border-2 border-amber-200">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-amber-100 text-amber-900">
                <HardDrive className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold text-maroon-950">Google Drive Memory Storage</h3>
                <p className="text-xs text-gray-600 mt-0.5">
                  Folder: <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono text-amber-900">Shagun – {wedding?.partner_1_name} &amp; {wedding?.partner_2_name}/</code>
                </p>
              </div>
            </div>
            <Badge variant="green">Connected (drive.file scope)</Badge>
          </div>

          <div className="mt-4 p-4 rounded-xl bg-ivory-50 border border-amber-200 text-xs text-gray-700 space-y-2">
            <div className="flex items-center gap-2 text-emerald-800 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Strict Permission Boundary Active</span>
            </div>
            <p>
              Shagun cannot read, view, or touch any of your personal Drive files. Photos taken by your guests will be placed directly into your private wedding folder using your encrypted token.
            </p>
          </div>
        </Card>

        {/* Disposable Camera Defaults */}
        <Card className="p-6 border-2 border-amber-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-2xl bg-yellow-100 text-yellow-900">
              <Camera className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-serif font-bold text-maroon-950">Disposable Camera Rules</h3>
              <p className="text-xs text-gray-600">Roll limits and morning-after reveal timing</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Roll Limit per Guest (Default: 24 shots)
              </label>
              <input
                type="number"
                min="5"
                max="50"
                value={rollLimit}
                onChange={(e) => setRollLimit(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-amber-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-maroon-800"
              />
              <p className="text-[11px] text-gray-500 mt-1">
                Guests cannot take photos once their roll limit is exhausted.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Morning-After Reveal Timestamp
              </label>
              <input
                type="datetime-local"
                value={revealAt}
                onChange={(e) => setRevealAt(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-amber-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-maroon-800"
              />
              <p className="text-[11px] text-gray-500 mt-1">
                Guests cannot view any taken photos until this moment.
              </p>
            </div>
          </div>
        </Card>

        <div className="flex items-center justify-between pt-4">
          {savedSuccess ? (
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-100 px-3 py-1.5 rounded-full inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Settings updated successfully</span>
            </span>
          ) : (
            <span />
          )}

          <Button type="submit" variant="primary" size="md" className="gap-2">
            <Save className="w-4 h-4" />
            <span>Save All Settings</span>
          </Button>
        </div>
      </form>
    </div>
  );
}

function InfoIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
    </svg>
  );
}
