"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CTA } from "@/components/sections/cta";
import { useEffect, useState } from "react";
import { homepageContentApi } from "@/lib/api";

/* ═══════════════════════════════════════════════════════════════
   About page — content lives in the DB under section "about".
   Seed it via Creative-Monk-Backend/scripts/seed-homepage-content.js.
   Edit copy in /admin/super/homepage/about.
═══════════════════════════════════════════════════════════════ */

type AboutPayload = {
  hero?: { eyebrow?: string; headline?: string; subhead?: string };
  studioStats?: Array<{ value: string; label: string; suffix?: string }>;
  founder?: typeof FOUNDER;
  principles?: typeof PRINCIPLES;
  team?: typeof TEAM;
  milestones?: typeof MILESTONES;
};

function useAbout() {
  const [data, setData] = useState<AboutPayload>({});
  useEffect(() => {
    let cancelled = false;
    homepageContentApi.get<AboutPayload>("about").then((res) => {
      if (cancelled || !res) return;
      setData(res);
    });
    return () => { cancelled = true; };
  }, []);
  return data;
}

const STUDIO_STATS = [
  { value: "8", label: "Years in studio", suffix: "" },
  { value: "142", label: "Brands shipped", suffix: "" },
  { value: "14", label: "People on the team", suffix: "" },
  { value: "3.2", label: "Avg client tenure", suffix: "yrs" },
];

const FOUNDER = {
  name: "Sahil Sehgal",
  title: "Founder & CEO",
  initials: "SS",
  linkedin: "https://www.linkedin.com/in/sahil-sehgal-4a6573134/",
  essay: [
    "I started Creative Monk in 2018 with a single belief — that founder-led work, made by senior craftspeople who actually pick up the phone, would always out-perform the layered agency model.",
    "Eight years and 142 brands later, the studio has grown to fourteen people but the rule still holds. I sit in every kickoff. I read every brief. The team you meet on the first call is the team that ships the project.",
    "We don't take every project that comes through the inbox. We take the ones where the founder has a strong opinion, a budget that respects the work, and the patience to pick a stance instead of a compromise.",
    "If that sounds like you, my LinkedIn is linked below. Slide in. I read every message.",
  ],
};

const PRINCIPLES = [
  {
    no: "01",
    title: "Founder-led, always",
    italic: "no juniors hidden",
    description:
      "Every project has the founder in the kickoff, the review and the launch. No bait-and-switch from senior to junior after the contract is signed.",
  },
  {
    no: "02",
    title: "We say no, often",
    italic: "selective by design",
    description:
      "We turn down most inbound. We work only when we believe we can do something memorable. Better to ship five great projects than fifty average ones.",
  },
  {
    no: "03",
    title: "Two routes, never three",
    italic: "no middle of the road",
    description:
      "Most studios show three options and let clients average to the middle. We present two clearly opposing directions so you have to take a stance.",
  },
  {
    no: "04",
    title: "Reply inside four hours",
    italic: "no portals, no tickets",
    description:
      "WhatsApp, email, Slack — pick the channel. We answer inside four working hours. Studio hours are 09:30 to 18:30 IST and we read every message.",
  },
  {
    no: "05",
    title: "Built for year two",
    italic: "compounding work",
    description:
      "We don't optimise for the first 90 days. Every system we ship — identity, website, content — is designed to keep paying back two years out.",
  },
  {
    no: "06",
    title: "Launch, then stay",
    italic: "we don't ghost",
    description:
      "30 days of post-launch support is on us. About 60% of clients move to a retainer because they'd rather keep working with the team that built it.",
  },
];

const TEAM = [
  {
    name: "Sahil Sehgal",
    role: "Founder & CEO",
    italic: "studio compass",
    bio: "Sets the bar for craft and runs every kickoff personally.",
    initials: "SS",
    accent: "#FF6600",
    linkedin: "https://www.linkedin.com/in/sahil-sehgal-4a6573134/",
  },
  {
    name: "Priya Mehta",
    role: "Brand Director",
    italic: "strategy & systems",
    bio: "Leads identity engagements. Eight years across FMCG and hospitality.",
    initials: "PM",
    accent: "#0F0C08",
    linkedin: "#",
  },
  {
    name: "Aman Kumar",
    role: "Lead Designer",
    italic: "type, layout, ink",
    bio: "Handles the visual craft on every brand and web project. Type-obsessed.",
    initials: "AK",
    accent: "#4A5D3A",
    linkedin: "#",
  },
  {
    name: "Ritika Sharma",
    role: "Creative Strategist",
    italic: "narrative + voice",
    bio: "Writes the brief that wins the brief. Used to lead at a Mumbai consultancy.",
    initials: "RS",
    accent: "#E5B04A",
    linkedin: "#",
  },
  {
    name: "Vikram Singh",
    role: "Senior Developer",
    italic: "performance over polish",
    bio: "Ships Next.js, Shopify and bespoke CMS builds that score 95+ on Lighthouse.",
    initials: "VS",
    accent: "#FF6600",
    linkedin: "#",
  },
  {
    name: "Neha Kapoor",
    role: "Growth Lead",
    italic: "paid + organic",
    bio: "Runs the performance retainer team. Manages ad budgets across 14 client accounts.",
    initials: "NK",
    accent: "#0F0C08",
    linkedin: "#",
  },
  {
    name: "Karthik Rao",
    role: "Motion & Film",
    italic: "stories that move",
    bio: "Cuts the brand films and social reels. Has a thing for Bolex-grade title cards.",
    initials: "KR",
    accent: "#4A5D3A",
    linkedin: "#",
  },
  {
    name: "Anushka Joshi",
    role: "Account Director",
    italic: "your inside person",
    bio: "Keeps every project on date and answers your WhatsApp before the founder does.",
    initials: "AJ",
    accent: "#E5B04A",
    linkedin: "#",
  },
];

