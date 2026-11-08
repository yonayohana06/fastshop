# Analisis Project FastShop

> **Tanggal analisis:** 8 November 2026
> **Commit yang dianalisis:** `ed5df16`
> **Lingkup:** Struktur project, arsitektur, halaman, service API, context, komponen inti, kualitas kode, SEO, dan keamanan.
> **Metode:** Pembacaan kode menyeluruh + `npm run lint`, `npx tsc --noEmit`, `npm run build`, dan pemeriksaan zero-gradient.

---

## Daftar Isi

1. [Ringkasan Eksekutif](#1-ringkasan-eksekutif)
2. [Gambaran Umum Project](#2-gambaran-umum-project)
3. [Status Verifikasi](#3-status-verifikasi)
4. [Arsitektur](#4-arsitektur)
5. [Kekuatan Project](#5-kekuatan-project)
6. [Temuan dan Risiko](#6-temuan-dan-risiko)
   - [P0 — Kritis](#-p0--kritis)
   - [P1 — Penting](#-p1--penting)
   - [P2 — Polish](#-p2--polish)
7. [Matriks Risiko](#7-matriks-risiko)
8. [Rekomendasi Prioritas](#8-rekomendasi-prioritas)
9. [Lampiran Perintah Verifikasi](#9-lampiran-perintah-verifikasi)

---

## 1. Ringkasan Eksekutif

FastShop adalah storefront e-commerce fashion berbasis **Next.js 16.4.3 (App Router)**, **React 19.3**, **Tailwind CSS v4**, dan **TypeScript 5**, yang terintegrasi dengan REST API eksternal.

Secara keseluruhan, fondasi project ini **kuat sebagai demo/MVP**:

- Arsitektur berlapis dan konsisten.
- Tipe data ketat tanpa penggunaan `any`.
- Design system disiplin dengan zero gradient.
- Build, lint, dan typecheck bersih.
- SEO detail produk sudah server-rendered dan kaya metadata.

Namun project **belum siap produksi** karena beberapa masalah utama:

1. Sinkronisasi cart dengan server tidak reliable.
2. Ada race condition auth guard saat hard refresh.
3. Data rating/review produk dan alur pembayaran menyesatkan.
4. Rendering JSON-LD belum aman terhadap karakter `<`.
5. Halaman listing masih client-rendered sehingga lemah untuk SEO.
6. Belum ada automated test, error boundary, maupun CI.

---

## 2. Gambaran Umum Project

| Area | Route | Pola Rendering |
|---|---|---|
| Beranda | `/` | Static shell + client fetch |
| Katalog | `/products` | Static shell + client fetch |
| Detail produk | `/products/[id]` | **Server component**, dynamic |
| Kategori | `/categories` | Static shell + client fetch |
| Keranjang | `/cart` | Client component, localStorage |
| Checkout | `/checkout` | Client component, route guard |
| Pesanan | `/orders` | Client component, route guard |
| Detail pesanan | `/orders/[id]` | Client component, dynamic |
| Login | `/login` | Client component |
| Registrasi | `/register` | Client component |
| Profil | `/profile` | Client component, route guard |
| Robots | `/robots.txt` | Metadata route |
| Sitemap | `/sitemap.xml` | Metadata route, revalidate 1 jam |

### Stack

| Kategori | Teknologi |
|---|---|
| Framework | Next.js 16.4.3 (App Router, Turbopack) |
| UI | React 19.3.0 |
| Styling | Tailwind CSS v4 + `@theme inline` |
| Bahasa | TypeScript 5 (strict) |
| Ikon | lucide-react |
| Validasi | validator + dompurify |
| Backend | REST API eksternal (`NEXT_PUBLIC_API_URL`) |

---

## 3. Status Verifikasi

| Pemeriksaan | Perintah | Hasil |
|---|---|---|
| Lint | `npm run lint` | ✅ Bersih, 0 error/warning |
| Typecheck | `npx tsc --noEmit` | ✅ Lolos |
| Production build | `npm run build` | ✅ Berhasil, 14 route |
| Zero gradient | `grep -rn "gradient" app components lib` | ✅ 0 match |
| Penggunaan `any` | Pencarian `: any`, `as any`, `<any>` | ✅ Tidak ditemukan |
| Git working tree | `git status --short` | ✅ Bersih |
| `.env.local` | `git check-ignore` | ✅ Tidak ter-track |

Build menghasilkan 12 route statis dan 2 route dinamis:

- Dinamis: `/products/[id]`, `/orders/[id]`
- Statis: `/`, `/products`, `/categories`, `/cart`, `/checkout`, `/orders`, `/login`, `/register`, `/profile`, `/robots.txt`, `/sitemap.xml`, `/_not-found`

---

## 4. Arsitektur

Alur data sudah mengikuti pola yang diminta di `AGENTS.md`:

```text
UI Layer (app/ & components/)
  → State Layer (context/)
    → Service Layer (lib/api/*.ts)
      → HTTP Client (lib/api/client.ts)
        → Backend REST API
```

### Struktur utama

```text
app/                  # Route App Router
components/           # Komponen presentasional
context/              # Auth, cart, theme, app provider
lib/api/              # Service endpoint per fitur
lib/api/client.ts     # HTTP client + token + query params
lib/constants.ts      # API URL, storage keys, nav links
lib/validation.ts     # Validasi login/register
types/index.ts        # Kontrak data API
```

### Catatan arsitektur

- **Service layer konsisten.** Setiap fitur memiliki modul sendiri (`auth`, `products`, `categories`, `cart`, `orders`).
- **HTTP client terpusat.** Penyematan Bearer token, query params, dan `FormData` sudah ditangani di satu tempat.
- **State global terpusat.** Auth, cart, dan theme memakai React Context.
- **`useSyncExternalStore`** dipakai untuk membaca localStorage secara aman dari hydration mismatch.
- **Server/client split belum optimal.** Hanya detail produk yang server-rendered; halaman listing masih client-rendered.

---

## 5. Kekuatan Project

- **Pemisahan tanggung jawab rapi.** UI, state, service, dan HTTP client terpisah jelas.
- **Tipe data ketat.** Tidak ada `any`; kontrak API didefinisikan di `types/index.ts`.
- **Design system disiplin.** Token warna di `globals.css`, zero gradient, light mode default, status badge solid.
- **UX state lengkap.** Skeleton loading, empty state, error state + retry, toast, modal, dan konfirmasi hapus cart sudah tersedia.
- **SEO detail produk kuat.** Server component, `generateMetadata`, canonical, OpenGraph, JSON-LD Product + BreadcrumbList, sitemap dinamis, dan robots.
- **Penanganan gambar baik.** `next/image` dengan `sizes`, fallback `onError`, dan domain terbatas di `next.config.ts`.
- **Kode relatif kecil dan mudah dipahami.** 87 file ter-track, tanpa dependensi berlebihan.
- **Aksesibilitas dasar sudah ada.** Banyak `aria-label`, `aria-modal`, dan struktur heading yang benar.

---

## 6. Temuan dan Risiko

### 🔴 P0 — Kritis

#### P0-1. Cart Tidak Konsisten dengan Server

**File utama:** `context/cart-context.tsx`

1. **`updateQuantity` tidak memanggil API.**
   Perubahan quantity hanya disimpan ke localStorage (`:149-183`). Saat quantity menjadi 0, item hanya dihapus lokal — `deleteCartItemApi` tidak dipanggil. Setelah reload, quantity lama muncul kembali.

2. **Temp `cart_item_id`.**
   `components/products/product-card.tsx:29` dan `components/products/product-purchase-box.tsx:54,69` membuat ID sementara (`temp_...`). `addItem` mengabaikan response API yang berisi ID asli (`context/cart-context.tsx:140-144`), sehingga `removeItem` mengirim DELETE dengan ID palsu (`:202-205`) dan gagal diam-diam.

3. **Sinkronisasi hanya saat mount.**
   `refreshCart` berjalan sekali saat provider mount (`:86-89`). Login/logout tidak memicu refresh, sehingga cart server tidak dimuat setelah login dalam sesi yang sama.

4. **Cart bocor antar akun.**
   Logout tidak membersihkan cart. Jika pengguna lain login tanpa reload, cart pengguna sebelumnya masih tampil.

5. **Guest cart tidak di-merge saat login.**
   Cart lokal tamu bisa tertimpa cart server, atau tercampur dengan item server.

6. **Semua error sync ditelan.**
   `addItem`, `removeItem`, dan `clearCart` memakai `.catch(() => {})`, sehingga UI terlihat berhasil padahal server gagal.

**Dampak:** item bisa muncul kembali setelah reload, quantity kembali ke nilai lama, dan cart antar akun dapat tercampur.

**Rekomendasi:**

- Jadikan server sebagai sumber kebenaran saat login.
- Simpan `cart_item_id` asli dari response API.
- Panggil `PUT /cart/:id` saat quantity berubah dan `DELETE /cart/:id` saat quantity 0.
- Merge cart tamu saat login.
- Bersihkan cart saat logout.
- Refresh cart saat token berubah.
- Tampilkan error sync ke pengguna atau antrekan perubahan (outbox).

---

#### P0-2. Race Condition Auth Guard Saat Hard Refresh

**File utama:** `context/auth-context.tsx`

- Provider memakai `useSyncExternalStore` dengan server snapshot `":::"` (`:38-40`).
- `isLoading` selalu `false` (`:86`).

Akibatnya, saat hydration halaman protected membaca `isAuthenticated = false` sebelum store selesai membaca localStorage. Effect guard di halaman berikut bisa langsung menjalankan `router.push("/login")` meskipun pengguna sebenarnya sudah login:

- `app/checkout/page.tsx:43-47`
- `app/orders/page.tsx:82-86`
- `app/orders/[id]/page.tsx:87-91`
- `app/profile/page.tsx:26-30` — bahkan tidak mengecek `authLoading` sama sekali

Halaman protected juga sempat menampilkan empty state/spinner yang salah sebelum hydration selesai.

**Dampak:** pengguna yang sudah login bisa terlempar ke halaman login saat hard refresh; pengalaman terasa tidak stabil.

**Rekomendasi:** tambahkan state `isHydrated`/`isReady` yang eksplisit, lalu jalankan guard hanya setelah state tersebut `true`. Tampilkan skeleton selama status auth belum diketahui.

---

#### P0-3. Data Palsu dan Kontrak Pembayaran Tidak Jelas

- Rating `4.9`, `150 review`, dan “Terjual 150+” di `app/products/[id]/page.tsx:190-196,298-306` **hardcoded**, termasuk di JSON-LD `aggregateRating`. Ini berisiko dianggap spam structured data oleh Google.
- `priceValidUntil: "2027-12-31"` juga hardcoded (`:201`).
- Pilihan metode pembayaran di checkout (`bank_transfer`/`qris`, `app/checkout/page.tsx:35-37`) **tidak dikirim ke API** (`:123-125`). Semua pesanan akhirnya diperlakukan sebagai transfer bank, dan halaman detail selalu menampilkan rekening bank.
- Nomor rekening hardcoded di **dua tempat berbeda**:
  - `app/orders/[id]/page.tsx:47-51`
  - `components/orders/payment-upload-modal.tsx:28-44`
- Input kode promo di `components/cart/cart-summary.tsx:17-21` selalu menghasilkan error — fitur belum berfungsi.

**Dampak:** informasi menyesatkan pengguna, risiko SEO, dan potensi ketidaksesuaian data pembayaran.

**Rekomendasi:**

- Hapus data rating/review palsu atau ambil dari API.
- Kirim metode pembayaran ke backend, atau hapus opsi QRIS jika belum didukung.
- Pindahkan rekening ke konfigurasi/env.
- Sembunyikan fitur promo sampai benar-benar berfungsi.

---

#### P0-4. Risiko Keamanan

1. **JSON-LD tidak di-escape.**
   `app/products/[id]/page.tsx:259-266` memakai `dangerouslySetInnerHTML` dengan `JSON.stringify` tanpa mengganti `<`. Dokumentasi Next.js menyarankan `.replace(/</g, "\\u003c")` untuk mencegah XSS jika nama/deskripsi produk mengandung `</script>`.

2. **Token di localStorage.**
   `context/auth-context.tsx:62-63` dan `lib/api/client.ts:34-37` menyimpan/membaca JWT dari localStorage. Ini rentan terhadap XSS. Minimal tambahkan security headers/CSP di `next.config.ts`; pertimbangkan httpOnly cookie + BFF jika memungkinkan.

3. **Potensi open redirect.**
   `app/login/page.tsx:23` memakai parameter `redirect` dari query string langsung ke `router.push` (`:34-37`, `:58`). Parameter harus divalidasi hanya boleh path internal (`startsWith("/")` dan bukan `//`).

4. **Kredensial demo hardcoded.**
   `app/login/page.tsx:71-75` berisi email/password demo. Sebaiknya hanya aktif di development atau lewat env.

5. **Tidak ada security headers.**
   `next.config.ts` belum mengatur CSP, `X-Frame-Options`, `Referrer-Policy`, dan sebagainya.

---

### 🟠 P1 — Penting

#### P1-1. SEO Halaman Listing Masih Client-Rendered

**File:** `app/page.tsx:1`, `app/products/page.tsx:1`, `app/categories/page.tsx:1`

Halaman beranda, katalog, dan kategori mengirim skeleton kosong di HTML awal, lalu mengambil data setelah mount. Untuk e-commerce, ini memperlambat indexing dan membuat konten produk tidak tersedia di HTML awal.

Detail produk sudah benar karena server component. Pertimbangkan memindahkan fetching data listing ke RSC/ISR, lalu filter/pagination tetap client component.

#### P1-2. Judul Metadata Dobel

`app/products/[id]/page.tsx:34` mengembalikan `"... | FastShop"`, sementara root layout (`app/layout.tsx:23-26`) sudah memiliki template `%s | FastShop`. Hasilnya:

```text
Produk | Beli Online di FastShop | FastShop
```

Gunakan `title: { absolute: ... }` atau hapus suffix manual.

#### P1-3. Bug UX Katalog

- **Sorting hanya mengurutkan halaman aktif**, bukan seluruh katalog (`app/products/page.tsx:73-82`).
- **Ganti sort tidak mereset page ke 1** (`:132-136`).
- **State pencarian bisa basi.** `searchInput` diinisialisasi sekali (`:30`), sedangkan input memakai `defaultValue` + `key` (`:188-200`). Jika URL berubah dari navbar, submit berikutnya bisa memakai kata kunci lama.
- **Double fetch kategori.** Produk di-fetch pertama tanpa filter kategori, lalu di-fetch ulang setelah kategori selesai dimuat (`:42-98`).
- **Filter kategori via slug** menunggu daftar kategori selesai dimuat, sehingga sempat menampilkan seluruh produk.

#### P1-4. Checkout Belum Reaktif terhadap Data User

`app/checkout/page.tsx:30-31` menginisialisasi nama dan nomor telepon dari `user` saat hydration. Pada hard refresh, `user` masih `null`, sehingga field tidak terisi otomatis. Gunakan effect/sinkronisasi setelah auth siap.

#### P1-5. Daftar Pesanan Hanya Mengambil Halaman Pertama

`app/orders/page.tsx:67` memanggil `getOrdersApi(undefined, token)` tanpa `page`/`limit`. Jika pesanan melebihi limit default backend, daftar dan hitungan tab tidak lengkap. Belum ada pagination UI.

#### P1-6. `SITE_URL` Default Localhost

`lib/constants.ts:5-6` memakai `http://localhost:3000` sebagai fallback. Jika env produksi lupa di-set, canonical, OpenGraph, dan sitemap akan mengarah ke localhost.

#### P1-7. Sitemap Terbatas

`app/sitemap.ts:33` meminta `limit: 1000`. Jika jumlah produk lebih besar, sebagian produk tidak masuk sitemap. `lastModified` route statis juga selalu `new Date()`.

#### P1-8. Belum Ada Test dan Infrastruktur Kualitas

- Tidak ada test script di `package.json`.
- Tidak ada file test.
- Tidak ada `error.tsx`, `loading.tsx`, atau `not-found.tsx`.
- Tidak ada konfigurasi CI (`.github/workflows`).
- Belum ada global handler untuk token kedaluwarsa/401.

---

### 🟡 P2 — Polish

- **Token warna tidak konsisten.** Ada 9 penggunaan hardcoded `hover:bg-[#1f5c4e]` yang seharusnya `hover:bg-primary-hover`:
  - `app/checkout/page.tsx`
  - `app/orders/page.tsx`
  - `app/orders/[id]/page.tsx`
  - `components/orders/payment-upload-modal.tsx`
- **Palet tidak konsisten.** Checkout/orders memakai `neutral-*`, halaman lain memakai `zinc-*`.
- **Flash tema.** `context/theme-context.tsx:46-52` menambahkan class `.dark` di `useEffect`, sehingga pengguna dark mode melihat kilatan light mode. Next.js menyediakan pola inline script untuk mencegah flash sebelum hydration.
- **Modal upload belum accessible.** Tidak ada focus trap, fokus awal, atau pengembalian fokus. Dropzone file adalah `div onClick` tanpa `role`/`tabIndex`/keyboard handler (`components/orders/payment-upload-modal.tsx:330-350`).
- **Dead code:** `updateCartItemApi`, `truncateText`, `sanitizeInput`, `isValidEmail`, `isStrongPassword`, `getCategoryById`.
- **`console.warn` tersebar di 6 tempat.** Sebaiknya gunakan logger/error reporting terpusat.
- **Dokumentasi drift:**
  - README menyebut “debounced instant search”, tetapi `NavSearch` hanya submit saat Enter.
  - Struktur `(auth)` di README tidak sesuai folder aktual (`app/login`, `app/register`).
- **Kode error yang ditampilkan mentah.** Pesan error dari backend langsung ditampilkan; pastikan tidak membocorkan detail internal.
- **`navigator.clipboard.writeText` tanpa fallback** untuk konteks non-secure.
- **`formatRupiah` mengandalkan `parseFloat`.** Format ribuan dengan titik (mis. `"125.000"`) akan terbaca `125`.

---

## 7. Matriks Risiko

| ID | Risiko | Dampak | Kemungkinan | Prioritas |
|---|---|---|---|---|
| P0-1 | Cart tidak sinkron dengan server | Tinggi | Tinggi | **P0** |
| P0-2 | Race condition auth guard | Tinggi | Sedang | **P0** |
| P0-3 | Data produk/pembayaran menyesatkan | Tinggi | Sedang | **P0** |
| P0-4 | JSON-LD injection & open redirect | Tinggi | Rendah–Sedang | **P0** |
| P1-1 | Listing tidak server-rendered | Sedang | Tinggi | **P1** |
| P1-2 | Metadata dobel | Rendah | Tinggi | **P1** |
| P1-3 | Sorting/search katalog tidak akurat | Sedang | Tinggi | **P1** |
| P1-4 | Prefill checkout gagal | Rendah | Tinggi | **P1** |
| P1-5 | Pesanan tidak lengkap | Sedang | Sedang | **P1** |
| P1-6 | `SITE_URL` salah di produksi | Sedang | Sedang | **P1** |
| P1-8 | Tidak ada test/error boundary/CI | Sedang | Tinggi | **P1** |

---

## 8. Rekomendasi Prioritas

### Tahap 1 — Stabilitas Inti

1. Perbaiki sinkronisasi cart dan auth state.
2. Tambahkan test untuk alur:
   - guest menambah produk,
   - login,
   - update/remove quantity,
   - checkout,
   - logout.
3. Pastikan route guard hanya berjalan setelah auth hydration selesai.

### Tahap 2 — Keamanan dan Kontrak Pembayaran

1. Escape JSON-LD dan validasi parameter `redirect`.
2. Kirim metode pembayaran ke backend atau hapus opsi yang belum didukung.
3. Pindahkan rekening bank ke konfigurasi.
4. Tambahkan security headers/CSP.

### Tahap 3 — SEO

1. Server-render halaman listing atau gunakan ISR.
2. Perbaiki title metadata yang dobel.
3. Pastikan `SITE_URL` produksi benar.
4. Hapus structured data palsu.
5. Perluas cakupan sitemap.

### Tahap 4 — Infrastruktur Kualitas

1. Tambahkan test runner dan test kritis.
2. Tambahkan `error.tsx`, `loading.tsx`, dan `not-found.tsx`.
3. Tambahkan CI: lint, typecheck, build.
4. Tambahkan error reporting terpusat.

### Tahap 5 — Polish UI/UX

1. Konsistenkan token warna (`primary-hover`, `zinc`).
2. Hilangkan flash tema.
3. Perbaiki aksesibilitas modal dan dropzone.
4. Bersihkan dead code dan dokumentasi.

---

## 9. Lampiran Perintah Verifikasi

```bash
# 1. Pastikan bebas dari gradasi warna
grep -rn "gradient" app components lib

# 2. Linting
npm run lint

# 3. Typecheck
npx tsc --noEmit

# 4. Production build
npm run build

# 5. Cek file environment tidak ter-track
git check-ignore -v .env.local
```

---

## Kesimpulan

FastShop memiliki fondasi arsitektur dan desain yang baik untuk sebuah storefront modern. Kualitas kode dasar juga terjaga: lint, typecheck, build, dan aturan zero-gradient semuanya lolos.

Namun, sebelum dinyatakan production-ready, prioritas utama harus diberikan pada **konsistensi cart**, **kesiapan auth saat hydration**, **kejujuran data produk/pembayaran**, dan **keamanan rendering**. Setelah itu, peningkatan SEO listing dan infrastruktur test akan membuat project jauh lebih matang tanpa perlu menulis ulang arsitekturnya.
