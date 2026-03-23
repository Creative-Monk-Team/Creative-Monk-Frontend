"use client";

import { CmsCollectionManager, type CmsField } from "@/components/admin/cms-collection-manager";
import { getAdminToken } from "@/lib/admin-session";

const employeeFields: CmsField[] = [
  { name: "name", label: "Name", type: "text" },
  { name: "role", label: "Role", type: "text" },
  { name: "department", label: "Department", type: "text" },
  { name: "email", label: "Email", type: "text" },
  { name: "phone", label: "Phone", type: "text" },
  { name: "avatar", label: "Avatar URL", type: "media", uploadFolder: "creative-monk/team" },
  { name: "status", label: "Status", type: "text", placeholder: "active / on-leave / freelance" },
  { name: "employmentType", label: "Employment Type", type: "text" },
  { name: "monthlySalary", label: "Monthly Salary", type: "number" },
  { name: "utilizationPct", label: "Utilization %", type: "number" },
  { name: "ownerLevel", label: "Owner Level", type: "text", placeholder: "lead / member / executive" },
  { name: "joinedAt", label: "Joined At", type: "date" },
  { name: "assignedClients", label: "Assigned Clients JSON", type: "json" },
  { name: "primarySkills", label: "Primary Skills JSON", type: "json" },
  { name: "goals", label: "Goals JSON", type: "json" },
  { name: "notes", label: "Notes", type: "textarea" },
  { name: "order", label: "Order", type: "number" },
  { name: "isActive", label: "Active", type: "checkbox" },
];

export default function SuperAdminEmployeesPage() {
  const token = getAdminToken();

  return (
    <CmsCollectionManager
      title="Employees"
      description="Track departments, pay bands, utilization, client allocation, and goals for the internal team."
      adminPath="admin/employees"
      resourcePath="employees"
      token={token}
      primaryField="name"
      fields={employeeFields}
      createDefaults={{
        name: "",
        role: "",
        department: "",
        email: "",
        phone: "",
        avatar: "",
        status: "active",
        employmentType: "full-time",
        monthlySalary: 0,
        utilizationPct: 0,
        ownerLevel: "member",
        joinedAt: new Date().toISOString().slice(0, 10),
        assignedClients: [],
        primarySkills: [],
        goals: [],
        notes: "",
        order: 0,
        isActive: true,
      }}
    />
  );
}
