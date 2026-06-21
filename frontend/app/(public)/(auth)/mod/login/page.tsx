"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, Shield } from "lucide-react";
import api from "@/lib/api";

export default function ModLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    if (token) {
      localStorage.setItem("token", token);
      window.location.href = "/admin/dashboard";
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const formData = new URLSearchParams();
      formData.append("username", email);
      formData.append("password", password);

      const response = await api.post("/auth/login", formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      if (response.data.access_token) {
        localStorage.setItem("token", response.data.access_token);
        window.location.href = "/admin/dashboard";
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Removed
  };

  return (
    <div className="relative min-h-screen bg-[#0b0a0a] flex items-center justify-center font-sans p-4">
      {/* Background radial gradient for premium feel */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#d4933a]/5 via-[#0b0a0a] to-[#0b0a0a]"></div>
      
      <div className="w-full max-w-md bg-black/80 backdrop-blur-xl border border-[#222] rounded-[2rem] shadow-2xl p-8 relative overflow-hidden z-10">
        {/* Subtle ambient glow behind the modal */}
        <div className="absolute -inset-1 bg-[#d4933a]/5 blur-2xl -z-10 rounded-3xl pointer-events-none"></div>

        {/* Mod Accent Background */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#d4933a] to-[#c28532]"></div>

        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-[#d4933a]/10 rounded-xl flex items-center justify-center mx-auto mb-4 border border-[#d4933a]/20">
            <Shield className="w-6 h-6 text-[#d4933a]" strokeWidth={2} />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2 tracking-wide">Moderator Portal</h1>
          <p className="text-[#888] text-sm">Secure login for administrative staff</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-500 text-sm text-center">
            {error}
          </div>
        )}

        <form className="flex flex-col gap-4" onSubmit={handleLogin}>
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
                className="w-full bg-[#111] border border-[#333] focus:border-[#d4933a] focus:bg-[#161616] focus:ring-4 focus:ring-[#d4933a]/10 text-white rounded-xl py-3.5 pl-11 pr-4 outline-none text-[14px] transition-all placeholder:text-[#444]"
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
                className="w-full bg-[#111] border border-[#333] focus:border-[#d4933a] focus:bg-[#161616] focus:ring-4 focus:ring-[#d4933a]/10 text-white rounded-xl py-3.5 pl-11 pr-11 outline-none text-[14px] transition-all placeholder:text-[#444]"
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
            className="w-full bg-[#d4933a] hover:bg-[#c28532] disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-all text-[14px] shadow-[0_0_15px_rgba(212,147,58,0.15)] hover:shadow-[0_0_30px_rgba(212,147,58,0.3)] mt-2 tracking-wide"
          >
            {loading ? "Authenticating..." : "Login to Dashboard"}
          </button>
        </form>

        <p className="text-center text-[#555] text-xs mt-6">
          Apply to be a moderator? <Link href="/mod/signup" className="text-[#d4933a] hover:underline">Apply here</Link>.
        </p>
      </div>
    </div>
  );
}
