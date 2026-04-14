"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { adminApi } from "@/lib/api";
import type { DashboardStats } from "@/lib/types";
import {
  LayoutTemplate,
  Briefcase,
  FileText,
  Users,
  Star,
  UserPlus,
  MessageSquare,
  BellRing,
  Settings,
  ArrowRight,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("creative-monk-admin-token");
    if (!token) return;

    adminApi
      .getStats(token)
      .then(setStats)
      .catch(() => null)
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    {
      label: "Services",
      value: stats?.services ?? "-",
      icon: LayoutTemplate,
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      label: "Case Studies",
      value: stats?.caseStudies ?? "-",
      icon: Briefcase,
      color: "text-indigo-500",
      bg: "bg-indigo-50",
    },
    {
      label: "Blogs",
      value: stats?.blogs ?? "-",
      icon: FileText,
      color: "text-purple-500",
      bg: "bg-purple-50",
    },
    {
      label: "Clients",
      value: stats?.clients ?? "-",
      icon: Users,
      color: "text-pink-500",
      bg: "bg-pink-50",
    },
    {
      label: "Testimonials",
      value: stats?.testimonials ?? "-",
      icon: Star,
      color: "text-amber-500",
      bg: "bg-amber-50",
    },
    {
      label: "Open Careers",
      value: stats?.careers ?? "-",
      icon: UserPlus,
      color: "text-emerald-500",
      bg: "bg-emerald-50",
    },
    {
      label: "Total Enquiries",
      value: stats?.enquiries ?? "-",
      icon: MessageSquare,
      color: "text-cyan-500",
      bg: "bg-cyan-50",
    },
    {
      label: "New Enquiries",
      value: stats?.newEnquiries ?? "-",
      icon: BellRing,
      color: "text-[#FF6600]",
      bg: "bg-orange-50",
    },
  ];

  return (
    <>
      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <article
            key={card.label}
            className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${card.bg}`}>
                <card.icon className={`w-5 h-5 ${card.color}`} />
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500">
                {card.label}
              </p>
              {loading ? (
                <div className="h-10 w-16 bg-gray-100 animate-pulse mt-2 rounded"></div>
              ) : (
                <p
                  className="mt-1 text-3xl font-black text-gray-900"
                  style={{ fontFamily: "var(--font-outfit)" }}
                >
                  {card.value}
                </p>
              )}
            </div>

            <div
              className={`absolute bottom-0 left-0 h-1 w-full scale-x-0 ${card.bg.replace("50", "500")} transition-transform duration-300 origin-left group-hover:scale-x-100`}
            />
          </article>
        ))}
      </section>

      <section className="mt-8">
        <div className="flex items-center gap-2 mb-6">
          <Settings className="w-5 h-5 text-gray-400" />
          <h2
            className="text-xl font-bold text-gray-900"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            Quick Actions
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              href: "/admin/dashboard/services",
              label: "Manage Services",
              icon: LayoutTemplate,
            },
            {
              href: "/admin/dashboard/case-studies",
              label: "Manage Case Studies",
              icon: Briefcase,
            },
            {
              href: "/admin/dashboard/portfolio",
              label: "Manage Portfolio",
              icon: Briefcase,
            },
            {
              href: "/admin/dashboard/blogs",
              label: "Manage Blogs",
              icon: FileText,
            },
            {
              href: "/admin/dashboard/enquiries",
              label: "Review Enquiries",
              icon: MessageSquare,
            },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-white shadow-sm transition-all duration-200 hover:border-orange-200 hover:bg-orange-50/50 hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-50 text-gray-500 rounded-lg group-hover:bg-orange-100 group-hover:text-orange-600 transition-colors">
                  <item.icon className="w-4 h-4" />
                </div>
                <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900">
                  {item.label}
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-orange-500 transition-colors" />
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
