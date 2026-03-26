"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, Mail, Phone, MapPin, Clock } from "lucide-react";
import { getSiteSettings, submitEnquiry } from "@/lib/api";
import type { SiteSettings } from "@/lib/types";
import { toast } from "sonner";

export function ContactForm({ className = "" }: { className?: string }) {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    getSiteSettings().then(setSettings);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      service: formData.get("service") as string,
      message: formData.get("message") as string,
      sourcePage: window.location.pathname,
    };

    try {
      await submitEnquiry(data);
      toast.success("Message sent successfully! We'll get back to you soon.");
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      toast.error("Failed to send message. Please try again or call us.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      label: "Phone",
      value: settings?.phone || "+91 94634 45566",
      href: `tel:${settings?.phoneRaw || "+919463445566"}`,
    },
    {
      icon: Mail,
      label: "Email",
      value: settings?.email || "info@thecreativemonk.in",
      href: `mailto:${settings?.email || "info@thecreativemonk.in"}`,
    },
    {
      icon: MapPin,
      label: "Address",
      value:
        settings?.address?.full ||
        "Office No.11-12, 9th floor, Sushma Infinium, Zirakpur, Punjab, 140603",
      href: settings?.address?.mapsUrl || "https://g.page/creativemonk?we",
    },
    {
      icon: Clock,
      label: "Hours",
      value: settings?.workingHours || "Mon–Sat: 9AM – 6PM",
      href: "#",
    },
  ];

  return (
    <section className={`section-padding bg-white ${className}`} id="contact">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="section-label block mb-3">Get In Touch</span>
          <h2
            className="text-3xl md:text-5xl font-black"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            Start Your Project <span style={{ color: "#FF6600" }}>Today</span>
          </h2>
          <p className="text-gray-500 text-lg mt-4">
            Thank you for your interest in Creative Monk. Please complete the
            form and a member of our team will get in touch shortly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 flex flex-col gap-6"
          >
            {contactInfo.map(({ icon: Icon, label, value, href }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={
                  href.startsWith("http") ? "noopener noreferrer" : undefined
                }
                className="flex gap-5 p-5 rounded-2xl transition-all hover:shadow-xl group bg-gray-50/50 border border-gray-100 hover:bg-white hover:border-orange-100"
              >
                <div className="h-11 w-11 rounded-xl flex items-center justify-center flex-shrink-0 bg-orange-50 text-[#FF6600] transition-all duration-300 group-hover:scale-110 group-hover:bg-[#FF6600] group-hover:text-white group-hover:shadow-md group-hover:shadow-orange-500/25">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                    {label}
                  </p>
                  <p
                    className="font-bold text-gray-900 text-sm leading-snug"
                    style={{ fontFamily: "var(--font-outfit)" }}
                  >
                    {value}
                  </p>
                </div>
              </a>
            ))}

            {/* WhatsApp Button */}
            {settings?.social?.whatsapp && (
              <a
                href={settings.social.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2.5 p-5 rounded-2xl text-white text-sm font-bold transition-all hover:shadow-xl hover:-translate-y-0.5 shadow-md shadow-green-500/20"
                style={{ background: "#25D366" }}
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Chat on WhatsApp
              </a>
            )}
          </motion.div>

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-3 rounded-[2rem] p-8 md:p-10 shadow-2xl shadow-orange-500/5 bg-gray-50/50 border border-gray-100"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <div>
                <label
                  className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1"
                  style={{ fontFamily: "var(--font-outfit)" }}
                >
                  Full Name *
                </label>
                <Input
                  name="name"
                  required
                  placeholder="Your Name"
                  className="rounded-xl border-gray-200 h-14 bg-white focus-visible:ring-[#FF6600]"
                />
              </div>
              <div>
                <label
                  className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1"
                  style={{ fontFamily: "var(--font-outfit)" }}
                >
                  Email Address *
                </label>
                <Input
                  name="email"
                  required
                  type="email"
                  placeholder="your@email.com"
                  className="rounded-xl border-gray-200 h-14 bg-white focus-visible:ring-[#FF6600]"
                />
              </div>
              <div>
                <label
                  className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1"
                  style={{ fontFamily: "var(--font-outfit)" }}
                >
                  Phone Number
                </label>
                <Input
                  name="phone"
                  type="tel"
                  placeholder="+91 XXXXX XXXXX"
                  className="rounded-xl border-gray-200 h-14 bg-white focus-visible:ring-[#FF6600]"
                />
              </div>
              <div>
                <label
                  className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1"
                  style={{ fontFamily: "var(--font-outfit)" }}
                >
                  Service Needed
                </label>
                <Input
                  name="service"
                  placeholder="e.g. Web Design, SEO..."
                  className="rounded-xl border-gray-200 h-14 bg-white focus-visible:ring-[#FF6600]"
                />
              </div>
            </div>
            <div className="mb-8">
              <label
                className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1"
                style={{ fontFamily: "var(--font-outfit)" }}
              >
                Your Message *
              </label>
              <Textarea
                name="message"
                required
                placeholder="Tell us about your project goals..."
                className="rounded-xl border-gray-200 bg-white focus-visible:ring-[#FF6600] min-h-[160px] resize-none"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full justify-center text-base py-5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Sending...
                </div>
              ) : (
                <>
                  Get Started <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
