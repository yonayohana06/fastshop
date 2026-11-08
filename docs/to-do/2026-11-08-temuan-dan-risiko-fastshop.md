# To-Do Temuan & Risiko FastShop

> **Sumber analisis:** [`docs/analisis/2026-11-08-analisis-project-fastshop.md`](../analisis/2026-11-08-analisis-project-fastshop.md)
> **Tanggal dibuat:** 8 November 2026
> **Commit acuan:** `ed5df16`
> **Status:** Sedang dikerjakan — P0-01 selesai, task lain belum dimulai.

Dokumen ini menerjemahkan temuan dan risiko dari analisis project menjadi daftar pekerjaan yang bisa dieksekusi dan diverifikasi.

## Legenda

| Prioritas | Arti |
|---|---|
| **P0** | Blocker produksi: integritas data, keamanan, atau alur inti rusak. |
| **P1** | Penting: harus selesai sebelum launch stabil. |
| **P2** | Polish: kualitas, konsistensi, dan maintainability. |

| Estimasi | Perkiraan |
|---|---|
| **S** | ≤ 2 jam |
| **M** | 0,5–1 hari |
| **L** | 1–3 hari |

## Ringkasan

| Prioritas | Jumlah Task | Estimasi Kasar |
|---|---:|---|
| P0 | 8 | 4–6 hari |
| P1 | 10 | 5–8 hari |
| P2 | 6 | 2–3 hari |
| **Total** | **24** | **11–17 hari** |

---

## Checklist Cepat

### P0 — Blocker

- [x] **P0-01** Sinkronisasi cart dengan server
- [ ] **P0-02** Perbaiki hydration auth dan route guard
- [ ] **P0-03** Tegaskan kontrak metode pembayaran dan rekening
- [ ] **P0-04** Hapus data rating/review/“terjual” palsu
- [ ] **P0-05** Escape JSON-LD sebelum dirender
- [ ] **P0-06** Validasi parameter `redirect` saat login
- [ ] **P0-07** Tambahkan security headers dan strategi token
- [ ] **P0-08** Sembunyikan kredensial demo di produksi

### P1 — Penting

- [ ] **P1-01** Server-render halaman listing untuk SEO
- [ ] **P1-02** Perbaiki suffix judul metadata yang dobel
- [ ] **P1-03** Perbaiki sorting katalog dan state pencarian
- [ ] **P1-04** Buat prefill checkout reaktif terhadap user
- [ ] **P1-05** Tambahkan pagination/limit daftar pesanan
- [ ] **P1-06** Perkuat `SITE_URL` dan sitemap
- [ ] **P1-07** Siapkan test runner, error boundary, dan CI
- [ ] **P1-08** Putuskan dan benahi fitur kode promo
- [ ] **P1-09** Tangani token kedaluwarsa/401 secara global
- [ ] **P1-10** Perkuat validasi form checkout

### P2 — Polish

- [ ] **P2-01** Konsistenkan token warna dan palet netral
- [ ] **P2-02** Hilangkan flash tema sebelum hydration
- [ ] **P2-03** Perbaiki aksesibilitas modal upload
- [ ] **P2-04** Bersihkan dead code dan export tak terpakai
- [ ] **P2-05** Sinkronkan dokumentasi dengan implementasi
- [ ] **P2-06** Rapikan logging, format Rupiah, dan clipboard

---

## Traceability: Analisis → To-Do

| Temuan Analisis | Task |
|---|---|
| P0-1 Cart tidak konsisten | P0-01 |
| P0-2 Race condition auth guard | P0-02 |
| P0-3 Data palsu & pembayaran | P0-03, P0-04, P1-08 |
| P0-4 Risiko keamanan | P0-05, P0-06, P0-07, P0-08 |
| P1-1 SEO listing client-rendered | P1-01 |
| P1-2 Metadata dobel | P1-02 |
| P1-3 Bug UX katalog | P1-03 |
| P1-4 Prefill checkout | P1-04 |
| P1-5 Pesanan hanya halaman pertama | P1-05 |
| P1-6 `SITE_URL` default localhost | P1-06 |
| P1-7 Sitemap terbatas | P1-06 |
| P1-8 Tidak ada test/CI/error boundary | P1-07 |
| P2 Konsistensi desain | P2-01 |
| P2 Flash tema | P2-02 |
| P2 Aksesibilitas modal | P2-03 |
| P2 Dead code | P2-04 |
| P2 Dokumentasi drift | P2-05 |
| P2 Logging/format/clipboard | P2-06 |

---

## Detail Task

### P0-01 — Sinkronisasi Cart dengan Server

| | |
|---|---|
| **Prioritas** | P0 |
| **Estimasi** | L (1–2 hari) |
| **Dependensi** | P1-07 untuk automated test; perbaikan bisa dimulai tanpa test runner |
| **Status** | ✅ Selesai — 8 November 2026 |

**File terkait:**
- `context/cart-context.tsx`
- `components/cart/cart-sync-toast.tsx` *(baru)*
- `context/app-provider.tsx`
- `components/products/product-card.tsx`
- `components/products/product-purchase-box.tsx`
- `lib/api/cart.ts`
- `lib/constants.ts`
- `types/index.ts`
- `tests/cart-context.test.tsx` *(baru)*
- `tests/setup.ts` *(baru)*
- `vitest.config.mts` *(baru)*

**Masalah:**
`updateQuantity` tidak memanggil API, item yang ditambahkan menyimpan `cart_item_id` sementara, response `POST /cart` diabaikan, refresh hanya terjadi saat mount, dan cart tidak dibersihkan/di-merge saat login/logout. Error sinkronisasi juga ditelan.

