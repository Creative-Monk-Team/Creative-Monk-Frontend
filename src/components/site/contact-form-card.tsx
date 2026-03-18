"use client";

import { useState } from "react";
import { submitEnquiry } from "@/lib/api";
import type { Service } from "@/lib/types";

type ContactFormCardProps = {
  services: Service[];
  sourcePage?: string;
};

export function ContactFormCard({ services, sourcePage = "contact" }: ContactFormCardProps) {
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function onSubmit(formData: FormData) {
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      await submitEnquiry({
        name: String(formData.get("name") || ""),
        email: String(formData.get("email") || ""),
        phone: String(formData.get("phone") || ""),
        service: String(formData.get("service") || ""),
        message: String(formData.get("message") || ""),
        sourcePage,
      });

      setSuccessMessage("Thanks for reaching out. We will get back to you shortly.");
    } catch {
      setErrorMessage("We could not submit your enquiry right now. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form action={onSubmit} className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full Name" name="name" required />
        <Field label="Email Address" name="email" type="email" required />
        <Field label="Phone Number" name="phone" type="tel" />
        <label className="space-y-2 text-sm font-medium text-slate-700">
          <span>Service</span>
          <select
            name="service"
            className="h-12 w-full rounded-2xl border border-black/10 bg-white px-4 text-sm outline-none transition focus:border-[var(--brand-400)]"
            defaultValue=""
          >
            <option value="">Select a service</option>
            {services.map((service) => (
              <option key={service._id} value={service.title}>
                {service.title}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label className="mt-4 block space-y-2 text-sm font-medium text-slate-700">
        <span>Project Brief</span>
        <textarea
          name="message"
          rows={6}
          required
          className="w-full rounded-[1.5rem] border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--brand-400)]"
          placeholder="Tell us about your goals, timelines, and what you want to improve."
        />
      </label>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button type="submit" disabled={loading} className="btn-primary disabled:cursor-not-allowed disabled:opacity-70">
          {loading ? "Sending..." : "Send Enquiry"}
        </button>
        {successMessage ? <p className="text-sm text-emerald-600">{successMessage}</p> : null}
        {errorMessage ? <p className="text-sm text-rose-600">{errorMessage}</p> : null}
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="space-y-2 text-sm font-medium text-slate-700">
      <span>{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        className="h-12 w-full rounded-2xl border border-black/10 bg-white px-4 text-sm outline-none transition focus:border-[var(--brand-400)]"
      />
    </label>
  );
}
