"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { homepageContentApi } from "@/lib/api";
import { Magnetic } from "@/components/motion/magnetic";
import { MeshBackdrop } from "@/components/motion/mesh-backdrop";
import { MarqueeStrip } from "@/components/motion/marquee-strip";

/* ─── Hero v2 — "Statement & Proof" ───────────────────────────
   Confidence over cleverness. Big editorial type carries the
   promise; the right column carries the live proof; a stat ribbon
   under the CTAs locks in the case in three seconds. */

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

const FALLBACK_HERO = {
  status: "Booking now · 3 founder slots left for Q3",
  eyebrow: "Founder-led creative studio · since 2018",
  lineA: "We turn ambitious brands",
  lineB: "into",
  accent: "category leaders",
  lineC: "— in 45 days.",
  lede:
    "Brand, website and growth campaigns built by senior craftspeople who pick up the phone. Fixed scope, fixed fee, no surprises.",
  primary: { label: "Book a free 30-min audit", href: "/contact" },
  secondary: { label: "See selected work", href: "/portfolio" },
  diaryEntries: [
    { day: "MON", client: "Hive Management",   activity: "Brand workshop · Day 03", status: "Shipping",  progress: 92 },
    { day: "TUE", client: "Woodhouse Café",    activity: "Photo shoot · Sector 17", status: "In review", progress: 72 },
    { day: "WED", client: "Chatha Foods",      activity: "Packaging rounds · v3",   status: "Designing", progress: 55 },
    { day: "FRI", client: "Brightlight Solar", activity: "Site launch · go-live",   status: "On deck",   progress: 18 },
  ] as DiaryEntry[],
  bentoStats: [
    { value: 142,    suffix: "+", label: "Brands shipped", animate: true },
    { value: 312,    suffix: "%", label: "Avg lead lift",  animate: true },
    { value: 4.9,    suffix: "★", label: "From 87 reviews" },
    { value: "<4hr",            label: "Avg reply time" },
  ] as BentoStat[],
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
        diaryEntries:  res.diaryEntries?.length ? res.diaryEntries  : FALLBACK_HERO.diaryEntries,
        bentoStats:    res.bentoStats?.length   ? res.bentoStats    : FALLBACK_HERO.bentoStats,
        marquee:       res.marquee?.length      ? res.marquee       : FALLBACK_HERO.marquee,
      });
    });
    return () => { cancelled = true; };
  }, []);
  return data;
}

export function Hero() {
  const data = useHero();
  const sectionRef = useRef<HTMLElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const meshY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0.4]);

  return (
    <section
      ref={sectionRef}
      className="relative isolate overflow-hidden"
      style={{ background: "var(--site-bg, #0A0807)", color: "var(--site-fg, #F5F1E8)" }}
    >
      <motion.div style={{ y: meshY }} className="absolute inset-0">
        <MeshBackdrop />
      </motion.div>

      <StatusStrip status={data.status} />

      <motion.div style={{ opacity: contentOpacity }} className="relative z-10 container pt-16 lg:pt-20 pb-12">
        {/* TOP — eyebrow row */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.2, 0.7, 0.2, 1] }}
          className="flex items-center justify-between gap-6 mb-12 md:mb-16"
        >
          <div className="flex items-center gap-3">
            <span aria-hidden style={{ display: "block", height: 1, width: 36, background: "var(--site-accent)" }} />
            <span className="site-eyebrow">{data.eyebrow}</span>
          </div>
          <span className="site-mono hidden md:inline" style={{ fontSize: 10.5, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--site-fg-dim)" }}>
            ⌘ Mohali · 30.64°N · MMXVIII
          </span>
        </motion.div>

        {/* CENTER — statement + right rail */}
        <div className="grid grid-cols-12 gap-x-8 gap-y-12 items-start">
          {/* Statement */}
          <div className="col-span-12 lg:col-span-8">
            <Statement lines={data} />

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.7, ease: [0.2, 0.7, 0.2, 1] }}
              className="mt-8 md:mt-10 max-w-[58ch]"
              style={{ fontSize: "clamp(16px, 1.45vw, 18.5px)", lineHeight: 1.55, color: "var(--site-fg-mute)" }}
            >
              {data.lede}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.85, ease: [0.2, 0.7, 0.2, 1] }}
              className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-5"
            >
              <PrimaryCta primary={data.primary} />
              <SecondaryCta secondary={data.secondary} />
              <Link
                href="#process"
                data-cursor="link"
                className="site-mono hidden md:inline-flex items-center gap-1.5 group"
                style={{
                  fontSize: 11,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "var(--site-fg-dim)",
                  paddingLeft: "1rem",
                  borderLeft: "1px solid var(--site-line)",
                }}
              >
                How we work
                <span className="group-hover:translate-x-1 transition-transform">↓</span>
              </Link>
            </motion.div>

            {/* Inline proof ribbon — sits below CTAs, four metrics, single row */}
            <ProofRibbon stats={data.bentoStats} />
          </div>

          {/* Right rail — Studio Diary, refined */}
          <div className="col-span-12 lg:col-span-4">
            <StudioDiary entries={data.diaryEntries} />
          </div>
        </div>
      </motion.div>

      <BottomMarquee items={data.marquee} />
    </section>
  );
}

