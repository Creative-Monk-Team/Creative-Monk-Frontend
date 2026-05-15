"use client";

import { use, useEffect, useMemo, useState, type ReactElement } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { CTA } from "@/components/sections/cta";
import { getBlog, getBlogs } from "@/lib/api";
import type { BlogPost } from "@/lib/types";
import { getThumbnail } from "@/lib/image-utils";

function fmtDate(date?: string) {
  if (!date) return "";
  const d = new Date(date);
  return Number.isNaN(d.getTime())
    ? ""
    : d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

function getInitials(name?: string) {
  if (!name) return "CM";
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [related, setRelated] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    async function fetchPost() {
      try {
        const data = await getBlog(slug);
        setPost(data);

        if (data) {
          const res = await getBlogs({
            category: data.category,
            limit: 6,
          });
          const list = "data" in res ? res.data : res;
          setRelated(list.filter((p) => p.slug !== slug).slice(0, 3));
        }
      } catch (err) {
        console.error("Failed to fetch blog:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, [slug]);

  /* Read-progress bar driven by scroll position. */
  useEffect(() => {
    function onScroll() {
      const el = document.documentElement;
      const total = el.scrollHeight - el.clientHeight;
      const pct = total > 0 ? Math.min(100, (el.scrollTop / total) * 100) : 0;
      setProgress(pct);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const shareLinks = useMemo(() => {
    if (!post || typeof window === "undefined") return null;
    const url = encodeURIComponent(`${window.location.origin}/blog/${post.slug}`);
    const title = encodeURIComponent(post.title);
    return {
      x: `https://x.com/intent/tweet?url=${url}&text=${title}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      whatsapp: `https://wa.me/?text=${title}%20${url}`,
    };
  }, [post]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#FAF7F2] grid place-items-center">
        <div className="flex flex-col items-center gap-4 text-stone-500">
          <div className="w-10 h-10 border-2 border-[#FF6600] border-t-transparent rounded-full animate-spin" />
          <p className="font-jakarta text-[11px] font-semibold uppercase tracking-[0.22em]">
            Loading article…
          </p>
        </div>
      </main>
    );
  }

  if (!post) return notFound();

  return (
    <main className="relative">
      {/* Reading-progress bar */}
      <div
        aria-hidden
        className="fixed top-0 left-0 right-0 h-[3px] bg-stone-900/5 z-50 pointer-events-none"
      >
        <div
          className="h-full bg-[#FF6600] transition-[width] duration-150 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <ArticleHero post={post} />
      <ArticleBody post={post} shareLinks={shareLinks} />
      {related.length > 0 && <RelatedPosts posts={related} />}
      <CTA />
    </main>
  );
}

/* ─── Hero ─────────────────────────────────────────────────── */
function ArticleHero({ post }: { post: BlogPost }) {
  return (
    <section className="relative bg-[#FAF7F2] overflow-hidden">
      <div className="hero-grain-paper" aria-hidden />
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 50% 50% at 100% 0%, rgba(255,102,0,0.08), transparent 60%)",
        }}
      />

      <div className="container relative z-10 pt-10 md:pt-16 pb-12 md:pb-16">
        {/* Breadcrumb / back */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between gap-4 mb-10 md:mb-14 pb-5 border-b border-stone-900/10"
        >
          <Link
            href="/blog"
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
            All articles
          </Link>
          <span className="font-jakarta text-[10.5px] font-semibold uppercase tracking-[0.22em] text-stone-500 flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#FF6600]" />
            {post.category || "Journal"}
          </span>
        </motion.div>

        {/* Meta strip */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="flex flex-wrap items-center gap-3 mb-6"
        >
          {post.publishedAt && (
            <span className="font-jakarta text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-500">
              {fmtDate(post.publishedAt)}
            </span>
          )}
          {post.readTime && (
            <>
              <span className="w-1 h-1 rounded-full bg-stone-300" aria-hidden />
              <span className="font-jakarta text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-500">
                {post.readTime}
              </span>
            </>
          )}
          {post.featured && (
            <>
              <span className="w-1 h-1 rounded-full bg-stone-300" aria-hidden />
              <span className="font-jakarta text-[10px] font-semibold uppercase tracking-[0.22em] text-[#FF6600] flex items-center gap-1.5">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#FF6600]" />
                Featured
              </span>
            </>
          )}
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: [0.2, 0.7, 0.2, 1] }}
          className="font-funnel text-stone-900 font-bold leading-[1.0] tracking-[-0.035em] text-[clamp(2.25rem,5.4vw,4.75rem)] max-w-[22ch]"
        >
          {post.title}
        </motion.h1>

        {/* Excerpt as lede */}
        {post.excerpt && (
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-7 max-w-[64ch] font-jakarta text-[17px] md:text-[18.5px] leading-[1.6] text-stone-700"
            style={{
              fontFamily: "var(--font-newsreader), Georgia, serif",
              fontStyle: "italic",
              fontWeight: 400,
            }}
          >
            {post.excerpt}
          </motion.p>
        )}

        {/* Author row */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-10 flex items-center gap-4"
        >
          <div className="grid place-items-center w-12 h-12 rounded-full bg-[#FF6600] text-stone-50 ring-2 ring-[#FAF7F2] shrink-0">
            <span className="font-funnel text-[15px] font-bold tracking-tight">
              {getInitials(post.author)}
            </span>
          </div>
          <div>
            <p className="font-funnel text-[15px] font-bold tracking-[-0.015em] text-stone-900 leading-none">
              {post.author || "Creative Monk Studio"}
            </p>
            <p className="font-jakarta text-[11px] text-stone-500 mt-1.5">
              Written by the team that shipped it
            </p>
          </div>
        </motion.div>

        {/* Cover image */}
        {post.coverImage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.35, ease: [0.2, 0.7, 0.2, 1] }}
            className="mt-12 md:mt-16"
          >
            <div className="relative aspect-[16/9] rounded-3xl overflow-hidden border border-stone-900/10 bg-stone-100 shadow-[0_30px_60px_-30px_rgba(15,12,8,0.3)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.coverImage}
                alt={post.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}

/* ─── Body ────────────────────────────────────────────────── */
function ArticleBody({
  post,
  shareLinks,
}: {
  post: BlogPost;
  shareLinks: { x: string; linkedin: string; whatsapp: string } | null;
}) {
  return (
    <section className="relative bg-[#FAF7F2] border-t border-stone-900/10 overflow-hidden">
      <div className="hero-grain-paper" aria-hidden />

      <div className="container relative z-10 py-16 md:py-24">
        <div className="grid grid-cols-12 gap-x-8 gap-y-12">
          {/* Sticky sidebar */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-32 space-y-8">
              <div>
                <p className="font-jakarta text-[10px] font-semibold uppercase tracking-[0.24em] text-stone-500 mb-3">
                  Category
                </p>
                <span className="inline-flex items-center gap-2 rounded-full border border-stone-900/15 px-3 py-1.5 font-jakarta text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-800">
                  <span className="block w-1.5 h-1.5 rounded-full bg-[#FF6600]" />
                  {post.category || "Journal"}
                </span>
              </div>

              {post.tags && post.tags.length > 0 && (
                <div>
                  <p className="font-jakarta text-[10px] font-semibold uppercase tracking-[0.24em] text-stone-500 mb-3">
                    Tags
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="font-mono-ui text-[10px] uppercase tracking-[0.18em] text-stone-600 border border-stone-900/10 rounded-full px-2.5 py-1"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {shareLinks && (
                <div>
                  <p className="font-jakarta text-[10px] font-semibold uppercase tracking-[0.24em] text-stone-500 mb-3">
                    Share this
                  </p>
                  <div className="flex flex-col gap-2">
                    <ShareButton href={shareLinks.x} label="On X / Twitter" />
                    <ShareButton href={shareLinks.linkedin} label="On LinkedIn" />
                    <ShareButton href={shareLinks.whatsapp} label="On WhatsApp" />
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* Article content */}
          <div className="col-span-12 lg:col-span-9">
            <article
              className="max-w-[68ch] font-jakarta text-stone-800
                [&_p]:mt-5 [&_p]:text-[16.5px] [&_p]:leading-[1.75] [&_p]:text-stone-700 [&_p:first-child]:mt-0
                [&_p:first-of-type]:text-[18px] [&_p:first-of-type]:text-stone-800
                [&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:font-funnel [&_h2]:text-stone-900 [&_h2]:font-bold [&_h2]:text-[clamp(1.4rem,2.2vw,1.85rem)] [&_h2]:tracking-[-0.025em] [&_h2]:leading-[1.2]
                [&_h3]:mt-10 [&_h3]:mb-3 [&_h3]:font-funnel [&_h3]:text-stone-900 [&_h3]:font-bold [&_h3]:text-[clamp(1.15rem,1.7vw,1.45rem)] [&_h3]:tracking-[-0.02em]
                [&_h4]:mt-8 [&_h4]:mb-2 [&_h4]:font-funnel [&_h4]:text-stone-900 [&_h4]:font-bold [&_h4]:text-[clamp(1rem,1.4vw,1.2rem)]
                [&_strong]:text-stone-900 [&_strong]:font-bold
                [&_em]:font-newsreader [&_em]:italic [&_em]:font-normal
                [&_a]:text-[#FF6600] [&_a]:font-semibold [&_a:hover]:underline [&_a]:underline-offset-2 [&_a]:decoration-[#FF6600]/30
                [&_blockquote]:my-8 [&_blockquote]:pl-6 [&_blockquote]:border-l-[3px] [&_blockquote]:border-[#FF6600] [&_blockquote]:py-1 [&_blockquote]:font-newsreader [&_blockquote]:italic [&_blockquote]:text-[18px] [&_blockquote]:text-stone-800 [&_blockquote]:leading-[1.55]
                [&_ul]:mt-5 [&_ul]:list-disc [&_ul]:pl-6 [&_ul_li]:mt-2 [&_ul_li]:leading-[1.75] [&_ul_li]:text-stone-700
                [&_ol]:mt-5 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol_li]:mt-2 [&_ol_li]:leading-[1.75] [&_ol_li]:text-stone-700
                [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded-md [&_code]:bg-stone-200/60 [&_code]:text-[14px] [&_code]:font-mono-ui [&_code]:text-stone-900
                [&_pre]:my-7 [&_pre]:p-5 [&_pre]:rounded-2xl [&_pre]:bg-stone-900 [&_pre]:text-stone-50 [&_pre]:overflow-x-auto [&_pre_code]:bg-transparent [&_pre_code]:text-stone-50
                [&_img]:my-8 [&_img]:rounded-2xl [&_img]:border [&_img]:border-stone-900/10
                [&_hr]:my-12 [&_hr]:border-stone-900/15
                [&_table]:my-7 [&_table]:w-full [&_table]:border-collapse [&_th]:px-4 [&_th]:py-2 [&_th]:bg-stone-900 [&_th]:text-stone-50 [&_th]:text-left [&_th]:font-jakarta [&_th]:text-[12px] [&_th]:font-semibold [&_th]:uppercase [&_th]:tracking-[0.18em] [&_td]:px-4 [&_td]:py-3 [&_td]:border-b [&_td]:border-stone-900/10 [&_td]:text-[14.5px]"
              dangerouslySetInnerHTML={{ __html: post.content || "" }}
            />

            {/* Bottom byline + share */}
            <div className="mt-14 pt-10 border-t border-stone-900/10 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-[68ch]">
              <div className="flex items-center gap-4">
                <div className="grid place-items-center w-14 h-14 rounded-full bg-[#FF6600] text-stone-50 ring-2 ring-[#FAF7F2] shrink-0">
                  <span className="font-funnel text-[17px] font-bold tracking-tight">
                    {getInitials(post.author)}
                  </span>
                </div>
                <div>
                  <p className="font-jakarta text-[10.5px] font-semibold uppercase tracking-[0.22em] text-stone-500 mb-1.5">
                    Written by
                  </p>
                  <p className="font-funnel text-[16px] font-bold tracking-[-0.015em] text-stone-900 leading-none">
                    {post.author || "Creative Monk Studio"}
                  </p>
                  <p
                    className="text-[12.5px] text-stone-600 mt-1.5"
                    style={{
                      fontFamily: "var(--font-newsreader), Georgia, serif",
                      fontStyle: "italic",
                      fontWeight: 400,
                    }}
                  >
                    The team that shipped this
                  </p>
                </div>
              </div>

              {shareLinks && (
                <div className="md:text-right">
                  <p className="font-jakarta text-[10.5px] font-semibold uppercase tracking-[0.22em] text-stone-500 mb-3">
                    Share this article
                  </p>
                  <div className="flex md:justify-end gap-2">
                    <ShareIconButton href={shareLinks.x} label="X" icon="x" />
                    <ShareIconButton
                      href={shareLinks.linkedin}
                      label="LinkedIn"
                      icon="linkedin"
                    />
                    <ShareIconButton
                      href={shareLinks.whatsapp}
                      label="WhatsApp"
                      icon="whatsapp"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ShareButton({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex items-center justify-between gap-2 rounded-xl border border-stone-900/10 bg-stone-50 px-3.5 py-2 cursor-pointer hover:border-[#FF6600] hover:bg-white transition-all duration-300"
    >
      <span className="font-jakarta text-[12px] font-semibold text-stone-800">
        {label}
      </span>
      <svg
        width="12"
        height="12"
        viewBox="0 0 14 14"
        fill="none"
        className="text-stone-400 group-hover:text-[#FF6600] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all"
        aria-hidden
      >
        <path
          d="M2 12 L12 2 M5 2 L12 2 L12 9"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </a>
  );
}

function ShareIconButton({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: "x" | "linkedin" | "whatsapp";
}) {
  const ICONS: Record<typeof icon, ReactElement> = {
    x: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden width="14" height="14">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    linkedin: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden width="14" height="14">
        <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.61 0 4.27 2.38 4.27 5.47v6.27zM5.34 7.43A2.07 2.07 0 1 1 5.34 3.3a2.07 2.07 0 0 1 0 4.13zm1.78 13.02H3.56V9h3.56v11.45zM22.22 0H1.77C.8 0 0 .77 0 1.72v20.56C0 23.23.8 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
      </svg>
    ),
    whatsapp: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden width="14" height="14">
        <path d="M17.5 14.4c-.3-.1-1.8-.9-2-1s-.5-.1-.7.1c-.2.3-.8 1-1 1.2-.2.2-.4.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2-.2-.3 0-.5.1-.6.1-.1.3-.4.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5s-.7-1.6-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.6-.3M12 22h-.1c-1.8 0-3.5-.5-5-1.4l-3.7 1 1-3.6c-1-1.6-1.5-3.4-1.5-5.3 0-5.4 4.4-9.9 9.9-9.9 2.6 0 5.1 1 7 2.9s2.9 4.3 2.9 7c0 5.5-4.4 9.9-9.9 9.9z" />
      </svg>
    ),
  };
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Share on ${label}`}
      className="grid place-items-center w-10 h-10 rounded-full border border-stone-900/15 text-stone-700 hover:bg-stone-900 hover:text-stone-50 hover:border-stone-900 transition-all cursor-pointer"
    >
      {ICONS[icon]}
    </a>
  );
}

/* ─── Related ───────────────────────────────────────────────── */
function RelatedPosts({ posts }: { posts: BlogPost[] }) {
  return (
    <section className="relative bg-[#FAF7F2] border-t border-stone-900/10 overflow-hidden">
      <div className="hero-grain-paper" aria-hidden />

      <div className="container relative z-10 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-10 md:mb-12"
        >
          <div>
            <div className="flex items-center gap-3 mb-5">
              <span aria-hidden className="block h-px w-9 bg-[#FF6600]" />
              <span className="font-jakarta text-[11px] font-semibold uppercase tracking-[0.26em] text-stone-600">
                Keep reading
              </span>
            </div>
            <h2 className="font-funnel text-stone-900 font-bold leading-[1.0] tracking-[-0.03em] text-[clamp(1.85rem,3vw,2.5rem)] max-w-[22ch]">
              More from{" "}
              <span
                style={{
                  fontFamily: "var(--font-newsreader), Georgia, serif",
                  fontStyle: "italic",
                  fontWeight: 500,
                  color: "#FF6600",
                }}
              >
                the journal.
              </span>
            </h2>
          </div>
          <Link
            href="/blog"
            className="group inline-flex items-center gap-2 font-jakarta text-[12px] font-semibold uppercase tracking-[0.22em] text-stone-900 cursor-pointer"
          >
            <span className="relative">
              See all articles
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {posts.map((post, i) => (
            <RelatedCard key={post.slug} post={post} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function RelatedCard({ post, index }: { post: BlogPost; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay: index * 0.07 }}
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
          <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-[#FAF7F2]/95 backdrop-blur-sm border border-stone-900/10 px-3 py-1.5 font-jakarta text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-900">
            <span className="block w-1 h-1 rounded-full bg-[#FF6600]" />
            {post.category || "Journal"}
          </span>
        </div>

        <div className="p-6 flex flex-col flex-1">
          <p className="font-jakarta text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-500 mb-3">
            {fmtDate(post.publishedAt) || "Recent"} · {post.readTime || "5 min"}
          </p>
          <h3 className="font-funnel text-[clamp(1.05rem,1.4vw,1.25rem)] leading-[1.2] tracking-[-0.02em] font-bold text-stone-900 line-clamp-2 flex-1">
            {post.title}
          </h3>
          <span className="mt-5 pt-4 border-t border-stone-900/10 font-jakarta text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-900 inline-flex items-center gap-1.5 group-hover:text-[#FF6600] transition-colors">
            Read article
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
      </Link>
    </motion.article>
  );
}
