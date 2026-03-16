import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://thecreativemonk.in";
  const now = new Date();

  const servicesSlugs = ["web-design", "seo", "social-media", "branding", "content"];
  const blogSlugs = ["top-seo-strategies-2024", "website-speed-matters", "social-media-trends-2024", "brand-identity-guide", "local-seo-for-businesses", "next-js-vs-wordpress"];

  return [
    { url: baseUrl, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/services`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/portfolio`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.7 },
    ...servicesSlugs.map((slug) => ({ url: `${baseUrl}/services/${slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.7 })),
    ...blogSlugs.map((slug) => ({ url: `${baseUrl}/blog/${slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}
