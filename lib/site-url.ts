import { site } from "@/content/site-content";

/**
 * URL dasar situs — dipakai untuk metadataBase (Open Graph, canonical) dan nanti JSON-LD.
 * Hanya dibaca di server.
 *
 * Urutan prioritas:
 *  1. `SITE_URL` — override manual (mis. "https://ahmadfajrikahar.id").
 *  2. Deploy produksi Vercel → `VERCEL_PROJECT_PRODUCTION_URL`. Vercel mengisinya dengan
 *     domain kustom terpendek bila sudah dipasang, selain itu `*.vercel.app`. Jadi selama
 *     domain belum aktif URL-nya otomatis memakai subdomain Vercel, lalu berpindah sendiri
 *     ke ahmadfajrikahar.id tanpa ubah kode.
 *  3. Deploy preview Vercel → `VERCEL_URL` (URL unik deploy tersebut).
 *  4. Selain itu (lokal) → `site.url`, domain final di content/site-content.ts.
 *
 * Variabel VERCEL_* adalah System Environment Variables bawaan Vercel (aktif secara default).
 */
export function getSiteUrl(): string {
  const manual = process.env.SITE_URL?.trim();
  if (manual) return withProtocol(manual);

  if (process.env.VERCEL_ENV === "production" && process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return withProtocol(process.env.VERCEL_PROJECT_PRODUCTION_URL);
  }
  if (process.env.VERCEL_ENV === "preview" && process.env.VERCEL_URL) {
    return withProtocol(process.env.VERCEL_URL);
  }
  return site.url;
}

/** Variabel VERCEL_* tidak menyertakan protokol */
function withProtocol(host: string): string {
  const value = /^https?:\/\//.test(host) ? host : `https://${host}`;
  return value.replace(/\/+$/, "");
}
