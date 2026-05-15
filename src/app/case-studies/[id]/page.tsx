"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CTA } from "@/components/sections/cta";
import { getCaseStudy } from "@/lib/api";
import type { CaseStudy } from "@/lib/types";
import { getThumbnail } from "@/lib/image-utils";

/* A "short" metric value (e.g. "+312%", "4.9★", "<4hr") gets the big
   headline treatment. Long text values ("Web Development", "Strategy
   + Creative + Execution") render as a smaller, properly-wrapped
   sub-headline so they don't overflow the column. */
function isShortValue(v: string | undefined | null): boolean {
  if (!v) return false;
  const trimmed = v.trim();
  if (trimmed.length <= 8) return true;
  return /^[\d.,+%\-x×₹$KkMm/\s]+$/.test(trimmed);
}

export default function CaseStudyDetailPage() {
  const { id } = useParams();
  const [study, setStudy] = useState<CaseStudy | null>(null);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!id) return;
    getCaseStudy(id as string)
      .then(setStudy)
      .catch((err) => console.error("Failed to fetch case study:", err))
      .finally(() => setLoading(false));
  }, [id]);

  const gallery = useMemo(() => {
    if (!study) return [];
    const items: string[] = [];
    if (study.image) items.push(study.image);
    if (study.portfolioImage && !items.includes(study.portfolioImage))
      items.push(study.portfolioImage);
    (study.gallery || []).forEach((g) => {
      if (g && !items.includes(g)) items.push(g);
    });
    return items;
  }, [study]);

  useEffect(() => {
    if (lightboxIndex === null) return undefined;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowRight")
        setLightboxIndex((c) => (c === null ? c : (c + 1) % gallery.length));
      if (e.key === "ArrowLeft")
        setLightboxIndex((c) =>
          c === null ? c : (c - 1 + gallery.length) % gallery.length
        );
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxIndex, gallery.length]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#FAF7F2] grid place-items-center">
        <div className="flex flex-col items-center gap-4 text-stone-500">
          <div className="w-10 h-10 border-2 border-[#FF6600] border-t-transparent rounded-full animate-spin" />
          <p className="font-jakarta text-[11px] font-semibold uppercase tracking-[0.22em]">
            Loading case study…
          </p>
        </div>
      </main>
    );
  }

  if (!study) {
    return (
      <main className="min-h-screen bg-[#FAF7F2] grid place-items-center">
        <div className="text-center">
          <h1 className="font-funnel text-stone-900 font-bold text-3xl tracking-tight">
            Case study not found.
          </h1>
          <Link
            href="/case-studies"
            className="mt-6 inline-flex items-center gap-2 font-jakarta text-[12px] font-semibold uppercase tracking-[0.22em] text-stone-900 cursor-pointer"
          >
            ← Back to case studies
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="relative">
      <DetailHero study={study} />
      <Snapshot study={study} />
      {(study.challenges?.length || study.solutions?.length || study.results?.length) && (
        <ChallengeSolutionResults study={study} />
      )}
      {study.content && <LongRead study={study} />}
      {gallery.length > 0 && <Gallery images={gallery} onOpen={setLightboxIndex} />}
      {study.testimonial?.text && <Testimonial study={study} />}
      <CTA />

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && gallery[lightboxIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] bg-stone-900/95 backdrop-blur-md grid place-items-center p-6 cursor-pointer"
            onClick={() => setLightboxIndex(null)}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex(null);
              }}
              className="absolute top-6 right-6 grid place-items-center w-11 h-11 rounded-full bg-stone-50 text-stone-900 cursor-pointer hover:bg-[#FF6600] transition-colors z-10"
              aria-label="Close"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M2 2 L12 12 M12 2 L2 12"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </button>
            {gallery.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxIndex(
                      (c) => (c === null ? c : (c - 1 + gallery.length) % gallery.length)
                    );
                  }}
                  className="absolute left-6 top-1/2 -translate-y-1/2 grid place-items-center w-11 h-11 rounded-full bg-stone-50 text-stone-900 cursor-pointer hover:bg-[#FF6600] transition-colors"
                  aria-label="Previous"
                >
                  <svg width="14" height="9" viewBox="0 0 22 10" fill="none">
                    <path
                      d="M21 5 H 2 M 6 1 L 2 5 L 6 9"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxIndex((c) =>
                      c === null ? c : (c + 1) % gallery.length
                    );
                  }}
                  className="absolute right-6 top-1/2 -translate-y-1/2 grid place-items-center w-11 h-11 rounded-full bg-stone-50 text-stone-900 cursor-pointer hover:bg-[#FF6600] transition-colors"
                  aria-label="Next"
                >
                  <svg width="14" height="9" viewBox="0 0 22 10" fill="none">
                    <path
                      d="M1 5 H 20 M 16 1 L 20 5 L 16 9"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <span className="absolute bottom-6 left-1/2 -translate-x-1/2 font-jakarta text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-300">
                  {lightboxIndex + 1} / {gallery.length}
                </span>
              </>
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={gallery[lightboxIndex]}
              alt=""
              className="max-h-[88vh] max-w-[92vw] rounded-2xl object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

