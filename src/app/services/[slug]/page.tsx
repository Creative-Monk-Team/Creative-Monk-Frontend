"use client";

import { use, useEffect, useState } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { CTA } from "@/components/sections/cta";
import { getService, getSiteSettings } from "@/lib/api";
import type { Service, SiteSettings } from "@/lib/types";

export default function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [service, setService] = useState<Service | null>(null);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getService(slug), getSiteSettings()])
      .then(([s, set]) => {
        setService(s);
        setSettings(set);
      })
      .catch((err) => {
        console.error("Failed to fetch service:", err);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (!loading && !service) return notFound();

  if (loading || !service) {
    return (
      <main className="min-h-screen bg-[#FAF7F2] grid place-items-center">
        <div className="flex flex-col items-center gap-4 text-stone-500">
          <div className="w-10 h-10 border-2 border-[#FF6600] border-t-transparent rounded-full animate-spin" />
          <p className="font-jakarta text-[11px] font-semibold uppercase tracking-[0.22em]">
            Loading service details…
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="relative">
      <ServiceHero service={service} settings={settings} />
      <Overview service={service} />
      <Capabilities service={service} />
      <Process service={service} />
      <FaqSection service={service} />
      <CTA />
    </main>
  );
}

/* ─── Hero ─────────────────────────────────────────────────── */
function ServiceHero({
  service,
  settings,
}: {
  service: Service;
  settings: SiteSettings | null;
}) {
  const phoneRaw = settings?.phoneRaw || settings?.phone || "";
  /* Split last word for italic accent. */
  const words = (service.title || "").trim().split(/\s+/);
  const lead = words.slice(0, -1).join(" ");
  const accent = words[words.length - 1] || service.title;

  const heroStats = [
    { value: String(service.features.length).padStart(2, "0"), label: "Capabilities" },
    { value: String(service.process.length).padStart(2, "0"), label: "Process steps" },
    { value: String(service.faqs.length).padStart(2, "0"), label: "FAQs covered" },
    { value: String(service.outcomes.length).padStart(2, "0"), label: "Outcomes" },
  ];

  return (
    <section className="relative bg-[#FAF7F2] overflow-hidden">
      <div className="hero-grain-paper" aria-hidden />
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 55% 50% at 100% 0%, rgba(255,102,0,0.12), transparent 60%), radial-gradient(ellipse 50% 60% at 0% 100%, rgba(74,93,58,0.05), transparent 60%)",
        }}
      />

      <div className="container relative z-10 pt-10 md:pt-16 pb-16 md:pb-20">
        {/* Back link + breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between gap-4 mb-10 md:mb-14 pb-5 border-b border-stone-900/10"
        >
          <Link
            href="/services"
            className="group inline-flex items-center gap-2 font-jakarta text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-700 hover:text-stone-900 cursor-pointer"
          >
            <svg
              width="14"
              height="9"
              viewBox="0 0 22 10"
              fill="none"
              className="group-hover:-translate-x-1 transition-transform"
            >
              <path
                d="M21 5 H 2 M 6 1 L 2 5 L 6 9"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            All services
          </Link>
          {service.category && (
            <span className="font-jakarta text-[10.5px] font-semibold uppercase tracking-[0.22em] text-stone-500 flex items-center gap-2">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#FF6600]" />
              {service.category}
            </span>
          )}
        </motion.div>

        <div className="grid grid-cols-12 gap-x-8 gap-y-12 items-start">
          {/* LEFT — type */}
          <div className="col-span-12 lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="flex items-center gap-3 mb-6"
            >
              <span aria-hidden className="block h-px w-9 bg-[#FF6600]" />
              <span className="font-jakarta text-[11px] font-semibold uppercase tracking-[0.26em] text-stone-600">
                Service · {service.category || "Capability"}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, ease: [0.2, 0.7, 0.2, 1] }}
              className="font-funnel text-stone-900 font-bold leading-[0.92] tracking-[-0.04em] text-[clamp(2.5rem,6.6vw,5.75rem)] max-w-[14ch]"
            >
              {lead && <>{lead} </>}
              <span
                style={{
                  fontFamily: "var(--font-newsreader), Georgia, serif",
                  fontStyle: "italic",
                  fontWeight: 500,
                  color: "#FF6600",
                }}
              >
                {accent}
              </span>
              .
            </motion.h1>

            {service.tagline && (
              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.15 }}
                className="mt-7 font-funnel text-stone-900 font-medium leading-[1.25] tracking-[-0.02em] text-[clamp(1.15rem,1.7vw,1.5rem)] max-w-[36ch]"
              >
                {service.tagline}
              </motion.p>
            )}

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="mt-6 max-w-[58ch] font-jakarta text-[15.5px] md:text-[16.5px] leading-[1.6] text-stone-700"
            >
              {service.shortDescription || service.longDescription}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35 }}
              className="mt-9 flex flex-wrap items-center gap-4 md:gap-5"
            >
              <Link
                href="/contact"
                className="group relative inline-flex items-center gap-3 rounded-full bg-stone-900 text-stone-50 pl-6 pr-2 py-2 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-[0_18px_40px_-18px_rgba(15,12,8,0.5)]"
              >
                <span
                  aria-hidden
                  className="absolute inset-0 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, rgba(255,102,0,0.85), transparent)",
                  }}
                />
                <span className="relative font-funnel text-[15px] font-semibold tracking-tight">
                  Start a project
                </span>
                <span className="relative inline-grid place-items-center w-10 h-10 rounded-full bg-[#FF6600] text-stone-900 group-hover:bg-stone-50 group-hover:rotate-[-30deg] transition-all duration-300">
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

              {phoneRaw && (
                <a
                  href={`tel:${phoneRaw}`}
                  className="group inline-flex items-center gap-3 font-jakarta text-[12px] font-semibold uppercase tracking-[0.22em] text-stone-900 cursor-pointer"
                >
                  <span className="relative">
                    Or call the studio
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
              )}
            </motion.div>
          </div>

          {/* RIGHT — preview card */}
          <motion.aside
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.2, ease: [0.2, 0.7, 0.2, 1] }}
            className="col-span-12 lg:col-span-5 relative"
          >
            <div className="relative max-w-[480px] mx-auto">
              {/* Floating "Includes" tag */}
              <span
                className="absolute -top-3 -right-2 z-30 bg-[#FF6600] text-stone-900 rounded-2xl px-3.5 py-2 shadow-[0_14px_28px_-12px_rgba(255,102,0,0.55)] rotate-[5deg] font-jakarta text-[10px] font-bold uppercase tracking-[0.22em]"
              >
                {service.features.length}+ capabilities
              </span>

              <div className="relative aspect-[5/6] rounded-[28px] overflow-hidden border border-stone-900/15 bg-stone-50 shadow-[0_30px_60px_-30px_rgba(15,12,8,0.3)]">
                {service.image ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={service.image}
                    alt={service.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className="absolute inset-0 grid place-items-center"
                    style={{
                      background:
                        "linear-gradient(135deg, #FF6600 0%, #d94f00 50%, #0F0C08 100%)",
                    }}
                  >
                    <span className="font-funnel text-stone-50 font-bold tracking-[-0.05em] text-[clamp(4rem,9vw,7rem)] leading-none">
                      {String(service.features.length).padStart(2, "0")}
                    </span>
                  </div>
                )}

                {/* Gradient overlay */}
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-stone-900/85 via-stone-900/15 to-transparent"
                />

                {/* Corner stamps */}
                <span className="absolute top-5 left-5 font-jakarta text-[10px] font-semibold uppercase tracking-[0.22em] text-stone-50/85">
                  Service plate · MMXXVI
                </span>
                <span className="absolute top-5 right-5 font-jakarta text-[10px] font-semibold uppercase tracking-[0.22em] text-stone-50/85">
                  {service.category || "Capability"}
                </span>

                {/* What you get card overlay */}
                <div className="absolute left-5 right-5 bottom-5 rounded-2xl bg-[#FAF7F2]/95 backdrop-blur-md border border-stone-900/10 p-5">
                  <p className="font-jakarta text-[10.5px] font-semibold uppercase tracking-[0.22em] text-stone-500 mb-3">
                    What you get
                  </p>
                  <ul className="space-y-2.5">
                    {service.features.slice(0, 4).map((f, i) => (
                      <li
                        key={f}
                        className="flex items-baseline gap-2 font-jakarta text-[13.5px] text-stone-700"
                      >
                        <span className="font-mono-ui text-[10px] tabular-nums text-[#FF6600] shrink-0">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  {service.features.length > 4 && (
                    <p className="mt-3 pt-3 border-t border-stone-900/10 font-jakarta text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500">
                      + {service.features.length - 4} more capabilities
                    </p>
                  )}
                </div>
              </div>
            </div>
          </motion.aside>
        </div>

        {/* Hero stat strip */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-14 md:mt-16 pt-8 border-t border-stone-900/10 grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-5"
        >
          {heroStats.map((s) => (
            <div key={s.label}>
              <p className="font-funnel font-bold tracking-[-0.025em] text-stone-900 leading-none text-[clamp(1.7rem,2.6vw,2.1rem)]">
                {s.value}
              </p>
              <p className="mt-2.5 font-jakarta text-[10.5px] font-semibold uppercase tracking-[0.22em] text-stone-500">
                {s.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Overview ─────────────────────────────────────────────── */
function Overview({ service }: { service: Service }) {
  const detailContent = service.detailContent || {};
  if (!service.longDescription && !service.outcomes.length) return null;

  return (
    <section className="relative bg-[#FAF7F2] border-t border-stone-900/10 overflow-hidden">
      <div className="hero-grain-paper" aria-hidden />

      <div className="container relative z-10 py-20 md:py-24">
        <div className="grid grid-cols-12 gap-x-8 gap-y-12 items-start mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="col-span-12 md:col-span-8"
          >
            <div className="flex items-center gap-3 mb-5">
              <span aria-hidden className="block h-px w-9 bg-[#FF6600]" />
              <span className="font-jakarta text-[11px] font-semibold uppercase tracking-[0.26em] text-stone-600">
                The overview
              </span>
            </div>
            <h2 className="font-funnel text-stone-900 font-bold leading-[1.0] tracking-[-0.03em] text-[clamp(1.85rem,3.4vw,2.8rem)] max-w-[22ch]">
              {detailContent.overviewTitle ||
                "Built to look premium, perform hard,"}{" "}
              <span
                style={{
                  fontFamily: "var(--font-newsreader), Georgia, serif",
                  fontStyle: "italic",
                  fontWeight: 500,
                  color: "#1c1c1c",
                }}
              >
                and stay easy to scale.
              </span>
            </h2>
            {service.longDescription && (
              <p className="mt-7 max-w-[64ch] font-jakarta text-[15.5px] md:text-[16.5px] leading-[1.65] text-stone-700">
                {service.longDescription}
              </p>
            )}
          </motion.div>

          {/* Side fact cards */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="col-span-12 md:col-span-4 flex flex-col gap-4"
          >
            <div className="rounded-2xl border border-stone-900/10 bg-stone-50 p-5 md:p-6">
              <p className="font-jakarta text-[10px] font-semibold uppercase tracking-[0.22em] text-[#FF6600] mb-3">
                {detailContent.partnerTitle || "Partner"}
              </p>
              <h3 className="font-funnel text-[clamp(1.15rem,1.4vw,1.35rem)] font-bold tracking-[-0.02em] text-stone-900">
                Creative Monk
              </h3>
              <p className="mt-3 font-jakarta text-[13.5px] leading-[1.55] text-stone-600">
                {detailContent.partnerDescription ||
                  "Strategy, design, build and growth — all under one studio."}
              </p>
            </div>
            <div className="rounded-2xl border border-stone-900/10 bg-stone-50 p-5 md:p-6">
              <p className="font-jakarta text-[10px] font-semibold uppercase tracking-[0.22em] text-[#FF6600] mb-3">
                {detailContent.bestFitTitle || "Best fit"}
              </p>
              <p className="font-jakarta text-[14.5px] leading-[1.55] text-stone-700">
                {detailContent.bestFitDescription ||
                  "Brands that want sharper positioning, stronger credibility and cleaner growth systems."}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Outcomes grid */}
        {service.outcomes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5">
            {service.outcomes.map((outcome, i) => (
              <motion.article
                key={outcome}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: (i % 4) * 0.07 }}
                className="group relative rounded-2xl border border-stone-900/10 bg-stone-50 p-6 hover:-translate-y-1 hover:border-stone-900/25 hover:bg-white hover:shadow-[0_18px_36px_-22px_rgba(15,12,8,0.18)] transition-all duration-500"
              >
                <span
                  className="font-funnel leading-none tracking-[-0.04em] block mb-5"
                  style={{
                    fontFamily: "var(--font-newsreader), Georgia, serif",
                    fontStyle: "italic",
                    fontWeight: 500,
                    fontSize: "clamp(2.4rem, 3vw, 3rem)",
                    color: "#FF6600",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-funnel text-[clamp(1rem,1.3vw,1.2rem)] leading-[1.2] tracking-[-0.02em] font-bold text-stone-900">
                  {outcome}
                </h3>
                <div className="mt-5 h-px bg-stone-900/10 overflow-hidden">
                  <span
                    aria-hidden
                    className="block h-full bg-[#FF6600] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-out"
                  />
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ─── Capabilities ──────────────────────────────────────────── */
function Capabilities({ service }: { service: Service }) {
  const detailContent = service.detailContent || {};
  if (!service.features.length) return null;

  return (
    <section className="relative bg-[#FAF7F2] border-t border-stone-900/10 overflow-hidden">
      <div className="hero-grain-paper" aria-hidden />

      <div className="container relative z-10 py-20 md:py-24">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 md:mb-14">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-5">
              <span aria-hidden className="block h-px w-9 bg-[#FF6600]" />
              <span className="font-jakarta text-[11px] font-semibold uppercase tracking-[0.26em] text-stone-600">
                Capabilities · {service.features.length} included
              </span>
            </div>
            <h2 className="font-funnel text-stone-900 font-bold leading-[1.0] tracking-[-0.03em] text-[clamp(1.85rem,3.4vw,2.8rem)] max-w-[22ch]">
              {detailContent.capabilitiesTitle || "Everything included to make"}{" "}
              <span
                style={{
                  fontFamily: "var(--font-newsreader), Georgia, serif",
                  fontStyle: "italic",
                  fontWeight: 500,
                  color: "#1c1c1c",
                }}
              >
                the service feel complete.
              </span>
            </h2>
          </div>
          <Link
            href="/contact"
            className="group inline-flex items-center gap-2 font-jakarta text-[12px] font-semibold uppercase tracking-[0.22em] text-stone-900 cursor-pointer shrink-0"
          >
            <span className="relative">
              Request a proposal
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
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4">
          {service.features.map((feature, i) => (
            <motion.div
              key={feature}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: (i % 6) * 0.05 }}
              className="group flex items-center gap-4 rounded-2xl border border-stone-900/10 bg-stone-50 px-5 py-5 hover:border-[#FF6600]/40 hover:bg-white hover:-translate-y-0.5 hover:shadow-[0_14px_28px_-18px_rgba(15,12,8,0.18)] transition-all duration-400"
            >
              <span className="shrink-0 grid place-items-center w-11 h-11 rounded-xl bg-stone-100 group-hover:bg-[#FF6600] transition-colors duration-300">
                <span className="font-funnel text-[13px] font-bold tabular-nums tracking-tight text-stone-700 group-hover:text-stone-900 transition-colors">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </span>
              <h3 className="font-funnel text-[14.5px] md:text-[15.5px] leading-[1.25] tracking-[-0.015em] font-bold text-stone-900 flex-1">
                {feature}
              </h3>
              <svg
                width="12"
                height="12"
                viewBox="0 0 14 14"
                fill="none"
                className="shrink-0 text-stone-400 group-hover:text-[#FF6600] opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-1 transition-all"
                aria-hidden
              >
                <path
                  d="M2 12 L12 2 M5 2 L12 2 L12 9"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Process ──────────────────────────────────────────────── */
function Process({ service }: { service: Service }) {
  const detailContent = service.detailContent || {};
  if (!service.process.length) return null;

  return (
    <section className="relative bg-[#FAF7F2] border-t border-stone-900/10 overflow-hidden">
      <div className="hero-grain-paper" aria-hidden />

      <div className="container relative z-10 py-20 md:py-24">
        <div className="grid grid-cols-12 gap-x-8 gap-y-8 items-end mb-12 md:mb-14">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="col-span-12 md:col-span-8"
          >
            <div className="flex items-center gap-3 mb-5">
              <span aria-hidden className="block h-px w-9 bg-[#FF6600]" />
              <span className="font-jakarta text-[11px] font-semibold uppercase tracking-[0.26em] text-stone-600">
                Methodology
              </span>
            </div>
            <h2 className="font-funnel text-stone-900 font-bold leading-[1.0] tracking-[-0.03em] text-[clamp(1.85rem,3.4vw,2.8rem)] max-w-[22ch]">
              {detailContent.processTitle || "A cleaner process with"}{" "}
              <span
                style={{
                  fontFamily: "var(--font-newsreader), Georgia, serif",
                  fontStyle: "italic",
                  fontWeight: 500,
                  color: "#FF6600",
                }}
              >
                fewer bottlenecks.
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
            <p className="font-jakarta text-[14.5px] leading-[1.6] text-stone-600 max-w-[42ch]">
              Every engagement runs on the same rhythm. You'll always know
              what's shipping and when.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          {service.process.map((step, i) => (
            <motion.article
              key={step.step}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: (i % 2) * 0.08 }}
              className="group relative rounded-3xl border border-stone-900/10 bg-stone-50 p-6 md:p-7 hover:-translate-y-1 hover:border-stone-900/25 hover:bg-white hover:shadow-[0_18px_36px_-22px_rgba(15,12,8,0.18)] transition-all duration-500"
            >
              <div className="flex items-start gap-5">
                <span
                  className="shrink-0 leading-none tracking-[-0.04em]"
                  style={{
                    fontFamily: "var(--font-newsreader), Georgia, serif",
                    fontStyle: "italic",
                    fontWeight: 500,
                    fontSize: "clamp(2.8rem, 3.6vw, 3.5rem)",
                    color: "#FF6600",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-funnel text-[clamp(1.2rem,1.6vw,1.45rem)] leading-[1.15] tracking-[-0.02em] font-bold text-stone-900">
                    {step.step}
                  </h3>
                  <p className="mt-3 font-jakarta text-[14.5px] leading-[1.6] text-stone-600 max-w-[44ch]">
                    {step.desc}
                  </p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── FAQ ──────────────────────────────────────────────────── */
function FaqSection({ service }: { service: Service }) {
  const detailContent = service.detailContent || {};
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  if (!service.faqs.length) return null;

  return (
    <section className="relative bg-[#FAF7F2] border-t border-stone-900/10 overflow-hidden">
      <div className="hero-grain-paper" aria-hidden />

      <div className="container relative z-10 py-20 md:py-24">
        <div className="grid grid-cols-12 gap-x-8 gap-y-10">
          <div className="col-span-12 lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7 }}
            >
              <div className="flex items-center gap-3 mb-5">
                <span aria-hidden className="block h-px w-9 bg-[#FF6600]" />
                <span className="font-jakarta text-[11px] font-semibold uppercase tracking-[0.26em] text-stone-600">
                  Common questions
                </span>
              </div>
              <h2 className="font-funnel text-stone-900 font-bold leading-[1.0] tracking-[-0.03em] text-[clamp(1.85rem,3.4vw,2.8rem)] max-w-[20ch]">
                {detailContent.faqTitle || "Clarity"}{" "}
                <span
                  style={{
                    fontFamily: "var(--font-newsreader), Georgia, serif",
                    fontStyle: "italic",
                    fontWeight: 500,
                    color: "#1c1c1c",
                  }}
                >
                  before kickoff.
                </span>
              </h2>
              <p className="mt-5 font-jakarta text-[14.5px] leading-[1.6] text-stone-600 max-w-[40ch]">
                The most common questions clients ask before moving ahead with
                this service.
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="col-span-12 lg:col-span-7"
          >
            <div className="rounded-3xl border border-stone-900/10 bg-stone-50 overflow-hidden">
              {service.faqs.map((faq, i) => {
                const isOpen = i === openIndex;
                return (
                  <div
                    key={faq.question}
                    className={i < service.faqs.length - 1 ? "border-b border-stone-900/10" : ""}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenIndex(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      className="group w-full text-left flex items-center justify-between gap-5 px-6 md:px-8 py-5 md:py-6 cursor-pointer hover:bg-white/40 transition-colors"
                    >
                      <div className="flex items-baseline gap-4 min-w-0 flex-1">
                        <span className="shrink-0 font-jakarta text-[11px] font-bold tabular-nums tracking-[0.18em] uppercase text-stone-400">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="font-funnel text-[clamp(1.05rem,1.5vw,1.3rem)] font-bold leading-[1.25] tracking-[-0.02em] text-stone-900">
                          {faq.question}
                        </span>
                      </div>
                      <span
                        className={`shrink-0 grid place-items-center w-9 h-9 rounded-full border transition-all duration-300 ${
                          isOpen
                            ? "bg-[#FF6600] border-[#FF6600] rotate-45 text-stone-900"
                            : "border-stone-900/15 text-stone-700 group-hover:border-stone-900"
                        }`}
                        aria-hidden
                      >
                        <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                          <path
                            d="M7 1 V 13 M 1 7 H 13"
                            stroke="currentColor"
                            strokeWidth="1.7"
                            strokeLinecap="round"
                          />
                        </svg>
                      </span>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 md:px-8 pb-7 pt-1">
                            <div className="pl-7 md:pl-9 max-w-[64ch] border-l-2 border-[#FF6600]/30">
                              <p className="font-jakarta text-[14.5px] md:text-[15px] leading-[1.65] text-stone-700 pl-5">
                                {faq.answer}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
