"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { adminApi } from "@/lib/api";
import type { DashboardStats } from "@/lib/types";
import {
  ArrowUpRight,
  Briefcase,
  FileText,
  Globe,
  Image as ImageIcon,
  LayoutTemplate,
  MessageSquareMore,
  Star,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("creative-monk-admin-token");
    if (!token) return;
    adminApi.getStats(token).then(setStats).catch(() => null).finally(() => setLoading(false));
  }, []);

  const kpis: Array<{ label: string; value: number | string; emphasis?: boolean; group: string }> = [
    { label: "New enquiries",  value: stats?.newEnquiries ?? "—", emphasis: true, group: "INBOX"   },
    { label: "Total enquiries",value: stats?.enquiries    ?? "—",                  group: "INBOX"   },
    { label: "Services",       value: stats?.services     ?? "—",                  group: "CONTENT" },
    { label: "Case studies",   value: stats?.caseStudies  ?? "—",                  group: "CONTENT" },
    { label: "Blogs",          value: stats?.blogs        ?? "—",                  group: "CONTENT" },
    { label: "Clients",        value: stats?.clients      ?? "—",                  group: "SOCIAL"  },
    { label: "Testimonials",   value: stats?.testimonials ?? "—",                  group: "SOCIAL"  },
    { label: "Open careers",   value: stats?.careers      ?? "—",                  group: "TEAM"    },
  ];

  const quick: Array<{ href: string; label: string; description: string; icon: React.ComponentType<{ className?: string }> }> = [
    { href: "/admin/dashboard/homepage",      label: "Homepage content",       description: "Hero, services deck, testimonials, FAQ, CTA, about — every editable surface.", icon: Globe },
    { href: "/admin/dashboard/services",      label: "Services",               description: "19 services on the public site. Bullets, process, FAQs, SEO.",                 icon: LayoutTemplate },
    { href: "/admin/dashboard/case-studies",  label: "Case studies",           description: "Client work — challenges, solutions, metrics, gallery.",                       icon: Briefcase },
    { href: "/admin/dashboard/portfolio",     label: "Portfolio",              description: "Standalone portfolio entries — web, brand, packaging, GD.",                    icon: ImageIcon },
    { href: "/admin/dashboard/blogs",         label: "Blog posts",             description: "Rich-text articles with featured images and tags.",                            icon: FileText },
    { href: "/admin/dashboard/social-proof",  label: "Clients · testimonials", description: "Logo wall + recommendation cards used across the site.",                      icon: Star },
    { href: "/admin/dashboard/enquiries",     label: "Inbox",                  description: "Contact form submissions — triage, notes, status.",                            icon: MessageSquareMore },
  ];

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-1.5">
        <p className="admin-eyebrow">SECTOR · OVERVIEW</p>
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <h1
            className="text-[34px] leading-none font-semibold tracking-[-0.02em]"
            style={{ fontFamily: "var(--admin-font-display)" }}
          >
            Operator console
          </h1>
          <p className="text-[12.5px] text-[var(--admin-fg-mute)] admin-mono">
            {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "2-digit", month: "short", year: "numeric" }).toUpperCase()}
          </p>
        </div>
        <p className="text-[13.5px] text-[var(--admin-fg-mute)] max-w-[64ch] leading-[1.6]">
          A live snapshot of everything the public site is currently saying about us — and the queue waiting for a reply.
        </p>
      </header>

      {/* KPI ribbon — dense + sharp */}
      <section
        className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4"
        style={{ background: "var(--admin-border)", gap: 1 }}
      >
        {kpis.map((kpi) => (
          <article
            key={kpi.label}
            className="p-5 relative overflow-hidden group transition-colors"
            style={{
              background: "var(--admin-surface)",
            }}
          >
            <div className="flex items-center justify-between">
              <p className="admin-eyebrow">{kpi.group}</p>
              {kpi.emphasis ? (
                <span className="admin-pill" data-tone="accent">live</span>
              ) : null}
            </div>
            <p
              className="mt-5 text-[40px] leading-none font-semibold admin-tnum"
              style={{
                fontFamily: "var(--admin-font-display)",
                letterSpacing: "-0.03em",
                color: kpi.emphasis ? "var(--admin-accent)" : "var(--admin-fg)",
              }}
            >
              {loading ? <span className="text-[var(--admin-fg-dim)]">…</span> : kpi.value}
            </p>
            <p className="mt-3 text-[12.5px] text-[var(--admin-fg-mute)]">{kpi.label}</p>
            <span
              className="absolute bottom-0 left-0 right-0 h-px"
              style={{
                background:
                  kpi.emphasis
                    ? "linear-gradient(90deg, var(--admin-accent), transparent)"
                    : "linear-gradient(90deg, var(--admin-border-strong), transparent)",
              }}
            />
          </article>
        ))}
      </section>

      {/* Quick actions */}
      <section className="space-y-3">
        <div className="flex items-end justify-between">
          <h2
            className="text-[17px] font-semibold tracking-[-0.012em]"
            style={{ fontFamily: "var(--admin-font-display)" }}
          >
            Sections
          </h2>
          <p className="admin-eyebrow">⌘K · jump anywhere</p>
        </div>
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          style={{ background: "var(--admin-border)", gap: 1 }}
        >
          {quick.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group relative p-5 transition-colors hover:bg-[var(--admin-surface-hover)]"
              style={{ background: "var(--admin-surface)" }}
            >
              <div className="flex items-center justify-between gap-3">
                <item.icon
                  className="h-[15px] w-[15px] text-[var(--admin-fg-mute)] group-hover:text-[var(--admin-accent)] transition-colors"
                />
                <ArrowUpRight
                  className="h-[14px] w-[14px] text-[var(--admin-fg-dim)] group-hover:text-[var(--admin-accent)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all"
                />
              </div>
              <h3
                className="mt-6 text-[14.5px] font-semibold tracking-[-0.01em]"
                style={{ fontFamily: "var(--admin-font-display)" }}
              >
                {item.label}
              </h3>
              <p className="mt-1.5 text-[12.5px] text-[var(--admin-fg-mute)] leading-[1.55]">
                {item.description}
              </p>
              <span
                className="absolute left-0 top-0 bottom-0 w-px opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: "var(--admin-accent)" }}
              />
            </Link>
          ))}
        </div>
      </section>

      {/* Two-column: System status + Tips */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-px" style={{ background: "var(--admin-border)" }}>
        <div className="p-6" style={{ background: "var(--admin-surface)" }}>
          <p className="admin-eyebrow">system status</p>
          <h3
            className="mt-2 text-[16px] font-semibold tracking-[-0.01em]"
            style={{ fontFamily: "var(--admin-font-display)" }}
          >
            Everything reporting nominal
          </h3>
          <ul className="mt-5 space-y-3 text-[13px]">
            {[
              { label: "API",         value: "127.0.0.1:5000", tone: "success" as const, note: "200 OK" },
              { label: "Database",    value: "Turso · libSQL", tone: "success" as const, note: "AWS ap-south-1" },
              { label: "Media",       value: "Cloudinary",     tone: "success" as const, note: "dkqo3uz5o" },
              { label: "Deploy",      value: "Vercel main",    tone: "info" as const,    note: "auto" },
            ].map((row) => (
              <li
                key={row.label}
                className="flex items-center justify-between py-2"
                style={{ borderBottom: "1px dashed var(--admin-border)" }}
              >
                <span className="admin-mono text-[11.5px] text-[var(--admin-fg-mute)]" style={{ letterSpacing: "0.06em" }}>
                  {row.label}
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-[12.5px] admin-mono text-[var(--admin-fg)]">{row.value}</span>
                  <span className="admin-pill" data-tone={row.tone}>{row.note}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-6" style={{ background: "var(--admin-surface)" }}>
          <p className="admin-eyebrow">operator tips</p>
          <h3
            className="mt-2 text-[16px] font-semibold tracking-[-0.01em]"
            style={{ fontFamily: "var(--admin-font-display)" }}
          >
            What this console can do
          </h3>
          <ul className="mt-5 space-y-3 text-[13px] text-[var(--admin-fg-mute)] leading-[1.65]">
            <li className="flex gap-3">
              <span className="admin-kbd shrink-0 mt-0.5">⌘K</span>
              <span>Open the command palette. Jump to any section or fire a quick action.</span>
            </li>
            <li className="flex gap-3">
              <span className="admin-kbd shrink-0 mt-0.5">N</span>
              <span>On a list page, the New button opens a centred dialog for create.</span>
            </li>
            <li className="flex gap-3">
              <span className="admin-kbd shrink-0 mt-0.5">↵</span>
              <span>Click any row to open the right-side sheet for edit.</span>
            </li>
            <li className="flex gap-3">
              <span className="admin-kbd shrink-0 mt-0.5">/</span>
              <span>The search input on every list filters across visible columns.</span>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
