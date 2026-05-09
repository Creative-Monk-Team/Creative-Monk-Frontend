"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  Search,
  ExternalLink,
  CalendarClock,
  Users,
  IndianRupee,
  Activity,
  ArrowUpDown,
  Filter,
  Plus,
  X,
  MoreVertical,
  Pencil,
  Trash2,
  RefreshCw,
  HeartPulse,
} from "lucide-react";
import { toast } from "sonner";
import { adminApi } from "@/lib/api";
import { getAdminToken } from "@/lib/admin-session";
import type { AgencyClient } from "@/lib/types";

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const INR = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  notation: "compact",
  maximumFractionDigits: 1,
});

const statusOptions = ["All", "Active", "Onboarding", "Retainer", "Paused"] as const;
const healthOptions = ["All", "Green", "Amber", "Red"] as const;
const sortOptions = [
  { key: "name", label: "Name" },
  { key: "retainer", label: "Retainer \u2193" },
  { key: "review", label: "Next Review" },
] as const;

type SortKey = (typeof sortOptions)[number]["key"];

const STATUS_VALUES = ["onboarding", "active", "retainer", "paused"] as const;
const HEALTH_VALUES = ["green", "amber", "red"] as const;

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function statusBadge(status?: string) {
  switch (status) {
    case "onboarding":
      return "border-blue-200 bg-blue-50 text-blue-700";
    case "active":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "retainer":
      return "border-violet-200 bg-violet-50 text-violet-700";
    case "paused":
      return "border-amber-200 bg-amber-50 text-amber-700";
    case "offboarded":
      return "border-slate-200 bg-slate-100 text-slate-500";
    default:
      return "border-slate-200 bg-slate-50 text-slate-600";
  }
}

function healthDotColor(health?: string) {
  switch (health) {
    case "green":
      return "bg-emerald-500";
    case "amber":
      return "bg-amber-500";
    case "red":
      return "bg-red-500";
    default:
      return "bg-slate-300";
  }
}

function healthBarColor(health?: string) {
  switch (health) {
    case "green":
      return "#10b981";
    case "amber":
      return "#f59e0b";
    case "red":
      return "#ef4444";
    default:
      return "#94a3b8";
  }
}

function daysUntil(dateStr?: string) {
  if (!dateStr) return null;
  const diff = (new Date(dateStr).getTime() - Date.now()) / 86_400_000;
  return Math.ceil(diff);
}

/* ------------------------------------------------------------------ */
/*  Score Bar                                                          */
/* ------------------------------------------------------------------ */

function ScoreBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-14 text-[10px] uppercase tracking-wide text-slate-400">
        {label}
      </span>
      <div className="h-1.5 flex-1 rounded-full bg-slate-100">
        <div
          className="h-1.5 rounded-full bg-[#FF6600] transition-all"
          style={{ width: `${Math.min(value, 100)}%` }}
        />
      </div>
      <span className="w-7 text-right text-[10px] font-medium text-slate-600">
        {value}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Confirm Dialog                                                     */
/* ------------------------------------------------------------------ */

