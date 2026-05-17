"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { homepageContentApi } from "@/lib/api";

/* Fallback content. The DB is authoritative; this only renders if
   the API call fails. Edit copy in /admin/super/homepage/hero. */
type DiaryEntry = { day: string; client: string; activity: string; status: string; progress: number };
type BentoStat = { value: number | string; suffix?: string; label: string; animate?: boolean };
type HeroPayload = {
  status?: string;
  eyebrow?: string;
  lineA?: string;
  lineB?: string;
  accent?: string;
  lineC?: string;
  lede?: string;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
  diaryEntries?: DiaryEntry[];
  bentoStats?: BentoStat[];
  marquee?: string[];
};

const FALLBACK_HERO: Required<Omit<HeroPayload, "diaryEntries" | "bentoStats" | "marquee">> & {
  diaryEntries: DiaryEntry[];
  bentoStats: BentoStat[];
  marquee: string[];
} = {
  status: "Booking now · 3 founder slots left for Q3",
  eyebrow: "Founder-led creative studio · since 2018",
  lineA: "We turn ambitious brands",
  lineB: "into",
  accent: "category leaders",
  lineC: "— in 45 days.",
  lede:
    "Brand, website and growth campaigns built by senior craftspeople who pick up the phone. 142 brands shipped. 4.9★ from 87 founders. Fixed scope, fixed fee, no surprises.",
  primary: { label: "Book a free 30-min audit", href: "/contact" },
  secondary: { label: "See proof — selected work", href: "/portfolio" },
  diaryEntries: [
    { day: "Mon", client: "Hive Management",   activity: "Brand workshop · Day 03", status: "Shipping",  progress: 92 },
    { day: "Tue", client: "Woodhouse Café",    activity: "Photo shoot · Sector 17", status: "In review", progress: 72 },
    { day: "Wed", client: "Chatha Foods",      activity: "Packaging rounds · v3",   status: "Designing", progress: 55 },
    { day: "Fri", client: "Brightlight Solar", activity: "Site launch · go-live",   status: "On deck",   progress: 18 },
  ],
  bentoStats: [
    { value: 142,    suffix: "+",   label: "Brands shipped", animate: true },
    { value: 312,    suffix: "%",   label: "Avg lead lift",  animate: true },
    { value: 4.9,    suffix: "★",   label: "From 87 reviews" },
    { value: "<4hr", label: "Avg reply time" },
  ],
  marquee: [
    "Brand Identity",
    "Conversion-Focused Websites",
    "Performance Marketing",
    "SEO that ranks",
    "Brand Films & Reels",
    "Social Strategy",
    "Product UI",
    "E-commerce that sells",
  ],
};

function useHero() {
  const [data, setData] = useState(FALLBACK_HERO);
  useEffect(() => {
    let cancelled = false;
    homepageContentApi.get<HeroPayload>("hero").then((res) => {
      if (cancelled || !res) return;
      setData({
        status:        res.status        ?? FALLBACK_HERO.status,
        eyebrow:       res.eyebrow       ?? FALLBACK_HERO.eyebrow,
        lineA:         res.lineA         ?? FALLBACK_HERO.lineA,
        lineB:         res.lineB         ?? FALLBACK_HERO.lineB,
        accent:        res.accent        ?? FALLBACK_HERO.accent,
        lineC:         res.lineC         ?? FALLBACK_HERO.lineC,
        lede:          res.lede          ?? FALLBACK_HERO.lede,
        primary:       res.primary       ?? FALLBACK_HERO.primary,
        secondary:     res.secondary     ?? FALLBACK_HERO.secondary,
        diaryEntries:  res.diaryEntries?.length  ? res.diaryEntries  : FALLBACK_HERO.diaryEntries,
        bentoStats:    res.bentoStats?.length    ? res.bentoStats    : FALLBACK_HERO.bentoStats,
        marquee:       res.marquee?.length       ? res.marquee       : FALLBACK_HERO.marquee,
      });
    });
    return () => { cancelled = true; };
  }, []);
  return data;
}

