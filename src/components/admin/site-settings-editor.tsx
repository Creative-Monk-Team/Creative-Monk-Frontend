"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { adminApi } from "@/lib/api";
import type { SiteSettings } from "@/lib/types";
import { JsonVisualEditor } from "./cms-collection-manager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Tab =
  | "identity"
  | "contact"
  | "homepage"
  | "about"
  | "footer"
  | "seo"
  | "toggles";

const TABS: Array<{ id: Tab; label: string; hint: string }> = [
  { id: "identity", label: "Identity",  hint: "Brand, tagline, year founded." },
  { id: "contact",  label: "Contact",   hint: "Phone, email, address, working hours." },
  { id: "homepage", label: "Homepage",  hint: "Hero block + stats — used as defaults." },
  { id: "about",    label: "About",     hint: "About page headline, description, story." },
  { id: "footer",   label: "Footer",    hint: "Footer links + social handles." },
  { id: "seo",      label: "SEO",       hint: "Default meta + Open Graph image." },
  { id: "toggles",  label: "Section toggles", hint: "Show/hide individual sections." },
];

export function SiteSettingsEditor({ token }: { token: string }) {
  const [settings, setSettings] = useState<Record<string, unknown>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState<Tab>("identity");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await adminApi.list<SiteSettings>("site-settings", token);
        if (mounted) setSettings(data as unknown as Record<string, unknown>);
      } catch (err) {
        if (mounted) toast.error(err instanceof Error ? err.message : "Unable to load settings.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [token]);

  const isReady = useMemo(() => !loading && Object.keys(settings).length > 0, [loading, settings]);

  function update(key: string, value: unknown) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  async function save() {
    setSaving(true);
    try {
      const payload = {
        companyName:      settings.companyName || "",
        legalName:        settings.legalName || "",
        tagline:          settings.tagline || "",
        description:      settings.description || "",
        website:          settings.website || "",
        phone:            settings.phone || "",
        phoneRaw:         settings.phoneRaw || "",
        email:            settings.email || "",
        workingHours:     settings.workingHours || "",
        yearFounded:      Number(settings.yearFounded || 2019),
        address:          parseJson(settings.address),
        social:           parseJson(settings.social),
        hero:             parseJson(settings.hero),
        stats:            parseJson(settings.stats),
        aboutHeadline:    settings.aboutHeadline || "",
        aboutDescription: settings.aboutDescription || "",
        aboutStory:       parseJson(settings.aboutStory),
        whyChooseUs:      parseJson(settings.whyChooseUs),
        values:           parseJson(settings.values),
        footerLinks:      parseJson(settings.footerLinks),
        seoDefaults:      parseJson(settings.seoDefaults),
        sectionToggles:   parseJson(settings.sectionToggles),
      };
      const data = await adminApi.update<SiteSettings>("site-settings", token, payload);
      setSettings(data as unknown as Record<string, unknown>);
      toast.success("Site settings saved.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div
        className="grid h-[320px] place-items-center"
        style={{
          background: "var(--admin-surface)",
          border: "1px solid var(--admin-border)",
          borderRadius: "var(--radius-sm)",
        }}
      >
        <div className="flex items-center gap-2 text-[var(--admin-fg-dim)] text-[12.5px]">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          Loading site settings…
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <header className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="admin-eyebrow">SETTINGS · GLOBAL</p>
          <h1
            className="mt-1.5 text-[28px] leading-none font-semibold tracking-[-0.02em]"
            style={{ fontFamily: "var(--admin-font-display)" }}
          >
            Site settings
          </h1>
          <p className="mt-2 text-[13px] text-[var(--admin-fg-mute)] max-w-[64ch] leading-[1.55]">
            Brand identity, contact info, footer links, SEO defaults, section
            toggles. These propagate to every page that doesn&apos;t override
            them.
          </p>
        </div>
        <button
          type="button"
          onClick={save}
          disabled={saving || !isReady}
          className="inline-flex items-center gap-1.5 h-9 px-3.5 text-[12.5px] font-medium disabled:opacity-50"
          style={{
            background: "var(--admin-accent)",
            color: "var(--admin-bg)",
            borderRadius: "var(--radius-sm)",
            boxShadow: "0 0 0 1px rgba(255,102,0,0.4)",
          }}
        >
          {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
          {saving ? "Saving…" : "Save settings"}
        </button>
      </header>

      <Tabs value={tab} onValueChange={(v) => setTab(v as Tab)}>
        <TabsList
          className="h-auto p-0 gap-0 w-full justify-start overflow-x-auto"
          style={{
            background: "var(--admin-surface)",
            border: "1px solid var(--admin-border)",
            borderRadius: "var(--radius-sm)",
          }}
        >
          {TABS.map((t) => (
            <TabsTrigger
              key={t.id}
              value={t.id}
              className="h-10 px-4 text-[12.5px] data-[state=active]:text-[var(--admin-accent)] data-[state=active]:shadow-none rounded-none border-r border-[var(--admin-border)] last:border-r-0"
              style={{
                color: tab === t.id ? "var(--admin-accent)" : "var(--admin-fg-mute)",
                background: tab === t.id ? "rgba(255,102,0,0.06)" : "transparent",
              }}
            >
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <p className="mt-3 text-[12.5px] text-[var(--admin-fg-mute)]">
          {TABS.find((t) => t.id === tab)?.hint}
        </p>

        {/* Identity */}
        <TabsContent value="identity" className="mt-5">
          <PanelGrid>
            <Field label="Company Name" value={settings.companyName} onChange={(v) => update("companyName", v)} />
            <Field label="Legal Name"   value={settings.legalName}   onChange={(v) => update("legalName", v)} />
            <Field label="Tagline"      value={settings.tagline}     onChange={(v) => update("tagline", v)} />
            <Field label="Year Founded" value={settings.yearFounded} onChange={(v) => update("yearFounded", v)} type="number" />
            <Field
              label="Description"
              value={settings.description}
              onChange={(v) => update("description", v)}
              type="textarea"
              wide
            />
          </PanelGrid>
        </TabsContent>

        {/* Contact */}
        <TabsContent value="contact" className="mt-5">
          <PanelGrid>
            <Field label="Website"        value={settings.website}      onChange={(v) => update("website", v)} />
            <Field label="Phone (display)" value={settings.phone}        onChange={(v) => update("phone", v)} />
            <Field label="Phone (raw)"     value={settings.phoneRaw}     onChange={(v) => update("phoneRaw", v)} />
            <Field label="Email"          value={settings.email}        onChange={(v) => update("email", v)} />
            <Field label="Working Hours"  value={settings.workingHours} onChange={(v) => update("workingHours", v)} wide />
            <JsonPanel label="Address" name="address" value={settings.address} onChange={(v) => update("address", v)} />
            <JsonPanel label="Social" name="social" value={settings.social} onChange={(v) => update("social", v)} />
          </PanelGrid>
        </TabsContent>

        {/* Homepage */}
        <TabsContent value="homepage" className="mt-5">
          <PanelGrid>
            <JsonPanel label="Hero" name="hero" value={settings.hero} onChange={(v) => update("hero", v)} />
            <JsonPanel label="Stats" name="stats" value={settings.stats} onChange={(v) => update("stats", v)} />
          </PanelGrid>
        </TabsContent>

        {/* About */}
        <TabsContent value="about" className="mt-5">
          <PanelGrid>
            <Field label="About Headline" value={settings.aboutHeadline} onChange={(v) => update("aboutHeadline", v)} type="textarea" wide />
            <Field label="About Description" value={settings.aboutDescription} onChange={(v) => update("aboutDescription", v)} type="textarea" wide />
            <JsonPanel label="About Story" name="aboutStory" value={settings.aboutStory} onChange={(v) => update("aboutStory", v)} />
            <JsonPanel label="Why Choose Us" name="whyChooseUs" value={settings.whyChooseUs} onChange={(v) => update("whyChooseUs", v)} />
            <JsonPanel label="Values" name="values" value={settings.values} onChange={(v) => update("values", v)} />
          </PanelGrid>
        </TabsContent>

        {/* Footer */}
        <TabsContent value="footer" className="mt-5">
          <PanelGrid>
            <JsonPanel label="Footer Links" name="footerLinks" value={settings.footerLinks} onChange={(v) => update("footerLinks", v)} />
          </PanelGrid>
        </TabsContent>

        {/* SEO */}
        <TabsContent value="seo" className="mt-5">
          <PanelGrid>
            <JsonPanel label="SEO Defaults" name="seoDefaults" value={settings.seoDefaults} onChange={(v) => update("seoDefaults", v)} />
          </PanelGrid>
        </TabsContent>

        {/* Toggles */}
        <TabsContent value="toggles" className="mt-5">
          <PanelGrid>
            <JsonPanel label="Section Toggles" name="sectionToggles" value={settings.sectionToggles} onChange={(v) => update("sectionToggles", v)} />
          </PanelGrid>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function PanelGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 md:grid-cols-2 gap-5">{children}</div>;
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  wide,
}: {
  label: string;
  value: unknown;
  onChange: (v: string) => void;
  type?: "text" | "number" | "textarea";
  wide?: boolean;
}) {
  return (
    <label className={`block ${wide || type === "textarea" ? "md:col-span-2" : ""}`}>
      <div className="flex items-center justify-between mb-1.5">
        <span className="admin-eyebrow">{label}</span>
        <span className="admin-mono text-[10px] text-[var(--admin-fg-dim)]">{type.toUpperCase()}</span>
      </div>
      {type === "textarea" ? (
        <textarea
          rows={4}
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2.5 text-[13px] resize-y"
        />
      ) : (
        <input
          type={type}
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-9 px-3 text-[13px]"
        />
      )}
    </label>
  );
}

function JsonPanel({
  label,
  name,
  value,
  onChange,
}: {
  label: string;
  name: string;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  return (
    <div className="md:col-span-2">
      <div className="flex items-center justify-between mb-2">
        <span className="admin-eyebrow">{label}</span>
        <span className="admin-mono text-[10px] text-[var(--admin-fg-dim)]">STRUCTURED · JSON</span>
      </div>
      <JsonVisualEditor value={value} onChange={onChange} name={name} />
    </div>
  );
}

function parseJson(value: unknown) {
  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }
  return value;
}
