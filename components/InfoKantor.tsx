import { contact, infoKantor, maps, site } from "@/content/site-content";
import {
  ArrowUpRightIcon,
  ClockIcon,
  InstagramIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
} from "@/components/icons";
import OfficeStatus from "@/components/OfficeStatus";
import SectionLabel from "@/components/SectionLabel";
import WhatsAppCta from "@/components/WhatsAppCta";

/**
 * Section Info Kantor — alamat, jam operasional, kontak langsung, dan peta.
 * Server component; satu-satunya bagian klien adalah <OfficeStatus /> (status buka/tutup).
 *
 * Tata letak (lg): kartu info 5/12 kolom, peta 7/12 kolom. Kartu peta merentang
 * setinggi kartu info dan iframe mengisi sisa tingginya, jadi tidak ada ruang kosong.
 * Di mobile keduanya bertumpuk dan peta memakai rasio tetap.
 *
 * Aksesibilitas & performa:
 *  - Alamat & jam memakai <dl>/<dt>/<dd> agar hubungan label-nilai terbaca screen reader.
 *  - Kontak langsung berupa daftar tautan; nama aksesibel = label + nilai yang terlihat.
 *  - Ikon dekoratif (aria-hidden).
 *  - iframe peta memakai `title` bermakna + `loading="lazy"` agar tidak membebani LCP.
 *
 * Peta memakai listing resmi kantor di Google Maps (lihat `maps` di site-content).
 */

function IconTile({ icon: Icon }: { icon: (props: { className?: string }) => JSX.Element }) {
  return (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cream-50 text-navy-600 ring-1 ring-inset ring-navy-100 transition-colors duration-300 group-hover:bg-navy-900 group-hover:text-gold-300 group-hover:ring-navy-900">
      <Icon className="h-5 w-5" />
    </span>
  );
}

function GroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-3 font-serif text-lg text-navy-950">
      {children}
      <span aria-hidden="true" className="h-px flex-1 bg-navy-100" />
    </p>
  );
}

const labelClass = "text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-gold-700";

const directLinks = [
  {
    icon: PhoneIcon,
    label: infoKantor.labels.phone,
    value: contact.phoneDisplay,
    href: `tel:+${contact.phoneIntl}`,
    external: false,
  },
  {
    icon: MailIcon,
    label: infoKantor.labels.email,
    value: contact.email,
    href: `mailto:${contact.email}`,
    external: false,
  },
  {
    icon: InstagramIcon,
    label: infoKantor.labels.instagram,
    value: contact.instagramHandle,
    href: contact.instagramUrl,
    external: true,
  },
];

