import nodemailer, { type Transporter } from "nodemailer";
import type { ContactPayload } from "@/lib/validation";

/**
 * Pengiriman email untuk form kontak — dua penyedia, dipilih lewat environment:
 *
 *  - "smtp"   : Nodemailer ke server SMTP (mailbox kantor, Gmail/Google Workspace + app
 *               password, Zoho, dsb.). Cocok di VPS maupun Vercel (port 465/587).
 *  - "resend" : REST API Resend (https://resend.com) lewat fetch — tanpa dependensi
 *               tambahan. Cocok di Vercel; butuh domain pengirim yang terverifikasi.
 *
 * Pemilihan: `EMAIL_PROVIDER=smtp|resend`. Bila kosong → "resend" jika
 * `RESEND_API_KEY` terisi, selain itu "smtp".
 *
 * BERKAS INI HANYA BOLEH DIPANGGIL DARI SERVER (API route). Jangan pernah diimpor
 * dari komponen client. Semua kredensial dari environment variable — tidak ada
 * nilai yang di-hardcode. Lihat `.env.example` untuk daftar lengkapnya.
 */

type Provider = "smtp" | "resend";

const REQUIRED_ENV: Record<Provider, readonly string[]> = {
  smtp: ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASSWORD", "CONTACT_TO_EMAIL"],
  // Resend menolak From di luar domain terverifikasi, jadi alamatnya wajib eksplisit.
  resend: ["RESEND_API_KEY", "CONTACT_TO_EMAIL", "CONTACT_FROM_EMAIL"],
};

/** Batas waktu kirim — fungsi serverless (Vercel) punya batas durasi eksekusi */
const SEND_TIMEOUT_MS = 10_000;

export class EmailConfigError extends Error {
  constructor(public readonly missing: string[]) {
    super(`Konfigurasi email belum lengkap: ${missing.join(", ")}`);
    this.name = "EmailConfigError";
  }
}

export function getProvider(): Provider {
  const explicit = process.env.EMAIL_PROVIDER?.trim().toLowerCase();
  if (explicit === "smtp" || explicit === "resend") return explicit;
  return process.env.RESEND_API_KEY?.trim() ? "resend" : "smtp";
}

/** Dipanggil lebih dulu agar penyebab gagal kirim terbaca jelas di log server */
export function assertEmailConfig(provider: Provider = getProvider()): void {
  const missing = REQUIRED_ENV[provider].filter((key) => !process.env[key]?.trim());
  if (missing.length > 0) throw new EmailConfigError(missing);
}

/* -------------------------------------------------------------------------- */
/*  Penyusunan pesan (sama untuk kedua penyedia)                              */
/* -------------------------------------------------------------------------- */

interface ContactMessage {
  fromAddress: string;
  fromName: string;
  to: string;
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
}

/** Buang karakter baris baru — mencegah header injection lewat subject/nama */
function toSingleLine(value: string): string {
  return value.replace(/[\r\n]+/g, " ").trim();
}

/** Escape agar isi kiriman tidak bisa menyuntikkan markup ke email HTML */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

