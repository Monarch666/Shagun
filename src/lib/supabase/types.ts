export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      weddings: {
        Row: Wedding;
        Insert: Omit<Wedding, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Wedding, 'id'>>;
      };
      events: {
        Row: WeddingEvent;
        Insert: Omit<WeddingEvent, 'id' | 'created_at'>;
        Update: Partial<Omit<WeddingEvent, 'id'>>;
      };
      funds: {
        Row: Fund;
        Insert: Omit<Fund, 'id' | 'created_at' | 'updated_at' | 'received_amount' | 'contributor_count'>;
        Update: Partial<Omit<Fund, 'id'>>;
      };
      contributions: {
        Row: Contribution;
        Insert: Omit<Contribution, 'id' | 'created_at'>;
        Update: Partial<Omit<Contribution, 'id'>>;
      };
      ledger_entries: {
        Row: LedgerEntry;
        Insert: Omit<LedgerEntry, 'id' | 'created_at'>;
        Update: Partial<Omit<LedgerEntry, 'id'>>;
      };
      rsvps: {
        Row: RSVP;
        Insert: Omit<RSVP, 'id' | 'created_at'>;
        Update: Partial<Omit<RSVP, 'id'>>;
      };
      camera_rolls: {
        Row: CameraRoll;
        Insert: Omit<CameraRoll, 'id' | 'created_at' | 'shots_used'>;
        Update: Partial<Omit<CameraRoll, 'id'>>;
      };
      photos: {
        Row: Photo;
        Insert: Omit<Photo, 'id' | 'captured_at' | 'uploaded_at'>;
        Update: Partial<Omit<Photo, 'id'>>;
      };
    };
  };
}

export interface Wedding {
  id: string;
  owner_id: string;
  slug: string;
  partner_1_name: string;
  partner_2_name: string;
  partner_1_phone?: string | null;
  partner_2_phone?: string | null;
  couple_upi_id?: string | null;
  couple_upi_qr_url?: string | null;
  wedding_date: string;
  city: string;
  cover_image_url?: string | null;
  welcome_message?: string | null;
  default_roll_limit: number;
  reveal_at: string;
  drive_folder_id?: string | null;
  encrypted_drive_refresh_token?: string | null;
  razorpay_account_id?: string | null;
  is_active: boolean;
  activation_code?: string;
  is_activated: boolean;
  activated_at?: string | null;
  activation_expires_at?: string | null;
  tradition_type?: 'all_faith' | 'hindu' | 'muslim' | 'christian' | 'sikh' | 'custom';
  created_at: string;
  updated_at: string;
}

export interface ActivationPass {
  id: string;
  code: string;
  price_paid: number;
  is_claimed: boolean;
  claimed_by_wedding_id?: string | null;
  claimed_at?: string | null;
  expires_at: string;
  created_at: string;
}

export interface WeddingEvent {
  id: string;
  wedding_id: string;
  name: string;
  start_time: string;
  end_time?: string | null;
  venue_name: string;
  venue_address?: string | null;
  maps_url?: string | null;
  sort_order: number;
  created_at: string;
}

export interface Fund {
  id: string;
  wedding_id: string;
  title: string;
  description?: string | null;
  cover_image_url?: string | null;
  target_amount?: number | null; // in INR
  received_amount: number; // in INR
  contributor_count: number;
  is_group_gift: boolean;
  external_product_url?: string | null;
  is_amount_hidden: boolean;
  status: 'active' | 'paused' | 'completed';
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Contribution {
  id: string;
  wedding_id: string;
  fund_id?: string | null;
  guest_name: string;
  amount: number; // in INR
  blessing_message?: string | null;
  is_amount_hidden: boolean;
  razorpay_order_id: string;
  razorpay_payment_id?: string | null;
  status: 'pending' | 'captured' | 'failed';
  payment_metadata?: Json;
  captured_at?: string | null;
  created_at: string;
}

export interface LedgerEntry {
  id: string;
  wedding_id: string;
  guest_name: string;
  amount: number; // in INR
  gift_type: 'online' | 'cash_envelope' | 'gold_silver' | 'physical_gift';
  fund_title?: string | null;
  notes?: string | null;
  thank_you_sent: boolean;
  received_date: string;
  created_at: string;
}

export interface RSVP {
  id: string;
  wedding_id: string;
  guest_name: string;
  phone?: string | null;
  attendee_count: number;
  attendance_status: 'attending' | 'not_attending' | 'tentative';
  attending_events?: string[];
  dietary_or_notes?: string | null;
  created_at: string;
}

export interface CameraRoll {
  id: string;
  wedding_id: string;
  guest_session_id: string;
  guest_name: string;
  shots_used: number;
  roll_limit: number;
  created_at: string;
  last_shot_at?: string | null;
}

export interface Photo {
  id: string;
  wedding_id: string;
  roll_id: string;
  event_id?: string | null;
  google_drive_file_id: string;
  drive_thumbnail_url?: string | null;
  drive_web_content_link?: string | null;
  client_photo_hash?: string | null;
  width?: number | null;
  height?: number | null;
  is_hidden_by_couple: boolean;
  is_deleted: boolean;
  captured_at: string;
  uploaded_at: string;
}
