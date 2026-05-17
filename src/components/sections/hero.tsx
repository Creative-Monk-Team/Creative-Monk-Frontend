"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { homepageContentApi } from "@/lib/api";
import { Magnetic } from "@/components/motion/magnetic";
import { MarqueeStrip } from "@/components/motion/marquee-strip";

/* ─── Hero v5 — "Studio Press" ─────────────────────────────────
   Magazine-cover composition for the homepage. The hero is a
   designed object: asymmetric grid, outline-stroke typography on
   the middle headline line, a rotating circular stamp, edition
   marks like a print issue, an inline numbered service index, and
   a masthead-style stats ribbon. The aesthetic IS the proof. */

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
  bentoStats?: BentoStat[];
  marquee?: string[];
};

const FALLBACK_HERO: Required<Omit<HeroPayload, "bentoStats" | "marquee">> & {
  bentoStats: BentoStat[];
  marquee: string[];
} = {
  status: "Now booking · 3 founder slots open for Q3",
  eyebrow: "Independent creative studio · est. 2018",
  lineA: "We design",
  lineB: "BRANDS",
  accent: "that move",
  lineC: "markets.",
  lede:
    "Identity, websites, and growth marketing — engineered together for ambitious brands ready to lead their category.",
  primary: { label: "Start a project", href: "/contact" },
  secondary: { label: "View selected work", href: "/portfolio" },
  bentoStats: [
    { value: 142,    suffix: "+", label: "Brands shipped", animate: true },
    { value: 4.9,    suffix: "★", label: "From 87 reviews" },
    { value: 312,    suffix: "%", label: "Avg lead lift",  animate: true },
    { value: "<4hr",            label: "Reply time" },
  ],
  marquee: [
    "Brand Identity",
    "Web Design & Build",
    "Performance Marketing",
    "SEO & Content",
    "Brand Films",
    "Social Strategy",
    "E-commerce",
    "Motion Design",
  ],
};

const INDEX_LINKS = [
  { num: "01", label: "Identity",  href: "/services/branding" },
  { num: "02", label: "Web",       href: "/services/web-development" },
  { num: "03", label: "Growth",    href: "/services/digital-marketing" },
  { num: "04", label: "Motion",    href: "/services" },
];

function useHero() {
  const [data, setData] = useState(FALLBACK_HERO);
  useEffect(() => {
    let cancelled = false;
    homepageContentApi.get<HeroPayload>("hero").then((res) => {
      if (cancelled || !res) return;
      setData({
        status:     res.status     ?? FALLBACK_HERO.status,
        eyebrow:    res.eyebrow    ?? FALLBACK_HERO.eyebrow,
        lineA:      res.lineA      ?? FALLBACK_HERO.lineA,
        lineB:      res.lineB      ?? FALLBACK_HERO.lineB,
        accent:     res.accent     ?? FALLBACK_HERO.accent,
        lineC:      res.lineC      ?? FALLBACK_HERO.lineC,
        lede:       res.lede       ?? FALLBACK_HERO.lede,
        primary:    res.primary    ?? FALLBACK_HERO.primary,
        secondary:  res.secondary  ?? FALLBACK_HERO.secondary,
        bentoStats: res.bentoStats?.length ? res.bentoStats : FALLBACK_HERO.bentoStats,
        marquee:    res.marquee?.length    ? res.marquee    : FALLBACK_HERO.marquee,
      });
    });
    return () => { cancelled = true; };
  }, []);
  return data;
}

