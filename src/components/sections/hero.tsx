"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide, type SwiperRef } from "swiper/react";
import { EffectFade, Autoplay, Keyboard } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import { homepageContentApi } from "@/lib/api";
import { Magnetic } from "@/components/motion/magnetic";
import { MarqueeStrip } from "@/components/motion/marquee-strip";

/* ─── Hero v6 — "The Reel" ──────────────────────────────────────
   The hero IS the work. Full-bleed Swiper carousel of project visuals
   slow-pans behind massive editorial typography. Live "Now showing"
   caption + slide counter on the right edge sync to the active slide.
   Cursor-tracking radial glow lights the page. The aesthetic and the
   proof in the same frame — no clicks required to know we can design. */

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

/* The featured work reel — five slides, hand-picked for agency
   aesthetic. Real client wiring lands later via the portfolio API. */
type ReelItem = {
  client: string;
  discipline: string;
  outcome: string;
  year: string;
  image: string;
  accent: string;
};

const FEATURED_REEL: ReelItem[] = [
  {
    client: "Hive Management",
    discipline: "Brand · Web · Performance",
    outcome: "+312% qualified leads · 90 days",
    year: "2024",
    image:
      "https://images.unsplash.com/photo-1561070791-2526d30994b8?w=2400&q=85&auto=format&fit=crop",
    accent: "#FF6600",
  },
  {
    client: "Chatha Foods",
    discipline: "Identity · Packaging",
    outcome: "14 SKUs onto DMart shelves",
    year: "2024",
    image:
      "https://images.unsplash.com/photo-1542435503-956c469947f6?w=2400&q=85&auto=format&fit=crop",
    accent: "#E5B04A",
  },
  {
    client: "Woodhouse Café",
    discipline: "Brand · Social · Photography",
    outcome: "+38K Instagram in 90 days",
    year: "2024",
    image:
      "https://images.unsplash.com/photo-1559028012-481c04fa702d?w=2400&q=85&auto=format&fit=crop",
    accent: "#4A5D3A",
  },
  {
    client: "Brightlight Solar",
    discipline: "Web · SEO · Content",
    outcome: "3× organic search traffic",
    year: "2025",
    image:
      "https://images.unsplash.com/photo-1551434678-e076c223a692?w=2400&q=85&auto=format&fit=crop",
    accent: "#3E63DD",
  },
  {
    client: "Triple Six Beer",
    discipline: "Brand · Packaging · Motion",
    outcome: "Category re-launch, 4 markets",
    year: "2025",
    image:
      "https://images.unsplash.com/photo-1558655146-d09347e92766?w=2400&q=85&auto=format&fit=crop",
    accent: "#FF6600",
  },
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
  const [activeIdx, setActiveIdx] = useState(0);
  const swiperRef = useRef<SwiperRef | null>(null);

  return (
    <section
      className="relative isolate overflow-hidden flex flex-col"
      style={{
        minHeight: "100vh",
        background: "var(--site-bg, #0A0807)",
        color: "var(--site-fg, #F5F1E8)",
      }}
    >
      {/* ── Background reel ── */}
      <Swiper
        ref={swiperRef}
        modules={[EffectFade, Autoplay, Keyboard]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        loop
        keyboard={{ enabled: true }}
        speed={1100}
        onSlideChange={(swiper) => setActiveIdx(swiper.realIndex)}
        className="!absolute !inset-0 !w-full !h-full pointer-events-none"
        style={{ zIndex: 0 }}
      >
        {FEATURED_REEL.map((item) => (
          <SwiperSlide key={item.client}>
            <div className="relative w-full h-full overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.image}
                alt={`${item.client} — ${item.discipline}`}
                className="absolute inset-0 w-full h-full object-cover ken-burns"
                style={{ filter: "saturate(0.92) contrast(1.05)" }}
                draggable={false}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* ── Overlays (stacked z-order) ─────────────────────────────
         1. dark vignette to make text readable
         2. orange-tinted gradient from the active slide's accent
         3. dot grid texture
         4. cursor-tracking radial glow                              */}
      <ReelOverlay activeIdx={activeIdx} />

      {/* ── Status strip ── */}
      <StatusStrip status={data.status} />

      {/* ── Stage ── */}
      <div className="relative z-10 flex-1 flex items-center">
        <div className="container w-full py-10 lg:py-12">
          <div className="grid grid-cols-12 gap-x-8 gap-y-10 items-end">
            {/* LEFT — type column */}
            <div className="col-span-12 lg:col-span-8">
              <Eyebrow text={data.eyebrow} />
              <Statement
                lineA={data.lineA}
                lineB={data.lineB}
                accent={data.accent}
                lineC={data.lineC}
              />

              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.85, ease: [0.2, 0.7, 0.2, 1] }}
                className="mt-7 max-w-[52ch]"
                style={{
                  fontSize: "clamp(15px, 1.15vw, 17.5px)",
                  lineHeight: 1.55,
                  color: "rgba(245,241,232,0.78)",
                  textShadow: "0 1px 14px rgba(0,0,0,0.4)",
                }}
              >
                {data.lede}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 1.0, ease: [0.2, 0.7, 0.2, 1] }}
                className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4"
              >
                <PrimaryCta primary={data.primary} />
                <SecondaryCta secondary={data.secondary} />
              </motion.div>
            </div>

            {/* RIGHT — reel meta column */}
            <div className="hidden lg:flex col-span-4 flex-col items-end gap-8">
              <ReelCounter
                activeIdx={activeIdx}
                total={FEATURED_REEL.length}
                onJump={(i) => swiperRef.current?.swiper.slideToLoop(i)}
              />
            </div>
          </div>

          {/* "Now showing" caption row — full width, anchored to the bottom */}
          <NowShowing item={FEATURED_REEL[activeIdx]} />
        </div>
      </div>

      <StatsRibbon stats={data.bentoStats} />
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

/* ─── Statement — three lines, three typographic treatments ─── */
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
        fontSize: "clamp(2.5rem, 6.8vw, 6.5rem)",
        letterSpacing: "-0.035em",
        lineHeight: 0.96,
        fontWeight: 600,
        color: "var(--site-fg)",
        textShadow: "0 2px 32px rgba(0,0,0,0.45)",
      }}
    >
      <motion.span
        initial={{ opacity: 0, y: 22, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 1.0, delay: 0.3, ease: [0.2, 0.7, 0.2, 1] }}
        className="block"
      >
        {lineA}
      </motion.span>

      <motion.span
        initial={{ opacity: 0, y: 22, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 1.0, delay: 0.45, ease: [0.2, 0.7, 0.2, 1] }}
        className="block"
        style={{
          color: "transparent",
          WebkitTextStroke: "1.4px var(--site-fg)",
          // @ts-expect-error - vendor
          textStroke: "1.4px var(--site-fg)",
          letterSpacing: "-0.02em",
          textTransform: "uppercase",
        }}
      >
        {lineB}
      </motion.span>

      <motion.span
        initial={{ opacity: 0, y: 22, filter: "blur(10px)" }}
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