export function Hero() {
  const data = useHero();

  return (
    <section className="relative overflow-hidden bg-[#FAF7F2]">
      <div className="hero-grain-paper" aria-hidden />
      <BackgroundAtmosphere />

      <StatusStrip status={data.status} />

      <div className="container relative z-10 pt-10 lg:pt-14 pb-8">
        <div className="grid grid-cols-12 gap-x-8 gap-y-14 items-center">
          {/* LEFT — type column */}
          <div className="col-span-12 lg:col-span-7">
            <div className="flex items-center gap-3 mb-7">
              <span aria-hidden className="block h-px w-9 bg-[#FF6600]" />
              <span className="font-jakarta text-[11px] font-semibold uppercase tracking-[0.26em] text-stone-600">
                {data.eyebrow}
              </span>
            </div>

            <Headline lineA={data.lineA} lineB={data.lineB} accent={data.accent} lineC={data.lineC} />

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.9 }}
              className="mt-7 font-jakarta text-[16.5px] md:text-[17.5px] leading-[1.55] text-stone-700 max-w-[54ch]"
            >
              {data.lede}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.05 }}
              className="mt-9 flex flex-wrap items-center gap-4 md:gap-6"
            >
              <PrimaryCta primary={data.primary} />
              <SecondaryCta secondary={data.secondary} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.2 }}
              className="mt-10"
            >
              <RatingCallout />
            </motion.div>
          </div>

          {/* RIGHT — Studio Diary board */}
          <div className="col-span-12 lg:col-span-5 relative">
            <StudioDiary entries={data.diaryEntries} />
          </div>
        </div>

        <BentoBar stats={data.bentoStats} />
      </div>

      <BottomMarquee items={data.marquee} />
    </section>
  );
}

/* ─── Headline — refined, no decorative font ───
   Approach: the whole headline is Funnel Display.
   The accent uses Fraunces italic (in INK, not orange) for a quiet, classy emphasis,
   with a thin orange underline that sits cleanly under the word.
   No more "graffiti" feel. */
function Headline({
  lineA,
  lineB,
  accent,
  lineC,
}: {
  lineA: string;
  lineB: string;
  accent: string;
  lineC: string;
}) {
  return (
    <h1 className="font-funnel text-stone-900 font-bold leading-[0.96] tracking-[-0.035em] text-[clamp(2.5rem,6vw,5.25rem)]">
      <span className="block">
        <span className="hero-rise inline-block" style={{ animationDelay: "0.05s" }}>
          {lineA}
        </span>
      </span>
      <span className="block">
        <span className="hero-rise inline-block mr-[0.22em]" style={{ animationDelay: "0.18s" }}>
          {lineB}
        </span>
        <span
          className="hero-rise inline-block relative"
          style={{
            animationDelay: "0.3s",
            fontFamily: "var(--font-newsreader), Georgia, serif",
            fontStyle: "italic",
            fontWeight: 500,
            color: "#1c1c1c",
          }}
        >
          {accent}
          <svg
            aria-hidden
            viewBox="0 0 320 8"
            preserveAspectRatio="none"
            className="hero-underline absolute left-0 -bottom-[0.04em] w-full h-[0.18em]"
          >
            <path
              d="M2 5 Q 80 1, 160 4 T 318 3"
              fill="none"
              stroke="#FF6600"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        </span>
      </span>
      <span className="block">
        <span className="hero-rise inline-block" style={{ animationDelay: "0.42s" }}>
          {lineC}
        </span>
      </span>
    </h1>
  );
}

/* ─── Status strip ─── */
function StatusStrip({ status }: { status: string }) {
  return (
    <div className="border-b border-stone-900/10 bg-[#FAF7F2]/70 backdrop-blur-sm relative z-10">
      <div className="container flex items-center justify-between gap-6 py-3 font-jakarta text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-700">
        <span className="flex items-center gap-2">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 hero-pulse" />
          {status}
        </span>
        <span className="hidden md:inline tracking-[0.28em] text-stone-500">
          Est. 2018 · 142 brands · Worldwide
        </span>
        <span className="text-stone-500 hidden sm:flex items-center gap-2">
          <CalendarGlyph />
          <span>Next slot: Aug 12</span>
        </span>
      </div>
    </div>
  );
}

