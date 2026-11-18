'use client';

import React, { useState, useEffect } from 'react';
import {
  Calendar,
  MapPin,
  Clock,
  Plus,
  Trash2,
  Edit2,
  Save,
  Check,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { mockStore } from '@/lib/supabase/mock-store';
import { Wedding, WeddingEvent } from '@/lib/supabase/types';
import { TRADITION_PRESETS, TraditionCategory } from '@/lib/utils/traditions';

export default function WeddingManagementPage() {
  const [wedding, setWedding] = useState<Wedding | null>(null);
  const [events, setEvents] = useState<WeddingEvent[]>([]);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [selectedTradition, setSelectedTradition] = useState<string>('all_faith');
  const [presetSuccess, setPresetSuccess] = useState(false);

  // Form states for wedding details
  const [partner1, setPartner1] = useState('');
  const [partner2, setPartner2] = useState('');
  const [partner1Phone, setPartner1Phone] = useState('');
  const [partner2Phone, setPartner2Phone] = useState('');
  const [coupleUpiId, setCoupleUpiId] = useState('');
  const [coupleUpiQrUrl, setCoupleUpiQrUrl] = useState('');
  const [weddingDate, setWeddingDate] = useState('');
  const [city, setCity] = useState('');
  const [slug, setSlug] = useState('');
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');

  // Event modal state
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [eventName, setEventName] = useState('');
  const [eventStartTime, setEventStartTime] = useState('');
  const [eventEndTime, setEventEndTime] = useState('');
  const [eventVenue, setEventVenue] = useState('');
  const [eventAddress, setEventAddress] = useState('');
  const [eventMapsUrl, setEventMapsUrl] = useState('');

  useEffect(() => {
    const w = mockStore.getWeddingById('wed-001') || mockStore.getWeddingBySlug('aadarsh-and-shivani');
    if (w) {
      setWedding(w);
      setPartner1(w.partner_1_name);
      setPartner2(w.partner_2_name);
      setPartner1Phone(w.partner_1_phone || '+91 98765 43210');
      setPartner2Phone(w.partner_2_phone || '+91 98123 45678');
      setCoupleUpiId(w.couple_upi_id || 'aadarsh.shivani@okhdfcbank');
      setCoupleUpiQrUrl(w.couple_upi_qr_url || '');
      setWeddingDate(w.wedding_date);
      setCity(w.city);
      setSlug(w.slug);
      setWelcomeMessage(w.welcome_message || '');
      setCoverImageUrl(w.cover_image_url || '');
      setSelectedTradition(w.tradition_type || 'all_faith');

      setEvents(mockStore.getEvents(w.id));
    }
  }, []);

  const handleApplyTraditionPreset = (traditionKey: string) => {
    if (!wedding) return;
    const preset = TRADITION_PRESETS[traditionKey];
    if (!preset) return;

    if (confirm(`Load the ceremony schedule for "${preset.title}"? This will populate the authentic ceremonies for your celebration.`)) {
      const updatedEvents = mockStore.loadTraditionEvents(
        wedding.id,
        preset.ceremonies.map((c) => ({
          name: c.name,
          defaultVenue: c.defaultVenue,
          description: c.description,
        }))
      );
      setEvents(updatedEvents);
      setSelectedTradition(traditionKey);

      // Save tradition preference
      mockStore.saveWedding({
        id: wedding.id,
        owner_id: wedding.owner_id,
        tradition_type: traditionKey as any,
      });

      setPresetSuccess(true);
      setTimeout(() => setPresetSuccess(false), 2500);
    }
  };

  const handleSaveWeddingDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wedding) return;

    const updated = mockStore.saveWedding({
      id: wedding.id,
      owner_id: wedding.owner_id,
      partner_1_name: partner1,
      partner_2_name: partner2,
      partner_1_phone: partner1Phone,
      partner_2_phone: partner2Phone,
      couple_upi_id: coupleUpiId,
      couple_upi_qr_url: coupleUpiQrUrl,
      wedding_date: weddingDate,
      city: city,
      slug: slug.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
      welcome_message: welcomeMessage,
      cover_image_url: coverImageUrl,
    });

    setWedding(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleOpenAddEvent = () => {
    setEditingEventId(null);
    setEventName('');
    setEventStartTime('2026-12-18T18:00');
    setEventEndTime('2026-12-18T22:00');
    setEventVenue('');
    setEventAddress('');
    setEventMapsUrl('');
    setIsEventModalOpen(true);
  };

  const handleOpenEditEvent = (evt: WeddingEvent) => {
    setEditingEventId(evt.id);
    setEventName(evt.name);
    setEventStartTime(evt.start_time.substring(0, 16));
    setEventEndTime(evt.end_time ? evt.end_time.substring(0, 16) : '');
    setEventVenue(evt.venue_name);
    setEventAddress(evt.venue_address || '');
    setEventMapsUrl(evt.maps_url || '');
    setIsEventModalOpen(true);
  };

  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wedding) return;

    const saved = mockStore.saveEvent({
      id: editingEventId || undefined,
      wedding_id: wedding.id,
      name: eventName,
      start_time: new Date(eventStartTime).toISOString(),
      end_time: eventEndTime ? new Date(eventEndTime).toISOString() : null,
      venue_name: eventVenue,
      venue_address: eventAddress,
      maps_url: eventMapsUrl,
    });

    setEvents(mockStore.getEvents(wedding.id));
    setIsEventModalOpen(false);
  };

  const handleDeleteEvent = (id: string) => {
    if (!wedding) return;
    if (confirm('Are you sure you want to remove this event?')) {
      mockStore.deleteEvent(id);
      setEvents(mockStore.getEvents(wedding.id));
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-bold text-maroon-950">Wedding &amp; Events Itinerary</h1>
        <p className="mt-1 text-sm text-gray-600">
          Personalize your story, your city, and the schedule of celebrations for your guests.
        </p>
      </div>

      {/* Main Wedding Details Form */}
      <Card className="p-6 sm:p-8">
        <form onSubmit={handleSaveWeddingDetails} className="space-y-6">
          <div className="flex items-center justify-between border-b border-amber-100 pb-4">
            <h2 className="text-xl font-serif font-bold text-maroon-900">Couple &amp; Celebration Details</h2>
            {savedSuccess && (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Saved successfully!</span>
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                Partner 1 Name
              </label>
              <input
                type="text"
                required
                value={partner1}
                onChange={(e) => setPartner1(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-amber-300 bg-ivory-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-maroon-800 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                Partner 2 Name
              </label>
              <input
                type="text"
                required
                value={partner2}
                onChange={(e) => setPartner2(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-amber-300 bg-ivory-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-maroon-800 text-sm"
              />
            </div>
          </div>

          {/* Two Registered Phone Numbers for Verification */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-amber-50/50 p-4 rounded-2xl border border-amber-200">
            <div>
              <label className="block text-xs font-semibold text-maroon-950 uppercase tracking-wider mb-2">
                Partner 1 Registered Mobile (UPI Linked)
              </label>
              <input
                type="tel"
                required
                placeholder="+91 98765 43210"
                value={partner1Phone}
                onChange={(e) => setPartner1Phone(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-amber-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-maroon-800 text-sm font-mono"
              />
              <p className="text-[11px] text-gray-500 mt-1">Displayed to guests for authenticity verification.</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-maroon-950 uppercase tracking-wider mb-2">
                Partner 2 Registered Mobile (UPI Linked)
              </label>
              <input
                type="tel"
                required
                placeholder="+91 98123 45678"
                value={partner2Phone}
                onChange={(e) => setPartner2Phone(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-amber-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-maroon-800 text-sm font-mono"
              />
              <p className="text-[11px] text-gray-500 mt-1">Displayed to guests for authenticity verification.</p>
            </div>
          </div>

          {/* Couple's Direct UPI ID */}
          <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-amber-200">
            <label className="block text-xs font-semibold text-maroon-950 uppercase tracking-wider mb-2">
              Couple&apos;s Primary UPI ID (VPA) &bull; Zero Middleman
            </label>
            <input
              type="text"
              required
              placeholder="e.g. shivani.aadarsh@okhdfcbank"
              value={coupleUpiId}
              onChange={(e) => setCoupleUpiId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-amber-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-maroon-800 text-sm font-mono"
            />
            <p className="text-[11px] text-emerald-800 font-medium mt-1">
              &bull; 100% of guest gifts transfer straight to your bank via UPI. Nothing redirected to Shagun.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                Wedding Date
              </label>
              <input
                type="date"
                required
                value={weddingDate}
                onChange={(e) => setWeddingDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-amber-300 bg-ivory-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-maroon-800 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                City / Destination
              </label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Udaipur, Rajasthan"
                className="w-full px-4 py-3 rounded-xl border border-amber-300 bg-ivory-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-maroon-800 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                Public URL Slug
              </label>
              <div className="flex items-center rounded-xl border border-amber-300 bg-ivory-50 px-3 py-1">
                <span className="text-xs text-gray-400 font-mono">/w/</span>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full py-2 bg-transparent text-gray-900 font-mono text-xs focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
              Cover Image URL (Optional)
            </label>
            <input
              type="url"
              value={coverImageUrl}
              onChange={(e) => setCoverImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full px-4 py-3 rounded-xl border border-amber-300 bg-ivory-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-maroon-800 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
              Heartfelt Welcome Message to Guests
            </label>
            <textarea
              rows={3}
              value={welcomeMessage}
              onChange={(e) => setWelcomeMessage(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-amber-300 bg-ivory-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-maroon-800 text-sm"
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit" variant="primary" size="md" className="gap-2">
              <Save className="w-4 h-4" />
              <span>Save Wedding Changes</span>
            </Button>
          </div>
        </form>
      </Card>

      {/* Multi-Faith Celebration Presets */}
      <Card className="p-6 border-2 border-amber-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-lg font-serif font-bold text-maroon-950">
              Celebration Style &amp; Tradition Presets
            </h3>
            <p className="text-xs text-gray-600">
              Choose your cultural tradition to automatically populate ceremony names and recommended formats.
            </p>
          </div>
          {presetSuccess && (
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
              Preset loaded into itinerary!
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {Object.entries(TRADITION_PRESETS).map(([key, item]) => {
            const isSelected = selectedTradition === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => handleApplyTraditionPreset(key)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-maroon-900 bg-maroon-900 text-amber-100 shadow-sm'
                    : 'border-amber-200 bg-ivory-50 text-gray-800 hover:bg-amber-100/60'
                }`}
              >
                <div className="text-xs font-bold font-serif">{item.title}</div>
                <div className={`text-[10px] mt-1 ${isSelected ? 'text-amber-200' : 'text-gray-500'}`}>
                  {item.ceremonies.length} ceremonies
                </div>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Events Itinerary Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-serif font-bold text-maroon-950">Events Itinerary</h2>
            <p className="text-xs text-gray-600">
              Ceremonies, dinners, nuptials, and receptions with venue directions
            </p>
          </div>
          <Button onClick={handleOpenAddEvent} variant="secondary" size="md" className="gap-2">
            <Plus className="w-4 h-4" />
            <span>Add Wedding Event</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((evt, idx) => (
            <Card key={evt.id} className="p-6 relative group border-2 border-amber-200/80">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-maroon-900 text-amber-100 flex items-center justify-center font-serif text-sm font-bold">
                    {idx + 1}
                  </span>
                  <h3 className="font-serif text-lg font-bold text-maroon-950">{evt.name}</h3>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEditEvent(evt)}
                    className="p-1.5 text-gray-400 hover:text-maroon-900 rounded-lg hover:bg-amber-100 transition-colors"
                    title="Edit Event"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteEvent(evt.id)}
                    className="p-1.5 text-gray-400 hover:text-red-700 rounded-lg hover:bg-red-50 transition-colors"
                    title="Delete Event"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="mt-4 space-y-2 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-marigold-600 flex-shrink-0" />
                  <span>
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
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-maroon-800 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-gray-900">{evt.venue_name}</strong>
                    {evt.venue_address && <p className="text-gray-500 mt-0.5">{evt.venue_address}</p>}
                  </div>
                </div>
              </div>

              {evt.maps_url && (
                <div className="mt-4 pt-3 border-t border-amber-100">
                  <a
                    href={evt.maps_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-maroon-800 hover:text-maroon-950"
                  >
                    <span>View on Google Maps</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* Event Add/Edit Modal */}
      <Modal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        title={editingEventId ? 'Edit Event Details' : 'Add Wedding Event'}
        subtitle="Help guests navigate each celebration smoothly"
      >
        <form onSubmit={handleSaveEvent} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Event Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Sangeet & Cocktails, Wedding Ceremony, Haldi"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-amber-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-maroon-800"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Start Time
              </label>
              <input
                type="datetime-local"
                required
                value={eventStartTime}
                onChange={(e) => setEventStartTime(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-amber-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-maroon-800"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                End Time (Optional)
              </label>
              <input
                type="datetime-local"
                value={eventEndTime}
                onChange={(e) => setEventEndTime(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-amber-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-maroon-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Venue Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Chandra Mahal Ballroom / Lakeside Lawn"
              value={eventVenue}
              onChange={(e) => setEventVenue(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-amber-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-maroon-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Full Address
            </label>
            <input
              type="text"
              placeholder="e.g. Haridas Ji Ki Magri, Mulla Talai, Udaipur"
              value={eventAddress}
              onChange={(e) => setEventAddress(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-amber-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-maroon-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Google Maps Location Link
            </label>
            <input
              type="url"
              placeholder="https://maps.google.com/?q=..."
              value={eventMapsUrl}
              onChange={(e) => setEventMapsUrl(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-amber-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-maroon-800"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-amber-200">
            <Button
              type="button"
              variant="ghost"
              size="md"
              onClick={() => setIsEventModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md">
              Save Event
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

