"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { CTA } from "@/components/sections/cta";
import { PortfolioLightbox } from "@/components/site/portfolio-lightbox";
import { getPortfolioItems } from "@/lib/api";
import type { PortfolioItem } from "@/lib/types";
import { useInfiniteList } from "@/lib/useInfiniteList";
import { InfiniteScrollSentinel } from "@/components/ui/infinite-scroll-sentinel";
import { getThumbnail } from "@/lib/image-utils";

const HERO_STATS = [
  { value: "142", label: "Projects shipped" },
  { value: "8", label: "Years live" },
  { value: "4.9", label: "Avg client rating", suffix: "★" },
  { value: "3.2", label: "Avg tenure", suffix: "yrs" },
];

const CATEGORIES = [
  "All",
  "Web Design",
  "Web Development",
  "Brand Identity",
  "Graphic Designing",
  "Digital Marketing",
  "SEO",
  "Packaging",
];

/* Bento layout pattern that repeats every 6 tiles. */
const TILE_SPAN: string[] = [
  "md:col-span-7 md:row-span-2 aspect-[16/11] md:aspect-auto",
  "md:col-span-5 aspect-[5/4]",
  "md:col-span-5 aspect-[5/4]",
  "md:col-span-4 aspect-[4/3]",
  "md:col-span-4 aspect-[4/3]",
  "md:col-span-4 aspect-[4/3]",
];

