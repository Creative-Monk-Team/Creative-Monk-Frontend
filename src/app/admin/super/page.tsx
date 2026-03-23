"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BellRing,
  CalendarClock,
  CheckCircle2,
  CircleDollarSign,
  FileText,
  Globe2,
  Layers3,
  MessageSquareMore,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  Users2,
  Wallet,
} from "lucide-react";
import { adminApi } from "@/lib/api";
import { getAdminToken } from "@/lib/admin-session";
import type { SuperAdminOverview } from "@/lib/types";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    notation: value >= 100000 ? "compact" : "standard",
    maximumFractionDigits: value >= 100000 ? 1 : 0,
  }).format(value || 0);
}

function formatCompactDate(value?: string) {
  if (!value) return "No date";

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "No date";

  return parsed.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}

function average(values: number[]) {
  if (!values.length) return 0;
  return Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(1));
}

function priorityTone(priority: "high" | "medium" | "low") {
  switch (priority) {
    case "high":
      return "border-rose-200 bg-rose-50 text-rose-700";
    case "medium":
      return "border-amber-200 bg-amber-50 text-amber-700";
    default:
      return "border-sky-200 bg-sky-50 text-sky-700";
  }
}

function healthTone(value?: string) {
  switch (value) {
    case "green":
    case "active":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "amber":
    case "onboarding":
    case "retainer":
      return "border-amber-200 bg-amber-50 text-amber-700";
    case "red":
    case "paused":
      return "border-rose-200 bg-rose-50 text-rose-700";
    default:
      return "border-slate-200 bg-slate-50 text-slate-600";
  }
}

