"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section
      className="py-24 relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #1a1a1a, #2d2d2d)" }}
    >
      <div className="absolute inset-0 opacity-5">
        <div
          className="w-full h-full"
          style={{
            backgroundImage:
              "radial-gradient(circle, #FF6600 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>
      <div
        className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-10"
        style={{ background: "#FF6600" }}
      />
      <div
        className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full opacity-10"
        style={{ background: "#FF6600" }}
      />

      <div className="container relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <span
            className="inline-block px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-6"
            style={{
              background: "rgba(255,102,0,0.15)",
              color: "#FF6600",
              fontFamily: "var(--font-poppins)",
            }}
          >
            Ready to Grow?
          </span>
          <h2
            className="text-4xl md:text-6xl font-black text-white mb-6"
            style={{ fontFamily: "var(--font-poppins)" }}
          >
            Let's Build Something{" "}
            <span style={{ color: "#FF6600" }}>Amazing</span> Together
          </h2>
          <p className="text-gray-400 text-xl mb-10 leading-relaxed">
            Join 250+ businesses who trusted Creative Monk to transform their
            digital presence. We are the most trusted digital marketing agency
            in India.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="btn-primary text-base px-10 py-4">
              Get Free Consultation <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/portfolio"
              className="btn-outline text-base px-10 py-4"
            >
              View Our Work
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