**Langkah:**
- [x] Tentukan model sinkronisasi: server sebagai sumber kebenaran saat login, localStorage hanya untuk guest.
- [x] Saat `addItem` dan user login, tunggu response `POST /cart`, lalu simpan `cart_item_id` asli dari response (atau panggil `refreshCart` setelahnya).
- [x] Saat `updateQuantity`, panggil `PUT /cart/:cart_item_id`; jika quantity `<= 0`, panggil `DELETE /cart/:cart_item_id`.
- [x] Saat `removeItem`, pastikan yang dikirim adalah `cart_item_id` asli, bukan `temp_*`.
- [x] Tambahkan sinkronisasi cart saat token auth berubah (login) dan bersihkan cart saat logout.
- [x] Implementasikan merge cart guest → server saat login (atau konfirmasi produk mana yang dipertahankan).
- [x] Ganti `.catch(() => {})` dengan penanganan error yang terlihat oleh pengguna (toast/banner) atau antrean retry.
- [x] Pastikan `refreshCart` tidak menimpa perubahan lokal yang belum tersinkron.

**Test wajib:**
- [x] Guest menambah produk → cart lokal bertambah.
- [x] Login dengan cart guest → cart server dan guest digabung sesuai aturan.
- [x] User login menambah produk → item lokal memiliki `cart_item_id` asli.
- [x] Update quantity → `PUT /cart/:id` dipanggil dan hasil reload tetap.
- [x] Quantity menjadi 0 → `DELETE /cart/:id` dipanggil.
- [x] Hapus item setelah tambah dalam sesi yang sama → server item benar-benar hilang.
- [x] Logout → cart lokal kosong.
- [x] API gagal saat add/update/remove → pengguna melihat pesan error.

**Catatan implementasi:**
- Semua mutasi server dijalankan lewat antrean (`queueRef`) agar `POST`/`PUT`/`DELETE` berurutan dan tidak saling menimpa.
- `cart_item_id` asli disimpan dari response `POST /cart` dan dipetakan per `product_id`, sehingga `removeItem` yang dipanggil saat `POST` masih berjalan tetap mengirim ID server yang benar.
- Penanda pemilik cart (`STORAGE_KEYS.CART_OWNER`: `guest` atau `user:<id>`) mencegah cart bocor antar akun.
- Saat login, item guest dengan ID sementara di-merge ke server; item yang sudah punya ID server dilewati agar retry tidak menggandakan quantity.
- `refreshCart` memakai revision counter: respons `GET /cart` yang datang setelah perubahan lokal tidak menimpa perubahan tersebut.
- Error sinkronisasi ditampilkan lewat `CartSyncToast` global (`role="alert"`) dan dapat ditutup pengguna.
- Test runner Vitest + React Testing Library ditambahkan sebagai fondasi awal P1-07; error boundary dan CI tetap menjadi bagian P1-07.

**Hasil verifikasi:**
- `npm test` → **12 test lulus**.
- `npm run lint` → bersih.
- `npx tsc --noEmit` → lolos.
- `npm run build` → berhasil (14 route).
- `grep -rn "gradient" app components lib` → 0 match.

**Kriteria selesai:**
- Tidak ada `cart_item_id` berawalan `temp_` yang dikirim ke endpoint server.
- Quantity dan item tidak berubah kembali setelah reload.
- Cart tidak bocor antar akun.
- Tidak ada error sync yang hilang tanpa jejak.

**Verifikasi:**
```bash
npm test
npm run lint
npx tsc --noEmit
npm run build
```

**Commit:** `fix(cart): sinkronkan perubahan keranjang dengan server`

---

### P0-02 — Perbaiki Hydration Auth dan Route Guard

| | |
|---|---|
| **Prioritas** | P0 |
| **Estimasi** | M (0,5–1 hari) |
| **Dependensi** | - |

**File terkait:**
- `context/auth-context.tsx`
- `app/checkout/page.tsx`
- `app/orders/page.tsx`
- `app/orders/[id]/page.tsx`
- `app/profile/page.tsx`

**Masalah:**
`isLoading` selalu `false` dan server snapshot auth adalah `":::"`. Guard berjalan sebelum localStorage selesai dibaca, sehingga user yang sudah login dapat diarahkan ke `/login` saat hard refresh. Halaman protected juga sempat menampilkan state yang salah.

**Langkah:**
- [ ] Tambahkan state `isHydrated`/`isReady` yang menjadi `true` setelah snapshot localStorage tersedia.
- [ ] Ubah guard di semua halaman protected agar hanya berjalan setelah `isHydrated === true`.
- [ ] Tambahkan pengecekan loading yang hilang di `/profile`.
- [ ] Tampilkan skeleton/spinner yang konsisten selama status auth belum diketahui.
- [ ] Pastikan redirect menyertakan `redirect` ke route asal dan tidak berjalan dua kali.

**Test wajib:**
- [ ] Hard refresh `/checkout` dengan token valid → tidak diarahkan ke login.
- [ ] Hard refresh `/orders` dengan token valid → daftar pesanan dimuat.
- [ ] Hard refresh `/profile` dengan token valid → profil tampil.
- [ ] Akses protected route tanpa token setelah hydration → diarahkan ke login.
- [ ] Tidak ada flash konten protected sebelum redirect.

**Kriteria selesai:**
- Tidak ada redirect palsu pada hard refresh.
- Semua halaman protected memakai pola guard yang sama.
- `isLoading`/`isHydrated` memiliki makna yang jelas.

**Verifikasi:**
```bash
npm run lint
npx tsc --noEmit
npm run build
```

**Commit:** `fix(auth): tunggu hydration sebelum menjalankan route guard`

---

### P0-03 — Tegaskan Kontrak Metode Pembayaran dan Rekening

