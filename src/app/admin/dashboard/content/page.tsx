"use client";

import { CmsCollectionManager, type CmsField } from "@/components/admin/cms-collection-manager";
import { SiteSettingsEditor } from "@/components/admin/site-settings-editor";

const faqFields: CmsField[] = [
  { name: "question", label: "Question", type: "textarea" },
  { name: "answer", label: "Answer", type: "textarea" },
  { name: "page", label: "Page", type: "text" },
  { name: "order", label: "Order", type: "number" },
  { name: "isActive", label: "Active", type: "checkbox" },
];

const teamFields: CmsField[] = [
  { name: "name", label: "Name", type: "text" },
  { name: "role", label: "Role", type: "text" },
  { name: "bio", label: "Bio", type: "textarea" },
  { name: "image", label: "Image URL", type: "media", uploadFolder: "creative-monk/team" },
  { name: "social", label: "Social JSON", type: "json" },
  { name: "order", label: "Order", type: "number" },
  { name: "isActive", label: "Active", type: "checkbox" },
];

const careerFields: CmsField[] = [
  { name: "title", label: "Title", type: "text" },
  { name: "department", label: "Department", type: "text" },
  { name: "type", label: "Type", type: "text" },
  { name: "location", label: "Location", type: "text" },
  { name: "experience", label: "Experience", type: "text" },
  { name: "description", label: "Description", type: "textarea" },
  { name: "skills", label: "Skills JSON", type: "json" },
  { name: "applyEmail", label: "Apply Email", type: "text" },
  { name: "order", label: "Order", type: "number" },
  { name: "isActive", label: "Active", type: "checkbox" },
];

export default function AdminContentPage() {
  const token = typeof window !== "undefined" ? localStorage.getItem("creative-monk-admin-token") || "" : "";

  return (
    <div className="space-y-8">
      <SiteSettingsEditor token={token} />

      <CmsCollectionManager
        title="FAQs"
        description="Manage FAQ content for home, services, and contact pages."
        adminPath="admin/faqs"
        resourcePath="faqs"
        token={token}
        primaryField="question"
        fields={faqFields}
        createDefaults={{
          question: "",
          answer: "",
          page: "home",
          order: 0,
          isActive: true,
        }}
      />

      <CmsCollectionManager
        title="Team Members"
        description="Manage the About page team section."
        adminPath="admin/team"
        resourcePath="team"
        token={token}
        primaryField="name"
        fields={teamFields}
        createDefaults={{
          name: "",
          role: "",
          bio: "",
          image: "",
          social: {},
          order: 0,
          isActive: true,
        }}
      />

      <CmsCollectionManager
        title="Career Openings"
        description="Manage active hiring roles."
        adminPath="admin/careers"
        resourcePath="careers"
        token={token}
        primaryField="title"
        fields={careerFields}
        createDefaults={{
          title: "",
          department: "",
          type: "",
          location: "",
          experience: "",
          description: "",
          skills: [],
          applyEmail: "",
          order: 0,
          isActive: true,
        }}
      />
    </div>
  );
}
