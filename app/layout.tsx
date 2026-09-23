import type { Metadata } from "next";
import { Fraunces, Public_Sans } from "next/font/google";
import "./globals.css";

/**
 * Tipografi
 * - Fraunces  : serif untuk heading — karakter "cetak/akta", berwibawa tapi tidak kaku
 * - Public Sans: sans untuk body — netral, terbaca baik di layar kecil
 * Keduanya variable font, di-expose sebagai CSS variable dan dipakai di tailwind.config.ts
 */
const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraunces",
  axes: ["SOFT", "WONK", "opsz"],
});

const publicSans = Public_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-public-sans",
});

// TODO (Tahap 9): metadata final — Open Graph, JSON-LD LegalService/LocalBusiness,
// canonical, robots, dan OG image. Di bawah ini baru placeholder minimal agar build jalan.
export const metadata: Metadata = {
  metadataBase: new URL("https://ahmadfajrikahar.web.id"),
  title: "Notaris & PPAT Ahmad Fajri Kahar, S.H., M.Kn. — Limboto, Kabupaten Gorontalo",
  description:
    "Kantor Notaris & PPAT Ahmad Fajri Kahar, S.H., M.Kn. melayani jasa kenotariatan dan pertanahan di Kabupaten Gorontalo dan sekitarnya.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${fraunces.variable} ${publicSans.variable}`}>
      <body>
        <a
          href="#konten-utama"
          className="sr-only-focusable absolute left-4 top-4 z-50 rounded-md bg-navy-900 px-4 py-2 text-sm font-semibold text-cream-50"
        >
          Lewati ke konten utama
        </a>
        {children}
      </body>
    </html>
  );
}
