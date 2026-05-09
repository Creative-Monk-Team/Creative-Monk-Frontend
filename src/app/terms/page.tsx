import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service | Creative Monk",
  description:
    "Read Creative Monk's terms of service and conditions for using our digital agency services.",
};

export default function TermsPage() {
  return (
    <section className="section-padding bg-white">
      <div className="container max-w-3xl mx-auto">
        <h1
          className="text-4xl font-black mb-3"
          style={{ fontFamily: "var(--font-poppins)" }}
        >
          Terms of Service
        </h1>
        <p className="text-gray-400 text-sm mb-10">Last updated: March 2024</p>
        <div className="space-y-8 text-gray-600">
          <section>
            <h2
              className="text-xl font-bold text-gray-900 mb-3"
              style={{ fontFamily: "var(--font-poppins)" }}
            >
              Services
            </h2>
            <p>
              Creative Monk provides digital marketing, web design, SEO,
              branding, and related services as described on our website.
              Specific deliverables, timelines, and pricing are outlined in
              individual project agreements.
            </p>
          </section>
          <section>
            <h2
              className="text-xl font-bold text-gray-900 mb-3"
              style={{ fontFamily: "var(--font-poppins)" }}
            >
              Payments
            </h2>
            <p>
              Payment terms are defined per project. Invoices are due within 15
              days of issuance unless otherwise agreed. Late payments may incur
              interest charges.
            </p>
          </section>
          <section>
            <h2
              className="text-xl font-bold text-gray-900 mb-3"
              style={{ fontFamily: "var(--font-poppins)" }}
            >
              Intellectual Property
            </h2>
            <p>
              Upon full payment, clients receive ownership rights to final
              deliverables. Creative Monk retains the right to display work in
              our portfolio unless otherwise specified.
            </p>
          </section>
          <section>
            <h2
              className="text-xl font-bold text-gray-900 mb-3"
              style={{ fontFamily: "var(--font-poppins)" }}
            >
              Limitation of Liability
            </h2>
            <p>
              Creative Monk&apos;s liability is limited to the value of services
              paid. We are not liable for indirect, incidental, or consequential
              damages arising from use of our services.
            </p>
          </section>
          <section>
            <h2
              className="text-xl font-bold text-gray-900 mb-3"
              style={{ fontFamily: "var(--font-poppins)" }}
            >
              Contact
            </h2>
            <p>
              Questions? Email{" "}
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
