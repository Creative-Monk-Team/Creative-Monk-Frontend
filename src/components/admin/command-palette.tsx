"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Command as CmdkCommand } from "cmdk";
import {
  ArrowUpRight,
  Briefcase,
  FileText,
  Gauge,
  Globe,
  Image as ImageIcon,
  LayoutTemplate,
  LogOut,
  MessageSquareMore,
  Settings,
  Star,
  Users,
} from "lucide-react";
import { clearAdminSession } from "@/lib/admin-session";

type Action = {
  id: string;
  label: string;
  group: string;
  href?: string;
  onSelect?: () => void;
  icon?: React.ComponentType<{ className?: string }>;
  shortcut?: string[];
};

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  function go(href: string) {
    setOpen(false);
    router.push(href);
  }

  const actions: Action[] = [
    { id: "overview",     label: "Overview",            group: "Navigate", icon: Gauge,           href: "/admin/dashboard" },
    { id: "homepage",     label: "Homepage content",    group: "Navigate", icon: Globe,           href: "/admin/dashboard/homepage" },
    { id: "services",     label: "Services",            group: "Navigate", icon: LayoutTemplate,  href: "/admin/dashboard/services" },
    { id: "case-studies", label: "Case studies",        group: "Navigate", icon: Briefcase,       href: "/admin/dashboard/case-studies" },
    { id: "portfolio",    label: "Portfolio",           group: "Navigate", icon: ImageIcon,       href: "/admin/dashboard/portfolio" },
    { id: "blogs",        label: "Blogs",               group: "Navigate", icon: FileText,        href: "/admin/dashboard/blogs" },
    { id: "social",       label: "Clients & Testimonials", group: "Navigate", icon: Star,         href: "/admin/dashboard/social-proof" },
    { id: "settings",     label: "Content & Settings",  group: "Navigate", icon: Settings,        href: "/admin/dashboard/content" },
    { id: "enquiries",    label: "Enquiries",           group: "Navigate", icon: MessageSquareMore, href: "/admin/dashboard/enquiries" },
    { id: "hero",         label: "Edit · Hero section",        group: "Quick edit", icon: ArrowUpRight, href: "/admin/dashboard/homepage/hero" },
    { id: "cta",          label: "Edit · Closing CTA",         group: "Quick edit", icon: ArrowUpRight, href: "/admin/dashboard/homepage/cta" },
    { id: "faq",          label: "Edit · FAQ",                 group: "Quick edit", icon: ArrowUpRight, href: "/admin/dashboard/homepage/faq" },
    { id: "testimonials", label: "Edit · Testimonials",        group: "Quick edit", icon: ArrowUpRight, href: "/admin/dashboard/homepage/testimonials" },
    { id: "view-site",    label: "View live site",      group: "External",  icon: ArrowUpRight,   href: "/" },
    {
      id: "logout",
      label: "Sign out",
      group: "Account",
      icon: LogOut,
      onSelect: () => {
        clearAdminSession();
        router.push("/admin");
      },
    },
  ];

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-[120] grid place-items-start justify-center pt-[14vh]"
          style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)" }}
          onClick={() => setOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="admin-corners relative w-[min(640px,92vw)] overflow-hidden"
            style={{
              background: "var(--admin-surface)",
              border: "1px solid var(--admin-border-strong)",
              borderRadius: "var(--radius-md)",
              boxShadow: "0 30px 80px -20px rgba(0,0,0,0.7)",
            }}
          >
            <CmdkCommand
              label="Admin command menu"
              className="flex flex-col"
              filter={(value, search) =>
                value.toLowerCase().includes(search.toLowerCase()) ? 1 : 0
              }
            >
              <div
                className="flex items-center gap-3 px-4 h-[52px]"
                style={{ borderBottom: "1px solid var(--admin-border)" }}
              >
                <span className="admin-eyebrow">⌘K</span>
                <CmdkCommand.Input
                  placeholder="Search · jump to · run an action"
                  className="flex-1 bg-transparent outline-none text-[14px] placeholder:text-[var(--admin-fg-dim)] text-[var(--admin-fg)]"
                  autoFocus
                />
                <span className="admin-kbd">ESC</span>
              </div>

              <CmdkCommand.List className="max-h-[60vh] overflow-y-auto py-2">
                <CmdkCommand.Empty className="px-4 py-8 text-center text-[13px] text-[var(--admin-fg-dim)]">
                  No matches found.
                </CmdkCommand.Empty>
                {["Navigate", "Quick edit", "External", "Account"].map((group) => (
                  <CmdkCommand.Group
                    key={group}
                    heading={group}
                    className="px-2 py-1"
                  >
                    <div className="px-3 pt-2 pb-1 admin-eyebrow">{group}</div>
                    {actions
                      .filter((a) => a.group === group)
                      .map((action) => (
                        <CmdkCommand.Item
                          key={action.id}
                          value={`${action.group} ${action.label}`}
                          onSelect={() => {
                            if (action.href) go(action.href);
                            else action.onSelect?.();
                          }}
                          className="flex items-center gap-3 px-3 py-2 text-[13.5px] cursor-pointer rounded-[3px] aria-selected:bg-[var(--admin-surface-hover)] aria-selected:text-[var(--admin-accent)] text-[var(--admin-fg)]"
                        >
                          {action.icon ? (
                            <action.icon className="h-[15px] w-[15px] opacity-70" />
                          ) : null}
                          <span className="flex-1 truncate">{action.label}</span>
                          {action.shortcut ? (
                            <span className="flex gap-1">
                              {action.shortcut.map((k) => (
                                <span key={k} className="admin-kbd">{k}</span>
                              ))}
                            </span>
                          ) : null}
                        </CmdkCommand.Item>
                      ))}
                  </CmdkCommand.Group>
                ))}
              </CmdkCommand.List>

              <div
                className="flex items-center justify-between px-4 py-2.5"
                style={{ borderTop: "1px solid var(--admin-border)" }}
              >
                <span className="admin-eyebrow">Creative Monk · Admin</span>
                <div className="flex items-center gap-2">
                  <span className="admin-kbd">↑↓</span>
                  <span className="text-[10.5px] text-[var(--admin-fg-dim)] tracking-[0.18em] uppercase font-mono">
                    Navigate
                  </span>
                  <span className="admin-kbd">↵</span>
                  <span className="text-[10.5px] text-[var(--admin-fg-dim)] tracking-[0.18em] uppercase font-mono">
                    Select
                  </span>
                </div>
              </div>
            </CmdkCommand>
          </div>
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="hidden md:flex items-center gap-3 h-9 px-3 text-[12.5px] text-[var(--admin-fg-mute)] hover:text-[var(--admin-fg)] transition-colors"
        style={{
          background: "var(--admin-bg)",
          border: "1px solid var(--admin-border)",
          borderRadius: "var(--radius-sm)",
          minWidth: 280,
        }}
      >
        <span className="opacity-60">Jump to anything…</span>
        <span className="ml-auto flex items-center gap-1">
          <span className="admin-kbd">⌘</span>
          <span className="admin-kbd">K</span>
        </span>
      </button>
    </>
  );
}