function buildLinePath(values: number[], width: number, height: number, padding = 18) {
  if (!values.length) return "";

  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const innerWidth = width - padding * 2;
  const innerHeight = height - padding * 2;
  const denominator = Math.max(max - min, 1);

  return values
    .map((value, index) => {
      const x = padding + (innerWidth * index) / Math.max(values.length - 1, 1);
      const y = padding + innerHeight - ((value - min) / denominator) * innerHeight;
      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");
}

function buildAreaPath(values: number[], width: number, height: number, padding = 18) {
  if (!values.length) return "";

  const line = buildLinePath(values, width, height, padding);
  const innerWidth = width - padding * 2;
  const baseline = height - padding;
  const endX = padding + innerWidth;

  return `${line} L ${endX} ${baseline} L ${padding} ${baseline} Z`;
}

function SectionCard({
  eyebrow,
  title,
  action,
  children,
  className = "",
}: {
  eyebrow: string;
  title: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_24px_70px_-52px_rgba(15,23,42,0.18)] ${className}`}
    >
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-slate-400">
            {eyebrow}
          </p>
          <h2 className="mt-2 text-[1.25rem] font-medium tracking-[-0.03em] text-slate-950">
            {title}
          </h2>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function ExecutiveStat({
  label,
  value,
  change,
}: {
  label: string;
  value: string;
  change?: string;
}) {
  return (
    <article className="rounded-[1.4rem] border border-slate-200 bg-white p-4 shadow-[0_18px_50px_-40px_rgba(15,23,42,0.14)]">
      <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-[1.55rem] font-medium tracking-[-0.03em] text-slate-950">
        {value}
      </p>
      {change ? <p className="mt-2 text-xs leading-5 text-slate-500">{change}</p> : null}
    </article>
  );
}

function MetricBar({
  label,
  value,
  tone = "orange",
}: {
  label: string;
  value: number;
  tone?: "orange" | "slate" | "emerald";
}) {
  const bgClass =
    tone === "emerald"
      ? "from-emerald-500 to-emerald-300"
      : tone === "slate"
        ? "from-slate-800 to-slate-400"
        : "from-orange-500 to-orange-300";

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="text-xs font-medium text-slate-500">{label}</span>
        <span className="text-xs font-medium text-slate-700">{value}</span>
      </div>
      <div className="h-2 rounded-full bg-slate-100">
        <div
          className={`h-2 rounded-full bg-gradient-to-r ${bgClass}`}
          style={{ width: `${Math.min(Math.max(value, 6), 100)}%` }}
        />
      </div>
    </div>
  );
}

function FinanceTrendChart({
  data,
}: {
  data: SuperAdminOverview["financeTrend"];
}) {
  const width = 720;
  const height = 240;
  const revenue = data.map((item) => item.revenue);
  const profit = data.map((item) => item.profit);
  const expense = data.map((item) => item.expenses);

  return (
    <SectionCard
      eyebrow="Finance"
      title="Monthly revenue, expense, and profit movement"
      action={<TrendingUp className="h-5 w-5 text-orange-500" />}
    >
      <div className="mt-5 flex flex-wrap gap-2 text-xs text-slate-500">
        <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-orange-500" />
          Revenue
        </span>
        <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-slate-400" />
          Expenses
        </span>
        <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
          Profit
        </span>
      </div>

      <div className="mt-5 overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="h-auto min-w-[640px] w-full">
          <defs>
            <linearGradient id="revenueArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgb(249 115 22)" stopOpacity="0.22" />
              <stop offset="100%" stopColor="rgb(249 115 22)" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {[0, 1, 2, 3].map((line) => {
            const y = 18 + line * 51;
            return (
              <line
                key={line}
                x1="18"
                y1={y}
                x2={width - 18}
                y2={y}
                stroke="rgb(226 232 240)"
                strokeDasharray="4 6"
              />
            );
          })}

          <path d={buildAreaPath(revenue, width, height)} fill="url(#revenueArea)" />
          <path
            d={buildLinePath(revenue, width, height)}
            fill="none"
            stroke="rgb(249 115 22)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d={buildLinePath(expense, width, height)}
            fill="none"
            stroke="rgb(148 163 184)"
            strokeWidth="2.25"
            strokeLinecap="round"
          />
          <path
            d={buildLinePath(profit, width, height)}
            fill="none"
            stroke="rgb(16 185 129)"
            strokeWidth="2.25"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {data.map((item) => (
          <div key={item.label} className="rounded-[1.1rem] border border-slate-200 bg-slate-50/80 px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-slate-800">{item.label}</p>
              <span className="text-xs text-slate-400">{item.status || "actual"}</span>
            </div>
            <p className="mt-2 text-sm text-slate-600">Revenue {formatCurrency(item.revenue)}</p>
            <p className="mt-1 text-sm text-slate-500">Profit {formatCurrency(item.profit)}</p>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

function DailyEnquiryChart({
  data,
}: {
  data: SuperAdminOverview["dailyEnquiries"];
}) {
  const max = Math.max(...data.map((item) => item.total), 1);
  const total = data.reduce((sum, item) => sum + item.total, 0);

  return (
    <SectionCard
      eyebrow="Lead Flow"
      title="Daily enquiry movement"
      action={<MessageSquareMore className="h-5 w-5 text-orange-500" />}
    >
      <div className="mt-4 flex items-baseline justify-between gap-4">
        <div>
          <p className="text-[1.5rem] font-medium tracking-[-0.03em] text-slate-950">{total}</p>
          <p className="text-xs text-slate-500">Total in the last {data.length} days</p>
        </div>
        <p className="text-xs text-slate-500">Average {average(data.map((item) => item.total))}/day</p>
      </div>
      <div className="mt-5 flex items-end gap-3">
        {data.map((item) => (
          <div key={item.key} className="flex-1 text-center">
            <div className="flex h-40 items-end justify-center rounded-[1.15rem] bg-slate-50 px-2 pb-2">
              <div
                className="w-full rounded-[0.85rem] bg-gradient-to-t from-orange-500 to-orange-300"
                style={{ height: `${Math.max((item.total / max) * 100, item.total ? 14 : 4)}%` }}
              />
            </div>
            <p className="mt-2 text-sm font-medium text-slate-800">{item.total}</p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-slate-400">{item.label}</p>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

function PipelineDonut({
  data,
}: {
  data: SuperAdminOverview["enquiryPipeline"];
}) {
  const total = Math.max(
    data.reduce((sum, item) => sum + item.total, 0),
    1,
  );
  const colors = ["#f97316", "#0f172a", "#22c55e", "#cbd5e1"];
  let offset = 0;

  return (
    <SectionCard
      eyebrow="Pipeline"
      title="Lead status distribution"
      action={<Layers3 className="h-5 w-5 text-orange-500" />}
    >
      <div className="mt-5 flex items-center gap-6">
        <svg viewBox="0 0 120 120" className="h-32 w-32 shrink-0">
          <circle cx="60" cy="60" r="42" fill="none" stroke="#e2e8f0" strokeWidth="14" />
          {data.map((item, index) => {
            const fraction = item.total / total;
            const dash = fraction * 264;
            const segment = (
              <circle
                key={item.status}
                cx="60"
                cy="60"
                r="42"
                fill="none"
                stroke={colors[index % colors.length]}
                strokeWidth="14"
                strokeDasharray={`${dash} 264`}
                strokeDashoffset={-offset}
                strokeLinecap="round"
                transform="rotate(-90 60 60)"
              />
            );
            offset += dash;
            return segment;
          })}
          <text x="60" y="56" textAnchor="middle" className="fill-slate-400 text-[8px] uppercase tracking-[0.2em]">
            Total
          </text>
          <text x="60" y="72" textAnchor="middle" className="fill-slate-900 text-[18px] font-medium">
            {total}
          </text>
        </svg>

        <div className="flex-1 space-y-3">
          {data.map((item, index) => (
            <div
              key={item.status}
              className="flex items-center justify-between rounded-[1.1rem] border border-slate-200 bg-slate-50 px-4 py-3"
            >
              <div className="inline-flex items-center gap-3">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: colors[index % colors.length] }}
                />
                <span className="text-sm font-medium capitalize text-slate-700">
                  {item.status.replace("-", " ")}
                </span>
              </div>
              <span className="text-sm font-medium text-slate-900">{item.total}</span>
            </div>
          ))}
        </div>
      </div>
    </SectionCard>
  );
}

export default function SuperAdminPage() {
  const [data, setData] = useState<SuperAdminOverview | null>(null);
  const [loading, setLoading] = useState(true);

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

  const latestMonth = data?.financeTrend?.at(-1);
  const previousMonth = data?.financeTrend?.at(-2);

  const metrics = useMemo(() => {
    const clients = data?.clientSnapshot || [];
    const reviews = data?.reviewQueue || [];
    const team = data?.teamSnapshot || [];
    const recentEnquiries = data?.recentEnquiries || [];

    return {
      revenueChange:
        latestMonth && previousMonth && previousMonth.revenue > 0
          ? `${(((latestMonth.revenue - previousMonth.revenue) / previousMonth.revenue) * 100).toFixed(1)}% vs last month`
          : "Monthly trend will appear after 2 periods",
      profitChange:
        latestMonth && previousMonth && previousMonth.profit > 0
          ? `${(((latestMonth.profit - previousMonth.profit) / previousMonth.profit) * 100).toFixed(1)}% vs last month`
          : "Track 2 months for comparison",
      avgSeo: average(clients.map((item) => item.seoScore || 0)),
      avgSocial: average(clients.map((item) => item.socialScore || 0)),
      avgWebsite: average(clients.map((item) => item.websiteScore || 0)),
      atRiskClients: clients.filter((item) => item.projectHealth === "red").length,
      reviewsSoon: reviews.filter((item) => (item.reviewDueInDays ?? 99) <= 7).length,
      cmsClients: clients.filter((item) => item.hasCmsAccess).length,
      overloadedTeam: team.filter((item) => item.utilizationPct >= 85).length,
      freshLeads: recentEnquiries.filter((item) => item.status === "new").length,
    };
  }, [data, latestMonth, previousMonth]);

  const topRetainers = (data?.clientRetainers || []).slice(0, 5);
  const strongestClients = [...(data?.clientSnapshot || [])]
    .sort(
      (left, right) =>
        (right.seoScore + right.socialScore + right.websiteScore) / 3 -
        (left.seoScore + left.socialScore + left.websiteScore) / 3,
    )
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-[#ffd8c2] bg-[linear-gradient(135deg,#fff8f2_0%,#ffffff_48%,#f8fafc_100%)] px-6 py-6 shadow-[0_32px_90px_-60px_rgba(255,102,0,0.18)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#ffd8c2] bg-white px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.22em] text-orange-700">
            <Sparkles className="h-3.5 w-3.5" />
            Super admin command center
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { href: "/admin/super/finance", label: "Finance" },
              { href: "/admin/super/leads", label: "Leads" },
              { href: "/admin/super/clients", label: "Clients" },
              { href: "/admin/super/settings", label: "Alerts" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-orange-200 hover:text-orange-700"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.9fr)] xl:items-start">
          <div>
            <h1 className="max-w-4xl text-[1.9rem] font-medium tracking-[-0.05em] text-slate-950 md:text-[2.4rem]">
              Monthly numbers, lead pressure, client risk, and team load.
            </h1>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-[1.1rem] border border-slate-200 bg-white px-4 py-3">
                <p className="text-[10px] uppercase tracking-[0.16em] text-slate-400">Active clients</p>
                <p className="mt-2 text-xl font-medium text-slate-950">{data?.overview?.clients || 0}</p>
              </div>
              <div className="rounded-[1.1rem] border border-slate-200 bg-white px-4 py-3">
                <p className="text-[10px] uppercase tracking-[0.16em] text-slate-400">Live leads</p>
                <p className="mt-2 text-xl font-medium text-slate-950">{data?.overview?.enquiries || 0}</p>
              </div>
              <div className="rounded-[1.1rem] border border-slate-200 bg-white px-4 py-3">
                <p className="text-[10px] uppercase tracking-[0.16em] text-slate-400">Service lines</p>
                <p className="mt-2 text-xl font-medium text-slate-950">{data?.overview?.activeServiceLines || 0}</p>
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <ExecutiveStat
              label="Monthly retainer book"
              value={loading ? "--" : formatCurrency(data?.overview?.totalRetainers || 0)}
              change="Current recurring client value"
            />
            <ExecutiveStat
              label="Outstanding invoices"
              value={loading ? "--" : formatCurrency(data?.overview?.outstandingInvoices || 0)}
              change="Follow-up and collection watchlist"
            />
            <ExecutiveStat
              label="Managed websites"
              value={loading ? "--" : String(data?.overview?.managedWebsites || 0)}
              change="Managed websites"
            />
            <ExecutiveStat
              label="Reviews this week"
              value={loading ? "--" : String(metrics.reviewsSoon)}
              change="Review queue"
            />
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <ExecutiveStat
          label="Tracked revenue"
          value={loading ? "--" : formatCurrency(data?.overview?.trackedRevenue || 0)}
          change={metrics.revenueChange}
        />
        <ExecutiveStat
          label="Tracked profit"
          value={loading ? "--" : formatCurrency(data?.overview?.trackedProfit || 0)}
          change={metrics.profitChange}
        />
        <ExecutiveStat
          label="Payroll load"
          value={loading ? "--" : formatCurrency(data?.overview?.totalPayroll || 0)}
          change="Current monthly salary pressure"
        />
        <ExecutiveStat
          label="Average utilization"
          value={loading ? "--" : `${data?.overview?.avgTeamUtilization || 0}%`}
          change={`${metrics.overloadedTeam} team member${metrics.overloadedTeam === 1 ? "" : "s"} above 85%`}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(340px,0.8fr)]">
        <FinanceTrendChart data={data?.financeTrend || []} />
        <div className="space-y-6">
          <DailyEnquiryChart data={data?.dailyEnquiries || []} />
          <PipelineDonut data={data?.enquiryPipeline || []} />
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <SectionCard
          eyebrow="Alert center"
          title="Priority issues and escalation signals"
          action={<BellRing className="h-5 w-5 text-orange-500" />}
        >
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {(data?.alertsSnapshot || []).map((alert) => (
              <Link
                key={alert.id}
                href={alert.href}
                className="rounded-[1.15rem] border border-slate-200 bg-slate-50/80 p-4 transition hover:border-orange-200 hover:bg-orange-50/50"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{alert.label}</p>
                    <p className="mt-2 text-xl font-medium tracking-[-0.03em] text-slate-950">
                      {alert.id === "collections" ? formatCurrency(alert.value) : alert.value}
                    </p>
                  </div>
                  <span
                    className={`rounded-full border px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.16em] ${priorityTone(alert.tone)}`}
                  >
                    {alert.tone}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          eyebrow="Lead sources"
          title="Where recent demand is coming from"
          action={
            <Link
              href="/admin/super/leads"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-orange-600"
            >
              Open leads
              <ArrowRight className="h-4 w-4" />
            </Link>
          }
        >
          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {(data?.sourceBreakdown || []).map((item, index) => (
              <div
                key={`${item.source}-${index}`}
                className="rounded-[1.15rem] border border-slate-200 bg-[linear-gradient(135deg,#fff8f2_0%,#ffffff_100%)] p-4"
              >
                <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">{item.source}</p>
                <p className="mt-2 text-2xl font-medium tracking-[-0.04em] text-slate-950">{item.total}</p>
                <div className="mt-3 h-2 rounded-full bg-slate-100">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-orange-500 to-orange-300"
                    style={{
                      width: `${Math.max(
                        (item.total / Math.max(...(data?.sourceBreakdown || []).map((entry) => entry.total), 1)) * 100,
                        10,
                      )}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,0.98fr)_minmax(0,1.02fr)]">
        <SectionCard
          eyebrow="Approvals"
          title="What needs your attention"
          action={<ShieldAlert className="h-5 w-5 text-orange-500" />}
        >
          <div className="mt-5 space-y-3">
            {(data?.actionItems || []).map((item, index) => (
              <Link
                key={`${item.title}-${index}`}
                href={item.href}
                className="block rounded-[1.2rem] border border-slate-200 bg-slate-50 p-4 transition hover:border-orange-200 hover:bg-orange-50/70"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-slate-900">{item.title}</p>
                  <span
                    className={`rounded-full border px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.16em] ${priorityTone(item.priority)}`}
                  >
                    {item.priority}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.detail}</p>
              </Link>
            ))}
          </div>

          <div className="mt-5 rounded-[1.2rem] border border-slate-200 bg-[linear-gradient(135deg,#f8fafc_0%,#fff7ed_100%)] p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-slate-400">
                  Boss activities
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Quick operational actions you can take from this workspace.
                </p>
              </div>
              <CheckCircle2 className="h-5 w-5 text-orange-500" />
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {[
                {
                  href: "/admin/super/finance",
                  icon: CircleDollarSign,
                  label: "Approve collections",
                },
                {
                  href: "/admin/super/clients",
                  icon: CalendarClock,
                  label: "Schedule review calls",
                },
                {
                  href: "/admin/super/employees",
                  icon: Users2,
                  label: "Rebalance team load",
                },
                {
                  href: "/admin/dashboard/blogs",
                  icon: FileText,
                  label: "Review content output",
                },
                {
                  href: "/admin/super/clients",
                  icon: Globe2,
                  label: "Check website health",
                },
                {
                  href: "/admin/super/finance",
                  icon: Wallet,
                  label: "Update monthly cash view",
                },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="inline-flex items-center gap-3 rounded-[1rem] border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-orange-200 hover:text-orange-700"
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </SectionCard>

        <SectionCard
          eyebrow="Monthly pulse"
          title="Latest month finance breakdown"
          action={<CircleDollarSign className="h-5 w-5 text-orange-500" />}
        >
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <ExecutiveStat
              label="Current period"
              value={latestMonth?.label || "--"}
              change={latestMonth?.status || "No status"}
            />
            <ExecutiveStat
              label="Margin"
              value={latestMonth ? `${latestMonth.marginPct || 0}%` : "--"}
              change="Monthly profit margin"
            />
            <ExecutiveStat
              label="Cash in hand"
              value={formatCurrency(latestMonth?.cashInHand || 0)}
              change="Current liquidity snapshot"
            />
            <ExecutiveStat
              label="Outstanding"
              value={formatCurrency(latestMonth?.outstandingInvoices || 0)}
              change="Invoice amount pending"
            />
          </div>

          <div className="mt-5 space-y-4 rounded-[1.2rem] border border-slate-200 bg-slate-50/80 p-4">
            <MetricBar label="Revenue share" value={100} tone="orange" />
            <MetricBar
              label="Expense share"
              value={latestMonth?.revenue ? ((latestMonth.expenses / latestMonth.revenue) * 100) : 0}
              tone="slate"
            />
            <MetricBar
              label="Profit share"
              value={latestMonth?.revenue ? ((latestMonth.profit / latestMonth.revenue) * 100) : 0}
              tone="emerald"
            />
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-[1.1rem] border border-slate-200 bg-white p-4">
              <p className="text-xs text-slate-500">Ad spend</p>
              <p className="mt-2 text-lg font-medium text-slate-900">
                {formatCurrency(latestMonth?.adSpend || 0)}
              </p>
            </div>
            <div className="rounded-[1.1rem] border border-slate-200 bg-white p-4">
              <p className="text-xs text-slate-500">Payroll</p>
              <p className="mt-2 text-lg font-medium text-slate-900">
                {formatCurrency(latestMonth?.payroll || 0)}
              </p>
            </div>
            <div className="rounded-[1.1rem] border border-slate-200 bg-white p-4">
              <p className="text-xs text-slate-500">Tools cost</p>
              <p className="mt-2 text-lg font-medium text-slate-900">
                {formatCurrency(latestMonth?.toolsCost || 0)}
              </p>
            </div>
          </div>
        </SectionCard>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <SectionCard
          eyebrow="Client value"
          title="Client-wise monthly retainer concentration"
          action={
            <Link
              href="/admin/super/clients"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-orange-600"
            >
              Open clients
              <ArrowRight className="h-4 w-4" />
            </Link>
          }
        >
          <div className="mt-5 space-y-4">
            {topRetainers.map((client) => {
              const max = Math.max(...topRetainers.map((item) => item.monthlyRetainer), 1);
              return (
                <div key={client._id}>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{client.name}</p>
                      <p className="text-xs text-slate-500">{client.owner || "No owner assigned"}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-slate-900">
                        {formatCurrency(client.monthlyRetainer)}
                      </p>
                      <span
                        className={`mt-1 inline-flex rounded-full border px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.16em] ${healthTone(client.projectHealth)}`}
                      >
                        {client.projectHealth || "n/a"}
                      </span>
                    </div>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-slate-900 to-orange-500"
                      style={{ width: `${Math.max((client.monthlyRetainer / max) * 100, 8)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </SectionCard>

        <SectionCard
          eyebrow="Client intelligence"
          title="SEO, social, and website score view"
          action={<Globe2 className="h-5 w-5 text-orange-500" />}
        >
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <ExecutiveStat label="Avg SEO" value={`${metrics.avgSeo}`} change="Across active clients" />
            <ExecutiveStat label="Avg social" value={`${metrics.avgSocial}`} change="Brand and social health" />
            <ExecutiveStat label="Avg website" value={`${metrics.avgWebsite}`} change="Site performance snapshot" />
          </div>

          <div className="mt-5 space-y-3">
            {strongestClients.map((client) => (
              <div
                key={client._id}
                className="rounded-[1.2rem] border border-slate-200 bg-slate-50/80 p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{client.name}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {client.owner || "No owner"} • Review {formatCompactDate(client.nextReviewDate)}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span
                      className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.16em] ${healthTone(client.projectHealth)}`}
                    >
                      {client.projectHealth || "n/a"}
                    </span>
                    {client.hasCmsAccess ? (
                      <span className="inline-flex rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-slate-600">
                        CMS access
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <MetricBar label="SEO" value={client.seoScore} tone="orange" />
                  <MetricBar label="Social" value={client.socialScore} tone="slate" />
                  <MetricBar label="Website" value={client.websiteScore} tone="emerald" />
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {(client.priorityGoals || []).slice(0, 3).map((goal) => (
                    <span
                      key={goal}
                      className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600"
                    >
                      {goal}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <SectionCard
          eyebrow="Delivery"
          title="Team capacity and allocation"
          action={
            <Link
              href="/admin/super/employees"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-orange-600"
            >
              Open employees
              <ArrowRight className="h-4 w-4" />
            </Link>
          }
        >
          <div className="mt-5 space-y-4">
            {(data?.teamSnapshot || []).map((member) => (
              <div
                key={member._id}
                className="rounded-[1.2rem] border border-slate-200 bg-slate-50/80 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{member.name}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {member.role} • {member.department} • {member.ownerLevel || "member"}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.16em] ${healthTone(member.status)}`}
                    >
                      {member.status}
                    </span>
                    <p className="mt-2 text-xs text-slate-500">
                      {formatCurrency(member.monthlySalary || 0)}
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <MetricBar label="Utilization" value={member.utilizationPct} tone="slate" />
                </div>
                <p className="mt-4 text-xs leading-6 text-slate-500">
                  {(member.assignedClients || []).join(", ") || "No client allocation recorded"}
                </p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          eyebrow="Reviews and content"
          title="Upcoming reviews, recent activity, and content snapshot"
          action={<Layers3 className="h-5 w-5 text-orange-500" />}
        >
          <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
            <div className="space-y-3">
              {(data?.reviewQueue || []).map((client) => (
                <div
                  key={client._id}
                  className="rounded-[1.1rem] border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{client.name}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        {client.owner || "No owner"} • Review {formatCompactDate(client.nextReviewDate)}
                      </p>
                    </div>
                    <span
                      className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.16em] ${healthTone(client.projectHealth)}`}
                    >
                      {client.projectHealth || "n/a"}
                    </span>
                  </div>
                  <p className="mt-3 text-xs text-slate-600">
                    {client.reviewDueInDays === null
                      ? "No review date set"
                      : client.reviewDueInDays < 0
                        ? `${Math.abs(client.reviewDueInDays)} days overdue`
                        : `${client.reviewDueInDays} days remaining`}
                  </p>
                </div>
              ))}

              <div className="rounded-[1.1rem] border border-slate-200 bg-[linear-gradient(135deg,#fff7ed_0%,#ffffff_100%)] p-4">
                <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-slate-400">
                  Content snapshot
                </p>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-[1rem] border border-slate-200 bg-white p-4">
                    <p className="text-xs text-slate-500">Published blogs</p>
                    <p className="mt-2 text-lg font-medium text-slate-950">
                      {data?.contentSnapshot?.totalPublishedBlogs || 0}
                    </p>
                  </div>
                  <div className="rounded-[1rem] border border-slate-200 bg-white p-4">
                    <p className="text-xs text-slate-500">Featured blogs</p>
                    <p className="mt-2 text-lg font-medium text-slate-950">
                      {data?.contentSnapshot?.featuredBlogs || 0}
                    </p>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  {(data?.contentSnapshot?.latestTitles || []).map((item) => (
                    <Link
                      key={item.slug}
                      href={`/admin/dashboard/blogs`}
                      className="flex items-center justify-between rounded-[0.95rem] border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 transition hover:border-orange-200 hover:text-orange-700"
                    >
                      <span className="truncate pr-4">{item.title}</span>
                      <span className="text-[10px] uppercase tracking-[0.16em] text-slate-400">
                        {item.category}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {(data?.activityFeed || []).map((activity, index) => (
                <div
                  key={`${activity.title}-${index}`}
                  className="rounded-[1.1rem] border border-slate-200 bg-white p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-orange-50 text-orange-600">
                      {activity.type === "enquiry" ? (
                        <MessageSquareMore className="h-4 w-4" />
                      ) : activity.type === "finance" ? (
                        <CircleDollarSign className="h-4 w-4" />
                      ) : activity.type === "content" ? (
                        <FileText className="h-4 w-4" />
                      ) : (
                        <Globe2 className="h-4 w-4" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-900">{activity.title}</p>
                      <p className="mt-1 text-xs leading-6 text-slate-500">{activity.meta}</p>
                      <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-slate-400">
                        {formatCompactDate(activity.date)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SectionCard>
      </section>
    </div>
  );
}
