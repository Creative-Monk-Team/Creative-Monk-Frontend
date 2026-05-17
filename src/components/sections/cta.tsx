"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { homepageContentApi } from "@/lib/api";
import { TextReveal } from "@/components/motion/text-reveal";
import { Magnetic } from "@/components/motion/magnetic";
import { MeshBackdrop } from "@/components/motion/mesh-backdrop";

type TrustPoint = { label: string; value: string };
type CtaPayload = {
  eyebrow?: string;
  headline?: string;
  subhead?: string;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
  trustPoints?: TrustPoint[];
};

const FALLBACK: Required<CtaPayload> = {
  eyebrow: "Talk to a founder, not a sales bot",
  headline: "30 minutes. No pitch. A real plan for your next quarter.",
  subhead:
    "Bring your current site, your last quarter's metrics, or just an idea. We'll teardown what's working, flag what's leaking revenue, and tell you whether we're the right fit. No obligation.",
  primary: { label: "Book my free 30-min audit", href: "/contact" },
  secondary: { label: "WhatsApp the founder", href: "https://wa.me/919463445566" },
  trustPoints: [
    { label: "Avg reply",     value: "<4hr" },
    { label: "Slots open",    value: "Q3 · 3 left" },
    { label: "Studio rating", value: "4.9★ · 87 reviews" },
    { label: "Founder-led",   value: "Every project" },
  ],
};

export function CTA() {
  const [data, setData] = useState<Required<CtaPayload>>(FALLBACK);
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    homepageContentApi.get<CtaPayload>("cta").then((res) => {
      if (cancelled || !res) return;
      setData({
        eyebrow:     res.eyebrow     ?? FALLBACK.eyebrow,
        headline:    res.headline    ?? FALLBACK.headline,
        subhead:     res.subhead     ?? FALLBACK.subhead,
        primary:     res.primary     ?? FALLBACK.primary,
        secondary:   res.secondary   ?? FALLBACK.secondary,
        trustPoints: res.trustPoints?.length ? res.trustPoints : FALLBACK.trustPoints,
      });
    });
    return () => { cancelled = true; };
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const meshY = useTransform(scrollYProgress, [0, 1], [-80, 80]);
  const meshScale = useTransform(scrollYProgress, [0, 1], [1.1, 1]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{
        background: "var(--site-bg, #0A0807)",
        color: "var(--site-fg)",
        borderTop: "1px solid var(--site-line)",
      }}
      aria-label="Start a project"
    >
      <motion.div style={{ y: meshY, scale: meshScale }} className="absolute inset-0">
        <MeshBackdrop showGrid={false} />
      </motion.div>

      <div className="container relative z-10 py-28 md:py-40">
        {/* Eyebrow row */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 mb-12 md:mb-16"
        >
          <div className="flex items-center gap-3">
            <span aria-hidden style={{ display: "block", height: 1, width: 36, background: "var(--site-accent)" }} />
            <span className="site-eyebrow">{data.eyebrow}</span>
          </div>
          <div
            className="site-glass flex items-center gap-3 px-4 py-2"
            style={{ borderRadius: 999 }}
          >
            <span
              aria-hidden
              style={{
                width: 6, height: 6, borderRadius: "50%",
                background: "#30A46C",
                boxShadow: "0 0 8px rgba(48,164,108,0.7)",
              }}
            />
            <span className="site-eyebrow" style={{ color: "var(--site-fg)" }}>
              Open studio · Q3 2026
            </span>
          </div>
        </motion.div>

        {/* Massive headline */}
        <h2
          className="site-display max-w-[20ch] site-neon-text"
          style={{
            fontSize: "clamp(2.75rem, 7vw, 6.5rem)",
            letterSpacing: "-0.04em",
            lineHeight: 0.92,
            fontWeight: 600,
          }}
        >
          <TextReveal as="span" startAt="inview" stagger={0.05}>
            {data.headline}
          </TextReveal>
        </h2>

        {/* Sub + CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-12 md:mt-16 grid grid-cols-12 gap-x-10 gap-y-10 items-start"
        >
          <p
            className="col-span-12 md:col-span-7 max-w-[58ch]"
            style={{ fontSize: "clamp(15.5px, 1.4vw, 18px)", lineHeight: 1.6, color: "var(--site-fg-mute)" }}
          >
            {data.subhead}
          </p>

          <div className="col-span-12 md:col-span-5 flex flex-wrap items-center gap-5 md:justify-end">
            <Magnetic strength={0.4} radius={160}>
              <Link
                href={data.primary.href}
                data-cursor="link"
                className="group relative inline-flex items-center gap-3 overflow-hidden pl-8 pr-3 py-3 site-neon"
                style={{
                  background: "var(--site-accent)",
                  color: "#0A0807",
                  borderRadius: 999,
                  fontWeight: 600,
                }}
              >
                <span
                  aria-hidden
                  className="absolute inset-0 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out"
                  style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)" }}
                />
                <span
                  className="relative z-10"
                  style={{
                    fontFamily: "var(--font-funnel-display)",
                    fontSize: 15,
                    letterSpacing: "-0.005em",
                  }}
                >
                  {data.primary.label}
                </span>
                <span
                  className="relative z-10 inline-grid place-items-center transition-transform duration-300 group-hover:rotate-[-30deg]"
                  style={{
                    width: 42, height: 42, borderRadius: "50%",
                    background: "#0A0807",
                    color: "var(--site-accent)",
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 12 L12 2 M5 2 L12 2 L12 9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </Link>
            </Magnetic>
            <Link
              href={data.secondary.href}
              data-cursor="link"
              target={data.secondary.href.startsWith("http") ? "_blank" : undefined}
              rel={data.secondary.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="group inline-flex items-center gap-2.5 site-mono"
              style={{
                fontSize: 11.5,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "var(--site-fg)",
                fontWeight: 600,
              }}
            >
              <span className="relative">
                {data.secondary.label}
                <span aria-hidden className="absolute left-0 -bottom-1 h-px w-full" style={{ background: "var(--site-fg)" }} />
                <span aria-hidden className="absolute left-0 -bottom-1 h-px w-full origin-right scale-x-0 group-hover:scale-x-100 transition-transform duration-500 delay-100" style={{ background: "var(--site-accent)" }} />
              </span>
              <svg width="20" height="10" viewBox="0 0 22 10" fill="none" className="group-hover:translate-x-1 transition-transform">
                <path d="M1 5 H 20 M 16 1 L 20 5 L 16 9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </motion.div>

        {/* Trust strip */}
        <div
          className="mt-16 md:mt-24 grid grid-cols-2 md:grid-cols-4"
          style={{ background: "var(--site-line)", gap: 1, borderRadius: 12, overflow: "hidden", border: "1px solid var(--site-line)" }}
        >
          {data.trustPoints.map((tp, i) => (
            <motion.div
              key={tp.label}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: [0.2, 0.7, 0.2, 1] }}
              className="p-5 md:p-6 group"
              style={{ background: "var(--site-bg)" }}
            >
              <p className="site-eyebrow mb-3">{tp.label}</p>
              <p
                className="site-display"
                style={{
                  fontSize: "clamp(1.3rem, 2vw, 1.65rem)",
                  letterSpacing: "-0.02em",
                  color: i === 0 ? "var(--site-accent)" : "var(--site-fg)",
                  transition: "color 300ms ease",
                }}
              >
                {tp.value}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
