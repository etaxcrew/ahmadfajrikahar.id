import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Layanan from "@/components/Layanan";
import AlurLayanan from "@/components/AlurLayanan";
import InfoKantor from "@/components/InfoKantor";
import Testimoni from "@/components/Testimoni";
import FAQ from "@/components/FAQ";
import Kontak from "@/components/Kontak";
import Footer from "@/components/Footer";
import { getLocalBusinessJsonLd, serializeJsonLd } from "@/lib/structured-data";

/**
 * Halaman utama (single-page, anchor navigation).
 * Urutan final sesuai CLAUDE.md "Struktur Halaman":
 *   Header -> Hero -> Layanan -> Alur Layanan -> Info Kantor
 *          -> Testimoni -> FAQ -> Kontak -> Footer
 */
export default function Home() {
  return (
    <>
      {/* Data terstruktur untuk mesin pencari (schema.org Notary → LegalService → LocalBusiness) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(getLocalBusinessJsonLd()) }}
      />
      <Header />
      <main id="konten-utama">
        <Hero />
        <Layanan />
        <AlurLayanan />
        <InfoKantor />
        <Testimoni />
        <FAQ />
        <Kontak />
      </main>
      <Footer />
    </>
  );
}
