"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Calendar, Clock, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { getBlogs } from "@/lib/api";
import type { BlogPost } from "@/lib/types";

export function RecentBlogs() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const res = await getBlogs({ limit: 3 });
        const blogsData = "data" in res ? res.data : res;
        setBlogs(blogsData);
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchBlogs();
  }, []);

  if (!loading && blogs.length === 0) {
    return null; // Hide section if no blogs exist
  }

  return (
    <section className="section-padding bg-gray-50 border-t border-gray-100">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <span className="section-label inline-block mb-3">
              Insights & News
            </span>
            <h2
              className="text-3xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight"
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              Latest From Our <span className="text-[#FF6600]">Blog</span>
            </h2>
            <p className="text-gray-500 text-lg">
              Expert tips, strategies, and case studies to help you navigate the
              digital landscape.
            </p>
          </div>
          <Link
            href="/blog"
            className="hidden md:flex items-center gap-2 text-[#FF6600] font-semibold hover:gap-3 transition-all"
          >
            View All Posts <ArrowRight className="h-5 w-5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl h-[400px] animate-pulse border border-gray-100"
                />
              ))
            : blogs.map((post, index) => (
                <motion.article
                  key={post._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full"
                >
                  <div className="relative h-56 overflow-hidden">
                    <div
                      className="absolute top-4 left-4 z-10 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold text-gray-900 shadow-sm"
                      style={{ fontFamily: "var(--font-outfit)" }}
                    >
                      {post.category}
                    </div>
                    {post.coverImage ? (
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-in-out"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-300" />
                  </div>

                  <div className="p-6 md:p-8 flex flex-col flex-grow">
                    <div className="flex items-center gap-4 text-xs font-medium text-gray-400 mb-4">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />{" "}
                        {new Date(post.publishedAt || "").toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />{" "}
                        {post.readTime || "5 min read"}
                      </div>
                    </div>

                    <h3
                      className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#FF6600] transition-colors line-clamp-2"
                      style={{ fontFamily: "var(--font-outfit)" }}
                    >
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h3>

                    <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3 flex-grow">
                      {post.excerpt}
                    </p>

                    <Link
                      href={`/blog/${post.slug}`}
                      className="mt-auto inline-flex items-center font-semibold text-sm text-gray-900 group-hover:text-[#FF6600] transition-colors"
                    >
                      Read Article{" "}
                      <ChevronRight className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </motion.article>
              ))}
        </div>

        <div className="mt-10 text-center md:hidden">
          <Link href="/blog" className="btn-outline-orange inline-flex">
            View All Posts
          </Link>
        </div>
      </div>
    </section>
  );
}
