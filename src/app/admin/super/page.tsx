"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BellRing,
  BriefcaseBusiness,
  CircleDollarSign,
  Clock,
  Globe2,
  Layers3,
  MessageSquareMore,
  TrendingUp,
  Users2,
  Wallet,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { adminApi } from "@/lib/api";
import { getAdminToken } from "@/lib/admin-session";
import type { SuperAdminOverview } from "@/lib/types";

/* ── Helpers ─────────────────────────────────────────────── */

function fmt(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    notation: value >= 100000 ? "compact" : "standard",
    maximumFractionDigits: value >= 100000 ? 1 : 0,
  }).format(value || 0);
}

function pctChange(curr: number, prev: number) {
  if (!prev) return null;
  return ((curr - prev) / prev) * 100;
}

function healthColor(health?: string) {
  if (health === "green") return "bg-emerald-500";
  if (health === "amber") return "bg-amber-500";
  if (health === "red") return "bg-rose-500";
  return "bg-slate-300";
}

function priorityStyle(p: "high" | "medium" | "low") {
  if (p === "high") return "border-rose-200 bg-rose-50 text-rose-700";
  if (p === "medium") return "border-amber-200 bg-amber-50 text-amber-700";
  return "border-sky-200 bg-sky-50 text-sky-700";
}

const CHART_COLORS = {
  revenue: "#FF6600",
  expenses: "#64748b",
  profit: "#10b981",
  pipeline: ["#FF6600", "#3b82f6", "#8b5cf6", "#f59e0b", "#10b981", "#94a3b8"],
};

/* ── Stat Card ───────────────────────────────────────────── */

