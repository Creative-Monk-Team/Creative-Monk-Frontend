"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { notFound, useParams, useRouter } from "next/navigation";
import { ArrowLeft, ExternalLink, Loader2, RotateCcw, Save } from "lucide-react";
import { toast } from "sonner";
import { homepageContentApi, type HomepageSectionKey } from "@/lib/api";
import { getAdminToken } from "@/lib/admin-session";

const VALID_SECTIONS: HomepageSectionKey[] = [
  "hero",
  "client_marquee",
  "services_deck",
  "process",
  "testimonials",
  "faq",
  "cta",
  "about",
];

const SECTION_LABELS: Record<HomepageSectionKey, string> = {
  hero: "Hero",
  client_marquee: "Client Marquee",
  services_deck: "Services Deck",
  process: "Process",
  testimonials: "Testimonials",
  faq: "FAQ",
  cta: "Closing CTA",
  about: "About page",
};

const SECTION_HELP: Record<HomepageSectionKey, string> = {
  hero:           "Top sells the studio in <8 seconds. Lead with the outcome (number > adjective). Keep the lede ≤ 230 chars.",
  client_marquee: "Brand names render as wordmarks. Keep entries crisp and recognisable.",
  services_deck:  "Three buckets — each leads with the founder's desired feeling (to feel / convert / spread). Include priceFrom to reduce price-objection bounces.",
  process:        "Five stages. Day-ranges sell predictability; artefacts sell tangibility.",
  testimonials:   "Featured = your strongest quote with a number. Supporting = mix of sectors. Outcome line is the conversion lever.",
  faq:            "answer field is rich-text HTML. The structured editor lands in M2.",
  cta:            "Risk-reversal language wins here. \"Free 30-min audit\" beats \"book a call\".",
  about:          "About page content. Founder essay, principles, team, milestones all live here.",
};

