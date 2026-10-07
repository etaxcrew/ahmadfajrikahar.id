import Image from "next/image";
import { contact, hero, site } from "@/content/site-content";
import WhatsAppCta from "@/components/WhatsAppCta";
import { ArrowDownIcon, SealMark } from "@/components/icons";
import { Guilloche, PaperRules, SealRing } from "@/components/HeroBackdrop";

/**
 * Hero — tagline + CTA utama WhatsApp.
 * Server component (tanpa JS klien). H1 di sini adalah SATU-SATUNYA H1 di halaman.
 *
 * Kolom kanan adalah SLOT GAMBAR siap-ganti:
 *  - rasio terkunci 4:5 sehingga layout tidak bergeser saat foto asli dipasang
 *  - selama `hero.image` masih null, yang tampil adalah panel motif seal/akta
 *  - lihat komentar TODO di `content/site-content.ts` (hero.image) untuk cara mengganti
 *
 * Gerak: latar garis akta + guilloche, animasi masuk bertahap, cincin teks seal yang
 * berputar lambat, dan kilau emas sekali lewat pada kartu. Semuanya CSS (lihat keyframes
 * `hero-*` di tailwind.config.ts) dan berhenti untuk pengguna prefers-reduced-motion.
 */
export default function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden">
      <PaperRules />
      {/* Cahaya emas lembut di belakang slot visual */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-[58%] -z-10 h-[40rem] w-[40rem] -translate-y-1/2 animate-hero-fade rounded-full bg-[radial-gradient(circle,rgba(212,175,106,0.18),transparent_62%)] lg:right-[-6rem] lg:top-1/2"
      />

      <div className="container-content grid items-center gap-12 py-14 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:py-24">
        {/* Kolom teks */}
        <div>
          <p className="eyebrow animate-hero-rise">{site.role}</p>

          <h1
            id="hero-title"
            className="mt-4 animate-hero-rise text-display-sm text-navy-950 [animation-delay:80ms] sm:text-display-md lg:text-display-lg"
          >
            {hero.title}
          </h1>

          {/* Garis emas tipis ala pemisah pada kop akta */}
          <div
            className="mt-6 h-px w-24 origin-left animate-hero-rule bg-gold-400 [animation-delay:350ms]"
            aria-hidden="true"
          />

          <p className="mt-6 max-w-prose animate-hero-rise text-base leading-relaxed text-navy-700 [animation-delay:200ms] sm:text-lg">
            {hero.subtitle}
          </p>

          <div className="mt-8 flex animate-hero-rise flex-col gap-3 [animation-delay:320ms] sm:flex-row sm:items-center">
            <WhatsAppCta
              label={hero.primaryCta.label}
              ariaLabel={hero.primaryCta.ariaLabel}
              size="lg"
              className="w-full sm:w-auto"
            />
            <a
              href={hero.secondaryCta.href}
              className="group inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-navy-300 bg-cream-50/70 px-6 py-3 text-base font-semibold text-navy-900 transition-colors hover:border-navy-400 hover:bg-navy-50 sm:w-auto"
            >
              {hero.secondaryCta.label}
              <ArrowDownIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />
            </a>
          </div>

          <p className="mt-6 flex animate-hero-rise items-center gap-2 text-sm text-navy-600 [animation-delay:440ms]">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500" aria-hidden="true" />
            {hero.locationNote}
          </p>
        </div>

        {/* Slot visual — rasio 4:5 */}
        <div className="relative mx-auto w-full max-w-sm lg:max-w-none">
          {/* Guilloche di belakang kartu — mengintip dari tepi, berputar sangat lambat */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 -z-10 aspect-square w-[150%] -translate-x-1/2 -translate-y-1/2 animate-hero-fade [animation-delay:300ms]"
          >
            <Guilloche className="h-full w-full animate-spin-slowest text-gold-500/35" />
          </div>

          <div className="relative aspect-[4/5] animate-hero-card overflow-hidden rounded-card bg-navy-950 shadow-card [animation-delay:150ms]">
            {hero.image ? (
              <Image
                src={hero.image.src}
                alt={hero.image.alt}
                fill
                priority
                sizes="(min-width: 1024px) 45vw, (min-width: 640px) 24rem, 100vw"
                className="object-cover"
              />
            ) : (
              /* Pengganti visual sementara: panel bergaya kop akta */
              <div className="flex h-full flex-col items-center justify-center px-6 py-8 text-center">
                {/* Ornamen sudut */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-4 rounded-[0.5rem] border border-gold-400/25"
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute left-4 top-4 h-10 w-10 rounded-tl-[0.5rem] border-l-2 border-t-2 border-gold-400/70"
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute bottom-4 right-4 h-10 w-10 rounded-br-[0.5rem] border-b-2 border-r-2 border-gold-400/70"
                />

                {/* Seal + cincin teks yang berputar perlahan */}
                <div className="relative grid h-32 w-32 shrink-0 place-items-center sm:h-44 sm:w-44 lg:h-48 lg:w-48">
                  <SealRing
                    text={hero.sealRing}
                    className="absolute inset-0 h-full w-full animate-spin-slower text-gold-300/70"
                  />
                  <SealMark className="h-20 w-20 text-gold-400 sm:h-28 sm:w-28 lg:h-32 lg:w-32" />
                </div>

                <p className="mt-5 font-serif text-xl text-cream-50 sm:mt-7 sm:text-2xl">
                  {site.notaryName}
                </p>
                <p className="mt-2 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-gold-300">
                  {site.role}
                </p>

                <div className="mt-5 h-px w-16 bg-gold-400/60 sm:mt-6" aria-hidden="true" />

                <p className="mt-5 text-sm leading-relaxed text-navy-200 sm:mt-6">
                  {contact.addressStreet}
                  <br />
                  {contact.addressRegion} {contact.addressPostalCode}
                </p>
              </div>
            )}

            {/* Kilau emas sekali lewat setelah kartu muncul */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-0 w-1/3 animate-hero-sheen bg-gradient-to-r from-transparent via-gold-200/15 to-transparent"
            />
          </div>
        </div>
      </div>

      {/* Pemisah section */}
      <div className="container-content">
        <div className="h-px bg-rule-gold opacity-40" aria-hidden="true" />
      </div>
    </section>
  );
}
