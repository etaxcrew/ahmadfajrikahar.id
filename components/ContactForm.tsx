"use client";

import { useRef, useState, type FormEvent } from "react";
import { kontak } from "@/content/site-content";
import {
  FIELD_LIMITS,
  validateContact,
  validateField,
  type ContactField,
  type FieldErrors,
} from "@/lib/validation";

/**
 * Form kontak. Mengirim JSON ke POST /api/contact.
 *
 * Aturan validasi diimpor dari `lib/validation.ts` — berkas yang sama dipakai
 * server, jadi aturan di browser dan di server tidak bisa berbeda diam-diam.
 *
 * Aksesibilitas:
 *  - setiap input punya <label> nyata (bukan placeholder sebagai label)
 *  - status wajib/opsional ditulis sebagai teks, tidak hanya tanda bintang
 *  - hint dan pesan error dihubungkan lewat aria-describedby + aria-invalid
 *  - error field memakai role="alert" agar langsung diumumkan screen reader
 *  - hasil kirim diumumkan lewat region aria-live, bukan hanya berubah warna
 *  - `noValidate` dipakai supaya pesan error konsisten dalam bahasa Indonesia
 *    dari `content/site-content.ts`, bukan pesan bawaan browser
 *
 * Anti-spam (pasangan dari pemeriksaan di API route):
 *  - honeypot `website` — tersembunyi dari pengguna, hanya bot yang mengisinya
 *  - `elapsedMs` — jeda sejak form dirender; kiriman super cepat ditolak server
 */

const fields = kontak.form.fields;

type Status = "idle" | "loading" | "success" | "error";

const emptyValues: Record<ContactField, string> = {
  nama: "",
  kontak: "",
  kebutuhan: "",
  pesan: "",
};

