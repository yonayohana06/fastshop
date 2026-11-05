# FastShop: Modern E-Commerce Storefront

FastShop adalah aplikasi storefront _e-commerce_ modern berkecepatan tinggi yang dibangun menggunakan **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS v4**, dan **TypeScript**. Aplikasi ini terintegrasi langsung dengan Backend REST API untuk mengelola katalog produk, otentikasi pengguna, keranjang belanja, _checkout_, serta pengunggahan bukti pembayaran.

Desain visual mengusung filosofi **Solid Colors (Bebas Gradasi Warna)** dengan identitas visual khas _Deep Forest Teal_ dan _Terracotta_. Secara _default_, tema aplikasi beroperasi dalam **Mode Terang (Light Theme)** yang bersih dan elegan.

---

## Identitas Visual & Desain

- **Strict Rule:** **100% Warna Solid.** Seluruh komponen bebas dari gradasi warna (`bg-gradient-*` ditiadakan).
- **Primary Brand Color:** `#287361` _(Deep Forest Teal)_
- **Secondary Brand Color:** `#c36433` _(Terracotta / Burnt Orange)_
- **Default Theme:** **Light Mode** _(dengan dukungan switcher tema opsional berbasis kelas `.dark`)_.

---

## Fitur Utama

### 1. Beranda Dinamis, Eksplorasi Kategori, & Katalog Produk (`/`, `/categories`, `/products`)

- **Promo Carousel Beranda:** Banner interaktif dengan _touch swipe gesture_, _autoplay_, dan badge penawaran berbatas waktu (_solid colors_).
- **Direktori Kategori Mandiri (`/categories`):** Halaman eksplorasi seluruh kategori busana dengan _breadcrumbs_, kartu kategori responsif, dan ikon _fallback_ otomatis.
- **Pencarian Cerdas:** Kolom pencarian di navbar dan mobile menu dengan _debounced instant search_.
- **Penyaring Kategori & Pengurutan:** Filter kategori berbasis _pill_ (mendukung ID & slug) dan opsi pengurutan (_Termurah, Termahal, Terbaru, Terlama_).
- **Responsif Mobile & Status Stok:** Tata letak grid 2-kolom pada perangkat seluler, penanganan stok produk, dan tombol cepat _"Beli"_ langsung dari kartu produk.

### 2. Halaman Rincian Produk (`/products/[id]`)

- **Pratinjau Gambar:** Kontainer gambar produk responsif dengan optimasi Next.js Image.
- **Informasi & Tab Spesifikasi:** Tab _Deskripsi Produk_ dan _Spesifikasi Teknis_.
- **Kotak Pembelian Interaktif:** Kontrol penambahan/pengurangan kuantitas dengan kalkulasi subtotal instan.
- **Aksi Cepat:** Tombol _"Tambah ke Keranjang"_ (dengan umpan balik _toast_) dan _"Beli Sekarang"_ (langsung menuju keranjang).
- **Rekomendasi Terkait:** Grid produk pilihan dari kategori yang serupa.

### 3. Otentikasi & Akun Pengguna (`/login`, `/register`, `/profile`)

- **Login Cepat:** Dilengkapi tombol **1-Klik Akun Demo** (`agussumanto@example.com` / `password123`).
- **Pendaftaran Akun:** Formulir registrasi lengkap dengan validasi kecocokan sandi dan auto-login.
- **Profil Pengguna:** Kartu informasi akun, ringkasan aktivitas belanja, pintasan riwayat pesanan, dan tombol keluar sesi.
- **Session Management:** Token Bearer JWT tersimpan aman di `localStorage` dan tersinkronisasi antar-tab.

### 4. Keranjang Belanja Cerdas (`/cart`)

- **Hybrid Storage Sync:** Memanfaatkan `useSyncExternalStore` untuk performa tinggi, aman dari _hydration mismatch_, dan tersinkronisasi dengan server API saat pengguna _login_.
- **Manajemen Kuantitas:** Tambah, kurang, dan hapus item dengan pembaruan subtotal seketika.
- **Ringkasan Tagihan:** Kalkulasi otomatis total harga barang dan indikator kupon/gratis ongkir.

### 5. Formulir Checkout & Pemesanan (`/checkout`)

- **Proteksi Rute:** Mengarahkan tamu untuk masuk terlebih dahulu dan memvalidasi isi keranjang.
- **Formulir Pengiriman Lengkap:** Input nama penerima, nomor kontak/WhatsApp, alamat lengkap, kota/kode pos, dan catatan kurir.
- **Metode Pembayaran:** Instruksi transfer manual Bank (BCA, Mandiri, BRI) dan QRIS.
- **Auto-Clear Cart:** Keranjang belanja lokal dan server otomatis dikosongkan setelah pesanan berhasil dibuat.

### 6. Riwayat Pesanan & Unggah Bukti Bayar (`/orders`, `/orders/[id]`)

- **Tab Filter Status:** Menyaring pesanan berdasarkan _Semua, Menunggu Pembayaran, Diproses, Dikirim, Selesai, Dibatalkan_.
- **Solid Status Badge:** Penanda status pesanan dengan skema warna semantik solid.
- **Modal Upload Bukti Bayar:** Dialog pop-up untuk menyalin nomor rekening transfer dan mengunggah berkas foto struk/tangkapan layar transfer (_multipart/form-data_ ke Supabase).
- **Detail Faktur Lengkap (`/orders/[id]`):** Tampilan faktur terperinci, alamat tujuan, rincian biaya, dan pratinjau bukti transfer ukuran penuh.