| | |
|---|---|
| **Prioritas** | P0 |
| **Estimasi** | M (0,5–1 hari) |
| **Dependensi** | Konfirmasi kontrak backend |

**File terkait:**
- `app/checkout/page.tsx`
- `app/orders/[id]/page.tsx`
- `components/orders/payment-upload-modal.tsx`
- `lib/api/orders.ts`
- `types/index.ts`

**Masalah:**
Pilihan `bank_transfer`/`qris` hanya state UI dan tidak dikirim ke API. Semua pesanan diperlakukan sebagai transfer bank. Nomor rekening hardcoded di dua file.

**Langkah:**
- [ ] Konfirmasi apakah backend menerima field `payment_method`.
- [ ] Jika didukung: tambahkan field ke `CheckoutPayload`, kirim dari form, dan tampilkan metode pada detail pesanan.
- [ ] Jika belum didukung: hapus opsi QRIS dari UI dan sesuaikan copy agar tidak menyesatkan.
- [ ] Pindahkan daftar rekening ke satu sumber konfigurasi (`lib/constants.ts` atau env).
- [ ] Gunakan sumber yang sama di halaman detail pesanan dan modal upload.
- [ ] Pastikan instruksi pembayaran sesuai dengan metode yang benar-benar dipilih.

**Test wajib:**
- [ ] Checkout dengan metode bank → payload berisi metode yang benar.
- [ ] Checkout dengan QRIS (jika didukung) → detail pesanan menampilkan instruksi QRIS.
- [ ] Daftar rekening di modal dan detail pesanan identik.
- [ ] Tidak ada opsi QRIS jika backend belum mendukung.

**Kriteria selesai:**
- Metode pembayaran yang dipilih pengguna tersimpan atau tidak ditampilkan sebagai pilihan.
- Rekening hanya didefinisikan di satu tempat.
- Tidak ada instruksi pembayaran yang bertentangan.

**Verifikasi:**
```bash
npm run lint
npx tsc --noEmit
npm run build
```

**Commit:** `fix(checkout): selaraskan metode pembayaran dengan kontrak API`

---

### P0-04 — Hapus Data Rating/Review/“Terjual” Palsu

| | |
|---|---|
| **Prioritas** | P0 |
| **Estimasi** | S (≤ 2 jam) |
| **Dependensi** | - |

**File terkait:**
- `app/products/[id]/page.tsx`

**Masalah:**
Rating `4.9`, `150 review`, “Terjual 150+”, dan `priceValidUntil: "2027-12-31"` hardcoded, termasuk di JSON-LD. Ini menyesatkan pengguna dan berisiko dianggap spam structured data.

**Langkah:**
- [ ] Hapus `aggregateRating` dari JSON-LD sampai data asli tersedia.
- [ ] Hapus atau ganti teks “Terjual 150+” dan rating hardcoded dengan data dari API.
- [ ] Hapus `priceValidUntil` statis atau hitung dari data yang valid.
- [ ] Pastikan `reviewCount`/`ratingValue` hanya dirender jika berasal dari backend.

**Test wajib:**
- [ ] Halaman produk tanpa data rating tidak menampilkan rating palsu.
- [ ] JSON-LD tidak mengandung `aggregateRating` jika data tidak tersedia.
- [ ] Validasi Rich Results tidak melaporkan data fiktif.

**Kriteria selesai:**
- Tidak ada angka sosial/proof yang hardcoded.
- Structured data hanya berisi data yang benar-benar tersedia.

**Verifikasi:**
```bash
npm run lint
npx tsc --noEmit
npm run build
```

**Commit:** `fix(seo): hapus data rating dan review palsu`

---

### P0-05 — Escape JSON-LD Sebelum Dirender

| | |
|---|---|
| **Prioritas** | P0 |
| **Estimasi** | S (≤ 2 jam) |
| **Dependensi** | - |

**File terkait:**
- `app/products/[id]/page.tsx`

**Masalah:**
`JSON.stringify` dimasukkan ke `dangerouslySetInnerHTML` tanpa escaping `<`. Nama/deskripsi produk yang mengandung `</script>` dapat keluar dari tag script.

**Langkah:**
- [ ] Ganti `<` menjadi `\u003c` pada hasil `JSON.stringify` sebelum dimasukkan ke DOM.
- [ ] Terapkan pada JSON-LD Product dan BreadcrumbList.
- [ ] Tambahkan komentar singkat yang menjelaskan alasan escaping.

**Test wajib:**
- [ ] Produk dengan nama `</script><script>alert(1)</script>` tidak mengeksekusi script.
- [ ] Nama produk normal tetap tampil dan JSON-LD valid.
- [ ] Breadcrumb JSON-LD juga menggunakan escaping yang sama.

**Kriteria selesai:**
- Tidak ada `dangerouslySetInnerHTML` JSON-LD tanpa escaping.
- Output JSON-LD tetap valid menurut Schema Markup Validator.

**Verifikasi:**
```bash
npm run lint
npx tsc --noEmit
npm run build
```

**Commit:** `fix(seo): escape karakter berbahaya pada JSON-LD`

---

### P0-06 — Validasi Parameter `redirect` Saat Login

| | |
|---|---|
| **Prioritas** | P0 |
| **Estimasi** | S (≤ 2 jam) |
| **Dependensi** | - |

**File terkait:**
- `app/login/page.tsx`
- `app/register/page.tsx` (jika nanti memakai redirect)

**Masalah:**
`redirect` dari query string langsung diteruskan ke `router.push`, sehingga berpotensi menjadi open redirect.

**Langkah:**
- [ ] Buat helper `getSafeRedirect(value: string | null, fallback = "/")`.
- [ ] Hanya izinkan path internal yang diawali `/` dan bukan `//`.
- [ ] Tolak URL absolut, protocol-relative, dan skema seperti `javascript:`.
- [ ] Gunakan helper tersebut di semua redirect setelah login.
- [ ] Pertahankan query/hash internal jika diperlukan.

