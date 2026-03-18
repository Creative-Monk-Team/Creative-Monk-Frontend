"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminApi } from "@/lib/api";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@thecreativemonk.in");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await adminApi.login(email, password);
      localStorage.setItem("creative-monk-admin-token", response.token);
      router.push("/admin/dashboard");
    } catch {
      setError(
        "Invalid credentials. Please verify your admin email and password.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md rounded-[2.5rem] border border-gray-100 bg-white p-10 shadow-[0_24px_80px_rgba(255,102,0,0.08)] relative overflow-hidden"
      >
        {/* Decorative corner */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50 rounded-bl-[4rem] -mr-8 -mt-8" />

        <p
          className="text-xs font-black uppercase tracking-[0.2em] text-[#FF6600]"
          style={{ fontFamily: "var(--font-outfit)" }}
        >
          Creative Monk CMS
        </p>
        <h1
          className="mt-4 text-4xl font-black text-gray-900"
          style={{ fontFamily: "var(--font-outfit)" }}
        >
          Admin Login
        </h1>
        <p className="mt-3 text-sm text-gray-500 font-medium leading-relaxed">
          Use the backend admin credentials to manage the site content.
        </p>

        <div className="mt-8 space-y-4">
          <label className="space-y-2 text-sm font-medium text-slate-700">
            <span>Email</span>
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              className="h-12 w-full rounded-2xl border border-slate-200 px-4 outline-none focus:border-orange-300"
            />
          </label>
          <label className="space-y-2 text-sm font-medium text-slate-700">
            <span>Password</span>
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              className="h-12 w-full rounded-2xl border border-slate-200 px-4 outline-none focus:border-orange-300"
            />
          </label>
        </div>

        {error ? (
          <p className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary mt-6 w-full justify-center"
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}
