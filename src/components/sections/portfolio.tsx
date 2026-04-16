"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ExternalLink, ChevronLeft, ChevronRight, Expand } from "lucide-react";
import { getPortfolioItems } from "@/lib/api";
import type { PortfolioItem } from "@/lib/types";
import { PortfolioLightbox } from "@/components/site/portfolio-lightbox";

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

export function Portfolio() {
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
        console.error("Failed to fetch projects:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  const categories = ["All", ...new Set(projects.map((p) => p.category))];

  const filtered =
    active === "All" ? projects : projects.filter((p) => p.category === active);

  const handleScroll = () => {
    if (tabContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tabContainerRef.current;
      setShowLeftArrow(scrollLeft > 10);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scrollTabs = (direction: "left" | "right") => {
    if (tabContainerRef.current) {
      const scrollAmount = 200;
      tabContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const el = tabContainerRef.current;
    if (el) {
      el.addEventListener("scroll", handleScroll);
      setTimeout(handleScroll, 100);
      return () => el.removeEventListener("scroll", handleScroll);
    }
  }, [categories.length]);

  if (!loading && projects.length === 0) {
    return null;
  }

  return (
    <section
      className="py-24 overflow-hidden"
      style={{ background: "#fafafa" }}
    >
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-label block mb-3"
          >
            Digital Excellence
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black mb-6 tracking-tight"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            Work That <span style={{ color: "#FF6600" }}>Speaks</span>
          </motion.h2>
          <p className="text-gray-500 text-lg">
            Explore our lately delivered projects across diverse digital
            landscapes.
          </p>
        </div>

        {/* Tabs */}
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
                  border:
                    active === cat ? "2px solid #FF6600" : "2px solid #eef2f6",
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

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-[400px] bg-gray-100 animate-pulse rounded-[2.5rem]"
              />
            ))}
          </div>
        ) : (
          <>
            <style dangerouslySetInnerHTML={{
              __html: `
                @media (max-width: 768px) {
                  .portfolio-swiper .swiper-pagination {
                    display: none !important;
                  }
                }
              `
            }} />
            <Swiper
              modules={[Pagination, Autoplay]}
              spaceBetween={16}
              slidesPerView={1.05}
              loop={filtered.slice(0, 10).length > 3}
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              pagination={{ clickable: true }}
              breakpoints={{
                640: { slidesPerView: 2, spaceBetween: 20 },
                1024: { slidesPerView: 3, spaceBetween: 24 },
              }}
              className="portfolio-swiper"
            >
              {filtered.slice(0, 10).map((project) => (
                <SwiperSlide key={project._id} className="!h-auto">
                  <ProjectCard
                    project={project}
                    onOpen={() => setActiveProjectIndex(filtered.findIndex((item) => item._id === project._id))}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </>
        )}

        <div className="text-center mt-20">
          <Link href="/portfolio" className="btn-outline-orange group">
            <span>View All Portfolio</span>
            <ExternalLink className="w-4 h-4 ml-2 group-hover:rotate-45 transition-transform" />
          </Link>
        </div>

        <PortfolioLightbox
          projects={filtered}
          index={activeProjectIndex}
          onClose={() => setActiveProjectIndex(null)}
          onChange={setActiveProjectIndex}
        />
      </div>
    </section>
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
          className={`absolute inset-0 w-full h-full transition-transform duration-1000 group-hover:scale-110 ${
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
          <p className="text-white/70 text-sm font-medium">
            Click to view project
          </p>
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
