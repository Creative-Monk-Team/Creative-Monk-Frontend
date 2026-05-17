"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Briefcase,
  ChevronRight,
  ExternalLink,
  FileText,
  Gauge,
  Globe,
  Image as ImageIcon,
  LayoutTemplate,
  LogOut,
  Menu,
  MessageSquareMore,
  Settings,
  Star,
} from "lucide-react";
import { Toaster } from "sonner";
import { adminApi } from "@/lib/api";
import {
  clearAdminSession,
  getAdminToken,
  getAdminUser,
  saveAdminSession,
} from "@/lib/admin-session";
import type { AdminUser } from "@/lib/types";
import { CommandPalette } from "@/components/admin/command-palette";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type NavGroup = {
  label: string;
  items: Array<{
    href: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    hint?: string;
  }>;
};

const NAV: NavGroup[] = [
  {
    label: "Workspace",
    items: [
      { href: "/admin/dashboard",          label: "Overview",         icon: Gauge,           hint: "ALL" },
      { href: "/admin/dashboard/homepage", label: "Homepage Content", icon: Globe,           hint: "8" },
      { href: "/admin/dashboard/enquiries", label: "Enquiries",       icon: MessageSquareMore, hint: "NEW" },
    ],
  },
  {
    label: "Content",
    items: [
      { href: "/admin/dashboard/services",     label: "Services",      icon: LayoutTemplate },
      { href: "/admin/dashboard/case-studies", label: "Case studies",  icon: Briefcase },
      { href: "/admin/dashboard/portfolio",    label: "Portfolio",     icon: ImageIcon },
      { href: "/admin/dashboard/blogs",        label: "Blogs",         icon: FileText },
      { href: "/admin/dashboard/social-proof", label: "Clients · Testimonials", icon: Star },
    ],
  },
  {
    label: "System",
    items: [
      { href: "/admin/dashboard/content", label: "Settings", icon: Settings },
    ],
  },
];

const ROUTE_LABELS: Record<string, string> = {
  "/admin/dashboard":              "Overview",
  "/admin/dashboard/homepage":     "Homepage Content",
  "/admin/dashboard/services":     "Services",
  "/admin/dashboard/case-studies": "Case Studies",
  "/admin/dashboard/portfolio":    "Portfolio",
  "/admin/dashboard/blogs":        "Blogs",
  "/admin/dashboard/social-proof": "Clients & Testimonials",
  "/admin/dashboard/content":      "Settings",
  "/admin/dashboard/enquiries":    "Enquiries",
};

