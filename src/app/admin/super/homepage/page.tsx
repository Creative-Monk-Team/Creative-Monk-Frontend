"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

const SECTIONS: Array<{
  key: string;
  title: string;
  description: string;
  surface: string;
}> = [
  { key: "hero",            title: "Hero",              description: "Headline, lede, status strip, primary + secondary CTAs, diary widget, stat bento, marquee.", surface: "Top of homepage" },
  { key: "client_marquee",  title: "Client Marquee",    description: "Brand list shown as scrolling wordmarks below the hero.",                                       surface: "Below hero" },
  { key: "services_deck",   title: "Services Deck",     description: "Three service buckets — Brand, Web, Motion — with deliverables, timeline, price-from.",        surface: "What we do" },
  { key: "process",         title: "Process",           description: "Five-stage workflow with day-ranges, artefacts and accent colours.",                            surface: "How we work" },
  { key: "testimonials",    title: "Testimonials",      description: "One featured quote + three supporting quotes with sector / outcome data.",                      surface: "Social proof" },
  { key: "faq",             title: "FAQ",               description: "Seven sales-objection questions. Answers are rich-text (Tiptap) HTML.",                          surface: "Pre-call answers" },
  { key: "cta",             title: "Closing CTA",       description: "Bottom-of-page call to action — headline, subhead, two CTAs, trust strip.",                     surface: "Above footer" },
  { key: "about",           title: "About page",        description: "Studio stats, founder essay, principles, team grid, milestones timeline.",                      surface: "/about page" },
];

export default function HomepageAdminIndex() {
  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Homepage Content
          </h1>
          <p className="mt-1 text-sm text-slate-500 max-w-2xl">
            Every editable section of the homepage + about page. Changes go live
            immediately. Run the seed script if a section says &quot;not yet
            seeded&quot;.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {SECTIONS.map((section) => (
          <Link
            key={section.key}
            href={`/admin/super/homepage/${section.key}`}
            className="group flex items-start justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 transition-all hover:border-[#FF6600]/40 hover:shadow-sm"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1.5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#FF6600]">
                  {section.surface}
                </p>
              </div>
              <h2 className="text-[15px] font-semibold tracking-tight text-slate-900 group-hover:text-[#FF6600]">
                {section.title}
              </h2>
              <p className="mt-1.5 text-[13px] leading-[1.55] text-slate-500">
                {section.description}
              </p>
            </div>
            <ChevronRight className="h-5 w-5 shrink-0 text-slate-300 group-hover:text-[#FF6600] transition-colors" />
          </Link>
        ))}
      </div>

      <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-5 text-[13px] leading-[1.55] text-amber-900">
        <p className="font-semibold mb-1">First-time setup</p>
        <p>
          Run{" "}
          <code className="rounded bg-white px-1.5 py-0.5 font-mono text-[12px] text-amber-900 border border-amber-200">
            node scripts/seed-homepage-content.js
          </code>{" "}
          inside the backend to populate every section with sensible defaults.
          It&apos;s idempotent — safe to re-run.
        </p>
      </div>
    </div>
  );
}
