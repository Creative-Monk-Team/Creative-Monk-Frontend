import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "sonner";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
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
  authors: [{ name: "Creative Monk" }],
  creator: "Creative Monk",
  icons: {
    icon: "/images/icon-logo.png",
    shortcut: "/images/icon-logo.png",
    apple: "/images/icon-logo.png",
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${inter.variable}`}>
      <body
        style={{ fontFamily: "var(--font-inter, 'Inter', sans-serif)" }}
        className="overflow-x-hidden"
      >
        <div className="flex min-h-screen flex-col overflow-x-hidden">
          <Toaster richColors position="top-center" />
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
