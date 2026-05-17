"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Magnetic } from "@/components/motion/magnetic";

/* ─── Why founders pick us — differentiator block ──────────────
   Sits between the client marquee and the services deck. Four
   pillars that map to the most common reasons our buyer (a founder)
   chooses us over a bigger agency. Numbers first; copy second. */

type Pillar = {
  num: string;
  big: string;
  bigSuffix?: string;
  title: string;
  description: string;
  evidence: string;
};

const PILLARS: Pillar[] = [
  {
    num: "01",
    big: "100",
    bigSuffix: "%",
    title: "Senior craft on every project",
    description:
      "No junior teams hiding behind a senior pitch. The strategists, designers and engineers in the kickoff are the same people who ship the work — from first sketch to launch day.",
    evidence: "Zero outsourcing · 14-person team",
  },
  {
    num: "02",
    big: "45",
    bigSuffix: "days",
    title: "Fixed scope. Fixed fee.",
    description:
      "No hourly billing, no mystery change orders. You see the milestone calendar and the total on day one — and we sign it before any work begins. Predictable from start to ship.",
    evidence: "Quote inside 48 hours",
  },
  {
    num: "03",
    big: "2",
    bigSuffix: "directions",
    title: "Strategy with a point of view",
    description:
      "On Day 10 you see two clearly opposing creative directions — never three. You pick a side instead of compromising to a safe middle. We back our recommendation in writing.",
    evidence: "+312% avg lead lift in 90 days",
  },
  {
    num: "04",
    big: "3.2",
    bigSuffix: "yrs",
    title: "Built to compound",
    description:
      "Every system we ship — identity, website, content, growth — is designed to keep paying back two years out. That's why the average client stays for over three.",
    evidence: "60% move to long-term retainer",
  },
];

export function WhyFounders() {
  return (
    <section
      id="why"
      className="relative overflow-hidden"
      style={{ background: "var(--site-bg)", color: "var(--site-fg)" }}
      aria-label="Why ambitious brands work with us"
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
              <span className="site-eyebrow">Why work with us</span>
            </div>
            <h2
              className="site-display"
              style={{
                fontSize: "clamp(2rem, 4.8vw, 4rem)",
                letterSpacing: "-0.028em",
                lineHeight: 1,
                color: "var(--site-fg)",
              }}
            >
              Built different,{" "}
              <span style={{ fontFamily: "var(--font-newsreader), Georgia, serif", fontStyle: "italic", color: "var(--site-accent)" }}>
                on purpose.
              </span>
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
            We&apos;re an independent studio — small enough to care, senior
            enough to execute. The four pillars below are what clients tell us
            they couldn&apos;t find at a bigger agency.
          </motion.p>
        </div>

        {/* Pillar grid — 2x2 on desktop, 1 col on mobile, 1px separators */}
        <div
          className="grid grid-cols-1 md:grid-cols-2"
          style={{ background: "var(--site-line)", gap: 1, border: "1px solid var(--site-line)" }}
        >
          {PILLARS.map((pillar, i) => (
            <PillarCard key={pillar.num} pillar={pillar} index={i} />
          ))}
        </div>

        {/* CTA strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.2, 0.7, 0.2, 1] }}
          className="mt-12 flex flex-wrap items-center justify-between gap-5"
        >
          <p className="site-italic max-w-[44ch]" style={{ fontSize: "clamp(15px, 1.3vw, 17px)", color: "var(--site-fg-mute)" }}>
            We&apos;re selective about who we work with — because the work
            deserves it, and so do you.
          </p>
          <Magnetic strength={0.32}>
            <Link
              href="/contact"
              data-cursor="link"
              className="group relative inline-flex items-center gap-3 overflow-hidden pl-6 pr-2.5 py-2.5 site-neon"
              style={{
                background: "var(--site-accent)",
                color: "#0A0807",
                borderRadius: 999,
                fontWeight: 600,
              }}
            >
              <span
                className="relative z-10"
                style={{ fontFamily: "var(--font-funnel-display)", fontSize: 14, letterSpacing: "-0.005em" }}
              >
                Start the audit
              </span>
              <span
                className="relative z-10 inline-grid place-items-center transition-transform duration-300 group-hover:rotate-[-30deg]"
                style={{
                  width: 32, height: 32, borderRadius: "50%",
                  background: "#0A0807",
                  color: "var(--site-accent)",
                }}
              >
                <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                  <path d="M2 12 L12 2 M5 2 L12 2 L12 9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </Link>
          </Magnetic>
        </motion.div>
      </div>
    </section>
  );
}

function PillarCard({ pillar, index }: { pillar: Pillar; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.85, delay: index * 0.08, ease: [0.2, 0.7, 0.2, 1] }}
      className="group relative p-7 md:p-10 transition-colors"
      style={{ background: "var(--site-bg)" }}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-4 mb-8">
        <span
          className="site-mono"
          style={{
            fontSize: 11,
            letterSpacing: "0.24em",
            textTransform: "uppercase",
            color: "var(--site-fg-dim)",
          }}
        >
          /{pillar.num}
        </span>
        <span
          className="site-mono"
          style={{
            fontSize: 10.5,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--site-accent)",
            padding: "4px 9px",
            border: "1px solid rgba(255,102,0,0.4)",
            background: "rgba(255,102,0,0.06)",
          }}
        >
          {pillar.evidence}
        </span>
      </div>

      {/* Big number */}
      <p
        className="site-display flex items-baseline"
        style={{
          fontSize: "clamp(3.5rem, 7vw, 6rem)",
          letterSpacing: "-0.04em",
          lineHeight: 0.9,
          color: "var(--site-fg)",
        }}
      >
        <span style={{ color: "var(--site-accent)" }}>{pillar.big}</span>
        {pillar.bigSuffix ? (
          <span
            className="site-italic"
            style={{
              marginLeft: "0.14em",
              fontSize: "0.4em",
              color: "var(--site-fg-mute)",
              fontWeight: 500,
            }}
          >
            {pillar.bigSuffix}
          </span>
        ) : null}
      </p>

      {/* Title + description */}
      <h3
        className="site-display mt-6"
        style={{
          fontSize: "clamp(1.35rem, 2.2vw, 1.75rem)",
          letterSpacing: "-0.02em",
          lineHeight: 1.15,
          color: "var(--site-fg)",
        }}
      >
        {pillar.title}
      </h3>
      <p
        className="mt-3 max-w-[44ch]"
        style={{ fontSize: 14.5, lineHeight: 1.65, color: "var(--site-fg-mute)" }}
      >
        {pillar.description}
      </p>

      {/* Hover rail */}
      <span
        aria-hidden
        className="absolute left-0 top-0 bottom-0 w-px opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ background: "var(--site-accent)", boxShadow: "0 0 16px rgba(255,102,0,0.5)" }}
      />
    </motion.article>
  );
}