/* ─── Studio Diary board — vertical bulletin showing what's shipping this week ─── */
function StudioDiary({ entries }: { entries: DiaryEntry[] }) {
  return (
    <div className="relative max-w-[440px] mx-auto">
      {/* Decorative pin at top-center */}
      <span
        aria-hidden
        className="absolute -top-2.5 left-1/2 -translate-x-1/2 z-30 w-5 h-5 rounded-full bg-[#FF6600] ring-4 ring-[#FAF7F2] shadow-[0_4px_10px_rgba(255,102,0,0.35)]"
      />

      {/* Floating sticky-note "Open for Q3" stamp */}
      <motion.div
        initial={{ opacity: 0, y: -8, rotate: 0, scale: 0.92 }}
        animate={{ opacity: 1, y: 0, rotate: 6, scale: 1 }}
        transition={{ duration: 0.7, delay: 1.0, type: "spring", stiffness: 200, damping: 18 }}
        className="absolute -top-5 -right-2 md:-right-4 z-40 hero-drift"
        style={{ ["--rot" as any]: "6deg" }}
      >
        <div className="bg-[#FF6600] text-stone-900 rounded-2xl px-4 py-3 shadow-[0_14px_28px_-12px_rgba(255,102,0,0.5)]">
          <p
            className="font-funnel text-[12px] font-bold uppercase tracking-[0.14em] leading-tight flex items-center gap-1.5"
          >
            <DecorativeStar className="w-3.5 h-3.5 text-stone-900" />
            Open for Q3
          </p>
          <p
            className="text-[12.5px] mt-0.5 leading-tight"
            style={{
              fontFamily: "var(--font-newsreader), Georgia, serif",
              fontStyle: "italic",
              fontWeight: 400,
            }}
          >
            3 slots left
          </p>
        </div>
      </motion.div>

      {/* Tiny floating progress badge — bottom-left */}
      <motion.div
        initial={{ opacity: 0, y: 12, x: -10 }}
        animate={{ opacity: 1, y: 0, x: 0 }}
        transition={{ duration: 0.6, delay: 1.2 }}
        className="absolute -bottom-4 -left-3 md:left-2 z-40 hero-drift"
        style={{ ["--rot" as any]: "-3deg" }}
      >
        <div className="bg-stone-900 text-stone-50 rounded-2xl px-4 py-2.5 shadow-[0_20px_36px_-16px_rgba(15,12,8,0.5)] flex items-center gap-3">
          <span className="grid place-items-center w-9 h-9 rounded-full bg-emerald-500 text-stone-900">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M2 7 L6 11 L12 4"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <div>
            <p className="font-jakarta text-[9px] font-semibold uppercase tracking-[0.22em] text-stone-400">
              Avg reply
            </p>
            <p className="font-funnel text-[14px] font-bold tracking-tight leading-none mt-0.5">
              &lt; 4 working hrs
            </p>
          </div>
        </div>
      </motion.div>

      {/* Main diary card */}
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4, ease: [0.2, 0.7, 0.2, 1] }}
        className="relative bg-stone-50 rounded-[28px] border border-stone-900/15 px-7 py-8 md:px-8 md:py-9 shadow-[0_30px_60px_-30px_rgba(15,12,8,0.25)]"
        style={{ transform: "rotate(-0.6deg)" }}
      >
        {/* Header */}
        <div className="flex items-baseline justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 hero-pulse" />
            <span className="font-jakarta text-[10.5px] font-semibold uppercase tracking-[0.24em] text-stone-700">
              Studio Diary
            </span>
          </div>
          <span className="font-jakarta text-[10.5px] font-semibold uppercase tracking-[0.22em] text-stone-500">
            Week 28 · 2026
          </span>
        </div>

        {/* Editorial title */}
        <h3 className="font-funnel font-bold tracking-[-0.025em] leading-[1.1] text-[clamp(1.55rem,2.4vw,1.95rem)] text-stone-900">
          This week we&apos;re{" "}
          <span
            style={{
              fontFamily: "var(--font-newsreader), Georgia, serif",
              fontStyle: "italic",
              fontWeight: 500,
              color: "#FF6600",
            }}
          >
            shipping for…
          </span>
        </h3>

        {/* Diary entries */}
        <ul className="mt-7 space-y-4">
          {entries.map((entry, i) => (
            <motion.li
              key={entry.client}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.7 + i * 0.1 }}
              className="group flex items-center gap-3.5"
            >
              <span className="shrink-0 grid place-items-center w-10 h-10 rounded-full bg-stone-100 border border-stone-900/10">
                <span className="font-jakarta text-[10px] font-bold uppercase tracking-[0.14em] text-stone-700">
                  {entry.day}
                </span>
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-funnel text-[14.5px] font-bold tracking-[-0.015em] text-stone-900 truncate">
                  {entry.client}
                </p>
                <p
                  className="text-[12px] text-stone-500 truncate"
                  style={{
                    fontFamily: "var(--font-newsreader), Georgia, serif",
                    fontStyle: "italic",
                    fontWeight: 400,
                  }}
                >
                  {entry.activity}
                </p>
              </div>
              <div className="shrink-0 flex flex-col items-end gap-1.5">
                <span
                  className={`font-jakarta text-[9px] font-semibold uppercase tracking-[0.18em] ${
                    entry.progress > 80
                      ? "text-emerald-700"
                      : entry.progress > 30
                        ? "text-[#FF6600]"
                        : "text-stone-400"
                  }`}
                >
                  {entry.status}
                </span>
                <span
                  className="block h-1 w-12 rounded-full bg-stone-200 overflow-hidden"
                  aria-label={`${entry.progress}% complete`}
                >
                  <motion.span
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: entry.progress / 100 }}
                    transition={{ duration: 0.9, delay: 1.0 + i * 0.1, ease: "easeOut" }}
                    style={{
                      transformOrigin: "left",
                      background:
                        entry.progress > 80
                          ? "#059669"
                          : entry.progress > 30
                            ? "#FF6600"
                            : "#a8a29e",
                    }}
                    className="block h-full"
                  />
                </span>
              </div>
            </motion.li>
          ))}
        </ul>

        {/* Footer — signature */}
        <div className="mt-7 pt-5 border-t border-stone-900/10 flex items-end justify-between gap-3">
          <div>
            <p
              className="text-[15px] text-stone-700 leading-none"
              style={{
                fontFamily: "var(--font-newsreader), Georgia, serif",
                fontStyle: "italic",
                fontWeight: 400,
              }}
            >
              — Sahil
            </p>
            <p className="font-mono-ui text-[9.5px] uppercase tracking-[0.22em] text-stone-400 mt-1.5">
              Founder · updated 14m ago
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 font-jakarta text-[10px] font-semibold uppercase tracking-[0.22em] text-stone-700">
            <span className="block w-1.5 h-1.5 rounded-full bg-emerald-500 hero-pulse" />
            Live
          </span>
        </div>
      </motion.article>
    </div>
  );
}

