# Revamp Promo Carousel Tokopedia Style Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Merombak komponen banner promo carousel di beranda FastShop (`components/home/promo-carousel.tsx`) menjadi banner visual gambar penuh (*full panoramic banner*) ala Tokopedia yang responsif edge-to-edge di perangkat seluler (HP) dengan gesture swipe yang mulus.

**Architecture:** Next.js 16 App Router Client Component (`PromoCarousel`) dengan model data slide server-ready (`BannerSlide[]`), flex-slider track horizontal dengan animasi `transform: translateX`, kontrol sentuh jari (`touchStartX/EndX`), tombol navigasi melayang di desktop, dan indikator pill aktif solid.

**Tech Stack:** Next.js 16.4.3, React 19.3.0, TypeScript 5, Tailwind CSS v4, Lucide React.

**Spec:** [docs/superpowers/specs/2026-11-05-promo-carousel-tokopedia-design.md](file:///Users/mmm/Documents/project/FE/fastshop/docs/superpowers/specs/2026-11-05-promo-carousel-tokopedia-design.md)

## Global Constraints

- **STRICT: ZERO GRADIENTS.** Dilarang keras menggunakan utilitas gradasi warna Tailwind CSS (`bg-gradient-*`, `from-*`, `to-*`, `via-*`, `bg-clip-text`). Seluruh elemen menggunakan warna solid brand (`#287361` Primary, `#c36433` Secondary).
- **USER CONSTRAINT:** **JANGAN COMMIT DULU.** Perubahan tidak boleh di-commit ke Git sebelum user melakukan pengecekan langsung di antarmuka.
- **Mobile First:** Pada layar HP (< 640px), banner harus membentang full-width (tanpa padding horizontal pemotong di tepi layar).
- **Smooth Gestures:** Swipe geser di layar sentuh HP harus mulus dan memiliki threshold 50px untuk berpindah slide.

## Review Focus

- **Touch Swipe Sensitivity:** Memastikan pergeseran jari pada layar sentuh HP tidak memicu klik tautan secara tidak sengaja ketika pengguna sedang melakukan swipe.
- **Aspect Ratio Stability:** Rasio banner di desktop (~21:9 atau ~16:6) dan mobile (~2:1) tidak boleh menghasilkan tata letak melompat (*layout shift* / CLS).
- **Priority Image Loading:** Slide pertama harus memiliki `priority={true}` untuk LCP optimal.
- **Autoplay Resilience:** Timer autoplay harus otomatis berhenti saat kursor mouse berada di atas banner atau saat layar disentuh, dan kembali berputar saat dilepas.
- **Empty / Broken Image Fallback:** Jika URL gambar rusak atau gagal dimuat, container menampilkan fallback visual solid yang rapi.

---

### Task 1: Unduh dan Siapkan Aset Gambar Sample Banner Lokal

**Files:**
- Create: `public/images/banners/banner-fashion-pria.webp`
- Create: `public/images/banners/banner-fashion-wanita.webp`
- Create: `public/images/banners/banner-sepatu-sneakers.webp`
- Create: `public/images/banners/banner-flash-sale.webp`

**Interfaces:**
- Produces: 4 berkas gambar banner e-commerce lokal beresolusi tinggi di `public/images/banners/`.

- [x] **Step 1: Unduh 4 gambar lanskap fashion e-commerce beresolusi tinggi dari domain Unsplash resmi**
- [x] **Step 2: Simpan ke `public/images/banners/` dan pastikan ukuran berkas optimal**
- [x] **Step 3: Verifikasi keberadaan dan aksesibilitas berkas gambar**

---

### Task 2: Implementasikan Komponen `PromoCarousel` Gaya Tokopedia

**Files:**
- Modify: `components/home/promo-carousel.tsx`

**Interfaces:**
- Consumes: Aset gambar dari `public/images/banners/`.
- Produces: Komponen React `PromoCarousel` yang diekspor untuk beranda.

- [x] **Step 1: Tulis definisi tipe `BannerSlide` dan daftar slide default**
```ts
export interface BannerSlide {
  id: string;
  title: string;
  imageUrl: string;
  altText: string;
  targetUrl: string;
  badge?: string;
}
```
- [x] **Step 2: Implementasikan horizontal sliding track dengan `transform: translateX(-${currentIndex * 100}%)`**
- [x] **Step 3: Tambahkan navigasi sentuh (`onTouchStart`, `onTouchMove`, `onTouchEnd`) dengan threshold 50px**
- [x] **Step 4: Tambahkan tombol panah navigasi melayang bulat putih di tepi kiri & kanan (Desktop hover)**
- [x] **Step 5: Tambahkan indikator titik dengan animasi pill aktif (`w-8 bg-primary rounded-full`) khas Tokopedia**
- [x] **Step 6: Verifikasi linting dan typecheck**

---

### Task 3: Sesuaikan Container Banner di `app/page.tsx` untuk Mobile Full-Width

**Files:**
- Modify: `app/page.tsx:88-93`

**Interfaces:**
- Consumes: `<PromoCarousel />`

- [x] **Step 1: Ubah section wrapper di `app/page.tsx` agar mobile bernilai `px-0` (full-bleed) dan desktop `px-4 sm:px-6 lg:px-8 max-w-7xl`**
- [x] **Step 2: Verifikasi responsivitas mobile dan desktop**

---

### Task 4: Verifikasi & Audit QA (Tanpa Commit)

- [x] **Step 1: Jalankan audit bebas gradasi (`! grep -rn "gradient" app components lib`)**
- [x] **Step 2: Jalankan `npm run lint` & `npx tsc --noEmit`**
- [x] **Step 3: Jalankan `npm run build` untuk memverifikasi kompilasi produksi**
- [x] **Step 4: Jalankan dev server lokal dan uji interaksi geser serta tampilan responsif**
- [x] **Step 5: Konfirmasi dan commit seluruh perubahan sesuai permintaan pengguna**
