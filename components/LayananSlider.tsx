"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { layanan } from "@/content/site-content";
import { PauseIcon, PlayIcon } from "@/components/icons";

/**
 * Slider kartu layanan — HANYA untuk layout mobile (< 768px).
 * Di >= md komponen ini berubah menjadi grid biasa lewat class Tailwind
 * (track `flex` -> `md:grid`), autoplay dimatikan, dan kontrol disembunyikan.
 *
 * Mekanisme geser memakai scroll-snap native (bukan transform), jadi:
 *  - swipe jari terasa normal dan tetap jalan meski JS gagal dimuat
 *  - tanpa JS: kartu tetap bisa digeser manual, hanya tidak berpindah otomatis
 *
 * WCAG 2.2.2 (Pause, Stop, Hide) — konten bergerak otomatis lebih dari 5 detik
 * WAJIB punya tombol jeda. Karena itu ada tombol pause/play yang terlihat, dan
 * autoplay otomatis berhenti pada kondisi berikut:
 *  - pengguna menyetel `prefers-reduced-motion: reduce` (tidak pernah jalan)
 *  - pengguna menyentuh/menggeser track atau memfokuskan isinya
 *  - tab browser tidak aktif
 *  - viewport sudah >= md (grid, tidak ada yang perlu digeser)
 */

const AUTOPLAY_INTERVAL_MS = 6000;

type Slide = {
  id: string;
  node: ReactNode;
};

export default function LayananSlider({ slides }: { slides: Slide[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  /** Jeda sementara karena interaksi pengguna — tidak mengubah tombol pause/play */
  const [isInteracting, setIsInteracting] = useState(false);
  const [isMobileLayout, setIsMobileLayout] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  /* Deteksi breakpoint + preferensi gerak. Keduanya reaktif terhadap perubahan. */
  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 767px)");
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const sync = () => {
      setIsMobileLayout(mobileQuery.matches);
      setPrefersReducedMotion(motionQuery.matches);
    };

    sync();
    mobileQuery.addEventListener("change", sync);
    motionQuery.addEventListener("change", sync);
    return () => {
      mobileQuery.removeEventListener("change", sync);
      motionQuery.removeEventListener("change", sync);
    };
  }, []);

  const scrollToIndex = useCallback(
    (index: number, smooth = true) => {
      const track = trackRef.current;
      const target = track?.children[index] as HTMLElement | undefined;
      if (!track || !target) return;

      track.scrollTo({
        left: target.offsetLeft - track.offsetLeft,
        behavior: smooth && !prefersReducedMotion ? "smooth" : "auto",
      });
    },
    [prefersReducedMotion],
  );

  /* Autoplay */
  useEffect(() => {
    const active =
      isPlaying && !isInteracting && isMobileLayout && !prefersReducedMotion;
    if (!active) return;

    const timer = window.setInterval(() => {
      // Jangan menggeser saat tab tidak terlihat
      if (document.hidden) return;
      setActiveIndex((current) => {
        const next = (current + 1) % slides.length;
        scrollToIndex(next);
        return next;
      });
    }, AUTOPLAY_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [
    isPlaying,
    isInteracting,
    isMobileLayout,
    prefersReducedMotion,
    slides.length,
    scrollToIndex,
  ]);

  /* Sinkronkan indikator saat pengguna menggeser sendiri */
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let frame = 0;
    const onScroll = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const center = track.scrollLeft + track.clientWidth / 2;
        let nearest = 0;
        let smallestDistance = Number.POSITIVE_INFINITY;

        Array.from(track.children).forEach((child, index) => {
          const element = child as HTMLElement;
          const childCenter =
            element.offsetLeft - track.offsetLeft + element.offsetWidth / 2;
          const distance = Math.abs(childCenter - center);
          if (distance < smallestDistance) {
            smallestDistance = distance;
            nearest = index;
          }
        });

        setActiveIndex(nearest);
      });
    };

    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.cancelAnimationFrame(frame);
      track.removeEventListener("scroll", onScroll);
    };
  }, []);

  const total = slides.length;

  return (
    <div
      role="group"
      aria-roledescription="carousel"
      aria-label={layanan.slider.label}
      className="mt-10 lg:mt-12"
    >
      <div
        ref={trackRef}
        /* Jeda sementara selama pengguna berinteraksi */
        onPointerDown={() => setIsInteracting(true)}
        onPointerUp={() => setIsInteracting(false)}
        onPointerCancel={() => setIsInteracting(false)}
        onMouseEnter={() => setIsInteracting(true)}
        onMouseLeave={() => setIsInteracting(false)}
        onFocusCapture={() => setIsInteracting(true)}
        onBlurCapture={() => setIsInteracting(false)}
        className={[
          // Mobile: track scroll-snap horizontal. Margin negatif + padding agar
          // kartu bisa "keluar" dari gutter container tanpa memicu scroll halaman.
          "-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2",
          "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          // >= md: kembali menjadi grid dua kolom, tanpa scroll
          "md:mx-0 md:grid md:grid-cols-2 md:gap-8 md:overflow-visible md:px-0 md:pb-0",
        ].join(" ")}
      >
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            role="group"
            aria-roledescription="slide"
            aria-label={layanan.slider.slideLabel
              .replace("{n}", String(index + 1))
              .replace("{total}", String(total))}
            className="w-[86%] shrink-0 snap-center sm:w-[70%] md:w-auto md:shrink"
          >
            {slide.node}
          </div>
        ))}
      </div>

      {/* Kontrol — hanya relevan di mobile */}
      <div className="mt-5 flex items-center justify-center gap-4 md:hidden">
        <div className="flex items-center gap-2.5">
          {slides.map((slide, index) => {
            const isActive = index === activeIndex;
            return (
              <button
                key={slide.id}
                type="button"
                onClick={() => {
                  setActiveIndex(index);
                  scrollToIndex(index);
                }}
                aria-current={isActive}
                className="inline-flex h-11 w-7 items-center justify-center"
              >
                <span
                  aria-hidden="true"
                  className={`block h-2 rounded-full transition-all duration-200 ${
                    isActive ? "w-6 bg-navy-800" : "w-2 bg-navy-300"
                  }`}
                />
                <span className="sr-only">
                  {layanan.slider.goToSlide.replace("{n}", String(index + 1))}
                </span>
              </button>
            );
          })}
        </div>

        <span className="h-5 w-px bg-navy-200" aria-hidden="true" />

        <button
          type="button"
          onClick={() => setIsPlaying((value) => !value)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-navy-200 text-navy-700 transition-colors hover:bg-navy-50"
        >
          {isPlaying ? (
            <PauseIcon className="h-4 w-4" />
          ) : (
            <PlayIcon className="h-4 w-4" />
          )}
          <span className="sr-only">
            {isPlaying ? layanan.slider.pause : layanan.slider.play}
          </span>
        </button>
      </div>
    </div>
  );
}