const MILESTONES = [
  {
    year: "2018",
    title: "Studio founded",
    detail: "Two desks, one founder, and a 240-sqft office in Mohali. First client signed in week three.",
  },
  {
    year: "2019",
    title: "First retainer client",
    detail: "Hive Management moves us from project-based to a 12-month retainer. The compounding-work thesis is born.",
  },
  {
    year: "2021",
    title: "Cross the 50-brand mark",
    detail: "Mostly word-of-mouth growth. We don't run ads for ourselves — never have.",
  },
  {
    year: "2022",
    title: "Move to Sushma Infinium",
    detail: "The studio scales to nine seats and moves into the 9th-floor office where we still work today.",
  },
  {
    year: "2023",
    title: "Cross 100 brands shipped",
    detail: "Add a dedicated growth team and start running performance retainers alongside brand work.",
  },
  {
    year: "2026",
    title: "Open studio · Q3",
    detail: "Fourteen people. 142 brands shipped. Three slots open for Q3 — we still don't take more than we can personally oversee.",
  },
];

export default function AboutPage() {
  return (
    <main className="relative">
      <AboutHero />
      <FounderNote />
      <Principles />
      <TeamGrid />
      <Journey />
      <CTA />
    </main>
  );
}

/* ─── Hero ───────────────────────────────────────────────────── */
function AboutHero() {
  const remote = useAbout();
  const stats = remote.studioStats?.length ? remote.studioStats : STUDIO_STATS;
  const founderLinkedin = remote.founder?.linkedin ?? FOUNDER.linkedin;
  return (
    <section className="relative bg-[#FAF7F2] overflow-hidden">
      <div className="hero-grain-paper" aria-hidden />
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 50% 50% at 100% 0%, rgba(255,102,0,0.12), transparent 60%), radial-gradient(ellipse 50% 60% at 0% 100%, rgba(74,93,58,0.05), transparent 60%)",
        }}
      />
      {/* Dashed orbit decoration */}
      <div
        aria-hidden
        className="absolute -top-40 right-[3%] w-[380px] h-[380px] rounded-full border border-dashed border-stone-900/15 hidden lg:block"
      />

      <div className="container relative z-10 pt-12 md:pt-20 pb-16 md:pb-24">
        {/* Top masthead strip */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="flex items-center justify-between gap-4 mb-10 md:mb-14 pb-5 border-b border-stone-900/10"
        >
          <div className="flex items-center gap-3">
            <span aria-hidden className="block h-px w-9 bg-[#FF6600]" />
            <span className="font-jakarta text-[11px] font-semibold uppercase tracking-[0.26em] text-stone-600">
              The studio · Est. MMXVIII
            </span>
          </div>
          <span className="hidden md:flex items-center gap-2 font-jakarta text-[10.5px] font-semibold uppercase tracking-[0.22em] text-stone-500">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 hero-pulse" />
            Open studio · Mohali · 30.64°N
          </span>
        </motion.div>

        {/* 12-col grid: type left, postcard right */}
        <div className="grid grid-cols-12 gap-x-8 gap-y-12 items-start">
          {/* LEFT — type column */}
          <div className="col-span-12 lg:col-span-7">
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, ease: [0.2, 0.7, 0.2, 1] }}
              className="font-funnel text-stone-900 font-bold leading-[0.92] tracking-[-0.04em] text-[clamp(2.5rem,6.6vw,5.75rem)] max-w-[16ch]"
            >
              An{" "}
              <span
                style={{
                  fontFamily: "var(--font-newsreader), Georgia, serif",
                  fontStyle: "italic",
                  fontWeight: 500,
                  color: "#1c1c1c",
                }}
              >
                independent
              </span>{" "}
              creative studio for brands that{" "}
              <span
                style={{
                  fontFamily: "var(--font-newsreader), Georgia, serif",
                  fontStyle: "italic",
                  fontWeight: 500,
                  color: "#FF6600",
                }}
              >
                take craft seriously.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-9 max-w-[58ch] font-jakarta text-[16.5px] md:text-[18px] leading-[1.6] text-stone-700"
            >
              We're a fourteen-person studio in Mohali, building identities,
              websites and growth campaigns for founders who'd rather be
              unforgettable than safe. The team you meet on the first call is
              the team that ships the project — no juniors hidden, no offshore
              subs.
            </motion.p>

            {/* Stats — 4 floating mini cards */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35 }}
              className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3"
            >
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="group relative rounded-2xl border border-stone-900/10 bg-stone-50 p-4 md:p-5 hover:bg-white hover:border-[#FF6600]/40 transition-all duration-300 cursor-default"
                >
                  <p className="font-funnel font-bold tracking-[-0.025em] text-stone-900 leading-none text-[clamp(1.65rem,2.6vw,2rem)]">
                    {s.value}
                    {s.suffix && (
                      <span className="ml-1 font-jakarta text-[11.5px] font-semibold uppercase tracking-[0.18em] text-stone-500 align-middle normal-case">
                        {s.suffix}
                      </span>
                    )}
                  </p>
                  <p className="mt-2.5 font-jakarta text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-500">
                    {s.label}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* RIGHT — Studio postcard */}
          <div className="col-span-12 lg:col-span-5 relative">
            <StudioPostcard />
          </div>
        </div>
      </div>
    </section>
  );
}

