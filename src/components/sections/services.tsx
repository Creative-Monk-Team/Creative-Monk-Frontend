"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { homepageContentApi } from "@/lib/api";
import { Magnetic } from "@/components/motion/magnetic";

/* ─── Services Deck v2 — "Menu of Outcomes" ─────────────────────
   The tab-and-preview pattern was clever; the menu pattern is
   solid. Three full bucket cards visible at once — every founder
   sees what they actually buy, how long, and what it costs without
   a single click. */

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
      "Logo, naming, identity system and packaging built around your real difference — so you stop looking like every other agency's portfolio piece.",
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
    priceFrom: "From ₹1.5L",
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
      "Fast, SEO-clean, conversion-tuned sites paired with a paid-media engine. Average client sees +312% qualified leads in the first 90 days.",
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
    priceFrom: "From ₹2.5L",
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
      "Short-form social reels",
      "Product photography",
      "Animation & motion graphics",
      "Monthly social strategy",
      "Editorial direction",
    ],
    timeline: "3–5 weeks",
    deliverableCount: "Full quarterly library",
    priceFrom: "From ₹1L",
    href: "/services/social-media-marketing",
    accent: "#4A5D3A",
    panelTone: "#1A1410",
    panelInverted: true,
  },
];

export function Services() {
  const [buckets, setBuckets] = useState<Bucket[]>(FALLBACK_BUCKETS);

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

  return (
    <section
      id="services"
      className="relative overflow-hidden"
      style={{ background: "var(--site-bg-soft, #14110E)", color: "var(--site-fg)" }}
      aria-label="Services"
    >
      <div className="container relative z-10 py-24 md:py-32">
        {/* Header */}
        <div className="grid grid-cols-12 gap-x-8 gap-y-8 items-end mb-14 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.2, 0.7, 0.2, 1] }}
            className="col-span-12 md:col-span-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <span aria-hidden style={{ display: "block", height: 1, width: 36, background: "var(--site-accent)" }} />
              <span className="site-eyebrow">What you can hire us for</span>
            </div>
            <h2
              className="site-display"
              style={{
                fontSize: "clamp(2.25rem, 5.4vw, 4.75rem)",
                letterSpacing: "-0.03em",
                lineHeight: 0.96,
                color: "var(--site-fg)",
              }}
            >
              Three engines.{" "}
              <span style={{ fontFamily: "var(--font-newsreader), Georgia, serif", fontStyle: "italic", color: "var(--site-accent)" }}>
                Each billed
              </span>{" "}
              for the result.
            </h2>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.2, 0.7, 0.2, 1] }}
            className="col-span-12 md:col-span-4"
            style={{ fontSize: 15, lineHeight: 1.65, color: "var(--site-fg-mute)" }}
          >
            Pick what your business needs next — or talk to us and we&apos;ll
            tell you which one to start with. Fixed scope, fixed fee,
            no hourly billing.
          </motion.p>
        </div>

        {/* Service cards */}
        <div
          className="grid grid-cols-1 lg:grid-cols-3"
          style={{ background: "var(--site-line)", gap: 1, border: "1px solid var(--site-line)" }}
        >
          {buckets.map((bucket, i) => (
            <ServiceCard key={bucket.roman} bucket={bucket} index={i} />
          ))}
        </div>

        {/* Tail line */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.2, 0.7, 0.2, 1] }}
          className="mt-10 flex flex-wrap items-center justify-between gap-5"
        >
          <p className="site-italic" style={{ fontSize: 15, color: "var(--site-fg-mute)" }}>
            Not sure where to start? We&apos;ll scope it in a 30-min call.
          </p>
          <Link
            href="/contact"
            data-cursor="link"
            className="group inline-flex items-center gap-2 site-mono"
            style={{
              fontSize: 11.5,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "var(--site-accent)",
              fontWeight: 600,
            }}
          >
            Talk to the founder
            <span aria-hidden className="group-hover:translate-x-1 transition-transform">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 12 L12 2 M5 2 L12 2 L12 9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

