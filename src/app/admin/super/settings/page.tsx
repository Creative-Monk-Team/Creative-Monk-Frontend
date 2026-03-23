"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BellRing, DatabaseZap, ExternalLink, ShieldCheck, Sparkles } from "lucide-react";
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

function toneClasses(tone: "high" | "medium" | "low") {
  switch (tone) {
    case "high":
      return "border-rose-200 bg-rose-50 text-rose-700";
    case "medium":
      return "border-amber-200 bg-amber-50 text-amber-700";
    default:
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }
}

export default function SuperAdminSettingsPage() {
  const token = getAdminToken();
  const [data, setData] = useState<SuperAdminOverview | null>(null);
  const [loadingSeed, setLoadingSeed] = useState(false);

  async function loadOverview() {
    const overview = await adminApi.getSuperAdminOverview(token);
    setData(overview);
  }

  useEffect(() => {
    void loadOverview();
  }, [token]);

  async function handleSeed() {
    setLoadingSeed(true);
    try {
      await adminApi.seed(token);
      await loadOverview();
    } finally {
      setLoadingSeed(false);
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[1.9rem] border border-[#ffd8c2] bg-[linear-gradient(135deg,#fff8f2_0%,#ffffff_52%,#f8fafc_100%)] p-6 shadow-[0_28px_90px_-62px_rgba(255,102,0,0.22)]">
        <p className="inline-flex items-center gap-2 rounded-full border border-[#ffd8c2] bg-white px-3 py-1 text-[10px] font-medium uppercase tracking-[0.22em] text-orange-700">
          <Sparkles className="h-3.5 w-3.5" />
          Control room
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-[2rem] font-medium tracking-[-0.05em] text-slate-950">
              Alerts, demo data, and operating controls.
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Keep this workspace populated and act on the highest-pressure issues first.
            </p>
          </div>
          <button
            type="button"
            onClick={() => void handleSeed()}
            disabled={loadingSeed}
            className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-70"
          >
            <DatabaseZap className="h-4 w-4" />
            {loadingSeed ? "Refreshing demo data..." : "Reload demo data"}
          </button>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_24px_70px_-54px_rgba(15,23,42,0.18)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">Alert center</p>
              <h2 className="mt-2 text-[1.25rem] font-medium tracking-[-0.03em] text-slate-950">
                Priority signals
              </h2>
            </div>
            <BellRing className="h-5 w-5 text-orange-500" />
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {(data?.alertsSnapshot || []).map((alert) => (
              <Link
                key={alert.id}
                href={alert.href}
                className="rounded-[1.2rem] border border-slate-200 bg-slate-50/80 p-4 transition hover:border-orange-200 hover:bg-orange-50/50"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{alert.label}</p>
                    <p className="mt-2 text-2xl font-medium tracking-[-0.04em] text-slate-950">
                      {alert.id === "collections" ? formatCurrency(alert.value) : alert.value}
                    </p>
                  </div>
                  <span className={`rounded-full border px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.16em] ${toneClasses(alert.tone)}`}>
                    {alert.tone}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_24px_70px_-54px_rgba(15,23,42,0.18)]">
            <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">System actions</p>
            <div className="mt-4 space-y-3">
              <Link
                href="/admin/super/leads"
                className="flex items-center justify-between rounded-[1.1rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-orange-200 hover:text-orange-700"
              >
                Open leads cockpit
                <ExternalLink className="h-4 w-4" />
              </Link>
              <Link
                href="/admin/super/finance"
                className="flex items-center justify-between rounded-[1.1rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-orange-200 hover:text-orange-700"
              >
                Review finance periods
                <ExternalLink className="h-4 w-4" />
              </Link>
              <Link
                href="/admin/dashboard"
                className="flex items-center justify-between rounded-[1.1rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-orange-200 hover:text-orange-700"
              >
                Switch to SEO workspace
                <ExternalLink className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_24px_70px_-54px_rgba(15,23,42,0.18)]">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">Workspace health</p>
                <p className="mt-1 text-sm text-slate-600">
                  {data?.overview?.clients || 0} clients, {data?.overview?.managedWebsites || 0} managed websites, and {data?.overview?.enquiries || 0} tracked leads currently in the system.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
