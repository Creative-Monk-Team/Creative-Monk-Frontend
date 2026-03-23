"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { adminApi } from "@/lib/api";
import { getRoleHomePath, saveAdminSession } from "@/lib/admin-session";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await adminApi.login(email, password);
      saveAdminSession(response.token, response.user);
      router.push(getRoleHomePath(response.user.role));
    } catch {
      setError("Invalid credentials. Please verify the email and password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[linear-gradient(180deg,#fffaf5_0%,#ffffff_44%,#f8fafc_100%)] px-4 py-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,102,0,0.12),transparent_26%),radial-gradient(circle_at_bottom_left,rgba(15,23,42,0.08),transparent_28%)]" />
      <div className="absolute left-10 top-10 h-40 w-40 rounded-full bg-orange-100/70 blur-3xl" />
      <div className="absolute bottom-8 right-10 h-44 w-44 rounded-full bg-slate-200/60 blur-3xl" />

      <form
        onSubmit={onSubmit}
        className="relative w-full max-w-md rounded-[2rem] border border-white/70 bg-white/90 p-8 shadow-[0_28px_80px_-52px_rgba(15,23,42,0.24)] backdrop-blur-xl sm:p-10"
      >
        <p className="text-[11px] font-medium uppercase tracking-[0.26em] text-orange-600">
          Creative Monk
        </p>
        <h1 className="mt-4 text-[2rem] font-medium tracking-[-0.04em] text-slate-950">
          Admin sign in
        </h1>
        <p className="mt-3 text-sm leading-7 text-slate-500">
          Sign in with your assigned admin account. The correct workspace will open automatically.
        </p>

        <div className="mt-8 space-y-4">
          <label className="block space-y-2 text-sm font-medium text-slate-600">
            <span>Email</span>
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              className="h-12 w-full rounded-[1.15rem] border border-slate-200 bg-white px-4 text-[15px] text-slate-900 outline-none transition focus:border-orange-300 focus:bg-orange-50/30"
            />
          </label>

          <label className="block space-y-2 text-sm font-medium text-slate-600">
            <span>Password</span>
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              className="h-12 w-full rounded-[1.15rem] border border-slate-200 bg-white px-4 text-[15px] text-slate-900 outline-none transition focus:border-orange-300 focus:bg-orange-50/30"
            />
          </label>
        </div>

        {error ? (
          <p className="mt-4 rounded-[1rem] border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-slate-950 px-6 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Signing in..." : "Continue"}
          {!loading ? <ArrowRight className="h-4 w-4" /> : null}
        </button>
      </form>
    </div>
  );
}