export function Hero() {
  const data = useHero();
  const sectionRef = useRef<HTMLElement | null>(null);

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
      {/* Subtle paper texture — fixed dot pattern + edge vignette */}
      <PaperTexture />

      <StatusStrip status={data.status} />

      {/* Stage */}
      <div className="relative z-10 flex-1 flex items-stretch">
        <div className="container w-full py-12 lg:py-16 flex-1 flex flex-col">

          {/* Editorial top row — Nº mark left, decorative rules center, stamp right */}
          <div className="grid grid-cols-12 gap-x-8 items-start">
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="col-span-12 md:col-span-7 lg:col-span-6"
            >
              <EditionMark />
            </motion.div>

            <div className="hidden md:flex md:col-span-5 lg:col-span-6 items-start justify-end">
              <RotatingStamp />
            </div>
          </div>

          {/* Big composition area — vertical centering, asymmetric */}
          <div className="flex-1 grid grid-cols-12 gap-x-8 items-center mt-8 lg:mt-0">
            <div className="col-span-12 lg:col-span-9 relative">
              {/* Floating ✦ — top-left, decorative */}
              <motion.span
                aria-hidden
                initial={{ opacity: 0, rotate: -20, scale: 0.6 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                transition={{ duration: 0.9, delay: 0.4, ease: [0.2, 0.7, 0.2, 1] }}
                className="absolute -left-1 -top-6 select-none pointer-events-none"
                style={{
                  fontFamily: "var(--font-newsreader), Georgia, serif",
                  fontStyle: "italic",
                  fontSize: 32,
                  color: "var(--site-accent)",
                  textShadow: "0 0 24px rgba(255,102,0,0.5)",
                  lineHeight: 1,
                }}
              >
                ✦
              </motion.span>

              <Statement
                lineA={data.lineA}
                lineB={data.lineB}
                accent={data.accent}
                lineC={data.lineC}
              />
            </div>
          </div>

          {/* Bottom slab — promise + CTAs + index */}
          <div className="grid grid-cols-12 gap-x-8 gap-y-10 mt-10 lg:mt-12">
            {/* Promise + CTAs */}
            <div className="col-span-12 lg:col-span-7">
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.85, delay: 0.85, ease: [0.2, 0.7, 0.2, 1] }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <span aria-hidden style={{ display: "block", height: 1, width: 24, background: "var(--site-accent)" }} />
                  <span className="site-eyebrow">The promise</span>
                </div>
                <p
                  style={{
                    fontSize: "clamp(15.5px, 1.2vw, 17.5px)",
                    lineHeight: 1.55,
                    color: "var(--site-fg-mute)",
                    maxWidth: "52ch",
                  }}
                >
                  {data.lede}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.85, delay: 1.0, ease: [0.2, 0.7, 0.2, 1] }}
                className="mt-7 flex flex-wrap items-center gap-x-7 gap-y-4"
              >
                <PrimaryCta primary={data.primary} />
                <SecondaryCta secondary={data.secondary} />
              </motion.div>
            </div>

            {/* Service Index — right column, numbered */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 1.1, ease: [0.2, 0.7, 0.2, 1] }}
              className="col-span-12 lg:col-span-5 lg:pl-6 lg:border-l"
              style={{ borderColor: "var(--site-line)" }}
            >
              <div className="flex items-center gap-3 mb-4">
                <span aria-hidden style={{ display: "block", height: 1, width: 24, background: "var(--site-accent)" }} />
                <span className="site-eyebrow">Index — services</span>
              </div>
              <ul className="space-y-1.5">
                {INDEX_LINKS.map((item) => (
                  <IndexRow key={item.num} item={item} />
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Masthead stats ribbon */}
      <StatsRibbon stats={data.bentoStats} />

      <BottomMarquee items={data.marquee} />
    </section>
  );
}

/* ─── Edition Mark — top-left magazine issue label ─────────── */
function EditionMark() {
  return (
    <div className="flex items-baseline gap-5">
      <span
        className="site-mono"
        style={{
          fontSize: 10.5,
          letterSpacing: "0.24em",
          textTransform: "uppercase",
          color: "var(--site-fg-mute)",
        }}
      >
        Nº 0142
      </span>
      <span
        aria-hidden
        style={{
          display: "inline-block",
          height: 1,
          width: 28,
          background: "var(--site-accent)",
        }}
      />
      <span
        className="site-mono"
        style={{
          fontSize: 10.5,
          letterSpacing: "0.24em",
          textTransform: "uppercase",
          color: "var(--site-fg-mute)",
        }}
      >
        Edition 02
      </span>
      <span
        aria-hidden
        className="hidden sm:inline-block"
        style={{
          height: 1,
          width: 28,
          background: "var(--site-line-strong)",
        }}
      />
      <span
        className="hidden sm:inline site-mono"
        style={{
          fontSize: 10.5,
          letterSpacing: "0.24em",
          textTransform: "uppercase",
          color: "var(--site-fg-dim)",
        }}
      >
        Studio Press
      </span>
    </div>
  );
}

