import { contact, maps, seo, site } from "@/content/site-content";
import { getSiteUrl } from "@/lib/site-url";

/**
 * Data terstruktur JSON-LD (schema.org) untuk mesin pencari.
 *
 * Tipe `Notary` adalah subtipe resmi LegalService → LocalBusiness di schema.org, jadi
 * memenuhi syarat CLAUDE.md ("LegalService/LocalBusiness") dengan tipe paling spesifik.
 *
 * Semua nilai diturunkan dari data final di content/site-content.ts — tidak ada data
 * ganda yang bisa saling bertentangan.
 *
 * Kode etik notaris: SENGAJA tanpa `priceRange`, `aggregateRating`, maupun `review`.
 */

const DAY_URI: Record<string, string> = {
  Mo: "https://schema.org/Monday",
  Tu: "https://schema.org/Tuesday",
  We: "https://schema.org/Wednesday",
  Th: "https://schema.org/Thursday",
  Fr: "https://schema.org/Friday",
  Sa: "https://schema.org/Saturday",
  Su: "https://schema.org/Sunday",
};
const DAY_ORDER = Object.keys(DAY_URI);

/** "Mo-Fr 08:00-17:00" -> OpeningHoursSpecification */
function toOpeningHours(entry: string) {
  const [days, hours] = entry.trim().split(/\s+/);
  const [opens, closes] = hours.split("-");
  const dayOfWeek = days.split(",").flatMap((part) => {
    const [from, to = from] = part.split("-");
    const start = DAY_ORDER.indexOf(from);
    const end = DAY_ORDER.indexOf(to);
    return DAY_ORDER.slice(start, end + 1).map((code) => DAY_URI[code]);
  });
  return { "@type": "OpeningHoursSpecification", dayOfWeek, opens, closes };
}

export function getLocalBusinessJsonLd() {
  const url = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "Notary",
    "@id": `${url}/#kantor`,
    name: site.officeName,
    alternateName: `Kantor Notaris & PPAT ${site.notaryName}`,
    description: seo.description,
    url,
    image: `${url}/opengraph-image`,
    logo: `${url}/icon.svg`,
    telephone: `+${contact.phoneIntl}`,
    email: contact.email,
    address: { "@type": "PostalAddress", ...seo.postalAddress },
    geo: {
      "@type": "GeoCoordinates",
      latitude: maps.latitude,
      longitude: maps.longitude,
    },
    hasMap: maps.shareUrl,
    openingHoursSpecification: contact.officeHoursSchema.map(toOpeningHours),
    areaServed: seo.areaServed.map((name) => ({ "@type": "AdministrativeArea", name })),
    sameAs: [contact.instagramUrl, maps.shareUrl],
    knowsLanguage: "id",
  };
}

/** Serialisasi aman untuk <script>: cegah penutupan tag lewat "</script>" di data */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
