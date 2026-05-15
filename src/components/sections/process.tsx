"use client";

import { motion } from "framer-motion";
import { useState } from "react";

/* ─── Five-stage studio process ────────────────────────────────
   Each stage has a date marker, a real deliverable, and an
   artefact you can actually point at. */
const STAGES = [
  {
    no: "01",
    day: "Day 0–3",
    title: "Discovery",
    italic: "we listen",
    description:
      "60-minute founder call, competitive teardown and a one-page creative brief we both sign before any meter starts running.",
    artefact: "creative_brief.pdf",
    accent: "#FF6600",
  },
  {
    no: "02",
    day: "Day 4–10",
    title: "Direction",
    italic: "we take a stance",
    description:
      "Two clearly opposing creative routes — not three. You pick a side; we don't hide our point of view in a neutral middle option.",
    artefact: "route_a · route_b",
    accent: "#0F0C08",
  },
  {
    no: "03",
    day: "Day 11–25",
    title: "Craft",
    italic: "we make the thing",
    description:
      "The identity gets built out across applications. The website lands on a staging URL you can show your co-founder on a Saturday.",
    artefact: "staging.creativemonk.in",
    accent: "#FF6600",
  },
  {
    no: "04",
    day: "Day 26–40",
    title: "Polish",
    italic: "we sweat the details",
    description:
      "Type kerning, micro-copy, edge cases, responsive states, accessibility passes. The hidden 50% that separates good work from great.",
    artefact: "qa_checklist.md",
    accent: "#4A5D3A",
  },
  {
    no: "05",
    day: "Day 41–45",
    title: "Ship",
    italic: "then we stay",
    description:
      "Launch in your timezone. First 30 days of bugs and tweaks are on us — no support tickets, just WhatsApp.",
    artefact: "launch_postmortem.md",
    accent: "#FF6600",
  },
];

