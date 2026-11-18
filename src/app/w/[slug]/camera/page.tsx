'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Camera,
  RotateCcw,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  Clock,
  WifiOff,
  AlertCircle,
  HelpCircle,
  Eye,
  Heart,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { mockStore } from '@/lib/supabase/mock-store';
import { Wedding, CameraRoll } from '@/lib/supabase/types';
import { applyVintageFilmFilter } from '@/lib/camera/vintage-filter';
import { queuePhotoForUpload, getPendingPhotoCount } from '@/lib/camera/offline-queue';

export default function DisposableCameraPage() {
  const params = useParams();
  const slug = params?.slug as string || 'aadarsh-and-shivani';

  const [wedding, setWedding] = useState<Wedding | null>(null);
  const [guestName, setGuestName] = useState<string>('');
  const [guestSessionId, setGuestSessionId] = useState<string>('');
  const [hasEnteredName, setHasEnteredName] = useState<boolean>(false);
  const [roll, setRoll] = useState<CameraRoll | null>(null);

  // Camera hardware states
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [isShutterActive, setIsShutterActive] = useState(false);
  const [flashAnimation, setFlashAnimation] = useState(false);
  const [pendingSyncCount, setPendingSyncCount] = useState(0);

  // Initialize session & load roll
  useEffect(() => {
    const w = mockStore.getWeddingBySlug(slug) || mockStore.getWeddingById('wed-001');
    if (w) setWedding(w);

    let sessionId = '';
    let storedName = '';

    if (typeof window !== 'undefined') {
      sessionId = localStorage.getItem(`shagun_guest_sid_${slug}`) || '';
      storedName = localStorage.getItem(`shagun_guest_name_${slug}`) || '';

      if (!sessionId) {
        sessionId = `guest_${Math.random().toString(36).substring(2, 10)}_${Date.now()}`;
        localStorage.setItem(`shagun_guest_sid_${slug}`, sessionId);
      }
      setGuestSessionId(sessionId);

      if (storedName) {
        setGuestName(storedName);
        setHasEnteredName(true);
        if (w) {
          const r = mockStore.getOrCreateRoll(w.id, sessionId, storedName);
          setRoll(r);
        }
      }
    }
  }, [slug]);

  // Start / stop camera stream
  const startCamera = async (mode: 'environment' | 'user') => {
    setCameraError(null);
    try {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access is not supported by your browser.');
      }

      const newStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: mode },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      });

      setStream(newStream);
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
    } catch (err: any) {
      console.warn('Camera stream error:', err);
      setCameraError(
        err?.message || 'Could not access camera. Please allow camera permissions in your browser.'
      );
    }
  };

  useEffect(() => {
    if (hasEnteredName) {
      startCamera(facingMode);
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [hasEnteredName, facingMode]);

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) return;

    if (typeof window !== 'undefined') {
      localStorage.setItem(`shagun_guest_name_${slug}`, guestName.trim());
    }
    setHasEnteredName(true);

    if (wedding) {
      const r = mockStore.getOrCreateRoll(wedding.id, guestSessionId, guestName.trim());
      setRoll(r);
    }
  };

  const handleFlipCamera = () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
  };

  const handleCapturePhoto = async () => {
    if (!wedding || !roll || isShutterActive) return;

    // Check roll limit
    if (roll.shots_used >= roll.roll_limit) {
      alert(`Roll Completed! You have used all ${roll.roll_limit} shots.`);
      return;
    }

    setIsShutterActive(true);
    setFlashAnimation(true);
    setTimeout(() => setFlashAnimation(false), 200);

    try {
      const video = videoRef.current;
      const canvas = canvasRef.current || document.createElement('canvas');

      if (video && video.videoWidth > 0) {
        // Set canvas to max 1600px bounding box
        const maxDim = 1600;
        let w = video.videoWidth;
        let h = video.videoHeight;
        if (w > maxDim || h > maxDim) {
          if (w > h) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          } else {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
        }

        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, w, h);
          // Apply client-side vintage 90s film filter & date stamp
          applyVintageFilmFilter(canvas, { grain: true, vignette: true, dateStamp: true });

          // Convert to JPEG blob (~0.8 quality)
          canvas.toBlob(
            async (blob) => {
              if (blob) {
                // Queue photo offline immediately
                await queuePhotoForUpload(wedding.id, roll.id, guestSessionId, blob);
                setPendingSyncCount((prev) => prev + 1);

                // Increment shots used in roll
                mockStore.incrementRollShot(roll.id);
                setRoll({ ...roll, shots_used: roll.shots_used + 1 });

                // Also save mock metadata so couple can immediately see it in demo
                mockStore.savePhoto({
                  wedding_id: wedding.id,
                  roll_id: roll.id,
                  google_drive_file_id: `gdrive_mock_${Date.now()}`,
                  drive_thumbnail_url: canvas.toDataURL('image/jpeg', 0.6),
                  width: w,
                  height: h,
                  is_hidden_by_couple: false,
                  is_deleted: false,
                });
              }
              setIsShutterActive(false);
            },
            'image/jpeg',
            0.8
          );
        }
      }
    } catch (err) {
      console.error('Photo capture error:', err);
      setIsShutterActive(false);
    }
  };

  const shotsRemaining = roll ? Math.max(0, roll.roll_limit - roll.shots_used) : 24;
  const isRollFinished = roll ? roll.shots_used >= roll.roll_limit : false;

  // Screen 1: Guest enters their name first
  if (!hasEnteredName) {
    return (
      <div className="min-h-screen bg-ivory-50 flex items-center justify-center p-4 indian-pattern-bg">
        <div className="max-w-md w-full">
          <Card className="p-8 border-4 border-amber-300 shadow-2xl bg-white text-center">
            <div className="w-16 h-16 rounded-full bg-gray-900 text-amber-300 flex items-center justify-center mx-auto mb-4 border-2 border-amber-400">
              <Camera className="w-8 h-8" />
            </div>

            <h1 className="text-2xl font-serif font-bold text-maroon-950 mb-1">
              Venue Disposable Camera
            </h1>
            <p className="text-xs text-gray-600 mb-6">
              {wedding?.partner_1_name} &amp; {wedding?.partner_2_name}&apos;s Wedding Roll
            </p>

            <form onSubmit={handleNameSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  What is your name?
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aryan / Priya (Groom's Cousin)"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-amber-300 bg-ivory-50 text-sm focus:outline-none focus:ring-2 focus:ring-maroon-800"
                />
              </div>

              <div className="bg-amber-50 p-3.5 rounded-xl border border-amber-200 text-xs text-gray-700 space-y-1.5">
                <p className="font-semibold text-maroon-950">How the Camera Works:</p>
                <p>&bull; You have a limited roll of <strong>24 authentic shots</strong>.</p>
                <p>&bull; A vintage film filter is applied with a classic &apos;90s date stamp.</p>
                <p>&bull; Photos remain <strong>undeveloped</strong> until tomorrow morning at 10:00 AM.</p>
              </div>

              <Button type="submit" variant="primary" size="lg" className="w-full gap-2">
                <Camera className="w-4 h-4" />
                <span>Start Shooting (24 Shots)</span>
              </Button>
            </form>

            <Link href={`/w/${slug}`} className="inline-block mt-4 text-xs text-maroon-800 hover:underline">
              &larr; Back to Wedding Page
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  // Screen 2: Active Camera Viewfinder & Controls
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col justify-between select-none">
      {/* Flash overlay animation */}
      {flashAnimation && (
        <div className="fixed inset-0 bg-white z-50 pointer-events-none transition-opacity duration-150" />
      )}

      {/* Top Header Bar */}
      <div className="px-4 py-3 flex items-center justify-between bg-black/60 backdrop-blur-md border-b border-gray-800 z-20">
        <Link href={`/w/${slug}`} className="p-2 text-gray-300 hover:text-white rounded-lg">
          <ArrowLeft className="w-5 h-5" />
        </Link>

        {/* Vintage Film Roll Counter */}
        <div className="flex items-center gap-2 bg-gray-900 border-2 border-amber-500/80 px-3 py-1 rounded-full shadow-inner">
          <div className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
          <span className="font-mono text-xs uppercase text-amber-300 tracking-wider">
            {shotsRemaining} Shots Left
          </span>
          <span className="text-[10px] text-gray-400">({roll?.shots_used || 0}/24)</span>
        </div>

        <Link href={`/w/${slug}/gallery`} className="text-xs text-amber-300 font-medium hover:underline flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          <span>Reveal</span>
        </Link>
      </div>

      {/* Viewfinder Canvas / Video Frame */}
      <div className="flex-1 relative flex items-center justify-center bg-black overflow-hidden">
        {cameraError ? (
          <div className="text-center p-6 max-w-sm">
            <AlertCircle className="w-12 h-12 text-amber-400 mx-auto mb-3" />
            <p className="text-sm text-gray-300 mb-4">{cameraError}</p>
            <Button onClick={() => startCamera(facingMode)} variant="outline" size="sm" className="border-gray-600 text-white">
              Retry Camera Access
            </Button>
          </div>
        ) : (
          <div className="relative w-full h-full max-h-[78vh] flex items-center justify-center">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            {/* Vintage Crosshairs / Viewfinder overlay */}
            <div className="absolute inset-4 pointer-events-none border border-white/20 rounded-2xl flex flex-col justify-between p-4">
              <div className="flex justify-between text-[11px] font-mono text-amber-300/80">
                <span>ISO 400</span>
                <span>SHAGUN FILM &apos;26</span>
              </div>
              <div className="flex justify-center">
                <div className="w-12 h-12 border border-white/30 rounded-full flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-amber-400/80 rounded-full" />
                </div>
              </div>
              <div className="flex justify-between text-[11px] font-mono text-amber-300/80">
                <span>EXP {roll?.shots_used || 0}</span>
                <span>UNDEVELOPED</span>
              </div>
            </div>
          </div>
        )}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* Bottom Shutter Controls & Vintage Body */}
      <div className="camera-body bg-gray-900 border-t-2 border-gray-800 p-6 flex flex-col items-center gap-4 z-20">
        {isRollFinished ? (
          <div className="text-center space-y-2 py-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-300 bg-amber-950/80 px-4 py-1.5 rounded-full border border-amber-500/50">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Roll Complete! 24 of 24 shots captured</span>
            </div>
            <p className="text-xs text-gray-400 max-w-xs">
              Your photos are safely stored and will be developed for you tomorrow morning at 10:00 AM!
            </p>
            <Link href={`/w/${slug}/gallery`}>
              <Button variant="gold" size="sm" className="mt-1">
                View Reveal Countdown
              </Button>
            </Link>
          </div>
        ) : (
          <div className="w-full max-w-sm flex items-center justify-between px-6">
            {/* Flip camera */}
            <button
              onClick={handleFlipCamera}
              className="p-3.5 rounded-full bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
              title="Flip Camera"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            {/* Authentic Red Shutter Button */}
            <button
              onClick={handleCapturePhoto}
              disabled={isShutterActive || isRollFinished}
              className="shutter-button w-20 h-20 rounded-full flex items-center justify-center border-4 border-gray-800 focus:outline-none"
              aria-label="Capture Photo"
            >
              <div className="w-14 h-14 rounded-full border-2 border-white/40 flex items-center justify-center">
                <Camera className="w-6 h-6 text-white" />
              </div>
            </button>

            {/* Guest Name & Info */}
            <div className="text-right">
              <span className="text-[11px] text-gray-400 block truncate max-w-[80px]">{guestName}</span>
              <span className="text-[10px] text-amber-400 font-mono">24 EXP</span>
            </div>
          </div>
        )}

        <div className="text-[10px] text-gray-500 flex items-center gap-1.5">
          <span>Photos automatically transfer to couple&apos;s private Google Drive</span>
        </div>
      </div>
    </div>
  );
}

