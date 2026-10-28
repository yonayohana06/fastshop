# Tahap 2: Halaman Katalog Produk, Beranda Dinamis, & Integrasi API (Solid Color) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Membangun integrasi API katalog produk dan kategori, halaman katalog belanja (`/products`) lengkap dengan filter kategori, pencarian, sorting, paginasi, kartu produk interaktif (aksi tambah ke keranjang belanja), serta memperbarui halaman Beranda (`/`) dengan katalog dinamis, dengan aturan ketat: **HANYA MENGGUNAKAN WARNA SOLID, TANPA GRADASI WARNA DI BAGIAN MANAPUN**.

**Architecture:** Memanfaatkan Server/Client components Next.js 16 App Router dengan fetch client terpusat di `lib/api/`. Komponen produk mengonsumsi state keranjang (`useCart()`) untuk aksi Add to Cart instan. Styling menggunakan warna solid token `--primary` (#287361) dan `--secondary` (#c36433) tanpa gradient class (`bg-gradient-*`, `from-*`, `to-*`, `bg-clip-text` dilarang).

**Tech Stack:** Next.js 16.4.3, React 19.3.0, TypeScript 5, Tailwind CSS v4, Lucide React, API Backend `https://ecommerce-backend-api-nu.vercel.app/api/`.

**Spec:** [docs/API_RESPONSES.md](file:///Users/mmm/Documents/project/FE/fastshop/docs/API_RESPONSES.md) (Section 2: Products & Section 3: Categories)

## Global Constraints

- **STRICT: TANPA GRADASI WARNA.** Tidak boleh ada `bg-gradient-*`, `from-*`, `to-*`, `via-*`, atau `bg-clip-text`. Gunakan warna solid, border solid, dan badge warna solid.
- Konfigurasi `next.config.ts` harus mengizinkan domain gambar eksternal (`images.unsplash.com`, `img.icons8.com`, `*.supabase.co`).
- Format mata uang harus konsisten dalam format Rupiah Indonesia (contoh: `Rp 235.000`).
- Error handling API harus tangguh: jika backend lambat atau gagal, antarmuka tetap menampilkan feedback yang jelas / fallback state yang tidak merusak halaman.

## Review Focus

- **Bebas Gradasi:** Pastikan tidak ada satupun class Tailwind bertipe gradient di seluruh komponen baru maupun lama.
- **Add to Cart Feedback:** Saat tombol "Tambah ke Keranjang" di klik pada Product Card, jumlah badge di Navbar harus langsung bertambah dan muncul indikator feedback sesaat.
- **Filter & Search URL Sync:** Perubahan kategori atau search query di `/products` harus tersinkronisasi dengan query string URL browser.
- **Handling Gambar:** Gambar produk harus memiliki penanganan error (fallback placeholder) jika URL gambar eksternal rusak/404.
- **Paginasi:** Kontrol Next/Prev dan tombol halaman harus dinonaktifkan dengan benar jika berada di halaman awal/akhir.

---

### Task 1: Hapus Gradasi Existing & Konfigurasi Domain Gambar

**Files:**
- Modify: `app/page.tsx`
- Modify: `next.config.ts`

**Interfaces:**
- Produces: `next.config.ts` dengan `images.remotePatterns` dan `app/page.tsx` bersih dari kelas gradasi.

- [ ] **Step 1: Bersihkan gradasi di `app/page.tsx`**
Hapus `bg-gradient-to-b from-primary/10 via-white to-zinc-50/50` dan ganti dengan background solid `bg-zinc-50 dark:bg-zinc-950`.
Hapus `bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent` dan ganti dengan teks solid `<span className="text-primary">`.

- [ ] **Step 2: Konfigurasi `next.config.ts` untuk remote image patterns**
Tambahkan `images.remotePatterns` untuk `images.unsplash.com`, `img.icons8.com`, dan `*.supabase.co`.

- [ ] **Step 3: Verifikasi Linting**
Jalankan: `npm run lint`
Pastikan: Tidak ada error.

- [ ] **Step 4: Commit**
```bash
git add app/page.tsx next.config.ts
git commit -m "style: remove all gradients and configure remote image domains"
```

---

### Task 2: Service API Client & Helper Format Rupiah

**Files:**
- Create: `lib/utils.ts`
- Create: `lib/api/client.ts`
- Create: `lib/api/products.ts`
- Create: `lib/api/categories.ts`

**Interfaces:**
- Consumes: `types/index.ts`, `lib/constants.ts`
- Produces: `formatRupiah(amount: number | string): string`, `getProducts(params)`, `getProductById(id)`, `getCategories()`, `getCategoryById(id)`

- [ ] **Step 1: Buat `lib/utils.ts`**
Fungsi `formatRupiah(amount: number | string): string` untuk format angka ke format standar mata uang Indonesia (`Rp 125.000`).

- [ ] **Step 2: Buat generic HTTP client `lib/api/client.ts`**
Helper wrapper `apiClient` dengan timeout aman, header JSON, penyertaan bearer token jika ada, dan parsing response terpusat.

- [ ] **Step 3: Buat `lib/api/products.ts` dan `lib/api/categories.ts`**
Fungsi fetcher untuk `GET /products` (dengan parameter `search`, `category_id`, `page`, `limit`) dan `GET /categories`.

- [ ] **Step 4: Verifikasi Linting & Typecheck**
Jalankan: `npm run lint && npx tsc --noEmit`
Pastikan: Bersih tanpa error.

- [ ] **Step 5: Commit**
```bash
git add lib/utils.ts lib/api/client.ts lib/api/products.ts lib/api/categories.ts
git commit -m "feat(api): add products and categories api services and rupiah formatter"
```

---

### Task 3: Komponen Card Produk & Skeleton Loading

**Files:**
- Create: `components/products/product-card.tsx`
- Create: `components/products/product-skeleton.tsx`

**Interfaces:**
- Consumes: `Product` dari `types`, `useCart()`, `formatRupiah()`
- Produces: `<ProductCard product={...} />` dan `<ProductSkeleton count={...} />`

- [ ] **Step 1: Buat komponen `components/products/product-skeleton.tsx`**
Placeholder loading skeleton bergaya solid neutral untuk animasi loading saat memuat produk.

- [ ] **Step 2: Buat komponen `components/products/product-card.tsx`**
Card produk bersih dengan:
- Gambar produk dengan fallback elegan
- Badge kategori dengan warna solid (`bg-primary-light text-primary`)
- Judul produk dan harga Rupiah tebal
- Indikator stok
- Tombol aksi cepat "Tambah ke Keranjang" dengan efek feedback sesaat saat ditekan

- [ ] **Step 3: Verifikasi Linting**
Jalankan: `npm run lint`
Pastikan: Bersih tanpa error.

- [ ] **Step 4: Commit**
```bash
git add components/products/product-card.tsx components/products/product-skeleton.tsx
git commit -m "feat(ui): implement product card with add to cart action and skeleton loader"
```

---

### Task 4: Halaman Katalog Produk (`app/products/page.tsx`)

**Files:**
- Create: `components/products/category-filter.tsx`
- Create: `components/ui/pagination.tsx`
- Create: `app/products/page.tsx`

**Interfaces:**
- Consumes: `ProductCard`, `ProductSkeleton`, `getProducts`, `getCategories`
- Produces: Halaman katalog produk interaktif `/products` dengan filter, sorting, dan paginasi.

- [ ] **Step 1: Buat filter kategori `components/products/category-filter.tsx`**
Daftar pill tombol solid untuk memilih kategori (Semua, Kemeja, Jeans, Sepatu, dsb.) dengan indikator aktif solid primary.

- [ ] **Step 2: Buat komponen paginasi `components/ui/pagination.tsx`**
Tombol Previous, Next, dan nomor halaman aktif dengan warna solid.

- [ ] **Step 3: Buat halaman `/products` di `app/products/page.tsx`**
Halaman katalog lengkap yang mendukung:
- Sinkronisasi URL search params (`search`, `category`, `page`, `sort`)
- Fetching data produk dan kategori
- Tampilan grid produk responsif (1 kolom mobile, 2 tablet, 3-4 desktop)
- Empty state informatif jika produk tidak ditemukan dengan tombol reset filter

- [ ] **Step 4: Verifikasi Linting & Typecheck**
Jalankan: `npm run lint && npx tsc --noEmit`
Pastikan: Bersih tanpa error.

- [ ] **Step 5: Commit**
```bash
git add components/products/category-filter.tsx components/ui/pagination.tsx app/products/page.tsx
git commit -m "feat(catalog): implement products catalog page with category filter, sorting, and pagination"
```

---

### Task 5: Perbarui Halaman Beranda (`app/page.tsx`) dengan Katalog Dinamis

**Files:**
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `getProducts`, `getCategories`, `ProductCard`, `TrustBadges`
- Produces: Halaman beranda utama yang dinamis, menarik, dan sepenuhnya bebas gradasi warna.

- [ ] **Step 1: Ambil data produk & kategori dinamis di `app/page.tsx`**
Tampilkan section "Produk Pilihan / Terbaru" langsung dari API menggunakan `<ProductCard />`.

- [ ] **Step 2: Sesuaikan styling Hero Banner dengan warna solid**
Gunakan container solid clean dengan aksen primary dan secondary yang tegas tanpa gradasi.

- [ ] **Step 3: Verifikasi Linting, Typecheck, dan Build**
Jalankan: `npm run lint && npx tsc --noEmit`
Pastikan: Tidak ada error dan seluruh pengecekan lulus 100%.

- [ ] **Step 4: Commit**
```bash
git add app/page.tsx
git commit -m "feat(home): dynamic products showcase on homepage with solid styling"
```
