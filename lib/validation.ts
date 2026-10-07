import { kontak } from "@/content/site-content";

/**
 * Validasi form kontak — DIPAKAI BERSAMA oleh client (components/ContactForm.tsx)
 * dan server (app/api/contact/route.ts).
 *
 * Alasannya penting: validasi di browser hanya soal kenyamanan dan bisa dilewati
 * (curl, devtools, bot). Server WAJIB memvalidasi ulang dengan aturan yang sama.
 * Dengan menaruh aturannya di satu berkas, keduanya tidak bisa berbeda diam-diam.
 *
 * Pesan error diambil dari `content/site-content.ts`, bukan ditulis di sini.
 */

export type ContactField = "nama" | "kontak" | "kebutuhan" | "pesan";

export type ContactPayload = Record<ContactField, string>;

export type FieldErrors = Partial<Record<ContactField, string>>;

/** Batas panjang — juga jadi benteng agar payload tidak dipakai membanjiri email */
export const FIELD_LIMITS = {
  nama: 80,
  kontak: 120,
  kebutuhan: 120,
  pesan: 2000,
} as const satisfies Record<ContactField, number>;

const fields = kontak.form.fields;

/** Cukup ketat untuk menangkap salah ketik, cukup longgar untuk alamat yang sah */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

/** Nomor Indonesia: minimal 9 digit setelah karakter pemisah dibuang */
function looksLikePhone(value: string): boolean {
  const digits = value.replace(/[^\d]/g, "");
  return /^[\d\s()+.-]+$/.test(value) && digits.length >= 9 && digits.length <= 15;
}

function normalize(value: unknown): string {
  return typeof value === "string" ? value.trim().replace(/\s+/g, " ") : "";
}

/**
 * Validasi satu field. Dipakai client untuk validasi saat blur,
 * dan server saat memeriksa seluruh payload.
 */
export function validateField(
  field: ContactField,
  rawValue: string,
): string | undefined {
  const value = normalize(rawValue);

  switch (field) {
    case "nama":
      if (!value) return fields.nama.errorRequired;
      if (value.length > FIELD_LIMITS.nama) return fields.nama.errorRequired;
      return undefined;

    case "kontak":
      if (!value) return fields.kontak.errorRequired;
      if (value.length > FIELD_LIMITS.kontak) return fields.kontak.errorInvalid;
      if (!EMAIL_PATTERN.test(value) && !looksLikePhone(value)) {
        return fields.kontak.errorInvalid;
      }
      return undefined;

    case "kebutuhan":
      if (!value) return fields.kebutuhan.errorRequired;
      // Hanya menerima opsi yang benar-benar ada di dropdown
      if (!(kontak.form.kebutuhanOptions as readonly string[]).includes(value)) {
        return fields.kebutuhan.errorRequired;
      }
      return undefined;

    case "pesan":
      // Opsional; hanya panjangnya yang dibatasi
      if (value.length > FIELD_LIMITS.pesan) return fields.pesan.hint;
      return undefined;
  }
}

/**
 * Validasi seluruh payload sekaligus.
 * Mengembalikan data yang sudah dinormalisasi + daftar error per field.
 */
export function validateContact(input: Partial<Record<ContactField, unknown>>): {
  data: ContactPayload;
  errors: FieldErrors;
  isValid: boolean;
} {
  const data: ContactPayload = {
    nama: normalize(input.nama),
    kontak: normalize(input.kontak),
    kebutuhan: normalize(input.kebutuhan),
    pesan: typeof input.pesan === "string" ? input.pesan.trim() : "",
  };

  const errors: FieldErrors = {};
  (Object.keys(data) as ContactField[]).forEach((field) => {
    const error = validateField(field, data[field]);
    if (error) errors[field] = error;
  });

  return { data, errors, isValid: Object.keys(errors).length === 0 };
}