function buildMessage(data: ContactPayload): ContactMessage {
  const rows: Array<[string, string]> = [
    ["Nama", data.nama],
    ["Kontak", data.kontak],
    ["Kebutuhan", data.kebutuhan],
    ["Pesan", data.pesan || "(tidak diisi)"],
  ];

  const html = `<!doctype html>
<html lang="id"><body style="font-family:Arial,Helvetica,sans-serif;color:#122338;line-height:1.6">
  <h2 style="font-size:16px;margin:0 0 16px">Pesan baru dari form kontak situs</h2>
  <table cellpadding="0" cellspacing="0" style="border-collapse:collapse">
    ${rows
      .map(
        ([label, value]) => `<tr>
      <td style="padding:6px 16px 6px 0;vertical-align:top;color:#345074;white-space:nowrap">${escapeHtml(
        label,
      )}</td>
      <td style="padding:6px 0;vertical-align:top">${escapeHtml(value).replace(
        /\n/g,
        "<br>",
      )}</td>
    </tr>`,
      )
      .join("\n    ")}
  </table>
  <p style="margin:20px 0 0;font-size:12px;color:#476690">
    Dikirim otomatis dari form kontak situs Kantor Notaris &amp; PPAT Ahmad Fajri Kahar
  </p>
</body></html>`;

  return {
    // Banyak server SMTP menolak From yang bukan milik akun pengirim → default SMTP_USER
    fromAddress: (process.env.CONTACT_FROM_EMAIL || process.env.SMTP_USER) as string,
    fromName: toSingleLine(process.env.CONTACT_FROM_NAME || "Website Notaris & PPAT"),
    to: process.env.CONTACT_TO_EMAIL as string,
    subject: toSingleLine(`Pesan baru dari situs — ${data.kebutuhan} (${data.nama})`),
    text: rows.map(([label, value]) => `${label}: ${value}`).join("\n\n"),
    html,
    // Balas-langsung hanya bila pengirim menuliskan email; kalau nomor WhatsApp,
    // Reply-To dibiarkan kosong agar tidak menghasilkan alamat palsu.
    replyTo: EMAIL_PATTERN.test(data.kontak) ? data.kontak : undefined,
  };
}

/* -------------------------------------------------------------------------- */
/*  Penyedia: SMTP (Nodemailer)                                               */
/* -------------------------------------------------------------------------- */

let cachedTransporter: Transporter | null = null;

function getTransporter(): Transporter {
  if (cachedTransporter) return cachedTransporter;

  const port = Number(process.env.SMTP_PORT);
  cachedTransporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    // Port 465 memakai TLS implisit; 587 memakai STARTTLS.
    // Bisa dipaksa lewat SMTP_SECURE=true|false bila server surat kantor berbeda.
    secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === "true" : port === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
    connectionTimeout: SEND_TIMEOUT_MS,
    greetingTimeout: SEND_TIMEOUT_MS,
    socketTimeout: SEND_TIMEOUT_MS,
  });
  return cachedTransporter;
}

async function sendViaSmtp(message: ContactMessage): Promise<void> {
  await getTransporter().sendMail({
    from: `"${message.fromName}" <${message.fromAddress}>`,
    to: message.to,
    subject: message.subject,
    text: message.text,
    html: message.html,
    ...(message.replyTo ? { replyTo: message.replyTo } : {}),
  });
}

/* -------------------------------------------------------------------------- */
/*  Penyedia: Resend (REST API)                                               */
/* -------------------------------------------------------------------------- */

async function sendViaResend(message: ContactMessage): Promise<void> {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: `${message.fromName} <${message.fromAddress}>`,
      to: [message.to],
      subject: message.subject,
      text: message.text,
      html: message.html,
      ...(message.replyTo ? { reply_to: message.replyTo } : {}),
    }),
    signal: AbortSignal.timeout(SEND_TIMEOUT_MS),
    cache: "no-store",
  });

  if (!response.ok) {
    // Isi balasan Resend hanya untuk log server — tidak pernah diteruskan ke pengunjung
    const detail = await response.text().catch(() => "");
    throw new Error(`Resend menolak kiriman (HTTP ${response.status}): ${detail.slice(0, 300)}`);
  }
}

/* -------------------------------------------------------------------------- */

/**
 * Kirim satu pesan dari form kontak ke email kantor.
 * Payload yang masuk WAJIB sudah lewat `validateContact()` di sisi server.
 */
export async function sendContactEmail(data: ContactPayload): Promise<void> {
  const provider = getProvider();
  assertEmailConfig(provider);
  const message = buildMessage(data);

  if (provider === "resend") await sendViaResend(message);
  else await sendViaSmtp(message);
}
