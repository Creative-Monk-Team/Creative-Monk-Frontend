"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { homepageContentApi } from "@/lib/api";
import { ScrollReveal } from "@/components/motion/scroll-reveal";

type Quote = {
  text: string;
  name: string;
  role: string;
  company: string;
  initials: string;
  sector: string;
  outcome: string;
  accent: string;
};

const FALLBACK_FEATURED: Quote = {
  text:
    "We came to Monk thinking we needed a logo. We left with a category-of-one brand and a website that closes the lead before our sales team gets on a call. +312% qualified leads in 90 days — and that number has held for two years.",
  name: "Aakshat Sahni",
  role: "CEO",
  company: "Hive Management",
  initials: "AS",
  sector: "Property Advisory",
  outcome: "+312% qualified leads",
  accent: "#FF6600",
};

const FALLBACK_SUPPORTING: Quote[] = [
  {
    text:
      "Fastest agency we've worked with — and we've worked with the big Mumbai ones. They reply in hours, ship in days, and the work doesn't look like everyone else's on Behance. Got us into DMart shelves.",
    name: "Manjeet Chatha", role: "Co-founder", company: "Chatha Foods", initials: "MC",
    sector: "FMCG · Retail", outcome: "14 SKUs into DMart", accent: "#E5B04A",
  },
  {
    text:
      "Our café went from invisible to a Sector 17 waitlist in three months. Their social team is the only one I've found who actually understands the audience — and the numbers show it every week.",
    name: "Karan Bhalla", role: "Owner", company: "Woodhouse Café", initials: "KB",
    sector: "Hospitality", outcome: "+38K Instagram · 90 days", accent: "#4A5D3A",
  },
  {
    text:
      "Their brief alone is worth what most agencies charge for the whole project. We knew within one call we were dealing with a different kind of studio. Search traffic tripled inside two quarters.",
    name: "Riya Bansal", role: "Marketing Director", company: "Brightlight Solar", initials: "RB",
    sector: "Renewable Energy", outcome: "3× organic search traffic", accent: "#0F0C08",
  },
];

