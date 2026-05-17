"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const SECTIONS: Array<{
  key: string;
  title: string;
  description: string;
  surface: string;
  signal: string;
}> = [
  { key: "hero",            title: "Hero",              description: "Headline, lede, status strip, primary + secondary CTAs, diary widget, stat bento, marquee.", surface: "Top of homepage", signal: "HIGHEST LEVERAGE" },
  { key: "client_marquee",  title: "Client Marquee",    description: "Brand list shown as scrolling wordmarks below the hero.",                                      surface: "Below hero",      signal: "TRUST SIGNAL" },
  { key: "services_deck",   title: "Services Deck",     description: "Three service buckets — Brand, Web, Motion — with deliverables, timeline, price-from.",       surface: "What we do",      signal: "CONVERSION" },
  { key: "process",         title: "Process",           description: "Five-stage workflow with day-ranges, artefacts and accent colours.",                           surface: "How we work",     signal: "DIFFERENTIATOR" },
  { key: "testimonials",    title: "Testimonials",      description: "One featured quote + three supporting quotes with sector / outcome data.",                     surface: "Social proof",    signal: "SOCIAL PROOF" },
  { key: "faq",             title: "FAQ",               description: "Seven sales-objection questions. Answers are rich-text (Tiptap) HTML.",                         surface: "Pre-call answers",signal: "OBJECTION HANDLING" },
  { key: "cta",             title: "Closing CTA",       description: "Bottom-of-page call to action — headline, subhead, two CTAs, trust strip.",                    surface: "Above footer",    signal: "FINAL ASK" },
  { key: "about",           title: "About page",        description: "Studio stats, founder essay, principles, team grid, milestones timeline.",                     surface: "/about page",     signal: "TRUST BUILDER" },
];

export default function HomepageAdminIndex() {
  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-1.5">
        <p className="admin-eyebrow">HOMEPAGE · CONTENT</p>
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h1
              className="text-[28px] leading-none font-semibold tracking-[-0.02em]"
              style={{ fontFamily: "var(--admin-font-display)" }}
            >
              Homepage content
            </h1>
            <p className="mt-2 text-[13px] text-[var(--admin-fg-mute)] max-w-[68ch] leading-[1.55]">
              Every editable surface of the homepage and about page. Changes go
              live immediately. Run the seed script if a section reports as
              empty.
            </p>
          </div>
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 h-9 px-3 text-[12.5px] text-[var(--admin-fg-mute)] hover:text-[var(--admin-fg)] hover:bg-[var(--admin-surface-hover)] transition-colors"
            style={{ border: "1px solid var(--admin-border)", borderRadius: "var(--radius-sm)" }}
          >
            View live homepage
            <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
      </header>

      {/* Section grid */}
      <section
        className="grid grid-cols-1 md:grid-cols-2"
        style={{ background: "var(--admin-border)", gap: 1 }}
      >
        {SECTIONS.map((section, idx) => (
          <Link
            key={section.key}
            href={`/admin/dashboard/homepage/${section.key}`}
            className="group relative p-5 transition-colors hover:bg-[var(--admin-surface-hover)]"
            style={{ background: "var(--admin-surface)" }}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-3">
                  <span
                    className="admin-mono text-[10.5px] text-[var(--admin-fg-dim)]"
                    style={{ letterSpacing: "0.12em" }}
                  >
                    §{String(idx + 1).padStart(2, "0")}
                  </span>
                  <span className="admin-pill">{section.surface}</span>
                  <span
                    className="admin-mono text-[9.5px] text-[var(--admin-accent)]"
                    style={{ letterSpacing: "0.14em" }}
                  >
                    {section.signal}
                  </span>
                </div>
                <h2
                  className="mt-4 text-[18px] font-semibold tracking-[-0.012em] group-hover:text-[var(--admin-accent)] transition-colors"
                  style={{ fontFamily: "var(--admin-font-display)" }}
                >
                  {section.title}
                </h2>
                <p className="mt-2 text-[13px] text-[var(--admin-fg-mute)] leading-[1.55]">
                  {section.description}
                </p>
                <p className="mt-4 admin-mono text-[11px] text-[var(--admin-fg-dim)]">
                  /admin/dashboard/homepage/{section.key}
                </p>
              </div>
              <ArrowUpRight
                className="h-4 w-4 text-[var(--admin-fg-dim)] group-hover:text-[var(--admin-accent)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all shrink-0 mt-1"
              />
            </div>
            <span
              className="absolute left-0 top-0 bottom-0 w-px opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ background: "var(--admin-accent)" }}
            />
          </Link>
        ))}
      </section>

      <aside
        className="px-5 py-4 flex items-start gap-4"
        style={{
          background: "rgba(245,165,36,0.06)",
          border: "1px solid rgba(245,165,36,0.25)",
          borderRadius: "var(--radius-sm)",
        }}
      >
        <span className="admin-pill" data-tone="warning">first run</span>
        <div>
          <p className="text-[13px] text-[var(--admin-fg)] mb-1 font-medium">
            Sections empty?
          </p>
          <p className="text-[12.5px] text-[var(--admin-fg-mute)] leading-[1.55]">
            Run{" "}
            <code className="admin-mono text-[11.5px] px-1.5 py-0.5" style={{ background: "rgba(255,255,255,0.05)", borderRadius: "var(--radius-sm)" }}>
              node scripts/seed-homepage-content.js
            </code>{" "}
            inside the backend to populate every section with the conversion-tuned
            defaults. It&apos;s idempotent — safe to re-run.
          </p>
        </div>
      </aside>
    </div>
  );
}
