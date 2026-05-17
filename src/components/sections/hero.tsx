"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { homepageContentApi } from "@/lib/api";
import { Magnetic } from "@/components/motion/magnetic";
import { MarqueeStrip } from "@/components/motion/marquee-strip";

/* ─── Hero v7 — "Living Manifesto" ─────────────────────────────
   No images. The type IS the design. A morphing word at the heart
   of the headline cycles through what we build (BRANDS / IDENTITIES
   / FUTURES / STORIES / EXPERIENCES) every 2.4s with a flap-clock
   mask reveal. Behind: an oversized outlined wordmark drifting
   slowly, two crossed diagonal marquees, an animated mesh, and a
   cursor-aware radial glow. SVG annotation marks point to elements
   like a designer's commented working file. */

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

/* Words that rotate in the headline's outlined slot.
   Six words chosen for cadence + meaning. Each gets the spotlight
   for ~2.4s before flipping up. */
const MORPHING_WORDS = [
  "BRANDS",
  "IDENTITIES",
  "FUTURES",
  "STORIES",
  "EXPERIENCES",
  "BUSINESSES",
];

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
  const [wordIdx, setWordIdx] = useState(0);

  // Rotate the morphing word
  useEffect(() => {
    const id = setInterval(() => {
      setWordIdx((i) => (i + 1) % MORPHING_WORDS.length);
    }, 2400);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      className="relative isolate overflow-hidden flex flex-col"
      style={{
        minHeight: "100vh",
        background: "var(--site-bg, #0A0807)",
        color: "var(--site-fg, #F5F1E8)",
      }}
    >
      <BackdropLayers />
      <CursorGlow />
      <AnnotationMarks />

      <StatusStrip status={data.status} />

      <div className="relative z-10 flex-1 flex items-center">
        <div className="container w-full py-8 md:py-12">
          <div className="grid grid-cols-12 gap-x-8 gap-y-12 items-center">
            {/* LEFT — type column */}
            <div className="col-span-12 lg:col-span-9">
              <Eyebrow text={data.eyebrow} />
              <Manifesto wordIdx={wordIdx} />

              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.95, ease: [0.2, 0.7, 0.2, 1] }}
                className="mt-8 max-w-[56ch]"
                style={{
                  fontSize: "clamp(15.5px, 1.2vw, 17.5px)",
                  lineHeight: 1.55,
                  color: "var(--site-fg-mute)",
                }}
              >
                {data.lede}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 1.1, ease: [0.2, 0.7, 0.2, 1] }}
                className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4"
              >
                <PrimaryCta primary={data.primary} />
                <SecondaryCta secondary={data.secondary} />
              </motion.div>
            </div>

            {/* RIGHT — live indicator stack */}
            <div className="hidden lg:flex col-span-3 flex-col items-end gap-6">
              <LiveStack wordIdx={wordIdx} />
            </div>
          </div>
        </div>
      </div>

      <StatsRibbon stats={data.bentoStats} />
      <BottomMarquee items={data.marquee} />
    </section>
  );
}

/* ─── Backdrop layers — ghost wordmark + crossed marquees + mesh ─ */
function BackdropLayers() {
  return (
    <>
      {/* Gradient mesh */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 0,
          background:
            "radial-gradient(ellipse 70% 60% at 0% 0%, rgba(255,102,0,0.18), transparent 55%), radial-gradient(ellipse 60% 50% at 100% 100%, rgba(255,102,0,0.10), transparent 60%), radial-gradient(ellipse 80% 60% at 50% 100%, rgba(20,17,14,0.6), transparent 70%)",
        }}
      />

      {/* Dot grid */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 0,
          backgroundImage:
            "radial-gradient(rgba(245,241,232,0.06) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          opacity: 0.4,
          maskImage:
            "radial-gradient(ellipse 80% 70% at 50% 50%, black 30%, transparent 90%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 70% at 50% 50%, black 30%, transparent 90%)",
        }}
      />

      {/* Ghost wordmark — massive outlined "CREATIVE MONK" drifting slowly */}
      <GhostWordmark />

      {/* Two diagonal marquees crossing the canvas at opposite angles */}
      <DiagonalMarquee
        items={["BRAND", "WEB", "GROWTH", "MOTION", "STRATEGY", "DESIGN", "STORY", "IDENTITY"]}
        angle={-9}
        top="22%"
        duration={70}
        direction="forward"
      />
      <DiagonalMarquee
        items={["+312% LEADS", "4.9★ RATED", "142+ BRANDS", "SHIPPED IN 45 DAYS", "FIXED SCOPE", "<4HR REPLY"]}
        angle={9}
        top="62%"
        duration={90}
        direction="reverse"
      />
    </>
  );
}

