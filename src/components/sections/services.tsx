"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/button";
import {
  Laptop,
  Search,
  Share2,
  Palette,
  PenTool,
  BarChart,
} from "lucide-react";

const services = [
  {
    title: "Web Design",
    description:
      "Creating stunning, responsive websites that convert visitors into customers.",
    icon: Laptop,
  },
  {
    title: "SEO Optimization",
    description:
      "Boosting your search rankings to drive organic traffic to your business.",
    icon: Search,
  },
  {
    title: "Social Media",
    description:
      "Engaging your audience and building community across all social platforms.",
    icon: Share2,
  },
  {
    title: "Brand Identity",
    description:
      "Developing unique brand personas that stand out in a crowded market.",
    icon: Palette,
  },
  {
    title: "Graphics Design",
    description:
      "Crafting beautiful visual assets for print and digital media.",
    icon: PenTool,
  },
  {
    title: "Digital Marketing",
    description:
      "Comprehensive strategies to grow your business online and ROI.",
    icon: BarChart,
  },
];

export function Services() {
  return (
    <section className="py-24 bg-muted/50">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight md:text-5xl">
            Our <span className="text-primary">Services</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Comprehensive creative solutions tailored to your business goals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="group relative overflow-hidden rounded-lg border bg-background p-8 hover:border-primary transition-all hover:shadow-lg">
                <div className="mb-4 inline-flex items-center justify-center rounded-lg bg-primary/10 p-3 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <service.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">{service.title}</h3>
                <p className="mt-2 text-muted-foreground">
                  {service.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
