"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Gauge,
  IndianRupee,
  MoreVertical,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { adminApi } from "@/lib/api";
import { getAdminToken } from "@/lib/admin-session";
import type {
  DepartmentStat,
  Employee,
  EmployeeSummary,
  EmployeeUtilization,
} from "@/lib/types";

/* ── Helpers ─────────────────────────────────────────────── */

const INR = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  notation: "compact",
  maximumFractionDigits: 1,
});

const PIE_COLORS = ["#FF6600", "#8b5cf6", "#10b981", "#f59e0b", "#3b82f6", "#ec4899", "#6366f1", "#14b8a6"];

function utilizationColor(pct: number) {
  if (pct > 85) return "#ef4444";
  if (pct >= 70) return "#f59e0b";
  return "#10b981";
}

function utilizationBg(pct: number) {
  if (pct > 85) return "bg-red-500";
  if (pct >= 70) return "bg-amber-500";
  return "bg-emerald-500";
}

function statusBadge(status?: string) {
  switch (status) {
    case "active":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "on-leave":
      return "border-amber-200 bg-amber-50 text-amber-700";
    case "probation":
      return "border-blue-200 bg-blue-50 text-blue-700";
    case "freelance":
      return "border-violet-200 bg-violet-50 text-violet-700";
    case "inactive":
      return "border-slate-200 bg-slate-100 text-slate-500";
    default:
      return "border-slate-200 bg-slate-50 text-slate-600";
  }
}

const STATUSES = ["active", "on-leave", "probation", "freelance", "inactive"] as const;
const EMPLOYMENT_TYPES = ["full-time", "part-time", "contract", "intern"] as const;
const OWNER_LEVELS = ["lead", "member", "executive"] as const;

/* ── Form defaults ───────────────────────────────────────── */

const EMPTY_FORM = {
  name: "",
  email: "",
  phone: "",
  avatar: "",
  role: "",
  department: "",
  employmentType: "full-time" as Employee["employmentType"],
  status: "active" as Employee["status"],
  ownerLevel: "member" as Employee["ownerLevel"],
  monthlySalary: 0,
  utilizationPct: 0,
  joinedAt: "",
  primarySkills: [] as string[],
  notes: "",
};

type EmployeeForm = typeof EMPTY_FORM;

/* ── Create / Edit Modal ─────────────────────────────────── */

