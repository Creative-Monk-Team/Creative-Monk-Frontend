"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Area,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  CircleDollarSign,
  HandCoins,
  Landmark,
  Megaphone,
  Pencil,
  Plus,
  Receipt,
  TrendingUp,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { adminApi } from "@/lib/api";
import { getAdminToken } from "@/lib/admin-session";
import type {
  FinanceRecord,
  FinanceSummary,
  ExpenseBreakdown,
  PnlRow,
} from "@/lib/types";

/* ── Helpers ─────────────────────────────────────────────── */

const INR = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  notation: "compact",
  maximumFractionDigits: 1,
});

function fmtPlain(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

const PIE_COLORS = ["#3b82f6", "#8b5cf6", "#f59e0b", "#64748b"];
const HEALTH_FILL: Record<string, string> = {
  green: "#10b981",
  amber: "#f59e0b",
  red: "#ef4444",
};

type ClientBreakdownItem = {
  name: string;
  monthlyRetainer: number;
  projectHealth: string;
};

/* ── Stat Card ───────────────────────────────────────────── */

function StatCard({
  icon: Icon,
  label,
  value,
  subtitle,
  accent = false,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  subtitle?: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border p-5 transition-all hover:shadow-lg ${
        accent
          ? "border-[#FF6600]/20 bg-gradient-to-br from-[#FF6600] to-[#e55500] text-white"
          : "border-slate-200 bg-white"
      }`}
    >
      <div className="flex items-start justify-between">
        <div
          className={`rounded-xl p-2.5 ${accent ? "bg-white/20" : "bg-slate-100"}`}
        >
          <Icon className={`h-5 w-5 ${accent ? "text-white" : "text-slate-600"}`} />
        </div>
      </div>
      <p
        className={`mt-4 text-2xl font-bold tracking-tight ${accent ? "text-white" : "text-slate-900"}`}
      >
        {value}
      </p>
      <p
        className={`mt-1 text-[13px] font-medium ${accent ? "text-white/80" : "text-slate-500"}`}
      >
        {label}
      </p>
      {subtitle && (
        <p className={`mt-0.5 text-[11px] ${accent ? "text-white/60" : "text-slate-400"}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

/* ── Section Card ────────────────────────────────────────── */

function Section({
  title,
  action,
  children,
  className = "",
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-2xl border border-slate-200 bg-white p-5 ${className}`}>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-[15px] font-semibold text-slate-900">{title}</h2>
        {action}
      </div>
      {children}
    </div>
  );
}

/* ── Custom Tooltip ──────────────────────────────────────── */

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-xl">
      <p className="mb-2 text-xs font-medium text-slate-500">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2 text-sm">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-slate-600">{entry.name}:</span>
          <span className="font-semibold text-slate-900">{INR.format(entry.value)}</span>
        </div>
      ))}
    </div>
  );
}

/* ── Empty form defaults ─────────────────────────────────── */

const EMPTY_FORM = {
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
  status: "actual" as const,
  notes: "",
};

type FinanceForm = typeof EMPTY_FORM;

/* ── Create / Edit Modal ─────────────────────────────────── */

function RecordModal({
  open,
  editingId,
  form,
  setForm,
  saving,
  onSave,
  onClose,
}: {
  open: boolean;
  editingId: string | null;
  form: FinanceForm;
  setForm: React.Dispatch<React.SetStateAction<FinanceForm>>;
  saving: boolean;
  onSave: () => void;
  onClose: () => void;
}) {
  if (!open) return null;

  const computedProfit = form.revenue - form.expenses;
  const computedMargin = form.revenue ? (computedProfit / form.revenue) * 100 : 0;

  const inputClass =
    "h-9 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-[#FF6600]/40 transition";
  const labelClass = "mb-1 block text-[10px] font-medium uppercase tracking-wider text-slate-400";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="mb-6 text-lg font-semibold text-slate-900">
          {editingId ? "Edit Finance Record" : "Add Finance Record"}
        </h2>

        {/* Period */}
        <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-slate-400">Period</p>
        <div className="mb-5 grid gap-3 sm:grid-cols-3">
          <div>
            <label className={labelClass}>Label</label>
            <input
              type="text"
              placeholder="Mar 2026"
              value={form.label}
              onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Period Key</label>
            <input
              type="text"
              placeholder="2026-03"
              value={form.periodKey}
              onChange={(e) => setForm((f) => ({ ...f, periodKey: e.target.value }))}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Currency</label>
            <input
              type="text"
              value={form.currency}
              onChange={(e) => setForm((f) => ({ ...f, currency: e.target.value }))}
              className={inputClass}
            />
          </div>
        </div>

        {/* Revenue */}
        <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-slate-400">Revenue</p>
        <div className="mb-5">
          <label className={labelClass}>Revenue Amount</label>
          <input
            type="number"
            min={0}
            value={form.revenue}
            onChange={(e) => setForm((f) => ({ ...f, revenue: +e.target.value }))}
            className={inputClass}
          />
        </div>

        {/* Expenses */}
        <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-slate-400">Expenses</p>
        <div className="mb-5 grid gap-3 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Total Expenses</label>
            <input
              type="number"
              min={0}
              value={form.expenses}
              onChange={(e) => setForm((f) => ({ ...f, expenses: +e.target.value }))}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Ad Spend</label>
            <input
              type="number"
              min={0}
              value={form.adSpend}
              onChange={(e) => setForm((f) => ({ ...f, adSpend: +e.target.value }))}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Payroll</label>
            <input
              type="number"
              min={0}
              value={form.payroll}
              onChange={(e) => setForm((f) => ({ ...f, payroll: +e.target.value }))}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Tools Cost</label>
            <input
              type="number"
              min={0}
              value={form.toolsCost}
              onChange={(e) => setForm((f) => ({ ...f, toolsCost: +e.target.value }))}
              className={inputClass}
            />
          </div>
        </div>

        {/* Collections */}
        <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-slate-400">Collections</p>
        <div className="mb-5 grid gap-3 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Outstanding Invoices</label>
            <input
              type="number"
              min={0}
              value={form.outstandingInvoices}
              onChange={(e) => setForm((f) => ({ ...f, outstandingInvoices: +e.target.value }))}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Cash in Hand</label>
            <input
              type="number"
              min={0}
              value={form.cashInHand}
              onChange={(e) => setForm((f) => ({ ...f, cashInHand: +e.target.value }))}
              className={inputClass}
            />
          </div>
        </div>

        {/* Profit (auto-calculated) */}
        <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-slate-400">
          Profit (auto-calculated)
        </p>
        <div className="mb-5 grid gap-3 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Profit</label>
            <div className={`flex h-9 items-center rounded-lg border border-slate-200 bg-slate-100 px-3 text-sm font-medium ${computedProfit >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
              {fmtPlain(computedProfit)}
            </div>
          </div>
          <div>
            <label className={labelClass}>Margin %</label>
            <div className={`flex h-9 items-center rounded-lg border border-slate-200 bg-slate-100 px-3 text-sm font-medium ${computedMargin >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
              {computedMargin.toFixed(1)}%
            </div>
          </div>
        </div>

        {/* Status */}
        <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-slate-400">Status</p>
        <div className="mb-5">
          <select
            value={form.status}
            onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as FinanceForm["status"] }))}
            className={inputClass}
          >
            <option value="actual">Actual</option>
            <option value="forecast">Forecast</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        {/* Notes */}
        <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-slate-400">Notes</p>
        <div className="mb-6">
          <textarea
            rows={3}
            value={form.notes}
            onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-[#FF6600]/40 transition"
          />
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={saving || !form.label || !form.periodKey}
            onClick={onSave}
            className="inline-flex items-center gap-2 rounded-xl bg-[#FF6600] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#e55b00] disabled:opacity-50"
          >
            {saving ? "Saving..." : editingId ? "Update Record" : "Create Record"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Delete Confirmation ─────────────────────────────────── */

function DeleteConfirm({
  open,
  label,
  deleting,
  onConfirm,
  onClose,
}: {
  open: boolean;
  label: string;
  deleting: boolean;
  onConfirm: () => void;
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
        <h3 className="text-lg font-semibold text-slate-900">Delete Record</h3>
        <p className="mt-2 text-sm text-slate-600">
          Are you sure you want to delete <span className="font-medium text-slate-900">{label}</span>? This action cannot be undone.
        </p>
        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={deleting}
            onClick={onConfirm}
            className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main Page ───────────────────────────────────────────── */

export default function SuperAdminFinancePage() {
  const [summary, setSummary] = useState<FinanceSummary | null>(null);
  const [expenseBreakdown, setExpenseBreakdown] = useState<ExpenseBreakdown | null>(null);
  const [clientBreakdown, setClientBreakdown] = useState<ClientBreakdownItem[]>([]);
  const [pnl, setPnl] = useState<PnlRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [timePeriod, setTimePeriod] = useState<"6m" | "all">("all");

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FinanceForm>({ ...EMPTY_FORM });
  const [saving, setSaving] = useState(false);

  // Delete state
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; label: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  const token = getAdminToken();

  const loadData = useCallback((showLoading = true) => {
    if (!token) {
      setLoading(false);
      return;
    }
    if (showLoading) setLoading(true);
    Promise.all([
      adminApi.getFinanceSummary(token).catch(() => null),
      adminApi.getExpenseBreakdown(token).catch(() => null),
      adminApi.getClientBreakdown(token).catch(() => []),
      adminApi.getPnl(token).catch(() => []),
    ])
      .then(([summaryData, expenseData, clientData, pnlData]) => {
        setSummary(summaryData as FinanceSummary | null);
        setExpenseBreakdown(expenseData as ExpenseBreakdown | null);
        setClientBreakdown((clientData as ClientBreakdownItem[]) || []);
        setPnl((pnlData as PnlRow[]) || []);
      })
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => {
    loadData(false);
  }, [loadData]);

  /* ── Modal handlers ─────────────────────────────────────── */

  function openCreate() {
    setEditingId(null);
    setForm({ ...EMPTY_FORM });
    setModalOpen(true);
  }

  function openEdit(record: PnlRow & { _id?: string }) {
    // PnlRow comes from the analytics endpoint; we also search summary.records for the full record
    const full = summary?.records?.find((r) => r.periodKey === record.periodKey);
    setEditingId(full?._id || record._id || "");
    setForm({
      label: record.label,
      periodKey: record.periodKey,
      currency: "INR",
      revenue: record.revenue,
      expenses: record.expenses,
      adSpend: record.adSpend,
      payroll: record.payroll,
      toolsCost: record.toolsCost,
      outstandingInvoices: full?.outstandingInvoices ?? 0,
      cashInHand: full?.cashInHand ?? 0,
      profit: record.profit,
      marginPct: record.marginPct,
      status: (full?.status || record.status || "actual") as FinanceForm["status"],
      notes: full?.notes || "",
    });
    setModalOpen(true);
  }

  async function handleSave() {
    if (!token) return;
    setSaving(true);

    const computedProfit = form.revenue - form.expenses;
    const computedMargin = form.revenue ? (computedProfit / form.revenue) * 100 : 0;

    const payload = {
      ...form,
      profit: computedProfit,
      marginPct: Math.round(computedMargin * 10) / 10,
    };

    try {
      if (editingId) {
        await adminApi.update("finance-records/" + editingId, token, payload);
        toast.success("Record updated successfully");
      } else {
        await adminApi.create("finance-records", token, payload);
        toast.success("Record created successfully");
      }
      setModalOpen(false);
      loadData();
    } catch {
      toast.error("Failed to save record");
    } finally {
      setSaving(false);
    }
  }

  /* ── Delete handler ─────────────────────────────────────── */

  function openDelete(record: PnlRow & { _id?: string }) {
    const full = summary?.records?.find((r) => r.periodKey === record.periodKey);
    const id = full?._id || record._id || "";
    if (!id) {
      toast.error("Cannot determine record ID");
      return;
    }
    setDeleteTarget({ id, label: record.label });
  }

  async function handleDelete() {
    if (!token || !deleteTarget) return;
    setDeleting(true);
    try {
      await adminApi.remove("finance-records/" + deleteTarget.id, token);
      toast.success("Record deleted");
      setDeleteTarget(null);
      loadData();
    } catch {
      toast.error("Failed to delete record");
    } finally {
      setDeleting(false);
    }
  }

  /* ── Derived data ───────────────────────────────────────── */

  const filteredRecords = useMemo(() => {
    const all = summary?.records || [];
    if (timePeriod === "6m") return all.slice(-6);
    return all;
  }, [summary?.records, timePeriod]);

  const pieData = useMemo(() => {
    if (!expenseBreakdown) return [];
    return [
      { name: "Payroll", value: expenseBreakdown.payroll },
      { name: "Ad Spend", value: expenseBreakdown.adSpend },
      { name: "Tools", value: expenseBreakdown.toolsCost },
      { name: "Other", value: expenseBreakdown.other },
    ].filter((d) => d.value > 0);
  }, [expenseBreakdown]);

  const sortedClients = useMemo(() => {
    return [...clientBreakdown].sort((a, b) => b.monthlyRetainer - a.monthlyRetainer);
  }, [clientBreakdown]);

  const pnlTotals = useMemo(() => {
    if (!pnl.length) return null;
    const totals = pnl.reduce(
      (acc, row) => ({
        revenue: acc.revenue + row.revenue,
        expenses: acc.expenses + row.expenses,
        payroll: acc.payroll + row.payroll,
        adSpend: acc.adSpend + row.adSpend,
        toolsCost: acc.toolsCost + row.toolsCost,
        otherExpenses: acc.otherExpenses + row.otherExpenses,
        profit: acc.profit + row.profit,
      }),
      { revenue: 0, expenses: 0, payroll: 0, adSpend: 0, toolsCost: 0, otherExpenses: 0, profit: 0 },
    );
    return {
      ...totals,
      marginPct: totals.revenue ? (totals.profit / totals.revenue) * 100 : 0,
    };
  }, [pnl]);

  /* ── Loading Skeleton ───────────────────────────────────── */

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 w-56 animate-pulse rounded-lg bg-slate-200/60" />
          <div className="h-10 w-32 animate-pulse rounded-xl bg-slate-200/60" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-[140px] animate-pulse rounded-2xl bg-slate-200/60" />
          ))}
        </div>
        <div className="h-[400px] animate-pulse rounded-2xl bg-slate-200/60" />
        <div className="grid gap-6 md:grid-cols-2">
          <div className="h-[360px] animate-pulse rounded-2xl bg-slate-200/60" />
          <div className="h-[360px] animate-pulse rounded-2xl bg-slate-200/60" />
        </div>
        <div className="h-[320px] animate-pulse rounded-2xl bg-slate-200/60" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Header ──────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Finance Dashboard</h1>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-[#FF6600] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#e55b00]"
        >
          <Plus className="h-4 w-4" /> Add Record
        </button>
      </div>

      {/* ── KPI Row ────────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        <StatCard icon={CircleDollarSign} label="Total Revenue" value={INR.format(summary?.revenue || 0)} accent />
        <StatCard icon={Receipt} label="Total Expenses" value={INR.format(summary?.expenses || 0)} />
        <StatCard
          icon={TrendingUp}
          label="Net Profit"
          value={INR.format(summary?.profit || 0)}
          subtitle={`${(summary?.marginPct ?? 0).toFixed(1)}% margin`}
        />
        <StatCard icon={HandCoins} label="Outstanding Invoices" value={INR.format(summary?.outstandingInvoices || 0)} />
        <StatCard icon={Landmark} label="Cash in Hand" value={INR.format(summary?.cashInHand || 0)} />
        <StatCard icon={Megaphone} label="Ad Spend" value={INR.format(summary?.adSpend || 0)} />
      </div>

      {/* ── Revenue & Expense Trend ────────────────────────── */}
      <Section
        title="Revenue & Expense Trend"
        action={
          <div className="flex gap-1 rounded-lg bg-slate-100 p-0.5">
            {(["6m", "all"] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setTimePeriod(p)}
                className={`rounded-md px-3 py-1 text-[11px] font-semibold transition ${
                  timePeriod === p
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {p === "all" ? "All" : "Last 6 Months"}
              </button>
            ))}
          </div>
        }
      >
        <div className="h-[340px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={filteredRecords}
              margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
            >
              <defs>
                <linearGradient id="finRevGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FF6600" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#FF6600" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<ChartTooltip />} />
              <Area
                type="monotone"
                dataKey="revenue"
                name="Revenue"
                stroke="#FF6600"
                strokeWidth={2.5}
                fill="url(#finRevGrad)"
              />
              <Bar dataKey="expenses" name="Expenses" fill="#64748b" radius={[4, 4, 0, 0]} barSize={20} opacity={0.7} />
              <Area
                type="monotone"
                dataKey="profit"
                name="Profit"
                stroke="#10b981"
                strokeWidth={2}
                fill="none"
                dot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#FF6600]" /> Revenue
          </span>
          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-slate-500" /> Expenses
          </span>
          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Profit
          </span>
        </div>
      </Section>

      {/* ── Two-Column: Pie + Client Revenue ───────────────── */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Expense Breakdown Pie */}
        <Section title="Expense Breakdown">
          {pieData.length > 0 ? (
            <>
              <div className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      dataKey="value"
                      nameKey="name"
                      strokeWidth={2}
                      stroke="#fff"
                    >
                      {pieData.map((_entry, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any, name: any) => [INR.format(Number(Array.isArray(value) ? value[0] : value || 0)), String(name || "")]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 flex flex-wrap justify-center gap-4 text-xs text-slate-500">
                {pieData.map((d, i) => (
                  <span key={d.name} className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }}
                    />
                    {d.name}
                  </span>
                ))}
              </div>
            </>
          ) : (
            <p className="py-12 text-center text-sm text-slate-400">No expense data</p>
          )}
        </Section>

        {/* Client Revenue Horizontal Bar */}
        <Section title="Client Revenue">
          {sortedClients.length > 0 ? (
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sortedClients} layout="vertical" margin={{ top: 0, right: 8, left: 0, bottom: 0 }}>
                  <XAxis
                    type="number"
                    tick={{ fontSize: 10, fill: "#94a3b8" }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    axisLine={false}
                    tickLine={false}
                    width={100}
                  />
                   <Tooltip
                    formatter={(value: any) => [INR.format(Number(Array.isArray(value) ? value[0] : value || 0)), "Retainer"]}
                    cursor={{ fill: "rgba(255,102,0,0.06)" }}
                  />
                  <Bar dataKey="monthlyRetainer" radius={[0, 6, 6, 0]}>
                    {sortedClients.map((entry, i) => (
                      <Cell key={i} fill={HEALTH_FILL[entry.projectHealth] || "#94a3b8"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="py-12 text-center text-sm text-slate-400">No client data</p>
          )}
        </Section>
      </div>

      {/* ── P&L Statement ──────────────────────────────────── */}
      <Section title="Profit & Loss Statement">
        {pnl.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <th className="pb-3 pr-4">Period</th>
                  <th className="pb-3 pr-4 text-right">Revenue</th>
                  <th className="pb-3 pr-4 text-right">Payroll</th>
                  <th className="pb-3 pr-4 text-right">Ad Spend</th>
                  <th className="pb-3 pr-4 text-right">Tools</th>
                  <th className="pb-3 pr-4 text-right">Other</th>
                  <th className="pb-3 pr-4 text-right">Total Exp.</th>
                  <th className="pb-3 pr-4 text-right">Profit</th>
                  <th className="pb-3 pr-4 text-right">Margin</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pnl.map((row, i) => (
                  <tr
                    key={row.periodKey}
                    className={`border-b border-slate-100 ${i % 2 === 1 ? "bg-slate-50/50" : ""}`}
                  >
                    <td className="py-3 pr-4 font-medium text-slate-800">{row.label}</td>
                    <td className="py-3 pr-4 text-right text-slate-700">{fmtPlain(row.revenue)}</td>
                    <td className="py-3 pr-4 text-right text-slate-600">{fmtPlain(row.payroll)}</td>
                    <td className="py-3 pr-4 text-right text-slate-600">{fmtPlain(row.adSpend)}</td>
                    <td className="py-3 pr-4 text-right text-slate-600">{fmtPlain(row.toolsCost)}</td>
                    <td className="py-3 pr-4 text-right text-slate-600">{fmtPlain(row.otherExpenses)}</td>
                    <td className="py-3 pr-4 text-right font-medium text-slate-700">{fmtPlain(row.expenses)}</td>
                    <td
                      className={`py-3 pr-4 text-right font-semibold ${
                        row.profit >= 0 ? "text-emerald-600" : "text-rose-600"
                      }`}
                    >
                      {fmtPlain(row.profit)}
                    </td>
                    <td
                      className={`py-3 pr-4 text-right font-medium ${
                        row.profit >= 0 ? "text-emerald-600" : "text-rose-600"
                      }`}
                    >
                      {row.marginPct.toFixed(1)}%
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => openEdit(row as PnlRow & { _id?: string })}
                          className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-[#FF6600]"
                          title="Edit"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => openDelete(row as PnlRow & { _id?: string })}
                          className="rounded-lg p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                          title="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {/* Totals row */}
                {pnlTotals && (
                  <tr className="border-t-2 border-slate-300 bg-slate-100/80 font-semibold">
                    <td className="py-3 pr-4 text-slate-900">Total</td>
                    <td className="py-3 pr-4 text-right text-slate-900">{fmtPlain(pnlTotals.revenue)}</td>
                    <td className="py-3 pr-4 text-right text-slate-700">{fmtPlain(pnlTotals.payroll)}</td>
                    <td className="py-3 pr-4 text-right text-slate-700">{fmtPlain(pnlTotals.adSpend)}</td>
                    <td className="py-3 pr-4 text-right text-slate-700">{fmtPlain(pnlTotals.toolsCost)}</td>
                    <td className="py-3 pr-4 text-right text-slate-700">{fmtPlain(pnlTotals.otherExpenses)}</td>
                    <td className="py-3 pr-4 text-right text-slate-900">{fmtPlain(pnlTotals.expenses)}</td>
                    <td
                      className={`py-3 pr-4 text-right ${
                        pnlTotals.profit >= 0 ? "text-emerald-600" : "text-rose-600"
                      }`}
                    >
                      {fmtPlain(pnlTotals.profit)}
                    </td>
                    <td
                      className={`py-3 pr-4 text-right ${
                        pnlTotals.profit >= 0 ? "text-emerald-600" : "text-rose-600"
                      }`}
                    >
                      {pnlTotals.marginPct.toFixed(1)}%
                    </td>
                    <td />
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="py-8 text-center text-sm text-slate-400">No P&amp;L data available</p>
        )}
      </Section>

      {/* ── Modals ─────────────────────────────────────────── */}
      <RecordModal
        open={modalOpen}
        editingId={editingId}
        form={form}
        setForm={setForm}
        saving={saving}
        onSave={handleSave}
        onClose={() => setModalOpen(false)}
      />
      <DeleteConfirm
        open={!!deleteTarget}
        label={deleteTarget?.label || ""}
        deleting={deleting}
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}