export function Testimonials() {
  const [FEATURED, setFeatured] = useState<Quote>(FALLBACK_FEATURED);
  const [SUPPORTING, setSupporting] = useState<Quote[]>(FALLBACK_SUPPORTING);

  useEffect(() => {
    let cancelled = false;
    homepageContentApi
      .get<{ featured?: Quote; supporting?: Quote[] }>("testimonials")
      .then((data) => {
        if (cancelled || !data) return;
        if (data.featured) setFeatured(data.featured);
        if (data.supporting?.length) setSupporting(data.supporting);
      });
    return () => { cancelled = true; };
  }, []);

  return (
    <section
      className="relative overflow-hidden"
      style={{ background: "var(--site-bg-soft)", color: "var(--site-fg)" }}
      aria-label="Client testimonials"
    >
      <div className="container relative z-10 py-24 md:py-32">
        {/* Header */}
        <ScrollReveal>
          <div className="grid grid-cols-12 gap-x-8 gap-y-8 items-end mb-14 md:mb-20">
            <div className="col-span-12 md:col-span-8">
              <div className="flex items-center gap-3 mb-6">
                <span aria-hidden style={{ display: "block", height: 1, width: 36, background: "var(--site-accent)" }} />
                <span className="site-eyebrow">Social proof</span>
              </div>
              <h2
                className="site-display"
                style={{ fontSize: "clamp(2.25rem, 5vw, 4.5rem)", letterSpacing: "-0.03em", lineHeight: 0.96 }}
              >
                Our average client stays{" "}
                <span className="site-italic" style={{ color: "var(--site-accent)" }}>
                  3.2 years.
                </span>
              </h2>
            </div>
            <div className="col-span-12 md:col-span-4">
              <p style={{ fontSize: 15, lineHeight: 1.65, color: "var(--site-fg-mute)" }}>
                The reviews founders write when no one&apos;s asking for one.
              </p>
            </div>
          </div>
        </ScrollReveal>

        {/* Featured */}
        <FeaturedQuote quote={FEATURED} />

        {/* Supporting */}
        <div
          className="mt-16 grid grid-cols-1 md:grid-cols-3"
          style={{ background: "var(--site-line)", gap: 1 }}
        >
          {SUPPORTING.map((q, i) => (
            <SupportingQuote key={q.name} quote={q} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedQuote({ quote }: { quote: Quote }) {
  return (
    <motion.figure
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1, ease: [0.2, 0.7, 0.2, 1] }}
      className="relative site-glass overflow-hidden p-8 md:p-16"
      style={{ borderRadius: 28 }}
    >
      {/* Background quote glyph */}
      <span
        aria-hidden
        className="absolute -top-6 -left-2 pointer-events-none select-none site-italic"
        style={{
          fontSize: "clamp(14rem, 22vw, 24rem)",
          color: "var(--site-accent)",
          opacity: 0.07,
          lineHeight: 0.85,
          fontFamily: "var(--font-newsreader), Georgia, serif",
        }}
      >
        “
      </span>

      <div className="relative grid grid-cols-12 gap-x-10 gap-y-10 items-end">
        <div className="col-span-12 lg:col-span-9">
          <p className="site-eyebrow mb-6">Outcome · {quote.outcome}</p>
          <blockquote
            className="site-display"
            style={{
              fontSize: "clamp(1.5rem, 3.4vw, 3rem)",
              letterSpacing: "-0.02em",
              lineHeight: 1.08,
              color: "var(--site-fg)",
              fontWeight: 500,
            }}
          >
            <span style={{ color: "var(--site-accent)" }}>“</span>
            {quote.text}
            <span style={{ color: "var(--site-accent)" }}>”</span>
          </blockquote>
        </div>

        <figcaption className="col-span-12 lg:col-span-3 flex flex-col gap-3">
          <Avatar q={quote} size={56} />
          <div>
            <p className="site-display" style={{ fontSize: 18, letterSpacing: "-0.012em" }}>
              {quote.name}
            </p>
            <p className="site-mono mt-1" style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--site-fg-mute)" }}>
              {quote.role} · {quote.company}
            </p>
            <p className="site-italic mt-2" style={{ fontSize: 13, color: "var(--site-fg-dim)" }}>
              {quote.sector}
            </p>
          </div>
        </figcaption>
      </div>
    </motion.figure>
  );
}

function SupportingQuote({ quote, index }: { quote: Quote; index: number }) {
  return (
    <motion.figure
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.2, 0.7, 0.2, 1] }}
      className="group relative p-7 md:p-8 flex flex-col h-full transition-colors"
      style={{ background: "var(--site-bg-soft)" }}
    >
      <p className="site-eyebrow mb-4" style={{ color: "var(--site-accent)" }}>
        {quote.outcome}
      </p>
      <blockquote
        style={{
          fontSize: 14.5,
          lineHeight: 1.65,
          color: "var(--site-fg)",
          flex: 1,
        }}
      >
        “{quote.text}”
      </blockquote>
      <figcaption className="mt-6 pt-5 flex items-center gap-3" style={{ borderTop: "1px solid var(--site-line)" }}>
        <Avatar q={quote} size={36} />
        <div>
          <p className="site-display" style={{ fontSize: 14, letterSpacing: "-0.01em" }}>
            {quote.name}
          </p>
          <p className="site-mono" style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--site-fg-dim)" }}>
            {quote.role} · {quote.company}
          </p>
        </div>
      </figcaption>
      <span
        aria-hidden
        className="absolute top-0 left-0 h-px opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ width: "100%", background: "linear-gradient(90deg, var(--site-accent), transparent)" }}
      />
    </motion.figure>
  );
}

function Avatar({ q, size }: { q: Quote; size: number }) {
  return (
    <span
      className="inline-grid place-items-center shrink-0 site-mono"
      style={{
        width: size, height: size,
        background: q.accent,
        color: q.accent === "#FF6600" ? "#0A0807" : "var(--site-fg)",
        fontSize: size * 0.32,
        fontWeight: 700,
        border: "1px solid var(--site-line)",
        borderRadius: "50%",
        boxShadow: q.accent === "#FF6600" ? "0 0 24px rgba(255,102,0,0.3)" : "none",
      }}
    >
      {q.initials}
    </span>
  );
}
