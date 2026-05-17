"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { homepageContentApi } from "@/lib/api";
import { ScrollReveal } from "@/components/motion/scroll-reveal";

type Stage = {
  no: string;
  day: string;
  title: string;
  italic: string;
  description: string;
  artefact: string;
  accent: string;
};

const FALLBACK_STAGES: Stage[] = [
  { no: "01", day: "Day 0–3",   title: "Discovery", italic: "we listen",            description: "Free 30-min founder call, competitive teardown and a one-page creative brief we both sign before any meter starts running.", artefact: "creative_brief.pdf",        accent: "#FF6600" },
  { no: "02", day: "Day 4–10",  title: "Direction", italic: "we take a stance",     description: "Two clearly opposing creative routes — never three. You pick a side; we don't hide our point of view in a safe middle option.", artefact: "route_a · route_b",        accent: "#0F0C08" },
  { no: "03", day: "Day 11–25", title: "Craft",     italic: "we make the thing",    description: "The identity gets built out across every application. The website lands on a staging URL you can demo to your co-founder on a Saturday.", artefact: "staging.creativemonk.in", accent: "#FF6600" },
  { no: "04", day: "Day 26–40", title: "Polish",    italic: "we sweat the details", description: "Type kerning, micro-copy, edge cases, responsive states, accessibility passes. The hidden 50% that separates good work from work clients brag about.", artefact: "qa_checklist.md",  accent: "#4A5D3A" },
  { no: "05", day: "Day 41–45", title: "Ship",      italic: "then we stay",         description: "Launch in your timezone. First 30 days of bugs and tweaks are on us — no support tickets, just a WhatsApp thread that stays open.", artefact: "launch_postmortem.md",                accent: "#FF6600" },
];

export function Process() {
  const [stages, setStages] = useState<Stage[]>(FALLBACK_STAGES);
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    homepageContentApi.get<{ stages?: Stage[] }>("process").then((data) => {
      if (cancelled || !data?.stages?.length) return;
      setStages(data.stages);
    });
    return () => { cancelled = true; };
  }, []);

  /* Scrub the timeline as the section scrolls — a vertical orange
     line grows from top to bottom, anchoring the stage cards. */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.8", "end 0.2"],
  });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section
      ref={sectionRef}
      id="process"
      className="relative overflow-hidden"
      style={{ background: "var(--site-bg, #0A0807)", color: "var(--site-fg)" }}
      aria-label="Our process"
    >
      <div className="container relative z-10 py-24 md:py-32">
        {/* Header */}
        <div className="grid grid-cols-12 gap-x-8 gap-y-8 items-end mb-16 md:mb-24">
          <ScrollReveal className="col-span-12 md:col-span-7">
            <div className="flex items-center gap-3 mb-6">
              <span aria-hidden style={{ display: "block", height: 1, width: 36, background: "var(--site-accent)" }} />
              <span className="site-eyebrow">How we work</span>
            </div>
            <h2
              className="site-display"
              style={{ fontSize: "clamp(2.25rem, 5vw, 4.5rem)", letterSpacing: "-0.03em", lineHeight: 0.96 }}
            >
              A signed brief by week one.{" "}
              <span className="site-italic" style={{ color: "var(--site-accent)" }}>
                Shipped in 45 days.
              </span>
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.15} className="col-span-12 md:col-span-5">
            <p style={{ fontSize: 15, lineHeight: 1.65, color: "var(--site-fg-mute)" }}>
              No retainer hostage situation. No mystery invoices. You see every
              milestone before any meter starts running.
            </p>
          </ScrollReveal>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Static rail */}
          <span
            aria-hidden
            className="absolute left-[20px] md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-px"
            style={{ background: "var(--site-line)" }}
          />
          {/* Animated fill */}
          <motion.span
            aria-hidden
            className="absolute left-[20px] md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-px origin-top"
            style={{
              scaleY: lineScale,
              background: "linear-gradient(180deg, var(--site-accent) 0%, rgba(255,102,0,0.4) 100%)",
              boxShadow: "0 0 24px rgba(255,102,0,0.5)",
            }}
          />

          <ol className="relative space-y-16 md:space-y-24">
            {stages.map((stage, i) => (
              <StageRow key={stage.no} stage={stage} index={i} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function StageRow({ stage, index }: { stage: Stage; index: number }) {
  const isLeft = index % 2 === 0;

  return (
    <motion.li
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.9, ease: [0.2, 0.7, 0.2, 1] }}
      className="relative grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center"
    >
      {/* Node — pulsing dot on the rail */}
      <span
        aria-hidden
        className="absolute left-[20px] md:left-1/2 -translate-x-1/2 z-10 grid place-items-center"
        style={{
          width: 14, height: 14,
          background: "var(--site-bg)",
          border: "2px solid var(--site-accent)",
          borderRadius: "50%",
          boxShadow: "0 0 0 6px rgba(10,8,7,1), 0 0 24px rgba(255,102,0,0.7)",
        }}
      >
        <span
          aria-hidden
          style={{
            width: 4, height: 4,
            background: "var(--site-accent)",
            borderRadius: "50%",
            animation: "process-pulse 2s ease-in-out infinite",
          }}
        />
      </span>

      {/* LEFT cell */}
      <div
        className={`pl-16 md:pl-0 ${isLeft ? "md:pr-12 md:text-right md:order-1" : "md:pl-12 md:order-2"}`}
      >
        <div
          className={`flex items-center gap-3 mb-3 ${isLeft ? "md:justify-end" : ""}`}
        >
          <span
            className="site-mono"
            style={{
              fontSize: 11,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "var(--site-accent)",
              padding: "3px 8px",
              border: "1px solid rgba(255,102,0,0.35)",
              background: "rgba(255,102,0,0.06)",
            }}
          >
            {stage.day}
          </span>
        </div>
        <h3
          className="site-display"
          style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)", letterSpacing: "-0.025em", lineHeight: 1 }}
        >
          <span className="block">{stage.title}</span>
          <span
            className="site-italic block mt-2"
            style={{ fontSize: "0.5em", color: "var(--site-accent)", fontWeight: 500 }}
          >
            {stage.italic}
          </span>
        </h3>
      </div>

      {/* RIGHT cell */}
      <div
        className={`pl-16 md:pl-0 ${isLeft ? "md:pl-12 md:order-2" : "md:pr-12 md:text-right md:order-1"}`}
      >
        <p className="site-mono mb-2" style={{ fontSize: 10.5, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--site-fg-dim)" }}>
          Stage {stage.no} of 05
        </p>
        <p style={{ fontSize: 15, lineHeight: 1.65, color: "var(--site-fg-mute)", maxWidth: 520 }} className={isLeft ? "md:ml-auto" : ""}>
          {stage.description}
        </p>
        <div className={`mt-5 flex items-center gap-2.5 ${isLeft ? "md:justify-end" : ""}`}>
          <span
            aria-hidden
            style={{
              display: "inline-block",
              width: 18, height: 18,
              background: "rgba(255,102,0,0.1)",
              border: "1px solid rgba(255,102,0,0.35)",
              position: "relative",
            }}
          >
            <span
              style={{
                position: "absolute", top: 3, right: 3, bottom: 3, left: 3,
                background: "var(--site-accent)",
                opacity: 0.6,
              }}
            />
          </span>
          <span className="site-mono" style={{ fontSize: 11.5, color: "var(--site-fg)", letterSpacing: "0.04em" }}>
            {stage.artefact}
          </span>
        </div>
      </div>

      <style jsx>{`
        @keyframes process-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%      { opacity: 0.4; transform: scale(1.4); }
        }
      `}</style>
    </motion.li>
  );
}
