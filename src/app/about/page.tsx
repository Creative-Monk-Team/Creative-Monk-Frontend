import type { Metadata } from "next";
import { Linkedin, Target, Zap, TrendingUp, CheckCircle2 } from "lucide-react";
import { CTA } from "@/components/sections/cta";
import { PageHeader } from "@/components/layout/page-header";

export const metadata: Metadata = {
  title: "About Us | Creative Monk – Digital Marketing Agency Chandigarh",
  description:
    "At CREATIVE MONK, we are focused on enhancing the value of your business through our innovative Web Development, Social Media Promotions, Graphic Designing, Video Edit and Animations.",
};

const founder = {
  name: "Sahil Sehgal",
  role: "Founder & CEO",
  bio: "Visionary leader in digital marketing. Sahil has helped numerous businesses transform their online presence and grow digitally.",
  initials: "SS",
  color: "#FF6600",
  linkedin: "https://www.linkedin.com/in/sahil-sehgal-4a6573134/",
};

const team = [
  {
    name: "Siddharth Tiwari",
    role: "Lead Developer",
    bio: "Full-stack developer specializing in Next.js, React, and scalable web applications. Passionate about clean code and great UX.",
    initials: "ST",
    color: "#FF6600",
    linkedin: "https://www.linkedin.com/in/siddharth-tiwari-5011b6393/",
  },
  {
    name: "Rajwant Maurya",
    role: "Digital Marketing Expert",
    bio: "Data-driven SEO strategist who has delivered 300%+ organic traffic growth for clients across multiple industries.",
    initials: "RM",
    color: "#FF6600",
    linkedin: "https://www.linkedin.com/in/moryarajwant/",
  },
  {
    name: "Karandeep Singh",
    role: "Creative Professional",
    bio: "Expert in brand identity, UI/UX design, and visual storytelling.",
    initials: "KS",
    color: "#FF6600",
    linkedin: "https://www.linkedin.com/in/karandeep-singh-263765372/",
  },
  {
    name: "Tanik Sharma",
    role: "Marketing Strategist",
    bio: "Specializing in innovative marketing campaigns and strategic partnerships.",
    initials: "TS",
    color: "#FF6600",
    linkedin: "https://www.linkedin.com/in/tanik-sharma-a47542308/",
  },
  {
    name: "Janvee Aneja",
    role: "Content & Strategy",
    bio: "Crafting compelling narratives and engaging content strategies that drive conversions.",
    initials: "JA",
    color: "#FF6600",
    linkedin: "http://linkedin.com/in/janvee-aneja-919b72229/",
  },
];