**Test wajib:**
- [ ] `redirect=/orders` → diizinkan.
- [ ] `redirect=https://evil.com` → fallback ke `/`.
- [ ] `redirect=//evil.com` → fallback ke `/`.
- [ ] `redirect=javascript:alert(1)` → fallback ke `/`.
- [ ] `redirect` kosong → fallback ke `/`.

**Kriteria selesai:**
- Tidak ada nilai `redirect` eksternal yang dieksekusi.
- Redirect internal tetap berfungsi.

**Verifikasi:**
```bash
npm run lint
npx tsc --noEmit
npm run build
```

**Commit:** `fix(auth): validasi redirect hanya ke path internal`

---

### P0-07 — Tambahkan Security Headers dan Strategi Token

| | |
|---|---|
| **Prioritas** | P0 |
| **Estimasi** | M (0,5–1 hari) |
| **Dependensi** | - |

**File terkait:**
- `next.config.ts`
- `lib/api/client.ts`
- `context/auth-context.tsx`

**Masalah:**
Token JWT disimpan di localStorage dan belum ada security headers/CSP. Risiko meningkat jika ada XSS.

**Langkah:**
- [ ] Tambahkan header dasar: `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`, `Permissions-Policy`.
- [ ] Rancang CSP yang kompatibel dengan Next.js (script nonce/hash bila memungkinkan).
- [ ] Dokumentasikan trade-off localStorage vs httpOnly cookie + BFF.
- [ ] Jika tetap memakai localStorage, pastikan tidak ada render HTML mentah dari input pengguna dan token memiliki masa berlaku pendek.
- [ ] Uji aplikasi di mode produksi setelah header aktif.

**Test wajib:**
- [ ] Response header memuat header keamanan yang ditentukan.
- [ ] Aplikasi tetap berjalan (tidak ada aset/CSS/JS yang diblokir CSP).
- [ ] Halaman login, produk, cart, dan checkout dapat digunakan.

**Kriteria selesai:**
- Header keamanan aktif di production build.
- Tidak ada pelanggaran CSP pada alur utama.
- Keputusan strategi token terdokumentasi.

**Verifikasi:**
```bash
npm run build
npm start
curl -I http://localhost:3000
```

**Commit:** `fix(security): tambahkan security headers dan dokumentasi token`

---

### P0-08 — Sembunyikan Kredensial Demo di Produksi

| | |
|---|---|
| **Prioritas** | P0 |
| **Estimasi** | S (≤ 2 jam) |
| **Dependensi** | - |

**File terkait:**
- `app/login/page.tsx`
- `.env.example`

**Masalah:**
Email/password akun demo hardcoded dan tombol “Gunakan Akun Demo” selalu tampil.

**Langkah:**
- [ ] Pindahkan kredensial demo ke env khusus development.
- [ ] Tampilkan tombol demo hanya jika env demo aktif.
- [ ] Pastikan build produksi tidak memuat kredensial tersebut.
- [ ] Perbarui dokumentasi cara mengaktifkan akun demo.

**Test wajib:**
- [ ] Build production tanpa env demo → tombol dan kredensial tidak muncul.
- [ ] Build development dengan env demo → tombol mengisi kredensial dengan benar.

**Kriteria selesai:**
- Tidak ada kredensial hardcoded di bundle produksi.
- Fitur demo tetap tersedia untuk pengujian lokal.

**Verifikasi:**
```bash
npm run build
```

**Commit:** `chore(auth): batasi akun demo ke environment development`

---

### P1-01 — Server-Render Halaman Listing untuk SEO

| | |
|---|---|
| **Prioritas** | P1 |
| **Estimasi** | L (1–3 hari) |
| **Dependensi** | P1-02, P1-03 |

**File terkait:**
- `app/page.tsx`
- `app/products/page.tsx`
- `app/products/layout.tsx`
- `app/categories/page.tsx`
- `app/categories/layout.tsx`
- Komponen filter/pagination terkait

**Masalah:**
Beranda, katalog, dan kategori mengirim skeleton kosong di HTML awal. Konten produk tidak tersedia untuk crawler sampai JavaScript berjalan.

**Langkah:**
- [ ] Pecah halaman menjadi server component (fetch data) + client component (interaksi filter/search/sort).
- [ ] Fetch data awal di server dengan cache/ISR yang sesuai.
- [ ] Pastikan filter via URL tetap berfungsi dan tetap server-rendered.
- [ ] Tambahkan metadata/canonical untuk halaman listing.
- [ ] Ukur hasil dengan View Source/curl: produk harus muncul di HTML awal.
- [ ] Pertahankan skeleton hanya untuk transisi client-side.

**Test wajib:**
- [ ] `curl /` menampilkan produk unggulan di HTML.
- [ ] `curl /products` menampilkan produk di HTML awal.
- [ ] `curl /categories` menampilkan kategori di HTML awal.
- [ ] Filter/search/sort tetap berfungsi.
- [ ] Pagination tetap berfungsi.

**Kriteria selesai:**
- Konten utama listing tersedia tanpa JavaScript.
- Tidak ada regresi pada filter dan pagination.
- Metadata listing tetap benar.

**Verifikasi:**
```bash
npm run build
npm start
curl -s http://localhost:3000/products | grep -i "nama-produk"
```

**Commit:** `feat(seo): render katalog dan kategori di server`

---

### P1-02 — Perbaiki Suffix Judul Metadata yang Dobel

| | |
|---|---|
| **Prioritas** | P1 |
| **Estimasi** | S (≤ 2 jam) |
| **Dependensi** | - |