function DecorativeStar({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="currentColor" className={className} style={style}>
      <path d="M12 1 L13 9 L20 6 L15 12 L23 13 L15 14 L20 20 L13 17 L12 25 L11 17 L4 20 L9 14 L1 13 L9 12 L4 6 L11 9 Z" />
    </svg>
  );
}

function CalendarGlyph() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden>
      <rect x="1.5" y="3" width="11" height="9.5" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M1.5 6 H 12.5 M 4.5 1.5 V 4 M 9.5 1.5 V 4"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function RatingCallout() {
  return (
    <div className="inline-flex items-center gap-3">
      <div className="flex -space-x-2">
        {[
          { bg: "#FF6600", t: "A" },
          { bg: "#1A1410", t: "M" },
          { bg: "#4A5D3A", t: "K" },
        ].map((a, i) => (
          <span
            key={i}
            className="inline-grid place-items-center w-8 h-8 rounded-full ring-2 ring-[#FAF7F2] text-[11.5px] font-bold text-stone-50 font-jakarta"
            style={{ background: a.bg }}
          >
            {a.t}
          </span>
        ))}
      </div>
      <div className="flex flex-col leading-tight">
        <div className="flex items-center gap-0.5" aria-label="4.9 out of 5">
          {[0, 1, 2, 3, 4].map((s) => (
            <svg
              key={s}
              width="11"
              height="11"
              viewBox="0 0 14 14"
              fill="currentColor"
              className="text-[#FF6600]"
            >
              <path d="M7 0 L8.7 5.3 L14 5.3 L9.7 8.5 L11.4 13.8 L7 10.6 L2.6 13.8 L4.3 8.5 L0 5.3 L5.3 5.3 Z" />
            </svg>
          ))}
        </div>
        <p className="font-jakarta text-[10.5px] font-semibold uppercase tracking-[0.18em] text-stone-600 mt-1">
          4.9 / 5 from 87 founders
        </p>
      </div>
    </div>
  );
}

