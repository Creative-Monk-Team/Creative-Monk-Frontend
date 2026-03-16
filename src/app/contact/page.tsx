"use client";

import type { Metadata } from "next";
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
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";

const contactInfo = [
  {
    icon: Phone,
    label: "Call Us",
    value: "+91 94634 45566",
    href: "tel:+919463445566",
  },
  {
    icon: Mail,
    label: "Email Us",
    value: "info@thecreativemonk.in",
    href: "mailto:info@thecreativemonk.in",
  },
  {
    icon: MapPin,
    label: "Address",
    value:
      "Office No.11-12, 9th floor, Sushma Infinium, Zirakpur, Punjab, 140603",
    href: "https://g.page/creativemonk?we",
  },
  {
    icon: Clock,
    label: "Working Hours",
    value: "Mon – Sat: 9AM – 6PM",
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

      <section className="section-padding bg-white">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-2 flex flex-col gap-5"
            >
              <div>
                <span className="section-label block mb-2">
                  Contact Details
                </span>
                <h2
                  className="text-2xl font-black mb-4"
                  style={{ fontFamily: "var(--font-poppins)" }}
                >
                  Let's Start a Conversation
                </h2>
                <p className="text-gray-500 leading-relaxed">
                  Have a project in mind? Fill out the form or reach out
                  directly. We typically respond within 2 business hours.
                </p>
              </div>
              {contactInfo.map(({ icon: Icon, label, value, href }) => (
                <a
                  key={label}
                  href={href}
                  className="flex gap-4 p-5 rounded-xl transition-all hover:shadow-md group"
                  style={{ background: "#fafafa", border: "1px solid #f0f0f0" }}
                >
                  <div
                    className="h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
                    style={{ background: "#FF6600" }}
                  >
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-0.5">
                      {label}
                    </p>
                    <p
                      className="font-semibold text-gray-800"
                      style={{ fontFamily: "var(--font-poppins)" }}
                    >
                      {value}
                    </p>
                  </div>
                </a>
              ))}
            </motion.div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-3"
            >
              {submitted ? (
                <div
                  className="h-full flex flex-col items-center justify-center p-12 rounded-3xl text-center"
                  style={{ background: "#fafafa", border: "1px solid #f0f0f0" }}
                >
                  <div
                    className="h-20 w-20 rounded-full flex items-center justify-center mb-6"
                    style={{ background: "#e8fdf5" }}
                  >
                    <CheckCircle2
                      className="h-10 w-10"
                      style={{ color: "#FF6600" }}
                    />
                  </div>
                  <h3
                    className="text-2xl font-black mb-2"
                    style={{ fontFamily: "var(--font-poppins)" }}
                  >
                    Message Sent!
                  </h3>
                  <p className="text-gray-500 max-w-sm">
                    Thank you for reaching out. Our team will get back to you
                    within 2 business hours.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="rounded-3xl p-8 md:p-10 shadow-lg"
                  style={{ background: "#fafafa", border: "1px solid #f0f0f0" }}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label
                        className="block text-sm font-semibold mb-2"
                        style={{ fontFamily: "var(--font-poppins)" }}
                      >
                        Full Name *
                      </label>
                      <Input
                        required
                        placeholder="John Doe"
                        className="rounded-xl border-gray-200 h-12 focus-visible:ring-[#FF6600]"
                      />
                    </div>
                    <div>
                      <label
                        className="block text-sm font-semibold mb-2"
                        style={{ fontFamily: "var(--font-poppins)" }}
                      >
                        Email Address *
                      </label>
                      <Input
                        required
                        type="email"
                        placeholder="john@company.com"
                        className="rounded-xl border-gray-200 h-12 focus-visible:ring-[#FF6600]"
                      />
                    </div>
                    <div>
                      <label
                        className="block text-sm font-semibold mb-2"
                        style={{ fontFamily: "var(--font-poppins)" }}
                      >
                        Phone Number
                      </label>
                      <Input
                        type="tel"
                        placeholder="+91 98765 43210"
                        className="rounded-xl border-gray-200 h-12 focus-visible:ring-[#FF6600]"
                      />
                    </div>
                    <div>
                      <label
                        className="block text-sm font-semibold mb-2"
                        style={{ fontFamily: "var(--font-poppins)" }}
                      >
                        Service Needed *
                      </label>
                      <select
                        required
                        className="w-full h-12 px-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#FF6600] font-medium"
                        style={{
                          border: "1px solid #e5e5e5",
                          background: "white",
                          color: "#1a1a1a",
                        }}
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
                  <div className="mb-4">
                    <label
                      className="block text-sm font-semibold mb-2"
                      style={{ fontFamily: "var(--font-poppins)" }}
                    >
                      Company / Website URL
                    </label>
                    <Input
                      placeholder="Your company name or website"
                      className="rounded-xl border-gray-200 h-12 focus-visible:ring-[#FF6600]"
                    />
                  </div>
                  <div className="mb-6">
                    <label
                      className="block text-sm font-semibold mb-2"
                      style={{ fontFamily: "var(--font-poppins)" }}
                    >
                      Tell us about your project *
                    </label>
                    <Textarea
                      required
                      placeholder="Describe your project, goals, timeline, and budget..."
                      className="rounded-xl border-gray-200 focus-visible:ring-[#FF6600] min-h-[150px] resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full justify-center text-base py-4"
                    style={{ opacity: loading ? 0.8 : 1 }}
                  >
                    {loading ? (
                      "Sending..."
                    ) : (
                      <>
                        Send Message <ArrowRight className="h-5 w-5" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </motion.div>
          </div>

          {/* Map */}
          <div
            className="mt-16 rounded-3xl overflow-hidden"
            style={{ height: "300px", background: "#f5f5f5" }}
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3430.0!2d76.8172!3d30.6432!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sSushma+Infinium+Zirakpur!5e0!3m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              title="Creative Monk - Sushma Infinium, Zirakpur"
            />
          </div>
        </div>
      </section>
    </>
  );
}
