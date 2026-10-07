import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Layanan from "@/components/Layanan";
import AlurLayanan from "@/components/AlurLayanan";
import InfoKantor from "@/components/InfoKantor";
import Testimoni from "@/components/Testimoni";
import FAQ from "@/components/FAQ";
import Kontak from "@/components/Kontak";
import Footer from "@/components/Footer";

/**
 * Halaman utama (single-page, anchor navigation).
 * Urutan final sesuai CLAUDE.md "Struktur Halaman":
 *   Header -> Hero -> Layanan -> Alur Layanan -> Info Kantor
 *          -> Testimoni -> FAQ -> Kontak -> Footer
 */
export default function Home() {
  return (
    <>
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
