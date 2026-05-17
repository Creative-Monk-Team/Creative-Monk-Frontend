"use client";

import { CmsCollectionManager, type CmsField } from "@/components/admin/cms-collection-manager";

const fields: CmsField[] = [
  { name: "slug", label: "Slug", type: "text" },
  { name: "title", label: "Title", type: "text" },
  { name: "excerpt", label: "Excerpt", type: "textarea" },
  { name: "content", label: "Content (rich text)", type: "richtext" },
  { name: "coverImage", label: "Cover Image URL", type: "media", uploadFolder: "creative-monk/blogs" },
  { name: "category", label: "Category", type: "text" },
  { name: "tags", label: "Tags JSON", type: "json" },
  { name: "author", label: "Author", type: "text" },
  { name: "publishedAt", label: "Published At", type: "date" },
  { name: "readTime", label: "Read Time", type: "text" },
  { name: "featured", label: "Featured", type: "checkbox" },
  { name: "isPublished", label: "Published", type: "checkbox" },
  { name: "seo", label: "SEO JSON", type: "json" },
];

export default function AdminBlogsPage() {
  const token = typeof window !== "undefined" ? localStorage.getItem("creative-monk-admin-token") || "" : "";

  return (
    <CmsCollectionManager
      title="Blogs"
      description="Manage published articles, excerpts, and SEO metadata."
      adminPath="admin/blogs"
      resourcePath="blogs"
      token={token}
      primaryField="title"
      fields={fields}
      createDefaults={{
        slug: "",
        title: "",
        excerpt: "",
        content: "",
        coverImage: "",
        category: "",
        tags: [],
        author: "Creative Monk Team",
        publishedAt: "",
        readTime: "5 min read",
        featured: false,
        isPublished: true,
        seo: {},
      }}
    />
  );
}
