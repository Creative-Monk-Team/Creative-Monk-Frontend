"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { homepageContentApi } from "@/lib/api";
import { Magnetic } from "@/components/motion/magnetic";
import { MeshBackdrop } from "@/components/motion/mesh-backdrop";
import { MarqueeStrip } from "@/components/motion/marquee-strip";

/* ─── Hero v3 — "Manifest" ─────────────────────────────────────
   One container. Full-height. Editorial. The hero reads like an
   open project file: a header strip, a big stated promise, a meta
   line that ties the brief to the visitor, the action, and the
   proof — all in one stage. */

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
    "Brand, website and growth campaigns built by senior craft. Fixed scope. Fixed fee. No bait-and-switch.",
  primary: { label: "Book a free 30-min audit", href: "/contact" },
  secondary: { label: "See selected work", href: "/portfolio" },
  diaryEntries: [] as DiaryEntry[],
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
        diaryEntries:  res.diaryEntries  ?? FALLBACK_HERO.diaryEntries,
        bentoStats:    res.bentoStats?.length ? res.bentoStats : FALLBACK_HERO.bentoStats,
        marquee:       res.marquee?.length    ? res.marquee    : FALLBACK_HERO.marquee,
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
  const meshY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0.35]);

  return (
    <section
      ref={sectionRef}
      className="relative isolate overflow-hidden flex flex-col"
      style={{
        minHeight: "100vh",
        background: "var(--site-bg, #0A0807)",
        color: "var(--site-fg, #F5F1E8)",
      }}
    >
      {/* Backdrop layers */}
      <motion.div style={{ y: meshY }} className="absolute inset-0 pointer-events-none">
        <MeshBackdrop />
      </motion.div>

      {/* Faint scrolling-text rail behind the headline */}
      <BackdropMarquee />

      <StatusStrip status={data.status} />

      {/* Stage — vertically centered single container */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 flex-1 flex items-center"
      >
        <div className="container w-full">
          <div className="mx-auto max-w-[1080px] flex flex-col items-center text-center relative">
            {/* Floating mark — a small editorial star on the upper-right of the column */}
            <motion.span
              aria-hidden
              initial={{ opacity: 0, scale: 0.6, rotate: -12 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1.1, delay: 0.5, ease: [0.2, 0.7, 0.2, 1] }}
              className="hidden lg:block absolute right-0 -top-10"
              style={{
                color: "var(--site-accent)",
                fontFamily: "var(--font-newsreader), Georgia, serif",
                fontStyle: "italic",
                fontSize: 88,
                lineHeight: 0.6,
                filter: "drop-shadow(0 0 24px rgba(255,102,0,0.5))",
              }}
            >
              ✦
            </motion.span>
            <motion.span
              aria-hidden
              initial={{ opacity: 0, scale: 0.6, rotate: 12 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1.1, delay: 0.7, ease: [0.2, 0.7, 0.2, 1] }}
              className="hidden lg:block absolute left-0 top-[55%]"
              style={{
                color: "var(--site-fg-dim)",
                fontFamily: "var(--font-newsreader), Georgia, serif",
                fontStyle: "italic",
                fontSize: 56,
                lineHeight: 0.6,
              }}
            >
              ✦
            </motion.span>

            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="flex items-center gap-3 mb-7"
            >
              <span aria-hidden style={{ display: "block", height: 1, width: 32, background: "var(--site-accent)" }} />
              <span className="site-eyebrow" style={{ color: "var(--site-fg-mute)" }}>{data.eyebrow}</span>
              <span aria-hidden style={{ display: "block", height: 1, width: 32, background: "var(--site-accent)" }} />
            </motion.div>

            {/* Massive headline */}
            <Statement lines={data} />

            {/* Lede */}
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.7, ease: [0.2, 0.7, 0.2, 1] }}
              className="mt-8 max-w-[60ch]"
              style={{
                fontSize: "clamp(16px, 1.3vw, 18.5px)",
                lineHeight: 1.55,
                color: "var(--site-fg-mute)",
              }}
            >
              {data.lede}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.85, ease: [0.2, 0.7, 0.2, 1] }}
              className="mt-10 flex flex-wrap items-center justify-center gap-x-7 gap-y-5"
            >
              <PrimaryCta primary={data.primary} />
              <SecondaryCta secondary={data.secondary} />
            </motion.div>

            {/* Inline proof row — small, balanced, dot-separated */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 1.0, ease: [0.2, 0.7, 0.2, 1] }}
              className="mt-12 md:mt-14 flex flex-wrap items-center justify-center gap-x-3 gap-y-2"
            >
              {data.bentoStats.map((s, i) => (
                <div key={s.label} className="flex items-center gap-3">
                  <ProofItem stat={s} />
                  {i < data.bentoStats.length - 1 ? (
                    <span aria-hidden className="hidden sm:inline" style={{ color: "var(--site-line-strong)" }}>·</span>
                  ) : null}
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.div>

      <ScrollHint />
      <BottomMarquee items={data.marquee} />
    </section>
  );
}

/* ─── Statement ───────────────────────────────────────────────── */
function Statement({
  lines,
}: {
  lines: { lineA: string; lineB: string; accent: string; lineC: string };
}) {
  return (
    <h1
      className="site-display"
      style={{
        fontSize: "clamp(2.6rem, 8.4vw, 7.5rem)",
        letterSpacing: "-0.04em",
        lineHeight: 0.94,
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

/* ─── Status strip ─────────────────────────────────────────── */
function StatusStrip({ status }: { status: string }) {
  return (
    <div
      className="relative z-10 shrink-0"
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

/* ─── Faint scrolling rail behind the hero, ambient depth ──── */
function BackdropMarquee() {
  return (
    <div
      aria-hidden
      className="absolute inset-x-0 top-1/2 -translate-y-1/2 pointer-events-none overflow-hidden"
      style={{ opacity: 0.06 }}
    >
      <MarqueeStrip duration={120} pauseOnHover={false}>
        {Array.from({ length: 4 }).map((_, i) => (
          <span
            key={i}
            className="site-display whitespace-nowrap pr-16"
            style={{
              fontSize: "clamp(8rem, 16vw, 16rem)",
              letterSpacing: "-0.04em",
              color: "var(--site-fg)",
              fontStyle: i % 2 ? "italic" : "normal",
              fontFamily: i % 2 ? "var(--font-newsreader), Georgia, serif" : "var(--font-funnel-display)",
            }}
          >
            CREATIVE&nbsp;·&nbsp;MONK&nbsp;·&nbsp;
          </span>
        ))}
      </MarqueeStrip>
    </div>
  );
}

/* ─── Proof items ────────────────────────────────────────────── */
function ProofItem({ stat }: { stat: BentoStat }) {
  return (
    <span className="inline-flex items-baseline gap-1.5">
      <span
        className="site-display admin-tnum"
        style={{
          fontSize: "clamp(18px, 1.5vw, 22px)",
          letterSpacing: "-0.02em",
          color: "var(--site-accent)",
          fontWeight: 600,
        }}
      >
        {typeof stat.value === "number" ? <Counter to={stat.value} /> : stat.value}
        {stat.suffix ? <span>{stat.suffix}</span> : null}
      </span>
      <span
        className="site-mono"
        style={{
          fontSize: 10.5,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "var(--site-fg-mute)",
        }}
      >
        {stat.label}
      </span>
    </span>
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

/* ─── Scroll hint ────────────────────────────────────────────── */
function ScrollHint() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 1.4 }}
      className="relative z-10 shrink-0 flex items-center justify-center pb-4 md:pb-6"
    >
      <a
        href="#services"
        data-cursor="link"
        className="group flex flex-col items-center gap-2"
        aria-label="Scroll to next section"
      >
        <span className="site-mono" style={{ fontSize: 10, letterSpacing: "0.24em", textTransform: "uppercase", color: "var(--site-fg-dim)" }}>
          Scroll
        </span>
        <motion.span
          aria-hidden
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          style={{
            display: "inline-block",
            width: 1,
            height: 32,
            background: "linear-gradient(180deg, var(--site-accent) 0%, transparent 100%)",
            transformOrigin: "top",
          }}
        />
      </a>
    </motion.div>
  );
}

/* ─── CTAs ───────────────────────────────────────────────────── */
function PrimaryCta({ primary }: { primary: { label: string; href: string } }) {
  return (
    <Magnetic strength={0.4} radius={160}>
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
      className="relative z-10 shrink-0"
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
