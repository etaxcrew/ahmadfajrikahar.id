import type { Config } from "tailwindcss";

/**
 * Design tokens — Notaris & PPAT Ahmad Fajri Kahar
 * Palet: navy (otoritas/kepercayaan) + off-white (kertas akta) + champagne gold (aksen seal).
 * Catatan kontras (WCAG AA) — pasangan yang sudah diverifikasi aman:
 *   - teks navy-900 di atas cream-50 .......... rasio tinggi, aman untuk body text
 *   - teks cream-50 di atas navy-900 .......... aman untuk section gelap
 *   - gold-300/gold-400 HANYA di atas navy-800+ (aksen, bukan body text)
 *   - gold di atas background terang: pakai gold-700 ke atas
 */
const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./content/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: "#F2F5F9",
          100: "#E3EAF3",
          200: "#C4D2E4",
          300: "#9BB0CC",
          400: "#6A86AB",
          500: "#476690",
          600: "#345074",
          700: "#28405E",
          800: "#1B2E45",
          900: "#122338",
          950: "#0A1628",
        },
        cream: {
          50: "#FDFBF7",
          100: "#F8F4EC",
          200: "#F0E9DC",
          300: "#E4D9C5",
        },
        gold: {
          50: "#FBF7EF",
          100: "#F6EEDC",
          200: "#EDDCB8",
          300: "#E1C68C",
          400: "#D4AF6A",
          500: "#C39A4F",
          600: "#A67F3C",
          700: "#856331",
          800: "#6B502B",
          900: "#584225",
        },
      },
      fontFamily: {
        // Di-inject sebagai CSS variable lewat next/font di app/layout.tsx
        serif: ["var(--font-fraunces)", "Georgia", "Cambria", "serif"],
        sans: ["var(--font-public-sans)", "system-ui", "sans-serif"],
      },
      fontSize: {
        "display-sm": ["2rem", { lineHeight: "1.15", letterSpacing: "-0.01em" }],
        "display-md": ["2.75rem", { lineHeight: "1.1", letterSpacing: "-0.015em" }],
        "display-lg": ["3.5rem", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
      },
      maxWidth: {
        content: "72rem",
        prose: "65ch",
      },
      borderRadius: {
        card: "0.75rem",
      },
      boxShadow: {
        card: "0 1px 2px rgba(10, 22, 40, 0.04), 0 8px 24px -12px rgba(10, 22, 40, 0.18)",
        "card-hover": "0 2px 4px rgba(10, 22, 40, 0.06), 0 16px 32px -12px rgba(10, 22, 40, 0.22)",
      },
      // Animasi Hero — hanya transform/opacity (murah untuk GPU, tidak memicu layout).
      // Otomatis dinonaktifkan untuk prefers-reduced-motion di app/globals.css.
      keyframes: {
        "hero-rise": {
          from: { opacity: "0", transform: "translateY(14px)" },
          to: { opacity: "1", transform: "none" },
        },
        "hero-card": {
          from: { opacity: "0", transform: "translateY(20px) scale(0.985)" },
          to: { opacity: "1", transform: "none" },
        },
        "hero-rule": {
          from: { transform: "scaleX(0)" },
          to: { transform: "scaleX(1)" },
        },
        "hero-fade": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "hero-sheen": {
          from: { transform: "translateX(-100%) skewX(-18deg)" },
          to: { transform: "translateX(320%) skewX(-18deg)" },
        },
      },
      animation: {
        "hero-rise": "hero-rise 0.8s cubic-bezier(0.22, 1, 0.36, 1) both",
        "hero-card": "hero-card 1s cubic-bezier(0.22, 1, 0.36, 1) both",
        "hero-rule": "hero-rule 0.9s cubic-bezier(0.65, 0, 0.35, 1) both",
        "hero-fade": "hero-fade 1.4s ease-out both",
        "hero-sheen": "hero-sheen 1.6s cubic-bezier(0.65, 0, 0.35, 1) 1.1s both",
        "spin-slower": "spin 90s linear infinite",
        "spin-slowest": "spin 240s linear infinite",
      },
      backgroundImage: {
        // Garis tipis ala kop surat/akta — dipakai sebagai pemisah section
        "rule-gold": "linear-gradient(90deg, transparent, #D4AF6A 20%, #D4AF6A 80%, transparent)",
      },
    },
  },
  plugins: [],
};
export default config;
