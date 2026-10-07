"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { contact, kontak, nav, navMenu, site, whatsapp } from "@/content/site-content";
import { InstagramIcon, MailIcon, PhoneIcon, SealMark, WhatsAppIcon } from "@/components/icons";
import WhatsAppCta from "@/components/WhatsAppCta";

/** Ikon kontak di kanan navbar desktop — tooltip menampilkan nilai kontaknya */
const iconLinks = [
  {
    key: "whatsapp",
    icon: WhatsAppIcon,
    label: navMenu.iconLinks.whatsapp,
    value: contact.phoneDisplay,
    href: whatsapp.url,
    external: true,
  },
  {
    key: "email",
    icon: MailIcon,
    label: navMenu.iconLinks.email,
    value: contact.email,
    href: `mailto:${contact.email}`,
    external: false,
  },
  {
    key: "instagram",
    icon: InstagramIcon,
    label: navMenu.iconLinks.instagram,
    value: contact.instagramHandle,
    href: contact.instagramUrl,
    external: true,
  },
];

// useLayoutEffect memicu peringatan saat SSR; fallback ke useEffect di server
const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * Header sticky + navigasi anchor.
 * Client component karena butuh state (menu mobile, scroll, section aktif); seluruh teks
 * tetap diambil dari `content/site-content.ts`.
 *
 * Perilaku:
 *  - Di puncak halaman header menyatu dengan Hero (tanpa garis/bayangan); setelah
 *    di-scroll menjadi lebih ringkas dengan latar blur + garis progres baca emas.
 *  - Scrollspy: tautan section yang sedang dibaca ditandai (aria-current) dan
 *    penanda pill bergeser mengikutinya di desktop.
 *  - Menu mobile: panel layar penuh bernomor ala pasal akta.
 *
 * Aksesibilitas:
 *  - <header> + <nav aria-label> sebagai landmark.
 *  - Tombol menu: aria-expanded + aria-controls, label teks untuk screen reader.
 *  - Saat panel terbuka: fokus dikunci di header (Tab berputar), Escape menutup dan
 *    mengembalikan fokus ke tombol pemicu, scroll body dikunci.
 *  - Panel tertutup memakai `visibility: hidden` sehingga keluar dari urutan Tab
 *    dan pohon aksesibilitas, tapi tetap bisa dianimasikan.
 *  - Semua animasi berhenti untuk prefers-reduced-motion (app/globals.css).
 */