/* ─── ReelOverlay — vignette + accent wash + dot grid + glow ── */
function ReelOverlay({ activeIdx }: { activeIdx: number }) {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const accent = FEATURED_REEL[activeIdx]?.accent || "#FF6600";

  // Cursor-tracking radial glow
  useEffect(() => {
    const el = overlayRef.current;
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
      cx += (mx - cx) * 0.08;
      cy += (my - cy) * 0.08;
      if (overlayRef.current) {
        overlayRef.current.style.setProperty("--gx", `${cx}px`);
        overlayRef.current.style.setProperty("--gy", `${cy}px`);
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
    <>
      {/* 1. Dark vignette — lighter on the right so the image breathes,
              stronger on the left for type contrast. */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 1,
          background:
            "linear-gradient(95deg, rgba(10,8,7,0.88) 0%, rgba(10,8,7,0.72) 30%, rgba(10,8,7,0.32) 60%, rgba(10,8,7,0.18) 100%), linear-gradient(180deg, rgba(10,8,7,0.45) 0%, transparent 25%, rgba(10,8,7,0.70) 100%)",
        }}
      />

      {/* 2. Accent wash — tinted with the active slide's accent */}
      <motion.div
        key={accent}
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.18 }}
        transition={{ duration: 1.2 }}
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 2,
          background: `radial-gradient(ellipse 70% 60% at 100% 0%, ${accent}88, transparent 60%)`,
        }}
      />

      {/* 3. Dot-grid texture — soft, masked center-out */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 3,
          backgroundImage:
            "radial-gradient(rgba(245,241,232,0.10) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          opacity: 0.45,
          maskImage:
            "radial-gradient(ellipse 80% 80% at 50% 60%, black 30%, transparent 90%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 80% at 50% 60%, black 30%, transparent 90%)",
        }}
      />

      {/* 4. Cursor-tracking radial glow */}
      <div
        ref={overlayRef}
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 4,
          background:
            "radial-gradient(circle 360px at var(--gx, 50%) var(--gy, 50%), rgba(255,102,0,0.10), transparent 70%)",
          mixBlendMode: "screen",
        }}
      />
    </>
  );
}

