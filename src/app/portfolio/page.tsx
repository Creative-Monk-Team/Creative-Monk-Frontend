"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, ChevronLeft, ChevronRight, Expand } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { CTA } from "@/components/sections/cta";
import { PageHeader } from "@/components/layout/page-header";
import { PortfolioLightbox } from "@/components/site/portfolio-lightbox";
import { getPortfolioItems } from "@/lib/api";
import type { PortfolioItem } from "@/lib/types";

export default function PortfolioPage() {
  const [active, setActive] = useState("All");
  const [projects, setProjects] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const tabContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [activeProjectIndex, setActiveProjectIndex] = useState<number | null>(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const data = await getPortfolioItems();
        setProjects(data);
      } catch (error) {
        console.error("Failed to fetch portfolio items:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  const categories = ["All", ...new Set(projects.map((project) => project.category))];
  const filtered =
    active === "All" ? projects : projects.filter((project) => project.category === active);

  const handleScroll = () => {
    if (tabContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tabContainerRef.current;
      setShowLeftArrow(scrollLeft > 10);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scrollTabs = (direction: "left" | "right") => {
    if (tabContainerRef.current) {
      tabContainerRef.current.scrollBy({
        left: direction === "left" ? -200 : 200,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const el = tabContainerRef.current;
    if (!el) return;

    el.addEventListener("scroll", handleScroll);
    setTimeout(handleScroll, 100);

    return () => el.removeEventListener("scroll", handleScroll);
  }, [categories.length]);

  return (
    <>
      <PageHeader
        badge="Our Work"
        title1="Our"
        title2="Portfolio."
        description="Explore our backend-powered case studies across web design, branding, SEO, and digital marketing."
      />

      <section className="py-20 overflow-hidden" style={{ background: "#fafafa" }}>
        <div className="container">
          {loading ? (
            <div className="text-center py-20 text-gray-500">Loading portfolio...</div>
          ) : projects.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              No case studies are available right now.
            </div>
          ) : (
            <>
              <div className="relative max-w-5xl mx-auto mb-16 group/tabs">
                <AnimatePresence>
                  {showLeftArrow && (
                    <motion.button
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      onClick={() => scrollTabs("left")}
                      className="absolute left-0 top-1/2 -translate-y-1/2 z-20 p-2.5 bg-white rounded-full shadow-xl text-[#FF6600] border border-orange-100 hover:bg-[#FF6600] hover:text-white transition-all duration-300 -ml-4"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </motion.button>
                  )}
                </AnimatePresence>

                <div
                  ref={tabContainerRef}
                  className="flex overflow-x-auto gap-3 no-scrollbar py-4 px-2 scroll-smooth items-center"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActive(cat)}
                      className="px-8 py-3 rounded-full text-sm font-bold transition-all whitespace-nowrap shrink-0 relative isolate"
                      style={{
                        fontFamily: "var(--font-outfit)",
                        background: active === cat ? "#FF6600" : "white",
                        color: active === cat ? "white" : "#666",
                        border: active === cat ? "2px solid #FF6600" : "2px solid #eef2f6",
                        boxShadow:
                          active === cat
                            ? "0 10px 20px -5px rgba(255,102,0,0.3)"
                            : "0 4px 6px -1px rgba(0,0,0,0.02)",
                      }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <AnimatePresence>
                  {showRightArrow && (
                    <motion.button
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      onClick={() => scrollTabs("right")}
                      className="absolute right-0 top-1/2 -translate-y-1/2 z-20 p-2.5 bg-white rounded-full shadow-xl text-[#FF6600] border border-orange-100 hover:bg-[#FF6600] hover:text-white transition-all duration-300 -mr-4"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>

              <div className="md:hidden">
                <Swiper
                  modules={[Pagination, Autoplay]}
                  spaceBetween={16}
                  slidesPerView={1.05}
                  centeredSlides={false}
                  loop={filtered.length > 2}
                  autoplay={{ delay: 4000, disableOnInteraction: false }}
                  pagination={{ clickable: true }}
                  className="portfolio-swiper"
                >
                  {filtered.map((project) => (
                    <SwiperSlide key={project._id}>
                      <ProjectCard
                        project={project}
                        onOpen={() => setActiveProjectIndex(filtered.findIndex((item) => item._id === project._id))}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>

              <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatePresence mode="popLayout">
                  {filtered.map((project) => (
                    <motion.div
                      key={project._id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.4 }}
                    >
                      <ProjectCard
                        project={project}
                        onOpen={() => setActiveProjectIndex(filtered.findIndex((item) => item._id === project._id))}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </>
          )}

          <PortfolioLightbox
            projects={filtered}
            index={activeProjectIndex}
            onClose={() => setActiveProjectIndex(null)}
            onChange={setActiveProjectIndex}
          />
        </div>
      </section>

      <CTA />
    </>
  );
}

function ProjectCard({
  project,
  onOpen,
}: {
  project: PortfolioItem;
  onOpen: () => void;
}) {
  const portfolioImage =
    project.image || project.gallery?.[0] || "/placeholder.jpg";

  return (
    <button
      type="button"
      onClick={onOpen}
      className="group relative flex h-full w-full flex-col overflow-hidden rounded-[2rem] border border-gray-100 bg-white text-left shadow-sm transition-all duration-700 hover:shadow-2xl"
    >
      <div className={`relative h-64 shrink-0 overflow-hidden md:h-72 ${project.category === "Brand Identity" ? "bg-[#f8f9fa]" : ""}`}>
        <img
          src={portfolioImage}
          alt={project.title}
          className={`absolute inset-0 h-full w-full transition-transform duration-1000 group-hover:scale-110 ${
            project.category === "Brand Identity" ? "object-contain p-8 mix-blend-multiply" : "object-cover object-top"
          }`}
          loading="lazy"
        />
        <div className="absolute inset-0 flex flex-col justify-end p-8 opacity-0 group-hover:opacity-100 transition-all duration-500 bg-gradient-to-t from-black/90 via-black/40 to-transparent translate-y-4 group-hover:translate-y-0">
          <div className="absolute top-5 right-5 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/12 text-white backdrop-blur-md">
            <Expand className="h-4 w-4" />
          </div>
          <div className="flex gap-2 flex-wrap mb-4">
            {(project.points || []).slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-widest bg-white/10 text-white backdrop-blur-md border border-white/20"
              >
                {tag}
              </span>
            ))}
          </div>
          <h4
            className="text-white font-black text-2xl mb-1 tracking-tight"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            {project.title}
          </h4>
        </div>
      </div>
      <div className="flex flex-1 items-center justify-between p-5 md:p-6">
        <div>
          <span
            className="text-xs font-black uppercase tracking-[0.2em] mb-2 block"
            style={{ color: "#FF6600" }}
          >
            {project.category}
          </span>
          <h3
            className="font-black text-gray-900 text-xl group-hover:text-[#FF6600] transition-colors leading-tight"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            {project.title}
          </h3>
        </div>
        <div className="h-12 w-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-[#FF6600] group-hover:text-white transition-all duration-500 transform group-hover:-rotate-45 shadow-sm">
          <ExternalLink className="h-5 w-5" />
        </div>
      </div>
    </button>
  );
}
