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

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMouseEnter = (name: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpenDropdown(name);
  };
  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setOpenDropdown(null), 150);
  };

  return (
    <header
      className="sticky top-0 z-50 w-full transition-all duration-300"
      style={{
        background: scrolled ? "rgba(255,255,255,0.98)" : "white",
        boxShadow: scrolled
          ? "0 2px 20px rgba(0,0,0,0.08)"
          : "0 1px 0 rgba(0,0,0,0.06)",
        backdropFilter: scrolled ? "blur(10px)" : "none",
      }}
    >
      {/* Top Bar */}
      <div style={{ background: "#FF6600" }} className="hidden lg:block">
        <div className="container flex items-center justify-between py-2">
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
      <nav className="w-full max-w-[1600px] mx-auto px-6 lg:px-12 flex items-center justify-between h-16 lg:h-24">
        {/* Logo */}
        <Link href="/" className="flex items-center group shrink-0">
          <img
            src="/logo.webp"
            alt="Creative Monk Logo"
            width={200}
            height={60}
            className="h-12 md:h-16 w-auto transition-transform group-hover:scale-105"
          />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center justify-end flex-1 ml-4 xl:ml-8">
          <div className="flex items-center gap-1 xl:gap-2 mr-4 xl:mr-6">
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
                  className="flex items-center gap-1 px-2 xl:px-3 py-2 rounded-md text-sm xl:text-[15px] font-semibold whitespace-nowrap transition-all duration-200 hover:text-[#FF6600]"
                  style={{
                    fontFamily: "var(--font-poppins)",
                    color:
                      pathname === item.href ||
                      pathname.startsWith(item.href + "/")
                        ? "#FF6600"
                        : "#333",
                    borderBottom:
                      pathname === item.href ||
                      pathname.startsWith(item.href + "/")
                        ? "2px solid #FF6600"
                        : "2px solid transparent",
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
                                fontFamily: "var(--font-poppins)",
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
                                  style={{ fontFamily: "var(--font-poppins)" }}
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
          <div className="flex items-center gap-4 shrink-0 border-l border-gray-200 pl-6">
            <a
              href="tel:+919463445566"
              className="flex items-center justify-center w-10 h-10 rounded-full bg-orange-50 text-[#FF6600] hover:bg-[#FF6600] hover:text-white transition-colors"
            >
              <Phone className="h-4 w-4" />
            </a>
            <Link
              href="/contact"
              className="btn-primary text-sm whitespace-nowrap px-6 py-2.5"
            >
              REQUEST A FREE QUOTE
            </Link>
          </div>
        </div>

        {/* Mobile Toggle */}
        <button
          className="lg:hidden p-2 rounded-md hover:bg-gray-100"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t overflow-y-auto max-h-[calc(100vh-64px)] shadow-xl custom-scrollbar"
            style={{ background: "white" }}
          >
            <div className="container py-4 flex flex-col gap-1">
              {navItems.map((item) => (
                <React.Fragment key={item.href}>
                  <div className="flex items-center">
                    <Link
                      href={item.href}
                      onClick={() => !item.children && setIsOpen(false)}
                      className="flex-1 px-4 py-3 rounded-lg font-semibold text-base transition-all hover:bg-orange-50 hover:text-[#FF6600]"
                      style={{
                        fontFamily: "var(--font-poppins)",
                        color: pathname === item.href ? "#FF6600" : "#333",
                        background:
                          pathname === item.href ? "#fff5f0" : "transparent",
                      }}
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
                        className="p-3 rounded-lg hover:bg-orange-50"
                      >
                        <ChevronDown
                          className="h-4 w-4 transition-transform"
                          style={{
                            transform:
                              mobileSubmenu === item.name
                                ? "rotate(180deg)"
                                : "rotate(0deg)",
                          }}
                        />
                      </button>
                    )}
                  </div>
                  {item.children && mobileSubmenu === item.name && (
                    <div className="ml-4 flex flex-col gap-1 mb-2">
                      {item.children.map((group) => (
                        <div key={group.group}>
                          <p
                            className="px-4 py-2 text-xs font-bold uppercase tracking-wider"
                            style={{ color: "#FF6600" }}
                          >
                            {group.group}
                          </p>
                          {group.items.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              onClick={() => setIsOpen(false)}
                              className="px-4 py-2 rounded-lg text-sm font-medium text-gray-500 hover:text-[#FF6600] hover:bg-orange-50 transition-colors flex items-center gap-2"
                              style={{ fontFamily: "var(--font-poppins)" }}
                            >
                              <ArrowRight className="h-3.5 w-3.5 opacity-40" />{" "}
                              {child.name}
                            </Link>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </React.Fragment>
              ))}
              {/* Mobile Contact Info */}
              <div className="mt-3 pt-3 border-t border-gray-100 flex flex-col gap-2">
                <a
                  href="tel:+919463445566"
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600"
                >
                  <Phone className="h-4 w-4 text-[#FF6600]" /> +91 94634 45566
                </a>
                <a
                  href="mailto:info@thecreativemonk.in"
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600"
                >
                  <Mail className="h-4 w-4 text-[#FF6600]" />{" "}
                  info@thecreativemonk.in
                </a>
              </div>
              <Link
                href="/contact"
                onClick={() => setIsOpen(false)}
                className="btn-primary mt-3 justify-center"
              >
                Request A Free Quote
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
