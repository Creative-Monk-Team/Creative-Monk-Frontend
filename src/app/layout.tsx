import type { Metadata, Viewport } from "next";

import {
  Fraunces,
  Instrument_Sans,
  Instrument_Serif,
  JetBrains_Mono,
  Funnel_Display,
  Caprasimo,
  Plus_Jakarta_Sans,
  Newsreader,
} from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ScrollToTop } from "@/components/layout/scroll-to-top";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SmoothScrollProvider } from "@/components/motion/smooth-scroll-provider";
import { CursorHalo } from "@/components/motion/cursor-halo";
import { SiteLoader } from "@/components/site/loader";
import { EnquiryPopup } from "@/components/site/enquiry-popup";




const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["SOFT", "WONK", "opsz"],
  display: "swap",
  style: ["normal", "italic"],
});

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument-sans",
  display: "swap",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-instrument-serif",
  display: "swap",
  weight: ["400"],
  style: ["normal", "italic"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jb-mono",
  display: "swap",
  weight: ["400", "500", "600"],
});

/* New display + body system — used by the hero and any section that
   opts in via the v4-* variable names. */
const funnelDisplay = Funnel_Display({
  subsets: ["latin"],
  variable: "--font-funnel-display",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const caprasimo = Caprasimo({
  subsets: ["latin"],
  variable: "--font-caprasimo",
  display: "swap",
  weight: ["400"],
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

/* New accent serif — replaces Fraunces italic across the site.
   Slimmer, more editorial, variable optical-size axis. */
const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  axes: ["opsz"],
  display: "swap",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://thecreativemonk.in"),
  title: {
    default: "Top Digital Marketing Company in Chandigarh | The Creative Monk",
    template: "%s | Creative Monk",
  },
  description:
    "Boost your business with The Creative Monk, the leading digital marketing company in Chandigarh. Expert strategies for Web Development, SEO, Social Media Marketing, Graphic Designing & Video Animations.",
  keywords: [
    "Digital Marketing Company Chandigarh",
    "Web Designing Company Chandigarh",
    "SEO Company Chandigarh",
    "Social Media Marketing Chandigarh",
    "Graphic Designing Company Chandigarh",
    "Best Digital Marketing Agency India",
    "WordPress Development Chandigarh",
    "Ecommerce Development Chandigarh",
    "PPC Company Chandigarh",
    "Lead Generation Chandigarh",
    "Creative Monk",
  ],
  authors: [{ name: "Creative Monk", url: "https://thecreativemonk.in" }],
  creator: "Creative Monk",
  publisher: "The Creative Monk",
  applicationName: "The Creative Monk",
  icons: {
    icon: [
      { url: "/images/icon-logo.png" },
      { url: "/images/icon-logo.png", sizes: "32x32", type: "image/png" },
      { url: "/images/icon-logo.png", sizes: "16x16", type: "image/png" },
    ],
    shortcut: "/images/icon-logo.png",
    apple: [
      { url: "/images/icon-logo.png" },
      { url: "/images/icon-logo.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "apple-touch-icon-precomposed",
        url: "/images/icon-logo.png",
      },
    ],
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://thecreativemonk.in",
    siteName: "Creative Monk",
    title: "The Creative Monk | #1 Digital Marketing Agency in Chandigarh",
    description:
      "Transform your business with Chandigarh's top digital marketing agency. We specialize in high-converting websites, SEO that ranks, and ROI-driven marketing strategies.",
    images: [
      {
        url: "/logo.webp",
        width: 1200,
        height: 630,
        alt: "Creative Monk - Digital Marketing Company",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Creative Monk | Growth-Focused Digital Agency",
    description:
      "Leading digital marketing agency in Chandigarh - Web Design, SEO, Social Media & Brand Strategy.",
    images: ["/logo.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
  alternates: {
    canonical: "https://thecreativemonk.in",
  },
  category: "technology",
  verification: {
    google: "RdKP5MjEnBUowkUkqkXwil83dGTfUklVZ1elPfQlm1w",
  },
};


export const viewport: Viewport = {
  themeColor: "#FF6600",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "The Creative Monk",
  "image": "https://thecreativemonk.in/logo.webp",
  "@id": "https://thecreativemonk.in",
  "url": "https://thecreativemonk.in",
  "telephone": "+91 94634 45566",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Office No.11-12, 9th floor, Sushma Infinium",
    "addressLocality": "Zirakpur",
    "addressRegion": "Punjab",
    "postalCode": "140603",
    "addressCountry": "IN"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 30.6425,
    "longitude": 76.8173
  },
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ],
    "opens": "09:30",
    "closes": "18:30"
  },
  "sameAs": [
    "https://www.facebook.com/creativemonkindia/",
    "https://www.instagram.com/creativemonkindia/",
    "https://www.youtube.com/@creativemonkindia"
  ]
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${instrumentSans.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable} ${funnelDisplay.variable} ${caprasimo.variable} ${jakarta.variable} ${newsreader.variable}`}>
      <body
        style={{ fontFamily: "var(--font-instrument-sans), system-ui, sans-serif" }}
        className="overflow-x-hidden"
      >
        <SiteLoader />
        <SmoothScrollProvider />
        <CursorHalo />
        <div className="site-grain" aria-hidden />
        <div className="flex min-h-screen flex-col overflow-x-hidden">
          <Toaster richColors position="top-center" />
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <ScrollToTop />
        </div>
        <EnquiryPopup />
        <Analytics />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <GoogleAnalytics gaId="G-1XX3SG68HR" />
        <SpeedInsights />
      </body>



    </html>
  );
}
