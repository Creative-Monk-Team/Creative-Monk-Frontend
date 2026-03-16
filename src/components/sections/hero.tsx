"use client";

import Link from "next/link";
import { ArrowRight, TrendingUp, Star, BarChart3, Zap } from "lucide-react";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="relative pt-16 pb-20 md:pt-8 md:pb-28 bg-white overflow-hidden min-h-[85vh] flex items-center">
      {/* Background gradients */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-50 via-white to-white"></div>
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[600px] h-[600px] bg-orange-200/40 rounded-full blur-[80px]" />
      <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[500px] h-[500px] bg-orange-100/50 rounded-full blur-[60px]" />

      <div className="container px-4 mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left Column Component */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl text-center lg:text-left mx-auto lg:mx-0"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 border border-orange-100/50 mb-6 shadow-sm">
              <Star className="w-4 h-4 text-orange-500 fill-orange-500" />
              <span className="text-sm font-semibold text-orange-800 tracking-wide uppercase">
                Award-Winning Agency
              </span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 tracking-tight leading-[1.1] mb-6">
              Ignite Your <br className="hidden lg:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-400 relative inline-block pb-2 mt-2 lg:mt-0">
                Revenue Engine
                <svg
                  className="absolute bottom-0 left-0 w-full"
                  height="12"
                  viewBox="0 0 100 12"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0,10 Q50,0 100,10"
                    stroke="#f97316"
                    strokeWidth="3"
                    fill="none"
                    opacity="0.3"
                  />
                </svg>
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-lg mx-auto lg:mx-0">
              We engineer high-performance marketing ecosystems that transform
              ambitious brands into market leaders through data-driven
              precision.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
              <Link
                href="/contact"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-all shadow-xl shadow-orange-500/20 hover:shadow-orange-500/40 hover:-translate-y-0.5"
              >
                Claim Your Free Audit
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/portfolio"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-gray-50 text-gray-800 font-semibold rounded-xl border-2 border-gray-100 transition-all hover:border-orange-100 hover:shadow-sm"
              >
                <TrendingUp className="w-5 h-5 text-orange-500" />
                Explore Case Studies
              </Link>
            </div>

            {/* Trust Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-8 border-t border-gray-100">
              <div className="text-center lg:text-left">
                <p className="text-3xl font-bold text-gray-900 mb-1">342%</p>
                <p className="text-sm text-gray-500 font-medium">
                  Avg. Client ROI
                </p>
              </div>
              <div className="text-center lg:text-left">
                <p className="text-3xl font-bold text-gray-900 mb-1">500+</p>
                <p className="text-sm text-gray-500 font-medium">
                  Projects Done
                </p>
              </div>
              <div className="col-span-2 md:col-span-1 flex flex-col items-center lg:items-start">
                <div className="flex mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="w-5 h-5 text-yellow-500 fill-yellow-500"
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-500 font-medium">
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
                className="w-36 h-36 bg-gradient-to-br from-orange-400 to-orange-600 rounded-3xl shadow-2xl shadow-orange-500/40 rotate-[15deg] flex items-center justify-center border-4 border-white/20 backdrop-blur-sm"
              >
                <BarChart3 className="w-16 h-16 text-white" />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
