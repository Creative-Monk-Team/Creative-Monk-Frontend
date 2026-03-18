"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { getCaseStudies } from "@/lib/api";
import type { CaseStudy } from "@/lib/types";

export default function CaseStudiesPage() {
  const [projects, setProjects] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCaseStudies() {
      try {
        const data = await getCaseStudies();
        setProjects(data);
      } catch (error) {
        console.error("Failed to fetch case studies:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCaseStudies();
  }, []);

  return (
    <main className="min-h-screen bg-white flex flex-col pt-0">
      {/* Header Section */}
      <PageHeader
        badge="Proven Results"
        title1="Case"
        title2="Studies."
        description="Explore how we've helped diverse brands overcome challenges and scale their digital growth through data-driven precision."
      />

      {/* Content Section */}
      <div className="flex-1 py-16">
        <div className="container px-4 lg:px-12 mx-auto max-w-[1600px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-10 h-10 rounded-full border-4 border-orange-500 border-t-transparent animate-spin mb-4"></div>
              <p className="text-gray-500 font-medium">
                Loading amazing results...
              </p>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">
                No case studies available at the moment.
              </p>
            </div>
          ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {projects.map((project, idx) => (
                  <motion.div
                    key={project._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-300 hover:-translate-y-2 flex flex-col"
                >
                  <div className="relative h-60 overflow-hidden bg-gray-100">
                    <img
                      src={project.image || "/placeholder.jpg"}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {/* Gradient Overlay on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="absolute top-4 left-4 z-10">
                      <span className="px-3 py-1.5 bg-white/95 backdrop-blur-sm text-gray-900 text-[10px] font-bold uppercase tracking-widest rounded-full shadow-sm">
                        {project.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-8 flex flex-col flex-1">
                    <h3
                      className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#FF6600] transition-colors"
                      style={{ fontFamily: "var(--font-poppins)" }}
                    >
                      {project.title}
                    </h3>
                    <p className="text-gray-600 mb-6 line-clamp-3 flex-1 text-sm leading-relaxed">
                      {project.description}
                    </p>
                    <a
                      href={`/case-studies/${project.id}`}
                      className="inline-flex items-center gap-2 text-sm font-bold text-gray-900 group-hover:text-[#FF6600] transition-colors mt-auto w-max"
                    >
                      Read Full Case Study
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          <div className="mt-16 text-center">
            <Link href="/contact" className="btn-primary inline-flex">
              Start Your Own Success Story
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
