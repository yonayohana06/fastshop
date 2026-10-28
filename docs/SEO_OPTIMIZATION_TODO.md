# 📋 To-Do List Optimasi SEO Produk (FastShop)

Dokumen ini berisi rencana kerja terstruktur untuk mengoptimalkan *Search Engine Optimization* (SEO) pada halaman produk FastShop, mengubah metode rendering dari murni *Client-Side Fetching* menjadi **Hybrid Server-Side Rendering (SSR/ISR)** agar terindeks sempurna oleh mesin pencari (Google, Bing) dan menampilkan pratinjau kaya (*rich snippet*) di media sosial.

---

## 🎯 Target Utama
1. **Peringkat Tinggi di Google:** Produk muncul di hasil pencarian organik dengan informasi harga, stok, dan gambar.
2. **Google Rich Snippets:** Menampilkan bintang rating, harga dalam IDR, status stok (*In Stock*), dan breadcrumb path langsung di Google.
3. **Social Sharing Cards:** Tampilan pratinjau kartu gambar besar (*large image card*) ketika tautan produk dibagikan ke WhatsApp, Telegram, Twitter/X, Facebook, dan LinkedIn.
4. **LCP & Core Web Vitals Optimal:** Waktu muat halaman cepat dengan gambar utama teroptimasi.

---

## 📌 Checklist To-Do List

### 🚀 Fase 1: Server-Side Pre-rendering & Dynamic Metadata (Prioritas Tertinggi)
> Mengubah halaman detail produk menjadi Server Component agar metadata dan konten awal sudah terisi dalam HTML sebelum dikirim ke peramban.

- [ ] **1.1. Refaktor `app/products/[id]/page.tsx` menjadi Server Component**
  - Hapus direktif `"use client"` di level halaman utama.
  - Pindahkan pengambilan data produk ke server menggunakan `fetch` langsung ke backend API dengan caching/revalidasi (`next: { revalidate: 3600 }`).
  - Isolasi bagian interaktif ke dalam *Client Component islands* (misal: `<ProductPurchaseBox />`, `<ProductImageGallery />`, tab deskripsi).
- [ ] **1.2. Implementasi `generateMetadata()` Dinamis**
  - Buat fungsi `generateMetadata({ params })` di `app/products/[id]/page.tsx`.
  - Pasang tag metadata standar:
    - `title: `${product.name} | Beli Online di FastShop``
    - `description`: Cuplikan bersih 150-160 karakter dari deskripsi produk.
    - `canonical`: URL kanonik absolut produk (`https://fastshop.id/products/[id]`).
- [ ] **1.3. Open Graph & Twitter Cards**
  - Konfigurasi `openGraph`:
    - `title`: Nama produk
    - `description`: Deskripsi ringkas
    - `url`: Tautan lengkap produk
    - `siteName`: FastShop
    - `images`: URL foto utama produk (`product.image_url`) dengan lebar & tinggi optimal.
    - `type: 'website'` / `'product'`
  - Konfigurasi `twitter`:
    - `card: 'summary_large_image'`
    - `title`: Nama produk
    - `images`: Foto produk

---

### 🏷️ Fase 2: Structured Data Schema (JSON-LD Google Rich Results)
> Menyisipkan data terstruktur standar Schema.org agar Google memahami konteks e-commerce.

- [ ] **2.1. Skema Produk (`Schema.org/Product`)**
  - Tambahkan tag `<script type="application/ld+json">` pada halaman detail produk:
    - `@context`: `https://schema.org/`
    - `@type`: `Product`
    - `name`: Nama produk
    - `image`: URL gambar produk
    - `description`: Deskripsi produk
    - `brand`: Nama brand / FastShop
    - `category`: Kategori produk
    - `offers`:
      - `@type`: `Offer`
      - `priceCurrency`: `IDR`
      - `price`: Nilai harga numerik
      - `availability`: `https://schema.org/InStock` (atau `OutOfStock` jika stok 0)
      - `url`: URL produk kanonik
      - `seller`: `PT FastShop Indonesia`
