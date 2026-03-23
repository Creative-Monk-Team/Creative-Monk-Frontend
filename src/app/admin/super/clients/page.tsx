"use client";

import { CmsCollectionManager, type CmsField } from "@/components/admin/cms-collection-manager";
import { getAdminToken } from "@/lib/admin-session";

const clientFields: CmsField[] = [
  { name: "name", label: "Client Name", type: "text" },
  { name: "website", label: "Primary Website", type: "text" },
  { name: "primaryContact", label: "Primary Contact", type: "text" },
  { name: "contactEmail", label: "Contact Email", type: "text" },
  { name: "contactPhone", label: "Contact Phone", type: "text" },
  { name: "owner", label: "Account Owner", type: "text" },
  { name: "status", label: "Status", type: "text", placeholder: "onboarding / active / retainer" },
  { name: "monthlyRetainer", label: "Monthly Retainer", type: "number" },
  { name: "projectHealth", label: "Project Health", type: "text", placeholder: "green / amber / red" },
  { name: "seoScore", label: "SEO Score", type: "number" },
  { name: "socialScore", label: "Social Score", type: "number" },
  { name: "websiteScore", label: "Website Score", type: "number" },
  { name: "nextReviewDate", label: "Next Review Date", type: "date" },
  { name: "services", label: "Services JSON", type: "json" },
  { name: "websitesManaged", label: "Websites Managed JSON", type: "json" },
  { name: "priorityGoals", label: "Priority Goals JSON", type: "json" },
  { name: "notes", label: "Notes", type: "textarea" },
  { name: "hasCmsAccess", label: "Has CMS Access", type: "checkbox" },
  { name: "order", label: "Order", type: "number" },
  { name: "isActive", label: "Active", type: "checkbox" },
];

export default function SuperAdminClientsPage() {
  const token = getAdminToken();

  return (
    <CmsCollectionManager
      title="Managed Clients"
      description="Keep a private operations view of client websites, retainers, health scores, owners, and next review dates."
      adminPath="admin/agency-clients"
      resourcePath="agency-clients"
      token={token}
      primaryField="name"
      fields={clientFields}
      createDefaults={{
        name: "",
        website: "",
        primaryContact: "",
        contactEmail: "",
        contactPhone: "",
        owner: "",
        status: "active",
        monthlyRetainer: 0,
        projectHealth: "green",
        seoScore: 0,
        socialScore: 0,
        websiteScore: 0,
        nextReviewDate: new Date().toISOString().slice(0, 10),
        services: [],
        websitesManaged: [],
        priorityGoals: [],
        notes: "",
        hasCmsAccess: false,
        order: 0,
        isActive: true,
      }}
    />
  );
}
