"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const TRUST_POINTS = [
  { label: "Avg reply", value: "<4hr" },
  { label: "Slots open", value: "Q3 · 3 left" },
  { label: "Studio rating", value: "4.9★" },
  { label: "Founder-led", value: "Always" },
];

export function CTA() {
  return (
    <section
      className="relative bg-stone-900 text-stone-50 overflow-hidden border-t border-stone-50/5"
      aria-label="Start a project"
    >
      {/* Atmosphere */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 70% at 100% 0%, rgba(255,102,0,0.18), transparent 60%), radial-gradient(ellipse 50% 60% at 0% 100%, rgba(255,102,0,0.10), transparent 60%)",
        }}
      />
      {/* Subtle dot grid */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#FF6600 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="container relative z-10 py-24 md:py-32">
        {/* Eyebrow row */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 mb-12 md:mb-14"
        >
          <div className="flex items-center gap-3">
            <span aria-hidden className="block h-px w-9 bg-[#FF6600]" />
            <span className="font-jakarta text-[11px] font-semibold uppercase tracking-[0.26em] text-stone-300">
              Ready when you are
            </span>
          </div>
          <div className="flex items-center gap-3 rounded-full border border-stone-50/20 bg-stone-50/[0.05] px-4 py-2 backdrop-blur">
            <span className="block w-1.5 h-1.5 rounded-full bg-emerald-400 hero-pulse" />
            <span className="font-jakarta text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-100">
              Open studio · Q3 2026
            </span>
          </div>
        </motion.div>

        {/* Massive headline */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.2, 0.7, 0.2, 1] }}
          className="font-funnel font-bold leading-[0.92] tracking-[-0.04em] text-stone-50 text-[clamp(2.75rem,7vw,6.5rem)] max-w-[18ch]"
        >
          Let's make something{" "}
          <span
            style={{
              fontFamily: "var(--font-newsreader), Georgia, serif",
              fontStyle: "italic",
              fontWeight: 500,
              color: "#FF6600",
            }}
          >
            your competitors
          </span>{" "}
          will quietly steal.
        </motion.h2>

        {/* Sub + CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mt-10 md:mt-12 grid grid-cols-12 gap-x-8 gap-y-10 items-start"
        >
          <p className="col-span-12 md:col-span-7 font-jakarta text-[16.5px] md:text-[18px] leading-[1.6] text-stone-300 max-w-[58ch]">
            Three slots are open for Q3. Send a brief — Abhishek reads every
            inbound personally and replies inside four working hours. No demo
            calls, no discovery decks. Just a real conversation about what
            you&apos;re building.
          </p>

          <div className="col-span-12 md:col-span-5 flex flex-wrap items-center gap-4 md:gap-5 md:justify-end">
            <Link
              href="/contact"
              className="group relative inline-flex items-center gap-3 rounded-full bg-stone-50 text-stone-900 pl-6 pr-2 py-2 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-[0_24px_50px_-20px_rgba(255,102,0,0.55)]"
            >
              <span
                aria-hidden
                className="absolute inset-0 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(255,102,0,0.85), transparent)",
                }}
              />
              <span className="relative font-funnel text-[15px] font-semibold tracking-tight">
                Start a project
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

            <Link
              href="/portfolio"
              className="group inline-flex items-center gap-3 font-jakarta text-[12px] font-semibold uppercase tracking-[0.22em] text-stone-50 cursor-pointer"
            >
              <span className="relative">
                View selected work
                <span className="absolute left-0 -bottom-1 h-px w-full bg-stone-50 origin-left scale-x-100 group-hover:scale-x-0 transition-transform duration-400" />
                <span className="absolute left-0 -bottom-1 h-px w-full bg-[#FF6600] origin-right scale-x-0 group-hover:scale-x-100 transition-transform duration-400 delay-100" />
              </span>
              <svg
                width="20"
                height="10"
                viewBox="0 0 22 10"
                fill="none"
                className="group-hover:translate-x-1 transition-transform"
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

        {/* Trust strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mt-16 md:mt-20 pt-8 border-t border-stone-50/15 grid grid-cols-2 md:grid-cols-4 gap-y-7 gap-x-6"
        >
          {TRUST_POINTS.map((tp, i) => (
            <div key={tp.label} className="flex flex-col">
              <p className="font-funnel font-bold tracking-[-0.025em] text-stone-50 leading-none text-[clamp(1.5rem,2.2vw,2rem)]">
                {tp.label === "Studio rating" ? (
                  <>
                    {tp.value.replace("★", "")}
                    <span className="text-[#FF6600] ml-1">★</span>
                  </>
                ) : (
                  tp.value
                )}
              </p>
              <p className="mt-2 font-jakarta text-[10.5px] font-semibold uppercase tracking-[0.22em] text-stone-400">
                {tp.label}
              </p>
              {i < TRUST_POINTS.length - 1 && (
                <span aria-hidden className="absolute" />
              )}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
