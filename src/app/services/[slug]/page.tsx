"use client";

import { use, useEffect, useState } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Layers3,
  Phone,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";
import { CTA } from "@/components/sections/cta";
import { getService, getSiteSettings } from "@/lib/api";
import { getIcon } from "@/lib/icon-utils";
import type { Service, SiteSettings } from "@/lib/types";

function splitHeadline(title: string) {
  const words = title.split(" ");

  if (words.length <= 1) {
    return { lead: title, accent: "" };
  }

  return {
    lead: words.slice(0, -1).join(" "),
    accent: words[words.length - 1],
  };
}

const insightIcons = [Target, Zap, Layers3, CheckCircle2];

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
    async function fetchData() {
      try {
        const [serviceData, siteSettings] = await Promise.all([
          getService(slug),
          getSiteSettings(),
        ]);

        setService(serviceData);
        setSettings(siteSettings);
      } catch (error) {
        console.error("Failed to fetch service details:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [slug]);

  if (!loading && !service) {
    return notFound();
  }

  if (loading || !service) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-gray-500">
          <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <p>Loading service details...</p>
        </div>
      </main>
    );
  }

  const ServiceIcon = getIcon(service.icon);
  const heading = splitHeadline(service.title);
  const phoneRaw = settings?.phoneRaw || settings?.phone || "";
  const companyName = settings?.companyName || "Creative Monk";
  const detailContent = service.detailContent || {};
  const heroMetrics = [
    { label: "Capabilities", value: String(service.features.length).padStart(2, "0") },
    { label: "Process Steps", value: String(service.process.length).padStart(2, "0") },
    { label: "FAQs Covered", value: String(service.faqs.length).padStart(2, "0") },
  ];

  return (
    <main className="min-h-screen bg-white">
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(255,122,26,0.18),_transparent_36%),linear-gradient(180deg,_#1e1c1b_0%,_#161412_48%,_#ffffff_100%)]">
        <div className="absolute inset-0">
          <img
            src={service.image}
            alt={service.title}
            className="h-full w-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(15,12,10,0.96)_18%,rgba(15,12,10,0.78)_55%,rgba(15,12,10,0.45)_100%)]" />
          <div className="absolute right-[-10%] top-20 h-72 w-72 rounded-full bg-orange-500/20 blur-3xl" />
          <div className="absolute bottom-10 left-[-8%] h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        </div>

        <div className="container relative z-10 pt-16 pb-12 md:pt-24 md:pb-24 lg:pt-28 lg:pb-28">
          <Link
            href="/services"
            className="mb-8 hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.22em] text-white/75 backdrop-blur-sm transition-all hover:border-orange-400/40 hover:bg-white/10 hover:text-white md:inline-flex md:mb-10 md:px-5 md:py-3 md:text-xs md:tracking-[0.24em]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Services
          </Link>

          <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.15fr)_420px] lg:gap-10">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }}
              className="max-w-4xl"
            >
              <div className="mb-5 flex flex-wrap items-center gap-2 md:mb-7 md:gap-3">
                <span className="hidden items-center gap-2 rounded-full border border-orange-400/30 bg-orange-500/12 px-3.5 py-2 text-[10px] font-bold uppercase tracking-[0.22em] text-orange-200 sm:inline-flex md:px-4 md:text-[11px] md:tracking-[0.28em]">
                  <Sparkles className="h-3.5 w-3.5" />
                  {detailContent.heroEyebrow || "Premium Solution"}
                </span>
                {service.category && (
                  <span className="rounded-full border border-white/10 bg-white/6 px-3.5 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/65 md:px-4 md:text-[11px] md:tracking-[0.24em]">
                    {service.category}
                  </span>
                )}
              </div>

              <h1
                className="max-w-5xl text-[3rem] font-black leading-[0.92] tracking-[-0.05em] text-white sm:text-6xl md:text-7xl xl:text-[6.25rem]"
                style={{ fontFamily: "var(--font-outfit)" }}
              >
                {heading.lead}
                {heading.accent ? (
                  <>
                    {" "}
                    <span className="bg-gradient-to-r from-orange-300 via-orange-400 to-orange-500 bg-clip-text text-transparent">
                      {heading.accent}
                    </span>
                  </>
                ) : null}
              </h1>

              <div className="mt-5 max-w-3xl space-y-3.5 md:mt-8 md:space-y-5">
                <p
                  className="max-w-xl text-[1.1rem] font-semibold leading-[1.55] text-white/92 sm:text-[1.35rem] md:text-[2rem]"
                  style={{ fontFamily: "var(--font-outfit)" }}
                >
                  {service.tagline || service.shortDescription}
                </p>
                <p className="max-w-2xl text-[15px] leading-7 text-white/68 md:text-lg md:leading-8">
                  {service.shortDescription || service.longDescription}
                </p>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row md:mt-10 md:gap-4">
                <Link href="/contact" className="btn-primary justify-center px-6 py-3.5 text-sm md:px-8 md:py-4">
                  Start Your Project
                  <ArrowRight className="h-5 w-5" />
                </Link>
                {phoneRaw ? (
                  <a
                    href={`tel:${phoneRaw}`}
                    className="inline-flex items-center justify-center gap-3 rounded-2xl border border-white/12 bg-white/7 px-6 py-3.5 text-base font-semibold text-white transition-all hover:border-orange-400/40 hover:bg-white/12 md:px-8 md:py-4"
                  >
                    <Phone className="h-5 w-5 text-orange-300" />
                    Call Us Directly
                  </a>
                ) : null}
              </div>

              <div className="mt-7 grid grid-cols-3 gap-2.5 md:mt-12 md:gap-4">
                {heroMetrics.map((metric) => (
                  <div
                    key={metric.label}
                    className="rounded-[1.15rem] border border-white/10 bg-white/6 px-2.5 py-3.5 backdrop-blur-sm md:rounded-[1.75rem] md:px-5 md:py-5"
                  >
                    <div
                      className="text-[1.8rem] font-black leading-none text-white md:text-3xl"
                      style={{ fontFamily: "var(--font-outfit)" }}
                    >
                      {metric.value}
                    </div>
                    <div className="mt-1.5 text-[8px] font-bold uppercase tracking-[0.14em] text-white/55 md:mt-1 md:text-[11px] md:tracking-[0.24em]">
                      {metric.label}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.aside
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12, duration: 0.75, ease: [0.22, 1, 0.36, 1] as const }}
              className="rounded-[1.45rem] border border-white/10 bg-white/8 p-3 shadow-2xl shadow-black/20 backdrop-blur-xl md:rounded-[2rem] md:p-5"
            >
              <div className="overflow-hidden rounded-[1.35rem] border border-white/10 bg-black/30 md:rounded-[1.6rem]">
                <div className="relative aspect-[4/3]">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
                  <div className="absolute left-4 top-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/12 text-orange-200 backdrop-blur-md md:left-5 md:top-5 md:h-14 md:w-14">
                    <ServiceIcon className="h-6 w-6 md:h-7 md:w-7" />
                  </div>
                </div>
              </div>

              <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 md:mt-5 md:gap-4">
                <div className="rounded-[1.35rem] bg-white px-4 py-4 shadow-lg shadow-black/5 md:rounded-[1.6rem] md:px-5 md:py-5 sm:col-span-2 lg:col-span-1">
                  <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-orange-500">
                    What You Get
                  </p>
                  <ul className="mt-3 grid gap-2 md:mt-4 md:space-y-3">
                    {service.features.slice(0, 4).map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-sm font-medium leading-6 text-gray-700">
                        <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 flex-shrink-0 text-orange-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-[1.35rem] border border-orange-200/70 bg-gradient-to-br from-orange-50 to-white px-4 py-4 md:rounded-[1.6rem] md:px-5 md:py-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-orange-500">
                        {detailContent.deliveryLabel || "Delivery Rhythm"}
                      </p>
                      <p
                        className="mt-2 text-xl font-black text-gray-900 md:text-2xl"
                        style={{ fontFamily: "var(--font-outfit)" }}
                      >
                        {service.process.length} clear stages
                      </p>
                    </div>
                    <Clock3 className="h-9 w-9 rounded-2xl bg-white p-2 text-orange-500 shadow-sm md:h-10 md:w-10 md:p-2.5" />
                  </div>
                  <p className="mt-3 text-sm leading-6 text-gray-600 md:leading-7">
                    {detailContent.deliveryDescription ||
                      "Designed for faster approvals, cleaner handoffs, and a more confident launch."}
                  </p>
                </div>
              </div>
            </motion.aside>
          </div>
        </div>
      </section>

      <section className="relative -mt-3 pb-14 md:-mt-8 md:pb-24">
        <div className="container">
          <div className="rounded-[1.5rem] border border-orange-100 bg-white p-5 shadow-[0_30px_80px_rgba(17,12,10,0.08)] md:rounded-[2rem] md:p-12">
            <div className="grid gap-6 md:gap-10 lg:grid-cols-[minmax(0,1.1fr)_360px] lg:gap-12">
              <div>
                <span className="section-label">Strategic Overview</span>
                <h2
                  className="mt-2.5 max-w-3xl text-[1.95rem] font-black leading-[1.06] tracking-[-0.04em] text-gray-900 md:mt-4 md:text-5xl"
                  style={{ fontFamily: "var(--font-outfit)" }}
                >
                  {detailContent.overviewTitle ||
                    "Built to look premium, perform hard, and stay easy to scale."}
                </h2>
                <p className="mt-4 max-w-3xl text-[15px] leading-7 text-gray-600 md:mt-6 md:text-lg md:leading-8">
                  {service.longDescription}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 md:gap-4">
                <div className="rounded-[1.25rem] border border-gray-100 bg-gray-50 p-4 md:rounded-[1.6rem] md:p-6">
                  <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-orange-500">
                    {detailContent.partnerTitle || "Partner"}
                  </p>
                  <p
                    className="mt-3 text-xl font-black text-gray-900 md:text-2xl"
                    style={{ fontFamily: "var(--font-outfit)" }}
                  >
                    {companyName}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-gray-600 md:leading-7">
                    {detailContent.partnerDescription ||
                      "Strategy, design, development, and optimization aligned into one execution flow."}
                  </p>
                </div>

                <div className="rounded-[1.25rem] border border-gray-100 bg-gray-50 p-4 md:rounded-[1.6rem] md:p-6">
                  <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-orange-500">
                    {detailContent.bestFitTitle || "Best Fit"}
                  </p>
                  <p className="mt-3 text-[15px] font-semibold leading-6 text-gray-700 md:text-base md:leading-7">
                    {detailContent.bestFitDescription ||
                      "Brands that want sharper positioning, stronger digital credibility, and cleaner growth systems."}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-2.5 md:mt-14 md:gap-5 xl:grid-cols-4">
              {service.outcomes.map((outcome, index) => {
                const OutcomeIcon = insightIcons[index % insightIcons.length];

                return (
                  <motion.div
                    key={outcome}
                    whileHover={{ y: -4 }}
                    className="rounded-[1.35rem] border border-gray-100 bg-[linear-gradient(180deg,_#ffffff_0%,_#fff8f3_100%)] p-4 transition-shadow hover:shadow-xl hover:shadow-orange-500/10 md:rounded-[1.7rem] md:p-6"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600 md:h-12 md:w-12 md:rounded-2xl">
                      <OutcomeIcon className="h-4.5 w-4.5 md:h-5 md:w-5" />
                    </div>
                    <h3
                      className="mt-4 text-base font-black leading-snug text-gray-900 md:mt-5 md:text-xl"
                      style={{ fontFamily: "var(--font-outfit)" }}
                    >
                      {outcome}
                    </h3>
                    <div className="mt-4 h-1.5 w-10 rounded-full bg-orange-500 md:mt-5 md:w-12" />
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="pb-14 md:pb-24">
        <div className="container">
          <div className="mb-6 flex flex-col gap-3 md:mb-10 md:gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <span className="section-label">Capabilities</span>
              <h2
                className="mt-2.5 text-[1.9rem] font-black leading-[1.08] tracking-[-0.04em] text-gray-900 md:mt-4 md:text-5xl"
                style={{ fontFamily: "var(--font-outfit)" }}
              >
                {detailContent.capabilitiesTitle ||
                  "Everything included to make the service feel complete."}
              </h2>
            </div>
            <Link href="/contact" className="inline-flex items-center gap-2 font-semibold text-orange-500 transition-colors hover:text-orange-600">
              Request a proposal
              <ChevronRight className="h-5 w-5" />
            </Link>
          </div>

          <div className="grid gap-2.5 md:grid-cols-2 md:gap-5 xl:grid-cols-3">
            {service.features.map((feature, index) => (
              <div
                key={feature}
                className="group rounded-[1.2rem] border border-gray-100 bg-white p-3.5 shadow-sm transition-all hover:-translate-y-1 hover:border-orange-200 hover:shadow-xl hover:shadow-orange-500/8 md:rounded-[1.8rem] md:p-6"
              >
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 text-xs font-black text-orange-500 md:h-12 md:w-12 md:rounded-2xl md:text-sm">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <h3
                    className="text-base font-black leading-snug text-gray-900 md:text-xl"
                    style={{ fontFamily: "var(--font-outfit)" }}
                  >
                    {feature}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#fffaf6] py-14 md:py-24">
        <div className="container">
          <div className="max-w-2xl">
            <span className="section-label">Methodology</span>
            <h2
              className="mt-2.5 text-[1.9rem] font-black leading-[1.08] tracking-[-0.04em] text-gray-900 md:mt-4 md:text-5xl"
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              {detailContent.processTitle ||
                "A cleaner process with fewer bottlenecks and better momentum."}
            </h2>
          </div>

          <div className="mt-7 grid gap-3 md:mt-12 md:gap-6 lg:grid-cols-2">
            {service.process.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.45, delay: index * 0.06 }}
                className="rounded-[1.25rem] border border-orange-100 bg-white p-4 shadow-sm md:rounded-[1.9rem] md:p-7"
              >
                <div className="flex items-start gap-4 md:gap-5">
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-orange-500 text-xs font-black text-white shadow-lg shadow-orange-500/25 md:h-14 md:w-14 md:rounded-2xl md:text-sm">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <div>
                    <h3
                      className="text-xl font-black text-gray-900 md:text-2xl"
                      style={{ fontFamily: "var(--font-outfit)" }}
                    >
                      {step.step}
                    </h3>
                    <p className="mt-2 text-[15px] leading-7 text-gray-600 md:mt-3 md:text-base md:leading-8">
                      {step.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 md:py-24">
        <div className="container">
          <div className="rounded-[1.5rem] bg-[#161412] px-4 py-7 text-white md:rounded-[2.25rem] md:px-12 md:py-14">
            <div className="max-w-2xl">
              <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-orange-300">
                Common Questions
              </span>
              <h2
                className="mt-2.5 text-[1.9rem] font-black leading-[1.08] tracking-[-0.04em] text-white md:mt-4 md:text-5xl"
                style={{ fontFamily: "var(--font-outfit)" }}
              >
                {detailContent.faqTitle || "Clarity before kickoff."}
              </h2>
              <p className="mt-3 text-[15px] leading-7 text-white/65 md:mt-4 md:text-base md:leading-8">
                The most common questions clients ask before moving ahead with this service.
              </p>
            </div>

            <div className="mt-7 grid gap-2.5 md:mt-10 md:gap-5 lg:grid-cols-2">
              {service.faqs.map((faq) => (
                <div
                  key={faq.question}
                  className="rounded-[1.2rem] border border-white/10 bg-white/5 p-4 backdrop-blur-sm md:rounded-[1.7rem] md:p-6"
                >
                  <h3
                    className="text-lg font-black leading-snug text-orange-200 md:text-xl"
                    style={{ fontFamily: "var(--font-outfit)" }}
                  >
                    {faq.question}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-white/72 md:text-base">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CTA />
    </main>
  );
}
