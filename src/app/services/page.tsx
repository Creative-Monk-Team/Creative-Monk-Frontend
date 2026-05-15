"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getServices } from "@/lib/api";
import type { Service } from "@/lib/types";
import { CTA } from "@/components/sections/cta";

/* ─── Three outcome buckets ───────────────────────────────────
   Static. These appear at the top of the page, grouping the
   long list of individual services into meaningful clusters. */
const BUCKETS = [
  {
    roman: "I",
    eyebrow: "Brand & Identity",
    italic: "to feel",
    title: "Brands people remember",
    description:
      "Logo systems, naming, packaging and the printed and digital touchpoints that keep an identity coherent two years post-launch.",
    accent: "#FF6600",
    services: ["Logo & wordmark", "Identity systems", "Naming", "Packaging", "Brand books", "Print collateral"],
  },
  {
    roman: "II",
    eyebrow: "Web & Performance",
    italic: "to convert",
    title: "Websites that close",
    description:
      "Conversion-tuned websites, e-commerce stores, paid media that pays back, and SEO programmes that compound month over month.",
    accent: "#0F0C08",
    services: ["Web design + build", "E-commerce", "Performance marketing", "SEO & content", "Landing pages", "CRO"],
  },
  {
    roman: "III",
    eyebrow: "Motion & Story",
    italic: "to spread",
    title: "Stories worth sharing",
    description:
      "Brand films, social-first reels, product photography and editorial direction that earn the share, not just the impression.",
    accent: "#4A5D3A",
    services: ["Brand films", "Reels & shorts", "Photography", "Animation & motion", "Social strategy", "Editorial"],
  },
];

const HERO_STATS = [
  { value: "3", label: "Outcome buckets" },
  { value: "20+", label: "Capabilities" },
  { value: "4–10", label: "Weeks per engagement" },
  { value: "<4hr", label: "Avg reply" },
];

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [activeBucket, setActiveBucket] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getServices()
      .then(setServices)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="relative">
      <ServicesHero />
      <BucketTabs activeBucket={activeBucket} setActiveBucket={setActiveBucket} />
      <AllServices services={services} loading={loading} />
      <ProcessStrip />
      <CTA />
    </main>
  );
}

