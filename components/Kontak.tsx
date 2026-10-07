import { contact, infoKantor, kontak } from "@/content/site-content";
import { ClockIcon, PhoneIcon } from "@/components/icons";
import ContactForm from "@/components/ContactForm";
import OfficeStatus from "@/components/OfficeStatus";
import SectionLabel from "@/components/SectionLabel";
import WhatsAppCta from "@/components/WhatsAppCta";

/**
 * Section Kontak — CTA WhatsApp + form kontak.
 * Section-nya sendiri server component; hanya <ContactForm /> yang client.
 *
 * WhatsApp ditaruh lebih dulu dan lebih menonjol karena itu jalur tercepat
 * (tujuan utama proyek: leads terukur). Form disediakan untuk yang lebih nyaman
 * menulis atau menghubungi di luar jam operasional.
 */
export default function Kontak() {
  return (
    <section id="kontak" aria-labelledby="kontak-title" className="bg-cream-100">
      <div className="container-content py-16 sm:py-20 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          {/* Kolom ajakan */}
          <div>
            <SectionLabel sectionId="kontak" />
            <h2
              id="kontak-title"
              className="mt-3 text-display-sm text-navy-950 sm:text-display-md"
            >
              {kontak.title}
            </h2>
            <div className="mt-6 h-px w-24 bg-gold-400" aria-hidden="true" />
            <p className="mt-6 max-w-prose text-base leading-relaxed text-navy-700 sm:text-lg">
              {kontak.intro}
            </p>

            <WhatsAppCta
              label={kontak.whatsappCta.label}
              ariaLabel={kontak.whatsappCta.ariaLabel}
              size="lg"
              className="mt-8 w-full sm:w-auto"
            />

            {/* Ringkasan kontak — supaya pengunjung tidak perlu menggulir ke atas lagi */}
            <dl className="mt-8 flex flex-col gap-4 border-t border-navy-200/70 pt-6">
              <div className="flex items-start gap-3">
                <PhoneIcon className="mt-0.5 h-5 w-5 shrink-0 text-navy-500" />
                <div>
                  <dt className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-gold-700">
                    {infoKantor.labels.phone}
                  </dt>
                  <dd className="mt-1">
                    <a
                      href={`tel:+${contact.phoneIntl}`}
                      className="text-[0.95rem] font-semibold text-navy-900 underline decoration-gold-500 decoration-2 underline-offset-4 transition-colors hover:text-gold-700"
                    >
                      {contact.phoneDisplay}
                    </a>
                  </dd>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <ClockIcon className="mt-0.5 h-5 w-5 shrink-0 text-navy-500" />
                <div>
                  <dt className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-gold-700">
                    {infoKantor.labels.hours}
                  </dt>
                  <dd className="mt-1 text-[0.95rem] text-navy-800">
                    {contact.officeHours.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                    {/* Ruang dicadangkan agar indikator tidak menggeser tata letak saat muncul */}
                    <span className="mt-2 flex min-h-[1.625rem] items-center">
                      <OfficeStatus />
                    </span>
                  </dd>
                </div>
              </div>
            </dl>
          </div>

          {/* Kolom form */}
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
