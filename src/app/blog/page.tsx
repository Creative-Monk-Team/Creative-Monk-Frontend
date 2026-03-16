import type { Metadata } from "next";
import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";
import { CTA } from "@/components/sections/cta";
import { PageHeader } from "@/components/layout/page-header";
import { blogPosts, blogCategoryColors } from "@/data/site";

export const metadata: Metadata = {
  title: "Blog | Creative Monk – Digital Marketing Insights",
  description:
    "Read expert insights on web design, SEO, social media marketing, and branding from the Creative Monk team. Stay ahead with our latest digital marketing tips.",
};

export default function BlogPage() {
  const featured = blogPosts.find((p) => p.featured);
  const rest = blogPosts.filter((p) => !p.featured);

  return (
    <>
      <PageHeader
        badge="Insights"
        title1="Blog &"
        title2="Insights."
        description="Expert tips, strategies, and insights from the Creative Monk team."
      />

      <section className="section-padding bg-white">
        <div className="container">
          {/* Featured post */}
          {featured && (
            <Link href={`/blog/${featured.slug}`} className="group block mb-14">
              <div
                className="grid grid-cols-1 lg:grid-cols-2 gap-8 rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                style={{ border: "1px solid #f0f0f0" }}
              >
                <div className="relative h-64 lg:h-auto min-h-[300px] overflow-hidden">
                  <img
                    src={featured.image}
                    alt={featured.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span
                    className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold text-white"
                    style={{
                      background:
                        blogCategoryColors[featured.category] || "#FF6600",
                    }}
                  >
                    Featured
                  </span>
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <span
                    className="text-xs font-bold uppercase tracking-wider mb-3"
                    style={{ color: "#FF6600" }}
                  >
                    {featured.category}
                  </span>
                  <h2
                    className="text-2xl md:text-3xl font-black mb-4 group-hover:text-[#FF6600] transition-colors"
                    style={{ fontFamily: "var(--font-poppins)" }}
                  >
                    {featured.title}
                  </h2>
                  <p className="text-gray-500 leading-relaxed mb-6">
                    {featured.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" /> {featured.readTime}
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-[#FF6600] group-hover:gap-2 transition-all">
                      Read More <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rest.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group card-hover block rounded-2xl overflow-hidden bg-white border"
                style={{ border: "1px solid #f0f0f0" }}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <span
                    className="text-xs font-bold uppercase tracking-wider"
                    style={{
                      color: blogCategoryColors[post.category] || "#FF6600",
                    }}
                  >
                    {post.category}
                  </span>
                  <h3
                    className="font-black text-lg mt-2 mb-3 group-hover:text-[#FF6600] transition-colors line-clamp-2"
                    style={{ fontFamily: "var(--font-poppins)" }}
                  >
                    {post.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" /> {post.readTime}
                    </span>
                    <span>{post.date}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <CTA />
    </>
  );
}
