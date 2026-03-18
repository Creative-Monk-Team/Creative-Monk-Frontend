"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import type { Service, ServiceCategory, SiteSettings } from "@/lib/types";
import { Navbar } from "./navbar";
import { Footer } from "./footer";

type AppShellProps = {
  children: ReactNode;
  site: SiteSettings | null;
  categories: ServiceCategory[];
  services: Service[];
};

export function AppShell({ children, site, categories, services }: AppShellProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <Navbar site={site} categories={categories} services={services} />
      <main>{children}</main>
      <Footer site={site} />
    </div>
  );
}
