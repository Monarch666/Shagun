'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { useParams, useRouter } from 'next/navigation';
import {
  Heart,
  Calendar,
  MapPin,
  Clock,
  Camera,
  Gift,
  ExternalLink,
  Sparkles,
  MessageSquare,
  CheckCircle2,
  Users,
  Send,
  ShieldCheck,
  ChevronDown,
  QrCode,
  Smartphone,
  Copy,
  Check,
  ArrowLeft,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { mockStore } from '@/lib/supabase/mock-store';
import { Wedding, WeddingEvent, Fund, Contribution } from '@/lib/supabase/types';
import { formatINR, AUSPICIOUS_AMOUNTS } from '@/lib/utils/currency';
import { generateQRCodeDataUrl } from '@/lib/utils/qr';
import { LanguageToggle, LocaleCode } from '@/components/guest/LanguageToggle';
import enMessages from '@/i18n/messages/en.json';
import hiMessages from '@/i18n/messages/hi.json';
import mrMessages from '@/i18n/messages/mr.json';

const dictionaries = {
  en: enMessages,
  hi: hiMessages,
  mr: mrMessages,
};

export default function GuestWeddingPortalPage() {
  const params = useParams();
  const slug = params?.slug as string || 'aadarsh-and-shivani';

  const [wedding, setWedding] = useState<Wedding | null>(() => mockStore.getWeddingBySlug(slug) || mockStore.getWeddingById('wed-001') || null);
  const [events, setEvents] = useState<WeddingEvent[]>(() => {
    const w = mockStore.getWeddingBySlug(slug) || mockStore.getWeddingById('wed-001');
    return w ? mockStore.getEvents(w.id) : [];
  });
  const [funds, setFunds] = useState<Fund[]>(() => {
    const w = mockStore.getWeddingBySlug(slug) || mockStore.getWeddingById('wed-001');
    return w ? mockStore.getFunds(w.id).filter((f) => f.status === 'active') : [];
  });
  const [blessings, setBlessings] = useState<Contribution[]>(() => {
    const w = mockStore.getWeddingBySlug(slug) || mockStore.getWeddingById('wed-001');
    return w ? mockStore.getContributions(w.id) : [];
  });

  const [locale, setLocale] = useState<LocaleCode>('en');
  const t = dictionaries[locale] || dictionaries.en;

  // Contribution Modal State (Direct Couple UPI & Zero Intermediary)
  const [selectedFund, setSelectedFund] = useState<Fund | null>(null);
  const [isContributeModalOpen, setIsContributeModalOpen] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'details' | 'direct_upi'>('details');
  const [selectedAmount, setSelectedAmount] = useState<number>(2100);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [guestName, setGuestName] = useState<string>('');
  const [blessingMessage, setBlessingMessage] = useState<string>('');
  const [isAmountHidden, setIsAmountHidden] = useState<boolean>(false);
  const [directUpiQrUrl, setDirectUpiQrUrl] = useState<string>('');
  const [copiedUpiId, setCopiedUpiId] = useState<boolean>(false);
  const [guestUtr, setGuestUtr] = useState<string>('');

  const router = useRouter();
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);

  // RSVP State
  const [rsvpName, setRsvpName] = useState('');
  const [rsvpPhone, setRsvpPhone] = useState('');
  const [rsvpCount, setRsvpCount] = useState(1);
  const [rsvpDietary, setRsvpDietary] = useState('');
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);

  useEffect(() => {
    const w = mockStore.getWeddingBySlug(slug) || mockStore.getWeddingById('wed-001');
    if (w) {
      setWedding(w);
      setEvents(mockStore.getEvents(w.id));
      setFunds(mockStore.getFunds(w.id).filter((f) => f.status === 'active'));
      setBlessings(mockStore.getContributions(w.id));
    }
  }, [slug]);

  const handleOpenContribute = (fund?: Fund) => {
    setSelectedFund(fund || funds[0] || null);
    setPaymentStep('details');
    setGuestUtr('');
    setIsContributeModalOpen(true);
  };

  const handleProceedToDirectUpi = () => {
    if (!guestName.trim()) {
      alert('Please enter your name so the couple knows who blessed them.');
      return;
    }
    if (!selectedAmount || selectedAmount <= 0) {
      alert('Please select or enter a valid Shagun amount.');
      return;
    }
    if (!wedding) return;

    // Generate dynamic NPCI UPI QR for the couple's personal UPI ID
    const upiId = wedding.couple_upi_id || 'aadarsh.shivani@okhdfcbank';
    const coupleNames = `${wedding.partner_1_name} & ${wedding.partner_2_name}`;
    const upiString = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(coupleNames)}&am=${selectedAmount}&cu=INR&tn=${encodeURIComponent(`Shagun: ${selectedFund?.title || 'Wedding Blessing'}`)}`;

    generateQRCodeDataUrl(upiString, { width: 350 }).then(setDirectUpiQrUrl);
    setPaymentStep('direct_upi');
  };

  const handleConfirmDirectUpiPaid = () => {
    if (!wedding) return;
    setIsPaymentProcessing(true);

    try {
      mockStore.recordCapturedContribution({
        wedding_id: wedding.id,
        fund_id: selectedFund?.id || null,
        guest_name: guestName.trim(),
        amount: selectedAmount,
        blessing_message: blessingMessage.trim() || (guestUtr ? `Direct UPI Payment (Ref: ${guestUtr})` : 'Direct UPI Shagun Blessing'),
        is_amount_hidden: isAmountHidden,
        razorpay_order_id: `upi_direct_${Date.now()}`,
        razorpay_payment_id: guestUtr ? `upi_utr_${guestUtr.trim()}` : `upi_pay_${Date.now()}`,
      });

      router.push(
        `/w/${slug}/thank-you?name=${encodeURIComponent(guestName.trim())}&amount=${selectedAmount}&fund=${encodeURIComponent(selectedFund?.title || 'Wedding Shagun')}`
      );
    } catch (err) {
      console.error('Error confirming payment:', err);
      setIsPaymentProcessing(false);
    }
  };

  const handleCopyUpiId = () => {
    const upiId = wedding?.couple_upi_id || 'aadarsh.shivani@okhdfcbank';
    navigator.clipboard.writeText(upiId);
    setCopiedUpiId(true);
    setTimeout(() => setCopiedUpiId(false), 2000);
  };

  const handleProceedToPayment = async () => {
    if (!guestName.trim()) {
      alert('Please enter your name so the couple knows who blessed them.');
      return;
    }
    if (!selectedAmount || selectedAmount <= 0) {
      alert('Please enter a valid Shagun amount.');
      return;
    }
    if (!wedding) return;

    setIsPaymentProcessing(true);

    try {
      // 1. Call server to create Razorpay Order
      const res = await fetch('/api/razorpay/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          weddingId: wedding.id,
          fundId: selectedFund?.id || null,
          amount: selectedAmount,
          guestName: guestName.trim(),
          blessingMessage: blessingMessage.trim(),
          isAmountHidden,
        }),
      });

      const orderData = await res.json();
      if (!res.ok || !orderData.success) {
        throw new Error(orderData.error || 'Failed to create payment order');
      }

      // 2. Check if live Razorpay script is present on window
      if (typeof window !== 'undefined' && (window as any).Razorpay && !orderData.isMock) {
        const rzp = new (window as any).Razorpay({
          key: orderData.keyId,
          amount: orderData.amount,
          currency: 'INR',
          name: `${wedding.partner_1_name} & ${wedding.partner_2_name}`,
          description: selectedFund ? `Shagun: ${selectedFund.title}` : 'Wedding Shagun & Blessing',
          order_id: orderData.orderId,
          prefill: {
            name: guestName.trim(),
          },
          theme: {
            color: '#881337', // Royal Maroon
          },
          handler: async () => {
            router.push(
              `/w/${slug}/thank-you?name=${encodeURIComponent(guestName.trim())}&amount=${selectedAmount}&fund=${encodeURIComponent(selectedFund?.title || 'Wedding Shagun')}`
            );
          },
          modal: {
            ondismiss: () => {
              setIsPaymentProcessing(false);
            },
          },
        });
        rzp.open();
      } else {
        // 3. Test mode / Demo simulation: Trigger webhook simulation for seamless local testing
        await fetch('/api/razorpay/webhook', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-razorpay-signature': 'mock_valid_signature',
          },
          body: JSON.stringify({
            event: 'payment.captured',
            payload: {
              payment: {
                entity: {
                  id: `pay_test_${Date.now()}`,
                  order_id: orderData.orderId,
                  amount: selectedAmount * 100,
                  notes: {
                    weddingId: wedding.id,
                    fundId: selectedFund?.id || null,
                    guestName: guestName.trim(),
                    blessingMessage: blessingMessage.trim(),
                  },
                },
              },
            },
          }),
        });

        router.push(
          `/w/${slug}/thank-you?name=${encodeURIComponent(guestName.trim())}&amount=${selectedAmount}&fund=${encodeURIComponent(selectedFund?.title || 'Wedding Shagun')}`
        );
      }
    } catch (err: any) {
      console.error('Payment initiation error:', err);
      alert(err?.message || 'Payment initiation failed. Please try again.');
      setIsPaymentProcessing(false);
    }
  };

  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wedding) return;

    mockStore.saveRsvp({
      wedding_id: wedding.id,
      guest_name: rsvpName,
      phone: rsvpPhone,
      attendee_count: Number(rsvpCount),
      attendance_status: 'attending',
      dietary_or_notes: rsvpDietary,
    });

    setRsvpSubmitted(true);
  };

  if (!wedding) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ivory-100">
        <div className="text-center p-8">
          <Heart className="w-12 h-12 text-maroon-900 mx-auto animate-pulse mb-4" />
          <h2 className="text-xl font-serif font-bold text-maroon-950">Loading Wedding Celebration...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory-100 selection:bg-marigold-200">
      {/* Top Floating Shagun & Camera Quick Bar */}
      <div className="sticky top-0 z-30 bg-maroon-950/95 backdrop-blur-md text-amber-100 px-4 py-3 shadow-md border-b border-amber-400/40">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-amber-200 text-sm sm:text-base tracking-wide">
              {wedding.partner_1_name} &amp; {wedding.partner_2_name}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <LanguageToggle onLanguageChange={(loc) => setLocale(loc)} />
            <Link href={`/w/${slug}/camera`}>
              <Button variant="secondary" size="sm" className="gap-1.5 py-1.5 px-3 text-xs">
                <Camera className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t.guestPortal.openCamera}</span>
                <span className="sm:hidden">{t.common.venueCamera}</span>
              </Button>
            </Link>
            <Button
              onClick={() => handleOpenContribute()}
              variant="gold"
              size="sm"
              className="gap-1.5 py-1.5 px-3 text-xs"
            >
              <Heart className="w-3.5 h-3.5 fill-maroon-950" />
              <span>{t.guestPortal.sendShagun}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-maroon-950 via-maroon-900 to-maroon-950 text-white pt-16 pb-20 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none indian-pattern-bg" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-300/40 text-xs font-semibold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Wedding Celebration</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-serif font-bold tracking-tight text-amber-100">
            {wedding.partner_1_name} <span className="text-amber-300 font-light">&amp;</span> {wedding.partner_2_name}
          </h1>

          <p className="text-base sm:text-lg text-amber-200/90 font-light">
            {wedding.city} &bull;{' '}
            {new Date(wedding.wedding_date).toLocaleDateString('en-IN', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>

          <p className="text-sm sm:text-base text-gray-200 max-w-xl mx-auto italic font-serif leading-relaxed pt-2">
            &ldquo;{wedding.welcome_message}&rdquo;
          </p>

          {/* Quick jump anchor links */}
          <div className="pt-6 flex flex-wrap justify-center gap-2 text-xs">
            <a href="#funds" className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-amber-200 border border-white/20 transition-colors">
              Blessings &amp; Shagun
            </a>
            <a href="#events" className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-amber-200 border border-white/20 transition-colors">
              Schedule &amp; Venues
            </a>
            <a href="#camera" className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-amber-200 border border-white/20 transition-colors">
              Venue Camera
            </a>
            <a href="#blessings" className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-amber-200 border border-white/20 transition-colors">
              Blessing Wall
            </a>
            <a href="#rsvp" className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-amber-200 border border-white/20 transition-colors">
              RSVP
            </a>
          </div>
        </div>
      </section>

      {/* Main Content Sections */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-16">
        {/* Section 1: Milestone Gift Funds */}
        <section id="funds" className="space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex p-2.5 rounded-full bg-amber-100 text-maroon-900 mb-1">
              <Gift className="w-6 h-6" />
            </div>
            <h2 className="text-3xl font-serif font-bold text-maroon-950">Blessings &amp; Shagun</h2>
            <p className="text-sm text-gray-600 max-w-lg mx-auto">
              Your love and presence are our greatest gifts. For those wishing to honor us with traditional Shagun, we have created these milestone dreams for our new beginning.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {funds.map((fund) => {
              const progressPercent = fund.target_amount
                ? Math.min(100, Math.round((fund.received_amount / fund.target_amount) * 100))
                : null;

              return (
                <Card key={fund.id} className="flex flex-col justify-between overflow-hidden border-2 border-amber-200 hover:border-amber-400 transition-all shadow-md">
                  <div>
                    <div className="relative h-44 w-full bg-gray-100">
                      {fund.cover_image_url ? (
                        <img
                          src={fund.cover_image_url}
                          alt={fund.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-amber-100 text-maroon-900">
                          <Gift className="w-12 h-12 opacity-30" />
                        </div>
                      )}
                      {fund.is_group_gift && (
                        <div className="absolute top-3 left-3">
                          <Badge variant="marigold" size="sm">
                            Group Gift
                          </Badge>
                        </div>
                      )}
                    </div>

                    <div className="p-5">
                      <h3 className="font-serif text-lg font-bold text-maroon-950 mb-1">{fund.title}</h3>
                      {fund.description && (
                        <p className="text-xs text-gray-600 line-clamp-3 mb-4">{fund.description}</p>
                      )}

                      {/* Progress bar */}
                      {fund.target_amount && !fund.is_amount_hidden && (
                        <div className="space-y-1.5 mb-4">
                          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-marigold-500 to-maroon-800 h-2 rounded-full"
                              style={{ width: `${progressPercent}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-[11px] text-gray-500">
                            <span>{progressPercent}% blessed</span>
                            <span>Target: {formatINR(fund.target_amount)}</span>
                          </div>
                        </div>
                      )}

                      <div className="text-xs text-marigold-800 font-medium">
                        {fund.contributor_count} guests blessed this milestone
                      </div>
                    </div>
                  </div>

                  <div className="p-5 pt-0">
                    <Button
                      onClick={() => handleOpenContribute(fund)}
                      variant="primary"
                      size="md"
                      className="w-full gap-2 text-sm"
                    >
                      <Heart className="w-4 h-4 fill-amber-300 text-amber-300" />
                      <span>Give Shagun Blessing</span>
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Section 2: Venue Disposable Camera Standee Banner */}
        <section id="camera">
          <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white p-8 rounded-3xl border-4 border-amber-400 shadow-2xl relative overflow-hidden">
            <div className="max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-300/40 text-xs font-semibold uppercase tracking-wider">
                <Camera className="w-3.5 h-3.5" />
                <span>Venue Disposable Camera</span>
              </div>
              <h2 className="text-3xl font-serif font-bold text-amber-100">
                Capture the Wedding Through Your Eyes
              </h2>
              <p className="text-sm text-gray-300 leading-relaxed">
                Take candid moments at the venue! You have a <strong>24-shot limited roll</strong> with a retro 90s film filter. Photos develop the next morning at 10:00 AM.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link href={`/w/${slug}/camera`}>
                  <Button variant="gold" size="lg" className="gap-2">
                    <Camera className="w-5 h-5 text-maroon-950" />
                    <span>Open Camera (No App Needed)</span>
                  </Button>
                </Link>
                <Link href={`/w/${slug}/gallery`}>
                  <Button variant="outline" size="lg" className="border-gray-500 text-gray-200 hover:bg-gray-800">
                    <span>Morning-After Gallery</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Celebrations Itinerary */}
        <section id="events" className="space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex p-2.5 rounded-full bg-rose-100 text-maroon-900 mb-1">
              <Calendar className="w-6 h-6" />
            </div>
            <h2 className="text-3xl font-serif font-bold text-maroon-950">Celebrations Itinerary</h2>
            <p className="text-sm text-gray-600 max-w-lg mx-auto">
              Join us across each ceremony as we tie the knot. Venue addresses and navigation links below.
            </p>
          </div>

          <div className="space-y-4">
            {events.map((evt, idx) => (
              <Card key={evt.id} className="p-6 border-2 border-amber-200/80 hover:border-amber-400 transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-maroon-900 text-amber-200 font-serif font-bold text-lg flex items-center justify-center flex-shrink-0">
                      {idx + 1}
                    </div>
                    <div>
                      <h3 className="text-xl font-serif font-bold text-maroon-950">{evt.name}</h3>
                      <div className="mt-1 flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-gray-600">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-marigold-600" />
                          {new Date(evt.start_time).toLocaleDateString('en-IN', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                          })}{' '}
                          &bull;{' '}
                          {new Date(evt.start_time).toLocaleTimeString('en-IN', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-maroon-800" />
                          {evt.venue_name}
                        </span>
                      </div>
                      {evt.venue_address && (
                        <p className="text-xs text-gray-500 mt-1 pl-0.5">{evt.venue_address}</p>
                      )}
                    </div>
                  </div>

                  {evt.maps_url && (
                    <a
                      href={evt.maps_url}
                      target="_blank"
                      rel="noreferrer"
                      className="self-start sm:self-center"
                    >
                      <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>Navigate Maps</span>
                      </Button>
                    </a>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Section 4: Live Blessing Wall */}
        <section id="blessings" className="space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex p-2.5 rounded-full bg-yellow-100 text-yellow-900 mb-1">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h2 className="text-3xl font-serif font-bold text-maroon-950">Blessing Wall</h2>
            <p className="text-sm text-gray-600 max-w-lg mx-auto">
              Heartfelt wishes and blessings shared by family and friends.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {blessings.map((b) => (
              <Card key={b.id} className="p-5 border-2 border-amber-200/80 bg-white">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{b.guest_name}</h4>
                  <span className="text-[11px] text-gray-400">
                    {new Date(b.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
                {b.blessing_message && (
                  <p className="text-xs text-gray-700 italic font-serif leading-relaxed bg-ivory-50 p-3 rounded-xl border border-amber-100">
                    &ldquo;{b.blessing_message}&rdquo;
                  </p>
                )}
              </Card>
            ))}
          </div>
        </section>

        {/* Section 5: RSVP Form */}
        <section id="rsvp" className="space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex p-2.5 rounded-full bg-emerald-100 text-emerald-900 mb-1">
              <Users className="w-6 h-6" />
            </div>
            <h2 className="text-3xl font-serif font-bold text-maroon-950">RSVP &amp; Presence</h2>
            <p className="text-sm text-gray-600 max-w-lg mx-auto">
              Kindly confirm your attendance so we can welcome your family with utmost hospitality.
            </p>
          </div>

          <Card className="max-w-xl mx-auto p-6 sm:p-8 border-2 border-amber-300">
            {rsvpSubmitted ? (
              <div className="text-center py-6 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h3 className="text-xl font-serif font-bold text-maroon-950">Thank you for RSVPing!</h3>
                <p className="text-sm text-gray-600">
                  We look forward to celebrating together with you.
                </p>
              </div>
            ) : (
              <form onSubmit={handleRsvpSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    Your Full Name / Family Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh &amp; Sunita Gupta"
                    value={rsvpName}
                    onChange={(e) => setRsvpName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-amber-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-maroon-800"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                      Phone / WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={rsvpPhone}
                      onChange={(e) => setRsvpPhone(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-amber-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-maroon-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                      Number of Guests Attending
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      required
                      value={rsvpCount}
                      onChange={(e) => setRsvpCount(Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-xl border border-amber-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-maroon-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    Dietary Requirements or Note for the Couple
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Jain food / arrival on 18th morning"
                    value={rsvpDietary}
                    onChange={(e) => setRsvpDietary(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-amber-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-maroon-800"
                  />
                </div>

                <Button type="submit" variant="primary" size="lg" className="w-full gap-2">
                  <Send className="w-4 h-4" />
                  <span>Confirm RSVP</span>
                </Button>
              </form>
            )}
          </Card>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-maroon-950 text-amber-200/80 py-10 px-4 text-center text-xs space-y-2 border-t border-amber-400/30">
        <p className="font-serif text-amber-100 text-sm">
          {wedding.partner_1_name} &amp; {wedding.partner_2_name}&apos;s Wedding Celebration
        </p>
        <p>Created with Shagun &bull; Private, Respectful &amp; Secure</p>
        <div className="pt-2 flex justify-center gap-4 text-amber-300/60">
          <Link href="/privacy" className="hover:underline">Privacy Guarantee</Link>
          <span>&bull;</span>
          <Link href="/auth/login" className="hover:underline">Couple Login</Link>
        </div>
      </footer>

      {/* Shagun Blessing Modal (Phase 1 preview & Phase 2 preparation) */}
      <Modal
        isOpen={isContributeModalOpen}
        onClose={() => setIsContributeModalOpen(false)}
        title="Blessings &amp; Shagun"
        subtitle={selectedFund ? `Milestone: ${selectedFund.title}` : 'Send heartfelt blessings'}
      >
        {paymentStep === 'details' ? (
          <div className="space-y-5">
            {/* Auspicious Denominations Chips */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                Select Shagun Amount
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {AUSPICIOUS_AMOUNTS.slice(0, 4).map((chip) => (
                  <button
                    key={chip.value}
                    type="button"
                    onClick={() => {
                      setSelectedAmount(chip.value);
                      setCustomAmount('');
                    }}
                    className={`py-2.5 px-3 rounded-xl border text-sm font-semibold transition-all ${
                      selectedAmount === chip.value && !customAmount
                        ? 'border-maroon-900 bg-maroon-900 text-amber-100 shadow-sm'
                        : 'border-amber-300 bg-white text-gray-800 hover:bg-amber-50'
                    }`}
                  >
                    <div>{chip.label}</div>
                    <div className="text-[10px] opacity-75 font-normal">{chip.meaning}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Or Custom Amount (₹)
              </label>
              <input
                type="number"
                placeholder="e.g. 5100 or 11000"
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value);
                  if (e.target.value) {
                    setSelectedAmount(Number(e.target.value));
                  }
                }}
                className="w-full px-4 py-2.5 rounded-xl border border-amber-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-maroon-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Your Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Sharma Family / Rohan (Friend)"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-amber-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-maroon-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Heartfelt Blessing / Wish
              </label>
              <textarea
                rows={2}
                placeholder="May your journey together be blessed with endless happiness and love..."
                value={blessingMessage}
                onChange={(e) => setBlessingMessage(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-amber-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-maroon-800"
              />
            </div>

            <label className="flex items-center gap-2 text-xs font-medium text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={isAmountHidden}
                onChange={(e) => setIsAmountHidden(e.target.checked)}
                className="rounded text-maroon-800 focus:ring-maroon-800 h-4 w-4"
              />
              <span>Hide my contribution amount on the public blessing wall</span>
            </label>

            <div className="pt-2">
              <Button
                onClick={handleProceedToDirectUpi}
                variant="gold"
                size="lg"
                className="w-full gap-2 text-base font-bold shadow-md"
              >
                <Heart className="w-5 h-5 fill-maroon-950" />
                <span>Pay {formatINR(selectedAmount)} via Direct Couple UPI &rarr;</span>
              </Button>
              <p className="text-center text-[11px] text-gray-500 mt-2 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>100% direct bank transfer to couple &bull; Zero middleman</span>
              </p>
            </div>
          </div>
        ) : (
          /* Step 2: Direct Couple UPI QR, Verified Numbers & 1-Tap UPI Apps */
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-amber-100 pb-3">
              <button
                type="button"
                onClick={() => setPaymentStep('details')}
                className="inline-flex items-center gap-1.5 text-xs text-maroon-900 font-semibold hover:underline"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Change Amount or Name</span>
              </button>
              <Badge variant="marigold">Direct to Couple</Badge>
            </div>

            {/* Couple's Direct UPI QR Code */}
            <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-[#FAF7F2] border border-amber-300">
              <span className="text-xs font-bold uppercase tracking-wider text-maroon-950 mb-2 flex items-center gap-1.5">
                <QrCode className="w-4 h-4 text-maroon-800" />
                Scan with GPay / PhonePe / Paytm / BHIM
              </span>

              {directUpiQrUrl ? (
                <div className="p-3 bg-white rounded-2xl shadow-sm border border-amber-200">
                  <img
                    src={wedding.couple_upi_qr_url || directUpiQrUrl}
                    alt="Couple UPI QR Code"
                    className="w-44 h-44 object-contain"
                  />
                </div>
              ) : (
                <div className="w-44 h-44 bg-amber-50 rounded-2xl animate-pulse flex items-center justify-center text-xs text-gray-400">
                  Generating UPI QR...
                </div>
              )}

              {/* Couple's UPI ID with Copy Button */}
              <div className="mt-3 flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-amber-300 text-xs font-mono text-gray-800 shadow-xs">
                <span>{wedding.couple_upi_id || 'aadarsh.shivani@okhdfcbank'}</span>
                <button
                  type="button"
                  onClick={handleCopyUpiId}
                  className="text-maroon-900 hover:text-maroon-950 ml-1 p-0.5"
                  title="Copy UPI ID"
                >
                  {copiedUpiId ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <span className="text-[11px] text-gray-600 mt-1 font-semibold">
                Amount: {formatINR(selectedAmount)}
              </span>
            </div>

            {/* Verified Family Mobile Numbers */}
            <div className="bg-amber-50/80 p-3.5 rounded-2xl border border-amber-200 text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 text-maroon-950 font-semibold">
                <Smartphone className="w-4 h-4 text-maroon-800" />
                <span>Verified Family Mobile Numbers (Linked to UPI):</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-700 pl-1 font-mono text-[11px]">
                <div>
                  <span className="font-sans font-medium text-gray-500">{wedding.partner_1_name}: </span>
                  <span className="font-semibold text-gray-900">{wedding.partner_1_phone || '+91 98765 43210'}</span>
                </div>
                <div>
                  <span className="font-sans font-medium text-gray-500">{wedding.partner_2_name}: </span>
                  <span className="font-semibold text-gray-900">{wedding.partner_2_phone || '+91 98123 45678'}</span>
                </div>
              </div>
              <p className="text-[10px] text-emerald-800 font-sans pt-0.5">
                &bull; 100% direct bank transfer. No funds are touched or redirected to Shagun.
              </p>
            </div>

            {/* 1-Tap UPI Intent on Mobile */}
            <div>
              <a
                href={`upi://pay?pa=${wedding.couple_upi_id || 'aadarsh.shivani@okhdfcbank'}&pn=${encodeURIComponent(
                  `${wedding.partner_1_name} & ${wedding.partner_2_name}`
                )}&am=${selectedAmount}&cu=INR&tn=${encodeURIComponent(
                  `Shagun: ${selectedFund?.title || 'Wedding'}`
                )}`}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-amber-100 hover:bg-amber-200 text-maroon-950 text-xs font-semibold border border-amber-300 transition-colors"
              >
                <Smartphone className="w-4 h-4" />
                <span>Tap to Pay in Installed UPI App (PhonePe / GPay / Paytm)</span>
              </a>
            </div>

            {/* Optional UTR / Reference ID */}
            <div>
              <label className="block text-[11px] font-semibold text-gray-700 uppercase tracking-wider mb-1">
                UPI Reference No. / UTR (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. 432109876543 (from UPI confirmation)"
                value={guestUtr}
                onChange={(e) => setGuestUtr(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white text-xs font-mono focus:outline-none focus:ring-2 focus:ring-maroon-800"
              />
            </div>

            {/* Confirm Paid Button */}
            <div className="pt-2">
              <Button
                onClick={handleConfirmDirectUpiPaid}
                isLoading={isPaymentProcessing}
                variant="primary"
                size="lg"
                className="w-full gap-2 text-sm font-bold bg-maroon-900 hover:bg-maroon-950 text-amber-100 shadow-md py-3"
              >
                <Check className="w-4 h-4 text-emerald-400" />
                <span>I Have Sent {formatINR(selectedAmount)} via UPI &bull; Confirm Blessing</span>
              </Button>
              <p className="text-center text-[10px] text-gray-500 mt-2">
                Your blessing and name will be instantly recorded in {wedding.partner_1_name} &amp; {wedding.partner_2_name}&apos;s Shagun ledger.
              </p>
            </div>
          </div>
        )}
      </Modal>

      {/* External Razorpay Checkout Script */}
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />
    </div>
  );
}

