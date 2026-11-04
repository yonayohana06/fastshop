---
name: FastShop
description: Direct-to-consumer curated Indonesian fashion storefront with clean solid aesthetics
colors:
  primary: "#287361"
  primary-hover: "#1f5b4d"
  primary-light: "#edf5f3"
  primary-dark: "#378e79"
  secondary: "#c36433"
  secondary-hover: "#a85226"
  secondary-light: "#fbf3ee"
  secondary-dark: "#d47441"
  background: "#ffffff"
  background-dark: "#0a0a0a"
  foreground: "#171717"
  foreground-dark: "#ededed"
  surface: "#fafafa"
  surface-card: "#ffffff"
  border: "#e4e4e7"
  border-subtle: "#f4f4f5"
typography:
  display:
    fontFamily: "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "3rem"
    fontWeight: 900
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 800
    lineHeight: 1.25
    letterSpacing: "-0.01em"
  title:
    fontFamily: "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "1rem"
    fontWeight: 700
    lineHeight: 1.4
  body:
    fontFamily: "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 700
    letterSpacing: "0.05em"
rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.background}"
    rounded: "{rounded.md}"
    padding: "10px 20px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  button-secondary:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.background}"
    rounded: "{rounded.md}"
    padding: "10px 20px"
  card-product:
    backgroundColor: "{colors.surface-card}"
    rounded: "{rounded.lg}"
    padding: "14px"
---

# Design System: FastShop

## Overview

**Creative North Star: "The Grounded Atelier"**

FastShop rejects the oversaturated, neon-accented, and gimmick-ridden conventions of generic multi-vendor e-commerce. Instead, it embodies the calm conviction of a curated Indonesian apparel atelier. The visual language is grounded in earthy, tactile materials: Deep Forest Teal (`#287361`) evokes natural dyed textiles and quiet stability, while Terracotta (`#c36433`) provides an energetic, warm accent reminiscent of Indonesian clay craft and urban warmth.

The interface prioritizes immediate transactional clarity, high mobile scanning density, and honest merchant transparency. Every layout decision balances swift task completion with editorial respect for apparel craft. Sizing, fabric quality, and real-time inventory take precedence over marketing noise.

**Key Characteristics:**
- **Zero Gradients (Strict):** 100% solid color surfaces across every card, button, banner, and badge.
- **Tonal Layering at Rest:** Subtle 1px structural borders and gentle surface tinting rather than ambient shadow blur.
- **High-Density Mobile Commerce:** 2-column mobile product cards (`grid-cols-2`) calibrated for rapid one-thumb evaluation.
- **Direct & Confident Feedback:** Tactile button transformations ("+ Beli" flipping to "Masuk!" with a checkmark) and instant cart badge pulses.
- **Transparent Operational Guidance:** Step-by-step workflow visibility that demystifies manual bank transfer verification.

---

## Colors

The palette is anchored by a disciplined two-tone brand identity supported by neutral zinc surfaces.

### Primary
- **Deep Forest Teal** (`#287361`, dark: `#378e79`, light: `#edf5f3`): The anchor of the brand. Used for primary navigation states, primary action buttons, section highlights, and brand container backdrops. Conveys permanence, quality, and security.

### Secondary
- **Terracotta / Burnt Orange** (`#c36433`, dark: `#d47441`, light: `#fbf3ee`): The conversion and alert accent. Used for high-stakes calls-to-action ("Mulai Belanja"), cart confirmation state flips, promotional tag highlights, and active notification badges.

### Neutral
- **Crisp Canvas White** (`#ffffff`, dark: `#0a0a0a`): Primary background canvas for light mode, ensuring high contrast against merchandise photography.
- **Deep Zinc** (`#171717`, dark: `#ededed`): Dominant text color for display titles, card headings, and primary labels.
- **Muted Zinc** (`#71717a`, dark: `#a1a1aa`): Secondary body copy, metadata, and breadcrumb trails. Meets WCAG AA 4.5:1 minimums.
- **Structural Border** (`#e4e4e7`, dark: `#27272a`): 1px geometric enclosure defining cards, dividers, and input strokes.