/* ─── ReelCounter — right edge: 01/05 + dot navigation ───── */
function ReelCounter({
  activeIdx,
  total,
  onJump,
}: {
  activeIdx: number;
  total: number;
  onJump: (i: number) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.9, delay: 0.7 }}
      className="flex flex-col items-end gap-5 site-glass px-5 py-5"
      style={{ borderRadius: 14, minWidth: 220 }}
    >
      <div className="flex items-baseline gap-3 site-mono" style={{ color: "var(--site-fg-mute)" }}>
        <span
          className="site-display"
          style={{
            fontSize: "clamp(2.4rem, 3.6vw, 3.2rem)",
            fontWeight: 600,
            letterSpacing: "-0.03em",
            color: "var(--site-fg)",
            lineHeight: 0.85,
          }}
        >
          {String(activeIdx + 1).padStart(2, "0")}
        </span>
        <span style={{ fontSize: 12, letterSpacing: "0.22em" }}>/</span>
        <span style={{ fontSize: 12, letterSpacing: "0.22em" }}>
          {String(total).padStart(2, "0")}
        </span>
      </div>

      <span
        className="site-eyebrow"
        style={{ color: "var(--site-fg-mute)" }}
      >
        Selected work · the reel
      </span>

      <div className="flex items-center gap-1.5 mt-1">
        {Array.from({ length: total }).map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onJump(i)}
            aria-label={`Show slide ${i + 1}`}
            data-cursor="link"
            className="transition-all"
            style={{
              width: i === activeIdx ? 28 : 8,
              height: 3,
              borderRadius: 2,
              background:
                i === activeIdx ? "var(--site-accent)" : "rgba(245,241,232,0.22)",
              boxShadow:
                i === activeIdx ? "0 0 12px rgba(255,102,0,0.6)" : "none",
              cursor: "pointer",
              border: "none",
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}

/* ─── NowShowing — bottom-anchored live caption ────────────── */
function NowShowing({ item }: { item: ReelItem }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.95, delay: 1.2 }}
      className="mt-12 flex items-start justify-between gap-6 flex-wrap"
      style={{ borderTop: "1px solid rgba(245,241,232,0.12)", paddingTop: 18 }}
    >
      <div className="flex items-start gap-5">
        <span
          aria-hidden
          style={{
            display: "inline-block",
            marginTop: 6,
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: "var(--site-accent)",
            boxShadow: "0 0 10px rgba(255,102,0,0.7)",
            animation: "reel-pulse 1.6s ease-in-out infinite",
          }}
        />
        <div>
          <p
            className="site-mono"
            style={{
              fontSize: 10.5,
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color: "var(--site-fg-mute)",
            }}
          >
            Now showing
          </p>
          <motion.p
            key={`${item.client}-name`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="site-display mt-1"
            style={{
              fontSize: "clamp(17px, 1.6vw, 22px)",
              letterSpacing: "-0.018em",
              color: "var(--site-fg)",
            }}
          >
            {item.client}{" "}
            <span
              style={{
                fontFamily: "var(--font-newsreader), Georgia, serif",
                fontStyle: "italic",
                fontWeight: 500,
                color: "var(--site-fg-mute)",
                fontSize: "0.82em",
              }}
            >
              · {item.discipline}
            </span>
          </motion.p>
        </div>
      </div>

      <motion.div
        key={`${item.client}-meta`}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.1 }}
        className="flex items-center gap-5 ml-auto"
      >
        <span
          className="site-mono"
          style={{
            fontSize: 11,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "var(--site-accent)",
          }}
        >
          {item.outcome}
        </span>
        <span
          aria-hidden
          style={{
            display: "inline-block",
            width: 1,
            height: 16,
            background: "rgba(245,241,232,0.2)",
          }}
        />
        <span
          className="site-mono"
          style={{
            fontSize: 11,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "var(--site-fg-mute)",
          }}
        >
          {item.year}
        </span>
        <Link
          href="/portfolio"
          data-cursor="link"
          className="site-mono group inline-flex items-center gap-1.5"
          style={{
            fontSize: 11,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "var(--site-fg)",
          }}
        >
          Case study
          <span aria-hidden className="group-hover:translate-x-1 transition-transform">↗</span>
        </Link>
      </motion.div>
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
