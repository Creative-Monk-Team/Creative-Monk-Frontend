"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CTA } from "@/components/sections/cta";
import { getCaseStudies } from "@/lib/api";
import type { CaseStudy } from "@/lib/types";
import { useInfiniteList } from "@/lib/useInfiniteList";
import { InfiniteScrollSentinel } from "@/components/ui/infinite-scroll-sentinel";
import { getThumbnail } from "@/lib/image-utils";

/* Treat a metric as a "headline outcome" only when it actually looks
   like a numeric/short value. Long text fallback to a generic label. */
function isShortValue(v: string | undefined | null): boolean {
  if (!v) return false;
  const trimmed = v.trim();
  if (trimmed.length <= 8) return true;
  return /^[\d.,+%\-x×₹$KkMm/\s]+$/.test(trimmed);
}

function pickHeadlineMetric(metrics?: { label: string; value: string }[]) {
  if (!metrics) return undefined;
  return metrics.find((m) => isShortValue(m.value));
}

const HERO_STATS = [
  { value: "142", label: "Brands shipped" },
  { value: "+312%", label: "Top lead lift" },
  { value: "4.9", label: "Client rating", suffix: "★" },
  { value: "3.2", label: "Avg tenure", suffix: "yrs" },
];

export default function CaseStudiesPage() {
  const {
    items: studies,
    loading,
    loadingMore,
    hasMore,
    total,
    sentinelRef,
  } = useInfiniteList<CaseStudy>({
    pageSize: 9,
    fetcher: async ({ page, limit }) => {
      const res = await getCaseStudies({ page, limit });
      if ("data" in res) return { items: res.data, pagination: res.pagination };
      return { items: res, pagination: null };
    },
  });

  const featured = useMemo(
    () => (studies.length ? studies.find((s) => s.isFeatured) || studies[0] : undefined),
    [studies]
  );
  const others = useMemo(
    () => (featured ? studies.filter((s) => s._id !== featured._id) : studies),
    [studies, featured]
  );

  return (
    <main className="relative">
      <CaseStudiesHero count={total || studies.length} />

      {/* Featured + grid */}
      <section className="relative bg-[#FAF7F2] border-t border-stone-900/10 overflow-hidden">
        <div className="hero-grain-paper" aria-hidden />

        <div className="container relative z-10 py-16 md:py-20">
          {loading ? (
            <SkeletonGrid />
          ) : studies.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              {/* Featured spotlight */}
              {featured && <FeaturedSpotlight study={featured} />}

              {/* Header row */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6 }}
                className={`flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-10 ${
                  featured ? "mt-16 md:mt-20" : ""
                }`}
              >
                <div className="max-w-2xl">
                  <div className="flex items-center gap-3 mb-5">
                    <span aria-hidden className="block h-px w-9 bg-[#FF6600]" />
                    <span className="font-jakarta text-[11px] font-semibold uppercase tracking-[0.26em] text-stone-600">
                      More case studies
                    </span>
                  </div>
                  <h2 className="font-funnel text-stone-900 font-bold leading-[1.0] tracking-[-0.03em] text-[clamp(1.85rem,3.4vw,2.8rem)] max-w-[22ch]">
                    Every project,{" "}
                    <span
                      style={{
                        fontFamily: "var(--font-newsreader), Georgia, serif",
                        fontStyle: "italic",
                        fontWeight: 500,
                        color: "#1c1c1c",
                      }}
                    >
                      with the receipts.
                    </span>
                  </h2>
                </div>
                {total > 0 && (
                  <p className="font-jakarta text-[12.5px] text-stone-600">
                    <span className="font-funnel text-[15px] font-bold text-stone-900">
                      {studies.length}
                    </span>{" "}
                    of{" "}
                    <span className="font-funnel text-[15px] font-bold text-stone-900">
                      {total}
                    </span>{" "}
                    case studies
                  </p>
                )}
              </motion.div>

              {/* Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                {others.map((s, i) => (
                  <CaseStudyCard key={s._id} study={s} index={i} />
                ))}
              </div>

              <InfiniteScrollSentinel
                shown={others.length}
                total={total ? (featured ? total - 1 : total) : 0}
                loading={loadingMore}
                hasMore={hasMore}
                sentinelRef={sentinelRef}
                unit="case studies"
              />
            </>
          )}
        </div>
      </section>

      <CTA />
    </main>
  );
}

/* ─── Hero ─────────────────────────────────────────────────── */
function CaseStudiesHero({ count }: { count: number }) {
  return (
    <section className="relative bg-[#FAF7F2] overflow-hidden">
      <div className="hero-grain-paper" aria-hidden />
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 50% 50% at 100% 0%, rgba(255,102,0,0.10), transparent 60%)",
        }}
      />

      <div className="container relative z-10 pt-12 md:pt-20 pb-16 md:pb-20">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="flex items-center justify-between gap-4 mb-10 md:mb-14 pb-5 border-b border-stone-900/10"
        >
          <div className="flex items-center gap-3">
            <span aria-hidden className="block h-px w-9 bg-[#FF6600]" />
            <span className="font-jakarta text-[11px] font-semibold uppercase tracking-[0.26em] text-stone-600">
              The receipts · Case studies
            </span>
          </div>
          <span className="hidden md:flex items-center gap-2 font-jakarta text-[10.5px] font-semibold uppercase tracking-[0.22em] text-stone-500">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 hero-pulse" />
            All client-signed
          </span>
        </motion.div>

        <div className="grid grid-cols-12 gap-x-8 gap-y-10 items-end">
          <div className="col-span-12 md:col-span-8">
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, ease: [0.2, 0.7, 0.2, 1] }}
              className="font-funnel text-stone-900 font-bold leading-[0.92] tracking-[-0.04em] text-[clamp(2.5rem,6.6vw,5.75rem)] max-w-[14ch]"
            >
              Real work.{" "}
              <span
                style={{
                  fontFamily: "var(--font-newsreader), Georgia, serif",
                  fontStyle: "italic",
                  fontWeight: 500,
                  color: "#FF6600",
                }}
              >
                Real numbers.
              </span>{" "}
              Named clients.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-8 max-w-[60ch] font-jakarta text-[16.5px] md:text-[18px] leading-[1.6] text-stone-700"
            >
              The longer-form story behind {count > 0 ? count : "every"} project.
              What the brief asked for, what we actually shipped, and what
              changed in the numbers afterwards — signed off by the client
              before publishing.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="col-span-12 md:col-span-4"
          >
            <div className="grid grid-cols-2 gap-3 max-w-md md:ml-auto">
              {HERO_STATS.map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border border-stone-900/10 bg-stone-50 p-4 hover:bg-white hover:border-[#FF6600]/40 transition-all duration-300 cursor-default"
                >
                  <p className="font-funnel font-bold tracking-[-0.025em] text-stone-900 leading-none text-[clamp(1.45rem,2.1vw,1.75rem)]">
                    {s.value}
                    {s.suffix && (
                      <span
                        className={
                          s.suffix === "★"
                            ? "ml-1 text-[#FF6600] align-baseline"
                            : "ml-1 font-jakarta text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500 align-middle normal-case"
                        }
                      >
                        {s.suffix}
                      </span>
                    )}
                  </p>
                  <p className="mt-2.5 font-jakarta text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-500">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ─── Featured spotlight ───────────────────────────────────── */
function FeaturedSpotlight({ study }: { study: CaseStudy }) {
  const cover = study.portfolioImage || study.image || study.gallery?.[0];
  const topMetric = pickHeadlineMetric(study.metrics);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease: [0.2, 0.7, 0.2, 1] }}
    >
      <Link
        href={`/case-studies/${study.id}`}
        className="group relative grid grid-cols-1 lg:grid-cols-12 gap-0 rounded-3xl border border-stone-900/10 bg-stone-50 overflow-hidden hover:border-stone-900/25 hover:shadow-[0_30px_60px_-30px_rgba(15,12,8,0.25)] transition-all duration-500 cursor-pointer"
      >
        {/* Image side */}
        <div className="relative lg:col-span-7 aspect-[16/10] lg:aspect-auto overflow-hidden bg-stone-100">
          {cover ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={getThumbnail(cover)}
              alt={study.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            />
          ) : (
            <div
              className="absolute inset-0 grid place-items-center"
              style={{
                background: "linear-gradient(135deg, #FF6600 0%, #1A1410 100%)",
              }}
            >
              <span className="font-funnel text-stone-50 font-bold text-[clamp(2rem,4vw,3.5rem)] tracking-tight">
                {study.title}
              </span>
            </div>
          )}

          {/* Top featured tag */}
          <span className="absolute top-5 left-5 inline-flex items-center gap-2 rounded-full bg-stone-900 text-stone-50 px-3 py-1.5 font-jakarta text-[10.5px] font-semibold uppercase tracking-[0.22em]">
            <span className="block w-1.5 h-1.5 rounded-full bg-[#FF6600] hero-pulse" />
            Featured case study
          </span>

          {/* Corner arrow */}
          <span
            aria-hidden
            className="absolute top-5 right-5 inline-grid place-items-center w-12 h-12 rounded-full bg-[#FAF7F2]/95 backdrop-blur-sm text-stone-900 transition-all duration-300 group-hover:bg-[#FF6600] group-hover:rotate-[-25deg]"
          >
            <svg width="15" height="15" viewBox="0 0 14 14" fill="none">
              <path
                d="M2 12 L12 2 M5 2 L12 2 L12 9"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>

        {/* Content side */}
        <div className="lg:col-span-5 p-7 md:p-10 flex flex-col gap-5">
          <p className="font-jakarta text-[10.5px] font-semibold uppercase tracking-[0.24em] text-[#FF6600] flex items-center gap-2">
            <span>{study.category}</span>
            {study.client && (
              <>
                <span className="text-stone-300">·</span>
                <span className="text-stone-700">{study.client}</span>
              </>
            )}
          </p>

          <h3 className="font-funnel text-stone-900 font-bold leading-[1.05] tracking-[-0.03em] text-[clamp(1.75rem,3vw,2.5rem)] max-w-[20ch] group-hover:text-stone-900">
            {study.title}
          </h3>

          <p className="font-jakarta text-[15px] leading-[1.6] text-stone-600 line-clamp-3 max-w-[48ch]">
            {study.description}
          </p>

          {topMetric && (
            <div className="mt-2 pt-5 border-t border-stone-900/10">
              <p className="font-jakarta text-[10.5px] font-semibold uppercase tracking-[0.22em] text-stone-500 mb-2">
                Headline outcome
              </p>
              <p
                className="font-funnel font-bold tracking-[-0.03em] leading-none text-stone-900 text-[clamp(2rem,3vw,2.6rem)]"
              >
                <span style={{ color: "#FF6600" }}>{topMetric.value}</span>
                <span className="ml-2 font-jakarta text-[12px] font-semibold uppercase tracking-[0.18em] text-stone-500 align-middle normal-case">
                  {topMetric.label}
                </span>
              </p>
            </div>
          )}

          {/* CTA row */}
          <div className="mt-auto pt-4 flex items-center justify-between gap-4">
            <span className="font-jakarta text-[12px] font-semibold uppercase tracking-[0.22em] text-stone-900 inline-flex items-center gap-2 group-hover:text-[#FF6600] transition-colors">
              Read the full story
              <svg
                width="18"
                height="9"
                viewBox="0 0 22 10"
                fill="none"
                className="group-hover:translate-x-1 transition-transform"
              >
                <path
                  d="M1 5 H 20 M 16 1 L 20 5 L 16 9"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            {study.duration && (
              <span className="font-jakarta text-[10.5px] font-semibold uppercase tracking-[0.22em] text-stone-500">
                {study.duration}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/* ─── Grid card ────────────────────────────────────────────── */
function CaseStudyCard({ study, index }: { study: CaseStudy; index: number }) {
  const cover = study.portfolioImage || study.image || study.gallery?.[0];
  const topMetric = pickHeadlineMetric(study.metrics);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: (index % 3) * 0.08 }}
    >
      <Link
        href={`/case-studies/${study.id}`}
        className="group flex h-full flex-col rounded-3xl border border-stone-900/10 bg-stone-50 overflow-hidden hover:-translate-y-1.5 hover:border-stone-900/25 hover:shadow-[0_24px_50px_-30px_rgba(15,12,8,0.22)] transition-all duration-500 cursor-pointer"
      >
        <div className="relative aspect-[5/3] overflow-hidden bg-stone-100">
          {cover ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={getThumbnail(cover)}
              alt={study.title}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.05]"
            />
          ) : (
            <div
              className="absolute inset-0 grid place-items-center"
              style={{
                background: "linear-gradient(135deg, #FF6600 0%, #1A1410 100%)",
              }}
            >
              <span className="font-funnel text-stone-50 font-bold text-[clamp(1.5rem,2.5vw,2rem)] tracking-tight">
                CM
              </span>
            </div>
          )}

          <span className="absolute top-4 left-4 inline-flex items-center gap-2 rounded-full bg-[#FAF7F2]/95 backdrop-blur-sm border border-stone-900/10 px-3 py-1.5 font-jakarta text-[10px] font-semibold uppercase tracking-[0.22em] text-stone-900">
            <span className="block w-1.5 h-1.5 rounded-full bg-[#FF6600]" />
            {study.category}
          </span>

          <span
            aria-hidden
            className="absolute top-4 right-4 inline-grid place-items-center w-10 h-10 rounded-full bg-[#FAF7F2]/95 backdrop-blur-sm text-stone-900 transition-all duration-300 group-hover:bg-[#FF6600] group-hover:rotate-[-25deg]"
          >
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
              <path
                d="M2 12 L12 2 M5 2 L12 2 L12 9"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>

        <div className="p-6 md:p-7 flex flex-col flex-1">
          {study.client && (
            <p className="font-jakarta text-[10.5px] font-semibold uppercase tracking-[0.22em] text-stone-500 mb-3">
              {study.client}
            </p>
          )}
          <h3 className="font-funnel text-[clamp(1.15rem,1.6vw,1.4rem)] leading-[1.2] tracking-[-0.02em] font-bold text-stone-900 line-clamp-2">
            {study.title}
          </h3>
          <p className="mt-3 font-jakarta text-[13.5px] leading-[1.55] text-stone-600 line-clamp-3 flex-1">
            {study.description}
          </p>

          <div className="mt-5 pt-4 border-t border-stone-900/10 flex items-center justify-between gap-3">
            {topMetric ? (
              <span className="flex items-baseline gap-1.5">
                <span
                  className="font-funnel text-[#FF6600] font-bold tracking-tight text-[16px]"
                >
                  {topMetric.value}
                </span>
                <span className="font-jakarta text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-500 truncate">
                  {topMetric.label}
                </span>
              </span>
            ) : (
              <span className="font-jakarta text-[10.5px] font-semibold uppercase tracking-[0.22em] text-stone-500">
                Client-signed
              </span>
            )}
            <span className="font-jakarta text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-900 inline-flex items-center gap-1.5 group-hover:text-[#FF6600] transition-colors">
              Read
              <svg
                width="14"
                height="7"
                viewBox="0 0 22 10"
                fill="none"
                className="group-hover:translate-x-1 transition-transform"
              >
                <path
                  d="M1 5 H 20 M 16 1 L 20 5 L 16 9"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="h-[420px] rounded-3xl bg-stone-200/60 animate-pulse"
        />
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-3xl border border-stone-900/10 bg-stone-50 p-12 md:p-16 text-center">
      <p className="font-jakarta text-[10.5px] font-semibold uppercase tracking-[0.22em] text-stone-500 mb-3">
        Nothing here yet
      </p>
      <h2 className="font-funnel text-[clamp(1.4rem,2vw,1.8rem)] font-bold tracking-[-0.02em] text-stone-900">
        Case studies{" "}
        <span
          style={{
            fontFamily: "var(--font-newsreader), Georgia, serif",
            fontStyle: "italic",
            fontWeight: 500,
            color: "#FF6600",
          }}
        >
          coming soon.
        </span>
      </h2>
      <p className="mt-4 font-jakarta text-[14.5px] leading-[1.55] text-stone-600 max-w-[48ch] mx-auto">
        We're writing them up. In the meantime, the portfolio has the visual
        story for every project.
      </p>
      <Link
        href="/portfolio"
        className="inline-flex items-center gap-3 mt-7 rounded-full bg-stone-900 text-stone-50 pl-6 pr-2 py-2 cursor-pointer transition-all duration-300 hover:shadow-[0_18px_40px_-18px_rgba(15,12,8,0.5)]"
      >
        <span className="font-funnel text-[14.5px] font-semibold tracking-tight">
          See the portfolio
        </span>
        <span className="inline-grid place-items-center w-9 h-9 rounded-full bg-[#FF6600] text-stone-900">
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
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
    </div>
  );
}
