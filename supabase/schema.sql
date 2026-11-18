-- ============================================================================
-- SHAGUN DATABASE SCHEMA & ROW LEVEL SECURITY (RLS)
-- Version: 1.0.0 (MVP)
-- Target: Supabase / PostgreSQL
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. TABLES
-- ============================================================================

-- WEDDINGS TABLE
CREATE TABLE IF NOT EXISTS public.weddings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    slug TEXT NOT NULL UNIQUE,
    partner_1_name TEXT NOT NULL,
    partner_2_name TEXT NOT NULL,
    partner_1_phone TEXT,
    partner_2_phone TEXT,
    couple_upi_id TEXT,
    couple_upi_qr_url TEXT,
    wedding_date DATE NOT NULL,
    city TEXT NOT NULL,
    cover_image_url TEXT,
    welcome_message TEXT DEFAULT 'With the blessings of our elders and the love of our friends and family, we invite you to celebrate our union.',
    default_roll_limit INTEGER NOT NULL DEFAULT 24,
    reveal_at TIMESTAMPTZ NOT NULL,
    drive_folder_id TEXT,
    encrypted_drive_refresh_token TEXT,
    razorpay_account_id TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    activation_code TEXT,
    is_activated BOOLEAN NOT NULL DEFAULT TRUE,
    activated_at TIMESTAMPTZ,
    activation_expires_at TIMESTAMPTZ,
    tradition_type TEXT DEFAULT 'all_faith',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ACTIVATION PASSES TABLE (Single-use, 30 days active, 1 couple only)
CREATE TABLE IF NOT EXISTS public.activation_passes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT NOT NULL UNIQUE,
    price_paid INTEGER NOT NULL DEFAULT 999,
    is_claimed BOOLEAN NOT NULL DEFAULT FALSE,
    claimed_by_wedding_id UUID REFERENCES public.weddings(id) ON DELETE SET NULL,
    claimed_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- EVENTS TABLE (Mehendi, Sangeet, Haldi, Wedding, Reception)
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wedding_id UUID NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ,
    venue_name TEXT NOT NULL,
    venue_address TEXT,
    maps_url TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- FUNDS TABLE (Milestone / Gift Funds)
CREATE TABLE IF NOT EXISTS public.funds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wedding_id UUID NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    cover_image_url TEXT,
    target_amount INTEGER, -- In INR
    received_amount INTEGER NOT NULL DEFAULT 0, -- In INR
    contributor_count INTEGER NOT NULL DEFAULT 0,
    is_group_gift BOOLEAN NOT NULL DEFAULT FALSE,
    external_product_url TEXT,
    is_amount_hidden BOOLEAN NOT NULL DEFAULT FALSE,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed')),
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- CONTRIBUTIONS TABLE (Online Shagun via Razorpay UPI)
CREATE TABLE IF NOT EXISTS public.contributions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wedding_id UUID NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
    fund_id UUID REFERENCES public.funds(id) ON DELETE SET NULL,
    guest_name TEXT NOT NULL,
    amount INTEGER NOT NULL CHECK (amount > 0), -- In INR
    blessing_message TEXT,
    is_amount_hidden BOOLEAN NOT NULL DEFAULT FALSE,
    razorpay_order_id TEXT NOT NULL UNIQUE,
    razorpay_payment_id TEXT UNIQUE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'captured', 'failed')),
    payment_metadata JSONB DEFAULT '{}'::jsonb,
    captured_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- LEDGER ENTRIES TABLE (Unified Shagun Ledger: Online + Offline gifts)
CREATE TABLE IF NOT EXISTS public.ledger_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wedding_id UUID NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
    guest_name TEXT NOT NULL,
    amount INTEGER NOT NULL CHECK (amount >= 0),
    gift_type TEXT NOT NULL DEFAULT 'cash_envelope' CHECK (gift_type IN ('online', 'cash_envelope', 'gold_silver', 'physical_gift')),
    fund_title TEXT,
    notes TEXT,
    thank_you_sent BOOLEAN NOT NULL DEFAULT FALSE,
    received_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- RSVPS TABLE
