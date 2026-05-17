"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { adminApi } from "@/lib/api";
import {
  clearAdminSession,
  getAdminToken,
  getRoleHomePath,
  getAdminUser,
  saveAdminSession,
} from "@/lib/admin-session";
import type { AdminUser } from "@/lib/types";

const navItems = [
  { href: "/admin/dashboard", label: "Overview" },
  { href: "/admin/dashboard/homepage", label: "Homepage Content" },
  { href: "/admin/dashboard/services", label: "Services" },
  { href: "/admin/dashboard/case-studies", label: "Case Studies" },
  { href: "/admin/dashboard/portfolio", label: "Portfolio" },
  { href: "/admin/dashboard/blogs", label: "Blogs" },
  { href: "/admin/dashboard/social-proof", label: "Clients & Testimonials" },
  { href: "/admin/dashboard/content", label: "Content & Settings" },
  { href: "/admin/dashboard/enquiries", label: "Enquiries" },
];

export default function AdminDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<AdminUser | null>(getAdminUser());

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

  function logout() {
    clearAdminSession();
    router.push("/admin");
  }

  if (!ready) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-[280px] bg-gray-950 flex flex-col fixed inset-y-0 left-0 z-50 overflow-y-auto">
        <div className="p-8 pb-6 border-b border-gray-800">
          <p
            className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#FF6600]"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            Creative Monk
          </p>
          <h1 className="mt-2 text-2xl font-black text-white" style={{ fontFamily: "var(--font-outfit)" }}>
            SEO Workspace
          </h1>
          <p className="mt-2 text-xs text-gray-400">
            Content, SEO, social proof, and enquiry operations
          </p>
        </div>

        <div className="flex-1 px-4 py-6">
          <nav className="space-y-1.5">
            <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">
              Dashboard
            </p>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-[#FF6600] text-white shadow-lg shadow-orange-500/20"
                      : "text-gray-400 hover:bg-gray-800/60 hover:text-white"
                  }`}
                  style={isActive ? { fontFamily: "var(--font-outfit)" } : {}}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-gray-800 space-y-3">
          {/* {user?.role === "super_admin" ? (
            <button
              type="button"
              onClick={() => router.push(getRoleHomePath("super_admin"))}
              className="w-full rounded-xl border border-orange-500/20 bg-orange-500/10 px-4 py-3 text-sm font-semibold text-orange-300 transition hover:bg-orange-500/15"
            >
              Open Super Admin HQ
            </button>
          ) : null} */}
          <button
            type="button"
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-gray-400 transition-all duration-200 hover:bg-red-500/10 hover:text-red-400"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 pl-[280px] flex flex-col min-h-screen">
        <header className="h-20 bg-white border-b border-gray-100 flex items-center px-8 shadow-sm">
          <div>
            <p className="text-sm font-medium text-gray-500">
              Manage dynamic content, SEO metadata, social proof, and customer enquiries.
            </p>
            <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[#FF6600]">
              {user?.name || "Creative Monk SEO Expert"}
            </p>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto space-y-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
