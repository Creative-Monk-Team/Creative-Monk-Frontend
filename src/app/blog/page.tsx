"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CTA } from "@/components/sections/cta";
import { getBlogs } from "@/lib/api";
import type { BlogPost } from "@/lib/types";
import { useInfiniteList } from "@/lib/useInfiniteList";
import { InfiniteScrollSentinel } from "@/components/ui/infinite-scroll-sentinel";
import { getThumbnail } from "@/lib/image-utils";

const CATEGORIES = [
  "All",
  "SEO",
  "Branding",
  "Web Development",
  "Web Design",
  "Social Media",
  "PPC",
  "Content Marketing",
  "Digital Marketing",
  "Marketing",
];

function fmtDate(date?: string) {
  if (!date) return "";
  const d = new Date(date);
  return Number.isNaN(d.getTime())
    ? ""
    : d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function sortPosts(posts: BlogPost[]) {
  return [...posts].sort((a, b) => {
    const ad = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
    const bd = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
    return bd - ad;
  });
}

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const {
    items: posts,
    loading,
    loadingMore,
    hasMore,
    total: totalArticles,
    sentinelRef,
  } = useInfiniteList<BlogPost>({
    pageSize: 9,
    deps: [activeCategory],
    fetcher: async ({ page, limit }) => {
      const params: Record<string, string | number> = { page, limit };
      if (activeCategory !== "All") params.category = activeCategory;
      const res = await getBlogs(params);
      if ("data" in res) return { items: res.data, pagination: res.pagination };
      return { items: sortPosts(res), pagination: null };
    },
  });

  /* Only treat a post as "featured" if it's actually on the first page. */
  const featured = useMemo(
    () => (posts.length ? posts.find((p) => p.featured) || posts[0] : undefined),
    [posts]
  );

  const gridPosts = useMemo(
    () =>
      activeCategory === "All" && featured
        ? posts.filter((p) => p.slug !== featured.slug)
        : posts,
    [posts, featured, activeCategory]
  );

  return (
    <main className="relative">
      <BlogHero count={totalArticles} />

      <section className="relative bg-[#FAF7F2] border-t border-stone-900/10 overflow-hidden">
        <div className="hero-grain-paper" aria-hidden />

        <div className="container relative z-10 py-14 md:py-20">
          {/* Category filter */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
            className="mb-10 md:mb-12 flex items-center justify-between gap-6"
          >
            <div className="flex-1 min-w-0 flex items-center gap-2 md:gap-2.5 overflow-x-auto no-scrollbar pb-1">
              {CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    className={`shrink-0 inline-flex items-center gap-2 rounded-full px-4 py-2 font-jakarta text-[12.5px] font-semibold transition-all duration-300 cursor-pointer ${
                      isActive
                        ? "bg-stone-900 text-stone-50 border border-stone-900"
                        : "bg-stone-50 text-stone-700 border border-stone-900/10 hover:border-stone-900/30 hover:text-stone-900"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
            <span className="hidden md:inline-flex items-center gap-2 font-jakarta text-[10.5px] font-semibold uppercase tracking-[0.22em] text-stone-500 shrink-0">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 hero-pulse" />
              Posted weekly
            </span>
          </motion.div>

          {loading ? (
            <SkeletonBlock />
          ) : posts.length === 0 ? (
            <EmptyState activeCategory={activeCategory} />
          ) : (
            <>
              {/* Featured spotlight — only when on "All" with a featured pick */}
              {activeCategory === "All" && featured && (
                <FeaturedSpotlight post={featured} />
              )}

              {/* Grid section header */}
              {gridPosts.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.6 }}
                  className={`flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-10 ${
                    activeCategory === "All" && featured ? "mt-14 md:mt-16" : ""
                  }`}
                >
                  <div className="max-w-2xl">
                    <div className="flex items-center gap-3 mb-5">
                      <span aria-hidden className="block h-px w-9 bg-[#FF6600]" />
                      <span className="font-jakarta text-[11px] font-semibold uppercase tracking-[0.26em] text-stone-600">
                        {activeCategory === "All"
                          ? "All articles"
                          : activeCategory}
                      </span>
                    </div>
                    <h2 className="font-funnel text-stone-900 font-bold leading-[1.0] tracking-[-0.03em] text-[clamp(1.85rem,3.4vw,2.8rem)] max-w-[24ch]">
                      Sharper thinking,{" "}
                      <span
                        style={{
                          fontFamily: "var(--font-newsreader), Georgia, serif",
                          fontStyle: "italic",
                          fontWeight: 500,
                          color: "#1c1c1c",
                        }}
                      >
                        written by the team.
                      </span>
                    </h2>
                  </div>
                  <p className="font-jakarta text-[12.5px] text-stone-600">
                    <span className="font-funnel text-[15px] font-bold text-stone-900">
                      {gridPosts.length}
                    </span>{" "}
                    article{gridPosts.length === 1 ? "" : "s"}
                    {totalArticles > 0 && totalArticles !== posts.length && (
                      <>
                        {" "}
                        of{" "}
                        <span className="font-funnel text-[15px] font-bold text-stone-900">
                          {totalArticles}
                        </span>
                      </>
                    )}
                  </p>
                </motion.div>
              )}

              {/* Article grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                {gridPosts.map((post, i) => (
                  <BlogCard key={post.slug} post={post} index={i} />
                ))}
              </div>

              <InfiniteScrollSentinel
                shown={gridPosts.length}
                total={
                  totalArticles
                    ? activeCategory === "All" && featured
                      ? totalArticles - 1
                      : totalArticles
                    : 0
                }
                loading={loadingMore}
                hasMore={hasMore}
                sentinelRef={sentinelRef}
                unit="articles"
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
function BlogHero({ count }: { count: number }) {
  const HERO_STATS = [
    { value: String(count || 0).padStart(2, "0"), label: "Articles live" },
    { value: "Weekly", label: "New posts" },
    { value: "5 min", label: "Avg read time" },
    { value: "By the team", label: "Authored in-house" },
  ];

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
              The journal · Insights & notes
            </span>
          </div>
          <span className="hidden md:flex items-center gap-2 font-jakarta text-[10.5px] font-semibold uppercase tracking-[0.22em] text-stone-500">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 hero-pulse" />
            Updated this week
          </span>
        </motion.div>

        <div className="grid grid-cols-12 gap-x-8 gap-y-10 items-end">
          <div className="col-span-12 md:col-span-8">
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, ease: [0.2, 0.7, 0.2, 1] }}
              className="font-funnel text-stone-900 font-bold leading-[0.92] tracking-[-0.04em] text-[clamp(2.5rem,6.6vw,5.75rem)] max-w-[16ch]"
            >
              Notes from{" "}
              <span
                style={{
                  fontFamily: "var(--font-newsreader), Georgia, serif",
                  fontStyle: "italic",
                  fontWeight: 500,
                  color: "#FF6600",
                }}
              >
                inside the studio.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-8 max-w-[60ch] font-jakarta text-[16.5px] md:text-[18px] leading-[1.6] text-stone-700"
            >
              Working notes on craft, growth and the messy parts of running a
              creative studio. Written by whoever shipped the work — no SEO
              writing pool, no AI auto-posts.
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
                  <p className="font-funnel font-bold tracking-[-0.025em] text-stone-900 leading-[1.0] text-[clamp(1.15rem,1.8vw,1.55rem)]">
                    {s.value}
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
function FeaturedSpotlight({ post }: { post: BlogPost }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease: [0.2, 0.7, 0.2, 1] }}
    >
      <Link
        href={`/blog/${post.slug}`}
        className="group relative grid grid-cols-1 lg:grid-cols-12 gap-0 rounded-3xl border border-stone-900/10 bg-stone-50 overflow-hidden hover:border-stone-900/25 hover:shadow-[0_30px_60px_-30px_rgba(15,12,8,0.25)] transition-all duration-500 cursor-pointer"
      >
        <div className="relative lg:col-span-7 aspect-[16/10] lg:aspect-auto overflow-hidden bg-stone-100">
          {post.coverImage ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={getThumbnail(post.coverImage)}
              alt={post.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            />
          ) : (
            <div
              className="absolute inset-0 grid place-items-center"
              style={{ background: "linear-gradient(135deg, #FF6600 0%, #1A1410 100%)" }}
            >
              <span className="font-funnel text-stone-50 font-bold text-[clamp(2rem,4vw,3rem)] tracking-tight">
                Creative Monk
              </span>
            </div>
          )}

          <span className="absolute top-5 left-5 inline-flex items-center gap-2 rounded-full bg-stone-900 text-stone-50 px-3 py-1.5 font-jakarta text-[10.5px] font-semibold uppercase tracking-[0.22em]">
            <span className="block w-1.5 h-1.5 rounded-full bg-[#FF6600] hero-pulse" />
            Featured · {post.category || "Journal"}
          </span>

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

        <div className="lg:col-span-5 p-7 md:p-10 flex flex-col gap-5">
          <div className="flex items-center gap-4 font-jakarta text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-500">
            {post.publishedAt && <span>{fmtDate(post.publishedAt)}</span>}
            <span className="w-px h-3 bg-stone-300" aria-hidden />
            <span>{post.readTime || "5 min read"}</span>
            {post.author && (
              <>
                <span className="w-px h-3 bg-stone-300" aria-hidden />
                <span className="truncate">{post.author}</span>
              </>
            )}
          </div>

          <h3 className="font-funnel text-stone-900 font-bold leading-[1.1] tracking-[-0.025em] text-[clamp(1.6rem,2.6vw,2.25rem)] max-w-[24ch] group-hover:text-stone-900">
            {post.title}
          </h3>

          {post.excerpt && (
            <p className="font-jakarta text-[15px] leading-[1.6] text-stone-600 line-clamp-3 max-w-[52ch]">
              {post.excerpt}
            </p>
          )}

          <div className="mt-auto pt-4 border-t border-stone-900/10 flex items-center justify-between gap-3">
            <span className="font-jakarta text-[12px] font-semibold uppercase tracking-[0.22em] text-stone-900 inline-flex items-center gap-2 group-hover:text-[#FF6600] transition-colors">
              Read the article
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
            {post.tags && post.tags[0] && (
              <span className="font-jakarta text-[10.5px] font-semibold uppercase tracking-[0.22em] text-stone-500">
                #{post.tags[0]}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/* ─── Card ─────────────────────────────────────────────────── */
function BlogCard({ post, index }: { post: BlogPost; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay: (index % 3) * 0.07 }}
    >
      <Link
        href={`/blog/${post.slug}`}
        className="group flex h-full flex-col rounded-3xl border border-stone-900/10 bg-stone-50 overflow-hidden hover:-translate-y-1.5 hover:border-stone-900/25 hover:shadow-[0_24px_50px_-30px_rgba(15,12,8,0.22)] transition-all duration-500 cursor-pointer"
      >
        <div className="relative aspect-[5/3] overflow-hidden bg-stone-100">
          {post.coverImage ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={getThumbnail(post.coverImage)}
              alt={post.title}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
            />
          ) : (
            <div
              className="absolute inset-0 grid place-items-center"
              style={{ background: "linear-gradient(135deg, #FF6600 0%, #1A1410 100%)" }}
            >
              <span className="font-funnel text-stone-50 font-bold text-[clamp(1.5rem,2.5vw,2rem)] tracking-tight">
                CM
              </span>
            </div>
          )}

          <span className="absolute top-4 left-4 inline-flex items-center gap-2 rounded-full bg-[#FAF7F2]/95 backdrop-blur-sm border border-stone-900/10 px-3 py-1.5 font-jakarta text-[10px] font-semibold uppercase tracking-[0.22em] text-stone-900">
            <span className="block w-1.5 h-1.5 rounded-full bg-[#FF6600]" />
            {post.category || "Journal"}
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
          <div className="flex items-center gap-3 font-jakarta text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-500 mb-4">
            <span className="text-[#FF6600]">{fmtDate(post.publishedAt) || "Recent"}</span>
            <span className="w-px h-3 bg-stone-300" aria-hidden />
            <span>{post.readTime || "5 min read"}</span>
          </div>
          <h3 className="font-funnel text-[clamp(1.15rem,1.5vw,1.4rem)] leading-[1.2] tracking-[-0.02em] font-bold text-stone-900 line-clamp-2">
            {post.title}
          </h3>
          {post.excerpt && (
            <p className="mt-3 font-jakarta text-[13.5px] leading-[1.55] text-stone-600 line-clamp-3 flex-1">
              {post.excerpt}
            </p>
          )}
          <div className="mt-5 pt-4 border-t border-stone-900/10 flex items-center justify-between gap-3">
            <span className="font-jakarta text-[11px] text-stone-500 truncate">
              {post.author || "Creative Monk"}
            </span>
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

function SkeletonBlock() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-[400px] rounded-3xl bg-stone-200/60 animate-pulse" />
      ))}
    </div>
  );
}

function EmptyState({ activeCategory }: { activeCategory: string }) {
  return (
    <div className="rounded-3xl border border-stone-900/10 bg-stone-50 p-12 md:p-16 text-center">
      <p className="font-jakarta text-[10.5px] font-semibold uppercase tracking-[0.22em] text-stone-500 mb-3">
        Nothing here yet
      </p>
      <h2 className="font-funnel text-[clamp(1.4rem,2vw,1.8rem)] font-bold tracking-[-0.02em] text-stone-900">
        No articles under{" "}
        <span
          style={{
            fontFamily: "var(--font-newsreader), Georgia, serif",
            fontStyle: "italic",
            fontWeight: 500,
            color: "#FF6600",
          }}
        >
          {activeCategory}
        </span>{" "}
        yet.
      </h2>
      <p className="mt-4 font-jakarta text-[14.5px] leading-[1.55] text-stone-600 max-w-[48ch] mx-auto">
        Try another category, or come back next week — we ship one new piece
        every Friday.
      </p>
    </div>
  );
}
