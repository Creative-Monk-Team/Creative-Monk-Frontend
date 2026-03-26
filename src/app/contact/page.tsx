"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  Clock,
  CheckCircle2,
  MessageCircle,
  Sparkles,
  Send,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";

const contactInfo = [
  {
    icon: Phone,
    label: "Phone",
    value: "+91 94634 45566",
    href: "tel:+919463445566",
  },
  {
    icon: Mail,
    label: "Email",
    value: "info@thecreativemonk.in",
    href: "mailto:info@thecreativemonk.in",
  },
  {
    icon: MapPin,
    label: "Visit Us",
    value: "Office No.11-12, 9th Floor, Sushma Infinium, Zirakpur, Punjab",
    href: "https://g.page/creativemonk?we",
  },
  {
    icon: Clock,
    label: "Hours",
    value: "Mon - Sat: 9AM - 6PM",
    href: "#",
  },
];

const services = [
  "WordPress Development",
  "Ecommerce Web Development",
  "Search Engine Optimization",
  "Social Media Marketing",
  "Pay Per Click (PPC)",
  "Digital Marketing",
  "Graphic Designing",
  "Logo Designing",
  "Local Business Marketing",
  "Lead Generation",
  "Video Animations",
  "Other",
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <>
      <PageHeader
        badge="Contact Us"
        title1="Get In"
        title2="Touch."
        description="Ready to grow your business? Let's talk about your project and how we can help."
      />

      {/* ── Contact Section ────────────────────────────── */}
      <section className="relative overflow-hidden bg-white py-16 md:py-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.12]" />
        <div className="pointer-events-none absolute -top-32 right-0 h-[400px] w-[400px] rounded-full bg-orange-500/[0.03] blur-[80px]" />

        <div className="container relative z-10 mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-5 lg:gap-12">
            {/* ── Left: Contact Info ───────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2"
            >
              <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-orange-100 bg-orange-50 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#FF6600]">
                <Sparkles className="h-3 w-3" />
                Get in Touch
              </span>
              <h2
                className="mt-3 text-2xl font-black text-gray-900 md:text-3xl"
                style={{ fontFamily: "var(--font-outfit)" }}
              >
                Let&apos;s Start a{" "}
                <span className="text-[#FF6600]">Conversation</span>
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-gray-500 md:text-base">
                Have a project in mind? Reach out directly or fill the form.
                We typically respond within 2 business hours.
              </p>

              {/* Contact Cards */}
              <div className="mt-8 space-y-3">
                {contactInfo.map(({ icon: Icon, label, value, href }) => (
                  <a
                    key={label}
                    href={href}
                    className="group flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-orange-100 hover:shadow-md"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-[#FF6600] transition-all duration-300 group-hover:bg-[#FF6600] group-hover:text-white group-hover:shadow-md group-hover:shadow-orange-500/25">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-gray-400">
                        {label}
                      </p>
                      <p className="mt-0.5 text-sm font-semibold text-gray-800 truncate">
                        {value}
                      </p>
                    </div>
                  </a>
                ))}
              </div>

              {/* WhatsApp CTA */}
              <a
                href="https://wa.me/919463445566"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 flex items-center justify-center gap-2.5 rounded-xl bg-[#25D366] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
              >
                <MessageCircle className="h-5 w-5" />
                Chat on WhatsApp
              </a>
            </motion.div>

            {/* ── Right: Form ─────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-3"
            >
              {submitted ? (
                <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-gray-100 bg-[#fafafa] p-12 text-center">
                  <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50">
                    <CheckCircle2 className="h-8 w-8 text-[#FF6600]" />
                  </div>
                  <h3
                    className="text-2xl font-black"
                    style={{ fontFamily: "var(--font-outfit)" }}
                  >
                    Message Sent!
                  </h3>
                  <p className="mt-2 max-w-sm text-sm text-gray-500">
                    Thank you for reaching out. Our team will get back to you
                    within 2 business hours.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl shadow-gray-900/[0.04]"
                >
                  {/* Form Header */}
                  <div className="border-b border-gray-100 bg-[#fafafa] px-6 py-5 md:px-8">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FF6600] text-white shadow-md shadow-orange-500/25">
                        <Send className="h-4 w-4" />
                      </div>
                      <div>
                        <h3
                          className="text-lg font-black text-gray-900"
                          style={{ fontFamily: "var(--font-outfit)" }}
                        >
                          Start Your Project
                        </h3>
                        <p className="text-xs text-gray-400">
                          Fill the details below and we&apos;ll get back to you
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Form Body */}
                  <div className="p-6 md:p-8">
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.12em] text-gray-500">
                          Full Name *
                        </label>
                        <Input
                          required
                          placeholder="Your Name"
                          className="h-11 rounded-xl border-gray-200 bg-gray-50 text-sm focus-visible:ring-[#FF6600]"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.12em] text-gray-500">
                          Email Address *
                        </label>
                        <Input
                          required
                          type="email"
                          placeholder="you@company.com"
                          className="h-11 rounded-xl border-gray-200 bg-gray-50 text-sm focus-visible:ring-[#FF6600]"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.12em] text-gray-500">
                          Phone Number
                        </label>
                        <Input
                          type="tel"
                          placeholder="+91 98765 43210"
                          className="h-11 rounded-xl border-gray-200 bg-gray-50 text-sm focus-visible:ring-[#FF6600]"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.12em] text-gray-500">
                          Service Needed *
                        </label>
                        <select
                          required
                          className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm font-medium text-gray-900 outline-none focus:ring-2 focus:ring-[#FF6600]"
                        >
                          <option value="">Select a service...</option>
                          {services.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="mt-5">
                      <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.12em] text-gray-500">
                        Company / Website URL
                      </label>
                      <Input
                        placeholder="Your company or website"
                        className="h-11 rounded-xl border-gray-200 bg-gray-50 text-sm focus-visible:ring-[#FF6600]"
                      />
                    </div>

                    <div className="mt-5">
                      <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.12em] text-gray-500">
                        Project Details *
                      </label>
                      <Textarea
                        required
                        placeholder="Tell us about your project goals, timeline, and budget..."
                        className="min-h-[120px] resize-none rounded-xl border-gray-200 bg-gray-50 text-sm focus-visible:ring-[#FF6600]"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF6600] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition-all duration-300 hover:bg-[#e55500] hover:shadow-xl hover:shadow-orange-500/30 disabled:opacity-70"
                      style={{ fontFamily: "var(--font-outfit)" }}
                    >
                      {loading ? (
                        "Sending..."
                      ) : (
                        <>
                          Get Started <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>

          {/* ── Map ────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-14 overflow-hidden rounded-2xl border border-gray-100 shadow-sm"
            style={{ height: "320px" }}
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3430.0!2d76.8172!3d30.6432!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sSushma+Infinium+Zirakpur!5e0!3m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              title="Creative Monk - Sushma Infinium, Zirakpur"
            />
          </motion.div>
        </div>
      </section>
    </>
  );
}
