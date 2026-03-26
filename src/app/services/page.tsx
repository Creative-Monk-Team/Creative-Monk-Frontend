"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Sparkles, CheckCircle2 } from "lucide-react";
import { CTA } from "@/components/sections/cta";
import { PageHeader } from "@/components/layout/page-header";
import { useEffect, useState } from "react";
import { getIcon } from "@/lib/icon-utils";
import { getServices } from "@/lib/api";
import type { Service } from "@/lib/types";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const cardThemes = [
  {
    gradient: "from-orange-500/[0.14] via-orange-50/60 to-white",
    glow: "bg-orange-400/15",
    icon: "bg-gradient-to-br from-orange-500 to-orange-400 shadow-orange-500/25",
    tag: "border-orange-200/70 bg-orange-50/80 text-orange-700",
    chip: "border-orange-200/60 bg-white/80 hover:border-orange-300 hover:bg-orange-50/70",
  },
  {
    gradient: "from-blue-500/[0.12] via-blue-50/60 to-white",
    glow: "bg-blue-400/15",
    icon: "bg-gradient-to-br from-blue-600 to-blue-400 shadow-blue-500/25",
    tag: "border-blue-200/70 bg-blue-50/80 text-blue-700",
    chip: "border-blue-200/60 bg-white/80 hover:border-blue-300 hover:bg-blue-50/70",
  },
  {
    gradient: "from-violet-500/[0.12] via-violet-50/60 to-white",
    glow: "bg-violet-400/15",
    icon: "bg-gradient-to-br from-violet-600 to-purple-400 shadow-violet-500/25",
    tag: "border-violet-200/70 bg-violet-50/80 text-violet-700",
    chip: "border-violet-200/60 bg-white/80 hover:border-violet-300 hover:bg-violet-50/70",
  },
  {
    gradient: "from-emerald-500/[0.12] via-emerald-50/60 to-white",
    glow: "bg-emerald-400/15",
    icon: "bg-gradient-to-br from-emerald-600 to-teal-400 shadow-emerald-500/25",
    tag: "border-emerald-200/70 bg-emerald-50/80 text-emerald-700",
    chip: "border-emerald-200/60 bg-white/80 hover:border-emerald-300 hover:bg-emerald-50/70",
  },
  {
    gradient: "from-rose-500/[0.12] via-rose-50/60 to-white",
    glow: "bg-rose-400/15",
    icon: "bg-gradient-to-br from-rose-500 to-pink-400 shadow-rose-500/25",
    tag: "border-rose-200/70 bg-rose-50/80 text-rose-700",
    chip: "border-rose-200/60 bg-white/80 hover:border-rose-300 hover:bg-rose-50/70",
  },
  {
    gradient: "from-amber-500/[0.14] via-amber-50/60 to-white",
    glow: "bg-amber-400/15",
    icon: "bg-gradient-to-br from-amber-500 to-orange-400 shadow-amber-500/25",
    tag: "border-amber-200/70 bg-amber-50/80 text-amber-700",
    chip: "border-amber-200/60 bg-white/80 hover:border-amber-300 hover:bg-amber-50/70",
  },
  {
    gradient: "from-cyan-500/[0.12] via-cyan-50/60 to-white",
    glow: "bg-cyan-400/15",
    icon: "bg-gradient-to-br from-cyan-600 to-blue-400 shadow-cyan-500/25",
    tag: "border-cyan-200/70 bg-cyan-50/80 text-cyan-700",
    chip: "border-cyan-200/60 bg-white/80 hover:border-cyan-300 hover:bg-cyan-50/70",
  },
  {
    gradient: "from-slate-900/[0.06] via-slate-50/60 to-white",
    glow: "bg-slate-400/15",
    icon: "bg-gradient-to-br from-slate-900 to-slate-700 shadow-slate-900/20",
    tag: "border-slate-200/70 bg-slate-50/80 text-slate-700",
    chip: "border-slate-200/60 bg-white/80 hover:border-slate-300 hover:bg-slate-50/70",
  },
  {
    gradient: "from-pink-500/[0.12] via-pink-50/60 to-white",
    glow: "bg-pink-400/15",
    icon: "bg-gradient-to-br from-pink-500 to-rose-400 shadow-pink-500/25",
    tag: "border-pink-200/70 bg-pink-50/80 text-pink-700",
    chip: "border-pink-200/60 bg-white/80 hover:border-pink-300 hover:bg-pink-50/70",
  },
];

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getServices()
      .then(setServices)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <PageHeader
        badge="Capabilities & Expertise"
        title1="Digital"
        title2="Solutions."
        description={
          <>
            We don&apos;t just execute campaigns; we engineer{" "}
            <strong>digital ecosystems</strong> designed for relentless growth,
            massive ROI, and sustainable brand dominance.
          </>
        }
        features={["Performance First", "Data Driven", "ROI Focused"]}
      />

      {/* ── Services Grid ──────────────────────────────── */}
      <section className="relative overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#fff9f5_40%,#f8fafc_100%)] py-20 md:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,102,0,0.1),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(15,23,42,0.06),transparent_30%)]" />
        <div className="absolute inset-0 opacity-[0.05] [background-image:linear-gradient(to_right,#f97316_1px,transparent_1px),linear-gradient(to_bottom,#f97316_1px,transparent_1px)] [background-size:64px_64px]" />
        <div className="pointer-events-none absolute left-1/2 top-0 h-48 w-48 -translate-x-1/2 rounded-full bg-orange-200/25 blur-3xl" />

        <div className="container relative z-10 mx-auto max-w-7xl px-4">
          {/* Section Header */}
          <motion.div
            className="mb-12 text-center md:mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={stagger}
          >
            <motion.span
              variants={fadeUp}
              custom={0}
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-orange-200/70 bg-white/80 px-5 py-2.5 text-xs font-black uppercase tracking-[0.2em] text-[#FF6600] shadow-sm shadow-orange-100/50 backdrop-blur-sm"
            >
              <Sparkles className="h-3.5 w-3.5" />
              What We Deliver
            </motion.span>
            <motion.h2
              variants={fadeUp}
              custom={1}
              className="text-3xl font-black tracking-tight text-slate-950 md:text-5xl lg:text-6xl"
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              Services Built for{" "}
              <span className="bg-gradient-to-r from-[#FF6600] via-orange-500 to-amber-500 bg-clip-text text-transparent">
                Growth
              </span>
            </motion.h2>
            <motion.p
              variants={fadeUp}
              custom={2}
              className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-600 md:text-lg"
            >
              From strategy to execution — everything your brand needs to
              dominate digital.
            </motion.p>
          </motion.div>

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 md:gap-7">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-[380px] animate-pulse rounded-[2rem] border border-white/70 bg-white/70 shadow-lg"
                />
              ))}
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 md:gap-7"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.05 }}
              variants={stagger}
            >
              {services.map((service, index) => {
                const ServiceIcon = getIcon(service.icon) || (() => null);
                const theme = cardThemes[index % cardThemes.length];

                return (
                  <motion.div key={service.slug} variants={fadeUp} custom={index}>
                    <Link
                      href={`/services/${service.slug}`}
                      className="group relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-white/80 bg-white/70 p-6 shadow-[0_24px_80px_-50px_rgba(15,23,42,0.2)] backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_32px_100px_-50px_rgba(255,102,0,0.22)] md:p-7"
                    >
                      {/* Background gradient */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient}`} />
                      {/* Hover glow */}
                      <div className={`pointer-events-none absolute -right-10 top-10 h-32 w-32 rounded-full ${theme.glow} blur-3xl transition-transform duration-500 group-hover:scale-150`} />
                      {/* Top shine line */}
                      <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />

                      <div className="relative z-10 flex h-full flex-col">
                        {/* Header: icon + number */}
                        <div className="flex items-start justify-between gap-3">
                          <div className={`flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-lg ${theme.icon} transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3`}>
                            <ServiceIcon className="h-6 w-6" />
                          </div>
                          <span className="text-sm font-bold tracking-[0.2em] text-slate-300/60">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                        </div>

                        {/* Category tag */}
                        {service.category && (
                          <span className={`mt-5 inline-flex w-max items-center rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] ${theme.tag}`}>
                            {service.category}
                          </span>
                        )}

                        {/* Title */}
                        <h2
                          className="mt-3 text-xl font-black leading-tight text-slate-950 md:text-2xl"
                          style={{ fontFamily: "var(--font-outfit)" }}
                        >
                          {service.title}
                        </h2>

                        {/* Description */}
                        <p className="mt-3 text-sm leading-relaxed text-slate-600 line-clamp-2">
                          {service.shortDescription}
                        </p>

                        {/* Feature chips */}
                        <div className="mt-5 grid grid-cols-2 gap-2">
                          {service.features.slice(0, 4).map((f) => (
                            <div
                              key={f}
                              className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-[12px] font-semibold text-slate-600 transition-all duration-300 ${theme.chip}`}
                            >
                              <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-[#FF6600]/70" />
                              <span className="line-clamp-1">{f}</span>
                            </div>
                          ))}
                        </div>

                        {/* Footer */}
                        <div className="mt-auto flex items-center justify-between border-t border-slate-200/50 pt-5 mt-6">
                          <div>
                            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                              Capabilities
                            </p>
                            <p className="mt-0.5 text-sm font-bold text-slate-700">
                              {service.features.length} included
                            </p>
                          </div>
                          <span className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2.5 text-xs font-bold text-white transition-all duration-300 group-hover:bg-[#FF6600]">
                            Explore
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          )}

          {/* Bottom CTA bar */}
          {!loading && services.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mt-16 flex flex-col items-center justify-between gap-5 rounded-[2rem] border border-white/80 bg-white/80 px-7 py-7 shadow-[0_24px_80px_-50px_rgba(15,23,42,0.18)] backdrop-blur-sm md:flex-row md:px-10 md:py-8"
            >
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#FF6600]">
                  Need something custom?
                </p>
                <h3
                  className="mt-1.5 text-xl font-black text-slate-950 md:text-2xl"
                  style={{ fontFamily: "var(--font-outfit)" }}
                >
                  Let&apos;s build the right solution together.
                </h3>
              </div>
              <Link
                href="/contact"
                className="inline-flex shrink-0 items-center gap-2.5 rounded-full bg-[#FF6600] px-7 py-4 text-sm font-bold text-white shadow-xl shadow-orange-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-orange-600"
              >
                Get a Free Proposal
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          )}
        </div>
      </section>

      <CTA />
    </>
  );
}
