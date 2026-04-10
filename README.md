# Frontend SLA

Frontend ini adalah antarmuka web untuk aplikasi SLA/ticketing. Aplikasi dibangun dengan React, TypeScript, dan Vite, lalu menyediakan portal publik untuk membuat aduan dan tracking tiket, serta halaman internal untuk login dan area admin.

## Fitur Utama

- Form aduan publik dengan validasi input.
- Halaman sukses setelah tiket dibuat.
- Halaman tracking status tiket berdasarkan kode tiket dan nomor HP.
- Login internal untuk role `admin`, `head`, dan `technician`.
- Dashboard admin dan daftar tiket sebagai fondasi Phase 1.

## Stack

- React 19
- TypeScript
- Vite
- React Router 7
- Axios
- Tailwind CSS 4
- React Compiler

## Struktur Singkat

```text
frontend/
|-- public/            # aset publik statis
|-- src/
|   |-- api/           # integrasi HTTP ke backend
|   |-- app/           # router dan provider aplikasi
|   |-- components/    # komponen UI
|   |-- lib/           # helper auth/session
|   |-- pages/         # halaman publik dan admin
|   |-- routes/        # guard route
|   `-- types/         # type/interface TS
|-- .env.example
|-- package.json
`-- vite.config.ts
```

## Persiapan Lokal

### 1. Install dependency

```powershell
cd frontend
npm install
```

### 2. Siapkan environment variable

```powershell
Copy-Item .env.example .env
```

Variabel yang digunakan:

| Variable | Keterangan |
| --- | --- |
| `VITE_API_BASE_URL` | Base URL backend FastAPI, default `http://127.0.0.1:8000/api/v1` |
| `VITE_API_TIMEOUT_MS` | Timeout request umum (ms), default `30000` |
| `VITE_API_UPLOAD_TIMEOUT_MS` | Timeout request upload file/video (ms), default `120000` |

### 3. Jalankan development server

```powershell
npm run dev
```

Frontend akan tersedia di `http://localhost:5173`.

## Scripts

| Command | Keterangan |
| --- | --- |
| `npm run dev` | Menjalankan Vite dev server |
| `npm run build` | Build produksi |
| `npm run preview` | Menjalankan hasil build secara lokal |
| `npm run lint` | Menjalankan ESLint |

## Daftar Halaman

| Route | Keterangan |
| --- | --- |
| `/` | Form aduan publik |
| `/success` | Halaman hasil submit tiket |
| `/tracking` | Tracking tiket |
| `/login` | Login internal |
| `/admin` | Dashboard internal |
| `/admin/tickets` | Daftar tiket internal |

## Integrasi Dengan Backend

Frontend menggunakan `axios` dengan base URL dari `VITE_API_BASE_URL`. Secara default, aplikasi akan mengarah ke:

```text
http://127.0.0.1:8000/api/v1
```

Pastikan backend sudah berjalan sebelum mengakses form publik, tracking, atau login internal.

## Deploy Frontend ke Vercel

Frontend ini cocok dideploy sebagai project Vercel terpisah dari backend.

### 1. Siapkan URL backend production

Sebelum deploy frontend, pastikan backend Vercel Anda sudah aktif dan punya base URL yang bisa diakses publik, misalnya:

```text
https://backend-anda.vercel.app/api/v1
```

Nilai ini akan dipakai sebagai `VITE_API_BASE_URL`.

### 2. Buat project Vercel khusus `frontend/`

Langkah yang disarankan:

1. Import repo frontend ke Vercel.
2. Set `Root Directory` ke `frontend`.
3. Biarkan framework terdeteksi sebagai `Vite`.
4. Isi environment variable `VITE_API_BASE_URL`.
5. Deploy.

### 3. Tambahkan environment variable di Vercel

| Variable | Wajib | Keterangan |
| --- | --- | --- |
| `VITE_API_BASE_URL` | Ya | URL backend publik sampai prefix `/api/v1` |

Contoh:

```text
VITE_API_BASE_URL=https://backend-anda.vercel.app/api/v1
```

Jika nilai environment variable diubah, frontend perlu dideploy ulang agar build baru memakai nilai terbaru.

### 4. SPA routing di Vercel

Repo ini sudah disiapkan dengan `vercel.json` agar route seperti:

- `/tracking`
- `/login`
- `/admin`
- `/admin/tickets`

tetap diarahkan ke `index.html` dan ditangani oleh React Router.

### 5. Setelah frontend online

Tambahkan domain frontend Vercel ke `CORS_ORIGINS` backend, lalu redeploy backend agar browser mengizinkan request lintas origin.

## Kredensial Login Default

Jika backend dijalankan dengan seed default, akun berikut bisa dipakai untuk mencoba halaman login:

| Role | Email | Password |
| --- | --- | --- |
| `admin` | `admin@example.com` | `admin123` |
| `head` | `head@example.com` | `head123` |
| `technician` | `technician@example.com` | `technician123` |

## Catatan Pengembangan

- Request ke endpoint non-publik akan otomatis menyertakan token bearer bila user sudah login.
- Jika backend mengembalikan `401` untuk route internal, sesi auth frontend akan dibersihkan dan user diarahkan kembali ke halaman login.
- Halaman `Dashboard` dan `Ticket List` saat ini masih berupa skeleton untuk fondasi pengembangan berikutnya.
