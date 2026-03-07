import { Hero } from "@/components/sections/hero";
import { Services } from "@/components/sections/services";
import { Portfolio } from "@/components/sections/portfolio";
import { ContactForm } from "@/components/sections/contact-form";
import { CTA } from "@/components/sections/cta";

export default function Home() {
  return (
    <div>
      <Hero />
      <Services />
      <Portfolio />
      <ContactForm />
      <CTA />
    </div>
  );
}
