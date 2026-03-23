"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  BellRing,
  BriefcaseBusiness,
  ChevronRight,
  Coins,
  LogOut,
  Menu,
  MessageSquareMore,
  Users2,
  X,
} from "lucide-react";
import { adminApi } from "@/lib/api";
import {
  clearAdminSession,
  getAdminToken,
  getRoleHomePath,
  saveAdminSession,
} from "@/lib/admin-session";
import type { AdminUser } from "@/lib/types";

const navItems = [
  { href: "/admin/super", label: "Overview", icon: BarChart3 },
  { href: "/admin/super/finance", label: "Finance", icon: Coins },
  { href: "/admin/super/employees", label: "Employees", icon: Users2 },
  { href: "/admin/super/clients", label: "Clients", icon: BriefcaseBusiness },
  { href: "/admin/super/leads", label: "Leads", icon: MessageSquareMore },
  { href: "/admin/super/settings", label: "Control", icon: BellRing },
];

const pageTitles: Record<string, { title: string; breadcrumb?: string[] }> = {
  "/admin/super": { title: "Overview" },
  "/admin/super/finance": { title: "Finance", breadcrumb: ["Finance"] },
  "/admin/super/employees": { title: "Employees", breadcrumb: ["Employees"] },
  "/admin/super/clients": { title: "Clients", breadcrumb: ["Clients"] },
  "/admin/super/leads": { title: "Leads", breadcrumb: ["Leads"] },
  "/admin/super/settings": { title: "Control Room", breadcrumb: ["Control"] },
};

export default function SuperAdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<AdminUser | null>(null);
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
        if (response.user.role !== "super_admin") {
          router.replace(getRoleHomePath(response.user.role));
          return;
        }
        saveAdminSession(token, response.user);
        setUser(response.user);
        setReady(true);
      })
      .catch(() => {
        clearAdminSession();
        router.replace("/admin");
      });
  }, [router]);

  function logout() {
    clearAdminSession();
    router.push("/admin");
  }

  const currentPage = pageTitles[pathname] || { title: "Dashboard" };

  if (!ready) return null;

  return (
    <div className="h-screen overflow-hidden bg-[#f5f5f7] text-slate-900">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex h-screen">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 flex w-[264px] shrink-0 flex-col overflow-y-auto bg-[#1a1a1a] transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Logo area */}
          <div className="flex items-center justify-between px-5 pt-6 pb-2">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#FF6600]">
                Creative Monk
              </p>
              <h1 className="mt-1 text-lg font-semibold tracking-tight text-white">
                Agency Cockpit
              </h1>
            </div>
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="rounded-lg p-1.5 text-white/40 hover:bg-white/10 hover:text-white lg:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mx-5 my-4 h-px bg-white/10" />

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3">
            <p className="mb-2 px-2 text-[10px] font-medium uppercase tracking-[0.2em] text-white/30">
              Navigation
            </p>
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/admin/super" &&
                  pathname.startsWith(`${item.href}/`));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all ${
                    isActive
                      ? "bg-[#FF6600] text-white shadow-[0_4px_12px_rgba(255,102,0,0.4)]"
                      : "text-white/60 hover:bg-white/[0.06] hover:text-white"
                  }`}
                >
                  <item.icon className="h-[18px] w-[18px]" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Quick access */}
          <div className="mx-3 mb-3">
            <div className="rounded-xl bg-white/[0.06] p-4">
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/30">
                Quick Access
              </p>
              <p className="mt-2 text-xs leading-5 text-white/50">
                Content, CMS, blog publishing, and SEO workflow.
              </p>
              <Link
                href="/admin/dashboard"
                className="mt-3 flex items-center gap-2 text-xs font-medium text-[#FF6600] transition hover:text-[#ff8533]"
              >
                Open SEO workspace
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* User section */}
          <div className="border-t border-white/10 px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FF6600] text-xs font-bold text-white">
                {user?.name?.charAt(0) || "A"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-white">
                  {user?.name}
                </p>
                <p className="truncate text-[11px] text-white/40">
                  {user?.email}
                </p>
              </div>
              <button
                type="button"
                onClick={logout}
                className="rounded-lg p-2 text-white/30 transition hover:bg-white/10 hover:text-red-400"
                title="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
          {/* Top bar */}
          <header className="sticky top-0 z-30 flex items-center gap-4 border-b border-slate-200/80 bg-white/80 px-4 py-3 backdrop-blur-xl md:px-6">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="flex min-w-0 flex-1 items-center gap-2">
              <Link
                href="/admin/super"
                className="text-sm text-slate-400 hover:text-[#FF6600]"
              >
                Dashboard
              </Link>
              {currentPage.breadcrumb?.map((crumb) => (
                <span key={crumb} className="flex items-center gap-2">
                  <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
                  <span className="text-sm font-medium text-slate-700">
                    {crumb}
                  </span>
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-[#FF6600]/10 px-3 py-1 text-[11px] font-semibold text-[#FF6600]">
                Super Admin
              </span>
            </div>
          </header>

          <main className="px-4 py-6 md:px-6 lg:px-8">
            <div className="mx-auto max-w-[1400px]">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
