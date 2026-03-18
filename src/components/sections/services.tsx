"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { getServiceCategories, getServices } from "@/lib/api";
import type { Service, ServiceCategory } from "@/lib/types";

export function Services() {
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [allServices, setAllServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [catData, servData] = await Promise.all([
          getServiceCategories(),
          getServices(),
        ]);
        setCategories(catData);
        setAllServices(servData);
      } catch (error) {
        console.error("Failed to fetch services:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (!loading && categories.length === 0) {
    return null;
  }

  return (
    <section className="section-padding bg-white relative overflow-hidden">
      <div className="container">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-label inline-block mb-4"
          >
            What We Offer
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 text-gray-900 leading-tight"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            Our <span className="text-[#FF6600]">Services</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto"
          >
            Empowering brands through cutting-edge technology and data-driven
            marketing strategies that deliver measurable results.
          </motion.p>
        </div>

        {/* Main Service Categories — Large Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-[400px] bg-gray-50 rounded-[2.5rem] animate-pulse"
                />
              ))
            : categories.map((category, index) => {
                const subServices = allServices.filter(
                  (s) => s.category === category.slug,
                );

                return (
                  <motion.div
                    key={category._id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href="/services"
                      className="group relative block h-full rounded-[2.5rem] overflow-hidden transition-all duration-500 hover:-translate-y-2 bg-orange-50/30 border border-orange-100/50 hover:bg-white hover:border-orange-100 hover:shadow-2xl hover:shadow-orange-500/5"
                    >
                      <div className="relative p-10">
                        {/* Icon + Arrow */}
                        <div className="flex items-start justify-between mb-8">
                          <div className="h-16 w-16 rounded-[1.25rem] bg-white shadow-sm border border-orange-100 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-[#FF6600] group-hover:text-white group-hover:shadow-lg group-hover:shadow-orange-500/20">
                            <span className="text-2xl text-[#FF6600] group-hover:text-white transition-colors">
                              {/* Better handling of dynamic icons would be to mapping icons by slug if needed */}
                              ⚡
                            </span>
                          </div>
                          <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300 shadow-sm">
                            <ArrowUpRight className="h-5 w-5 text-[#FF6600]" />
                          </div>
                        </div>

                        {/* Title */}
                        <h3
                          className="text-2xl font-black mb-4 text-gray-900 group-hover:text-[#FF6600] transition-colors leading-tight"
                          style={{ fontFamily: "var(--font-outfit)" }}
                        >
                          {category.title}
                        </h3>

                        <p className="text-gray-500 text-sm leading-relaxed mb-8 line-clamp-3">
                          {category.description}
                        </p>

                        {/* Service pills */}
                        <div className="flex flex-wrap gap-2">
                          {subServices.slice(0, 4).map((s) => (
                            <span
                              key={s._id}
                              className="text-[11px] px-3 py-1.5 rounded-full font-bold bg-white text-gray-500 border border-gray-100/50"
                              style={{ fontFamily: "var(--font-outfit)" }}
                            >
                              {s.shortTitle}
                            </span>
                          ))}
                          {subServices.length > 4 && (
                            <span className="text-[11px] px-3 py-1.5 rounded-full font-bold bg-orange-100 text-[#FF6600]">
                              +{subServices.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
        </div>

        {/* All Services Grid — Compact Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-between mb-8">
            <h3
              className="text-2xl font-black text-gray-900"
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              All <span className="text-[#FF6600]">Services</span>
            </h3>
            <Link
              href="/services"
              className="hidden md:flex items-center gap-1.5 text-sm font-semibold text-[#FF6600] hover:gap-2.5 transition-all"
            >
              View All <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {loading
              ? Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-16 bg-gray-50 rounded-2xl animate-pulse"
                  />
                ))
              : allServices.slice(0, 10).map((service, index) => (
                  <motion.div
                    key={service._id}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.02 }}
                  >
                    <Link
                      href={`/services/${service.slug}`}
                      className="group flex items-center gap-3 p-4 rounded-2xl bg-white transition-all duration-300 hover:-translate-y-1 border border-gray-100 hover:border-orange-100 hover:shadow-xl hover:shadow-orange-100/20"
                    >
                      <div className="h-10 w-10 rounded-xl bg-orange-50 flex-shrink-0 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-[#FF6600] group-hover:text-white">
                        <span className="text-sm font-bold opacity-70 group-hover:opacity-100">
                          ⚙️
                        </span>
                      </div>
                      <span
                        className="text-[13px] font-black tracking-tight text-gray-900 group-hover:text-[#FF6600] transition-colors leading-tight"
                        style={{ fontFamily: "var(--font-outfit)" }}
                      >
                        {service.shortTitle}
                      </span>
                    </Link>
                  </motion.div>
                ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
