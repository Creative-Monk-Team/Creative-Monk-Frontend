"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/lib/api";
import type { Enquiry } from "@/lib/types";

export function EnquiriesManager({ token }: { token: string }) {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  async function loadEnquiries(showLoading = true) {
    if (showLoading) setLoading(true);
    const data = await adminApi.list<Enquiry[]>("enquiries", token);
    setEnquiries(data);
    setLoading(false);
  }

  useEffect(() => {
    void loadEnquiries(false);
  }, [token]);

  async function updateEnquiry(id: string, updates: Partial<Enquiry>) {
    await adminApi.update(`enquiries/${id}`, token, updates, "PATCH");
    setMessage("Enquiry updated.");
    await loadEnquiries();
  }

  if (loading) {
    return <p className="text-sm text-slate-500">Loading enquiries...</p>;
  }

  return (
    <div className="space-y-4">
      {message ? <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</p> : null}
      {enquiries.map((enquiry) => (
        <article key={enquiry._id} className="rounded-3xl border bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-slate-950">{enquiry.name}</h3>
              <p className="mt-1 text-sm text-slate-500">
                {enquiry.email}
                {enquiry.phone ? ` • ${enquiry.phone}` : ""}
                {enquiry.service ? ` • ${enquiry.service}` : ""}
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-700">{enquiry.message}</p>
            </div>
            <div className="grid gap-3 sm:min-w-[220px]">
              <select
                value={enquiry.status}
                onChange={(event) => void updateEnquiry(enquiry._id, { status: event.target.value as Enquiry["status"] })}
                className="h-11 rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-orange-300"
              >
                <option value="new">New</option>
                <option value="in-progress">In Progress</option>
                <option value="responded">Responded</option>
                <option value="archived">Archived</option>
              </select>
              <textarea
                rows={4}
                defaultValue={enquiry.notes || ""}
                placeholder="Internal notes"
                className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-orange-300"
                onBlur={(event) => void updateEnquiry(enquiry._id, { notes: event.target.value })}
              />
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