**File terkait:**
- `app/products/[id]/page.tsx`
- `app/layout.tsx`

**Masalah:**
Halaman detail mengembalikan judul yang sudah berisi `| FastShop`, lalu template root menambahkan suffix lagi.

**Langkah:**
- [ ] Gunakan `title: { absolute: "..." }` pada metadata detail produk.
- [ ] Perbaiki juga judul fallback “Produk Tidak Ditemukan”.
- [ ] Audit semua `generateMetadata`/`metadata` untuk pola serupa.

**Test wajib:**
- [ ] Judul produk menjadi `Nama Produk | Beli Online di FastShop` tanpa suffix ganda.
- [ ] Judul fallback tidak mengandung `| FastShop` dua kali.
- [ ] Halaman listing tetap memakai template root dengan benar.

**Kriteria selesai:**
- Tidak ada judul dengan suffix `| FastShop` berulang.

**Verifikasi:**
```bash
npm run build
npm start
curl -s http://localhost:3000/products/<id> | grep "<title>"
```

**Commit:** `fix(seo): perbaiki judul metadata detail produk`

---

### P1-03 — Perbaiki Sorting Katalog dan State Pencarian

| | |
|---|---|
| **Prioritas** | P1 |
| **Estimasi** | M (0,5–1 hari) |
| **Dependensi** | P1-01 |

**File terkait:**
- `app/products/page.tsx`
- `lib/api/products.ts`

**Masalah:**
Sorting hanya mengurutkan halaman aktif, ganti sort tidak mereset page, state pencarian bisa basi, dan kategori di-fetch dua kali.

**Langkah:**
- [ ] Kirim parameter `sort` ke API jika didukung; jika tidak, lakukan sorting setelah mengambil seluruh data yang relevan.
- [ ] Reset `page` ke `1` saat sort berubah.
- [ ] Samakan state input pencarian dengan `searchParams` (controlled + sinkronisasi).
- [ ] Hindari fetch produk pertama sebelum kategori selesai dimuat, atau terima hasil sementara dengan indikator loading.
- [ ] Pastikan perubahan filter tidak menimbulkan double request.

**Test wajib:**
- [ ] Sorting di halaman 2 mengurutkan seluruh katalog, bukan hanya 12 item.
- [ ] Ganti sort dari halaman 3 → kembali ke halaman 1.
- [ ] Cari dari navbar saat sudah di `/products` → input dan submit memakai kata kunci baru.
- [ ] Filter kategori via slug langsung menampilkan produk kategori yang benar.

**Kriteria selesai:**
- Sorting konsisten di semua halaman.
- Tidak ada state pencarian basi.
- Tidak ada double fetch yang tidak perlu.

**Verifikasi:**
```bash
npm run lint
npx tsc --noEmit
npm run build
```

**Commit:** `fix(products): perbaiki sorting dan sinkronisasi pencarian`

---

### P1-04 — Buat Prefill Checkout Reaktif terhadap User

| | |
|---|---|
| **Prioritas** | P1 |
| **Estimasi** | S (≤ 2 jam) |
| **Dependensi** | P0-02 |

**File terkait:**
- `app/checkout/page.tsx`

**Masalah:**
`useState(user?.name || "")` dievaluasi saat hydration ketika `user` masih `null`, sehingga field tidak terisi pada hard refresh.

**Langkah:**
- [ ] Inisialisasi field kosong, lalu isi setelah user tersedia dan field belum diubah pengguna.
- [ ] Jangan menimpa input yang sudah diketik pengguna.
- [ ] Terapkan pola yang sama untuk nomor telepon.

**Test wajib:**
- [ ] Hard refresh checkout dengan user login → nama dan telepon terisi.
- [ ] Pengguna mengubah field sebelum data user datang → perubahan tidak tertimpa.
- [ ] User tanpa nomor telepon → field tetap kosong.

**Kriteria selesai:**
- Prefill berfungsi pada hard refresh dan client navigation.
- Input pengguna tidak tertimpa.

**Verifikasi:**
```bash
npm run lint
npx tsc --noEmit
npm run build
```

**Commit:** `fix(checkout): isi data penerima setelah auth siap`

---

### P1-05 — Tambahkan Pagination/Limit Daftar Pesanan

| | |
|---|---|
| **Prioritas** | P1 |
| **Estimasi** | M (0,5–1 hari) |
| **Dependensi** | - |

**File terkait:**
- `app/orders/page.tsx`
- `lib/api/orders.ts`
- `types/index.ts`

**Masalah:**
`getOrdersApi(undefined, token)` hanya mengambil halaman pertama. Hitungan tab dan daftar pesanan tidak lengkap jika data melebihi limit backend.

**Langkah:**
- [ ] Kirim `page` dan `limit` eksplisit.
- [ ] Simpan dan tampilkan metadata pagination.
- [ ] Tambahkan kontrol pagination atau “Muat lebih banyak”.
- [ ] Pastikan filter status tetap konsisten dengan pagination.
- [ ] Tampilkan state loading/empty yang sesuai.

**Test wajib:**
- [ ] User dengan >10 pesanan dapat melihat semua halaman.
- [ ] Perpindahan halaman memuat data yang benar.
- [ ] Filter status mempertahankan halaman yang valid.
- [ ] Hitungan tab sesuai total data, bukan hanya halaman aktif.

**Kriteria selesai:**
- Semua pesanan dapat diakses.
- Pagination tidak merusak filter status.

**Verifikasi:**
```bash
npm run lint
npx tsc --noEmit
npm run build
```

**Commit:** `feat(orders): tambahkan pagination riwayat pesanan`

---

### P1-06 — Perkuat `SITE_URL` dan Sitemap

