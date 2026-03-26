"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  MapPin,
  Clock,
  Briefcase,
  Users,
  Heart,
  Zap,
  Rocket,
  Coffee,
  GraduationCap,
  Send,
  Sparkles,
  ChevronRight,
  Building2,
} from "lucide-react";
import { CTA } from "@/components/sections/cta";
import { PageHeader } from "@/components/layout/page-header";
import { getCareers } from "@/lib/api";
import type { CareerOpening } from "@/lib/types";

const perks = [
  {
    icon: Rocket,
    title: "Fast Growth",
    desc: "Rapid career progression with clear growth paths and mentorship from industry leaders.",
    accent: "from-orange-500 to-orange-400",
    bg: "from-orange-500/10 to-orange-400/5",
  },
  {
    icon: Users,
    title: "Great Team",
    desc: "Work alongside passionate designers, developers, and marketers who push each other forward.",
    accent: "from-blue-500 to-blue-400",
    bg: "from-blue-500/10 to-blue-400/5",
  },
  {
    icon: Heart,
    title: "Work-Life Balance",
    desc: "Flexible hours, 5-day work week, and a supportive culture that values your well-being.",
    accent: "from-pink-500 to-rose-400",
    bg: "from-pink-500/10 to-rose-400/5",
  },
  {
    icon: Briefcase,
    title: "Real Projects",
    desc: "Work on impactful projects for clients across India and beyond — no busywork.",
    accent: "from-amber-500 to-amber-400",
    bg: "from-amber-500/10 to-amber-400/5",
  },
  {
    icon: GraduationCap,
    title: "Learn & Grow",
    desc: "Access to workshops, courses, and conferences to keep your skills razor-sharp.",
    accent: "from-violet-500 to-purple-400",
    bg: "from-violet-500/10 to-purple-400/5",
  },
  {
    icon: Coffee,
    title: "Fun Culture",
    desc: "Team outings, celebrations, and a workspace that inspires creativity every day.",
    accent: "from-emerald-500 to-teal-400",
    bg: "from-emerald-500/10 to-teal-400/5",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function CareerPage() {
  const [openings, setOpenings] = useState<CareerOpening[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCareers()
      .then(setOpenings)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <PageHeader
        badge="We're Hiring"
        title1="Join Our"
        title2="Team."
        description="Be part of a creative, fast-growing digital marketing agency. We're always looking for talented people to help businesses grow digitally."
      />

      {/* ── Why Work With Us ──────────────────────────────── */}
      <section className="relative overflow-hidden bg-white py-24 md:py-32">
        {/* Background */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-25" />
        <div className="pointer-events-none absolute -top-32 right-0 h-[500px] w-[500px] rounded-full bg-orange-500/[0.04] blur-[100px]" />
        <div className="pointer-events-none absolute -bottom-32 -left-20 h-[400px] w-[400px] rounded-full bg-orange-400/[0.05] blur-[80px]" />

        <div className="container relative z-10 mx-auto max-w-7xl px-4">
          <motion.div
            className="mb-16 text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={stagger}
          >
            <motion.span
              variants={fadeUp}
              custom={0}
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-orange-100 bg-orange-50 px-5 py-2.5 text-xs font-black uppercase tracking-[0.2em] text-[#FF6600]"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Why Creative Monk?
            </motion.span>
            <motion.h2
              variants={fadeUp}
              custom={1}
              className="text-4xl font-black md:text-5xl lg:text-6xl"
              style={{ fontFamily: "var(--font-poppins)" }}
            >
              Why Work <span className="text-[#FF6600]">With Us</span>
            </motion.h2>
            <motion.p
              variants={fadeUp}
              custom={2}
              className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-gray-500"
            >
              We believe great work comes from great people. Here&apos;s what
              makes Creative Monk a place you&apos;ll love.
            </motion.p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 md:gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={stagger}
          >
            {perks.map((perk, i) => (
              <motion.div
                key={perk.title}
                variants={fadeUp}
                custom={i}
                className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-8 transition-all duration-500 hover:-translate-y-1 hover:border-gray-200/80 hover:shadow-xl hover:shadow-gray-900/[0.04]"
              >
                {/* Gradient orb */}
                <div
                  className={`pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full bg-gradient-to-br ${perk.bg} opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100`}
                />

                <div
                  className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${perk.accent} text-white shadow-lg`}
                >
                  <perk.icon className="h-5 w-5" />
                </div>
                <h3
                  className="mb-2 text-lg font-bold text-gray-900"
                  style={{ fontFamily: "var(--font-poppins)" }}
                >
                  {perk.title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-500">
                  {perk.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Open Positions ────────────────────────────────── */}
      <section className="relative overflow-hidden py-24 md:py-32">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#fafafa] via-white to-[#fafafa]" />
        <div className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-b from-orange-500/[0.03] to-transparent blur-[100px]" />

        <div className="container relative z-10 mx-auto max-w-6xl px-4">
          <motion.div
            className="mb-16 text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={stagger}
          >
            <motion.span
              variants={fadeUp}
              custom={0}
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-orange-100 bg-white px-5 py-2.5 text-xs font-black uppercase tracking-[0.2em] text-[#FF6600] shadow-sm"
            >
              <Briefcase className="h-3.5 w-3.5" />
              Open Positions
            </motion.span>
            <motion.h2
              variants={fadeUp}
              custom={1}
              className="text-4xl font-black md:text-5xl lg:text-6xl"
              style={{ fontFamily: "var(--font-poppins)" }}
            >
              Current <span className="text-[#FF6600]">Openings</span>
            </motion.h2>
            <motion.p
              variants={fadeUp}
              custom={2}
              className="mx-auto mt-5 max-w-2xl text-lg text-gray-500"
            >
              Don&apos;t see a role that fits? Send your resume to{" "}
              <a
                href="mailto:info@thecreativemonk.in"
                className="font-semibold text-[#FF6600] underline decoration-orange-200 underline-offset-2 transition-colors hover:decoration-orange-400"
              >
                info@thecreativemonk.in
              </a>
            </motion.p>
          </motion.div>

          {/* Job Cards */}
          {loading ? (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-2xl border border-gray-100 bg-white p-7"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="mb-2 h-5 w-40 rounded-lg bg-gray-100" />
                      <div className="h-3 w-24 rounded bg-gray-100" />
                    </div>
                    <div className="h-6 w-20 rounded-full bg-gray-100" />
                  </div>
                  <div className="mt-5 space-y-2">
                    <div className="h-3 w-full rounded bg-gray-50" />
                    <div className="h-3 w-3/4 rounded bg-gray-50" />
                  </div>
                  <div className="mt-5 flex gap-4">
                    <div className="h-3 w-28 rounded bg-gray-50" />
                    <div className="h-3 w-20 rounded bg-gray-50" />
                  </div>
                </div>
              ))}
            </div>
          ) : openings.length > 0 ? (
            <motion.div
              className="grid grid-cols-1 gap-5 md:grid-cols-2"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={stagger}
            >
              {openings.map((job, i) => {
                const email = job.applyEmail || "info@thecreativemonk.in";
                return (
                  <motion.div
                    key={job._id}
                    variants={fadeUp}
                    custom={i}
                    className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all duration-500 hover:-translate-y-1 hover:border-orange-100/60 hover:shadow-xl hover:shadow-orange-500/[0.06]"
                  >
                    {/* Top accent */}
                    <div className="h-0.5 bg-gradient-to-r from-transparent via-[#FF6600]/25 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                    {/* Hover glow */}
                    <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-orange-500/0 transition-all duration-700 group-hover:bg-orange-500/[0.04] group-hover:blur-3xl" />

                    <div className="relative z-10 p-7">
                      {/* Header */}
                      <div className="mb-4 flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <h3
                            className="text-lg font-bold text-gray-900 transition-colors duration-300 group-hover:text-[#FF6600]"
                            style={{ fontFamily: "var(--font-poppins)" }}
                          >
                            {job.title}
                          </h3>
                          <div className="mt-1.5 flex items-center gap-2">
                            <Building2 className="h-3 w-3 text-[#FF6600]/60" />
                            <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#FF6600]/80">
                              {job.department}
                            </span>
                          </div>
                        </div>
                        <span className="shrink-0 rounded-full border border-orange-100 bg-orange-50 px-3.5 py-1.5 text-[10px] font-black uppercase tracking-[0.1em] text-[#FF6600]">
                          {job.type}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="mb-5 text-sm leading-relaxed text-gray-500">
                        {job.description}
                      </p>

                      {/* Skills tags */}
                      {job.skills && job.skills.length > 0 && (
                        <div className="mb-5 flex flex-wrap gap-1.5">
                          {job.skills.map((skill) => (
                            <span
                              key={skill}
                              className="rounded-lg border border-gray-100 bg-gray-50 px-2.5 py-1 text-[11px] font-medium text-gray-500"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Meta */}
                      <div className="mb-5 flex flex-wrap gap-4 text-xs text-gray-400">
                        <span className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5" /> {job.location}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" /> {job.experience}
                        </span>
                      </div>

                      {/* Apply */}
                      <a
                        href={`mailto:${email}?subject=Application for ${job.title}`}
                        className="inline-flex items-center gap-2 rounded-xl bg-gray-50 px-5 py-2.5 text-sm font-bold text-[#FF6600] ring-1 ring-gray-100 transition-all duration-300 hover:bg-[#FF6600] hover:text-white hover:shadow-lg hover:shadow-orange-500/20 hover:ring-[#FF6600]"
                        style={{ fontFamily: "var(--font-poppins)" }}
                      >
                        Apply Now
                        <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                      </a>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            /* No openings state */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mx-auto max-w-lg rounded-2xl border border-gray-100 bg-white p-12 text-center shadow-sm"
            >
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50">
                <Briefcase className="h-7 w-7 text-[#FF6600]" />
              </div>
              <h3
                className="text-xl font-bold text-gray-900"
                style={{ fontFamily: "var(--font-poppins)" }}
              >
                No Open Positions Right Now
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-gray-500">
                We don&apos;t have any openings at the moment, but we&apos;re
                always looking for talented people. Send your resume and
                we&apos;ll keep you in mind!
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* ── General Application CTA ──────────────────────── */}
      <section className="relative overflow-hidden bg-white py-24 md:py-28">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(255,102,0,0.04),transparent)]" />

        <div className="container relative z-10 mx-auto max-w-4xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-hidden rounded-[2.5rem] border border-gray-100 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 p-10 text-center shadow-2xl md:p-16"
          >
            {/* Decorative */}
            <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-[#FF6600]/10 blur-[80px]" />
            <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-orange-500/8 blur-[80px]" />
            <div className="pointer-events-none absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#FF6600]/30 to-transparent" />

            <div className="relative z-10">
              <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-orange-300 backdrop-blur-sm">
                <Send className="h-3 w-3" />
                Open Application
              </span>

              <h2
                className="mt-4 text-3xl font-black leading-tight text-white md:text-4xl lg:text-5xl"
                style={{ fontFamily: "var(--font-poppins)" }}
              >
                Don&apos;t See Your{" "}
                <span className="text-[#FF6600]">Role?</span>
              </h2>

              <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-gray-400 md:text-lg">
                We&apos;re always looking for talented people. Send us your
                resume and portfolio, and we&apos;ll reach out when the right
                opportunity comes up.
              </p>

              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <a
                  href="mailto:info@thecreativemonk.in?subject=General Application - Creative Monk"
                  className="group inline-flex items-center gap-2.5 rounded-2xl bg-[#FF6600] px-8 py-4 text-base font-bold text-white shadow-lg shadow-orange-500/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#e55500] hover:shadow-xl hover:shadow-orange-500/30"
                  style={{ fontFamily: "var(--font-poppins)" }}
                >
                  Send Your Resume
                  <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </a>
              </div>

              <p className="mt-6 text-xs text-gray-500">
                Email us at{" "}
                <a
                  href="mailto:info@thecreativemonk.in"
                  className="font-semibold text-orange-400 hover:text-orange-300"
                >
                  info@thecreativemonk.in
                </a>
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <CTA />
    </>
  );
}
