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
        <div className="text-center mb-12">
          <div
            className="h-14 w-14 rounded-xl flex items-center justify-center mx-auto mb-4"
            style={{ background: "#fff5f0" }}
          >
            <HelpCircle className="h-7 w-7" style={{ color: "#FF6600" }} />
          </div>
          <h2
            className="text-3xl md:text-5xl font-black mb-4"
            style={{ fontFamily: "var(--font-poppins)" }}
          >
            Frequently Asked <span style={{ color: "#FF6600" }}>Questions</span>
          </h2>
          <p className="text-gray-500 text-lg">
            Everything you need to know about Creative Monk.
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
                className="text-left text-base md:text-lg font-bold py-5 hover:no-underline"
                style={{
                  fontFamily: "var(--font-poppins)",
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
