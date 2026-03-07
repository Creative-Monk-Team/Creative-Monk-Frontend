"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  FolderKanban,
  MessageSquare,
  LogOut,
  Settings,
} from "lucide-react";
import Link from "next/link";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin");
    } else {
      setLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    router.push("/admin");
  };

  if (loading) return null;

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-background hidden md:block">
        <div className="p-6">
          <h1 className="text-xl font-bold text-primary">Monk Panel</h1>
        </div>
        <nav className="px-4 space-y-2">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-3 px-4 py-2 rounded-lg bg-primary/10 text-primary"
          >
            <LayoutDashboard className="h-5 w-5" />
            Dashboard
          </Link>
          <Link
            href="/admin/dashboard/portfolio"
            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-muted text-muted-foreground transition-all"
          >
            <FolderKanban className="h-5 w-5" />
            Portfolio
          </Link>
          <Link
            href="/admin/dashboard/enquiries"
            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-muted text-muted-foreground transition-all"
          >
            <MessageSquare className="h-5 w-5" />
            Enquiries
          </Link>
          <div className="pt-8 mt-8 border-t">
            <Link
              href="/admin/dashboard/settings"
              className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-muted text-muted-foreground transition-all"
            >
              <Settings className="h-5 w-5" />
              Settings
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-destructive/10 text-destructive transition-all"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="h-16 border-b bg-background flex items-center justify-between px-8">
          <h2 className="font-semibold text-lg">Overview</h2>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Welcome, Admin
            </span>
          </div>
        </header>
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
