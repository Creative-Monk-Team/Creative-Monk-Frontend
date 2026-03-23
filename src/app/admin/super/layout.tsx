"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  BellRing,
  BriefcaseBusiness,
  Coins,
  MessageSquareMore,
  Users2,
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
  {
    href: "/admin/super",
    label: "Overview",
    icon: BarChart3,
  },
  {
    href: "/admin/super/finance",
    label: "Finance",
    icon: Coins,
  },
  {
    href: "/admin/super/employees",
    label: "Employees",
    icon: Users2,
  },
  {
    href: "/admin/super/clients",
    label: "Clients",
    icon: BriefcaseBusiness,
  },
  {
    href: "/admin/super/leads",
    label: "Leads",
    icon: MessageSquareMore,
  },
  {
    href: "/admin/super/settings",
    label: "Control",
    icon: BellRing,
  },
];

export default function SuperAdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<AdminUser | null>(null);

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

  if (!ready) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#ffffff_32%,#fffaf5_100%)] text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-[1680px] gap-6 px-4 py-4 md:px-6">
        <aside className="sticky top-4 self-start w-[276px] shrink-0 rounded-[1.8rem] border border-[#ffd9c0] bg-[linear-gradient(180deg,rgba(255,248,242,0.96)_0%,rgba(255,255,255,0.96)_48%,rgba(248,250,252,0.96)_100%)] p-5 shadow-[0_30px_80px_-56px_rgba(255,102,0,0.24)] backdrop-blur-xl">
          <div className="rounded-[1.45rem] border border-[#ffd8c2] bg-white/90 p-5 shadow-[0_24px_60px_-52px_rgba(15,23,42,0.2)]">
            <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-orange-600">
              Creative Monk
            </p>
            <h1 className="mt-3 text-[1.55rem] font-medium tracking-[-0.05em] text-slate-950">
              Agency cockpit
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              Boss-side finance, lead tracking, client control, and ops alerts.
            </p>
          </div>

          <div className="mt-6">
            <p className="px-2 text-[10px] font-medium uppercase tracking-[0.22em] text-slate-400">
              Navigation
            </p>
            <nav className="mt-3 space-y-1.5">
              {navItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/admin/super" && pathname.startsWith(`${item.href}/`));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-[1.1rem] px-3.5 py-3 text-sm transition ${
                      isActive
                        ? "bg-[linear-gradient(135deg,#0f172a_0%,#111827_100%)] text-white shadow-[0_20px_44px_-30px_rgba(15,23,42,0.45)]"
                        : "text-slate-600 hover:bg-white hover:text-orange-700"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="mt-6 rounded-[1.4rem] border border-[#ffd8c2] bg-white/85 p-4">
            <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-slate-400">
              Quick Access
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Content, CMS, blog publishing, and SEO workflow.
            </p>
            <Link
              href="/admin/dashboard"
              className="mt-4 inline-flex items-center rounded-full border border-[#ffd8c2] bg-[#fff7f1] px-4 py-2 text-sm font-medium text-orange-700 transition hover:bg-white"
            >
              Open SEO workspace
            </Link>
          </div>

          <div className="mt-6 rounded-[1.4rem] border border-slate-200 bg-white p-4 shadow-[0_18px_45px_-38px_rgba(15,23,42,0.24)]">
            <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-slate-400">
              Signed in
            </p>
            <p className="mt-2 text-sm font-medium text-slate-900">{user?.name}</p>
            <p className="mt-1 text-xs text-slate-500">{user?.email}</p>
            <button
              type="button"
              onClick={logout}
              className="mt-4 inline-flex w-full items-center justify-center rounded-full border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:border-rose-200 hover:text-rose-600"
            >
              Sign out
            </button>
          </div>
        </aside>

        <div className="min-w-0 flex-1 rounded-[2rem] border border-slate-200/80 bg-white/75 shadow-[0_30px_90px_-65px_rgba(15,23,42,0.2)] backdrop-blur-xl">
          <header className="border-b border-slate-200/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.84)_0%,rgba(255,247,241,0.7)_100%)] px-6 py-4 backdrop-blur-xl md:px-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-slate-700">Creative Monk executive workspace</p>
                <p className="mt-1 text-xs uppercase tracking-[0.14em] text-slate-400">
                  Finance, leads, clients, delivery, and alerts in one place
                </p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#ffd8c2] bg-[#fff7f1] px-3 py-1.5 text-xs font-medium text-orange-700">
                Super admin
              </div>
            </div>
          </header>

          <main className="px-6 py-6 md:px-8 md:py-8">
            <div className="mx-auto max-w-7xl">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
