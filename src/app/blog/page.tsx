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
import type { BlogPost } from "@/lib/types";

const categoryThemes: Record<
  string,
  {
    badge: string;
    chip: string;
    surface: string;
    accent: string;
  }
> = {
  SEO: {
    badge: "bg-teal-600 text-white",
    chip: "border-teal-200 bg-teal-50 text-teal-700",
    surface: "from-teal-500/[0.15] via-teal-50/70 to-white",
    accent: "text-teal-700",
  },
  Branding: {
    badge: "bg-rose-600 text-white",
    chip: "border-rose-200 bg-rose-50 text-rose-700",
    surface: "from-rose-500/[0.15] via-rose-50/75 to-white",
    accent: "text-rose-700",
  },
  "Web Development": {
    badge: "bg-blue-600 text-white",
    chip: "border-blue-200 bg-blue-50 text-blue-700",
    surface: "from-blue-500/[0.15] via-blue-50/75 to-white",
    accent: "text-blue-700",
  },
  "Social Media": {
    badge: "bg-violet-600 text-white",
    chip: "border-violet-200 bg-violet-50 text-violet-700",
    surface: "from-violet-500/[0.15] via-violet-50/75 to-white",
    accent: "text-violet-700",
  },
  Marketing: {
    badge: "bg-[#FF6600] text-white",
    chip: "border-orange-200 bg-orange-50 text-[#FF6600]",
    surface: "from-orange-500/[0.15] via-orange-50/75 to-white",
    accent: "text-[#FF6600]",
  },
};

function getCategoryTheme(category?: string) {
  return (
    (category ? categoryThemes[category] : undefined) || {
      badge: "bg-slate-900 text-white",
      chip: "border-slate-200 bg-slate-50 text-slate-700",
      surface: "from-slate-900/10 via-slate-50/75 to-white",
      accent: "text-slate-700",
    }
  );
}

