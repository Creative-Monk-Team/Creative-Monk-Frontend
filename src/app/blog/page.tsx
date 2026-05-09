"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Calendar,
  Clock,
  Layers3,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import { CTA } from "@/components/sections/cta";
import { PageHeader } from "@/components/layout/page-header";
import { getBlogs } from "@/lib/api";
import type { BlogPost, PaginatedResponse, PaginationMetadata } from "@/lib/types";
import { Pagination } from "@/components/ui/pagination";
import { getThumbnail } from "@/lib/image-utils";

/* ── helpers ───────────────────────────────────────────── */

const categoryThemes: Record<
  string,
  { badge: string; chip: string }
> = {
  SEO: { badge: "bg-teal-600 text-white", chip: "border-teal-200 bg-teal-50 text-teal-700" },
  Branding: { badge: "bg-rose-600 text-white", chip: "border-rose-200 bg-rose-50 text-rose-700" },
  "Web Development": { badge: "bg-blue-600 text-white", chip: "border-blue-200 bg-blue-50 text-blue-700" },
  "Web Design": { badge: "bg-indigo-600 text-white", chip: "border-indigo-200 bg-indigo-50 text-indigo-700" },
  "Social Media": { badge: "bg-violet-600 text-white", chip: "border-violet-200 bg-violet-50 text-violet-700" },
  PPC: { badge: "bg-amber-600 text-white", chip: "border-amber-200 bg-amber-50 text-amber-700" },
  "Content Marketing": { badge: "bg-emerald-600 text-white", chip: "border-emerald-200 bg-emerald-50 text-emerald-700" },
  "Digital Marketing": { badge: "bg-orange-600 text-white", chip: "border-orange-200 bg-orange-50 text-orange-700" },
  Marketing: { badge: "bg-[#FF6600] text-white", chip: "border-orange-200 bg-orange-50 text-[#FF6600]" },
};

const defaultTheme = { badge: "bg-slate-900 text-white", chip: "border-slate-200 bg-slate-50 text-slate-700" };

function getTheme(cat?: string) {
  return (cat ? categoryThemes[cat] : undefined) || defaultTheme;
}

