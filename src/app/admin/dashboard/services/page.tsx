"use client";

import { CmsCollectionManager, type CmsField } from "@/components/admin/cms-collection-manager";

const fields: CmsField[] = [
  { name: "slug", label: "Slug", type: "text" },
  { name: "title", label: "Title", type: "text" },
  { name: "shortTitle", label: "Short Title", type: "text" },
  { name: "tagline", label: "Tagline", type: "textarea" },
  { name: "shortDescription", label: "Short Description", type: "textarea" },
  { name: "longDescription", label: "Long Description", type: "textarea" },
  { name: "category", label: "Category Slug", type: "text" },
  { name: "icon", label: "Icon Name", type: "text" },
  { name: "image", label: "Image URL", type: "media", uploadFolder: "creative-monk/services" },
  { name: "features", label: "Features JSON", type: "json" },
  { name: "process", label: "Process JSON", type: "json" },
  { name: "outcomes", label: "Outcomes JSON", type: "json" },
  { name: "faqs", label: "FAQs JSON", type: "json" },
  { name: "detailContent", label: "Detail Content JSON", type: "json" },
  { name: "seo", label: "SEO JSON", type: "json" },
  { name: "order", label: "Order", type: "number" },
  { name: "isFeatured", label: "Featured", type: "checkbox" },
  { name: "isActive", label: "Active", type: "checkbox" },
];

export default function AdminServicesPage() {
  const token = typeof window !== "undefined" ? localStorage.getItem("creative-monk-admin-token") || "" : "";

  return (
    <div className="space-y-6">
      <CmsCollectionManager
        title="Services"
        description="Manage service detail pages and homepage service cards."
        adminPath="admin/services"
        resourcePath="services"
        token={token}
        primaryField="title"
        fields={fields}
        createDefaults={{
          slug: "",
          title: "",
          shortTitle: "",
          tagline: "",
          shortDescription: "",
          longDescription: "",
          category: "web-design",
          icon: "Sparkles",
          image: "",
          features: [],
          process: [],
          outcomes: [],
          faqs: [],
          detailContent: {},
          seo: {},
          order: 0,
          isFeatured: false,
          isActive: true,
        }}
      />
    </div>
  );
}