function PrimaryCta({ primary }: { primary: { label: string; href: string } }) {
  return (
    <Link
      href={primary.href}
      className="group relative inline-flex items-center gap-3 rounded-full bg-stone-900 text-stone-50 pl-6 pr-2 py-2 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-[0_16px_36px_-18px_rgba(15,12,8,0.5)]"
    >
      <span
        aria-hidden
        className="absolute inset-0 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(255,102,0,0.85), transparent)",
        }}
      />
      <span className="relative font-funnel text-[15px] font-semibold tracking-tight">
        {primary.label}
      </span>
      <span className="relative inline-grid place-items-center w-9 h-9 rounded-full bg-[#FF6600] text-stone-900 group-hover:bg-stone-50 group-hover:rotate-[-30deg] transition-all duration-300">
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
  );
}

function SecondaryCta({ secondary }: { secondary: { label: string; href: string } }) {
  return (
    <Link
      href={secondary.href}
      className="group inline-flex items-center gap-3 font-jakarta text-[12px] font-semibold uppercase tracking-[0.22em] text-stone-900 cursor-pointer"
    >
      <span className="relative">
        {secondary.label}
        <span className="absolute left-0 -bottom-1 h-px w-full bg-stone-900 origin-left scale-x-100 group-hover:scale-x-0 transition-transform duration-400" />
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
  );
}

function BentoBar({ stats }: { stats: BentoStat[] }) {
  return (
    <div className="mt-16 md:mt-20 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: i * 0.08 }}
          className="group relative rounded-2xl bg-stone-50 border border-stone-900/10 p-5 md:p-6 hover:border-[#FF6600]/40 hover:bg-white transition-all duration-300 cursor-default"
        >
          <p className="font-funnel font-bold tracking-[-0.025em] text-stone-900 leading-none text-[clamp(1.6rem,2.4vw,2.1rem)]">
            {s.animate && typeof s.value === "number" ? (
              <Counter to={s.value as number} />
            ) : (
              s.value
            )}
            {s.suffix && (
              <span className={s.suffix === "★" ? "text-[#FF6600] ml-1" : "ml-1 text-stone-900"}>
                {s.suffix}
              </span>
            )}
          </p>
          <p className="mt-3 font-jakarta text-[10.5px] font-semibold uppercase tracking-[0.18em] text-stone-500">
            {s.label}
          </p>
        </motion.div>
      ))}
    </div>
  );
}

function Counter({ to }: { to: number }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let started = false;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setVal(to);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started) {
            started = true;
            const start = performance.now();
            const duration = 1400;
            const step = (now: number) => {
              const t = Math.min(1, (now - start) / duration);
              const eased = 1 - Math.pow(1 - t, 3);
              setVal(Math.round(eased * to));
              if (t < 1) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
            io.disconnect();
          }
        });
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [to]);

  return <span ref={ref}>{val}</span>;
}

function BottomMarquee({ items }: { items: string[] }) {
  return (
    <div className="relative z-10 mt-12 md:mt-14 border-y border-stone-900/10 bg-stone-900 text-stone-50 overflow-hidden">
      <div className="hero-marquee py-4">
        {[0, 1].map((dup) => (
          <div
            key={dup}
            aria-hidden={dup === 1}
            className="flex items-center gap-10 pr-10 whitespace-nowrap"
          >
            {items.map((item, i) => (
              <span key={`${dup}-${i}`} className="flex items-center gap-10">
                <span className="font-funnel text-[22px] md:text-[28px] font-bold tracking-[-0.025em] leading-none">
                  {item}
                </span>
                <span className="text-[#FF6600] text-base" aria-hidden>
                  ✦
                </span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function BackgroundAtmosphere() {
  return (
    <>
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 55% 45% at 100% 0%, rgba(255,102,0,0.08), transparent 60%), radial-gradient(ellipse 60% 35% at 0% 100%, rgba(74,93,58,0.05), transparent 60%)",
        }}
      />
      <div
        aria-hidden
        className="absolute -top-24 right-[4%] w-[360px] h-[360px] rounded-full border border-dashed border-stone-900/10 hidden lg:block"
      />
    </>
  );
}