function ServiceCard({ bucket, index }: { bucket: Bucket; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, delay: index * 0.1, ease: [0.2, 0.7, 0.2, 1] }}
      className="group relative flex flex-col p-7 md:p-10 transition-colors"
      style={{ background: "var(--site-bg-soft)" }}
    >
      {/* Top row: roman + price */}
      <div className="flex items-start justify-between gap-4 mb-7">
        <span
          className="site-italic"
          style={{
            fontFamily: "var(--font-newsreader), Georgia, serif",
            fontStyle: "italic",
            fontSize: "clamp(2.5rem, 4vw, 3.5rem)",
            lineHeight: 0.85,
            color: "var(--site-accent)",
            fontWeight: 500,
          }}
        >
          {bucket.roman}
        </span>
        {bucket.priceFrom ? (
          <span
            className="site-mono shrink-0"
            style={{
              fontSize: 10.5,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--site-fg-mute)",
              padding: "5px 9px",
              border: "1px solid var(--site-line)",
              background: "rgba(245,241,232,0.02)",
            }}
          >
            {bucket.priceFrom}
          </span>
        ) : null}
      </div>

      {/* Eyebrow */}
      <p className="site-eyebrow mb-3" style={{ color: "var(--site-fg-mute)" }}>
        {bucket.eyebrow} · <span style={{ fontStyle: "italic", textTransform: "none", letterSpacing: 0 }}>{bucket.italic}</span>
      </p>

      {/* Title */}
      <h3
        className="site-display"
        style={{
          fontSize: "clamp(1.5rem, 2.4vw, 2rem)",
          letterSpacing: "-0.022em",
          lineHeight: 1.05,
          color: "var(--site-fg)",
        }}
      >
        {bucket.title}
      </h3>

      {/* Description */}
      <p
        className="mt-4"
        style={{ fontSize: 14.5, lineHeight: 1.65, color: "var(--site-fg-mute)" }}
      >
        {bucket.description}
      </p>

      {/* Deliverables */}
      <ul className="mt-6 space-y-2 flex-1">
        {bucket.deliverables.slice(0, 6).map((d) => (
          <li key={d} className="flex items-start gap-2.5">
            <span
              aria-hidden
              style={{
                display: "inline-block",
                marginTop: 7,
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: "var(--site-accent)",
                boxShadow: "0 0 8px rgba(255,102,0,0.5)",
                flexShrink: 0,
              }}
            />
            <span style={{ fontSize: 13.5, color: "var(--site-fg)" }}>{d}</span>
          </li>
        ))}
      </ul>

      {/* Footer meta */}
      <div
        className="mt-8 pt-5 flex items-center justify-between gap-3"
        style={{ borderTop: "1px solid var(--site-line)" }}
      >
        <div className="flex items-center gap-4">
          <div>
            <p className="site-eyebrow" style={{ fontSize: 9.5 }}>
              Timeline
            </p>
            <p className="site-display mt-1" style={{ fontSize: 14, letterSpacing: "-0.01em", color: "var(--site-fg)" }}>
              {bucket.timeline}
            </p>
          </div>
          <span aria-hidden style={{ width: 1, height: 24, background: "var(--site-line)" }} />
          <div>
            <p className="site-eyebrow" style={{ fontSize: 9.5 }}>
              Scope
            </p>
            <p className="site-display mt-1" style={{ fontSize: 14, letterSpacing: "-0.01em", color: "var(--site-fg)" }}>
              {bucket.deliverableCount}
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <Magnetic strength={0.25}>
        <Link
          href={bucket.href}
          data-cursor="link"
          className="mt-6 group/cta inline-flex items-center justify-between gap-3 px-5 py-3 transition-colors"
          style={{
            background: "rgba(255,102,0,0.06)",
            border: "1px solid rgba(255,102,0,0.25)",
            color: "var(--site-fg)",
            borderRadius: 10,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-funnel-display)",
              fontSize: 13.5,
              fontWeight: 600,
              letterSpacing: "-0.005em",
            }}
          >
            Explore this engine
          </span>
          <span
            aria-hidden
            className="inline-grid place-items-center group-hover/cta:translate-x-1 transition-transform"
            style={{
              width: 28, height: 28, borderRadius: "50%",
              background: "var(--site-accent)",
              color: "#0A0807",
            }}
          >
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
              <path d="M2 12 L12 2 M5 2 L12 2 L12 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </Link>
      </Magnetic>

      {/* Hover accent rail */}
      <span
        aria-hidden
        className="absolute left-0 top-0 bottom-0 w-px opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ background: "var(--site-accent)", boxShadow: "0 0 16px rgba(255,102,0,0.5)" }}
      />
    </motion.article>
  );
}