/* ─── Hero ─────────────────────────────────────────────────── */
function ServicesHero() {
  return (
    <section className="relative bg-[#FAF7F2] overflow-hidden">
      <div className="hero-grain-paper" aria-hidden />
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 50% 50% at 0% 0%, rgba(255,102,0,0.10), transparent 60%), radial-gradient(ellipse 60% 40% at 100% 100%, rgba(74,93,58,0.05), transparent 60%)",
        }}
      />

      <div className="container relative z-10 pt-12 md:pt-20 pb-16 md:pb-20">
        {/* Masthead row */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="flex items-center justify-between gap-4 mb-10 md:mb-14 pb-5 border-b border-stone-900/10"
        >
          <div className="flex items-center gap-3">
            <span aria-hidden className="block h-px w-9 bg-[#FF6600]" />
            <span className="font-jakarta text-[11px] font-semibold uppercase tracking-[0.26em] text-stone-600">
              Capabilities · what we do
            </span>
          </div>
          <span className="hidden md:flex items-center gap-2 font-jakarta text-[10.5px] font-semibold uppercase tracking-[0.22em] text-stone-500">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 hero-pulse" />
            Currently shipping for 14 brands
          </span>
        </motion.div>

        <div className="grid grid-cols-12 gap-x-8 gap-y-10 items-end">
          <div className="col-span-12 md:col-span-8">
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, ease: [0.2, 0.7, 0.2, 1] }}
              className="font-funnel text-stone-900 font-bold leading-[0.92] tracking-[-0.04em] text-[clamp(2.5rem,6.6vw,5.75rem)] max-w-[16ch]"
            >
              Everything we ship,{" "}
              <span
                style={{
                  fontFamily: "var(--font-newsreader), Georgia, serif",
                  fontStyle: "italic",
                  fontWeight: 500,
                  color: "#FF6600",
                }}
              >
                under one studio.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-8 max-w-[60ch] font-jakarta text-[16.5px] md:text-[18px] leading-[1.6] text-stone-700"
            >
              Three outcome buckets. Twenty-plus individual capabilities. One
              senior team that ships the whole thing — no handoffs to a third
              party agency mid-project.
            </motion.p>
          </div>

          {/* Right stat block */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="col-span-12 md:col-span-4"
          >
            <div className="grid grid-cols-2 gap-3 max-w-md md:ml-auto">
              {HERO_STATS.map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border border-stone-900/10 bg-stone-50 p-4 hover:bg-white hover:border-[#FF6600]/40 transition-all duration-300 cursor-default"
                >
                  <p className="font-funnel font-bold tracking-[-0.025em] text-stone-900 leading-none text-[clamp(1.45rem,2.1vw,1.75rem)]">
                    {s.value}
                  </p>
                  <p className="mt-2.5 font-jakarta text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-500">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ─── Bucket Tabs (Outcome buckets) ───────────────────────── */
function BucketTabs({
  activeBucket,
  setActiveBucket,
}: {
  activeBucket: number;
  setActiveBucket: (i: number) => void;
}) {
  const active = BUCKETS[activeBucket];

  return (
    <section className="relative bg-[#FAF7F2] border-t border-stone-900/10 overflow-hidden">
      <div className="hero-grain-paper" aria-hidden />

      <div className="container relative z-10 py-20 md:py-24">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10 md:mb-12">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <span aria-hidden className="block h-px w-9 bg-[#FF6600]" />
              <span className="font-jakarta text-[11px] font-semibold uppercase tracking-[0.26em] text-stone-600">
                Three buckets
              </span>
            </div>
            <h2 className="font-funnel text-stone-900 font-bold leading-[1.0] tracking-[-0.03em] text-[clamp(1.85rem,3.4vw,2.75rem)] max-w-[24ch]">
              Pick by outcome, not deliverable.
            </h2>
          </div>
          <p className="font-jakarta text-[14.5px] leading-[1.6] text-stone-600 max-w-[42ch]">
            Hover a tab to see what each bucket includes. The studio scopes the
            mix.
          </p>
        </div>

        <div className="grid grid-cols-12 gap-5 md:gap-6 rounded-3xl border border-stone-900/10 bg-stone-50 overflow-hidden">
          {/* Tabs */}
          <div className="col-span-12 lg:col-span-5 flex flex-col">
            {BUCKETS.map((b, i) => {
              const isActive = i === activeBucket;
              return (
                <button
                  key={b.roman}
                  type="button"
                  onMouseEnter={() => setActiveBucket(i)}
                  onClick={() => setActiveBucket(i)}
                  className={`group relative text-left p-6 md:p-7 cursor-pointer transition-all duration-500 overflow-hidden border-stone-900/10 ${
                    i < BUCKETS.length - 1 ? "border-b" : ""
                  } ${isActive ? "bg-white" : "hover:bg-white/40"}`}
                >
                  <motion.span
                    aria-hidden
                    animate={{ scaleY: isActive ? 1 : 0 }}
                    transition={{ duration: 0.5 }}
                    style={{ background: b.accent, transformOrigin: "top" }}
                    className="absolute left-0 top-0 bottom-0 w-[3px]"
                  />

                  <div className="flex items-start gap-4 md:gap-5">
                    <span
                      className="shrink-0 leading-none tracking-[-0.04em] transition-all duration-500"
                      style={{
                        fontFamily: "var(--font-newsreader), Georgia, serif",
                        fontStyle: "italic",
                        fontWeight: 500,
                        fontSize: isActive
                          ? "clamp(3rem, 4.4vw, 4rem)"
                          : "clamp(2rem, 2.8vw, 2.6rem)",
                        color: isActive ? b.accent : "#1c1c1c",
                        opacity: isActive ? 1 : 0.35,
                      }}
                    >
                      {b.roman}
                    </span>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2.5">
                        <span
                          className="block w-1.5 h-1.5 rounded-full transition-all duration-300"
                          style={{ background: b.accent, opacity: isActive ? 1 : 0.3 }}
                        />
                        <span
                          className={`font-jakarta text-[10px] font-semibold uppercase tracking-[0.22em] transition-colors duration-300 ${
                            isActive ? "text-stone-900" : "text-stone-500"
                          }`}
                        >
                          {b.eyebrow}
                        </span>
                      </div>

                      <h3
                        className={`font-funnel font-bold tracking-[-0.025em] leading-[1.15] transition-all duration-500 ${
                          isActive
                            ? "text-stone-900 text-[clamp(1.35rem,1.9vw,1.7rem)]"
                            : "text-stone-500 text-[clamp(1.1rem,1.5vw,1.4rem)]"
                        }`}
                      >
                        {b.title}
                        <span
                          className="block mt-0.5 text-[0.7em]"
                          style={{
                            fontFamily: "var(--font-newsreader), Georgia, serif",
                            fontStyle: "italic",
                            fontWeight: 400,
                            color: isActive ? b.accent === "#0F0C08" ? "#1c1c1c" : b.accent : "#a8a29e",
                          }}
                        >
                          — {b.italic}.
                        </span>
                      </h3>
                    </div>

                    <span
                      className={`shrink-0 grid place-items-center w-9 h-9 rounded-full transition-all duration-500 ${
                        isActive
                          ? "bg-stone-900 text-stone-50 rotate-[-25deg]"
                          : "bg-transparent text-stone-400 border border-stone-900/10"
                      }`}
                    >
                      <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
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

          {/* Preview panel */}
          <div className="col-span-12 lg:col-span-7 relative bg-stone-100 min-h-[420px] lg:min-h-[560px] overflow-hidden">
            {/* big roman numeral background */}
            <motion.span
              key={`r-${active.roman}`}
              initial={{ opacity: 0, scale: 1.08 }}
              animate={{ opacity: 0.07, scale: 1 }}
              transition={{ duration: 0.7 }}
              className="absolute -bottom-10 -right-4 leading-none tracking-[-0.05em] font-bold text-stone-900 select-none pointer-events-none"
              style={{
                fontFamily: "var(--font-newsreader), Georgia, serif",
                fontStyle: "italic",
                fontWeight: 500,
                fontSize: "clamp(12rem, 22vw, 22rem)",
              }}
            >
              {active.roman}
            </motion.span>

            {/* atmospheric gradient */}
            <div
              aria-hidden
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `radial-gradient(ellipse 60% 50% at 0% 0%, ${active.accent}1a, transparent 60%)`,
              }}
            />

            <div className="relative h-full p-7 md:p-10 flex flex-col">
              <div className="flex items-center gap-2 mb-5">
                <span
                  className="block w-1.5 h-1.5 rounded-full"
                  style={{ background: active.accent }}
                />
                <span className="font-jakarta text-[10.5px] font-semibold uppercase tracking-[0.24em] text-stone-700">
                  {active.eyebrow}
                </span>
              </div>

              <motion.h3
                key={`t-${active.roman}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="font-funnel font-bold tracking-[-0.03em] leading-[1.0] text-stone-900 text-[clamp(1.85rem,3vw,2.6rem)] max-w-[18ch]"
              >
                {active.title}
                <span
                  className="block mt-2 text-[0.55em]"
                  style={{
                    fontFamily: "var(--font-newsreader), Georgia, serif",
                    fontStyle: "italic",
                    fontWeight: 400,
                    color: active.accent === "#0F0C08" ? "#1c1c1c" : active.accent,
                  }}
                >
                  — {active.italic}.
                </span>
              </motion.h3>

              <motion.p
                key={`d-${active.roman}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.05 }}
                className="mt-6 font-jakarta text-[15.5px] leading-[1.6] text-stone-700 max-w-[44ch]"
              >
                {active.description}
              </motion.p>

              {/* Services list */}
              <motion.ul
                key={`s-${active.roman}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="mt-auto pt-8 grid grid-cols-2 gap-x-4 gap-y-2.5"
              >
                {active.services.map((s, i) => (
                  <li
                    key={s}
                    className="flex items-baseline gap-2 font-jakarta text-[13.5px] text-stone-700"
                  >
                    <span
                      className="font-mono-ui text-[10px] tabular-nums shrink-0"
                      style={{ color: active.accent }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {s}
                  </li>
                ))}
              </motion.ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── All services grid (from API) ───────────────────────── */
function AllServices({ services, loading }: { services: Service[]; loading: boolean }) {
  if (!loading && services.length === 0) return null;

  return (
    <section className="relative bg-[#FAF7F2] border-t border-stone-900/10 overflow-hidden">
      <div className="hero-grain-paper" aria-hidden />

      <div className="container relative z-10 py-20 md:py-24">
        <div className="grid grid-cols-12 gap-x-8 gap-y-8 items-end mb-12 md:mb-14">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="col-span-12 md:col-span-8"
          >
            <div className="flex items-center gap-3 mb-5">
              <span aria-hidden className="block h-px w-9 bg-[#FF6600]" />
              <span className="font-jakarta text-[11px] font-semibold uppercase tracking-[0.26em] text-stone-600">
                The full menu
              </span>
            </div>
            <h2 className="font-funnel text-stone-900 font-bold leading-[0.98] tracking-[-0.035em] text-[clamp(2rem,4vw,3.5rem)] max-w-[22ch]">
              Every individual capability,{" "}
              <span
                style={{
                  fontFamily: "var(--font-newsreader), Georgia, serif",
                  fontStyle: "italic",
                  fontWeight: 500,
                  color: "#1c1c1c",
                }}
              >
                if you want the details.
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
            <p className="font-jakarta text-[14.5px] leading-[1.6] text-stone-600 max-w-[40ch]">
              The granular list. Click any line to read the full scope, timeline
              and what's included.
            </p>
          </motion.div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-[200px] rounded-2xl bg-stone-200/60 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {services.map((service, i) => (
              <ServiceCard key={service.slug} service={service} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function ServiceCard({ service, index }: { service: Service; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay: (index % 3) * 0.08 }}
    >
      <Link
        href={`/services/${service.slug}`}
        className="group relative flex h-full flex-col rounded-2xl border border-stone-900/10 bg-stone-50 p-6 md:p-7 transition-all duration-500 hover:-translate-y-1.5 hover:border-stone-900/25 hover:bg-white hover:shadow-[0_24px_50px_-30px_rgba(15,12,8,0.2)] cursor-pointer"
      >
        <div className="flex items-baseline justify-between mb-6">
          <span
            className="font-mono-ui text-[10.5px] tabular-nums uppercase tracking-[0.22em] text-stone-400"
          >
            {String(index + 1).padStart(2, "0")} / {service.category || "Service"}
          </span>
          <span className="grid place-items-center w-9 h-9 rounded-full bg-stone-100 text-stone-700 border border-stone-900/10 group-hover:bg-[#FF6600] group-hover:text-stone-900 group-hover:rotate-[-25deg] group-hover:border-[#FF6600] transition-all duration-300">
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
              <path
                d="M2 12 L12 2 M5 2 L12 2 L12 9"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>

        <h3 className="font-funnel text-[clamp(1.2rem,1.6vw,1.45rem)] leading-[1.15] tracking-[-0.02em] font-bold text-stone-900 group-hover:text-stone-900">
          {service.title}
        </h3>

        {service.shortDescription && (
          <p className="mt-3 font-jakarta text-[14px] leading-[1.55] text-stone-600 line-clamp-3 flex-1">
            {service.shortDescription}
          </p>
        )}

        {service.features && service.features.length > 0 && (
          <ul className="mt-5 flex flex-wrap gap-1.5">
            {service.features.slice(0, 3).map((f) => (
              <li
                key={f}
                className="inline-flex items-center gap-1.5 rounded-full border border-stone-900/10 px-2.5 py-1 font-jakarta text-[10.5px] font-semibold uppercase tracking-[0.18em] text-stone-700"
              >
                <span className="block w-1 h-1 rounded-full bg-[#FF6600]" />
                {f}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-6 pt-4 border-t border-stone-900/10 flex items-center justify-between">
          <span className="font-jakarta text-[10.5px] font-semibold uppercase tracking-[0.2em] text-stone-500">
            {service.features?.length || 0} capabilities
          </span>
          <span className="inline-flex items-center gap-1.5 font-jakarta text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-900 group-hover:text-[#FF6600] transition-colors">
            Explore
            <svg
              width="14"
              height="7"
              viewBox="0 0 22 10"
              fill="none"
              className="group-hover:translate-x-0.5 transition-transform"
            >
              <path
                d="M1 5 H 20 M 16 1 L 20 5 L 16 9"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

/* ─── Process strip (compact) ─────────────────────────────── */
function ProcessStrip() {
  const STAGES = [
    { day: "Day 0–3", title: "Discovery", note: "Signed brief" },
    { day: "Day 4–10", title: "Direction", note: "Two routes" },
    { day: "Day 11–25", title: "Craft", note: "Staging live" },
    { day: "Day 26–40", title: "Polish", note: "QA + edge cases" },
    { day: "Day 41–45", title: "Ship", note: "Launch + support" },
  ];

  return (
    <section className="relative bg-[#FAF7F2] border-t border-stone-900/10 overflow-hidden">
      <div className="hero-grain-paper" aria-hidden />

      <div className="container relative z-10 py-20 md:py-24">
        <div className="grid grid-cols-12 gap-x-8 gap-y-8 items-end mb-12 md:mb-14">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="col-span-12 md:col-span-8"
          >
            <div className="flex items-center gap-3 mb-5">
              <span aria-hidden className="block h-px w-9 bg-[#FF6600]" />
              <span className="font-jakarta text-[11px] font-semibold uppercase tracking-[0.26em] text-stone-600">
                How we ship
              </span>
            </div>
            <h2 className="font-funnel text-stone-900 font-bold leading-[0.98] tracking-[-0.035em] text-[clamp(2rem,4vw,3.5rem)] max-w-[20ch]">
              Five stages.{" "}
              <span
                style={{
                  fontFamily: "var(--font-newsreader), Georgia, serif",
                  fontStyle: "italic",
                  fontWeight: 500,
                  color: "#FF6600",
                }}
              >
                Six weeks.
              </span>{" "}
              No mystery.
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="col-span-12 md:col-span-4"
          >
            <p className="font-jakarta text-[14.5px] leading-[1.6] text-stone-600 max-w-[40ch]">
              Every engagement runs on the same rhythm. You'll always know what
              ships in which week, and what artefact you'll receive.
            </p>
          </motion.div>
        </div>

        <div className="relative">
          {/* base line */}
          <div
            aria-hidden
            className="hidden md:block absolute left-0 right-0 top-[22px] h-px bg-stone-900/15"
          />
          <div className="grid grid-cols-1 md:grid-cols-5 gap-y-10 md:gap-x-3 lg:gap-x-4">
            {STAGES.map((s, i) => (
              <motion.div
                key={s.day}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: i * 0.07 }}
                className="relative"
              >
                <div className="relative flex items-center mb-6">
                  <span className="relative z-10 grid place-items-center w-[44px] h-[44px] rounded-full bg-[#FF6600] text-stone-900 shadow-[0_0_0_6px_rgba(250,247,242,1)]">
                    <span className="font-funnel text-[13px] font-bold tracking-tight tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </span>
                </div>
                <p className="font-jakarta text-[10.5px] font-semibold uppercase tracking-[0.22em] text-stone-500 mb-2">
                  {s.day}
                </p>
                <h3 className="font-funnel text-[clamp(1.15rem,1.4vw,1.3rem)] leading-[1.2] tracking-[-0.02em] font-bold text-stone-900">
                  {s.title}
                </h3>
                <p
                  className="mt-2 text-[13px] text-stone-600 leading-[1.5]"
                  style={{
                    fontFamily: "var(--font-newsreader), Georgia, serif",
                    fontStyle: "italic",
                    fontWeight: 400,
                  }}
                >
                  → {s.note}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
