"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, ShieldCheck } from "lucide-react";
import api from "@/lib/api";

export default function ModSignup() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/auth/admin/signup", {
        email,
        password,
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    window.location.href = "http://localhost:8000/api/v1/auth/google/login";
  };

  if (success) {
    return (
      <div className="relative min-h-screen bg-[#0a0a0a] flex items-center justify-center font-sans p-4">
        <div className="w-full max-w-md bg-[#111] border border-[#222] rounded-2xl shadow-2xl p-8 text-center">
           <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShieldCheck className="w-8 h-8 text-blue-500" />
           </div>
           <h2 className="text-2xl font-bold text-white mb-4">Application Submitted</h2>
           <p className="text-[#888] mb-8 text-sm leading-relaxed">
             Your moderator account has been created, but it requires <strong className="text-white">Admin Verification</strong>. You will not be able to log in until an Admin approves your application.
           </p>
           <Link href="/mod/login" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold tracking-wide transition-colors">
             Return to Login
           </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] flex items-center justify-center font-sans p-4">
      <div className="w-full max-w-md bg-[#111] border border-[#222] rounded-2xl shadow-2xl p-8 relative overflow-hidden">
        {/* Mod Accent Background */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>

        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mx-auto mb-4 border border-blue-500/20">
            <ShieldCheck className="w-6 h-6 text-blue-500" strokeWidth={2} />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2 tracking-wide">Apply as Moderator</h1>
          <p className="text-[#888] text-sm">Join the administrative staff to manage partners.</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-500 text-sm text-center">
            {error}
          </div>
        )}

        <form className="flex flex-col gap-4" onSubmit={handleSignup}>
          <div className="flex flex-col gap-1.5">
            <label className="text-white text-xs uppercase tracking-wider font-bold">Email address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555]" strokeWidth={2} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="mod@servease.com"
                required
                className="w-full bg-[#1a1a1a] border border-[#333] focus:border-blue-500 text-white rounded-xl py-3 pl-11 pr-4 outline-none text-[14px] transition-all"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-white text-xs uppercase tracking-wider font-bold">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555]" strokeWidth={2} />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-[#1a1a1a] border border-[#333] focus:border-blue-500 text-white rounded-xl py-3 pl-11 pr-11 outline-none text-[14px] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#555] hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button 
            disabled={loading}
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-colors text-[14px] shadow-[0_0_15px_rgba(37,99,235,0.2)] mt-2 tracking-wide"
          >
            {loading ? "Applying..." : "Submit Application"}
          </button>
        </form>

        <div className="mt-8 flex items-center justify-between">
          <span className="border-b border-[#333] w-1/4"></span>
          <span className="text-xs text-[#555] uppercase font-bold tracking-wider">Or</span>
          <span className="border-b border-[#333] w-1/4"></span>
        </div>

        <button 
          type="button" 
          onClick={handleGoogleSignup}
          className="w-full mt-6 bg-[#1a1a1a] hover:bg-[#222] border border-[#333] text-white font-semibold py-3 rounded-xl transition-colors text-[14px] flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Apply with Google Workspace
        </button>

        <p className="text-center text-[#555] text-xs mt-6">
          Already a moderator? <Link href="/mod/login" className="text-blue-500 hover:underline">Log in</Link>.
        </p>
      </div>
    </div>
  );
}
