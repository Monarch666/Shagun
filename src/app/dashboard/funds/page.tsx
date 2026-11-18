'use client';

import React, { useState, useEffect } from 'react';
import {
  Gift,
  Plus,
  Trash2,
  Edit2,
  ExternalLink,
  Eye,
  EyeOff,
  CheckCircle2,
  PauseCircle,
  PlayCircle,
  Layers,
  Sparkles,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { mockStore } from '@/lib/supabase/mock-store';
import { Fund, Wedding } from '@/lib/supabase/types';
import { formatINR } from '@/lib/utils/currency';

export default function FundsManagementPage() {
  const [wedding, setWedding] = useState<Wedding | null>(null);
  const [funds, setFunds] = useState<Fund[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFundId, setEditingFundId] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [targetAmount, setTargetAmount] = useState<string>('');
  const [isGroupGift, setIsGroupGift] = useState(false);
  const [externalProductUrl, setExternalProductUrl] = useState('');
  const [isAmountHidden, setIsAmountHidden] = useState(false);
  const [status, setStatus] = useState<'active' | 'paused' | 'completed'>('active');

  useEffect(() => {
    const w = mockStore.getWeddingById('wed-001') || mockStore.getWeddingBySlug('aadarsh-and-shivani');
    if (w) {
      setWedding(w);
      setFunds(mockStore.getFunds(w.id));
    }
  }, []);

  const handleOpenAdd = () => {
    if (funds.length >= 6) {
      alert('You have reached the maximum of 6 funds for a focused, elegant guest experience.');
      return;
    }
    setEditingFundId(null);
    setTitle('');
    setDescription('');
    setCoverImageUrl('https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800');
    setTargetAmount('');
    setIsGroupGift(false);
    setExternalProductUrl('');
    setIsAmountHidden(false);
    setStatus('active');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (fund: Fund) => {
    setEditingFundId(fund.id);
    setTitle(fund.title);
    setDescription(fund.description || '');
    setCoverImageUrl(fund.cover_image_url || '');
    setTargetAmount(fund.target_amount ? fund.target_amount.toString() : '');
    setIsGroupGift(fund.is_group_gift);
    setExternalProductUrl(fund.external_product_url || '');
    setIsAmountHidden(fund.is_amount_hidden);
    setStatus(fund.status);
    setIsModalOpen(true);
  };

  const handleSaveFund = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wedding) return;

    mockStore.saveFund({
      id: editingFundId || undefined,
      wedding_id: wedding.id,
      title,
      description,
      cover_image_url: coverImageUrl,
      target_amount: targetAmount ? parseInt(targetAmount, 10) : null,
      is_group_gift: isGroupGift,
      external_product_url: isGroupGift ? externalProductUrl : null,
      is_amount_hidden: isAmountHidden,
      status,
    });

    setFunds(mockStore.getFunds(wedding.id));
    setIsModalOpen(false);
  };

  const handleDeleteFund = (id: string) => {
    if (!wedding) return;
    if (confirm('Are you sure you want to remove this milestone fund?')) {
      mockStore.deleteFund(id);
      setFunds(mockStore.getFunds(wedding.id));
    }
  };

  const toggleStatus = (fund: Fund) => {
    if (!wedding) return;
    const newStatus = fund.status === 'active' ? 'paused' : 'active';
    mockStore.saveFund({
      id: fund.id,
      wedding_id: wedding.id,
      title: fund.title,
      status: newStatus,
    });
    setFunds(mockStore.getFunds(wedding.id));
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-maroon-950">Milestone Gift Funds</h1>
          <p className="mt-1 text-sm text-gray-600">
            Define 1 to 6 meaningful goals (Honeymoon, home dreams, or group gifts) for guests to bless.
          </p>
        </div>
        <Button
          onClick={handleOpenAdd}
          variant="secondary"
          size="md"
          className="gap-2"
          disabled={funds.length >= 6}
        >
          <Plus className="w-4 h-4" />
          <span>Create New Fund ({funds.length}/6)</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {funds.map((fund) => {
          const progressPercent = fund.target_amount
            ? Math.min(100, Math.round((fund.received_amount / fund.target_amount) * 100))
            : null;

          return (
            <Card key={fund.id} className="flex flex-col overflow-hidden border-2 border-amber-200/80">
              <div className="relative h-44 w-full bg-gray-100 overflow-hidden">
                {fund.cover_image_url ? (
                  <img
                    src={fund.cover_image_url}
                    alt={fund.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-amber-100 text-maroon-900">
                    <Gift className="w-12 h-12 opacity-40" />
                  </div>
                )}
                <div className="absolute top-3 left-3 flex gap-2">
                  <Badge
                    variant={
                      fund.status === 'active' ? 'green' : fund.status === 'paused' ? 'gray' : 'gold'
                    }
                    size="sm"
                  >
                    {fund.status.toUpperCase()}
                  </Badge>
                  {fund.is_group_gift && (
                    <Badge variant="marigold" size="sm">
                      Group Gift
                    </Badge>
                  )}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-lg font-bold text-maroon-950 mb-1">{fund.title}</h3>
                  {fund.description && (
                    <p className="text-xs text-gray-600 line-clamp-2 mb-4">{fund.description}</p>
                  )}

                  {/* Progress Section */}
                  <div className="space-y-2 mb-4 bg-ivory-50 p-3 rounded-xl border border-amber-100">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500 font-medium">Received:</span>
                      <strong className="text-maroon-950 font-serif font-bold text-sm">
                        {fund.is_amount_hidden ? 'Amounts Hidden' : formatINR(fund.received_amount)}
                      </strong>
                    </div>

                    {fund.target_amount && !fund.is_amount_hidden && (
                      <>
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-marigold-500 to-maroon-800 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-[11px] text-gray-500">
                          <span>{progressPercent}% of target</span>
                          <span>Target: {formatINR(fund.target_amount)}</span>
                        </div>
                      </>
                    )}

                    <div className="text-[11px] text-gray-500">
                      <span>{fund.contributor_count} blessings received</span>
                    </div>
                  </div>

                  {fund.external_product_url && (
                    <a
                      href={fund.external_product_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-maroon-800 font-semibold hover:underline mb-4"
                    >
                      <span>View Product Website</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-amber-100 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => toggleStatus(fund)}
                      className="p-1.5 text-gray-500 hover:text-maroon-900 rounded-lg hover:bg-amber-100 transition-colors"
                      title={fund.status === 'active' ? 'Pause Fund' : 'Resume Fund'}
                    >
                      {fund.status === 'active' ? (
                        <PauseCircle className="w-4 h-4" />
                      ) : (
                        <PlayCircle className="w-4 h-4 text-emerald-600" />
                      )}
                    </button>
                    <button
                      onClick={() => handleOpenEdit(fund)}
                      className="p-1.5 text-gray-500 hover:text-maroon-900 rounded-lg hover:bg-amber-100 transition-colors"
                      title="Edit Fund"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    onClick={() => handleDeleteFund(fund.id)}
                    className="p-1.5 text-gray-400 hover:text-red-700 rounded-lg hover:bg-red-50 transition-colors"
                    title="Delete Fund"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingFundId ? 'Edit Milestone Fund' : 'Create Milestone Fund'}
        subtitle="Give your guests meaningful inspiration for their blessings"
      >
        <form onSubmit={handleSaveFund} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Fund Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Honeymoon in Bali / Our First Home / Dining Table"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-amber-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-maroon-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Description
            </label>
            <textarea
              rows={2}
              placeholder="Share a short note on what this dream means to you..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-amber-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-maroon-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Cover Image URL
            </label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={coverImageUrl}
              onChange={(e) => setCoverImageUrl(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-amber-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-maroon-800"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Target Amount (₹ Optional)
              </label>
              <input
                type="number"
                min="0"
                step="500"
                placeholder="e.g. 150000"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-amber-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-maroon-800"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e: any) => setStatus(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-amber-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-maroon-800"
              >
                <option value="active">Active (Visible to guests)</option>
                <option value="paused">Paused (Temporarily closed)</option>
                <option value="completed">Completed (Goal reached)</option>
              </select>
            </div>
          </div>

          <div className="pt-2 space-y-3">
            <label className="flex items-center gap-2 text-xs font-medium text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={isGroupGift}
                onChange={(e) => setIsGroupGift(e.target.checked)}
                className="rounded text-maroon-800 focus:ring-maroon-800 h-4 w-4"
              />
              <span>This represents a physical group gift (e.g. coffee machine, furniture)</span>
            </label>

            {isGroupGift && (
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  External Product URL
                </label>
                <input
                  type="url"
                  placeholder="https://www.amazon.in/... or brand product link"
                  value={externalProductUrl}
                  onChange={(e) => setExternalProductUrl(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-amber-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-maroon-800"
                />
              </div>
            )}

            <label className="flex items-center gap-2 text-xs font-medium text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={isAmountHidden}
                onChange={(e) => setIsAmountHidden(e.target.checked)}
                className="rounded text-maroon-800 focus:ring-maroon-800 h-4 w-4"
              />
              <span>Hide collected amount from public view (shows only blessings count)</span>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-amber-200">
            <Button
              type="button"
              variant="ghost"
              size="md"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md">
              Save Fund
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

