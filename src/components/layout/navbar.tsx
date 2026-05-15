"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";

import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Phone, Mail, Menu, X } from "lucide-react";

const navItems = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  {
    name: "Services",
    href: "/services",
    children: [
      {
        group: "Digital Marketing",
        items: [
          { name: "Digital Marketing Services", href: "/services/digital-marketing" },
          { name: "Search Engine Optimization", href: "/services/seo" },
          { name: "Social Media Marketing", href: "/services/social-media-marketing" },
          { name: "PPC Advertising", href: "/services/ppc" },
          { name: "Local Business Marketing", href: "/services/local-business-marketing" },
          { name: "Lead Generation", href: "/services/lead-generation" },
          { name: "Branding", href: "/services/branding" },
        ],
      },
      {
        group: "Web Design",
        items: [
          { name: "WordPress Development", href: "/services/wordpress-development" },
          { name: "Ecommerce Web Development", href: "/services/ecommerce-development" },
          { name: "Dynamic Website", href: "/services/dynamic-website" },
          { name: "Static Website", href: "/services/static-website" },
          { name: "Landing Page Design", href: "/services/landing-page" },
          { name: "Shopify Development", href: "/services/shopify" },
        ],
      },
      {
        group: "Graphic Design",
        items: [
          { name: "Logo Designing", href: "/services/logo-designing" },
          { name: "Print Design", href: "/services/print-design" },
          { name: "Package Designing", href: "/services/package-designing" },
          { name: "Corporate Designing", href: "/services/corporate-designing" },
          { name: "Social Media Posters", href: "/services/social-media-posters" },
          { name: "Banner Designing", href: "/services/banner-designing" },
        ],
      },
    ],
  },
  { name: "Work", href: "/portfolio" },
  { name: "Case Studies", href: "/case-studies" },
  { name: "Journal", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const [openDropdown, setOpenDropdown] = React.useState<string | null>(null);
  const [mobileSubmenu, setMobileSubmenu] = React.useState<string | null>(null);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathname = usePathname();
  const isAdminPath =
    pathname?.startsWith("/admin") ||
    (typeof window !== "undefined" &&
      window.location.pathname.startsWith("/admin"));

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [isOpen]);

  if (isAdminPath) return null;

  const handleMouseEnter = (name: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpenDropdown(name);
  };
  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setOpenDropdown(null), 150);
  };

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname?.startsWith(href + "/"));

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled
            ? "rgba(250, 247, 242, 0.86)"
            : "rgba(250, 247, 242, 0)",
          backdropFilter: scrolled ? "blur(14px) saturate(140%)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(14px) saturate(140%)" : "none",
          borderBottom: scrolled
            ? "1px solid rgba(15, 12, 8, 0.08)"
            : "1px solid transparent",
        }}
      >
        {/* Top utility strip — slides out on scroll */}
        <div
          className="hidden xl:block overflow-hidden transition-all duration-500 border-b border-stone-900/10 bg-stone-900 text-stone-100"
          style={{
            maxHeight: scrolled ? 0 : 40,
            opacity: scrolled ? 0 : 1,
          }}
        >
          <div className="container flex items-center justify-between py-2 font-jakarta text-[11px] font-semibold uppercase tracking-[0.22em]">
            <span className="flex items-center gap-2 text-stone-300">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 hero-pulse" />
              Open studio · Accepting Q3 projects
            </span>
            <div className="flex items-center gap-6 text-stone-300">
              <a
                href="tel:+919463445566"
                className="flex items-center gap-2 hover:text-[#FF6600] transition-colors cursor-pointer"
              >
                <Phone className="h-3 w-3" />
                <span className="tracking-[0.18em]">+91 94634 45566</span>
              </a>
              <a
                href="mailto:info@thecreativemonk.in"
                className="flex items-center gap-2 hover:text-[#FF6600] transition-colors cursor-pointer"
              >
                <Mail className="h-3 w-3" />
                <span className="tracking-[0.18em] normal-case">info@thecreativemonk.in</span>
              </a>
              <span className="text-stone-400">Mon–Sat · 09:30–18:30</span>
            </div>
          </div>
        </div>

        {/* Main nav */}
        <nav
          className="container flex items-center justify-between gap-6 transition-all duration-300"
          style={{ height: scrolled ? 68 : 80 }}
        >
          {/* Logo lockup */}
          <Link
            href="/"
            className="group flex items-center gap-3 shrink-0 cursor-pointer"
            aria-label="Creative Monk — home"
          >
            <Image
              src="/logo.webp"
              alt="Creative Monk"
              width={160}
              height={48}
              priority
              className="h-9 xl:h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]"
            />
          </Link>

          {/* Desktop nav links */}
          <div className="hidden xl:flex items-center gap-0.5 flex-1 justify-center">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <div
                  key={item.href}
                  className="relative"
                  onMouseEnter={() => item.children && handleMouseEnter(item.name)}
                  onMouseLeave={() => item.children && handleMouseLeave()}
                >
                  <Link
                    href={item.href}
                    className="group relative flex items-center gap-1.5 px-3.5 py-2 rounded-full font-jakarta text-[14px] font-medium text-stone-700 hover:text-stone-900 transition-colors cursor-pointer"
                  >
                    {/* active dot */}
                    {active && (
                      <span
                        className="inline-block h-1.5 w-1.5 rounded-full bg-[#FF6600]"
                        aria-hidden
                      />
                    )}
                    <span
                      className="transition-colors"
                      style={{ color: active ? "#0F0C08" : undefined }}
                    >
                      {item.name}
                    </span>
                    {item.children && (
                      <ChevronDown
                        className="h-3 w-3 opacity-50 transition-transform duration-300"
                        style={{
                          transform:
                            openDropdown === item.name ? "rotate(180deg)" : "rotate(0deg)",
                        }}
                      />
                    )}
                    {/* hover underline */}
                    <span
                      aria-hidden
                      className="absolute left-3.5 right-3.5 -bottom-0.5 h-px bg-[#FF6600] origin-center scale-x-0 group-hover:scale-x-100 transition-transform duration-400"
                    />
                  </Link>

                  {/* Mega dropdown */}
                  {item.children && (
                    <div
                      className="absolute top-full left-1/2 -translate-x-1/2 z-50 pt-3"
                      style={{
                        display: openDropdown === item.name ? "block" : "none",
                      }}
                      onMouseEnter={() => handleMouseEnter(item.name)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25 }}
                        className="w-[760px] rounded-3xl bg-[#FAF7F2] border border-stone-900/10 p-7 shadow-[0_30px_60px_-30px_rgba(15,12,8,0.25)]"
                      >
                        <div className="grid grid-cols-3 gap-6">
                          {item.children.map((group, gi) => (
                            <div key={group.group}>
                              <div className="flex items-baseline gap-2 mb-4 pb-3 border-b border-stone-900/10">
                                <span className="font-mono-ui text-[9.5px] uppercase tracking-[0.24em] text-[#FF6600] tabular-nums">
                                  0{gi + 1}
                                </span>
                                <h4 className="font-jakarta text-[10.5px] font-bold uppercase tracking-[0.22em] text-stone-900">
                                  {group.group}
                                </h4>
                              </div>
                              <div className="space-y-0.5">
                                {group.items.map((child) => (
                                  <Link
                                    key={child.href}
                                    href={child.href}
                                    onClick={() => setOpenDropdown(null)}
                                    className="group/link flex items-center justify-between gap-3 px-3 py-2 rounded-lg font-jakarta text-[13.5px] text-stone-700 hover:text-stone-900 hover:bg-white transition-all cursor-pointer"
                                  >
                                    <span>{child.name}</span>
                                    <svg
                                      width="12"
                                      height="9"
                                      viewBox="0 0 14 10"
                                      fill="none"
                                      className="opacity-0 -translate-x-1 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all text-[#FF6600]"
                                      aria-hidden
                                    >
                                      <path
                                        d="M1 5 H 12 M 8 1 L 12 5 L 8 9"
                                        stroke="currentColor"
                                        strokeWidth="1.4"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                    </svg>
                                  </Link>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Dropdown footer */}
                        <div className="mt-6 pt-5 border-t border-stone-900/10 flex items-center justify-between">
                          <p className="font-jakarta text-[12.5px] text-stone-600">
                            Not sure which fits?{" "}
                            <span className="text-stone-900 font-semibold">We'll help you scope it in 30 minutes.</span>
                          </p>
                          <Link
                            href="/contact"
                            onClick={() => setOpenDropdown(null)}
                            className="inline-flex items-center gap-2 font-jakarta text-[12px] font-semibold uppercase tracking-[0.18em] text-stone-900 hover:text-[#FF6600] transition-colors cursor-pointer"
                          >
                            Book a call
                            <svg width="18" height="9" viewBox="0 0 22 10" fill="none">
                              <path
                                d="M1 5 H 20 M 16 1 L 20 5 L 16 9"
                                stroke="currentColor"
                                strokeWidth="1.4"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </Link>
                        </div>
                      </motion.div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right side — phone + CTA + mobile toggle */}
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="tel:+919463445566"
              aria-label="Call Creative Monk"
              className="hidden xl:inline-grid place-items-center w-10 h-10 rounded-full border border-stone-900/15 text-stone-700 hover:border-stone-900 hover:text-stone-900 transition-colors cursor-pointer"
            >
              <Phone className="h-4 w-4" />
            </a>

            <Link
              href="/contact"
              className="group relative hidden md:inline-flex items-center gap-2.5 rounded-full bg-stone-900 text-stone-50 pl-5 pr-1.5 py-1.5 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-[0_14px_30px_-14px_rgba(15,12,8,0.45)]"
            >
              <span
                aria-hidden
                className="absolute inset-0 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(255,102,0,0.7), transparent)",
                }}
              />
              <span className="relative font-funnel text-[13.5px] font-semibold tracking-tight">
                Start a project
              </span>
              <span className="relative inline-grid place-items-center w-8 h-8 rounded-full bg-[#FF6600] text-stone-900 group-hover:bg-stone-50 group-hover:rotate-[-30deg] transition-all duration-300">
                <svg width="11" height="11" viewBox="0 0 14 14" fill="none" aria-hidden>
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

            <button
              className="xl:hidden inline-grid place-items-center w-11 h-11 rounded-full bg-stone-900 text-stone-50 cursor-pointer"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>

        {/* Mobile menu overlay */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-[60] xl:hidden bg-[#FAF7F2] flex flex-col"
              style={{ height: "100dvh" }}
            >
              <div className="flex shrink-0 items-center justify-between px-6 h-16 border-b border-stone-900/10">
                <Link href="/" onClick={() => setIsOpen(false)} className="cursor-pointer">
                  <Image
                    src="/logo.webp"
                    alt="Creative Monk"
                    width={140}
                    height={40}
                    className="h-10 w-auto object-contain"
                  />
                </Link>
                <button
                  onClick={() => setIsOpen(false)}
                  className="inline-grid place-items-center w-11 h-11 rounded-full bg-stone-900 text-stone-50 cursor-pointer"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 py-6 custom-scrollbar">
                <div className="flex flex-col">
                  {navItems.map((item, index) => (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 + index * 0.04 }}
                      className="border-b border-stone-900/10"
                    >
                      <div className="flex items-center justify-between">
                        <Link
                          href={item.href}
                          onClick={() => !item.children && setIsOpen(false)}
                          className="flex items-baseline gap-3 flex-1 py-4 cursor-pointer group"
                        >
                          <span className="font-mono-ui text-[10px] text-stone-400 tabular-nums">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <span
                            className="font-funnel text-[26px] tracking-[-0.025em] font-bold text-stone-900 group-hover:text-[#FF6600] transition-colors"
                          >
                            {item.name}
                          </span>
                        </Link>
                        {item.children && (
                          <button
                            onClick={() =>
                              setMobileSubmenu(
                                mobileSubmenu === item.name ? null : item.name,
                              )
                            }
                            className="inline-grid place-items-center w-10 h-10 rounded-full border border-stone-900/15 text-stone-700 cursor-pointer"
                            aria-label={`Toggle ${item.name} submenu`}
                          >
                            <ChevronDown
                              className={`h-4 w-4 transition-transform duration-300 ${
                                mobileSubmenu === item.name ? "rotate-180" : ""
                              }`}
                            />
                          </button>
                        )}
                      </div>

                      {item.children && mobileSubmenu === item.name && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="pb-6 pl-8"
                        >
                          {item.children.map((group, gi) => (
                            <div key={group.group} className="mb-5">
                              <p className="font-mono-ui text-[10px] uppercase tracking-[0.22em] text-[#FF6600] mb-3">
                                0{gi + 1} · {group.group}
                              </p>
                              <div className="flex flex-col">
                                {group.items.map((child) => (
                                  <Link
                                    key={child.href}
                                    href={child.href}
                                    onClick={() => setIsOpen(false)}
                                    className="font-jakarta text-[15px] text-stone-700 hover:text-[#FF6600] py-2 transition-colors cursor-pointer"
                                  >
                                    {child.name}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="shrink-0 px-6 py-5 border-t border-stone-900/10 bg-white/60"
              >
                <div className="flex gap-2.5 mb-4">
                  <a
                    href="tel:+919463445566"
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl border border-stone-900/15 bg-white py-3 font-jakarta text-[11.5px] font-semibold uppercase tracking-[0.18em] text-stone-900 cursor-pointer"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    Call
                  </a>
                  <a
                    href="mailto:info@thecreativemonk.in"
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl border border-stone-900/15 bg-white py-3 font-jakarta text-[11.5px] font-semibold uppercase tracking-[0.18em] text-stone-900 cursor-pointer"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    Email
                  </a>
                </div>
                <Link
                  href="/contact"
                  onClick={() => setIsOpen(false)}
                  className="group relative w-full inline-flex items-center justify-center gap-3 rounded-full bg-stone-900 text-stone-50 py-3.5 px-5 overflow-hidden cursor-pointer"
                >
                  <span className="font-funnel text-[14.5px] font-semibold tracking-tight">
                    Start a project
                  </span>
                  <span className="inline-grid place-items-center w-8 h-8 rounded-full bg-[#FF6600] text-stone-900">
                    <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
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
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      {/* Spacer so fixed nav doesn't cover hero */}
      <div className="h-16 xl:h-[120px]" aria-hidden="true" />
    </>
  );
}
