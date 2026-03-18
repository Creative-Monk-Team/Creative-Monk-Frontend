"use client";

import { EnquiriesManager } from "@/components/admin/enquiries-manager";

export default function AdminEnquiriesPage() {
  const token = typeof window !== "undefined" ? localStorage.getItem("creative-monk-admin-token") || "" : "";

  return <EnquiriesManager token={token} />;
}
