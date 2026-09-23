/**
 * Halaman utama (single-page, anchor navigation).
 * Section disusun bertahap — lihat CLAUDE.md "Struktur Halaman".
 * Urutan final: Header → Hero → Layanan → Alur Layanan → Info Kantor
 *               → Testimoni → FAQ → Kontak → Footer
 */
export default function Home() {
  return (
    <main id="konten-utama" className="min-h-screen">
      <div className="container-content py-24">
        <p className="eyebrow">Tahap 1 — Setup</p>
        <h1 className="mt-3 font-serif text-display-md text-navy-950">
          Kerangka proyek siap
        </h1>
        <p className="mt-4 max-w-prose text-navy-700">
          Next.js 14 (App Router), Tailwind CSS, design token navy/off-white/champagne gold,
          dan font Fraunces + Public Sans sudah terpasang. Section landing page dibangun
          pada tahap berikutnya.
        </p>
      </div>
    </main>
  );
}
