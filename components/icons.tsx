/**
 * Ikon inline (SVG) — sengaja tidak memakai library ikon agar bundle tetap kecil
 * (target Lighthouse Performance >= 85 di mobile).
 *
 * ATURAN AKSESIBILITAS:
 *  - Semua ikon di sini dekoratif: `aria-hidden` + `focusable={false}`.
 *  - Nama yang dibaca screen reader HARUS datang dari teks tombol/tautan di sekitarnya,
 *    atau dari `aria-label` pada elemen pembungkusnya. Jangan pernah pakai ikon
 *    sebagai satu-satunya sumber makna.
 */

type IconProps = {
  className?: string;
};

const base = {
  "aria-hidden": true,
  focusable: false,
} as const;

export function WhatsAppIcon({ className }: IconProps) {
  return (
    <svg
      {...base}
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.347-.347.52-.52.174-.174.232-.298.347-.497.115-.198.057-.371-.058-.52-.116-.149-.686-1.654-.94-2.264-.247-.595-.499-.51-.686-.52-.177-.008-.38-.01-.582-.01-.202 0-.53.075-.807.372-.278.297-1.058 1.033-1.058 2.52 0 1.487 1.082 2.924 1.232 3.122.15.199 2.13 3.251 5.16 4.56.72.312 1.283.498 1.722.637.72.229 1.376.197 1.894.12.578-.087 1.78-.727 2.03-1.43.25-.703.25-1.306.174-1.43-.074-.124-.272-.198-.57-.347Z" />
      <path d="M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.334.101 11.893c0 2.096.549 4.14 1.595 5.945L0 24l6.335-1.652a11.87 11.87 0 0 0 5.71 1.445h.006c6.585 0 11.946-5.336 11.949-11.896a11.82 11.82 0 0 0-3.48-8.448ZM12.05 21.785h-.004a9.87 9.87 0 0 1-5.03-1.378l-.36-.214-3.741.975.998-3.648-.235-.374a9.86 9.86 0 0 1-1.511-5.26c.002-5.45 4.437-9.884 9.889-9.884a9.82 9.82 0 0 1 6.988 2.898 9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.438 9.885-9.887 9.885Z" />
    </svg>
  );
}

export function MenuIcon({ className }: IconProps) {
  return (
    <svg
      {...base}
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
    >
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function CloseIcon({ className }: IconProps) {
  return (
    <svg
      {...base}
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
    >
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function ArrowDownIcon({ className }: IconProps) {
  return (
    <svg
      {...base}
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 5v14M6 13l6 6 6-6" />
    </svg>
  );
}

export function ChevronDownIcon({ className }: IconProps) {
  return (
    <svg
      {...base}
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9.5 6 6 6-6" />
    </svg>
  );
}

export function MapPinIcon({ className }: IconProps) {
  return (
    <svg
      {...base}
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 21.5s7-5.6 7-11.25A7 7 0 0 0 5 10.25C5 15.9 12 21.5 12 21.5z" />
      <circle cx="12" cy="10.1" r="2.6" />
    </svg>
  );
}

export function ClockIcon({ className }: IconProps) {
  return (
    <svg
      {...base}
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="9.25" />
      <path d="M12 7v5.3l3.4 2.1" />
    </svg>
  );
}

export function PhoneIcon({ className }: IconProps) {
  return (
    <svg
      {...base}
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8.1 3.5H5.6A2.1 2.1 0 0 0 3.5 5.7c0 8.2 6.6 14.8 14.8 14.8a2.1 2.1 0 0 0 2.2-2.1v-2.5l-4.4-1.6-2 2a14.6 14.6 0 0 1-5.6-5.6l2-2z" />
    </svg>
  );
}

export function MailIcon({ className }: IconProps) {
  return (
    <svg
      {...base}
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2.75" y="5" width="18.5" height="14" rx="2" />
      <path d="m3.5 6.75 8.5 6.25 8.5-6.25" />
    </svg>
  );
}

export function InstagramIcon({ className }: IconProps) {
  return (
    <svg
      {...base}
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3.25" y="3.25" width="17.5" height="17.5" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="16.9" cy="7.1" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function ExternalLinkIcon({ className }: IconProps) {
  return (
    <svg
      {...base}
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M13.75 4.25H19.75V10.25" />
      <path d="M19.75 4.25 10.5 13.5" />
      <path d="M18 14.5v4.25A1.25 1.25 0 0 1 16.75 20H5.25A1.25 1.25 0 0 1 4 18.75V7.25A1.25 1.25 0 0 1 5.25 6H9.5" />
    </svg>
  );
}

export function QuoteIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M9.6 6C6.5 7.3 4.5 10.1 4.5 13.5V18h6v-6H7.6c.2-2 1.3-3.5 3.1-4.4L9.6 6Z" />
      <path d="M18.6 6c-3.1 1.3-5.1 4.1-5.1 7.5V18h6v-6h-2.9c.2-2 1.3-3.5 3.1-4.4L18.6 6Z" />
    </svg>
  );
}

export function ArrowUpRightIcon({ className }: IconProps) {
  return (
    <svg
      {...base}
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 17 17 7" />
      <path d="M8.5 7H17v8.5" />
    </svg>
  );
}

export function PauseIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className} viewBox="0 0 24 24" fill="currentColor">
      <rect x="7" y="5" width="3.5" height="14" rx="1" />
      <rect x="13.5" y="5" width="3.5" height="14" rx="1" />
    </svg>
  );
}