export default function ContactForm() {
  const [values, setValues] = useState(emptyValues);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [showSummary, setShowSummary] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);
  const mountedAtRef = useRef<number>(Date.now());

  function setValue(field: ContactField, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    // Hapus error begitu pengguna mulai memperbaiki isinya
    if (errors[field]) {
      setErrors((current) => ({ ...current, [field]: undefined }));
    }
  }

  function handleBlur(field: ContactField) {
    const error = validateField(field, values[field]);
    setErrors((current) => ({ ...current, [field]: error }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "loading") return;

    const { data, errors: nextErrors, isValid } = validateContact(values);
    setErrors(nextErrors);

    if (!isValid) {
      setShowSummary(true);
      setStatus("idle");
      setStatusMessage("");
      // Arahkan fokus ke kolom bermasalah pertama
      const firstInvalid = (Object.keys(nextErrors) as ContactField[])[0];
      formRef.current
        ?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)
        ?.focus();
      return;
    }

    setShowSummary(false);
    setStatus("loading");
    setStatusMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          website: honeypotRef.current?.value ?? "",
          elapsedMs: Date.now() - mountedAtRef.current,
        }),
      });

      const result = (await response.json().catch(() => null)) as
        | { ok?: boolean; code?: string; fieldErrors?: FieldErrors }
        | null;

      if (response.ok && result?.ok) {
        setStatus("success");
        setStatusMessage(kontak.form.successMessage);
        setValues(emptyValues);
        setErrors({});
        mountedAtRef.current = Date.now();
        return;
      }

      if (response.status === 429) {
        setStatus("error");
        setStatusMessage(kontak.form.rateLimitMessage);
        return;
      }

      if (result?.fieldErrors) {
        setErrors(result.fieldErrors);
        setShowSummary(true);
      }
      setStatus("error");
      setStatusMessage(kontak.form.errorMessage);
    } catch {
      // Gagal jaringan / server tidak terjangkau
      setStatus("error");
      setStatusMessage(kontak.form.errorMessage);
    }
  }

  const inputClass =
    "w-full rounded-lg border bg-cream-50 px-4 py-3 text-[0.95rem] text-navy-900 placeholder:text-navy-400 transition-colors";

  function borderClass(field: ContactField) {
    return errors[field]
      ? "border-red-700 focus:border-red-700"
      : "border-navy-200 focus:border-navy-500";
  }

  // Semua id diberi awalan "cf-" agar tidak bentrok dengan id section (mis. <section id="kontak">)
  function describedBy(field: ContactField, hasHint: boolean) {
    const ids = [
      hasHint ? `cf-${field}-hint` : null,
      errors[field] ? `cf-${field}-error` : null,
    ].filter(Boolean);
    return ids.length > 0 ? ids.join(" ") : undefined;
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      noValidate
      className="rounded-card border border-navy-100 bg-cream-50 p-6 shadow-card sm:p-8"
    >
      <h3 className="font-serif text-xl text-navy-950 sm:text-2xl">
        {kontak.form.title}
      </h3>

      {/* Ringkasan kesalahan di atas form */}
      {showSummary && Object.keys(errors).some((key) => errors[key as ContactField]) && (
        <p
          role="alert"
          className="mt-4 rounded-lg border border-red-700 bg-red-50 px-4 py-3 text-sm font-medium text-red-800"
        >
          {kontak.form.validationSummary}
        </p>
      )}

      <div className="mt-5 flex flex-col gap-5">
        {/* Nama */}
        <div>
          <label htmlFor="cf-nama" className="block text-sm font-semibold text-navy-900">
            {fields.nama.label}{" "}
            <span className="font-normal text-navy-500">
              ({kontak.form.requiredHint})
            </span>
          </label>
          <input
            id="cf-nama"
            name="nama"
            type="text"
            autoComplete="name"
            maxLength={FIELD_LIMITS.nama}
            value={values.nama}
            onChange={(event) => setValue("nama", event.target.value)}
            onBlur={() => handleBlur("nama")}
            placeholder={fields.nama.placeholder}
            aria-invalid={Boolean(errors.nama)}
            aria-describedby={describedBy("nama", false)}
            className={`mt-1.5 ${inputClass} ${borderClass("nama")}`}
          />
          {errors.nama && (
            <p id="cf-nama-error" role="alert" className="mt-1.5 text-sm text-red-800">
              {errors.nama}
            </p>
          )}
        </div>

        {/* Kontak */}
        <div>
          <label htmlFor="cf-kontak" className="block text-sm font-semibold text-navy-900">
            {fields.kontak.label}{" "}
            <span className="font-normal text-navy-500">
              ({kontak.form.requiredHint})
            </span>
          </label>
          <input
            id="cf-kontak"
            name="kontak"
            type="text"
            inputMode="text"
            autoComplete="email"
            maxLength={FIELD_LIMITS.kontak}
            value={values.kontak}
            onChange={(event) => setValue("kontak", event.target.value)}
            onBlur={() => handleBlur("kontak")}
            placeholder={fields.kontak.placeholder}
            aria-invalid={Boolean(errors.kontak)}
            aria-describedby={describedBy("kontak", true)}
            className={`mt-1.5 ${inputClass} ${borderClass("kontak")}`}
          />
          <p id="cf-kontak-hint" className="mt-1.5 text-sm text-navy-600">
            {fields.kontak.hint}
          </p>
          {errors.kontak && (
            <p id="cf-kontak-error" role="alert" className="mt-1.5 text-sm text-red-800">
              {errors.kontak}
            </p>
          )}
        </div>

        {/* Kebutuhan */}
        <div>
          <label
            htmlFor="cf-kebutuhan"
            className="block text-sm font-semibold text-navy-900"
          >
            {fields.kebutuhan.label}{" "}
            <span className="font-normal text-navy-500">
              ({kontak.form.requiredHint})
            </span>
          </label>
          <select
            id="cf-kebutuhan"
            name="kebutuhan"
            value={values.kebutuhan}
            onChange={(event) => setValue("kebutuhan", event.target.value)}
            onBlur={() => handleBlur("kebutuhan")}
            aria-invalid={Boolean(errors.kebutuhan)}
            aria-describedby={describedBy("kebutuhan", false)}
            className={`mt-1.5 ${inputClass} ${borderClass("kebutuhan")} ${
              values.kebutuhan ? "" : "text-navy-400"
            }`}
          >
            <option value="">{fields.kebutuhan.placeholder}</option>
            {kontak.form.kebutuhanOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {errors.kebutuhan && (
            <p id="cf-kebutuhan-error" role="alert" className="mt-1.5 text-sm text-red-800">
              {errors.kebutuhan}
            </p>
          )}
        </div>

        {/* Pesan */}
        <div>
          <label htmlFor="cf-pesan" className="block text-sm font-semibold text-navy-900">
            {fields.pesan.label}{" "}
            <span className="font-normal text-navy-500">
              ({kontak.form.optionalHint})
            </span>
          </label>
          <textarea
            id="cf-pesan"
            name="pesan"
            rows={4}
            maxLength={FIELD_LIMITS.pesan}
            value={values.pesan}
            onChange={(event) => setValue("pesan", event.target.value)}
            placeholder={fields.pesan.placeholder}
            aria-describedby={describedBy("pesan", true)}
            className={`mt-1.5 resize-y ${inputClass} ${borderClass("pesan")}`}
          />
          <p id="cf-pesan-hint" className="mt-1.5 text-sm text-navy-600">
            {fields.pesan.hint}
          </p>
        </div>

        {/* Honeypot — tidak terlihat pengguna, tidak bisa di-tab, diabaikan autofill */}
        <div aria-hidden="true" className="hidden">
          <label htmlFor="cf-website">Website</label>
          <input
            ref={honeypotRef}
            id="cf-website"
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            defaultValue=""
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-navy-900 px-6 py-3 text-base font-semibold text-cream-50 shadow-card transition-colors hover:bg-navy-800 disabled:cursor-not-allowed disabled:bg-navy-400 sm:w-auto"
      >
        {status === "loading"
          ? kontak.form.submitLoadingLabel
          : kontak.form.submitLabel}
      </button>

      {/* Hasil kirim — selalu diumumkan screen reader, tidak hanya berubah warna */}
      <div aria-live="polite" className="mt-4 empty:mt-0">
        {status === "success" && (
          <p className="rounded-lg border border-navy-200 bg-cream-50 px-4 py-3 text-sm font-medium text-navy-900">
            {statusMessage}
          </p>
        )}
        {status === "error" && (
          <p className="rounded-lg border border-red-700 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
            {statusMessage}
          </p>
        )}
      </div>

      <p className="mt-4 text-xs leading-relaxed text-navy-600">
        {kontak.form.privacyNote}
      </p>
    </form>
  );
}
