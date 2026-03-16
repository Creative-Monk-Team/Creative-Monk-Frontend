"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Phone,
  BarChart,
  Zap,
  Layout,
} from "lucide-react";
import { CTA } from "@/components/sections/cta";
import { useRef, useState, useEffect } from "react";
import { companyInfo } from "@/data/site";
import { ServiceDetail } from "@/data/services";

export default function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [service, setService] = useState<ServiceDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/services/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => {
        setService(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [slug]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-gray-500">
        Loading service...
      </div>
    );
  }

  if (!service) return notFound();

  return (
    <div className="bg-white min-h-screen" ref={containerRef}>
      {/* Immersive Hero */}
      <div className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden bg-black">
        <motion.div
          className="absolute inset-0 z-0"
          style={{ y: heroY, opacity: heroOpacity }}
        >
          <img
            src={service.image}
            alt={service.title}
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent" />
        </motion.div>

        <div className="container relative z-10 pt-20">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm font-bold uppercase tracking-widest mb-8 transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 transform group-hover:-translate-x-1 transition-transform" />
            Back to Services
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-4xl"
          >
            <h1
              className="text-6xl md:text-8xl lg:text-9xl font-black text-white mb-6 tracking-tighter leading-[0.9]"
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-white to-white/40">
                {service.title.split(" ")[0]}
              </span>
              <br />
              {service.title.split(" ").slice(1).join(" ")}
            </h1>
            <div className="w-24 h-2 bg-[#FF6600] mb-8" />
            <p className="text-white/80 text-2xl md:text-3xl font-light max-w-2xl leading-relaxed">
              {service.tagline}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Split Screen Layout */}
      <section className="relative z-20 bg-white rounded-t-[3rem] -mt-12 overflow-hidden shadow-[0_-20px_40px_rgba(0,0,0,0.1)]">
        <div className="container py-24">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
            {/* Left Sticky Sidebar */}
            <div className="lg:w-1/3">
              <div className="sticky top-32">
                <h2
                  className="text-4xl font-black text-gray-900 mb-6"
                  style={{ fontFamily: "var(--font-outfit)" }}
                >
                  Transform Your{" "}
                  <span className="text-[#FF6600]">Business</span>
                </h2>
                <p className="text-gray-500 text-lg mb-8 leading-relaxed">
                  Partner with an agency that prioritizes measurable results and
                  uncompromising aesthetics.
                </p>

                <div className="space-y-4 mb-10">
                  <Link
                    href="/contact"
                    className="flex justify-between items-center p-5 bg-gray-900 text-white rounded-2xl hover:bg-[#FF6600] transition-colors duration-300 group shadow-xl shadow-gray-900/20"
                  >
                    <span className="font-bold text-lg">Start a Project</span>
                    <ArrowRight className="h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <a
                    href={`tel:${companyInfo.phoneRaw}`}
                    className="flex justify-between items-center p-5 bg-orange-50 text-[#FF6600] rounded-2xl hover:bg-orange-100 transition-colors duration-300 border border-orange-100/50"
                  >
                    <span className="font-bold text-lg">Call Us Directly</span>
                    <Phone className="h-5 w-5" />
                  </a>
                </div>

                {/* Feature List */}
                <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
                  <h3
                    className="font-bold text-gray-900 mb-6 text-xl"
                    style={{ fontFamily: "var(--font-outfit)" }}
                  >
                    Included Capabilities
                  </h3>
                  <ul className="space-y-4">
                    {service.features.map((f: string) => (
                      <li
                        key={f}
                        className="flex items-start gap-3 text-gray-600 font-medium pb-4 border-b border-gray-200/60 last:border-0 last:pb-0"
                      >
                        <CheckCircle2 className="h-5 w-5 text-[#FF6600] flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Right Scrollable Content */}
            <div className="lg:w-2/3 space-y-24">
              {/* The Narrative */}
              <div>
                <span className="text-[#FF6600] font-bold tracking-widest uppercase text-sm mb-4 block">
                  The Narrative
                </span>
                <h3
                  className="text-3xl md:text-5xl font-black text-gray-900 mb-8 leading-tight"
                  style={{ fontFamily: "var(--font-outfit)" }}
                >
                  We don't just execute.
                  <br />
                  We{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6600] to-orange-400">
                    elevate
                  </span>
                  .
                </h3>
                <p className="text-gray-600 text-xl lg:text-2xl leading-relaxed">
                  {service.longDescription}
                </p>
              </div>

              {/* Outcomes Bento */}
              <div>
                <span className="text-[#FF6600] font-bold tracking-widest uppercase text-sm mb-6 block">
                  The Impact
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {service.outcomes.map((o: string, i: number) => (
                    <div
                      key={i}
                      className="bg-white border border-gray-100 p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-lg transition-shadow"
                    >
                      <div className="h-12 w-12 bg-orange-50 rounded-2xl flex items-center justify-center mb-6 text-[#FF6600]">
                        {i === 0 ? (
                          <BarChart />
                        ) : i === 1 ? (
                          <Zap />
                        ) : i === 2 ? (
                          <Layout />
                        ) : (
                          <CheckCircle2 />
                        )}
                      </div>
                      <h4
                        className="text-xl font-bold text-gray-900"
                        style={{ fontFamily: "var(--font-outfit)" }}
                      >
                        {o}
                      </h4>
                    </div>
                  ))}
                </div>
              </div>

              {/* Our Process - Vertical Timeline */}
              <div>
                <span className="text-[#FF6600] font-bold tracking-widest uppercase text-sm mb-8 block">
                  Methodology
                </span>
                <div className="space-y-12 relative before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-[#FF6600] before:via-orange-200 before:to-transparent">
                  {service.process.map(
                    (p: { step: string; desc: string }, i: number) => (
                      <div
                        key={p.step}
                        className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
                      >
                        <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-white bg-[#FF6600] text-white font-bold shadow-xl shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                          0{i + 1}
                        </div>
                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-6 bg-gray-50 rounded-3xl border border-gray-100 hover:bg-white hover:shadow-xl transition-all duration-300">
                          <h4
                            className="font-bold text-2xl mb-2 text-gray-900"
                            style={{ fontFamily: "var(--font-outfit)" }}
                          >
                            {p.step}
                          </h4>
                          <p className="text-gray-500 text-lg leading-relaxed">
                            {p.desc}
                          </p>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>

              {/* FAQs */}
              <div className="bg-gray-900 rounded-[3rem] p-10 md:p-16 text-white text-center">
                <h3
                  className="text-3xl md:text-5xl font-black mb-12"
                  style={{ fontFamily: "var(--font-outfit)" }}
                >
                  Common Inquiries
                </h3>
                <div className="space-y-6 text-left max-w-2xl mx-auto">
                  {service.faqs.map(
                    (faq: { question: string; answer: string }, i: number) => (
                      <div
                        key={i}
                        className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-colors"
                      >
                        <h4
                          className="font-bold text-xl mb-3 text-orange-200"
                          style={{ fontFamily: "var(--font-outfit)" }}
                        >
                          {faq.question}
                        </h4>
                        <p className="text-white/70 text-lg leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CTA />
    </div>
  );
}