/* ─── Rotating Stamp — the design flex ─────────────────────── */
function RotatingStamp() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6, rotate: -20 }}
      animate={{ opacity: 1, scale: 1, rotate: -8 }}
      transition={{ duration: 0.95, delay: 0.45, ease: [0.2, 0.7, 0.2, 1] }}
      className="relative"
      style={{ width: 124, height: 124 }}
    >
      {/* Slow infinite spin of the outer ring */}
      <motion.svg
        viewBox="0 0 200 200"
        width="124"
        height="124"
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
      >
        <defs>
          <path
            id="stamp-arc"
            d="M 100, 100 m -78, 0 a 78,78 0 1,1 156,0 a 78,78 0 1,1 -156,0"
          />
        </defs>
        <text
          fill="var(--site-fg-mute)"
          style={{
            fontFamily: "var(--font-jb-mono), ui-monospace, monospace",
            fontSize: 14,
            letterSpacing: "0.35em",
            textTransform: "uppercase",
          }}
        >
          <textPath href="#stamp-arc" startOffset="0">
            OPEN · STUDIO · ACCEPTING · Q3 · 2026 ·&nbsp;
          </textPath>
        </text>
        <circle
          cx="100"
          cy="100"
          r="64"
          fill="none"
          stroke="var(--site-line-strong)"
          strokeDasharray="2 4"
          strokeWidth="0.6"
        />
      </motion.svg>

      {/* Static center — "OPEN" stamp */}
      <div
        className="absolute inset-0 grid place-items-center"
        style={{ pointerEvents: "none" }}
      >
        <div
          className="grid place-items-center"
          style={{
            width: 78,
            height: 78,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(255,102,0,0.15) 0%, transparent 70%)",
          }}
        >
          <div className="flex flex-col items-center gap-0.5">
            <span
              aria-hidden
              style={{
                fontFamily: "var(--font-newsreader), Georgia, serif",
                fontStyle: "italic",
                fontSize: 14,
                color: "var(--site-accent)",
                lineHeight: 1,
              }}
            >
              ✦
            </span>
            <span
              className="site-display"
              style={{
                fontSize: 17,
                fontWeight: 700,
                letterSpacing: "-0.01em",
                color: "var(--site-accent)",
                textShadow: "0 0 18px rgba(255,102,0,0.55)",
                lineHeight: 1,
              }}
            >
              OPEN
            </span>
            <span
              className="site-mono"
              style={{
                fontSize: 8,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "var(--site-fg-mute)",
                lineHeight: 1,
                marginTop: 2,
              }}
            >
              Q3 / 2026
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Statement — three-line headline, mixed treatments ─────── */
function Statement({
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
        fontSize: "clamp(2.75rem, 7.4vw, 7rem)",
        letterSpacing: "-0.035em",
        lineHeight: 0.95,
        fontWeight: 600,
        color: "var(--site-fg)",
      }}
    >
      {/* Line A — filled display */}
      <motion.span
        initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 1.0, delay: 0.3, ease: [0.2, 0.7, 0.2, 1] }}
        className="block"
      >
        {lineA}
      </motion.span>

      {/* Line B — OUTLINE STROKE, the design flex */}
      <motion.span
        initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 1.0, delay: 0.45, ease: [0.2, 0.7, 0.2, 1] }}
        className="block"
        style={{
          color: "transparent",
          WebkitTextStroke: "1.4px var(--site-fg)",
          // @ts-expect-error — vendor prefix not in type
          textStroke: "1.4px var(--site-fg)",
          letterSpacing: "-0.02em",
          textTransform: "uppercase",
        }}
      >
        {lineB}
      </motion.span>

      {/* Line C — italic Newsreader, brand orange */}
      <motion.span
        initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 1.0, delay: 0.6, ease: [0.2, 0.7, 0.2, 1] }}
        className="block"
        style={{
          fontFamily: "var(--font-newsreader), Georgia, serif",
          fontStyle: "italic",
          fontWeight: 500,
          color: "var(--site-fg)",
        }}
      >
        {accent}{" "}
        <span
          style={{
            position: "relative",
            display: "inline-block",
            color: "var(--site-accent)",
          }}
        >
          {lineC || ""}
          {lineC ? (
            <motion.svg
              aria-hidden
              viewBox="0 0 320 8"
              preserveAspectRatio="none"
              className="absolute left-0"
              style={{ bottom: "-0.02em", height: "0.1em", width: "100%" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 1.2 }}
            >
              <motion.path
                d="M2 5 Q 80 1, 160 4 T 318 3"
                fill="none"
                stroke="var(--site-accent)"
                strokeWidth="3"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.1, delay: 1.2, ease: "easeOut" }}
              />
            </motion.svg>
          ) : null}
        </span>
      </motion.span>
    </h1>
  );
}

