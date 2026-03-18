import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { FAQ } from "@/lib/types";

export function FaqList({ items }: { items: FAQ[] }) {
  return (
    <Accordion type="single" collapsible className="space-y-3">
      {items.map((item, index) => (
        <AccordionItem
          key={item._id || `${item.question}-${index}`}
          value={`faq-${index}`}
          className="rounded-[1.5rem] border border-black/5 bg-white px-5"
        >
          <AccordionTrigger className="py-5 text-left text-base font-semibold text-slate-900 hover:no-underline">
            {item.question}
          </AccordionTrigger>
          <AccordionContent className="pb-5 text-sm leading-7 text-slate-600">
            {item.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