function formatDate(date?: string) {
  if (!date) return "";

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "";

  return parsed.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function sortPosts(posts: BlogPost[]) {
  return [...posts].sort((a, b) => {
    const aDate = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
    const bDate = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
    return bDate - aDate;
  });
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const data = await getBlogs();
        setPosts(sortPosts(data));
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchBlogs();
  }, []);

  const categories = [
    "All",
    ...Array.from(
      new Set(posts.map((post) => post.category).filter(Boolean)),
    ),
  ];
  const featured = posts.find((post) => post.featured) || posts[0];
  const spotlight = posts
    .filter((post) => post.slug !== featured?.slug)
    .slice(0, 2);
  const filteredPosts =
    activeCategory === "All"
      ? posts
      : posts.filter((post) => post.category === activeCategory);
  const gridPosts =
    activeCategory === "All" && featured
      ? filteredPosts.filter((post) => post.slug !== featured.slug)
      : filteredPosts;

  return (
    <>
      <PageHeader
        badge="Insights"
        title1="Blog &"
        title2="Insights."
        description="Expert tips, strategies, and sharper thinking from the Creative Monk team."
      />

      <section className="relative overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#fff8f3_36%,#f8fafc_100%)] py-16 md:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,102,0,0.12),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(15,23,42,0.08),transparent_26%)]" />
        <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(to_right,#f97316_1px,transparent_1px),linear-gradient(to_bottom,#f97316_1px,transparent_1px)] [background-size:72px_72px]" />

        <div className="container relative z-10">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_360px] lg:items-end">
            <div className="max-w-3xl">
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 rounded-full border border-orange-200/70 bg-white/[0.85] px-4 py-2 shadow-sm shadow-orange-100/50 backdrop-blur-sm"
              >
                <Sparkles className="h-4 w-4 text-[#FF6600]" />
                <span className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-700">
                  Editorial Desk
                </span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.08 }}
                className="mt-6 text-4xl font-black leading-[1.04] tracking-tight text-slate-950 md:text-5xl lg:text-6xl"
                style={{ fontFamily: "var(--font-outfit)" }}
              >
                Ideas for brands that want their digital presence to{" "}
                <span className="bg-gradient-to-r from-[#FF6600] via-orange-500 to-amber-500 bg-clip-text text-transparent">
                  feel sharper and perform harder.
                </span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.16 }}
                className="mt-6 max-w-2xl text-lg leading-8 text-slate-600"
              >
                A curated mix of strategy notes, website thinking, growth
                lessons, and creative observations from the work we do every
                day.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.12 }}
              className="rounded-[2rem] border border-slate-900/10 bg-slate-950 p-7 text-white shadow-[0_40px_120px_-60px_rgba(15,23,42,0.82)]"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-orange-300">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-orange-300">
                    Reading Snapshot
                  </p>
                  <p
                    className="mt-1 text-xl font-black text-white"
                    style={{ fontFamily: "var(--font-outfit)" }}
                  >
                    Fresh thinking, better organized
                  </p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3">
                <div className="rounded-[1.25rem] border border-white/10 bg-white/5 p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                    Articles
                  </p>
                  <p className="mt-2 text-2xl font-black text-white">
                    {loading ? "--" : String(posts.length).padStart(2, "0")}
                  </p>
                </div>
                <div className="rounded-[1.25rem] border border-white/10 bg-white/5 p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                    Topics
                  </p>
                  <p className="mt-2 text-2xl font-black text-white">
                    {loading ? "--" : String(categories.length - 1).padStart(2, "0")}
                  </p>
                </div>
                <div className="rounded-[1.25rem] border border-white/10 bg-white/5 p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                    Featured
                  </p>
                  <p className="mt-2 text-sm font-bold text-white">
                    {featured?.category || "Latest"}
                  </p>
                </div>
              </div>

              <p className="mt-5 text-sm leading-7 text-slate-300">
                Browse by topic, jump into the featured story, or skim the
                latest tactical reads below.
              </p>
            </motion.div>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            {loading
              ? Array.from({ length: 5 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-11 w-28 animate-pulse rounded-full border border-white/80 bg-white/80"
                  />
                ))
              : categories.map((category) => {
                  const isActive = activeCategory === category;
                  const theme = getCategoryTheme(category === "All" ? undefined : category);

                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setActiveCategory(category)}
                      className={`rounded-full border px-5 py-3 text-sm font-semibold transition-all duration-300 ${
                        isActive
                          ? "border-slate-900 bg-slate-950 text-white shadow-lg shadow-slate-900/[0.15]"
                          : `${theme.chip} hover:-translate-y-0.5`
                      }`}
                    >
                      {category}
                    </button>
                  );
                })}
          </div>

          {loading ? (
            <div className="mt-12 grid gap-8 xl:grid-cols-[minmax(0,1.1fr)_360px]">
              <div className="h-[540px] animate-pulse rounded-[2rem] border border-white/70 bg-white/80" />
              <div className="space-y-6">
                <div className="h-[260px] animate-pulse rounded-[2rem] border border-white/70 bg-white/80" />
                <div className="h-[260px] animate-pulse rounded-[2rem] border border-white/70 bg-white/80" />
              </div>
            </div>
          ) : posts.length === 0 ? (
            <div className="mt-12 rounded-[2rem] border border-dashed border-orange-200 bg-white/70 px-6 py-20 text-center shadow-sm">
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#FF6600]">
                Nothing live yet
              </p>
              <p className="mt-4 text-lg text-gray-600">
                No blog posts are available right now.
              </p>
              <p className="mt-2 text-sm text-gray-500">
                New insights will appear here once they are published.
              </p>
            </div>
          ) : (
            <>
              {activeCategory === "All" && featured ? (
                <div className="mt-12 grid gap-8 xl:grid-cols-[minmax(0,1.1fr)_360px]">
                  <motion.div
                    initial={{ opacity: 0, y: 22 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                  >
                    <Link
                      href={`/blog/${featured.slug}`}
                      className="group relative block overflow-hidden rounded-[2rem] border border-white/80 bg-white/80 shadow-[0_30px_100px_-55px_rgba(15,23,42,0.28)] backdrop-blur-sm"
                    >
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${getCategoryTheme(
                          featured.category,
                        ).surface}`}
                      />
                      <div className="grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
                        <div className="relative min-h-[320px] overflow-hidden lg:min-h-[520px]">
                          <div className="absolute inset-0 z-10 bg-gradient-to-tr from-slate-950/60 via-slate-950/10 to-transparent" />
                          <img
                            src={featured.coverImage || "/placeholder.jpg"}
                            alt={featured.title}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />

                          <div className="absolute left-6 top-6 z-20 flex flex-wrap gap-3">
                            <span className="rounded-full border border-white/70 bg-white/[0.88] px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-[#FF6600] shadow-sm backdrop-blur-sm">
                              Featured Story
                            </span>
                            <span
                              className={`rounded-full px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] shadow-sm ${getCategoryTheme(
                                featured.category,
                              ).badge}`}
                            >
                              {featured.category}
                            </span>
                          </div>
                        </div>

                        <div className="relative z-10 flex flex-col justify-between p-7 md:p-9">
                          <div>
                            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                              <span className="inline-flex items-center gap-2">
                                <Calendar className="h-3.5 w-3.5 text-[#FF6600]" />
                                {formatDate(featured.publishedAt) || "Latest article"}
                              </span>
                              <span className="inline-flex items-center gap-2">
                                <Clock className="h-3.5 w-3.5 text-[#FF6600]" />
                                {featured.readTime || "5 min read"}
                              </span>
                            </div>

                            <h2
                              className="mt-6 text-3xl font-black leading-tight tracking-tight text-slate-950 transition-colors group-hover:text-[#FF6600] xl:text-4xl"
                              style={{ fontFamily: "var(--font-outfit)" }}
                            >
                              {featured.title}
                            </h2>

                            <p className="mt-6 text-base leading-8 text-slate-600 md:text-lg">
                              {featured.excerpt}
                            </p>
                          </div>

                          <div className="mt-10 flex items-center justify-between gap-4 border-t border-slate-200/80 pt-6">
                            <div>
                              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-400">
                                Written by
                              </p>
                              <p className="mt-2 text-sm font-semibold text-slate-700">
                                {featured.author || "Creative Monk Team"}
                              </p>
                            </div>

                            <span className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white transition-all duration-300 group-hover:bg-[#FF6600]">
                              Read Feature
                              <ArrowUpRight className="h-4 w-4" />
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>

                  <div className="space-y-6">
                    {spotlight.map((post, index) => (
                      <motion.article
                        key={post.slug}
                        initial={{ opacity: 0, y: 22 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.08 }}
                      >
                        <Link
                          href={`/blog/${post.slug}`}
                          className="group relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-white/80 bg-white/80 p-6 shadow-[0_24px_80px_-52px_rgba(15,23,42,0.22)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_90px_-52px_rgba(255,102,0,0.25)]"
                        >
                          <div
                            className={`absolute inset-0 bg-gradient-to-br ${getCategoryTheme(
                              post.category,
                            ).surface}`}
                          />
                          <div className="relative z-10">
                            <span
                              className={`inline-flex rounded-full px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.18em] ${getCategoryTheme(
                                post.category,
                              ).badge}`}
                            >
                              {post.category}
                            </span>

                            <h3
                              className="mt-5 text-2xl font-black leading-tight tracking-tight text-slate-950 transition-colors group-hover:text-[#FF6600]"
                              style={{ fontFamily: "var(--font-outfit)" }}
                            >
                              {post.title}
                            </h3>

                            <p className="mt-4 text-sm leading-7 text-slate-600 line-clamp-3">
                              {post.excerpt}
                            </p>

                            <div className="mt-6 flex flex-wrap gap-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                              <span className="inline-flex items-center gap-2">
                                <Calendar className="h-3.5 w-3.5 text-[#FF6600]" />
                                {formatDate(post.publishedAt) || "Recently added"}
                              </span>
                              <span className="inline-flex items-center gap-2">
                                <Clock className="h-3.5 w-3.5 text-[#FF6600]" />
                                {post.readTime || "5 min read"}
                              </span>
                            </div>

                            <div className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-slate-900 transition-colors group-hover:text-[#FF6600]">
                              Explore article
                              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                            </div>
                          </div>
                        </Link>
                      </motion.article>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="mt-14 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div className="max-w-2xl">
                  <p className="section-label mb-3 block">
                    {activeCategory === "All" ? "All Articles" : activeCategory}
                  </p>
                  <h2
                    className="text-3xl font-black tracking-tight text-slate-950 md:text-4xl"
                    style={{ fontFamily: "var(--font-outfit)" }}
                  >
                    Editorially organized for faster reading and better discovery
                  </h2>
                  <p className="mt-3 text-base leading-7 text-slate-600">
                    Browse the full archive or narrow the view to one topic at a
                    time.
                  </p>
                </div>

                <div className="inline-flex items-center gap-3 rounded-full border border-white/80 bg-white/[0.85] px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm shadow-slate-200/40">
                  <Layers3 className="h-4 w-4 text-[#FF6600]" />
                  {filteredPosts.length} article{filteredPosts.length === 1 ? "" : "s"}
                </div>
              </div>

              {gridPosts.length === 0 ? (
                <div className="mt-10 rounded-[2rem] border border-dashed border-orange-200 bg-white/75 px-6 py-16 text-center">
                  <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#FF6600]">
                    No matches in this topic
                  </p>
                  <p className="mt-4 text-base text-slate-600">
                    Try another category to explore more articles.
                  </p>
                </div>
              ) : (
                <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
                  {gridPosts.map((post, index) => (
                    <motion.article
                      key={post.slug}
                      initial={{ opacity: 0, y: 22 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                    >
                      <Link
                        href={`/blog/${post.slug}`}
                        className="group flex h-full flex-col overflow-hidden rounded-[1.9rem] border border-white/80 bg-white/[0.82] shadow-[0_24px_80px_-56px_rgba(15,23,42,0.22)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_32px_90px_-56px_rgba(255,102,0,0.28)]"
                      >
                        <div className="relative h-60 overflow-hidden">
                          <div
                            className={`absolute inset-0 bg-gradient-to-br ${getCategoryTheme(
                              post.category,
                            ).surface}`}
                          />
                          <div className="absolute inset-0 z-10 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" />
                          <div className="absolute left-5 top-5 z-20 flex items-center gap-2">
                            <span
                              className={`rounded-full px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.16em] shadow-sm ${getCategoryTheme(
                                post.category,
                              ).badge}`}
                            >
                              {post.category}
                            </span>
                          </div>

                          <img
                            src={post.coverImage || "/placeholder.jpg"}
                            alt={post.title}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                        </div>

                        <div className="flex flex-1 flex-col p-6 md:p-7">
                          <div className="mb-4 flex flex-wrap items-center gap-4 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                            <span className="inline-flex items-center gap-1.5">
                              <Calendar className="h-3.5 w-3.5 text-[#FF6600]" />
                              {formatDate(post.publishedAt) || "Recently added"}
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                              <Clock className="h-3.5 w-3.5 text-[#FF6600]" />
                              {post.readTime || "5 min read"}
                            </span>
                          </div>

                          <h3
                            className="text-2xl font-black tracking-tight text-slate-950 transition-colors group-hover:text-[#FF6600] line-clamp-2"
                            style={{ fontFamily: "var(--font-outfit)" }}
                          >
                            {post.title}
                          </h3>

                          <p className="mt-4 flex-1 text-sm leading-7 text-slate-600 line-clamp-3">
                            {post.excerpt}
                          </p>

                          <div className="mt-6 flex items-center justify-between gap-4 border-t border-slate-200/80 pt-5">
                            <span className="text-sm font-semibold text-slate-500">
                              {post.author || "Creative Monk Team"}
                            </span>
                            <span className="inline-flex items-center gap-2 text-sm font-bold text-[#FF6600]">
                              Read article
                              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                            </span>
                          </div>
                        </div>
                      </Link>
                    </motion.article>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
      <CTA />
    </>
  );
}
