"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Check,
  ChevronDown,
  Clock,
  FileText,
  Mail,
  MessageSquare,
  Phone,
  PhoneCall,
  Plus,
  Send,
  Sparkles,
  Users,
  Video,
  AlertTriangle,
  DollarSign,
  Globe,
} from "lucide-react";
import { toast } from "sonner";
import { adminApi } from "@/lib/api";
import { getAdminToken } from "@/lib/admin-session";
import type { Enquiry, Activity, FollowUp, PipelineStage } from "@/lib/types";

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const STAGES: { key: PipelineStage; label: string; color: string; bg: string; border: string }[] = [
  { key: "new", label: "New", color: "text-orange-700", bg: "bg-orange-50", border: "border-orange-200" },
  { key: "qualified", label: "Qualified", color: "text-blue-700", bg: "bg-blue-50", border: "border-blue-200" },
  { key: "proposal_sent", label: "Proposal Sent", color: "text-violet-700", bg: "bg-violet-50", border: "border-violet-200" },
  { key: "negotiation", label: "Negotiation", color: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200" },
  { key: "won", label: "Won", color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
  { key: "lost", label: "Lost", color: "text-slate-600", bg: "bg-slate-100", border: "border-slate-200" },
];

const PRIORITY_STYLES: Record<string, string> = {
  hot: "border-red-200 bg-red-50 text-red-700",
  warm: "border-amber-200 bg-amber-50 text-amber-700",
  cold: "border-sky-200 bg-sky-50 text-sky-700",
};

const ACTIVITY_TYPES = [
  { key: "note" as const, label: "Note", icon: FileText },
  { key: "call" as const, label: "Call", icon: PhoneCall },
  { key: "email" as const, label: "Email", icon: Mail },
  { key: "meeting" as const, label: "Meeting", icon: Video },
];

const ACTIVITY_ICONS: Record<string, typeof FileText> = {
  note: FileText,
  call: PhoneCall,
  email: Mail,
  meeting: Video,
  stage_change: Sparkles,
  system: Clock,
};

function stageInfo(stage?: PipelineStage) {
  return STAGES.find((s) => s.key === stage) || STAGES[0];
}

function daysSince(date: string) {
  return Math.max(0, Math.floor((Date.now() - new Date(date).getTime()) / 86_400_000));
}

function relativeTime(date: string) {
  const days = daysSince(date);
  if (days === 0) {
    const hours = Math.floor((Date.now() - new Date(date).getTime()) / 3_600_000);
    if (hours === 0) {
      const mins = Math.floor((Date.now() - new Date(date).getTime()) / 60_000);
      return mins <= 1 ? "just now" : `${mins}m ago`;
    }
    return `${hours}h ago`;
  }
  if (days === 1) return "yesterday";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function LeadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const token = getAdminToken();
  const leadId = params.id as string;

  const [lead, setLead] = useState<Enquiry | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [loading, setLoading] = useState(true);

  // Stage dropdown
  const [showStageDropdown, setShowStageDropdown] = useState(false);
  const [showAssignDropdown, setShowAssignDropdown] = useState(false);

  // Activity form
  const [activityType, setActivityType] = useState<Activity["type"]>("note");
  const [activityContent, setActivityContent] = useState("");
  const [submittingActivity, setSubmittingActivity] = useState(false);

  // Follow-up form
  const [showFollowUpForm, setShowFollowUpForm] = useState(false);
  const [followUpTitle, setFollowUpTitle] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");
  const [followUpNotes, setFollowUpNotes] = useState("");
  const [submittingFollowUp, setSubmittingFollowUp] = useState(false);

  /* ---------- data loading ---------- */

  const loadLead = useCallback(async () => {
    try {
      const enquiries = await adminApi.list<Enquiry[]>("enquiries", token);
      const found = enquiries.find((e) => e._id === leadId);
      if (found) setLead(found);
      else toast.error("Lead not found");
    } catch {
      toast.error("Failed to load lead");
    }
  }, [token, leadId]);

  const loadActivities = useCallback(async () => {
    try {
      const data = await adminApi.getActivities({ leadId }, token) as Activity[];
      setActivities(data);
    } catch {
      /* empty – may 404 if none */
    }
  }, [token, leadId]);

  const loadFollowUps = useCallback(async () => {
    try {
      const data = await adminApi.getFollowUps({ leadId }, token) as FollowUp[];
      setFollowUps(data);
    } catch {
      /* empty */
    }
  }, [token, leadId]);

  useEffect(() => {
    async function init() {
      await Promise.all([loadLead(), loadActivities(), loadFollowUps()]);
      setLoading(false);
    }
    void init();
  }, [loadLead, loadActivities, loadFollowUps]);

  /* ---------- derived ---------- */

  const si = stageInfo(lead?.stage);
  const daysInPipeline = lead ? daysSince(lead.createdAt) : 0;

  const sortedFollowUps = useMemo(() => {
    return [...followUps].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }, [followUps]);

  /* ---------- actions ---------- */

  async function handleChangeStage(stage: PipelineStage) {
    if (!lead) return;
    try {
      await adminApi.changeLeadStage(lead._id, stage, token);
      toast.success(`Stage changed to ${stage.replace("_", " ")}`);
      setShowStageDropdown(false);
      void loadLead();
      void loadActivities();
    } catch {
      toast.error("Failed to change stage");
    }
  }

  async function handleAssign(assignedTo: string) {
    if (!lead) return;
    try {
      await adminApi.assignLead(lead._id, assignedTo, token);
      toast.success(assignedTo ? `Assigned to ${assignedTo}` : "Unassigned");
      setShowAssignDropdown(false);
      void loadLead();
    } catch {
      toast.error("Failed to assign");
    }
  }

  async function handleConvert() {
    if (!lead) return;
    try {
      await adminApi.convertLead(lead._id, token);
      toast.success("Lead converted to client");
      void loadLead();
    } catch {
      toast.error("Failed to convert lead");
    }
  }

  async function handleSubmitActivity() {
    if (!activityContent.trim()) return;
    setSubmittingActivity(true);
    try {
      await adminApi.createActivity(
        { leadId, type: activityType, content: activityContent.trim() },
        token,
      );
      toast.success("Activity added");
      setActivityContent("");
      void loadActivities();
    } catch {
      toast.error("Failed to add activity");
    } finally {
      setSubmittingActivity(false);
    }
  }

  async function handleSubmitFollowUp() {
    if (!followUpTitle.trim() || !followUpDate) return;
    setSubmittingFollowUp(true);
    try {
      await adminApi.createFollowUp(
        {
          leadId,
          title: followUpTitle.trim(),
          dueDate: followUpDate,
          notes: followUpNotes.trim() || undefined,
        },
        token,
      );
      toast.success("Follow-up created");
      setFollowUpTitle("");
      setFollowUpDate("");
      setFollowUpNotes("");
      setShowFollowUpForm(false);
      void loadFollowUps();
    } catch {
      toast.error("Failed to create follow-up");
    } finally {
      setSubmittingFollowUp(false);
    }
  }

  async function handleCompleteFollowUp(id: string) {
    try {
      await adminApi.updateFollowUp(id, { status: "done" }, token);
      toast.success("Follow-up completed");
      void loadFollowUps();
    } catch {
      toast.error("Failed to update follow-up");
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

  if (!lead) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-3">
        <p className="text-slate-400">Lead not found</p>
        <button
          type="button"
          onClick={() => router.push("/admin/super/leads")}
          className="text-sm text-orange-600 hover:underline"
        >
          Back to Leads
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ---------- Header ---------- */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <button
          type="button"
          onClick={() => router.push("/admin/super/leads")}
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-slate-500 transition hover:text-orange-600"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Leads
        </button>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-950">{lead.name}</h1>
            <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-slate-500">
              <span className="flex items-center gap-1">
                <Mail className="h-3.5 w-3.5" /> {lead.email}
              </span>
              {lead.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5" /> {lead.phone}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Stage badge + dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowStageDropdown(!showStageDropdown)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition ${si.color} ${si.bg} ${si.border} hover:opacity-80`}
              >
                {si.label} <ChevronDown className="h-3 w-3" />
              </button>
              {showStageDropdown && (
                <div className="absolute right-0 z-20 mt-1 w-44 rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
                  {STAGES.map((s) => (
                    <button
                      key={s.key}
                      type="button"
                      onClick={() => void handleChangeStage(s.key)}
                      className={`w-full px-3 py-2 text-left text-xs transition hover:bg-slate-50 ${
                        lead.stage === s.key ? "font-semibold text-orange-600" : "text-slate-700"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Priority badge */}
            {lead.priority && (
              <span
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-wider ${PRIORITY_STYLES[lead.priority] || ""}`}
              >
                {lead.priority}
              </span>
            )}

            {/* Assign dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowAssignDropdown(!showAssignDropdown)}
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-orange-200"
              >
                <Users className="h-3.5 w-3.5" />
                {lead.assignedTo || "Unassigned"}
                <ChevronDown className="h-3 w-3" />
              </button>
              {showAssignDropdown && (
                <div className="absolute right-0 z-20 mt-1 w-44 rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
                  {["Unassigned", "Rahul", "Priya", "Ankit", "Sneha"].map((name) => (
                    <button
                      key={name}
                      type="button"
                      onClick={() => void handleAssign(name === "Unassigned" ? "" : name)}
                      className={`w-full px-3 py-2 text-left text-xs transition hover:bg-slate-50 ${
                        lead.assignedTo === name ? "font-semibold text-orange-600" : "text-slate-700"
                      }`}
                    >
                      {name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Convert button */}
            {lead.stage === "won" && !lead.convertedClientId && (
              <button
                type="button"
                onClick={() => void handleConvert()}
                className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700"
              >
                <Sparkles className="h-3.5 w-3.5" /> Convert to Client
              </button>
            )}
            {lead.convertedClientId && (
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700">
                Converted
              </span>
            )}
          </div>
        </div>
      </section>

      {/* ---------- Two-column layout ---------- */}
      <div className="grid gap-6 xl:grid-cols-[1fr_400px]">
        {/* Left column: Activity Timeline */}
        <div className="space-y-6">
          {/* Add Activity Form */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Add Activity</h2>

            {/* Activity type tabs */}
            <div className="mt-3 flex gap-2">
              {ACTIVITY_TYPES.map((t) => (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setActivityType(t.key)}
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition ${
                    activityType === t.key
                      ? "border-slate-950 bg-slate-950 text-white"
                      : "border-slate-200 bg-white text-slate-600 hover:border-orange-200 hover:text-orange-700"
                  }`}
                >
                  <t.icon className="h-3.5 w-3.5" /> {t.label}
                </button>
              ))}
            </div>

            <textarea
              value={activityContent}
              onChange={(e) => setActivityContent(e.target.value)}
              rows={3}
              placeholder={`Add a ${activityType}...`}
              className="mt-3 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-orange-300 focus:bg-white"
            />

            <div className="mt-3 flex justify-end">
              <button
                type="button"
                disabled={submittingActivity || !activityContent.trim()}
                onClick={() => void handleSubmitActivity()}
                className="inline-flex items-center gap-1.5 rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-50"
              >
                <Send className="h-3.5 w-3.5" /> Submit
              </button>
            </div>
          </section>

          {/* Timeline */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Activity Timeline</h2>

            {activities.length === 0 ? (
              <p className="mt-6 text-center text-sm text-slate-300">No activities yet</p>
            ) : (
              <div className="mt-4 space-y-0">
                {activities.map((activity, idx) => {
                  const Icon = ACTIVITY_ICONS[activity.type] || MessageSquare;
                  const isStageChange = activity.type === "stage_change";
                  return (
                    <div key={activity._id} className="relative flex gap-4 pb-6">
                      {/* Vertical line */}
                      {idx < activities.length - 1 && (
                        <div className="absolute left-[17px] top-10 h-[calc(100%-28px)] w-px bg-slate-200" />
                      )}

                      {/* Icon */}
                      <div
                        className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border ${
                          isStageChange
                            ? "border-orange-200 bg-orange-50"
                            : "border-slate-200 bg-slate-50"
                        }`}
                      >
                        <Icon
                          className={`h-4 w-4 ${isStageChange ? "text-orange-500" : "text-slate-400"}`}
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 pt-1">
                        <div
                          className={`rounded-xl border p-3 ${
                            isStageChange
                              ? "border-orange-100 bg-orange-50/50"
                              : "border-slate-100 bg-slate-50/50"
                          }`}
                        >
                          <p className="text-sm text-slate-700">{activity.content}</p>
                        </div>
                        <div className="mt-1.5 flex items-center gap-2 text-[11px] text-slate-400">
                          <span className="font-medium text-slate-500">{activity.createdBy}</span>
                          <span>&middot;</span>
                          <span>{relativeTime(activity.createdAt)}</span>
                          <span>&middot;</span>
                          <span className="capitalize">{activity.type.replace("_", " ")}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Contact Details */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
              Contact Details
            </h2>
            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-3">
                <Mail className="h-4 w-4 text-slate-400" />
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-400">Email</p>
                  <p className="text-sm text-slate-700">{lead.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-3">
                <Phone className="h-4 w-4 text-slate-400" />
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-400">Phone</p>
                  <p className="text-sm text-slate-700">{lead.phone || "Not provided"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-3">
                <Globe className="h-4 w-4 text-slate-400" />
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-400">Source Page</p>
                  <p className="text-sm text-slate-700">{lead.sourcePage || "direct"}</p>
                </div>
              </div>
              {lead.message && (
                <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3">
                  <p className="text-[10px] uppercase tracking-wider text-slate-400">Original Message</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{lead.message}</p>
                </div>
              )}
            </div>
          </section>

          {/* Follow-ups */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                Follow-ups
              </h2>
              <button
                type="button"
                onClick={() => setShowFollowUpForm(!showFollowUpForm)}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 transition hover:border-orange-200 hover:text-orange-700"
              >
                <Plus className="h-3 w-3" /> Add
              </button>
            </div>

            {/* Inline form */}
            {showFollowUpForm && (
              <div className="mt-3 space-y-2 rounded-xl border border-orange-100 bg-orange-50/30 p-3">
                <input
                  value={followUpTitle}
                  onChange={(e) => setFollowUpTitle(e.target.value)}
                  placeholder="Follow-up title"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-orange-300"
                />
                <input
                  type="date"
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-orange-300"
                />
                <textarea
                  value={followUpNotes}
                  onChange={(e) => setFollowUpNotes(e.target.value)}
                  placeholder="Notes (optional)"
                  rows={2}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-orange-300"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowFollowUpForm(false)}
                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-500 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={submittingFollowUp || !followUpTitle.trim() || !followUpDate}
                    onClick={() => void handleSubmitFollowUp()}
                    className="rounded-lg bg-slate-950 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800 disabled:opacity-50"
                  >
                    Create
                  </button>
                </div>
              </div>
            )}

            {/* Follow-up list */}
            <div className="mt-4 space-y-2">
              {sortedFollowUps.length === 0 && (
                <p className="py-4 text-center text-xs text-slate-300">No follow-ups</p>
              )}
              {sortedFollowUps.map((fu) => {
                const overdue =
                  fu.status === "pending" && new Date(fu.dueDate).getTime() < Date.now();
                return (
                  <div
                    key={fu._id}
                    className={`flex items-start gap-3 rounded-xl border p-3 ${
                      fu.status === "done"
                        ? "border-emerald-100 bg-emerald-50/30"
                        : overdue
                          ? "border-red-100 bg-red-50/30"
                          : "border-slate-100 bg-slate-50/50"
                    }`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p
                          className={`text-sm font-medium ${
                            fu.status === "done" ? "text-slate-400 line-through" : "text-slate-700"
                          }`}
                        >
                          {fu.title}
                        </p>
                        {overdue && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-red-600">
                            <AlertTriangle className="h-3 w-3" /> Overdue
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-[11px] text-slate-400">
                        <Calendar className="mr-1 inline h-3 w-3" />
                        {formatDate(fu.dueDate)}
                        {fu.notes && <span className="ml-2">&middot; {fu.notes}</span>}
                      </p>
                    </div>
                    {fu.status === "pending" && (
                      <button
                        type="button"
                        onClick={() => void handleCompleteFollowUp(fu._id)}
                        className="shrink-0 rounded-lg border border-slate-200 p-1.5 text-slate-400 transition hover:border-emerald-300 hover:text-emerald-600"
                        title="Mark as done"
                      >
                        <Check className="h-3.5 w-3.5" />
                      </button>
                    )}
                    {fu.status === "done" && (
                      <span className="shrink-0 rounded-full bg-emerald-100 p-1.5 text-emerald-600">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Lead Info */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
              Lead Info
            </h2>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-3">
                <span className="text-xs text-slate-400">Service Interested</span>
                <span className="text-sm font-medium text-slate-700">
                  {lead.service || "General"}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-3">
                <span className="text-xs text-slate-400">Estimated Value</span>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-slate-700">
                  <DollarSign className="h-3.5 w-3.5 text-slate-400" />
                  {lead.estimatedValue ? lead.estimatedValue.toLocaleString("en-IN") : "-"}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-3">
                <span className="text-xs text-slate-400">Days in Pipeline</span>
                <span className="text-sm font-medium text-slate-700">{daysInPipeline}d</span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-3">
                <span className="text-xs text-slate-400">Created</span>
                <span className="text-sm font-medium text-slate-700">
                  {formatDate(lead.createdAt)}
                </span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
