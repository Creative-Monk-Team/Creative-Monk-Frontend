"use client";

import Link from "next/link";
import { ArrowRight, Calendar, Clock, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

// This would typically come from an API/CMS. Using static data for demo matching the new theme.
const recentPosts = [
  {
    slug: "top-seo-strategies-2024",
    title: "10 SEO Strategies That Actually Work in 2024",
    excerpt:
      "Stop wasting time on outdated tactics. Here's exactly what Google is looking for this year.",
    category: "SEO",
    date: "Mar 15, 2024",
    readTime: "8 min read",
    image:
      "https://images.unsplash.com/photo-1432821596592-e2c18b78144f?auto=format&fit=crop&q=80&w=800",
  },
  {
    slug: "social-media-trends-2024",
    title: "The Death of Static Posts: Social Media in 2024",
    excerpt:
      "Why short-form video is no longer optional, and how brands are adapting to the new algorithm.",
    category: "Social Media",
    date: "Mar 10, 2024",
    readTime: "6 min read",
    image:
      "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=800",
  },
  {
    slug: "next-js-vs-wordpress",
    title: "Headless CMS vs WordPress: What's Right for You?",
    excerpt:
      "A technical breakdown of why enterprise companies are abandoning legacy monolithic architectures.",
    category: "Web Development",
    date: "Mar 05, 2024",
    readTime: "12 min read",
    image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800",
  },
];

export function RecentBlogs() {
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
          {recentPosts.map((post, index) => (
            <motion.article
              key={post.slug}
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
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-in-out"
                />
                <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-300" />
              </div>

              <div className="p-6 md:p-8 flex flex-col flex-grow">
                <div className="flex items-center gap-4 text-xs font-medium text-gray-400 mb-4">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" /> {post.date}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" /> {post.readTime}
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
