"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ExternalLink } from "lucide-react";
import { getCaseStudies } from "@/lib/api";
import type { CaseStudy } from "@/lib/types";

export function CaseStudies() {
  const [projects, setProjects] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCaseStudies() {
      try {
        const data = await getCaseStudies({ limit: 3 });
        setProjects(data);
      } catch (error) {
        console.error("Failed to fetch case studies:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCaseStudies();
  }, []);

  if (loading) {
    return (
      <section className="py-24 bg-white relative">
        <div className="container text-center">
          <div className="w-8 h-8 rounded-full border-4 border-orange-500 border-t-transparent animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading Case Studies...</p>
        </div>
      </section>
    );
  }

  if (projects.length === 0) return null;

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="container relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block py-1.5 px-4 rounded-full bg-orange-100 text-[#FF6600] text-sm font-bold tracking-widest uppercase mb-6"
            >
              Case Studies
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-black text-gray-900 leading-tight"
              style={{ fontFamily: "var(--font-poppins)" }}
            >
              Real World{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6600] to-orange-400">
                Impact
              </span>
            </motion.h2>
          </div>
          <motion.a
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            href="/portfolio"
            className="group flex items-center gap-2 text-[#FF6600] font-semibold hover:text-orange-700 transition-colors"
          >
            View All Case Studies
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, idx) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 flex flex-col"
            >
              <div className="relative h-64 overflow-hidden bg-gray-100">
                <img
                  src={project.image || "/placeholder.jpg"}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-bold uppercase tracking-wider rounded-full shadow-sm">
                    {project.category}
                  </span>
                </div>
              </div>
              <div className="p-8 flex flex-col flex-1">
                <h3
                  className="text-xl md:text-2xl font-bold text-gray-900 mb-3"
                  style={{ fontFamily: "var(--font-poppins)" }}
                >
                  {project.title}
                </h3>
                <p className="text-gray-600 mb-6 line-clamp-3 flex-1">
                  {project.description}
                </p>
                {project.id && (
                  <a
                    href={`/case-studies/${project.id}`}
                    className="inline-flex items-center gap-2 text-sm font-bold text-gray-900 group-hover:text-[#FF6600] transition-colors mt-auto"
                  >
                    Read Full Case Study
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
