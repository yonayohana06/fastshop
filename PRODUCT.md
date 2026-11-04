# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary users are Indonesian online shoppers looking for everyday fashion and apparel (clothing, footwear, accessories). They seek a quick, dependable shopping flow without complex checkouts or confusing promotional clutter, typically browsing on mobile or desktop browsers.

## Product Purpose

FastShop is a direct-to-consumer fashion e-commerce storefront designed for fast, frictionless browsing, purchasing, and order tracking. Success means an effortless path from discovering an item to checkout, accompanied by clear order visibility and order fulfillment tracking.

## Positioning

Accessible, clean, and direct apparel shopping in Indonesia. Emphasizes swift loading, solid non-distracting visual presentation, transparent pricing, and simple manual bank transfer verification over gimmicky gamification or multi-vendor marketplace noise.

## Operating Context

- Browsed on modern desktop and mobile web browsers.
- Indonesian domestic commerce context: Bahasa Indonesia interface language, domestic shipping address formats, and Indonesian Rupiah (IDR) currency formatting.
- Payment operation relies on customer bank transfers followed by customer upload of payment receipt proof.
- Admin verification workflow transitions orders through distinct operational statuses (`PENDING` -> `PROCESSING` -> `SHIPPED` -> `COMPLETED` / `CANCELLED`).

## Capabilities and Constraints

- **Catalog & Discovery:** Product browsing, category filtering (Fashion Pria, Fashion Wanita, Sepatu, Kemeja, Jeans, T-Shirt), search, pagination, and product detail viewing.
- **Cart & Checkout:** Client-synchronized cart, guest to authenticated checkout transition, delivery address input, and direct order placement.
- **Payment & Verification:** Manual bank transfer workflow with receipt image upload (`payment_proof_url`) for merchant verification.
- **Order Management:** Dedicated customer order history and real-time status tracking (`PENDING`, `PROCESSING`, `SHIPPED`, `COMPLETED`, `CANCELLED`).
- **Technical Constraints:**
  - Next.js 16 (App Router), React 19, Tailwind CSS v4, TypeScript 5.
  - REST API client consuming backend services with Bearer token authentication in `localStorage`.
  - Image domain restrictions configured for Unsplash, Icons8, and Supabase storage.

## Brand Commitments

- **Name:** FastShop
- **Color Palette (Binding):** Primary Deep Forest Teal (`#287361`), Secondary Terracotta (`#c36433`).
- **Visual Rule (Strict):** Zero gradients (100% solid colors only across cards, buttons, badges, and banners); default light mode.
- **Tone & Copy:** Straightforward, helpful, and concise Bahasa Indonesia.

## Evidence on Hand

- Live Next.js client codebase with working routes: `/`, `/products`, `/products/[id]`, `/cart`, `/checkout`, `/orders`, `/orders/[id]`, `/login`, `/register`, `/profile`.
- REST API service integration in `lib/api/` backed by live API endpoints.
- Strict brand and styling rules defined in `AGENTS.md`.

## Product Principles

1. **Clarity Over Clutter:** Eliminate unnecessary popups, banners, and distractions; keep product cards and checkout actions immediate and obvious.
2. **Speed & Reliability:** Lightweight page payloads, fast responsive navigation, and solid layout stability across all viewports.
3. **Honest & Direct Feedback:** Every transaction, status update, and receipt upload provides unambiguous confirmation of current order state.
4. **Solid Color Precision:** Pure solid color tokens for brand identity and semantic states, avoiding gradients or ambiguous styling.