---

## Tech Stack & Arsitektur

| Kategori        | Teknologi                                             | Deskripsi                                                   |
| :-------------- | :---------------------------------------------------- | :---------------------------------------------------------- |
| **Framework**   | [Next.js 16.4.3](https://nextjs.org/)                 | App Router, Server/Client Components, Next Image            |
| **UI Library**  | [React 19.3.0](https://react.dev/)                    | React Compiler, Hooks, `useSyncExternalStore`               |
| **Styling**     | [Tailwind CSS v4](https://tailwindcss.com/) & PostCSS | Utility-first CSS, `@theme inline`, solid palettes          |
| **Bahasa**      | [TypeScript 5](https://www.typescriptlang.org/)       | Strict type checking & API data contracts                   |
| **Ikon**        | [Lucide React](https://lucide.dev/)                   | Koleksi ikon SVG modern dan ringan                          |
| **Backend API** | REST API                                              | Base URL: `https://ecommerce-backend-api-nu.vercel.app/api` |

---

## Struktur Direktori Proyek

```text
fastshop/
├── app/                              # Next.js App Router
│   ├── (auth)/
│   │   ├── login/page.tsx            # Halaman Masuk (+ Pintasan Akun Demo)
│   │   └── register/page.tsx         # Halaman Registrasi
│   ├── cart/page.tsx                 # Halaman Keranjang Belanja
│   ├── categories/page.tsx           # Halaman Direktori Semua Kategori Produk
│   ├── checkout/page.tsx             # Halaman Formulir Checkout
│   ├── orders/
│   │   ├── page.tsx                  # Halaman Riwayat Pesanan (Status Tabs)
│   │   └── [id]/page.tsx             # Halaman Faktur & Detail Pesanan
│   ├── products/
│   │   ├── page.tsx                  # Katalog Produk (Search, Filter, Sort)
│   │   └── [id]/page.tsx             # Detail Produk, Tabs, & Related Items
│   ├── profile/page.tsx              # Halaman Profil & Akun Pengguna
│   ├── globals.css                   # Tailwind v4 theme tokens & custom variants
│   ├── layout.tsx                    # Root Layout (Navbar, Providers, Footer)
│   └── page.tsx                      # Beranda Utama
├── components/
│   ├── cart/                         # Komponen baris keranjang & ringkasan tagihan
│   ├── home/                         # PromoCarousel banner beranda
│   ├── layout/                       # Navbar, Footer, Mobile Menu, User Menu, Search
│   ├── orders/                       # OrderStatusBadge, PaymentUploadModal
│   ├── products/                     # ProductCard, ProductSkeleton, PurchaseBox, Toast
│   └── ui/                           # Breadcrumbs, Pagination, dll.
├── context/
│   ├── app-provider.tsx              # Root wrapper penyedia context
│   ├── auth-context.tsx              # Sesi autentikasi pengguna
│   ├── cart-context.tsx              # State keranjang belanja & sinkronisasi server
│   └── theme-context.tsx             # Pengatur tema (Default Light Mode)
├── lib/
│   ├── api/                          # HTTP client & service endpoints (auth, products, categories, cart, orders)
│   ├── constants.ts                  # Konstanta aplikasi & storage keys
│   └── utils.ts                      # FormatRupiah & string helpers
├── types/
│   └── index.ts                      # Data model interfaces & contracts
├── DESIGN.md                         # Spesifikasi token desain & panduan visual
├── PRODUCT.md                        # Dokumentasi produk, positioning, & kapabilitas
├── docs/                             # Rencana pengembangan & dokumentasi API
└── public/                           # Aset statis & logo
```

---

## Memulai Pengembangan Lokal

### Prasyarat

- [Node.js](https://nodejs.org/) versi `20.x` atau lebih baru
- [npm](https://www.npmjs.com/) atau manajer paket favorit Anda

### 1. Kloning Repositori

```bash
git clone https://github.com/username/fastshop.git
cd fastshop
```

### 2. Instalasi Dependensi

```bash
npm install
```

### 3. Konfigurasi Environment Variables (Opsional)

Buat berkas `.env.local` jika ingin mengarahkan API URL secara kustom (secara default sudah mengarah ke production backend):

```env
NEXT_PUBLIC_API_URL=https://ecommerce-backend-api-nu.vercel.app/api
```

### 4. Jalankan Server Pengembangan

```bash
npm run dev
```

Buka peramban Anda di [http://localhost:3000](http://localhost:3000).

---

## Pemeriksaan Kualitas & Build

### 1. Pengecekan Zero Gradients (Aturan Wajib)

```bash
grep -rn "gradient" app components lib
# Hasil HARUS 0 matches (100% solid colors)
```

### 2. Linting Kode

```bash
npm run lint
```

### 3. Type Checking

```bash
npx tsc --noEmit
```

### 4. Build Produksi

```bash
npm run build
npm start
```

---

## Akun Demo Pengujian

Untuk menguji fitur yang membutuhkan akun (Checkout, Keranjang Sinkron, Unggah Bukti Bayar, Riwayat Pesanan):

| Informasi      | Kredensial                                                                                     |
| :------------- | :--------------------------------------------------------------------------------------------- |
| **Email**      | `agussumanto@example.com`                                                                      |
| **Kata Sandi** | `password123`                                                                                  |
| **Cara Cepat** | Di halaman `/login`, klik tombol **"Gunakan Akun Demo"** untuk mengisi formulir secara instan. |

---

## Lisensi

Proyek ini dilisensikan di bawah lisensi [MIT](LICENSE).