function fmtDate(date?: string) {
  if (!date) return "";
  const d = new Date(date);
  return Number.isNaN(d.getTime()) ? "" : d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function sortPosts(posts: BlogPost[]) {
  return [...posts].sort((a, b) => {
    const ad = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
    const bd = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
    return bd - ad;
  });
}

/* ── page ──────────────────────────────────────────────── */

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationMetadata | null>(null);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory]);

  useEffect(() => {
    setLoading(true);
    const params: any = { page: currentPage, limit: 10 };
    if (activeCategory !== "All") params.category = activeCategory;

    getBlogs(params)
      .then((res) => {
        if ("data" in res) {
          setPosts(res.data);
          setPagination(res.pagination);
        } else {
          setPosts(sortPosts(res));
          setPagination(null);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [currentPage, activeCategory]);

  // Categories list
  const categories = ["All", "SEO", "Branding", "Web Development", "Web Design", "Social Media", "PPC", "Content Marketing", "Digital Marketing", "Marketing"];
  
  const featured = posts.find((p) => p.featured) || posts[0];
  // Since server handles filtering, we don't need to filter by category again.
  // We just handle the "featured" exclusion on the grid if it's the "All" category.
  const gridPosts = activeCategory === "All" && featured 
    ? posts.filter((p) => p.slug !== featured.slug) 
    : posts;

  return (
    <>
      <PageHeader
        badge="Insights"
        title1="Blog &"
        title2="Insights."
        description="Expert tips, strategies, and sharper thinking from the Creative Monk team."
      />

      {/* ── Main Content ───────────────────────────────── */}
      <section className="relative overflow-hidden bg-white pb-20 pt-12 md:pb-24 md:pt-14">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-20" />
        <div className="pointer-events-none absolute -top-20 right-0 h-[400px] w-[400px] rounded-full bg-orange-500/[0.04] blur-[80px]" />

        <div className="container relative z-10 mx-auto max-w-7xl px-4">
          {/* ── Intro row: heading + snapshot ─────────── */}
          <div className="grid items-start gap-8 lg:grid-cols-[1fr_340px]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-orange-200/70 bg-orange-50 px-3.5 py-1.5">
                <Sparkles className="h-3.5 w-3.5 text-[#FF6600]" />
                <span className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-700">
                  Editorial Desk
                </span>
              </div>

              <h2
                className="mt-4 max-w-2xl text-3xl font-black leading-[1.1] tracking-tight text-slate-950 md:text-4xl"
                style={{ fontFamily: "var(--font-outfit)" }}
              >
                Ideas for brands that want their digital presence to{" "}
                <span className="bg-gradient-to-r from-[#FF6600] via-orange-500 to-amber-500 bg-clip-text text-transparent">
                  feel sharper and perform harder.
                </span>
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500 md:text-base">
                Strategy notes, growth lessons, and creative observations from
                our daily work.
              </p>
            </div>

            {/* Snapshot card */}
            <div className="rounded-2xl border border-slate-900/10 bg-slate-950 p-5 text-white shadow-lg">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-orange-300">
                  <BookOpen className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.24em] text-orange-300">
                    Reading Snapshot
                  </p>
                  <p className="text-base font-black text-white" style={{ fontFamily: "var(--font-outfit)" }}>
                    Fresh thinking, organized
                  </p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5">
                  <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-slate-400">Articles</p>
                  <p className="mt-1 text-lg font-black">{loading ? "--" : String(posts.length).padStart(2, "0")}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5">
                  <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-slate-400">Topics</p>
                  <p className="mt-1 text-lg font-black">{loading ? "--" : String(categories.length - 1).padStart(2, "0")}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5">
                  <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-slate-400">Featured</p>
                  <p className="mt-1 text-sm font-bold">{featured?.category || "SEO"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Category filters ──────────────────────── */}
          <div className="mt-7 flex flex-wrap gap-2">
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-9 w-24 animate-pulse rounded-full bg-gray-100" />
                ))
              : categories.map((cat) => {
                  const active = activeCategory === cat;
                  const t = getTheme(cat === "All" ? undefined : cat);
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setActiveCategory(cat)}
                      className={`rounded-full border px-4 py-2 text-[12px] font-semibold transition-all duration-200 ${
                        active
                          ? "border-slate-900 bg-slate-950 text-white shadow-sm"
                          : `${t.chip} hover:shadow-sm`
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
          </div>

          {/* ── Featured + Spotlight ──────────────────── */}
          {loading ? (
            <div className="mt-8 h-[340px] animate-pulse rounded-2xl bg-gray-50" />
          ) : posts.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-dashed border-orange-200 bg-[#fafafa] px-6 py-16 text-center">
              <BookOpen className="mx-auto mb-3 h-8 w-8 text-[#FF6600]/40" />
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#FF6600]">Nothing live yet</p>
              <p className="mt-2 text-sm text-slate-500">New insights will appear here once published.</p>
            </div>
          ) : activeCategory === "All" && featured ? (
            <Link
              href={`/blog/${featured.slug}`}
              className="group mt-8 flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-500 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-orange-500/[0.05] md:flex-row"
            >
              <div className="relative h-60 overflow-hidden md:h-auto md:w-[55%]">
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/50 via-black/5 to-transparent md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-black/5" />
                <img src={getThumbnail(featured.coverImage)} alt={featured.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute left-4 top-4 z-20 flex gap-2">
                  <span className="rounded-full bg-white/90 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[#FF6600] backdrop-blur-sm">Featured</span>
                  <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] ${getTheme(featured.category).badge}`}>{featured.category}</span>
                </div>
              </div>

              <div className="flex flex-1 flex-col justify-center p-6 md:p-8">
                <div className="flex flex-wrap gap-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                  <span className="inline-flex items-center gap-1.5"><Calendar className="h-3 w-3 text-[#FF6600]" />{fmtDate(featured.publishedAt) || "Latest"}</span>
                  <span className="inline-flex items-center gap-1.5"><Clock className="h-3 w-3 text-[#FF6600]" />{featured.readTime || "5 min read"}</span>
                </div>
                <h2 className="mt-3 text-xl font-black leading-snug tracking-tight text-slate-950 transition-colors group-hover:text-[#FF6600] md:text-2xl lg:text-3xl" style={{ fontFamily: "var(--font-outfit)" }}>
                  {featured.title}
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-500 line-clamp-3 md:text-base md:leading-7">{featured.excerpt}</p>
                <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
                  <span className="text-xs text-slate-400">{featured.author || "Creative Monk Team"}</span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-950 px-4 py-2 text-xs font-bold text-white transition-colors group-hover:bg-[#FF6600]">
                    Read Feature <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          ) : null}

          {/* ── All Articles ─────────────────────────── */}
          {!loading && posts.length > 0 && (
            <>
              <div className="mt-14 mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="section-label mb-1.5">
                    {activeCategory === "All" ? "All Articles" : activeCategory}
                  </p>
                  <h2 className="text-2xl font-black tracking-tight text-slate-950 md:text-3xl" style={{ fontFamily: "var(--font-outfit)" }}>
                    Browse all articles
                  </h2>
                </div>
                <div className="inline-flex shrink-0 items-center gap-2 rounded-full border border-gray-100 bg-gray-50 px-3.5 py-2 text-xs font-semibold text-slate-500">
                  <Layers3 className="h-3.5 w-3.5 text-[#FF6600]" />
                  {gridPosts.length} article{gridPosts.length === 1 ? "" : "s"}
                </div>
              </div>

              {gridPosts.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-orange-200 bg-[#fafafa] px-6 py-12 text-center">
                  <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#FF6600]">No matches</p>
                  <p className="mt-2 text-sm text-slate-500">Try another category.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {gridPosts.map((post) => (
                    <motion.article
                      key={post.slug}
                      initial={{ opacity: 0, y: 18 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.1 }}
                      transition={{ duration: 0.45 }}
                    >
                      <Link
                        href={`/blog/${post.slug}`}
                        className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-500 hover:-translate-y-0.5 hover:border-orange-100/60 hover:shadow-lg hover:shadow-orange-500/[0.05]"
                      >
                        <div className="relative h-44 overflow-hidden">
                          <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/30 to-transparent" />
                          <img src={getThumbnail(post.coverImage)} alt={post.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                          <span className={`absolute left-3.5 top-3.5 z-20 rounded-full px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.12em] ${getTheme(post.category).badge}`}>{post.category}</span>
                        </div>

                        <div className="flex flex-1 flex-col p-5">
                          <div className="mb-2 flex flex-wrap gap-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                            <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3 text-[#FF6600]" />{fmtDate(post.publishedAt) || "Recent"}</span>
                            <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3 text-[#FF6600]" />{post.readTime || "5 min"}</span>
                          </div>
                          <h3 className="text-lg font-black leading-snug tracking-tight text-slate-950 transition-colors group-hover:text-[#FF6600] line-clamp-2" style={{ fontFamily: "var(--font-outfit)" }}>
                            {post.title}
                          </h3>
                          <p className="mt-2 flex-1 text-xs leading-5 text-slate-500 line-clamp-3">{post.excerpt}</p>
                          <div className="mt-4 flex items-center justify-between border-t border-gray-50 pt-3">
                            <span className="text-xs text-slate-400">{post.author || "Creative Monk Team"}</span>
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-[#FF6600]">
                              Read <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                            </span>
                          </div>
                        </div>
                      </Link>
                    </motion.article>
                  ))}
                </div>
              )}

              {pagination && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={pagination.pages}
                  onPageChange={(page) => {
                    setCurrentPage(page);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                />
              )}
            </>
          )}
        </div>
      </section>

      <CTA />
    </>
  );
}
