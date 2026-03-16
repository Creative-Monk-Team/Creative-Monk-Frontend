import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Clock, ArrowLeft, Calendar, User } from "lucide-react";
import { CTA } from "@/components/sections/cta";
import { blogPosts, getBlogPostBySlug } from "@/data/site";

// Full blog post content - will be fetched from backend in the future
const postContent: Record<string, { content: string; tags: string[] }> = {
  "top-seo-strategies-2024": {
    tags: ["SEO", "Google", "Digital Marketing"],
    content: `Search engine optimization in 2024 is about more than just keywords. Here are the strategies that are delivering the best results for businesses today.\n\n## 1. Core Web Vitals Optimization\nGoogle now uses Core Web Vitals as a ranking factor. LCP, FID, and CLS scores directly impact your rankings. Focus on loading speed, interactivity, and visual stability.\n\n## 2. E-E-A-T: Experience, Expertise, Authoritativeness, Trustworthiness\nGoogle rewards content that demonstrates real expertise. Include author bios, cite sources, and build your brand's authority in your niche.\n\n## 3. Topical Authority Over Individual Keywords\nRather than targeting individual keywords, build content clusters around topics you want to own. Create pillar pages with supporting articles.\n\n## 4. AI-Optimized Content\nWith AI-generated content flooding the internet, original research and unique perspectives stand out. Use data, case studies, and first-hand experience.\n\n## 5. Video SEO\nYouTube is the second largest search engine. Create YouTube content and embed it on your pages — it signals engagement and can rank in video carousels.\n\n## Final Thoughts\nSEO in 2024 rewards businesses that genuinely help their users. Focus on creating the best content for your audience, and the rankings will follow.`,
  },
  "website-speed-matters": {
    tags: ["Performance", "Web Development", "UX"],
    content: `A 1-second delay in page load time can cause a 7% reduction in conversions. Here's why speed matters and how to fix it.\n\n## The Numbers Don't Lie\n- 53% of mobile users abandon sites that take more than 3 seconds to load\n- A 100ms delay in load time can reduce conversion rates by 1%\n- Google uses page speed as a ranking factor\n\n## What Slows Down Your Site?\n1. **Unoptimized images** — Use WebP format and lazy loading\n2. **Too many HTTP requests** — Combine CSS/JS files\n3. **No caching** — Browser caching can dramatically reduce load times\n4. **Slow hosting** — Invest in quality hosting\n\n## Quick Wins to Speed Up Your Site\n- Compress all images using tools like Squoosh\n- Enable browser caching\n- Use a CDN (Content Delivery Network)\n- Switch to Next.js for automatic image optimization and code splitting\n\nSpeed is not optional — it's a conversion essential.`,
  },
  "social-media-trends-2024": {
    tags: ["Social Media", "Marketing", "Trends"],
    content: `Social media trends move fast. Here are the trends that are shaping how brands connect with their audience in 2024.\n\n## 1. Short-Form Video Dominance\nReels, TikToks, and YouTube Shorts continue to dominate. Brands that invest in short-form video see dramatically higher engagement rates.\n\n## 2. AI-Powered Content Creation\nAI tools are helping brands create content faster, but authenticity still wins. Use AI to enhance, not replace, your creative process.\n\n## 3. Community-First Strategy\nBuilding genuine communities around your brand is more valuable than chasing viral moments. Focus on engagement, not just follower count.\n\n## 4. Social Commerce\nSelling directly through social platforms is becoming mainstream. Instagram Shops, Facebook Marketplace, and TikTok Shop are growing rapidly.\n\n## Key Takeaway\nThe brands winning on social media in 2024 are those that prioritize genuine connection over vanity metrics.`,
  },
  "brand-identity-guide": {
    tags: ["Branding", "Design", "Strategy"],
    content: `Your brand is much more than your logo. It's the complete experience people have with your business.\n\n## What Makes a Brand?\n- **Visual Identity** — Logo, colors, typography, imagery\n- **Brand Voice** — How you communicate with your audience\n- **Brand Values** — What you stand for\n- **Brand Experience** — How customers feel when they interact with you\n\n## Steps to Build a Strong Brand\n1. **Define Your Purpose** — Why does your business exist beyond profit?\n2. **Know Your Audience** — Who are you trying to reach?\n3. **Research Competitors** — What makes you different?\n4. **Create Your Visual Identity** — Logo, color palette, typography\n5. **Establish Guidelines** — Document everything for consistency\n\n## Why Brand Consistency Matters\nConsistent brands are 3-4x more likely to achieve brand visibility. Every touchpoint should feel cohesive and intentional.`,
  },
  "local-seo-for-businesses": {
    tags: ["Local SEO", "Google Maps", "Small Business"],
    content: `If you run a local business, local SEO can literally make or break your customer acquisition.\n\n## What is Local SEO?\nLocal SEO focuses on optimizing your online presence to attract customers from your geographic area, primarily through Google Maps and local search results.\n\n## Key Local SEO Strategies\n1. **Google My Business Optimization** — Complete your profile, add photos, respond to reviews\n2. **Local Citations** — List your business on Justdial, Sulekha, IndiaMART, and other directories\n3. **Review Management** — Actively request and respond to Google reviews\n4. **Local Keywords** — Target "service + city" keywords in your content\n5. **NAP Consistency** — Ensure your Name, Address, Phone is identical everywhere\n\n## The Map Pack\nAppearing in Google's "Map Pack" (top 3 local results) can drive significant walk-in traffic. Focus on proximity, relevance, and prominence to rank here.`,
  },
  "next-js-vs-wordpress": {
    tags: ["Next.js", "WordPress", "Web Development"],
    content: `Choosing between Next.js and WordPress is one of the most common decisions businesses face when building a website.\n\n## WordPress: The Content King\n- Powers 40%+ of the internet\n- Huge plugin ecosystem\n- Easy content management\n- Great for blogs, ecommerce (WooCommerce)\n- Lower development cost\n\n## Next.js: The Performance Champion\n- Blazing fast with static generation\n- Great SEO capabilities\n- Modern development experience\n- Better for web applications\n- Higher development cost\n\n## When to Choose What?\n- **Choose WordPress** if you need a blog, ecommerce store, or content-heavy site with frequent updates\n- **Choose Next.js** if you need a high-performance web app, custom functionality, or exceptional speed\n\n## Our Recommendation\nAt Creative Monk, we use both. WordPress for most client websites (easier to manage), and Next.js for high-performance projects that need cutting-edge performance.`,
  },
};

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  const title = post?.title || "Blog Post | Creative Monk";
  return {
    title: `${title} | Creative Monk Blog`,
    description: post?.excerpt || "Read insights from Creative Monk.",
    openGraph: { title, images: [{ url: post?.image || "/og-image.png" }] },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) return notFound();

  const content = postContent[slug] || {
    tags: [post.category],
    content:
      "This in-depth article is coming soon. Check back for expert insights from the Creative Monk team.",
  };

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
            style={{ fontFamily: "var(--font-poppins)" }}
          >
            {post.title}
          </h1>
          <div className="flex flex-wrap gap-6 text-sm text-gray-400 mb-8">
            <span className="flex items-center gap-1.5">
              <User className="h-4 w-4" /> {post.author || "Creative Monk Team"}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" /> {post.date}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" /> {post.readTime}
            </span>
          </div>
          <div className="rounded-2xl overflow-hidden mb-10">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-64 md:h-96 object-cover"
            />
          </div>
          <div className="prose prose-lg max-w-none">
            {content.content.split("\n\n").map((block, i) => {
              if (block.startsWith("## "))
                return (
                  <h2
                    key={i}
                    className="text-2xl font-black mt-8 mb-4"
                    style={{
                      fontFamily: "var(--font-poppins)",
                      color: "#1a1a1a",
                    }}
                  >
                    {block.replace("## ", "")}
                  </h2>
                );
              if (block.startsWith("- "))
                return (
                  <ul
                    key={i}
                    className="list-disc list-inside space-y-2 text-gray-600 mb-4"
                  >
                    {block.split("\n").map((l, j) => (
                      <li key={j}>{l.replace("- ", "")}</li>
                    ))}
                  </ul>
                );
              return (
                <p key={i} className="text-gray-600 leading-relaxed mb-5">
                  {block}
                </p>
              );
            })}
          </div>
          <div className="mt-10 pt-6 border-t flex gap-2 flex-wrap">
            {content.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1.5 rounded-full text-xs font-semibold"
                style={{
                  background: "#fff5f0",
                  color: "#FF6600",
                  border: "1px solid #FFD5B7",
                }}
              >
                # {tag}
              </span>
            ))}
          </div>
        </div>
      </article>
      <CTA />
    </>
  );
}
