"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ExternalLink,
  CheckCircle2,
  TrendingUp,
  Target,
  Clock,
  Zap,
  Quote,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { apiService } from "@/lib/api";

interface Metric {
  label: string;
  value: string;
}

interface Testimonial {
  text: string;
  author: string;
  role: string;
}

interface ProjectDetail {
  id: string;
  title: string;
  description: string;
  content?: string;
  image: string;
  category: string;
  client?: string;
  link?: string;
  duration?: string;
  services?: string[];
  challenges?: string[];
  solutions?: string[];
  results?: string[];
  metrics?: Metric[];
  gallery?: string[];
  testimonial?: Testimonial;
}

export default function CaseStudyDetailPage() {
  const { id } = useParams();
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCaseStudy() {
      try {
        const data = await apiService.getCaseStudyById(id as string);
        setProject(data);
      } catch (error) {
        console.error("Failed to fetch case study:", error);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchCaseStudy();
    }
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center pt-8">
        <div className="flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-full border-4 border-orange-500 border-t-transparent animate-spin mb-4"></div>
          <p className="text-gray-500 font-medium text-lg">
            Loading Case Study...
          </p>
        </div>
      </main>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2
            className="text-3xl font-bold text-gray-900 mb-4"
            style={{ fontFamily: "var(--font-poppins)" }}
          >
            Case Study Not Found
          </h2>
          <p className="text-gray-600 mb-8">
            We couldn't find the case study you were looking for.
          </p>
          <Link href="/case-studies" className="btn-primary inline-flex gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Case Studies
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <section className="bg-white border-b border-gray-100 py-16 md:py-24 relative overflow-hidden">
        <div className="container relative z-10">
          <Link
            href="/case-studies"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-[#FF6600] transition-colors mb-8 md:mb-12 font-medium"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Case Studies
          </Link>

          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
            <div className="flex-1 w-full order-2 lg:order-1">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="relative rounded-[2rem] overflow-hidden shadow-2xl shadow-orange-500/10 aspect-video lg:aspect-[4/3] w-full"
              >
                <img
                  src={project.image || "/placeholder.jpg"}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </div>
            <div className="flex-1 w-full order-1 lg:order-2">
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-block py-1.5 px-4 rounded-full bg-orange-100 text-[#FF6600] text-sm font-bold tracking-widest uppercase mb-6"
              >
                {project.category}
              </motion.span>
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-tight mb-6"
                style={{ fontFamily: "var(--font-poppins)" }}
              >
                {project.title}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-gray-600 text-lg md:text-xl leading-relaxed mb-8"
              >
                {project.description}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="grid grid-cols-2 md:grid-cols-3 gap-4"
              >
                {project.client && (
                  <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <div className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">
                      Client
                    </div>
                    <div className="text-gray-900 font-bold text-sm">
                      {project.client}
                    </div>
                  </div>
                )}
                {project.duration && (
                  <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <div className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Duration
                    </div>
                    <div className="text-gray-900 font-bold text-sm">
                      {project.duration}
                    </div>
                  </div>
                )}
                {project.services && project.services.length > 0 && (
                  <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm md:col-span-1 col-span-2">
                    <div className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                      <Zap className="w-3 h-3" /> Services
                    </div>
                    <div className="text-gray-900 font-bold text-xs leading-relaxed">
                      {project.services.join(", ")}
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Sections */}
      <section className="py-20">
        <div className="container max-w-[1000px] space-y-24 mx-auto px-4">
          {/* Project Overview Content */}
          {project.content && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="prose prose-lg md:prose-xl max-w-none text-gray-600 leading-relaxed"
            >
              <h2
                className="text-3xl font-bold text-gray-900 mb-6"
                style={{ fontFamily: "var(--font-poppins)" }}
              >
                Project Overview
              </h2>
              <p className="whitespace-pre-line">{project.content}</p>
            </motion.div>
          )}

          {/* Challenges & Solutions */}
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
            {/* Challenges */}
            {project.challenges && project.challenges.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <div
                  className="flex items-center gap-3 text-2xl font-bold text-gray-900 mb-6"
                  style={{ fontFamily: "var(--font-poppins)" }}
                >
                  <Target className="text-red-500 w-8 h-8 p-1.5 bg-red-50 rounded-lg" />
                  <h2>The Challenge</h2>
                </div>
                <div className="space-y-4">
                  {project.challenges.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex gap-4 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm"
                    >
                      <div className="w-2 h-2 mt-2 rounded-full bg-red-400 shrink-0"></div>
                      <p className="text-gray-700 font-medium">{item}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Solutions */}
            {project.solutions && project.solutions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <div
                  className="flex items-center gap-3 text-2xl font-bold text-gray-900 mb-6"
                  style={{ fontFamily: "var(--font-poppins)" }}
                >
                  <CheckCircle2 className="text-[#FF6600] w-8 h-8 p-1.5 bg-orange-50 rounded-lg" />
                  <h2>Our Solution</h2>
                </div>
                <div className="space-y-4">
                  {project.solutions.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex gap-4 p-5 bg-orange-50/50 rounded-2xl border border-orange-100/50"
                    >
                      <div className="w-2 h-2 mt-2 rounded-full bg-[#FF6600] shrink-0"></div>
                      <p className="text-gray-700 font-medium">{item}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Gallery */}
          {project.gallery && project.gallery.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <h2
                className="text-3xl font-bold text-gray-900"
                style={{ fontFamily: "var(--font-poppins)" }}
              >
                Project Gallery
              </h2>
              <div
                className={`grid grid-cols-1 ${project.gallery.length > 1 ? "md:grid-cols-2" : ""} gap-6`}
              >
                {project.gallery.map((img, idx) => (
                  <div
                    key={idx}
                    className="rounded-3xl overflow-hidden shadow-lg aspect-[4/3]"
                  >
                    <img
                      src={img}
                      alt={`${project.title} gallery ${idx + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Testimonial */}
          {project.testimonial && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gray-900 rounded-[2.5rem] p-10 md:p-16 relative overflow-hidden"
            >
              <Quote className="absolute -top-6 -left-6 w-48 h-48 text-white/5 -rotate-12" />
              <div className="relative z-10 text-center max-w-3xl mx-auto">
                <p className="text-2xl md:text-3xl text-gray-100 leading-relaxed font-medium mb-8">
                  "{project.testimonial.text}"
                </p>
                <div>
                  <div className="text-[#FF6600] font-bold text-lg">
                    {project.testimonial.author}
                  </div>
                  <div className="text-gray-400 text-sm">
                    {project.testimonial.role}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Results & Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-orange-50 rounded-[2.5rem] p-10 md:p-16 border border-orange-100"
          >
            <div className="text-center max-w-2xl mx-auto mb-12">
              <TrendingUp className="text-[#FF6600] w-12 h-12 mx-auto mb-6" />
              <h2
                className="text-3xl md:text-4xl font-bold mb-4 text-gray-900"
                style={{ fontFamily: "var(--font-poppins)" }}
              >
                The Impact
              </h2>
              <p className="text-gray-600 text-lg">
                Measurable results that transformed the client's business
                trajectory.
              </p>
            </div>

            {/* Big Metrics */}
            {project.metrics && project.metrics.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {project.metrics.map((metric, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl p-8 border border-gray-100 text-center shadow-sm"
                  >
                    <span
                      className="block text-4xl lg:text-5xl font-black text-[#FF6600] mb-2"
                      style={{ fontFamily: "var(--font-poppins)" }}
                    >
                      {metric.value}
                    </span>
                    <span className="text-gray-600 font-bold text-sm uppercase tracking-wider">
                      {metric.label}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Additional Results List */}
            {project.results && project.results.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {project.results.map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="w-1.5 h-1.5 mt-2.5 rounded-full bg-[#FF6600] shrink-0"></div>
                    <p className="text-gray-700 font-medium">{item}</p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* External Link */}
          {project.link && (
            <div className="text-center pt-8">
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex gap-2 text-lg px-8 py-4"
              >
                Visit Live Project <ExternalLink className="w-5 h-5" />
              </a>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
