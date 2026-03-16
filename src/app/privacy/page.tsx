import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | Creative Monk",
  description:
    "Read Creative Monk's privacy policy to understand how we collect, use, and protect your personal information.",
};

export default function PrivacyPage() {
  return (
    <section className="section-padding bg-white">
      <div className="container max-w-3xl mx-auto">
        <h1
          className="text-4xl font-black mb-3"
          style={{ fontFamily: "var(--font-poppins)" }}
        >
          Privacy Policy
        </h1>
        <p className="text-gray-400 text-sm mb-10">Last updated: March 2024</p>
        <div className="prose prose-lg max-w-none space-y-8 text-gray-600">
          <section>
            <h2
              className="text-xl font-bold text-gray-900"
              style={{ fontFamily: "var(--font-poppins)" }}
            >
              Information We Collect
            </h2>
            <p>
              We collect information you provide directly — such as your name,
              email address, phone number, and project details — when you fill
              out our contact form or request a quote.
            </p>
          </section>
          <section>
            <h2
              className="text-xl font-bold text-gray-900"
              style={{ fontFamily: "var(--font-poppins)" }}
            >
              How We Use Your Information
            </h2>
            <p>
              We use your information to respond to inquiries, provide requested
              services, send service updates, and improve our website. We do not
              sell or share your personal data with third parties.
            </p>
          </section>
          <section>
            <h2
              className="text-xl font-bold text-gray-900"
              style={{ fontFamily: "var(--font-poppins)" }}
            >
              Cookies
            </h2>
            <p>
              We use cookies to improve user experience, analyze traffic, and
              measure performance. You can disable cookies in your browser
              settings.
            </p>
          </section>
          <section>
            <h2
              className="text-xl font-bold text-gray-900"
              style={{ fontFamily: "var(--font-poppins)" }}
            >
              Contact
            </h2>
            <p>
              For any privacy-related questions, email us at{" "}
              <a
                href="mailto:hello@thecreativemonk.in"
                className="font-semibold"
                style={{ color: "#FF6600" }}
              >
                hello@thecreativemonk.in
              </a>
              .
            </p>
          </section>
        </div>
        <div className="mt-12">
          <Link href="/" className="btn-outline-orange">
            ← Back to Home
          </Link>
        </div>
      </div>
    </section>
  );
}
