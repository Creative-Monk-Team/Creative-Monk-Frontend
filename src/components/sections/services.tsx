"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { homepageContentApi } from "@/lib/api";

type Bucket = {
  roman: string;
  eyebrow: string;
  italic: string;
  title: string;
  description: string;
  deliverables: string[];
  timeline: string;
  deliverableCount: string;
  href: string;
  accent: string;
  panelTone: string;
  panelInverted?: boolean;
  priceFrom?: string;
};

/* Fallback bucket list — used only if the API fetch fails. Source of
   truth lives in DB; seed it via Creative-Monk-Backend/scripts/
   seed-homepage-content.js. Edit copy in /admin/super/homepage/services. */
const FALLBACK_buckets: Bucket[] = [
  {
    roman: "I",
    eyebrow: "Brand & Identity",
    italic: "to feel",
    title: "Brands customers remember",
    description:
      "Logo, naming, identity system and packaging built around your real difference — so you stop looking like every other agency's portfolio piece and start commanding pricing power.",
    deliverables: [
      "Logo & wordmark system",
      "Full identity guidelines",
      "Brand strategy & naming",
      "Packaging & print",
      "Social-ready visual system",
      "30-day post-launch support",
    ],
    timeline: "4–6 weeks",
    deliverableCount: "12+ assets",
    priceFrom: "From ₹1.5L · fixed scope",
    href: "/services/branding",
    accent: "#FF6600",
    panelTone: "var(--paper-warm, #f3eee2)",
  },
  {
    roman: "II",
    eyebrow: "Web & Performance",
    italic: "to convert",
    title: "Websites that close leads",
    description:
      "Fast, SEO-clean, conversion-tuned sites paired with a paid-media engine that pays back. Average client sees +312% qualified leads in the first 90 days.",
    deliverables: [
      "Web design & build",
      "Conversion optimisation",
      "SEO foundation + content plan",
      "Google + Meta ad management",
      "Landing pages for paid traffic",
      "Shopify / WordPress / Bespoke",
    ],
    timeline: "6–10 weeks",
    deliverableCount: "20+ deliverables",
    priceFrom: "From ₹2.5L · fixed scope",
    href: "/services/web-development",
    accent: "#0F0C08",
    panelTone: "#ECE5D6",
  },
  {
    roman: "III",
    eyebrow: "Motion & Story",
    italic: "to spread",
    title: "Content that earns shares",
    description:
      "Brand films, social reels, product photography and editorial direction that travel further than ads — because they're built to be watched, not skipped.",
    deliverables: [
      "Brand films & founder reels",
      "Short-form social reels (Insta · YT)",
      "Product photography",
      "Animation & motion graphics",
      "Monthly social strategy",
      "Editorial direction",
    ],
    timeline: "3–5 weeks",
    deliverableCount: "Full quarterly library",
    priceFrom: "From ₹1L · monthly or one-shot",
    href: "/services/social-media-marketing",
    accent: "#4A5D3A",
    panelTone: "#1A1410",
    panelInverted: true,
  },
];

