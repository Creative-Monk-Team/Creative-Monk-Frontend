"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { apiService } from "@/lib/api";
import type { Client } from "@/lib/types";

export function ClientMarquee() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiService
      .getClients()
      .then((data) => {
        // Filter out inactive clients
        const activeClients = Array.isArray(data)
          ? data.filter((c: Client) => (c.status as string) !== "inactive")
          : [];
        setClients(activeClients);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch clients", err);
        setLoading(false);
      });
  }, []);

  if (loading || clients.length === 0) {
    return null;
  }

  // Duplicate the array twice to create a seamless infinite loop
  const marqueeItems = [...clients, ...clients, ...clients];

  return (
    <section className="py-16 bg-white overflow-hidden border-b border-gray-100">
      <div className="container mb-12 text-center">
        <p
          className="text-sm font-semibold text-gray-400 uppercase tracking-widest"
          style={{ fontFamily: "var(--font-outfit)" }}
        >
          Trusted by founders behind these visionary brands
        </p>
      </div>

      <div className="relative flex overflow-x-hidden">
        {/* Left Gradient Mask */}
        <div className="absolute left-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />

        {/* Right Gradient Mask */}
        <div className="absolute right-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <motion.div
          className="flex whitespace-nowrap gap-16 md:gap-24 items-center pl-8 md:pl-16 w-max"
          animate={{ x: ["0%", "-33.333333%"] }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: Math.max(25, clients.length * 2), // Adjust duration based on number of clients
          }}
        >
          {marqueeItems.map((client, index) => {
            const content = client.logo ? (
              <img
                src={client.logo}
                alt={client.name}
                className="h-8 md:h-12 w-auto object-contain grayscale hover:grayscale-0 opacity-50 hover:opacity-100 transition-all duration-300"
                loading="lazy"
              />
            ) : (
              <span className="text-2xl md:text-4xl font-black text-gray-200 uppercase tracking-tight hover:text-orange-500 transition-colors duration-300 select-none">
                {client.name}
              </span>
            );

            return (
              <div key={`${client._id}-${index}`} className="flex-shrink-0">
                {client.website ? (
                  <a
                    href={client.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {content}
                  </a>
                ) : (
                  content
                )}
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