### Semantic Status Colors (100% Solid)
- **PENDING:** Solid amber pill (`bg-amber-100 text-amber-800 border-amber-300`)
- **PROCESSING:** Solid blue pill (`bg-blue-100 text-blue-800 border-blue-300`)
- **SHIPPED:** Solid teal pill (`bg-teal-100 text-teal-800 border-teal-300`)
- **COMPLETED:** Solid emerald pill (`bg-emerald-100 text-emerald-800 border-emerald-300`)
- **CANCELLED:** Solid red pill (`bg-red-100 text-red-800 border-red-300`)

### Named Rules
**The Zero-Gradient Rule.** Tailwind gradient utilities (`bg-gradient-*`, `from-*`, `to-*`, `via-*`, `bg-clip-text`) are strictly prohibited in all code and design assets. Every background, button, and banner must use pure solid color.

**The Rarity Rule.** Terracotta (`#c36433`) is an accent of high significance. It must never occupy more than 15% of the total viewport area. When teal anchors the room, terracotta guides the eye.

---

## Typography

**Display Font:** Geist Sans (`var(--font-geist-sans)`), with `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif` as fallback.  
**Body Font:** Geist Sans (`var(--font-geist-sans)`).  
**Monospace / Numerical:** Geist Mono (`var(--font-geist-mono)`) for tracking codes, order IDs, and strict tabular amounts.

**Character:** Modern geometric grotesque with neutral horizontal rhythm, open apertures, and crisp tabular figures optimized for Indonesian Rupiah formatting.

### Hierarchy
- **Display** (Black 900, `2.5rem`–`3.25rem`, line-height 1.15, tracking `-0.02em`): Hero lookbook titles and marquee sales slogans.
- **Headline** (Extrabold 800, `1.5rem`–`1.875rem`, line-height 1.25, tracking `-0.01em`): Section headings (`Kategori Pilihan`, `Produk Terbaru`, `3 Langkah Belanja Cepat`).
- **Title** (Bold 700, `0.875rem`–`1rem`, line-height 1.4): Product card titles, modal headers, badge titles.
- **Body** (Regular 400 / Medium 500, `0.75rem`–`0.875rem`, line-height 1.5): Product descriptions, help text, operational guidelines.
- **Label** (Bold 700, `0.6875rem` [11px], uppercase, tracking `0.05em`): Metadata tags, stock urgency alerts, category pill counts.

### Named Rules
**The Tabular Price Rule.** Product prices must never be truncated with ellipsis in shopping grids or checkout summaries. If space is constrained, scale the font size or compact the adjacent button; every Rupiah digit must remain legible.

**The Sub-11px Ban.** No text element may render smaller than 11px (`text-[11px]`). Microcopy below this floor violates readability standards.

---

## Layout

FastShop is structured on an 8pt spatial grid with content-driven breakpoints:
- **Mobile (`<640px`):** 2-column product catalog (`grid-cols-2 gap-3`), full-width search input, and compact horizontal category row with native touch snapping (`snap-x snap-mandatory`).
- **Tablet (`640px–1023px`):** 2 to 3 columns (`sm:grid-cols-2 md:grid-cols-3 gap-4`).
- **Desktop (`1024px+`):** 4-column product grid (`lg:grid-cols-4 gap-5`), split-screen 7:5 hero lookbook carousel, and inline search bar.
- **Maximum Width:** Main content is bounded at `max-w-7xl` with progressive horizontal guttering (`px-4 sm:px-6 lg:px-8`).

---

## Elevation & Depth

**Philosophy: Tonal Layered (Flat by Default)**

FastShop communicates spatial depth through crisp 1px borders (`border-zinc-200/80`) and surface tone shifts (`bg-white` vs `bg-zinc-50/50`) rather than ambient blur halos. Surfaces sit grounded on the canvas at rest. Elevation appears strictly as a stateful reaction to user touch or hover.

### Shadow Vocabulary
- **Resting:** Flat (`box-shadow: none`). Defined exclusively by 1px solid border.
- **Hover Lift (`shadow-md`):** `0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.04)`. Applied to product cards and interactive banners on desktop hover.
- **Subtle Action (`shadow-xs`):** `0 1px 2px 0 rgba(0, 0, 0, 0.05)`. Applied to primary and secondary action buttons.

