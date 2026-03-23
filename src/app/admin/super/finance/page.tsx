"use client";

import { CmsCollectionManager, type CmsField } from "@/components/admin/cms-collection-manager";
import { getAdminToken } from "@/lib/admin-session";

const financeFields: CmsField[] = [
  { name: "label", label: "Label", type: "text", placeholder: "Mar 2026" },
  { name: "periodKey", label: "Period Key", type: "text", placeholder: "2026-03" },
  { name: "currency", label: "Currency", type: "text", placeholder: "INR" },
  { name: "revenue", label: "Revenue", type: "number" },
  { name: "expenses", label: "Expenses", type: "number" },
  { name: "adSpend", label: "Ad Spend", type: "number" },
  { name: "payroll", label: "Payroll", type: "number" },
  { name: "toolsCost", label: "Tools Cost", type: "number" },
  { name: "outstandingInvoices", label: "Outstanding Invoices", type: "number" },
  { name: "cashInHand", label: "Cash In Hand", type: "number" },
  { name: "profit", label: "Profit", type: "number" },
  { name: "marginPct", label: "Margin %", type: "number" },
  { name: "status", label: "Status", type: "text", placeholder: "actual / forecast / closed" },
  { name: "notes", label: "Notes", type: "textarea" },
  { name: "isActive", label: "Active", type: "checkbox" },
];

export default function SuperAdminFinancePage() {
  const token = getAdminToken();

  return (
    <CmsCollectionManager
      title="Finance Records"
      description="Track monthly revenue, expenses, payroll, tools, ad spend, and outstanding collections."
      adminPath="admin/finance-records"
      resourcePath="finance-records"
      token={token}
      primaryField="label"
      fields={financeFields}
      createDefaults={{
        label: "",
        periodKey: "",
        currency: "INR",
        revenue: 0,
        expenses: 0,
        adSpend: 0,
        payroll: 0,
        toolsCost: 0,
        outstandingInvoices: 0,
        cashInHand: 0,
        profit: 0,
        marginPct: 0,
        status: "actual",
        notes: "",
        isActive: true,
      }}
    />
  );
}
