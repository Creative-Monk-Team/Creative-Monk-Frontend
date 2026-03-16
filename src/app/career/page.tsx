import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  MapPin,
  Clock,
  Briefcase,
  Users,
  Heart,
  Zap,
} from "lucide-react";
import { CTA } from "@/components/sections/cta";
import { PageHeader } from "@/components/layout/page-header";

export const metadata: Metadata = {
  title: "Career | Join The Creative Monk Team",
  description:
    "Join The Creative Monk team! We're hiring talented digital marketers, web developers, and graphic designers in Chandigarh. Explore open positions and grow your career.",
};

const perks = [
  {
    icon: Zap,
    title: "Fast Growth",
    desc: "Rapid career progression with clear growth paths and mentorship.",
  },
  {
    icon: Users,
    title: "Great Team",
    desc: "Work alongside passionate designers, developers, and marketers.",
  },
  {
    icon: Heart,
    title: "Work-Life Balance",
    desc: "Flexible hours, 5-day work week, and a supportive culture.",
  },
  {
    icon: Briefcase,
    title: "Real Projects",
    desc: "Work on impactful projects for clients across India and beyond.",
  },
];

const openings = [
  {
    title: "SEO Executive",
    department: "Digital Marketing",
    type: "Full-Time",
    location: "Zirakpur, Punjab",
    experience: "1-3 years",
    description:
      "We're looking for an SEO Executive to manage on-page/off-page optimization, keyword research, and analytics for our clients.",
  },
  {
    title: "Social Media Manager",
    department: "Digital Marketing",
    type: "Full-Time",
    location: "Zirakpur, Punjab",
    experience: "1-2 years",
    description:
      "Create and manage social media strategies, content calendars, and campaigns for our diverse client portfolio.",
  },
  {
    title: "WordPress Developer",
    department: "Web Development",
    type: "Full-Time",
    location: "Zirakpur, Punjab",
    experience: "1-3 years",
    description:
      "Build custom WordPress themes, plugins, and responsive websites for clients across various industries.",
  },
  {
    title: "Graphic Designer",
    department: "Design",
    type: "Full-Time",
    location: "Zirakpur, Punjab",
    experience: "0-2 years",
    description:
      "Design logos, social media creatives, banners, packaging, and brand identity materials for our clients.",
  },
  {
    title: "Content Writer",
    department: "Content",
    type: "Full-Time / Intern",
    location: "Zirakpur, Punjab (Remote OK)",
    experience: "0-1 years",
    description:
      "Write SEO-friendly blog posts, website copy, and social media content that engages and converts.",
  },
  {
    title: "Business Development Executive",
    department: "Sales",
    type: "Full-Time",
    location: "Zirakpur, Punjab",
    experience: "1-3 years",
    description:
      "Identify new business opportunities, manage client relationships, and help grow our client base.",
  },
];

export default function CareerPage() {
  return (
    <>
      <PageHeader
        badge="We're Hiring"
        title1="Join Our"
        title2="Team."
        description="Be part of a creative, fast-growing digital marketing agency. We're always looking for talented people to help businesses grow digitally."
      />

      {/* Why Work With Us */}
      <section className="section-padding bg-white">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="section-label block mb-3">Why Creative Monk?</span>
            <h2
              className="text-3xl md:text-5xl font-black"
              style={{ fontFamily: "var(--font-poppins)" }}
            >
              Why Work <span style={{ color: "#FF6600" }}>With Us</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {perks.map((perk) => (
              <div
                key={perk.title}
                className="text-center p-8 rounded-2xl card-hover"
                style={{ background: "#fafafa", border: "1px solid #f0f0f0" }}
              >
                <div
                  className="h-14 w-14 rounded-xl flex items-center justify-center mx-auto mb-5"
                  style={{ background: "#fff5f0" }}
                >
                  <perk.icon className="h-7 w-7" style={{ color: "#FF6600" }} />
                </div>
                <h3
                  className="font-bold text-lg mb-2"
                  style={{ fontFamily: "var(--font-poppins)" }}
                >
                  {perk.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {perk.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="section-padding" style={{ background: "#fafafa" }}>
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="section-label block mb-3">Open Positions</span>
            <h2
              className="text-3xl md:text-5xl font-black"
              style={{ fontFamily: "var(--font-poppins)" }}
            >
              Current <span style={{ color: "#FF6600" }}>Openings</span>
            </h2>
            <p className="text-gray-500 text-lg mt-4">
              Don't see a role that fits? Send your resume to{" "}
              <a
                href="mailto:info@thecreativemonk.in"
                className="font-semibold hover:underline"
                style={{ color: "#FF6600" }}
              >
                info@thecreativemonk.in
              </a>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {openings.map((job) => (
              <div
                key={job.title}
                className="group bg-white rounded-2xl p-7 card-hover"
                style={{ border: "1px solid #f0f0f0" }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3
                      className="font-bold text-lg group-hover:text-[#FF6600] transition-colors"
                      style={{ fontFamily: "var(--font-poppins)" }}
                    >
                      {job.title}
                    </h3>
                    <span
                      className="text-xs font-bold uppercase tracking-wider"
                      style={{ color: "#FF6600" }}
                    >
                      {job.department}
                    </span>
                  </div>
                  <span
                    className="text-xs font-semibold px-3 py-1 rounded-full flex-shrink-0"
                    style={{
                      background: "#fff5f0",
                      color: "#FF6600",
                    }}
                  >
                    {job.type}
                  </span>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed mb-5">
                  {job.description}
                </p>
                <div className="flex flex-wrap gap-3 mb-5 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" /> {job.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> {job.experience}
                  </span>
                </div>
                <a
                  href={`mailto:info@thecreativemonk.in?subject=Application for ${job.title}`}
                  className="inline-flex items-center gap-2 text-sm font-semibold group-hover:gap-3 transition-all"
                  style={{
                    color: "#FF6600",
                    fontFamily: "var(--font-poppins)",
                  }}
                >
                  Apply Now <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* General Application */}
      <section className="section-padding bg-white">
        <div className="container max-w-3xl mx-auto text-center">
          <h2
            className="text-2xl md:text-3xl font-black mb-4"
            style={{ fontFamily: "var(--font-poppins)" }}
          >
            Don't See Your <span style={{ color: "#FF6600" }}>Role?</span>
          </h2>
          <p className="text-gray-500 mb-8 text-lg leading-relaxed">
            We're always looking for talented people. Send us your resume and
            portfolio, and we'll reach out when the right opportunity comes up.
          </p>
          <a
            href="mailto:info@thecreativemonk.in?subject=General Application - Creative Monk"
            className="btn-primary text-base px-10 py-4"
          >
            Send Your Resume <ArrowRight className="h-5 w-5" />
          </a>
        </div>
      </section>

      <CTA />
    </>
  );
}
