"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { homepageContentApi } from "@/lib/api";
import { TextReveal } from "@/components/motion/text-reveal";
import { Magnetic } from "@/components/motion/magnetic";
import { MeshBackdrop } from "@/components/motion/mesh-backdrop";
import { MarqueeStrip } from "@/components/motion/marquee-strip";

/* ─── Hero — "After-hours Studio" ──────────────────────────────
   Dark warm-black canvas + neon-orange light source. Word-by-word
   headline reveal, animated mesh backdrop, magnetic CTAs, kinetic
   stat bento, bottom marquee. */

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
    "Brand, website and growth campaigns built by senior craftspeople who pick up the phone. 142 brands shipped. 4.9★ from 87 founders. Fixed scope, fixed fee, no surprises.",
  primary: { label: "Book a free 30-min audit", href: "/contact" },
  secondary: { label: "See proof — selected work", href: "/portfolio" },
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

  /* Parallax: hero content drifts up slightly faster than scroll,
     mesh backdrop drifts down. Keeps the section feeling alive. */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const meshY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const meshScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  return (
    <section
      ref={sectionRef}
      className="relative isolate overflow-hidden"
      style={{ background: "var(--site-bg, #0A0807)", color: "var(--site-fg, #F5F1E8)" }}
    >
      <motion.div style={{ y: meshY, scale: meshScale }} className="absolute inset-0">
        <MeshBackdrop />
      </motion.div>

      <StatusStrip status={data.status} />

      <div className="relative z-10 container pt-20 lg:pt-28 pb-12">
        <motion.div style={{ y: contentY }} className="grid grid-cols-12 gap-x-8 gap-y-16 items-start">
          {/* LEFT — type column */}
          <div className="col-span-12 lg:col-span-7">
            <Eyebrow text={data.eyebrow} />
            <Headline
              lineA={data.lineA}
              lineB={data.lineB}
              accent={data.accent}
              lineC={data.lineC}
            />
            <motion.p
              initial={{ opacity: 0, y: 14, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.9, delay: 1.05, ease: [0.2, 0.7, 0.2, 1] }}
              className="mt-8 text-[16px] md:text-[17.5px] leading-[1.6] max-w-[56ch]"
              style={{ color: "var(--site-fg-mute)" }}
            >
              {data.lede}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2, ease: [0.2, 0.7, 0.2, 1] }}
              className="mt-10 flex flex-wrap items-center gap-5"
            >
              <PrimaryCta primary={data.primary} />
              <SecondaryCta secondary={data.secondary} />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.35, ease: [0.2, 0.7, 0.2, 1] }}
              className="mt-12"
            >
              <RatingCallout />
            </motion.div>
          </div>

          {/* RIGHT — Studio Diary */}
          <div className="col-span-12 lg:col-span-5">
            <StudioDiary entries={data.diaryEntries} />
          </div>
        </motion.div>

        <BentoBar stats={data.bentoStats} />
      </div>

      <BottomMarquee items={data.marquee} />
    </section>
  );
}

/* ─── Eyebrow ────────────────────────────────────────────────── */
function Eyebrow({ text }: { text: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.1 }}
      className="flex items-center gap-3 mb-8"
    >
      <span aria-hidden style={{ display: "block", height: 1, width: 36, background: "var(--site-accent)" }} />
      <span className="site-eyebrow">{text}</span>
    </motion.div>
  );
}

/* ─── Headline ───────────────────────────────────────────────── */
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
    <h1
      className="site-display"
      style={{
        fontSize: "clamp(2.5rem, 6.4vw, 5.75rem)",
        letterSpacing: "-0.035em",
        lineHeight: 0.94,
      }}
    >
      <TextReveal as="span" delay={0.15} stagger={0.05}>
        {lineA}
      </TextReveal>
      <br />
      <TextReveal as="span" delay={0.35} stagger={0.05}>
        {lineB}{" "}
      </TextReveal>
      <span style={{ position: "relative", display: "inline-block" }}>
        <TextReveal
          as="span"
          delay={0.55}
          stagger={0.05}
          style={{
            fontFamily: "var(--font-newsreader), Georgia, serif",
            fontStyle: "italic",
            fontWeight: 500,
            color: "var(--site-accent, #FF6600)",
          }}
        >
          {accent}
        </TextReveal>
        <motion.svg
          aria-hidden
          viewBox="0 0 320 8"
          preserveAspectRatio="none"
          className="absolute left-0 w-full"
          style={{ bottom: "-0.04em", height: "0.18em" }}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.95, delay: 0.95, ease: [0.2, 0.7, 0.2, 1] }}
        >
          <motion.path
            d="M2 5 Q 80 1, 160 4 T 318 3"
            fill="none"
            stroke="var(--site-accent, #FF6600)"
            strokeWidth="3"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.1, delay: 0.95, ease: "easeOut" }}
          />
        </motion.svg>
      </span>
      <br />
      <TextReveal as="span" delay={0.75} stagger={0.05}>
        {lineC}
      </TextReveal>
    </h1>
  );
}