/* Vertical "studio postcard" visual element — a passport-style card
   with stamps, codes and an identity strip. Pure CSS/SVG, no images. */
function StudioPostcard() {
  const remote = useAbout();
  const founderLinkedin = remote.founder?.linkedin ?? FOUNDER.linkedin;
  return (
    <div className="relative max-w-[440px] mx-auto">
      {/* Floating "Open since 2018" sticky note */}
      <motion.div
        initial={{ opacity: 0, y: -12, rotate: 0, scale: 0.85 }}
        animate={{ opacity: 1, y: 0, rotate: 6, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.4, type: "spring", stiffness: 180, damping: 18 }}
        className="absolute -top-5 -right-3 z-30 bg-[#FF6600] text-stone-900 rounded-2xl px-4 py-2.5 shadow-[0_14px_28px_-12px_rgba(255,102,0,0.5)]"
      >
        <p
          className="font-funnel text-[12px] font-bold uppercase tracking-[0.14em] leading-tight flex items-center gap-1.5"
        >
          ✦ Open since
        </p>
        <p
          className="text-[13.5px] mt-0.5 leading-tight"
          style={{
            fontFamily: "var(--font-newsreader), Georgia, serif",
            fontStyle: "italic",
            fontWeight: 400,
          }}
        >
          MMXVIII
        </p>
      </motion.div>

      {/* Floating LinkedIn pill — bottom left */}
      <motion.a
        href={founderLinkedin}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, y: 14, x: -10 }}
        animate={{ opacity: 1, y: 0, x: 0 }}
        transition={{ duration: 0.7, delay: 0.55 }}
        className="absolute -bottom-3 -left-3 md:left-2 z-40 hero-drift bg-stone-900 text-stone-50 rounded-2xl px-4 py-2.5 shadow-[0_20px_36px_-16px_rgba(15,12,8,0.5)] flex items-center gap-3 cursor-pointer hover:bg-[#0A66C2] transition-colors"
        style={{ ["--rot" as any]: "-3deg" }}
      >
        <span className="grid place-items-center w-9 h-9 rounded-full bg-[#0A66C2]">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.61 0 4.27 2.38 4.27 5.47v6.27zM5.34 7.43A2.07 2.07 0 1 1 5.34 3.3a2.07 2.07 0 0 1 0 4.13zm1.78 13.02H3.56V9h3.56v11.45zM22.22 0H1.77C.8 0 0 .77 0 1.72v20.56C0 23.23.8 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
          </svg>
        </span>
        <div>
          <p className="font-jakarta text-[9.5px] font-semibold uppercase tracking-[0.2em] text-stone-400">
            Founder
          </p>
          <p className="font-funnel text-[14px] font-bold tracking-tight leading-none mt-0.5">
            Connect on LinkedIn
          </p>
        </div>
      </motion.a>

      {/* Main postcard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.2, 0.7, 0.2, 1] }}
        className="relative rounded-[28px] border border-stone-900/15 bg-stone-50 overflow-hidden shadow-[0_30px_60px_-30px_rgba(15,12,8,0.25)]"
        style={{ transform: "rotate(0.6deg)" }}
      >
        {/* Top stamp strip */}
        <div className="bg-stone-900 text-stone-50 px-6 py-3 flex items-center justify-between">
          <span className="font-jakarta text-[10px] font-semibold uppercase tracking-[0.24em]">
            Studio passport · CM-001
          </span>
          <span className="font-mono-ui text-[10px] uppercase tracking-[0.18em] text-stone-300 tabular-nums">
            VOL · 07 / MMXXVI
          </span>
        </div>

        {/* Big year section */}
        <div className="relative px-7 pt-9 pb-7">
          <p className="font-jakarta text-[10.5px] font-semibold uppercase tracking-[0.24em] text-stone-500 mb-3">
            Year of founding
          </p>
          <p
            className="font-funnel font-bold leading-[0.85] tracking-[-0.05em] text-stone-900"
            style={{ fontSize: "clamp(5rem, 9vw, 7.5rem)" }}
          >
            <span
              style={{
                fontFamily: "var(--font-newsreader), Georgia, serif",
                fontStyle: "italic",
                fontWeight: 500,
                color: "#FF6600",
              }}
            >
              2018
            </span>
          </p>

          {/* Identifiers in a 2-col grid */}
          <div className="mt-7 grid grid-cols-2 gap-5">
            <div>
              <p className="font-jakarta text-[10px] font-semibold uppercase tracking-[0.22em] text-stone-500 mb-1.5">
                Headquartered
              </p>
              <p className="font-funnel text-[14.5px] font-bold tracking-[-0.015em] text-stone-900">
                Mohali · India
              </p>
              <p
                className="text-[11.5px] mt-0.5"
                style={{
                  fontFamily: "var(--font-newsreader), Georgia, serif",
                  fontStyle: "italic",
                  fontWeight: 400,
                  color: "#6b6b70",
                }}
              >
                30.7°N · 76.8°E
              </p>
            </div>
            <div>
              <p className="font-jakarta text-[10px] font-semibold uppercase tracking-[0.22em] text-stone-500 mb-1.5">
                Team size
              </p>
              <p className="font-funnel text-[14.5px] font-bold tracking-[-0.015em] text-stone-900">
                14 people
              </p>
              <p
                className="text-[11.5px] mt-0.5"
                style={{
                  fontFamily: "var(--font-newsreader), Georgia, serif",
                  fontStyle: "italic",
                  fontWeight: 400,
                  color: "#6b6b70",
                }}
              >
                senior-only
              </p>
            </div>
            <div>
              <p className="font-jakarta text-[10px] font-semibold uppercase tracking-[0.22em] text-stone-500 mb-1.5">
                Brands shipped
              </p>
              <p className="font-funnel text-[14.5px] font-bold tracking-[-0.015em] text-stone-900">
                142+
              </p>
              <p
                className="text-[11.5px] mt-0.5"
                style={{
                  fontFamily: "var(--font-newsreader), Georgia, serif",
                  fontStyle: "italic",
                  fontWeight: 400,
                  color: "#6b6b70",
                }}
              >
                across 4 continents
              </p>
            </div>
            <div>
              <p className="font-jakarta text-[10px] font-semibold uppercase tracking-[0.22em] text-stone-500 mb-1.5">
                Avg tenure
              </p>
              <p className="font-funnel text-[14.5px] font-bold tracking-[-0.015em] text-stone-900">
                3.2 years
              </p>
              <p
                className="text-[11.5px] mt-0.5"
                style={{
                  fontFamily: "var(--font-newsreader), Georgia, serif",
                  fontStyle: "italic",
                  fontWeight: 400,
                  color: "#6b6b70",
                }}
              >
                per client
              </p>
            </div>
          </div>
        </div>

        {/* Stamp footer */}
        <div className="relative border-t border-stone-900/15 px-7 py-5 flex items-end justify-between gap-4">
          <div>
            <p className="font-jakarta text-[10px] font-semibold uppercase tracking-[0.24em] text-stone-500 mb-1.5">
              Authorised by
            </p>
            <p
              className="text-[15px] text-stone-900"
              style={{
                fontFamily: "var(--font-newsreader), Georgia, serif",
                fontStyle: "italic",
                fontWeight: 400,
              }}
            >
              S. Sehgal · Founder
            </p>
          </div>
          {/* Round stamp */}
          <div className="relative shrink-0">
            <div
              className="grid place-items-center w-[68px] h-[68px] rounded-full border-[2px] border-[#FF6600]/60 text-center rotate-[-6deg]"
              style={{
                background:
                  "radial-gradient(circle, rgba(255,102,0,0.08) 30%, transparent 70%)",
              }}
            >
              <div>
                <p className="font-mono-ui text-[7.5px] uppercase tracking-[0.22em] text-[#FF6600] leading-none">
                  Active
                </p>
                <p
                  className="font-funnel text-[16px] font-bold text-[#FF6600] leading-tight mt-0.5"
                  style={{ fontVariationSettings: '"wght" 800' }}
                >
                  CM
                </p>
                <p className="font-mono-ui text-[7.5px] uppercase tracking-[0.18em] text-[#FF6600] leading-none">
                  2018 · 26
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Decorative asterisks */}
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        fill="currentColor"
        className="absolute -top-7 left-8 w-6 h-6 text-[#FF6600] hero-spin-slow"
      >
        <path d="M12 1 L13 9 L20 6 L15 12 L23 13 L15 14 L20 20 L13 17 L12 25 L11 17 L4 20 L9 14 L1 13 L9 12 L4 6 L11 9 Z" />
      </svg>
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        fill="currentColor"
        className="absolute -bottom-2 right-5 w-4 h-4 text-stone-900/40 hero-spin-slow"
        style={{ animationDirection: "reverse" }}
      >
        <path d="M12 1 L13 9 L20 6 L15 12 L23 13 L15 14 L20 20 L13 17 L12 25 L11 17 L4 20 L9 14 L1 13 L9 12 L4 6 L11 9 Z" />
      </svg>
    </div>
  );
}

