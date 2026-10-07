import { whatsapp } from "@/content/site-content";
import { WhatsAppIcon } from "@/components/icons";

/**
 * Tombol CTA WhatsApp — satu komponen untuk seluruh halaman (Header, Hero, Kontak, Footer)
 * agar pesan pra-isi dan perilaku tautan konsisten. URL dirakit di
 * `content/site-content.ts` (whatsapp.url), bukan di sini.
 *
 * Aksesibilitas:
 *  - Ikon dekoratif; nama aksesibel diambil dari label teks, atau dari `ariaLabel`
 *    bila label visualnya terlalu ringkas ("Konsultasi Sekarang" -> "... melalui WhatsApp").
 *  - Target sentuh minimal 44px tinggi pada semua ukuran (WCAG 2.5.8).
 */

type Variant = "primary" | "onDark" | "outline";
type Size = "md" | "lg";

const variantClass: Record<Variant, string> = {
  // Navy pekat di atas latar terang — kontras tertinggi, nada formal.
  primary:
    "bg-navy-900 text-cream-50 hover:bg-navy-800 active:bg-navy-950 shadow-card hover:shadow-card-hover",
  // Dipakai di atas section navy: emas champagne dengan teks navy.
  onDark:
    "bg-gold-400 text-navy-950 hover:bg-gold-300 active:bg-gold-500 shadow-card",
  outline:
    "border border-navy-300 bg-transparent text-navy-900 hover:border-navy-400 hover:bg-navy-50",
};

const sizeClass: Record<Size, string> = {
  md: "min-h-11 px-5 py-2.5 text-sm",
  lg: "min-h-12 px-6 py-3 text-base",
};

export default function WhatsAppCta({
  label,
  ariaLabel,
  variant = "primary",
  size = "md",
  className = "",
}: {
  label: string;
  ariaLabel?: string;
  variant?: Variant;
  size?: Size;
  className?: string;
}) {
  return (
    <a
      href={whatsapp.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className={`inline-flex items-center justify-center gap-2.5 rounded-full font-sans font-semibold tracking-tight transition-colors duration-150 ${variantClass[variant]} ${sizeClass[size]} ${className}`}
    >
      <WhatsAppIcon className="h-[1.15em] w-[1.15em] shrink-0" />
      <span>{label}</span>
    </a>
  );
}
