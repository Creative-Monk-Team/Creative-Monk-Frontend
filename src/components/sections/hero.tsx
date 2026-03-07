"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-background py-24 md:py-32 lg:py-48">
      <div className="container relative z-10 flex flex-col items-center text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
        >
          Transform Your <span className="text-primary">Digital Presence</span>{" "}
          with Creative Monk
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl"
        >
          We are a full-service creative agency that helps brands grow through
          stunning design, cutting-edge development, and strategic marketing.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-10 flex flex-col gap-4 sm:flex-row"
        >
          <Button
            size="lg"
            className="bg-primary text-white hover:bg-primary/90 px-8 py-6 text-xl"
          >
            Start a Project
          </Button>
          <Button size="lg" variant="outline" className="px-8 py-6 text-xl">
            View Our Work
          </Button>
        </motion.div>
      </div>

      {/* Background Orbs */}
      <div className="absolute top-0 -z-10 h-full w-full overflow-hidden">
        <div className="absolute -left-20 top-0 h-96 w-96 rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-primary/10 blur-[120px]" />
      </div>
    </section>
  );
}
