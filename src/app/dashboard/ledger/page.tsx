'use client';

import React, { useState, useEffect } from 'react';
import {
  BookOpenCheck,
  Plus,
  Download,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Heart,
  MessageSquare,
  Gift,
  Copy,
  Check,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { mockStore } from '@/lib/supabase/mock-store';
import { LedgerEntry, Wedding } from '@/lib/supabase/types';
import { formatINR } from '@/lib/utils/currency';

export default function ShagunLedgerPage() {
  const [wedding, setWedding] = useState<Wedding | null>(null);
  const [ledger, setLedger] = useState<LedgerEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  // Manual offline entry modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [amount, setAmount] = useState('');
  const [giftType, setGiftType] = useState<LedgerEntry['gift_type']>('cash_envelope');
  const [fundTitle, setFundTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [receivedDate, setReceivedDate] = useState(new Date().toISOString().split('T')[0]);

  // Thank-you generator modal
  const [isThankYouModalOpen, setIsThankYouModalOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<LedgerEntry | null>(null);
  const [copiedMessage, setCopiedMessage] = useState(false);

  useEffect(() => {
    const w = mockStore.getWeddingById('wed-001') || mockStore.getWeddingBySlug('aadarsh-and-shivani');
    if (w) {
      setWedding(w);
      setLedger(mockStore.getLedger(w.id));
    }
  }, []);

  const totalAmount = ledger.reduce((sum, item) => sum + item.amount, 0);
  const onlineAmount = ledger.filter((i) => i.gift_type === 'online').reduce((sum, i) => sum + i.amount, 0);
  const offlineAmount = totalAmount - onlineAmount;
  const thankYouCount = ledger.filter((i) => i.thank_you_sent).length;

  const filteredEntries = ledger.filter((entry) => {
    const matchesSearch =
      entry.guest_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (entry.notes && entry.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filterType === 'all' || entry.gift_type === filterType;
    return matchesSearch && matchesFilter;
  });

  const handleAddOfflineEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wedding) return;

    mockStore.addOfflineLedgerEntry({
      wedding_id: wedding.id,
      guest_name: guestName,
      amount: parseInt(amount, 10),
      gift_type: giftType,
      fund_title: fundTitle || null,
      notes: notes || null,
      thank_you_sent: false,
      received_date: receivedDate,
    });

    setLedger(mockStore.getLedger(wedding.id));
    setIsAddModalOpen(false);
    // Reset form
    setGuestName('');
    setAmount('');
    setNotes('');
  };

  const handleToggleThankYou = (entry: LedgerEntry) => {
    mockStore.updateLedgerEntry(entry.id, { thank_you_sent: !entry.thank_you_sent });
    if (wedding) setLedger(mockStore.getLedger(wedding.id));
  };

  const handleOpenThankYou = (entry: LedgerEntry) => {
    setSelectedEntry(entry);
    setCopiedMessage(false);
    setIsThankYouModalOpen(true);
  };

  const getThankYouText = (entry: LedgerEntry) => {
    const coupleName = wedding ? `${wedding.partner_1_name} & ${wedding.partner_2_name}` : 'Aadarsh & Shivani';
    return `Namaste ${entry.guest_name} ji,\n\nThank you with all our hearts for your warm presence and heartfelt blessings on our wedding. Your generous Shagun of ${formatINR(entry.amount)} means the world to us as we begin our new life together.\n\nWith utmost respect and gratitude,\n${coupleName}`;
  };

  const handleCopyThankYou = () => {
    if (selectedEntry) {
      navigator.clipboard.writeText(getThankYouText(selectedEntry));
      setCopiedMessage(true);
      setTimeout(() => setCopiedMessage(false), 2000);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-maroon-950">Shagun Ledger</h1>
          <p className="mt-1 text-sm text-gray-600">
            A unified, dignified ledger for all your blessings—online UPI gifts and offline cash envelopes.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <a href={`/api/export/ledger-csv?weddingId=${wedding?.id || 'wed-001'}`} download>
            <Button variant="outline" size="md" className="gap-2">
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </Button>
          </a>
          <Button onClick={() => setIsAddModalOpen(true)} variant="secondary" size="md" className="gap-2">
            <Plus className="w-4 h-4" />
            <span>Add Offline Shagun</span>
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 border-2 border-amber-200">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Shagun</span>
          <h3 className="text-2xl font-serif font-bold text-maroon-950 mt-2">{formatINR(totalAmount)}</h3>
          <p className="text-xs text-gray-500 mt-1">{ledger.length} total blessings recorded</p>
        </Card>

        <Card className="p-5 border-2 border-amber-200">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Online UPI Shagun</span>
          <h3 className="text-2xl font-serif font-bold text-maroon-950 mt-2">{formatINR(onlineAmount)}</h3>
          <p className="text-xs text-gray-500 mt-1">Directly settled to your bank</p>
        </Card>

        <Card className="p-5 border-2 border-amber-200">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Offline Envelopes / Gifts</span>
          <h3 className="text-2xl font-serif font-bold text-maroon-950 mt-2">{formatINR(offlineAmount)}</h3>
          <p className="text-xs text-gray-500 mt-1">Envelopes &amp; traditional gifts</p>
        </Card>

        <Card className="p-5 border-2 border-amber-200">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Thank-You Notes Sent</span>
          <h3 className="text-2xl font-serif font-bold text-maroon-950 mt-2">
            {thankYouCount} / {ledger.length}
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            {ledger.length > 0 ? Math.round((thankYouCount / ledger.length) * 100) : 0}% completed
          </p>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="p-4 border-2 border-amber-200/80">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by guest name or blessing note..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-amber-300 bg-ivory-50 text-sm focus:outline-none focus:ring-2 focus:ring-maroon-800"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto scrollbar-none">
            <span className="text-xs text-gray-500 font-semibold uppercase flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              Filter:
            </span>
            {['all', 'online', 'cash_envelope', 'gold_silver', 'physical_gift'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  filterType === type
                    ? 'bg-maroon-900 text-amber-100 shadow-xs'
                    : 'bg-ivory-200 text-gray-700 hover:bg-amber-100'
                }`}
              >
                {type === 'all'
                  ? 'All'
                  : type === 'online'
                  ? 'Online UPI'
                  : type === 'cash_envelope'
                  ? 'Cash Envelope'
                  : type === 'gold_silver'
                  ? 'Gold/Silver'
                  : 'Physical'}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Ledger Table */}
      <Card className="overflow-hidden border-2 border-amber-200/80 shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-maroon-900 to-maroon-800 text-amber-100 text-xs font-semibold uppercase tracking-wider">
                <th className="py-4 px-6">Guest Name</th>
                <th className="py-4 px-6">Amount</th>
                <th className="py-4 px-6">Source</th>
                <th className="py-4 px-6">Milestone Fund</th>
                <th className="py-4 px-6">Date</th>
                <th className="py-4 px-6">Blessing &amp; Notes</th>
                <th className="py-4 px-6 text-right">Thank You</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-100 bg-white">
              {filteredEntries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-500">
                    No Shagun entries found matching your search.
                  </td>
                </tr>
              ) : (
                filteredEntries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-amber-50/50 transition-colors">
                    <td className="py-4 px-6 font-semibold text-gray-900">{entry.guest_name}</td>
                    <td className="py-4 px-6 font-serif font-bold text-maroon-900 text-base">
                      {formatINR(entry.amount)}
                    </td>
                    <td className="py-4 px-6">
                      <Badge
                        variant={
                          entry.gift_type === 'online'
                            ? 'maroon'
                            : entry.gift_type === 'cash_envelope'
                            ? 'gold'
                            : 'marigold'
                        }
                        size="sm"
                      >
                        {entry.gift_type === 'online'
                          ? 'UPI Online'
                          : entry.gift_type === 'cash_envelope'
                          ? 'Cash Envelope'
                          : entry.gift_type === 'gold_silver'
                          ? 'Gold / Silver'
                          : 'Physical Gift'}
                      </Badge>
                    </td>
                    <td className="py-4 px-6 text-xs text-gray-600">
                      {entry.fund_title || <span className="text-gray-400 italic">General Blessing</span>}
                    </td>
                    <td className="py-4 px-6 text-xs text-gray-500 whitespace-nowrap">
                      {entry.received_date}
                    </td>
                    <td className="py-4 px-6 text-xs text-gray-600 max-w-xs truncate">
                      {entry.notes || <span className="text-gray-300">-</span>}
                    </td>
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggleThankYou(entry)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            entry.thank_you_sent
                              ? 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                              : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                          }`}
                          title={entry.thank_you_sent ? 'Mark Unsent' : 'Mark Sent'}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenThankYou(entry)}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold text-maroon-900 bg-amber-100 hover:bg-amber-200 transition-colors"
                        >
                          Message
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Manual Offline Shagun Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Record Offline Shagun"
        subtitle="Keep your family records complete with cash envelopes & traditional gifts"
      >
        <form onSubmit={handleAddOfflineEntry} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Guest / Family Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Chachaji & Chachiji (Alwar) / Sharma Family"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-amber-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-maroon-800"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Shagun Amount (₹)
              </label>
              <input
                type="number"
                min="0"
                step="1"
                required
                placeholder="e.g. 5100 or 11000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-amber-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-maroon-800"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Gift Format
              </label>
              <select
                value={giftType}
                onChange={(e: any) => setGiftType(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-amber-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-maroon-800"
              >
                <option value="cash_envelope">Traditional Cash Envelope</option>
                <option value="gold_silver">Gold / Silver Coin / Item</option>
                <option value="physical_gift">Physical Gift</option>
                <option value="online">Online / Bank Direct</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Allocated Milestone (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Honeymoon / Home"
                value={fundTitle}
                onChange={(e) => setFundTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-amber-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-maroon-800"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Date Received
              </label>
              <input
                type="date"
                required
                value={receivedDate}
                onChange={(e) => setReceivedDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-amber-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-maroon-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Notes or Specific Details
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Given during Haldi ceremony with a box of dry fruits"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-amber-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-maroon-800"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-amber-200">
            <Button type="button" variant="ghost" size="md" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md">
              Save Entry
            </Button>
          </div>
        </form>
      </Modal>

      {/* Thank You Note Generator Modal */}
      <Modal
        isOpen={isThankYouModalOpen}
        onClose={() => setIsThankYouModalOpen(false)}
        title="Thank-You Message"
        subtitle={selectedEntry ? `For ${selectedEntry.guest_name} (${formatINR(selectedEntry.amount)})` : ''}
      >
        {selectedEntry && (
          <div className="space-y-4">
            <div className="bg-ivory-50 p-4 rounded-2xl border border-amber-300 text-xs font-serif text-gray-800 whitespace-pre-wrap leading-relaxed">
              {getThankYouText(selectedEntry)}
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-xs text-gray-500">
                Ready to paste into WhatsApp or SMS
              </span>
              <Button onClick={handleCopyThankYou} variant="primary" size="md" className="gap-2">
                {copiedMessage ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                <span>{copiedMessage ? 'Copied to Clipboard!' : 'Copy Message'}</span>
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

