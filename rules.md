# Shagun Engineering & Product Rules
**Project:** Shagun – Indian Wedding Gifting & Memories Platform  
**Applies to:** All Developers, Agents, and Subagents  

---

## 1. Cultural Tone & Copywriting Rules

- **Dignified & Respectful:** Never use transaction-heavy or transactional language like "Buy us this", "Pay now", "Price", or "Crowdfund our wedding".
- **Traditional Honorifics:** Always use respectful terminology:
  - Contributions $\rightarrow$ "Blessings & Shagun" / "आशीर्वाद और शगुन" / "आशीर्वाद आणि शगुन".
  - Goals / Items $\rightarrow$ "Milestones & Dreams" / "हमारे नए सफर के सपने".
  - Envelope gifts $\rightarrow$ "Shagun Envelopes" / "शगुन लिफाफा".
- **Elder-First Usability:** Simple words, clear Sanskrit/Hindi-rooted terms where appropriate, large readable buttons, no convoluted micro-copy.

---

## 2. Security & Privacy Rules (Non-Negotiable)

1. **Google Drive Permission Boundary:**
   - ONLY request `https://www.googleapis.com/auth/drive.file`.
   - NEVER request `drive`, `drive.readonly`, or `drive.metadata`.
   - Always display a clear trust banner in the couple onboarding: *"Shagun only interacts with folders and pictures created within this app. We never read or access your personal Drive documents or photos."*
2. **Encrypted Token Storage:**
   - Couple OAuth tokens (specifically `refresh_token`) MUST be encrypted at rest using AES-256-GCM before saving into the database.
   - Decryption keys must reside in environment variables (`TOKEN_ENCRYPTION_KEY`) and never be committed.
3. **Database Row Level Security (RLS):**
   - Every Supabase table MUST have Row Level Security enabled (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY;`).
   - Couple accounts MUST NEVER be able to read or mutate another couple's wedding, funds, ledger, or photos.
   - Public guest access is strictly limited: guests cannot read private ledger notes, unrevealed camera photos, or secret tokens.
4. **Payment Security:**
   - NEVER trust client-side payment responses for finalizing a gift or ledger update.
   - Updates to the Shagun ledger MUST only occur through verified Razorpay Webhooks using `crypto.createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)`.
   - Webhook processing must be idempotent (guard against duplicate Razorpay event IDs).
5. **No Holding of Funds:**
   - Shagun does not act as an escrow or wallet. Contributions settle directly into the couple's verified Razorpay payout account or bank account.
6. **Guest Privacy & Minimal PII:**
   - Guests do not log in. They only submit a display name and optional blessing message.
   - No tracking cookies or advertising pixels. Clear plain-language privacy statement on guest pages and camera view.

---

## 3. UI, UX & Design System Guidelines

1. **Color Palette (Warm Indian Wedding Elegance):**
   - **Marigold Primary:** `#D97706` (Amber 600) / `#F59E0B` (Amber 500)
   - **Deep Royal Maroon:** `#881337` (Rose 900) / `#9F1239` (Rose 800)
   - **Ivory Base:** `#FFFBEB` (Amber 50) / `#FEFCE8` (Yellow 50)
   - **Subtle Gold Borders/Accents:** `#EAB308` (Yellow 500) / `#FDE047` (Yellow 300)
   - **Dark Neutral Text:** `#1F2937` (Gray 800) for sharp readability.
2. **Typography:**
   - Display & Headings: Elegant Serif (`Rozha One`, `Cinzel`, or `Playfair Display`).
   - Body & Controls: Highly legible Sans (`Plus Jakarta Sans` or `Inter`).
3. **Touch Targets & Accessibility:**
   - Minimum tap target size: 48px × 48px on mobile for all buttons and interactive chips.
   - High contrast ratios (WCAG AA compliant, $\ge 4.5:1$).
   - Quick Shagun chips: ₹501, ₹1,100, ₹2,100, ₹5,100, plus custom amount input (following traditional auspicious Indian numbers ending in 1).
