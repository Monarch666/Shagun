# Shagun Architecture Document
**Version:** 1.0.0 (MVP)  
**Target:** Indian Wedding Gifting & Memories Platform  

---

## 1. Executive Summary & System Overview

**Shagun** is a mobile-first, privacy-respecting wedding gifting and collective memory platform tailored for the modern Indian wedding ecosystem. It solves three critical problems:
1. **Dignified Shagun (Gifting):** Replacing awkward cash envelopes with seamless UPI contributions toward meaningful couple-defined milestones ("Honeymoon in Bali", "Our First Home", or group physical gifts) without holding escrow or taking cuts.
2. **Comprehensive Shagun Ledger:** Digitizing and aggregating all online gifts and offline physical cash/shagun envelopes in one place, with one-click thank-you tracking and CSV exports.
3. **Venue Disposable Camera:** An in-browser nostalgic disposable camera with a 24-shot roll per guest, vintage film aesthetics, zero app install, offline queueing, and an "undeveloped until the morning after" reveal mechanic. Photos are transferred directly to the couple's private Google Drive (scoped strictly to `drive.file`).

---

## 2. System Architecture Diagram

```mermaid
flowchart TD
    subgraph Clients["Clients (Mobile-First Web & PWA)"]
        GuestMobile["Guest Device (Android/iOS Browser)\n- Low-end 4G optimized\n- No login required\n- Direct Couple UPI & QR\n- In-browser Disposable Camera\n- next-intl (EN / HI / MR)"]
        CoupleMobile["Couple Dashboard\n- 30-Day Pass & Activation Code\n- Couple UPI & 2 Phone Numbers\n- Wedding & Funds CRUD\n- Shagun Ledger + Offline Gifts\n- QR Posters & Photo Gallery"]
        PlatformOwner["Platform Owner / Admin\n- Platform Scanner QR Code\n- 30-Day Activation Passes (1 couple only)"]
    end

    subgraph EdgeVercel["Next.js 14 App Router (Vercel)"]
        RouteHandlers["API Routes & Webhooks\n- /api/camera/upload\n- /api/export/ledger-csv\n- /api/razorpay/webhook"]
        AppPages["SSR & Client Pages\n- / (Landing & Platform Scanner QR)\n- /activate (30-Day Pass Purchase)\n- /dashboard/* (Couple Suite)\n- /w/[slug] (Guest Portal & Direct UPI)\n- /w/[slug]/camera (Venue Camera)"]
        RateLimiter["In-Memory Token Bucket\nRate Limiting & Anti-Abuse"]
    end

    subgraph DataStorage["Data & Storage Layer"]
        SupabasePostgres[("Supabase PostgreSQL\n- Weddings & Activation Passes\n- Funds & Direct UPI Contributions\n- Offline & Online Ledger\n- Photo Metadata & Rolls\n- Row Level Security (RLS)")]
        GoogleDrive["Google Drive API\n(drive.file scope only)\nFolder: Shagun - Couple / Event /\nOriginal Image Storage"]
    end

    subgraph DirectUPIFlow["Direct Bank Settlement (Zero Platform Middleman)"]
        GuestUPIApp["Guest UPI App (PhonePe / GPay / Paytm / BHIM)"]
        CoupleBank["Couple's Personal Bank Account (Linked to 2 Registered Mobile Numbers)"]
    end

    GuestMobile -->|Direct UPI Payment| GuestUPIApp
    GuestUPIApp -->|100% Direct Settlement (Zero Redirection to Platform)| CoupleBank
    GuestMobile -->|Record Blessing & UTR| AppPages

    CoupleMobile -->|Scan Platform QR & Claim 30-Day Pass| PlatformOwner
    PlatformOwner -->|Single-Couple Code (30 Days Active)| CoupleMobile

    GuestMobile -->|Browse & RSVP| AppPages
    GuestMobile -->|Initiate UPI| RouteHandlers
    RouteHandlers -->|Create Order| RazorpayGateway
    RazorpayGateway -->|Direct UPI Settlement| CoupleMobile
    RazorpayGateway -->|Signed Webhook Event| RouteHandlers
    RouteHandlers -->|Idempotent Write| SupabasePostgres

    GuestMobile -->|Capture & Queue Filtered Photos| RouteHandlers
    RouteHandlers -->|Token-authorized upload| GoogleDrive
    RouteHandlers -->|Save photo metadata| SupabasePostgres

    CoupleMobile -->|Google Sign-in| GoogleOAuth
    CoupleMobile -->|Manage Wedding & View Ledger| AppPages
    AppPages -->|Direct authenticated queries via RLS| SupabasePostgres
```

