# Tahap 6: Halaman Checkout, Upload Bukti Bayar, & Riwayat Pesanan (Solid Color) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Membangun modul Checkout pesanan (`/checkout`), alur upload bukti transfer pembayaran (`/orders/:id/pay`), halaman riwayat transaksi (`/orders`), dan detail pesanan (`/orders/[id]`) yang terintegrasi penuh ke backend — dengan aturan ketat: **HANYA MENGGUNAKAN WARNA SOLID, BEBAS DARI GRADASI WARNA**.

**Architecture:** Next.js 16 App Router Client Components yang terhubung dengan `useAuth()` dan `useCart()`. Request pengunggahan bukti bayar menggunakan `multipart/form-data` melalui `uploadPaymentProofApi`. Status badge menggunakan skema warna solid semantik.

**Tech Stack:** Next.js 16.4.3, React 19.3.0, TypeScript 5, Tailwind CSS v4, Lucide React.

**Spec:** [docs/API_RESPONSES.md](file:///Users/mmm/Documents/project/FE/fastshop/docs/API_RESPONSES.md) (Section 5: Orders & Payments)

## Global Constraints

- **STRICT: TANPA GRADASI WARNA.** Tidak boleh ada `bg-gradient-*`, `from-*`, `to-*`, `via-*`, atau `bg-clip-text`. Gunakan warna solid, border solid, dan badge warna solid.
- Rute `/checkout`, `/orders`, dan `/orders/[id]` adalah protected routes (mengarahkan tamu ke `/login?redirect=...`).
- Upload bukti bayar hanya menerima file gambar (`image/png`, `image/jpeg`, `image/jpg`).
- Format nominal transaksi menggunakan `formatRupiah()`.

## Review Focus

- **Formulir Alamat Pengiriman:** Validasi input alamat pengiriman wajib diisi sebelum pesanan dapat dibuat.
- **Auto Clear Cart on Checkout:** Setelah pesanan berhasil dibuat melalui `POST /orders/checkout`, keranjang belanja lokal dan state navbar harus otomatis dikosongkan.
- **Upload Bukti Bayar (Multipart):** Pengiriman file bukti bayar harus berjalan mulus dan memperbarui status pesanan menjadi `PROCESSING`.
- **Status Filter Tabs:** Tab penyaring status di `/orders` (Semua, Menunggu Pembayaran, Diproses, Dikirim, Selesai) harus menyaring daftar pesanan secara akurat.
- **Tampilan Bukti Bayar:** Menampilkan tautan atau pratinjau bukti bayar jika pengguna sudah mengunggahnya.

---

### Task 1: Orders API Client Service

**Files:**
- Create: `lib/api/orders.ts`

**Interfaces:**
- Consumes: `lib/api/client.ts`, `types/index.ts`
- Produces: `checkoutOrderApi()`, `uploadPaymentProofApi()`, `getOrdersApi()`, `getOrderByIdApi()`

- [ ] **Step 1: Buat service pesanan `lib/api/orders.ts`**
Implementasikan fungsi untuk:
- `POST /orders/checkout`
- `POST /orders/:orderId/pay` (dengan `FormData`)
- `GET /orders`
- `GET /orders/:id`

- [ ] **Step 2: Verifikasi Linting & Typecheck**
Jalankan: `npm run lint && npx tsc --noEmit`
Pastikan: Bersih tanpa error.

- [ ] **Step 3: Commit**
```bash
git add lib/api/orders.ts
git commit -m "feat(api): add orders api service for checkout, payment proof upload, and order history"
```

---

### Task 2: Status Badge & Modal Upload Bukti Bayar

**Files:**
- Create: `components/orders/order-status-badge.tsx`
- Create: `components/orders/payment-upload-modal.tsx`

**Interfaces:**
- Consumes: `OrderStatus`, `uploadPaymentProofApi()`, format rupiah
- Produces: `<OrderStatusBadge status={...} />` dan `<PaymentUploadModal order={...} isOpen={...} onClose={...} onSuccess={...} />`

- [ ] **Step 1: Buat komponen `components/orders/order-status-badge.tsx`**
Badge warna solid untuk status: PENDING (amber), PROCESSING (blue), SHIPPED (primary teal), COMPLETED (emerald), CANCELLED (red).

- [ ] **Step 2: Buat modal upload `components/orders/payment-upload-modal.tsx`**
Dialog pop-up solid dengan rincian rekening tujuan, file uploader gambar dengan pratinjau, dan tombol submit.

- [ ] **Step 3: Verifikasi Linting & Typecheck**
Jalankan: `npm run lint && npx tsc --noEmit`
Pastikan: Bersih tanpa error.

- [ ] **Step 4: Commit**
```bash
git add components/orders/order-status-badge.tsx components/orders/payment-upload-modal.tsx
git commit -m "feat(ui): implement order status badge and payment upload modal"
```

---

### Task 3: Halaman Checkout (`app/checkout/page.tsx`)

**Files:**
- Create: `app/checkout/page.tsx`

**Interfaces:**
- Consumes: `useCart()`, `useAuth()`, `checkoutOrderApi()`, `Breadcrumbs`
- Produces: Halaman `/checkout` formulir pengiriman dan konfirmasi pesanan.

- [ ] **Step 1: Buat halaman `/checkout` di `app/checkout/page.tsx`**
Implementasikan:
- Autentikasi guard & proteksi keranjang kosong
- Input alamat pengiriman, kontak penerima, dan catatan
- Ringkasan daftar barang pesanan & total harga
- Pilihan rekening bank transfer / QRIS
- Aksi submit pesanan dengan loading state & pengosongan keranjang otomatis
- Pengalihan ke halaman pesanan setelah sukses

- [ ] **Step 2: Verifikasi Linting & Typecheck**
Jalankan: `npm run lint && npx tsc --noEmit`
Pastikan: Bersih tanpa error.

- [ ] **Step 3: Commit**
```bash
git add app/checkout/page.tsx
git commit -m "feat(orders): implement checkout page with shipping form and order placement"
```

---

### Task 4: Halaman Riwayat Pesanan (`app/orders/page.tsx`) & Detail Pesanan (`app/orders/[id]/page.tsx`)

**Files:**
- Create: `app/orders/page.tsx`
- Create: `app/orders/[id]/page.tsx`

**Interfaces:**
- Consumes: `getOrdersApi()`, `getOrderByIdApi()`, `OrderStatusBadge`, `PaymentUploadModal`
- Produces: Halaman `/orders` dan `/orders/[id]`.

- [ ] **Step 1: Buat halaman riwayat `/orders` di `app/orders/page.tsx`**
Daftar pesanan dengan filter status tabs, kartu pesanan lengkap dengan thumbnail produk, tombol upload bukti bayar, dan status badge.

- [ ] **Step 2: Buat halaman rincian `/orders/[id]` di `app/orders/[id]/page.tsx`**
Rincian menyeluruh pesanan spesifik: status pengiriman, alamat, invoice barang, bukti pembayaran yang diunggah, dan instruksi transfer.

- [ ] **Step 3: Pengecekan Gradasi Global**
Jalankan: `grep -rn "gradient" app components lib`
Pastikan: 0 kecocokan.

- [ ] **Step 4: Verifikasi Linting & Typecheck**
Jalankan: `npm run lint && npx tsc --noEmit`
Pastikan: Bersih tanpa error.

- [ ] **Step 5: Commit**
```bash
git add app/orders/page.tsx app/orders/[id]/page.tsx
git commit -m "feat(orders): implement order history and order detail pages with proof view"
```
