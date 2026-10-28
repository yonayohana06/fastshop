# Tahap 1: Layout Global (Navbar, Footer, & Base Architecture) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Membangun layout global toko online FastShop yang modern, responsif, dan elegan meliputi Navbar interaktif (pencarian, navigasi, cart counter badge, menu autentikasi), Footer profesional, provider context (Auth & Cart state), serta penataan tipe data dan konfigurasi sistem.

**Architecture:** Mengadopsi arsitektur komponen React 19 / Next.js 16 App Router dengan client context terisolasi untuk state keranjang dan autentikasi user. Navbar dan Footer dijadikan komponen layout global pada `app/layout.tsx` yang membungkus seluruh halaman aplikasi, dengan styling Tailwind CSS v4 dan ikon modern `lucide-react`.

**Tech Stack:** Next.js 16.4.3 (App Router), React 19.3.0, TypeScript 5, Tailwind CSS v4, Lucide React.

**Spec:** [docs/API_RESPONSES.md](file:///Users/mmm/Documents/project/FE/fastshop/docs/API_RESPONSES.md) & [docs/E-Commerce Env.json](file:///Users/mmm/Documents/project/FE/fastshop/docs/E-Commerce%20Env.json)

## Global Constraints

- Gunakan konvensi App Router Next.js 16 (komponen interaktif dengan hook harus menyertakan `'use client'`).
- Menggunakan Tailwind CSS v4 untuk styling terpadu yang ramah mobile dan desktop.
- Mengabaikan folder internal skrip agent `.agents/**` dalam konfigurasi ESLint agar `npm run lint` bersih.
- Menjaga TypeScript strict mode tanpa peringatan tipe data (`any` minimal atau dihindari).

## Review Focus

- **Responsivitas Mobile:** Tampilan Navbar di layar kecil (< 768px) harus menyembunyikan navigasi panjang ke dalam drawer/menu hamburger yang dapat dibuka-tutup dengan mulus.
- **State Hydration:** Client context (Auth & Cart) yang membaca `localStorage` harus aman dari hydration mismatch pada SSR Next.js.
- **Badge Counter Cart:** Indikator jumlah barang di keranjang harus bereaksi dinamis terhadap perubahan state Cart.
- **User Session Toggle:** Tampilan tombol di Navbar harus adaptif ketika user berstatus sebagai tamu (Tampilkan tombol Masuk / Daftar) vs user yang sudah login (Tampilkan avatar, nama user, dan menu dropdown Akun / Logout).
- **Aksesibilitas & Keyboard Navigation:** Komponen input pencarian dan tombol menu harus memiliki atribut semantik dan dapat diakses dengan mudah.

---

### Task 1: Konfigurasi ESLint & Setup Type Definitions

**Files:**
- Modify: `eslint.config.mjs`
- Create: `types/index.ts`
- Create: `lib/constants.ts`

**Interfaces:**
- Consumes: Skema data dari `docs/API_RESPONSES.md`
- Produces: Definisi tipe data TypeScript (`User`, `Product`, `Category`, `CartItem`, `CartResponse`, `Order`, `AuthResponse`) dan konstanta konfigurasi API.

- [ ] **Step 1: Update `eslint.config.mjs`**
Tambahkan `.agents/**` dan `docs/**` ke dalam array `globalIgnores` di `eslint.config.mjs`.

- [ ] **Step 2: Buat tipe data inti `types/index.ts`**
Definisikan tipe TypeScript lengkap untuk pengguna, produk, keranjang, pesanan, dan respon API berdasarkan dokumentasi backend.

- [ ] **Step 3: Buat konstanta dasar `lib/constants.ts`**
Deklarasikan URL endpoint backend `https://ecommerce-backend-api-nu.vercel.app/api`, storage key names (`fastshop_token`, `fastshop_user`, `fastshop_cart`), dan link navigasi header.

- [ ] **Step 4: Verifikasi Linting**
Jalankan: `npm run lint`
Pastikan: Keluar dengan kode 0 (bebas dari error lint).

- [ ] **Step 5: Commit**
```bash
git add eslint.config.mjs types/index.ts lib/constants.ts
git commit -m "chore: setup types, constants, and eslint configuration"
```

---

### Task 2: Auth Context & Cart Context (Client State)

**Files:**
- Create: `context/auth-context.tsx`
- Create: `context/cart-context.tsx`
- Create: `context/app-provider.tsx`

**Interfaces:**
- Consumes: `types/index.ts`, `lib/constants.ts`
- Produces: `useAuth()` hook (`user`, `token`, `isAuthenticated`, `login`, `logout`), `useCart()` hook (`items`, `totalItems`, `addItem`, `removeItem`, `clearCart`), dan wrapper `AppProvider`.

- [ ] **Step 1: Buat `context/auth-context.tsx`**
Implementasikan React Context dengan status autentikasi, persistensi ke `localStorage` yang aman dari SSR hydration mismatch (`useEffect` mounted check), fungsi `login(token, user)` dan `logout()`.

- [ ] **Step 2: Buat `context/cart-context.tsx`**
Implementasikan React Context untuk keranjang belanja dengan persistensi item lokal, kalkulasi total kuantitas barang (`totalItems`), penambahan item, dan pengosongan keranjang.

- [ ] **Step 3: Gabungkan di `context/app-provider.tsx`**
Buat wrapper komponen `AppProvider` yang menggabungkan `AuthProvider` dan `CartProvider`.

- [ ] **Step 4: Commit**
```bash
git add context/auth-context.tsx context/cart-context.tsx context/app-provider.tsx
git commit -m "feat(context): add auth and cart context providers"
```

---

### Task 3: Komponen Navbar Interaktif

**Files:**
- Create: `components/layout/navbar.tsx`
- Create: `components/layout/nav-search.tsx`
- Create: `components/layout/nav-user-menu.tsx`
- Create: `components/layout/mobile-menu.tsx`

**Interfaces:**
- Consumes: `useAuth()`, `useCart()`, `lib/constants.ts`, ikon `lucide-react`
- Produces: Komponen `<Navbar />` siap pasang di layout root.

- [ ] **Step 1: Buat komponen pencarian `components/layout/nav-search.tsx`**
Form input search dengan icon pencarian, placeholder interaktif, dan submit handler yang mengarahkan ke halaman katalog produk dengan query parameter `?search=...`.

- [ ] **Step 2: Buat menu profil user `components/layout/nav-user-menu.tsx`**
Dropdown menu responsif: bila belum login menampilkan tombol "Masuk" dan "Daftar"; bila sudah login menampilkan inisial/avatar, nama akun, menu "Pesanan Saya", dan aksi "Keluar".

- [ ] **Step 3: Buat drawer menu mobile `components/layout/mobile-menu.tsx`**
Drawer menu geser atau collapse untuk tampilan mobile, mencakup navigasi kategori produk, status user, dan pencarian cepat.

- [ ] **Step 4: Satukan dalam `components/layout/navbar.tsx`**
Header sticky dengan efek `backdrop-blur`, logo FastShop beraksen brand premium, navigasi kategori desktop, tombol keranjang dengan badge jumlah item, dan pemicu mobile menu.

- [ ] **Step 5: Commit**
```bash
git add components/layout/navbar.tsx components/layout/nav-search.tsx components/layout/nav-user-menu.tsx components/layout/mobile-menu.tsx
git commit -m "feat(ui): implement responsive navbar with cart badge and user menu"
```

---

### Task 4: Komponen Footer & Value Proposition Badges

**Files:**
- Create: `components/layout/footer.tsx`
- Create: `components/layout/trust-badges.tsx`

**Interfaces:**
- Consumes: Ikon `lucide-react`, link navigasi & kategori dari `lib/constants.ts`
- Produces: Komponen `<Footer />` dan `<TrustBadges />`.

- [ ] **Step 1: Buat komponen `components/layout/trust-badges.tsx`**
Grid penjaminan layanan pelanggan: "Pengiriman Cepat", "Jaminan Produk Asli", "Pembayaran Aman", dan "Layanan Pelanggan 24/7".

- [ ] **Step 2: Buat komponen `components/layout/footer.tsx`**
Footer lengkap dengan kolom:
1. Tentang FastShop (branding, deskripsi singkat toko).
2. Kategori Populer (Kemeja, Jeans, Sepatu, T-Shirt, Running).
3. Bantuan & Panduan (Cara Belanja, Konfirmasi Pembayaran, Pengembalian).
4. Kontak & Pembayaran (Informasi rekening transfer manual, QRIS).
5. Baris copyright & hak cipta.

- [ ] **Step 3: Commit**
```bash
git add components/layout/trust-badges.tsx components/layout/footer.tsx
git commit -m "feat(ui): add footer and trust badges components"
```

---

### Task 5: Integrasi Layout Root & Preview Halaman Home

**Files:**
- Modify: `app/layout.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `AppProvider`, `<Navbar />`, `<Footer />`, `<TrustBadges />`
- Produces: Layout aplikasi FastShop yang utuh dan tampilan home pembuka yang menarik.

- [ ] **Step 1: Update `app/layout.tsx`**
Bungkus struktur body dengan `AppProvider`, masukkan `<Navbar />` di bagian atas, `<main className="flex-1">` untuk konten dinamis, dan `<Footer />` di bagian bawah. Update Metadata judul menjadi "FastShop - Belanja Cepat & Terpercaya".

- [ ] **Step 2: Modifikasi `app/page.tsx`**
Ganti halaman default create-next-app dengan Hero Banner sambutan FastShop, Call to Action "Mulai Belanja", preview kategori utama, dan kartu `TrustBadges` yang terintegrasi.

- [ ] **Step 3: Verifikasi Linting & Typecheck**
Jalankan: `npm run lint` dan `npx tsc --noEmit`
Pastikan: Tidak ada error syntax, types, maupun linter.

- [ ] **Step 4: Commit**
```bash
git add app/layout.tsx app/page.tsx
git commit -m "feat(layout): integrate global layout with navbar and footer into app"
```