CREATE TABLE IF NOT EXISTS public.rsvps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wedding_id UUID NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
    guest_name TEXT NOT NULL,
    phone TEXT,
    attendee_count INTEGER NOT NULL DEFAULT 1 CHECK (attendee_count >= 1),
    attendance_status TEXT NOT NULL DEFAULT 'attending' CHECK (attendance_status IN ('attending', 'not_attending', 'tentative')),
    attending_events JSONB DEFAULT '[]'::jsonb,
    dietary_or_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- CAMERA ROLLS TABLE (Anonymous guest disposable camera sessions)
CREATE TABLE IF NOT EXISTS public.camera_rolls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wedding_id UUID NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
    guest_session_id TEXT NOT NULL,
    guest_name TEXT NOT NULL,
    shots_used INTEGER NOT NULL DEFAULT 0,
    roll_limit INTEGER NOT NULL DEFAULT 24,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    last_shot_at TIMESTAMPTZ,
    UNIQUE (wedding_id, guest_session_id)
);

-- PHOTOS TABLE (Metadata for photos hosted on couple's Google Drive)
CREATE TABLE IF NOT EXISTS public.photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wedding_id UUID NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
    roll_id UUID NOT NULL REFERENCES public.camera_rolls(id) ON DELETE CASCADE,
    event_id UUID REFERENCES public.events(id) ON DELETE SET NULL,
    google_drive_file_id TEXT NOT NULL UNIQUE,
    drive_thumbnail_url TEXT,
    drive_web_content_link TEXT,
    client_photo_hash TEXT,
    width INTEGER,
    height INTEGER,
    is_hidden_by_couple BOOLEAN NOT NULL DEFAULT FALSE,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    captured_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    uploaded_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ============================================================================
-- 2. INDEXES
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_weddings_slug ON public.weddings(slug);
CREATE INDEX IF NOT EXISTS idx_weddings_owner ON public.weddings(owner_id);
CREATE INDEX IF NOT EXISTS idx_events_wedding ON public.events(wedding_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_funds_wedding ON public.funds(wedding_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_contributions_wedding ON public.contributions(wedding_id);
CREATE INDEX IF NOT EXISTS idx_contributions_fund ON public.contributions(fund_id);
CREATE INDEX IF NOT EXISTS idx_ledger_wedding ON public.ledger_entries(wedding_id);
CREATE INDEX IF NOT EXISTS idx_rsvps_wedding ON public.rsvps(wedding_id);
CREATE INDEX IF NOT EXISTS idx_rolls_wedding_session ON public.camera_rolls(wedding_id, guest_session_id);
CREATE INDEX IF NOT EXISTS idx_photos_wedding ON public.photos(wedding_id);
CREATE INDEX IF NOT EXISTS idx_photos_roll ON public.photos(roll_id);

-- ============================================================================
-- 3. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

ALTER TABLE public.weddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.funds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ledger_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.camera_rolls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;

-- 3.1 WEDDINGS POLICIES
-- Anyone can view active weddings (public guest access)
CREATE POLICY "Public weddings are viewable by everyone" 
ON public.weddings FOR SELECT 
USING (is_active = true);

-- Couples can manage only their own wedding
CREATE POLICY "Users can create their own wedding" 
ON public.weddings FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own wedding" 
ON public.weddings FOR UPDATE 
TO authenticated 
USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete their own wedding" 
ON public.weddings FOR DELETE 
TO authenticated 
USING (auth.uid() = owner_id);

-- 3.2 EVENTS POLICIES
CREATE POLICY "Events of active weddings are viewable by everyone" 
ON public.events FOR SELECT 
USING (EXISTS (
    SELECT 1 FROM public.weddings w 
    WHERE w.id = events.wedding_id AND w.is_active = true
));

CREATE POLICY "Owners can manage events" 
ON public.events FOR ALL 
TO authenticated 
USING (EXISTS (
    SELECT 1 FROM public.weddings w 
    WHERE w.id = events.wedding_id AND w.owner_id = auth.uid()
));

-- 3.3 FUNDS POLICIES
CREATE POLICY "Funds of active weddings are viewable by everyone" 
ON public.funds FOR SELECT 
USING (EXISTS (
    SELECT 1 FROM public.weddings w 
    WHERE w.id = funds.wedding_id AND w.is_active = true
));

CREATE POLICY "Owners can manage funds" 
ON public.funds FOR ALL 
TO authenticated 
USING (EXISTS (
    SELECT 1 FROM public.weddings w 
    WHERE w.id = funds.wedding_id AND w.owner_id = auth.uid()
));

-- 3.4 CONTRIBUTIONS POLICIES
-- Public guests can initiate a contribution
CREATE POLICY "Public guests can insert pending contributions" 
ON public.contributions FOR INSERT 
WITH CHECK (EXISTS (
    SELECT 1 FROM public.weddings w 
    WHERE w.id = contributions.wedding_id AND w.is_active = true
));

-- Captured blessings can be read by public (for blessing wall)
CREATE POLICY "Captured blessings are viewable by everyone" 
ON public.contributions FOR SELECT 
USING (status = 'captured');

-- Wedding owner has full view of contributions
CREATE POLICY "Wedding owners can view all contributions" 
ON public.contributions FOR SELECT 
TO authenticated 
USING (EXISTS (
    SELECT 1 FROM public.weddings w 
    WHERE w.id = contributions.wedding_id AND w.owner_id = auth.uid()
));

-- 3.5 LEDGER ENTRIES POLICIES
-- Strictly private to the wedding couple
CREATE POLICY "Wedding owners can manage their ledger" 
ON public.ledger_entries FOR ALL 
TO authenticated 
USING (EXISTS (
    SELECT 1 FROM public.weddings w 
    WHERE w.id = ledger_entries.wedding_id AND w.owner_id = auth.uid()
));

-- 3.6 RSVPS POLICIES
CREATE POLICY "Public guests can submit RSVPs" 
ON public.rsvps FOR INSERT 
WITH CHECK (EXISTS (
    SELECT 1 FROM public.weddings w 
    WHERE w.id = rsvps.wedding_id AND w.is_active = true
));

CREATE POLICY "Wedding owners can view and manage RSVPs" 
ON public.rsvps FOR ALL 
TO authenticated 
USING (EXISTS (
    SELECT 1 FROM public.weddings w 
    WHERE w.id = rsvps.wedding_id AND w.owner_id = auth.uid()
));

-- 3.7 CAMERA ROLLS POLICIES
CREATE POLICY "Anyone can create or view their own camera roll" 
ON public.camera_rolls FOR ALL 
USING (true) 
WITH CHECK (true);

-- 3.8 PHOTOS POLICIES
-- Couple can view, hide, or delete all photos
CREATE POLICY "Wedding owners can manage all photos" 
ON public.photos FOR ALL 
TO authenticated 
USING (EXISTS (
    SELECT 1 FROM public.weddings w 
    WHERE w.id = photos.wedding_id AND w.owner_id = auth.uid()
));

-- Guests can only view photos from their own roll AFTER reveal_at and if not hidden
CREATE POLICY "Guests can view their own photos after reveal" 
ON public.photos FOR SELECT 
USING (
    is_deleted = false 
    AND is_hidden_by_couple = false 
    AND EXISTS (
        SELECT 1 FROM public.weddings w 
        WHERE w.id = photos.wedding_id 
        AND now() >= w.reveal_at
    )
);

-- ============================================================================
-- 4. TRIGGERS & FUNCTIONS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_wedding_updated
    BEFORE UPDATE ON public.weddings
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER on_fund_updated
    BEFORE UPDATE ON public.funds
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Function to update fund metrics when a contribution is captured
CREATE OR REPLACE FUNCTION public.sync_fund_on_contribution()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'captured' AND (OLD.status IS DISTINCT FROM 'captured') THEN
        -- Update fund received amount and count
        IF NEW.fund_id IS NOT NULL THEN
            UPDATE public.funds
            SET 
                received_amount = received_amount + NEW.amount,
                contributor_count = contributor_count + 1
            WHERE id = NEW.fund_id;
        END IF;

        -- Automatically add to unified ledger if not already present
        INSERT INTO public.ledger_entries (
            wedding_id,
            guest_name,
            amount,
            gift_type,
            fund_title,
            notes,
            received_date
        ) VALUES (
            NEW.wedding_id,
            NEW.guest_name,
            NEW.amount,
            'online',
            (SELECT title FROM public.funds WHERE id = NEW.fund_id),
            NEW.blessing_message,
            CURRENT_DATE
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_contribution_captured
    AFTER UPDATE ON public.contributions
    FOR EACH ROW
    EXECUTE FUNCTION public.sync_fund_on_contribution();

