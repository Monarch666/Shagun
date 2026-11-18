# Shagun (शगुन) – Wedding Gifting & Memories Platform
A modern, respectful, mobile-first wedding gifting and memories web platform designed specifically for the Indian wedding ecosystem.

---

## 1. Core Features

1. **Dignified Shagun (Gifting):**
   - Guests contribute via Razorpay UPI toward couple-defined milestone funds (*"Honeymoon in Kerala"*, *"Our First Home"*, or physical group gifts).
   - Auspicious shagun denominations: **₹501, ₹1,100, ₹2,100, ₹5,100**, plus custom amounts.
   - Respectful tone: *"Blessings & Wishes"* rather than transactional terms.
   - Zero app install and zero login required for guests.
   - Payments settle directly to the couple's verified bank account (no middleman escrow custody).

2. **Unified Shagun Ledger:**
   - Consolidated dashboard combining real-time online UPI gifts with offline cash envelopes, gold/silver, and physical gifts.
   - Search, filter by gift format, and one-click WhatsApp thank-you message generator.
   - 1-click CSV export (`/api/export/ledger-csv`).

3. **Venue Disposable Camera:**
   - In-browser camera (`getUserMedia`) with 90s vintage film filter, soft vignette, and orange digital date stamp applied client-side.
   - Strict 24-shot roll limit per guest (25th shot blocked).
   - "Morning-after" reveal lock: photos remain undeveloped until the couple's chosen reveal time (default 10:00 AM next day).
   - Photos stream directly to the couple's private Google Drive (strictly scoped to `drive.file`).
   - Resilient IndexedDB queue for capturing offline in weak banquet 4G reception.

4. **Printable QR Code Posters:**
   - Ornate high-res printable table standees for wedding dining tables and venue registration.
   - Two formats: Main Shagun Standee and Disposable Camera Standee with a 3-step guide for elders.

5. **Multi-Language (i18n):**
   - Bilingual support for English (`en`), Hindi (`hi`), and Marathi stub (`mr`).

---

## 2. Technology Stack

- **Framework:** Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Database & Auth:** Supabase (PostgreSQL + Auth + Row Level Security)
- **Payments:** Razorpay UPI Intent & QR (Test & Production modes)
- **Media Storage:** Google Drive API (Strict `drive.file` scope only)
- **Security:** AES-256-GCM token encryption at rest
- **Internationalization:** `next-intl` (English, Hindi, Marathi)
- **PWA:** Web App Manifest + Service Worker offline shell

---

## 3. Quickstart & Local Setup

### Prerequisites
- Node.js 18+ (tested on Node v24)
- npm 9+

### 1. Clone & Install
```bash
git clone <repository-url>
cd "Shagun Site"
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
*(The application works out-of-the-box with a high-fidelity local mock store if Supabase/Razorpay keys are not yet configured).*

### 3. Run Build & Server
```bash
# Production build
npm run build

# Start server on port 7777
npm run start
```
Open **[http://localhost:7777](http://localhost:7777)** in your browser!

---

## 4. Environment Variables Reference

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_APP_URL` | Base application URL (e.g. `http://localhost:7777` or production domain) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Project URL (`https://xyz.supabase.co`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Public Anonymous API Key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Service Role Key (for webhooks & background workers) |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID (from Google Cloud Console) |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret |
| `TOKEN_ENCRYPTION_KEY` | 32-character secret key used for AES-256-GCM encryption of OAuth tokens |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Razorpay Key ID (`rzp_test_...` or `rzp_live_...`) |
| `RAZORPAY_KEY_SECRET` | Razorpay Key Secret |
| `RAZORPAY_WEBHOOK_SECRET` | Razorpay Webhook Secret for HMAC-SHA256 signature verification |

---

## 5. Google Cloud Console Setup (`drive.file` Scope)

1. Open [Google Cloud Console](https://console.cloud.google.com/) and create a project (e.g., `shagun-wedding-platform`).
2. Go to **APIs & Services > Library** and enable **Google Drive API**.
3. Go to **APIs & Services > OAuth consent screen**:
   - User Type: **External**
   - App Name: `Shagun`
   - Scopes: Click **Add or Remove Scopes** and select strictly:
     ```
     https://www.googleapis.com/auth/drive.file
     ```
     *(This guarantees that Shagun can ONLY access files and folders it creates itself, keeping the couple's personal Drive 100% private).*
4. Go to **Credentials > Create Credentials > OAuth Client ID**:
   - Application Type: **Web application**
   - Authorized JavaScript origins: `http://localhost:7777`, `https://your-production-domain.com`
   - Authorized redirect URIs:
     - `http://localhost:7777/auth/callback`
     - `https://your-production-domain.com/auth/callback`
5. Copy the Client ID and Client Secret into `.env.local`.

---

## 6. Razorpay Payments & Webhook Setup

1. Sign up on [Razorpay Dashboard](https://dashboard.razorpay.com/) and switch to **Test Mode**.
2. Go to **Account & Settings > API Keys** and generate your `Key ID` and `Key Secret`.
3. Go to **Account & Settings > Webhooks**:
   - Webhook URL: `https://<your-domain>/api/razorpay/webhook` (or ngrok URL for local testing)
   - Secret: Enter a strong random string and copy to `RAZORPAY_WEBHOOK_SECRET`.
   - Active Events:
     - `payment.captured`
     - `order.paid`
4. **Direct Settlement (No Escrow Custody):**
   - Shagun does not hold escrow funds. In production, connect the couple's verified bank account via Razorpay Linked Accounts / Route so settlements route directly to their bank.

---

## 7. Supabase Database & Row Level Security (RLS)

1. Create a project at [Supabase](https://supabase.com/).
2. Open the **SQL Editor** in your Supabase dashboard and run the entire [supabase/schema.sql](file:///e:/Shagun%20Site/supabase/schema.sql) file.
3. This creates all 8 tables, indexes, automatic timestamps, and enables **Row Level Security** on every table.
4. Run the automated multi-tenant isolation test suite:
   ```bash
   node scripts/test-rls.js
   ```

---

## 8. Automated Test Verification

Run the automated Row Level Security test suite:
```bash
node scripts/test-rls.js
```
Expected output:
```
======================================================
  SHAGUN ROW LEVEL SECURITY (RLS) TEST SUITE
======================================================

  [PASS] Test 1: Couple A can read only their own Shagun ledger entries
  [PASS] Test 2: Couple B CANNOT read Couple A's Shagun ledger entries
  [PASS] Test 3: Couple B CANNOT update or mutate Couple A's wedding details
  [PASS] Test 4: Anonymous guest CANNOT read private Shagun ledger notes
  [PASS] Test 5: Guest CANNOT view photos before morning-after reveal_at
  [PASS] Test 6: Couple A has full access to moderate and view their own venue photos

------------------------------------------------------
  RLS RESULTS: 6/6 tests passed cleanly.
------------------------------------------------------
```

---

## 9. Key Architecture & Rule References

- [architecture.md](file:///e:/Shagun%20Site/architecture.md) — Comprehensive technical architecture, payment integrity flow, and disposable camera pipeline.
- [rules.md](file:///e:/Shagun%20Site/rules.md) — Cultural tone rules (*"Blessings & Shagun"*), security guarantees, and design standards.

