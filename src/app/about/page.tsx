"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Linkedin,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Target,
  Zap,
  TrendingUp,
  Sparkles,
  Award,
  Users2,
  Briefcase,
  Building,
} from "lucide-react";
import { CTA } from "@/components/sections/cta";
import { PageHeader } from "@/components/layout/page-header";
import { getTeam } from "@/lib/api";
import type { TeamMember } from "@/lib/types";

const milestones = [
  {
    year: "2019",
    event: "Creative Monk founded in Chandigarh",
    detail: "Started with a vision to transform digital marketing in the region",
  },
  {
    year: "2020",
    event: "Crossed 50 clients milestone",
    detail: "Rapid growth through word-of-mouth and exceptional results",
  },
  {
    year: "2021",
    event: "Expanded to full-service Digital Marketing",
    detail: "Added SEO, PPC, social media, and content marketing to our arsenal",
  },
  {
    year: "2022",
    event: "Moved to Sushma Infinium, Zirakpur",
    detail: "Upgraded to a premium office space to support our growing team",
  },
  {
    year: "2023",
    event: "250+ happy clients served across India",
    detail: "Expanded our reach nationally with clients in 15+ industries",
  },
  {
    year: "2024",
    event: "Launched advanced web development solutions",
    detail: "Next-gen tech stack with AI-powered marketing capabilities",
  },
];

const stats = [
  { value: "140+", label: "Projects Delivered", icon: Briefcase },
  { value: "5+", label: "Years Experience", icon: Award },
  { value: "180+", label: "Happy Clients", icon: Users2 },
  { value: "15+", label: "Industries Served", icon: Building },
];

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const socialIcons: Record<string, typeof Linkedin> = {
  linkedin: Linkedin,
  facebook: Facebook,
  instagram: Instagram,
  twitter: Twitter,
  youtube: Youtube,
};

const socialColors: Record<string, string> = {
  linkedin: "#0A66C2",
  facebook: "#1877F2",
  instagram: "#E4405F",
  twitter: "#1DA1F2",
  youtube: "#FF0000",
};

