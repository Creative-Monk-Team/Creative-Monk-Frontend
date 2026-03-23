"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  CheckCheck,
  Clock3,
  MessageSquareMore,
  Search,
  Sparkles,
} from "lucide-react";
import { adminApi } from "@/lib/api";
import { getAdminToken } from "@/lib/admin-session";
import type { Enquiry } from "@/lib/types";

function formatCompactDate(value: string) {
  return new Date(value).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}

function statusTone(status: Enquiry["status"]) {
  switch (status) {
    case "responded":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "in-progress":
      return "border-amber-200 bg-amber-50 text-amber-700";
    case "archived":
      return "border-slate-200 bg-slate-100 text-slate-600";
    default:
      return "border-orange-200 bg-orange-50 text-orange-700";
  }
}

const statusTabs: Array<{ key: "all" | Enquiry["status"]; label: string }> = [
  { key: "all", label: "All" },
  { key: "new", label: "New" },
  { key: "in-progress", label: "In progress" },
  { key: "responded", label: "Responded" },
  { key: "archived", label: "Archived" },
];

export default function SuperAdminLeadsPage() {
  const token = getAdminToken();
  const [items, setItems] = useState<Enquiry[]>([]);
  const [activeStatus, setActiveStatus] = useState<(typeof statusTabs)[number]["key"]>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  async function loadLeads() {
    const enquiries = await adminApi.list<Enquiry[]>("enquiries", token);
    setItems(enquiries);
    setSelectedId((current) => current || enquiries[0]?._id || null);
  }

  useEffect(() => {
    void loadLeads();
  }, [token]);

  const filtered = useMemo(() => {
    return items.filter((lead) => {
      const matchesStatus = activeStatus === "all" ? true : lead.status === activeStatus;
      const haystack = `${lead.name} ${lead.email} ${lead.service || ""} ${lead.sourcePage || ""}`.toLowerCase();
      const matchesSearch = haystack.includes(search.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [activeStatus, items, search]);

  const selectedLead = filtered.find((item) => item._id === selectedId) || items.find((item) => item._id === selectedId) || null;

  useEffect(() => {
    setNotes(selectedLead?.notes || "");
  }, [selectedLead]);

  const sourceCards = useMemo(() => {
    return Array.from(
      items.reduce((map, item) => {
        const key = item.sourcePage || "direct";
        map.set(key, (map.get(key) || 0) + 1);
        return map;
      }, new Map<string, number>()),
    )
      .map(([source, total]) => ({ source, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  }, [items]);

  async function updateLead(patch: Partial<Enquiry>) {
    if (!selectedLead?._id) return;

    setSaving(true);
    try {
      await adminApi.update(`enquiries/${selectedLead._id}`, token, patch, "PATCH");
      await loadLeads();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[1.9rem] border border-[#ffd8c2] bg-[linear-gradient(135deg,#fff8f2_0%,#ffffff_52%,#f8fafc_100%)] p-6 shadow-[0_28px_90px_-62px_rgba(255,102,0,0.22)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-[#ffd8c2] bg-white px-3 py-1 text-[10px] font-medium uppercase tracking-[0.22em] text-orange-700">
              <Sparkles className="h-3.5 w-3.5" />
              Leads cockpit
            </p>
            <h1 className="mt-4 text-[2rem] font-medium tracking-[-0.05em] text-slate-950">
              Pipeline, source quality, and follow-up control.
            </h1>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-[1.2rem] border border-slate-200 bg-white px-4 py-3">
              <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">Total leads</p>
              <p className="mt-2 text-2xl font-medium text-slate-950">{items.length}</p>
            </div>
            <div className="rounded-[1.2rem] border border-slate-200 bg-white px-4 py-3">
              <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">New this board</p>
              <p className="mt-2 text-2xl font-medium text-slate-950">
                {items.filter((item) => item.status === "new").length}
              </p>
            </div>
            <div className="rounded-[1.2rem] border border-slate-200 bg-white px-4 py-3">
              <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">Responded</p>
              <p className="mt-2 text-2xl font-medium text-slate-950">
                {items.filter((item) => item.status === "responded").length}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_360px]">
        <div className="space-y-6">
          <div className="rounded-[1.7rem] border border-slate-200 bg-white p-5 shadow-[0_24px_70px_-54px_rgba(15,23,42,0.18)]">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative min-w-[240px] flex-1">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search name, service, source..."
                  className="h-11 w-full rounded-full border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-orange-300 focus:bg-white"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {statusTabs.map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveStatus(tab.key)}
                    className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                      activeStatus === tab.key
                        ? "border-slate-950 bg-slate-950 text-white"
                        : "border-slate-200 bg-white text-slate-600 hover:border-orange-200 hover:text-orange-700"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {sourceCards.map((item) => (
                <div key={item.source} className="rounded-[1.1rem] border border-slate-200 bg-[linear-gradient(135deg,#fff8f2_0%,#ffffff_100%)] p-4">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">{item.source}</p>
                  <p className="mt-2 text-xl font-medium text-slate-950">{item.total}</p>
                  <p className="mt-1 text-xs text-slate-500">Lead source count</p>
                </div>
              ))}
            </div>

            <div className="mt-5 space-y-3">
              {filtered.map((lead) => (
                <button
                  key={lead._id}
                  type="button"
                  onClick={() => setSelectedId(lead._id)}
                  className={`w-full rounded-[1.2rem] border p-4 text-left transition ${
                    selectedId === lead._id
                      ? "border-orange-200 bg-orange-50/70"
                      : "border-slate-200 bg-slate-50/70 hover:border-slate-300 hover:bg-white"
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-slate-950">{lead.name}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        {lead.service || "General enquiry"} • {lead.sourcePage || "direct"}
                      </p>
                    </div>
                    <span className={`rounded-full border px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.16em] ${statusTone(lead.status)}`}>
                      {lead.status}
                    </span>
                  </div>
                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">{lead.message}</p>
                  <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                    <span>{lead.email}</span>
                    <span>{formatCompactDate(lead.createdAt)}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-[1.7rem] border border-slate-200 bg-white p-5 shadow-[0_24px_70px_-54px_rgba(15,23,42,0.18)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">Lead detail</p>
                <p className="mt-2 text-lg font-medium text-slate-950">{selectedLead?.name || "Select a lead"}</p>
              </div>
              <MessageSquareMore className="h-5 w-5 text-orange-500" />
            </div>

            {selectedLead ? (
              <div className="mt-5 space-y-4">
                <div className="rounded-[1.1rem] border border-slate-200 bg-slate-50/80 p-4 text-sm text-slate-600">
                  <p>{selectedLead.message}</p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[1rem] border border-slate-200 bg-white p-3">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">Email</p>
                    <p className="mt-2 text-sm text-slate-800">{selectedLead.email}</p>
                  </div>
                  <div className="rounded-[1rem] border border-slate-200 bg-white p-3">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">Phone</p>
                    <p className="mt-2 text-sm text-slate-800">{selectedLead.phone || "Not shared"}</p>
                  </div>
                  <div className="rounded-[1rem] border border-slate-200 bg-white p-3">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">Source</p>
                    <p className="mt-2 text-sm text-slate-800">{selectedLead.sourcePage || "direct"}</p>
                  </div>
                  <div className="rounded-[1rem] border border-slate-200 bg-white p-3">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">Created</p>
                    <p className="mt-2 text-sm text-slate-800">{formatCompactDate(selectedLead.createdAt)}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {(["new", "in-progress", "responded", "archived"] as const).map((status) => (
                    <button
                      key={status}
                      type="button"
                      disabled={saving}
                      onClick={() => void updateLead({ status })}
                      className={`rounded-full border px-3 py-2 text-xs font-medium uppercase tracking-[0.14em] transition ${
                        selectedLead.status === status
                          ? "border-slate-950 bg-slate-950 text-white"
                          : "border-slate-200 bg-white text-slate-600 hover:border-orange-200 hover:text-orange-700"
                      }`}
                    >
                      {status.replace("-", " ")}
                    </button>
                  ))}
                </div>

                <div>
                  <label className="mb-2 block text-[10px] uppercase tracking-[0.18em] text-slate-400">
                    Notes timeline
                  </label>
                  <textarea
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                    rows={7}
                    className="custom-scrollbar w-full rounded-[1.15rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-orange-300 focus:bg-white"
                  />
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => void updateLead({ notes })}
                    className="mt-3 inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-70"
                  >
                    Save notes
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : null}
          </div>

          <div className="rounded-[1.7rem] border border-slate-200 bg-white p-5 shadow-[0_24px_70px_-54px_rgba(15,23,42,0.18)]">
            <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">Lead actions</p>
            <div className="mt-4 space-y-3">
              <div className="rounded-[1rem] border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-3">
                  <Clock3 className="h-4 w-4 text-orange-500" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">Follow-up today</p>
                    <p className="text-xs text-slate-500">
                      {items.filter((item) => item.status === "in-progress").length} active conversations
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-[1rem] border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-3">
                  <CheckCheck className="h-4 w-4 text-emerald-500" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">Ready to close</p>
                    <p className="text-xs text-slate-500">
                      {items.filter((item) => item.status === "responded").length} leads waiting for next move
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}
