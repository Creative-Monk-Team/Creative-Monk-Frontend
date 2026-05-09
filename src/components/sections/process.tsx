"use client";

import { motion } from "framer-motion";
import { Search, Lightbulb, Code2, Rocket } from "lucide-react";

export function Process() {
  const steps = [
    {
      num: "01",
      icon: Search,
      title: "Discovery & Strategy",
      desc: "We analyze your business goals, target audience, and competitors to create a roadmap for success.",
      color: "bg-blue-50 text-blue-600",
    },
    {
      num: "02",
      icon: Lightbulb,
      title: "Creative Design",
      desc: "Our designers craft beautiful, intuitive interfaces that align with your brand identity.",
      color: "bg-orange-50 text-[#FF6600]",
    },
    {
      num: "03",
      icon: Code2,
      title: "Development",
      desc: "We bring designs to life with clean, scalable code optimized for speed and performance.",
      color: "bg-orange-50 text-[#FF6600]",
    },
    {
      num: "04",
      icon: Rocket,
      title: "Launch & Optimize",
      desc: "After a flawless launch, we monitor data and continuously optimize for better ROI.",
      color: "bg-purple-50 text-purple-600",
    },
  ];

  return (
    <section className="section-padding bg-gray-50 border-t border-gray-100 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-white opacity-40 skew-x-12 transform translate-x-20 pointer-events-none" />

      <div className="container relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="section-label inline-block mb-3">How We Work</span>
          <h2
            className="text-3xl md:text-5xl font-black text-gray-900 mb-6"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            A Proven Process for{" "}
            <span className="text-[#FF6600]">Digital Success</span>
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            We don&apos;t just guess. We follow a data-driven, systematic approach to
            ensure every project is delivered on time, on budget, and exceeds
            expectations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative group"
            >
              {/* Connection Line (Desktop) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-[60%] w-[80%] h-[2px] border-t-2 border-dashed border-gray-300 z-0" />
              )}

              <div className="relative z-10 bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 h-full">
                <div
                  className="absolute -top-5 -right-5 text-6xl font-black text-gray-100 opacity-50 select-none group-hover:text-orange-50 transition-colors duration-300"
                  style={{ fontFamily: "var(--font-outfit)" }}
                >
                  {step.num}
                </div>

                <div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 ${step.color}`}
                >
                  <step.icon className="h-6 w-6" />
                </div>

                <h3
                  className="text-xl font-bold text-gray-900 mb-3"
                  style={{ fontFamily: "var(--font-outfit)" }}
                >
                  {step.title}
                </h3>

                <p className="text-gray-500 text-sm leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
