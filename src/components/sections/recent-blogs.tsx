"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { getBlogs } from "@/lib/api";
import type { BlogPost } from "@/lib/types";

export function RecentBlogs() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBlogs() {
      try {
        /* Fetch a buffer so we always have 1 featured + 4 supporting. */
        const res = await getBlogs({ limit: 8 });
        const data = "data" in res ? res.data : res;
        setBlogs(data);
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchBlogs();
  }, []);

  if (!loading && blogs.length === 0) return null;

  /* Always show 1 featured + 4 supporting. If the CMS doesn't have enough
     posts yet, pad with curated placeholders so the layout stays balanced. */
  const SUPPORTING_TARGET = 4;
  const fillerPosts: BlogPost[] = [
    {
      _id: "placeholder-1",
      slug: "behind-the-brief-our-discovery-call",
      title: "Behind the brief — what we actually ask on a discovery call",
      excerpt:
        "The 12 questions we use to figure out, in 30 minutes, whether we're the right studio for your project.",
      category: "Studio Notes",
      readTime: "6 min read",
      publishedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      coverImage: "",
    } as unknown as BlogPost,
    {
      _id: "placeholder-2",
      slug: "two-routes-not-three",
      title: "Why we always present two creative routes, never three",
      excerpt:
        "Three concepts let clients average to the middle. Two opposing directions force a real decision.",
      category: "Craft",
      readTime: "4 min read",
      publishedAt: new Date(Date.now() - 86400000 * 10).toISOString(),
      coverImage: "",
    } as unknown as BlogPost,
    {
      _id: "placeholder-3",
      slug: "how-we-scope-fixed-fee",
      title: "How we scope a fixed-fee engagement without scope creep",
      excerpt:
        "Our internal checklist for turning a one-page brief into a contract both sides can defend.",
      category: "Process",
      readTime: "5 min read",
      publishedAt: new Date(Date.now() - 86400000 * 21).toISOString(),
      coverImage: "",
    } as unknown as BlogPost,
    {
      _id: "placeholder-4",
      slug: "what-good-brand-looks-like",
      title: "What a good brand actually looks like, beyond the logo",
      excerpt:
        "A breakdown of the four invisible systems every memorable brand has — and how to spot when one is missing.",
      category: "Brand",
      readTime: "7 min read",
      publishedAt: new Date(Date.now() - 86400000 * 35).toISOString(),
      coverImage: "",
    } as unknown as BlogPost,
  ];

  const featured = blogs[0];
  const supportingFromApi = blogs.slice(1, 1 + SUPPORTING_TARGET);
  const supporting =
    supportingFromApi.length >= SUPPORTING_TARGET
      ? supportingFromApi
      : [
          ...supportingFromApi,
          ...fillerPosts.slice(0, SUPPORTING_TARGET - supportingFromApi.length),
        ];

  return (
    <section
      className="relative bg-[#FAF7F2] border-t border-stone-900/10 overflow-hidden"
      aria-label="Insights and news"
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
                From the journal
              </span>
            </div>
            <h2 className="font-funnel text-stone-900 font-bold leading-[0.98] tracking-[-0.035em] text-[clamp(2.25rem,5vw,4.5rem)] max-w-[20ch]">
              Notes from{" "}
              <span
                style={{
                  fontFamily: "var(--font-newsreader), Georgia, serif",
                  fontStyle: "italic",
                  fontWeight: 500,
                  color: "#1c1c1c",
                }}
              >
                inside the studio.
              </span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="col-span-12 md:col-span-4 md:justify-self-end flex flex-col gap-3"
          >
            <p className="font-jakarta text-[14.5px] leading-[1.55] text-stone-600 max-w-[36ch]">
              Working notes on craft, growth and the messy parts of running a
              creative studio.
            </p>
            <Link
              href="/blog"
              className="group inline-flex items-center gap-2 font-jakarta text-[12px] font-semibold uppercase tracking-[0.22em] text-stone-900 cursor-pointer"
            >
              <span className="relative">
                Read all posts
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

        {/* Featured + supporting */}
        <div className="grid grid-cols-12 gap-5 md:gap-6">
          {loading ? (
            <>
              <div className="col-span-12 lg:col-span-7 h-[400px] rounded-3xl bg-stone-200/60 animate-pulse" />
              <div className="col-span-12 lg:col-span-5 flex flex-col gap-5 md:gap-6">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="h-[120px] rounded-3xl bg-stone-200/60 animate-pulse" />
                ))}
              </div>
            </>
          ) : (
            <>
              {featured && <FeaturedPost post={featured} />}
              <div className="col-span-12 lg:col-span-5 flex flex-col gap-5 md:gap-6">
                {supporting.map((post, i) => (
                  <SupportingPost key={post._id} post={post} index={i} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

/* Featured large post — left, col-span 7 */
function FeaturedPost({ post }: { post: BlogPost }) {
  const date = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "";
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.2, 0.7, 0.2, 1] }}
      className="col-span-12 lg:col-span-7"
    >
      <Link
        href={`/blog/${post.slug}`}
        className="group relative block rounded-3xl overflow-hidden border border-stone-900/10 bg-stone-50 transition-all duration-500 hover:-translate-y-1.5 hover:border-stone-900/20 hover:shadow-[0_28px_60px_-30px_rgba(15,12,8,0.25)] cursor-pointer h-full"
      >
        <div className="relative aspect-[5/3] w-full overflow-hidden bg-stone-100">
          {post.coverImage ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={post.coverImage}
              alt={post.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04]"
              loading="lazy"
            />
          ) : (
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #FF6600 0%, #1A1410 100%)" }}
            >
              <span
                className="font-funnel text-stone-50 font-bold tracking-tight text-[clamp(2rem,3.5vw,3rem)]"
              >
                Creative Monk
              </span>
            </div>
          )}

          {/* Featured tag */}
          <span className="absolute top-4 left-4 inline-flex items-center gap-2 rounded-full bg-stone-900 text-stone-50 px-3 py-1.5 font-jakarta text-[10px] font-semibold uppercase tracking-[0.22em]">
            <span className="block w-1.5 h-1.5 rounded-full bg-[#FF6600] hero-pulse" />
            Featured · {post.category || "Journal"}
          </span>

          {/* corner arrow */}
          <span
            aria-hidden
            className="absolute top-4 right-4 inline-grid place-items-center w-11 h-11 rounded-full bg-[#FAF7F2]/95 backdrop-blur-sm text-stone-900 transition-all duration-300 group-hover:bg-[#FF6600] group-hover:rotate-[-25deg]"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
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

        <div className="p-7 md:p-9">
          {/* meta row */}
          <div className="flex items-center gap-4 font-jakarta text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-500 mb-5">
            {date && <span>{date}</span>}
            <span className="w-px h-3 bg-stone-300" aria-hidden />
            <span>{post.readTime || "5 min read"}</span>
            <span className="w-px h-3 bg-stone-300 hidden md:inline-block" aria-hidden />
            <span className="hidden md:inline-flex items-center gap-1.5">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
              New
            </span>
          </div>

          <h3 className="font-funnel text-stone-900 font-bold leading-[1.1] tracking-[-0.025em] text-[clamp(1.5rem,2.4vw,2rem)] max-w-[26ch] group-hover:text-stone-700 transition-colors">
            {post.title}
          </h3>

          {post.excerpt && (
            <p className="mt-4 font-jakarta text-[15px] leading-[1.6] text-stone-600 max-w-[55ch] line-clamp-3">
              {post.excerpt}
            </p>
          )}

          <div className="mt-7 pt-6 border-t border-stone-900/10 inline-flex items-center gap-2 font-jakarta text-[12px] font-semibold uppercase tracking-[0.22em] text-stone-900 group-hover:text-[#FF6600] transition-colors">
            Read article
            <svg width="18" height="9" viewBox="0 0 22 10" fill="none">
              <path
                d="M1 5 H 20 M 16 1 L 20 5 L 16 9"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

/* Compact horizontal post — right column */
function SupportingPost({ post, index }: { post: BlogPost; index: number }) {
  const date = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
      })
    : "";
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: 0.1 + index * 0.07, ease: [0.2, 0.7, 0.2, 1] }}
      className="flex-1"
    >
      <Link
        href={`/blog/${post.slug}`}
        className="group relative h-full grid grid-cols-[120px_1fr] md:grid-cols-[140px_1fr] gap-4 md:gap-5 rounded-2xl border border-stone-900/10 bg-stone-50 p-3 md:p-3.5 transition-all duration-500 hover:-translate-y-1 hover:border-stone-900/20 hover:shadow-[0_18px_36px_-22px_rgba(15,12,8,0.22)] cursor-pointer"
      >
        <div className="relative rounded-xl overflow-hidden bg-stone-100 self-stretch min-h-[110px]">
          {post.coverImage ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={post.coverImage}
              alt={post.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
              loading="lazy"
            />
          ) : (
            <div
              className="absolute inset-0 grid place-items-center"
              style={{ background: "linear-gradient(135deg, #FF6600 0%, #1A1410 100%)" }}
            >
              <span className="font-funnel text-stone-50 font-bold text-[14px] tracking-tight">CM</span>
            </div>
          )}
          {/* small number */}
          <span className="absolute top-2 left-2 inline-flex items-center font-jakarta text-[9.5px] font-bold tabular-nums uppercase tracking-[0.18em] bg-stone-50/95 text-stone-900 rounded-full px-2 py-0.5">
            0{index + 2}
          </span>
        </div>

        <div className="flex flex-col min-w-0 py-1.5">
          <div className="flex items-center gap-3 font-jakarta text-[10.5px] font-semibold uppercase tracking-[0.2em] text-stone-500 mb-2">
            <span className="text-[#FF6600]">{post.category || "Journal"}</span>
            <span className="w-px h-3 bg-stone-300" aria-hidden />
            {date && <span>{date}</span>}
          </div>
          <h3 className="font-funnel text-stone-900 font-bold leading-[1.2] tracking-[-0.02em] text-[15px] md:text-[15.5px] line-clamp-2 group-hover:text-[#FF6600] transition-colors flex-1">
            {post.title}
          </h3>
          <div className="mt-2 flex items-center gap-2 font-jakarta text-[10.5px] font-semibold uppercase tracking-[0.18em] text-stone-500">
            {post.readTime || "5 min read"}
            <svg
              width="14"
              height="7"
              viewBox="0 0 22 10"
              fill="none"
              className="text-stone-900 group-hover:text-[#FF6600] group-hover:translate-x-1 transition-all"
            >
              <path
                d="M1 5 H 20 M 16 1 L 20 5 L 16 9"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
