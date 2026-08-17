"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  async function handleLogin(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setLoading(true);

    const { error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (error) {
      setError("Invalid email or password.");
      setLoading(false);
      return;
    }

    router.replace("/admin");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 via-white to-blue-50 px-4">

      <div className="w-full max-w-md rounded-[28px] border border-white/80 bg-white/70 p-7 shadow-[0_25px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-9">

        <div className="text-center">

          <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
            Store Admin
          </p>

          <h1 className="mt-3 text-3xl font-black tracking-tight">
            Welcome back
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Sign in to manage your store.
          </p>

        </div>

        <form
          onSubmit={handleLogin}
          className="mt-8 space-y-5"
        >

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-semibold"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              required
              autoComplete="email"
              placeholder="admin@example.com"
              className="w-full rounded-xl border border-black/10 bg-white/80 px-4 py-3 text-sm outline-none transition focus:border-black/30 focus:ring-2 focus:ring-black/5"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-semibold"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              required
              autoComplete="current-password"
              placeholder="Enter your password"
              className="w-full rounded-xl border border-black/10 bg-white/80 px-4 py-3 text-sm outline-none transition focus:border-black/30 focus:ring-2 focus:ring-black/5"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-black px-5 py-3.5 text-sm font-bold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>

        </form>

      </div>

    </main>
  );
}