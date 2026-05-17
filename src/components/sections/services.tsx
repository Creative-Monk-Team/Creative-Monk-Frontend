"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { homepageContentApi } from "@/lib/api";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { Magnetic } from "@/components/motion/magnetic";

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

const FALLBACK_BUCKETS: Bucket[] = [
  {
    roman: "I",
    eyebrow: "Brand & Identity",
    italic: "to feel",
    title: "Brands customers remember",
    description:
      "Logo, naming, identity system and packaging built around your real difference — so you stop looking like every other agency's portfolio piece and start commanding pricing power.",
    deliverables: ["Logo & wordmark system","Full identity guidelines","Brand strategy & naming","Packaging & print","Social-ready visual system","30-day post-launch support"],
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
    deliverables: ["Web design & build","Conversion optimisation","SEO foundation + content plan","Google + Meta ad management","Landing pages for paid traffic","Shopify / WordPress / Bespoke"],
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
    deliverables: ["Brand films & founder reels","Short-form social reels (Insta · YT)","Product photography","Animation & motion graphics","Monthly social strategy","Editorial direction"],
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
  const [buckets, setBuckets] = useState<Bucket[]>(FALLBACK_BUCKETS);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    let cancelled = false;
    homepageContentApi
      .get<{ buckets?: Bucket[] }>("services_deck")
      .then((data) => {
        if (cancelled || !data?.buckets?.length) return;
        setBuckets(data.buckets);
      });
    return () => { cancelled = true; };
  }, []);

  const active = buckets[activeIndex] ?? buckets[0];

  return (
    <section
      id="services"
      className="relative overflow-hidden"
      style={{ background: "var(--site-bg-soft, #14110E)", color: "var(--site-fg)" }}
      aria-label="Services"
    >
      <div className="container relative z-10 py-24 md:py-32">
        {/* Header */}
        <div className="grid grid-cols-12 gap-x-8 gap-y-8 items-end mb-16 md:mb-20">
          <ScrollReveal className="col-span-12 md:col-span-8">
            <div className="flex items-center gap-3 mb-6">
              <span aria-hidden style={{ display: "block", height: 1, width: 36, background: "var(--site-accent)" }} />
              <span className="site-eyebrow">What we do</span>
            </div>
            <h2
              className="site-display"
              style={{ fontSize: "clamp(2.25rem, 5vw, 4.5rem)", letterSpacing: "-0.03em", lineHeight: 0.96 }}
            >
              Three engines.{" "}
              <span className="site-italic" style={{ color: "var(--site-accent)" }}>
                Each billed for the result.
              </span>
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.15} className="col-span-12 md:col-span-4">
            <p style={{ fontSize: 15, lineHeight: 1.65, color: "var(--site-fg-mute)" }}>
              Pick what your business needs next — or talk to us and we&apos;ll
              tell you which one to start with. Fixed scope, fixed fee, no
              hourly billing.
            </p>
          </ScrollReveal>
        </div>

        {/* Deck */}
        <div
          className="grid grid-cols-12 site-glass overflow-hidden"
          style={{ borderRadius: 32, borderColor: "var(--site-line)" }}
        >
          {/* Tabs */}
          <div className="col-span-12 lg:col-span-5 flex flex-col">
            {buckets.map((b, i) => {
              const isActive = i === activeIndex;
              return (
                <button
                  key={b.roman}
                  type="button"
                  onMouseEnter={() => setActiveIndex(i)}
                  onClick={() => setActiveIndex(i)}
                  data-cursor="link"
                  aria-pressed={isActive}
                  className="group relative text-left p-7 md:p-9 transition-all duration-500 overflow-hidden cursor-pointer"
                  style={{
                    background: isActive ? "rgba(255,102,0,0.04)" : "transparent",
                    borderBottom: i < buckets.length - 1 ? "1px solid var(--site-line)" : "none",
                  }}
                >
                  <span
                    aria-hidden
                    className="absolute left-0 top-0 bottom-0 transition-all duration-500"
                    style={{
                      width: isActive ? 3 : 0,
                      background: "var(--site-accent)",
                      boxShadow: isActive ? "0 0 24px rgba(255,102,0,0.5)" : "none",
                    }}
                  />
                  <div className="flex items-baseline justify-between gap-4 mb-3">
                    <span
                      className="site-mono"
                      style={{
                        fontSize: 10.5,
                        letterSpacing: "0.22em",
                        textTransform: "uppercase",
                        color: isActive ? "var(--site-accent)" : "var(--site-fg-dim)",
                      }}
                    >
                      {b.eyebrow}
                    </span>
                    <span
                      className="site-italic"
                      style={{
                        fontSize: 13,
                        color: isActive ? "var(--site-fg-mute)" : "var(--site-fg-dim)",
                        transition: "color 300ms ease",
                      }}
                    >
                      {b.italic}
                    </span>
                  </div>
                  <h3
                    className="site-display"
                    style={{
                      fontSize: "clamp(1.5rem, 2.4vw, 2.2rem)",
                      letterSpacing: "-0.02em",
                      lineHeight: 1.05,
                      color: isActive ? "var(--site-fg)" : "var(--site-fg-mute)",
                      transition: "color 300ms ease",
                    }}
                  >
                    {b.title}
                  </h3>
                  {b.priceFrom ? (
                    <p
                      className="site-mono mt-4"
                      style={{
                        fontSize: 11,
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        color: isActive ? "var(--site-accent)" : "var(--site-fg-dim)",
                        transition: "color 300ms ease",
                      }}
                    >
                      {b.priceFrom}
                    </p>
                  ) : null}
                </button>
              );
            })}
          </div>

          {/* Preview */}
          <div
            className="col-span-12 lg:col-span-7 relative overflow-hidden"
            style={{ background: "rgba(245,241,232,0.015)", minHeight: 540 }}
          >
            {/* Roman numeral background */}
            <AnimatePresence mode="wait">
              <motion.span
                key={active?.roman}
                aria-hidden
                initial={{ opacity: 0, scale: 0.9, rotateY: -20 }}
                animate={{ opacity: 0.08, scale: 1, rotateY: 0 }}
                exit={{ opacity: 0, scale: 1.1, rotateY: 20 }}
                transition={{ duration: 0.7, ease: [0.2, 0.7, 0.2, 1] }}
                className="absolute right-4 top-4 pointer-events-none select-none site-display"
                style={{
                  fontSize: "clamp(10rem, 18vw, 18rem)",
                  letterSpacing: "-0.05em",
                  lineHeight: 0.85,
                  color: "var(--site-accent)",
                  fontFamily: "var(--font-newsreader), Georgia, serif",
                  fontStyle: "italic",
                }}
              >
                {active?.roman}
              </motion.span>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.div
                key={active?.roman}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.55, ease: [0.2, 0.7, 0.2, 1] }}
                className="relative p-7 md:p-10 h-full flex flex-col justify-between"
              >
                <div>
                  <p style={{ fontSize: 15, lineHeight: 1.65, color: "var(--site-fg-mute)", maxWidth: 460 }}>
                    {active?.description}
                  </p>

                  <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {active?.deliverables.map((d, i) => (
                      <motion.li
                        key={d}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.08 + i * 0.04 }}
                        className="flex items-start gap-2.5"
                      >
                        <span
                          aria-hidden
                          style={{
                            display: "inline-block",
                            width: 5, height: 5,
                            marginTop: 8,
                            background: "var(--site-accent)",
                            boxShadow: "0 0 8px rgba(255,102,0,0.6)",
                            borderRadius: "50%",
                          }}
                        />
                        <span style={{ fontSize: 13.5, color: "var(--site-fg)" }}>{d}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                <div
                  className="mt-10 pt-6 flex flex-wrap items-center justify-between gap-4"
                  style={{ borderTop: "1px solid var(--site-line)" }}
                >
                  <div className="flex items-center gap-5">
                    <div>
                      <p className="site-eyebrow">Timeline</p>
                      <p className="site-display mt-1.5" style={{ fontSize: 16, letterSpacing: "-0.01em" }}>
                        {active?.timeline}
                      </p>
                    </div>
                    <span aria-hidden style={{ width: 1, height: 28, background: "var(--site-line)" }} />
                    <div>
                      <p className="site-eyebrow">Deliverables</p>
                      <p className="site-display mt-1.5" style={{ fontSize: 16, letterSpacing: "-0.01em" }}>
                        {active?.deliverableCount}
                      </p>
                    </div>
                  </div>
                  <Magnetic strength={0.32}>
                    <Link
                      href={active?.href || "/services"}
                      data-cursor="link"
                      className="inline-flex items-center gap-2 site-mono"
                      style={{
                        fontSize: 11.5,
                        letterSpacing: "0.22em",
                        textTransform: "uppercase",
                        color: "var(--site-accent)",
                        fontWeight: 600,
                      }}
                    >
                      Explore deck
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M2 12 L12 2 M5 2 L12 2 L12 9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </Link>
                  </Magnetic>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
