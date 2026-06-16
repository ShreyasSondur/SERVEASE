"use client";

import { useState } from "react";
import api from "@/lib/api";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
      if (!err.response) {
        setError("Network Error: Could not connect to the backend server. Is it running?");
      } else {
        setError(err.response?.data?.detail || "Invalid credentials. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0a0a] flex items-center justify-center p-4 font-sans relative">
      {/* Background radial gradient for premium feel */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#d4933a]/5 via-[#0b0a0a] to-[#0b0a0a]"></div>
      
      <div className="w-full max-w-[480px] bg-black/80 backdrop-blur-xl border border-[#222] border-t-4 border-t-[#d4933a] rounded-[2rem] p-8 sm:p-14 shadow-2xl relative z-10">

        {/* Subtle ambient glow behind the modal */}
        <div className="absolute -inset-1 bg-[#d4933a]/5 blur-2xl -z-10 rounded-3xl pointer-events-none"></div>

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-[32px] font-bold italic tracking-wide">
            <span className="text-white">SERV</span><span className="text-[#d4933a]">EASE</span>
          </h1>
          <p className="text-[#888] text-[10px] sm:text-[11px] tracking-[0.3em] mt-2 uppercase font-medium">
            Admin Portal
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-500 text-sm text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form className="flex flex-col gap-7" onSubmit={handleLogin}>
          <div className="flex flex-col gap-2.5">
            <label className="text-[#888] text-[10px] sm:text-[11px] font-bold tracking-widest uppercase pl-5">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@servease.com"
              required
              className="w-full bg-[#111] border border-[#333] focus:border-[#d4933a] focus:bg-[#161616] focus:ring-4 focus:ring-[#d4933a]/10 text-white rounded-full py-4 px-6 outline-none text-sm sm:text-[15px] transition-all placeholder:text-[#444]"
            />
          </div>

          <div className="flex flex-col gap-2.5">
            <label className="text-[#888] text-[10px] sm:text-[11px] font-bold tracking-widest uppercase pl-5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full bg-[#111] border border-[#333] focus:border-[#d4933a] focus:bg-[#161616] focus:ring-4 focus:ring-[#d4933a]/10 text-white rounded-full py-4 px-6 outline-none text-sm sm:text-[15px] transition-all placeholder:text-[#444]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#d4933a] hover:bg-[#c28532] disabled:opacity-50 text-white font-bold tracking-widest uppercase py-4 sm:py-5 rounded-full mt-6 transition-all text-[13px] sm:text-sm shadow-[0_0_20px_rgba(212,147,58,0.15)] hover:shadow-[0_0_30px_rgba(212,147,58,0.3)] hover:-translate-y-0.5 active:translate-y-0"
          >
            {loading ? "Authenticating..." : "Login to Portal"}
          </button>
        </form>

      </div>
    </div>
  );
}