function StatCard({
  icon: Icon,
  label,
  value,
  change,
  subtitle,
  href,
  accent = false,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  change?: number | null;
  subtitle?: string;
  href?: string;
  accent?: boolean;
}) {
  const Wrapper = (href ? Link : "div") as any;
  const wrapperProps = href ? { href } : {};

  return (
    <Wrapper
      {...wrapperProps}
      className={`group relative overflow-hidden rounded-2xl border p-5 transition-all hover:shadow-lg ${
        accent
          ? "border-[#FF6600]/20 bg-gradient-to-br from-[#FF6600] to-[#e55500] text-white"
          : "border-slate-200 bg-white"
      }`}
    >
      <div className="flex items-start justify-between">
        <div
          className={`rounded-xl p-2.5 ${
            accent ? "bg-white/20" : "bg-slate-100"
          }`}
        >
          <Icon
            className={`h-5 w-5 ${accent ? "text-white" : "text-slate-600"}`}
          />
        </div>
        {change !== undefined && change !== null && (
          <span
            className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
              accent
                ? "bg-white/20 text-white"
                : change >= 0
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-rose-50 text-rose-600"
            }`}
          >
            {change >= 0 ? (
              <ArrowUpRight className="h-3 w-3" />
            ) : (
              <ArrowDownRight className="h-3 w-3" />
            )}
            {Math.abs(change).toFixed(1)}%
          </span>
        )}
      </div>
      <p
        className={`mt-4 text-2xl font-bold tracking-tight ${
          accent ? "text-white" : "text-slate-900"
        }`}
      >
        {value}
      </p>
      <p
        className={`mt-1 text-[13px] font-medium ${
          accent ? "text-white/80" : "text-slate-500"
        }`}
      >
        {label}
      </p>
      {subtitle && (
        <p
          className={`mt-0.5 text-[11px] ${
            accent ? "text-white/60" : "text-slate-400"
          }`}
        >
          {subtitle}
        </p>
      )}
    </Wrapper>
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
    <div
      className={`rounded-2xl border border-slate-200 bg-white p-5 ${className}`}
    >
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
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-slate-600">{entry.name}:</span>
          <span className="font-semibold text-slate-900">{fmt(entry.value)}</span>
        </div>
      ))}
    </div>
  );
}

/* ── Main Page ───────────────────────────────────────────── */

export default function SuperAdminPage() {
  const [data, setData] = useState<SuperAdminOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [timePeriod, setTimePeriod] = useState<"6m" | "12m" | "all">("all");

  useEffect(() => {
    const token = getAdminToken();
    if (!token) {
      setLoading(false);
      return;
    }
    adminApi
      .getSuperAdminOverview(token)
      .then(setData)
      .catch(() => null)
      .finally(() => setLoading(false));
  }, []);

  const latest = data?.financeTrend?.at(-1);
  const prev = data?.financeTrend?.at(-2);

  const revenueChange = latest && prev ? pctChange(latest.revenue, prev.revenue) : null;
  const profitChange = latest && prev ? pctChange(latest.profit, prev.profit) : null;

  const filteredFinance = useMemo(() => {
    const all = data?.financeTrend || [];
    if (timePeriod === "6m") return all.slice(-6);
    if (timePeriod === "12m") return all.slice(-12);
    return all;
  }, [data?.financeTrend, timePeriod]);

  const clients = data?.clientSnapshot || [];
  const team = data?.teamSnapshot || [];
  const atRiskClients = clients.filter((c) => c.projectHealth === "red").length;
  const overloadedTeam = team.filter((t) => t.utilizationPct >= 85).length;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-[140px] animate-pulse rounded-2xl bg-slate-200/60" />
          ))}
        </div>
        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="h-[380px] animate-pulse rounded-2xl bg-slate-200/60" />
          <div className="h-[380px] animate-pulse rounded-2xl bg-slate-200/60" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── KPI Strip ──────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        <StatCard
          icon={CircleDollarSign}
          label="Monthly Revenue"
          value={fmt(data?.overview?.trackedRevenue || 0)}
          change={revenueChange}
          accent
        />
        <StatCard
          icon={TrendingUp}
          label="Net Profit"
          value={fmt(data?.overview?.trackedProfit || 0)}
          change={profitChange}
          subtitle={`${latest?.marginPct?.toFixed(1) || 0}% margin`}
        />
        <StatCard
          icon={BriefcaseBusiness}
          label="Active Clients"
          value={String(data?.overview?.clients || 0)}
          subtitle={atRiskClients > 0 ? `${atRiskClients} at risk` : "All healthy"}
          href="/admin/super/clients"
        />
        <StatCard
          icon={MessageSquareMore}
          label="Live Leads"
          value={String(data?.overview?.enquiries || 0)}
          subtitle={`${data?.overview?.newEnquiries || 0} new this week`}
          href="/admin/super/leads"
        />
        <StatCard
          icon={Users2}
          label="Team Utilization"
          value={`${data?.overview?.avgTeamUtilization || 0}%`}
          subtitle={overloadedTeam > 0 ? `${overloadedTeam} overloaded` : "Balanced"}
          href="/admin/super/employees"
        />
        <StatCard
          icon={Wallet}
          label="Outstanding"
          value={fmt(data?.overview?.outstandingInvoices || 0)}
          subtitle="Invoices pending"
          href="/admin/super/finance"
        />
      </div>

      {/* ── Charts Row ─────────────────────────────────────── */}
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        {/* Revenue & Profit Trend */}
        <Section
          title="Revenue & Profit Trend"
          action={
            <div className="flex gap-1 rounded-lg bg-slate-100 p-0.5">
              {(["6m", "12m", "all"] as const).map((p) => (
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
                  {p === "all" ? "All" : p.toUpperCase()}
                </button>
              ))}
            </div>
          }
        >
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={filteredFinance} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FF6600" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#FF6600" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<ChartTooltip />} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue"
                  stroke="#FF6600"
                  strokeWidth={2.5}
                  fill="url(#revGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="profit"
                  name="Profit"
                  stroke="#10b981"
                  strokeWidth={2}
                  fill="url(#profitGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#FF6600]" /> Revenue
            </span>
            <span className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Profit
            </span>
          </div>
        </Section>

        {/* Pipeline + Daily Enquiries */}
        <div className="space-y-6">
          {/* Pipeline */}
          <Section title="Lead Pipeline">
            <div className="flex items-center gap-5">
              <div className="h-[140px] w-[140px] shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data?.enquiryPipeline || []}
                      cx="50%"
                      cy="50%"
                      innerRadius={38}
                      outerRadius={62}
                      dataKey="total"
                      nameKey="status"
                      strokeWidth={2}
                      stroke="#fff"
                    >
                      {(data?.enquiryPipeline || []).map((_entry, i) => (
                        <Cell
                          key={i}
                          fill={CHART_COLORS.pipeline[i % CHART_COLORS.pipeline.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: any, name: any) => [value, String(name).replace("-", " ")]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-2">
                {(data?.enquiryPipeline || []).map((item, i) => (
                  <div key={item.status} className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{
                          backgroundColor:
                            CHART_COLORS.pipeline[i % CHART_COLORS.pipeline.length],
                        }}
                      />
                      <span className="capitalize text-slate-600">
                        {item.status.replace("-", " ")}
                      </span>
                    </span>
                    <span className="font-semibold text-slate-900">{item.total}</span>
                  </div>
                ))}
              </div>
            </div>
          </Section>

          {/* Daily Enquiries Bar */}
          <Section title="Daily Enquiries (7d)">
            <div className="h-[140px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data?.dailyEnquiries || []}
                  margin={{ top: 4, right: 4, left: -24, bottom: 0 }}
                >
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 10, fill: "#94a3b8" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: "#94a3b8" }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    formatter={(value: any) => [value, "Enquiries"]}
                    cursor={{ fill: "rgba(255,102,0,0.06)" }}
                  />
                  <Bar dataKey="total" radius={[6, 6, 0, 0]} fill="#FF6600" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Section>
        </div>
      </div>

      {/* ── Operations Grid ────────────────────────────────── */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Client Health Matrix */}
        <Section
          title="Client Health"
          action={
            <Link
              href="/admin/super/clients"
              className="flex items-center gap-1 text-xs font-medium text-[#FF6600] hover:underline"
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          }
        >
          <div className="space-y-2">
            {[...clients]
              .sort((a, b) => {
                const order: Record<string, number> = { red: 0, amber: 1, green: 2 };
                return (order[a.projectHealth || ""] ?? 3) - (order[b.projectHealth || ""] ?? 3);
              })
              .slice(0, 8)
              .map((c) => (
                <div
                  key={c._id}
                  className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-2.5"
                >
                  <span className={`h-2.5 w-2.5 rounded-full ${healthColor(c.projectHealth)}`} />
                  <span className="min-w-0 flex-1 truncate text-sm font-medium text-slate-800">
                    {c.name}
                  </span>
                  <span className="text-xs font-medium text-slate-500">
                    {fmt(c.monthlyRetainer)}
                  </span>
                  {c.nextReviewDate && (
                    <span className="flex items-center gap-1 text-[11px] text-slate-400">
                      <Clock className="h-3 w-3" />
                      {new Date(c.nextReviewDate).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                  )}
                </div>
              ))}
            {clients.length === 0 && (
              <p className="py-6 text-center text-sm text-slate-400">No clients yet</p>
            )}
          </div>
        </Section>

        {/* Action Items */}
        <Section
          title="Action Items"
          action={
            <span className="rounded-full bg-rose-50 px-2.5 py-0.5 text-[11px] font-semibold text-rose-600">
              {data?.actionItems?.length || 0} items
            </span>
          }
        >
          <div className="space-y-2">
            {(data?.actionItems || []).slice(0, 6).map((item, i) => (
              <Link
                key={i}
                href={item.href}
                className="flex items-start gap-3 rounded-xl bg-slate-50 px-4 py-3 transition hover:bg-slate-100"
              >
                <span
                  className={`mt-0.5 inline-flex shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase ${priorityStyle(item.priority)}`}
                >
                  {item.priority}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-800">{item.title}</p>
                  <p className="mt-0.5 truncate text-xs text-slate-500">{item.detail}</p>
                </div>
                <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-slate-300" />
              </Link>
            ))}
            {!data?.actionItems?.length && (
              <p className="py-6 text-center text-sm text-slate-400">No action items</p>
            )}
          </div>
        </Section>
      </div>

      {/* ── Bottom Row ─────────────────────────────────────── */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {/* Recent Activity */}
        <Section title="Recent Activity" className="xl:col-span-1">
          <div className="space-y-2">
            {(data?.activityFeed || []).slice(0, 8).map((item, i) => (
              <div key={i} className="flex items-start gap-3 py-1.5">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#FF6600]" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-slate-700">{item.title}</p>
                  <p className="text-[11px] text-slate-400">{item.meta} &middot; {item.date}</p>
                </div>
              </div>
            ))}
            {!data?.activityFeed?.length && (
              <p className="py-6 text-center text-sm text-slate-400">No recent activity</p>
            )}
          </div>
        </Section>

        {/* Lead Sources */}
        <Section title="Lead Sources">
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={(data?.sourceBreakdown || []).slice(0, 6)}
                layout="vertical"
                margin={{ top: 0, right: 8, left: 0, bottom: 0 }}
              >
                <XAxis
                  type="number"
                  tick={{ fontSize: 10, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <YAxis
                  type="category"
                  dataKey="source"
                  tick={{ fontSize: 11, fill: "#64748b" }}
                  axisLine={false}
                  tickLine={false}
                  width={80}
                />
                <Tooltip
                  formatter={(value: any) => [value, "Leads"]}
                  cursor={{ fill: "rgba(255,102,0,0.06)" }}
                />
                <Bar dataKey="total" radius={[0, 6, 6, 0]} fill="#FF6600" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Section>

        {/* Alerts */}
        <Section
          title="Alerts"
          action={
            <Link
              href="/admin/super/settings"
              className="flex items-center gap-1 text-xs font-medium text-[#FF6600] hover:underline"
            >
              Control Room <ArrowRight className="h-3 w-3" />
            </Link>
          }
        >
          <div className="space-y-2">
            {(data?.alertsSnapshot || []).map((alert) => (
              <Link
                key={alert.id}
                href={alert.href}
                className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 transition hover:bg-slate-100"
              >
                <div>
                  <p className="text-sm font-medium text-slate-800">{alert.label}</p>
                  <p className="mt-0.5 text-lg font-bold text-slate-900">
                    {alert.id === "collections" ? fmt(alert.value) : alert.value}
                  </p>
                </div>
                <span
                  className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase ${priorityStyle(alert.tone)}`}
                >
                  {alert.tone}
                </span>
              </Link>
            ))}
            {!data?.alertsSnapshot?.length && (
              <p className="py-6 text-center text-sm text-slate-400">No alerts</p>
            )}
          </div>
        </Section>
      </div>

      {/* ── Quick Stats Footer ─────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4">
          <div className="rounded-xl bg-[#FF6600]/10 p-2.5">
            <Wallet className="h-5 w-5 text-[#FF6600]" />
          </div>
          <div>
            <p className="text-lg font-bold text-slate-900">
              {fmt(data?.overview?.totalRetainers || 0)}
            </p>
            <p className="text-xs text-slate-500">Retainer Book Value</p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4">
          <div className="rounded-xl bg-blue-50 p-2.5">
            <Globe2 className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="text-lg font-bold text-slate-900">
              {data?.overview?.managedWebsites || 0}
            </p>
            <p className="text-xs text-slate-500">Managed Websites</p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4">
          <div className="rounded-xl bg-violet-50 p-2.5">
            <Layers3 className="h-5 w-5 text-violet-600" />
          </div>
          <div>
            <p className="text-lg font-bold text-slate-900">
              {data?.overview?.activeServiceLines || 0}
            </p>
            <p className="text-xs text-slate-500">Active Service Lines</p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4">
          <div className="rounded-xl bg-amber-50 p-2.5">
            <CircleDollarSign className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <p className="text-lg font-bold text-slate-900">
              {fmt(data?.overview?.totalPayroll || 0)}
            </p>
            <p className="text-xs text-slate-500">Monthly Payroll</p>
          </div>
        </div>
      </div>
    </div>
  );
}
