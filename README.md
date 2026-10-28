# FastShop 🛍️ — Modern E-Commerce Storefront

FastShop adalah aplikasi storefront *e-commerce* modern berkecepatan tinggi yang dibangun menggunakan **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS v4**, dan **TypeScript**. Aplikasi ini terintegrasi langsung dengan Backend REST API untuk mengelola katalog produk, otentikasi pengguna, keranjang belanja, *checkout*, serta pengunggahan bukti pembayaran.

Desain visual mengusung filosofi **Solid Colors (Bebas Gradasi Warna)** dengan identitas visual khas *Deep Forest Teal* dan *Terracotta*. Secara *default*, tema aplikasi beroperasi dalam **Mode Terang (Light Theme)** yang bersih dan elegan.

---

## 🎨 Identitas Visual & Desain

- **Strict Rule:** **100% Warna Solid.** Seluruh komponen bebas dari gradasi warna (`bg-gradient-*` ditiadakan).
- **Primary Brand Color:** `#287361` *(Deep Forest Teal)*
- **Secondary Brand Color:** `#c36433` *(Terracotta / Burnt Orange)*
- **Default Theme:** **Light Mode** *(dengan dukungan switcher tema opsional berbasis kelas `.dark`)*.

---

## ✨ Fitur Utama

### 1. Beranda Dinamis & Katalog Produk (`/`, `/products`)
- **Hero Showcase:** Banner sambutan dengan penawaran gratis ongkir dan jaminan keaslian produk.
- **Pencarian Cerdas:** Kolom pencarian di navbar dan mobile menu dengan *debounced instant search*.
- **Penyaring Kategori & Pengurutan:** Filter kategori berbasis *pill* dan opsi pengurutan (*Termurah, Termahal, Terbaru, Terlama*).
- **Paginasi & Status Stok:** Penanganan stok produk dengan tombol cepat *"Beli"* langsung dari kartu produk.

### 2. Halaman Rincian Produk (`/products/[id]`)
- **Pratinjau Gambar:** Kontainer gambar produk responsif dengan optimasi Next.js Image.
- **Informasi & Tab Spesifikasi:** Tab *Deskripsi Produk* dan *Spesifikasi Teknis*.
- **Kotak Pembelian Interaktif:** Kontrol penambahan/pengurangan kuantitas dengan kalkulasi subtotal instan.
- **Aksi Cepat:** Tombol *"Tambah ke Keranjang"* (dengan umpan balik *toast*) dan *"Beli Sekarang"* (langsung menuju keranjang).
- **Rekomendasi Terkait:** Grid produk pilihan dari kategori yang serupa.

### 3. Otentikasi & Akun Pengguna (`/login`, `/register`, `/profile`)
- **Login Cepat:** Dilengkapi tombol **1-Klik Akun Demo** (`agussumanto@example.com` / `password123`).
- **Pendaftaran Akun:** Formulir registrasi lengkap dengan validasi kecocokan sandi dan auto-login.
- **Profil Pengguna:** Kartu informasi akun, ringkasan aktivitas belanja, pintasan riwayat pesanan, dan tombol keluar sesi.
- **Session Management:** Token Bearer JWT tersimpan aman di `localStorage` dan tersinkronisasi antar-tab.

### 4. Keranjang Belanja Cerdas (`/cart`)
- **Hybrid Storage Sync:** Memanfaatkan `useSyncExternalStore` untuk performa tinggi, aman dari *hydration mismatch*, dan tersinkronisasi dengan server API saat pengguna *login*.
- **Manajemen Kuantitas:** Tambah, kurang, dan hapus item dengan pembaruan subtotal seketika.
- **Ringkasan Tagihan:** Kalkulasi otomatis total harga barang dan indikator kupon/gratis ongkir.

### 5. Formulir Checkout & Pemesanan (`/checkout`)
- **Proteksi Rute:** Mengarahkan tamu untuk masuk terlebih dahulu dan memvalidasi isi keranjang.
- **Formulir Pengiriman Lengkap:** Input nama penerima, nomor kontak/WhatsApp, alamat lengkap, kota/kode pos, dan catatan kurir.
- **Metode Pembayaran:** Instruksi transfer manual Bank (BCA, Mandiri, BRI) dan QRIS.
- **Auto-Clear Cart:** Keranjang belanja lokal dan server otomatis dikosongkan setelah pesanan berhasil dibuat.

### 6. Riwayat Pesanan & Unggah Bukti Bayar (`/orders`, `/orders/[id]`)
- **Tab Filter Status:** Menyaring pesanan berdasarkan *Semua, Menunggu Pembayaran, Diproses, Dikirim, Selesai, Dibatalkan*.
- **Solid Status Badge:** Penanda status pesanan dengan skema warna semantik solid.
- **Modal Upload Bukti Bayar:** Dialog pop-up untuk menyalin nomor rekening transfer dan mengunggah berkas foto struk/tangkapan layar transfer (*multipart/form-data* ke Supabase).
- **Detail Faktur Lengkap (`/orders/[id]`):** Tampilan faktur terperinci, alamat tujuan, rincian biaya, dan pratinjau bukti transfer ukuran penuh.

---

## 🛠️ Tech Stack & Arsitektur

| Kategori | Teknologi | Deskripsi |
| :--- | :--- | :--- |
| **Framework** | [Next.js 16.4.3](https://nextjs.org/) | App Router, Server/Client Components, Next Image |
| **UI Library** | [React 19.3.0](https://react.dev/) | React Compiler, Hooks, `useSyncExternalStore` |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) & PostCSS | Utility-first CSS, `@theme inline`, solid palettes |
| **Bahasa** | [TypeScript 5](https://www.typescriptlang.org/) | Strict type checking & API data contracts |
| **Ikon** | [Lucide React](https://lucide.dev/) | Koleksi ikon SVG modern dan ringan |
| **Backend API** | REST API | Base URL: `https://ecommerce-backend-api-nu.vercel.app/api` |

---

## 📁 Struktur Direktori Proyek

```text
fastshop/
├── app/                              # Next.js App Router
│   ├── (auth)/
│   │   ├── login/page.tsx            # Halaman Masuk (+ Pintasan Akun Demo)
│   │   └── register/page.tsx         # Halaman Registrasi
│   ├── cart/page.tsx                 # Halaman Keranjang Belanja
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
│   ├── api/                          # HTTP client & service endpoints (auth, products, cart, orders)
│   ├── constants.ts                  # Konstanta aplikasi & storage keys
│   └── utils.ts                      # FormatRupiah & string helpers
├── types/
│   └── index.ts                      # Data model interfaces & contracts
├── docs/                             # Rencana pengembangan & dokumentasi API
└── public/                           # Aset statis & logo
```

---

## 🚀 Memulai Pengembangan Lokal

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

## 🧪 Pemeriksaan Kualitas & Build

### Linting Kode
```bash
npm run lint
```

### Type Checking
```bash
npx tsc --noEmit
```

### Build Produksi
```bash
npm run build
npm start
```

---

## 🔑 Akun Demo Pengujian

Untuk menguji fitur yang membutuhkan akun (Checkout, Keranjang Sinkron, Unggah Bukti Bayar, Riwayat Pesanan):

| Informasi | Kredensial |
| :--- | :--- |
| **Email** | `agussumanto@example.com` |
| **Kata Sandi** | `password123` |
| **Cara Cepat** | Di halaman `/login`, klik tombol **"Gunakan Akun Demo"** untuk mengisi formulir secara instan. |

---

## 📄 Lisensi
Proyek ini dilisensikan di bawah lisensi [MIT](LICENSE).