export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeHref, setActiveHref] = useState<string | null>(null);
  const [indicator, setIndicator] = useState<{ left: number; width: number } | null>(null);

  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const linkRefs = useRef<Map<string, HTMLAnchorElement>>(new Map());

  const close = useCallback((returnFocus = false) => {
    setIsOpen(false);
    if (returnFocus) toggleRef.current?.focus();
  }, []);

  /* Status scroll + progres baca. Progres ditulis langsung ke DOM agar tidak re-render. */
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      setIsScrolled(y > 8);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`;
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  /* Scrollspy: section yang melintasi pita tengah viewport dianggap aktif. */
  useEffect(() => {
    const sections = nav
      .map((item) => document.querySelector<HTMLElement>(item.href))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveHref(`#${entry.target.id}`);
        }
        // Kembali ke Hero (di atas section pertama) -> tidak ada yang aktif
        if (window.scrollY < sections[0].offsetTop - window.innerHeight / 2) {
          setActiveHref(null);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  /* Posisi penanda pill desktop; dihitung ulang saat lebar tautan berubah (mis. font selesai dimuat). */
  useIsoLayoutEffect(() => {
    const measure = () => {
      const link = activeHref ? linkRefs.current.get(activeHref) : undefined;
      setIndicator(link ? { left: link.offsetLeft, width: link.offsetWidth } : null);
    };
    measure();
    if (!listRef.current) return;
    const observer = new ResizeObserver(measure);
    observer.observe(listRef.current);
    return () => observer.disconnect();
  }, [activeHref]);

  /* Menu mobile: kunci scroll, Escape, kunci fokus, dan tutup otomatis di layar lebar. */
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close(true);
        return;
      }
      if (event.key !== "Tab" || !headerRef.current) return;
      const focusable = Array.from(
        headerRef.current.querySelectorAll<HTMLElement>("a[href], button"),
      ).filter((el) => el.getClientRects().length > 0);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    const desktop = window.matchMedia("(min-width: 1024px)");
    const onBreakpoint = (event: MediaQueryListEvent) => {
      if (event.matches) close();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    desktop.addEventListener("change", onBreakpoint);
    // Pindahkan fokus ke tautan pertama di dalam panel (panel langsung `visible` saat dibuka;
    // visibility hanya dianimasikan saat menutup, agar elemen bisa menerima fokus di sini)
    panelRef.current?.querySelector<HTMLAnchorElement>("a")?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", onBreakpoint);
    };
  }, [isOpen, close]);

  const isSolid = isScrolled || isOpen;

  return (
    <header
      ref={headerRef}
      className={`sticky top-0 z-40 border-b transition-[background-color,border-color,box-shadow] duration-300 ${
        isSolid
          ? "border-navy-100/80 bg-cream-50/95 shadow-[0_8px_24px_-18px_rgba(10,22,40,0.35)] backdrop-blur-md supports-[backdrop-filter]:bg-cream-50/[0.93]"
          : "border-transparent bg-cream-50"
      }`}
    >
      <div
        className={`container-content flex items-center justify-between gap-2 transition-[height] sm:gap-4 duration-300 ${
          isScrolled ? "h-16" : "h-16 sm:h-20"
        }`}
      >
        {/* Wordmark */}
        <a
          href="#konten-utama"
          onClick={() => close()}
          className="group flex min-w-0 items-center gap-2.5 rounded-md py-1 sm:gap-3"
          aria-label={`${site.officeName} — ke awal halaman`}
        >
          <SealMark
            className={`shrink-0 text-gold-600 transition-[transform,width,height] duration-500 ease-out group-hover:rotate-[20deg] ${
              isScrolled ? "h-9 w-9" : "h-9 w-9 sm:h-10 sm:w-10"
            }`}
          />
          <span className="flex min-w-0 flex-col leading-tight">
            <span className="truncate font-serif text-[0.95rem] font-semibold text-navy-950 sm:text-base">
              {site.notaryName}
            </span>
            <span className="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-gold-700 sm:text-[0.68rem]">
              Notaris &amp; PPAT
            </span>
          </span>
        </a>

        {/* Navigasi desktop */}
        <nav aria-label="Navigasi utama" className="hidden lg:block">
          <ul
            ref={listRef}
            className="relative flex items-center gap-0.5 rounded-full border border-navy-100/80 bg-cream-50/60 p-1"
          >
            {/* Penanda section aktif — bergeser antar tautan */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-1 left-0 rounded-full bg-navy-900 shadow-card transition-[transform,width,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{
                width: indicator?.width ?? 0,
                transform: `translateX(${indicator?.left ?? 0}px)`,
                opacity: indicator ? 1 : 0,
              }}
            />
            {nav.map((item) => {
              const isActive = item.href === activeHref;
              return (
                <li key={item.href}>
                  <a
                    ref={(el) => {
                      if (el) linkRefs.current.set(item.href, el);
                      else linkRefs.current.delete(item.href);
                    }}
                    href={item.href}
                    aria-current={isActive ? "true" : undefined}
                    className={`relative inline-flex min-h-10 items-center whitespace-nowrap rounded-full px-4 text-sm font-medium transition-colors duration-300 ${
                      isActive
                        ? "text-cream-50"
                        : "text-navy-700 hover:bg-navy-50 hover:text-navy-950"
                    }`}
                  >
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        {/*
          Kontak ringkas sebagai ikon (>= 1280px). Tombol WhatsApp besar sengaja tidak dipakai
          di bar navigasi (keputusan pemilik, 8 Okt 2026). Di 1024–1279px ruangnya tidak cukup,
          di mobile kontak ada di panel menu.
        */}
        <ul className="hidden shrink-0 items-center gap-2 border-l border-navy-100 pl-4 xl:flex">
          {iconLinks.map((link) => (
            <li key={link.key} className="group/icon relative">
              <a
                href={link.href}
                {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-navy-200 text-navy-700 transition-colors duration-200 hover:border-navy-900 hover:bg-navy-900 hover:text-gold-300"
              >
                <link.icon className="h-[1.125rem] w-[1.125rem]" />
                <span className="sr-only">
                  {link.label} {link.value}
                  {link.external && ` ${navMenu.iconLinks.newTab}`}
                </span>
              </a>
              {/* Tooltip visual; nama aksesibel sudah dibawa sr-only di atas */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-full z-10 mt-2 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-md bg-navy-900 px-2.5 py-1.5 text-xs font-medium text-cream-50 opacity-0 shadow-card transition-[opacity,transform] duration-200 group-focus-within/icon:translate-y-0 group-focus-within/icon:opacity-100 group-hover/icon:translate-y-0 group-hover/icon:opacity-100"
              >
                {link.value}
              </span>
            </li>
          ))}
        </ul>

        <div className="flex shrink-0 items-center gap-2 lg:hidden">
          {/* Tombol menu mobile — garis hamburger berubah menjadi X */}
          <button
            ref={toggleRef}
            type="button"
            onClick={() => setIsOpen((value) => !value)}
            aria-expanded={isOpen}
            aria-controls="menu-mobile"
            className="relative -mr-2 inline-flex h-11 w-11 items-center justify-center rounded-full text-navy-900 sm:mr-0 transition-colors hover:bg-navy-50"
          >
            <span aria-hidden="true" className="relative block h-3.5 w-5">
              <span
                className={`absolute left-0 top-0 h-0.5 w-5 rounded-full bg-current transition-transform duration-300 ease-out ${
                  isOpen ? "translate-y-[6px] rotate-45" : ""
                }`}
              />
              <span
                className={`absolute left-0 top-[6px] h-0.5 rounded-full bg-current transition-[width,opacity] duration-300 ${
                  isOpen ? "w-0 opacity-0" : "w-3.5 opacity-100"
                }`}
              />
              <span
                className={`absolute left-0 top-3 h-0.5 w-5 rounded-full bg-current transition-transform duration-300 ease-out ${
                  isOpen ? "-translate-y-[6px] -rotate-45" : ""
                }`}
              />
            </span>
            <span className="sr-only">
              {isOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
            </span>
          </button>
        </div>
      </div>

      {/* Garis progres baca */}
      <span
        ref={progressRef}
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-0 bottom-[-1px] h-0.5 origin-left bg-gradient-to-r from-gold-500 to-gold-300 transition-opacity duration-300 ${
          isScrolled && !isOpen ? "opacity-100" : "opacity-0"
        }`}
        style={{ transform: "scaleX(0)" }}
      />

      {/* Panel navigasi mobile — mengisi sisa tinggi layar di bawah header */}
      <div
        id="menu-mobile"
        ref={panelRef}
        className={`absolute inset-x-0 top-full h-[calc(100dvh-100%)] overflow-y-auto border-t border-navy-100 bg-cream-50 duration-300 ease-out lg:hidden ${
          isOpen
            ? "visible translate-y-0 opacity-100 transition-[opacity,transform]"
            : "invisible -translate-y-2 opacity-0 transition-[opacity,transform,visibility]"
        }`}
      >
        <nav
          aria-label="Navigasi utama (mobile)"
          className="container-content flex min-h-full flex-col py-6"
        >
          <p className="eyebrow">{navMenu.tocTitle}</p>
          <ol className="mt-3 flex flex-col">
            {nav.map((item, index) => {
              const isActive = item.href === activeHref;
              return (
                <li
                  key={item.href}
                  className={`border-b border-navy-100 transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isOpen ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
                  }`}
                  style={{ transitionDelay: isOpen ? `${80 + index * 45}ms` : "0ms" }}
                >
                  <a
                    href={item.href}
                    onClick={() => close()}
                    aria-current={isActive ? "true" : undefined}
                    className="group flex min-h-14 items-baseline gap-4 py-3"
                  >
                    <span
                      aria-hidden="true"
                      className="w-7 shrink-0 font-sans text-xs font-semibold tabular-nums tracking-[0.12em] text-gold-700"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={`font-serif text-2xl transition-colors ${
                        isActive ? "text-gold-700" : "text-navy-950 group-hover:text-gold-700"
                      }`}
                    >
                      {item.label}
                    </span>
                  </a>
                </li>
              );
            })}
          </ol>

          <div
            className={`mt-auto pt-8 transition-[opacity,transform] duration-500 ${
              isOpen ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
            }`}
            style={{ transitionDelay: isOpen ? `${80 + nav.length * 45}ms` : "0ms" }}
          >
            <WhatsAppCta
              label={kontak.whatsappCta.label}
              ariaLabel={kontak.whatsappCta.ariaLabel}
              size="lg"
              className="w-full"
            />
            <a
              href={`tel:+${contact.phoneIntl}`}
              className="mt-3 flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-navy-300 text-base font-semibold text-navy-900 transition-colors hover:bg-navy-50"
            >
              <PhoneIcon className="h-4 w-4" />
              {contact.phoneDisplay}
            </a>
            <p className="mt-5 text-center text-sm text-navy-600">{contact.addressFull}</p>
          </div>
        </nav>
      </div>
    </header>
  );
}
