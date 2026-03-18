"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Menu, Phone, X } from "lucide-react";
import type { Service, ServiceCategory, SiteSettings } from "@/lib/types";
import { getIcon } from "@/lib/icon-utils";
import { cn } from "@/lib/utils";

type NavbarProps = {
  site: SiteSettings | null;
  categories: ServiceCategory[];
  services: Service[];
};

const coreLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/case-studies", label: "Case Studies" },
  { href: "/blog", label: "Blog" },
  { href: "/career", label: "Careers" },
  { href: "/contact", label: "Contact" },
];

export function Navbar({ site, categories, services }: NavbarProps) {
  const [open, setOpen] = useState(false);

  const grouped = useMemo(() => {
    const map = new Map<string, Service[]>();
    categories.forEach((category) => {
      map.set(
        category.slug,
        services.filter((service) => service.category === category.slug).slice(0, 6),
      );
    });
    return map;
  }, [categories, services]);

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/90 backdrop-blur-xl">
      <div className="hidden border-b border-black/5 bg-[var(--brand-900)] text-white lg:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-2 text-sm">
          <div className="flex items-center gap-4">
            <a href={`tel:${site?.phoneRaw || "+919463445566"}`} className="opacity-90 transition hover:opacity-100">
              {site?.phone || "+91 94634 45566"}
            </a>
            <a href={`mailto:${site?.email || "info@thecreativemonk.in"}`} className="opacity-90 transition hover:opacity-100">
              {site?.email || "info@thecreativemonk.in"}
            </a>
          </div>
          <span className="opacity-80">{site?.workingHours || "Mon - Sat: 9AM - 6PM"}</span>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--brand-100)] text-[var(--brand-700)]">
            <span className="font-display text-lg font-black">CM</span>
          </div>
          <div className="min-w-0">
            <p className="truncate font-display text-lg font-black text-slate-950">
              {site?.companyName || "Creative Monk"}
            </p>
            <p className="truncate text-xs uppercase tracking-[0.24em] text-slate-500">
              Digital Growth Studio
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {coreLinks.map((link) =>
            link.href === "/services" ? (
              <div key={link.href} className="group relative">
                <Link href={link.href} className="nav-link">
                  {link.label}
                </Link>
                <div className="pointer-events-none absolute left-1/2 top-full z-50 mt-4 hidden w-[min(90vw,820px)] -translate-x-1/2 rounded-[2rem] border border-black/5 bg-white p-6 shadow-[0_32px_90px_rgba(15,23,42,0.12)] group-hover:block group-hover:pointer-events-auto">
                  <div className="grid gap-6 md:grid-cols-3">
                    {categories.map((category) => {
                      const Icon = getIcon(category.icon);
                      const categoryServices = grouped.get(category.slug) || [];
                      return (
                        <div key={category.slug} className="rounded-[1.5rem] bg-slate-50 p-4">
                          <div className="mb-4 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-[var(--brand-600)] shadow-sm">
                              <Icon className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="font-display text-base font-bold text-slate-950">
                                {category.title}
                              </p>
                              <p className="text-xs text-slate-500">{categoryServices.length} services</p>
                            </div>
                          </div>
                          <div className="space-y-2">
                            {categoryServices.map((service) => (
                              <Link
                                key={service._id}
                                href={`/services/${service.slug}`}
                                className="block rounded-xl px-3 py-2 text-sm text-slate-600 transition hover:bg-white hover:text-[var(--brand-700)]"
                              >
                                {service.title}
                              </Link>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <Link key={link.href} href={link.href} className="nav-link">
                {link.label}
              </Link>
            ),
          )}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={`tel:${site?.phoneRaw || "+919463445566"}`}
            className="inline-flex h-11 items-center gap-2 rounded-full border border-black/5 px-4 text-sm font-semibold text-slate-700 transition hover:border-[var(--brand-300)] hover:text-[var(--brand-700)]"
          >
            <Phone className="h-4 w-4" />
            Call Us
          </a>
          <Link href="/contact" className="btn-primary">
            Get Proposal
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-black/5 bg-white text-slate-700 lg:hidden"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div
        className={cn(
          "overflow-hidden border-t border-black/5 bg-white transition-[max-height] duration-300 lg:hidden",
          open ? "max-h-[80vh]" : "max-h-0",
        )}
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-5 sm:px-6">
          {coreLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="text-base font-semibold text-slate-900"
            >
              {link.label}
            </Link>
          ))}

          <div className="rounded-[1.75rem] bg-slate-50 p-4">
            <p className="mb-3 text-xs uppercase tracking-[0.24em] text-slate-500">Popular Services</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {services.slice(0, 8).map((service) => (
                <Link
                  key={service._id}
                  href={`/services/${service.slug}`}
                  onClick={() => setOpen(false)}
                  className="rounded-xl bg-white px-3 py-2 text-sm text-slate-700 shadow-sm"
                >
                  {service.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
