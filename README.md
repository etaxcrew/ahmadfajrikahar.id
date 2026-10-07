# Situs Kantor Notaris & PPAT Ahmad Fajri Kahar, S.H., M.Kn.

Landing page satu halaman — Next.js 14 (App Router) + Tailwind CSS, di-deploy ke Vercel.
Domain produksi: **ahmadfajrikahar.id** (sementara memakai subdomain `*.vercel.app`).

- Semua teks situs ada di `content/site-content.ts` — ubah konten di sana, bukan di komponen.
- Aturan proyek dan batasan kode etik notaris: `CLAUDE.md`.
- Data yang belum final: `PLACEHOLDER_CHECKLIST` di `content/site-content.ts`.

## Menjalankan di komputer

```bash
npm install
cp .env.example .env.local   # isi kredensial email (lihat di bawah)
npm run dev                  # http://localhost:3000
```

Sebelum push, pastikan build produksi lolos (matikan `npm run dev` dulu — keduanya
memakai folder `.next` yang sama):

```bash
npm run build
```

## Email form kontak (Gmail)

Form kontak mengirim email lewat SMTP Gmail. Gmail tidak menerima password akun biasa;
yang dipakai adalah **App Password**:

1. Masuk ke akun Google yang akan menjadi pengirim → **Kelola Akun Google → Keamanan**.
2. Aktifkan **Verifikasi 2 Langkah** (wajib sebelum App Password bisa dibuat).
3. Buka <https://myaccount.google.com/apppasswords>, buat App Password baru
   (mis. nama "Website Notaris"), salin 16 karakter yang muncul (spasi boleh dibuang).
4. Isi variabel berikut — di `.env.local` untuk uji lokal, atau di Vercel (langkah 4 di bawah):

| Variabel | Nilai |
|---|---|
| `EMAIL_PROVIDER` | `smtp` |
| `SMTP_HOST` | `smtp.gmail.com` |
| `SMTP_PORT` | `465` |
| `SMTP_USER` | alamat Gmail pengirim |
| `SMTP_PASSWORD` | App Password 16 karakter |
| `CONTACT_TO_EMAIL` | `info@notarisafk.id` (tujuan pesan) |

`CONTACT_FROM_EMAIL` biarkan kosong — Gmail selalu mengirim atas nama `SMTP_USER`.
Jika pengunjung mengisi email, tombol "Balas" di kotak masuk langsung mengarah ke pengunjung.

**Jangan pernah** menaruh App Password di kode atau commit `.env.local`. Bila bocor,
cabut di halaman App Password lalu buat yang baru.

Tanpa kredensial, situs tetap berjalan; form akan menampilkan pesan gagal dan
mengarahkan pengunjung ke WhatsApp.

## Deploy ke Vercel

1. Commit dan push ke GitHub (`etaxcrew/ahmadfajrikahar.id`).
2. Di <https://vercel.com/new>, **Import** repo tersebut. Framework terdeteksi otomatis
   sebagai Next.js; pengaturan build tidak perlu diubah.
3. Nama proyek menentukan subdomain sementara, mis. `ahmadfajrikahar` →
   `https://ahmadfajrikahar.vercel.app` (bila nama sudah dipakai orang lain, Vercel
   menambahkan akhiran).
4. **Settings → Environment Variables**: isi variabel email di atas untuk lingkungan
   *Production* (dan *Preview* bila ingin form aktif di deploy preview), lalu
   **Deployments → Redeploy** agar terbaca.
5. Uji: kirim form kontak dari situs, pastikan email masuk ke `CONTACT_TO_EMAIL`.
   Log kegagalan kirim terlihat di **Logs** proyek Vercel.

Catatan:
- Fungsi API berjalan di region Singapura (`sin1`, diatur di `vercel.json`).
- Ketentuan Vercel: paket **Hobby** hanya untuk penggunaan non-komersial. Situs kantor
  termasuk komersial, jadi gunakan paket **Pro**.
- URL untuk metadata/Open Graph diatur otomatis oleh `lib/site-url.ts` — tidak perlu
  diubah saat domain dipasang.

## Memasang domain ahmadfajrikahar.id (setelah domain aktif)

1. Vercel → proyek → **Settings → Domains → Add**: `ahmadfajrikahar.id` dan
   `www.ahmadfajrikahar.id` (arahkan `www` ke domain utama).
2. Ikuti instruksi DNS yang ditampilkan Vercel di panel pengelola domain (registrar):
   biasanya record **A** untuk domain utama dan **CNAME** untuk `www`, dengan nilai
   persis seperti yang tertera di Vercel.
3. Tunggu status **Valid Configuration**; sertifikat HTTPS dibuat otomatis.
4. Atur subdomain `*.vercel.app` agar mengalihkan ke `ahmadfajrikahar.id` (menu edit pada
   domain tersebut di halaman Domains), supaya mesin pencari hanya mengindeks satu alamat.
5. Redeploy sekali agar metadata memakai domain baru.
