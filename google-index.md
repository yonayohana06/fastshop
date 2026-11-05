### Langkah 1: Deploy & Atur URL Domain Asli

Di lingkungan production (misalnya di Vercel, Cloudflare Pages, atau VPS):

1.  Tambahkan Environment Variable:

- NEXT_PUBLIC_SITE_URL=https://nama-domain-anda.com (Ganti dengan domain asli Anda, bukan localhost).
- NEXT_PUBLIC_API_URL=https://ecommerce-backend-api-nu.vercel.app/api

2.  Lakukan Deploy (merge branch develop ke main).  
    _Catatan:_ Nilai `NEXT_PUBLIC_SITE_URL` ini yang akan otomatis dibaca oleh `sitemap.xml`, URL kanonik, dan skema JSON-LD.  


────────────────────────────────────────────────────────────────────────────────

### Langkah 2: Daftarkan Website ke Google Search Console (GSC)

1.  Buka Google Search Console (https://search.google.com/search-console).
2.  Masuk menggunakan akun Google Anda.
3.  Klik "Add Property" dan pilih salah satu:

- Domain (Rekomendasi jika punya akses DNS, misal: domainanda.com).
- URL Prefix (Mudah, misal: https://domainanda.com).  


────────────────────────────────────────────────────────────────────────────────

### Langkah 3: Verifikasi Kepemilikan Domain

Pilih salah satu metode verifikasi:

- Metode HTML Tag (Paling Cepat):
  1.  Di Search Console, salin kode verifikasi (contoh: google-site-verification=abc123xyz...).
  2.  Masukkan ke Environment Variable hosting Anda:  
       `env                                                                                                                                                              
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=abc123xyz...
      `
  3.  Aplikasi Next.js FastShop sudah otomatis menyisipkan <meta name="google-site-verification" content="..."> ke halaman utama.
  4.  Klik Verify di Google Search Console.
- Metode DNS TXT Record:  
  Tambahkan record TXT yang diberikan Google ke DNS domain (Cloudflare/Niagahoster/Namecheap).  


────────────────────────────────────────────────────────────────────────────────

### Langkah 4: Submit Sitemap ke Google

Setelah terverifikasi:

1.  Di sidebar Google Search Console, klik menu "Sitemaps" (Peta Situs).
2.  Di kolom "Add a new sitemap", masukkan:  
     `text                                                                                                                                                               
sitemap.xml
    `
3.  Klik Submit.
4.  Status akan berubah menjadi "Success". Googlebot akan membaca seluruh URL statis dan halaman dinamis produk berserta tanggal pembaruan terakhirnya.  


### Langkah 5: Pancing Bot dengan "Request Indexing"

Google biasanya membutuhkan beberapa hari untuk mengindeks halaman baru. Untuk mempercepat:

1.  Di kolom pencarian bagian atas Google Search Console (URL Inspection), ketik URL halaman utama Anda: https://domainanda.com.
2.  Klik "Request Indexing".
3.  Ulangi untuk salah satu URL produk unggulan (misal: https://domainanda.com/products/13-sepatu-lari-cowok-mizuno-wave-rider).
4.  Googlebot akan memasukkan halaman tersebut ke antrean perayapan prioritas tinggi dalam waktu 1x24 jam.  


────────────────────────────────────────────────────────────────────────────────

### Langkah 6: Validasi Tampilan Rich Snippet

Uji apakah Google membaca bintang rating, harga, dan stok dengan benar:

1.  Buka Google Rich Results Test (https://search.google.com/test/rich-results).
2.  Masukkan URL produk Anda: https://domainanda.com/products/13.
3.  Hasil uji akan menampilkan kartu centang hijau:

- Product (Nama, Brand, Penawaran Harga IDR, Stok, Rating 4.9⭐).
- Breadcrumbs (Navigasi Beranda > Semua Produk > Kategori > Nama Produk).  


────────────────────────────────────────────────────────────────────────────────

### 💡 Tips Tambahan untuk E-Commerce

- Google Merchant Center: Daftarkan akun gratis di Google Merchant Center (https://merchants.google.com/) agar produk FastShop otomatis muncul di tab Google Shopping  
  organik tanpa perlu pasang iklan berbayar.
- Cek Hasil di Google: Setelah 1–3 hari, ketik di kolom pencarian Google:
  ```text
  site:domainanda.com
  ```
  Jika sudah terindeks, seluruh daftar halaman dan produk FastShop akan muncul di Google.
