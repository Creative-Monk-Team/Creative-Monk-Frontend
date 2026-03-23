"use client";

import { useEffect, useState, useMemo, use } from "react";
import { useRouter } from "next/navigation";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  ArrowLeft,
  ExternalLink,
  Pencil,
  Save,
  Phone,
  Mail,
  MessageSquare,
  CalendarCheck,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Plus,
} from "lucide-react";
import { toast } from "sonner";
import { adminApi } from "@/lib/api";
import { getAdminToken } from "@/lib/admin-session";
import type { AgencyClient, Activity, FollowUp, ClientReview } from "@/lib/types";

const INR = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  notation: "compact",
  maximumFractionDigits: 1,
});

const tabs = ["Overview", "Communication", "Reviews", "Settings"] as const;
type Tab = (typeof tabs)[number];

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

function healthDot(h?: string) {
  switch (h) {
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

function daysUntil(d?: string) {
  if (!d) return null;
  return Math.ceil((new Date(d).getTime() - Date.now()) / 86_400_000);
}

function ScoreGauge({ label, value }: { label: string; value: number }) {
  const pct = Math.min(value, 100);
  const color =
    pct >= 70 ? "text-emerald-600" : pct >= 40 ? "text-amber-600" : "text-red-600";
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative flex h-20 w-20 items-center justify-center">
        <svg className="h-20 w-20 -rotate-90" viewBox="0 0 80 80">
          <circle
            cx="40"
            cy="40"
            r="34"
            fill="none"
            stroke="#f1f5f9"
            strokeWidth="8"
          />
          <circle
            cx="40"
            cy="40"
            r="34"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${(pct / 100) * 213.6} 213.6`}
            className={color}
          />
        </svg>
        <span className={`absolute text-lg font-semibold ${color}`}>{value}</span>
      </div>
      <span className="text-[10px] uppercase tracking-wider text-slate-400">{label}</span>
    </div>
  );
}

function activityIcon(type: string) {
  switch (type) {
    case "call":
      return <Phone className="h-3.5 w-3.5 text-blue-500" />;
    case "email":
      return <Mail className="h-3.5 w-3.5 text-violet-500" />;
    case "meeting":
      return <CalendarCheck className="h-3.5 w-3.5 text-emerald-500" />;
    default:
      return <MessageSquare className="h-3.5 w-3.5 text-slate-400" />;
  }
}

export default function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const token = getAdminToken();
  const router = useRouter();

  const [client, setClient] = useState<AgencyClient | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  /* overview notes */
  const [notes, setNotes] = useState("");

  /* communication */
  const [activities, setActivities] = useState<Activity[]>([]);
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [activityType, setActivityType] = useState<"note" | "call" | "email" | "meeting">("note");
  const [activityContent, setActivityContent] = useState("");

  /* reviews */
  const [reviews, setReviews] = useState<ClientReview[]>([]);
  const [reviewForm, setReviewForm] = useState({
    reviewDate: new Date().toISOString().slice(0, 10),
    seoScore: 0,
    socialScore: 0,
    websiteScore: 0,
    overallHealth: "green" as "green" | "amber" | "red",
    notes: "",
  });

  /* settings form */
  const [form, setForm] = useState<Partial<AgencyClient>>({});

  /* ---------- load ---------- */
  useEffect(() => {
    async function load() {
      try {
        const data = await adminApi.list<AgencyClient>(
          `admin/agency-clients/${id}`,
          token,
        );
        setClient(data);
        setNotes(data.notes || "");
        setForm(data);
      } catch {
        toast.error("Failed to load client");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, token]);

  /* lazy load tabs */
  useEffect(() => {
    if (activeTab === "Communication") {
      adminApi
        .getActivities({ clientId: id }, token)
        .then((d) => setActivities(d as Activity[]))
        .catch(() => {});
      adminApi
        .getFollowUps({ clientId: id }, token)
        .then((d) => setFollowUps(d as FollowUp[]))
        .catch(() => {});
    }
    if (activeTab === "Reviews") {
      adminApi
        .getClientReviews(id, token)
        .then((d) => setReviews(d as ClientReview[]))
        .catch(() => {});
    }
  }, [activeTab, id, token]);

  /* ---------- handlers ---------- */
  async function saveNotes() {
    setSaving(true);
    try {
      await adminApi.update(`agency-clients/${id}`, token, { notes }, "PATCH");
      toast.success("Notes saved");
    } catch {
      toast.error("Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function addActivity() {
    if (!activityContent.trim()) return;
    setSaving(true);
    try {
      await adminApi.createActivity(
        { clientId: id, type: activityType, content: activityContent },
        token,
      );
      setActivityContent("");
      const fresh = (await adminApi.getActivities({ clientId: id }, token)) as Activity[];
      setActivities(fresh);
      toast.success("Activity added");
    } catch {
      toast.error("Failed to add activity");
    } finally {
      setSaving(false);
    }
  }

  async function addReview() {
    setSaving(true);
    try {
      await adminApi.createClientReview(id, reviewForm, token);
      const fresh = (await adminApi.getClientReviews(id, token)) as ClientReview[];
      setReviews(fresh);
      setReviewForm({
        reviewDate: new Date().toISOString().slice(0, 10),
        seoScore: 0,
        socialScore: 0,
        websiteScore: 0,
        overallHealth: "green",
        notes: "",
      });
      toast.success("Review added");
    } catch {
      toast.error("Failed to add review");
    } finally {
      setSaving(false);
    }
  }

  async function saveSettings() {
    setSaving(true);
    try {
      const updated = await adminApi.update<AgencyClient>(
        `agency-clients/${id}`,
        token,
        form,
        "PUT",
      );
      setClient(updated);
      setEditMode(false);
      toast.success("Client updated");
    } catch {
      toast.error("Update failed");
    } finally {
      setSaving(false);
    }
  }

  async function offboardClient() {
    if (!confirm("Are you sure you want to offboard this client? This will set their status to offboarded.")) return;
    setSaving(true);
    try {
      const updated = await adminApi.update<AgencyClient>(
        `agency-clients/${id}`,
        token,
        { status: "offboarded" },
        "PATCH",
      );
      setClient(updated);
      setForm(updated);
      toast.success("Client offboarded");
    } catch {
      toast.error("Offboard failed");
    } finally {
      setSaving(false);
    }
  }

  /* reviews chart data */
  const reviewChartData = useMemo(
    () =>
      [...reviews]
        .sort((a, b) => new Date(a.reviewDate).getTime() - new Date(b.reviewDate).getTime())
        .map((r) => ({
          date: new Date(r.reviewDate).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
          }),
          SEO: r.seoScore,
          Social: r.socialScore,
          Website: r.websiteScore,
        })),
    [reviews],
  );

  /* ---------- UI ---------- */
  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-[#FF6600]" />
      </div>
    );
  }

  if (!client) {
    return (
      <div className="py-20 text-center text-sm text-slate-400">Client not found.</div>
    );
  }

  const reviewDays = daysUntil(client.nextReviewDate);

  return (
    <div className="space-y-6">
      {/* ---- Header ---- */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <button
          type="button"
          onClick={() => router.push("/admin/super/clients")}
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-slate-500 transition hover:text-[#FF6600]"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Clients
        </button>

        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
                {client.name}
              </h1>
              {client.website && (
                <a
                  href={client.website.startsWith("http") ? client.website : `https://${client.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 transition hover:text-[#FF6600]"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
              <span
                className={`rounded-full border px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider ${statusBadge(client.status)}`}
              >
                {client.status}
              </span>
              <span
                className={`h-2.5 w-2.5 rounded-full ${healthDot(client.projectHealth)}`}
              />
            </div>
            {client.owner && (
              <p className="mt-1 text-sm text-slate-500">
                Account owner: <span className="font-medium text-slate-700">{client.owner}</span>
              </p>
            )}
            <p className="mt-1 text-sm text-slate-500">
              Monthly retainer:{" "}
              <span className="font-medium text-slate-800">
                {INR.format(client.monthlyRetainer || 0)}
              </span>
            </p>
          </div>

          <button
            type="button"
            onClick={() => setEditMode(!editMode)}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-[#FF6600]/30 hover:text-[#FF6600]"
          >
            <Pencil className="h-4 w-4" />
            {editMode ? "Cancel Edit" : "Edit"}
          </button>
        </div>
      </section>

      {/* ---- Tabs ---- */}
      <div className="flex gap-2 overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setActiveTab(t)}
            className={`whitespace-nowrap rounded-xl px-5 py-2.5 text-sm font-medium transition ${
              activeTab === t
                ? "bg-slate-950 text-white"
                : "border border-slate-200 bg-white text-slate-600 hover:border-[#FF6600]/30 hover:text-[#FF6600]"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* ================================================ TAB: Overview ================================================ */}
      {activeTab === "Overview" && (
        <div className="space-y-6">
          {/* key metrics */}
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">
                Monthly Retainer
              </p>
              <p className="mt-3 text-2xl font-semibold text-slate-950">
                {INR.format(client.monthlyRetainer || 0)}
              </p>
            </div>
            <div className="flex items-center justify-center gap-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <ScoreGauge label="SEO" value={client.seoScore || 0} />
              <ScoreGauge label="Social" value={client.socialScore || 0} />
              <ScoreGauge label="Web" value={client.websiteScore || 0} />
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">
                Next Review
              </p>
              <p
                className={`mt-3 text-2xl font-semibold ${reviewDays !== null && reviewDays < 0 ? "text-red-600" : "text-slate-950"}`}
              >
                {reviewDays !== null ? `${Math.abs(reviewDays)}d ${reviewDays < 0 ? "overdue" : "away"}` : "Not set"}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">
                CMS Access
              </p>
              <p className="mt-3 text-2xl font-semibold text-slate-950">
                {client.hasCmsAccess ? "Yes" : "No"}
              </p>
            </div>
          </section>

          {/* services */}
          {client.services && client.services.length > 0 && (
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="mb-3 text-sm font-medium text-slate-950">Services</p>
              <div className="flex flex-wrap gap-2">
                {client.services.map((s) => (
                  <span
                    key={s}
                    className="rounded-full border border-[#FF6600]/20 bg-orange-50 px-3 py-1 text-xs font-medium text-[#FF6600]"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* websites managed */}
          {client.websitesManaged && client.websitesManaged.length > 0 && (
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="mb-3 text-sm font-medium text-slate-950">Websites Managed</p>
              <ul className="space-y-2">
                {client.websitesManaged.map((w) => (
                  <li key={w} className="flex items-center gap-2 text-sm text-slate-700">
                    <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                    <a
                      href={w.startsWith("http") ? w : `https://${w}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline decoration-slate-300 underline-offset-2 hover:text-[#FF6600]"
                    >
                      {w}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* priority goals */}
          {client.priorityGoals && client.priorityGoals.length > 0 && (
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="mb-3 text-sm font-medium text-slate-950">Priority Goals</p>
              <ul className="space-y-2">
                {client.priorityGoals.map((g, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    {g}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* notes */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="mb-3 text-sm font-medium text-slate-950">Notes</p>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={5}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#FF6600]/40 focus:bg-white"
            />
            <button
              type="button"
              disabled={saving}
              onClick={saveNotes}
              className="mt-3 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-60"
            >
              <Save className="h-4 w-4" /> Save Notes
            </button>
          </section>
        </div>
      )}

      {/* ================================================ TAB: Communication ================================================ */}
      {activeTab === "Communication" && (
        <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            {/* add activity */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="mb-3 text-sm font-medium text-slate-950">Add Activity</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {(["note", "call", "email", "meeting"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setActivityType(t)}
                    className={`rounded-xl px-3 py-1.5 text-xs font-medium capitalize transition ${
                      activityType === t
                        ? "bg-slate-950 text-white"
                        : "border border-slate-200 bg-white text-slate-600 hover:border-[#FF6600]/30"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <textarea
                value={activityContent}
                onChange={(e) => setActivityContent(e.target.value)}
                rows={3}
                placeholder="Write your note..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#FF6600]/40 focus:bg-white"
              />
              <button
                type="button"
                disabled={saving || !activityContent.trim()}
                onClick={addActivity}
                className="mt-3 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-60"
              >
                <Plus className="h-4 w-4" /> Add
              </button>
            </section>

            {/* timeline */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="mb-4 text-sm font-medium text-slate-950">Activity Timeline</p>
              {activities.length === 0 ? (
                <p className="py-8 text-center text-sm text-slate-400">No activities yet.</p>
              ) : (
                <div className="space-y-4">
                  {activities.map((a) => (
                    <div
                      key={a._id}
                      className="flex gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-4"
                    >
                      <div className="mt-0.5">{activityIcon(a.type)}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-medium capitalize text-slate-700">
                            {a.type}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {new Date(a.createdAt).toLocaleString("en-IN", {
                              day: "numeric",
                              month: "short",
                              hour: "numeric",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-slate-600">{a.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* follow-ups sidebar */}
          <aside className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="mb-4 text-sm font-medium text-slate-950">Follow-ups</p>
              {followUps.length === 0 ? (
                <p className="py-6 text-center text-sm text-slate-400">No follow-ups.</p>
              ) : (
                <div className="space-y-3">
                  {followUps.map((f) => (
                    <div
                      key={f._id}
                      className={`rounded-xl border p-3 ${
                        f.status === "done"
                          ? "border-emerald-200 bg-emerald-50/50"
                          : f.isOverdue
                            ? "border-red-200 bg-red-50/50"
                            : "border-slate-200 bg-slate-50/50"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium text-slate-800">{f.title}</p>
                        {f.status === "done" ? (
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                        ) : f.isOverdue ? (
                          <AlertTriangle className="h-4 w-4 shrink-0 text-red-500" />
                        ) : (
                          <Clock className="h-4 w-4 shrink-0 text-slate-400" />
                        )}
                      </div>
                      <p className="mt-1 text-xs text-slate-500">
                        Due:{" "}
                        {new Date(f.dueDate).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                      {f.notes && (
                        <p className="mt-1 text-xs text-slate-500">{f.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </aside>
        </div>
      )}

      {/* ================================================ TAB: Reviews ================================================ */}
      {activeTab === "Reviews" && (
        <div className="space-y-6">
          {/* add review */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="mb-4 text-sm font-medium text-slate-950">Add Review</p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="mb-1 block text-[10px] uppercase tracking-wider text-slate-400">
                  Date
                </label>
                <input
                  type="date"
                  value={reviewForm.reviewDate}
                  onChange={(e) =>
                    setReviewForm({ ...reviewForm, reviewDate: e.target.value })
                  }
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-[#FF6600]/40"
                />
              </div>
              <div>
                <label className="mb-1 block text-[10px] uppercase tracking-wider text-slate-400">
                  SEO Score
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={reviewForm.seoScore}
                  onChange={(e) =>
                    setReviewForm({ ...reviewForm, seoScore: +e.target.value })
                  }
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-[#FF6600]/40"
                />
              </div>
              <div>
                <label className="mb-1 block text-[10px] uppercase tracking-wider text-slate-400">
                  Social Score
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={reviewForm.socialScore}
                  onChange={(e) =>
                    setReviewForm({ ...reviewForm, socialScore: +e.target.value })
                  }
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-[#FF6600]/40"
                />
              </div>
              <div>
                <label className="mb-1 block text-[10px] uppercase tracking-wider text-slate-400">
                  Website Score
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={reviewForm.websiteScore}
                  onChange={(e) =>
                    setReviewForm({ ...reviewForm, websiteScore: +e.target.value })
                  }
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-[#FF6600]/40"
                />
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-4">
              <div>
                <label className="mb-1 block text-[10px] uppercase tracking-wider text-slate-400">
                  Health
                </label>
                <div className="flex gap-3">
                  {(["green", "amber", "red"] as const).map((h) => (
                    <label key={h} className="flex items-center gap-1.5 text-sm capitalize text-slate-700">
                      <input
                        type="radio"
                        name="reviewHealth"
                        checked={reviewForm.overallHealth === h}
                        onChange={() =>
                          setReviewForm({ ...reviewForm, overallHealth: h })
                        }
                        className="accent-[#FF6600]"
                      />
                      {h}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <textarea
              value={reviewForm.notes}
              onChange={(e) => setReviewForm({ ...reviewForm, notes: e.target.value })}
              rows={2}
              placeholder="Review notes..."
              className="mt-4 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#FF6600]/40 focus:bg-white"
            />

            <button
              type="button"
              disabled={saving}
              onClick={addReview}
              className="mt-3 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-60"
            >
              <Plus className="h-4 w-4" /> Add Review
            </button>
          </section>

          {/* review history */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="mb-4 text-sm font-medium text-slate-950">Review History</p>
            {reviews.length === 0 ? (
              <p className="py-8 text-center text-sm text-slate-400">No reviews yet.</p>
            ) : (
              <div className="space-y-3">
                {[...reviews]
                  .sort((a, b) => new Date(b.reviewDate).getTime() - new Date(a.reviewDate).getTime())
                  .map((r) => (
                    <div
                      key={r._id}
                      className="rounded-xl border border-slate-200 bg-slate-50/60 p-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-slate-800">
                            {new Date(r.reviewDate).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                          <span
                            className={`h-2 w-2 rounded-full ${healthDot(r.overallHealth)}`}
                          />
                        </div>
                        <span className="text-[10px] text-slate-400">by {r.reviewedBy}</span>
                      </div>
                      <div className="mt-2 flex gap-4 text-xs text-slate-600">
                        <span>SEO: {r.seoScore}</span>
                        <span>Social: {r.socialScore}</span>
                        <span>Web: {r.websiteScore}</span>
                      </div>
                      {r.notes && (
                        <p className="mt-2 text-sm text-slate-500">{r.notes}</p>
                      )}
                    </div>
                  ))}
              </div>
            )}
          </section>

          {/* score trend chart */}
          {reviewChartData.length >= 2 && (
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="mb-4 text-sm font-medium text-slate-950">Score Trend</p>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={reviewChartData}>
                  <XAxis dataKey="date" fontSize={11} />
                  <YAxis domain={[0, 100]} fontSize={11} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0" }} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="SEO"
                    stroke="#FF6600"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Social"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Website"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </section>
          )}
        </div>
      )}

      {/* ================================================ TAB: Settings ================================================ */}
      {activeTab === "Settings" && (
        <div className="space-y-6">
          {/* contact info */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="mb-4 text-sm font-medium text-slate-950">Contact Info</p>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { key: "primaryContact", label: "Primary Contact" },
                { key: "contactEmail", label: "Email" },
                { key: "contactPhone", label: "Phone" },
                { key: "website", label: "Website" },
                { key: "owner", label: "Account Owner" },
              ].map(({ key, label }) => (
                <div key={key}>
                  <label className="mb-1 block text-[10px] uppercase tracking-wider text-slate-400">
                    {label}
                  </label>
                  <input
                    type="text"
                    value={(form as Record<string, unknown>)[key] as string || ""}
                    disabled={!editMode}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none transition disabled:opacity-60 focus:border-[#FF6600]/40"
                  />
                </div>
              ))}
            </div>
          </section>

          {/* status & health */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="mb-4 text-sm font-medium text-slate-950">Status & Health</p>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-1 block text-[10px] uppercase tracking-wider text-slate-400">
                  Status
                </label>
                <select
                  value={form.status || "active"}
                  disabled={!editMode}
                  onChange={(e) =>
                    setForm({ ...form, status: e.target.value as AgencyClient["status"] })
                  }
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none disabled:opacity-60"
                >
                  {["onboarding", "active", "retainer", "paused", "offboarded"].map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-[10px] uppercase tracking-wider text-slate-400">
                  Health
                </label>
                <select
                  value={form.projectHealth || "green"}
                  disabled={!editMode}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      projectHealth: e.target.value as AgencyClient["projectHealth"],
                    })
                  }
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none disabled:opacity-60"
                >
                  {["green", "amber", "red"].map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-[10px] uppercase tracking-wider text-slate-400">
                  Next Review
                </label>
                <input
                  type="date"
                  value={form.nextReviewDate?.slice(0, 10) || ""}
                  disabled={!editMode}
                  onChange={(e) => setForm({ ...form, nextReviewDate: e.target.value })}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none disabled:opacity-60 focus:border-[#FF6600]/40"
                />
              </div>
            </div>
          </section>

          {/* scores */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="mb-4 text-sm font-medium text-slate-950">Scores</p>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { key: "seoScore", label: "SEO Score" },
                { key: "socialScore", label: "Social Score" },
                { key: "websiteScore", label: "Website Score" },
              ].map(({ key, label }) => (
                <div key={key}>
                  <label className="mb-1 block text-[10px] uppercase tracking-wider text-slate-400">
                    {label}
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={(form as Record<string, unknown>)[key] as number || 0}
                    disabled={!editMode}
                    onChange={(e) => setForm({ ...form, [key]: +e.target.value })}
                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none disabled:opacity-60 focus:border-[#FF6600]/40"
                  />
                </div>
              ))}
            </div>
          </section>

          {/* CMS access */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="mb-4 text-sm font-medium text-slate-950">CMS Access</p>
            <label className="inline-flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={form.hasCmsAccess || false}
                disabled={!editMode}
                onChange={(e) => setForm({ ...form, hasCmsAccess: e.target.checked })}
                className="h-4 w-4 rounded accent-[#FF6600]"
              />
              Client has CMS access
            </label>
          </section>

          {/* monthly retainer */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="mb-4 text-sm font-medium text-slate-950">Retainer</p>
            <div>
              <label className="mb-1 block text-[10px] uppercase tracking-wider text-slate-400">
                Monthly Retainer (INR)
              </label>
              <input
                type="number"
                min={0}
                value={form.monthlyRetainer || 0}
                disabled={!editMode}
                onChange={(e) => setForm({ ...form, monthlyRetainer: +e.target.value })}
                className="h-10 w-full max-w-xs rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none disabled:opacity-60 focus:border-[#FF6600]/40"
              />
            </div>
          </section>

          {/* save */}
          {editMode && (
            <button
              type="button"
              disabled={saving}
              onClick={saveSettings}
              className="inline-flex items-center gap-2 rounded-xl bg-[#FF6600] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#e55b00] disabled:opacity-60"
            >
              <Save className="h-4 w-4" /> Save Changes
            </button>
          )}

          {/* danger zone */}
          <section className="rounded-2xl border border-red-200 bg-red-50/30 p-5">
            <p className="mb-2 text-sm font-medium text-red-700">Danger Zone</p>
            <p className="mb-4 text-xs text-red-600">
              Offboarding will set the client status to "offboarded". This cannot be easily undone.
            </p>
            <button
              type="button"
              disabled={saving || client.status === "offboarded"}
              onClick={offboardClient}
              className="inline-flex items-center gap-2 rounded-xl border border-red-300 bg-white px-4 py-2.5 text-sm font-medium text-red-700 transition hover:bg-red-50 disabled:opacity-60"
            >
              <AlertTriangle className="h-4 w-4" /> Offboard Client
            </button>
          </section>
        </div>
      )}
    </div>
  );
}
