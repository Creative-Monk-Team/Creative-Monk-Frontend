"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import {
  serviceCategories,
  services as allServicesData,
} from "@/data/services";

export function Services() {
  const categoryColors: Record<
    string,
    { bg: string; border: string; accent: string }
  > = {
    "web-design": {
      bg: "linear-gradient(135deg, #FFF7ED, #FFF1E6)",
      border: "rgba(255,102,0,0.15)",
      accent: "#FF6600",
    },
    "digital-marketing": {
      bg: "linear-gradient(135deg, #FFF7ED, #FFF3E8)",
      border: "rgba(255,102,0,0.15)",
      accent: "#FF6600",
    },
    "graphic-designing": {
      bg: "linear-gradient(135deg, #FFF7ED, #FFF1E6)",
      border: "rgba(255,102,0,0.15)",
      accent: "#FF6600",
    },
  };

  return (
    <section className="section-padding bg-white">
      <div className="container">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4"
            style={{
              background: "#FFF5F0",
              color: "#FF6600",
              border: "1px solid rgba(255,102,0,0.15)",
            }}
          >
            What We Offer
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-black mb-4"
            style={{ fontFamily: "var(--font-poppins)" }}
          >
            Our <span style={{ color: "#FF6600" }}>Services</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 text-lg"
          >
            We offer a wide range of Digital Marketing Services, Web Design &
            Development Services, and Graphic Designing Services in India.
          </motion.p>
        </div>

        {/* Main Service Categories — Large Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-20">
          {serviceCategories.map((category, index) => {
            const colors =
              categoryColors[category.slug] || categoryColors["web-design"];
            const subServices = category.services
              .map((slug) => allServicesData.find((s) => s.slug === slug))
              .filter(Boolean);

            return (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href="/services"
                  className="group relative block h-full rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-1"
                  style={{
                    background: colors.bg,
                    border: `1px solid ${colors.border}`,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
                  }}
                >
                  {/* Hover glow */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background:
                        "radial-gradient(circle at 50% 0%, rgba(255,102,0,0.08), transparent 70%)",
                    }}
                  />

                  <div className="relative p-7">
                    {/* Icon + Arrow */}
                    <div className="flex items-start justify-between mb-5">
                      <div
                        className="h-14 w-14 rounded-2xl flex items-center justify-center shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:shadow-md"
                        style={{
                          background: "white",
                          border: `1px solid ${colors.border}`,
                        }}
                      >
                        <category.icon
                          className="h-6 w-6"
                          style={{ color: colors.accent }}
                        />
                      </div>
                      <div
                        className="h-9 w-9 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300"
                        style={{ background: colors.accent }}
                      >
                        <ArrowUpRight className="h-4 w-4 text-white" />
                      </div>
                    </div>

                    {/* Title */}
                    <h3
                      className="text-lg font-extrabold mb-2 text-gray-900 group-hover:text-[#FF6600] transition-colors line-clamp-2"
                      style={{ fontFamily: "var(--font-poppins)" }}
                    >
                      {category.title}
                    </h3>

                    {/* Description — truncated */}
                    <p className="text-gray-500 text-sm leading-relaxed mb-5 line-clamp-2">
                      {category.description}
                    </p>

                    {/* Service pills */}
                    <div className="flex flex-wrap gap-1.5">
                      {subServices.slice(0, 4).map((s) => (
                        <span
                          key={s!.slug}
                          className="text-[11px] px-2.5 py-1 rounded-full font-medium"
                          style={{
                            background: "white",
                            color: "#555",
                            border: "1px solid rgba(0,0,0,0.06)",
                          }}
                        >
                          {s!.shortTitle}
                        </span>
                      ))}
                      {subServices.length > 4 && (
                        <span
                          className="text-[11px] px-2.5 py-1 rounded-full font-bold"
                          style={{
                            background: "rgba(255,102,0,0.1)",
                            color: "#FF6600",
                          }}
                        >
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
              className="text-2xl font-bold"
              style={{ fontFamily: "var(--font-poppins)" }}
            >
              All <span style={{ color: "#FF6600" }}>Services</span>
            </h3>
            <Link
              href="/services"
              className="hidden md:flex items-center gap-1.5 text-sm font-semibold text-[#FF6600] hover:gap-2.5 transition-all"
            >
              View All <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {allServicesData.slice(0, 10).map((service, index) => (
              <motion.div
                key={service.slug}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.02 }}
              >
                <Link
                  href={`/services/${service.slug}`}
                  className="group flex items-center gap-3 p-3.5 rounded-xl bg-white transition-all duration-300 hover:-translate-y-0.5"
                  style={{
                    border: "1px solid #f0f0f0",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor =
                      "rgba(255,102,0,0.3)";
                    (e.currentTarget as HTMLElement).style.boxShadow =
                      "0 8px 25px rgba(255,102,0,0.08)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor =
                      "#f0f0f0";
                    (e.currentTarget as HTMLElement).style.boxShadow =
                      "0 1px 3px rgba(0,0,0,0.02)";
                  }}
                >
                  <div
                    className="h-9 w-9 rounded-lg flex-shrink-0 flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                    style={{ background: "#FFF5F0" }}
                  >
                    <service.icon className="h-4 w-4 text-[#FF6600]" />
                  </div>
                  <span
                    className="text-[13px] font-semibold text-gray-700 group-hover:text-[#FF6600] transition-colors leading-tight"
                    style={{ fontFamily: "var(--font-poppins)" }}
                  >
                    {service.shortTitle}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Mobile CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-10 md:hidden"
        >
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white"
            style={{ background: "#FF6600" }}
          >
            View All Services <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
