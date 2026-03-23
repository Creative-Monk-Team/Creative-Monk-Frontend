"use client";

import { use, useEffect, useState } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Calendar,
  Clock,
  Sparkles,
  Tag,
  User,
} from "lucide-react";
import { motion } from "framer-motion";
import { CTA } from "@/components/sections/cta";
import { getBlog, getBlogs } from "@/lib/api";
import type { BlogPost } from "@/lib/types";

const categoryThemes: Record<
  string,
  {
    badge: string;
    chip: string;
    surface: string;
  }
> = {
  SEO: {
    badge: "bg-teal-600 text-white",
    chip: "border-teal-200 bg-teal-50 text-teal-700",
    surface: "from-teal-500/[0.14] via-teal-50/75 to-white",
  },
  Branding: {
    badge: "bg-rose-600 text-white",
    chip: "border-rose-200 bg-rose-50 text-rose-700",
    surface: "from-rose-500/[0.14] via-rose-50/75 to-white",
  },
  "Web Development": {
    badge: "bg-blue-600 text-white",
    chip: "border-blue-200 bg-blue-50 text-blue-700",
    surface: "from-blue-500/[0.14] via-blue-50/75 to-white",
  },
  "Social Media": {
    badge: "bg-violet-600 text-white",
    chip: "border-violet-200 bg-violet-50 text-violet-700",
    surface: "from-violet-500/[0.14] via-violet-50/75 to-white",
  },
  Marketing: {
    badge: "bg-[#FF6600] text-white",
    chip: "border-orange-200 bg-orange-50 text-[#FF6600]",
    surface: "from-orange-500/[0.14] via-orange-50/75 to-white",
  },
};

function getCategoryTheme(category?: string) {
  return (
    (category ? categoryThemes[category] : undefined) || {
      badge: "bg-slate-900 text-white",
      chip: "border-slate-200 bg-slate-50 text-slate-700",
      surface: "from-slate-900/10 via-slate-50/75 to-white",
    }
  );
}