const milestones = [
  { year: "2019", event: "Creative Monk founded in Chandigarh" },
  { year: "2020", event: "Crossed 50 clients milestone" },
  { year: "2021", event: "Expanded to full-service Digital Marketing" },
  { year: "2022", event: "Moved to Sushma Infinium, Zirakpur" },
  { year: "2023", event: "250+ happy clients served across India" },
  { year: "2024", event: "Launched advanced web development solutions" },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <PageHeader
        badge="Who We Are"
        title1="About"
        title2="Creative Monk"
        description="We are a passionate team of designers, developers, and marketers helping businesses grow digitally since 2019."
      />

      {/* Mission */}
      <section className="py-24 md:py-32 bg-white relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-30 pointer-events-none" />

        <div className="container max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-7 flex flex-col justify-center">
              <span className="inline-flex items-center gap-2 py-2 px-4 rounded-full bg-orange-50 text-[#FF6600] text-xs font-black uppercase tracking-widest w-max mb-8 border border-orange-100">
                <span className="w-2 h-2 rounded-full bg-[#FF6600] animate-pulse" />
                The Creative Monk Story
              </span>
              <h2
                className="text-4xl md:text-5xl lg:text-[3.5rem] font-black text-gray-900 leading-[1.05] mb-8"
                style={{ fontFamily: "var(--font-poppins)" }}
              >
                We don&apos;t just market.
                <br />
                We <span className="text-[#FF6600]">Build Legacies.</span>
              </h2>
              <div className="space-y-6 text-lg md:text-xl text-gray-600 leading-relaxed font-light">
                <p>
                  The Creative Monk is a bespoke full-services digital agency in
                  Chandigarh. We are a team of enthusiastic young professionals
                  dedicated to building powerful online reputations that deliver
                  long-term value.
                </p>
                <p>
                  We don&apos;t just provide marketing; we offer a complete
                  synergy of visual design, technical expertise, and strategic
                  digital solutions. From ROI-driven campaigns to
                  high-performance web ecosystems, we ensure your brand stands
                  out in the crowd.
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mt-14 bg-gray-50 rounded-[2rem] p-8 border border-gray-100/50">
                <div>
                  <p className="text-4xl font-black text-gray-900 tracking-tight">
                    140+
                  </p>
                  <p className="text-xs font-bold text-gray-500 mt-2 uppercase tracking-widest">
                    Projects Delivered
                  </p>
                </div>
                <div>
                  <p className="text-4xl font-black text-gray-900 tracking-tight">
                    5+
                  </p>
                  <p className="text-xs font-bold text-gray-500 mt-2 uppercase tracking-widest">
                    Years Exp.
                  </p>
                </div>
                <div>
                  <p className="text-4xl font-black text-gray-900 tracking-tight">
                    180+
                  </p>
                  <p className="text-xs font-bold text-gray-500 mt-2 uppercase tracking-widest">
                    Projects done
                  </p>
                </div>
                <div>
                  <p className="text-4xl font-black text-gray-900 tracking-tight">
                    15+
                  </p>
                  <p className="text-xs font-bold text-gray-500 mt-2 uppercase tracking-widest">
                    Industries
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 relative mt-10 lg:mt-0">
              <div className="absolute inset-0 bg-gradient-to-br from-[#FF6600] to-pink-500 rounded-[2.5rem] transform rotate-3 scale-105 opacity-20 blur-2xl transition-all duration-700 hover:rotate-6 hover:scale-110"></div>
              <div className="bg-gray-950 rounded-[2.5rem] p-10 md:p-14 relative z-10 h-full flex flex-col justify-center overflow-hidden border border-white/10 shadow-2xl">
                {/* abstract background element */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#FF6600]/10 rounded-full blur-3xl pointer-events-none"></div>

                <h3
                  className="text-3xl md:text-4xl font-black text-white mb-12"
                  style={{ fontFamily: "var(--font-poppins)" }}
                >
                  Our Core Values
                </h3>
                <div className="space-y-10 relative z-20">
                  <div className="flex gap-6 items-start group">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 group-hover:bg-[#FF6600]/20 transition-colors flex items-center justify-center shrink-0 border border-white/10">
                      <Target className="w-6 h-6 text-[#FF6600]" />
                    </div>
                    <div>
                      <h4
                        className="text-white font-bold text-xl mb-2"
                        style={{ fontFamily: "var(--font-poppins)" }}
                      >
                        Our Mission
                      </h4>
                      <p className="text-gray-400 text-sm leading-relaxed">
                        To constantly strive to provide ROI-driven marketing
                        strategies while educating our clients on every phase of
                        their campaigns.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-6 items-start group">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 group-hover:bg-[#FF6600]/20 transition-colors flex items-center justify-center shrink-0 border border-white/10">
                      <TrendingUp className="w-6 h-6 text-[#FF6600]" />
                    </div>
                    <div>
                      <h4
                        className="text-white font-bold text-xl mb-2"
                        style={{ fontFamily: "var(--font-poppins)" }}
                      >
                        Our Vision
                      </h4>
                      <p className="text-gray-400 text-sm leading-relaxed">
                        Passion defines our company — when passion and
                        technology work together, miracles happen.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-6 items-start group">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 group-hover:bg-[#FF6600]/20 transition-colors flex items-center justify-center shrink-0 border border-white/10">
                      <Zap className="w-6 h-6 text-[#FF6600]" />
                    </div>
                    <div>
                      <h4
                        className="text-white font-bold text-xl mb-2"
                        style={{ fontFamily: "var(--font-poppins)" }}
                      >
                        Our Objective
                      </h4>
                      <p className="text-gray-400 text-sm leading-relaxed">
                        Enhancing business value through innovative and economic
                        Web, Marketing, and Graphic solutions.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section
        className="section-padding"
        style={{ background: "#fafafa" }}
        id="team"
      >
        <div className="container">
          <div className="text-center mb-16">
            <span className="section-label block mb-3">Meet the Team</span>
            <h2
              className="text-3xl md:text-5xl font-black"
              style={{ fontFamily: "var(--font-poppins)" }}
            >
              The <span style={{ color: "#FF6600" }}>Minds</span> Behind
              Creative Monk
            </h2>
          </div>
          <div className="mb-20">
            <div className="text-center mb-10">
              <h3
                className="text-2xl font-bold text-gray-900"
                style={{ fontFamily: "var(--font-poppins)" }}
              >
                Meet Our <span className="text-[#FF6600]">Founder</span>
              </h3>
            </div>
            <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100 flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
              <div className="relative">
                <div
                  className="h-32 w-32 md:h-40 md:w-40 rounded-[2rem] flex items-center justify-center text-white font-black text-5xl shadow-2xl shadow-orange-500/20"
                  style={{ background: founder.color }}
                >
                  {founder.initials}
                </div>
                <a
                  href={founder.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute -bottom-4 -right-4 bg-[#0A66C2] text-white p-3 rounded-xl border-4 border-white hover:scale-110 shadow-lg transition-transform"
                  aria-label={`LinkedIn of ${founder.name}`}
                >
                  <Linkedin className="w-6 h-6" />
                </a>
              </div>
              <div className="flex-1 mt-2">
                <h3
                  className="font-black text-3xl md:text-4xl text-gray-900 mb-2"
                  style={{ fontFamily: "var(--font-poppins)" }}
                >
                  {founder.name}
                </h3>
                <p className="text-xl font-bold text-[#FF6600] tracking-wide mb-4">
                  {founder.role}
                </p>
                <p className="text-gray-600 text-lg leading-relaxed">
                  {founder.bio}
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mb-10">
            <h3
              className="text-2xl font-bold text-gray-900"
              style={{ fontFamily: "var(--font-poppins)" }}
            >
              Our Incredible <span className="text-[#FF6600]">Team</span>
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {team.map((member: any) => (
              <div
                key={member.name}
                className="group card-hover text-center bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-500"
              >
                <div className="relative mx-auto mb-8 w-max">
                  <div
                    className="h-28 w-28 rounded-3xl rotate-3 group-hover:-rotate-3 transition-transform duration-500 flex items-center justify-center text-white font-black text-4xl shadow-lg"
                    style={{ background: member.color }}
                  >
                    {member.initials}
                  </div>
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute -bottom-3 -right-3 bg-[#0A66C2] text-white p-2.5 rounded-xl border-[3px] border-white hover:scale-110 shadow-md transition-transform"
                    aria-label={`LinkedIn of ${member.name}`}
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                </div>
                <h3
                  className="font-black text-2xl mb-1 text-gray-900 group-hover:text-[#FF6600] transition-colors"
                  style={{ fontFamily: "var(--font-poppins)" }}
                >
                  {member.name}
                </h3>
                <p
                  className="text-sm font-bold uppercase tracking-wider mb-4"
                  style={{ color: "#FF6600" }}
                >
                  {member.role}
                </p>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline / Milestones */}
      <section className="py-24 bg-gray-50 border-t border-gray-100">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="text-center mb-16 md:mb-24">
            <span className="inline-flex items-center gap-2 py-2 px-4 rounded-full bg-white text-[#FF6600] text-xs font-black uppercase tracking-widest w-max mb-6 border border-gray-200 shadow-sm">
              Our Journey
            </span>
            <h2
              className="text-4xl md:text-5xl font-black tracking-tight"
              style={{ fontFamily: "var(--font-poppins)" }}
            >
              Milestones That <span className="text-[#FF6600]">Define Us</span>
            </h2>
          </div>

          <div className="relative">
            {/* The vertical timeline line */}
            <div className="absolute left-6 md:left-1/2 md:-ml-[1.5px] top-6 bottom-6 w-[3px] bg-gradient-to-b from-orange-200 via-orange-400 to-orange-200 rounded-full" />

            <div className="space-y-12 md:space-y-0 relative">
              {milestones.map((m, idx) => {
                const isEven = idx % 2 === 0;
                return (
                  <div
                    key={m.year}
                    className={`relative flex flex-col md:flex-row items-start md:items-center ${isEven ? "md:justify-start" : "md:justify-end"} md:py-10 group`}
                  >
                    {/* The Dot */}
                    <div className="absolute left-6 md:left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-white border-4 border-[#FF6600] z-10 flex items-center justify-center font-black text-sm text-[#FF6600] shadow-[0_0_0_8px_white] transition-transform duration-300 group-hover:scale-110">
                      &apos;{m.year.slice(2)}
                    </div>

                    {/* Content Card */}
                    <div
                      className={`ml-20 md:ml-0 md:w-[calc(50%-4rem)] ${isEven ? "md:pr-8 md:text-right" : "md:pl-8 md:text-left"}`}
                    >
                      <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm group-hover:shadow-xl transition-all duration-300 relative">
                        <span
                          className="text-3xl font-black opacity-10 absolute -top-4 -right-2 tracking-tighter"
                          style={{
                            color: "#FF6600",
                            fontFamily: "var(--font-display)",
                          }}
                        >
                          {m.year}
                        </span>
                        <h4
                          className="text-xl font-bold text-gray-900 leading-tight relative z-10"
                          style={{ fontFamily: "var(--font-poppins)" }}
                        >
                          {m.event}
                        </h4>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <CTA />
    </>
  );
}