function ConfirmDialog({
  open,
  title,
  description,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <h3 className="text-lg font-semibold text-slate-950">{title}</h3>
        <p className="mt-2 text-sm text-slate-500">{description}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Card Dropdown Menu                                                 */
/* ------------------------------------------------------------------ */

function CardDropdown({
  client,
  onChangeStatus,
  onChangeHealth,
  onDelete,
}: {
  client: AgencyClient;
  onChangeStatus: (id: string, status: string) => void;
  onChangeHealth: (id: string, health: string) => void;
  onDelete: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [subMenu, setSubMenu] = useState<"status" | "health" | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSubMenu(null);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((p) => !p);
          setSubMenu(null);
        }}
        className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
      >
        <MoreVertical className="h-4 w-4" />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 w-48 rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
          {/* Edit */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/admin/super/clients/${client._id}?tab=settings`);
              setOpen(false);
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            <Pencil className="h-3.5 w-3.5" /> Edit
          </button>

          {/* Change Status */}
          <div className="relative">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSubMenu(subMenu === "status" ? null : "status");
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Change Status
            </button>
            {subMenu === "status" && (
              <div className="absolute left-full top-0 z-50 ml-1 w-36 rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
                {STATUS_VALUES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onChangeStatus(client._id, s);
                      setOpen(false);
                      setSubMenu(null);
                    }}
                    className={`flex w-full items-center gap-2 px-3 py-1.5 text-sm capitalize hover:bg-slate-50 ${
                      client.status === s
                        ? "font-semibold text-[#FF6600]"
                        : "text-slate-700"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Change Health */}
          <div className="relative">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSubMenu(subMenu === "health" ? null : "health");
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
            >
              <HeartPulse className="h-3.5 w-3.5" /> Change Health
            </button>
            {subMenu === "health" && (
              <div className="absolute left-full top-0 z-50 ml-1 w-36 rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
                {HEALTH_VALUES.map((h) => (
                  <button
                    key={h}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onChangeHealth(client._id, h);
                      setOpen(false);
                      setSubMenu(null);
                    }}
                    className={`flex w-full items-center gap-2 px-3 py-1.5 text-sm capitalize hover:bg-slate-50 ${
                      client.projectHealth === h
                        ? "font-semibold text-[#FF6600]"
                        : "text-slate-700"
                    }`}
                  >
                    <span className={`inline-block h-2 w-2 rounded-full ${healthDotColor(h)}`} />
                    {h}
                  </button>
                ))}
              </div>
            )}
          </div>

          <hr className="my-1 border-slate-100" />

          {/* Delete */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(client._id);
              setOpen(false);
              setSubMenu(null);
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-3.5 w-3.5" /> Delete
          </button>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Create Client Modal                                                */
/* ------------------------------------------------------------------ */

const BLANK_FORM = {
  name: "",
  website: "",
  primaryContact: "",
  contactEmail: "",
  contactPhone: "",
  owner: "",
  status: "onboarding" as const,
  monthlyRetainer: 0,
  projectHealth: "green" as const,
  seoScore: 0,
  socialScore: 0,
  websiteScore: 0,
  nextReviewDate: "",
  services: "",
  hasCmsAccess: false,
  notes: "",
};

type FormData = typeof BLANK_FORM;

function CreateClientModal({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}) {
  const [form, setForm] = useState<FormData>({ ...BLANK_FORM });
  const [saving, setSaving] = useState(false);
  const token = getAdminToken();

  function set<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Client name is required");
      return;
    }

    setSaving(true);
    try {
      const payload: Record<string, unknown> = {
        name: form.name.trim(),
        website: form.website.trim() || undefined,
        primaryContact: form.primaryContact.trim() || undefined,
        contactEmail: form.contactEmail.trim() || undefined,
        contactPhone: form.contactPhone.trim() || undefined,
        owner: form.owner.trim() || undefined,
        status: form.status,
        monthlyRetainer: Number(form.monthlyRetainer) || 0,
        projectHealth: form.projectHealth,
        seoScore: Number(form.seoScore) || 0,
        socialScore: Number(form.socialScore) || 0,
        websiteScore: Number(form.websiteScore) || 0,
        nextReviewDate: form.nextReviewDate || undefined,
        services: form.services
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        hasCmsAccess: form.hasCmsAccess,
        notes: form.notes.trim() || undefined,
      };

      await adminApi.create("agency-clients", token, payload);
      toast.success("Client created successfully");
      setForm({ ...BLANK_FORM });
      onCreated();
      onClose();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to create client");
    } finally {
      setSaving(false);
    }
  }

  if (!open) return null;

  const inputCls =
    "w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#FF6600]/40 focus:bg-white";
  const labelCls = "block text-xs font-medium text-slate-600 mb-1";

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 pt-16">
      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-2xl rounded-2xl bg-white shadow-xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-950">Add New Client</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[70vh] space-y-6 overflow-y-auto px-6 py-5">
          {/* -- Contact Section -- */}
          <fieldset>
            <legend className="mb-3 text-sm font-semibold text-slate-800">Contact</legend>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className={labelCls}>
                  Client Name <span className="text-red-500">*</span>
                </label>
                <input
                  className={inputCls}
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="Acme Corp"
                  required
                />
              </div>
              <div>
                <label className={labelCls}>Website URL</label>
                <input
                  className={inputCls}
                  value={form.website}
                  onChange={(e) => set("website", e.target.value)}
                  placeholder="https://example.com"
                />
              </div>
              <div>
                <label className={labelCls}>Primary Contact Name</label>
                <input
                  className={inputCls}
                  value={form.primaryContact}
                  onChange={(e) => set("primaryContact", e.target.value)}
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className={labelCls}>Contact Email</label>
                <input
                  type="email"
                  className={inputCls}
                  value={form.contactEmail}
                  onChange={(e) => set("contactEmail", e.target.value)}
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className={labelCls}>Contact Phone</label>
                <input
                  className={inputCls}
                  value={form.contactPhone}
                  onChange={(e) => set("contactPhone", e.target.value)}
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>
          </fieldset>

          {/* -- Business Section -- */}
          <fieldset>
            <legend className="mb-3 text-sm font-semibold text-slate-800">Business</legend>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelCls}>Account Owner</label>
                <input
                  className={inputCls}
                  value={form.owner}
                  onChange={(e) => set("owner", e.target.value)}
                  placeholder="Owner name"
                />
              </div>
              <div>
                <label className={labelCls}>Status</label>
                <select
                  className={inputCls}
                  value={form.status}
                  onChange={(e) => set("status", e.target.value as FormData["status"])}
                >
                  {STATUS_VALUES.map((s) => (
                    <option key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls}>Monthly Retainer (INR)</label>
                <input
                  type="number"
                  min={0}
                  className={inputCls}
                  value={form.monthlyRetainer || ""}
                  onChange={(e) => set("monthlyRetainer", Number(e.target.value) as unknown as typeof form.monthlyRetainer)}
                  placeholder="50000"
                />
              </div>
              <div>
                <label className={labelCls}>Project Health</label>
                <div className="mt-1 flex items-center gap-4">
                  {HEALTH_VALUES.map((h) => (
                    <label key={h} className="flex cursor-pointer items-center gap-1.5">
                      <input
                        type="radio"
                        name="projectHealth"
                        value={h}
                        checked={form.projectHealth === h}
                        onChange={() => set("projectHealth", h as FormData["projectHealth"])}
                        className="accent-[#FF6600]"
                      />
                      <span className={`inline-block h-2.5 w-2.5 rounded-full ${healthDotColor(h)}`} />
                      <span className="text-sm capitalize text-slate-700">{h}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </fieldset>

          {/* -- Scores Section -- */}
          <fieldset>
            <legend className="mb-3 text-sm font-semibold text-slate-800">Scores</legend>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className={labelCls}>SEO Score (0-100)</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  className={inputCls}
                  value={form.seoScore || ""}
                  onChange={(e) => set("seoScore", Number(e.target.value) as unknown as typeof form.seoScore)}
                  placeholder="0"
                />
              </div>
              <div>
                <label className={labelCls}>Social Score (0-100)</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  className={inputCls}
                  value={form.socialScore || ""}
                  onChange={(e) => set("socialScore", Number(e.target.value) as unknown as typeof form.socialScore)}
                  placeholder="0"
                />
              </div>
              <div>
                <label className={labelCls}>Website Score (0-100)</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  className={inputCls}
                  value={form.websiteScore || ""}
                  onChange={(e) => set("websiteScore", Number(e.target.value) as unknown as typeof form.websiteScore)}
                  placeholder="0"
                />
              </div>
            </div>
          </fieldset>

          {/* -- Other Section -- */}
          <fieldset>
            <legend className="mb-3 text-sm font-semibold text-slate-800">Other</legend>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelCls}>Next Review Date</label>
                <input
                  type="date"
                  className={inputCls}
                  value={form.nextReviewDate}
                  onChange={(e) => set("nextReviewDate", e.target.value)}
                />
              </div>
              <div>
                <label className={labelCls}>Services (comma-separated)</label>
                <input
                  className={inputCls}
                  value={form.services}
                  onChange={(e) => set("services", e.target.value)}
                  placeholder="SEO, Social Media, Web Dev"
                />
              </div>
              <div className="flex items-center gap-2 pt-5">
                <input
                  type="checkbox"
                  id="hasCmsAccess"
                  checked={form.hasCmsAccess}
                  onChange={(e) => set("hasCmsAccess", e.target.checked)}
                  className="h-4 w-4 rounded accent-[#FF6600]"
                />
                <label htmlFor="hasCmsAccess" className="text-sm text-slate-700">
                  CMS Access
                </label>
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Notes</label>
                <textarea
                  className={inputCls + " min-h-[80px] resize-y"}
                  value={form.notes}
                  onChange={(e) => set("notes", e.target.value)}
                  placeholder="Any additional notes..."
                />
              </div>
            </div>
          </fieldset>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-slate-100 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-[#FF6600] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#e65c00] disabled:opacity-60"
          >
            {saving && (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            )}
            Create Client
          </button>
        </div>
      </form>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Page Component                                                */
/* ------------------------------------------------------------------ */

export default function SuperAdminClientsPage() {
  const token = getAdminToken();
  const router = useRouter();
  const [clients, setClients] = useState<AgencyClient[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [healthFilter, setHealthFilter] = useState<string>("All");
  const [sortBy, setSortBy] = useState<SortKey>("name");
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  /* ---------- Fetch ---------- */
  const fetchClients = useCallback((showLoading = true) => {
    if (showLoading) setLoading(true);
    adminApi
      .list<AgencyClient[]>("admin/agency-clients", token)
      .then(setClients)
      .catch(() => {
        toast.error("Failed to load clients");
      })
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => {
    fetchClients(false);
  }, [fetchClients]);

  /* ---------- Quick Actions ---------- */
  async function handleChangeStatus(id: string, newStatus: string) {
    try {
      await adminApi.update("agency-clients/" + id, token, { status: newStatus }, "PATCH");
      toast.success(`Status changed to ${newStatus}`);
      fetchClients();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to update status");
    }
  }

  async function handleChangeHealth(id: string, newHealth: string) {
    try {
      await adminApi.update("agency-clients/" + id, token, { projectHealth: newHealth }, "PATCH");
      toast.success(`Health changed to ${newHealth}`);
      fetchClients();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to update health");
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await adminApi.remove("agency-clients/" + deleteTarget, token);
      toast.success("Client deleted");
      setDeleteTarget(null);
      fetchClients();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to delete client");
    }
  }

  /* ---------- Derived ---------- */
  const filtered = useMemo(() => {
    let list = clients.filter((c) => {
      const matchSearch =
        !search ||
        `${c.name} ${c.owner || ""} ${c.website || ""}`
          .toLowerCase()
          .includes(search.toLowerCase());
      const matchStatus =
        statusFilter === "All" || c.status === statusFilter.toLowerCase();
      const matchHealth =
        healthFilter === "All" || c.projectHealth === healthFilter.toLowerCase();
      return matchSearch && matchStatus && matchHealth;
    });

    list = [...list].sort((a, b) => {
      switch (sortBy) {
        case "retainer":
          return (b.monthlyRetainer || 0) - (a.monthlyRetainer || 0);
        case "review": {
          const da = a.nextReviewDate ? new Date(a.nextReviewDate).getTime() : Infinity;
          const db = b.nextReviewDate ? new Date(b.nextReviewDate).getTime() : Infinity;
          return da - db;
        }
        default:
          return a.name.localeCompare(b.name);
      }
    });
    return list;
  }, [clients, search, statusFilter, healthFilter, sortBy]);

  /* ---------- Stats ---------- */
  const activeClients = clients.filter(
    (c) => c.status === "active" || c.status === "retainer" || c.status === "onboarding",
  );
  const totalRetainer = clients.reduce((s, c) => s + (c.monthlyRetainer || 0), 0);
  const avgSeo =
    activeClients.length
      ? Math.round(activeClients.reduce((s, c) => s + (c.seoScore || 0), 0) / activeClients.length)
      : 0;
  const avgSocial =
    activeClients.length
      ? Math.round(activeClients.reduce((s, c) => s + (c.socialScore || 0), 0) / activeClients.length)
      : 0;
  const avgWeb =
    activeClients.length
      ? Math.round(activeClients.reduce((s, c) => s + (c.websiteScore || 0), 0) / activeClients.length)
      : 0;
  const reviewsDueSoon = clients.filter((c) => {
    const d = daysUntil(c.nextReviewDate);
    return d !== null && d >= 0 && d <= 7;
  }).length;

  /* ---------- Chart ---------- */
  const chartData = [...clients]
    .sort((a, b) => (b.monthlyRetainer || 0) - (a.monthlyRetainer || 0))
    .slice(0, 10)
    .map((c) => ({
      name: c.name.length > 18 ? c.name.slice(0, 16) + "\u2026" : c.name,
      retainer: c.monthlyRetainer || 0,
      health: c.projectHealth || "green",
    }));

  /* ---------- UI ---------- */
  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-[#FF6600]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Create Modal */}
      <CreateClientModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onCreated={fetchClients}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete Client"
        description="Are you sure you want to delete this client? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* ---- Top Bar ---- */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
            Managed Clients
          </h1>
          <div className="flex flex-wrap items-center gap-3">
            {/* search */}
            <div className="relative min-w-[200px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search clients\u2026"
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-[#FF6600]/40 focus:bg-white"
              />
            </div>
            {/* status filter */}
            <div className="flex items-center gap-1.5">
              <Filter className="h-3.5 w-3.5 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none"
              >
                {statusOptions.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </div>
            {/* health filter */}
            <select
              value={healthFilter}
              onChange={(e) => setHealthFilter(e.target.value)}
              className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none"
            >
              {healthOptions.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
            {/* sort */}
            <div className="flex items-center gap-1.5">
              <ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortKey)}
                className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none"
              >
                {sortOptions.map((o) => (
                  <option key={o.key} value={o.key}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            {/* Add Client */}
            <button
              type="button"
              onClick={() => setShowCreate(true)}
              className="flex h-10 items-center gap-2 rounded-xl bg-[#FF6600] px-4 text-sm font-medium text-white transition hover:bg-[#e65c00]"
            >
              <Plus className="h-4 w-4" />
              Add Client
            </button>
          </div>
        </div>
      </section>

      {/* ---- Stats Row ---- */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Active Clients",
            value: String(activeClients.length),
            icon: <Users className="h-5 w-5 text-[#FF6600]" />,
          },
          {
            label: "Retainer Book",
            value: INR.format(totalRetainer),
            icon: <IndianRupee className="h-5 w-5 text-[#FF6600]" />,
          },
          {
            label: "Avg Scores (SEO / Social / Web)",
            value: `${avgSeo} / ${avgSocial} / ${avgWeb}`,
            icon: <Activity className="h-5 w-5 text-[#FF6600]" />,
          },
          {
            label: "Reviews Due (7d)",
            value: String(reviewsDueSoon),
            icon: <CalendarClock className="h-5 w-5 text-[#FF6600]" />,
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">
                {stat.label}
              </p>
              {stat.icon}
            </div>
            <p className="mt-3 text-2xl font-semibold text-slate-950">{stat.value}</p>
          </div>
        ))}
      </section>

      {/* ---- Client Cards Grid ---- */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((client) => {
          const reviewDays = daysUntil(client.nextReviewDate);
          const overdue = reviewDays !== null && reviewDays < 0;
          const dueSoon = reviewDays !== null && reviewDays >= 0 && reviewDays <= 3;

          return (
            <div
              key={client._id}
              className="group relative rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-[#FF6600]/30 hover:shadow-md"
            >
              {/* Dropdown menu */}
              <div className="absolute right-3 top-3 z-10">
                <CardDropdown
                  client={client}
                  onChangeStatus={handleChangeStatus}
                  onChangeHealth={handleChangeHealth}
                  onDelete={setDeleteTarget}
                />
              </div>

              {/* Clickable area */}
              <button
                type="button"
                onClick={() => router.push(`/admin/super/clients/${client._id}`)}
                className="w-full text-left"
              >
                {/* top row */}
                <div className="flex items-start justify-between gap-2 pr-8">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-base font-semibold text-slate-950">
                      {client.name}
                    </p>
                    {client.website && (
                      <span className="mt-0.5 inline-flex items-center gap-1 text-xs text-slate-400">
                        {client.website}
                        <ExternalLink className="h-3 w-3" />
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full border px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider ${statusBadge(client.status)}`}
                    >
                      {client.status || "unknown"}
                    </span>
                    <span
                      className={`inline-block h-2.5 w-2.5 rounded-full ${healthDotColor(client.projectHealth)}`}
                      title={`Health: ${client.projectHealth || "n/a"}`}
                    />
                  </div>
                </div>

                {/* owner */}
                {client.owner && (
                  <p className="mt-2 text-xs text-slate-500">
                    Owner: <span className="font-medium text-slate-700">{client.owner}</span>
                  </p>
                )}

                {/* retainer + review */}
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-800">
                    {INR.format(client.monthlyRetainer || 0)}{" "}
                    <span className="text-xs font-normal text-slate-400">/mo</span>
                  </span>
                  {client.nextReviewDate && (
                    <span
                      className={`text-xs ${
                        overdue || dueSoon ? "font-semibold text-red-600" : "text-slate-500"
                      }`}
                    >
                      Review:{" "}
                      {new Date(client.nextReviewDate).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                      })}
                      {overdue && " (overdue)"}
                      {dueSoon && !overdue && " (soon)"}
                    </span>
                  )}
                </div>

                {/* score bars */}
                <div className="mt-3 space-y-1">
                  <ScoreBar label="SEO" value={client.seoScore || 0} />
                  <ScoreBar label="Social" value={client.socialScore || 0} />
                  <ScoreBar label="Web" value={client.websiteScore || 0} />
                </div>

                {/* services */}
                {client.services && client.services.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {client.services.map((s) => (
                      <span
                        key={s}
                        className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] text-slate-600"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </button>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <p className="col-span-full py-16 text-center text-sm text-slate-400">
            No clients match your filters.
          </p>
        )}
      </section>

      {/* ---- Retainer Distribution Chart ---- */}
      {chartData.length > 0 && (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="mb-4 text-sm font-medium text-slate-950">
            Top 10 Clients by Monthly Retainer
          </p>
          <ResponsiveContainer width="100%" height={Math.max(chartData.length * 44, 200)}>
            <BarChart data={chartData} layout="vertical" margin={{ left: 10, right: 30 }}>
              <XAxis type="number" tickFormatter={(v: number) => INR.format(v)} fontSize={11} />
              <YAxis
                type="category"
                dataKey="name"
                width={140}
                fontSize={11}
                tick={{ fill: "#334155" }}
              />
              <Tooltip
                formatter={(v) => INR.format(Number(v))}
                contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0" }}
              />
              <Bar dataKey="retainer" radius={[0, 6, 6, 0]} barSize={22}>
                {chartData.map((entry, idx) => (
                  <Cell key={idx} fill={healthBarColor(entry.health)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </section>
      )}
    </div>
  );
}
