"use client";

import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";
import { getFaqs } from "@/lib/api";
import type { FAQ as FAQType } from "@/lib/types";

export function FAQ() {
  const [faqs, setFaqs] = useState<FAQType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFaqs() {
      try {
        const data = await getFaqs("home"); // Assuming a specific 'home' tag or just all
        setFaqs(data);
      } catch (error) {
        console.error("Failed to fetch FAQs:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchFaqs();
  }, []);

  if (!loading && faqs.length === 0) {
    return null; // Hide if empty
  }

  return (
    <section className="section-padding bg-white">
      <div className="container max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <span className="section-label inline-block mb-4">
            Support Centre
          </span>
          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 text-gray-900 leading-tight"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            Frequently Asked <span className="text-[#FF6600]">Questions</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Everything you need to know about Creative Monk and how we help your
            business GROW.
          </p>
        </div>

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-16 bg-gray-50 animate-pulse rounded-xl border border-gray-100"
              />
            ))}
          </div>
        ) : (
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={faq._id || index}
                value={`item-${index}`}
                className="mb-4 border border-gray-100 px-6 rounded-2xl bg-gray-50/30 overflow-hidden"
                style={{
                  boxShadow: "0 4px 15px rgba(0,0,0,0.02)",
                }}
              >
                <AccordionTrigger
                  className="text-left text-base md:text-lg font-black py-5 hover:no-underline"
                  style={{
                    fontFamily: "var(--font-outfit)",
                    color: "#1a1a1a",
                  }}
                >
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-500 text-sm md:text-base leading-relaxed pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </section>
  );
}