---

## 3. Technology Stack & Key Decisions

| Layer | Technology | Rationale & Trade-offs |
|---|---|---|
| **Framework** | Next.js 14 (App Router) + TypeScript | Hybrid SSR/Static for fast initial paint on 4G networks; API route handlers for secure webhooks; TypeScript strict typing. |
| **Styling & Design System** | Tailwind CSS + Lucide Icons | Warm Indian wedding aesthetics (marigold, deep maroon, ivory, gold); lightweight CSS bundle (<30KB) with zero runtime penalty. |
| **Database & Auth** | Supabase (PostgreSQL + Auth + RLS) | Strict multi-tenant data isolation using Postgres Row Level Security; instantaneous setup; native Google Auth integration. |
| **Payments** | Razorpay (Test / Standard UPI) | Dominant Indian payment gateway supporting UPI QR, Google Pay, PhonePe, Paytm intent; signed webhooks ensure client trustlessness. |
| **Media Storage** | Google Drive API (`drive.file` scope) | Zero server hosting cost for couple photos; couples own their original media forever; scoped strictly to files created by the app. |
| **Camera & Processing** | Web Audio / Canvas 2D / IndexedDB | Client-side vintage film grain and color grade; max 1600px JPEG compression (0.8 quality); offline queue via Dexie/IndexedDB for weak 4G venue connectivity. |
| **Internationalization** | `next-intl` | Seamless locale routing (`/en`, `/hi`, `/mr`); negligible footprint; server component compatibility. |
| **PWA & Offline** | Serwist / `@ducanh2912/next-pwa` | Enables "Add to Home Screen" for couple and offline shell caching for guests in low-reception wedding banquets. |

---

## 4. Database Schema & Data Model

