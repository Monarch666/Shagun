'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Camera,
  Eye,
  EyeOff,
  Trash2,
  Download,
  Clock,
  QrCode,
  Sparkles,
  Users,
  HardDrive,
  CheckCircle2,
  AlertTriangle,
  Play,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { mockStore } from '@/lib/supabase/mock-store';
import { Photo, Wedding, CameraRoll } from '@/lib/supabase/types';

export default function CoupleCameraDashboardPage() {
  const [wedding, setWedding] = useState<Wedding | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [rolls, setRolls] = useState<CameraRoll[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [isRevealNowSuccess, setIsRevealNowSuccess] = useState(false);

  useEffect(() => {
    const w = mockStore.getWeddingById('wed-001') || mockStore.getWeddingBySlug('aadarsh-and-shivani');
    if (w) {
      setWedding(w);
      setPhotos(mockStore.getPhotos(w.id, undefined, true));
    }
  }, []);

  const totalShotsTaken = photos.length;
  const isRevealed = wedding ? new Date() >= new Date(wedding.reveal_at) : false;

  const handleToggleHide = (photo: Photo) => {
    mockStore.updatePhoto(photo.id, { is_hidden_by_couple: !photo.is_hidden_by_couple });
    if (wedding) setPhotos(mockStore.getPhotos(wedding.id, undefined, true));
  };

  const handleDeletePhoto = (photoId: string) => {
    if (confirm('Are you sure you want to remove this photo?')) {
      mockStore.updatePhoto(photoId, { is_deleted: true });
      if (wedding) setPhotos(mockStore.getPhotos(wedding.id, undefined, true));
    }
  };

  const handleRevealNow = () => {
    if (!wedding) return;
    if (confirm('Unlock and reveal all photos for your guests right now?')) {
      const now = new Date(Date.now() - 1000).toISOString();
      mockStore.saveWedding({
        id: wedding.id,
        owner_id: wedding.owner_id,
        reveal_at: now,
      });
      setWedding({ ...wedding, reveal_at: now });
      setIsRevealNowSuccess(true);
      setTimeout(() => setIsRevealNowSuccess(false), 3000);
    }
  };

  const handleDownloadAllZip = () => {
    alert(`Initiating batch download of all ${photos.length} original high-res photos from your Google Drive folder.`);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-maroon-950">Venue Disposable Camera</h1>
          <p className="mt-1 text-sm text-gray-600">
            Moderate candid moments captured by guests, control the morning-after reveal, and export all memories.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link href="/dashboard/poster">
            <Button variant="outline" size="md" className="gap-2">
              <QrCode className="w-4 h-4" />
              <span>Camera QR Standee</span>
            </Button>
          </Link>
          <Button onClick={handleDownloadAllZip} variant="secondary" size="md" className="gap-2">
            <Download className="w-4 h-4" />
            <span>Download All ({photos.length})</span>
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 border-2 border-amber-200">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Photos Captured</span>
          <h3 className="text-2xl font-serif font-bold text-maroon-950 mt-2">{totalShotsTaken}</h3>
          <p className="text-xs text-gray-500 mt-1">Saved directly to your Google Drive</p>
        </Card>

        <Card className="p-5 border-2 border-amber-200">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Roll Limit Per Guest</span>
          <h3 className="text-2xl font-serif font-bold text-maroon-950 mt-2">{wedding?.default_roll_limit || 24} Shots</h3>
          <p className="text-xs text-gray-500 mt-1">Authentic 24-shot disposable limit</p>
        </Card>

        <Card className="p-5 border-2 border-amber-200">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Reveal Status</span>
          <div className="mt-2 flex items-center gap-2">
            <Badge variant={isRevealed ? 'green' : 'marigold'} size="md">
              {isRevealed ? 'REVEALED TO GUESTS' : 'LOCKED (DEVELOPING)'}
            </Badge>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {wedding ? new Date(wedding.reveal_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''}
          </p>
        </Card>

        <Card className="p-5 border-2 border-amber-200 flex flex-col justify-between">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Quick Reveal</span>
          <Button
            onClick={handleRevealNow}
            variant={isRevealed ? 'ghost' : 'gold'}
            size="sm"
            className="w-full gap-1.5 mt-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isRevealed ? 'Already Revealed' : 'Reveal Photos Now'}</span>
          </Button>
          {isRevealNowSuccess && (
            <span className="text-[11px] text-emerald-700 font-semibold text-center mt-1">
              ✨ Photos unlocked for guests!
            </span>
          )}
        </Card>
      </div>

      {/* Google Drive Status Banner */}
      <Card className="p-4 bg-ivory-50 border-2 border-amber-300 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-100 text-maroon-900">
            <HardDrive className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-maroon-950">Google Drive Destination Folder</h4>
            <p className="text-xs text-gray-600 font-mono">
              Google Drive &gt; Shagun – {wedding?.partner_1_name} &amp; {wedding?.partner_2_name} /
            </p>
          </div>
        </div>
        <Badge variant="green" size="sm">drive.file permission verified</Badge>
      </Card>

      {/* Gallery Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-serif font-bold text-maroon-950">All Event Photos ({photos.length})</h2>
          <span className="text-xs text-gray-500">
            Hover over any photo to moderate or hide from guests
          </span>
        </div>

        {photos.length === 0 ? (
          <Card className="p-12 text-center text-gray-500 border-2 border-dashed border-amber-300">
            <Camera className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="font-serif text-lg text-gray-700">No photos taken yet</p>
            <p className="text-xs text-gray-500 mt-1">
              Print your QR standees and invite guests to start taking memories!
            </p>
            <Link href="/dashboard/poster" className="inline-block mt-4">
              <Button variant="primary" size="sm">
                View Camera Standee
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map((photo) => (
              <Card
                key={photo.id}
                className={`overflow-hidden border-2 transition-all group relative ${
                  photo.is_hidden_by_couple ? 'border-red-300 opacity-60' : 'border-amber-200 hover:border-amber-400'
                }`}
              >
                <div className="relative aspect-[4/3] bg-gray-900 overflow-hidden cursor-pointer" onClick={() => setSelectedPhoto(photo)}>
                  {photo.drive_thumbnail_url ? (
                    <img
                      src={photo.drive_thumbnail_url}
                      alt="Guest Photo"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                      <Camera className="w-8 h-8" />
                    </div>
                  )}

                  {photo.is_hidden_by_couple && (
                    <div className="absolute top-2 left-2">
                      <Badge variant="maroon" size="sm">
                        Hidden from guests
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Moderation Controls */}
                <div className="p-3 bg-white flex items-center justify-between text-xs">
                  <span className="text-gray-400 font-mono text-[11px]">
                    {new Date(photo.captured_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleToggleHide(photo)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        photo.is_hidden_by_couple
                          ? 'text-red-700 bg-red-50 hover:bg-red-100'
                          : 'text-gray-500 hover:text-maroon-900 hover:bg-amber-100'
                      }`}
                      title={photo.is_hidden_by_couple ? 'Unhide from guests' : 'Hide from guests'}
                    >
                      {photo.is_hidden_by_couple ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleDeletePhoto(photo.id)}
                      className="p-1.5 text-gray-400 hover:text-red-700 rounded-lg hover:bg-red-50 transition-colors"
                      title="Delete photo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Full Photo Preview Modal */}
      <Modal
        isOpen={!!selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
        title="Photo Preview"
        subtitle={selectedPhoto ? `Captured at ${new Date(selectedPhoto.captured_at).toLocaleTimeString('en-IN')}` : ''}
      >
        {selectedPhoto && (
          <div className="space-y-4">
            <div className="rounded-2xl overflow-hidden bg-black flex items-center justify-center max-h-[60vh]">
              {selectedPhoto.drive_thumbnail_url && (
                <img
                  src={selectedPhoto.drive_thumbnail_url}
                  alt="Full preview"
                  className="w-full h-full object-contain"
                />
              )}
            </div>

            <div className="flex items-center justify-between pt-2">
              <Badge variant={selectedPhoto.is_hidden_by_couple ? 'maroon' : 'green'}>
                {selectedPhoto.is_hidden_by_couple ? 'Hidden from guest view' : 'Visible to guest after reveal'}
              </Badge>

              <div className="flex gap-2">
                <Button
                  onClick={() => handleToggleHide(selectedPhoto)}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  {selectedPhoto.is_hidden_by_couple ? 'Make Visible' : 'Hide From Guests'}
                </Button>
                <Button
                  onClick={() => {
                    handleDeletePhoto(selectedPhoto.id);
                    setSelectedPhoto(null);
                  }}
                  variant="danger"
                  size="sm"
                  className="text-xs"
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