export default function HomepageSectionEditor() {
  const params = useParams<{ section: string }>();
  const router = useRouter();
  const section = params.section as HomepageSectionKey;
  const valid = VALID_SECTIONS.includes(section);

  const [payload, setPayload] = useState<Record<string, unknown> | null>(null);
  const [draft, setDraft] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const tokenRef = useRef<string | null>(null);

  useEffect(() => {
    if (!valid) return;
    const token = getAdminToken();
    if (!token) {
      router.replace("/admin");
      return;
    }
    tokenRef.current = token;
    homepageContentApi
      .get(section)
      .then((res) => {
        const initial = (res ?? {}) as Record<string, unknown>;
        setPayload(initial);
        setDraft(JSON.stringify(initial, null, 2));
      })
      .finally(() => setLoading(false));
  }, [section, valid, router]);

  const isDirty = useMemo(() => {
    if (!payload) return false;
    return draft !== JSON.stringify(payload, null, 2);
  }, [draft, payload]);

  if (!valid) notFound();

  async function handleSave() {
    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(draft);
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      setParseError(message);
      toast.error(`Invalid JSON · ${message}`);
      return;
    }
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      setParseError("Top-level must be a JSON object.");
      toast.error("Top-level must be a JSON object.");
      return;
    }
    setParseError(null);
    const token = tokenRef.current;
    if (!token) {
      toast.error("Session expired. Sign in again.");
      router.replace("/admin");
      return;
    }
    setSaving(true);
    try {
      const res = await homepageContentApi.update(section, parsed, token);
      const next = (res?.payload ?? parsed) as Record<string, unknown>;
      setPayload(next);
      setDraft(JSON.stringify(next, null, 2));
      toast.success(`${SECTION_LABELS[section]} saved`);
    } catch (err) {
      console.error(err);
      toast.error("Save failed");
    } finally {
      setSaving(false);
    }
  }

  function formatPretty() {
    try {
      const parsed = JSON.parse(draft);
      setDraft(JSON.stringify(parsed, null, 2));
      setParseError(null);
      toast.success("Formatted");
    } catch (e) {
      setParseError(e instanceof Error ? e.message : String(e));
    }
  }

  function resetDraft() {
    if (!payload) return;
    setDraft(JSON.stringify(payload, null, 2));
    setParseError(null);
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <header className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-3 mb-1.5">
            <Link
              href="/admin/dashboard/homepage"
              className="inline-flex items-center gap-1 text-[12px] admin-mono text-[var(--admin-fg-mute)] hover:text-[var(--admin-accent)] transition-colors"
            >
              <ArrowLeft className="h-3 w-3" />
              all sections
            </Link>
            <span className="admin-eyebrow">·</span>
            <span
              className="admin-mono text-[12px] text-[var(--admin-fg-dim)]"
              style={{ letterSpacing: "0.06em" }}
            >
              homepage / {section}
            </span>
          </div>
          <h1
            className="text-[28px] leading-none font-semibold tracking-[-0.02em]"
            style={{ fontFamily: "var(--admin-font-display)" }}
          >
            {SECTION_LABELS[section]}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={section === "about" ? "/about" : "/"}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 h-9 px-3 text-[12.5px] text-[var(--admin-fg-mute)] hover:text-[var(--admin-fg)] hover:bg-[var(--admin-surface-hover)] transition-colors"
            style={{ border: "1px solid var(--admin-border)", borderRadius: "var(--radius-sm)" }}
          >
            View live
            <ExternalLink className="h-3 w-3" />
          </Link>
          <button
            type="button"
            onClick={formatPretty}
            className="inline-flex items-center gap-1.5 h-9 px-3 text-[12.5px] text-[var(--admin-fg-mute)] hover:text-[var(--admin-fg)] hover:bg-[var(--admin-surface-hover)] transition-colors"
            style={{ border: "1px solid var(--admin-border)", borderRadius: "var(--radius-sm)" }}
          >
            Format
          </button>
          <button
            type="button"
            onClick={resetDraft}
            disabled={!isDirty}
            className="inline-flex items-center gap-1.5 h-9 px-3 text-[12.5px] text-[var(--admin-fg-mute)] hover:text-[var(--admin-fg)] hover:bg-[var(--admin-surface-hover)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ border: "1px solid var(--admin-border)", borderRadius: "var(--radius-sm)" }}
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!isDirty || saving}
            className="inline-flex items-center gap-1.5 h-9 px-3.5 text-[12.5px] font-medium disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: "var(--admin-accent)",
              color: "var(--admin-bg)",
              borderRadius: "var(--radius-sm)",
              boxShadow: "0 0 0 1px rgba(255,102,0,0.4)",
            }}
          >
            {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </header>

      {/* Help strip */}
      <div
        className="px-4 py-3 flex items-start gap-3"
        style={{
          background: "var(--admin-surface)",
          border: "1px solid var(--admin-border)",
          borderRadius: "var(--radius-sm)",
        }}
      >
        <span className="admin-pill" data-tone="info">tip</span>
        <p className="text-[12.5px] text-[var(--admin-fg-mute)] leading-[1.55] flex-1">
          {SECTION_HELP[section]}
        </p>
      </div>

      {loading ? (
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
            Loading payload…
          </div>
        </div>
      ) : (
        <div
          className="overflow-hidden"
          style={{
            background: "var(--admin-surface)",
            border: "1px solid var(--admin-border)",
            borderRadius: "var(--radius-sm)",
          }}
        >
          <div
            className="flex items-center justify-between px-4 h-9"
            style={{ borderBottom: "1px solid var(--admin-border)", background: "var(--admin-bg)" }}
          >
            <span className="admin-eyebrow">
              payload · section = {section}
            </span>
            <span
              className="admin-mono text-[10.5px]"
              style={{
                letterSpacing: "0.06em",
                color: parseError
                  ? "var(--admin-danger)"
                  : isDirty
                  ? "var(--admin-warning)"
                  : "var(--admin-success)",
              }}
            >
              {parseError ? `× ${parseError}` : isDirty ? "● UNSAVED" : "✓ SAVED"}
            </span>
          </div>
          <textarea
            value={draft}
            onChange={(e) => {
              setDraft(e.target.value);
              if (parseError) setParseError(null);
            }}
            spellCheck={false}
            className="block w-full resize-none px-5 py-4 admin-mono leading-[1.55]"
            style={{
              background: "var(--admin-bg)",
              color: "var(--admin-fg)",
              fontSize: "12.5px",
              border: 0,
              minHeight: 600,
              fontFeatureSettings: '"tnum", "ss02"',
            }}
            rows={32}
          />
        </div>
      )}

      <p className="admin-mono text-[10.5px] text-[var(--admin-fg-dim)] leading-[1.5]" style={{ letterSpacing: "0.04em" }}>
        // M2 replaces this raw JSON editor with structured form fields
        (Tiptap descriptions, drag-and-drop reordering, image uploads, zod
        validation). For now: edit the JSON, hit Save — site updates immediately.
      </p>
    </div>
  );
}