/* ─── Status strip ───────────────────────────────────────────── */
function StatusStrip({ status }: { status: string }) {
  return (
    <div
      className="relative z-10 border-y backdrop-blur"
      style={{ borderColor: "var(--site-line)", background: "rgba(10,8,7,0.6)" }}
    >
      <div className="container flex items-center justify-between gap-6 py-3 site-eyebrow">
        <span className="flex items-center gap-2.5">
          <span
            aria-hidden
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#30A46C",
              boxShadow: "0 0 8px rgba(48,164,108,0.7)",
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
          0%, 100% { opacity: 1; }
          50% { opacity: 0.45; }
        }
      `}</style>
    </div>
  );
}

/* ─── Studio Diary ───────────────────────────────────────────── */
function StudioDiary({ entries }: { entries: DiaryEntry[] }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30, rotateX: -8 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 1.05, delay: 0.7, ease: [0.2, 0.7, 0.2, 1] }}
      className="relative site-glass p-7 md:p-8"
      style={{ borderRadius: 22, transformPerspective: 1200 }}
    >
      {/* Top glow */}
      <span
        aria-hidden
        className="absolute -top-px left-8 right-8"
        style={{
          height: 1,
          background: "linear-gradient(90deg, transparent, var(--site-accent), transparent)",
        }}
      />

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span
            aria-hidden
            style={{
              width: 6, height: 6, borderRadius: "50%",
              background: "#30A46C",
              boxShadow: "0 0 8px rgba(48,164,108,0.7)",
            }}
          />
          <span className="site-eyebrow">Studio Diary</span>
        </div>
        <span className="site-eyebrow">Week 28 · 2026</span>
      </div>

      <h3
        className="site-display"
        style={{ fontSize: "clamp(1.45rem, 2.2vw, 1.85rem)", letterSpacing: "-0.018em" }}
      >
        This week we&apos;re{" "}
        <span style={{ fontFamily: "var(--font-newsreader), Georgia, serif", fontStyle: "italic", color: "var(--site-accent)" }}>
          shipping for…
        </span>
      </h3>

      <ul className="mt-7 space-y-4">
        {entries.map((entry, i) => (
          <motion.li
            key={entry.client}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.95 + i * 0.1 }}
            className="flex items-center gap-3.5"
          >
            <span
              className="grid place-items-center shrink-0 site-mono"
              style={{
                width: 40, height: 40, borderRadius: 10,
                background: "rgba(245,241,232,0.04)",
                border: "1px solid var(--site-line)",
                fontSize: 10, fontWeight: 700, letterSpacing: "0.14em",
                color: "var(--site-fg)",
              }}
            >
              {entry.day}
            </span>
            <div className="flex-1 min-w-0">
              <p className="site-display truncate" style={{ fontSize: 14.5, letterSpacing: "-0.012em" }}>
                {entry.client}
              </p>
              <p className="site-italic truncate" style={{ fontSize: 12.5, color: "var(--site-fg-mute)" }}>
                {entry.activity}
              </p>
            </div>
            <div className="flex flex-col items-end gap-1.5 shrink-0">
              <span
                className="site-mono"
                style={{
                  fontSize: 9,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color:
                    entry.progress > 80 ? "#30A46C" :
                    entry.progress > 30 ? "var(--site-accent)" :
                    "var(--site-fg-dim)",
                }}
              >
                {entry.status}
              </span>
              <span style={{ display: "block", height: 2, width: 48, background: "rgba(245,241,232,0.08)" }}>
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: entry.progress / 100 }}
                  transition={{ duration: 1, delay: 1.25 + i * 0.1, ease: "easeOut" }}
                  style={{
                    transformOrigin: "left",
                    display: "block",
                    height: "100%",
                    background:
                      entry.progress > 80 ? "#30A46C" :
                      entry.progress > 30 ? "var(--site-accent)" :
                      "rgba(245,241,232,0.32)",
                  }}
                />
              </span>
            </div>
          </motion.li>
        ))}
      </ul>

      <div
        className="mt-7 pt-5 flex items-end justify-between gap-3"
        style={{ borderTop: "1px solid var(--site-line)" }}
      >
        <div>
          <p className="site-italic" style={{ fontSize: 15, color: "var(--site-fg-mute)" }}>
            — Sahil
          </p>
          <p className="site-mono mt-1.5" style={{ fontSize: 9.5, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--site-fg-dim)" }}>
            Founder · updated 14m ago
          </p>
        </div>
        <span className="site-eyebrow flex items-center gap-1.5">
          <span
            aria-hidden
            style={{
              width: 6, height: 6, borderRadius: "50%",
              background: "#30A46C",
              boxShadow: "0 0 8px rgba(48,164,108,0.7)",
            }}
          />
          Live
        </span>
      </div>
    </motion.article>
  );
}

/* ─── CTAs ───────────────────────────────────────────────────── */
function PrimaryCta({ primary }: { primary: { label: string; href: string } }) {
  return (
    <Magnetic strength={0.36} radius={140}>
      <Link
        href={primary.href}
        data-cursor="link"
        className="group relative inline-flex items-center gap-3 overflow-hidden pl-7 pr-3 py-2.5 site-neon"
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
          style={{
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)",
          }}
        />
        <span className="relative z-10" style={{ fontFamily: "var(--font-funnel-display)", fontSize: 14.5, letterSpacing: "-0.005em" }}>
          {primary.label}
        </span>
        <span
          className="relative z-10 inline-grid place-items-center transition-transform duration-300 group-hover:rotate-[-30deg]"
          style={{
            width: 36, height: 36, borderRadius: "50%",
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
        <span
          aria-hidden
          className="absolute left-0 -bottom-1 h-px w-full origin-left transition-transform duration-500"
          style={{ background: "var(--site-fg)", transform: "scaleX(1)" }}
        />
        <span
          aria-hidden
          className="absolute left-0 -bottom-1 h-px w-full origin-right scale-x-0 group-hover:scale-x-100 transition-transform duration-500 delay-100"
          style={{ background: "var(--site-accent)" }}
        />
      </span>
      <span aria-hidden className="group-hover:translate-x-1 transition-transform">
        <svg width="20" height="10" viewBox="0 0 22 10" fill="none">
          <path d="M1 5 H 20 M 16 1 L 20 5 L 16 9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </Link>
  );
}

/* ─── Rating ─────────────────────────────────────────────────── */
function RatingCallout() {
  return (
    <div className="inline-flex items-center gap-3">
      <div className="flex -space-x-2">
        {[
          { bg: "var(--site-accent)", t: "A" },
          { bg: "#5A4632", t: "M" },
          { bg: "#4A5D3A", t: "K" },
        ].map((a, i) => (
          <span
            key={i}
            className="inline-grid place-items-center site-mono"
            style={{
              width: 32, height: 32, borderRadius: "50%",
              background: a.bg,
              boxShadow: "0 0 0 2px var(--site-bg)",
              fontSize: 11.5, fontWeight: 700,
              color: a.bg === "var(--site-accent)" ? "#0A0807" : "var(--site-fg)",
            }}
          >
            {a.t}
          </span>
        ))}
      </div>
      <div className="flex flex-col leading-tight">
        <div className="flex items-center gap-0.5" aria-label="4.9 out of 5">
          {[0, 1, 2, 3, 4].map((s) => (
            <svg key={s} width="11" height="11" viewBox="0 0 14 14" fill="var(--site-accent)">
              <path d="M7 0 L8.7 5.3 L14 5.3 L9.7 8.5 L11.4 13.8 L7 10.6 L2.6 13.8 L4.3 8.5 L0 5.3 L5.3 5.3 Z" />
            </svg>
          ))}
        </div>
        <p className="site-mono mt-1" style={{ fontSize: 10.5, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--site-fg-mute)" }}>
          4.9 / 5 from 87 founders
        </p>
      </div>
    </div>
  );
}

/* ─── Bento ──────────────────────────────────────────────────── */
function BentoBar({ stats }: { stats: BentoStat[] }) {
  return (
    <div
      className="mt-20 md:mt-24 grid grid-cols-2 md:grid-cols-4"
      style={{ background: "var(--site-line)", gap: 1 }}
    >
      {stats.map((s, i) => (
        <motion.article
          key={s.label}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, delay: i * 0.1, ease: [0.2, 0.7, 0.2, 1] }}
          className="group relative p-6 md:p-7 transition-colors"
          style={{ background: "var(--site-bg)" }}
        >
          <p
            className="site-display flex items-baseline"
            style={{ fontSize: "clamp(1.65rem, 2.6vw, 2.4rem)", letterSpacing: "-0.025em" }}
          >
            {s.animate && typeof s.value === "number" ? (
              <Counter to={s.value as number} />
            ) : (
              <span>{s.value}</span>
            )}
            {s.suffix ? (
              <span
                style={{
                  marginLeft: "0.18em",
                  color: s.suffix === "★" ? "var(--site-accent)" : "var(--site-fg)",
                  fontSize: "0.7em",
                }}
              >
                {s.suffix}
              </span>
            ) : null}
          </p>
          <p className="mt-3 site-eyebrow">{s.label}</p>
          <span
            aria-hidden
            className="absolute bottom-0 left-0 h-px transition-all duration-500"
            style={{
              width: "20%",
              background: "var(--site-accent)",
              boxShadow: "0 0 12px rgba(255,102,0,0.6)",
            }}
          />
        </motion.article>
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

/* ─── Bottom marquee ─────────────────────────────────────────── */
function BottomMarquee({ items }: { items: string[] }) {
  return (
    <div
      className="relative z-10 mt-16 md:mt-20"
      style={{ borderTop: "1px solid var(--site-line)", borderBottom: "1px solid var(--site-line)", background: "var(--site-bg-soft)" }}
    >
      <MarqueeStrip duration={45}>
        {items.map((item, i) => (
          <span key={i} className="flex items-center gap-12 pr-12 py-5">
            <span
              className="site-display whitespace-nowrap"
              style={{ fontSize: "clamp(1.5rem, 2vw, 2rem)", letterSpacing: "-0.022em" }}
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
