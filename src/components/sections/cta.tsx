"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function CTA() {
  return (
    <section className="py-24 bg-primary text-primary-foreground transform skew-y-1">
      <div className="container -skew-y-1 flex flex-col items-center text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-bold tracking-tight md:text-5xl"
        >
          Ready to Elevate Your Brand?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-6 max-w-2xl text-lg opacity-90 sm:text-xl"
        >
          Let's work together to create something amazing that resonates with
          your audience.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-10"
        >
          <Button
            size="lg"
            variant="secondary"
            className="px-10 py-7 text-xl shadow-lg hover:scale-105 transition-transform"
          >
            Contact Us Now
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
