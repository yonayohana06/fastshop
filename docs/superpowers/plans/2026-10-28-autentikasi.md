# Tahap 4: Halaman Autentikasi (Login & Register) & Integrasi Auth API (Solid Color) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Membangun modul autentikasi lengkap toko online FastShop mencakup API service (`lib/api/auth.ts`), halaman Login (`/login`) dengan fitur 1-klik akun demo dan redirect URL, halaman Register (`/register`) dengan validasi form, serta halaman Profil Pengguna (`/profile`) — dengan aturan ketat: **HANYA MENGGUNAKAN WARNA SOLID, BEBAS DARI GRADASI WARNA**.

**Architecture:** Next.js 16 App Router Client Components yang terhubung dengan `useAuth()` Context dan API backend `https://ecommerce-backend-api-nu.vercel.app/api/auth/`. Token JWT disimpan di `localStorage` melalui event-based store `useSyncExternalStore` yang aman dari SSR hydration mismatch.

**Tech Stack:** Next.js 16.4.3, React 19.3.0, TypeScript 5, Tailwind CSS v4, Lucide React.

**Spec:** [docs/API_RESPONSES.md](file:///Users/mmm/Documents/project/FE/fastshop/docs/API_RESPONSES.md) (Section 1: Authentication)

## Global Constraints

- **STRICT: TANPA GRADASI WARNA.** Tidak boleh ada `bg-gradient-*`, `from-*`, `to-*`, `via-*`, atau `bg-clip-text`. Gunakan warna solid, border solid, dan badge warna solid.
- Password input harus memiliki tombol toggle lihat/sembunyikan password (`Eye` / `EyeOff`).
- Input formulir harus memiliki validasi format email dan kesesuaian konfirmasi password.
- Jika pengguna sudah login dan membuka `/login` atau `/register`, otomatis arahkan ke beranda `/` atau target redirect.

## Review Focus

- **Demo Account Shortcut:** Sediakan tombol "Gunakan Akun Demo" di halaman Login yang otomatis mengisi kredensial uji (`agussumanto@example.com` / `password123`) untuk kemudahan pengujian.
- **Login Session Persistence:** Setelah login sukses, `AuthContext` harus langsung mengupdate state user & token, sehingga Navbar otomatis berubah menjadi avatar akun tanpa perlu refresh halaman manual.
- **Redirect Query Param:** Mendukung redirect kembali ke halaman sebelumnya (misal: `/login?redirect=/cart` setelah login langsung menuju `/cart`).
- **Error Handling:** Menampilkan pesan error yang ramah dan jelas dari backend (misal: "Email atau Password salah" atau "Email sudah terdaftar").
- **Logout Action:** Logout dari menu dropdown Navbar atau profil langsung menghapus sesi dan mengembalikan status ke tamu.

---

### Task 1: Auth API Client Services

**Files:**
- Create: `lib/api/auth.ts`

**Interfaces:**
- Consumes: `lib/api/client.ts`, `types/index.ts`
- Produces: `loginApi(credentials)`, `registerApi(payload)`, `getMeApi(token?)`

- [ ] **Step 1: Buat service auth `lib/api/auth.ts`**
Fungsi pemanggilan endpoint:
- `POST /auth/login`
- `POST /auth/register`
- `GET /auth/me`

- [ ] **Step 2: Verifikasi Linting & Typecheck**
Jalankan: `npm run lint && npx tsc --noEmit`
Pastikan: Bersih tanpa error.

- [ ] **Step 3: Commit**
```bash
git add lib/api/auth.ts
git commit -m "feat(api): add authentication api services for login, register, and profile"
```

---

### Task 2: Halaman Login (`app/login/page.tsx`)

**Files:**
- Create: `app/login/page.tsx`

**Interfaces:**
- Consumes: `useAuth()`, `loginApi()`, ikon `lucide-react`
- Produces: Halaman `/login` responsif dengan solid styling.

- [ ] **Step 1: Buat halaman `/login` di `app/login/page.tsx`**
Form login dengan:
- Input email & password dengan toggle show/hide
- Tombol "Masuk Sekarang" dengan status loading
- Tombol 1-klik "Gunakan Akun Demo"
- Pesan kesalahan visual jika login gagal
- Penanganan redirect pasca login

- [ ] **Step 2: Verifikasi Linting & Typecheck**
Jalankan: `npm run lint && npx tsc --noEmit`
Pastikan: Bersih tanpa error.

- [ ] **Step 3: Commit**
```bash
git add app/login/page.tsx
git commit -m "feat(auth): implement login page with demo account shortcut and solid styling"
```

---

### Task 3: Halaman Register (`app/register/page.tsx`)

**Files:**
- Create: `app/register/page.tsx`

**Interfaces:**
- Consumes: `registerApi()`, `loginApi()`, `useAuth()`, ikon `lucide-react`
- Produces: Halaman `/register` responsif dengan solid styling.

- [ ] **Step 1: Buat halaman `/register` di `app/register/page.tsx`**
Form registrasi dengan:
- Input nama lengkap, email, password, dan konfirmasi password
- Validasi kecocokan password
- Tombol "Daftar Akun" dengan status loading
- Otomatis login dan redirect ke beranda setelah pendaftaran berhasil
- Pesan kesalahan jika email sudah terdaftar

- [ ] **Step 2: Verifikasi Linting & Typecheck**
Jalankan: `npm run lint && npx tsc --noEmit`
Pastikan: Bersih tanpa error.

- [ ] **Step 3: Commit**
```bash
git add app/register/page.tsx
git commit -m "feat(auth): implement register page with validation and auto-login"
```

---

### Task 4: Halaman Profil Pengguna (`app/profile/page.tsx`) & Integrasi Navigasi

**Files:**
- Create: `app/profile/page.tsx`

**Interfaces:**
- Consumes: `useAuth()`, `getMeApi()`, `Breadcrumbs`
- Produces: Halaman `/profile` untuk melihat informasi akun aktif.

- [ ] **Step 1: Buat halaman profil `app/profile/page.tsx`**
Informasi pengguna aktif: nama, email, inisial avatar, status role, tanggal bergabung, ringkasan pintasan pesanan, dan tombol Logout.

- [ ] **Step 2: Pengecekan Gradasi Global**
Jalankan `grep -rn "gradient" app components lib`
Pastikan: 0 kecocokan (bebas gradasi).

- [ ] **Step 3: Verifikasi Linting & Typecheck**
Jalankan: `npm run lint && npx tsc --noEmit`
Pastikan: Bersih tanpa error.

- [ ] **Step 4: Commit**
```bash
git add app/profile/page.tsx
git commit -m "feat(auth): implement user profile page and session management"
```