export default function InfoKantor() {
  return (
    <section id="info-kantor" aria-labelledby="info-kantor-title" className="bg-cream-50">
      <div className="container-content py-16 sm:py-20 lg:py-24">
        {/* Kepala section — judul kiri, ajakan buat janji kanan (desktop) */}
        <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
          <div className="max-w-prose">
            <SectionLabel sectionId="info-kantor" />
            <h2
              id="info-kantor-title"
              className="mt-3 text-display-sm text-navy-950 sm:text-display-md"
            >
              {infoKantor.title}
            </h2>
            <p className="mt-5 text-base leading-relaxed text-navy-700 sm:text-lg">
              {infoKantor.intro}
            </p>
          </div>
          <WhatsAppCta
            label={infoKantor.appointmentCta.label}
            ariaLabel={infoKantor.appointmentCta.ariaLabel}
            size="lg"
            className="w-full shrink-0 sm:w-auto sm:self-start lg:self-auto"
          />
        </div>

        <div className="mt-10 grid gap-6 lg:mt-14 lg:grid-cols-12 lg:gap-8">
          {/* Kartu info kantor */}
          <div className="flex flex-col overflow-hidden rounded-card border border-navy-100 bg-cream-100/70 md:flex-row lg:col-span-5 lg:flex-col">
            {/* Kunjungan: alamat + jam (tablet: berdampingan dengan "Hubungi langsung") */}
            <div className="p-6 sm:p-7 md:basis-1/2 lg:basis-auto">
              <GroupLabel>{infoKantor.groups.visit}</GroupLabel>
              <dl className="mt-5 space-y-5">
                <div className="flex items-start gap-4">
                  <IconTile icon={MapPinIcon} />
                  <div className="min-w-0 flex-1">
                    <dt className={labelClass}>{infoKantor.labels.address}</dt>
                    <dd className="mt-1.5 text-base leading-relaxed text-navy-900">
                      {contact.addressStreet}
                      <br />
                      {contact.addressRegion} {contact.addressPostalCode}
                    </dd>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <IconTile icon={ClockIcon} />
                  <div className="min-w-0 flex-1">
                    <dt className={labelClass}>{infoKantor.labels.hours}</dt>
                    <dd className="mt-1.5 text-base leading-relaxed text-navy-900">
                      {contact.officeHours.map((line) => (
                        <span key={line} className="block">
                          {line}
                        </span>
                      ))}
                      {/* Ruang dicadangkan agar indikator tidak menggeser tata letak saat muncul */}
                      <span className="mt-2 flex min-h-[1.625rem] items-center">
                        <OfficeStatus />
                      </span>
                      <span className="mt-2 block text-sm leading-relaxed text-navy-600">
                        {contact.officeHoursNote}
                      </span>
                    </dd>
                  </div>
                </div>
              </dl>
            </div>

            {/* Hubungi langsung: seluruh baris dapat diklik */}
            <div className="border-t border-navy-100 bg-cream-50/60 px-3 pb-3 pt-6 sm:px-4 sm:pb-4 md:basis-1/2 md:border-l md:border-t-0 md:pt-7 lg:mt-auto lg:basis-auto lg:border-l-0 lg:border-t lg:pt-6">
              <div className="px-3">
                <GroupLabel>{infoKantor.groups.reach}</GroupLabel>
              </div>
              <ul className="mt-3">
                {directLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="group flex min-h-14 items-center gap-4 rounded-lg px-3 py-3 transition-colors duration-200 hover:bg-cream-100"
                    >
                      <IconTile icon={link.icon} />
                      <span className="min-w-0 flex-1">
                        <span className={`block ${labelClass}`}>{link.label}</span>
                        <span className="mt-0.5 block truncate text-base font-semibold text-navy-900">
                          {link.value}
                        </span>
                      </span>
                      {link.external && <span className="sr-only">(membuka tab baru)</span>}
                      <ArrowUpRightIcon className="h-4 w-4 shrink-0 text-navy-400 transition-[color,transform] duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gold-700" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Kartu peta — merentang setinggi kartu info di desktop */}
          <div className="group flex flex-col overflow-hidden rounded-card border border-navy-100 bg-cream-100 shadow-card lg:col-span-7">
            <div className="relative aspect-[4/3] w-full bg-navy-100 sm:aspect-[16/10] lg:aspect-auto lg:min-h-[26rem] lg:flex-1">
              <iframe
                src={maps.embedUrl}
                title={maps.embedTitle}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 h-full w-full border-0 [filter:saturate(0.7)_contrast(0.97)] transition-[filter] duration-500 group-focus-within:[filter:none] group-hover:[filter:none]"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-navy-100 px-5 py-4">
              <p className="flex min-w-0 items-center gap-2 text-sm text-navy-700">
                <MapPinIcon className="h-4 w-4 shrink-0 text-gold-700" />
                {site.officeName}
              </p>
              <a
                href={maps.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={infoKantor.directionsAriaLabel}
                className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-navy-900 px-5 text-sm font-semibold text-cream-50 shadow-card transition-colors hover:bg-navy-800 sm:w-auto"
              >
                {infoKantor.directionsLabel}
                <ArrowUpRightIcon className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