export default function AdminDashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<AdminUser | null>(getAdminUser());
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const token = getAdminToken();
    if (!token) {
      router.replace("/admin");
      return;
    }
    adminApi
      .me(token)
      .then((response) => {
        saveAdminSession(token, response.user);
        setUser(response.user);
        setReady(true);
      })
      .catch(() => {
        clearAdminSession();
        router.replace("/admin");
      });
  }, [router]);

  /* Promote the admin token scope to <html> so portaled UI (Sheet,
     Dialog, DropdownMenu, AlertDialog, CommandPalette) inherits the
     operator-console theme. Also lock the body scroll — the admin
     shell owns its own viewport via position:fixed and any residual
     body scroll behind it (from the public-site wrapper that hosts
     this layout) would be invisible and confusing. */
  useEffect(() => {
    document.documentElement.setAttribute("data-admin", "true");
    const prevBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.removeAttribute("data-admin");
      document.body.style.overflow = prevBodyOverflow;
    };
  }, []);

  const breadcrumb = useMemo(() => {
    if (pathname === "/admin/dashboard") return null;
    if (pathname.startsWith("/admin/dashboard/homepage/")) {
      const section = pathname.split("/").pop() || "";
      return [
        { href: "/admin/dashboard/homepage", label: "Homepage Content" },
        { href: pathname, label: section.replace(/_/g, " ") },
      ];
    }
    const label = ROUTE_LABELS[pathname];
    return label ? [{ href: pathname, label }] : null;
  }, [pathname]);

  if (!ready) {
    return (
      <div
        data-admin
        className="fixed inset-0 z-50 grid place-items-center"
        style={{ background: "var(--admin-bg)" }}
      >
        <p className="admin-eyebrow">authenticating…</p>
      </div>
    );
  }

  return (
    <div
      data-admin
      className="fixed inset-0 z-50 flex overflow-hidden"
      style={{ background: "var(--admin-bg)" }}
    >
      {/* Sidebar — desktop. Lives in its own static left lane; no
          sticky needed because the parent is fixed to the viewport
          and only the right column scrolls. */}
      <aside
        className="hidden lg:flex flex-col w-[232px] shrink-0 h-full"
        style={{
          background: "var(--admin-bg)",
          borderRight: "1px solid var(--admin-border)",
        }}
      >
        <SidebarBrand />
        <SidebarNav pathname={pathname} onClose={() => setSidebarOpen(false)} />
        <SidebarFooter user={user} onLogout={handleLogout} />
      </aside>

      {/* Sidebar — mobile drawer. Stacks above the fixed admin shell. */}
      {sidebarOpen ? (
        <>
          <div
            className="lg:hidden fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <aside
            className="lg:hidden fixed inset-y-0 left-0 z-[61] flex flex-col w-[240px]"
            style={{
              background: "var(--admin-bg)",
              borderRight: "1px solid var(--admin-border)",
            }}
          >
            <SidebarBrand />
            <SidebarNav pathname={pathname} onClose={() => setSidebarOpen(false)} />
            <SidebarFooter user={user} onLogout={handleLogout} />
          </aside>
        </>
      ) : null}

      {/* Main column — owns its own scroll; sticky header pins
          relative to this container, not the body. */}
      <div className="flex-1 min-w-0 flex flex-col overflow-y-auto">
        <header
          className="sticky top-0 z-30 flex items-center gap-3 h-12 px-3 md:px-5"
          style={{
            background: "rgba(10,10,10,0.85)",
            backdropFilter: "blur(8px)",
            borderBottom: "1px solid var(--admin-border)",
          }}
        >
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden grid place-items-center h-8 w-8 hover:bg-[var(--admin-surface)]"
            style={{ borderRadius: "var(--radius-sm)" }}
          >
            <Menu className="h-[15px] w-[15px]" />
          </button>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <Link
              href="/admin/dashboard"
              className="admin-eyebrow hover:text-[var(--admin-fg)] transition-colors"
            >
              cm/admin
            </Link>
            {breadcrumb?.map((crumb) => (
              <span key={crumb.href} className="flex items-center gap-2 min-w-0">
                <ChevronRight className="h-3 w-3 text-[var(--admin-fg-dim)] shrink-0" />
                <Link
                  href={crumb.href}
                  className="text-[12.5px] text-[var(--admin-fg)] hover:text-[var(--admin-accent)] truncate"
                  style={{ fontFamily: "var(--admin-font-mono)", letterSpacing: "0.04em" }}
                >
                  {crumb.label}
                </Link>
              </span>
            ))}
          </div>

          <CommandPalette />

          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-1.5 h-8 px-2.5 text-[12px] text-[var(--admin-fg-mute)] hover:text-[var(--admin-fg)] hover:bg-[var(--admin-surface)] transition-colors"
            style={{ borderRadius: "var(--radius-sm)", fontFamily: "var(--admin-font-mono)", letterSpacing: "0.04em" }}
          >
            View site
            <ExternalLink className="h-3 w-3" />
          </Link>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger
              className="flex items-center gap-2 h-8 px-2 hover:bg-[var(--admin-surface)] transition-colors"
              style={{ borderRadius: "var(--radius-sm)" }}
            >
              <span
                className="grid place-items-center h-6 w-6 text-[10.5px] font-semibold uppercase"
                style={{
                  background: "var(--admin-accent)",
                  color: "var(--admin-bg)",
                  fontFamily: "var(--admin-font-mono)",
                  borderRadius: "var(--radius-sm)",
                }}
              >
                {(user?.name || user?.email || "A")[0]}
              </span>
              <span className="hidden md:inline text-[12px] text-[var(--admin-fg-mute)] tracking-wide">
                {user?.name?.split(" ")[0]}
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56"
              style={{
                background: "var(--admin-surface)",
                border: "1px solid var(--admin-border-strong)",
                borderRadius: "var(--radius-sm)",
              }}
            >
              <DropdownMenuLabel className="admin-eyebrow">
                Signed in as
              </DropdownMenuLabel>
              <div className="px-2 pb-1.5 text-[12px] text-[var(--admin-fg-mute)] truncate">
                {user?.email}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="h-3.5 w-3.5 mr-2" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <main className="flex-1 min-w-0 px-4 md:px-6 lg:px-8 py-6 md:py-8">
          {children}
        </main>
      </div>

      <Toaster
        theme="dark"
        position="bottom-right"
        toastOptions={{
          style: {
            background: "var(--admin-surface)",
            border: "1px solid var(--admin-border-strong)",
            color: "var(--admin-fg)",
            borderRadius: "var(--radius-sm)",
            fontFamily: "var(--admin-font-body)",
          },
        }}
      />
    </div>
  );

  function handleLogout() {
    clearAdminSession();
    router.push("/admin");
  }
}

