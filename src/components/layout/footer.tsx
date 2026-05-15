"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const SITEMAP = [
  {
    group: "Studio",
    items: [
      { name: "About", href: "/about" },
      { name: "Process", href: "#process" },
      { name: "Careers", href: "/career" },
      { name: "Journal", href: "/blog" },
      { name: "Privacy", href: "/privacy" },
      { name: "Terms", href: "/terms" },
    ],
  },
  {
    group: "Services",
    items: [
      { name: "Brand identity", href: "/services/branding" },
      { name: "Web design & build", href: "/services" },
      { name: "Performance marketing", href: "/services/digital-marketing" },
      { name: "SEO & content", href: "/services/seo" },
      { name: "Motion & film", href: "/services" },
      { name: "Social strategy", href: "/services/social-media-marketing" },
    ],
  },
  {
    group: "Work",
    items: [
      { name: "Portfolio", href: "/portfolio" },
      { name: "Case studies", href: "/case-studies" },
      { name: "Currently shipping", href: "#hero" },
      { name: "Reviews", href: "#testimonials" },
    ],
  },
];

/* Proper Simple-Icons-style brand glyphs for each platform.
   Brand colours kept muted by default; lit up on hover. */
const SOCIALS = [
  {
    label: "Instagram",
    handle: "@creativemonkindia",
    href: "https://www.instagram.com/creativemonkindia/",
    brand: "#E1306C",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M12 2.16c3.2 0 3.58 0 4.85.07 1.17.06 1.8.25 2.23.42.56.22.96.48 1.38.9.42.42.68.82.9 1.38.17.42.36 1.06.42 2.23.06 1.27.07 1.65.07 4.85s0 3.58-.07 4.85c-.06 1.17-.25 1.8-.42 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.17-1.06.36-2.23.42-1.27.06-1.65.07-4.85.07s-3.58 0-4.85-.07c-1.17-.06-1.8-.25-2.23-.42-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.17-.42-.36-1.06-.42-2.23C2.16 15.58 2.16 15.2 2.16 12s0-3.58.07-4.85c.06-1.17.25-1.8.42-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.17 1.06-.36 2.23-.42C8.42 2.16 8.8 2.16 12 2.16zM12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63a5.85 5.85 0 0 0-2.13 1.38A5.85 5.85 0 0 0 .63 4.14C.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.32.8.74 1.48 1.38 2.13.65.65 1.32 1.06 2.13 1.38.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56.8-.32 1.48-.74 2.13-1.38a5.85 5.85 0 0 0 1.38-2.13c.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91a5.85 5.85 0 0 0-1.38-2.13A5.85 5.85 0 0 0 19.86.63C19.1.33 18.22.13 16.95.07 15.67.01 15.26 0 12 0zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.4-11.85a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    handle: "/creativemonkindia",
    href: "https://www.facebook.com/creativemonkindia/",
    brand: "#1877F2",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.41 0 12.07c0 6.02 4.39 11.01 10.13 11.93v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.69.23 2.69.23v2.97h-1.51c-1.49 0-1.96.93-1.96 1.88v2.27h3.33l-.53 3.49h-2.8V24C19.6 23.08 24 18.09 24 12.07z" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    handle: "@creativemonkindia",
    href: "https://www.youtube.com/@creativemonkindia",
    brand: "#FF0000",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M23.5 6.5a3 3 0 0 0-2.11-2.13C19.55 4 12 4 12 4s-7.55 0-9.39.37A3 3 0 0 0 .5 6.5C.13 8.34.13 12 .13 12s0 3.66.37 5.5a3 3 0 0 0 2.11 2.13C4.45 20 12 20 12 20s7.55 0 9.39-.37a3 3 0 0 0 2.11-2.13c.37-1.84.37-5.5.37-5.5s0-3.66-.37-5.5zM9.75 15.5v-7l6.25 3.5-6.25 3.5z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    handle: "/company/creativemonk",
    href: "https://www.linkedin.com/company/creativemonk",
    brand: "#0A66C2",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.61 0 4.27 2.38 4.27 5.47v6.27zM5.34 7.43A2.07 2.07 0 1 1 5.34 3.3a2.07 2.07 0 0 1 0 4.13zm1.78 13.02H3.56V9h3.56v11.45zM22.22 0H1.77C.8 0 0 .77 0 1.72v20.56C0 23.23.8 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
      </svg>
    ),
  },
  {
    label: "Behance",
    handle: "/creativemonk",
    href: "https://www.behance.net/creativemonk",
    brand: "#1769FF",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M22 7h-7V5.5h7V7zM11.28 11.5c.42-.18.7-.39.86-.62.27-.4.4-.91.4-1.55 0-.62-.13-1.16-.4-1.61-.42-.74-1.14-1.12-2.15-1.14H1.5v11.62h8.13c.92 0 1.66-.13 2.21-.39 1.18-.55 1.77-1.62 1.77-3.21 0-.83-.2-1.55-.6-2.13-.4-.58-.99-.9-1.73-.97zM4 8.32h3.96c.86 0 1.42.13 1.7.39.28.26.42.66.42 1.21 0 .51-.14.91-.42 1.18-.28.27-.84.41-1.7.41H4V8.32zm4.4 7.7H4v-3.43h4.46c.86 0 1.51.16 1.95.49.44.33.66.86.66 1.6 0 .67-.22 1.13-.66 1.39-.44.26-1.1.39-2.01.39v-.44zm14.6-3.66c-.08-1.59-.6-2.92-1.55-4.01-.95-1.09-2.24-1.63-3.85-1.63-1.61 0-2.93.54-3.97 1.6-1.04 1.06-1.55 2.4-1.55 3.99 0 1.59.5 2.91 1.5 3.95 1 1.04 2.36 1.55 4.07 1.55 1.4 0 2.59-.39 3.55-1.18.62-.5 1.07-1.13 1.34-1.89h-2.61c-.39.55-1.06.83-2 .83-.7 0-1.27-.18-1.71-.55-.44-.37-.7-.92-.78-1.66H23v-1zm-7.55-1.07c.09-.66.32-1.18.69-1.58.37-.4.92-.6 1.65-.6.69 0 1.21.2 1.55.6.34.4.55.92.62 1.58h-4.51z" />
      </svg>
    ),
  },
  {
    label: "Dribbble",
    handle: "/creativemonk",
    href: "https://dribbble.com/creativemonk",
    brand: "#EA4C89",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm7.93 5.53a10.36 10.36 0 0 1 2.34 6.46c-.34-.07-3.71-.76-7.11-.33-.07-.16-.14-.34-.21-.51-.21-.49-.43-.99-.65-1.47 3.78-1.54 5.5-3.76 5.63-4.15zM12 2.16c2.61 0 5 .98 6.81 2.59-.11.17-1.66 2.25-5.31 3.61-1.68-3.09-3.55-5.62-3.84-6.02.78-.12 1.55-.18 2.34-.18zM7.31 3.01c.28.38 2.12 2.93 3.82 5.94-4.78 1.27-9 1.25-9.46 1.24A10.37 10.37 0 0 1 7.31 3.01zM2.16 12v-.31c.45.01 5.42.07 10.52-1.46.29.57.57 1.15.83 1.74-.13.04-.27.08-.4.12-5.28 1.7-8.08 6.36-8.31 6.75A10.34 10.34 0 0 1 2.16 12zm9.84 9.85c-2.13 0-4.1-.73-5.66-1.95.18-.37 2.27-4.4 8.04-6.41.02-.01.04-.01.07-.02 1.44 3.73 2.03 6.86 2.18 7.76-1.41.6-2.97.62-4.63.62zm6.61-1.86c-.1-.62-.65-3.61-2-7.29 3.21-.51 6.02.32 6.37.44a10.34 10.34 0 0 1-4.37 6.85z" />
      </svg>
    ),
  },
];

