import type { Metadata } from "next";
import type { Seo, SiteSettings } from "./types";

const FALLBACK_SITE_URL = "https://thecreativemonk.in";

export function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || FALLBACK_SITE_URL;
}

export function absoluteUrl(path = "/") {
  return new URL(path, getSiteUrl()).toString();
}

export function buildMetadata(
  seo: Seo | undefined,
  site: SiteSettings | null,
  overrides?: Partial<Metadata>,
): Metadata {
  const title =
    seo?.title ||
    site?.seoDefaults?.title ||
    "Creative Monk | Digital Marketing Agency";
  const description =
    seo?.description ||
    site?.seoDefaults?.description ||
    site?.description ||
    "Creative Monk helps ambitious brands grow through websites, SEO, performance marketing, and design.";
  const canonical = seo?.canonical || getSiteUrl();
  const ogImage =
    seo?.ogImage || site?.seoDefaults?.ogImage || absoluteUrl("/logo.webp");
  const keywords = seo?.keywords || site?.seoDefaults?.keywords || [];

  return {
    title,
    description,
    keywords,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: site?.companyName || "Creative Monk",
      type: "website",
      images: [{ url: ogImage, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    ...overrides,
  };
}

export function stripMarkdownLikeContent(content: string) {
  return content.replace(/[#*_`>-]/g, "").replace(/\s+/g, " ").trim();
}
