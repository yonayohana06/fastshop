# Tahap 5: Halaman Keranjang Belanja (`/cart`) & Sinkronisasi API Cart (Solid Color) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Membangun modul keranjang belanja komprehensif mencakup Cart API service (`lib/api/cart.ts`), peningkatan sinkronisasi backend pada `CartContext`, komponen baris produk keranjang (`cart-item-row.tsx`), kartu ringkasan pesanan (`cart-summary.tsx`), dan halaman utama keranjang belanja (`/cart`) dengan tampilan kosong (empty state) yang menarik — dengan aturan ketat: **HANYA MENGGUNAKAN WARNA SOLID, BEBAS DARI GRADASI WARNA**.

**Architecture:** Next.js 16 App Router Client Components yang terintegrasi dengan `useCart()` dan `useAuth()`. Keranjang mendukung mode hibrida: bekerja secara lokal via `localStorage` untuk tamu dan otomatis tersinkronisasi ke server (`GET /cart`, `POST /cart`, `PUT /cart/:id`, `DELETE /cart/:id`, `DELETE /cart`) saat user telah login.

**Tech Stack:** Next.js 16.4.3, React 19.3.0, TypeScript 5, Tailwind CSS v4, Lucide React.

**Spec:** [docs/API_RESPONSES.md](file:///Users/mmm/Documents/project/FE/fastshop/docs/API_RESPONSES.md) (Section 4: Cart - Customer Storefront)

## Global Constraints

- **STRICT: TANPA GRADASI WARNA.** Tidak boleh ada `bg-gradient-*`, `from-*`, `to-*`, `via-*`, atau `bg-clip-text`. Gunakan warna solid, border solid, dan badge warna solid.
- Tombol aksi utama (Checkout / Lanjut Bayar) menggunakan warna solid primary `#287361` atau secondary `#c36433`.
- Pengurangan kuantitas hingga 0 memicu konfirmasi penghapusan barang.
- Format nominal harga menggunakan `formatRupiah()`.

## Review Focus

- **Empty State:** Bila tidak ada barang di keranjang, tampilkan antarmuka empty state yang ramah dan tombol "Mulai Belanja" yang mengarahkan ke `/products`.
- **Quantity Sync:** Perubahan kuantitas (+ / -) di halaman keranjang langsung memperbarui subtotal item, grand total, dan angka badge pada Navbar.
- **Hapus Item & Kosongkan Keranjang:** Pengguna dapat menghapus satu item atau mengosongkan seluruh isi keranjang dengan tombol "Kosongkan Keranjang".
- **Navigasi ke Checkout:** Tombol "Lanjut ke Pembayaran" mengarahkan pengguna ke halaman Checkout (jika belum login, mengarahkan ke `/login?redirect=/checkout`).
- **Offline / Server Resiliency:** Jika panggilan API keranjang server gagal, state lokal tetap aman dan tidak merusak keranjang pengguna.

---

### Task 1: Cart API Service & Sinkronisasi Cart Context

**Files:**
- Create: `lib/api/cart.ts`
- Modify: `context/cart-context.tsx`

**Interfaces:**
- Consumes: `lib/api/client.ts`, `types/index.ts`
- Produces: `getCartApi()`, `addToCartApi()`, `updateCartItemApi()`, `deleteCartItemApi()`, `clearCartApi()`, dan enhanced `useCart()` dengan sinkronisasi server.

- [ ] **Step 1: Buat service API keranjang `lib/api/cart.ts`**
Implementasikan fungsi untuk:
- `GET /cart`
- `POST /cart`
- `PUT /cart/:id`
- `DELETE /cart/:id`
- `DELETE /cart`

- [ ] **Step 2: Tingkatkan `context/cart-context.tsx` dengan sinkronisasi server**
Tambahkan kemampuan sinkronisasi otomatis ke endpoint backend jika token JWT tersedia di session pengguna, sembari mempertahankan persistensi lokal yang cepat.

- [ ] **Step 3: Verifikasi Linting & Typecheck**
Jalankan: `npm run lint && npx tsc --noEmit`
Pastikan: Bersih tanpa error.

- [ ] **Step 4: Commit**
```bash
git add lib/api/cart.ts context/cart-context.tsx
git commit -m "feat(cart): add cart api service and server synchronization in cart context"
```

---

### Task 2: Komponen Baris Produk Keranjang (`cart-item-row.tsx`)

**Files:**
- Create: `components/cart/cart-item-row.tsx`

**Interfaces:**
- Consumes: `CartItem`, `useCart()`, `formatRupiah()`
- Produces: Komponen `<CartItemRow item={...} />`

- [ ] **Step 1: Buat komponen `components/cart/cart-item-row.tsx`**
Implementasikan:
- Thumbnail gambar produk dengan fallback
- Tautan judul produk ke halaman detail
- Harga satuan dan kontrol kuantitas (- dan +)
- Subtotal item
- Tombol hapus item (ikon `Trash2`) dengan konfirmasi

- [ ] **Step 2: Verifikasi Linting & Typecheck**
Jalankan: `npm run lint && npx tsc --noEmit`
Pastikan: Bersih tanpa error.

- [ ] **Step 3: Commit**
```bash
git add components/cart/cart-item-row.tsx
git commit -m "feat(ui): implement cart item row with quantity controls and delete action"
```

---

### Task 3: Komponen Ringkasan Pesanan (`cart-summary.tsx`)

**Files:**
- Create: `components/cart/cart-summary.tsx`

**Interfaces:**
- Consumes: `useCart()`, `useAuth()`, `formatRupiah()`
- Produces: Komponen `<CartSummary />`

- [ ] **Step 1: Buat komponen `components/cart/cart-summary.tsx`**
Implementasikan:
- Ringkasan total kuantitas dan total harga
- Info bebas ongkos kirim (Gratis Ongkir)
- Field input kode voucher / kupon promo (opsional)
- Tombol aksi "Lanjut ke Pembayaran" yang pintar: mengarahkan ke `/checkout` (atau ke `/login?redirect=/checkout` bila belum login)
- Kotak jaminan keamanan pembayaran (BCA, Mandiri, BNI, BRI, QRIS)

- [ ] **Step 2: Verifikasi Linting & Typecheck**
Jalankan: `npm run lint && npx tsc --noEmit`
Pastikan: Bersih tanpa error.

- [ ] **Step 3: Commit**
```bash
git add components/cart/cart-summary.tsx
git commit -m "feat(ui): implement cart summary box with checkout CTA and security guarantees"
```

---

### Task 4: Halaman Keranjang Belanja Utama (`app/cart/page.tsx`)

**Files:**
- Create: `app/cart/page.tsx`

**Interfaces:**
- Consumes: `Breadcrumbs`, `CartItemRow`, `CartSummary`, `useCart()`
- Produces: Halaman `/cart` yang utuh, responsif, dan interaktif.

- [ ] **Step 1: Buat halaman `/cart` di `app/cart/page.tsx`**
Implementasikan:
- Navigasi breadcrumbs: Beranda > Keranjang Belanja
- Layout 2 kolom: Daftar item di kiri, Ringkasan belanja di kanan
- Tampilan Empty State jika keranjang kosong
- Tombol "Kosongkan Keranjang" dan "Lanjut Belanja"
- **Zero gradients — hanya warna solid!**

- [ ] **Step 2: Pengecekan Gradasi Global**
Jalankan `grep -rn "gradient" app components lib`
Pastikan: 0 kecocokan.

- [ ] **Step 3: Verifikasi Linting & Typecheck**
Jalankan: `npm run lint && npx tsc --noEmit`
Pastikan: Bersih tanpa error.

- [ ] **Step 4: Commit**
```bash
git add app/cart/page.tsx
git commit -m "feat(cart): implement main cart page with empty state and responsive layout"
```