export function Footer() {
  const pathname = usePathname();
  const isAdminPath =
    pathname?.startsWith("/admin") ||
    (typeof window !== "undefined" &&
      window.location.pathname.startsWith("/admin"));

  if (isAdminPath) return null;

  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-[#FAF7F2] border-t border-stone-900/10 overflow-hidden">
      <div className="hero-grain-paper" aria-hidden />

      <div className="container relative z-10 pt-16 md:pt-20 pb-8">
        {/* Top — brand statement */}
        <div className="grid grid-cols-12 gap-x-8 gap-y-10 md:gap-y-12 mb-10 md:mb-12">
          <div className="col-span-12 lg:col-span-5">
            <Link
              href="/"
              className="inline-flex items-center gap-3 mb-6 cursor-pointer group"
              aria-label="Creative Monk · home"
            >
              <Image
                src="/logo.webp"
                alt="Creative Monk"
                width={172}
                height={52}
                className="h-11 md:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]"
              />
            </Link>

            <h3 className="font-funnel font-bold tracking-[-0.025em] leading-[1.1] text-[clamp(1.5rem,2.3vw,2rem)] text-stone-900">
              An independent creative studio for{" "}
              <span
                style={{
                  fontFamily: "var(--font-newsreader), Georgia, serif",
                  fontStyle: "italic",
                  fontWeight: 500,
                  color: "#FF6600",
                }}
              >
                ambitious founders.
              </span>
            </h3>

            <p className="mt-5 font-jakarta text-[14.5px] leading-[1.6] text-stone-600 max-w-[44ch]">
              Identities, websites and growth campaigns for the brands that
              refuse to blend in. Made in Mohali. Shipping worldwide.
            </p>

            {/* Studio info */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
              <a
                href="tel:+919463445566"
                className="group flex items-start gap-3 cursor-pointer"
              >
                <span className="shrink-0 w-9 h-9 rounded-full border border-stone-900/15 grid place-items-center text-stone-700 group-hover:bg-[#FF6600] group-hover:text-stone-900 group-hover:border-[#FF6600] transition-colors duration-300">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M22 16.9v3a2 2 0 0 1-2.2 2A19.9 19.9 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .3 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.8.5 2.8.7a2 2 0 0 1 1.7 2z"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span>
                  <p className="font-jakarta text-[9.5px] font-semibold uppercase tracking-[0.22em] text-stone-500 mb-1">
                    Call
                  </p>
                  <p className="font-funnel text-[14px] font-bold tracking-[-0.015em] text-stone-900 group-hover:text-[#FF6600] transition-colors">
                    +91 94634 45566
                  </p>
                </span>
              </a>

              <a
                href="mailto:hello@thecreativemonk.in"
                className="group flex items-start gap-3 cursor-pointer"
              >
                <span className="shrink-0 w-9 h-9 rounded-full border border-stone-900/15 grid place-items-center text-stone-700 group-hover:bg-[#FF6600] group-hover:text-stone-900 group-hover:border-[#FF6600] transition-colors duration-300">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M3 5h18v14H3z M3 5l9 7 9-7"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span>
                  <p className="font-jakarta text-[9.5px] font-semibold uppercase tracking-[0.22em] text-stone-500 mb-1">
                    Email
                  </p>
                  <p className="font-funnel text-[14px] font-bold tracking-[-0.015em] text-stone-900 group-hover:text-[#FF6600] transition-colors">
                    hello@thecreativemonk.in
                  </p>
                </span>
              </a>

              <a
                href="https://g.page/creativemonk"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-3 cursor-pointer sm:col-span-2"
              >
                <span className="shrink-0 w-9 h-9 rounded-full border border-stone-900/15 grid place-items-center text-stone-700 group-hover:bg-[#FF6600] group-hover:text-stone-900 group-hover:border-[#FF6600] transition-colors duration-300">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1 1 18 0z M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span>
                  <p className="font-jakarta text-[9.5px] font-semibold uppercase tracking-[0.22em] text-stone-500 mb-1">
                    Studio
                  </p>
                  <p className="font-funnel text-[14px] font-bold tracking-[-0.015em] text-stone-900 group-hover:text-[#FF6600] transition-colors leading-[1.4]">
                    Office No. 11-12, 9th Floor, Sushma Infinium
                    <br />
                    Zirakpur · Punjab — 140603
                  </p>
                </span>
              </a>
            </div>
          </div>

          {/* Sitemap columns */}
          <div className="col-span-12 lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-10">
            {SITEMAP.map((col) => (
              <div key={col.group}>
                <p className="font-jakarta text-[10px] font-semibold uppercase tracking-[0.24em] text-stone-500 mb-5 pb-3 border-b border-stone-900/15">
                  {col.group}
                </p>
                <ul className="space-y-3">
                  {col.items.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="font-jakarta text-[14.5px] text-stone-700 hover:text-[#FF6600] transition-colors cursor-pointer"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Follow the studio — full-width, sits below brand + sitemap */}
          <div className="col-span-12 rounded-3xl border border-stone-900/10 bg-stone-50 p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-7">
              <div>
                <p className="font-jakarta text-[10px] font-semibold uppercase tracking-[0.24em] text-stone-500 mb-3">
                  Follow the studio
                </p>
                <h4 className="font-funnel text-[clamp(1.15rem,1.5vw,1.5rem)] font-bold tracking-[-0.015em] text-stone-900 leading-[1.2]">
                  Behind-the-scenes from the working desk —{" "}
                  <span
                    style={{
                      fontFamily: "var(--font-newsreader), Georgia, serif",
                      fontStyle: "italic",
                      fontWeight: 500,
                      color: "#FF6600",
                    }}
                  >
                    posted weekly.
                  </span>
                </h4>
              </div>
              <p className="font-jakarta text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-500 flex items-center gap-2 shrink-0">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 hero-pulse" />
                Posting daily
              </p>
            </div>

            {/* 6 socials across — 2 col on mobile, 3 on md, 6 on lg */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5 md:gap-3">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Creative Monk on ${s.label}`}
                  className="group relative flex items-center gap-3 rounded-2xl border border-stone-900/10 bg-white/70 px-3.5 py-3 cursor-pointer transition-all duration-300 hover:bg-white hover:border-stone-900/25 hover:-translate-y-0.5 hover:shadow-[0_14px_28px_-18px_rgba(15,12,8,0.22)]"
                >
                  <span
                    className="shrink-0 grid place-items-center w-9 h-9 rounded-xl text-stone-50 transition-all duration-300 group-hover:scale-105"
                    style={{ background: s.brand }}
                  >
                    <span className="block w-[18px] h-[18px]">{s.icon}</span>
                  </span>
                  <span className="flex-1 min-w-0 leading-tight">
                    <span className="block font-funnel text-[13.5px] font-bold tracking-[-0.015em] text-stone-900">
                      {s.label}
                    </span>
                    <span className="block font-jakarta text-[10.5px] text-stone-500 truncate mt-0.5">
                      {s.handle}
                    </span>
                  </span>
                  <svg
                    width="11"
                    height="11"
                    viewBox="0 0 14 14"
                    fill="none"
                    className="shrink-0 text-stone-400 group-hover:text-stone-900 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all"
                    aria-hidden
                  >
                    <path
                      d="M2 12 L12 2 M5 2 L12 2 L12 9"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Massive wordmark — sized to fit "CREATIVE·MONK" in the container */}
        <div className="relative pt-8 md:pt-10 border-t border-stone-900/15 select-none overflow-hidden">
          <h2
            className="font-funnel text-stone-900 leading-[0.88] tracking-[-0.07em] font-bold text-center whitespace-nowrap"
            style={{
              fontSize: "clamp(2.4rem, 11.2vw, 10rem)",
              fontVariationSettings: '"wght" 800',
            }}
          >
            CREATIVE
            <span className="text-[#FF6600]">·</span>
            MONK
          </h2>
          {/* hairline shadow line beneath for editorial finish */}
          <span
            aria-hidden
            className="block mt-4 h-px w-full"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(15,12,8,0.18), transparent)",
            }}
          />
        </div>

        {/* Bottom row */}
        <div className="mt-6 pt-5 border-t border-stone-900/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <p className="font-jakarta text-[12px] text-stone-500">
            © Creative Monk Studio · {year} · All rights reserved
          </p>
          <div className="flex items-center gap-6 font-jakarta text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-500">
            <Link
              href="/privacy"
              className="hover:text-[#FF6600] transition-colors cursor-pointer"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="hover:text-[#FF6600] transition-colors cursor-pointer"
            >
              Terms
            </Link>
            <span className="flex items-center gap-2">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 hero-pulse" />
              Studio · Open
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
