"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { notFound, useParams, useRouter } from "next/navigation";
import { ArrowLeft, Eye, Loader2, Save } from "lucide-react";
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
  services_deck:  "Three buckets — each leads with the founder's desired feeling (\"to feel / convert / spread\"). Include priceFrom to reduce price-objection bounces.",
  process:        "Five stages. Day-ranges sell predictability; artefacts sell tangibility.",
  testimonials:   "Featured = your strongest quote with a number. Supporting = mix of sectors. Outcome line is the conversion lever.",
  faq:            "answer field is rich-text HTML. Edit via Tiptap on each entry — see the per-section structured editor when M2 lands.",
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

  if (!valid) {
    notFound();
  }

  async function handleSave() {
    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(draft);
    } catch (e) {
      setParseError(e instanceof Error ? e.message : String(e));
      toast.error("Invalid JSON — fix the parse error first.");
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
      toast.success(`${SECTION_LABELS[section]} saved.`);
    } catch (err) {
      console.error(err);
      toast.error("Save failed. Check the network tab.");
    } finally {
      setSaving(false);
    }
  }

  function formatPretty() {
    try {
      const parsed = JSON.parse(draft);
      setDraft(JSON.stringify(parsed, null, 2));
      setParseError(null);
    } catch (e) {
      setParseError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <div className="space-y-5">
      <header className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/super/homepage"
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-slate-500 hover:text-[#FF6600]"
          >
            <ArrowLeft className="h-4 w-4" />
            Sections
          </Link>
          <span className="text-slate-300">/</span>
          <h1 className="text-xl font-semibold tracking-tight text-slate-900">
            {SECTION_LABELS[section]}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={section === "about" ? "/about" : "/"}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[12.5px] font-medium text-slate-700 hover:border-slate-300"
          >
            <Eye className="h-3.5 w-3.5" />
            View live
          </Link>
          <button
            type="button"
            onClick={formatPretty}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[12.5px] font-medium text-slate-700 hover:border-slate-300"
          >
            Format
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!isDirty || saving}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#FF6600] px-3.5 py-1.5 text-[12.5px] font-semibold text-white shadow-[0_4px_12px_rgba(255,102,0,0.3)] transition-all hover:shadow-[0_6px_16px_rgba(255,102,0,0.4)] disabled:opacity-50 disabled:shadow-none"
          >
            {saving ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Save className="h-3.5 w-3.5" />
            )}
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </header>

      <p className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-[13px] leading-[1.55] text-slate-600">
        <span className="font-semibold text-slate-900">Tip · </span>
        {SECTION_HELP[section]}
      </p>

      {loading ? (
        <div className="grid h-[320px] place-items-center rounded-2xl border border-slate-200 bg-white">
          <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
        </div>
      ) : (
        <>
          <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/60 px-4 py-2 text-[11.5px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              <span>JSON payload · section: {section}</span>
              {parseError ? (
                <span className="text-red-500 normal-case tracking-normal font-medium">
                  {parseError}
                </span>
              ) : isDirty ? (
                <span className="text-amber-600 normal-case tracking-normal font-medium">
                  Unsaved changes
                </span>
              ) : (
                <span className="text-emerald-600 normal-case tracking-normal font-medium">
                  Saved
                </span>
              )}
            </div>
            <textarea
              value={draft}
              onChange={(e) => {
                setDraft(e.target.value);
                if (parseError) setParseError(null);
              }}
              spellCheck={false}
              className="block w-full resize-none bg-white px-4 py-3 font-mono text-[12.5px] leading-[1.55] text-slate-800 outline-none"
              rows={32}
              style={{ minHeight: 560 }}
            />
          </div>

          <p className="text-[12px] leading-[1.5] text-slate-500">
            M2 will replace this raw JSON editor with a structured form
            (Tiptap for descriptions, drag-and-drop list reordering, image
            uploads, zod validation). For now: edit the JSON, hit Save. Site
            updates immediately.
          </p>
        </>
      )}
    </div>
  );
}