/* ─── Statement ─────────────────────────────────────────────────
   Huge editorial type. No tricks — bare visibility with a slow
   blur-in on each line so it lands cinematically. */
function Statement({
  lines,
}: {
  lines: { lineA: string; lineB: string; accent: string; lineC: string };
}) {
  return (
    <h1
      className="site-display"
      style={{
        fontSize: "clamp(2.75rem, 8vw, 7.5rem)",
        letterSpacing: "-0.04em",
        lineHeight: 0.92,
        fontWeight: 600,
        color: "var(--site-fg)",
      }}
    >
      <motion.span
        initial={{ opacity: 0, y: 24, filter: "blur(12px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 1.05, delay: 0.2, ease: [0.2, 0.7, 0.2, 1] }}
        className="block"
      >
        {lines.lineA}
      </motion.span>

      <motion.span
        initial={{ opacity: 0, y: 24, filter: "blur(12px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 1.05, delay: 0.35, ease: [0.2, 0.7, 0.2, 1] }}
        className="block"
      >
        {lines.lineB}{" "}
        <span
          style={{
            position: "relative",
            display: "inline-block",
            fontFamily: "var(--font-newsreader), Georgia, serif",
            fontStyle: "italic",
            fontWeight: 500,
            color: "var(--site-accent)",
          }}
        >
          {lines.accent}
          {/* Hand-drawn underline */}
          <motion.svg
            aria-hidden
            viewBox="0 0 320 8"
            preserveAspectRatio="none"
            className="absolute left-0"
            style={{ bottom: "-0.02em", height: "0.12em", width: "100%" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 1.1 }}
          >
            <motion.path
              d="M2 5 Q 80 1, 160 4 T 318 3"
              fill="none"
              stroke="var(--site-accent)"
              strokeWidth="3"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.1, delay: 1.1, ease: "easeOut" }}
            />
          </motion.svg>
        </span>
      </motion.span>

      <motion.span
        initial={{ opacity: 0, y: 24, filter: "blur(12px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 1.05, delay: 0.5, ease: [0.2, 0.7, 0.2, 1] }}
        className="block"
      >
        {lines.lineC}
      </motion.span>
    </h1>
  );
}

/* ─── Status strip — same shape, refined ───────────────────── */
function StatusStrip({ status }: { status: string }) {
  return (
    <div
      className="relative z-10"
      style={{ borderBottom: "1px solid var(--site-line)", background: "rgba(10,8,7,0.65)", backdropFilter: "blur(10px)" }}
    >
      <div className="container flex items-center justify-between gap-6 py-3.5 site-eyebrow" style={{ color: "var(--site-fg-mute)" }}>
        <span className="flex items-center gap-2.5">
          <span
            aria-hidden
            style={{
              width: 7, height: 7,
              borderRadius: "50%",
              background: "#30A46C",
              boxShadow: "0 0 10px rgba(48,164,108,0.7)",
              animation: "site-pulse 1.6s ease-in-out infinite",
            }}
          />
          {status}
        </span>
        <span className="hidden md:inline" style={{ color: "var(--site-fg-dim)" }}>
          Est. 2018 · 142 brands · Worldwide
        </span>
        <span className="hidden sm:inline" style={{ color: "var(--site-fg-dim)" }}>
          Next slot · Aug 12
        </span>
      </div>
      <style jsx>{`
        @keyframes site-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.55; transform: scale(1.25); }
        }
      `}</style>
    </div>
  );
}

/* ─── Proof ribbon ──────────────────────────────────────────────
   Single dense row of four stats sitting just under the CTAs.
   Reads as a one-line case: 142+ brands · +312% leads · 4.9★ · <4hr. */
function ProofRibbon({ stats }: { stats: BentoStat[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay: 1.1, ease: [0.2, 0.7, 0.2, 1] }}
      className="mt-12 md:mt-16 site-glass"
      style={{
        borderRadius: 14,
        padding: 4,
      }}
    >
      <div
        className="grid grid-cols-2 md:grid-cols-4"
        style={{ background: "var(--site-line)", gap: 1, borderRadius: 10, overflow: "hidden" }}
      >
        {stats.map((s, i) => (
          <div
            key={s.label}
            className="px-5 py-4 md:px-6 md:py-5"
            style={{ background: "rgba(10,8,7,0.7)" }}
          >
            <p
              className="site-display flex items-baseline"
              style={{
                fontSize: "clamp(1.5rem, 2.6vw, 2.1rem)",
                letterSpacing: "-0.025em",
                color: i === 0 || i === 1 ? "var(--site-accent)" : "var(--site-fg)",
              }}
            >
              {typeof s.value === "number" ? <Counter to={s.value} /> : <span>{s.value}</span>}
              {s.suffix ? (
                <span style={{ marginLeft: "0.12em", fontSize: "0.65em", color: "inherit" }}>
                  {s.suffix}
                </span>
              ) : null}
            </p>
            <p className="mt-1.5 site-eyebrow" style={{ color: "var(--site-fg-mute)" }}>
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
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
            const duration = 1500;
            const step = (now: number) => {
              const t = Math.min(1, (now - start) / duration);
              const eased = 1 - Math.pow(1 - t, 3);
              const isFloat = !Number.isInteger(to);
              setVal(isFloat ? Number((eased * to).toFixed(1)) : Math.round(eased * to));
              if (t < 1) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
            io.disconnect();
          }
        });
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [to]);
  return <span ref={ref}>{val}</span>;
}

/* ─── Studio Diary — refined, smaller, tighter ───────────────── */
function StudioDiary({ entries }: { entries: DiaryEntry[] }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.55, ease: [0.2, 0.7, 0.2, 1] }}
      className="relative site-glass overflow-hidden"
      style={{ borderRadius: 18, padding: "1.5rem 1.5rem 1.25rem 1.5rem" }}
    >
      {/* Accent top stroke */}
      <span
        aria-hidden
        className="absolute top-0 left-6 right-6"
        style={{
          height: 2,
          background: "linear-gradient(90deg, transparent, var(--site-accent) 50%, transparent)",
          boxShadow: "0 0 12px rgba(255,102,0,0.5)",
        }}
      />

      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <span aria-hidden style={{ width: 6, height: 6, borderRadius: "50%", background: "#30A46C", boxShadow: "0 0 8px rgba(48,164,108,0.7)" }} />
          <span className="site-eyebrow">Studio diary · live</span>
        </div>
        <span className="site-eyebrow" style={{ color: "var(--site-fg-dim)" }}>
          Wk 28
        </span>
      </div>

      <p
        className="site-italic mb-5"
        style={{
          fontSize: 14,
          color: "var(--site-fg-mute)",
        }}
      >
        Shipping this week for…
      </p>

      <ul className="space-y-3.5">
        {entries.slice(0, 4).map((entry, i) => (
          <motion.li
            key={entry.client}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.85 + i * 0.08 }}
            className="flex items-center gap-3"
          >
            <span
              className="site-mono shrink-0"
              style={{
                width: 36, height: 28,
                display: "grid",
                placeItems: "center",
                fontSize: 9.5,
                fontWeight: 700,
                letterSpacing: "0.14em",
                color: "var(--site-fg)",
                background: "rgba(245,241,232,0.04)",
                border: "1px solid var(--site-line)",
              }}
            >
              {entry.day}
            </span>
            <div className="flex-1 min-w-0">
              <p className="site-display truncate" style={{ fontSize: 13.5, letterSpacing: "-0.01em", color: "var(--site-fg)" }}>
                {entry.client}
              </p>
              <p className="site-italic truncate" style={{ fontSize: 11.5, color: "var(--site-fg-dim)" }}>
                {entry.activity}
              </p>
            </div>
            <span
              className="site-mono shrink-0"
              style={{
                fontSize: 8.5,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color:
                  entry.progress > 80 ? "#30A46C" :
                  entry.progress > 30 ? "var(--site-accent)" :
                  "var(--site-fg-dim)",
              }}
            >
              {entry.status}
            </span>
          </motion.li>
        ))}
      </ul>

      <div
        className="mt-5 pt-4 flex items-center justify-between"
        style={{ borderTop: "1px solid var(--site-line)" }}
      >
        <p className="site-italic" style={{ fontSize: 12.5, color: "var(--site-fg-mute)" }}>
          — Sahil, founder
        </p>
        <Link
          href="/portfolio"
          data-cursor="link"
          className="site-mono group"
          style={{
            fontSize: 10,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "var(--site-accent)",
          }}
        >
          See full ledger
          <span aria-hidden className="ml-1.5 inline-block group-hover:translate-x-0.5 transition-transform">→</span>
        </Link>
      </div>
    </motion.article>
  );
}