function GhostWordmark() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 0 }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 0.55, scale: 1, rotate: [0, -0.6, 0] }}
        transition={{
          opacity: { duration: 1.4, delay: 0.3 },
          scale:   { duration: 1.4, delay: 0.3 },
          rotate:  { duration: 18, repeat: Infinity, ease: "easeInOut" },
        }}
        className="absolute inset-0 grid place-items-center"
      >
        <span
          className="whitespace-nowrap select-none"
          style={{
            fontFamily: "var(--font-funnel-display)",
            fontWeight: 700,
            fontSize: "clamp(8rem, 18vw, 22rem)",
            letterSpacing: "-0.05em",
            lineHeight: 0.85,
            color: "transparent",
            WebkitTextStroke: "1px rgba(245,241,232,0.08)",
            textShadow: "none",
          }}
        >
          CREATIVE&nbsp;MONK
        </span>
      </motion.div>
    </div>
  );
}

function DiagonalMarquee({
  items,
  angle,
  top,
  duration,
  direction,
}: {
  items: string[];
  angle: number;
  top: string;
  duration: number;
  direction: "forward" | "reverse";
}) {
  return (
    <div
      aria-hidden
      className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
      style={{
        zIndex: 0,
        top,
        width: "140vw",
        transform: `translate(-50%, -50%) rotate(${angle}deg)`,
        opacity: 0.16,
      }}
    >
      <MarqueeStrip duration={duration} direction={direction} pauseOnHover={false}>
        {items.map((item, i) => (
          <span key={i} className="flex items-center gap-10 pr-10 py-3">
            <span
              className="whitespace-nowrap"
              style={{
                fontFamily: "var(--font-funnel-display)",
                fontWeight: 600,
                fontSize: "clamp(2rem, 4.5vw, 4rem)",
                letterSpacing: "-0.02em",
                color: "var(--site-fg)",
              }}
            >
              {item}
            </span>
            <span
              aria-hidden
              style={{ color: "var(--site-accent)", fontSize: 22 }}
            >
              ◆
            </span>
          </span>
        ))}
      </MarqueeStrip>
    </div>
  );
}

/* ─── CursorGlow — radial light following the pointer ───────── */
function CursorGlow() {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const isTouch =
      typeof window !== "undefined" &&
      (window.matchMedia("(pointer: coarse)").matches || "ontouchstart" in window);
    if (isTouch) return;

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let cx = mx;
    let cy = my;
    let raf = 0;

    function onMove(e: MouseEvent) {
      mx = e.clientX;
      my = e.clientY;
    }
    function tick() {
      cx += (mx - cx) * 0.1;
      cy += (my - cy) * 0.1;
      if (ref.current) {
        ref.current.style.setProperty("--gx", `${cx}px`);
        ref.current.style.setProperty("--gy", `${cy}px`);
      }
      raf = requestAnimationFrame(tick);
    }
    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="absolute inset-0 pointer-events-none"
      style={{
        zIndex: 1,
        background:
          "radial-gradient(circle 480px at var(--gx, 50%) var(--gy, 50%), rgba(255,102,0,0.14), transparent 65%)",
        mixBlendMode: "screen",
      }}
    />
  );
}

