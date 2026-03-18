import Link from "next/link";
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Youtube } from "lucide-react";
import type { SiteSettings } from "@/lib/types";

type FooterProps = {
  site: SiteSettings | null;
};

const socialIconMap = {
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
  youtube: Youtube,
};

export function Footer({ site }: FooterProps) {
  const footerLinks = site?.footerLinks || {};
  const socials = site?.social || {};

  return (
    <footer className="overflow-x-clip border-t border-white/10 bg-slate-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
        <div className="space-y-5">
          <div>
            <p className="font-display text-2xl font-black">{site?.companyName || "Creative Monk"}</p>
            <p className="mt-3 max-w-md text-sm leading-7 text-slate-300">
              {site?.description ||
                "Creative Monk builds websites, campaigns, and creative systems that help brands grow with more clarity and less noise."}
            </p>
          </div>
          <div className="space-y-3 text-sm text-slate-300">
            <a href={site?.address?.mapsUrl || "#"} className="flex items-start gap-3 hover:text-white">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[var(--brand-400)]" />
              <span>{site?.address?.full || "Zirakpur, Punjab, India"}</span>
            </a>
            <a href={`tel:${site?.phoneRaw || "+919463445566"}`} className="flex items-center gap-3 hover:text-white">
              <Phone className="h-4 w-4 shrink-0 text-[var(--brand-400)]" />
              <span>{site?.phone || "+91 94634 45566"}</span>
            </a>
            <a href={`mailto:${site?.email || "info@thecreativemonk.in"}`} className="flex items-center gap-3 hover:text-white">
              <Mail className="h-4 w-4 shrink-0 text-[var(--brand-400)]" />
              <span>{site?.email || "info@thecreativemonk.in"}</span>
            </a>
          </div>
          <div className="flex flex-wrap gap-3">
            {Object.entries(socials)
              .filter(([key, value]) => value && key in socialIconMap)
              .map(([key, value]) => {
                const Icon = socialIconMap[key as keyof typeof socialIconMap];
                return (
                  <a
                    key={key}
                    href={value}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-200 transition hover:border-[var(--brand-400)] hover:text-white"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
          </div>
        </div>

        <FooterColumn title="Company" links={footerLinks.company || []} />
        <FooterColumn title="Services" links={footerLinks.services || []} />
        <FooterColumn title="Legal" links={footerLinks.legal || []} />
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 text-sm text-slate-400 sm:px-6 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {site?.companyName || "Creative Monk"}. All rights reserved.
          </p>
          <p>{site?.workingHours || "Mon - Sat: 9AM - 6PM"}</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <p className="font-display text-lg font-bold">{title}</p>
      <div className="mt-5 space-y-3 text-sm text-slate-300">
        {links.map((link) => (
          <Link key={link.href + link.label} href={link.href} className="block transition hover:text-white">
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
