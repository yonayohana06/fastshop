# Design: Revamp Promo Carousel Tokopedia Style (Full Panoramic Banner)

**Date:** 2026-11-05  
**Topic:** Promo Carousel Revamp  
**Status:** Pending Approval  

---

## 1. Intent & Why
Pengguna menginginkan tampilan banner promo beranda FastShop yang memiliki nuansa dan fungsionalitas seperti **Tokopedia.com**. 
Banner dirancang siap untuk mengonsumsi aset gambar visual utuh dari server (kampanye grafis terpadu), responsif penuh hingga ke tepi layar (*full-width*) pada perangkat seluler (HP), serta mendukung navigasi sentuh geser (*touch swipe gesture*) yang responsif.

---

## 2. Goals, Non-Goals, & Anti-Goals

### Goals
- **Gaya Tokopedia Opsi B (Full Panoramic Banner):** Banner berupa visual gambar penuh resolusi tinggi dengan rasio lebar panoramik (~21:9 atau 16:6 di desktop, 2:1 atau 16:9 di mobile) yang memuat visual promo terpadu.
- **Server-Ready Asset Structure:** Struktur data slide yang siap digantikan oleh respons API backend (tiap item memiliki `id`, `imageUrl`, `title`, `altText`, dan `targetUrl`).
- **Sample Images Lokal:** Menyediakan berkas gambar sample promo e-commerce lokal di `public/images/banners/` untuk kemudahan uji coba dan performa render instan tanpa dependensi jaringan eksternal.
- **Transisi Geser Horizontal (Sliding Track):** Slide berpindah dengan animasi horizontal halus (`transform: translateX(-${currentIndex * 100}%) duration-500 ease-out`).
- **Optimalisasi Tampilan Mobile (HP):**
  - Pada layar HP (< 640px), container membentang penuh ke tepi layar (`w-full`, tepi tanpa padding lateral agar maksimal).
  - Navigasi swipe sentuh jari yang responsif (geser kiri = next, geser kanan = prev).
- **Indikator Tokopedia:** Indikator titik di bagian bawah dengan animasi pemanjangan pill aktif (*expanded pill indicator*) berwarna solid `#287361` (Primary).
- **Tombol Navigasi Desktop:** Tombol panah bulat putih berbayang halus di sisi kiri dan kanan banner yang muncul saat hover.

### Non-Goals
- Tidak membuat modul CMS backend baru di tahap ini (banner menggunakan data array lokal server-ready yang dapat dengan mudah dihubungkan ke endpoint API di masa depan).

### Anti-Goals
- Dilarang keras menggunakan gradasi warna Tailwind (`bg-gradient-*`, `from-*`, dsb.).
- Jangan membuat gambar terdistorsi atau terpotong teks pentingnya saat berpindah dari desktop ke mobile.

---

## 3. Constraints
- **Strict Zero Gradients:** Seluruh elemen UI (indikator, tombol, overlay kontrol) menggunakan 100% warna solid sesuai pedoman `AGENTS.md`.
- **Primary Color:** `#287361` (Deep Forest Teal).
- **Secondary Color:** `#c36433` (Terracotta).
- **Image Loader:** Menggunakan komponen Next.js `<Image />` dengan properti `priority` pada slide pertama untuk LCP optimal.

---

## 4. Approaches Considered
1. **Opsi A (Center-Peek Multi-Slide):** Slide aktif berada di tengah dengan ujung slide kanan-kiri terlihat sebagian. Bagus untuk desktop yang sangat lebar, namun lebih kompleks dan memakan ruang vertikal ekstra di mobile.
2. **Opsi B (Full Panoramic Image Banner — Terpilih):** Banner gambar visual utuh berorientasi lanskap yang membentang penuh di mobile dan terbungkus rapi di desktop. Persis seperti banner promosi Tokopedia. Sangat fleksibel untuk tim pemasaran karena desainer grafis dapat mengunggah satu gambar banner utuh berisi ilustrasi, teks promosi, dan badge diskon.

---

## 5. Technical Specification & Implementation Details

### A. Struktur Data Slide (`components/home/promo-carousel.tsx`)
```ts
export interface BannerSlide {
  id: string;
  title: string;
  imageUrl: string;
  altText: string;
  targetUrl: string;
}
```

### B. Aset Gambar Sample
Download dan simpan 3-4 gambar banner fashion e-commerce beresolusi tinggi di:
- `public/images/banners/banner-fashion-pria.webp`
- `public/images/banners/banner-fashion-wanita.webp`
- `public/images/banners/banner-sepatu-sneakers.webp`
- `public/images/banners/banner-flash-sale.webp`

### C. Penyesuaian `app/page.tsx`
Pada section hero carousel di beranda:
- Layar mobile: `px-0` (banner menyentuh tepi layar secara full-bleed seperti Tokopedia mobile web / app).
- Layar desktop: `sm:px-6 lg:px-8 max-w-7xl` dengan `rounded-2xl` overflow hidden.

### D. Interaksi & Kontrol
- **Autoplay:** Durasi 5 detik antar slide.
- **Pause on Interaction:** Otomatis jeda saat kursor mouse di atas banner (desktop) atau saat layar disentuh (mobile).
- **Gesture:** Minimal swipe threshold 50px untuk memicu perpindahan slide.
