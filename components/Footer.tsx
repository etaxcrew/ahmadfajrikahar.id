import { contact, footer, infoKantor, kontak, maps, nav, site } from "@/content/site-content";
import {
  ArrowDownIcon,
  ArrowUpRightIcon,
  ClockIcon,
  InstagramIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  SealMark,
} from "@/components/icons";
import { Guilloche } from "@/components/HeroBackdrop";
import WhatsAppCta from "@/components/WhatsAppCta";

/**
 * Footer — identitas kantor, navigasi, kontak, dan keterangan hukum.
 * Server component, tanpa JS klien. Semua teks dari `content/site-content.ts`.
 *
 * Latar navy menjadi penutup yang menggemakan Alur Layanan; pola guilloche samar di
 * sudut menggemakan hero, sehingga halaman dibuka dan ditutup dengan motif yang sama.
 *
 * Kontras: teks cream-50/navy-200 di atas navy-950 jauh di atas WCAG AA; teks terkecil
 * (navy-400, disclaimer) tetap >= 4.5:1.
 */

const columnTitle = "font-serif text-lg text-cream-50";
const linkClass =
  "inline-flex min-h-10 items-center gap-2.5 text-[0.95rem] text-navy-200 transition-colors duration-200 hover:text-gold-300";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative isolate overflow-hidden bg-navy-950">
      <Guilloche className="pointer-events-none absolute -bottom-56 -right-48 -z-10 h-[38rem] w-[38rem] text-gold-400/[0.07]" />

      <div className="container-content pt-16 sm:pt-20">
        {/* Identitas + ajakan */}
        <div className="flex flex-col gap-8 border-b border-navy-800 pb-12 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-lg">
            <div className="flex items-center gap-4">
              <SealMark className="h-14 w-14 shrink-0 text-gold-400" />
              <div className="min-w-0">
                <p className="font-serif text-xl text-cream-50 sm:text-2xl">{site.notaryName}</p>
                <p className="mt-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-gold-300">
                  {site.role}
                </p>
              </div>
            </div>
            <p className="mt-6 text-base leading-relaxed text-navy-200">{footer.tagline}</p>
          </div>
          <WhatsAppCta
            label={kontak.whatsappCta.label}
            ariaLabel={kontak.whatsappCta.ariaLabel}
            variant="onDark"
            size="lg"
            className="w-full shrink-0 sm:w-auto sm:self-start lg:self-auto"
          />
        </div>

        {/* Kolom tautan */}
        <div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[0.9fr_1.1fr_1.2fr] lg:gap-12">
          <nav aria-labelledby="footer-nav-title">
            <h2 id="footer-nav-title" className={columnTitle}>
              {footer.navTitle}
            </h2>
            <ul className="mt-4 grid grid-cols-2 gap-x-6 sm:grid-cols-1 lg:grid-cols-2">
              {nav.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className={linkClass}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className={columnTitle}>{footer.contactTitle}</h2>
            <ul className="mt-4">
              <li>
                <a href={`tel:+${contact.phoneIntl}`} className={linkClass}>
                  <PhoneIcon className="h-4 w-4 shrink-0 text-gold-400" />
                  {contact.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={`mailto:${contact.email}`} className={`${linkClass} break-all`}>
                  <MailIcon className="h-4 w-4 shrink-0 text-gold-400" />
                  {contact.email}
                </a>
              </li>
              <li>
                <a
                  href={contact.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  <InstagramIcon className="h-4 w-4 shrink-0 text-gold-400" />
                  {contact.instagramHandle}
                  <span className="sr-only">(membuka tab baru)</span>
                </a>
              </li>
            </ul>
          </div>

          <div className="sm:col-span-2 lg:col-span-1">
            <h2 className={columnTitle}>{footer.officeTitle}</h2>
            <address className="mt-4 flex items-start gap-2.5 text-[0.95rem] not-italic leading-relaxed text-navy-200">
              <MapPinIcon className="mt-1 h-4 w-4 shrink-0 text-gold-400" />
              <span>
                {contact.addressStreet}
                <br />
                {contact.addressRegion} {contact.addressPostalCode}
              </span>
            </address>
            <p className="mt-3 flex items-start gap-2.5 text-[0.95rem] leading-relaxed text-navy-200">
              <ClockIcon className="mt-1 h-4 w-4 shrink-0 text-gold-400" />
              <span>
                {contact.officeHours.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </span>
            </p>
            <a
              href={maps.directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={infoKantor.directionsAriaLabel}
              className="mt-4 inline-flex min-h-11 items-center gap-2 text-[0.95rem] font-semibold text-cream-50 underline decoration-gold-400 decoration-2 underline-offset-4 transition-colors hover:text-gold-300"
            >
              {infoKantor.directionsLabel}
              <ArrowUpRightIcon className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Baris hukum */}
      <div className="border-t border-navy-800">
        <div className="container-content flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-xs leading-relaxed">
            <p className="text-navy-300">{footer.copyright.replace("{year}", String(year))}</p>
            <p className="mt-1 max-w-2xl text-navy-400">{footer.disclaimer}</p>
          </div>
          <a
            href="#konten-utama"
            className="inline-flex min-h-11 shrink-0 items-center gap-2 self-start text-sm font-semibold text-navy-100 transition-colors hover:text-gold-300 sm:self-auto"
          >
            {footer.backToTop}
            <ArrowDownIcon className="h-4 w-4 rotate-180" />
          </a>
        </div>
      </div>
    </footer>
  );
}
