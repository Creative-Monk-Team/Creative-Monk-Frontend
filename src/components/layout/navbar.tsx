"use client";

import * as React from "react";
import Link from "next/link";

import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone, ChevronDown, ArrowRight, Mail } from "lucide-react";

const navItems = [
  { name: "Home", href: "/" },
  { name: "Who We Are", href: "/about" },
  {
    name: "What We Do",
    href: "/services",
    children: [
      {
        group: "Digital Marketing",
        items: [
          {
            name: "Digital Marketing Services",
            href: "/services/digital-marketing",
          },
          { name: "Search Engine Optimization", href: "/services/seo" },
          {
            name: "Social Media Marketing",
            href: "/services/social-media-marketing",
          },
          { name: "PPC Advertising", href: "/services/ppc" },
          {
            name: "Local Business Marketing",
            href: "/services/local-business-marketing",
          },
          { name: "Lead Generation", href: "/services/lead-generation" },
        ],
      },
      {
        group: "Website Designing",
        items: [
          {
            name: "WordPress Development",
            href: "/services/wordpress-development",
          },
          {
            name: "Ecommerce Web Development",
            href: "/services/ecommerce-development",
          },
          { name: "Dynamic Website", href: "/services/dynamic-website" },
          { name: "Static Website", href: "/services/static-website" },
          { name: "Landing Page Design", href: "/services/landing-page" },
          { name: "Shopify Development", href: "/services/shopify" },
        ],
      },
      {
        group: "Graphic Designing",
        items: [
          { name: "Logo Designing", href: "/services/logo-designing" },
          { name: "Package Designing", href: "/services/package-designing" },
          {
            name: "Corporate Designing",
            href: "/services/corporate-designing",
          },
          {
            name: "Social Media Posters",
            href: "/services/social-media-posters",
          },
          { name: "Banner Designing", href: "/services/banner-designing" },
        ],
      },
    ],
  },
  { name: "Portfolio", href: "/portfolio" },
  { name: "Case Studies", href: "/case-studies" },
  { name: "Our Blogs", href: "/blog" },
  { name: "Contact Us", href: "/contact" },
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

  if (isAdminPath) return null;

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
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

  const handleMouseEnter = (name: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpenDropdown(name);
  };
  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setOpenDropdown(null), 150);
  };

  return (
    <>
      <header
      className="fixed top-0 left-0 z-50 w-full transition-all duration-300"
      style={{
        background: scrolled ? "rgba(255,255,255,0.98)" : "white",
        boxShadow: scrolled
          ? "0 2px 20px rgba(0,0,0,0.08)"
          : "0 1px 0 rgba(0,0,0,0.06)",
        backdropFilter: scrolled ? "blur(10px)" : "none",
      }}
    >
      {/* Top Bar */}
      <div style={{ background: "#FF6600" }} className="hidden xl:block">
        <div className="xl:px-10 px-4 flex items-center justify-between py-2">
          <div className="flex items-center gap-4 text-white text-sm">
            <a
              href="tel:+919463445566"
              className="flex items-center gap-2 hover:text-white/80 transition-colors"
            >
              <Phone className="h-3.5 w-3.5" />
              <span>+91 94634 45566</span>
            </a>
            <span className="opacity-40">|</span>
            <a
              href="mailto:info@thecreativemonk.in"
              className="flex items-center gap-2 hover:text-white/80 transition-colors"
            >
              <Mail className="h-3.5 w-3.5" />
              <span>info@thecreativemonk.in</span>
            </a>
          </div>
          <div className="text-white/80 text-sm">Mon – Sat: 9AM – 6PM</div>
        </div>
      </div>

      {/* Main Nav */}
      <nav className="xl:px-10 px-4 flex items-center justify-between h-16 xl:h-24">
        {/* Logo */}
        <Link href="/" className="flex items-center group shrink-0">
          <img
            src="/logo.webp"
            alt="Creative Monk Logo"
            width={180}
            height={50}
            className="h-10 xl:h-14 w-auto transition-transform group-hover:scale-105"
          />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden xl:flex items-center justify-between flex-1 ml-5">
          <div className="flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => (
              <div
                key={item.href}
                className="relative"
                onMouseEnter={() =>
                  item.children && handleMouseEnter(item.name)
                }
                onMouseLeave={() => item.children && handleMouseLeave()}
              >
                <Link
                  href={item.href}
                  className="flex items-center gap-1 px-2 xl:px-4 py-2 rounded-md text-[13px] xl:text-[15px] font-bold whitespace-nowrap transition-all duration-200 hover:text-[#FF6600]"
                  style={{
                    fontFamily: "var(--font-outfit)",
                    color:
                      pathname === item.href ||
                      pathname.startsWith(item.href + "/")
                        ? "#FF6600"
                        : "#333",
                  }}
                >
                  {item.name}
                  {item.children && (
                    <ChevronDown
                      className="h-3.5 w-3.5 opacity-60 transition-transform duration-200"
                      style={{
                        transform:
                          openDropdown === item.name
                            ? "rotate(180deg)"
                            : "rotate(0deg)",
                      }}
                    />
                  )}
                </Link>

                {/* Mega Dropdown */}
                {item.children && (
                  <div
                    className="absolute top-full left-1/2 -translate-x-1/2 z-50 pt-2"
                    style={{
                      display: openDropdown === item.name ? "block" : "none",
                    }}
                    onMouseEnter={() => handleMouseEnter(item.name)}
                    onMouseLeave={() => handleMouseLeave()}
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="w-[700px] rounded-xl bg-white shadow-2xl overflow-hidden p-6"
                      style={{ border: "1px solid #f0f0f0" }}
                    >
                      <div className="grid grid-cols-3 gap-6">
                        {item.children.map((group) => (
                          <div key={group.group}>
                            <h4
                              className="text-xs font-bold uppercase tracking-wider mb-3 pb-2"
                              style={{
                                color: "#FF6600",
                                borderBottom: "2px solid #FF6600",
                                fontFamily: "var(--font-outfit)",
                              }}
                            >
                              {group.group}
                            </h4>
                            <div className="space-y-1">
                              {group.items.map((child) => (
                                <Link
                                  key={child.href}
                                  href={child.href}
                                  onClick={() => setOpenDropdown(null)}
                                  className="flex items-center gap-2 px-2 py-2 text-sm font-medium text-gray-700 hover:text-[#FF6600] hover:bg-orange-50 rounded-md transition-colors"
                                  style={{ fontFamily: "var(--font-outfit)" }}
                                >
                                  <ArrowRight className="h-3 w-3 opacity-40 flex-shrink-0" />
                                  {child.name}
                                </Link>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* CTA Desktop */}
          <div className="flex items-center gap-4 shrink-0">
            <a
              href="tel:+919463445566"
              className="flex items-center justify-center w-10 h-10 rounded-full bg-orange-50 text-[#FF6600] hover:bg-[#FF6600] hover:text-white transition-colors"
            >
              <Phone className="h-4 w-4" />
            </a>
            <Link
              href="/contact"
              className="btn-primary text-sm whitespace-nowrap px-6 py-2.5 shadow-lg shadow-orange-500/20"
            >
              REQUEST A FREE QUOTE
            </Link>
          </div>
        </div>

        {/* Mobile Toggle */}
        <button
          className="xl:hidden p-2 rounded-md hover:bg-gray-100"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[60] xl:hidden bg-white/95 backdrop-blur-xl flex flex-col"
            style={{ height: "100dvh" }}
          >
            {/* Mobile Header (Close Button) */}
            <div className="flex shrink-0 items-center justify-between px-6 h-16 border-b border-gray-100">
              <Link href="/" onClick={() => setIsOpen(false)}>
                <img
                  src="/logo.webp"
                  alt="Creative Monk"
                  className="h-10 w-auto"
                />
              </Link>
              <button
                onClick={() => setIsOpen(false)}
                className="p-3 bg-orange-50 text-orange-600 rounded-2xl hover:bg-orange-100 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Menu Items */}
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 py-6 custom-scrollbar">
              <div className="flex flex-col gap-2">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                  >
                    <div className="flex flex-col group">
                      <div className="flex items-center justify-between">
                        <Link
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                          className="flex-1 py-3 text-2xl font-black text-gray-900 group-hover:text-orange-600 transition-colors"
                          style={{ fontFamily: "var(--font-outfit)" }}
                        >
                          {item.name}
                        </Link>
                        {item.children && (
                          <button
                            onClick={() =>
                              setMobileSubmenu(
                                mobileSubmenu === item.name ? null : item.name,
                              )
                            }
                            className="p-4 text-orange-600"
                          >
                            <ChevronDown
                              className={`h-6 w-6 transition-transform duration-300 ${
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
                          className="pl-4 pb-4 flex flex-col gap-3"
                        >
                          {item.children.map((group) => (
                            <div key={group.group} className="mb-4">
                              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-600 mb-3 opacity-60">
                                {group.group}
                              </p>
                              <div className="flex flex-col gap-4">
                                {group.items.map((child) => (
                                  <Link
                                    key={child.href}
                                    href={child.href}
                                    onClick={() => setIsOpen(false)}
                                    className="text-lg font-bold text-gray-700 hover:text-orange-600 flex items-center gap-3"
                                    style={{ fontFamily: "var(--font-outfit)" }}
                                  >
                                    <div className="w-1.5 h-1.5 rounded-full bg-orange-200" />
                                    {child.name}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Footer / Contact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="shrink-0 p-5 bg-gray-50 border-t border-gray-100 mt-auto"
            >
              <div className="flex flex-col gap-4">
                <div className="flex gap-3">
                  <a
                    href="tel:+919463445566"
                    className="flex-1 bg-white p-3 rounded-xl shadow-sm flex items-center justify-center gap-2 border border-gray-100 group hover:border-orange-200 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-all">
                      <Phone className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-xs font-black text-gray-900 uppercase tracking-tight">
                      Call Now
                    </span>
                  </a>
                  <a
                    href="mailto:info@thecreativemonk.in"
                    className="flex-1 bg-white p-3 rounded-xl shadow-sm flex items-center justify-center gap-2 border border-gray-100 group hover:border-orange-200 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-all">
                      <Mail className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-xs font-black text-gray-900 uppercase tracking-tight">
                      Email Us
                    </span>
                  </a>
                </div>

                <Link
                  href="/contact"
                  onClick={() => setIsOpen(false)}
                  className="w-full bg-orange-500 py-3.5 px-6 text-white font-black rounded-xl text-center shadow-lg shadow-orange-500/20 active:scale-95 transition-all uppercase tracking-widest text-sm"
                  style={{ fontFamily: "var(--font-outfit)" }}
                >
                  Request A Free Quote
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </header>
      <div className="h-16 lg:h-32" aria-hidden="true" />
    </>
  );
}