/* ─── Hero ─────────────────────────────────────────────────── */
function DetailHero({ study }: { study: CaseStudy }) {
  const cover = study.portfolioImage || study.image || study.gallery?.[0];
  return (
    <section className="relative bg-[#FAF7F2] overflow-hidden">
      <div className="hero-grain-paper" aria-hidden />
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 55% 50% at 100% 0%, rgba(255,102,0,0.10), transparent 60%)",
        }}
      />

      <div className="container relative z-10 pt-10 md:pt-16 pb-16 md:pb-20">
        {/* Back link / breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between gap-4 mb-10 md:mb-14 pb-5 border-b border-stone-900/10"
        >
          <Link
            href="/case-studies"
            className="group inline-flex items-center gap-2 font-jakarta text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-700 hover:text-stone-900 cursor-pointer"
          >
            <svg
              width="14"
              height="9"
              viewBox="0 0 22 10"
              fill="none"
              className="group-hover:-translate-x-1 transition-transform"
            >
              <path
                d="M21 5 H 2 M 6 1 L 2 5 L 6 9"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            All case studies
          </Link>
          <span className="font-jakarta text-[10.5px] font-semibold uppercase tracking-[0.22em] text-stone-500 flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#FF6600]" />
            {study.category}
            {study.client && (
              <>
                <span className="text-stone-300">·</span>
                <span>{study.client}</span>
              </>
            )}
          </span>
        </motion.div>

        <div className="grid grid-cols-12 gap-x-8 gap-y-12 items-start">
          {/* Left — typography */}
          <div className="col-span-12 lg:col-span-7">
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, ease: [0.2, 0.7, 0.2, 1] }}
              className="font-funnel text-stone-900 font-bold leading-[0.95] tracking-[-0.035em] text-[clamp(2.25rem,5.4vw,4.75rem)] max-w-[20ch]"
            >
              {study.title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-7 max-w-[60ch] font-jakarta text-[16.5px] md:text-[18px] leading-[1.6] text-stone-700"
            >
              {study.description}
            </motion.p>

            {/* Quick fact row */}
            <motion.dl
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mt-10 grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-5 max-w-xl"
            >
              {study.client && (
                <div>
                  <dt className="font-jakarta text-[10px] font-semibold uppercase tracking-[0.22em] text-stone-500">
                    Client
                  </dt>
                  <dd className="mt-1.5 font-funnel text-[15px] font-bold tracking-[-0.015em] text-stone-900">
                    {study.client}
                  </dd>
                </div>
              )}
              <div>
                <dt className="font-jakarta text-[10px] font-semibold uppercase tracking-[0.22em] text-stone-500">
                  Category
                </dt>
                <dd className="mt-1.5 font-funnel text-[15px] font-bold tracking-[-0.015em] text-stone-900">
                  {study.category}
                </dd>
              </div>
              {study.duration && (
                <div>
                  <dt className="font-jakarta text-[10px] font-semibold uppercase tracking-[0.22em] text-stone-500">
                    Duration
                  </dt>
                  <dd className="mt-1.5 font-funnel text-[15px] font-bold tracking-[-0.015em] text-stone-900">
                    {study.duration}
                  </dd>
                </div>
              )}
            </motion.dl>

            {/* Services chips */}
            {study.services && study.services.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
                className="mt-8"
              >
                <p className="font-jakarta text-[10px] font-semibold uppercase tracking-[0.22em] text-stone-500 mb-3">
                  Services delivered
                </p>
                <div className="flex flex-wrap gap-2">
                  {study.services.map((s) => (
                    <span
                      key={s}
                      className="inline-flex items-center gap-1.5 rounded-full border border-stone-900/15 px-3 py-1.5 font-jakarta text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-700"
                    >
                      <span className="block w-1 h-1 rounded-full bg-[#FF6600]" />
                      {s}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="mt-9 flex flex-wrap items-center gap-4 md:gap-5"
            >
              <Link
                href="/contact"
                className="group relative inline-flex items-center gap-3 rounded-full bg-stone-900 text-stone-50 pl-6 pr-2 py-2 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-[0_18px_40px_-18px_rgba(15,12,8,0.5)]"
              >
                <span
                  aria-hidden
                  className="absolute inset-0 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, rgba(255,102,0,0.85), transparent)",
                  }}
                />
                <span className="relative font-funnel text-[15px] font-semibold tracking-tight">
                  Want something like this?
                </span>
                <span className="relative inline-grid place-items-center w-10 h-10 rounded-full bg-[#FF6600] text-stone-900 group-hover:bg-stone-50 group-hover:rotate-[-30deg] transition-all duration-300">
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

              {study.link && (
                <a
                  href={study.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-3 font-jakarta text-[12px] font-semibold uppercase tracking-[0.22em] text-stone-900 cursor-pointer"
                >
                  <span className="relative">
                    Visit live project
                    <span className="absolute left-0 -bottom-1 h-px w-full bg-stone-900 origin-left scale-x-100 group-hover:scale-x-0 transition-transform duration-400" />
                    <span className="absolute left-0 -bottom-1 h-px w-full bg-[#FF6600] origin-right scale-x-0 group-hover:scale-x-100 transition-transform duration-400 delay-100" />
                  </span>
                  <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M2 12 L12 2 M5 2 L12 2 L12 9"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              )}
            </motion.div>
          </div>

          {/* Right — cover */}
          <motion.aside
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.15, ease: [0.2, 0.7, 0.2, 1] }}
            className="col-span-12 lg:col-span-5 relative"
          >
            <div className="relative max-w-[480px] mx-auto">
              <span className="absolute -top-3 -right-2 z-30 bg-[#FF6600] text-stone-900 rounded-2xl px-3.5 py-2 shadow-[0_14px_28px_-12px_rgba(255,102,0,0.55)] rotate-[5deg] font-jakarta text-[10px] font-bold uppercase tracking-[0.22em]">
                Case file · {String(study.order || 1).padStart(2, "0")}
              </span>

              <div className="relative aspect-[5/6] rounded-[28px] overflow-hidden border border-stone-900/15 bg-stone-50 shadow-[0_30px_60px_-30px_rgba(15,12,8,0.3)]">
                {cover ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={cover}
                    alt={study.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className="absolute inset-0 grid place-items-center"
                    style={{
                      background:
                        "linear-gradient(135deg, #FF6600 0%, #1A1410 100%)",
                    }}
                  >
                    <span className="font-funnel text-stone-50 font-bold tracking-tight text-[clamp(2.5rem,4vw,4rem)]">
                      {study.client || study.title}
                    </span>
                  </div>
                )}

                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/15 to-transparent"
                />

                <span className="absolute top-5 left-5 font-jakarta text-[10px] font-semibold uppercase tracking-[0.22em] text-stone-50/85">
                  Case file · MMXXVI
                </span>

                {/* Bottom card: promote a metric to "Headline outcome" only
                    if it actually looks like a numeric outcome. Otherwise fall
                    back to a project snapshot showing 2-3 key facts. */}
                {(() => {
                  const numericMetric = study.metrics?.find((m) =>
                    isShortValue(m.value)
                  );
                  if (numericMetric) {
                    return (
                      <div className="absolute left-5 right-5 bottom-5 rounded-2xl bg-[#FAF7F2]/95 backdrop-blur-md border border-stone-900/10 p-5">
                        <p className="font-jakarta text-[10.5px] font-semibold uppercase tracking-[0.22em] text-stone-500 mb-2">
                          Headline outcome
                        </p>
                        <p className="font-funnel font-bold leading-none tracking-[-0.04em] text-stone-900 text-[clamp(2rem,3.4vw,2.6rem)] break-words">
                          <span style={{ color: "#FF6600" }}>
                            {numericMetric.value}
                          </span>
                        </p>
                        <p className="mt-2 font-jakarta text-[12.5px] text-stone-600">
                          {numericMetric.label}
                        </p>
                      </div>
                    );
                  }
                  if (study.metrics && study.metrics.length > 0) {
                    return (
                      <div className="absolute left-5 right-5 bottom-5 rounded-2xl bg-[#FAF7F2]/95 backdrop-blur-md border border-stone-900/10 p-5">
                        <p className="font-jakarta text-[10.5px] font-semibold uppercase tracking-[0.22em] text-stone-500 mb-3">
                          At a glance
                        </p>
                        <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
                          {study.metrics.slice(0, 4).map((m, i) => (
                            <div key={m.label + i} className="min-w-0">
                              <dt className="font-jakarta text-[9.5px] font-semibold uppercase tracking-[0.2em] text-stone-500 mb-1">
                                {m.label}
                              </dt>
                              <dd className="font-funnel text-[13px] font-bold tracking-[-0.015em] text-stone-900 leading-tight break-words">
                                {m.value}
                              </dd>
                            </div>
                          ))}
                        </dl>
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>
            </div>
          </motion.aside>
        </div>
      </div>
    </section>
  );
}

/* ─── Snapshot — all metrics in a strip ─────────────────────── */
function Snapshot({ study }: { study: CaseStudy }) {
  if (!study.metrics || study.metrics.length === 0) return null;

  /* Decide section header based on whether metrics are real outcome
     numbers or just project metadata (e.g. "Web Development"). */
  const hasNumericMetric = study.metrics.some((m) => isShortValue(m.value));
  const headerEyebrow = hasNumericMetric ? "The numbers" : "Project snapshot";
  const headerLead = hasNumericMetric ? "What changed" : "The key facts";
  const headerAccent = hasNumericMetric
    ? "after we shipped."
    : "for this engagement.";

  return (
    <section className="relative bg-[#FAF7F2] border-t border-stone-900/10 overflow-hidden">
      <div className="hero-grain-paper" aria-hidden />

      <div className="container relative z-10 py-16 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="rounded-3xl border border-stone-900/10 bg-stone-900 text-stone-50 overflow-hidden"
        >
          <div className="relative px-7 md:px-10 py-7 md:py-8 border-b border-stone-50/15 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <p className="font-jakarta text-[10.5px] font-semibold uppercase tracking-[0.22em] text-stone-400 mb-2">
                {headerEyebrow}
              </p>
              <h2 className="font-funnel text-[clamp(1.5rem,2.4vw,2rem)] font-bold tracking-[-0.025em] leading-[1.15] text-stone-50">
                {headerLead}{" "}
                <span
                  style={{
                    fontFamily: "var(--font-newsreader), Georgia, serif",
                    fontStyle: "italic",
                    fontWeight: 500,
                    color: "#FF6600",
                  }}
                >
                  {headerAccent}
                </span>
              </h2>
            </div>
            <span className="font-jakarta text-[10.5px] font-semibold uppercase tracking-[0.22em] text-stone-300 flex items-center gap-2">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 hero-pulse" />
              Verified · client-signed
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4">
            {study.metrics.map((m, i) => {
              const big = isShortValue(m.value);
              return (
                <div
                  key={m.label + i}
                  className={`p-7 md:p-9 ${i > 0 ? "md:border-l" : ""} ${
                    i >= 2 ? "border-t md:border-t-0" : ""
                  } border-stone-50/10 min-w-0`}
                >
                  <p
                    className={`font-funnel text-stone-50 font-bold tracking-[-0.03em] break-words ${
                      big
                        ? "text-[clamp(2rem,3.4vw,2.8rem)] leading-[1.0]"
                        : "text-[clamp(1.1rem,1.6vw,1.4rem)] leading-[1.2]"
                    }`}
                  >
                    {m.value}
                  </p>
                  <p className="mt-3 font-jakarta text-[10.5px] font-semibold uppercase tracking-[0.22em] text-stone-300">
                    {m.label}
                  </p>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Challenge / Solution / Results 3-column ──────────────── */
function ChallengeSolutionResults({ study }: { study: CaseStudy }) {
  const groups = [
    {
      label: "The challenge",
      italic: "what we walked into",
      items: study.challenges || [],
      accent: "#FF6600",
    },
    {
      label: "The solution",
      italic: "what we built",
      items: study.solutions || [],
      accent: "#0F0C08",
    },
    {
      label: "The results",
      italic: "what shipped",
      items: study.results || [],
      accent: "#4A5D3A",
    },
  ].filter((g) => g.items.length > 0);

  if (groups.length === 0) return null;

  return (
    <section className="relative bg-[#FAF7F2] border-t border-stone-900/10 overflow-hidden">
      <div className="hero-grain-paper" aria-hidden />

      <div className="container relative z-10 py-20 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="mb-12 md:mb-14"
        >
          <div className="flex items-center gap-3 mb-5">
            <span aria-hidden className="block h-px w-9 bg-[#FF6600]" />
            <span className="font-jakarta text-[11px] font-semibold uppercase tracking-[0.26em] text-stone-600">
              The arc
            </span>
          </div>
          <h2 className="font-funnel text-stone-900 font-bold leading-[1.0] tracking-[-0.03em] text-[clamp(1.85rem,3.4vw,2.8rem)] max-w-[20ch]">
            From brief to{" "}
            <span
              style={{
                fontFamily: "var(--font-newsreader), Georgia, serif",
                fontStyle: "italic",
                fontWeight: 500,
                color: "#1c1c1c",
              }}
            >
              client-signed launch.
            </span>
          </h2>
        </motion.div>

        <div className={`grid grid-cols-1 ${groups.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2"} gap-5 md:gap-6`}>
          {groups.map((g, i) => (
            <motion.article
              key={g.label}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.65, delay: i * 0.08 }}
              className="rounded-3xl border border-stone-900/10 bg-stone-50 p-7 md:p-8 hover:border-stone-900/25 hover:bg-white hover:-translate-y-1 hover:shadow-[0_24px_50px_-30px_rgba(15,12,8,0.2)] transition-all duration-500"
            >
              <div className="flex items-baseline justify-between mb-7">
                <span
                  className="font-funnel leading-none tracking-[-0.04em]"
                  style={{
                    fontFamily: "var(--font-newsreader), Georgia, serif",
                    fontStyle: "italic",
                    fontWeight: 500,
                    fontSize: "clamp(2.4rem, 3vw, 2.8rem)",
                    color: g.accent,
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className="block w-2 h-2 rounded-full"
                  style={{ background: g.accent }}
                />
              </div>

              <h3 className="font-funnel text-[clamp(1.2rem,1.6vw,1.45rem)] leading-[1.15] tracking-[-0.02em] font-bold text-stone-900">
                {g.label}
                <span
                  className="block mt-1 text-[0.72em]"
                  style={{
                    fontFamily: "var(--font-newsreader), Georgia, serif",
                    fontStyle: "italic",
                    fontWeight: 400,
                    color: "#6b6b70",
                  }}
                >
                  — {g.italic}.
                </span>
              </h3>

              <ul className="mt-5 space-y-3">
                {g.items.map((item, j) => (
                  <li
                    key={item + j}
                    className="flex items-baseline gap-3 font-jakarta text-[14px] leading-[1.55] text-stone-700"
                  >
                    <span
                      className="font-mono-ui text-[10px] tabular-nums shrink-0 mt-1"
                      style={{ color: g.accent }}
                    >
                      {String(j + 1).padStart(2, "0")}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Long-read content ────────────────────────────────────── */
function LongRead({ study }: { study: CaseStudy }) {
  return (
    <section className="relative bg-[#FAF7F2] border-t border-stone-900/10 overflow-hidden">
      <div className="hero-grain-paper" aria-hidden />

      <div className="container relative z-10 py-20 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="grid grid-cols-12 gap-x-8 gap-y-10"
        >
          <div className="col-span-12 lg:col-span-4">
            <div className="flex items-center gap-3 mb-5">
              <span aria-hidden className="block h-px w-9 bg-[#FF6600]" />
              <span className="font-jakarta text-[11px] font-semibold uppercase tracking-[0.26em] text-stone-600">
                The long read
              </span>
            </div>
            <h2 className="font-funnel text-stone-900 font-bold leading-[1.0] tracking-[-0.03em] text-[clamp(1.6rem,2.6vw,2.2rem)]">
              The full{" "}
              <span
                style={{
                  fontFamily: "var(--font-newsreader), Georgia, serif",
                  fontStyle: "italic",
                  fontWeight: 500,
                  color: "#FF6600",
                }}
              >
                story.
              </span>
            </h2>
          </div>

          <div className="col-span-12 lg:col-span-8">
            <article
              className="font-jakarta text-[15.5px] md:text-[16.5px] leading-[1.75] text-stone-700 max-w-[64ch] [&>p]:mt-5 [&>p:first-child]:mt-0 [&>h2]:mt-10 [&>h2]:mb-3 [&>h2]:font-funnel [&>h2]:text-stone-900 [&>h2]:font-bold [&>h2]:text-[clamp(1.25rem,1.6vw,1.5rem)] [&>h2]:tracking-[-0.02em] [&>h3]:mt-8 [&>h3]:font-funnel [&>h3]:font-bold [&>h3]:text-stone-900 [&>strong]:text-stone-900 [&>strong]:font-bold [&>em]:font-newsreader [&>em]:italic [&>em]:font-normal [&>blockquote]:my-6 [&>blockquote]:pl-5 [&>blockquote]:border-l-2 [&>blockquote]:border-[#FF6600] [&>blockquote]:italic [&>ul]:mt-5 [&>ul]:list-disc [&>ul]:pl-5 [&>ol]:mt-5 [&>ol]:list-decimal [&>ol]:pl-5"
              dangerouslySetInnerHTML={{ __html: study.content || "" }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Gallery ──────────────────────────────────────────────── */
function Gallery({
  images,
  onOpen,
}: {
  images: string[];
  onOpen: (i: number) => void;
}) {
  return (
    <section className="relative bg-[#FAF7F2] border-t border-stone-900/10 overflow-hidden">
      <div className="hero-grain-paper" aria-hidden />

      <div className="container relative z-10 py-20 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-10"
        >
          <div>
            <div className="flex items-center gap-3 mb-5">
              <span aria-hidden className="block h-px w-9 bg-[#FF6600]" />
              <span className="font-jakarta text-[11px] font-semibold uppercase tracking-[0.26em] text-stone-600">
                The gallery
              </span>
            </div>
            <h2 className="font-funnel text-stone-900 font-bold leading-[1.0] tracking-[-0.03em] text-[clamp(1.85rem,3vw,2.5rem)]">
              The work,{" "}
              <span
                style={{
                  fontFamily: "var(--font-newsreader), Georgia, serif",
                  fontStyle: "italic",
                  fontWeight: 500,
                  color: "#FF6600",
                }}
              >
                in full.
              </span>
            </h2>
          </div>
          <p className="font-jakarta text-[12px] font-semibold uppercase tracking-[0.22em] text-stone-500">
            {images.length} image{images.length === 1 ? "" : "s"} · click to expand
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-5">
          {images.map((img, i) => {
            const span =
              i === 0
                ? "md:col-span-12 aspect-[16/8]"
                : i % 5 === 1 || i % 5 === 2
                  ? "md:col-span-6 aspect-[5/4]"
                  : "md:col-span-4 aspect-[4/3]";
            return (
              <motion.button
                key={img + i}
                type="button"
                onClick={() => onOpen(i)}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: (i % 5) * 0.06 }}
                className={`group relative block w-full rounded-3xl overflow-hidden border border-stone-900/10 bg-stone-100 hover:-translate-y-1 hover:border-stone-900/25 hover:shadow-[0_24px_50px_-30px_rgba(15,12,8,0.22)] transition-all duration-500 cursor-pointer ${span}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getThumbnail(img)}
                  alt=""
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
                <span
                  aria-hidden
                  className="absolute top-4 right-4 inline-grid place-items-center w-11 h-11 rounded-full bg-[#FAF7F2]/95 backdrop-blur-sm text-stone-900 opacity-0 group-hover:opacity-100 group-hover:scale-100 scale-90 transition-all duration-300"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M2 5 V 2 H 5 M 9 2 H 12 V 5 M 12 9 V 12 H 9 M 5 12 H 2 V 9"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span className="absolute top-4 left-4 font-jakarta text-[10px] font-semibold uppercase tracking-[0.22em] text-stone-50 bg-stone-900/70 backdrop-blur-sm px-2.5 py-1 rounded-full">
                  {String(i + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─── Testimonial ──────────────────────────────────────────── */
function Testimonial({ study }: { study: CaseStudy }) {
  const t = study.testimonial!;
  const initials = (t.author || study.client || "CM")
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <section className="relative bg-[#FAF7F2] border-t border-stone-900/10 overflow-hidden">
      <div className="hero-grain-paper" aria-hidden />

      <div className="container relative z-10 py-20 md:py-24">
        <motion.figure
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.75, ease: [0.2, 0.7, 0.2, 1] }}
          className="relative rounded-3xl border border-stone-900/10 bg-stone-50 overflow-hidden p-8 md:p-12"
        >
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 40% 60% at 100% 0%, rgba(255,102,0,0.08), transparent 60%)",
            }}
          />
          <span
            aria-hidden
            className="absolute top-6 right-7 leading-none text-[#FF6600]/15 select-none pointer-events-none"
            style={{
              fontFamily: "var(--font-newsreader), Georgia, serif",
              fontStyle: "italic",
              fontWeight: 500,
              fontSize: "clamp(7rem, 12vw, 11rem)",
            }}
          >
            &ldquo;
          </span>

          <p className="relative font-jakarta text-[10.5px] font-semibold uppercase tracking-[0.22em] text-stone-500 mb-6 flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#FF6600]" />
            Words from the client
          </p>

          <blockquote
            className="relative font-funnel text-stone-900 font-medium leading-[1.25] tracking-[-0.02em] text-[clamp(1.5rem,2.6vw,2.25rem)] max-w-[36ch]"
          >
            <span
              style={{
                fontFamily: "var(--font-newsreader), Georgia, serif",
                fontStyle: "italic",
                fontWeight: 500,
                color: "#FF6600",
              }}
            >
              &ldquo;
            </span>
            {t.text}
            <span
              style={{
                fontFamily: "var(--font-newsreader), Georgia, serif",
                fontStyle: "italic",
                fontWeight: 500,
                color: "#FF6600",
              }}
            >
              &rdquo;
            </span>
          </blockquote>

          <figcaption className="relative mt-8 pt-6 border-t border-stone-900/10 flex items-center gap-4">
            <div className="grid place-items-center w-14 h-14 rounded-full bg-[#FF6600] text-stone-50 ring-2 ring-[#FAF7F2] shrink-0">
              <span className="font-funnel text-[17px] font-bold tracking-tight">
                {initials}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              {t.author && (
                <p className="font-funnel text-[16px] font-bold tracking-[-0.015em] text-stone-900 leading-none">
                  {t.author}
                </p>
              )}
              <p className="font-jakarta text-[12.5px] text-stone-600 mt-1.5">
                {t.role && <span>{t.role}</span>}
                {t.role && study.client && <span className="text-stone-300"> · </span>}
                {study.client && <span>{study.client}</span>}
              </p>
            </div>
            <div className="hidden md:flex gap-0.5">
              {[0, 1, 2, 3, 4].map((s) => (
                <svg
                  key={s}
                  width="13"
                  height="13"
                  viewBox="0 0 14 14"
                  fill="currentColor"
                  className="text-[#FF6600]"
                >
                  <path d="M7 0 L8.7 5.3 L14 5.3 L9.7 8.5 L11.4 13.8 L7 10.6 L2.6 13.8 L4.3 8.5 L0 5.3 L5.3 5.3 Z" />
                </svg>
              ))}
            </div>
          </figcaption>
        </motion.figure>
      </div>
    </section>
  );
}
