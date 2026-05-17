"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { homepageContentApi } from "@/lib/api";
import { RichTextContent } from "@/components/ui/rich-text-content";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { Magnetic } from "@/components/motion/magnetic";

type FaqEntry = { q: string; a?: string; a_html?: string; tag: string };

const FALLBACK_FAQS: FaqEntry[] = [
  { q: "What does a typical engagement actually cost?", a: "We work on fixed-scope, fixed-fee engagements — no hourly billing, no surprise change orders. Brand work starts at ₹1.5L, full websites from ₹2.5L, monthly performance retainers from ₹75K.", tag: "Pricing" },
  { q: "How fast can you start?", a: "Brand work usually inside 7 working days. Web build inside 10. Performance retainers go live in your ad account in 72 hours.", tag: "Timeline" },
  { q: "Do you work with pre-revenue or early-stage founders?", a: "Often — about 30% of our work is founders building the brand they wish they had at launch.", tag: "Stage" },
  { q: "What's included in a brand engagement?", a: "Discovery + strategy, two opposing creative directions, full identity system, brand book, packaging or print, social system, plus 30 days of post-launch support.", tag: "Scope" },
  { q: "Who actually does the work?", a: "We're a 14-person studio — no juniors hidden behind a senior, no offshore subcontractors. The founder sits in every kickoff and review.", tag: "Team" },
  { q: "What if I don't like the direction?", a: "You see two opposing routes on Day 10. If neither feels right, we explore a third — at no extra cost, before craft begins.", tag: "Risk" },
  { q: "Can we keep working with you after the launch?", a: "Yes — about 60% of clients move to a monthly retainer. Our average client stays with us for 3.2 years.", tag: "Retention" },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [FAQS, setFaqs] = useState<FaqEntry[]>(FALLBACK_FAQS);

  useEffect(() => {
    let cancelled = false;
    homepageContentApi.get<{ items?: FaqEntry[] }>("faq").then((data) => {
      if (cancelled || !data?.items?.length) return;
      setFaqs(data.items);
    });
    return () => { cancelled = true; };
  }, []);

  return (
    <section
      id="faq"
      className="relative overflow-hidden"
      style={{ background: "var(--site-bg)", color: "var(--site-fg)" }}
      aria-label="Frequently asked questions"
    >
      <div className="container relative z-10 py-24 md:py-32">
        <div className="grid grid-cols-12 gap-x-10 gap-y-14">
          {/* Left column */}
          <ScrollReveal className="col-span-12 lg:col-span-5">
            <div className="flex items-center gap-3 mb-6">
              <span aria-hidden style={{ display: "block", height: 1, width: 36, background: "var(--site-accent)" }} />
              <span className="site-eyebrow">Honest answers</span>
            </div>
            <h2
              className="site-display"
              style={{ fontSize: "clamp(2.2rem, 4.4vw, 3.8rem)", letterSpacing: "-0.03em", lineHeight: 0.98 }}
            >
              The questions{" "}
              <span className="site-italic" style={{ color: "var(--site-accent)" }}>
                we hear most.
              </span>
            </h2>
            <p className="mt-6 max-w-[40ch]" style={{ fontSize: 15, lineHeight: 1.65, color: "var(--site-fg-mute)" }}>
              The seven things every founder asks before signing. Written by the
              founder, not the marketing team — so they read honest, not perfect.
            </p>

            {/* Helper card */}
            <div className="mt-10 site-glass p-7" style={{ borderRadius: 22 }}>
              <p className="site-eyebrow mb-3">Still got questions?</p>
              <p style={{ fontSize: 15, lineHeight: 1.65, color: "var(--site-fg-mute)" }}>
                The fastest path is the WhatsApp number on the contact page. The
                founder reads every inbound personally.
              </p>
              <Magnetic strength={0.25}>
                <Link
                  href="/contact"
                  data-cursor="link"
                  className="group inline-flex items-center gap-2 mt-5 site-mono"
                  style={{
                    fontSize: 11.5,
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    color: "var(--site-accent)",
                    fontWeight: 600,
                  }}
                >
                  Book a call
                  <span aria-hidden className="group-hover:translate-x-1 transition-transform">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M2 12 L12 2 M5 2 L12 2 L12 9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </Link>
              </Magnetic>
            </div>
          </ScrollReveal>

          {/* Right — accordion */}
          <ScrollReveal delay={0.15} className="col-span-12 lg:col-span-7">
            <div
              className="overflow-hidden"
              style={{
                borderTop: "1px solid var(--site-line)",
                borderBottom: "1px solid var(--site-line)",
              }}
            >
              {FAQS.map((faq, i) => (
                <FaqItem
                  key={faq.q}
                  faq={faq}
                  index={i}
                  isOpen={openIndex === i}
                  onToggle={() => setOpenIndex(openIndex === i ? null : i)}
                  isLast={i === FAQS.length - 1}
                />
              ))}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

function FaqItem({
  faq,
  index,
  isOpen,
  onToggle,
  isLast,
}: {
  faq: FaqEntry;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
  isLast: boolean;
}) {
  return (
    <div style={{ borderBottom: isLast ? "none" : "1px solid var(--site-line)" }}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        data-cursor="link"
        className="group w-full text-left flex items-center justify-between gap-6 px-1 md:px-2 py-6 md:py-7 transition-colors cursor-pointer"
        style={{
          color: isOpen ? "var(--site-fg)" : "var(--site-fg-mute)",
        }}
      >
        <div className="flex items-baseline gap-5 min-w-0 flex-1">
          <span
            className="site-mono shrink-0"
            style={{
              fontSize: 11,
              fontVariantNumeric: "tabular-nums",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: isOpen ? "var(--site-accent)" : "var(--site-fg-dim)",
            }}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          <span
            className="site-display"
            style={{
              fontSize: "clamp(1.1rem, 1.6vw, 1.4rem)",
              letterSpacing: "-0.018em",
              lineHeight: 1.25,
              color: isOpen ? "var(--site-fg)" : "var(--site-fg)",
            }}
          >
            {faq.q}
          </span>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <span
            className="hidden md:inline-flex site-mono"
            style={{
              fontSize: 10,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: isOpen ? "var(--site-accent)" : "var(--site-fg-dim)",
              transition: "color 200ms ease",
            }}
          >
            {faq.tag}
          </span>
          <motion.span
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.3, ease: [0.2, 0.7, 0.2, 1] }}
            className="grid place-items-center"
            style={{
              width: 36, height: 36,
              borderRadius: "50%",
              border: `1px solid ${isOpen ? "var(--site-accent)" : "var(--site-line-strong)"}`,
              background: isOpen ? "rgba(255,102,0,0.08)" : "transparent",
              color: isOpen ? "var(--site-accent)" : "var(--site-fg-mute)",
              boxShadow: isOpen ? "0 0 24px rgba(255,102,0,0.3)" : "none",
              transition: "border-color 200ms ease, background 200ms ease, color 200ms ease, box-shadow 200ms ease",
            }}
          >
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
              <path d="M7 1 V 13 M 1 7 H 13" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
          </motion.span>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.2, 0.7, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="px-1 md:px-2 pb-7 pt-1 ml-10 md:ml-12">
              <div
                className="pl-6 max-w-[64ch]"
                style={{ borderLeft: "2px solid rgba(255,102,0,0.4)" }}
              >
                {faq.a_html ? (
                  <div style={{ color: "var(--site-fg-mute)" }}>
                    <RichTextContent html={faq.a_html} />
                  </div>
                ) : (
                  <p style={{ fontSize: 14.5, lineHeight: 1.7, color: "var(--site-fg-mute)" }}>
                    {faq.a}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
