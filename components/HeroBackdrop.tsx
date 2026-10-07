/**
 * Latar dekoratif Hero — sepenuhnya CSS/SVG, tanpa JS klien dan tanpa aset gambar.
 *
 *  - <PaperRules>  : garis-garis tipis ala kertas akta, memudar ke tepi (mask radial)
 *  - <Guilloche>   : pola guilloche (anyaman garis halus khas sertifikat/akta),
 *                    berputar sangat lambat di belakang slot visual
 *
 * Semua elemen `aria-hidden` dan `pointer-events-none`. Animasi otomatis berhenti
 * untuk pengguna `prefers-reduced-motion` (lihat app/globals.css).
 */

import { useId } from "react";

/** Satu cincin bergelombang: r(θ) = R + amp·sin(lobes·θ), dirangkai sebagai path tertutup. */
function wavyRing(radius: number, amp: number, lobes: number, pointsPerLobe = 8) {
  const steps = lobes * pointsPerLobe;
  let d = "";
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * Math.PI * 2;
    const r = radius + amp * Math.sin(lobes * t);
    const x = (300 + r * Math.cos(t)).toFixed(1);
    const y = (300 + r * Math.sin(t)).toFixed(1);
    d += `${i === 0 ? "M" : "L"}${x} ${y}`;
  }
  return `${d}Z`;
}

// Dihitung sekali saat modul dimuat (server), bukan per render
const BANDS = [
  { id: "g-outer", d: wavyRing(262, 12, 28), copies: 5, lobes: 28 },
  { id: "g-inner", d: wavyRing(198, 9, 20), copies: 4, lobes: 20 },
] as const;

export function Guilloche({ className }: { className?: string }) {
  // Dipakai di beberapa tempat (hero, testimoni, footer) — id <path> harus unik per pemakaian
  const uid = useId();
  return (
    <svg
      aria-hidden="true"
      focusable={false}
      viewBox="0 0 600 600"
      fill="none"
      className={className}
    >
      <defs>
        {BANDS.map((band) => (
          <path key={band.id} id={`${uid}${band.id}`} d={band.d} />
        ))}
      </defs>

      <g stroke="currentColor" strokeWidth="0.6">
        {/* Salinan cincin yang diputar sedikit demi sedikit -> efek anyaman guilloche */}
        {BANDS.map((band) =>
          Array.from({ length: band.copies }, (_, i) => (
            <use
              key={`${band.id}-${i}`}
              href={`#${uid}${band.id}`}
              transform={`rotate(${((360 / band.lobes) * i) / band.copies} 300 300)`}
            />
          )),
        )}
        <circle cx="300" cy="300" r="286" opacity="0.7" />
        <circle cx="300" cy="300" r="232" strokeDasharray="1 6" />
        <circle cx="300" cy="300" r="176" opacity="0.7" />
      </g>
    </svg>
  );
}

export function PaperRules() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 animate-hero-fade [background-image:repeating-linear-gradient(to_bottom,transparent_0,transparent_35px,rgba(18,35,56,0.06)_35px,rgba(18,35,56,0.06)_36px)] [mask-image:radial-gradient(ellipse_70%_60%_at_30%_45%,#000_20%,transparent_75%)]"
    />
  );
}

/** Teks melingkar di sekeliling seal (dekoratif). Panjang teks dipaskan ke keliling lingkaran. */
export function SealRing({ text, className }: { text: string; className?: string }) {
  const r = 88;
  const circumference = 2 * Math.PI * r;
  return (
    <svg aria-hidden="true" focusable={false} viewBox="0 0 200 200" className={className}>
      <defs>
        <path id="seal-ring-path" d={`M100 ${100 - r}a${r} ${r} 0 1 1 0 ${2 * r}a${r} ${r} 0 1 1 0 ${-2 * r}`} />
      </defs>
      <text
        fill="currentColor"
        fontFamily="var(--font-public-sans), system-ui, sans-serif"
        fontSize="8.5"
        fontWeight="600"
      >
        <textPath href="#seal-ring-path" textLength={circumference - 6} lengthAdjust="spacing">
          {text}
        </textPath>
      </text>
    </svg>
  );
}
