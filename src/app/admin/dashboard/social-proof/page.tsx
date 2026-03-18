"use client";

import { CmsCollectionManager, type CmsField } from "@/components/admin/cms-collection-manager";

const clientFields: CmsField[] = [
  { name: "name", label: "Client Name", type: "text" },
  { name: "website", label: "Website", type: "text" },
  { name: "logo", label: "Logo URL", type: "media", uploadFolder: "creative-monk/clients" },
  { name: "status", label: "Status", type: "text" },
  { name: "order", label: "Order", type: "number" },
  { name: "isFeatured", label: "Featured", type: "checkbox" },
];

const testimonialFields: CmsField[] = [
  { name: "name", label: "Name", type: "text" },
  { name: "role", label: "Role", type: "text" },
  { name: "company", label: "Company", type: "text" },
  { name: "text", label: "Testimonial", type: "textarea" },
  { name: "rating", label: "Rating", type: "number" },
  { name: "avatar", label: "Avatar", type: "media", uploadFolder: "creative-monk/testimonials" },
  { name: "order", label: "Order", type: "number" },
  { name: "isFeatured", label: "Featured", type: "checkbox" },
  { name: "isActive", label: "Active", type: "checkbox" },
];

export default function AdminSocialProofPage() {
  const token = typeof window !== "undefined" ? localStorage.getItem("creative-monk-admin-token") || "" : "";

  return (
    <div className="space-y-8">
      <CmsCollectionManager
        title="Clients"
        description="Manage brand logos and client list presentation."
        adminPath="admin/clients"
        resourcePath="clients"
        token={token}
        primaryField="name"
        fields={clientFields}
        createDefaults={{
          name: "",
          website: "",
          logo: "",
          status: "active",
          order: 0,
          isFeatured: false,
        }}
      />

      <CmsCollectionManager
        title="Testimonials"
        description="Manage homepage and case-study social proof."
        adminPath="admin/testimonials"
        resourcePath="testimonials"
        token={token}
        primaryField="name"
        fields={testimonialFields}
        createDefaults={{
          name: "",
          role: "",
          company: "",
          text: "",
          rating: 5,
          avatar: "",
          order: 0,
          isFeatured: false,
          isActive: true,
        }}
      />
    </div>
  );
}
