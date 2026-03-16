import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div
      className="min-h-[80vh] flex flex-col items-center justify-center text-center px-6"
      style={{ background: "white" }}
    >
      <div
        className="text-9xl font-black mb-4"
        style={{
          fontFamily: "var(--font-poppins)",
          background: "linear-gradient(135deg, #FF6600, #ff5500)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        404
      </div>
      <h1
        className="text-3xl md:text-4xl font-black mb-4"
        style={{ fontFamily: "var(--font-poppins)" }}
      >
        Page Not Found
      </h1>
      <p className="text-gray-500 text-lg max-w-md mb-10">
        Sorry, we couldn't find the page you're looking for. It may have been
        moved, deleted, or the URL might be incorrect.
      </p>
      <div className="flex gap-4">
        <Link href="/" className="btn-primary">
          <Home className="h-4 w-4" /> Go Home
        </Link>
        <Link href="/contact" className="btn-outline-orange">
          Contact Us
        </Link>
      </div>
    </div>
  );
}
