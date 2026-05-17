"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { homepageContentApi } from "@/lib/api";

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
    name: "Manjeet Chatha",
    role: "Co-founder",
    company: "Chatha Foods",
    initials: "MC",
    sector: "FMCG · Retail",
    outcome: "14 SKUs into DMart",
    accent: "#E5B04A",
  },
  {
    text:
      "Our café went from invisible to a Sector 17 waitlist in three months. Their social team is the only one I've found who actually understands the audience — and the numbers show it every week.",
    name: "Karan Bhalla",
    role: "Owner",
    company: "Woodhouse Café",
    initials: "KB",
    sector: "Hospitality",
    outcome: "+38K Instagram · 90 days",
    accent: "#4A5D3A",
  },
  {
    text:
      "Their brief alone is worth what most agencies charge for the whole project. We knew within one call we were dealing with a different kind of studio. Search traffic tripled inside two quarters.",
    name: "Riya Bansal",
    role: "Marketing Director",
    company: "Brightlight Solar",
    initials: "RB",
    sector: "Renewable Energy",
    outcome: "3× organic search traffic",
    accent: "#0F0C08",
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
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section
      className="relative bg-[#FAF7F2] border-t border-stone-900/10 overflow-hidden"
      aria-label="Client testimonials"
    >
      <div className="hero-grain-paper" aria-hidden />

      <div className="container relative z-10 py-20 md:py-28">
        {/* Header */}
        <div className="grid grid-cols-12 gap-x-8 gap-y-8 items-end mb-12 md:mb-16">
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
                What clients say
              </span>
            </div>
            <h2 className="font-funnel text-stone-900 font-bold leading-[0.98] tracking-[-0.035em] text-[clamp(2.25rem,5vw,4.5rem)] max-w-[18ch]">
              The reviews{" "}
              <span
                style={{
                  fontFamily: "var(--font-newsreader), Georgia, serif",
                  fontStyle: "italic",
                  fontWeight: 500,
                  color: "#1c1c1c",
                }}
              >
                we frame on the wall.
              </span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="col-span-12 md:col-span-4 md:justify-self-end"
          >
            <div className="inline-flex items-center gap-4 rounded-2xl border border-stone-900/10 bg-stone-50 px-5 py-4">
              <div
                className="flex items-center gap-0.5"
                aria-label="4.9 out of 5"
              >
                {[0, 1, 2, 3, 4].map((s) => (
                  <svg
                    key={s}
                    width="13"
                    height="13"
                    viewBox="0 0 14 14"
                    fill="currentColor"
                    className="text-[#FF6600]"
                  >
                    <path d="M7 0 L8.7 5.3 L14 5.3 L9.7 8.5 L11.4 13.8 L7 10.6 L2.6 13.8 L4.3 8.5 L0 5.3 L5.3 5.3 Z" />
                  </svg>
                ))}
              </div>
              <div className="leading-tight">
                <p className="font-funnel text-[20px] font-bold tracking-tight text-stone-900">
                  4.9{" "}
                  <span className="font-jakarta text-[12px] font-semibold uppercase tracking-[0.18em] text-stone-500">
                    / 5
                  </span>
                </p>
                <p className="font-jakarta text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500 mt-0.5">
                  87 verified reviews
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Featured testimonial — full width, two-column inside */}
        <motion.figure
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.2, 0.7, 0.2, 1] }}
          className="relative rounded-3xl border border-stone-900/10 bg-stone-50 overflow-hidden mb-5 md:mb-6"
        >
          {/* atmosphere */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 40% 60% at 100% 0%, rgba(255,102,0,0.10), transparent 60%)",
            }}
          />
          {/* opening glyph */}
          <span
            aria-hidden
            className="absolute -top-2 right-5 text-[clamp(7rem,12vw,11rem)] leading-none text-[#FF6600]/15 select-none pointer-events-none"
            style={{
              fontFamily: "var(--font-newsreader), Georgia, serif",
              fontStyle: "italic",
              fontWeight: 500,
            }}
          >
            &ldquo;
          </span>

          <div className="relative grid grid-cols-12 gap-x-8 gap-y-7 p-8 md:p-10 lg:p-12 items-center">
            {/* Quote column */}
            <div className="col-span-12 lg:col-span-8">
              <div className="flex flex-wrap items-center gap-2.5 mb-6">
                <span className="inline-flex items-center gap-2 rounded-full bg-stone-900 text-stone-50 px-3 py-1.5 font-jakarta text-[10.5px] font-semibold uppercase tracking-[0.22em]">
                  <span className="block w-1.5 h-1.5 rounded-full bg-[#FF6600]" />
                  Featured · 8-year client
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-stone-900/15 px-3 py-1.5 font-jakarta text-[10.5px] font-semibold uppercase tracking-[0.22em] text-stone-700">
                  Outcome · {FEATURED.outcome}
                </span>
              </div>

              <blockquote
                className="font-funnel text-stone-900 font-medium leading-[1.22] tracking-[-0.02em] text-[clamp(1.45rem,2.4vw,2.15rem)] max-w-[36ch]"
              >
                <span
                  style={{
                    fontFamily: "var(--font-newsreader), Georgia, serif",
                    fontStyle: "italic",
                    fontWeight: 500,
                    color: FEATURED.accent,
                  }}
                >
                  &ldquo;
                </span>
                {FEATURED.text}
                <span
                  style={{
                    fontFamily: "var(--font-newsreader), Georgia, serif",
                    fontStyle: "italic",
                    fontWeight: 500,
                    color: FEATURED.accent,
                  }}
                >
                  &rdquo;
                </span>
              </blockquote>

              <figcaption className="mt-7 pt-6 border-t border-stone-900/10 flex items-center gap-4">
                <Avatar quote={FEATURED} size="lg" />
                <div className="flex-1 min-w-0">
                  <p className="font-funnel text-[16px] font-bold tracking-[-0.015em] text-stone-900 leading-none">
                    {FEATURED.name}
                  </p>
                  <p className="font-jakarta text-[12.5px] text-stone-600 mt-1.5">
                    {FEATURED.role} · {FEATURED.company} · {FEATURED.sector}
                  </p>
                </div>
                <div className="hidden md:flex gap-0.5 shrink-0">
                  {[0, 1, 2, 3, 4].map((s) => (
                    <svg
                      key={s}
                      width="12"
                      height="12"
                      viewBox="0 0 14 14"
                      fill="currentColor"
                      className="text-[#FF6600]"
                    >
                      <path d="M7 0 L8.7 5.3 L14 5.3 L9.7 8.5 L11.4 13.8 L7 10.6 L2.6 13.8 L4.3 8.5 L0 5.3 L5.3 5.3 Z" />
                    </svg>
                  ))}
                </div>
              </figcaption>
            </div>

            {/* Metric column — fills the right side meaningfully */}
            <div className="col-span-12 lg:col-span-4 lg:border-l border-stone-900/10 lg:pl-8">
              <div className="flex flex-col">
                <span className="font-jakarta text-[10.5px] font-semibold uppercase tracking-[0.22em] text-stone-500 mb-3">
                  Lead quality, before / after
                </span>
                <div className="flex items-baseline gap-3">
                  <p
                    className="font-funnel font-bold text-stone-900 leading-none tracking-[-0.04em] text-[clamp(3.4rem,7vw,5.5rem)]"
                  >
                    +312%
                  </p>
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="text-[#FF6600] mb-2"
                    aria-hidden
                  >
                    <path
                      d="M5 19 L19 5 M8 5 L19 5 L19 16"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <p className="mt-3 font-jakarta text-[13.5px] leading-[1.5] text-stone-600 max-w-[28ch]">
                  Qualified leads jumped from{" "}
                  <span className="text-stone-900 font-semibold">22/month</span>{" "}
                  to{" "}
                  <span className="text-stone-900 font-semibold">91/month</span>{" "}
                  within 90 days of relaunch.
                </p>

                {/* Mini visual bar */}
                <div className="mt-5">
                  <div className="flex items-end gap-2 h-14">
                    <div className="flex-1 flex flex-col items-center gap-2">
                      <div
                        className="w-full rounded-md bg-stone-300"
                        style={{ height: "30%" }}
                      />
                      <span className="font-jakarta text-[10px] uppercase tracking-[0.18em] text-stone-500 font-semibold">
                        Before
                      </span>
                    </div>
                    <div className="flex-1 flex flex-col items-center gap-2">
                      <div
                        className="w-full rounded-md bg-[#FF6600]"
                        style={{ height: "100%" }}
                      />
                      <span className="font-jakarta text-[10px] uppercase tracking-[0.18em] text-stone-900 font-semibold">
                        After
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.figure>

        {/* Supporting cards — 3 across */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {SUPPORTING.map((q, i) => (
            <SupportingCard key={q.name} quote={q} index={i} />
          ))}
        </div>

        {/* Bottom band */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="mt-10 md:mt-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-t border-stone-900/10 pt-6"
        >
          <p className="font-jakarta text-[12.5px] leading-[1.55] text-stone-600 max-w-[68ch]">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 align-middle mr-2 hero-pulse" />
            All quotes verified · client-signed before publishing ·{" "}
            <span className="text-stone-900 font-semibold">
              we don't ghost-write reviews, ever.
            </span>
          </p>
          <a
            href="/case-studies"
            className="group inline-flex items-center gap-2 font-jakarta text-[12px] font-semibold uppercase tracking-[0.22em] text-stone-900 cursor-pointer"
          >
            <span className="relative">
              Read full case studies
              <span className="absolute left-0 -bottom-1 h-px w-full bg-stone-900 origin-left scale-x-100 group-hover:scale-x-0 transition-transform duration-400" />
              <span className="absolute left-0 -bottom-1 h-px w-full bg-[#FF6600] origin-right scale-x-0 group-hover:scale-x-100 transition-transform duration-400 delay-100" />
            </span>
            <svg
              width="18"
              height="9"
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
          </a>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Supporting (smaller) card ─── */
function SupportingCard({ quote, index }: { quote: Quote; index: number }) {
  return (
    <motion.figure
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: 0.1 + index * 0.08, ease: [0.2, 0.7, 0.2, 1] }}
      className="group relative rounded-3xl border border-stone-900/10 bg-stone-50 p-6 md:p-7 transition-all duration-500 hover:-translate-y-1 hover:border-stone-900/20 hover:shadow-[0_24px_50px_-30px_rgba(15,12,8,0.2)] flex flex-col h-full"
    >
      {/* outcome chip */}
      <span
        className="inline-flex items-center gap-2 rounded-full border px-2.5 py-1 font-jakarta text-[9.5px] font-semibold uppercase tracking-[0.2em] mb-4"
        style={{
          color: quote.accent === "#0F0C08" ? "#0F0C08" : quote.accent,
          borderColor:
            quote.accent === "#0F0C08" ? "rgba(15,12,8,0.2)" : `${quote.accent}55`,
        }}
      >
        <span
          className="block w-1 h-1 rounded-full"
          style={{ background: quote.accent }}
        />
        {quote.outcome}
      </span>

      <blockquote
        className="font-funnel text-stone-900 font-medium leading-[1.4] tracking-[-0.015em] text-[15.5px] flex-1"
      >
        &ldquo;{quote.text}&rdquo;
      </blockquote>

      <figcaption className="mt-5 pt-4 border-t border-stone-900/10 flex items-center gap-3">
        <Avatar quote={quote} size="sm" />
        <div className="flex-1 min-w-0">
          <p className="font-funnel text-[14px] font-bold tracking-[-0.015em] text-stone-900 leading-none truncate">
            {quote.name}
          </p>
          <p className="font-jakarta text-[11.5px] text-stone-500 mt-1 truncate">
            {quote.role} · {quote.company}
          </p>
        </div>
        <div className="hidden md:flex gap-0.5 shrink-0">
          {[0, 1, 2, 3, 4].map((s) => (
            <svg
              key={s}
              width="10"
              height="10"
              viewBox="0 0 14 14"
              fill="currentColor"
              className="text-[#FF6600]"
            >
              <path d="M7 0 L8.7 5.3 L14 5.3 L9.7 8.5 L11.4 13.8 L7 10.6 L2.6 13.8 L4.3 8.5 L0 5.3 L5.3 5.3 Z" />
            </svg>
          ))}
        </div>
      </figcaption>
    </motion.figure>
  );
}

/* ─── Reusable monogram avatar ─── */
function Avatar({ quote, size }: { quote: Quote; size: "sm" | "lg" }) {
  const dim = size === "lg" ? "w-14 h-14" : "w-10 h-10";
  const text = size === "lg" ? "text-[17px]" : "text-[13px]";
  return (
    <div
      className={`relative grid place-items-center rounded-full shrink-0 ring-2 ring-[#FAF7F2] ${dim}`}
      style={{
        background:
          quote.accent === "#E5B04A" ? "#0F0C08" : quote.accent,
        color: quote.accent === "#E5B04A" ? "#E5B04A" : "#FAF7F2",
      }}
    >
      <span
        className={`font-funnel font-bold tracking-tight ${text}`}
      >
        {quote.initials}
      </span>
      {/* tiny verified glyph */}
      <span
        aria-hidden
        className="absolute -bottom-1 -right-1 grid place-items-center w-5 h-5 rounded-full bg-[#FAF7F2] border border-stone-900/10"
      >
        <svg
          width="9"
          height="9"
          viewBox="0 0 10 10"
          fill="none"
          className="text-[#FF6600]"
        >
          <path
            d="M2 5 L4.2 7 L8 3"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </div>
  );
}
