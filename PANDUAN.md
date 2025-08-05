# Panduan Menjalankan Proyek Chatbot AI Frontend

Dokumen ini memberikan panduan lengkap untuk menjalankan proyek frontend Chatbot AI secara lokal di komputer Anda.

## 1. Prasyarat

Pastikan Anda telah menginstal perangkat lunak berikut di sistem Anda:

-   **Node.js**: Versi 18.x atau yang lebih baru. Anda bisa mengunduhnya dari [nodejs.org](https://nodejs.org/).
-   **npm** (Node Package Manager): Biasanya terinstal bersama Node.js.

## Tech Stack

Proyek ini dibangun menggunakan teknologi berikut:

- **Next.js**: Framework React untuk aplikasi web sisi server dan statis.
- **React**: Pustaka JavaScript untuk membangun antarmuka pengguna.
- **TypeScript**: Superset JavaScript yang menambahkan tipe statis.
- **Tailwind CSS**: Framework CSS untuk desain yang cepat dan kustom.
- **Supabase**: Platform backend-as-a-service untuk otentikasi, database, dan penyimpanan.
- **Shadcn/ui**: Komponen UI yang dapat digunakan kembali.

## 2. Instalasi

Langkah-langkah untuk menginstal dan menyiapkan proyek.

### a. Kloning Repositori

Jika Anda belum memiliki proyeknya, kloning repositori dari sumbernya.

```bash
git clone <URL_REPOSITORI_ANDA>
cd chatbotai-fe
```

### b. Instalasi Dependensi

Buka terminal di direktori utama proyek dan jalankan perintah berikut untuk menginstal semua paket yang dibutuhkan:

```bash
npm install
```

## 3. Konfigurasi Lingkungan

Proyek ini memerlukan beberapa kunci API dan konfigurasi yang harus disimpan dalam file environment.

### a. Buat File `.env.local`

Buat file baru bernama `.env.local` di direktori utama proyek.

### b. Tambahkan Variabel Lingkungan

Salin dan tempelkan konten berikut ke dalam file `.env.local` yang baru saja Anda buat, dan ganti nilai placeholder dengan kredensial Anda yang sebenarnya.

```env
# URL proyek Supabase Anda
NEXT_PUBLIC_SUPABASE_URL=URL_PROYEK_SUPABASE_ANDA

# Kunci publik (anon) Supabase Anda
NEXT_PUBLIC_SUPABASE_ANON_KEY=KUNCI_ANON_SUPABASE_ANDA

# URL dasar untuk API backend (jika ada)
NEXT_PUBLIC_API_BASE_URL=URL_API_BACKEND_ANDA
```

**Penjelasan Variabel:**

-   `NEXT_PUBLIC_SUPABASE_URL`: Alamat URL unik untuk proyek Supabase Anda. Anda bisa mendapatkannya dari dasbor proyek Supabase Anda di bagian **Settings > API**.
-   `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Kunci `anon` (publik) yang aman untuk dibagikan di sisi klien. Anda bisa mendapatkannya dari dasbor proyek Supabase Anda di bagian **Settings > API**.
-   `NEXT_PUBLIC_API_BASE_URL`: URL dasar tempat backend API Anda di-host. Ini digunakan untuk melakukan panggilan API dari sisi klien.

## 4. Menjalankan Proyek

Setelah instalasi dan konfigurasi selesai, Anda dapat menjalankan proyek.

### a. Mode Pengembangan (Development)

Untuk menjalankan server pengembangan lokal dengan fitur *hot-reloading*:

```bash
npm run dev
```

Setelah perintah ini dijalankan, buka browser Anda dan akses [http://localhost:3000](http://localhost:3000) untuk melihat aplikasi.

### b. Mode Produksi (Production)

Untuk menjalankan aplikasi dalam mode produksi, Anda perlu membangun aplikasi terlebih dahulu, lalu menjalankannya.

1.  **Build Aplikasi:**
    Perintah ini akan membuat versi optimasi dari aplikasi Anda di dalam direktori `.next`.

    ```bash
    npm run build
    ```

2.  **Jalankan Server Produksi:**
    Perintah ini akan menjalankan server produksi.

    ```bash
    npm run start
    ```

    Aplikasi akan berjalan di [http://localhost:3000](http://localhost:3000).

## 5. Linting

Untuk memeriksa kualitas kode dan memastikan konsistensi gaya penulisan, jalankan perintah lint:

```bash
npm run lint
```

Perintah ini akan menampilkan peringatan atau kesalahan jika ada masalah dalam kode Anda.

## 6. Deployment ke Produksi

Proyek ini dikonfigurasi untuk di-deploy secara otomatis ke Azure Static Web Apps.

### a. Metode Otomatis (Direkomendasikan)

Deployment akan terpicu secara otomatis setiap kali ada `push` ke branch `main`. Proses ini diatur oleh file workflow GitHub Actions yang ada di `.github/workflows/azure-static-web-apps-victorious-desert-00341ad1e.yml`.

**Prasyarat untuk Deployment Otomatis:**

Anda harus mengkonfigurasi *secrets* berikut di repositori GitHub Anda pada bagian **Settings > Secrets and variables > Actions**:

-   `AZURE_STATIC_WEB_APPS_API_TOKEN_CHATBOT_FTEK`: Token untuk otentikasi dengan Azure Static Web Apps.
-   `NEXT_PUBLIC_SUPABASE_URL`: URL proyek Supabase Anda.
-   `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Kunci publik (anon) Supabase Anda.
-   `NEXT_PUBLIC_API_BASE_URL`: URL dasar untuk API backend Anda.

### b. Metode Manual

Jika Anda perlu men-deploy secara manual, Anda bisa membangun aplikasi sebagai situs statis dan mengunggah hasilnya ke penyedia hosting pilihan Anda.

1.  **Build Aplikasi untuk Produksi:**
    Karena konfigurasi `output: 'export'` di `next.config.ts`, perintah build akan menghasilkan versi statis dari aplikasi Anda di dalam direktori `out`.

    ```bash
    npm run build
    ```

2.  **Deploy Direktori `out`:**
    Unggah konten dari direktori `out` yang telah dibuat ke penyedia hosting statis seperti Vercel, Netlify, atau Azure Static Web Apps.
