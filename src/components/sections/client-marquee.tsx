"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { homepageContentApi } from "@/lib/api";

/* Fallback brand list — used if the API fetch fails so the section
   never renders empty. Editable copy lives in the DB; the seed at
   Creative-Monk-Backend/scripts/seed-homepage-content.js hydrates it. */
const FALLBACK_BRANDS = [
  "IndusInd Bank", "Zomato", "Best Western", "Hive Management", "CII",
  "TiE", "KJ Foods", "My Trident", "Orane International", "Sashas Holiday Village",
  "Cardinal Sea Villa", "Agelock Skin Clinics", "Woodhouse Café", "Cafe Zoya", "Avenry",
  "Brightlight Immigration", "Dolphin Head Hunters", "Triple Six Beer", "Miles Ahead Education",
  "Fly High Education", "Kalsi Academy", "Dhody & Company", "Residencia", "Tvisva Jewels",
];

const BRAND_COUNT = 142;

type Payload = {
  brands?: Array<{ name: string; logoUrl?: string }>;
  eyebrow?: string;
};

export function ClientMarquee() {
  const [brands, setBrands] = useState<string[]>(FALLBACK_BRANDS);

  useEffect(() => {
    let cancelled = false;
    homepageContentApi.get<Payload>("client_marquee").then((data) => {
      if (cancelled || !data?.brands?.length) return;
      const names = data.brands.map((b) => b.name).filter(Boolean);
      if (names.length) setBrands(names);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  /* Triple the array so the marquee loops without visible seams. */
  const trackA = [...brands, ...brands, ...brands];
  /* Slightly shuffled second row for visual variety. */
  const trackB = [
    ...[...brands].reverse(),
    ...[...brands].reverse(),
    ...[...brands].reverse(),
  ];

  return (
    <section
      className="relative bg-[#FAF7F2] border-t border-stone-900/10 overflow-hidden"
      aria-label="Brands we have worked with"
    >
      <div className="hero-grain-paper" aria-hidden />

      <div className="container relative z-10 pt-16 md:pt-20 pb-10 md:pb-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="max-w-xl">
            <div className="flex items-center gap-3 mb-5">
              <span aria-hidden className="block h-px w-9 bg-[#FF6600]" />
              <span className="font-jakarta text-[11px] font-semibold uppercase tracking-[0.26em] text-stone-600">
                Trusted partners
              </span>
            </div>
            <h2 className="font-funnel text-stone-900 font-bold leading-[1.04] tracking-[-0.03em] text-[clamp(1.9rem,3.4vw,2.9rem)]">
              From founders to{" "}
              <span
                style={{
                  fontFamily: "var(--font-newsreader), Georgia, serif",
                  fontStyle: "italic",
                  fontWeight: 500,
                  color: "#1c1c1c",
                }}
              >
                listed brands
              </span>
              .
            </h2>
            <p className="mt-4 font-jakarta text-[15.5px] leading-[1.55] text-stone-600 max-w-[52ch]">
              {BRAND_COUNT}+ companies have trusted us with their identity,
              website or growth — across hospitality, FMCG, education, fintech
              and beyond.
            </p>
          </div>

          <div className="flex items-center gap-5 shrink-0">
            <div className="flex items-center gap-2 font-jakarta text-[10.5px] font-semibold uppercase tracking-[0.22em] text-stone-700">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 hero-pulse" />
              Active partnerships
            </div>
            <a
              href="/portfolio"
              className="group inline-flex items-center gap-2 font-jakarta text-[12px] font-semibold uppercase tracking-[0.22em] text-stone-900 cursor-pointer"
            >
              <span className="relative">
                See the work
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
        </div>
      </div>

      {/* Two-row marquee — wordmark style */}
      <div className="relative py-6 md:py-8">
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-r from-[#FAF7F2] to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-l from-[#FAF7F2] to-transparent z-10" />

        {/* Row 1 */}
        <motion.div
          className="flex whitespace-nowrap items-center gap-12 md:gap-16 w-max"
          animate={{ x: ["0%", "-33.333333%"] }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 60,
          }}
        >
          {trackA.map((name, i) => (
            <span
              key={`a-${name}-${i}`}
              className="font-funnel text-[24px] md:text-[34px] font-bold tracking-[-0.025em] text-stone-400 hover:text-stone-900 transition-colors duration-300 cursor-default select-none"
            >
              {name}
            </span>
          ))}
        </motion.div>

        {/* Row 2 — reverse direction, italic Fraunces accent */}
        <motion.div
          className="mt-7 md:mt-9 flex whitespace-nowrap items-center gap-12 md:gap-16 w-max"
          animate={{ x: ["-33.333333%", "0%"] }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 75,
          }}
        >
          {trackB.map((name, i) => (
            <span
              key={`b-${name}-${i}`}
              style={{
                fontFamily: "var(--font-newsreader), Georgia, serif",
                fontStyle: "italic",
                fontWeight: 500,
              }}
              className="text-[22px] md:text-[30px] tracking-[-0.01em] text-stone-300 hover:text-stone-900 transition-colors duration-300 cursor-default select-none"
            >
              {name}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Caption strip */}
      <div className="container relative z-10 pt-8 md:pt-10 pb-16 md:pb-20">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-t border-stone-900/10 pt-6">
          <p className="font-jakarta text-[12.5px] leading-[1.55] text-stone-600 max-w-[60ch]">
            We work with brands that take their craft seriously —{" "}
            <span className="text-stone-900 font-semibold">
              average client tenure is 3.2 years.
            </span>{" "}
            Most of our new work comes from existing clients introducing us to
            other founders.
          </p>
          <div className="flex items-center gap-5 font-jakarta text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-700">
            <span className="flex items-center gap-2">
              <span className="font-funnel font-bold text-stone-900 text-[20px] tracking-tight">
                4.9
              </span>
              <span className="text-[#FF6600]">★</span>
              <span>87 reviews</span>
            </span>
            <span className="w-px h-4 bg-stone-300" />
            <span className="flex items-center gap-2">
              <span className="font-funnel font-bold text-stone-900 text-[20px] tracking-tight">
                3.2 yrs
              </span>
              <span>Avg tenure</span>
            </span>
            <span className="w-px h-4 bg-stone-300" />
            <span className="flex items-center gap-2">
              <span className="font-funnel font-bold text-stone-900 text-[20px] tracking-tight">
                68%
              </span>
              <span>From referrals</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
