"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Expand,
  ExternalLink,
  Quote,
  Target,
  TrendingUp,
  X,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { getCaseStudy } from "@/lib/api";
import type { CaseStudy } from "@/lib/types";

function splitResults(results: string[] = []) {
  if (results.length <= 3) return [results];

  const chunkSize = Math.ceil(results.length / 3);
  return Array.from({ length: Math.ceil(results.length / chunkSize) }, (_, index) =>
    results.slice(index * chunkSize, index * chunkSize + chunkSize),
  );
}

export default function CaseStudyDetailPage() {
  const { id } = useParams();
  const [project, setProject] = useState<CaseStudy | null>(null);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    async function fetchCaseStudy() {
      try {
        const data = await getCaseStudy(id as string);
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

  const galleryImages = useMemo(() => {
    if (!project) return [];

    const items = [...(project.gallery || [])];
    if (project.image && !items.includes(project.image)) {
      items.unshift(project.image);
    }

    return items;
  }, [project]);

  useEffect(() => {
    if (lightboxIndex === null || galleryImages.length === 0) return undefined;

    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setLightboxIndex(null);
      }

      if (event.key === "ArrowRight") {
        setLightboxIndex((current) =>
          current === null ? current : (current + 1) % galleryImages.length,
        );
      }

      if (event.key === "ArrowLeft") {
        setLightboxIndex((current) =>
          current === null
            ? current
            : (current - 1 + galleryImages.length) % galleryImages.length,
        );
      }
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [galleryImages.length, lightboxIndex]);

  if (loading) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center pt-8">
        <div className="flex flex-col items-center justify-center">
          <div className="mb-4 h-12 w-12 rounded-full border-4 border-orange-500 border-t-transparent animate-spin" />
          <p className="text-lg font-medium text-gray-500">Loading Case Study...</p>
        </div>
      </main>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2
            className="mb-4 text-3xl font-bold text-gray-900"
            style={{ fontFamily: "var(--font-poppins)" }}
          >
            Case Study Not Found
          </h2>
          <p className="mb-8 text-gray-600">
            We couldn't find the case study you were looking for.
          </p>
          <Link href="/case-studies" className="btn-primary inline-flex gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Case Studies
          </Link>
        </div>
      </div>
    );
  }

  const resultColumns = splitResults(project.results || []);
  const activeLightboxImage =
    lightboxIndex !== null && galleryImages[lightboxIndex]
      ? galleryImages[lightboxIndex]
      : null;

  return (
    <>
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(255,122,26,0.18),_transparent_34%),linear-gradient(180deg,_#1e1c1b_0%,_#161412_48%,_#ffffff_100%)] pt-14 pb-16 md:pt-20 md:pb-22 lg:pt-24 lg:pb-26">
        <div className="absolute inset-0">
          <img
            src={project.image || "/placeholder.jpg"}
            alt={project.title}
            className="h-full w-full object-cover opacity-16"
          />
          <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(15,12,10,0.96)_14%,rgba(15,12,10,0.86)_52%,rgba(15,12,10,0.45)_100%)]" />
          <div className="absolute right-[-10%] top-20 h-72 w-72 rounded-full bg-orange-500/18 blur-3xl" />
          <div className="absolute bottom-0 left-[-8%] h-64 w-64 rounded-full bg-white/8 blur-3xl" />
        </div>
        <div className="container relative z-10">
          <Link
            href="/case-studies"
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.22em] text-white/72 backdrop-blur-sm transition-all hover:border-orange-400/40 hover:bg-white/10 hover:text-white md:mb-10 md:px-5 md:py-3 md:text-xs"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Case Studies
          </Link>

          <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] lg:gap-14">
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.05 }}
              className="order-2 w-full lg:order-2"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[2rem] border border-white/10 bg-black/20 shadow-[0_30px_80px_rgba(0,0,0,0.28)]">
                <img
                  src={project.image || "/placeholder.jpg"}
                  alt={project.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                {galleryImages.length > 1 ? (
                  <button
                    type="button"
                    onClick={() => setLightboxIndex(0)}
                    className="absolute right-4 bottom-4 inline-flex items-center gap-2 rounded-full bg-black/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-sm transition-colors hover:bg-black/75"
                  >
                    <Expand className="h-4 w-4" />
                    Open Gallery
                  </button>
                ) : null}
              </div>
            </motion.div>

            <div className="order-1 w-full lg:order-1">
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-5 inline-flex rounded-full border border-orange-400/30 bg-orange-500/12 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.24em] text-orange-200 md:mb-6"
              >
                {project.category}
              </motion.span>
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 }}
                className="mb-5 text-[3rem] font-black leading-[0.95] tracking-[-0.055em] text-white md:mb-6 md:text-5xl lg:text-[5.5rem]"
                style={{ fontFamily: "var(--font-poppins)" }}
              >
                {project.title}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.16 }}
                className="mb-7 max-w-2xl text-[1.05rem] leading-8 text-white/76 md:mb-8 md:text-xl"
              >
                {project.description}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.24 }}
                className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3"
              >
                {project.client && (
                  <InfoCard label="Client" value={project.client} dark />
                )}
                {project.duration && (
                  <InfoCard
                    label="Duration"
                    value={project.duration}
                    icon={<Clock className="h-3.5 w-3.5" />}
                    dark
                  />
                )}
                {project.services && project.services.length > 0 && (
                  <InfoCard
                    label="Services"
                    value={project.services.join(", ")}
                    icon={<Zap className="h-3.5 w-3.5" />}
                    wide
                    dark
                  />
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 md:py-18 lg:py-20">
        <div className="container mx-auto max-w-[1120px] space-y-16 md:space-y-20">
          {project.content && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm md:p-10"
            >
              <span className="section-label">Overview</span>
              <h2
                className="mt-3 text-[2rem] font-black leading-tight text-gray-900 md:text-4xl"
                style={{ fontFamily: "var(--font-poppins)" }}
              >
                Project Overview
              </h2>
              <p className="mt-5 whitespace-pre-line text-[15px] leading-8 text-gray-600 md:text-lg">
                {project.content}
              </p>
            </motion.div>
          )}

          {(project.challenges?.length || project.solutions?.length) && (
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
              {project.challenges && project.challenges.length > 0 && (
                <ContentPanel
                  title="The Challenge"
                  icon={
                    <Target className="h-6 w-6 rounded-xl bg-red-50 p-1.5 text-red-500" />
                  }
                  items={project.challenges}
                  itemDotClassName="bg-red-400"
                  cardClassName="border-gray-100 bg-white"
                />
              )}

              {project.solutions && project.solutions.length > 0 && (
                <ContentPanel
                  title="Our Solution"
                  icon={
                    <CheckCircle2 className="h-6 w-6 rounded-xl bg-orange-50 p-1.5 text-[#FF6600]" />
                  }
                  items={project.solutions}
                  itemDotClassName="bg-[#FF6600]"
                  cardClassName="border-orange-100 bg-orange-50/60"
                />
              )}
            </div>
          )}

          {galleryImages.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <span className="section-label">Showcase</span>
                  <h2
                    className="mt-3 text-[2rem] font-black leading-tight text-gray-900 md:text-4xl"
                    style={{ fontFamily: "var(--font-poppins)" }}
                  >
                    Project Gallery
                  </h2>
                </div>
                <p className="max-w-xl text-sm leading-7 text-gray-500 md:text-base">
                  Swipe through the key visuals and tap any image to open a larger preview.
                </p>
              </div>

              <div className="relative">
                <Swiper
                  modules={[Navigation]}
                  navigation={{
                    prevEl: ".case-study-gallery-prev",
                    nextEl: ".case-study-gallery-next",
                  }}
                  spaceBetween={18}
                  slidesPerView={1.15}
                  breakpoints={{
                    640: { slidesPerView: 1.5 },
                    1024: { slidesPerView: 3 },
                  }}
                  className="!overflow-visible"
                >
                  {galleryImages.map((img, idx) => (
                    <SwiperSlide key={`${img}-${idx}`}>
                      <button
                        type="button"
                        onClick={() => setLightboxIndex(idx)}
                        className="group relative block w-full overflow-hidden rounded-[1.8rem] border border-gray-100 bg-white shadow-sm"
                      >
                        <div className="absolute top-4 right-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm transition-transform group-hover:scale-105">
                          <Expand className="h-4 w-4" />
                        </div>
                        <div className="aspect-[4/3] overflow-hidden">
                          <img
                            src={img}
                            alt={`${project.title} gallery ${idx + 1}`}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        </div>
                      </button>
                    </SwiperSlide>
                  ))}
                </Swiper>

                {galleryImages.length > 1 ? (
                  <div className="mt-6 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      className="case-study-gallery-prev inline-flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm transition-colors hover:border-orange-200 hover:text-[#FF6600]"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      className="case-study-gallery-next inline-flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm transition-colors hover:border-orange-200 hover:text-[#FF6600]"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                ) : null}
              </div>
            </motion.div>
          )}

          {project.testimonial?.text && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative overflow-hidden rounded-[2.3rem] bg-gray-900 px-6 py-10 md:px-10 md:py-14"
            >
              <Quote className="absolute -top-5 -left-5 h-36 w-36 rotate-[-12deg] text-white/5 md:h-48 md:w-48" />
              <div className="relative z-10 mx-auto max-w-3xl text-center">
                <p className="text-[1.45rem] leading-[1.55] text-gray-100 md:text-[2rem]">
                  "{project.testimonial.text}"
                </p>
                <div className="mt-8">
                  <div className="text-lg font-bold text-[#FF6600]">
                    {project.testimonial.author}
                  </div>
                  <div className="mt-1 text-sm text-gray-400">
                    {project.testimonial.role}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="overflow-hidden rounded-[2.3rem] border border-[#221913] bg-[radial-gradient(circle_at_top,_rgba(255,122,26,0.14),_transparent_34%),linear-gradient(180deg,_#1b1612_0%,_#14110f_100%)] px-6 py-8 text-white shadow-[0_30px_80px_rgba(17,12,10,0.24)] md:px-10 md:py-12"
          >
            <div className="mx-auto mb-8 max-w-2xl text-center md:mb-12">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/6 text-[#FF6600] shadow-sm backdrop-blur-sm">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h2
                className="text-[1.8rem] font-black text-white md:text-[2.6rem]"
                style={{ fontFamily: "var(--font-poppins)" }}
              >
                The Impact
              </h2>
              <p className="mt-4 text-[15px] leading-7 text-white/65 md:text-lg">
                Measurable results that transformed the client's business trajectory.
              </p>
            </div>

            {project.metrics && project.metrics.length > 0 && (
              <div className="mb-8 grid gap-4 md:mb-12 md:grid-cols-2 xl:grid-cols-3">
                {project.metrics.map((metric, idx) => (
                  <div
                    key={idx}
                    className="rounded-[1.8rem] border border-white/10 bg-white/6 px-5 py-6 text-left shadow-[0_20px_60px_rgba(0,0,0,0.16)] backdrop-blur-sm md:px-6 md:py-8"
                  >
                    <span className="mb-4 inline-flex rounded-full border border-orange-400/20 bg-orange-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-orange-200">
                      Key Metric
                    </span>
                    <span
                      className="block text-[2rem] font-black leading-[0.95] text-[#FF6600] md:text-[2.6rem]"
                      style={{ fontFamily: "var(--font-poppins)" }}
                    >
                      {metric.value}
                    </span>
                    <span className="mt-4 block text-[11px] font-bold uppercase tracking-[0.2em] text-white/55 md:text-sm">
                      {metric.label}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {project.results && project.results.length > 0 && (
              <div className="border-t border-white/10 pt-8 md:pt-10">
                <div className="mb-6 flex flex-col gap-2 md:mb-8">
                  <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-orange-200">
                    Outcome Highlights
                  </span>
                  <p className="max-w-2xl text-sm leading-7 text-white/60 md:text-base">
                    The project created a stronger foundation for positioning, conversion clarity, and future growth execution.
                  </p>
                </div>

                <div className={`grid gap-4 ${resultColumns.length > 1 ? "lg:grid-cols-3" : "md:grid-cols-2"}`}>
                {resultColumns.map((column, columnIndex) => (
                  <div
                    key={columnIndex}
                    className="space-y-4 rounded-[1.7rem] border border-white/10 bg-white/4 p-5 backdrop-blur-sm"
                  >
                    {column.map((item, idx) => (
                      <div key={`${columnIndex}-${idx}`} className="flex gap-4">
                        <div className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#FF6600]" />
                        <p className="text-[15px] font-medium leading-8 text-white/84 md:text-base">
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>
                ))}
                </div>
              </div>
            )}
          </motion.div>

          {project.link && (
            <div className="pt-2 text-center">
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex gap-2 px-7 py-4 text-base md:text-lg"
              >
                Visit Live Project <ExternalLink className="h-5 w-5" />
              </a>
            </div>
          )}
        </div>
      </section>

      <Dialog open={lightboxIndex !== null} onOpenChange={(open) => !open && setLightboxIndex(null)}>
        <DialogContent
          showCloseButton={false}
          className="max-w-[min(1200px,calc(100%-1.5rem))] overflow-hidden rounded-[1.75rem] border-0 bg-[#111111] p-0 shadow-2xl"
        >
          <DialogTitle className="sr-only">
            {project.title} gallery preview
          </DialogTitle>
          {activeLightboxImage ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setLightboxIndex(null)}
                className="absolute top-4 right-4 z-20 inline-flex h-11 w-11 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm transition-colors hover:bg-black/75"
              >
                <X className="h-5 w-5" />
              </button>

              {galleryImages.length > 1 ? (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setLightboxIndex((current) =>
                        current === null
                          ? current
                          : (current - 1 + galleryImages.length) % galleryImages.length,
                      )
                    }
                    className="absolute left-4 top-1/2 z-20 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm transition-colors hover:bg-black/75"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setLightboxIndex((current) =>
                        current === null ? current : (current + 1) % galleryImages.length,
                      )
                    }
                    className="absolute right-4 top-1/2 z-20 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm transition-colors hover:bg-black/75"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              ) : null}

              <div className="max-h-[82vh] overflow-hidden">
                <img
                  src={activeLightboxImage}
                  alt={`${project.title} gallery preview`}
                  className="max-h-[82vh] w-full object-contain"
                />
              </div>

              <div className="flex items-center justify-between border-t border-white/10 bg-white/5 px-5 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
                <span>{project.title}</span>
                <span>
                  {(lightboxIndex || 0) + 1} / {galleryImages.length}
                </span>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}

function InfoCard({
  label,
  value,
  icon,
  wide = false,
  dark = false,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
  wide?: boolean;
  dark?: boolean;
}) {
  return (
    <div
      className={`rounded-[1.4rem] px-4 py-4 md:px-5 md:py-5 ${
        dark
          ? "border border-white/10 bg-white/6 shadow-[0_20px_50px_rgba(0,0,0,0.18)] backdrop-blur-sm"
          : "border border-gray-100 bg-white shadow-sm"
      } ${wide ? "sm:col-span-2 xl:col-span-1" : ""}`}
    >
      <div
        className={`mb-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.16em] ${
          dark ? "text-white/45" : "text-gray-400"
        }`}
      >
        {icon}
        {label}
      </div>
      <div
        className={`text-sm font-bold leading-6 md:text-[15px] ${
          dark ? "text-white" : "text-gray-900"
        }`}
      >
        {value}
      </div>
    </div>
  );
}

function ContentPanel({
  title,
  icon,
  items,
  itemDotClassName,
  cardClassName,
}: {
  title: string;
  icon: React.ReactNode;
  items: string[];
  itemDotClassName: string;
  cardClassName: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="space-y-5"
    >
      <div
        className="flex items-center gap-3 text-[1.65rem] font-bold text-gray-900 md:text-3xl"
        style={{ fontFamily: "var(--font-poppins)" }}
      >
        {icon}
        <h2>{title}</h2>
      </div>
      <div className="space-y-3 md:space-y-4">
        {items.map((item, idx) => (
          <div
            key={idx}
            className={`flex gap-4 rounded-[1.6rem] border p-5 shadow-sm ${cardClassName}`}
          >
            <div className={`mt-2 h-2 w-2 shrink-0 rounded-full ${itemDotClassName}`} />
            <p className="text-[15px] font-medium leading-8 text-gray-700 md:text-base">
              {item}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
