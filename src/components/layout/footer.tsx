import Link from "next/link";

import {
  Facebook,
  Instagram,
  Youtube,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";

const footerLinks = {
  Company: [
    { name: "About Us", href: "/about" },
    { name: "Our Clients", href: "/portfolio" },
    { name: "Our Previous Work", href: "/portfolio" },
    { name: "Career", href: "/career" },
    { name: "Our Blogs", href: "/blog" },
    { name: "Contact Us", href: "/contact" },
  ],
  Services: [
    { name: "Web Development", href: "/services/web-design" },
    {
      name: "Ecommerce Web Development",
      href: "/services/ecommerce-development",
    },
    { name: "Digital Marketing", href: "/services/digital-marketing" },
    { name: "Graphic Designing", href: "/services/graphic-designing" },
    { name: "Search Engine Optimization", href: "/services/seo" },
    {
      name: "Social Media Marketing",
      href: "/services/social-media-marketing",
    },
    { name: "Pay Per Click", href: "/services/ppc" },
  ],
};

const socials = [
  {
    Icon: Facebook,
    href: "https://www.facebook.com/creativemonkindia/",
    label: "Facebook",
  },
  {
    Icon: Instagram,
    href: "https://www.instagram.com/creativemonkindia/",
    label: "Instagram",
  },
  {
    Icon: Youtube,
    href: "https://www.youtube.com/@creativemonkindia",
    label: "YouTube",
  },
];

export function Footer() {
  return (
    <footer style={{ background: "#1a1a1a" }}>
      {/* Main Footer */}
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <img
                src="/logo.webp"
                alt="Creative Monk"
                className="h-10 w-auto brightness-0 invert"
              />
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              At CREATIVE MONK, we are focused on enhancing the value of your
              business through our innovative and economic Web Development,
              Social Media Promotions and Graphic Designing, Video Edit and
              Animations.
            </p>
            <div className="space-y-3 mb-6">
              <a
                href="https://g.page/creativemonk?we"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2 text-sm text-gray-400 hover:text-[#FF6600] transition-colors"
              >
                <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5 text-[#FF6600]" />
                <span>
                  Office No.11-12, 9th floor, Sushma Infinium, Zirakpur, Punjab,
                  140603
                </span>
              </a>
              <a
                href="tel:+919463445566"
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-[#FF6600] transition-colors"
              >
                <Phone className="h-4 w-4 flex-shrink-0 text-[#FF6600]" />
                <span>+91 94634 45566</span>
              </a>
              <a
                href="mailto:info@thecreativemonk.in"
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-[#FF6600] transition-colors"
              >
                <Mail className="h-4 w-4 flex-shrink-0 text-[#FF6600]" />
                <span>info@thecreativemonk.in</span>
              </a>
            </div>
            <div className="flex gap-3">
              {socials.map(({ Icon, href, label }) => (
                <Link
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="h-9 w-9 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                  style={{
                    background: "rgba(255,102,0,0.15)",
                    color: "#FF6600",
                  }}
                >
                  <Icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4
                className="text-white font-bold text-base mb-5 underline-orange"
                style={{ fontFamily: "var(--font-poppins)" }}
              >
                {title}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="flex items-center gap-2 text-sm text-gray-400 hover:text-[#FF6600] transition-colors group"
                    >
                      <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity -ml-2 group-hover:ml-0" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Get Quotation & Quick Links */}
          <div>
            <h4
              className="text-white font-bold text-base mb-5"
              style={{ fontFamily: "var(--font-poppins)" }}
            >
              Quick Links
            </h4>
            <ul className="space-y-3 mb-6">
              {[
                { name: "Get A Quotation", href: "/contact" },
                { name: "Our Clients", href: "/portfolio" },
                { name: "Join Our Team", href: "/career" },
                { name: "Request A Free Quote", href: "/contact" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-[#FF6600] transition-colors group"
                  >
                    <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity -ml-2 group-hover:ml-0" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/contact" className="btn-primary text-sm inline-flex">
              Request Quote <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{ background: "#FF6600" }}>
        <div className="container py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-white/90 text-sm">
            © Creative Monk {new Date().getFullYear()} – All Rights Reserved
          </p>
          <div className="flex gap-5">
            <Link
              href="/privacy"
              className="text-white/80 text-sm hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-white/80 text-sm hover:text-white transition-colors"
            >
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