### Named Rules
**The Flat-At-Rest Rule.** All containers, cards, and input surfaces remain completely flat when resting. Ambient drop shadows must never be applied to un-hovered cards.

---

## Shapes

- **Radius Strategy:**
  - `rounded-lg` (8px): Form inputs, dropdown menus, and small interactive tags.
  - `rounded-xl` (12px): Standard action buttons and product image thumbnail viewports.
  - `rounded-2xl` (16px): Featured product cards, category cards, workflow steps, and modals.
  - `rounded-3xl` (24px): Primary hero promotional banners on desktop viewports.
  - `rounded-full` (9999px): Status chips, filter pills, cart counters, and navigation buttons.
- **Borders:** Subtle structural borders (`1px solid var(--border)`) enclose every distinct operational group.

---

## Components

### Buttons
- **Shape:** `rounded-xl` (12px radius).
- **Primary:** Solid Teal (`bg-primary text-white`), hover `bg-primary-hover`, active `scale-95`.
- **Secondary:** Solid Terracotta (`bg-secondary text-white`), hover `bg-secondary-hover`.
- **Mobile Quick-Add:** Compact icon-only square (`h-8 w-8`) on viewports `<640px`; expands to full text (`+ Beli` / `✓ Masuk!`) on tablet and desktop (`sm:px-3 sm:w-auto`).
- **Touch Targets:** Minimum tap boundary is 36px on mobile, 44px for primary standalone actions.

### Product Cards
- **Structure:** Vertical flex container enclosed in a `rounded-2xl border border-zinc-200/80 bg-white p-2.5 sm:p-3.5`.
- **Media:** 1:1 aspect-square `<Image />` container with subtle zoom (`group-hover:scale-105`) and out-of-stock dark scrim overlay.
- **Metadata:** Category name pill and stock indicator (`Tersedia` or `Sisa <n>` in amber/red).
- **Footer:** Formatted Rupiah price in bold tabular text aligned beside the quick-add cart button.

### Category Pills & Chips
- **Active State:** Solid Teal (`bg-primary text-white shadow-xs`).
- **Inactive State:** White canvas with neutral border (`border-zinc-200 bg-white text-zinc-700 hover:border-primary/50`).
- **Touch Behavior:** Contained in a horizontally scrollable container with CSS snap alignment (`snap-start`).

### Form Inputs & Search
- **Container:** Rounded pill or `rounded-xl` border with high-contrast text and placeholder contrast $\ge 4.5:1$.
- **Focus:** Crisp solid border shift (`focus:border-primary focus:ring-1 focus:ring-primary`).

### Navigation
- **Desktop:** Sticky top bar with logo, category links, search input, theme switcher, cart trigger, and auth actions.
- **Mobile:** Sticky compact bar with brand logo, theme toggle, cart badge, and slide-out navigation drawer (`MobileMenu`).

---

## Do's and Don'ts

### Do:
- **Do** use 100% solid colors for every visual element (`bg-primary`, `bg-secondary`, `bg-white`).
- **Do** maintain a 2-column mobile catalog grid (`grid-cols-2`) for all product listings.
- **Do** prioritize categories that have active inventory (`product_count > 0`) on public browsing surfaces.
- **Do** format all currency strings with `formatRupiah()` ensuring tabular numbers never truncate.
- **Do** provide immediate tactile feedback when users add items to the cart.
- **Do** clearly explain the manual bank transfer receipt verification flow before checkout.

### Don't:
- **Don't** use CSS gradients (`bg-gradient-*`, `from-*`, `to-*`, `bg-clip-text`) anywhere in the application.
- **Don't** render category count or metadata text smaller than 11px.
- **Don't** truncate product prices with `...` or ellipsis in product cards.
- **Don't** stack product cards into a single-column feed on smartphones.
- **Don't** introduce unconfigured off-brand colors (e.g. arbitrary browns or dark greens) into hero banners.
- **Don't** promise instant automated QRIS confirmation when the operational backend requires manual transfer proof verification.
