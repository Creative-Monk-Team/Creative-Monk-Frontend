"use client";

import { CmsCollectionManager, type CmsField } from "@/components/admin/cms-collection-manager";

const fields: CmsField[] = [
  { name: "id", label: "Public ID", type: "text" },
  { name: "title", label: "Title", type: "text" },
  { name: "client", label: "Client", type: "text" },
  { name: "category", label: "Category", type: "text" },
  { name: "description", label: "Description", type: "textarea" },
  { name: "content", label: "Overview Content (rich text)", type: "richtext" },
  { name: "services", label: "Services JSON", type: "json" },
  { name: "challenges", label: "Challenges JSON", type: "json" },
  { name: "solutions", label: "Solutions JSON", type: "json" },
  { name: "results", label: "Results JSON", type: "json" },
  { name: "metrics", label: "Metrics JSON", type: "json" },
  { name: "gallery", label: "Gallery JSON", type: "json" },
  { name: "testimonial", label: "Testimonial JSON", type: "json" },
  { name: "link", label: "Live URL", type: "text" },
  { name: "duration", label: "Duration", type: "text" },
  { name: "image", label: "Cover Image URL", type: "media", uploadFolder: "creative-monk/case-studies" },
  { name: "seo", label: "SEO JSON", type: "json" },
  { name: "order", label: "Order", type: "number" },
  { name: "isFeatured", label: "Featured", type: "checkbox" },
  { name: "isActive", label: "Active", type: "checkbox" },
];

export default function AdminCaseStudiesPage() {
  const token = typeof window !== "undefined" ? localStorage.getItem("creative-monk-admin-token") || "" : "";

  return (
    <CmsCollectionManager
      title="Case Studies"
      description="Manage portfolio pieces and detailed case study pages."
      adminPath="admin/case-studies"
      resourcePath="case-studies"
      token={token}
      primaryField="title"
      fields={fields}
      createDefaults={{
        id: "",
        title: "",
        client: "",
        category: "",
        description: "",
        content: "",
        services: [],
        challenges: [],
        solutions: [],
        results: [],
        metrics: [],
        gallery: [],
        testimonial: {},
        link: "",
        duration: "",
        image: "",
        seo: {},
        order: 0,
        isFeatured: false,
        isActive: true,
      }}
    />
  );
}
