"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Award,
  Users,
  Briefcase,
  Rocket,
  Target,
  ShieldCheck,
  Zap,
  Users2,
  BarChart3,
} from "lucide-react";
import { getSiteSettings } from "@/lib/api";
import type { SiteSettings } from "@/lib/types";

// Map labels to icons
const iconMap: Record<string, any> = {
  "startup projects": Briefcase,
  "happy clients": Users,
  "industries served": TrendingUp,
  "years experience": Award,
  projects: Briefcase,
  clients: Users,
};

const defaultStats = [
  { icon: Briefcase, number: "180+", label: "Startup Projects" },
  { icon: Users, number: "250+", label: "Happy Clients" },
  { icon: TrendingUp, number: "15+", label: "Industries Served" },
  { icon: Award, number: "5+", label: "Years Experience" },
];

const defaultFeatures = [
  {
    icon: Rocket,
    title: "Optimized Performance",
    description:
      "We build blazing fast, highly optimized websites that rank higher and convert better.",
  },
  {
    icon: Zap,
    title: "Agile Methodology",
    description:
      "Our agile development process ensures quick turnaround times and flexibility to adapt.",
  },
  {
    icon: Target,
    title: "Business-First Approach",
    description:
      "Our strategies are laser-focused on your business goals, maximizing ROI and growth.",
  },
  {
    icon: ShieldCheck,
    title: "Uncompromising Quality",
    description:
      "We never cut corners. Our certified team delivers premium quality digital solutions.",
  },
  {
    icon: Users2,
    title: "Expert Team",
    description:
      "No stressing as we've got an expert team of certified developers, designers, and marketers.",
  },
  {
    icon: BarChart3,
    title: "Results Driven",
    description:
      "We don't just deliver projects; we deliver measurable results and tangible business growth.",
  },
];

export function Stats() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const data = await getSiteSettings();
        setSettings(data);
      } catch (error) {
        console.error("Failed to fetch settings:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const displayStats = settings?.stats?.length
    ? settings.stats.map((s) => ({
        icon: iconMap[s.label.toLowerCase()] || Zap,
        number: s.value,
        label: s.label,
      }))
    : defaultStats;

  const displayFeatures = settings?.values?.length
    ? settings.values.map((v, i) => ({
        icon: defaultFeatures[i]?.icon || Zap,
        title: v.title,
        description: v.description,
      }))
    : defaultFeatures;

  return (
    <section className="py-24 bg-gray-50 relative overflow-hidden">
      <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 rounded-full bg-orange-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-96 h-96 rounded-full bg-orange-600/10 blur-3xl pointer-events-none" />

      <div className="container relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block py-1.5 px-4 rounded-full bg-orange-100 text-[#FF6600] text-sm font-bold tracking-widest uppercase mb-6"
          >
            Why Creative Monk
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 text-gray-900 leading-tight"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            Why{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6600] to-orange-400">
              Choose Us
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto"
          >
            {settings?.description ||
              "We are focused on enhancing the value of your business through our innovative and economic digital solutions."}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24 cursor-default">
          {displayFeatures.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(255,102,0,0.12)] transition-all duration-300 border border-gray-100/50 group hover:-translate-y-2 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-100 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-[#FF6600] group-hover:shadow-lg group-hover:shadow-orange-500/30 transition-all duration-500">
                  <feature.icon className="w-8 h-8 text-[#FF6600] group-hover:text-white transition-colors duration-500" />
                </div>
                <h3
                  className="text-xl md:text-2xl font-black text-gray-900 mb-4 group-hover:text-[#FF6600] transition-colors duration-300"
                  style={{ fontFamily: "var(--font-outfit)" }}
                >
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-base">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-[2.5rem] p-10 md:p-16 relative overflow-hidden shadow-2xl shadow-orange-500/20"
          style={{ background: "linear-gradient(135deg, #FF6600, #e55500)" }}
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-[0.07] rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-black opacity-[0.05] rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />

          <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8 divide-x-0 md:divide-x divide-white/20">
            {displayStats.map((stat, idx) => (
              <div
                key={idx}
                className="text-center px-4 flex flex-col items-center group cursor-default"
              >
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md group-hover:scale-110 group-hover:bg-white/20 transition-all duration-300">
                  <stat.icon className="w-7 h-7 text-white" />
                </div>
                <div
                  className="text-4xl md:text-5xl font-black text-white mb-3 tracking-tight group-hover:scale-105 transition-transform duration-300"
                  style={{ fontFamily: "var(--font-outfit)" }}
                >
                  {stat.number}
                </div>
                <div className="text-white/80 font-semibold tracking-wider uppercase text-sm">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
