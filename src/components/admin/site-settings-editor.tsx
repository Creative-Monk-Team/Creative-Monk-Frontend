"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/lib/api";
import type { SiteSettings } from "@/lib/types";

export function SiteSettingsEditor({ token }: { token: string }) {
  const [settings, setSettings] = useState<Record<string, unknown>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const data = await adminApi.list<SiteSettings>("site-settings", token);
        setSettings(data);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Unable to load site settings.");
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, [token]);

  async function save() {
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const payload = {
        companyName: settings.companyName || "",
        legalName: settings.legalName || "",
        tagline: settings.tagline || "",
        description: settings.description || "",
        website: settings.website || "",
        phone: settings.phone || "",
        phoneRaw: settings.phoneRaw || "",
        email: settings.email || "",
        workingHours: settings.workingHours || "",
        yearFounded: Number(settings.yearFounded || 2019),
        address: parseJson(settings.address),
        social: parseJson(settings.social),
        hero: parseJson(settings.hero),
        stats: parseJson(settings.stats),
        aboutHeadline: settings.aboutHeadline || "",
        aboutDescription: settings.aboutDescription || "",
        aboutStory: parseJson(settings.aboutStory),
        whyChooseUs: parseJson(settings.whyChooseUs),
        values: parseJson(settings.values),
        footerLinks: parseJson(settings.footerLinks),
        seoDefaults: parseJson(settings.seoDefaults),
        sectionToggles: parseJson(settings.sectionToggles),
      };

      const data = await adminApi.update<SiteSettings>("site-settings", token, payload);
      setSettings(data);
      setMessage("Site settings updated.");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to save settings.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-sm text-slate-500">Loading site settings...</p>;
  }

  return (
    <section className="rounded-3xl border bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-950">Site Settings</h2>
          <p className="mt-1 text-sm text-slate-500">
            Manage homepage copy, contact info, footer links, and SEO defaults.
          </p>
        </div>
        <button onClick={save} disabled={saving} className="btn-primary">
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>

      {message ? <p className="mb-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</p> : null}
      {error ? <p className="mb-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Company Name" value={settings.companyName} onChange={(value) => setSettings((current) => ({ ...current, companyName: value }))} />
        <Field label="Legal Name" value={settings.legalName} onChange={(value) => setSettings((current) => ({ ...current, legalName: value }))} />
        <Field label="Tagline" value={settings.tagline} onChange={(value) => setSettings((current) => ({ ...current, tagline: value }))} />
        <Field label="Website" value={settings.website} onChange={(value) => setSettings((current) => ({ ...current, website: value }))} />
        <Field label="Phone" value={settings.phone} onChange={(value) => setSettings((current) => ({ ...current, phone: value }))} />
        <Field label="Phone Raw" value={settings.phoneRaw} onChange={(value) => setSettings((current) => ({ ...current, phoneRaw: value }))} />
        <Field label="Email" value={settings.email} onChange={(value) => setSettings((current) => ({ ...current, email: value }))} />
        <Field label="Working Hours" value={settings.workingHours} onChange={(value) => setSettings((current) => ({ ...current, workingHours: value }))} />
        <Field label="Year Founded" type="number" value={settings.yearFounded} onChange={(value) => setSettings((current) => ({ ...current, yearFounded: value }))} />
        <Field
          label="Description"
          type="textarea"
          value={settings.description}
          onChange={(value) => setSettings((current) => ({ ...current, description: value }))}
        />
        <Field
          label="About Headline"
          type="textarea"
          value={settings.aboutHeadline}
          onChange={(value) => setSettings((current) => ({ ...current, aboutHeadline: value }))}
        />
        <Field
          label="About Description"
          type="textarea"
          value={settings.aboutDescription}
          onChange={(value) => setSettings((current) => ({ ...current, aboutDescription: value }))}
        />
        <JsonField label="Address JSON" value={settings.address} onChange={(value) => setSettings((current) => ({ ...current, address: value }))} />
        <JsonField label="Social JSON" value={settings.social} onChange={(value) => setSettings((current) => ({ ...current, social: value }))} />
        <JsonField label="Hero JSON" value={settings.hero} onChange={(value) => setSettings((current) => ({ ...current, hero: value }))} />
        <JsonField label="Stats JSON" value={settings.stats} onChange={(value) => setSettings((current) => ({ ...current, stats: value }))} />
        <JsonField label="About Story JSON" value={settings.aboutStory} onChange={(value) => setSettings((current) => ({ ...current, aboutStory: value }))} />
        <JsonField label="Why Choose Us JSON" value={settings.whyChooseUs} onChange={(value) => setSettings((current) => ({ ...current, whyChooseUs: value }))} />
        <JsonField label="Values JSON" value={settings.values} onChange={(value) => setSettings((current) => ({ ...current, values: value }))} />
        <JsonField label="Footer Links JSON" value={settings.footerLinks} onChange={(value) => setSettings((current) => ({ ...current, footerLinks: value }))} />
        <JsonField label="SEO Defaults JSON" value={settings.seoDefaults} onChange={(value) => setSettings((current) => ({ ...current, seoDefaults: value }))} />
        <JsonField label="Section Toggles JSON" value={settings.sectionToggles} onChange={(value) => setSettings((current) => ({ ...current, sectionToggles: value }))} />
      </div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: unknown;
  onChange: (value: string) => void;
  type?: "text" | "number" | "textarea";
}) {
  return (
    <label className={`space-y-2 text-sm font-medium text-slate-700 ${type === "textarea" ? "md:col-span-2" : ""}`}>
      <span>{label}</span>
      {type === "textarea" ? (
        <textarea
          rows={4}
          value={String(value ?? "")}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-orange-300"
        />
      ) : (
        <input
          type={type}
          value={String(value ?? "")}
          onChange={(event) => onChange(event.target.value)}
          className="h-12 w-full rounded-2xl border border-slate-200 px-4 outline-none focus:border-orange-300"
        />
      )}
    </label>
  );
}

function JsonField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: unknown;
  onChange: (value: string) => void;
}) {
  return (
    <label className="space-y-2 text-sm font-medium text-slate-700 md:col-span-2">
      <span>{label}</span>
      <textarea
        rows={8}
        value={typeof value === "string" ? value : JSON.stringify(value ?? {}, null, 2)}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-slate-200 px-4 py-3 font-mono text-sm outline-none focus:border-orange-300"
      />
    </label>
  );
}

function parseJson(value: unknown) {
  if (typeof value === "string") {
    return JSON.parse(value);
  }

  return value;
}