export function PlayIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5.14v13.72a1 1 0 0 0 1.52.85l11.1-6.86a1 1 0 0 0 0-1.7L9.52 4.29A1 1 0 0 0 8 5.14z" />
    </svg>
  );
}

/** Akta/dokumen — penanda visual kewenangan Notaris */
export function DocumentIcon({ className }: IconProps) {
  return (
    <svg
      {...base}
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M13.25 2.75H6v18.5h12.25V7.75z" />
      <path d="M13.25 2.75v5h5" />
      <path d="M9 12.25h6M9 15.5h6M9 18.75h3.25" />
    </svg>
  );
}

/** Bidang tanah + titik lokasi — penanda visual kewenangan PPAT */
export function LandIcon({ className }: IconProps) {
  return (
    <svg
      {...base}
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2.75c1.93 0 3.5 1.57 3.5 3.5 0 2.45-3.5 6.25-3.5 6.25S8.5 8.7 8.5 6.25c0-1.93 1.57-3.5 3.5-3.5z" />
      <circle cx="12" cy="6.25" r="1.15" />
      <path d="M8.4 13.1 2.75 16.25 12 21.25l9.25-5-5.65-3.15" />
      <path d="M7.4 18.5 16 14" opacity="0.5" />
    </svg>
  );
}

/**
 * Seal / cap notaris — motif visual pengganti foto (lihat CLAUDE.md:
 * "gunakan elemen desain (seal, tipografi akta) sebagai pengganti visual").
 * Dekoratif sepenuhnya; tidak membawa informasi.
 */
export function SealMark({ className }: IconProps) {
  return (
    <svg {...base} className={className} viewBox="0 0 120 120" fill="none">
      <circle cx="60" cy="60" r="57" stroke="currentColor" strokeWidth="1" opacity="0.45" />
      <circle cx="60" cy="60" r="49" stroke="currentColor" strokeWidth="2" />
      <circle
        cx="60"
        cy="60"
        r="41"
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray="2 5"
        opacity="0.7"
      />
      {/* Monogram AFK */}
      <text
        x="60"
        y="57"
        textAnchor="middle"
        fontFamily="var(--font-fraunces), Georgia, serif"
        fontSize="30"
        fontWeight="600"
        letterSpacing="1"
        fill="currentColor"
      >
        AFK
      </text>
      <path d="M40 68h40" stroke="currentColor" strokeWidth="1" opacity="0.8" />
      <text
        x="60"
        y="82"
        textAnchor="middle"
        fontFamily="var(--font-public-sans), system-ui, sans-serif"
        fontSize="8.5"
        letterSpacing="2.4"
        fill="currentColor"
      >
        NOTARIS
      </text>
      <text
        x="60"
        y="93"
        textAnchor="middle"
        fontFamily="var(--font-public-sans), system-ui, sans-serif"
        fontSize="8.5"
        letterSpacing="2.4"
        fill="currentColor"
      >
        &amp; PPAT
      </text>
    </svg>
  );
}
