"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const projects = [
  {
    title: "Brand Identity for Monk",
    category: "Branding",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "E-commerce Platform",
    category: "Web Development",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "Social Media Campaign",
    category: "Marketing",
    image:
      "https://images.unsplash.com/photo-1432888622747-4eb9a8fdf43f?auto=format&fit=crop&q=80&w=800",
  },
];

export function Portfolio() {
  return (
    <section className="py-24">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight md:text-5xl">
              Our <span className="text-primary">Work</span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              A showcase of our recent projects and creative successes.
            </p>
          </div>
          <Button variant="outline">View All Projects</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group cursor-pointer overflow-hidden rounded-xl bg-muted"
            >
              <div className="relative h-64 w-full overflow-hidden">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-center items-center text-white p-6">
                  <span className="text-sm font-medium uppercase tracking-wider text-primary mb-2">
                    {project.category}
                  </span>
                  <h3 className="text-xl font-bold text-center">
                    {project.title}
                  </h3>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