function formatDate(date?: string) {
  if (!date) return "Recently published";

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "Recently published";

  return parsed.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
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

export default function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPost() {
      try {
        const [postData, allPosts] = await Promise.all([
          getBlog(slug),
          getBlogs({ limit: 6 }),
        ]);

        setPost(postData);

        if (postData) {
          const related = sortPosts(allPosts)
            .filter((item) => item.slug !== postData.slug)
            .sort((a, b) => {
              const categoryScore =
                Number(b.category === postData.category) -
                Number(a.category === postData.category);
              if (categoryScore !== 0) {
                return categoryScore;
              }

              const aDate = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
              const bDate = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
              return bDate - aDate;
            })
            .slice(0, 3);

          setRelatedPosts(related);
        }
      } catch (error) {
        console.error("Failed to fetch blog post:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[linear-gradient(180deg,#fffaf6_0%,#ffffff_100%)]">
        <div className="container py-20">
          <div className="h-[420px] animate-pulse rounded-[2.5rem] border border-white/80 bg-white/80 shadow-[0_24px_80px_-55px_rgba(15,23,42,0.18)]" />
          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="h-[780px] animate-pulse rounded-[2rem] border border-white/80 bg-white/80" />
            <div className="space-y-6">
              <div className="h-[260px] animate-pulse rounded-[2rem] border border-white/80 bg-white/80" />
              <div className="h-[200px] animate-pulse rounded-[2rem] border border-white/80 bg-white/80" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) return notFound();

  const theme = getCategoryTheme(post.category);

  return (
    <>
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(255,122,26,0.18),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(255,122,26,0.10),_transparent_28%),linear-gradient(180deg,_#171412_0%,_#12100f_54%,_#0f0e0d_100%)] pb-20 pt-14 md:pt-20 lg:pt-20">
        <div className="absolute inset-0 -z-10">
          <img
            src={post.coverImage || "/placeholder.jpg"}
            alt={post.title}
            className="h-full w-full object-cover opacity-[0.15] scale-[1.03]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(15,12,10,0.92)_12%,rgba(15,12,10,0.76)_46%,rgba(15,12,10,0.58)_100%)]" />
          <div className="absolute right-[-8%] top-16 h-72 w-72 rounded-full bg-orange-500/[0.18] blur-3xl" />
          <div className="absolute bottom-0 left-[-6%] h-64 w-64 rounded-full bg-white/8 blur-3xl" />
        </div>

        <div className="container relative z-10">
          <div className="mx-auto max-w-6xl">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.22em] text-white/75 backdrop-blur-sm transition-all hover:border-orange-400/40 hover:bg-white/10 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Blog
            </Link>

            <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_360px] lg:items-end">
              <div className="max-w-4xl">
                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className={`inline-flex rounded-full px-4 py-2 text-[11px] font-black uppercase tracking-[0.2em] ${theme.badge}`}
                  >
                    {post.category}
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/75">
                    <Sparkles className="h-3.5 w-3.5 text-orange-300" />
                    Editorial insight
                  </span>
                </div>

                <h1
                  className="mt-6 text-[2.2rem] font-black leading-[1.03] tracking-[-0.03em] text-white md:text-[2.8rem] lg:text-[3.5rem]"
                  style={{ fontFamily: "var(--font-outfit)" }}
                >
                  {post.title}
                </h1>

                {post.excerpt ? (
                  <p className="mt-6 max-w-3xl text-[1rem] leading-8 text-white/[0.82] md:text-[1.08rem]">
                    {post.excerpt}
                  </p>
                ) : null}

                <div className="mt-8 flex flex-wrap gap-3">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white/80 backdrop-blur-sm">
                    <User className="h-4 w-4 text-orange-300" />
                    {post.author || "Creative Monk Team"}
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white/80 backdrop-blur-sm">
                    <Calendar className="h-4 w-4 text-orange-300" />
                    {formatDate(post.publishedAt)}
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white/80 backdrop-blur-sm">
                    <Clock className="h-4 w-4 text-orange-300" />
                    {post.readTime || "5 min read"}
                  </div>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="rounded-[2rem] border border-white/10 bg-white/5 p-7 text-white shadow-[0_40px_120px_-60px_rgba(0,0,0,0.5)] backdrop-blur-md"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-orange-300">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-orange-300">
                      Reading Mode
                    </p>
                    <p
                      className="mt-1 text-xl font-black text-white"
                      style={{ fontFamily: "var(--font-outfit)" }}
                    >
                      Built for a cleaner read
                    </p>
                  </div>
                </div>

                <p className="mt-5 text-sm leading-7 text-slate-300">
                  Better spacing, stronger typography, and a more focused layout
                  help the article feel intentional from hero to footer.
                </p>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="rounded-[1.25rem] border border-white/10 bg-white/5 p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                      Topic
                    </p>
                    <p className="mt-2 text-sm font-bold text-white">
                      {post.category}
                    </p>
                  </div>
                  <div className="rounded-[1.25rem] border border-white/10 bg-white/5 p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                      Read Time
                    </p>
                    <p className="mt-2 text-sm font-bold text-white">
                      {post.readTime || "5 min read"}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <article className="relative z-10 -mt-8 rounded-t-[2.25rem] bg-[linear-gradient(180deg,#fff9f5_0%,#ffffff_18%,#ffffff_100%)] pt-10 md:-mt-10 md:rounded-t-[2.75rem] md:pt-14 lg:rounded-t-[3rem]">
        <div className="container">
          <div className="mx-auto max-w-[1200px]">
            {post.coverImage ? (
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="overflow-hidden rounded-[2rem] border border-white/80 bg-white shadow-[0_30px_90px_-55px_rgba(15,23,42,0.25)]"
              >
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="aspect-[16/7] w-full object-cover"
                />
              </motion.div>
            ) : null}

            <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="rounded-[2rem] border border-white/80 bg-white p-6 shadow-[0_24px_80px_-55px_rgba(15,23,42,0.16)] md:p-10 lg:p-12"
              >
                <div className="mb-8 flex flex-col gap-4 border-b border-slate-100 pb-8 md:flex-row md:items-end md:justify-between">
                  <div>
                    <span className="section-label">Article</span>
                    <h2
                      className="mt-3 text-[2rem] font-black leading-tight text-slate-950 md:text-4xl"
                      style={{ fontFamily: "var(--font-outfit)" }}
                    >
                      Read the full insight
                    </h2>
                  </div>
                  <p className="max-w-xl text-sm leading-7 text-slate-500 md:text-base">
                    Structured for a calmer reading experience with cleaner
                    rhythm, better hierarchy, and stronger visual breathing room.
                  </p>
                </div>

                <div
                  className="blog-content max-w-none text-slate-700"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {(post.tags?.length || 0) > 0 ? (
                  <div className="mt-10 border-t border-slate-100 pt-8">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                      Tagged under
                    </p>
                    <div className="mt-4 flex flex-wrap gap-3">
                      {post.tags?.map((tag) => (
                        <span
                          key={tag}
                          className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] ${theme.chip}`}
                        >
                          <Tag className="h-3.5 w-3.5" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}
              </motion.div>

              <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
                <motion.aside
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="overflow-hidden rounded-[2rem] border border-slate-900/10 bg-slate-950 p-6 text-white shadow-[0_30px_90px_-58px_rgba(15,23,42,0.72)]"
                >
                  <div className="absolute" />
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-orange-300">
                    Article Details
                  </p>

                  <div className="mt-6 space-y-5">
                    <div className="rounded-[1.25rem] border border-white/10 bg-white/5 p-4">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                        Written by
                      </p>
                      <p className="mt-2 text-sm font-bold text-white">
                        {post.author || "Creative Monk Team"}
                      </p>
                    </div>
                    <div className="rounded-[1.25rem] border border-white/10 bg-white/5 p-4">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                        Published
                      </p>
                      <p className="mt-2 text-sm font-bold text-white">
                        {formatDate(post.publishedAt)}
                      </p>
                    </div>
                    <div className="rounded-[1.25rem] border border-white/10 bg-white/5 p-4">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                        Best for
                      </p>
                      <p className="mt-2 text-sm leading-7 text-slate-300">
                        Founders, marketers, and teams looking for sharper
                        digital execution ideas.
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    <Link
                      href="/blog"
                      className="inline-flex w-full items-center justify-between rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-white transition-all hover:border-orange-400/30 hover:bg-white/10"
                    >
                      Browse all articles
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link
                      href="/contact"
                      className="inline-flex w-full items-center justify-between rounded-full bg-[#FF6600] px-4 py-3 text-sm font-bold text-white transition-all hover:bg-orange-600"
                    >
                      Start a project
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </div>
                </motion.aside>

                {(post.tags?.length || 0) > 0 ? (
                  <motion.aside
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="rounded-[2rem] border border-white/80 bg-white p-6 shadow-[0_20px_70px_-55px_rgba(15,23,42,0.18)]"
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                      Topics
                    </p>
                    <div className="mt-4 flex flex-wrap gap-3">
                      {post.tags?.map((tag) => (
                        <span
                          key={tag}
                          className={`rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] ${theme.chip}`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </motion.aside>
                ) : null}

                {relatedPosts.length > 0 ? (
                  <motion.aside
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="rounded-[2rem] border border-white/80 bg-white p-6 shadow-[0_20px_70px_-55px_rgba(15,23,42,0.18)]"
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                      Related Reads
                    </p>

                    <div className="mt-5 space-y-4">
                      {relatedPosts.map((item) => (
                        <Link
                          key={item.slug}
                          href={`/blog/${item.slug}`}
                          className="group block rounded-[1.25rem] border border-slate-100 bg-slate-50 px-4 py-4 transition-all duration-300 hover:border-orange-200 hover:bg-orange-50/60"
                        >
                          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                            {item.category}
                          </p>
                          <p
                            className="mt-2 text-sm font-bold leading-6 text-slate-900 transition-colors group-hover:text-[#FF6600]"
                            style={{ fontFamily: "var(--font-outfit)" }}
                          >
                            {item.title}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </motion.aside>
                ) : null}
              </div>
            </div>

            {relatedPosts.length > 0 ? (
              <motion.section
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-14 rounded-[2rem] border border-white/80 bg-white p-6 shadow-[0_24px_80px_-55px_rgba(15,23,42,0.18)] md:p-10"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                  <div>
                    <span className="section-label">Continue Reading</span>
                    <h2
                      className="mt-3 text-[2rem] font-black leading-tight text-slate-950 md:text-4xl"
                      style={{ fontFamily: "var(--font-outfit)" }}
                    >
                      More articles worth opening next
                    </h2>
                  </div>
                  <p className="max-w-xl text-sm leading-7 text-slate-500 md:text-base">
                    A few related reads to keep the momentum going once you are
                    done with this article.
                  </p>
                </div>

                <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {relatedPosts.map((item) => (
                    <Link
                      key={item.slug}
                      href={`/blog/${item.slug}`}
                      className="group overflow-hidden rounded-[1.75rem] border border-slate-100 bg-slate-50 transition-all duration-300 hover:-translate-y-1.5 hover:border-orange-200 hover:bg-white hover:shadow-[0_24px_70px_-54px_rgba(255,102,0,0.22)]"
                    >
                      <div className="relative h-52 overflow-hidden">
                        <div
                          className={`absolute inset-0 bg-gradient-to-br ${getCategoryTheme(
                            item.category,
                          ).surface}`}
                        />
                        <img
                          src={item.coverImage || "/placeholder.jpg"}
                          alt={item.title}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-6">
                        <span
                          className={`inline-flex rounded-full px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.16em] ${getCategoryTheme(
                            item.category,
                          ).badge}`}
                        >
                          {item.category}
                        </span>
                        <h3
                          className="mt-4 text-xl font-black leading-tight text-slate-950 transition-colors group-hover:text-[#FF6600]"
                          style={{ fontFamily: "var(--font-outfit)" }}
                        >
                          {item.title}
                        </h3>
                        <div className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#FF6600]">
                          Read article
                          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.section>
            ) : null}
          </div>
        </div>
      </article>

      <CTA />
    </>
  );
}