- [ ] **2.2. Skema Breadcrumbs (`Schema.org/BreadcrumbList`)**
  - Sertakan data terstruktur navigasi breadcrumbs:
    - Tingkat 1: Beranda (`/`)
    - Tingkat 2: Semua Produk (`/products`)
    - Tingkat 3: Kategori (`/products?category=...`)
    - Tingkat 4: Nama Produk

---

### 🗺️ Fase 3: Peta Situs Dinamis & Robot Crawler (`sitemap.ts` & `robots.ts`)
> Membantu mesin pencari menemukan dan mengindeks seluruh URL produk secara otomatis.

- [ ] **3.1. Buat `app/sitemap.ts`**
  - Buat sitemap dinamis menggunakan fitur bawaan Next.js.
  - Query daftar seluruh produk dari Backend API (`GET /products?limit=1000`).
  - Generate entri XML untuk:
    - Rute statis: `/`, `/products`, `/categories` (frekuensi: `daily`, priority: `1.0` - `0.8`).
    - Seluruh rute dinamis produk: `/products/[id]` (frekuensi: `weekly`, priority: `0.7`, `lastModified` sesuai `updated_at`).
- [ ] **3.2. Buat `app/robots.ts`**
  - Buat aturan bot pencari menggunakan fitur Next.js `robots.ts`:
    - Izinkan bot umum (`User-agent: *`, `Allow: /`).
    - Larang perayapan pada halaman privat: `Disallow: /cart`, `Disallow: /checkout`, `Disallow: /orders`, `Disallow: /profile`.
    - Cantumkan tautan otomatis ke sitemap: `Sitemap: https://fastshop.id/sitemap.xml`.

---

### 🖼️ Fase 4: Optimasi Gambar & Core Web Vitals (Image SEO)
> Memastikan gambar produk terindeks di Google Images dan memuat instan.

- [ ] **4.1. Tag `alt` Deskriptif & Kontekstual**
  - Ganti tag `alt={product.name}` generik menjadi deskriptif, contoh: `alt={`Jual ${product.name} original bahan berkualitas - FastShop`}`.
- [ ] **4.2. Optimasi LCP (*Largest Contentful Paint*)**
  - Tambahkan atribut `priority={true}` pada gambar utama produk di `/products/[id]`.
  - Atur konfigurasi ukuran responsif (`sizes="(max-width: 768px) 100vw, 50vw"`) untuk menghindari unduhan gambar yang terlalu besar di perangkat seluler.
- [ ] **4.3. Format Gambar Modern (WebP / AVIF)**
  - Pastikan `next.config.ts` mengonfigurasi format gambar modern otomatis (`formats: ['image/avif', 'image/webp']`).

---

### 🧭 Fase 5: Heading Semantik & URL Structure
> Memperkuat struktur hierarki konten halaman.

- [ ] **5.1. Struktur Heading Semantik**
  - Pastikan hanya ada tepat satu elemen `<h1>` per halaman (yaitu nama produk).
  - Bagian deskripsi dan spesifikasi menggunakan `<h2>`.
  - Bagian produk terkait menggunakan `<h2>` atau `<h3>`.
- [ ] **5.2. Slug URL Ramah Pengguna (Opsional / Rekomendasi)**
  - Mendukung format URL berbasis slug (contoh: `/products/[id]-[slug]`, misal `/products/5-t-shirt-polos-hitam`) agar kata kunci produk terbaca di URL oleh Google.

---

### 🧪 Fase 6: Pengujian, Audit, & Verifikasi
> Memvalidasi bahwa seluruh konfigurasi SEO berjalan sesuai standar mesin pencari.

- [ ] **6.1. Validasi Rich Results Google**
  - Uji halaman produk di [Google Rich Results Test](https://search.google.com/test/rich-results) untuk memastikan tidak ada kesalahan schema markup JSON-LD.
- [ ] **6.2. Uji Pratinjau Sosial (Social Media Card Validator)**
  - Uji URL produk di Facebook Sharing Debugger, Twitter Card Validator, dan opengraph.xyz.
- [ ] **6.3. Audit Lighthouse SEO**
  - Jalankan Google Chrome Lighthouse audit dan targetkan skor **SEO 100/100**.
  - Verifikasi tag meta viewport, font sizing, contrast ratio, dan crawlability.
