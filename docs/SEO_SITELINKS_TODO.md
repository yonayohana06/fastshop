# 📋 TODO: Implementasi Google Sitelinks untuk FastShop

**Tujuan:** Membuat website FastShop muncul di hasil pencarian Google dengan sitelinks seperti Tokopedia (Login, Tentang, Seller, dll).

**Referensi:** `docs/screenshot/tokopedia.png`

---

## ✅ Checklist Implementasi

### 1. 🏗️ Structured Data (Schema.org JSON-LD)

- [ ] Buat file `app/organization-schema.tsx` dengan:
  - [ ] `OrganizationSchema` component (nama, logo, deskripsi, social links)
  - [ ] `WebSiteSchema` component (search action, URL template)
  - [ ] `BreadcrumbSchema` component (untuk breadcrumb navigation)
- [ ] Integrasikan schema ke `app/layout.tsx` di `<head>`
- [ ] Validasi structured data di [Google Rich Results Test](https://search.google.com/test/rich-results)
- [ ] Validasi structured data di [Schema.org Validator](https://validator.schema.org/)

### 2. 📄 Halaman Penting (untuk Sitelinks Candidates)

#### Halaman yang Sudah Ada:
- [x] `/login` — Halaman login pengguna
- [x] `/register` — Halaman registrasi pengguna
- [x] `/profile` — Halaman profil pengguna
- [x] `/products` — Halaman katalog produk
- [x] `/categories` — Halaman kategori produk
- [x] `/cart` — Halaman keranjang belanja
- [x] `/checkout` — Halaman checkout
- [x] `/orders` — Halaman riwayat pesanan

#### Halaman yang Perlu Dibuat:
- [ ] `/about` — Tentang FastShop
  - Visi & misi perusahaan
  - Sejarah singkat
  - Tim/founder info (opsional)
  - Kontak informasi
- [ ] `/contact` — Kontak Kami
  - Form kontak (nama, email, subjek, pesan)
  - Alamat kantor/toko fisik (jika ada)
  - Email customer service
  - Nomor telepon/WhatsApp
- [ ] `/faq` — Frequently Asked Questions
  - Pertanyaan umum tentang pemesanan
  - Pertanyaan tentang pembayaran
  - Pertanyaan tentang pengiriman
  - Pertanyaan tentang pengembalian/refund
- [ ] `/terms` — Syarat & Ketentuan
  - Terms of service
  - Privacy policy
  - Return/refund policy
- [ ] `/seller` — FastShop Seller (Jika rencana ada marketplace)
  - Informasi cara jadi seller
  - Keuntungan jadi seller
  - Form pendaftaran seller
  - Link ke seller dashboard

### 3. 🔗 Internal Linking Structure

- [ ] Update `components/layout/footer.tsx` dengan navigasi terstruktur:
  - **Kolom 1 - Perusahaan:**
    - Tentang Kami (`/about`)
    - Kontak (`/contact`)
    - FAQ (`/faq`)
  - **Kolom 2 - Pelanggan:**
    - Login (`/login`)
    - Daftar (`/register`)
    - Pesanan Saya (`/orders`)
    - Profile (`/profile`)
  - **Kolom 3 - Produk:**
    - Semua Produk (`/products`)
    - Kategori (`/categories`)
  - **Kolom 4 - Legal:**
    - Syarat & Ketentuan (`/terms`)
    - Kebijakan Privasi (`/privacy`)
- [ ] Tambahkan breadcrumb navigation di semua halaman dalam (sudah ada di detail produk, extend ke halaman lain)
- [ ] Pastikan sitemap.xml mencakup semua halaman penting

### 4. 🎯 Meta Tags & Open Graph Optimization

- [ ] Setiap halaman baru harus memiliki metadata unik:
  - `title` (unique per page)
  - `description` (155-160 karakter)
  - `keywords` (relevan per halaman)
  - Open Graph tags (`og:title`, `og:description`, `og:image`, `og:url`)
  - Twitter Card tags
- [ ] Generate social share image untuk setiap halaman kunci

### 5. 📊 Google Search Console Setup

- [ ] Daftarkan domain custom di Google Search Console (jika sudah ada)
- [ ] Submit sitemap: `https://your-domain.com/sitemap.xml`
- [ ] Monitor index coverage dan fixing errors
- [ ] Gunakan URL Inspection Tool untuk test indexing halaman penting
- [ ] Pantau sitelinks di Search Console > Performance > Search Appearance

### 6. 🚀 Technical SEO Improvements

- [ ] Pastikan semua halaman load time < 3 detik (Core Web Vitals)
- [ ] Optimasi gambar dengan format modern (WebP, AVIF)
- [ ] Implementasi lazy loading untuk gambar di bawah fold
- [ ] Pastikan mobile-friendly (responsive design)
- [ ] HTTPS enabled (sudah otomatis di Vercel)
- [ ] Canonical URLs untuk mencegah duplicate content
- [ ] Robots.txt sudah optimal (sudah ada di `app/robots.ts`)

### 7. 📈 Content & User Engagement

- [ ] Buat konten berkualitas di halaman About, FAQ, Contact
- [ ] Tambahkan blog/artikel (opsional tapi sangat membantu SEO)
- [ ] Implementasi review/rating produk (user-generated content)
- [ ] Social proof: testimoni pelanggan di homepage
- [ ] Call-to-action jelas di setiap halaman

---

## 🎯 Priority Order (Rekomendasi)

### Phase 1: Foundation (Week 1)
1. Buat halaman `/about`, `/contact`, `/faq`
2. Update footer navigation dengan link terstruktur
3. Implementasi structured data (Organization & WebSite schema)

### Phase 2: Technical SEO (Week 2)
4. Validasi structured data di Google Rich Results Test
5. Submit sitemap ke Google Search Console
6. Optimasi meta tags semua halaman

### Phase 3: Content & Engagement (Week 3-4)
7. Tambahkan konten berkualitas ke halaman baru
8. Implementasi breadcrumb di semua halaman
9. Monitor performance di Google Search Console

### Phase 4: Advanced (Ongoing)
10. A/B testing page titles & descriptions
11. Build backlinks (social media, partnerships)
12. Monitor & iterate berdasarkan Search Console data

---

## ⏱️ Timeline Estimasi Sitelinks Muncul

- **Minimum:** 3-6 bulan setelah semua implementasi + traffic konsisten
- **Faktor Penting:**
  - Domain authority (umur domain, backlinks)
  - Traffic volume (unique visitors per month)
  - User engagement (low bounce rate, high dwell time)
  - Brand searches (orang searching "FastShop")

---

## 📚 Resources

- [Google Search Central - Sitelinks](https://developers.google.com/search/docs/appearance/sitelinks)
- [Schema.org - Organization](https://schema.org/Organization)
- [Schema.org - WebSite](https://schema.org/WebSite)
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Google Search Console](https://search.google.com/search-console)

---

**Status:** 🟡 Pending Implementation  
**Last Updated:** 2026-11-06  
**Owner:** FastShop Team