/* ─── Annotation Marks — designer's working-file callouts ──── */
function AnnotationMarks() {
  return (
    <svg
      aria-hidden
      className="absolute inset-0 pointer-events-none hidden lg:block"
      style={{ zIndex: 2 }}
      width="100%"
      height="100%"
      preserveAspectRatio="none"
      viewBox="0 0 1440 900"
    >
      <defs>
        <marker
          id="dot-end"
          viewBox="0 0 10 10"
          refX="5"
          refY="5"
          markerWidth="5"
          markerHeight="5"
        >
          <circle cx="5" cy="5" r="3" fill="var(--site-accent)" />
        </marker>
      </defs>

      {/* Annotation 1 — top right, points to "OPEN" indicator */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ duration: 1.2, delay: 1.6 }}
      >
        <motion.path
          d="M 1280 200 C 1240 220, 1200 230, 1170 250"
          fill="none"
          stroke="var(--site-accent)"
          strokeWidth="1"
          strokeDasharray="2 3"
          markerEnd="url(#dot-end)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.0, delay: 1.6, ease: "easeOut" }}
        />
        <text
          x="1280"
          y="186"
          fill="var(--site-accent)"
          fontFamily="var(--font-jb-mono), monospace"
          fontSize="10"
          letterSpacing="0.18em"
          textAnchor="end"
        >
          01 / LIVE
        </text>
      </motion.g>

      {/* Annotation 2 — left side, points to morphing word */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ duration: 1.2, delay: 1.9 }}
      >
        <motion.path
          d="M 80 480 C 140 470, 200 460, 260 470"
          fill="none"
          stroke="var(--site-accent)"
          strokeWidth="1"
          strokeDasharray="2 3"
          markerEnd="url(#dot-end)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.0, delay: 1.9, ease: "easeOut" }}
        />
        <text
          x="76"
          y="468"
          fill="var(--site-accent)"
          fontFamily="var(--font-jb-mono), monospace"
          fontSize="10"
          letterSpacing="0.18em"
        >
          02 / KINETIC
        </text>
      </motion.g>

      {/* Annotation 3 — bottom right, points to CTA area */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ duration: 1.2, delay: 2.2 }}
      >
        <motion.path
          d="M 1280 720 C 1180 700, 1080 680, 980 660"
          fill="none"
          stroke="var(--site-accent)"
          strokeWidth="1"
          strokeDasharray="2 3"
          markerEnd="url(#dot-end)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.0, delay: 2.2, ease: "easeOut" }}
        />
        <text
          x="1280"
          y="708"
          fill="var(--site-accent)"
          fontFamily="var(--font-jb-mono), monospace"
          fontSize="10"
          letterSpacing="0.18em"
          textAnchor="end"
        >
          03 / 60-SEC BRIEF
        </text>
      </motion.g>
    </svg>
  );
}

/* ─── Manifesto — headline with morphing word in the middle ─── */
function Manifesto({ wordIdx }: { wordIdx: number }) {
  const currentWord = MORPHING_WORDS[wordIdx];

  return (
    <h1
      className="site-display"
      style={{
        fontSize: "clamp(2.5rem, 7vw, 6.5rem)",
        letterSpacing: "-0.038em",
        lineHeight: 0.96,
        fontWeight: 600,
        color: "var(--site-fg)",
      }}
    >
      {/* Line A */}
      <motion.span
        initial={{ opacity: 0, y: 22, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 1.0, delay: 0.3, ease: [0.2, 0.7, 0.2, 1] }}
        className="block"
      >
        We design
      </motion.span>

      {/* Line B — MORPHING WORD with flap-clock mask reveal */}
      <span
        className="block relative"
        style={{
          height: "1em",
          overflow: "hidden",
          // give morphing word breathing room
          paddingBottom: "0.08em",
          marginBottom: "-0.08em",
        }}
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={currentWord}
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ duration: 0.7, ease: [0.2, 0.7, 0.2, 1] }}
            className="absolute inset-0 block"
            style={{
              color: "transparent",
              WebkitTextStroke: "1.4px var(--site-accent)",
              // @ts-expect-error vendor
              textStroke: "1.4px var(--site-accent)",
              letterSpacing: "-0.025em",
              textTransform: "uppercase",
              textShadow: "0 0 32px rgba(255,102,0,0.18)",
              willChange: "transform",
            }}
          >
            {currentWord}
          </motion.span>
        </AnimatePresence>
      </span>

      {/* Line C — italic accent */}
      <motion.span
        initial={{ opacity: 0, y: 22, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 1.0, delay: 0.65, ease: [0.2, 0.7, 0.2, 1] }}
        className="block"
        style={{
          fontFamily: "var(--font-newsreader), Georgia, serif",
          fontStyle: "italic",
          fontWeight: 500,
        }}
      >
        that move{" "}
        <span style={{ position: "relative", display: "inline-block", color: "var(--site-accent)" }}>
          markets.
          <motion.svg
            aria-hidden
            viewBox="0 0 320 8"
            preserveAspectRatio="none"
            className="absolute left-0"
            style={{ bottom: "-0.02em", height: "0.1em", width: "100%" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 1.3 }}
          >
            <motion.path
              d="M2 5 Q 80 1, 160 4 T 318 3"
              fill="none"
              stroke="var(--site-accent)"
              strokeWidth="3"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.1, delay: 1.3, ease: "easeOut" }}
            />
          </motion.svg>
        </span>
      </motion.span>
    </h1>
  );
}

