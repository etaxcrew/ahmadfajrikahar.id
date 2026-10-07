import { faq } from "@/content/site-content";
import { ChevronDownIcon } from "@/components/icons";
import SectionLabel from "@/components/SectionLabel";
import WhatsAppCta from "@/components/WhatsAppCta";

/**
 * Section FAQ — accordion. Server component, TANPA JS klien.
 *
 * Sengaja memakai <details>/<summary> native, bukan accordion berbasis state:
 *  - keyboard (Tab + Enter/Space) dan screen reader sudah didukung browser,
 *    termasuk status buka/tutup — tidak perlu aria-expanded manual
 *  - tetap berfungsi meski JS gagal dimuat
 *  - nol tambahan bundle (target Lighthouse Performance >= 85)
 * Konsekuensinya beberapa panel bisa terbuka bersamaan; untuk daftar tanya-jawab
 * itu justru memudahkan pembandingan jawaban.
 *
 * Tata letak (lg): judul + kotak bantuan menempel di kiri, daftar pertanyaan di kanan.
 * Jawaban muncul dengan fade singkat (lihat `.faq-answer` di app/globals.css).
 *
 * Kode etik: TIDAK ADA kisaran/nominal biaya di sini. Pertanyaan soal biaya
 * dijawab dengan pengarahan ke konsultasi (lihat faq.items[0]).
 */

function HelpBox({ className = "" }: { className?: string }) {
  return (
    <div className={`rounded-card border border-navy-100 bg-cream-100/70 p-6 ${className}`}>
      <p className="font-serif text-xl text-navy-950">{faq.help.title}</p>
      <p className="mt-2 text-[0.95rem] leading-relaxed text-navy-700">{faq.help.text}</p>
      <WhatsAppCta
        label={faq.help.ctaLabel}
        ariaLabel={faq.help.ctaAriaLabel}
        className="mt-5 w-full sm:w-auto"
      />
    </div>
  );
}

export default function FAQ() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="bg-cream-50">
      <div className="container-content grid gap-10 py-16 sm:py-20 lg:grid-cols-12 lg:gap-12 lg:py-24">
        <div className="lg:sticky lg:top-28 lg:col-span-4 lg:self-start">
          <SectionLabel sectionId="faq" />
          <h2
            id="faq-title"
            className="mt-3 text-display-sm text-navy-950 sm:text-display-md"
          >
            {faq.title}
          </h2>
          <HelpBox className="mt-8 hidden lg:block" />
        </div>

        <div className="lg:col-span-8">
          <div className="divide-y divide-navy-100 border-y border-navy-100">
            {faq.items.map((item) => (
              <details key={item.question} className="group">
                <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-5 py-5 [&::-webkit-details-marker]:hidden">
                  <h3 className="font-serif text-lg leading-snug text-navy-950 transition-colors duration-200 group-hover:text-gold-800 sm:text-xl">
                    {item.question}
                  </h3>
                  <span
                    aria-hidden="true"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-navy-200 text-navy-700 transition-colors duration-200 group-hover:border-gold-500 group-hover:text-gold-700 group-open:border-navy-900 group-open:bg-navy-900 group-open:text-cream-50"
                  >
                    <ChevronDownIcon className="h-5 w-5 transition-transform duration-200 group-open:rotate-180" />
                  </span>
                </summary>
                <div className="faq-answer pb-6 pr-2 sm:pr-14">
                  <p className="max-w-prose text-[0.95rem] leading-relaxed text-navy-700 sm:text-base">
                    {item.answer}
                  </p>
                </div>
              </details>
            ))}
          </div>

          {/* Di layar kecil kotak bantuan tampil setelah daftar pertanyaan */}
          <HelpBox className="mt-8 lg:hidden" />
        </div>
      </div>
    </section>
  );
}