| | |
|---|---|
| **Prioritas** | P1 |
| **Estimasi** | S (≤ 2 jam) |
| **Dependensi** | - |

**File terkait:**
- `lib/constants.ts`
- `app/sitemap.ts`
- `app/robots.ts`
- `app/layout.tsx`
- `.env.example`

**Masalah:**
`SITE_URL` fallback ke localhost. Sitemap hanya meminta 1000 produk dan `lastModified` route statis selalu `new Date()`.

**Langkah:**
- [ ] Wajibkan `NEXT_PUBLIC_SITE_URL` di production (gagal build/peringatan jelas jika kosong).
- [ ] Dokumentasikan nilai production di `.env.example`/README.
- [ ] Tambahkan pagination pada pengambilan produk untuk sitemap atau konfirmasi batas maksimum backend.
- [ ] Gunakan tanggal statis yang bermakna atau hilangkan `lastModified` yang tidak akurat.
- [ ] Pastikan `robots.ts` memakai URL yang sama.

**Test wajib:**
- [ ] Build dengan `NEXT_PUBLIC_SITE_URL` production → canonical dan sitemap memakai domain production.
- [ ] Sitemap memuat seluruh produk (atau batas yang didokumentasikan).
- [ ] `robots.txt` menunjuk sitemap yang benar.

**Kriteria selesai:**
- Tidak ada URL localhost di output produksi.
- Sitemap mencakup seluruh produk yang tersedia.

**Verifikasi:**
```bash
npm run build
npm start
curl -s http://localhost:3000/sitemap.xml | head
curl -s http://localhost:3000/robots.txt
```

**Commit:** `fix(seo): perkuat konfigurasi site URL dan sitemap`

---

### P1-07 — Siapkan Test Runner, Error Boundary, dan CI

| | |
|---|---|
| **Prioritas** | P1 |
| **Estimasi** | L (1–3 hari) |
| **Dependensi** | - |

**File terkait:**
- `package.json`
- `app/error.tsx`
- `app/loading.tsx`
- `app/not-found.tsx`
- `.github/workflows/ci.yml`
- File test baru

**Masalah:**
Belum ada test, error boundary, loading state global, 404 kustom, atau CI.

**Langkah:**
- [ ] Pilih dan pasang test runner (mis. Vitest + React Testing Library; Playwright untuk E2E).
- [ ] Tambahkan script `test`, `test:watch`, dan `test:e2e`.
- [ ] Tambahkan test unit untuk cart, auth, validasi, dan format Rupiah.
- [ ] Tambahkan test E2E minimal: login → tambah cart → checkout → lihat pesanan.
- [ ] Tambahkan `app/error.tsx`, `app/loading.tsx`, dan `app/not-found.tsx`.
- [ ] Tambahkan CI yang menjalankan lint, typecheck, test, dan build.
- [ ] Dokumentasikan cara menjalankan test.

**Test wajib:**
- [ ] `npm test` berjalan dan lulus.
- [ ] CI gagal jika lint/typecheck/test/build gagal.
- [ ] Error boundary menampilkan fallback yang ramah.
- [ ] Route tidak dikenal menampilkan halaman 404 kustom.

**Kriteria selesai:**
- Ada test otomatis untuk alur kritis.
- CI aktif dan wajib lulus sebelum merge.
- Error/loading/not-found global tersedia.

**Verifikasi:**
```bash
npm run lint
npx tsc --noEmit
npm test
npm run build
```

**Commit:** `test: tambahkan test runner, error boundary, dan CI`

---

### P1-08 — Putuskan dan Benahi Fitur Kode Promo

| | |
|---|---|
| **Prioritas** | P1 |
| **Estimasi** | S (≤ 2 jam) |
| **Dependensi** | Konfirmasi dukungan backend |

**File terkait:**
- `components/cart/cart-summary.tsx`
- `app/checkout/page.tsx`
- `lib/api/*` (jika didukung)

**Masalah:**
Input kode promo selalu menghasilkan error dan belum ada integrasi backend. Fitur terlihat tersedia tetapi tidak berfungsi.

**Langkah:**
- [ ] Konfirmasi apakah backend memiliki endpoint promo.
- [ ] Jika ada: implementasikan validasi, apply, dan perhitungan diskon.
- [ ] Jika belum ada: hapus input promo atau tandai “segera hadir” dengan jelas.
- [ ] Pastikan total di cart dan checkout konsisten.

**Test wajib:**
- [ ] Promo valid mengurangi total sesuai aturan.
- [ ] Promo tidak valid menampilkan pesan yang jelas.
- [ ] Jika fitur dihapus, tidak ada elemen UI yang menyesatkan.

**Kriteria selesai:**
- Fitur promo berfungsi penuh atau tidak ditampilkan.
- Tidak ada error palsu yang selalu muncul.

**Verifikasi:**
```bash
npm run lint
npx tsc --noEmit
npm run build
```

**Commit:** `fix(cart): benahi atau sembunyikan fitur kode promo`

---

### P1-09 — Tangani Token Kedaluwarsa/401 Secara Global

| | |
|---|---|
| **Prioritas** | P1 |
| **Estimasi** | M (0,5–1 hari) |
| **Dependensi** | P0-02 |

**File terkait:**
- `lib/api/client.ts`
- `context/auth-context.tsx`
- Halaman protected

**Masalah:**
Token kedaluwarsa hanya menghasilkan error biasa. Pengguna tidak diarahkan login ulang dan state auth tetap dianggap valid.

**Langkah:**
- [ ] Deteksi response 401 di `apiClient`.
- [ ] Bersihkan sesi dan arahkan ke login dengan `redirect` yang aman.
- [ ] Hindari redirect loop pada endpoint publik.
- [ ] Tampilkan pesan “Sesi berakhir, silakan masuk kembali”.
- [ ] Pastikan cart/state lain tidak rusak setelah logout paksa.

