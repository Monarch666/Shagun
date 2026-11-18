'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Camera,
  Clock,
  Lock,
  Download,
  ArrowLeft,
  Sparkles,
  Share2,
  Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { mockStore } from '@/lib/supabase/mock-store';
import { Wedding, Photo, CameraRoll } from '@/lib/supabase/types';

export default function GuestGalleryPage() {
  const params = useParams();
  const slug = params?.slug as string || 'aadarsh-and-shivani';

  const [wedding, setWedding] = useState<Wedding | null>(null);
  const [roll, setRoll] = useState<CameraRoll | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isRevealed, setIsRevealed] = useState(false);
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const w = mockStore.getWeddingBySlug(slug) || mockStore.getWeddingById('wed-001');
    if (w) {
      setWedding(w);

      let sessionId = '';
      if (typeof window !== 'undefined') {
        sessionId = localStorage.getItem(`shagun_guest_sid_${slug}`) || '';
      }

      if (sessionId) {
        const storedName = localStorage.getItem(`shagun_guest_name_${slug}`) || 'Guest';
        const r = mockStore.getOrCreateRoll(w.id, sessionId, storedName);
        setRoll(r);
        setPhotos(mockStore.getPhotos(w.id, r.id, false));
      }

      // Check reveal time
      const revealDate = new Date(w.reveal_at).getTime();
      const checkCountdown = () => {
        const now = new Date().getTime();
        const diff = revealDate - now;

        if (diff <= 0) {
          setIsRevealed(true);
        } else {
          setIsRevealed(false);
          const hours = Math.floor(diff / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);
          setTimeLeft({ hours, minutes, seconds });
        }
      };

      checkCountdown();
      const interval = setInterval(checkCountdown, 1000);
      return () => clearInterval(interval);
    }
  }, [slug]);

  const handleDownloadPhoto = (photoUrl?: string | null) => {
    if (!photoUrl) return;
    const a = document.createElement('a');
    a.href = photoUrl;
    a.download = `shagun-wedding-photo-${Date.now()}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="min-h-screen bg-ivory-100 py-10 px-4 sm:px-6 lg:px-8 selection:bg-marigold-200">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Link
            href={`/w/${slug}`}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-maroon-900 hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Wedding Page</span>
          </Link>

          <Link href={`/w/${slug}/camera`}>
            <Button variant="secondary" size="sm" className="gap-1.5 text-xs">
              <Camera className="w-3.5 h-3.5" />
              <span>Back to Camera</span>
            </Button>
          </Link>
        </div>

        {/* Gallery Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-full bg-gray-900 text-amber-300 mb-1 border-2 border-amber-400">
            <Camera className="w-6 h-6" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-maroon-950">
            Morning-After Photo Gallery
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto">
            {wedding?.partner_1_name} &amp; {wedding?.partner_2_name}&apos;s Disposable Wedding Memories
          </p>
        </div>

        {/* Locked / Undeveloped Countdown State */}
        {!isRevealed ? (
          <Card className="p-8 sm:p-12 text-center border-4 border-amber-300 shadow-xl bg-white max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full bg-amber-100 text-maroon-900 flex items-center justify-center mx-auto mb-6">
              <Lock className="w-8 h-8" />
            </div>

            <Badge variant="marigold" size="md">
              Photos Developing in the Darkroom
            </Badge>

            <h2 className="text-2xl font-serif font-bold text-maroon-950 mt-4 mb-2">
              Reveal Time Lock Active
            </h2>

            <p className="text-xs text-gray-600 mb-6 leading-relaxed">
              Just like real disposable cameras, guest photos stay undeveloped until the morning after the wedding!
            </p>

            {/* Countdown Display */}
            <div className="bg-gray-950 text-amber-400 p-6 rounded-2xl border-2 border-amber-500 shadow-inner mb-6">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <span className="font-mono text-3xl sm:text-4xl font-bold">{timeLeft.hours}</span>
                  <span className="text-[10px] text-gray-400 uppercase block mt-1">Hours</span>
                </div>
                <div>
                  <span className="font-mono text-3xl sm:text-4xl font-bold">{timeLeft.minutes}</span>
                  <span className="text-[10px] text-gray-400 uppercase block mt-1">Minutes</span>
                </div>
                <div>
                  <span className="font-mono text-3xl sm:text-4xl font-bold">{timeLeft.seconds}</span>
                  <span className="text-[10px] text-gray-400 uppercase block mt-1">Seconds</span>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-800 text-[11px] text-gray-400 flex items-center justify-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>
                  Unlocks on {wedding ? new Date(wedding.reveal_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''}
                </span>
              </div>
            </div>

            <div className="text-xs text-gray-500">
              You have taken <strong>{roll?.shots_used || 0} of 24 shots</strong>. Return here once the countdown completes to download your memories!
            </div>
          </Card>
        ) : (
          /* Revealed State: Guest views their own roll */
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-emerald-50 border border-emerald-300 p-4 rounded-2xl text-emerald-900 text-xs sm:text-sm">
              <span className="font-semibold">
                ✨ Photos Developed! Showing your {photos.length} captured moments.
              </span>
              <span className="text-xs opacity-75">Couple has all full-resolution photos in Drive</span>
            </div>

            {photos.length === 0 ? (
              <Card className="p-12 text-center text-gray-500">
                <Camera className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p>No photos were taken on your roll for this wedding.</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {photos.map((photo) => (
                  <Card key={photo.id} className="overflow-hidden border-2 border-amber-300 bg-white p-3 shadow-md">
                    <div className="relative aspect-[4/3] bg-gray-900 rounded-xl overflow-hidden mb-3">
                      {photo.drive_thumbnail_url ? (
                        <img
                          src={photo.drive_thumbnail_url}
                          alt="Wedding Memory"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-600">
                          <Camera className="w-8 h-8 opacity-40" />
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-1 text-xs">
                      <span className="text-gray-400 font-mono text-[10px]">
                        {new Date(photo.captured_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <Button
                        onClick={() => handleDownloadPhoto(photo.drive_thumbnail_url)}
                        variant="ghost"
                        size="sm"
                        className="gap-1 text-xs py-1 px-2.5 h-8 text-maroon-900"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Save</span>
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

