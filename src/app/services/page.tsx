"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { CTA } from "@/components/sections/cta";
import { PageHeader } from "@/components/layout/page-header";
import { useEffect, useState } from "react";
import { getIcon } from "@/lib/icon-utils";
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 50,
    } as const,
  },
};

export default function ServicesPage() {
  const [services, setServices] = useState<
    {
      slug: string;
      icon: string;
      title: string;
      description: string;
      features: string[];
    }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/services")
      .then((res) => res.json())
      .then((data) => {
        setServices(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <PageHeader
        badge="Capabilities & Expertise"
        title1="Digital"
        title2="Solutions."
        description={
          <>
            We don't just execute campaigns; we engineer{" "}
            <strong>digital ecosystems</strong>
            designed for relentless growth, massive ROI, and sustainable brand
            dominance.
          </>
        }
        features={["Performance First", "Data Driven", "ROI Focused"]}
      />

      {/* Services Grid */}
      <section className="py-20 bg-gray-50/30">
        <div className="container">
          {loading ? (
            <div className="text-center py-20 text-gray-500">
              Loading services...
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
            >
              {services.map((service, index) => {
                const ServiceIcon = getIcon(service.icon) || (() => null);
                return (
                  <motion.div
                    key={service.slug}
                    variants={itemVariants}
                    className="relative group"
                  >
                    <Link
                      href={`/services/${service.slug}`}
                      className="block h-full bg-white rounded-[2rem] p-8 lg:p-12 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(255,124,48,0.1)] hover:border-orange-200 transition-all duration-500 overflow-hidden z-10 relative isolate"
                    >
                      {/* Large background number */}
                      <div
                        className="absolute -right-8 -bottom-12 text-[12rem] font-black text-gray-50/80 group-hover:text-orange-50/50 transition-colors duration-500 -z-10 select-none pointer-events-none"
                        style={{
                          fontFamily: "var(--font-outfit)",
                          lineHeight: "1",
                        }}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </div>

                      <div className="flex flex-col h-full">
                        <div className="flex justify-between items-start mb-8">
                          <div
                            className="h-20 w-20 rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3 shadow-sm"
                            style={{ background: "#fff5f0" }}
                          >
                            <ServiceIcon
                              className="h-10 w-10"
                              style={{ color: "#FF6600" }}
                            />
                          </div>
                          <div className="h-12 w-12 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-[#FF6600] group-hover:text-white group-hover:border-[#FF6600] transition-colors duration-300">
                            <ArrowRight className="h-5 w-5 transform group-hover:-rotate-45 transition-transform duration-300" />
                          </div>
                        </div>

                        <h2
                          className="text-2xl font-black mb-4 text-gray-900 group-hover:text-[#FF6600] transition-colors duration-300"
                          style={{ fontFamily: "var(--font-outfit)" }}
                        >
                          {service.title}
                        </h2>

                        <p className="text-gray-600 text-base leading-relaxed mb-8 flex-grow">
                          {service.description}
                        </p>

                        <div className="pt-6 border-t border-gray-100/80 mt-auto">
                          <ul className="flex flex-wrap gap-2">
                            {service.features.slice(0, 3).map((f: string) => (
                              <li
                                key={f}
                                className="bg-gray-50 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-600 border border-gray-100 group-hover:border-orange-100 transition-colors"
                              >
                                {f}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </section>

      <CTA />
    </>
  );
}
