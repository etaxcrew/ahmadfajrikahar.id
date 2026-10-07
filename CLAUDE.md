# CLAUDE.md — Notaris & PPAT Ahmad Fajri Kahar Landing Page

## Project Overview
Landing page satu halaman untuk Kantor Notaris & PPAT Ahmad Fajri Kahar, S.H., M.Kn., berlokasi di Limboto, Kabupaten Gorontalo. Tujuan utama: leads terukur (klik WA/form), kredibilitas digital, visibilitas pencarian lokal ("notaris Gorontalo", "PPAT Limboto"), pengalaman mobile-first, dan mudah dipelihara tanpa redeploy penuh. Referensi lengkap: `prd-notaris-afk-landing-page.md` (11 Sept 2026).

## Tech Stack & Keputusan Arsitektur
- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS
- **Deployment**: Vercel (keputusan pemilik, 8 Okt 2026 — menggantikan rencana VPS GWH), dibangun otomatis dari repo GitHub `etaxcrew/ahmadfajrikahar.id`. Region fungsi `sin1` (Singapura) via `vercel.json`. Sebelum domain aktif, situs tayang di subdomain `*.vercel.app`; URL dasar metadata diatur otomatis oleh `lib/site-url.ts`. Situs kantor = penggunaan komersial → paket Hobby tidak sesuai ketentuan Vercel; gunakan Pro. Langkah deploy ada di `README.md`.
- **Domain**: `ahmadfajrikahar.id`
- **Contact form**: API route (`app/api/contact/route.ts`) → kirim email langsung via Nodemailer (SMTP) atau Resend ke email kantor, dipilih lewat env `EMAIL_PROVIDER`. Bukan Formspree/Google Sheet. Rencana awal: SMTP Gmail + App Password (kredensial belum dibuat per 8 Okt 2026). Semua kredensial dari env var — daftar di `.env.example`.
- **Konten**: terpusat di `content/site-content.ts` (teks, testimoni, FAQ, kontak) — bukan hardcode di komponen, bukan headless CMS. Lihat `content-notaris-afk.md` untuk draft copy lengkap.

## Design System
- Palet: navy, off-white, champagne gold — referensi artifact lama bertema "Pasal 1–4" ala akta notaris
- Tipografi: Fraunces (heading/serif) + Public Sans (body/sans)
- Tone: formal, profesional, membangun kepercayaan — hindari gaya marketing agresif (relevan dengan batasan kode etik notaris di bawah)

## Struktur Halaman (single-page, anchor navigation)
1. Header + navigasi anchor
2. Hero — tagline + CTA utama WhatsApp
3. Layanan — Notaris vs PPAT, dibedakan jelas
4. Alur Layanan — proses konsultasi → dokumen → draft akta → tanda tangan → pendaftaran
5. Info Kantor — alamat, jam operasional, peta (Google Maps embed/link)
6. Testimoni — 3 slot (placeholder, tandai jelas untuk diganti pemilik kantor)
7. FAQ — accordion, **tanpa kisaran biaya**
8. Kontak — CTA WhatsApp + form kontak
9. Footer

## Struktur Folder (usulan)
```
app/
  layout.tsx
  page.tsx
  api/contact/route.ts
components/
  Header.tsx, Hero.tsx, Layanan.tsx, AlurLayanan.tsx,
  InfoKantor.tsx, Testimoni.tsx, FAQ.tsx, Kontak.tsx, Footer.tsx
content/
  site-content.ts       # semua teks, kontak, testimoni, FAQ (lihat content-notaris-afk.md)
lib/
  email.ts              # konfigurasi Nodemailer/Resend
public/
  images/
```

## Requirement Wajib (P0 — dari PRD, jangan skip)
- Responsif penuh 360px–1920px, tidak ada horizontal scroll di semua breakpoint
- Tombol CTA WhatsApp dengan pesan pra-isi (format `wa.me/62821959XXXX?text=...`)
- Form kontak: validasi input → kirim email → tampilkan konfirmasi sukses/error yang jelas
- SEO: title tag, meta description, H1 tunggal, JSON-LD schema `LegalService`/`LocalBusiness`, Open Graph tags
- Lighthouse mobile: Performance ≥ 85, Accessibility ≥ 90
- Kontras warna WCAG AA, navigasi keyboard berfungsi, alt text bermakna di semua ikon/gambar
- HTTPS aktif di domain produksi sebelum dianggap selesai

## Batasan Konten — Kode Etik Notaris (WAJIB DIPATUHI)
- **Tidak boleh** mencantumkan kisaran/nominal biaya di mana pun di halaman (FAQ maupun section lain) — selalu arahkan ke "hubungi kami untuk info lebih lanjut"
- Testimoni ditampilkan tanpa klaim berlebihan; gunakan nama/inisial hanya dengan izin publikasi dari klien
- Bahasa harus tetap formal-informatif, hindari gaya "iklan" yang agresif atau superlatif berlebihan

## Placeholder Aktif — Wajib Ditandai Jelas di Kode (perlu diganti sebelum go-live)
Penanda placeholder cukup di kode (komentar `TODO`, flag `isPlaceholder`, `PLACEHOLDER_CHECKLIST` di `content/site-content.ts`) — **tidak** ditampilkan sebagai label/badge di halaman (keputusan pemilik, 7 Okt 2026). `next build` mencetak peringatan selama testimoni placeholder masih ada.
- 3 testimoni: teks generik placeholder, tandai `[TESTIMONI PLACEHOLDER — ganti sebelum publish]`
- Foto kantor/tim: belum ada. Gunakan elemen desain (seal, tipografi akta) sebagai pengganti visual, **tapi** komponen harus dibuat siap-ganti (image slot dengan ukuran/aspect ratio jelas) agar mudah diganti ke foto asli nanti tanpa refactor besar

## Data Final (sudah dikonfirmasi, gunakan langsung — jangan diubah)
- Alamat: Kayubulan, Kec. Limboto, Kabupaten Gorontalo, Gorontalo 96214
- Telepon/WA: 0821-9593-3733
- Jam operasional: Senin–Jumat, 08.00–17.00 WITA; Sabtu, 09.00–15.00 WITA
- Email kantor: info@notarisafk.id
- Instagram: @notaris.afk
- Google Maps: listing resmi kantor https://maps.app.goo.gl/9rPwG7F5GifB4fRi7 (pin 0.6249177, 122.9803728)
- Domain: ahmadfajrikahar.id

## Alur Kerja
Ikuti pola "report-first, confirm-before-execute": bangun per section, laporkan progres di tiap stop point, jangan lanjut ke section berikutnya tanpa konfirmasi bila ada perubahan asumsi konten atau struktur dari yang tertulis di sini.
