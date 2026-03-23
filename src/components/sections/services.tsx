"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Globe2,
  Layers3,
  Palette,
  Sparkles,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { getServiceCategories, getServices } from "@/lib/api";
import type { Service, ServiceCategory } from "@/lib/types";

type CategoryTheme = {
  accent: string;
  glow: string;
  badge: string;
  iconWrap: string;
  chip: string;
  stat: string;
};

const categoryThemes: CategoryTheme[] = [
  {
    accent: "from-orange-500/[0.18] via-orange-100/75 to-white",
    glow: "bg-orange-400/20",
    badge: "border-orange-200/80 bg-orange-50/90 text-orange-700",
    iconWrap:
      "bg-gradient-to-br from-orange-500 to-orange-400 text-white shadow-lg shadow-orange-500/25",
    chip: "border-orange-200/70 bg-white/80 hover:border-orange-300 hover:bg-orange-50/80",
    stat: "text-orange-600",
  },
  {
    accent: "from-amber-500/[0.18] via-amber-100/75 to-white",
    glow: "bg-amber-400/20",
    badge: "border-amber-200/80 bg-amber-50/90 text-amber-700",
    iconWrap:
      "bg-gradient-to-br from-amber-500 to-orange-400 text-white shadow-lg shadow-amber-500/25",
    chip: "border-amber-200/70 bg-white/80 hover:border-amber-300 hover:bg-amber-50/80",
    stat: "text-amber-700",
  },
  {
    accent: "from-slate-900/10 via-slate-100/80 to-white",
    glow: "bg-slate-400/20",
    badge: "border-slate-200 bg-slate-50/90 text-slate-700",
    iconWrap:
      "bg-gradient-to-br from-slate-900 to-slate-700 text-white shadow-lg shadow-slate-900/20",
    chip: "border-slate-200/80 bg-white/80 hover:border-slate-300 hover:bg-slate-50/80",
    stat: "text-slate-700",
  },
  {
    accent: "from-orange-500/[0.14] via-rose-50/80 to-white",
    glow: "bg-rose-300/20",
    badge: "border-orange-100/80 bg-white/90 text-slate-700",
    iconWrap:
      "bg-gradient-to-br from-orange-500 to-slate-900 text-white shadow-lg shadow-orange-500/20",
    chip: "border-orange-100/80 bg-white/80 hover:border-orange-200 hover:bg-orange-50/70",
    stat: "text-slate-900",
  },
];

function getCategoryMeta(slug: string, index: number) {
  const theme = categoryThemes[index % categoryThemes.length];

  switch (slug?.toLowerCase()) {
    case "website-designing-development":
      return {
        ...theme,
        Icon: Globe2,
        eyebrow: "Build",
        focus: "Fast, scalable web experiences",
      };
    case "digital-marketing":
      return {
        ...theme,
        Icon: BarChart3,
        eyebrow: "Scale",
        focus: "Campaigns tuned for growth",
      };
    case "graphic-designing":
      return {
        ...theme,
        Icon: Palette,
        eyebrow: "Shape",
        focus: "Brand visuals that stand out",
      };
    default:
      return {
        ...theme,
        Icon: Layers3,
        eyebrow: "Craft",
        focus: "Creative systems with business intent",
      };
  }
}

function MetricCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
        {label}
      </p>
      <p
        className="mt-3 text-3xl font-black tracking-tight text-white"
        style={{ fontFamily: "var(--font-outfit)" }}
      >
        {value}
      </p>
    </div>
  );
}

function ValuePill({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-4 rounded-[1.25rem] border border-white/10 bg-white/5 px-4 py-4 backdrop-blur-sm">
      <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-white/10 text-orange-300">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p
          className="text-base font-bold text-white"
          style={{ fontFamily: "var(--font-outfit)" }}
        >
          {title}
        </p>
        <p className="mt-1 text-sm leading-6 text-slate-300">{description}</p>
      </div>
    </div>
  );
}

