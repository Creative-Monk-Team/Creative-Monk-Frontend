"use client";

import { use, useEffect, useState } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Clock, ArrowLeft, Calendar, User } from "lucide-react";
import { CTA } from "@/components/sections/cta";
import { getBlog } from "@/lib/api";
import type { BlogPost } from "@/lib/types";

export default function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPost() {
      try {
        const data = await getBlog(slug);
        setPost(data);
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF6600]"></div>
      </div>
    );
  }

  if (!post) return notFound();

  return (
    <>
      <div className="py-8 border-b" style={{ background: "#fafafa" }}>
        <div className="container">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-[#FF6600] text-sm font-medium transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Blog
          </Link>
        </div>
      </div>

      <article className="section-padding bg-white">
        <div className="container max-w-4xl mx-auto">
          <span className="section-label block mb-4">{post.category}</span>
          <h1
            className="text-3xl md:text-5xl font-black mb-6"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            {post.title}
          </h1>
          <div className="flex flex-wrap gap-6 text-sm text-gray-400 mb-8">
            <span className="flex items-center gap-1.5">
              <User className="h-4 w-4" /> {post.author || "Creative Monk Team"}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />{" "}
              {new Date(post.publishedAt || "").toLocaleDateString()}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" /> {post.readTime || "5 min read"}
            </span>
          </div>

          {post.coverImage && (
            <div className="rounded-2xl overflow-hidden mb-10 shadow-xl border border-gray-100">
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-auto md:h-[500px] object-cover"
              />
            </div>
          )}

          <div
            className="prose prose-lg max-w-none text-gray-600 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {post.tags && post.tags.length > 0 && (
            <div className="mt-16 pt-10 border-t flex gap-3 flex-wrap">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-orange-50 text-[#FF6600] border border-orange-100 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
                >
                  # {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>
      <CTA />
    </>
  );
}