/* ─── Eyebrow ────────────────────────────────────────────────── */
function Eyebrow({ text }: { text: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.15 }}
      className="flex items-center gap-3 mb-7"
    >
      <span aria-hidden style={{ display: "block", height: 1, width: 32, background: "var(--site-accent)" }} />
      <span className="site-eyebrow" style={{ color: "var(--site-fg-mute)" }}>
        {text}
      </span>
    </motion.div>
  );
}

/* ─── LiveStack — right column status indicators ───────────── */
function LiveStack({ wordIdx }: { wordIdx: number }) {
  const word = MORPHING_WORDS[wordIdx];

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.9, delay: 0.5 }}
      className="flex flex-col items-end gap-5 site-glass px-6 py-6"
      style={{ borderRadius: 14, minWidth: 220 }}
    >
      {/* Live dot + label */}
      <div className="flex items-center gap-2.5">
        <span
          aria-hidden
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: "#30A46C",
            boxShadow: "0 0 10px rgba(48,164,108,0.7)",
            animation: "site-status-pulse 1.6s ease-in-out infinite",
          }}
        />
        <span className="site-eyebrow" style={{ color: "var(--site-fg-mute)" }}>
          Studio · live
        </span>
      </div>

      {/* Big stat */}
      <div className="text-right">
        <p
          className="site-mono"
          style={{
            fontSize: 10.5,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "var(--site-fg-dim)",
          }}
        >
          Currently designing
        </p>
        <AnimatePresence mode="wait">
          <motion.p
            key={word}
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -12, opacity: 0 }}
            transition={{ duration: 0.55, ease: [0.2, 0.7, 0.2, 1] }}
            className="site-display mt-1.5"
            style={{
              fontSize: 22,
              letterSpacing: "-0.025em",
              color: "var(--site-accent)",
              fontWeight: 600,
              lineHeight: 1,
            }}
          >
            {word.toLowerCase()}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Tiny meta */}
      <div
        className="w-full flex items-center justify-between pt-4"
        style={{ borderTop: "1px dashed var(--site-line-strong)" }}
      >
        <span
          className="site-mono"
          style={{
            fontSize: 9.5,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "var(--site-fg-dim)",
          }}
        >
          Q3 / 2026
        </span>
        <span
          className="site-mono"
          style={{
            fontSize: 9.5,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "var(--site-accent)",
          }}
        >
          3 slots open
        </span>
      </div>
    </motion.div>
  );
}

/* ─── Status strip ─────────────────────────────────────────── */
function StatusStrip({ status }: { status: string }) {
  return (
    <div
      className="relative z-10 shrink-0"
      style={{
        borderBottom: "1px solid rgba(245,241,232,0.10)",
        background: "rgba(10,8,7,0.55)",
        backdropFilter: "blur(10px)",
      }}
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
              animation: "site-status-pulse 1.6s ease-in-out infinite",
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
    </div>
  );
}

/* ─── Stats Ribbon ─────────────────────────────────────────── */
function StatsRibbon({ stats }: { stats: BentoStat[] }) {
  return (
    <div
      className="relative z-10 shrink-0"
      style={{
        borderTop: "1px solid rgba(245,241,232,0.10)",
        borderBottom: "1px solid rgba(245,241,232,0.10)",
        background: "rgba(10,8,7,0.65)",
        backdropFilter: "blur(10px)",
      }}
    >
      <div className="container py-3.5 flex items-center justify-between gap-x-6 gap-y-2 flex-wrap">
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
                fontSize: "clamp(13px, 1vw, 16px)",
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
              <span aria-hidden className="hidden md:inline pl-3" style={{ color: "rgba(245,241,232,0.18)" }}>
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
      style={{
        borderTop: "1px solid rgba(245,241,232,0.10)",
        background: "var(--site-bg-soft)",
      }}
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