```mermaid
erDiagram
    WEDDINGS ||--o{ EVENTS : "has"
    WEDDINGS ||--o{ FUNDS : "offers"
    WEDDINGS ||--o{ CONTRIBUTIONS : "receives"
    WEDDINGS ||--o{ LEDGER_ENTRIES : "contains"
    WEDDINGS ||--o{ RSVPS : "tracks"
    WEDDINGS ||--o{ CAMERA_ROLLS : "allocates"
    CAMERA_ROLLS ||--o{ PHOTOS : "contains"
    FUNDS ||--o{ CONTRIBUTIONS : "funded_by"

    WEDDINGS {
        uuid id PK
        uuid owner_id "references auth.users"
        string slug UK "e.g. aadarsh-and-shivani"
        string partner_1_name
        string partner_2_name
        date wedding_date
        string city
        string cover_image_url
        string welcome_message
        int default_roll_limit "default: 24"
        timestamp reveal_at "default: morning after"
        string drive_folder_id
        text encrypted_drive_refresh_token
        string razorpay_account_id "optional linked payout"
        boolean is_active
        timestamp created_at
        timestamp updated_at
    }

    EVENTS {
        uuid id PK
        uuid wedding_id FK
        string name "Mehendi, Sangeet, Haldi, Wedding, Reception"
        timestamp start_time
        timestamp end_time
        string venue_name
        string venue_address
        string maps_url
        int sort_order
        timestamp created_at
    }

    FUNDS {
        uuid id PK
        uuid wedding_id FK
        string title "e.g. Honeymoon in Bali"
        text description
        string cover_image_url
        int target_amount "optional in paise/rupees"
        int received_amount "computed cache"
        int contributor_count "computed cache"
        boolean is_group_gift "external product support"
        string external_product_url
        boolean is_amount_hidden
        string status "active | paused | completed"
        int sort_order
        timestamp created_at
    }

    CONTRIBUTIONS {
        uuid id PK
        uuid wedding_id FK
        uuid fund_id FK
        string guest_name
        int amount "in INR"
        text blessing_message
        boolean is_amount_hidden
        string razorpay_order_id UK
        string razorpay_payment_id UK
        string status "pending | captured | failed"
        jsonb payment_metadata
        timestamp captured_at
        timestamp created_at
    }

    LEDGER_ENTRIES {
        uuid id PK
        uuid wedding_id FK
        string guest_name
        int amount "in INR"
        string gift_type "online | cash_envelope | gold_silver | physical_gift"
        string fund_title "optional reference"
        text notes
        boolean thank_you_sent
        timestamp received_date
        timestamp created_at
    }

    RSVPS {
        uuid id PK
        uuid wedding_id FK
        string guest_name
        string phone
        int attendee_count
        string attendance_status "attending | not_attending | tentative"
        jsonb attending_events "array of event IDs"
        text dietary_or_notes
        timestamp created_at
    }

    CAMERA_ROLLS {
        uuid id PK
        uuid wedding_id FK
        string guest_session_id UK "anonymous cookie/uuid"
        string guest_name
        int shots_used "default: 0"
        int roll_limit "default: 24"
        timestamp created_at
        timestamp last_shot_at
    }

    PHOTOS {
        uuid id PK
        uuid wedding_id FK
        uuid roll_id FK
        uuid event_id FK "optional tag"
        string google_drive_file_id UK
        string drive_thumbnail_url
        string drive_web_content_link
        string client_photo_hash "for idempotency"
        int width
        int height
        boolean is_hidden_by_couple "default: false"
        boolean is_deleted "default: false"
        timestamp captured_at
        timestamp uploaded_at
    }
```

---

## 5. Security & Privacy Architecture

### 5.1 Google Drive Integration (`drive.file` Scope)
- **Zero Full Drive Access:** Only `https://www.googleapis.com/auth/drive.file` is requested during couple OAuth. The application can only view, edit, and delete files that the app itself created.
- **Token Protection:** The OAuth `refresh_token` is encrypted using AES-256-GCM before writing to the database with a server-side encryption key (`ENCRYPTION_SECRET_KEY`).
- **Media Privacy:** Photo binary bytes are never stored in the database. The client uploads chunks through an authenticated Next.js API stream directly to the couple's Drive folder:
  `Google Drive -> Shagun – [Couple Names] / [Event Name] / photo-[hash].jpg`.
- **Revocation Safety:** The couple can revoke access at any time from their Google Account or in-app dashboard. The app gracefully disables uploads and notifies guests.

### 5.2 Row Level Security (RLS) Matrix

| Table | Public Guest (Anonymous) | Couple (Authenticated Owner) | Service Role (Webhooks & Background) |
|---|---|---|---|
| `weddings` | Read-only where `is_active = true` (excluding tokens) | Full CRUD for `owner_id = auth.uid()` | Full access |
| `events` | Read-only by `wedding_id` | Full CRUD for owned wedding | Full access |
| `funds` | Read-only by `wedding_id` | Full CRUD for owned wedding | Full access |
| `contributions` | Insert pending; Read captured where `wedding_id` (masks amount if `is_amount_hidden`) | Full Read for owned wedding | Full CRUD (webhook verification updates status) |
| `ledger_entries`| No access | Full CRUD for owned wedding | Full access |
| `rsvps` | Insert with rate limiting | Full Read & Delete for owned wedding | Full access |
| `camera_rolls` | Insert/Update own `guest_session_id` | Full Read for owned wedding | Full access |
| `photos` | Read own `roll_id` ONLY after `reveal_at` and `!is_hidden` | Full Read, Update (`is_hidden`), Delete | Full access |

