"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { getPortfolioItems } from "@/lib/api";
import type { PortfolioItem } from "@/lib/types";
import { PortfolioLightbox } from "@/components/site/portfolio-lightbox";

/* Bento layout pattern — large tile + smaller supporters that loops.
   col-span on md+ is what creates the asymmetric rhythm. */
const TILE_SPAN: string[] = [
  "md:col-span-7 md:row-span-2 aspect-[16/11] md:aspect-auto",
  "md:col-span-5 aspect-[5/4]",
  "md:col-span-5 aspect-[5/4]",
  "md:col-span-4 aspect-[4/3]",
  "md:col-span-4 aspect-[4/3]",
  "md:col-span-4 aspect-[4/3]",
];

export function Portfolio() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [active, setActive] = useState("All");
  const [loading, setLoading] = useState(true);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const tabsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    getPortfolioItems()
      .then((res) => {
        const data = "data" in res ? res.data : res;
        setItems(data as PortfolioItem[]);
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(items.map((p) => p.category).filter(Boolean)))],
    [items]
  );

  const filtered = useMemo(
    () =>
      active === "All"
        ? items
        : items.filter((p) => p.category === active),
    [items, active]
  );

  const featured = filtered.slice(0, 9);

  if (!loading && items.length === 0) return null;

  return (
    <section
      id="work"
      className="relative bg-[#FAF7F2] border-t border-stone-900/10 overflow-hidden"
      aria-label="Selected work"
    >
      <div className="hero-grain-paper" aria-hidden />

      <div className="container relative z-10 py-20 md:py-28">
        {/* Header */}
        <div className="grid grid-cols-12 gap-x-8 gap-y-8 items-end mb-12 md:mb-16">
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
                Selected work
              </span>
            </div>
            <h2 className="font-funnel text-stone-900 font-bold leading-[0.98] tracking-[-0.035em] text-[clamp(2.25rem,5vw,4.5rem)] max-w-[20ch]">
              Work that earned its{" "}
              <span
                style={{
                  fontFamily: "var(--font-newsreader), Georgia, serif",
                  fontStyle: "italic",
                  fontWeight: 500,
                  color: "#1c1c1c",
                }}
              >
                place on the page.
              </span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="col-span-12 md:col-span-4 flex md:justify-end"
          >
            <Link
              href="/portfolio"
              className="group inline-flex items-center gap-2 font-jakarta text-[12px] font-semibold uppercase tracking-[0.22em] text-stone-900 cursor-pointer"
            >
              <span className="relative">
                See all projects
                <span className="absolute left-0 -bottom-1 h-px w-full bg-stone-900 origin-left scale-x-100 group-hover:scale-x-0 transition-transform duration-400" />
                <span className="absolute left-0 -bottom-1 h-px w-full bg-[#FF6600] origin-right scale-x-0 group-hover:scale-x-100 transition-transform duration-400 delay-100" />
              </span>
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
            </Link>
          </motion.div>
        </div>

        {/* Category filter — refined pill tabs */}
        {categories.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
            className="mb-10 md:mb-12"
          >
            <div
              ref={tabsRef}
              className="flex items-center gap-2 md:gap-2.5 overflow-x-auto no-scrollbar pb-1"
            >
              {categories.map((cat) => {
                const isActive = active === cat;
                const count =
                  cat === "All"
                    ? items.length
                    : items.filter((p) => p.category === cat).length;
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
                    <span
                      className={`font-mono-ui text-[10px] tabular-nums ${
                        isActive ? "text-[#FF6600]" : "text-stone-400"
                      }`}
                    >
                      {String(count).padStart(2, "0")}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Bento masonry grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-5">
          <AnimatePresence mode="popLayout">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={`skel-${i}`}
                    className={`rounded-3xl bg-stone-200/60 animate-pulse ${
                      TILE_SPAN[i % TILE_SPAN.length]
                    }`}
                    aria-hidden
                  />
                ))
              : featured.map((p, i) => (
                  <motion.div
                    key={p._id}
                    layout
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: 0.6,
                      delay: (i % 6) * 0.05,
                      ease: [0.2, 0.7, 0.2, 1],
                    }}
                    className={TILE_SPAN[i % TILE_SPAN.length]}
                  >
                    <WorkTile
                      item={p}
                      onOpen={() =>
                        setOpenIndex(filtered.findIndex((x) => x._id === p._id))
                      }
                    />
                  </motion.div>
                ))}
          </AnimatePresence>
        </div>

        {/* Footer band */}
        {!loading && filtered.length > 9 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
            className="mt-10 md:mt-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 rounded-2xl border border-stone-900/10 bg-stone-50 p-6 md:p-7"
          >
            <p className="font-jakarta text-[14px] text-stone-700">
              <span className="font-funnel text-stone-900 font-bold text-[20px] tracking-tight">
                {filtered.length - 9}+ more projects
              </span>{" "}
              <span className="text-stone-500">
                across {categories.length - 1} categories — including unreleased work under NDA.
              </span>
            </p>
            <Link
              href="/portfolio"
              className="group relative inline-flex items-center gap-3 rounded-full bg-stone-900 text-stone-50 pl-5 pr-1.5 py-1.5 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-[0_18px_36px_-18px_rgba(15,12,8,0.5)] shrink-0"
            >
              <span className="relative font-funnel text-[13.5px] font-semibold tracking-tight">
                Browse the full portfolio
              </span>
              <span className="relative inline-grid place-items-center w-8 h-8 rounded-full bg-[#FF6600] text-stone-900 group-hover:bg-stone-50 group-hover:rotate-[-30deg] transition-all duration-300">
                <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
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
          </motion.div>
        )}
      </div>

      {/* Lightbox */}
      <PortfolioLightbox
        projects={filtered}
        index={openIndex}
        onClose={() => setOpenIndex(null)}
        onChange={setOpenIndex}
      />
    </section>
  );
}

/* ─── Bento work tile with hover overlay ─── */
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
      {/* category chip */}
      <span className="absolute top-4 left-4 z-20 inline-flex items-center gap-2 rounded-full bg-[#FAF7F2]/95 backdrop-blur-sm border border-stone-900/10 px-3 py-1.5 font-jakarta text-[10px] font-semibold uppercase tracking-[0.22em] text-stone-900">
        <span className="block w-1.5 h-1.5 rounded-full bg-[#FF6600]" />
        {item.category}
      </span>

      {/* corner arrow */}
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

      {/* image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={cover}
        alt={item.title}
        loading="lazy"
        className={`absolute inset-0 w-full h-full transition-transform duration-[1.2s] ease-out group-hover:scale-[1.05] ${
          isContain
            ? "object-contain p-10 bg-stone-100"
            : "object-cover object-top"
        }`}
      />

      {/* gradient overlay */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-stone-900/90 via-stone-900/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      />

      {/* hover-revealed body */}
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
