import { Wedding, WeddingEvent, Fund, Contribution, LedgerEntry, RSVP, CameraRoll, Photo, ActivationPass } from './types';

export const INITIAL_WEDDING: Wedding = {
  id: 'wed-001',
  owner_id: 'couple-user-001',
  slug: 'aadarsh-and-shivani',
  partner_1_name: 'Aadarsh',
  partner_2_name: 'Shivani',
  partner_1_phone: '+91 98765 43210',
  partner_2_phone: '+91 98123 45678',
  couple_upi_id: 'aadarsh.shivani@okhdfcbank',
  couple_upi_qr_url: null,
  wedding_date: '2026-12-18',
  city: 'Udaipur, Rajasthan',
  cover_image_url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=1200',
  welcome_message: 'With the blessings and love of our families, elders, and friends, we invite you to celebrate our new beginning together.',
  default_roll_limit: 24,
  reveal_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  drive_folder_id: 'mock-drive-folder-123',
  encrypted_drive_refresh_token: 'mock-encrypted-token',
  razorpay_account_id: 'acc_mock_test_123',
  is_active: true,
  activation_code: 'SHAGUN-7777-2026',
  is_activated: true,
  activated_at: new Date().toISOString(),
  activation_expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  tradition_type: 'all_faith',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const INITIAL_PASSES: ActivationPass[] = [
  {
    id: 'pass-001',
    code: 'SHAGUN-7777-2026',
    price_paid: 999,
    is_claimed: true,
    claimed_by_wedding_id: 'wed-001',
    claimed_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: 'pass-002',
    code: 'SHAGUN-DEMO-PASS',
    price_paid: 999,
    is_claimed: false,
    claimed_by_wedding_id: null,
    claimed_at: null,
    expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
  },
];

export const INITIAL_EVENTS: WeddingEvent[] = [
  {
    id: 'evt-001',
    wedding_id: 'wed-001',
    name: 'Mehendi & Haldi',
    start_time: '2026-12-17T11:00:00.000Z',
    end_time: '2026-12-17T15:00:00.000Z',
    venue_name: 'Courtyard Poolside, The Oberoi Udaivilas',
    venue_address: 'Badi-Gorela-Mulla Talai Rd, Haridas Ji Ki Magri, Udaipur',
    maps_url: 'https://maps.google.com/?q=The+Oberoi+Udaivilas+Udaipur',
    sort_order: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: 'evt-002',
    wedding_id: 'wed-001',
    name: 'Sangeet & Cocktail Night',
    start_time: '2026-12-17T19:00:00.000Z',
    end_time: '2026-12-18T01:00:00.000Z',
    venue_name: 'Chandra Mahal Ballroom',
    venue_address: 'Haridas Ji Ki Magri, Udaipur',
    maps_url: 'https://maps.google.com/?q=The+Oberoi+Udaivilas+Udaipur',
    sort_order: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: 'evt-003',
    wedding_id: 'wed-001',
    name: 'Wedding Ceremony (Pheras)',
    start_time: '2026-12-18T16:30:00.000Z',
    end_time: '2026-12-18T20:00:00.000Z',
    venue_name: 'Lakeside Mandap, Lake Pichola',
    venue_address: 'Haridas Ji Ki Magri, Udaipur',
    maps_url: 'https://maps.google.com/?q=The+Oberoi+Udaivilas+Udaipur',
    sort_order: 3,
    created_at: new Date().toISOString(),
  },
  {
    id: 'evt-004',
    wedding_id: 'wed-001',
    name: 'Reception Dinner',
    start_time: '2026-12-18T20:30:00.000Z',
    end_time: '2026-12-18T23:59:00.000Z',
    venue_name: 'Mewar Lawns',
    venue_address: 'Haridas Ji Ki Magri, Udaipur',
    maps_url: 'https://maps.google.com/?q=The+Oberoi+Udaivilas+Udaipur',
    sort_order: 4,
    created_at: new Date().toISOString(),
  },
];

export const INITIAL_FUNDS: Fund[] = [
  {
    id: 'fund-001',
    wedding_id: 'wed-001',
    title: 'Honeymoon in Kerala Backwaters',
    description: 'Help us experience a quiet houseboat stay and ayurvedic retreat in Alleppey.',
    cover_image_url: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&q=80&w=800',
    target_amount: 150000,
    received_amount: 65400,
    contributor_count: 14,
    is_group_gift: false,
    external_product_url: null,
    is_amount_hidden: false,
    status: 'active',
    sort_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'fund-002',
    wedding_id: 'wed-001',
    title: 'Our First Home Library & Living Room',
    description: 'Contributions toward bookshelves, cozy reading chairs, and plants for our new home.',
    cover_image_url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800',
    target_amount: 200000,
    received_amount: 110200,
    contributor_count: 22,
    is_group_gift: false,
    external_product_url: null,
    is_amount_hidden: false,
    status: 'active',
    sort_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'fund-003',
    wedding_id: 'wed-001',
    title: 'Espresso Coffee Machine (Group Gift)',
    description: 'A shared group gift for our daily morning coffees together.',
    cover_image_url: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&q=80&w=800',
    target_amount: 45000,
    received_amount: 32000,
    contributor_count: 6,
    is_group_gift: true,
    external_product_url: 'https://www.amazon.in/dp/B08J5ZXZ29',
    is_amount_hidden: false,
    status: 'active',
    sort_order: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const INITIAL_CONTRIBUTIONS: Contribution[] = [
  {
    id: 'cnt-001',
    wedding_id: 'wed-001',
    fund_id: 'fund-001',
    guest_name: 'Sunil & Sunita Sharma',
    amount: 5100,
    blessing_message: 'Sada khush raho! Wishing you both a lifetime of love and peace.',
    is_amount_hidden: false,
    razorpay_order_id: 'order_mock_001',
    razorpay_payment_id: 'pay_mock_001',
    status: 'captured',
    captured_at: new Date(Date.now() - 3600000 * 5).toISOString(),
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: 'cnt-002',
    wedding_id: 'wed-001',
    fund_id: 'fund-002',
    guest_name: 'Ananya & Rohan (College Gang)',
    amount: 2100,
    blessing_message: 'So thrilled for you both! Can not wait for the Sangeet dance!',
    is_amount_hidden: false,
    razorpay_order_id: 'order_mock_002',
    razorpay_payment_id: 'pay_mock_002',
    status: 'captured',
    captured_at: new Date(Date.now() - 3600000 * 12).toISOString(),
    created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    id: 'cnt-003',
    wedding_id: 'wed-001',
    fund_id: 'fund-001',
    guest_name: 'Dadaji & Dadiji',
    amount: 11000,
    blessing_message: 'Jug jug jiyo! Bahut sara aashirwad.',
    is_amount_hidden: false,
    razorpay_order_id: 'order_mock_003',
    razorpay_payment_id: 'pay_mock_003',
    status: 'captured',
    captured_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
];

export const INITIAL_LEDGER: LedgerEntry[] = [
  {
    id: 'led-001',
    wedding_id: 'wed-001',
    guest_name: 'Sunil & Sunita Sharma',
    amount: 5100,
    gift_type: 'online',
    fund_title: 'Honeymoon in Kerala Backwaters',
    notes: 'Razorpay UPI payment pay_mock_001',
    thank_you_sent: true,
    received_date: '2026-11-15',
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: 'led-002',
    wedding_id: 'wed-001',
    guest_name: 'Dadaji & Dadiji',
    amount: 11000,
    gift_type: 'online',
    fund_title: 'Honeymoon in Kerala Backwaters',
    notes: 'Online Shagun blessing',
    thank_you_sent: false,
    received_date: '2026-11-14',
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: 'led-003',
    wedding_id: 'wed-001',
    guest_name: 'Chachaji & Chachiji (Alwar)',
    amount: 21000,
    gift_type: 'cash_envelope',
    fund_title: null,
    notes: 'Traditional silver coin & cash envelope given at Haldi',
    thank_you_sent: false,
    received_date: '2026-11-16',
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'led-004',
    wedding_id: 'wed-001',
    guest_name: 'Vikram Sethi (Mamu)',
    amount: 11000,
    gift_type: 'cash_envelope',
    fund_title: null,
    notes: 'Cash envelope with sweets box',
    thank_you_sent: false,
    received_date: '2026-11-16',
    created_at: new Date(Date.now() - 3600000 * 1).toISOString(),
  },
];

class MockStore {
  private weddings: Wedding[] = [INITIAL_WEDDING];
  private events: WeddingEvent[] = [...INITIAL_EVENTS];
  private funds: Fund[] = [...INITIAL_FUNDS];
  private contributions: Contribution[] = [...INITIAL_CONTRIBUTIONS];
  private ledger: LedgerEntry[] = [...INITIAL_LEDGER];
  private rsvps: RSVP[] = [];
  private rolls: CameraRoll[] = [];
  private photos: Photo[] = [];
  private activationPasses: ActivationPass[] = [...INITIAL_PASSES];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const storedWeddings = localStorage.getItem('shagun_weddings');
        if (storedWeddings) this.weddings = JSON.parse(storedWeddings);
        const storedEvents = localStorage.getItem('shagun_events');
        if (storedEvents) this.events = JSON.parse(storedEvents);
        const storedFunds = localStorage.getItem('shagun_funds');
        if (storedFunds) this.funds = JSON.parse(storedFunds);
        const storedContribs = localStorage.getItem('shagun_contributions');
        if (storedContribs) this.contributions = JSON.parse(storedContribs);
        const storedLedger = localStorage.getItem('shagun_ledger');
        if (storedLedger) this.ledger = JSON.parse(storedLedger);
        const storedRsvps = localStorage.getItem('shagun_rsvps');
        if (storedRsvps) this.rsvps = JSON.parse(storedRsvps);
        const storedRolls = localStorage.getItem('shagun_rolls');
        if (storedRolls) this.rolls = JSON.parse(storedRolls);
        const storedPhotos = localStorage.getItem('shagun_photos');
        if (storedPhotos) this.photos = JSON.parse(storedPhotos);
        const storedPasses = localStorage.getItem('shagun_activation_passes');
        if (storedPasses) this.activationPasses = JSON.parse(storedPasses);
      } catch (e) {
        console.warn('Could not load mock store from localStorage:', e);
      }
    }
  }

  private saveToStorage() {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem('shagun_weddings', JSON.stringify(this.weddings));
        localStorage.setItem('shagun_events', JSON.stringify(this.events));
        localStorage.setItem('shagun_funds', JSON.stringify(this.funds));
        localStorage.setItem('shagun_contributions', JSON.stringify(this.contributions));
        localStorage.setItem('shagun_ledger', JSON.stringify(this.ledger));
        localStorage.setItem('shagun_rsvps', JSON.stringify(this.rsvps));
        localStorage.setItem('shagun_rolls', JSON.stringify(this.rolls));
        localStorage.setItem('shagun_photos', JSON.stringify(this.photos));
        localStorage.setItem('shagun_activation_passes', JSON.stringify(this.activationPasses));
      } catch (e) {
        console.warn('Could not save mock store to localStorage:', e);
      }
    }
  }

  // Weddings
  getWeddingBySlug(slug: string): Wedding | undefined {
    return this.weddings.find(
      (w) => (w.slug === slug || (slug === 'aadarsh-and-riya' && w.slug === 'aadarsh-and-shivani')) && w.is_active
    );
  }

  getWeddingById(id: string): Wedding | undefined {
    return this.weddings.find((w) => w.id === id);
  }

  activateWedding(weddingId: string, customCode?: string): Wedding | undefined {
    const wedding = this.getWeddingById(weddingId);
    if (!wedding) return undefined;

    const code = customCode || `SHAGUN-${Math.floor(1000 + Math.random() * 9000)}-${new Date().getFullYear()}`;
    wedding.activation_code = code;
    wedding.is_activated = true;
    wedding.activated_at = new Date().toISOString();
    wedding.activation_expires_at = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    wedding.updated_at = new Date().toISOString();
    this.saveToStorage();
    return wedding;
  }

  // Activation Passes (Platform Scanner purchase, active for 30 days, single couple only)
  getAllActivationPasses(): ActivationPass[] {
    return this.activationPasses;
  }

  getActivationPassByCode(code: string): ActivationPass | undefined {
    if (!code) return undefined;
    return this.activationPasses.find((p) => p.code.trim().toUpperCase() === code.trim().toUpperCase());
  }

  createActivationPass(pricePaid: number = 999): ActivationPass {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let rand = '';
    for (let i = 0; i < 6; i++) {
      rand += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const code = `SHAGUN-${rand}-30D`;
    const newPass: ActivationPass = {
      id: `pass-${Date.now()}`,
      code,
      price_paid: pricePaid,
      is_claimed: false,
      claimed_by_wedding_id: null,
      claimed_at: null,
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date().toISOString(),
    };
    this.activationPasses.unshift(newPass);
    this.saveToStorage();
    return newPass;
  }

  claimActivationPass(code: string, weddingId: string): { success: boolean; message: string; pass?: ActivationPass } {
    const pass = this.getActivationPassByCode(code);
    if (!pass) {
      return { success: false, message: 'Invalid activation code. Please check your 30-day pass code.' };
    }
    if (pass.is_claimed && pass.claimed_by_wedding_id !== weddingId) {
      return {
        success: false,
        message: 'This activation code has already been registered by another couple. Each pass is strictly for 1 couple only.',
      };
    }
    if (new Date() > new Date(pass.expires_at)) {
      return { success: false, message: 'This activation pass has expired (30-day limit). Please acquire a fresh pass.' };
    }

    pass.is_claimed = true;
    pass.claimed_by_wedding_id = weddingId;
    pass.claimed_at = pass.claimed_at || new Date().toISOString();

    const wedding = this.getWeddingById(weddingId);
    if (wedding) {
      wedding.activation_code = pass.code;
      wedding.is_activated = true;
      wedding.activated_at = pass.claimed_at;
      wedding.activation_expires_at = pass.expires_at;
      wedding.updated_at = new Date().toISOString();
    }

    this.saveToStorage();
    return {
      success: true,
      message: 'Activation code successfully applied! Your 30-day wedding suite is active for your wedding only.',
      pass,
    };
  }

  getWeddingByOwner(ownerId: string): Wedding | undefined {
    return this.weddings.find((w) => w.owner_id === ownerId);
  }

  saveWedding(weddingData: Partial<Wedding> & { owner_id: string }): Wedding {
    const existingIndex = this.weddings.findIndex((w) => w.id === weddingData.id || w.owner_id === weddingData.owner_id);
    if (existingIndex >= 0) {
      this.weddings[existingIndex] = {
        ...this.weddings[existingIndex],
        ...weddingData,
        updated_at: new Date().toISOString(),
      };
      this.saveToStorage();
      return this.weddings[existingIndex];
    } else {
      const newWedding: Wedding = {
        id: weddingData.id || `wed-${Date.now()}`,
        owner_id: weddingData.owner_id,
        slug: weddingData.slug || 'our-wedding',
        partner_1_name: weddingData.partner_1_name || '',
        partner_2_name: weddingData.partner_2_name || '',
        partner_1_phone: weddingData.partner_1_phone || null,
        partner_2_phone: weddingData.partner_2_phone || null,
        couple_upi_id: weddingData.couple_upi_id || null,
        couple_upi_qr_url: weddingData.couple_upi_qr_url || null,
        wedding_date: weddingData.wedding_date || new Date().toISOString().split('T')[0],
        city: weddingData.city || '',
        cover_image_url: weddingData.cover_image_url || null,
        welcome_message: weddingData.welcome_message || '',
        default_roll_limit: weddingData.default_roll_limit || 24,
        reveal_at: weddingData.reveal_at || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        drive_folder_id: weddingData.drive_folder_id || null,
        encrypted_drive_refresh_token: weddingData.encrypted_drive_refresh_token || null,
        razorpay_account_id: weddingData.razorpay_account_id || null,
        is_activated: true,
        activation_code: weddingData.activation_code || `SHAGUN-${Math.random().toString(36).substring(2, 6).toUpperCase()}-2026`,
        activated_at: new Date().toISOString(),
        activation_expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        tradition_type: weddingData.tradition_type || 'all_faith',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      this.weddings.push(newWedding);
      this.saveToStorage();
      return newWedding;
    }
  }

  // Events
  getEvents(weddingId: string): WeddingEvent[] {
    return this.events.filter((e) => e.wedding_id === weddingId).sort((a, b) => a.sort_order - b.sort_order);
  }

  loadTraditionEvents(weddingId: string, ceremonies: Array<{ name: string; defaultVenue: string; description: string }>): WeddingEvent[] {
    // Keep custom events or replace with preset
    const wedding = this.getWeddingById(weddingId);
    const baseDate = wedding?.wedding_date || '2026-12-18';

    this.events = this.events.filter((e) => e.wedding_id !== weddingId);

    ceremonies.forEach((c, idx) => {
      const dayOffset = Math.floor(idx / 2);
      const eventDate = new Date(new Date(baseDate).getTime() + dayOffset * 86400000);
      const hour = idx % 2 === 0 ? 11 : 18;
      eventDate.setHours(hour, 0, 0, 0);

      this.events.push({
        id: `evt-preset-${Date.now()}-${idx}`,
        wedding_id: weddingId,
        name: c.name,
        start_time: eventDate.toISOString(),
        end_time: new Date(eventDate.getTime() + 4 * 3600000).toISOString(),
        venue_name: c.defaultVenue,
        venue_address: `${wedding?.city || 'Udaipur'}`,
        maps_url: `https://maps.google.com/?q=${encodeURIComponent(c.defaultVenue + ' ' + (wedding?.city || ''))}`,
        sort_order: idx + 1,
        created_at: new Date().toISOString(),
      });
    });

    this.saveToStorage();
    return this.getEvents(weddingId);
  }

  saveEvent(eventData: Partial<WeddingEvent> & { wedding_id: string; name: string; start_time: string; venue_name: string }): WeddingEvent {
    const index = this.events.findIndex((e) => e.id === eventData.id);
    if (index >= 0) {
      this.events[index] = { ...this.events[index], ...eventData };
      this.saveToStorage();
      return this.events[index];
    } else {
      const newEvent: WeddingEvent = {
        id: eventData.id || `evt-${Date.now()}`,
        wedding_id: eventData.wedding_id,
        name: eventData.name,
        start_time: eventData.start_time,
        end_time: eventData.end_time || null,
        venue_name: eventData.venue_name,
        venue_address: eventData.venue_address || null,
        maps_url: eventData.maps_url || null,
        sort_order: eventData.sort_order || this.events.length + 1,
        created_at: new Date().toISOString(),
      };
      this.events.push(newEvent);
      this.saveToStorage();
      return newEvent;
    }
  }

  deleteEvent(id: string): void {
    this.events = this.events.filter((e) => e.id !== id);
    this.saveToStorage();
  }

  // Funds
  getFunds(weddingId: string): Fund[] {
    return this.funds.filter((f) => f.wedding_id === weddingId).sort((a, b) => a.sort_order - b.sort_order);
  }

  saveFund(fundData: Partial<Fund> & { wedding_id: string; title: string }): Fund {
    const index = this.funds.findIndex((f) => f.id === fundData.id);
    if (index >= 0) {
      this.funds[index] = { ...this.funds[index], ...fundData, updated_at: new Date().toISOString() };
      this.saveToStorage();
      return this.funds[index];
    } else {
      const newFund: Fund = {
        id: fundData.id || `fund-${Date.now()}`,
        wedding_id: fundData.wedding_id,
        title: fundData.title,
        description: fundData.description || null,
        cover_image_url: fundData.cover_image_url || 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800',
        target_amount: fundData.target_amount || null,
        received_amount: 0,
        contributor_count: 0,
        is_group_gift: !!fundData.is_group_gift,
        external_product_url: fundData.external_product_url || null,
        is_amount_hidden: !!fundData.is_amount_hidden,
        status: fundData.status || 'active',
        sort_order: fundData.sort_order || this.funds.length + 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      this.funds.push(newFund);
      this.saveToStorage();
      return newFund;
    }
  }

  deleteFund(id: string): void {
    this.funds = this.funds.filter((f) => f.id !== id);
    this.saveToStorage();
  }

  // Contributions & Ledger
  getContributions(weddingId: string): Contribution[] {
    return this.contributions.filter((c) => c.wedding_id === weddingId && c.status === 'captured');
  }

  recordCapturedContribution(data: {
    wedding_id: string;
    fund_id?: string | null;
    guest_name: string;
    amount: number;
    blessing_message?: string | null;
    is_amount_hidden?: boolean;
    razorpay_order_id: string;
    razorpay_payment_id: string;
  }): Contribution {
    // Check for idempotency
    const existing = this.contributions.find((c) => c.razorpay_payment_id === data.razorpay_payment_id);
    if (existing) return existing;

    const newContrib: Contribution = {
      id: `cnt-${Date.now()}`,
      wedding_id: data.wedding_id,
      fund_id: data.fund_id || null,
      guest_name: data.guest_name,
      amount: data.amount,
      blessing_message: data.blessing_message || null,
      is_amount_hidden: !!data.is_amount_hidden,
      razorpay_order_id: data.razorpay_order_id,
      razorpay_payment_id: data.razorpay_payment_id,
      status: 'captured',
      captured_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    };
    this.contributions.unshift(newContrib);

    // Update fund metrics
    if (data.fund_id) {
      const fund = this.funds.find((f) => f.id === data.fund_id);
      if (fund) {
        fund.received_amount += data.amount;
        fund.contributor_count += 1;
      }
    }

    // Add to ledger
    const fundObj = data.fund_id ? this.funds.find((f) => f.id === data.fund_id) : null;
    this.ledger.unshift({
      id: `led-${Date.now()}`,
      wedding_id: data.wedding_id,
      guest_name: data.guest_name,
      amount: data.amount,
      gift_type: 'online',
      fund_title: fundObj?.title || null,
      notes: data.blessing_message || 'Online Shagun gift',
      thank_you_sent: false,
      received_date: new Date().toISOString().split('T')[0],
      created_at: new Date().toISOString(),
    });

    this.saveToStorage();
    return newContrib;
  }

  getLedger(weddingId: string): LedgerEntry[] {
    return this.ledger.filter((l) => l.wedding_id === weddingId);
  }

  addOfflineLedgerEntry(entry: Omit<LedgerEntry, 'id' | 'created_at'>): LedgerEntry {
    const newEntry: LedgerEntry = {
      ...entry,
      id: `led-off-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    this.ledger.unshift(newEntry);
    this.saveToStorage();
    return newEntry;
  }

  updateLedgerEntry(id: string, updates: Partial<LedgerEntry>): void {
    const idx = this.ledger.findIndex((l) => l.id === id);
    if (idx >= 0) {
      this.ledger[idx] = { ...this.ledger[idx], ...updates };
      this.saveToStorage();
    }
  }

  deleteLedgerEntry(id: string): void {
    this.ledger = this.ledger.filter((l) => l.id !== id);
    this.saveToStorage();
  }

  // Camera Roll
  getOrCreateRoll(weddingId: string, guestSessionId: string, guestName: string): CameraRoll {
    let roll = this.rolls.find((r) => r.wedding_id === weddingId && r.guest_session_id === guestSessionId);
    if (!roll) {
      const wedding = this.getWeddingById(weddingId);
      roll = {
        id: `roll-${Date.now()}`,
        wedding_id: weddingId,
        guest_session_id: guestSessionId,
        guest_name: guestName,
        shots_used: 0,
        roll_limit: wedding?.default_roll_limit || 24,
        created_at: new Date().toISOString(),
      };
      this.rolls.push(roll);
      this.saveToStorage();
    }
    return roll;
  }

  incrementRollShot(rollId: string): boolean {
    const roll = this.rolls.find((r) => r.id === rollId);
    if (!roll || roll.shots_used >= roll.roll_limit) {
      return false;
    }
    roll.shots_used += 1;
    roll.last_shot_at = new Date().toISOString();
    this.saveToStorage();
    return true;
  }

  // Photos
  savePhoto(photoData: Omit<Photo, 'id' | 'captured_at' | 'uploaded_at'>): Photo {
    const newPhoto: Photo = {
      ...photoData,
      id: `pho-${Date.now()}`,
      captured_at: new Date().toISOString(),
      uploaded_at: new Date().toISOString(),
    };
    this.photos.unshift(newPhoto);
    this.saveToStorage();
    return newPhoto;
  }

  getPhotos(weddingId: string, rollId?: string, isOwner = false): Photo[] {
    const wedding = this.getWeddingById(weddingId);
    const isRevealed = wedding ? new Date() >= new Date(wedding.reveal_at) : false;

    return this.photos.filter((p) => {
      if (p.wedding_id !== weddingId || p.is_deleted) return false;
      if (isOwner) return true; // Owner can see all non-deleted
      if (p.is_hidden_by_couple) return false;
      if (!isRevealed) return false; // Guests cannot see before reveal
      if (rollId && p.roll_id !== rollId) return false; // Guests see only their own roll
      return true;
    });
  }

  updatePhoto(id: string, updates: Partial<Photo>): void {
    const idx = this.photos.findIndex((p) => p.id === id);
    if (idx >= 0) {
      this.photos[idx] = { ...this.photos[idx], ...updates };
      this.saveToStorage();
    }
  }

  // RSVPs
  saveRsvp(rsvpData: Omit<RSVP, 'id' | 'created_at'>): RSVP {
    const newRsvp: RSVP = {
      ...rsvpData,
      id: `rsvp-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    this.rsvps.unshift(newRsvp);
    this.saveToStorage();
    return newRsvp;
  }

  getRsvps(weddingId: string): RSVP[] {
    return this.rsvps.filter((r) => r.wedding_id === weddingId);
  }
}

export const mockStore = new MockStore();

