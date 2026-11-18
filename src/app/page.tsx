'use client';

import React from 'react';
import Link from 'next/link';
import {
  Heart,
  Gift,
  Camera,
  BookOpenCheck,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  QrCode,
  CheckCircle2,
  KeyRound,
  Calendar,
  Compass,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { PlatformActivationCard } from '@/components/activation/PlatformActivationCard';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] text-gray-900 selection:bg-amber-200">
      {/* Navigation Header */}
      <header className="border-b border-amber-200/80 bg-white/95 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-maroon-900 flex items-center justify-center text-amber-300 shadow-sm">
              <Heart className="w-5 h-5 fill-amber-300" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-2xl font-bold tracking-tight text-maroon-950 leading-none">Shagun</span>
              <span className="text-[10px] tracking-wider uppercase text-amber-800 font-medium">Weddings &amp; Memories</span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link href="/w/aadarsh-and-shivani" target="_blank">
              <Button variant="ghost" size="sm" className="hidden sm:inline-flex text-xs text-maroon-900 hover:bg-amber-100/60">
                <span>View Aadarsh &amp; Shivani&apos;s Wedding</span>
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="primary" size="sm" className="text-xs bg-maroon-900 hover:bg-maroon-950 text-amber-100">
                <span>Couple Dashboard &rarr;</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-24 px-4 sm:px-6 lg:px-8 text-center bg-gradient-to-b from-amber-50/60 via-[#FAF7F2] to-[#FAF7F2]">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100/80 border border-amber-300/80 text-maroon-900 text-xs font-semibold tracking-wide shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>Inclusive &bull; Multi-Faith &bull; Pure Hospitality</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-bold text-maroon-950 tracking-tight leading-tight">
            Cherish Every Blessing, <br className="hidden sm:inline" />
            <span className="text-maroon-800 italic font-normal">Across Every Faith &amp; Tradition.</span>
          </h1>

          <p className="text-base sm:text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed font-sans">
            Whether a Hindu wedding, Muslim Nikah &amp; Walima, Christian Holy Matrimony, Sikh Anand Karaj, or contemporary interfaith celebration—give your guests a warm, dignifying way to share blessings, contribute via UPI, and snap vintage 24-shot venue memories.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth/login" className="w-full sm:w-auto">
              <Button variant="primary" size="lg" className="w-full sm:w-auto gap-2 text-base px-8 py-3.5 bg-maroon-900 hover:bg-maroon-950 text-amber-100 shadow-md">
                <span>Create Your Wedding Page</span>
                <ArrowRight className="w-4 h-4 text-amber-300" />
              </Button>
            </Link>
            <Link href="/w/aadarsh-and-shivani" target="_blank" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto gap-2 text-base px-8 py-3.5 border-amber-300 text-maroon-950 hover:bg-amber-100/50">
                <span>Preview Guest Portal</span>
              </Button>
            </Link>
          </div>

          {/* Key Value Badges */}
          <div className="pt-6 flex flex-wrap justify-center items-center gap-6 text-xs text-gray-700 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>No Guest App or Login Needed</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>Direct UPI to Couple&apos;s Bank</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>Private Google Drive Photo Safe</span>
            </span>
            <span className="flex items-center gap-1.5">
              <KeyRound className="w-4 h-4 text-amber-700" />
              <span>30-Day Active Celebration Pass</span>
            </span>
          </div>
        </div>
      </section>

      {/* Multi-Faith Inclusivity Strip */}
      <section className="border-y border-amber-200/80 bg-white py-8 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center">
              <Compass className="w-5 h-5 text-amber-800" />
            </div>
            <div>
              <p className="font-serif font-bold text-maroon-950 text-base">Customized Ceremonies for Every Faith</p>
              <p className="text-xs text-gray-600">Tailored ceremony itineraries and greetings celebrating India&apos;s rich cultural tapestry.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 text-xs font-medium text-maroon-900">
            <span className="px-3 py-1 bg-amber-50 border border-amber-200 rounded-full">Universal &amp; Interfaith</span>
            <span className="px-3 py-1 bg-amber-50 border border-amber-200 rounded-full">Nikah &amp; Walima (Muslim)</span>
            <span className="px-3 py-1 bg-amber-50 border border-amber-200 rounded-full">Holy Matrimony (Christian)</span>
            <span className="px-3 py-1 bg-amber-50 border border-amber-200 rounded-full">Anand Karaj (Sikh)</span>
            <span className="px-3 py-1 bg-amber-50 border border-amber-200 rounded-full">Sangeet &amp; Vows (Hindu)</span>
          </div>
        </div>
      </section>

      {/* 3 Pillars Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
          <Badge variant="marigold">Bespoke Hospitality</Badge>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-maroon-950">
            A Thoughtful Suite for Your Wedding
          </h2>
          <p className="text-sm text-gray-600">
            Designed to replace awkward paper envelopes, scrambled photo sharing, and lost blessings with timeless grace.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Pillar 1 */}
          <Card className="p-8 border border-amber-200/90 hover:border-amber-300 transition-all shadow-sm bg-white">
            <div className="w-12 h-12 rounded-xl bg-amber-100/70 flex items-center justify-center text-maroon-900 mb-6">
              <Gift className="w-6 h-6 text-maroon-900" />
            </div>
            <h3 className="text-xl font-serif font-bold text-maroon-950 mb-2">
              1. Milestone Gift Funds
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-6 font-sans">
              Create 1 to 6 meaningful goals: Honeymoon, home foundation, or community blessings. Guests select auspicious shagun amounts (₹501, ₹1,100, ₹2,100, ₹5,100 or custom) and pay effortlessly via UPI.
            </p>
            <div className="p-3 rounded-lg bg-amber-50/70 border border-amber-200 text-xs text-maroon-950 space-y-1">
              <p>&bull; Warm wording: &quot;Blessings &amp; Duas&quot;</p>
              <p>&bull; Zero app balance held &bull; Optional hidden amounts</p>
            </div>
          </Card>

          {/* Pillar 2 */}
          <Card className="p-8 border border-amber-200/90 hover:border-amber-300 transition-all shadow-sm bg-white">
            <div className="w-12 h-12 rounded-xl bg-rose-100/70 flex items-center justify-center text-maroon-900 mb-6">
              <BookOpenCheck className="w-6 h-6 text-maroon-900" />
            </div>
            <h3 className="text-xl font-serif font-bold text-maroon-950 mb-2">
              2. Unified Shagun Ledger
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-6 font-sans">
              Say goodbye to misplaced cash envelopes and messy handwritten diaries. Combine digital UPI contributions with manual offline entries for cash and gold gifts. Export clean CSVs and generate thank-you lists in one click.
            </p>
            <div className="p-3 rounded-lg bg-amber-50/70 border border-amber-200 text-xs text-maroon-950 space-y-1">
              <p>&bull; Complete digital + offline family record</p>
              <p>&bull; Instant thank-you message generation</p>
            </div>
          </Card>

          {/* Pillar 3 */}
          <Card className="p-8 border border-amber-200/90 hover:border-amber-300 transition-all shadow-sm bg-white">
            <div className="w-12 h-12 rounded-xl bg-yellow-100/70 flex items-center justify-center text-maroon-900 mb-6">
              <Camera className="w-6 h-6 text-maroon-900" />
            </div>
            <h3 className="text-xl font-serif font-bold text-maroon-950 mb-2">
              3. 24-Shot Venue Camera
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-6 font-sans">
              Guests scan a QR code at banquet tables to open a vintage disposable camera right in their phone browser. 24 shots per guest, warm film grain, and an anticipation-building reveal the following morning.
            </p>
            <div className="p-3 rounded-lg bg-amber-50/70 border border-amber-200 text-xs text-maroon-950 space-y-1">
              <p>&bull; Streamed to your personal Google Drive</p>
              <p>&bull; Offline queue handles weak venue networks</p>
            </div>
          </Card>
        </div>
      </section>

      {/* Platform Activation & Scanner QR Section */}
      <section id="activate" className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <Badge variant="marigold">Platform Activation Pass</Badge>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-maroon-950">
            Get Your 30-Day Wedding Pass
          </h2>
          <p className="text-sm text-gray-600">
            Scan our platform scanner QR code to unlock your 30-day wedding suite. Each pass is strictly for 1 couple only and allows linking your own personal UPI QR &amp; numbers so nothing is redirected to us.
          </p>
        </div>

        <PlatformActivationCard />
      </section>

      {/* Activation Pass & Privacy Section */}
      <section className="bg-maroon-950 text-white py-16 px-4 sm:px-6 lg:px-8 border-t border-amber-500/30">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex p-3 rounded-2xl bg-amber-400/20 text-amber-300">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-amber-100">
            Your Memories, Kept In Your Hands
          </h2>
          <p className="text-sm sm:text-base text-amber-200/80 leading-relaxed max-w-2xl mx-auto">
            Every wedding receives a unique 30-day Activation Code upon setup (active for 30 days of festivities, photo collecting, and thank-yous). We only use the minimal <code className="bg-maroon-900 text-amber-200 px-2 py-0.5 rounded font-mono text-xs">drive.file</code> scope for Google Drive, ensuring we never have access to any other files.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/privacy">
              <Button variant="outline" size="md" className="border-amber-400 text-amber-200 hover:bg-maroon-900">
                <span>Plain-Language Privacy Policy</span>
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="primary" size="md" className="bg-amber-400 hover:bg-amber-300 text-maroon-950 font-semibold">
                <span>Start Your Wedding Journey</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-amber-200 py-10 px-4 text-center text-xs text-gray-500 space-y-2">
        <p className="font-serif font-bold text-maroon-950 text-sm">Shagun &bull; Wedding Gifting &amp; Memories Platform</p>
        <p>Celebrating all faiths, traditions, and families across India. Handcrafted with reverence.</p>
        <div className="pt-2 flex justify-center gap-4 text-gray-400">
          <Link href="/privacy" className="hover:text-maroon-900">Privacy Policy</Link>
          <span>&bull;</span>
          <Link href="/auth/login" className="hover:text-maroon-900">Couple Login</Link>
          <span>&bull;</span>
          <Link href="/w/aadarsh-and-shivani" className="hover:text-maroon-900">Sample Wedding (Aadarsh &amp; Shivani)</Link>
        </div>
      </footer>
    </div>
  );
}