function EmployeeModal({
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
  form: EmployeeForm;
  setForm: React.Dispatch<React.SetStateAction<EmployeeForm>>;
  saving: boolean;
  onSave: () => void;
  onClose: () => void;
}) {
  const [skillsText, setSkillsText] = useState("");

  // Sync skills text when modal opens for editing
  useEffect(() => {
    if (open) {
      setSkillsText(form.primarySkills.join(", "));
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!open) return null;

  const inputClass =
    "h-9 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-[#FF6600]/40 transition";
  const labelClass = "mb-1 block text-[10px] font-medium uppercase tracking-wider text-slate-400";

  function handleSkillsChange(value: string) {
    setSkillsText(value);
    const arr = value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    setForm((f) => ({ ...f, primarySkills: arr }));
  }

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
          {editingId ? "Edit Employee" : "Add Employee"}
        </h2>

        {/* Personal */}
        <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-slate-400">Personal</p>
        <div className="mb-5 grid gap-3 sm:grid-cols-2">
          <div>
            <label className={labelClass}>
              Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className={inputClass}
              placeholder="Full name"
            />
          </div>
          <div>
            <label className={labelClass}>Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Phone</label>
            <input
              type="text"
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Avatar URL</label>
            <input
              type="text"
              value={form.avatar}
              onChange={(e) => setForm((f) => ({ ...f, avatar: e.target.value }))}
              className={inputClass}
              placeholder="https://..."
            />
          </div>
        </div>

        {/* Employment */}
        <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-slate-400">Employment</p>
        <div className="mb-5 grid gap-3 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Role</label>
            <input
              type="text"
              value={form.role}
              onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Department</label>
            <input
              type="text"
              value={form.department}
              onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Employment Type</label>
            <select
              value={form.employmentType}
              onChange={(e) =>
                setForm((f) => ({ ...f, employmentType: e.target.value as Employee["employmentType"] }))
              }
              className={inputClass}
            >
              {EMPLOYMENT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as Employee["status"] }))}
              className={inputClass}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Owner Level</label>
            <select
              value={form.ownerLevel}
              onChange={(e) =>
                setForm((f) => ({ ...f, ownerLevel: e.target.value as Employee["ownerLevel"] }))
              }
              className={inputClass}
            >
              {OWNER_LEVELS.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Compensation */}
        <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-slate-400">Compensation</p>
        <div className="mb-5 grid gap-3 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Monthly Salary</label>
            <input
              type="number"
              min={0}
              value={form.monthlySalary}
              onChange={(e) => setForm((f) => ({ ...f, monthlySalary: +e.target.value }))}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Utilization % (0-100)</label>
            <input
              type="number"
              min={0}
              max={100}
              value={form.utilizationPct}
              onChange={(e) => setForm((f) => ({ ...f, utilizationPct: +e.target.value }))}
              className={inputClass}
            />
          </div>
        </div>

        {/* Dates */}
        <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-slate-400">Dates</p>
        <div className="mb-5">
          <label className={labelClass}>Joined At</label>
          <input
            type="date"
            value={form.joinedAt?.slice(0, 10) || ""}
            onChange={(e) => setForm((f) => ({ ...f, joinedAt: e.target.value }))}
            className={inputClass}
          />
        </div>

        {/* Skills */}
        <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-slate-400">Skills</p>
        <div className="mb-5">
          <label className={labelClass}>Skills (comma-separated)</label>
          <input
            type="text"
            value={skillsText}
            onChange={(e) => handleSkillsChange(e.target.value)}
            className={inputClass}
            placeholder="React, Node.js, Figma"
          />
          {form.primarySkills.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {form.primarySkills.map((s, i) => (
                <span
                  key={i}
                  className="rounded-full border border-[#FF6600]/20 bg-orange-50 px-2 py-0.5 text-[10px] text-[#FF6600]"
                >
                  {s}
                </span>
              ))}
            </div>
          )}
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
            disabled={saving || !form.name.trim()}
            onClick={onSave}
            className="inline-flex items-center gap-2 rounded-xl bg-[#FF6600] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#e55b00] disabled:opacity-50"
          >
            {saving ? "Saving..." : editingId ? "Update Employee" : "Create Employee"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Delete Confirmation ─────────────────────────────────── */

function DeleteConfirm({
  open,
  name,
  deleting,
  onConfirm,
  onClose,
}: {
  open: boolean;
  name: string;
  deleting: boolean;
  onConfirm: () => void;
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
        <h3 className="text-lg font-semibold text-slate-900">Delete Employee</h3>
        <p className="mt-2 text-sm text-slate-600">
          Are you sure you want to delete <span className="font-medium text-slate-900">{name}</span>? This action cannot be undone.
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

/* ── Card Dropdown Menu ──────────────────────────────────── */

function CardMenu({
  employee,
  onEdit,
  onDelete,
  onStatusChange,
}: {
  employee: Employee;
  onEdit: () => void;
  onDelete: () => void;
  onStatusChange: (status: Employee["status"]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setStatusOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((prev) => !prev);
          setStatusOpen(false);
        }}
        className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
      >
        <MoreVertical className="h-4 w-4" />
      </button>

      {open && (
        <div className="absolute right-0 top-8 z-20 w-48 rounded-xl border border-slate-200 bg-white py-1 shadow-xl">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
              onEdit();
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
          >
            <Pencil className="h-3.5 w-3.5" /> Edit
          </button>

          {/* Change Status sub-menu */}
          <div className="relative">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setStatusOpen((prev) => !prev);
              }}
              className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
            >
              <span className="flex items-center gap-2">
                <RefreshCw className="h-3.5 w-3.5" /> Change Status
              </span>
              <ChevronDown className="h-3 w-3" />
            </button>
            {statusOpen && (
              <div className="absolute left-full top-0 z-30 ml-1 w-40 rounded-xl border border-slate-200 bg-white py-1 shadow-xl">
                {STATUSES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpen(false);
                      setStatusOpen(false);
                      onStatusChange(s);
                    }}
                    className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-slate-50 ${
                      employee.status === s ? "font-medium text-[#FF6600]" : "text-slate-700"
                    }`}
                  >
                    <span className={`h-2 w-2 rounded-full border ${statusBadge(s)}`} />
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="my-1 border-t border-slate-100" />

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
              onDelete();
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-3.5 w-3.5" /> Delete
          </button>
        </div>
      )}
    </div>
  );
}

/* ── Main Page ───────────────────────────────────────────── */

export default function SuperAdminEmployeesPage() {
  const token = getAdminToken();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [summary, setSummary] = useState<EmployeeSummary | null>(null);
  const [utilization, setUtilization] = useState<EmployeeUtilization[]>([]);
  const [departments, setDepartments] = useState<DepartmentStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<EmployeeForm>({ ...EMPTY_FORM });
  const [saving, setSaving] = useState(false);

  // Delete state
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadData = useCallback(async (showLoading = true) => {
    if (!token) {
      setLoading(false);
      return;
    }
    if (showLoading) setLoading(true);
    try {
      const [empData, sumData, utilData, deptData] = await Promise.all([
        adminApi.list<Employee[]>("admin/employees", token),
        adminApi.getEmployeeSummary(token) as Promise<EmployeeSummary>,
        adminApi.getEmployeeUtilization(token) as Promise<EmployeeUtilization[]>,
        adminApi.getDepartmentStats(token) as Promise<DepartmentStat[]>,
      ]);
      setEmployees(empData);
      setSummary(sumData);
      setUtilization(utilData);
      setDepartments(deptData);
    } catch {
      toast.error("Failed to load employee data");
    } finally {
      setLoading(false);
    }
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

  function openEdit(emp: Employee) {
    setEditingId(emp._id);
    setForm({
      name: emp.name,
      email: emp.email || "",
      phone: emp.phone || "",
      avatar: emp.avatar || "",
      role: emp.role,
      department: emp.department,
      employmentType: emp.employmentType || "full-time",
      status: emp.status || "active",
      ownerLevel: emp.ownerLevel || "member",
      monthlySalary: emp.monthlySalary || 0,
      utilizationPct: emp.utilizationPct || 0,
      joinedAt: emp.joinedAt || "",
      primarySkills: emp.primarySkills || [],
      notes: emp.notes || "",
    });
    setModalOpen(true);
  }

  async function handleSave() {
    if (!token) return;
    setSaving(true);
    try {
      if (editingId) {
        await adminApi.update("employees/" + editingId, token, form);
        toast.success("Employee updated successfully");
      } else {
        await adminApi.create("employees", token, form);
        toast.success("Employee created successfully");
      }
      setModalOpen(false);
      loadData();
    } catch {
      toast.error("Failed to save employee");
    } finally {
      setSaving(false);
    }
  }

  /* ── Status change handler ─────────────────────────────── */

  async function handleStatusChange(emp: Employee, newStatus: Employee["status"]) {
    if (!token) return;
    try {
      await adminApi.update("employees/" + emp._id, token, { status: newStatus }, "PATCH");
      toast.success(`${emp.name} status changed to ${newStatus}`);
      loadData();
    } catch {
      toast.error("Failed to update status");
    }
  }

  /* ── Delete handler ─────────────────────────────────────── */

  async function handleDelete() {
    if (!token || !deleteTarget) return;
    setDeleting(true);
    try {
      await adminApi.remove("employees/" + deleteTarget.id, token);
      toast.success("Employee deleted");
      setDeleteTarget(null);
      loadData();
    } catch {
      toast.error("Failed to delete employee");
    } finally {
      setDeleting(false);
    }
  }

  /* ── Chart data ─────────────────────────────────────────── */

  const utilChartData = useMemo(
    () =>
      utilization.map((u) => ({
        name: u.name.length > 14 ? u.name.slice(0, 12) + "\u2026" : u.name,
        utilization: u.utilizationPct,
      })),
    [utilization],
  );

  const deptChartData = useMemo(
    () => departments.map((d) => ({ name: d.name, value: d.count })),
    [departments],
  );

  /* ── Loading Skeleton ───────────────────────────────────── */

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 w-48 animate-pulse rounded-lg bg-slate-200/60" />
          <div className="h-10 w-36 animate-pulse rounded-xl bg-slate-200/60" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-[100px] animate-pulse rounded-2xl bg-slate-200/60" />
          ))}
        </div>
        <div className="grid gap-6 xl:grid-cols-2">
          <div className="h-[340px] animate-pulse rounded-2xl bg-slate-200/60" />
          <div className="h-[340px] animate-pulse rounded-2xl bg-slate-200/60" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-[220px] animate-pulse rounded-2xl bg-slate-200/60" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Header ──────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Team Dashboard</h1>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-[#FF6600] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#e55b00]"
        >
          <Plus className="h-4 w-4" /> Add Employee
        </button>
      </div>

      {/* ── Stats Row ──────────────────────────────────────── */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Team Size",
            value: String(summary?.totalActive ?? employees.filter((e) => e.status === "active").length),
            icon: <Users className="h-5 w-5 text-[#FF6600]" />,
          },
          {
            label: "Avg Utilization",
            value: `${summary?.avgUtilization ?? 0}%`,
            icon: <Gauge className="h-5 w-5 text-[#FF6600]" />,
          },
          {
            label: "Monthly Payroll",
            value: INR.format(summary?.totalPayroll ?? 0),
            icon: <IndianRupee className="h-5 w-5 text-[#FF6600]" />,
          },
          {
            label: "Overloaded (>85%)",
            value: String(summary?.overloaded ?? 0),
            icon: <AlertTriangle className="h-5 w-5 text-[#FF6600]" />,
          },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">{stat.label}</p>
              {stat.icon}
            </div>
            <p className="mt-3 text-2xl font-semibold text-slate-950">{stat.value}</p>
          </div>
        ))}
      </section>

      {/* ── Charts Row ─────────────────────────────────────── */}
      <section className="grid gap-6 xl:grid-cols-2">
        {/* Utilization Chart */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="mb-4 text-sm font-medium text-slate-950">Team Utilization</p>
          {utilChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={Math.max(utilChartData.length * 40, 200)}>
              <BarChart data={utilChartData} layout="vertical" margin={{ left: 10, right: 30 }}>
                <XAxis type="number" domain={[0, 100]} fontSize={11} unit="%" />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={110}
                  fontSize={11}
                  tick={{ fill: "#334155" }}
                />
                <Tooltip
                  formatter={(v) => `${v}%`}
                  contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0" }}
                />
                <Bar dataKey="utilization" radius={[0, 6, 6, 0]} barSize={20}>
                  {utilChartData.map((entry, idx) => (
                    <Cell key={idx} fill={utilizationColor(entry.utilization)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="py-12 text-center text-sm text-slate-400">No data available.</p>
          )}
        </div>

        {/* Department Distribution */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="mb-4 text-sm font-medium text-slate-950">Department Distribution</p>
          {deptChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={deptChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                  nameKey="name"
                  label={({ name, value }: { name?: string; value?: number }) => `${name || "Unknown"} (${value || 0})`}
                  fontSize={11}
                >
                  {deptChartData.map((_entry, idx) => (
                    <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0" }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="py-12 text-center text-sm text-slate-400">No data available.</p>
          )}
        </div>
      </section>

      {/* ── Team Grid ──────────────────────────────────────── */}
      <section>
        <p className="mb-4 text-lg font-semibold text-slate-950">Team</p>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {employees.map((emp) => {
            const isExpanded = expandedId === emp._id;
            const pct = emp.utilizationPct || 0;

            return (
              <div
                key={emp._id}
                className="rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-[#FF6600]/20"
              >
                {/* card summary */}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => setExpandedId(isExpanded ? null : emp._id)}
                      className="min-w-0 flex-1 text-left"
                    >
                      <p className="truncate text-base font-semibold text-slate-950">{emp.name}</p>
                      <p className="mt-0.5 text-xs text-slate-500">
                        {emp.role} &middot; {emp.department}
                      </p>
                    </button>
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${statusBadge(emp.status)}`}
                      >
                        {emp.status || "active"}
                      </span>
                      <CardMenu
                        employee={emp}
                        onEdit={() => openEdit(emp)}
                        onDelete={() => setDeleteTarget({ id: emp._id, name: emp.name })}
                        onStatusChange={(s) => handleStatusChange(emp, s)}
                      />
                    </div>
                  </div>

                  {/* utilization bar */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>Utilization</span>
                      <span className="font-medium">{pct}%</span>
                    </div>
                    <div className="mt-1 h-1.5 w-full rounded-full bg-slate-100">
                      <div
                        className={`h-1.5 rounded-full transition-all ${utilizationBg(pct)}`}
                        style={{ width: `${Math.min(pct, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* salary + clients */}
                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-800">
                      {INR.format(emp.monthlySalary || 0)}
                      <span className="text-xs font-normal text-slate-400"> /mo</span>
                    </span>
                    <span className="text-xs text-slate-500">{emp.assignedClients?.length || 0} clients</span>
                  </div>

                  {/* skills */}
                  {emp.primarySkills && emp.primarySkills.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {emp.primarySkills.slice(0, 5).map((s) => (
                        <span
                          key={s}
                          className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] text-slate-600"
                        >
                          {s}
                        </span>
                      ))}
                      {emp.primarySkills.length > 5 && (
                        <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] text-slate-500">
                          +{emp.primarySkills.length - 5}
                        </span>
                      )}
                    </div>
                  )}

                  {/* expand toggle */}
                  <button
                    type="button"
                    onClick={() => setExpandedId(isExpanded ? null : emp._id)}
                    className="mt-3 flex w-full items-center justify-center gap-1 text-[11px] text-slate-400 transition hover:text-slate-600"
                  >
                    {isExpanded ? (
                      <>
                        Less details <ChevronUp className="h-3 w-3" />
                      </>
                    ) : (
                      <>
                        More details <ChevronDown className="h-3 w-3" />
                      </>
                    )}
                  </button>
                </div>

                {/* expanded inline details */}
                {isExpanded && (
                  <div className="border-t border-slate-200 p-5 space-y-3 text-sm">
                    <div className="grid gap-2 sm:grid-cols-2">
                      {emp.email && (
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-slate-400">Email</span>
                          <p className="text-slate-700">{emp.email}</p>
                        </div>
                      )}
                      {emp.phone && (
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-slate-400">Phone</span>
                          <p className="text-slate-700">{emp.phone}</p>
                        </div>
                      )}
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-slate-400">Employment Type</span>
                        <p className="text-slate-700">{emp.employmentType || "full-time"}</p>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-slate-400">Owner Level</span>
                        <p className="text-slate-700">{emp.ownerLevel || "member"}</p>
                      </div>
                      {emp.joinedAt && (
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-slate-400">Joined</span>
                          <p className="text-slate-700">{new Date(emp.joinedAt).toLocaleDateString("en-IN")}</p>
                        </div>
                      )}
                    </div>
                    {emp.assignedClients && emp.assignedClients.length > 0 && (
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-slate-400">Assigned Clients</span>
                        <div className="mt-1 flex flex-wrap gap-1.5">
                          {emp.assignedClients.map((c, i) => (
                            <span
                              key={i}
                              className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs text-slate-600"
                            >
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {emp.notes && (
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-slate-400">Notes</span>
                        <p className="text-slate-600">{emp.notes}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {employees.length === 0 && (
            <p className="col-span-full py-16 text-center text-sm text-slate-400">No employees found.</p>
          )}
        </div>
      </section>

      {/* ── Modals ─────────────────────────────────────────── */}
      <EmployeeModal
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
        name={deleteTarget?.name || ""}
        deleting={deleting}
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}
