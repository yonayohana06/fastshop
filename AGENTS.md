<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

---

# 📜 Panduan & Aturan Pembuatan Fitur Baru (FastShop)

Dokumen ini berisi standar teknis, aturan desain, dan konvensi arsitektur yang **WAJIB** diikuti oleh setiap pengembang (developer) maupun AI coding agent saat menambahkan, mengubah, atau memperbaiki fitur pada proyek FastShop.

---

## 1. 🎨 Aturan Desain & Styling Visual

### 🚫 ATURAN KETAT: Dilarang Menggunakan Gradasi Warna (Zero Gradients)
- **100% Solid Colors Only:** Dilarang keras menggunakan utilitas gradasi warna Tailwind CSS di manapun pada proyek ini (`bg-gradient-*`, `from-*`, `to-*`, `via-*`, `bg-clip-text`, dsb.).
- Seluruh latar belakang kartu, tombol, badge, maupun hero banner wajib menggunakan warna solid murni.
- Jalankan pemeriksaan kepatuhan sebelum commit:
  ```bash
  grep -rn "gradient" app components lib
  # Hasil HARUS 0 matches!
  ```

### 🎯 Palet Warna Resmi Brand FastShop
Gunakan token CSS dan utilitas Tailwind yang telah dikonfigurasi:
- **Primary Color:** `#287361` *(Deep Forest Teal)*
  - Class: `bg-primary`, `text-primary`, `border-primary`, `hover:bg-primary-hover`
- **Secondary Color:** `#c36433` *(Terracotta / Burnt Orange)*
  - Class: `bg-secondary`, `text-secondary`, `border-secondary`, `hover:bg-secondary-hover`
- **Status Semantik (Solid):**
  - `PENDING`: Amber solid (`bg-amber-100 text-amber-800 border-amber-300`)
  - `PROCESSING`: Blue solid (`bg-blue-100 text-blue-800 border-blue-300`)
  - `SHIPPED`: Teal solid (`bg-teal-100 text-teal-800 border-teal-300`)
  - `COMPLETED`: Emerald solid (`bg-emerald-100 text-emerald-800 border-emerald-300`)
  - `CANCELLED`: Red solid (`bg-red-100 text-red-800 border-red-300`)

### ☀️ Tema Default Selalu Light Mode
- Default tema aplikasi adalah **Light Mode** (`var(--background) = #ffffff`, body `bg-zinc-50/50`).
- Jangan gunakan `@media (prefers-color-scheme: dark)` secara langsung. Gunakan selector berbasis class (`.dark`) melalui `useTheme()`.

---

## 2. 🧱 Arsitektur Aliran Data (Layered Architecture)

Setiap fitur baru harus mengikuti pemisahan tanggung jawab (*Separation of Concerns*):

```text
UI Layer (Pages/Components) 
  ---> State Layer (Context / Hooks / useSyncExternalStore)
    ---> Service Layer (lib/api/*.ts)
      ---> HTTP Client (lib/api/client.ts)
        ---> Backend REST API
```

1. **UI Layer (`app/` & `components/`):**
   - Komponen visual presentasional.
   - Jangan melakukan panggilan `fetch` manual langsung di komponen UI. Panggil fungsi dari modul Service atau Context.
   - Gunakan ikon dari `lucide-react`.

2. **State & Logic Layer (`context/`):**
   - Gunakan React Context untuk state global (`auth-context`, `cart-context`, `theme-context`).
   - Gunakan `useSyncExternalStore` untuk membaca data dari `localStorage` guna menghindari *hydration mismatch*.
   - **Aturan React 19:** Jangan memanggil `setState()` secara sinkron langsung di dalam badan `useEffect()` (akan memicu error lint `react-hooks/set-state-in-effect`). Panggil `setState` hanya di dalam async callback (`.then()`, event listener, atau inisialisasi deklaratif).

3. **Service Layer (`lib/api/*.ts`):**
   - Kelompokkan endpoint berdasarkan fitur (contoh: `lib/api/products.ts`, `lib/api/orders.ts`, `lib/api/cart.ts`).
   - Semua fungsi harus memiliki tipe data parameter dan *return type* yang ketat (`Promise<ApiResponse<T>>`).

4. **HTTP Client (`lib/api/client.ts`):**
   - Selalu gunakan `apiClient<T>(endpoint, options)`.
   - Modul ini sudah mengotomatisasi penyematan token Bearer (`Authorization: Bearer <token>`), serialisasi query params, dan pemisahan otomatis antara payload JSON dengan `multipart/form-data` (`FormData`).

---

## 3. 🔒 Keamanan & Proteksi Rute (Route Guard)

- Halaman yang memerlukan otentikasi (misal: `/checkout`, `/orders`, `/orders/[id]`, `/profile`):
  - Ambil status dari `useAuth()`.
  - Pasang redirect guard jika pengguna belum masuk:
    ```tsx
    useEffect(() => {
      if (!authLoading && !isAuthenticated) {
        router.push("/login?redirect=<current_route>");
      }
    }, [authLoading, isAuthenticated, router]);
    ```
- Token sesi disimpan di `localStorage` menggunakan kunci konstanta `STORAGE_KEYS.TOKEN` (`fastshop_token`).

---

## 4. 🧩 Tipe Data & Kontrak API (`types/index.ts`)

- Setiap entitas data baru **WAJIB** didefinisikan antarmukanya di `types/index.ts`.
- **DILARANG** menggunakan tipe `any`. Gunakan tipe data spesifik atau `unknown` dengan type-guard.
- Bungkus semua response dengan generic `ApiResponse<T>`.

---

## 5. 🖼️ Penggunaan Komponen Gambar (`next/image`)

- Selalu gunakan komponen `<Image />` dari `next/image` dengan properti `alt` yang jelas.
- Domain gambar eksternal yang diizinkan tercatat di `next.config.ts`:
  - `images.unsplash.com`
  - `img.icons8.com`
  - `**.supabase.co`
- Jika gambar berasal dari sumber dinamis yang tidak memerlukan optimasi loader, gunakan properti `unoptimized`.

---

## 6. 🧪 Checklist Wajib Sebelum Commit (Quality Assurance)

Sebelum mengajukan perubahan atau membuat commit, jalankan verifikasi berikut:

```bash
# 1. Pastikan bebas dari gradasi warna
grep -rn "gradient" app components lib

# 2. Pastikan linting bersih (0 error, 0 warning)
npm run lint

# 3. Pastikan typecheck TypeScript lolos tanpa error
npx tsc --noEmit
```

### Format Pesan Commit (Conventional Commits):
Gunakan format standar:
- `feat(scope): ...` untuk penambahan fitur baru
- `fix(scope): ...` untuk perbaikan bug
- `style(scope): ...` untuk penyesuaian gaya tampilan tanpa mengubah logika
- `refactor(scope): ...` untuk restrukturisasi kode
- `docs(scope): ...` untuk perubahan dokumentasi

