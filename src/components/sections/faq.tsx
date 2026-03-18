"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";
import { homeFaqs } from "@/data/site";

export function FAQ() {
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

        {/* FAQ Accordion */}
        <Accordion type="single" collapsible className="space-y-3">
          {homeFaqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="rounded-2xl overflow-hidden px-6"
              style={{
                background: "#fafafa",
                border: "1px solid #f0f0f0",
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
              <AccordionContent className="text-gray-500 leading-relaxed pb-5 text-base">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