/* ─── Index Row — hoverable numbered service link ──────────── */
function IndexRow({ item }: { item: { num: string; label: string; href: string } }) {
  return (
    <li>
      <Link
        href={item.href}
        data-cursor="link"
        className="group flex items-center justify-between py-2.5 transition-colors"
        style={{ borderBottom: "1px dashed var(--site-line)" }}
      >
        <span className="flex items-baseline gap-4">
          <span
            className="site-mono"
            style={{
              fontSize: 11,
              letterSpacing: "0.18em",
              color: "var(--site-fg-dim)",
              transition: "color 240ms ease",
            }}
          >
            {item.num}
          </span>
          <span
            className="site-display"
            style={{
              fontSize: "clamp(15px, 1.3vw, 17px)",
              letterSpacing: "-0.018em",
              color: "var(--site-fg)",
              transition: "color 240ms ease",
            }}
          >
            <span className="transition-all group-hover:tracking-[0.02em]">
              {item.label}
            </span>
          </span>
        </span>
        <span
          aria-hidden
          className="inline-flex items-center justify-center transition-all group-hover:text-[var(--site-accent)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          style={{
            color: "var(--site-fg-dim)",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 12 L12 2 M5 2 L12 2 L12 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </Link>
    </li>
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
          Mohali · serving worldwide
        </span>
        <span className="hidden sm:inline" style={{ color: "var(--site-fg-dim)" }}>
          Replies inside 4 hrs
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

/* ─── Stats Ribbon — masthead, monospace ───────────────────── */
function StatsRibbon({ stats }: { stats: BentoStat[] }) {
  return (
    <div
      className="relative z-10 shrink-0"
      style={{
        borderTop: "1px solid var(--site-line)",
        borderBottom: "1px solid var(--site-line)",
        background: "rgba(245,241,232,0.02)",
      }}
    >
      <div className="container py-4 flex items-center justify-between gap-x-6 gap-y-2 flex-wrap">
        {stats.map((s, i) => (
          <div key={s.label} className="flex items-center gap-2.5">
            <span
              aria-hidden
              style={{
                display: "inline-block",
                width: 4, height: 4,
                background: "var(--site-accent)",
                boxShadow: "0 0 8px rgba(255,102,0,0.6)",
                borderRadius: "50%",
              }}
            />
            <span
              className="site-display admin-tnum"
              style={{
                fontSize: "clamp(14px, 1vw, 16.5px)",
                letterSpacing: "-0.012em",
                color: "var(--site-accent)",
                fontWeight: 600,
              }}
            >
              {typeof s.value === "number" ? <Counter to={s.value} /> : s.value}
              {s.suffix ? <span>{s.suffix}</span> : null}
            </span>
            <span
              className="site-mono"
              style={{
                fontSize: 10.5,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "var(--site-fg-mute)",
              }}
            >
              {s.label}
            </span>
            {i < stats.length - 1 ? (
              <span aria-hidden className="hidden md:inline pl-3" style={{ color: "var(--site-line-strong)" }}>
                ─
              </span>
            ) : null}
          </div>
        ))}
      </div>
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

/* ─── Paper Texture — dot grid + vignette ──────────────────── */
function PaperTexture() {
  return (
    <>
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(rgba(245,241,232,0.04) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          backgroundPosition: "-1px -1px",
          opacity: 0.5,
          maskImage:
            "radial-gradient(ellipse 70% 80% at 50% 50%, black 30%, transparent 90%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 80% at 50% 50%, black 30%, transparent 90%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 90% 30%, rgba(255,102,0,0.10), transparent 60%), radial-gradient(ellipse 80% 60% at 10% 90%, rgba(255,102,0,0.05), transparent 60%)",
        }}
      />
    </>
  );
}

/* ─── CTAs ───────────────────────────────────────────────────── */
function PrimaryCta({ primary }: { primary: { label: string; href: string } }) {
  return (
    <Magnetic strength={0.36} radius={140}>
      <Link
        href={primary.href}
        data-cursor="link"
        className="group relative inline-flex items-center gap-3 overflow-hidden pl-7 pr-2.5 py-2.5 site-neon"
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
          style={{ fontFamily: "var(--font-funnel-display)", fontSize: 14.5, letterSpacing: "-0.005em" }}
        >
          {primary.label}
        </span>
        <span
          className="relative z-10 inline-grid place-items-center transition-transform duration-300 group-hover:rotate-[-30deg]"
          style={{
            width: 34, height: 34, borderRadius: "50%",
            background: "#0A0807",
            color: "var(--site-accent)",
          }}
        >
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
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
          <span key={i} className="flex items-center gap-12 pr-12 py-4">
            <span
              className="site-display whitespace-nowrap"
              style={{ fontSize: "clamp(1.25rem, 1.7vw, 1.75rem)", letterSpacing: "-0.022em", color: "var(--site-fg)" }}
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
