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
