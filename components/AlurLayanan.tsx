import { alurLayanan } from "@/content/site-content";
import SectionLabel from "@/components/SectionLabel";

/**
 * Section Alur Layanan — 5 tahap dari konsultasi sampai penyerahan dokumen.
 * Server component, tanpa JS klien.
 *
 * Latar navy pekat dipakai sebagai jeda ritme di antara section terang, sekaligus
 * memberi kesan "halaman akta" dengan penomoran emas (motif Pasal).
 *
 * Aksesibilitas:
 *  - memakai <ol>/<li> supaya urutan tahapan terbaca sebagai urutan oleh screen reader,
 *    bukan hanya tersirat dari angka visual
 *  - garis penghubung antar-tahap murni dekoratif (aria-hidden)
 *  - kontras: teks cream-50/navy-200 di atas navy-950 jauh di atas ambang WCAG AA
 */
export default function AlurLayanan() {
  return (
    <section
      id="alur-layanan"
      aria-labelledby="alur-title"
      className="bg-navy-950 text-cream-50"
    >
      <div className="container-content grid gap-12 py-16 sm:py-20 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16 lg:py-24">
        {/* Kolom judul — menempel saat digulir di layar besar */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionLabel sectionId="alur-layanan" tone="dark" />
          <h2
            id="alur-title"
            className="mt-3 text-display-sm text-cream-50 sm:text-display-md"
          >
            {alurLayanan.title}
          </h2>
          <div className="mt-6 h-px w-24 bg-gold-400" aria-hidden="true" />
          <p className="mt-6 max-w-prose text-base leading-relaxed text-navy-200">
            {alurLayanan.intro}
          </p>
        </div>

        {/* Kolom tahapan */}
        <ol className="relative flex flex-col">
          {alurLayanan.steps.map((item, index) => {
            const isLast = index === alurLayanan.steps.length - 1;
            return (
              <li
                key={item.step}
                className={`reveal relative pl-16 sm:pl-20 ${isLast ? "pb-0" : "pb-9 sm:pb-10"}`}
              >
                {/* Garis penghubung antar-tahap */}
                {!isLast && (
                  <span
                    aria-hidden="true"
                    className="absolute bottom-0 left-[1.4375rem] top-12 w-px bg-navy-700 sm:left-[1.6875rem] sm:top-14"
                  />
                )}

                {/* Nomor tahap dalam medali bergaya cap akta */}
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-full border border-gold-400/45 bg-navy-900 font-serif text-lg font-semibold text-gold-300 sm:h-14 sm:w-14 sm:text-xl"
                >
                  {item.step}
                </span>

                <h3 className="pt-2 font-serif text-xl text-cream-50 sm:pt-3 sm:text-2xl">
                  {item.title}
                </h3>
                <p className="mt-2.5 max-w-prose text-[0.95rem] leading-relaxed text-navy-200">
                  {item.description}
                </p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
