import { NextResponse } from "next/server";
import { EmailConfigError, sendContactEmail } from "@/lib/email";
import { validateContact, type FieldErrors } from "@/lib/validation";

/**
 * POST /api/contact — terima kiriman form kontak, kirim ke email kantor.
 *
 * Jalan di runtime Node (bukan Edge) karena Nodemailer butuh modul net/tls.
 * `force-dynamic` supaya route ini tidak pernah ikut di-prerender saat build.
 *
 * Lapis pertahanan, dari luar ke dalam:
 *  1. batas ukuran body — payload raksasa ditolak sebelum di-parse
 *  2. honeypot — field tersembunyi yang hanya diisi bot
 *  3. jeda minimum — kiriman < 2 detik setelah form dibuka hampir pasti bot
 *  4. rate limit per IP — 5 kiriman / 10 menit
 *  5. validasi ulang di server dengan aturan yang sama seperti di browser
 *     (lib/validation.ts) — validasi browser bisa dilewati, jadi tidak dipercaya
 *
 * Yang TIDAK pernah dikembalikan ke client: detail kegagalan SMTP, nama variabel
 * environment, atau pesan error mentah. Semua itu hanya masuk log server.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 8 * 1024;
const MIN_FILL_MS = 2_000;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;

/** Batas durasi fungsi di Vercel (detik); diabaikan saat berjalan di server Node biasa */
export const maxDuration = 20;

/**
 * Rate limit sederhana di memori proses.
 * Di Vercel tiap instance serverless punya Map sendiri dan bisa di-reset kapan saja,
 * jadi batas ini bersifat "upaya terbaik" — honeypot dan jeda minimum tetap menjadi
 * penyaring utama bot. Bila spam jadi masalah, ganti dengan penyimpanan bersama
 * (mis. Upstash Redis) tanpa mengubah pemanggil.
 */
const submissions = new Map<string, number[]>();

/**
 * IP pengunjung dari header yang DIISI PROXY, bukan yang bisa dikarang pengirim:
 *  - Vercel & Nginx (`proxy_set_header X-Real-IP $remote_addr`) mengisi X-Real-IP.
 *  - Cadangan: entri TERAKHIR X-Forwarded-For (ditambahkan proxy terdekat).
 *    Entri pertama sengaja tidak dipakai — nilainya bisa dipalsukan pengirim
 *    untuk mengelabui rate limit.
 */
function getClientIp(request: Request): string {
  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const hops = forwarded.split(",").map((hop) => hop.trim()).filter(Boolean);
    if (hops.length > 0) return hops[hops.length - 1];
  }
  return "unknown";
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (submissions.get(ip) ?? []).filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS,
  );

  // Bersihkan entri kedaluwarsa agar Map tidak tumbuh tanpa batas
  if (submissions.size > 500) {
    submissions.forEach((timestamps, key) => {
      const alive = timestamps.filter(
        (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS,
      );
      if (alive.length === 0) submissions.delete(key);
      else submissions.set(key, alive);
    });
  }

  if (recent.length >= RATE_LIMIT_MAX) {
    submissions.set(ip, recent);
    return true;
  }

  submissions.set(ip, [...recent, now]);
  return false;
}

type ErrorCode = "validation" | "rate_limit" | "server";

function fail(code: ErrorCode, status: number, fieldErrors?: FieldErrors) {
  return NextResponse.json({ ok: false, code, fieldErrors }, { status });
}

export async function POST(request: Request) {
  // 1. Batas ukuran body
  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) {
    return fail("validation", 413);
  }

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return fail("validation", 400);
  }

  // 2. Honeypot — balas "berhasil" agar bot tidak belajar bahwa ia terdeteksi
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  // 3. Jeda minimum sejak form dirender
  const elapsed = Number(body.elapsedMs);
  if (Number.isFinite(elapsed) && elapsed >= 0 && elapsed < MIN_FILL_MS) {
    return NextResponse.json({ ok: true });
  }

  // 4. Rate limit
  if (isRateLimited(getClientIp(request))) {
    return fail("rate_limit", 429);
  }

  // 5. Validasi ulang di server
  const { data, errors, isValid } = validateContact(body);
  if (!isValid) {
    return fail("validation", 400, errors);
  }

  try {
    await sendContactEmail(data);
  } catch (error) {
    if (error instanceof EmailConfigError) {
      // Kesalahan operasional, bukan kesalahan pengunjung — harus mencolok di log.
      console.error(
        "[contact] Konfigurasi email belum lengkap. Variabel yang kosong:",
        error.missing.join(", "),
      );
    } else {
      console.error("[contact] Gagal mengirim email:", error);
    }
    return fail("server", 502);
  }

  return NextResponse.json({ ok: true });
}