**Test wajib:**
- [ ] Request dengan token kedaluwarsa → sesi dibersihkan dan diarahkan ke login.
- [ ] Endpoint publik tetap berjalan tanpa token.
- [ ] Tidak ada redirect berulang.
- [ ] Setelah login ulang, pengguna kembali ke halaman asal.

**Kriteria selesai:**
- 401 ditangani konsisten di seluruh aplikasi.
- Tidak ada state auth yang tertinggal setelah token invalid.

**Verifikasi:**
```bash
npm run lint
npx tsc --noEmit
npm run build
```

**Commit:** `fix(auth): tangani token kedaluwarsa secara global`

---

### P1-10 — Perkuat Validasi Form Checkout

| | |
|---|---|
| **Prioritas** | P1 |
| **Estimasi** | S (≤ 2 jam) |
| **Dependensi** | - |

**File terkait:**
- `app/checkout/page.tsx`
- `lib/validation.ts`

**Masalah:**
Validasi checkout masih manual: nomor telepon tidak divalidasi formatnya, tidak ada batas panjang alamat, dan sanitization belum konsisten.

**Langkah:**
- [ ] Tambahkan validasi nomor telepon Indonesia (atau format yang disepakati).
- [ ] Tambahkan batas panjang nama, alamat, kota, dan catatan.
- [ ] Sanitasi input teks sebelum dikirim.
- [ ] Tampilkan error per field, bukan hanya satu pesan global.
- [ ] Pastikan validasi server tetap menjadi otoritas akhir.

**Test wajib:**
- [ ] Nomor telepon tidak valid → error di field terkait.
- [ ] Alamat terlalu panjang → error.
- [ ] Input berisi karakter berbahaya → tersanitasi/tidak merusak UI.
- [ ] Form valid → payload sesuai kontrak.

**Kriteria selesai:**
- Validasi checkout konsisten dan informatif.
- Tidak ada input tak terbatas yang dikirim ke API.

**Verifikasi:**
```bash
npm run lint
npx tsc --noEmit
npm run build
```

**Commit:** `fix(checkout): perkuat validasi data pengiriman`

---

### P2-01 — Konsistenkan Token Warna dan Palet Netral

| | |
|---|---|
| **Prioritas** | P2 |
| **Estimasi** | S (≤ 2 jam) |
| **Dependensi** | - |

**File terkait:**
- `app/checkout/page.tsx`
- `app/orders/page.tsx`
- `app/orders/[id]/page.tsx`
- `components/orders/payment-upload-modal.tsx`

**Langkah:**
- [ ] Ganti semua `hover:bg-[#1f5c4e]` dengan `hover:bg-primary-hover`.
- [ ] Pilih satu palet netral (`zinc` atau `neutral`) dan terapkan konsisten.
- [ ] Audit kelas warna hardcoded lain.
- [ ] Jalankan `grep` untuk memastikan tidak ada sisa warna hardcoded yang tidak disengaja.

**Kriteria selesai:**
- Tidak ada nilai hex hardcoded di className.
- Palet netral konsisten di seluruh halaman.

**Verifikasi:**
```bash
grep -rn "hover:bg-\[#\|bg-\[#\|text-\[#\|border-\[#" app components
npm run lint
```

**Commit:** `style(ui): konsistenkan token warna dan palet netral`

---

### P2-02 — Hilangkan Flash Tema Sebelum Hydration

| | |
|---|---|
| **Prioritas** | P2 |
| **Estimasi** | S (≤ 2 jam) |
| **Dependensi** | - |

**File terkait:**
- `context/theme-context.tsx`
- `app/layout.tsx`

**Langkah:**
- [ ] Tambahkan inline script sinkron di `<head>` untuk membaca tema dari localStorage dan menambahkan class `.dark` sebelum paint.
- [ ] Tetap gunakan ThemeProvider untuk toggle setelah hydration.
- [ ] Tambahkan `suppressHydrationWarning` jika diperlukan pada elemen html.
- [ ] Uji dengan tema gelap tersimpan lalu hard refresh.

**Kriteria selesai:**
- Tidak ada kilatan light mode pada pengguna dark mode.
- Toggle tema tetap berfungsi.

**Verifikasi:**
```bash
npm run lint
npx tsc --noEmit
npm run build
```

**Commit:** `fix(theme): cegah flash tema sebelum hydration`

---

### P2-03 — Perbaiki Aksesibilitas Modal Upload

| | |
|---|---|
| **Prioritas** | P2 |
| **Estimasi** | M (0,5–1 hari) |
| **Dependensi** | - |

**File terkait:**
- `components/orders/payment-upload-modal.tsx`

**Langkah:**
- [ ] Tambahkan focus trap dan fokus awal ke elemen pertama.
- [ ] Kembalikan fokus ke pemicu saat modal ditutup.
- [ ] Ubah dropzone menjadi elemen yang bisa diakses keyboard (`button`/`label` dengan input).
- [ ] Tambahkan `aria-describedby` untuk pesan error.
- [ ] Pastikan tombol tutup memiliki label yang jelas.

**Kriteria selesai:**
- Modal dapat digunakan sepenuhnya dengan keyboard.
- Fokus tidak keluar dari modal saat terbuka.
- Screen reader dapat memahami error dan instruksi.

**Verifikasi:**
```bash
npm run lint
npx tsc --noEmit
npm run build
```

**Commit:** `fix(a11y): perbaiki aksesibilitas modal bukti pembayaran`

---

### P2-04 — Bersihkan Dead Code dan Export Tak Terpakai

