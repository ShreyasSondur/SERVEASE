"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";

export default function AdminSignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await api.post("/auth/admin/signup", { email, password });
      setSuccess(true);
      setTimeout(() => {
        router.push("/admin/login");
      }, 3000);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gold/10 via-black to-black" />
        <div className="z-10 w-full max-w-md bg-[#111] p-8 md:p-12 rounded-2xl border border-white/10 shadow-[0_0_40px_rgba(212,147,58,0.1)] text-center">
          <h2 className="text-3xl font-serif font-bold text-white mb-4">Registration Submitted</h2>
          <p className="text-[#D4D2CD] mb-6">
            Your moderator account has been created successfully. An Administrator must verify your account before you can log in.
          </p>
          <p className="text-sm text-gold">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gold/10 via-black to-black" />
      
      <div className="z-10 w-full max-w-md bg-[#111] p-8 md:p-12 rounded-2xl border border-white/10 shadow-[0_0_40px_rgba(212,147,58,0.1)]">
        <div className="text-center mb-10">
          <Link href="/" className="inline-block group mb-6">
            <span className="text-3xl font-black italic tracking-wide text-white uppercase select-none transition-transform group-hover:scale-[1.02] block">
              SERV<span className="text-gold font-extrabold text-glow">EASE</span>
            </span>
          </Link>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-white mb-2">Moderator Application</h1>
          <p className="text-[#D4D2CD] text-sm md:text-base">Register as a moderator</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-white mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-black border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
              placeholder="mod@servease.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-black border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gold hover:bg-gold/90 text-black font-bold py-3 px-4 rounded-lg transition-colors mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Registering..." : "Submit Application"}
          </button>
        </form>

        <p className="mt-8 text-center text-[#D4D2CD] text-sm">
          Already verified?{" "}
          <Link href="/admin/login" className="text-gold hover:text-gold/80 hover:underline">
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
}
