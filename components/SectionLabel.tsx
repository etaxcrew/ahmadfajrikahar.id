import { nav, sectionLabel } from "@/content/site-content";

/**
 * Label di atas judul section, bergaya penomoran akta: "Pasal 1 — Layanan".
 *
 * Nomor dan nama diambil dari urutan `nav` (content/site-content.ts) berdasarkan id
 * section, sehingga selalu sama dengan "Daftar isi" di menu mobile. Struktur ini
 * membawa informasi (posisi section dalam halaman), bukan sekadar hiasan.
 *
 * `tone="dark"` dipakai di atas latar navy (Alur Layanan).
 */
export default function SectionLabel({
  sectionId,
  tone = "light",
  className = "",
}: {
  sectionId: string;
  tone?: "light" | "dark";
  className?: string;
}) {
  const index = nav.findIndex((item) => item.href === `#${sectionId}`);
  if (index < 0) return null;
  const isDark = tone === "dark";

  return (
    <p className={`flex items-center gap-3 ${className}`}>
      <span
        className={`font-serif text-base font-medium tabular-nums ${
          isDark ? "text-gold-300" : "text-gold-700"
        }`}
      >
        {sectionLabel.prefix} {index + 1}
      </span>
      <span
        aria-hidden="true"
        className={`h-px w-8 ${isDark ? "bg-gold-400/60" : "bg-gold-500/70"}`}
      />
      <span className={`text-sm font-semibold ${isDark ? "text-navy-200" : "text-navy-700"}`}>
        {nav[index].label}
      </span>
    </p>
  );
}
