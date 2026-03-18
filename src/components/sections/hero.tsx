"use client";

import Link from "next/link";
import {
  ArrowRight,
  TrendingUp,
  Star,
  Zap,
  Sparkles,
  Rocket,
} from "lucide-react";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="relative pb-16 pt-24 md:pb-24 md:pt-32 lg:pt-10 lg:pb-20 bg-white overflow-hidden min-h-[85vh] flex items-center">
      {/* Background gradients */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-50 via-white to-white"></div>
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-orange-200/40 rounded-full blur-[40px] md:blur-[80px]" />
      <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[250px] md:w-[500px] h-[250px] md:h-[500px] bg-orange-100/50 rounded-full blur-[30px] md:blur-[60px]" />

      {/* Animated floating elements for mobile visibility */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none lg:hidden">
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[15%] right-[10%] w-12 h-12 bg-orange-500/10 rounded-xl blur-[1px]"
        />
        <motion.div
          animate={{
            y: [0, 20, 0],
            rotate: [0, -5, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute bottom-[20%] left-[5%] w-16 h-16 bg-orange-200/20 rounded-full blur-[1px]"
        />
      </div>

      <div className="container">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-8 items-center">
          {/* Left Column Component */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-2xl text-center lg:text-left mx-auto lg:mx-0"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50/80 backdrop-blur-sm border border-orange-100/50 mb-8 md:mb-10 group hover:bg-orange-100/80 transition-all duration-300"
            >
              <div className="relative w-6 h-6 rounded-full bg-white shadow-sm flex items-center justify-center overflow-hidden">
                <img
                  src="/images/icon-logo.png"
                  alt="Creative Monk"
                  className="w-4 h-4 object-contain relative z-10"
                />
                <motion.div
                  animate={{
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute inset-0 bg-gradient-to-tr from-orange-100 to-transparent opacity-40"
                />
              </div>
              <span
                className="text-[#FF6600] text-[10px] md:text-xs font-black tracking-[0.2em] uppercase"
                style={{ fontFamily: "var(--font-outfit)" }}
              >
                Award-Winning Agency
              </span>
              <Sparkles className="w-3 h-3 text-orange-400 group-hover:rotate-12 transition-transform" />
            </motion.div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-gray-900 tracking-tight leading-[1.1] mb-6">
              Ignite Your <br className="hidden lg:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-400 relative inline-block pb-3 mt-2 lg:mt-0">
                Revenue Engine
                <motion.svg
                  initial={{ pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, delay: 0.8 }}
                  className="absolute bottom-0 left-0 w-full"
                  height="12"
                  viewBox="0 0 100 12"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0,10 Q50,0 100,10"
                    stroke="#f97316"
                    strokeWidth="4"
                    fill="none"
                    opacity="0.4"
                    strokeLinecap="round"
                  />
                </motion.svg>
              </span>
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-10 leading-relaxed max-w-lg mx-auto lg:mx-0 font-medium">
              We engineer high-performance marketing ecosystems that transform
              ambitious brands into market leaders through data-driven
              precision.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-16 px-4 sm:px-0">
              <Link
                href="/contact"
                className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl transition-all shadow-2xl shadow-orange-500/20 hover:shadow-orange-500/40 hover:-translate-y-1 overflow-hidden"
              >
                <motion.div
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.8 }}
                  className="absolute inset-0 bg-white/20 -skew-x-12"
                />
                Claim Your Free Audit
                <Rocket className="w-5 h-5 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/portfolio"
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-white/50 backdrop-blur-sm hover:bg-white text-gray-800 font-bold rounded-2xl border-2 border-orange-100 hover:border-orange-200 transition-all hover:shadow-xl hover:-translate-y-1"
              >
                <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                  <TrendingUp className="w-4 h-4 text-orange-600" />
                </div>
                Explore Case Studies
              </Link>
            </div>

            {/* Trust Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 pt-10 border-t border-gray-100 relative">
              <div className="absolute -top-px left-1/2 -translate-x-1/2 lg:left-0 lg:translate-x-0 w-20 h-[2px] bg-orange-500" />

              <div className="text-center lg:text-left">
                <p
                  className="text-3xl font-black text-gray-900 mb-1 tracking-tight"
                  style={{ fontFamily: "var(--font-outfit)" }}
                >
                  342%
                </p>
                <p className="text-[11px] uppercase tracking-wider text-gray-500 font-extrabold">
                  Avg. Client ROI
                </p>
              </div>
              <div className="text-center lg:text-left border-l border-gray-100 md:border-none pl-4 md:pl-0">
                <p
                  className="text-3xl font-black text-gray-900 mb-1 tracking-tight"
                  style={{ fontFamily: "var(--font-outfit)" }}
                >
                  500+
                </p>
                <p className="text-[11px] uppercase tracking-wider text-gray-500 font-extrabold">
                  Projects Won
                </p>
              </div>
              <div className="col-span-2 md:col-span-1 flex flex-col items-center lg:items-start pt-6 md:pt-0 border-t border-gray-50 md:border-none">
                <div className="flex mb-2 gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="w-4 h-4 text-orange-500 fill-orange-500"
                    />
                  ))}
                </div>
                <p className="text-[11px] uppercase tracking-wider text-gray-500 font-extrabold">
                  Rated 4.9/5 by Clients
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right Column Component - Visuals */}
          <div className="relative h-[500px] lg:h-[600px] w-full hidden lg:block">
            {/* Main Center Geometry */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-80 h-80 rounded-full border border-orange-100 bg-white/50 backdrop-blur-3xl shadow-2xl shadow-orange-500/10 flex items-center justify-center animate-[spin_30s_linear_infinite]">
                {/* Inner dashed circle */}
                <div className="absolute w-64 h-64 rounded-full border-2 border-dashed border-orange-200" />
              </div>
            </div>

            {/* Floating Card 1: Traffic Growth */}
            <motion.div
              initial={{ opacity: 0, x: 50, y: -20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="absolute top-[10%] left-[5%] bg-white p-4 rounded-2xl shadow-xl shadow-orange-900/5 border border-gray-50 w-60 z-10"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                    Traffic Growth
                  </p>
                  <p className="text-xl font-extrabold text-gray-900">
                    +124.5%
                  </p>
                </div>
              </div>
              <div className="w-full h-14 flex items-end gap-1.5">
                {[40, 60, 45, 75, 65, 90, 100].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-orange-50 rounded-t-sm relative overflow-hidden"
                  >
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                      className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-orange-500 to-orange-400 rounded-t-sm"
                    />
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Floating Card 2: Active Leads */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="absolute top-[35%] right-[-5%] bg-white p-5 rounded-2xl shadow-2xl shadow-orange-500/10 border border-orange-50 w-64 z-20"
            >
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-semibold text-gray-700">
                  Active Leads
                </p>
                <span className="px-2.5 py-1 bg-green-50 text-green-700 text-[10px] font-bold uppercase tracking-wider rounded-full border border-green-100">
                  Live Connect
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-blue-100 flex items-center justify-center">
                    <span className="text-xs font-bold text-blue-700">A</span>
                  </div>
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-green-100 flex items-center justify-center">
                    <span className="text-xs font-bold text-green-700">K</span>
                  </div>
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-purple-100 flex items-center justify-center">
                    <span className="text-xs font-bold text-purple-700">S</span>
                  </div>
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-orange-50 flex items-center justify-center">
                    <span className="text-xs font-bold text-orange-600">
                      +89
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm pt-4 border-t border-gray-50">
                <Zap className="w-4 h-4 text-orange-500 fill-orange-500" />
                <span className="text-gray-600 font-medium text-xs">
                  High converting cohort
                </span>
              </div>
            </motion.div>

            {/* Floating Card 3: SEO Score */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="absolute bottom-[10%] left-[15%] bg-white p-5 rounded-2xl shadow-xl shadow-orange-900/5 border border-gray-50 flex items-center gap-5 w-56 z-10"
            >
              <div className="relative w-16 h-16">
                <svg className="w-full h-full -rotate-90">
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="currentColor"
                    strokeWidth="6"
                    fill="transparent"
                    className="text-gray-100"
                  />
                  <motion.circle
                    initial={{ strokeDasharray: "0 176" }}
                    animate={{ strokeDasharray: "172 176" }}
                    transition={{ duration: 1.5, delay: 1 }}
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="currentColor"
                    strokeWidth="6"
                    fill="transparent"
                    className="text-orange-500"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-lg font-extrabold text-gray-900 leading-none">
                    98
                  </span>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">
                  SEO Score
                </p>
                <p className="text-sm font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded inline-block">
                  Excellent
                </p>
              </div>
            </motion.div>

            {/* Decorative Central Element */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1, type: "spring" }}
                className="w-36 h-36 bg-gradient-to-br from-orange-400 to-orange-600 rounded-3xl shadow-2xl shadow-orange-500/40 rotate-[15deg] flex items-center justify-center border-4 border-white/20 backdrop-blur-sm overflow-hidden"
              >
                <img
                  src="/images/icon-logo.png"
                  alt="Creative Monk Brand Mark"
                  className="w-20 h-20 object-contain brightness-0 invert"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
