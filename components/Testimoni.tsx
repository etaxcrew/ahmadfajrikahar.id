import Image from "next/image";
import { testimoni, type Testimonial } from "@/content/site-content";
import { QuoteIcon } from "@/components/icons";
import { Guilloche } from "@/components/HeroBackdrop";
import SectionLabel from "@/components/SectionLabel";

/**
 * Section Testimoni. Server component, tanpa JS klien.
 *
 * Tata letak asimetris: entri pertama tampil sebagai kutipan utama (kartu navy besar),
 * entri berikutnya sebagai kartu terang di sampingnya — bukan grid 3 kartu identik.
 *
 * PENTING (kode etik + CLAUDE.md):
 *  - Testimoni asli hanya boleh tayang dengan izin publikasi nama/inisial (dan foto) klien.
 *  - Tidak ada klaim berlebihan, rating bintang, atau jumlah klien — sengaja.
 *  - Entri contoh ditandai `isPlaceholder: true` di content/site-content.ts. Penanda itu
 *    tidak ditampilkan di halaman, tetapi `next build` mencetak peringatan selama masih ada.
 *
 * Avatar: foto (bila `photo` diisi, dengan izin) atau monogram inisial. Tidak memakai
 * foto stok / wajah rekaan.
 *
 * Aksesibilitas: <figure> + <blockquote> + <figcaption> supaya kutipan dan atribusinya
 * terhubung, bukan hanya berdekatan secara visual.
 */

if (process.env.NODE_ENV === "production" && testimoni.items.some((item) => item.isPlaceholder)) {
  console.warn(
    "\n[Testimoni] PERINGATAN: masih ada testimoni placeholder di content/site-content.ts. " +
      "Ganti dengan testimoni asli (dengan izin publikasi) sebelum go-live.\n",
  );
}

/** "R. H." -> "RH", "Siti Rahma" -> "SR" */
function initials(name: string) {
  return name
    .split(/[\s.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function Avatar({ item, featured }: { item: Testimonial; featured: boolean }) {
  if (item.photo) {
    return (
      <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full ring-2 ring-gold-400/60">
        <Image src={item.photo.src} alt={item.photo.alt} fill sizes="48px" className="object-cover" />
      </span>
    );
  }
  return (
    <span
      aria-hidden="true"
      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-serif text-lg font-semibold ${
        featured
          ? "bg-gold-400 text-navy-950 ring-4 ring-gold-400/15"
          : "bg-navy-900 text-gold-300 ring-4 ring-navy-900/5"
      }`}
    >
      {initials(item.author)}
    </span>
  );
}

function Attribution({ item, featured }: { item: Testimonial; featured: boolean }) {
  return (
    <figcaption className="flex items-center gap-4">
      <Avatar item={item} featured={featured} />
      <span className="min-w-0">
        <span className={`block font-semibold ${featured ? "text-cream-50" : "text-navy-950"}`}>
          {item.author}
        </span>
        <span className={`block text-sm ${featured ? "text-navy-200" : "text-navy-600"}`}>
          {item.service}
          {item.location && `, ${item.location}`}
        </span>
      </span>
    </figcaption>
  );
}

function FeaturedCard({ item }: { item: Testimonial }) {
  return (
    <figure className="relative isolate flex h-full flex-col overflow-hidden rounded-card bg-navy-900 p-7 shadow-card sm:p-10">
      {/* Guilloche samar — menggemakan motif hero */}
      <Guilloche className="pointer-events-none absolute -right-28 -top-28 -z-10 h-80 w-80 text-gold-400/[0.12]" />

      <QuoteIcon className="h-10 w-10 text-gold-400" />
      <blockquote className="mt-6 flex-1">
        <p className="font-serif text-2xl leading-snug text-cream-50 sm:text-[1.75rem] sm:leading-snug">
          {item.quote}
        </p>
      </blockquote>
      <div className="mt-10 border-t border-navy-700 pt-6">
        <Attribution item={item} featured />
      </div>
    </figure>
  );
}

function Card({ item }: { item: Testimonial }) {
  return (
    <figure className="flex h-full flex-col rounded-card border border-navy-100 bg-cream-50 p-6 transition-[border-color,box-shadow] duration-300 hover:border-gold-300 hover:shadow-card sm:p-7">
      <QuoteIcon className="h-6 w-6 text-gold-500" />
      <blockquote className="mt-4 flex-1">
        <p className="font-serif text-lg leading-relaxed text-navy-900">{item.quote}</p>
      </blockquote>
      <div className="mt-6">
        <Attribution item={item} featured={false} />
      </div>
    </figure>
  );
}

export default function Testimoni() {
  const [featured, ...rest] = testimoni.items;

  return (
    <section id="testimoni" aria-labelledby="testimoni-title" className="bg-cream-100">
      <div className="container-content py-16 sm:py-20 lg:py-24">
        {/* Kepala section: judul kiri, pengantar kanan (desktop) */}
        <div className="grid gap-5 lg:grid-cols-12 lg:items-end lg:gap-12">
          <div className="lg:col-span-7">
            <SectionLabel sectionId="testimoni" />
            <h2
              id="testimoni-title"
              className="mt-3 text-display-sm text-navy-950 sm:text-display-md"
            >
              {testimoni.title}
            </h2>
          </div>
          <p className="max-w-prose text-base leading-relaxed text-navy-700 sm:text-lg lg:col-span-5">
            {testimoni.intro}
          </p>
        </div>

        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:mt-12 lg:grid-cols-12 lg:gap-6">
          {featured && (
            <li className="reveal sm:col-span-2 lg:col-span-7 lg:row-span-2">
              <FeaturedCard item={featured} />
            </li>
          )}
          {rest.map((item, index) => (
            <li
              key={`${item.author}-${index}`}
              className={`reveal ${index < 2 ? "lg:col-span-5" : "lg:col-span-4"}`}
            >
              <Card item={item} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