function SidebarBrand() {
  return (
    <div
      className="px-5 h-[60px] flex items-center"
      style={{ borderBottom: "1px solid var(--admin-border)" }}
    >
      <div className="flex items-center gap-3">
        <div
          className="grid place-items-center h-7 w-7 font-bold text-[12px]"
          style={{
            background: "var(--admin-accent)",
            color: "var(--admin-bg)",
            fontFamily: "var(--admin-font-mono)",
            borderRadius: "var(--radius-sm)",
          }}
        >
          C
        </div>
        <div className="leading-none">
          <p className="admin-eyebrow">Creative Monk</p>
          <p className="text-[13px] mt-0.5 font-medium" style={{ letterSpacing: "-0.01em" }}>
            Admin
          </p>
        </div>
      </div>
    </div>
  );
}

function SidebarNav({
  pathname,
  onClose,
}: {
  pathname: string;
  onClose: () => void;
}) {
  return (
    <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-5">
      {NAV.map((group) => (
        <div key={group.label}>
          <p className="admin-eyebrow px-3 pb-1.5">{group.label}</p>
          {group.items.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin/dashboard" && pathname.startsWith(`${item.href}/`));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className="flex items-center gap-2.5 px-3 h-8 text-[13px] transition-colors group"
                style={{
                  background: isActive ? "var(--admin-surface)" : "transparent",
                  color: isActive ? "var(--admin-fg)" : "var(--admin-fg-mute)",
                  borderLeft: isActive ? "2px solid var(--admin-accent)" : "2px solid transparent",
                  paddingLeft: "10px",
                }}
              >
                <item.icon className="h-[14px] w-[14px] shrink-0" />
                <span className="flex-1 truncate">{item.label}</span>
                {item.hint ? (
                  <span
                    className="admin-mono text-[9.5px]"
                    style={{ color: isActive ? "var(--admin-accent)" : "var(--admin-fg-dim)", letterSpacing: "0.1em" }}
                  >
                    {item.hint}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}

function SidebarFooter({
  user,
  onLogout,
}: {
  user: AdminUser | null;
  onLogout: () => void;
}) {
  return (
    <div
      className="px-3 py-3"
      style={{ borderTop: "1px solid var(--admin-border)" }}
    >
      <div className="flex items-center gap-2.5 px-2 py-1.5">
        <span
          className="grid place-items-center h-7 w-7 text-[11px] font-bold uppercase shrink-0"
          style={{
            background: "var(--admin-accent)",
            color: "var(--admin-bg)",
            fontFamily: "var(--admin-font-mono)",
            borderRadius: "var(--radius-sm)",
          }}
        >
          {(user?.name || user?.email || "A")[0]}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[12px] text-[var(--admin-fg)] truncate font-medium">
            {user?.name || "Admin"}
          </p>
          <p className="text-[10.5px] text-[var(--admin-fg-dim)] truncate" style={{ fontFamily: "var(--admin-font-mono)" }}>
            {user?.email}
          </p>
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="grid place-items-center h-7 w-7 text-[var(--admin-fg-dim)] hover:text-[var(--admin-danger)] hover:bg-[var(--admin-surface)] transition-colors"
          style={{ borderRadius: "var(--radius-sm)" }}
          title="Sign out"
        >
          <LogOut className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