export function Process() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section
      id="process"
      className="relative bg-[#FAF7F2] border-t border-stone-900/10 overflow-hidden"
      aria-label="Our process"
    >
      <div className="hero-grain-paper" aria-hidden />

      <div className="container relative z-10 py-20 md:py-28">
        {/* Header */}
        <div className="grid grid-cols-12 gap-x-8 gap-y-8 items-end mb-14 md:mb-20">
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
                How we work
              </span>
            </div>
            <h2 className="font-funnel text-stone-900 font-bold leading-[0.98] tracking-[-0.035em] text-[clamp(2.25rem,5vw,4.5rem)] max-w-[20ch]">
              A signed brief in week one.{" "}
              <span
                style={{
                  fontFamily: "var(--font-newsreader), Georgia, serif",
                  fontStyle: "italic",
                  fontWeight: 500,
                  color: "#1c1c1c",
                }}
              >
                Live in six.
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
            <p className="font-jakarta text-[15.5px] md:text-[16.5px] leading-[1.55] text-stone-700 max-w-[42ch]">
              No mystery phases or vague Gantt charts. Every stage has a date,
              a deliverable and a real human you can talk to.
            </p>
          </motion.div>
        </div>

        {/* Connected horizontal timeline */}
        <div className="relative">
          {/* base connecting line */}
          <div
            aria-hidden
            className="absolute left-0 right-0 top-[26px] h-px bg-stone-900/15 hidden md:block"
          />
          {/* progress line up to active step */}
          <motion.div
            aria-hidden
            initial={{ scaleX: 0 }}
            animate={{ scaleX: (activeIndex + 1) / STAGES.length }}
            transition={{ duration: 0.5, ease: [0.2, 0.7, 0.2, 1] }}
            style={{ transformOrigin: "left" }}
            className="absolute left-0 right-0 top-[26px] h-[2px] bg-[#FF6600] hidden md:block z-10"
          />

          <div className="grid grid-cols-1 md:grid-cols-5 gap-y-12 md:gap-x-3 lg:gap-x-4">
            {STAGES.map((stage, i) => {
              const isActive = i <= activeIndex;
              const isCurrent = i === activeIndex;
              return (
                <button
                  key={stage.no}
                  type="button"
                  onMouseEnter={() => setActiveIndex(i)}
                  onClick={() => setActiveIndex(i)}
                  aria-pressed={isCurrent}
                  className="group relative text-left cursor-pointer"
                >
                  {/* Big node on the timeline */}
                  <div className="relative flex items-center justify-start mb-7 md:justify-start">
                    <motion.span
                      animate={{
                        scale: isCurrent ? 1.15 : 1,
                        background: isCurrent
                          ? "#FF6600"
                          : isActive
                            ? "#FF6600"
                            : "#FAF7F2",
                        borderColor: isActive ? "#FF6600" : "rgba(15,12,8,0.15)",
                      }}
                      transition={{ duration: 0.4 }}
                      className="relative z-20 grid place-items-center w-[52px] h-[52px] rounded-full border-2 shadow-[0_0_0_6px_rgba(250,247,242,1)]"
                    >
                      <motion.span
                        animate={{
                          color: isActive ? "#FAF7F2" : "#1c1c1c",
                          opacity: isActive ? 1 : 0.4,
                        }}
                        transition={{ duration: 0.4 }}
                        className="font-funnel text-[15px] font-bold tracking-tight tabular-nums"
                      >
                        {stage.no}
                      </motion.span>
                      {/* Pulse ring when current */}
                      {isCurrent && (
                        <motion.span
                          aria-hidden
                          initial={{ scale: 0.8, opacity: 0.6 }}
                          animate={{ scale: 1.6, opacity: 0 }}
                          transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
                          className="absolute inset-0 rounded-full border-2 border-[#FF6600]"
                        />
                      )}
                    </motion.span>
                  </div>

                  {/* Stage card */}
                  <motion.div
                    animate={{
                      borderColor: isCurrent ? "#FF6600" : "rgba(15,12,8,0.10)",
                      backgroundColor: isCurrent ? "#FFFFFF" : "#FAF7F2",
                      y: isCurrent ? -3 : 0,
                    }}
                    transition={{ duration: 0.4 }}
                    className="rounded-2xl border p-6 md:p-7 transition-shadow duration-500 group-hover:shadow-[0_18px_36px_-22px_rgba(15,12,8,0.18)]"
                  >
                    {/* day marker */}
                    <p
                      className="font-jakarta text-[10px] font-semibold uppercase tracking-[0.22em] mb-3 transition-colors duration-300"
                      style={{ color: isCurrent ? stage.accent : "#a8a29e" }}
                    >
                      {stage.day}
                    </p>

                    {/* title */}
                    <h3 className="font-funnel font-bold tracking-[-0.025em] leading-[1.1] text-[clamp(1.2rem,1.6vw,1.45rem)] text-stone-900">
                      {stage.title}
                      <span
                        className="block mt-1 text-[0.72em]"
                        style={{
                          fontFamily: "var(--font-newsreader), Georgia, serif",
                          fontStyle: "italic",
                          fontWeight: 400,
                          color: "#6b6b70",
                        }}
                      >
                        — {stage.italic}.
                      </span>
                    </h3>

                    <p className="mt-4 font-jakarta text-[13.5px] leading-[1.6] text-stone-600">
                      {stage.description}
                    </p>

                    {/* Artefact chip */}
                    <div className="mt-5 pt-4 border-t border-stone-900/10">
                      <p className="flex items-center gap-2 font-mono-ui text-[10.5px] uppercase tracking-[0.18em] text-stone-500">
                        <span
                          className="inline-block h-1 w-1 rounded-full"
                          style={{ background: stage.accent }}
                        />
                        {stage.artefact}
                      </p>
                    </div>
                  </motion.div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="mt-14 md:mt-16 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4"
        >
          {[
            { value: "45", suffix: "days", label: "Average engagement" },
            { value: "30", suffix: "days", label: "Free post-launch support" },
            { value: "0", suffix: "missed", label: "Deadlines, last 24 months" },
            { value: "<4hr", suffix: "", label: "Reply SLA across stages" },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-stone-900/10 bg-stone-50 p-5 md:p-6 hover:border-[#FF6600]/40 hover:bg-white transition-all duration-300 cursor-default"
            >
              <p className="font-funnel font-bold tracking-[-0.025em] text-stone-900 leading-none text-[clamp(1.7rem,2.4vw,2.1rem)]">
                {s.value}
                {s.suffix && (
                  <span className="ml-1.5 font-jakarta text-[12px] font-semibold uppercase tracking-[0.18em] text-stone-500 align-middle normal-case">
                    {s.suffix}
                  </span>
                )}
              </p>
              <p className="mt-3 font-jakarta text-[10.5px] font-semibold uppercase tracking-[0.18em] text-stone-500">
                {s.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
