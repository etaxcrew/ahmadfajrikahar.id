"use client";

import { useEffect, useState } from "react";
import { contact, infoKantor } from "@/content/site-content";

/**
 * Indikator "Sedang buka / Sedang tutup" berdasarkan jam saat ini di zona WITA.
 * Sumber jadwal: `contact.officeHoursSchema` (format openingHours schema.org,
 * mis. "Mo-Fr 08:00-17:00", "Sa 09:00-15:00"), jadi cukup ubah konten bila jam kantor berubah.
 *
 * - Dirender hanya di klien (setelah mount) agar tidak terjadi hydration mismatch
 *   karena waktu server ≠ waktu pengunjung. Tanpa JS, indikator tidak tampil dan
 *   jam operasional tetap terbaca dari teks di atasnya.
 * - Diperbarui tiap menit.
 * - Belum memperhitungkan hari libur nasional — teks jam operasional tetap acuan utama.
 */

const DAY_CODES = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"] as const;
const DAY_NAMES = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
const WEEKDAY_INDEX: Record<string, number> = {
  Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4, Sat: 5, Sun: 6,
};

type Schedule = Array<{ open: number; close: number } | null>;

/** "Mo-Fr 08:00-16:00", "Sa 08:00-12:00", "Mo,We 09:00-15:00" -> jadwal per hari (menit) */
function parseSchedule(entries: readonly string[]): Schedule {
  const schedule: Schedule = Array(7).fill(null);
  const toMinutes = (time: string) => {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
  };
  for (const entry of entries) {
    const [days, hours] = entry.trim().split(/\s+/);
    if (!days || !hours) continue;
    const [open, close] = hours.split("-").map(toMinutes);
    for (const part of days.split(",")) {
      const [from, to = from] = part.split("-");
      const start = DAY_CODES.indexOf(from as (typeof DAY_CODES)[number]);
      const end = DAY_CODES.indexOf(to as (typeof DAY_CODES)[number]);
      if (start < 0 || end < 0) continue;
      for (let d = start; ; d = (d + 1) % 7) {
        schedule[d] = { open, close };
        if (d === end) break;
      }
    }
  }
  return schedule;
}

const formatTime = (minutes: number) =>
  `${String(Math.floor(minutes / 60)).padStart(2, "0")}.${String(minutes % 60).padStart(2, "0")}`;

function getStatus(schedule: Schedule, now: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: contact.timeZone,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  const today = WEEKDAY_INDEX[get("weekday")] ?? 0;
  const minutes = Number(get("hour")) * 60 + Number(get("minute"));
  const t = infoKantor.officeStatus;

  const todayHours = schedule[today];
  if (todayHours && minutes >= todayHours.open && minutes < todayHours.close) {
    return { isOpen: true, detail: `${t.closesAt} ${formatTime(todayHours.close)}` };
  }
  if (todayHours && minutes < todayHours.open) {
    return { isOpen: false, detail: `${t.opensToday} ${formatTime(todayHours.open)}` };
  }
  for (let offset = 1; offset <= 7; offset++) {
    const day = (today + offset) % 7;
    const hours = schedule[day];
    if (!hours) continue;
    const when = offset === 1 ? t.opensTomorrow : `${t.opensOn} ${DAY_NAMES[day]}`;
    return { isOpen: false, detail: `${when} ${formatTime(hours.open)}` };
  }
  return { isOpen: false, detail: "" };
}

const schedule = parseSchedule(contact.officeHoursSchema);

export default function OfficeStatus({ className = "" }: { className?: string }) {
  const [status, setStatus] = useState<ReturnType<typeof getStatus> | null>(null);

  useEffect(() => {
    const update = () => setStatus(getStatus(schedule, new Date()));
    update();
    const timer = window.setInterval(update, 60_000);
    return () => window.clearInterval(timer);
  }, []);

  if (!status) return null;

  // Pill hanya memuat status singkat (tidak pernah terlipat); keterangan jam di sampingnya
  // boleh turun baris di layar sempit.
  return (
    <span className={`flex flex-wrap items-center gap-x-2.5 gap-y-1 ${className}`}>
      <span
        className={`inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${
          status.isOpen
            ? "bg-emerald-50 text-emerald-800 ring-1 ring-inset ring-emerald-200"
            : "bg-navy-50 text-navy-700 ring-1 ring-inset ring-navy-100"
        }`}
      >
        <span aria-hidden="true" className="relative flex h-2 w-2">
          {status.isOpen && (
            <span className="absolute inset-0 animate-ping rounded-full bg-emerald-500 opacity-60" />
          )}
          <span
            className={`relative h-2 w-2 rounded-full ${status.isOpen ? "bg-emerald-600" : "bg-navy-400"}`}
          />
        </span>
        {status.isOpen ? infoKantor.officeStatus.open : infoKantor.officeStatus.closed}
      </span>
      {status.detail && (
        <span className="text-sm text-navy-600">
          <span className="sr-only">, </span>
          {status.detail}
        </span>
      )}
    </span>
  );
}