| | |
|---|---|
| **Prioritas** | P2 |
| **Estimasi** | S (≤ 2 jam) |
| **Dependensi** | P0-01, P1-08 |

**File terkait:**
- `lib/api/cart.ts`
- `lib/utils.ts`
- `lib/validation.ts`
- `lib/api/categories.ts`

**Langkah:**
- [ ] Hapus atau gunakan `updateCartItemApi` setelah P0-01.
- [ ] Hapus `truncateText`, `sanitizeInput`, `isValidEmail`, `isStrongPassword` jika tetap tidak terpakai.
- [ ] Hapus `getCategoryById` jika tidak dibutuhkan.
- [ ] Pastikan tidak ada import yang menjadi tidak terpakai.

**Kriteria selesai:**
- Tidak ada export/utility yatim yang membingungkan.
- Build dan lint tetap bersih.

**Verifikasi:**
```bash
npm run lint
npx tsc --noEmit
npm run build
```

**Commit:** `chore: hapus kode dan export yang tidak terpakai`

---

### P2-05 — Sinkronkan Dokumentasi dengan Implementasi

| | |
|---|---|
| **Prioritas** | P2 |
| **Estimasi** | S (≤ 2 jam) |
| **Dependensi** | P1-08, P2-04 |

**File terkait:**
- `README.md`
- `docs/API_RESPONSES.md`
- `DESIGN.md`
- `PRODUCT.md`

**Langkah:**
- [ ] Perbaiki klaim “debounced instant search” atau implementasikan debounce.
- [ ] Sesuaikan struktur folder `(auth)` di README dengan folder aktual.
- [ ] Tambahkan catatan tentang fitur promo dan metode pembayaran yang benar-benar didukung.
- [ ] Pastikan dokumentasi API sesuai kontrak backend terbaru.

**Kriteria selesai:**
- README tidak menjanjikan fitur yang belum ada.
- Struktur folder dan endpoint yang didokumentasikan sesuai kode.

**Verifikasi:**
```bash
grep -rn "debounced\|(auth)" README.md
```

**Commit:** `docs: sinkronkan README dengan implementasi terkini`

---

### P2-06 — Rapikan Logging, Format Rupiah, dan Clipboard

| | |
|---|---|
| **Prioritas** | P2 |
| **Estimasi** | S (≤ 2 jam) |
| **Dependensi** | - |

**File terkait:**
- `lib/utils.ts`
- `app/orders/[id]/page.tsx`
- `components/orders/payment-upload-modal.tsx`
- `context/*.tsx`
- `app/*/page.tsx`

**Langkah:**
- [ ] Ganti `console.warn` dengan logger/error reporting terpusat atau hapus jika tidak perlu.
- [ ] Perkuat `formatRupiah` agar mendukung string dengan pemisah ribuan.
- [ ] Tambahkan fallback/`try-catch` untuk `navigator.clipboard.writeText`.
- [ ] Pastikan pesan error API tidak membocorkan detail internal.
- [ ] Audit `catch` kosong dan ganti dengan penanganan yang jelas.

**Kriteria selesai:**
- Tidak ada `console.*` liar di kode produksi.
- Format Rupiah menangani input umum dengan benar.
- Copy rekening gagal dengan aman tanpa unhandled rejection.

**Verifikasi:**
```bash
grep -rn "console\." app components context lib
npm run lint
npx tsc --noEmit
npm run build
```

**Commit:** `chore: rapikan logging, format Rupiah, dan clipboard`

---

## Urutan Eksekusi yang Disarankan

### Sprint 1 — Stabilkan Alur Inti

1. P1-07 (minimal setup test runner) — agar perbaikan berikutnya punya jaring pengaman.
2. P0-02 (auth hydration).
3. P0-01 (cart sync).
4. P0-06 (redirect aman).
5. P0-05 (JSON-LD escape).
6. P0-04 (hapus data palsu).
7. P0-03 (kontrak pembayaran).
8. P0-07 dan P0-08 (security headers, demo creds).

### Sprint 2 — Siapkan Launch Hygiene

1. P1-02 (metadata dobel).
2. P1-03 (sorting/search).
3. P1-04 (prefill checkout).
4. P1-05 (pagination pesanan).
5. P1-06 (site URL/sitemap).
6. P1-09 (401 global).
7. P1-10 (validasi checkout).
8. P1-08 (promo).

### Sprint 3 — SEO, Test, dan Polish

1. P1-01 (server-render listing).
2. Lengkapi test E2E dan CI dari P1-07.
3. P2-01 sampai P2-06.

---

## Definition of Done Global

Sebuah task dianggap selesai jika:

- [ ] Semua sub-task dicentang.
- [ ] `npm run lint` bersih.
- [ ] `npx tsc --noEmit` lolos.
- [ ] `npm run build` berhasil.
- [ ] Test terkait lulus (setelah P1-07 tersedia).
- [ ] Tidak ada regresi pada alur guest → login → cart → checkout → order.
- [ ] Tidak ada data sensitif/credential baru yang masuk repository.
- [ ] Commit memakai format Conventional Commits.
- [ ] Dokumentasi terkait diperbarui bila perilaku berubah.

---

## Catatan

- Urutan di atas dapat disesuaikan dengan prioritas bisnis.
- Beberapa task P0 menyentuh file yang sama (`cart-context`, halaman auth/checkout). Sebaiknya dikerjakan berurutan untuk menghindari konflik.
- Task yang bergantung pada kontrak backend (P0-03, P1-08) memerlukan konfirmasi sebelum implementasi.
- P0-07 (CSP) dan P2-02 (inline script tema) harus dikoordinasikan agar script tema diizinkan melalui nonce/hash.
- Setelah semua P0 selesai, lakukan regression test manual menyeluruh pada alur utama sebelum melanjutkan ke P1.
