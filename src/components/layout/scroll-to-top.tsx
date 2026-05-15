"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";

/* ─── Scroll-to-top button ────────────────────────────────────
   Shows when the page's first <section> (the hero on every page)
   has scrolled fully out of the viewport. Hides when the hero
   re-enters view or when the user is back at the top.

   Watches `pathname` so it re-binds to the correct hero on route
   change (Next.js client-side navigation keeps the layout mounted).
   ────────────────────────────────────────────────────────────── */
export function ScrollToTop() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    /* Hide admin pages — they have their own UI rules. */
    if (pathname?.startsWith("/admin")) {
      setVisible(false);
      return;
    }

    /* Find the page's hero. Each route uses the same pattern:
       <main> ... <section> hero </section> ... </main>
       so we grab the first <section> inside <main>. Fall back to
       any first <section> if there's no <main>. */
    const hero =
      document.querySelector<HTMLElement>("main section") ||
      document.querySelector<HTMLElement>("section");
    if (!hero) {
      setVisible(false);
      return;
    }

    /* The button is visible when the hero is NOT intersecting the
       viewport — i.e. the user has scrolled past the first screen. */
    const io = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0 }
    );
    io.observe(hero);
    return () => io.disconnect();
  }, [pathname]);

  function handleClick() {
    if (typeof window === "undefined") return;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    window.scrollTo({
      top: 0,
      behavior: reducedMotion ? "auto" : "smooth",
    });
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={handleClick}
          aria-label="Scroll to top"
          initial={{ opacity: 0, scale: 0.8, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 12 }}
          transition={{ duration: 0.3, ease: [0.2, 0.7, 0.2, 1] }}
          className="fixed bottom-5 right-5 md:bottom-7 md:right-7 z-[60] group cursor-pointer"
        >
          <span
            className="relative grid place-items-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-stone-900 text-stone-50 shadow-[0_18px_36px_-14px_rgba(15,12,8,0.5)] hover:bg-[#FF6600] hover:text-stone-900 transition-colors duration-300"
          >
            {/* progress ring shows page-scroll % */}
            <ProgressRing />
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden
              className="relative z-10 transition-transform group-hover:-translate-y-0.5"
            >
              <path
                d="M8 13 L8 3 M3 8 L8 3 L13 8"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>

          {/* tooltip on desktop */}
          <span className="hidden md:inline-block absolute right-[calc(100%+12px)] top-1/2 -translate-y-1/2 whitespace-nowrap font-jakarta text-[10.5px] font-semibold uppercase tracking-[0.22em] text-stone-700 bg-[#FAF7F2] border border-stone-900/10 rounded-full px-3 py-1.5 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-300">
            Back to top
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}

/* Thin orange ring that fills as the page scrolls — gives the
   button some life and indicates how deep into the page you are. */
function ProgressRing() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function onScroll() {
      const el = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      const pct = max > 0 ? Math.min(1, el.scrollTop / max) : 0;
      setProgress(pct);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const circumference = 2 * Math.PI * 22; // r=22 → circumference ≈ 138.23

  return (
    <svg
      aria-hidden
      viewBox="0 0 48 48"
      className="absolute inset-0 w-full h-full -rotate-90"
    >
      <circle
        cx="24"
        cy="24"
        r="22"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.15"
        strokeWidth="1.5"
      />
      <circle
        cx="24"
        cy="24"
        r="22"
        fill="none"
        stroke="#FF6600"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={circumference * (1 - progress)}
        style={{ transition: "stroke-dashoffset 120ms ease-out" }}
      />
    </svg>
  );
}
