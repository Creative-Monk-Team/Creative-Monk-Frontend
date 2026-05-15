"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

/* ─── Static FAQ content ───────────────────────────────────────
   Six sales-objection questions — the ones we actually get on
   every first call. Honest answers, no marketing fluff. */
const FAQS = [
  {
    q: "What does a typical engagement actually cost?",
    a: "We work on fixed-scope, fixed-fee engagements — no hourly billing, no surprise change orders. The studio is happy to share a detailed estimate after a 30-minute scoping call where we understand the brief. Brand engagements scope smaller than full website builds, which scope smaller than full studio retainers. We'll send a written quote inside 48 hours of the first call.",
    tag: "Pricing",
  },
  {
    q: "How fast can you start?",
    a: "Brand work usually inside 7 working days. Web build inside 10. Performance retainers go live in your ad account in 72 hours. We don't take on a project unless we can give it real attention — if our calendar is full for the month, we'll tell you so on the first call instead of overcommitting.",
    tag: "Timeline",
  },
  {
    q: "Do you work with pre-revenue founders?",
    a: "Often. About 30% of our work is founders building the brand they wish they had at launch. We offer reduced rates for genuinely early-stage founders who can't afford a full studio engagement — ask about it on the call. We'd rather work with five committed founders than ten cautious ones.",
    tag: "Stage",
  },
  {
    q: "What's included in a brand engagement?",
    a: "Discovery + strategy, two opposing creative directions, full identity system (logo, wordmark, colour, type, iconography), brand book and guidelines, packaging or print collateral if your category needs it, a base social system, plus 30 days of post-launch support over WhatsApp. We scope web and motion separately so you only pay for what you actually need.",
    tag: "Scope",
  },
  {
    q: "Who actually does the work?",
    a: "We're a 14-person studio — no juniors hidden behind a senior, no offshore subcontractors. The founder sits in every kickoff and every review. The team you meet on the discovery call is the team that ships your project. We deliberately do not scale beyond what we can personally oversee.",
    tag: "Team",
  },
  {
    q: "Can we keep working with you after the launch?",
    a: "Yes — about 60% of clients move to a monthly retainer for ongoing design, content or performance work after the initial engagement. Retainers are scoped to your needs (anywhere from one focused workstream to full embedded studio support). Our average client stays with us for 3.2 years.",
    tag: "Retention",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="relative bg-[#FAF7F2] border-t border-stone-900/10 overflow-hidden"
      aria-label="Frequently asked questions"
    >
      <div className="hero-grain-paper" aria-hidden />

      <div className="container relative z-10 py-20 md:py-28">
        <div className="grid grid-cols-12 gap-x-8 gap-y-12">
          {/* Left column — heading + helper card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="col-span-12 lg:col-span-5"
          >
            <div className="flex items-center gap-3 mb-6">
              <span aria-hidden className="block h-px w-9 bg-[#FF6600]" />
              <span className="font-jakarta text-[11px] font-semibold uppercase tracking-[0.26em] text-stone-600">
                Honest answers
              </span>
            </div>
            <h2 className="font-funnel text-stone-900 font-bold leading-[0.98] tracking-[-0.035em] text-[clamp(2.2rem,4.4vw,3.8rem)] max-w-[16ch]">
              The questions{" "}
              <span
                style={{
                  fontFamily: "var(--font-newsreader), Georgia, serif",
                  fontStyle: "italic",
                  fontWeight: 500,
                  color: "#1c1c1c",
                }}
              >
                we hear most.
              </span>
            </h2>
            <p className="mt-6 font-jakarta text-[15.5px] leading-[1.6] text-stone-700 max-w-[40ch]">
              The six things every founder asks us before signing a contract.
              Written by the founder, not the marketing team — so they read
              honest, not perfect.
            </p>

            {/* Helper card — "Still got questions?" */}
            <div className="mt-10 rounded-3xl border border-stone-900/10 bg-stone-50 p-7">
              <p className="font-jakarta text-[10.5px] font-semibold uppercase tracking-[0.24em] text-stone-500 mb-3">
                Don&apos;t see yours?
              </p>
              <h3 className="font-funnel text-[clamp(1.25rem,1.8vw,1.55rem)] leading-[1.2] tracking-[-0.02em] font-bold text-stone-900">
                Ask it on the call —{" "}
                <span
                  style={{
                    fontFamily: "var(--font-newsreader), Georgia, serif",
                    fontStyle: "italic",
                    fontWeight: 500,
                    color: "#FF6600",
                  }}
                >
                  we'd rather over-explain.
                </span>
              </h3>
              <p className="mt-3 font-jakarta text-[13.5px] leading-[1.55] text-stone-600 max-w-[36ch]">
                The fastest way to a real answer is a 30-minute conversation —
                not a form, not a chatbot.
              </p>
              <Link
                href="/contact"
                className="group relative inline-flex items-center gap-2.5 mt-6 rounded-full bg-stone-900 text-stone-50 pl-5 pr-1.5 py-1.5 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-[0_14px_30px_-14px_rgba(15,12,8,0.45)]"
              >
                <span className="relative font-funnel text-[13.5px] font-semibold tracking-tight">
                  Book a call
                </span>
                <span className="relative inline-grid place-items-center w-8 h-8 rounded-full bg-[#FF6600] text-stone-900 group-hover:bg-stone-50 group-hover:rotate-[-30deg] transition-all duration-300">
                  <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
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
            </div>
          </motion.div>

          {/* Right column — accordion */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="col-span-12 lg:col-span-7"
          >
            <div className="rounded-3xl border border-stone-900/10 bg-stone-50 overflow-hidden">
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
          </motion.div>
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
  faq: (typeof FAQS)[number];
  index: number;
  isOpen: boolean;
  onToggle: () => void;
  isLast: boolean;
}) {
  return (
    <div className={`${!isLast ? "border-b border-stone-900/10" : ""}`}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="group w-full text-left flex items-center justify-between gap-5 px-6 md:px-8 py-5 md:py-6 cursor-pointer transition-colors hover:bg-white/40"
      >
        <div className="flex items-baseline gap-4 min-w-0 flex-1">
          <span
            className="shrink-0 font-jakarta text-[11px] font-bold tabular-nums tracking-[0.18em] uppercase text-stone-400"
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="font-funnel text-[clamp(1.05rem,1.5vw,1.3rem)] font-bold leading-[1.25] tracking-[-0.02em] text-stone-900">
            {faq.q}
          </span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span
            className={`hidden md:inline-flex items-center font-jakarta text-[10px] font-semibold uppercase tracking-[0.2em] transition-colors ${
              isOpen ? "text-[#FF6600]" : "text-stone-400"
            }`}
          >
            {faq.tag}
          </span>
          <span
            className={`grid place-items-center w-9 h-9 rounded-full border transition-all duration-300 ${
              isOpen
                ? "bg-[#FF6600] border-[#FF6600] rotate-45 text-stone-900"
                : "border-stone-900/15 text-stone-700 group-hover:border-stone-900"
            }`}
            aria-hidden
          >
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
              <path
                d="M7 1 V 13 M 1 7 H 13"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="px-6 md:px-8 pb-7 pt-1">
              <div className="pl-7 md:pl-9 max-w-[64ch] border-l-2 border-[#FF6600]/30">
                <p className="font-jakarta text-[14.5px] md:text-[15px] leading-[1.65] text-stone-700 pl-5">
                  {faq.a}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