/* ─── Founder note ───────────────────────────────────────────── */
function FounderNote() {
  const remote = useAbout();
  const founder = remote.founder ?? FOUNDER;
  return (
    <section className="relative bg-[#FAF7F2] border-t border-stone-900/10 overflow-hidden">
      <div className="hero-grain-paper" aria-hidden />

      <div className="container relative z-10 py-20 md:py-28">
        <div className="grid grid-cols-12 gap-x-8 gap-y-12 items-start">
          {/* Portrait card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="col-span-12 lg:col-span-5"
          >
            <div className="relative">
              {/* Sticky-note tag */}
              <span
                className="absolute -top-3 -right-2 z-20 bg-[#FF6600] text-stone-900 rounded-2xl px-3.5 py-2 shadow-[0_10px_20px_-12px_rgba(255,102,0,0.55)] rotate-[5deg] font-jakarta text-[10px] font-bold uppercase tracking-[0.22em]"
              >
                Member № 01
              </span>

              {/* Portrait block — placeholder initials */}
              <div
                className="relative aspect-[4/5] rounded-[28px] overflow-hidden border border-stone-900/10 shadow-[0_24px_50px_-25px_rgba(15,12,8,0.3)]"
                style={{
                  background:
                    "linear-gradient(135deg, #FF6600 0%, #d94f00 50%, #0F0C08 100%)",
                }}
              >
                <div
                  aria-hidden
                  className="absolute inset-0 opacity-[0.08]"
                  style={{
                    backgroundImage: "radial-gradient(#FAF7F2 1.5px, transparent 1.5px)",
                    backgroundSize: "22px 22px",
                  }}
                />
                {/* Big initials */}
                <span
                  className="absolute inset-0 grid place-items-center font-funnel font-bold text-stone-50 leading-none tracking-[-0.05em] select-none"
                  style={{ fontSize: "clamp(7rem, 14vw, 12rem)", opacity: 0.95 }}
                >
                  {founder.initials}
                </span>

                {/* corner stamps */}
                <span className="absolute top-5 left-5 font-jakarta text-[10.5px] font-semibold uppercase tracking-[0.22em] text-stone-50/80">
                  Portrait · 2026
                </span>
                <span className="absolute top-5 right-5 font-jakarta text-[10.5px] font-semibold uppercase tracking-[0.22em] text-stone-50/80">
                  Studio · Mohali
                </span>

                {/* Caption strip */}
                <div className="absolute left-5 right-5 bottom-5 rounded-2xl bg-[#FAF7F2]/95 backdrop-blur-md px-4 py-3 flex items-center justify-between gap-3 border border-stone-900/10">
                  <div>
                    <p className="font-funnel text-[16px] font-bold tracking-[-0.015em] text-stone-900 leading-none">
                      {founder.name}
                    </p>
                    <p className="font-jakarta text-[10.5px] font-semibold uppercase tracking-[0.22em] text-stone-500 mt-1.5">
                      {founder.title}
                    </p>
                  </div>
                  <a
                    href={founder.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${founder.name} on LinkedIn`}
                    className="grid place-items-center w-10 h-10 rounded-full bg-[#0A66C2] text-stone-50 hover:bg-stone-900 transition-colors cursor-pointer shrink-0"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.61 0 4.27 2.38 4.27 5.47v6.27zM5.34 7.43A2.07 2.07 0 1 1 5.34 3.3a2.07 2.07 0 0 1 0 4.13zm1.78 13.02H3.56V9h3.56v11.45zM22.22 0H1.77C.8 0 0 .77 0 1.72v20.56C0 23.23.8 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Essay */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="col-span-12 lg:col-span-7"
          >
            <div className="flex items-center gap-3 mb-6">
              <span aria-hidden className="block h-px w-9 bg-[#FF6600]" />
              <span className="font-jakarta text-[11px] font-semibold uppercase tracking-[0.26em] text-stone-600">
                Letter from the founder
              </span>
            </div>

            <h2 className="font-funnel text-stone-900 font-bold leading-[1.0] tracking-[-0.03em] text-[clamp(1.85rem,3.6vw,3rem)] max-w-[20ch]">
              The studio you{" "}
              <span
                style={{
                  fontFamily: "var(--font-newsreader), Georgia, serif",
                  fontStyle: "italic",
                  fontWeight: 500,
                  color: "#FF6600",
                }}
              >
                actually wanted
              </span>{" "}
              to hire.
            </h2>

            <div className="mt-8 space-y-5 font-jakarta text-[15.5px] md:text-[16.5px] leading-[1.7] text-stone-700 max-w-[62ch]">
              {founder.essay.map((p, i) => (
                <p key={i}>
                  {i === 0 ? (
                    <>
                      <span
                        className="font-funnel text-[clamp(2.4rem,3.2vw,2.8rem)] leading-none float-left mr-3 mt-1 text-stone-900 font-bold"
                        style={{ shapeOutside: "margin-box" }}
                      >
                        {p.charAt(0)}
                      </span>
                      {p.slice(1)}
                    </>
                  ) : (
                    p
                  )}
                </p>
              ))}
            </div>

            {/* Signature */}
            <div className="mt-10 pt-8 border-t border-stone-900/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
              <div className="flex items-center gap-5">
                <svg
                  viewBox="0 0 200 60"
                  className="w-[160px] h-[44px] text-stone-900"
                  aria-hidden
                >
                  <path
                    d="M 10 40 Q 25 10, 45 30 T 90 28 Q 100 25, 110 38 T 150 24 Q 165 20, 180 32"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M 80 48 L 175 46"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
                <div>
                  <p className="font-funnel text-[16px] font-bold tracking-[-0.015em] text-stone-900 leading-none">
                    {founder.name}
                  </p>
                  <p
                    className="font-jakarta text-[12.5px] text-stone-500 mt-1.5"
                    style={{
                      fontFamily: "var(--font-newsreader), Georgia, serif",
                      fontStyle: "italic",
                      fontWeight: 400,
                    }}
                  >
                    {founder.title} · Mohali
                  </p>
                </div>
              </div>

              <a
                href={founder.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 font-jakarta text-[12px] font-semibold uppercase tracking-[0.22em] text-stone-900 cursor-pointer"
              >
                <span className="relative">
                  Connect on LinkedIn
                  <span className="absolute left-0 -bottom-1 h-px w-full bg-stone-900 origin-left scale-x-100 group-hover:scale-x-0 transition-transform duration-400" />
                  <span className="absolute left-0 -bottom-1 h-px w-full bg-[#FF6600] origin-right scale-x-0 group-hover:scale-x-100 transition-transform duration-400 delay-100" />
                </span>
                <svg
                  width="18"
                  height="9"
                  viewBox="0 0 22 10"
                  fill="none"
                  className="group-hover:translate-x-1 transition-transform"
                >
                  <path
                    d="M1 5 H 20 M 16 1 L 20 5 L 16 9"
                    stroke="currentColor"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ─── Principles ─────────────────────────────────────────────── */
function Principles() {
  const remote = useAbout();
  const principles = remote.principles?.length ? remote.principles : PRINCIPLES;
  return (
    <section className="relative bg-[#FAF7F2] border-t border-stone-900/10 overflow-hidden">
      <div className="hero-grain-paper" aria-hidden />

      <div className="container relative z-10 py-20 md:py-28">
        <div className="grid grid-cols-12 gap-x-8 gap-y-8 items-end mb-14 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="col-span-12 md:col-span-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <span aria-hidden className="block h-px w-9 bg-[#FF6600]" />
              <span className="font-jakarta text-[11px] font-semibold uppercase tracking-[0.26em] text-stone-600">
                How we think
              </span>
            </div>
            <h2 className="font-funnel text-stone-900 font-bold leading-[0.98] tracking-[-0.035em] text-[clamp(2.25rem,4.6vw,4rem)] max-w-[22ch]">
              Six principles{" "}
              <span
                style={{
                  fontFamily: "var(--font-newsreader), Georgia, serif",
                  fontStyle: "italic",
                  fontWeight: 500,
                  color: "#1c1c1c",
                }}
              >
                we don&apos;t bend on.
              </span>
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="col-span-12 md:col-span-4"
          >
            <p className="font-jakarta text-[15.5px] leading-[1.6] text-stone-700 max-w-[40ch]">
              Not slogans. The actual operating rules we use to decide which
              projects to take, who shows up, and what gets shipped.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {principles.map((p, i) => (
            <motion.article
              key={p.no}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: (i % 3) * 0.08 }}
              className="group relative rounded-3xl border border-stone-900/10 bg-stone-50 p-7 md:p-8 transition-all duration-500 hover:-translate-y-1.5 hover:border-stone-900/25 hover:shadow-[0_24px_50px_-30px_rgba(15,12,8,0.2)]"
            >
              {/* Number stamp */}
              <span
                className="font-funnel leading-none tracking-[-0.04em] block mb-6"
                style={{
                  fontFamily: "var(--font-newsreader), Georgia, serif",
                  fontStyle: "italic",
                  fontWeight: 500,
                  fontSize: "clamp(2.6rem, 3.4vw, 3.2rem)",
                  color: "#FF6600",
                }}
              >
                {p.no}
              </span>

              <h3 className="font-funnel text-[clamp(1.15rem,1.55vw,1.4rem)] leading-[1.15] tracking-[-0.02em] font-bold text-stone-900">
                {p.title}
                <span
                  className="block mt-1 text-[0.72em]"
                  style={{
                    fontFamily: "var(--font-newsreader), Georgia, serif",
                    fontStyle: "italic",
                    fontWeight: 400,
                    color: "#6b6b70",
                  }}
                >
                  — {p.italic}.
                </span>
              </h3>

              <p className="mt-4 font-jakarta text-[14px] leading-[1.6] text-stone-600">
                {p.description}
              </p>

              {/* hover line */}
              <div className="mt-6 relative h-px bg-stone-900/10 overflow-hidden">
                <span
                  aria-hidden
                  className="absolute inset-y-0 left-0 right-0 bg-[#FF6600] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-out"
                />
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Team grid ──────────────────────────────────────────────── */
function TeamGrid() {
  const remote = useAbout();
  const team = remote.team?.length ? remote.team : TEAM;
  return (
    <section
      id="team"
      className="relative bg-[#FAF7F2] border-t border-stone-900/10 overflow-hidden"
    >
      <div className="hero-grain-paper" aria-hidden />

      <div className="container relative z-10 py-20 md:py-28">
        <div className="grid grid-cols-12 gap-x-8 gap-y-8 items-end mb-14 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="col-span-12 md:col-span-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <span aria-hidden className="block h-px w-9 bg-[#FF6600]" />
              <span className="font-jakarta text-[11px] font-semibold uppercase tracking-[0.26em] text-stone-600">
                The team
              </span>
            </div>
            <h2 className="font-funnel text-stone-900 font-bold leading-[0.98] tracking-[-0.035em] text-[clamp(2.25rem,4.6vw,4rem)] max-w-[20ch]">
              The {team.length} people{" "}
              <span
                style={{
                  fontFamily: "var(--font-newsreader), Georgia, serif",
                  fontStyle: "italic",
                  fontWeight: 500,
                  color: "#1c1c1c",
                }}
              >
                you&apos;ll actually work with.
              </span>
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="col-span-12 md:col-span-4"
          >
            <p className="font-jakarta text-[15.5px] leading-[1.6] text-stone-700 max-w-[40ch]">
              No bait-and-switch. No offshore subs. The names you read here are
              the people who sit in your kickoff.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {team.map((member, i) => (
            <motion.article
              key={member.name}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: (i % 4) * 0.08 }}
              className="group relative rounded-3xl border border-stone-900/10 bg-stone-50 overflow-hidden transition-all duration-500 hover:-translate-y-1.5 hover:border-stone-900/25 hover:shadow-[0_24px_50px_-30px_rgba(15,12,8,0.22)]"
            >
              {/* Portrait area */}
              <div
                className="relative aspect-[4/5] overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${member.accent} 0%, #0F0C08 100%)`,
                }}
              >
                <div
                  aria-hidden
                  className="absolute inset-0 opacity-[0.10]"
                  style={{
                    backgroundImage: "radial-gradient(#FAF7F2 1.3px, transparent 1.3px)",
                    backgroundSize: "20px 20px",
                  }}
                />
                <span
                  className="absolute inset-0 grid place-items-center font-funnel font-bold text-stone-50 leading-none tracking-[-0.05em] select-none"
                  style={{ fontSize: "clamp(4rem, 8vw, 5.5rem)", opacity: 0.96 }}
                >
                  {member.initials}
                </span>
                {/* hover overlay with LinkedIn */}
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${member.name} on LinkedIn`}
                  className="absolute top-4 right-4 grid place-items-center w-10 h-10 rounded-full bg-stone-50/95 text-stone-900 opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer hover:bg-[#0A66C2] hover:text-stone-50"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.61 0 4.27 2.38 4.27 5.47v6.27zM5.34 7.43A2.07 2.07 0 1 1 5.34 3.3a2.07 2.07 0 0 1 0 4.13zm1.78 13.02H3.56V9h3.56v11.45zM22.22 0H1.77C.8 0 0 .77 0 1.72v20.56C0 23.23.8 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
                  </svg>
                </a>

                <span className="absolute top-4 left-4 font-jakarta text-[9.5px] font-bold uppercase tracking-[0.22em] text-stone-50/85">
                  № {String(i + 1).padStart(2, "0")}
                </span>
              </div>

              {/* Info */}
              <div className="p-5 md:p-6">
                <h3 className="font-funnel text-[clamp(1rem,1.3vw,1.2rem)] leading-[1.15] tracking-[-0.02em] font-bold text-stone-900">
                  {member.name}
                </h3>
                <p
                  className="mt-1.5 text-[13px] leading-tight"
                  style={{
                    fontFamily: "var(--font-newsreader), Georgia, serif",
                    fontStyle: "italic",
                    fontWeight: 400,
                    color: "#FF6600",
                  }}
                >
                  {member.role}
                </p>
                <p className="mt-4 font-jakarta text-[12.5px] leading-[1.55] text-stone-600">
                  {member.bio}
                </p>
                <div className="mt-4 pt-3 border-t border-stone-900/10 flex items-center justify-between">
                  <span className="font-jakarta text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-500">
                    {member.italic}
                  </span>
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: member.accent }}
                    aria-hidden
                  />
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Open roles strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7 }}
          className="mt-12 md:mt-14 rounded-3xl border border-stone-900/10 bg-stone-900 text-stone-50 p-7 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-5"
        >
          <div className="max-w-2xl">
            <p className="font-jakarta text-[10.5px] font-semibold uppercase tracking-[0.24em] text-stone-400 mb-3">
              We're hiring
            </p>
            <h3 className="font-funnel text-[clamp(1.4rem,2.2vw,1.9rem)] leading-[1.15] tracking-[-0.025em] font-bold text-stone-50">
              Two open seats for{" "}
              <span
                style={{
                  fontFamily: "var(--font-newsreader), Georgia, serif",
                  fontStyle: "italic",
                  fontWeight: 500,
                  color: "#FF6600",
                }}
              >
                designers + a developer.
              </span>
            </h3>
            <p className="mt-3 font-jakarta text-[14px] leading-[1.55] text-stone-300 max-w-[52ch]">
              We hire slowly and pay properly. No portfolio gatekeeping — show
              us one thing you're proud of and we'll take it from there.
            </p>
          </div>

          <Link
            href="/career"
            className="group relative inline-flex items-center gap-3 rounded-full bg-stone-50 text-stone-900 pl-6 pr-2 py-2 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-[0_18px_40px_-18px_rgba(255,102,0,0.55)] shrink-0"
          >
            <span className="relative font-funnel text-[15px] font-semibold tracking-tight">
              View open roles
            </span>
            <span className="relative inline-grid place-items-center w-10 h-10 rounded-full bg-[#FF6600] text-stone-900 group-hover:bg-stone-900 group-hover:text-stone-50 group-hover:rotate-[-30deg] transition-all duration-300">
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                <path
                  d="M2 12 L12 2 M5 2 L12 2 L12 9"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Journey timeline ──────────────────────────────────────── */
function Journey() {
  const remote = useAbout();
  const milestones = remote.milestones?.length ? remote.milestones : MILESTONES;
  return (
    <section className="relative bg-[#FAF7F2] border-t border-stone-900/10 overflow-hidden">
      <div className="hero-grain-paper" aria-hidden />

      <div className="container relative z-10 py-20 md:py-28">
        <div className="grid grid-cols-12 gap-x-8 gap-y-8 items-end mb-14 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="col-span-12 md:col-span-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <span aria-hidden className="block h-px w-9 bg-[#FF6600]" />
              <span className="font-jakarta text-[11px] font-semibold uppercase tracking-[0.26em] text-stone-600">
                The journey
              </span>
            </div>
            <h2 className="font-funnel text-stone-900 font-bold leading-[0.98] tracking-[-0.035em] text-[clamp(2.25rem,4.6vw,4rem)] max-w-[18ch]">
              Eight years.{" "}
              <span
                style={{
                  fontFamily: "var(--font-newsreader), Georgia, serif",
                  fontStyle: "italic",
                  fontWeight: 500,
                  color: "#1c1c1c",
                }}
              >
                Six chapters.
              </span>
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="col-span-12 md:col-span-4"
          >
            <p className="font-jakarta text-[15.5px] leading-[1.6] text-stone-700 max-w-[40ch]">
              The short version. No funding rounds, no acquisitions, no exits —
              just slow compounding work and a calendar that's mostly full.
            </p>
          </motion.div>
        </div>

        {/* Vertical timeline */}
        <div className="relative max-w-4xl mx-auto">
          {/* Vertical line */}
          <div
            aria-hidden
            className="absolute left-[28px] md:left-[44px] top-0 bottom-0 w-px bg-stone-900/15"
          />

          <div className="space-y-10">
            {milestones.map((m, i) => (
              <motion.article
                key={m.year}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.06 }}
                className="relative pl-[72px] md:pl-[100px]"
              >
                {/* Year node */}
                <div className="absolute left-0 top-0 grid place-items-center w-[56px] md:w-[88px] h-[56px] md:h-[60px]">
                  <span
                    className="relative grid place-items-center w-14 md:w-[88px] h-12 md:h-14 rounded-2xl bg-stone-900 text-stone-50 z-10"
                  >
                    <span className="font-funnel text-[13.5px] md:text-[16px] font-bold tracking-tight">
                      {m.year}
                    </span>
                  </span>
                </div>

                <div className="rounded-2xl border border-stone-900/10 bg-stone-50 p-6 md:p-7 hover:border-stone-900/25 hover:bg-white transition-all duration-300">
                  <div className="flex items-baseline gap-3 mb-3">
                    <span
                      className="font-jakarta text-[10px] font-semibold uppercase tracking-[0.22em] text-[#FF6600]"
                    >
                      Chapter {String(i + 1).padStart(2, "0")}
                    </span>
                    {i === milestones.length - 1 && (
                      <span className="inline-flex items-center gap-1.5 font-jakarta text-[10px] font-semibold uppercase tracking-[0.22em] text-emerald-700">
                        <span className="inline-block h-1 w-1 rounded-full bg-emerald-500 hero-pulse" />
                        Now
                      </span>
                    )}
                  </div>
                  <h3 className="font-funnel text-[clamp(1.2rem,1.7vw,1.55rem)] leading-[1.15] tracking-[-0.02em] font-bold text-stone-900">
                    {m.title}
                  </h3>
                  <p className="mt-3 font-jakarta text-[14.5px] leading-[1.6] text-stone-600 max-w-[60ch]">
                    {m.detail}
                  </p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
