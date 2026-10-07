import { layanan, type ServiceGroup } from "@/content/site-content";
import { ArrowDownIcon, DocumentIcon, LandIcon } from "@/components/icons";
import LayananSlider from "@/components/LayananSlider";
import SectionLabel from "@/components/SectionLabel";

/**
 * Section Layanan — Notaris vs PPAT dibedakan jelas (syarat CLAUDE.md).
 * Server component, tanpa JS klien.
 *
 * Pembeda antar-kartu dibuat berlapis dan TIDAK mengandalkan warna saja
 * (WCAG 1.4.1 — "use of color"):
 *   1. judul kartu (Notaris / PPAT)
 *   2. badge ranah kewenangan (kenotariatan / pertanahan)
 *   3. ikon berbeda (dokumen / bidang tanah)
 *   4. kalimat `scope` yang menegaskan batas kewenangan
 *   5. baru setelah itu: aksen warna (navy vs emas)
 *
 * Kode etik: tidak ada nominal/kisaran biaya di sini. Penutup section mengarahkan
 * ke kontak, bukan ke daftar tarif.
 */

type Accent = {
  /** Bar tipis di sisi atas kartu */
  rule: string;
  /** Kotak ikon */
  chip: string;
  /** Teks badge */
  badge: string;
  /** Penanda butir daftar */
  marker: string;
};

const accents: Record<string, Accent> = {
  notaris: {
    rule: "bg-navy-800",
    chip: "bg-navy-50 text-navy-700 ring-1 ring-inset ring-navy-100",
    badge: "text-navy-600",
    marker: "bg-navy-400",
  },
  ppat: {
    rule: "bg-gold-500",
    chip: "bg-gold-50 text-gold-700 ring-1 ring-inset ring-gold-200",
    badge: "text-gold-700",
    marker: "bg-gold-500",
  },
};

const icons: Record<string, (props: { className?: string }) => JSX.Element> = {
  notaris: DocumentIcon,
  ppat: LandIcon,
};

function ServiceCard({ group }: { group: ServiceGroup }) {
  const accent = accents[group.id] ?? accents.notaris;
  const Icon = icons[group.id] ?? DocumentIcon;

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-card border border-navy-100 bg-cream-50 shadow-card">
      <div className={`h-1 w-full ${accent.rule}`} aria-hidden="true" />

      <div className="flex flex-1 flex-col p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <span
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${accent.chip}`}
          >
            <Icon className="h-6 w-6" />
          </span>
          <div className="min-w-0">
            <p
              className={`text-[0.68rem] font-semibold uppercase tracking-[0.16em] ${accent.badge}`}
            >
              {group.badge}
            </p>
            <h3 className="mt-1 font-serif text-2xl text-navy-950 sm:text-[1.75rem]">
              {group.title}
            </h3>
          </div>
        </div>

        <p className="mt-5 text-[0.95rem] leading-relaxed text-navy-700">
          {group.scope}
        </p>

        <div className="mt-6 h-px bg-navy-100" aria-hidden="true" />

        <ul className="mt-6 flex flex-col gap-3.5">
          {group.items.map((item) => (
            <li key={item} className="flex items-start gap-3">
              {/* Penanda belah ketupat — motif ornamen akta */}
              <span
                aria-hidden="true"
                className={`mt-[0.45rem] h-1.5 w-1.5 shrink-0 rotate-45 ${accent.marker}`}
              />
              <span className="text-[0.95rem] leading-relaxed text-navy-800">
                {item}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

export default function Layanan() {
  return (
    <section id="layanan" aria-labelledby="layanan-title" className="bg-cream-100">
      <div className="container-content py-16 sm:py-20 lg:py-24">
        <div className="max-w-prose">
          <SectionLabel sectionId="layanan" />
          <h2
            id="layanan-title"
            className="mt-3 text-display-sm text-navy-950 sm:text-display-md"
          >
            {layanan.title}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-navy-700 sm:text-lg">
            {layanan.intro}
          </p>
        </div>

        {/*
          Di mobile kartu tampil sebagai slider yang berpindah otomatis;
          di >= md komponen yang sama merender grid dua kolom tanpa autoplay.
        */}
        <LayananSlider
          slides={layanan.groups.map((group) => ({
            id: group.id,
            node: <ServiceCard group={group} />,
          }))}
        />

        {/* Penutup section: arahkan ke konsultasi (kode etik — bukan ke daftar tarif) */}
        <div className="mt-10 flex flex-col gap-3 border-t border-navy-200/70 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-prose text-[0.95rem] leading-relaxed text-navy-700">
            {layanan.footnote}
          </p>
          <a
            href={layanan.footnoteCta.href}
            className="inline-flex min-h-11 shrink-0 items-center gap-2 self-start text-[0.95rem] font-semibold text-navy-900 underline decoration-gold-500 decoration-2 underline-offset-4 transition-colors hover:text-gold-700 sm:self-auto"
          >
            {layanan.footnoteCta.label}
            <ArrowDownIcon className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
