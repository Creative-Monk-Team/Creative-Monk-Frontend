"use client";

import { motion } from "framer-motion";
import { Sparkles, CheckCircle2 } from "lucide-react";

interface PageHeaderProps {
  badge: string;
  title1: string;
  title2: string;
  description: React.ReactNode;
  features?: string[];
}

export function PageHeader({
  badge,
  title1,
  title2,
  description,
  features,
}: PageHeaderProps) {
  return (
    <section className="pt-20 md:pt-24 pb-16 md:pb-20 relative overflow-hidden bg-gray-950 min-h-[40vh] md:min-h-[50vh] flex items-center">
      {/* Background Image / Pattern */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src="/images/hero-bg.png"
          alt="Background"
          className="w-full h-full object-cover opacity-20 scale-125 select-none pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-gray-950/80 to-gray-950" />
      </div>

      <div className="container relative z-10 text-center max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-3 px-6 py-2 rounded-full glass-dark border-primary/30 mb-8 md:mb-10"
        >
          <img
            src="/images/icon-logo.png"
            alt="Brand Icon"
            className="h-5 w-5 object-contain"
          />
          <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-white/80">
            {badge}
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-8xl lg:text-[10rem] font-black text-white mb-6 md:mb-8 tracking-tighter leading-[0.85] font-display"
        >
          {title1} <br />
          <span className="text-gradient drop-shadow-[0_0_30px_rgba(255,102,0,0.3)] text-[#FF6600]">
            {title2}
          </span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-white/70 text-base md:text-2xl font-light leading-relaxed max-w-3xl mx-auto"
        >
          {description}
        </motion.div>

        {/* Features / Trust Badge Strip */}
        {features && features.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-12 md:mt-16 flex flex-wrap justify-center gap-6 md:gap-8 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700"
          >
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 text-white font-bold tracking-widest text-[9px] md:text-[10px] uppercase"
              >
                <CheckCircle2 className="h-3.5 w-3.5 md:h-4 md:w-4 text-[#FF6600]" />
                {feature}
              </div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Floating background blur */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-[#FF6600]/20 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] -z-10" />
    </section>
  );
}
