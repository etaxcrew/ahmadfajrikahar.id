import type { Metadata, Viewport } from "next";
import { Fraunces, Public_Sans } from "next/font/google";
import "./globals.css";
import { getSiteUrl } from "@/lib/site-url";
import { seo, site } from "@/content/site-content";

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

/**
 * Metadata SEO — teks dari `seo` di content/site-content.ts.
 * Gambar Open Graph dibuat otomatis oleh app/opengraph-image.tsx (Next menautkannya sendiri),
 * JSON-LD dirender di app/page.tsx, robots.txt & sitemap.xml di app/robots.ts & app/sitemap.ts.
 */
export const metadata: Metadata = {
  // Otomatis: *.vercel.app sebelum domain aktif, ahmadfajrikahar.id sesudahnya (lib/site-url.ts)
  metadataBase: new URL(getSiteUrl()),
  title: seo.title,
  description: seo.description,
  applicationName: site.officeName,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: seo.locale,
    url: "/",
    siteName: site.officeName,
    title: seo.title,
    description: seo.description,
  },
  twitter: {
    card: "summary_large_image",
    title: seo.title,
    description: seo.description,
  },
  robots: { index: true, follow: true },
  // Nomor telepon tetap tautan eksplisit (tel:/wa.me), bukan deteksi otomatis browser
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#FDFBF7",
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
