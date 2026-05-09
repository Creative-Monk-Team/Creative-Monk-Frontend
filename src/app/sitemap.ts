import type { MetadataRoute } from "next";
import { getServices, getBlogs, getCaseStudies } from "@/lib/api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://thecreativemonk.in";
  const now = new Date();

  // Fetch all dynamic data
  const [services, blogs, caseStudies] = await Promise.all([
    getServices() as Promise<any>,
    getBlogs() as Promise<any>,
    getCaseStudies() as Promise<any>,
  ]);

  // Core Pages
  const corePages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/services`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/portfolio`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/case-studies`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/career`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.7 },
    { url: `${baseUrl}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
    { url: `${baseUrl}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
  ];

  // Helper to extract data from potentially paginated response
  const extractData = <T>(res: T[] | { data: T[] }): T[] => {
    if (Array.isArray(res)) return res;
    return res.data || [];
  };

  const blogList: any[] = extractData(blogs);
  const caseStudyList: any[] = extractData(caseStudies);
  const serviceList: any[] = extractData(services);

  // Dynamic Service Pages
  const servicePages: MetadataRoute.Sitemap = serviceList.map((service) => ({
    url: `${baseUrl}/services/${service.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // Dynamic Blog Pages
  const blogPages: MetadataRoute.Sitemap = blogList.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  // Dynamic Case Study Pages
  const caseStudyPages: MetadataRoute.Sitemap = caseStudyList.map((cs) => ({
    url: `${baseUrl}/case-studies/${cs.id}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...corePages, ...servicePages, ...blogPages, ...caseStudyPages];
}