4. **Performance Budgets:**
   - Initial JS payload for guest portal: $\le 180$ KB gzipped.
   - Camera module must be dynamically loaded (`next/dynamic` or lazy import).
   - Optimize for slow/intermittent 4G connections (wedding banquet hall conditions).

---

## 4. Disposable Camera Engine Rules

1. **Roll Limit:** Strict 24-shot roll per guest session (or couple-configured roll limit). Block 25th shot in UI and reject in API.
2. **Client-Side Vintage Film Filter:**
   - Canvas-based filter with warm golden tint, soft vignette, film grain, and subtle date stamp (e.g. `'26 11 17`).
   - No server-side image processing or heavy cloud functions required.
3. **Zero Preview Before Reveal:**
   - The shutter captures the photo, triggers an authentic camera shutter audio/haptic click, increments the shots-used counter, and saves to the roll.
   - No immediate photo playback or retakes. The feeling must emulate authentic disposable film cameras.
4. **Offline Resilience:**
   - Captured photos MUST be persisted to IndexedDB immediately upon shutter tap.
   - Background worker uploads photos sequentially. If offline or upload fails, keep in queue and retry when `navigator.onLine` fires.
5. **Direct Drive Storage:**
   - Files are sent to couple's Google Drive folder `Shagun – [Couple Names] / [Event Name] /`.
   - Supabase stores only the Google Drive file ID, metadata, thumbnail link, and guest roll ID. Never store binary base64 or blob data in Postgres.

---

## 5. Engineering Standards & Code Hygiene

1. **Next.js 14 Conventions:**
   - App Router (`app/` directory).
   - Clear separation of Server Components (data fetching, SEO, layouts) and Client Components (`"use client"` for interactivity).
   - Robust error boundaries (`error.tsx`), loading states (`loading.tsx`), and 404 pages (`not-found.tsx`).
2. **TypeScript Strictness:**
   - `noImplicitAny: true`, strict null checks.
   - Complete type definitions for database tables, API payloads, and webhook events.
3. **i18n Rules:**
   - All user-facing strings must use translation keys through `next-intl`.
   - Never hardcode raw strings in guest or couple user interfaces.
   - Default locales: `en` (English), `hi` (Hindi), `mr` (Marathi stub).

---

## 6. Phase Execution & Verification Rules

- Work in deliberate, disciplined phases.
- After every phase:
  1. Build and verify the application compiles cleanly.
  2. Run the dev/prod server and test live flows with end-to-end verification.
  3. Validate all acceptance criteria for that phase.
  4. Summarize what passed, what was verified, and any relevant notes before proceeding to the next phase.

---

## 7. Monetization, Platform Scanner & Zero-Escrow Direct UPI Rules

1. **Platform Owner Activation Scanner QR:**
   - The platform monetizes via an upfront 30-Day Wedding Pass (e.g. ₹999).
   - The website provides the platform owner's UPI scanner QR code where couples pay to obtain an activation code.
   - Each issued activation code (`SHAGUN-XXXX-30D`):
     - Is valid for **30 consecutive days** from creation.
     - Is strictly single-use and locked to **1 couple only**. Once claimed by a wedding, it cannot be transferred or reused.
2. **Couple's Direct UPI & Payout (Nothing Redirected to Platform):**
   - When couples register, they provide:
     1. Their primary **UPI ID / VPA** (e.g. `shivani.aadarsh@okhdfcbank`).
     2. Their **Custom UPI QR Code** (uploaded image or system-generated NPCI standard QR).
     3. **Two Registered Mobile Numbers** (Partner 1 & Partner 2, linked to UPI for family authenticity).
   - When guests contribute:
     - 100% of the funds go **directly from the guest's bank account to the couple's personal UPI**.
     - **Nothing is redirected to or held by the platform**. Shagun takes zero cut, zero commission, and holds zero escrow on wedding gifts.
     - Both registered numbers and the couple's UPI ID are shown transparently to guests for peace of mind.