/* ─── CTAs ───────────────────────────────────────────────────── */
function PrimaryCta({ primary }: { primary: { label: string; href: string } }) {
  return (
    <Magnetic strength={0.38} radius={150}>
      <Link
        href={primary.href}
        data-cursor="link"
        className="group relative inline-flex items-center gap-3 overflow-hidden pl-7 pr-3 py-3 site-neon"
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
          style={{ fontFamily: "var(--font-funnel-display)", fontSize: 15, letterSpacing: "-0.005em" }}
        >
          {primary.label}
        </span>
        <span
          className="relative z-10 inline-grid place-items-center transition-transform duration-300 group-hover:rotate-[-30deg]"
          style={{
            width: 38, height: 38, borderRadius: "50%",
            background: "#0A0807",
            color: "var(--site-accent)",
          }}
        >
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
            <path d="M2 12 L12 2 M5 2 L12 2 L12 9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </Link>
    </Magnetic>
  );
}

function SecondaryCta({ secondary }: { secondary: { label: string; href: string } }) {
  return (
    <Link
      href={secondary.href}
      data-cursor="link"
      className="group inline-flex items-center gap-3 site-mono"
      style={{
        fontSize: 11.5,
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        color: "var(--site-fg)",
        fontWeight: 600,
      }}
    >
      <span className="relative">
        {secondary.label}
        <span aria-hidden className="absolute left-0 -bottom-1 h-px w-full" style={{ background: "var(--site-fg)" }} />
        <span aria-hidden className="absolute left-0 -bottom-1 h-px w-full origin-right scale-x-0 group-hover:scale-x-100 transition-transform duration-500 delay-100" style={{ background: "var(--site-accent)" }} />
      </span>
      <span aria-hidden className="group-hover:translate-x-1 transition-transform">
        <svg width="20" height="10" viewBox="0 0 22 10" fill="none">
          <path d="M1 5 H 20 M 16 1 L 20 5 L 16 9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </Link>
  );
}

/* ─── Bottom marquee ─────────────────────────────────────────── */
function BottomMarquee({ items }: { items: string[] }) {
  return (
    <div
      className="relative z-10 mt-12 md:mt-16"
      style={{ borderTop: "1px solid var(--site-line)", borderBottom: "1px solid var(--site-line)", background: "var(--site-bg-soft)" }}
    >
      <MarqueeStrip duration={55}>
        {items.map((item, i) => (
          <span key={i} className="flex items-center gap-12 pr-12 py-5">
            <span
              className="site-display whitespace-nowrap"
              style={{ fontSize: "clamp(1.5rem, 2vw, 2rem)", letterSpacing: "-0.022em", color: "var(--site-fg)" }}
            >
              {item}
            </span>
            <span aria-hidden style={{ color: "var(--site-accent)", fontSize: 18 }}>
              ✦
            </span>
          </span>
        ))}
      </MarqueeStrip>
    </div>
  );
}