export default function AboutPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTeam()
      .then(setTeamMembers)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      {/* Hero */}
      <PageHeader
        badge="Who We Are"
        title1="About"
        title2="Creative Monk"
        description="We are a passionate team of designers, developers, and marketers helping businesses grow digitally since 2019."
      />

      {/* ── Mission ────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-white py-24 md:py-32">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-30" />
        <div className="pointer-events-none absolute -top-40 right-0 h-[600px] w-[600px] rounded-full bg-orange-500/[0.04] blur-[120px]" />
        <div className="pointer-events-none absolute -bottom-40 -left-20 h-[500px] w-[500px] rounded-full bg-orange-400/[0.06] blur-[100px]" />

        <div className="container relative z-10 mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
            {/* Left */}
            <motion.div
              className="flex flex-col justify-center lg:col-span-7"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={stagger}
            >
              <motion.span
                variants={fadeUp}
                custom={0}
                className="mb-8 inline-flex w-max items-center gap-2 rounded-full border border-orange-100 bg-orange-50 px-4 py-2 text-xs font-black uppercase tracking-widest text-[#FF6600]"
              >
                <img
                  src="/images/icon-logo.png"
                  alt="Monk Icon"
                  className="h-4 w-4 object-contain"
                />
                The Creative Monk Story
              </motion.span>

              <motion.h2
                variants={fadeUp}
                custom={1}
                className="mb-8 text-4xl font-black leading-[1.05] text-gray-900 md:text-5xl lg:text-[3.5rem]"
                style={{ fontFamily: "var(--font-poppins)" }}
              >
                We don&apos;t just market.
                <br />
                We{" "}
                <span className="relative inline-block text-[#FF6600]">
                  Build Legacies.
                  <svg
                    className="absolute -bottom-2 left-0 w-full"
                    viewBox="0 0 200 12"
                    fill="none"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M2 8.5C30 3 70 2 100 4.5C130 7 170 5 198 2.5"
                      stroke="#FF6600"
                      strokeWidth="3"
                      strokeLinecap="round"
                      opacity="0.3"
                    />
                  </svg>
                </span>
              </motion.h2>

              <motion.div
                variants={fadeUp}
                custom={2}
                className="space-y-6 text-lg leading-relaxed text-gray-600 md:text-xl"
              >
                <p>
                  The Creative Monk is a bespoke full-services digital agency in
                  Chandigarh. We are a team of enthusiastic young professionals
                  dedicated to building powerful online reputations that deliver
                  long-term value.
                </p>
                <p>
                  We don&apos;t just provide marketing; we offer a complete
                  synergy of visual design, technical expertise, and strategic
                  digital solutions. From ROI-driven campaigns to
                  high-performance web ecosystems, we ensure your brand stands
                  out in the crowd.
                </p>
              </motion.div>

              {/* Stats */}
              <motion.div
                variants={fadeUp}
                custom={3}
                className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6"
              >
                {stats.map((s) => (
                  <div
                    key={s.label}
                    className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-orange-100 hover:shadow-lg hover:shadow-orange-500/5"
                  >
                    <div className="pointer-events-none absolute -right-3 -top-3 h-16 w-16 rounded-full bg-orange-500/[0.06] transition-transform duration-500 group-hover:scale-150" />
                    <s.icon className="mb-3 h-5 w-5 text-[#FF6600] opacity-60" />
                    <p className="text-3xl font-black tracking-tight text-gray-900 md:text-4xl">
                      {s.value}
                    </p>
                    <p className="mt-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-gray-400">
                      {s.label}
                    </p>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right — Core Values */}
            <motion.div
              className="relative mt-10 lg:col-span-5 lg:mt-0"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="pointer-events-none absolute inset-0 scale-105 transform rounded-[2.5rem] bg-gradient-to-br from-[#FF6600] to-pink-500 opacity-20 blur-2xl transition-all duration-700" />
              <div className="relative z-10 flex h-full flex-col justify-center overflow-hidden rounded-[2.5rem] border border-white/10 bg-gray-950 p-10 shadow-2xl md:p-14">
                <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-[#FF6600]/10 blur-3xl" />

                <h3
                  className="mb-12 text-3xl font-black text-white md:text-4xl"
                  style={{ fontFamily: "var(--font-poppins)" }}
                >
                  Our Core Values
                </h3>

                <div className="relative z-20 space-y-10">
                  {[
                    {
                      icon: Target,
                      title: "Our Mission",
                      text: "To constantly strive to provide ROI-driven marketing strategies while educating our clients on every phase of their campaigns.",
                    },
                    {
                      icon: TrendingUp,
                      title: "Our Vision",
                      text: "Passion defines our company — when passion and technology work together, miracles happen.",
                    },
                    {
                      icon: Zap,
                      title: "Our Objective",
                      text: "Enhancing business value through innovative and economic Web, Marketing, and Graphic solutions.",
                    },
                  ].map((item) => (
                    <div
                      key={item.title}
                      className="group flex items-start gap-6"
                    >
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 transition-colors group-hover:bg-[#FF6600]/20">
                        <item.icon className="h-6 w-6 text-[#FF6600]" />
                      </div>
                      <div>
                        <h4
                          className="mb-2 text-xl font-bold text-white"
                          style={{ fontFamily: "var(--font-poppins)" }}
                        >
                          {item.title}
                        </h4>
                        <p className="text-sm leading-relaxed text-gray-400">
                          {item.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Team ───────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-28 md:py-36" id="team">
        {/* Layered background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#fafafa] via-white to-[#fafafa]" />
        <div className="pointer-events-none absolute left-1/2 top-0 h-[700px] w-[1000px] -translate-x-1/2 rounded-full bg-gradient-to-b from-orange-500/[0.04] to-transparent blur-[100px]" />
        <div className="pointer-events-none absolute -right-40 bottom-40 h-[400px] w-[400px] rounded-full bg-orange-400/[0.03] blur-[80px]" />
        <div className="pointer-events-none absolute -left-40 top-1/3 h-[400px] w-[400px] rounded-full bg-orange-300/[0.04] blur-[80px]" />

        <div className="container relative z-10 mx-auto max-w-7xl px-4">
          {/* Section Header */}
          <motion.div
            className="mb-20 text-center"
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
              <Users2 className="h-3.5 w-3.5" />
              Meet the Team
            </motion.span>
            <motion.h2
              variants={fadeUp}
              custom={1}
              className="text-4xl font-black md:text-5xl lg:text-6xl"
              style={{ fontFamily: "var(--font-poppins)" }}
            >
              The <span className="text-[#FF6600]">Minds</span> Behind
              <br className="hidden sm:block" /> Creative Monk
            </motion.h2>
            <motion.p
              variants={fadeUp}
              custom={2}
              className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-gray-500"
            >
              A passionate team of creators, strategists, and engineers building
              digital legacies together.
            </motion.p>
          </motion.div>

          {/* ── Founder Spotlight ──────────────────────────── */}
          <motion.div
            className="mb-20"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="relative mx-auto max-w-5xl">
              {/* Outer glow */}
              <div className="pointer-events-none absolute -inset-6 rounded-[3.5rem] bg-gradient-to-br from-[#FF6600]/12 via-orange-400/6 to-transparent blur-3xl" />

              <div className="relative overflow-hidden rounded-[2.5rem] border border-gray-100/80 bg-white shadow-xl">
                {/* Top gradient bar */}
                <div className="h-1.5 bg-gradient-to-r from-[#FF6600] via-orange-400 to-orange-300" />

                {/* Decorative blurs */}
                <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-orange-500/[0.04] blur-3xl" />
                <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-orange-400/[0.06] blur-3xl" />

                <div className="relative z-10 flex flex-col items-center gap-8 p-8 md:flex-row md:items-center md:gap-14 md:p-12 lg:p-16">
                  {/* Founder Avatar */}
                  <div className="relative shrink-0">
                    <div className="absolute -inset-3 rounded-[2.2rem] bg-gradient-to-br from-[#FF6600] to-orange-400 opacity-15 blur-xl" />
                    <div className="relative flex h-40 w-40 items-center justify-center rounded-[2rem] bg-[#FF6600] text-6xl font-black text-white shadow-2xl shadow-orange-500/25 md:h-48 md:w-48 md:text-7xl">
                      SS
                    </div>
                    <a
                      href="https://www.linkedin.com/in/sahil-sehgal-4a6573134/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute -bottom-3 -right-3 flex h-12 w-12 items-center justify-center rounded-2xl border-4 border-white bg-[#0A66C2] text-white shadow-lg transition-all hover:scale-110 hover:shadow-xl"
                      aria-label="LinkedIn of Sahil Sehgal"
                    >
                      <Linkedin className="h-5 w-5" />
                    </a>
                  </div>

                  {/* Founder Info */}
                  <div className="flex-1 text-center md:text-left">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-100 bg-orange-50 px-3.5 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-[#FF6600]">
                      <Sparkles className="h-3 w-3" />
                      Founder & Visionary
                    </span>
                    <h3
                      className="mt-4 text-3xl font-black leading-tight text-gray-900 md:text-4xl lg:text-5xl"
                      style={{ fontFamily: "var(--font-poppins)" }}
                    >
                      Sahil Sehgal
                    </h3>
                    <p className="mt-2 text-lg font-bold text-[#FF6600]">
                      Founder & CEO
                    </p>
                    <p className="mt-4 max-w-xl text-base leading-relaxed text-gray-500 md:text-lg">
                      Visionary leader in digital marketing. Sahil has helped
                      numerous businesses transform their online presence and
                      grow digitally.
                    </p>

                    {/* Founder mini-stats */}
                    <div className="mt-8 flex flex-wrap items-center justify-center gap-6 md:justify-start">
                      {[
                        { val: "5+", lbl: "Years Leading" },
                        { val: "250+", lbl: "Clients Served" },
                        { val: "15+", lbl: "Industries" },
                      ].map((s) => (
                        <div key={s.lbl} className="text-center md:text-left">
                          <p className="text-2xl font-black tracking-tight text-gray-900">
                            {s.val}
                          </p>
                          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">
                            {s.lbl}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── Team Grid Heading ─────────────────────────── */}
          <motion.div
            className="mb-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3
              className="text-2xl font-bold text-gray-900 md:text-3xl"
              style={{ fontFamily: "var(--font-poppins)" }}
            >
              Our Incredible <span className="text-[#FF6600]">Team</span>
            </h3>
            <div className="mx-auto mt-3 h-1 w-12 rounded-full bg-gradient-to-r from-[#FF6600] to-orange-400" />
          </motion.div>

          {/* ── Team Grid ─────────────────────────────────── */}
          {loading ? (
            <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 md:gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-[2rem] border border-gray-100 bg-white p-8"
                >
                  <div className="mx-auto mb-6 h-28 w-28 rounded-full bg-gray-100" />
                  <div className="mx-auto mb-3 h-5 w-36 rounded-lg bg-gray-100" />
                  <div className="mx-auto mb-4 h-3 w-24 rounded bg-gray-100" />
                  <div className="mx-auto h-3 w-full max-w-[200px] rounded bg-gray-50" />
                  <div className="mx-auto mt-2 h-3 w-full max-w-[160px] rounded bg-gray-50" />
                  <div className="mx-auto mt-5 flex justify-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-gray-100" />
                    <div className="h-8 w-8 rounded-lg bg-gray-100" />
                  </div>
                </div>
              ))}
            </div>
          ) : teamMembers.length > 0 ? (
            <motion.div
              className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 md:gap-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={stagger}
            >
              {teamMembers.map((member, i) => {
                const initials = getInitials(member.name);
                const activeSocials = member.social
                  ? Object.entries(member.social).filter(
                      ([, url]) => url && url.trim() !== ""
                    )
                  : [];

                return (
                  <motion.div
                    key={member._id}
                    variants={fadeUp}
                    custom={i}
                    className="group relative overflow-hidden rounded-[2rem] border border-gray-100 bg-white text-center shadow-sm transition-all duration-500 hover:-translate-y-2 hover:border-orange-100/60 hover:shadow-xl hover:shadow-orange-500/10"
                  >
                    {/* Top accent line */}
                    <div className="h-0.5 bg-gradient-to-r from-transparent via-[#FF6600]/30 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                    {/* Card glow */}
                    <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-orange-500/0 transition-all duration-700 group-hover:bg-orange-500/[0.05] group-hover:blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-orange-400/0 transition-all duration-700 group-hover:bg-orange-400/[0.04] group-hover:blur-2xl" />

                    <div className="relative z-10 p-8 pb-7">
                      {/* Avatar */}
                      <div className="relative mx-auto mb-6 w-max">
                        <div className="absolute -inset-2 rounded-full bg-gradient-to-br from-[#FF6600] to-orange-400 opacity-0 blur-lg transition-opacity duration-500 group-hover:opacity-20" />
                        {member.image ? (
                          <img
                            src={member.image}
                            alt={member.name}
                            className="relative h-28 w-28 rounded-full object-cover shadow-lg ring-4 ring-white transition-all duration-500 group-hover:shadow-xl group-hover:shadow-orange-500/15"
                          />
                        ) : (
                          <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-[#FF6600] to-orange-500 text-3xl font-black text-white shadow-lg ring-4 ring-white transition-all duration-500 group-hover:shadow-xl group-hover:shadow-orange-500/15">
                            {initials}
                          </div>
                        )}
                      </div>

                      {/* Name & Role */}
                      <h3
                        className="text-xl font-black text-gray-900 transition-colors duration-300 group-hover:text-[#FF6600]"
                        style={{ fontFamily: "var(--font-poppins)" }}
                      >
                        {member.name}
                      </h3>
                      <p className="mt-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#FF6600]/80">
                        {member.role}
                      </p>

                      {/* Bio */}
                      {member.bio && (
                        <p className="mx-auto mt-4 max-w-[260px] text-[13px] leading-relaxed text-gray-400">
                          {member.bio}
                        </p>
                      )}
                    </div>

                    {/* Social Links Footer */}
                    {activeSocials.length > 0 && (
                      <div className="border-t border-gray-50 bg-gray-50/50 px-8 py-4 transition-colors duration-300 group-hover:bg-orange-50/30">
                        <div className="flex items-center justify-center gap-2.5">
                          {activeSocials.map(([platform, url]) => {
                            const Icon = socialIcons[platform];
                            if (!Icon) return null;
                            return (
                              <a
                                key={platform}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-gray-400 shadow-sm ring-1 ring-gray-100 transition-all duration-300 hover:-translate-y-0.5 hover:text-white hover:shadow-md"
                                style={
                                  {
                                    "--hover-bg": socialColors[platform],
                                  } as React.CSSProperties
                                }
                                onMouseEnter={(e) =>
                                  (e.currentTarget.style.background =
                                    socialColors[platform] || "#333")
                                }
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.background = "white";
                                }}
                                aria-label={`${member.name} on ${platform}`}
                              >
                                <Icon className="h-4 w-4" />
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </motion.div>
          ) : null}
        </div>
      </section>

      {/* ── Timeline / Milestones ──────────────────────────── */}
      <section className="relative overflow-hidden bg-white py-24 md:py-32">
        {/* Background accents */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(255,102,0,0.06),transparent)]" />
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

        <div className="container relative z-10 mx-auto max-w-5xl px-4">
          <motion.div
            className="mb-20 text-center md:mb-24"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={stagger}
          >
            <motion.span
              variants={fadeUp}
              custom={0}
              className="mb-6 inline-flex w-max items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-black uppercase tracking-widest text-[#FF6600] shadow-sm"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Our Journey
            </motion.span>
            <motion.h2
              variants={fadeUp}
              custom={1}
              className="text-4xl font-black tracking-tight md:text-5xl lg:text-6xl"
              style={{ fontFamily: "var(--font-poppins)" }}
            >
              Milestones That{" "}
              <span className="text-[#FF6600]">Define Us</span>
            </motion.h2>
          </motion.div>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute bottom-8 left-6 top-8 w-[3px] rounded-full bg-gradient-to-b from-[#FF6600] via-orange-300 to-orange-100 md:left-1/2 md:-ml-[1.5px]" />

            <div className="relative space-y-8 md:space-y-0">
              {milestones.map((m, idx) => {
                const isEven = idx % 2 === 0;
                return (
                  <motion.div
                    key={m.year}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{
                      duration: 0.6,
                      delay: idx * 0.08,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className={`group relative flex flex-col items-start md:flex-row md:items-center md:py-8 ${
                      isEven ? "md:justify-start" : "md:justify-end"
                    }`}
                  >
                    {/* Dot */}
                    <div className="absolute left-6 z-10 flex h-12 w-12 -translate-x-1/2 transform items-center justify-center rounded-full border-4 border-[#FF6600] bg-white text-sm font-black text-[#FF6600] shadow-[0_0_0_6px_white,0_0_0_7px_rgba(255,102,0,0.15)] transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_0_6px_white,0_0_20px_rgba(255,102,0,0.25)] md:left-1/2">
                      &apos;{m.year.slice(2)}
                    </div>

                    {/* Content Card */}
                    <div
                      className={`ml-20 md:ml-0 md:w-[calc(50%-3.5rem)] ${
                        isEven
                          ? "md:pr-8 md:text-right"
                          : "md:pl-8 md:text-left"
                      }`}
                    >
                      <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:border-orange-100 group-hover:shadow-lg group-hover:shadow-orange-500/5 md:p-8">
                        {/* Year watermark */}
                        <span
                          className={`pointer-events-none absolute -top-3 text-[3.5rem] font-black leading-none tracking-tighter opacity-[0.04] ${
                            isEven ? "-right-1" : "-left-1"
                          }`}
                          style={{ fontFamily: "var(--font-display)" }}
                        >
                          {m.year}
                        </span>

                        {/* Year badge */}
                        <span className="mb-3 inline-flex rounded-full bg-orange-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.15em] text-[#FF6600]">
                          {m.year}
                        </span>
                        <h4
                          className="relative z-10 text-lg font-bold leading-tight text-gray-900 md:text-xl"
                          style={{ fontFamily: "var(--font-poppins)" }}
                        >
                          {m.event}
                        </h4>
                        <p className="mt-2 text-sm leading-relaxed text-gray-400">
                          {m.detail}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <CTA />
    </>
  );
}