export function Services() {
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [allServices, setAllServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [catData, servData] = await Promise.all([
          getServiceCategories(),
          getServices(),
        ]);
        setCategories(catData);
        setAllServices(servData);
      } catch (error) {
        console.error("Failed to fetch services:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (!loading && categories.length === 0) {
    return null;
  }

  const totalServices = allServices.length;
  const totalCategories = categories.length;

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#fff8f3_45%,#f8fafc_100%)] py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,102,0,0.12),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(15,23,42,0.08),transparent_28%)]" />
      <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(to_right,#f97316_1px,transparent_1px),linear-gradient(to_bottom,#f97316_1px,transparent_1px)] [background-size:72px_72px]" />
      <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-orange-200/30 blur-3xl" />

      <div className="container relative z-10">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)] lg:items-end">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 rounded-full border border-orange-200/70 bg-white/80 px-4 py-2 shadow-sm shadow-orange-100/60 backdrop-blur-sm"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-500/10 text-[#FF6600]">
                <Sparkles className="h-3.5 w-3.5" />
              </span>
              <span className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-700">
                What We Offer
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08 }}
              className="mt-6 text-4xl font-black leading-[1.05] tracking-tight text-slate-950 md:text-5xl lg:text-6xl"
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              Services designed to{" "}
              <span className="bg-gradient-to-r from-[#FF6600] via-orange-500 to-amber-500 bg-clip-text text-transparent">
                look sharp, convert faster, and scale cleanly.
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.16 }}
              className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 md:text-xl"
            >
              We bring strategy, design, development, and marketing together so
              every touchpoint feels premium and performs like it should.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.24 }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <div className="rounded-full border border-white/80 bg-white/[0.85] px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm shadow-slate-200/50 backdrop-blur-sm">
                {loading
                  ? "Loading capabilities..."
                  : `${String(totalCategories).padStart(2, "0")} strategic categories`}
              </div>
              <div className="rounded-full border border-white/80 bg-white/[0.85] px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm shadow-slate-200/50 backdrop-blur-sm">
                {loading
                  ? "Building the list..."
                  : `${String(totalServices).padStart(2, "0")} specialist services`}
              </div>
              <div className="rounded-full border border-orange-100 bg-orange-50/80 px-5 py-3 text-sm font-semibold text-[#FF6600] shadow-sm shadow-orange-100/50 backdrop-blur-sm">
                One partner from concept to growth
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.18 }}
            className="relative overflow-hidden rounded-[2rem] border border-slate-900/10 bg-slate-950 p-8 text-white shadow-[0_40px_120px_-60px_rgba(15,23,42,0.85)]"
          >
            <div className="absolute -right-14 top-0 h-40 w-40 rounded-full bg-orange-500/20 blur-3xl" />
            <div className="absolute -left-10 bottom-0 h-32 w-32 rounded-full bg-white/10 blur-3xl" />

            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-orange-300">
                <Zap className="h-3.5 w-3.5" />
                Growth Stack
              </div>

              <h3
                className="mt-5 max-w-md text-3xl font-black leading-tight text-white"
                style={{ fontFamily: "var(--font-outfit)" }}
              >
                A tighter blend of creative direction and execution.
              </h3>
              <p className="mt-4 max-w-lg text-sm leading-7 text-slate-300">
                Every offering is shaped to help the brand feel more credible,
                the user journey feel more deliberate, and the outcome feel more
                measurable.
              </p>

              <div className="mt-8 grid grid-cols-2 gap-4">
                <MetricCard
                  label="Categories"
                  value={loading ? "--" : String(totalCategories).padStart(2, "0")}
                />
                <MetricCard
                  label="Services"
                  value={loading ? "--" : String(totalServices).padStart(2, "0")}
                />
              </div>

              <div className="mt-5 space-y-3">
                <ValuePill
                  icon={Globe2}
                  title="Brand to browser consistency"
                  description="Interfaces, messaging, and interactions are shaped to feel like one system."
                />
                <ValuePill
                  icon={BarChart3}
                  title="Performance-minded delivery"
                  description="Growth work is supported by structure, speed, and a cleaner conversion path."
                />
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="h-[430px] rounded-[2rem] border border-white/70 bg-white/80 animate-pulse shadow-[0_24px_80px_-50px_rgba(15,23,42,0.25)]"
                />
              ))
            : categories.map((category, index) => {
                const meta = getCategoryMeta(category.slug, index);
                const subServices = allServices
                  .filter((service) => service.category === category.slug)
                  .sort((a, b) => a.order - b.order);
                const featuredServices = subServices.slice(0, 4);
                const Icon = meta.Icon;

                return (
                  <motion.article
                    key={category._id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ delay: index * 0.12 }}
                    className="group relative flex"
                  >
                    <div className="relative flex h-full w-full flex-col overflow-hidden rounded-[2rem] border border-white/80 bg-white/75 p-7 shadow-[0_28px_90px_-55px_rgba(15,23,42,0.28)] backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_40px_120px_-55px_rgba(255,102,0,0.28)]">
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${meta.accent}`}
                      />
                      <div
                        className={`absolute -right-10 top-14 h-32 w-32 rounded-full ${meta.glow} blur-3xl transition-transform duration-500 group-hover:scale-125`}
                      />
                      <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />

                      <div className="relative z-10 flex h-full flex-col">
                        <div className="flex items-start justify-between gap-4">
                          <div
                            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] ${meta.badge}`}
                          >
                            <Sparkles className="h-3.5 w-3.5" />
                            {meta.eyebrow}
                          </div>
                          <span className="text-sm font-bold tracking-[0.26em] text-slate-300">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                        </div>

                        <div className="mt-7 flex items-center justify-between gap-4">
                          <div
                            className={`flex h-16 w-16 items-center justify-center rounded-[1.35rem] ${meta.iconWrap}`}
                          >
                            <Icon className="h-7 w-7" />
                          </div>
                          <div className="rounded-[1.35rem] border border-white/80 bg-white/75 px-4 py-3 text-right shadow-sm shadow-slate-200/50">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                              Services
                            </p>
                            <p
                              className={`mt-1 text-2xl font-black tracking-tight ${meta.stat}`}
                              style={{ fontFamily: "var(--font-outfit)" }}
                            >
                              {String(subServices.length).padStart(2, "0")}
                            </p>
                          </div>
                        </div>

                        <h3
                          className="mt-8 text-3xl font-black leading-tight text-slate-950"
                          style={{ fontFamily: "var(--font-outfit)" }}
                        >
                          {category.title}
                        </h3>
                        <p className="mt-4 text-base leading-7 text-slate-600">
                          {category.description}
                        </p>

                        <div className="mt-7">
                          <div className="mb-4 flex items-center justify-between gap-3">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                              Popular capabilities
                            </p>
                            {subServices.length > featuredServices.length ? (
                              <span className="rounded-full border border-white/80 bg-white/70 px-3 py-1 text-xs font-semibold text-slate-500">
                                +{subServices.length - featuredServices.length} more
                              </span>
                            ) : null}
                          </div>

                          <div className="grid gap-3 sm:grid-cols-2">
                            {featuredServices.map((service) => (
                              <Link
                                key={service._id}
                                href={`/services/${service.slug}`}
                                className={`group/link flex min-h-[76px] items-center justify-between gap-3 rounded-[1.25rem] border px-4 py-4 text-sm font-semibold text-slate-700 transition-all duration-300 ${meta.chip}`}
                              >
                                <span className="line-clamp-2">
                                  {service.shortTitle || service.title}
                                </span>
                                <ArrowRight className="h-4 w-4 flex-shrink-0 text-slate-400 transition-transform duration-300 group-hover/link:translate-x-1 group-hover/link:text-[#FF6600]" />
                              </Link>
                            ))}
                          </div>
                        </div>

                        <div className="mt-auto flex items-end justify-between gap-4 border-t border-slate-200/70 pt-7">
                          <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                              Best for
                            </p>
                            <p className="mt-2 text-sm font-semibold text-slate-700">
                              {meta.focus}
                            </p>
                          </div>

                          <Link
                            href="/services"
                            className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2.5 text-sm font-bold text-white transition-all duration-300 hover:bg-[#FF6600]"
                          >
                            Explore
                            <ArrowUpRight className="h-4 w-4" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.25 }}
          className="mt-16 flex flex-col items-center justify-between gap-4 rounded-[2rem] border border-white/80 bg-white/80 px-6 py-6 text-center shadow-[0_24px_80px_-50px_rgba(15,23,42,0.22)] backdrop-blur-sm md:flex-row md:text-left"
        >
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#FF6600]">
              Full Capability View
            </p>
            <h3
              className="mt-2 text-2xl font-black text-slate-950"
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              Need the complete service lineup?
            </h3>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              Browse every specialization and find the right mix for your next
              growth move.
            </p>
          </div>

          <Link
            href="/services"
            className="inline-flex items-center gap-3 rounded-full bg-[#FF6600] px-7 py-4 text-sm font-bold text-white shadow-xl shadow-orange-500/20 transition-all duration-300 hover:-translate-y-1 hover:bg-orange-600"
          >
            View All Services
            <ArrowRight className="h-5 w-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
