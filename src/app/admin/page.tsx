"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";
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
      setError("Invalid credentials. Verify the email and password and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div data-admin className="relative min-h-screen grid lg:grid-cols-[1.1fr_1fr]">
      {/* LEFT — atmosphere */}
      <aside
        className="hidden lg:flex relative flex-col justify-between p-10 overflow-hidden"
        style={{ background: "#0A0A0A", borderRight: "1px solid var(--admin-border)" }}
      >
        <div className="absolute inset-0 admin-grid-bg pointer-events-none opacity-70" />
        <div
          className="absolute -top-32 -right-32 w-[420px] h-[420px] rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(255,102,0,0.18) 0%, transparent 65%)",
            filter: "blur(8px)",
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-[320px] h-[320px] rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(62,99,221,0.10) 0%, transparent 70%)",
            filter: "blur(20px)",
          }}
        />

        <div className="relative flex items-center gap-3">
          <div
            className="grid place-items-center h-9 w-9 font-bold text-[14px]"
            style={{
              background: "var(--admin-accent)",
              color: "var(--admin-bg)",
              fontFamily: "var(--admin-font-mono)",
              borderRadius: "var(--radius-sm)",
            }}
          >
            C
          </div>
          <div className="leading-none">
            <p className="admin-eyebrow">Creative Monk</p>
            <p className="text-[15px] mt-1 font-semibold tracking-tight">Operator Console</p>
          </div>
        </div>

        <div className="relative">
          <p className="admin-eyebrow mb-6">⌘ Tonight in studio</p>
          <h1
            className="text-[42px] leading-[1.05] font-semibold tracking-[-0.025em] max-w-[14ch]"
            style={{ fontFamily: "var(--admin-font-display)" }}
          >
            The room behind the website.
          </h1>
          <p
            className="mt-5 text-[14px] leading-[1.65] text-[var(--admin-fg-mute)] max-w-[42ch]"
          >
            Every word on the public site, every case study, every enquiry —
            edited from one console. Sign in to keep shipping.
          </p>

          <div className="mt-10 grid grid-cols-3 gap-px" style={{ background: "var(--admin-border)" }}>
            {[
              { label: "Brands shipped", value: "142" },
              { label: "Avg reply",      value: "<4hr" },
              { label: "Studio rating",  value: "4.9★" },
            ].map((s) => (
              <div key={s.label} className="px-4 py-4" style={{ background: "var(--admin-bg)" }}>
                <p className="admin-eyebrow text-[9.5px]">{s.label}</p>
                <p
                  className="mt-2 text-[24px] font-semibold admin-tnum"
                  style={{ fontFamily: "var(--admin-font-display)", letterSpacing: "-0.02em" }}
                >
                  {s.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative flex items-center justify-between">
          <p className="admin-eyebrow">v1.0 · build {new Date().getFullYear()}</p>
          <p className="admin-eyebrow">Mohali · 30.64°N</p>
        </div>
      </aside>

      {/* RIGHT — form */}
      <main
        className="relative flex items-center justify-center p-6 md:p-10"
        style={{ background: "var(--admin-bg)" }}
      >
        <form
          onSubmit={onSubmit}
          className="relative w-full max-w-[420px]"
        >
          <div className="mb-8">
            <p className="admin-eyebrow">Authenticate</p>
            <h2
              className="mt-2 text-[28px] font-semibold tracking-[-0.025em]"
              style={{ fontFamily: "var(--admin-font-display)" }}
            >
              Sign in to the console
            </h2>
            <p className="mt-2 text-[13.5px] text-[var(--admin-fg-mute)] leading-[1.6]">
              Single set of credentials. The console opens at the workspace
              overview.
            </p>
          </div>

          <div className="space-y-3">
            <Field
              label="Email"
              hint="ADMIN@DOMAIN"
              type="email"
              value={email}
              onChange={setEmail}
              autoComplete="email"
            />
            <Field
              label="Password"
              hint="·······"
              type="password"
              value={password}
              onChange={setPassword}
              autoComplete="current-password"
            />
          </div>

          {error ? (
            <div
              className="mt-4 px-3 py-2.5 text-[12.5px] flex items-start gap-2"
              style={{
                background: "rgba(229,72,77,0.08)",
                border: "1px solid rgba(229,72,77,0.3)",
                color: "var(--admin-danger)",
                borderRadius: "var(--radius-sm)",
              }}
            >
              <span className="admin-mono text-[10.5px] mt-[2px]">ERR</span>
              <span>{error}</span>
            </div>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 group w-full h-11 inline-flex items-center justify-center gap-2 font-medium text-[13.5px] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            style={{
              background: "var(--admin-accent)",
              color: "var(--admin-bg)",
              borderRadius: "var(--radius-sm)",
              boxShadow: "0 0 0 1px rgba(255,102,0,0.4), 0 0 24px -8px rgba(255,102,0,0.35)",
            }}
          >
            {loading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Authenticating…
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
              </>
            )}
          </button>

          <div className="mt-8 flex items-center justify-between">
            <p className="admin-eyebrow">Authorized personnel only</p>
            <span className="admin-eyebrow opacity-60">⌘K once inside</span>
          </div>
        </form>
      </main>
    </div>
  );
}

function Field({
  label,
  hint,
  type,
  value,
  onChange,
  autoComplete,
}: {
  label: string;
  hint?: string;
  type: "email" | "password" | "text";
  value: string;
  onChange: (v: string) => void;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <div className="flex items-center justify-between mb-1.5">
        <span className="admin-eyebrow">{label}</span>
        {hint ? <span className="admin-mono text-[10px] text-[var(--admin-fg-dim)]">{hint}</span> : null}
      </div>
      <input
        type={type}
        value={value}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-11 px-3 text-[14px]"
      />
    </label>
  );
}
