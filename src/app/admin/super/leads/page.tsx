"use client";

import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowUpDown,
  ChevronDown,
  LayoutGrid,
  Plus,
  Search,
  Sparkles,
  Table2,
  TrendingUp,
  Users,
  Clock,
  Trash2,
  X,
  GripVertical,
} from "lucide-react";
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd";
import { toast } from "sonner";
import { adminApi, submitEnquiry } from "@/lib/api";
import { getAdminToken } from "@/lib/admin-session";
import type { Enquiry, PipelineColumn, PipelineStage, LeadPriority } from "@/lib/types";

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const STAGES: { key: PipelineStage; label: string; color: string; hex: string; bg: string; border: string }[] = [
  { key: "new", label: "New", hex: "#FF6600", color: "text-orange-700", bg: "bg-orange-50", border: "border-orange-200" },
  { key: "qualified", label: "Qualified", hex: "#3b82f6", color: "text-blue-700", bg: "bg-blue-50", border: "border-blue-200" },
  { key: "proposal_sent", label: "Proposal Sent", hex: "#8b5cf6", color: "text-violet-700", bg: "bg-violet-50", border: "border-violet-200" },
  { key: "negotiation", label: "Negotiation", hex: "#f59e0b", color: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200" },
  { key: "won", label: "Won", hex: "#10b981", color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
  { key: "lost", label: "Lost", hex: "#64748b", color: "text-slate-600", bg: "bg-slate-100", border: "border-slate-200" },
];

const PRIORITY_STYLES: Record<string, string> = {
  hot: "border-red-200 bg-red-50 text-red-700",
  warm: "border-amber-200 bg-amber-50 text-amber-700",
  cold: "border-sky-200 bg-sky-50 text-sky-700",
};

const PRIORITY_ORDER: LeadPriority[] = ["hot", "warm", "cold"];

const SOURCE_OPTIONS = [
  "contact",
  "landing-page",
  "organic-search",
  "referral",
  "instagram",
  "google-ads",
  "website-form",
];

const ASSIGNEES = ["Rahul", "Priya", "Ankit", "Sneha"];

function stageInfo(stage?: PipelineStage) {
  return STAGES.find((s) => s.key === stage) || STAGES[0];
}

function daysSince(date: string) {
  return Math.max(0, Math.floor((Date.now() - new Date(date).getTime()) / 86_400_000));
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

type SortKey = "name" | "email" | "service" | "stage" | "priority" | "source" | "assignedTo" | "createdAt";
type SortDir = "asc" | "desc";

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function SuperAdminLeadsPage() {
  const token = getAdminToken();
  const router = useRouter();

  const [leads, setLeads] = useState<Enquiry[]>([]);
  const [pipeline, setPipeline] = useState<PipelineColumn[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"board" | "table">("board");
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [openStageDropdown, setOpenStageDropdown] = useState<string | null>(null);
  const [openAssignDropdown, setOpenAssignDropdown] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Create modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    sourcePage: "contact",
    priority: "warm" as LeadPriority,
    estimatedValue: "",
    notes: "",
  });

  const dropdownRef = useRef<HTMLDivElement>(null);

  /* ---------- close dropdowns on outside click ---------- */

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenStageDropdown(null);
        setOpenAssignDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  /* ---------- data loading ---------- */

  const loadData = useCallback(async () => {
    try {
      const [enquiries, pipelineData] = await Promise.all([
        adminApi.list<Enquiry[]>("enquiries", token),
        adminApi.getPipeline(token) as Promise<PipelineColumn[]>,
      ]);
      setLeads(enquiries);
      setPipeline(pipelineData);
    } catch {
      toast.error("Failed to load leads");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  /* ---------- derived data ---------- */

  const filtered = useMemo(() => {
    return leads.filter((l) => {
      const haystack = `${l.name} ${l.email} ${l.service || ""}`.toLowerCase();
      if (search && !haystack.includes(search.toLowerCase())) return false;
      return true;
    });
  }, [leads, search]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      let aVal: string | number = "";
      let bVal: string | number = "";
      switch (sortKey) {
        case "name": aVal = a.name.toLowerCase(); bVal = b.name.toLowerCase(); break;
        case "email": aVal = a.email.toLowerCase(); bVal = b.email.toLowerCase(); break;
        case "service": aVal = (a.service || "").toLowerCase(); bVal = (b.service || "").toLowerCase(); break;
        case "stage": aVal = a.stage || "new"; bVal = b.stage || "new"; break;
        case "priority": aVal = a.priority || "cold"; bVal = b.priority || "cold"; break;
        case "source": aVal = a.sourcePage || "direct"; bVal = b.sourcePage || "direct"; break;
        case "assignedTo": aVal = a.assignedTo || ""; bVal = b.assignedTo || ""; break;
        case "createdAt": aVal = new Date(a.createdAt).getTime(); bVal = new Date(b.createdAt).getTime(); break;
      }
      if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return arr;
  }, [filtered, sortKey, sortDir]);

  /* ---------- board columns from filtered leads ---------- */

  const boardColumns = useMemo(() => {
    return STAGES.map((stage) => {
      const pipelineCol = pipeline.find((c) => c.stage === stage.key);
      const stageLeads = pipelineCol?.leads || filtered.filter((l) => (l.stage || "new") === stage.key);
      // Apply search filter to board cards too
      const searchedLeads = search
        ? stageLeads.filter((l) => {
            const haystack = `${l.name} ${l.email} ${l.service || ""}`.toLowerCase();
            return haystack.includes(search.toLowerCase());
          })
        : stageLeads;
      return { stage: stage.key, leads: searchedLeads, count: searchedLeads.length };
    });
  }, [pipeline, filtered, search]);

  /* ---------- stats ---------- */

  const stats = useMemo(() => {
    const total = leads.length;
    const oneWeekAgo = Date.now() - 7 * 86_400_000;
    const newThisWeek = leads.filter((l) => new Date(l.createdAt).getTime() >= oneWeekAgo).length;
    const wonCount = leads.filter((l) => l.stage === "won").length;
    const conversionRate = total > 0 ? ((wonCount / total) * 100).toFixed(1) : "0";
    const avgDays =
      total > 0
        ? Math.round(leads.reduce((sum, l) => sum + daysSince(l.createdAt), 0) / total)
        : 0;
    return { total, newThisWeek, conversionRate, avgDays };
  }, [leads]);

  /* ---------- actions ---------- */

  async function handleChangeStage(id: string, stage: PipelineStage) {
    try {
      await adminApi.changeLeadStage(id, stage, token);
      toast.success(`Stage changed to ${stageInfo(stage).label}`);
      setOpenStageDropdown(null);
      void loadData();
    } catch {
      toast.error("Failed to update stage");
    }
  }

  async function handleCyclePriority(id: string, currentPriority?: LeadPriority) {
    const currentIdx = PRIORITY_ORDER.indexOf(currentPriority || "cold");
    const next = PRIORITY_ORDER[(currentIdx + 1) % PRIORITY_ORDER.length];
    try {
      await adminApi.update("enquiries/" + id, token, { priority: next }, "PATCH");
      toast.success(`Priority set to ${next}`);
      void loadData();
    } catch {
      toast.error("Failed to update priority");
    }
  }

  async function handleAssign(id: string, assignedTo: string) {
    try {
      await adminApi.assignLead(id, assignedTo, token);
      toast.success(assignedTo ? `Lead assigned to ${assignedTo}` : "Lead unassigned");
      setOpenAssignDropdown(null);
      void loadData();
    } catch {
      toast.error("Failed to assign lead");
    }
  }

  async function handleDelete(id: string) {
    try {
      await adminApi.remove("enquiries/" + id, token);
      toast.success("Lead deleted");
      setDeleteConfirm(null);
      void loadData();
    } catch {
      toast.error("Failed to delete lead");
    }
  }

  async function handleCreate() {
    if (!form.name.trim() || !form.email.trim()) {
      toast.error("Name and email are required");
      return;
    }
    setCreating(true);
    try {
      // Create via the contact endpoint
      const result = await submitEnquiry({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        service: form.service.trim() || undefined,
        message: form.notes.trim() || "New lead created from admin panel",
        sourcePage: form.sourcePage,
      });

      if (result.success) {
        toast.success("Lead created successfully");
        setShowCreateModal(false);
        setForm({
          name: "",
          email: "",
          phone: "",
          service: "",
          sourcePage: "contact",
          priority: "warm",
          estimatedValue: "",
          notes: "",
        });
        // Reload data — the new enquiry should appear
        await loadData();

        // Try to update the newest matching lead with priority/estimatedValue
        const freshLeads = await adminApi.list<Enquiry[]>("enquiries", token);
        const newest = freshLeads.find(
          (l) => l.email === form.email.trim() && l.name === form.name.trim(),
        );
        if (newest) {
          const updates: Record<string, unknown> = { priority: form.priority };
          if (form.estimatedValue) updates.estimatedValue = Number(form.estimatedValue);
          await adminApi.update("enquiries/" + newest._id, token, updates, "PATCH");
          void loadData();
        }
      }
    } catch {
      toast.error("Failed to create lead");
    } finally {
      setCreating(false);
    }
  }

  /* ---------- drag and drop ---------- */

  async function handleDragEnd(result: DropResult) {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId) return;

    const newStage = destination.droppableId as PipelineStage;
    const stageMeta = stageInfo(newStage);

    // Optimistic update
    setLeads((prev) =>
      prev.map((l) => (l._id === draggableId ? { ...l, stage: newStage } : l)),
    );

    try {
      await adminApi.changeLeadStage(draggableId, newStage, token);
      toast.success(`Moved to ${stageMeta.label}`);
      void loadData();
    } catch {
      toast.error("Failed to move lead");
      void loadData(); // revert
    }
  }

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  /* ---------- render ---------- */

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-orange-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6" ref={dropdownRef}>
      {/* ========== Create Lead Modal ========== */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="relative mx-4 w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            {/* Close */}
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            >
              <X className="h-5 w-5" />
            </button>

            <h2 className="text-xl font-semibold text-slate-950">Create New Lead</h2>
            <p className="mt-1 text-sm text-slate-500">Add a new lead to the pipeline.</p>

            <div className="mt-5 space-y-4">
              {/* Name & Email */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600">Name *</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="John Doe"
                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none transition focus:border-orange-300 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600">Email *</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="john@example.com"
                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none transition focus:border-orange-300 focus:bg-white"
                  />
                </div>
              </div>

              {/* Phone & Service */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600">Phone</label>
                  <input
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none transition focus:border-orange-300 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600">Service</label>
                  <input
                    value={form.service}
                    onChange={(e) => setForm({ ...form, service: e.target.value })}
                    placeholder="SEO, Web Dev..."
                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none transition focus:border-orange-300 focus:bg-white"
                  />
                </div>
              </div>

              {/* Source & Estimated Value */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600">Source Page</label>
                  <div className="relative">
                    <select
                      value={form.sourcePage}
                      onChange={(e) => setForm({ ...form, sourcePage: e.target.value })}
                      className="h-10 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3 pr-8 text-sm text-slate-700 outline-none transition focus:border-orange-300 focus:bg-white"
                    >
                      {SOURCE_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600">Estimated Value (₹)</label>
                  <input
                    type="number"
                    value={form.estimatedValue}
                    onChange={(e) => setForm({ ...form, estimatedValue: e.target.value })}
                    placeholder="50000"
                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none transition focus:border-orange-300 focus:bg-white"
                  />
                </div>
              </div>

              {/* Priority */}
              <div>
                <label className="mb-2 block text-xs font-medium text-slate-600">Priority</label>
                <div className="flex gap-3">
                  {PRIORITY_ORDER.map((p) => (
                    <label
                      key={p}
                      className={`flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition ${
                        form.priority === p
                          ? PRIORITY_STYLES[p] + " ring-2 ring-offset-1 ring-current"
                          : "border-slate-200 bg-slate-50 text-slate-500 hover:border-slate-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="priority"
                        value={p}
                        checked={form.priority === p}
                        onChange={() => setForm({ ...form, priority: p })}
                        className="sr-only"
                      />
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </label>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">Notes</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Any additional context..."
                  rows={3}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-orange-300 focus:bg-white"
                />
              </div>

              {/* Submit */}
              <button
                type="button"
                onClick={() => void handleCreate()}
                disabled={creating}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#FF6600] text-sm font-semibold text-white transition hover:bg-orange-700 disabled:opacity-60"
              >
                {creating ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                {creating ? "Creating..." : "Create Lead"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========== Delete Confirm Modal ========== */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-slate-950">Delete Lead</h3>
            <p className="mt-2 text-sm text-slate-500">
              Are you sure you want to delete this lead? This action cannot be undone.
            </p>
            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void handleDelete(deleteConfirm)}
                className="flex-1 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========== Top bar ========== */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-[#FF6600]" />
            <h1 className="text-2xl font-semibold tracking-tight text-slate-950">Lead Pipeline</h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name, email, service..."
                className="h-10 w-64 rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-orange-300 focus:bg-white"
              />
            </div>

            {/* + New Lead */}
            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="flex h-10 items-center gap-2 rounded-xl bg-[#FF6600] px-4 text-sm font-semibold text-white transition hover:bg-orange-700"
            >
              <Plus className="h-4 w-4" />
              New Lead
            </button>

            {/* View toggle */}
            <div className="flex overflow-hidden rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setView("board")}
                className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition ${
                  view === "board"
                    ? "bg-slate-950 text-white"
                    : "bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                <LayoutGrid className="h-4 w-4" /> Board
              </button>
              <button
                type="button"
                onClick={() => setView("table")}
                className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition ${
                  view === "table"
                    ? "bg-slate-950 text-white"
                    : "bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Table2 className="h-4 w-4" /> Table
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========== Stats row ========== */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Leads", value: stats.total, icon: Users, accent: "text-[#FF6600]" },
          { label: "New This Week", value: stats.newThisWeek, icon: Sparkles, accent: "text-blue-500" },
          { label: "Conversion Rate", value: `${stats.conversionRate}%`, icon: TrendingUp, accent: "text-emerald-500" },
          { label: "Avg Days in Pipeline", value: stats.avgDays, icon: Clock, accent: "text-violet-500" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                {stat.label}
              </p>
              <stat.icon className={`h-5 w-5 ${stat.accent}`} />
            </div>
            <p className="mt-3 text-3xl font-semibold text-slate-950">{stat.value}</p>
          </div>
        ))}
      </section>

      {/* ========== Board View (Kanban with DnD) ========== */}
      {view === "board" && (
        <DragDropContext onDragEnd={handleDragEnd}>
          <section className="grid gap-4 lg:grid-cols-6">
            {STAGES.map((stage) => {
              const col = boardColumns.find((c) => c.stage === stage.key);
              const stageLeads = col?.leads || [];
              return (
                <Droppable droppableId={stage.key} key={stage.key}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex flex-col rounded-2xl border transition-colors ${
                        snapshot.isDraggingOver
                          ? "border-[#FF6600]/40 bg-orange-50/50"
                          : "border-slate-200 bg-[#f5f5f7]"
                      }`}
                    >
                      {/* Column header */}
                      <div
                        className={`flex items-center justify-between rounded-t-2xl border-b px-4 py-3 ${stage.bg} ${stage.border}`}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="h-2.5 w-2.5 rounded-full"
                            style={{ backgroundColor: stage.hex }}
                          />
                          <span className={`text-xs font-semibold uppercase tracking-wider ${stage.color}`}>
                            {stage.label}
                          </span>
                        </div>
                        <span
                          className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${stage.color} ${stage.border} bg-white`}
                        >
                          {stageLeads.length}
                        </span>
                      </div>

                      {/* Cards */}
                      <div className="flex flex-1 flex-col gap-2 p-2" style={{ minHeight: 100 }}>
                        {stageLeads.map((lead, index) => (
                          <Draggable key={lead._id} draggableId={lead._id} index={index}>
                            {(dragProvided, dragSnapshot) => (
                              <div
                                ref={dragProvided.innerRef}
                                {...dragProvided.draggableProps}
                                className={`group rounded-xl border bg-white p-3 text-left shadow-sm transition ${
                                  dragSnapshot.isDragging
                                    ? "border-[#FF6600] shadow-lg ring-2 ring-[#FF6600]/20"
                                    : "border-slate-200 hover:border-orange-200 hover:shadow-md"
                                }`}
                              >
                                <div className="flex items-start justify-between">
                                  <button
                                    type="button"
                                    onClick={() => router.push(`/admin/super/leads/${lead._id}`)}
                                    className="flex-1 text-left"
                                  >
                                    <p className="text-sm font-medium text-slate-900">{lead.name}</p>
                                    <p className="mt-0.5 text-xs text-slate-500">{lead.service || "General"}</p>
                                  </button>
                                  <div
                                    {...dragProvided.dragHandleProps}
                                    className="ml-1 cursor-grab rounded p-0.5 text-slate-300 opacity-0 transition group-hover:opacity-100 active:cursor-grabbing"
                                  >
                                    <GripVertical className="h-4 w-4" />
                                  </div>
                                </div>

                                <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                                  <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-medium text-slate-500">
                                    {lead.sourcePage || "direct"}
                                  </span>
                                  {lead.priority && (
                                    <button
                                      type="button"
                                      onClick={() => void handleCyclePriority(lead._id, lead.priority)}
                                      className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase transition hover:opacity-80 ${PRIORITY_STYLES[lead.priority] || ""}`}
                                    >
                                      {lead.priority}
                                    </button>
                                  )}
                                </div>

                                <div className="mt-2 flex items-center justify-between">
                                  <p className="text-[10px] text-slate-400">
                                    {daysSince(lead.createdAt)}d ago
                                  </p>
                                  {lead.assignedTo && (
                                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
                                      {lead.assignedTo}
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                        {stageLeads.length === 0 && (
                          <p className="py-8 text-center text-xs text-slate-300">No leads</p>
                        )}
                      </div>
                    </div>
                  )}
                </Droppable>
              );
            })}
          </section>
        </DragDropContext>
      )}

      {/* ========== Table View ========== */}
      {view === "table" && (
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  {([
                    ["name", "Name"],
                    ["email", "Email"],
                    ["service", "Service"],
                    ["stage", "Stage"],
                    ["priority", "Priority"],
                    ["source", "Source"],
                    ["assignedTo", "Assigned To"],
                    ["createdAt", "Created"],
                  ] as [SortKey, string][]).map(([key, label]) => (
                    <th
                      key={key}
                      className="cursor-pointer px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 transition hover:text-slate-700"
                      onClick={() => toggleSort(key)}
                    >
                      <span className="inline-flex items-center gap-1">
                        {label}
                        <ArrowUpDown className={`h-3 w-3 ${sortKey === key ? "text-[#FF6600]" : ""}`} />
                      </span>
                    </th>
                  ))}
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((lead) => {
                  const si = stageInfo(lead.stage);
                  return (
                    <tr
                      key={lead._id}
                      className="cursor-pointer border-b border-slate-50 transition hover:bg-slate-50/80"
                      onClick={() => router.push(`/admin/super/leads/${lead._id}`)}
                    >
                      <td className="px-4 py-3 font-medium text-slate-900">{lead.name}</td>
                      <td className="px-4 py-3 text-slate-600">{lead.email}</td>
                      <td className="px-4 py-3 text-slate-600">{lead.service || "-"}</td>

                      {/* Stage (inline dropdown) */}
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <div className="relative inline-block">
                          <button
                            type="button"
                            onClick={() =>
                              setOpenStageDropdown(openStageDropdown === lead._id ? null : lead._id)
                            }
                            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider transition hover:opacity-80 ${si.color} ${si.bg} ${si.border}`}
                          >
                            {si.label}
                            <ChevronDown className="h-3 w-3" />
                          </button>
                          {openStageDropdown === lead._id && (
                            <div className="absolute left-0 z-30 mt-1 w-40 rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
                              {STAGES.map((s) => (
                                <button
                                  key={s.key}
                                  type="button"
                                  onClick={() => void handleChangeStage(lead._id, s.key)}
                                  className={`flex w-full items-center gap-2 px-3 py-2 text-left text-xs transition hover:bg-slate-50 ${
                                    lead.stage === s.key ? "font-semibold text-[#FF6600]" : "text-slate-700"
                                  }`}
                                >
                                  <div
                                    className="h-2 w-2 rounded-full"
                                    style={{ backgroundColor: s.hex }}
                                  />
                                  {s.label}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Priority (click to cycle) */}
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => void handleCyclePriority(lead._id, lead.priority)}
                          className={`inline-block rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider transition hover:opacity-80 ${
                            lead.priority
                              ? PRIORITY_STYLES[lead.priority]
                              : "border-slate-200 bg-slate-50 text-slate-400"
                          }`}
                        >
                          {lead.priority || "none"}
                        </button>
                      </td>

                      <td className="px-4 py-3 text-slate-600">{lead.sourcePage || "direct"}</td>

                      {/* Assigned To (dropdown) */}
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <div className="relative inline-block">
                          <button
                            type="button"
                            onClick={() =>
                              setOpenAssignDropdown(openAssignDropdown === lead._id ? null : lead._id)
                            }
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1 text-xs text-slate-600 transition hover:border-orange-200 hover:text-orange-700"
                          >
                            {lead.assignedTo || "Unassigned"}
                            <ChevronDown className="h-3 w-3" />
                          </button>
                          {openAssignDropdown === lead._id && (
                            <div className="absolute left-0 z-30 mt-1 w-40 rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
                              <button
                                type="button"
                                onClick={() => void handleAssign(lead._id, "")}
                                className={`w-full px-3 py-2 text-left text-xs transition hover:bg-slate-50 ${
                                  !lead.assignedTo ? "font-semibold text-[#FF6600]" : "text-slate-700"
                                }`}
                              >
                                Unassigned
                              </button>
                              {ASSIGNEES.map((name) => (
                                <button
                                  key={name}
                                  type="button"
                                  onClick={() => void handleAssign(lead._id, name)}
                                  className={`w-full px-3 py-2 text-left text-xs transition hover:bg-slate-50 ${
                                    lead.assignedTo === name ? "font-semibold text-[#FF6600]" : "text-slate-700"
                                  }`}
                                >
                                  {name}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="px-4 py-3 text-slate-500">{formatDate(lead.createdAt)}</td>

                      {/* Actions */}
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirm(lead._id)}
                          className="rounded-lg border border-slate-200 p-1.5 text-slate-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                          title="Delete lead"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {sorted.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-4 py-12 text-center text-slate-400">
                      No leads match your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
