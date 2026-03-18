"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { testimonials as testimonialData } from "@/data/site";

const testimonials = testimonialData.map((t) => ({
  name: t.name,
  company: t.company,
  role: t.role,
  avatar: t.name
    .split(" ")
    .map((n) => n[0])
    .join(""),
  text: t.text,
  rating: t.rating,
}));

export function Testimonials() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(
      () => setCurrent((c) => (c + 1) % testimonials.length),
      5000,
    );
    return () => clearInterval(timer);
  }, []);

  const t = testimonials[current];

  return (
    <section className="section-padding bg-white">
      <div className="container">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <span className="section-label inline-block mb-4">Testimonials</span>
          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 text-gray-900 leading-tight"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            What Our <span className="text-[#FF6600]">Clients Say</span>
          </h2>
        </div>

        <div className="max-w-4xl mx-auto">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="rounded-3xl p-10 md:p-14 relative"
            style={{ background: "#fafafa", border: "1px solid #f0f0f0" }}
          >
            <div className="flex gap-1 mb-6">
              {[...Array(t.rating)].map((_, i) => (
                <span key={i} className="text-yellow-400 text-xl">
                  ★
                </span>
              ))}
            </div>

            <blockquote
              className="text-xl md:text-2xl font-bold leading-relaxed mb-8 text-gray-900 tracking-tight"
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              "{t.text}"
            </blockquote>

            <div className="flex items-center gap-4">
              <div
                className="h-14 w-14 rounded-full flex items-center justify-center text-white font-bold text-lg"
                style={{ background: "#FF6600" }}
              >
                {t.avatar}
              </div>
              <div>
                <p
                  className="font-black text-lg text-gray-900"
                  style={{ fontFamily: "var(--font-outfit)" }}
                >
                  {t.name}
                </p>
                <p className="text-gray-500 text-sm">
                  {t.role} —{" "}
                  <span style={{ color: "#FF6600" }}>{t.company}</span>
                </p>
              </div>
            </div>
          </motion.div>

          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className="rounded-full transition-all h-2"
                style={{
                  width: i === current ? "24px" : "8px",
                  background: i === current ? "#FF6600" : "#e5e5e5",
                }}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
