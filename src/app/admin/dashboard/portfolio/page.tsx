"use client";

import { CmsCollectionManager, type CmsField } from "@/components/admin/cms-collection-manager";

const fields: CmsField[] = [
  { name: "title", label: "Title", type: "text" },
  { 
    name: "category", 
    label: "Category", 
    type: "select", 
    placeholder: "Select category...",
    options: [
      { label: "Web Development", value: "Web Development" },
      { label: "Graphic Designing", value: "Graphic Designing" },
      { label: "Packaging", value: "Packaging" },
      { label: "Brand Identity", value: "Brand Identity" },
    ]
  },
  { name: "client", label: "Client", type: "text" },
  { name: "description", label: "Description", type: "textarea" },
  { name: "points", label: "Points Array JSON", type: "json" },
  { name: "link", label: "Live URL / Case Study URL", type: "text" },
  { name: "duration", label: "Duration", type: "text" },
  { 
    name: "image", 
    label: "Cover Image", 
    type: "media", 
    uploadFolder: "creative-monk/portfolio",
    condition: (values: Record<string, unknown>) => ["Web Development", "Brand Identity"].includes(values.category as string)
  },
  { 
    name: "gallery", 
    label: "Gallery (Max 10 for GD, Max 5 for Packaging)", 
    type: "media-array", 
    uploadFolder: "creative-monk/portfolio",
    condition: (values: Record<string, unknown>) => ["Graphic Designing", "Packaging"].includes(values.category as string)
  },
  { name: "order", label: "Order", type: "number" },
  { name: "isActive", label: "Active", type: "checkbox" },
];

export default function AdminPortfolioPage() {
  const token = typeof window !== "undefined" ? localStorage.getItem("creative-monk-admin-token") || "" : "";

  return (
    <CmsCollectionManager
      title="Portfolio Items"
      description="Manage standalone portfolio items shown in the portfolio view."
      adminPath="admin/portfolio"
      resourcePath="portfolio"
      token={token}
      primaryField="title"
      fields={fields}
      createDefaults={{
        title: "",
        category: "",
        client: "",
        description: "",
        points: [],
        link: "",
        duration: "",
        image: "",
        gallery: [],
        order: 0,
        isActive: true,
      }}
    />
  );
}