export default function PortfolioPage() {
  const [active, setActive] = useState("All");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const {
    items: projects,
    loading,
    loadingMore,
    hasMore,
    total,
    sentinelRef,
  } = useInfiniteList<PortfolioItem>({
    pageSize: 12,
    deps: [active],
    fetcher: async ({ page, limit }) => {
      const params: Record<string, string | number> = { page, limit };
      if (active !== "All") params.category = active;
      const res = await getPortfolioItems(params);
      if ("data" in res) return { items: res.data, pagination: res.pagination };
      return { items: res, pagination: null };
    },
  });

  const categoryCounts = useMemo(() => {
    const map: Record<string, number> = {};
    projects.forEach((p) => {
      if (p.category) map[p.category] = (map[p.category] || 0) + 1;
    });
    return map;
  }, [projects]);

  return (
    <main className="relative">
      <PortfolioHero />

      {/* Filter + grid */}
      <section className="relative bg-[#FAF7F2] border-t border-stone-900/10 overflow-hidden">
        <div className="hero-grain-paper" aria-hidden />

        <div className="container relative z-10 py-14 md:py-20">
          {/* Filter pills */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
            className="mb-10 md:mb-12 flex items-center justify-between gap-6"
          >
            <div className="flex-1 min-w-0 flex items-center gap-2 md:gap-2.5 overflow-x-auto no-scrollbar pb-1">
              {CATEGORIES.map((cat) => {
                const isActive = active === cat;
                const count =
                  cat === "All"
                    ? (total || projects.length)
                    : categoryCounts[cat];
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActive(cat)}
                    className={`group shrink-0 inline-flex items-center gap-2.5 rounded-full px-4 py-2 font-jakarta text-[12.5px] font-semibold transition-all duration-300 cursor-pointer ${
                      isActive
                        ? "bg-stone-900 text-stone-50 border border-stone-900"
                        : "bg-stone-50 text-stone-700 border border-stone-900/10 hover:border-stone-900/30 hover:text-stone-900"
                    }`}
                  >
                    <span>{cat}</span>
                    {count !== undefined && (
                      <span
                        className={`font-mono-ui text-[10px] tabular-nums ${
                          isActive ? "text-[#FF6600]" : "text-stone-400"
                        }`}
                      >
                        {String(count).padStart(2, "0")}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            <span className="hidden md:inline-flex items-center gap-2 font-jakarta text-[10.5px] font-semibold uppercase tracking-[0.22em] text-stone-500 shrink-0">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 hero-pulse" />
              Updated weekly
            </span>
          </motion.div>

          {/* Bento masonry */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className={`rounded-3xl bg-stone-200/60 animate-pulse ${
                    TILE_SPAN[i % TILE_SPAN.length]
                  }`}
                />
              ))}
            </div>
          ) : projects.length === 0 ? (
            <div className="rounded-3xl border border-stone-900/10 bg-stone-50 p-12 md:p-16 text-center">
              <p className="font-jakarta text-[10.5px] font-semibold uppercase tracking-[0.22em] text-stone-500 mb-3">
                Nothing here yet
              </p>
              <h2 className="font-funnel text-[clamp(1.4rem,2vw,1.8rem)] font-bold tracking-[-0.02em] text-stone-900">
                No projects under{" "}
                <span
                  style={{
                    fontFamily: "var(--font-newsreader), Georgia, serif",
                    fontStyle: "italic",
                    fontWeight: 500,
                    color: "#FF6600",
                  }}
                >
                  {active}
                </span>{" "}
                yet.
              </h2>
              <p className="mt-4 font-jakarta text-[14.5px] leading-[1.55] text-stone-600 max-w-[48ch] mx-auto">
                Try another category, or get in touch — we might already have
                relevant work under NDA.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-5">
              <AnimatePresence mode="popLayout">
                {projects.map((p, i) => (
                  <motion.div
                    key={p._id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{
                      duration: 0.55,
                      delay: (i % 6) * 0.04,
                      ease: [0.2, 0.7, 0.2, 1],
                    }}
                    className={TILE_SPAN[i % TILE_SPAN.length]}
                  >
                    <WorkTile
                      item={p}
                      onOpen={() => setOpenIndex(i)}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          <InfiniteScrollSentinel
            shown={projects.length}
            total={total}
            loading={loadingMore}
            hasMore={hasMore && !loading}
            sentinelRef={sentinelRef}
            unit="projects"
          />

          <PortfolioLightbox
            projects={projects}
            index={openIndex}
            onClose={() => setOpenIndex(null)}
            onChange={setOpenIndex}
          />
        </div>
      </section>

      <CTA />
    </main>
  );
}

/* ─── Hero ─────────────────────────────────────────────────── */
function PortfolioHero() {
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
              The work · Selected projects
            </span>
          </div>
          <span className="hidden md:flex items-center gap-2 font-jakarta text-[10.5px] font-semibold uppercase tracking-[0.22em] text-stone-500">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 hero-pulse" />
            Currently shipping for 14 brands
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
              Work that earned its{" "}
              <span
                style={{
                  fontFamily: "var(--font-newsreader), Georgia, serif",
                  fontStyle: "italic",
                  fontWeight: 500,
                  color: "#FF6600",
                }}
              >
                place on the page.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-8 max-w-[58ch] font-jakarta text-[16.5px] md:text-[18px] leading-[1.6] text-stone-700"
            >
              Eight years of identity systems, websites, growth campaigns and
              motion work — picked from 142+ shipped projects. The newest sits
              at the top.
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

/* ─── Bento tile ─────────────────────────────────────────────── */
function WorkTile({
  item,
  onOpen,
}: {
  item: PortfolioItem;
  onOpen: () => void;
}) {
  const cover = item.image || item.gallery?.[0] || "/images/hero-abstract.png";
  const cat = (item.category || "").toLowerCase();
  const isContain = cat.includes("brand") || cat.includes("graphic");

  return (
    <button
      type="button"
      onClick={onOpen}
      className="group relative block w-full h-full rounded-3xl overflow-hidden bg-stone-100 border border-stone-900/10 transition-all duration-500 hover:-translate-y-1.5 hover:border-stone-900/25 hover:shadow-[0_30px_60px_-30px_rgba(15,12,8,0.3)] cursor-pointer text-left"
      aria-label={`Open ${item.title}`}
    >
      <span className="absolute top-4 left-4 z-20 inline-flex items-center gap-2 rounded-full bg-[#FAF7F2]/95 backdrop-blur-sm border border-stone-900/10 px-3 py-1.5 font-jakarta text-[10px] font-semibold uppercase tracking-[0.22em] text-stone-900">
        <span className="block w-1.5 h-1.5 rounded-full bg-[#FF6600]" />
        {item.category}
      </span>

      <span
        aria-hidden
        className="absolute top-4 right-4 z-20 inline-grid place-items-center w-10 h-10 rounded-full bg-[#FAF7F2]/95 backdrop-blur-sm text-stone-900 transition-all duration-300 group-hover:bg-[#FF6600] group-hover:rotate-[-25deg]"
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

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={getThumbnail(cover)}
        alt={item.title}
        loading="lazy"
        className={`absolute inset-0 w-full h-full transition-transform duration-[1.2s] ease-out group-hover:scale-[1.05] ${
          isContain
            ? "object-contain p-10 bg-stone-100"
            : "object-cover object-top"
        }`}
      />

      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-stone-900/90 via-stone-900/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      />

      <div className="absolute left-0 right-0 bottom-0 p-5 md:p-6 text-stone-50 translate-y-3 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
        {item.client && (
          <p className="font-jakarta text-[10.5px] font-semibold uppercase tracking-[0.22em] text-stone-50/75 mb-2">
            {item.client}
          </p>
        )}
        <h3 className="font-funnel text-[clamp(1.1rem,1.5vw,1.4rem)] leading-[1.15] tracking-[-0.025em] font-bold text-stone-50 max-w-[26ch]">
          {item.title}
        </h3>
        {item.points && item.points.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {item.points.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center font-jakarta text-[9.5px] font-semibold uppercase tracking-[0.18em] text-stone-50/85 border border-stone-50/30 rounded-full px-2 py-1"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </button>
  );
}

