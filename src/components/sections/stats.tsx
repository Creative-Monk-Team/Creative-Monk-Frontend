"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/* ─── Static "Why Creative Monk" content ───────────────────────
   Six differentiators. Each is a real reason founders should pick
   us over a bigger agency — not generic value props. */
const PILLARS = [
  {
    no: "01",
    title: "Founder-led, no juniors hidden",
    description:
      "The founder sits in every kickoff and every review. The team you meet on the call is the team that ships your project. No bait-and-switch.",
    chip: "Senior-only",
  },
  {
    no: "02",
    title: "We say no, often",
    description:
      "We turn down most inbound projects. We take work only when the brief is brave, the founder is decisive, and we believe we can ship something memorable.",
    chip: "Selective intake",
  },
  {
    no: "03",
    title: "Two directions. Not three.",
    description:
      "Most studios show three concepts and let you compromise to the middle. We present two clearly opposing routes so you have to take a stance.",
    chip: "No middle-of-the-road",
  },
  {
    no: "04",
    title: "Replies under four hours",
    description:
      "WhatsApp, email, Slack — pick your channel. Studio hours are 09:30 to 18:30 IST and we read every message inside that window. No tickets, no portal.",
    chip: "4-hr SLA",
  },
  {
    no: "05",
    title: "We launch, then stay",
    description:
      "30 days of post-launch support is on us. After that, ~60% of clients move to a retainer because they like working with the same team that built the thing.",
    chip: "3.2-year tenure",
  },
  {
    no: "06",
    title: "Built for compounding work",
    description:
      "We don't optimise for the first 90 days. Everything we ship — brand systems, websites, content — is designed to keep paying back two years later.",
    chip: "Year-2 mindset",
  },
];

const NUMBERS = [
  { value: 142, suffix: "+", label: "Brands shipped", animate: true },
  { value: 87, suffix: "", label: "Verified reviews", animate: true },
  { value: 4.9, suffix: "★", label: "Average rating", animate: false },
  { value: "<4hr", suffix: "", label: "Reply SLA", animate: false },
];

export function Stats() {
  return (
    <section
      id="why-us"
      className="relative bg-[#FAF7F2] border-t border-stone-900/10 overflow-hidden"
      aria-label="Why Creative Monk"
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
                Why founders pick us
              </span>
            </div>
            <h2 className="font-funnel text-stone-900 font-bold leading-[0.98] tracking-[-0.035em] text-[clamp(2.25rem,5vw,4.5rem)] max-w-[20ch]">
              Six reasons our work doesn't look like{" "}
              <span
                style={{
                  fontFamily: "var(--font-newsreader), Georgia, serif",
                  fontStyle: "italic",
                  fontWeight: 500,
                }}
              >
                everyone else's.
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
              The shortlist of things we do differently — and why founders keep
              coming back to us long after the first project.
            </p>
          </motion.div>
        </div>

        {/* 6-up pillars grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {PILLARS.map((p, i) => (
            <Pillar key={p.no} pillar={p} index={i} />
          ))}
        </div>

        {/* Numbers band — refined, no money */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="mt-16 md:mt-20 rounded-3xl border border-stone-900/10 bg-stone-900 text-stone-50 overflow-hidden"
        >
          <div className="relative">
            {/* atmospheric gradient */}
            <div
              aria-hidden
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse 50% 60% at 100% 0%, rgba(255,102,0,0.15), transparent 60%)",
              }}
            />
            <div className="relative grid grid-cols-2 md:grid-cols-4">
              {NUMBERS.map((n, i) => (
                <div
                  key={n.label}
                  className={`p-7 md:p-9 ${
                    i > 0 ? "md:border-l" : ""
                  } ${i >= 2 ? "border-t md:border-t-0" : ""} border-stone-50/10`}
                >
                  <p className="font-funnel text-stone-50 leading-none tracking-[-0.025em] font-bold text-[clamp(2.4rem,4vw,3.2rem)]">
                    {n.animate && typeof n.value === "number" ? (
                      <Counter to={n.value as number} />
                    ) : (
                      n.value
                    )}
                    {n.suffix && (
                      <span
                        className={
                          n.suffix === "★" ? "text-[#FF6600] ml-1" : "ml-1"
                        }
                      >
                        {n.suffix}
                      </span>
                    )}
                  </p>
                  <p className="mt-3 font-jakarta text-[10.5px] font-semibold uppercase tracking-[0.22em] text-stone-300">
                    {n.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
          {/* Bottom strip on the dark band */}
          <div className="border-t border-stone-50/10 px-7 md:px-9 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 font-jakarta text-[12px] text-stone-300">
            <p className="flex items-center gap-2">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 hero-pulse" />
              All numbers verified across 2018–2026 · last updated this week
            </p>
            <a
              href="/case-studies"
              className="inline-flex items-center gap-2 font-jakarta text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-50 hover:text-[#FF6600] transition-colors cursor-pointer"
            >
              See how we got there
              <svg width="18" height="9" viewBox="0 0 22 10" fill="none">
                <path
                  d="M1 5 H 20 M 16 1 L 20 5 L 16 9"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Pillar({
  pillar,
  index,
}: {
  pillar: (typeof PILLARS)[number];
  index: number;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay: (index % 3) * 0.08, ease: [0.2, 0.7, 0.2, 1] }}
      className="group relative rounded-3xl bg-stone-50 border border-stone-900/10 p-7 md:p-8 transition-all duration-500 hover:-translate-y-1.5 hover:border-stone-900/25 hover:shadow-[0_24px_50px_-30px_rgba(15,12,8,0.25)] flex flex-col"
    >
      {/* number + chip row */}
      <div className="flex items-baseline justify-between mb-7">
        <span
          className="font-funnel text-[clamp(2.6rem,3.6vw,3.2rem)] leading-none tracking-tight font-bold text-stone-900"
          style={{
            fontFamily: "var(--font-newsreader), Georgia, serif",
            fontStyle: "italic",
            fontWeight: 500,
          }}
        >
          {pillar.no}
        </span>
        <span className="inline-flex items-center gap-2 rounded-full bg-stone-100 border border-stone-900/10 px-3 py-1.5 font-jakarta text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-700 group-hover:border-[#FF6600] group-hover:text-[#FF6600] transition-all duration-300">
          <span className="inline-block w-1 h-1 rounded-full bg-[#FF6600]" />
          {pillar.chip}
        </span>
      </div>

      {/* title */}
      <h3 className="font-funnel text-[clamp(1.2rem,1.55vw,1.4rem)] leading-[1.15] tracking-[-0.02em] font-bold text-stone-900">
        {pillar.title}
      </h3>

      {/* description */}
      <p className="mt-4 font-jakarta text-[14px] leading-[1.6] text-stone-600 flex-1">
        {pillar.description}
      </p>

      {/* hairline indicator that draws on hover */}
      <div className="mt-6 relative h-px bg-stone-900/10 overflow-hidden">
        <span
          aria-hidden
          className="absolute inset-y-0 left-0 right-0 bg-[#FF6600] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-out"
        />
      </div>
    </motion.article>
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
