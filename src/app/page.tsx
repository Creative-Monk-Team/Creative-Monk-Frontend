import type { Metadata } from "next";
import { Hero } from "@/components/sections/hero";
import { ClientMarquee } from "@/components/sections/client-marquee";
import { Services } from "@/components/sections/services";
import { Process } from "@/components/sections/process";
import { Stats } from "@/components/sections/stats";
import { CaseStudies } from "@/components/sections/case-studies";
import { Portfolio } from "@/components/sections/portfolio";
import { Testimonials } from "@/components/sections/testimonials";
import { FAQ } from "@/components/sections/faq";
import { RecentBlogs } from "@/components/sections/recent-blogs";
import { ContactForm } from "@/components/sections/contact-form";
import { CTA } from "@/components/sections/cta";

export const metadata: Metadata = {
  title: "Top Digital Marketing Company in Chandigarh | The Creative Monk",
  description:
    "Boost your business with The Creative Monk, the leading digital marketing agency in Chandigarh offering web design, SEO, and performance marketing strategies for maximum ROI.",
  keywords: [
    "digital marketing company Chandigarh",
    "best SEO agency in Chandigarh",
    "web design company",
    "performance marketing",
    "The Creative Monk",
  ],
  openGraph: {
    title: "Top Digital Marketing Company in Chandigarh | The Creative Monk",
    description:
      "Build Revenue Engines with the top-rated digital marketing and web design agency in Chandigarh.",
    url: "https://thecreativemonk.in",
    siteName: "The Creative Monk",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Creative Monk | Digital Marketing Experts",
    description:
      "Build Revenue Engines with the top-rated digital marketing agency.",
  },
  alternates: {
    canonical: "https://thecreativemonk.in",
  },
};

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        name: "Creative Monk",
        image: "https://thecreativemonk.in/logo.png",
        "@id": "https://thecreativemonk.in",
        url: "https://thecreativemonk.in",
        telephone: "+919463445566",
        email: "info@thecreativemonk.in",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Office No.11-12, 9th floor, Sushma Infinium",
          addressLocality: "Zirakpur",
          addressRegion: "Punjab",
          postalCode: "140603",
          addressCountry: "IN",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: 30.6432,
          longitude: 76.8172,
        },
        openingHoursSpecification: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ],
          opens: "09:00",
          closes: "18:00",
        },
        sameAs: [
          "https://www.facebook.com/creativemonkindia/",
          "https://www.instagram.com/creativemonkindia/",
          "https://www.youtube.com/@creativemonkindia",
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "How long does it take to build a website?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "A standard website typically takes 2-4 weeks from discovery to launch, while complex eCommerce or custom platforms can take 6-12 weeks.",
            },
          },
          {
            "@type": "Question",
            name: "Do you offer SEO services after the website is launched?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes! We specialize in long-term organic growth. We offer monthly SEO retainers that include content creation, backlink building, and technical optimizations.",
            },
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <ClientMarquee />
      <Services />
      <Stats />
      <CaseStudies />
      <Process />
      <Portfolio />
      <Testimonials />
      <RecentBlogs />
      <FAQ />
      <ContactForm className="bg-white border-t border-gray-100" />
      <CTA />
    </>
  );
}
