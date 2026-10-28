# Tahap 3: Halaman Detail Produk & Alur Belanja Interaktif (Solid Color) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Membangun halaman detail produk komprehensif (`/products/[id]`) yang responsif dan interaktif, mencakup galeri gambar, breadcrumbs, pemilih kuantitas barang, aksi "Tambah ke Keranjang" & "Beli Sekarang", kalkulasi subtotal instan, deskripsi berformat, ringkasan pengiriman/pembayaran, dan rekomendasi produk terkait — dengan aturan ketat: **HANYA MENGGUNAKAN WARNA SOLID, BEBAS DARI GRADASI WARNA**.

**Architecture:** Next.js 16 App Router Dynamic Route (`app/products/[id]/page.tsx`) dengan fetching data via `getProductById(id)` dan `getProducts({ category_id })`. Interaksi kuantitas dan cart dikelola oleh Client Component yang terhubung langsung ke `CartContext` (`useCart()`). Styling solid berbasis token `--primary` (#287361) dan `--secondary` (#c36433).

**Tech Stack:** Next.js 16.4.3, React 19.3.0, TypeScript 5, Tailwind CSS v4, Lucide React.

**Spec:** [docs/API_RESPONSES.md](file:///Users/mmm/Documents/project/FE/fastshop/docs/API_RESPONSES.md) (Section 2: `GET /products/:id`)

## Global Constraints

- **STRICT: TANPA GRADASI WARNA.** Tidak boleh ada `bg-gradient-*`, `from-*`, `to-*`, `via-*`, atau `bg-clip-text`. Gunakan warna solid, border solid, dan badge warna solid.
- Penanganan ID produk tidak valid atau produk tidak ditemukan harus menampilkan 404 / NotFound state yang ramah dan opsi kembali ke katalog.
- Pemilih kuantitas tidak boleh melebihi stok yang tersedia dan tidak boleh kurang dari 1.
- Format nominal harga dan subtotal menggunakan `formatRupiah()`.

## Review Focus

- **Quantity Validation:** Input kuantitas tidak boleh melebihi batas stok (`product.stock`) atau bernilai negatif/nol.
- **Cart Feedback:** Menekan "Tambah ke Keranjang" memicu notifikasi visual sesaat dan menambah kuantitas barang sesuai jumlah yang dipilih pada indikator keranjang Navbar.
- **Beli Sekarang:** Menekan "Beli Sekarang" menambahkan item ke keranjang dan mengarahkan pengguna langsung ke halaman `/cart`.
- **Produk Terkait:** Menampilkan rekomendasi produk dengan kategori yang sama (jika ada) atau produk terbaru lainnya.
- **Formatting Deskripsi:** Teks deskripsi dengan karakter newline (`\n\n`) dan bullet point harus ter-render rapi dan mudah dibaca (`whitespace-pre-line`).

---

### Task 1: Komponen Breadcrumb & Feedback Toast Belanja

**Files:**
- Create: `components/ui/breadcrumbs.tsx`
- Create: `components/products/add-to-cart-toast.tsx`

**Interfaces:**
- Produces: `<Breadcrumbs items={...} />` dan `<AddToCartToast isOpen={...} onClose={...} product={...} quantity={...} />`

- [ ] **Step 1: Buat komponen `components/ui/breadcrumbs.tsx`**
Navigasi jejak halaman solid (Beranda > Semua Produk > Kategori > Nama Produk).

- [ ] **Step 2: Buat toast/banner feedback `components/products/add-to-cart-toast.tsx`**
Notifikasi mengambang atau banner solid saat produk berhasil dimasukkan ke keranjang belanja dengan tombol pintas "Lihat Keranjang" dan "Lanjut Belanja".

- [ ] **Step 3: Verifikasi Linting**
Jalankan: `npm run lint`
Pastikan: Bersih tanpa error.

- [ ] **Step 4: Commit**
```bash
git add components/ui/breadcrumbs.tsx components/products/add-to-cart-toast.tsx
git commit -m "feat(ui): add breadcrumbs and add-to-cart feedback toast components"
```

---

### Task 2: Komponen Interaktif Pembelian Produk

**Files:**
- Create: `components/products/product-purchase-box.tsx`

**Interfaces:**
- Consumes: `Product`, `useCart()`, `formatRupiah()`
- Produces: Komponen Client `<ProductPurchaseBox product={product} />`

- [ ] **Step 1: Buat komponen `components/products/product-purchase-box.tsx`**
Implementasikan:
- Kontrol kuantitas (- dan +) dengan proteksi batas stok
- Kalkulasi total harga berdasarkan kuantitas yang dipilih
- Tombol "Tambah ke Keranjang" (warna solid primary)
- Tombol "Beli Sekarang" (warna solid secondary)
- State loading / disabled saat stok habis
- Kotak jaminan keamanan pembayaran & pengiriman solid

- [ ] **Step 2: Verifikasi Linting & Typecheck**
Jalankan: `npm run lint && npx tsc --noEmit`
Pastikan: Bersih tanpa error.

- [ ] **Step 3: Commit**
```bash
git add components/products/product-purchase-box.tsx
git commit -m "feat(ui): implement product purchase box with quantity selector and cart actions"
```

---

### Task 3: Halaman Detail Produk (`app/products/[id]/page.tsx`)

**Files:**
- Create: `app/products/[id]/page.tsx`

**Interfaces:**
- Consumes: `getProductById()`, `getProducts()`, `Breadcrumbs`, `ProductPurchaseBox`, `ProductCard`
- Produces: Halaman `/products/[id]` yang lengkap dan dinamis.

- [ ] **Step 1: Buat halaman dinamis `app/products/[id]/page.tsx`**
Implementasikan:
- Fetching detail produk berdasarkan `params.id`
- Penanganan skeleton loader saat data dimuat
- Penanganan state jika produk tidak ditemukan (404)
- Layout 2 kolom: Galeri gambar di kiri dan info produk + Purchase Box di kanan
- Tab detail deskripsi & spesifikasi produk
- Section rekomendasi "Produk Terkait / Pilihan Lainnya"
- **Zero gradients — hanya warna solid!**

- [ ] **Step 2: Verifikasi Linting & Typecheck**
Jalankan: `npm run lint && npx tsc --noEmit`
Pastikan: Bersih tanpa error.

- [ ] **Step 3: Commit**
```bash
git add app/products/[id]/page.tsx
git commit -m "feat(catalog): implement dynamic product detail page with related products"
```

---

### Task 4: Verifikasi Fungsionalitas & Pengujian Navigasi End-to-End

**Files:**
- Test: Navigasi dari Beranda -> Katalog -> Klik Produk -> Tambah ke Keranjang -> Cek badge counter

- [ ] **Step 1: Verifikasi HTTP Render Halaman Detail**
Akses URL produk via curl / browser (contoh: `http://localhost:3000/products/13`).
Pastikan: Render `HTTP 200 OK` dengan nama produk, harga, dan tombol aksi.

- [ ] **Step 2: Pengecekan Gradasi Global**
Jalankan `grep -rn "gradient" app components`
Pastikan: 0 kecocokan (bebas gradasi).

- [ ] **Step 3: Verifikasi Linting & Typecheck Akhir**
Jalankan: `npm run lint && npx tsc --noEmit`
Pastikan: Keluar dengan kode 0 tanpa peringatan.