### 5.3 Payment Integrity & Webhook Idempotency
- **No Escrow / No Custody:** Payments route directly through Razorpay to the couple's verified settlement bank account.
- **Client Status Untrusted:** The front-end payment callback displays a pending/processing indicator. The contribution is only confirmed in the database when the Razorpay webhook fires with a valid `X-Razorpay-Signature` verified with `crypto.createHmac("sha256", RAZORPAY_WEBHOOK_SECRET)`.
- **Idempotency Guarantee:** Every webhook event is checked against processed `razorpay_payment_id` to prevent double-counting.

---

## 6. Disposable Camera & Media Pipeline

```mermaid
sequenceDiagram
    autonumber
    actor Guest as Guest (Mobile Web)
    participant UI as Camera View (Canvas)
    participant Storage as IndexedDB Queue
    participant API as Shagun API (/api/camera/upload)
    participant Supabase as Supabase DB
    participant GDrive as Couple's Google Drive

    Guest->>UI: Opens /w/[slug]/camera & enters name
    UI->>Supabase: Get/Create camera_roll (checks shots_used < 24)
    Guest->>UI: Taps shutter button
    UI->>UI: Captures stream frame -> renders 90s vintage film filter & grain
    UI->>UI: Compresses to JPEG (max 1600px, 0.8 quality)
    UI->>Storage: Stores raw blob in IndexedDB queue
    UI->>Guest: Increments counter & shows shutter animation (Zero preview)

    rect rgb(240, 248, 255)
        Note over UI,GDrive: Resilient Background Sync
        UI->>Storage: Fetch queued items
        UI->>API: Stream photo blob + session token
        API->>Supabase: Validate roll limit & wedding status
        API->>GDrive: Upload to Shagun - [Couple] / [Event] folder
        GDrive-->>API: Returns file_id & webViewLink
        API->>Supabase: Insert photo record (metadata only)
        API-->>UI: Upload success
        UI->>Storage: Delete item from IndexedDB
    end

    rect rgb(255, 250, 240)
        Note over Guest,Supabase: Reveal Mechanic
        Guest->>UI: Views /w/[slug]/gallery
        alt Before Reveal Time
            UI-->>Guest: Displays "Photos developing! Available at [reveal_at]"
        else After Reveal Time
            Supabase-->>UI: Returns photos for guest's roll_id (Couple sees all)
            UI-->>Guest: Displays developed photos with download/share
        end
    end
```

---

## 7. Internationalization (i18n) Architecture

- Implemented via `next-intl` with route matching:
  - English: `/en/...` (or default prefix)
  - Hindi: `/hi/...` (संपूर्ण हिंदी समर्थन: "आशीर्वाद और शुभकामनाएं", "शगुन भेंट", "कैमरा")
  - Marathi: `/mr/...` (मराठी स्वरूप: "आशीर्वाद आणि शुभेच्छा")
- Translation keys organized by feature namespace: `common`, `landing`, `couple_dashboard`, `guest_portal`, `funds`, `camera`, `ledger`, `rsvp`.
- Persistent language switcher pill floating or anchored in the navigation.

---

## 8. Performance & Low-End Device Optimization

1. **Lightweight Guest Bundle:** Initial JavaScript bundle for guest portals is strictly under 180KB gzipped.
2. **Dynamic Code Splitting:** The camera engine (HTML5 Canvas filter, stream capture, Dexie IndexedDB sync) is dynamically loaded with `next/dynamic` only when the guest opens `/w/[slug]/camera`.
3. **High-Contrast Typography & Touch Targets:**
   - Minimum tap target size: 48px × 48px.
   - Text contrast meets WCAG AA (>= 4.5:1 for standard text, 3:1 for large text).
   - High readability fonts: Rozha One / Playfair Display for headings; Inter / Plus Jakarta Sans for body.
4. **Resilient Network Handling:** In banquet halls with 500+ guests competing for 4G towers, camera uploads degrade to background queueing without blocking the shutter button.