export function Services() {
  const [buckets, setBuckets] = useState<Bucket[]>(FALLBACK_buckets);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    let cancelled = false;
    homepageContentApi
      .get<{ buckets?: Bucket[] }>("services_deck")
      .then((data) => {
        if (cancelled || !data?.buckets?.length) return;
        setBuckets(data.buckets);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const active = buckets[activeIndex] ?? buckets[0];

  return (
    <section
      id="services"
      className="relative bg-[#FAF7F2] border-t border-stone-900/10 overflow-hidden"
      aria-label="Services"
    >
      <div className="hero-grain-paper" aria-hidden />

      <div className="container relative z-10 py-20 md:py-28">
        {/* Header */}
        <div className="grid grid-cols-12 gap-x-8 gap-y-8 items-end mb-14 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="col-span-12 md:col-span-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <span aria-hidden className="block h-px w-9 bg-[#FF6600]" />
              <span className="font-jakarta text-[11px] font-semibold uppercase tracking-[0.26em] text-stone-600">
                What we do
              </span>
            </div>
            <h2 className="font-funnel text-stone-900 font-bold leading-[0.98] tracking-[-0.035em] text-[clamp(2.25rem,5vw,4.5rem)] max-w-[18ch]">
              Three things we do.{" "}
              <span
                style={{
                  fontFamily: "var(--font-newsreader), Georgia, serif",
                  fontStyle: "italic",
                  fontWeight: 500,
                  color: "#1c1c1c",
                }}
              >
                All of them well.
              </span>
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="col-span-12 md:col-span-4"
          >
            <p className="font-jakarta text-[15.5px] md:text-[16.5px] leading-[1.55] text-stone-700 max-w-[44ch]">
              Not 47 service line-items. Three buckets where the work compounds.
              Hover a tab to see what's inside.
            </p>
          </motion.div>
        </div>

        {/* Interactive tab layout — tabs left, preview right */}
        <div className="grid grid-cols-12 gap-5 md:gap-7 rounded-[32px] border border-stone-900/10 bg-stone-50 overflow-hidden">
          {/* Tabs column */}
          <div className="col-span-12 lg:col-span-5 flex flex-col">
            {buckets.map((b, i) => {
              const isActive = i === activeIndex;
              return (
                <button
                  key={b.roman}
                  type="button"
                  onMouseEnter={() => setActiveIndex(i)}
                  onClick={() => setActiveIndex(i)}
                  aria-pressed={isActive}
                  className={`group relative text-left p-7 md:p-8 lg:p-10 cursor-pointer transition-all duration-500 overflow-hidden border-stone-900/10 ${
                    i < buckets.length - 1 ? "border-b" : ""
                  } ${
                    isActive
                      ? "bg-white"
                      : "bg-stone-50 hover:bg-white/40"
                  }`}
                >
                  {/* Active accent bar on the left */}
                  <motion.span
                    aria-hidden
                    animate={{ scaleY: isActive ? 1 : 0 }}
                    transition={{ duration: 0.5, ease: [0.2, 0.7, 0.2, 1] }}
                    style={{ background: b.accent, transformOrigin: "top" }}
                    className="absolute left-0 top-0 bottom-0 w-[3px]"
                  />

                  <div className="flex items-start gap-5 md:gap-6">
                    {/* Roman numeral */}
                    <span
                      className="shrink-0 leading-none tracking-[-0.04em] transition-all duration-500"
                      style={{
                        fontFamily: "var(--font-newsreader), Georgia, serif",
                        fontStyle: "italic",
                        fontWeight: 500,
                        fontSize: isActive ? "clamp(3.5rem, 5vw, 5rem)" : "clamp(2.25rem, 3.2vw, 3.2rem)",
                        color: isActive ? b.accent : "#1c1c1c",
                        opacity: isActive ? 1 : 0.35,
                      }}
                    >
                      {b.roman}
                    </span>

                    <div className="flex-1 min-w-0">
                      {/* Eyebrow chip */}
                      <div className="flex items-center gap-2 mb-3">
                        <span
                          className="block w-1.5 h-1.5 rounded-full transition-all duration-300"
                          style={{
                            background: b.accent,
                            opacity: isActive ? 1 : 0.3,
                          }}
                        />
                        <span
                          className={`font-jakarta text-[10.5px] font-semibold uppercase tracking-[0.22em] transition-colors duration-300 ${
                            isActive ? "text-stone-900" : "text-stone-500"
                          }`}
                        >
                          {b.eyebrow}
                        </span>
                      </div>

                      {/* Title */}
                      <h3
                        className={`font-funnel font-bold tracking-[-0.025em] leading-[1.1] transition-all duration-500 ${
                          isActive
                            ? "text-stone-900 text-[clamp(1.5rem,2.2vw,1.95rem)]"
                            : "text-stone-500 text-[clamp(1.25rem,1.7vw,1.55rem)]"
                        }`}
                      >
                        {b.title}
                        <span
                          className="block mt-1 text-[0.65em]"
                          style={{
                            fontFamily: "var(--font-newsreader), Georgia, serif",
                            fontStyle: "italic",
                            fontWeight: 500,
                            color: isActive
                              ? b.accent === "#0F0C08"
                                ? "#1c1c1c"
                                : b.accent
                              : "#a8a29e",
                          }}
                        >
                          — {b.italic}.
                        </span>
                      </h3>

                      {/* Expand-on-active description */}
                      <AnimatePresence>
                        {isActive && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.4, ease: [0.2, 0.7, 0.2, 1] }}
                            className="overflow-hidden"
                          >
                            <p className="mt-5 font-jakarta text-[14.5px] leading-[1.6] text-stone-600 max-w-[44ch]">
                              {b.description}
                            </p>
                            <div className="mt-6 flex items-center gap-5 font-jakarta text-[10.5px] font-semibold uppercase tracking-[0.18em]">
                              <span className="flex items-center gap-2">
                                <span className="text-stone-400">Timeline</span>
                                <span className="text-stone-900">{b.timeline}</span>
                              </span>
                              <span className="w-px h-3 bg-stone-300" aria-hidden />
                              <span className="flex items-center gap-2">
                                <span className="text-stone-400">Includes</span>
                                <span className="text-stone-900">
                                  {b.deliverableCount}
                                </span>
                              </span>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Arrow indicator */}
                    <span
                      className={`shrink-0 grid place-items-center w-10 h-10 rounded-full transition-all duration-500 ${
                        isActive
                          ? "bg-stone-900 text-stone-50 rotate-[-25deg]"
                          : "bg-transparent text-stone-400 border border-stone-900/10"
                      }`}
                      aria-hidden
                    >
                      <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                        <path
                          d="M2 12 L12 2 M5 2 L12 2 L12 9"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Preview panel — purely typographic, flex column to avoid overlap */}
          <div
            className="col-span-12 lg:col-span-7 relative overflow-hidden transition-colors duration-700 flex flex-col"
            style={{ background: active.panelTone }}
          >
            <div className="hero-grain-paper" aria-hidden />

            {/* atmospheric gradient based on accent */}
            <div
              aria-hidden
              className="absolute inset-0 pointer-events-none transition-opacity duration-700"
              style={{
                background: `radial-gradient(ellipse 60% 60% at 100% 0%, ${active.accent}22, transparent 60%)`,
              }}
            />

            {/* Background Roman numeral — clipped to the top half so it never
                crosses the deliverables card. Pure background watermark. */}
            <div
              aria-hidden
              className="absolute top-0 right-0 left-0 h-[55%] pointer-events-none overflow-hidden"
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={`r-${active.roman}`}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.7, ease: [0.2, 0.7, 0.2, 1] }}
                  className="absolute -top-[14%] right-[-4%] leading-[0.8] tracking-[-0.06em] font-bold select-none"
                  style={{
                    fontFamily: "var(--font-newsreader), Georgia, serif",
                    fontStyle: "italic",
                    fontWeight: 500,
                    fontSize: "clamp(10rem, 22vw, 19rem)",
                    color: active.panelInverted ? "#FAF7F2" : active.accent,
                    opacity: active.panelInverted ? 0.10 : 0.10,
                  }}
                >
                  {active.roman}
                </motion.span>
              </AnimatePresence>
            </div>

            {/* TOP — eyebrow + pill */}
            <div className="relative z-10 flex items-center justify-between gap-3 px-7 md:px-9 pt-7 md:pt-9">
              <div className="flex items-center gap-2.5">
                <span
                  className="block w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ background: active.accent }}
                />
                <span
                  className={`font-jakarta text-[10.5px] font-semibold uppercase tracking-[0.24em] ${
                    active.panelInverted ? "text-stone-300" : "text-stone-600"
                  }`}
                >
                  Tab {String(activeIndex + 1).padStart(2, "0")} / 03 · {active.eyebrow}
                </span>
              </div>
              <span
                className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1 font-jakarta text-[9.5px] font-semibold uppercase tracking-[0.22em] shrink-0 ${
                  active.panelInverted
                    ? "border-stone-50/25 text-stone-50/90 bg-stone-50/[0.04]"
                    : "border-stone-900/15 text-stone-700 bg-stone-50/60"
                }`}
              >
                {active.timeline}
              </span>
            </div>

            {/* MIDDLE — editorial title block (flex-1, vertically centered) */}
            <div className="relative z-10 flex-1 flex flex-col justify-center px-7 md:px-9 py-12 md:py-16">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`title-${active.roman}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.5, ease: [0.2, 0.7, 0.2, 1] }}
                  className="max-w-[24ch]"
                >
                  <h3
                    className={`font-funnel font-bold leading-[0.98] tracking-[-0.035em] text-[clamp(2rem,3.8vw,3.1rem)] ${
                      active.panelInverted ? "text-stone-50" : "text-stone-900"
                    }`}
                  >
                    {active.title}
                  </h3>
                  <p
                    className="mt-3 text-[clamp(1rem,1.4vw,1.25rem)] leading-[1.2]"
                    style={{
                      fontFamily: "var(--font-newsreader), Georgia, serif",
                      fontStyle: "italic",
                      fontWeight: 400,
                      color: active.panelInverted
                        ? "#FF6600"
                        : active.accent === "#0F0C08"
                          ? "#1c1c1c"
                          : active.accent,
                    }}
                  >
                    — {active.italic}.
                  </p>
                  <p
                    className={`mt-6 font-jakarta text-[14.5px] md:text-[15.5px] leading-[1.6] max-w-[44ch] ${
                      active.panelInverted ? "text-stone-200/90" : "text-stone-700"
                    }`}
                  >
                    {active.description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* BOTTOM — deliverables card, naturally placed, no overlap */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`bottom-${active.roman}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5, delay: 0.05 }}
                className={`relative z-10 mx-7 md:mx-9 mb-7 md:mb-9 rounded-2xl border p-5 md:p-6 backdrop-blur-sm ${
                  active.panelInverted
                    ? "border-stone-50/20 bg-[#0F0C08]/85"
                    : "border-stone-900/10 bg-[#FAF7F2]/95"
                }`}
              >
                <p
                  className={`font-jakarta text-[10px] font-semibold uppercase tracking-[0.22em] mb-3 flex items-center gap-2 ${
                    active.panelInverted ? "text-stone-300" : "text-stone-500"
                  }`}
                >
                  <span
                    className="block w-1 h-1 rounded-full"
                    style={{ background: active.accent }}
                  />
                  What's inside · {active.deliverableCount}
                </p>
                <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5 mb-5">
                  {active.deliverables.map((d, i) => (
                    <li
                      key={d}
                      className={`flex items-baseline gap-2 font-jakarta text-[12.5px] ${
                        active.panelInverted ? "text-stone-100" : "text-stone-700"
                      }`}
                    >
                      <span
                        className="font-mono-ui text-[9.5px] tabular-nums shrink-0"
                        style={{ color: active.accent }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {d}
                    </li>
                  ))}
                </ul>

                <div
                  className={`pt-4 border-t flex items-center justify-between gap-4 ${
                    active.panelInverted ? "border-stone-50/15" : "border-stone-900/10"
                  }`}
                >
                  <span
                    className={`font-jakarta text-[10.5px] font-semibold uppercase tracking-[0.2em] ${
                      active.panelInverted ? "text-stone-400" : "text-stone-500"
                    }`}
                  >
                    {active.timeline}
                  </span>
                  <Link
                    href={active.href}
                    className={`group/exp inline-flex items-center gap-2 font-jakarta text-[11.5px] font-semibold uppercase tracking-[0.22em] cursor-pointer ${
                      active.panelInverted ? "text-stone-50" : "text-stone-900"
                    }`}
                  >
                    <span className="relative">
                      Explore
                      <span
                        className={`absolute left-0 -bottom-1 h-px w-full origin-left scale-x-100 group-hover/exp:scale-x-0 transition-transform duration-400 ${
                          active.panelInverted ? "bg-stone-50" : "bg-stone-900"
                        }`}
                      />
                      <span
                        className="absolute left-0 -bottom-1 h-px w-full origin-right scale-x-0 group-hover/exp:scale-x-100 transition-transform duration-400 delay-100"
                        style={{ background: active.accent }}
                      />
                    </span>
                    <svg
                      width="18"
                      height="9"
                      viewBox="0 0 22 10"
                      fill="none"
                      className="group-hover/exp:translate-x-1 transition-transform"
                    >
                      <path
                        d="M1 5 H 20 M 16 1 L 20 5 L 16 9"
                        stroke="currentColor"
                        strokeWidth="1.3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom — Calendly band */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7 }}
          className="mt-14 md:mt-16 rounded-3xl border border-stone-900/10 bg-stone-900 text-stone-50 p-7 md:p-9 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
        >
          <div className="max-w-2xl">
            <p className="font-jakarta text-[10.5px] font-semibold uppercase tracking-[0.24em] text-stone-400 mb-3">
              Still unsure which bucket fits?
            </p>
            <h3 className="font-funnel text-[clamp(1.5rem,2.4vw,2rem)] leading-[1.1] tracking-[-0.025em] font-bold text-stone-50">
              We'll scope it with you in{" "}
              <span
                style={{
                  fontFamily: "var(--font-newsreader), Georgia, serif",
                  fontStyle: "italic",
                  fontWeight: 500,
                  color: "#FF6600",
                }}
              >
                a thirty-minute call.
              </span>
            </h3>
            <p className="mt-3 font-jakarta text-[14.5px] leading-[1.55] text-stone-300 max-w-[52ch]">
              No discovery decks, no demo. Just a real conversation about what
              you're building and whether we're the right fit.
            </p>
          </div>

          <Link
            href="/contact"
            className="group relative inline-flex items-center gap-3 rounded-full bg-stone-50 text-stone-900 pl-6 pr-2 py-2 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-[0_18px_40px_-18px_rgba(255,102,0,0.55)] shrink-0"
          >
            <span className="relative font-funnel text-[15px] font-semibold tracking-tight">
              Book a 30-min call
            </span>
            <span className="relative inline-grid place-items-center w-10 h-10 rounded-full bg-[#FF6600] text-stone-900 group-hover:bg-stone-900 group-hover:text-stone-50 group-hover:rotate-[-30deg] transition-all duration-300">
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                <path
                  d="M2 12 L12 2 M5 2 L12 2 L12 9"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
