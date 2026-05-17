"use client";

import { useEffect, useState } from "react";
import { homepageContentApi } from "@/lib/api";
import { MarqueeStrip } from "@/components/motion/marquee-strip";
import { ScrollReveal } from "@/components/motion/scroll-reveal";

const FALLBACK_BRANDS = [
  "IndusInd Bank", "Zomato", "Best Western", "Hive Management", "CII",
  "TiE", "KJ Foods", "My Trident", "Orane International", "Sashas Holiday Village",
  "Cardinal Sea Villa", "Agelock Skin Clinics", "Woodhouse Café", "Cafe Zoya", "Avenry",
  "Brightlight Immigration", "Dolphin Head Hunters", "Triple Six Beer", "Miles Ahead Education",
  "Fly High Education", "Kalsi Academy", "Dhody & Company", "Residencia", "Tvisva Jewels",
];

const BRAND_COUNT = 142;

type Payload = { brands?: Array<{ name: string; logoUrl?: string }>; eyebrow?: string };

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

  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: "var(--site-bg, #0A0807)",
        borderTop: "1px solid var(--site-line)",
        borderBottom: "1px solid var(--site-line)",
      }}
      aria-label="Brands we have worked with"
    >
      <div className="container relative z-10 pt-16 md:pt-20 pb-10">
        <ScrollReveal>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-5">
                <span aria-hidden style={{ display: "block", height: 1, width: 36, background: "var(--site-accent)" }} />
                <span className="site-eyebrow">Trusted partners</span>
              </div>
              <h2
                className="site-display"
                style={{ fontSize: "clamp(2rem, 4.4vw, 3.5rem)", letterSpacing: "-0.025em", color: "var(--site-fg)" }}
              >
                {BRAND_COUNT}+ founders{" "}
                <span className="site-italic" style={{ color: "var(--site-accent)" }}>
                  bet on us
                </span>{" "}
                — and stayed.
              </h2>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.65, color: "var(--site-fg-mute)", maxWidth: 360 }}>
              From IndusInd Bank to a Sector 17 café — the work travels across
              categories because the standard never moves. Average client tenure:{" "}
              <span className="site-mono" style={{ color: "var(--site-accent)" }}>3.2 years</span>.
            </p>
          </div>
        </ScrollReveal>
      </div>

      {/* Two marquee rows, opposing directions for depth */}
      <div className="relative">
        <MarqueeRow brands={brands} direction="forward" />
        <MarqueeRow brands={[...brands].reverse()} direction="reverse" muted />
      </div>

      {/* Edge fades */}
      <span
        aria-hidden
        className="absolute inset-y-0 left-0 w-32 pointer-events-none z-20"
        style={{ background: "linear-gradient(90deg, var(--site-bg) 0%, transparent 100%)" }}
      />
      <span
        aria-hidden
        className="absolute inset-y-0 right-0 w-32 pointer-events-none z-20"
        style={{ background: "linear-gradient(-90deg, var(--site-bg) 0%, transparent 100%)" }}
      />
    </section>
  );
}

function MarqueeRow({
  brands,
  direction,
  muted,
}: {
  brands: string[];
  direction: "forward" | "reverse";
  muted?: boolean;
}) {
  return (
    <div
      style={{
        borderTop: "1px solid var(--site-line)",
        borderBottom: "1px solid var(--site-line)",
        background: muted ? "rgba(245,241,232,0.015)" : "transparent",
      }}
    >
      <MarqueeStrip duration={muted ? 80 : 65} direction={direction}>
        {brands.map((brand, i) => (
          <span
            key={`${direction}-${i}`}
            className="flex items-center gap-10 pr-10 py-6"
          >
            <span
              className="site-display whitespace-nowrap transition-colors duration-300 group"
              style={{
                fontSize: "clamp(1.3rem, 2vw, 2rem)",
                letterSpacing: "-0.022em",
                color: muted ? "var(--site-fg-dim)" : "var(--site-fg-mute)",
              }}
            >
              <span className="hover:text-[var(--site-accent)] transition-colors duration-300">
                {brand}
              </span>
            </span>
            <span aria-hidden style={{ color: "var(--site-accent)", opacity: 0.6 }}>·</span>
          </span>
        ))}
      </MarqueeStrip>
    </div>
  );
}
