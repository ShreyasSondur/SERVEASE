"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, Lock, Eye, EyeOff, User } from "lucide-react";
import api, { API_URL } from "@/lib/api";

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginUrl, setLoginUrl] = useState("/login");

  useEffect(() => {
    if (window.location.search) {
      setLoginUrl(`/login${window.location.search}`);
    }
  }, []);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/auth/signup", {
        email: email,
        password: password,
      });

      if (response.data.id) {
        // Automatically login the user
        const formData = new URLSearchParams();
        formData.append("username", email);
        formData.append("password", password);

        const loginResponse = await api.post("/auth/login", formData, {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });

        if (loginResponse.data.access_token) {
          localStorage.setItem("token", loginResponse.data.access_token);
          const urlParams = new URLSearchParams(window.location.search);
          let redirectPath = urlParams.get("redirect") || "/";

          if (redirectPath === "/partners/becomePartner") {
            try {
              const userRes = await api.get("/auth/me");
              const role = userRes.data.role;
              if (role === "PARTNER" || role === "ADMIN") {
                redirectPath = "/partners/dashboard";
              }
            } catch (meErr) {
              console.error("Failed to fetch user role on signup", meErr);
            }
          }
          
          window.location.href = redirectPath;
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#111111] flex flex-col w-full font-sans">
      <Navbar />

      <main className="flex-grow flex items-center justify-center pt-28 pb-20 px-4 sm:px-6 relative z-10">
        <div className="w-full max-w-md bg-[#1a1a1a] rounded-2xl shadow-2xl p-6 sm:p-8 md:p-8 border border-[#2a2a2a]">
          {/* Header */}
          <div className="text-center mb-5 sm:mb-6">
            <h1 className="text-2xl sm:text-[26px] font-semibold text-white mb-1.5 font-sans tracking-wide">
              Create an account
            </h1>
            <p className="text-[#777] text-sm">Join ServeEase and find experts easily</p>
          </div>

          {/* Tabs */}
          <div className="flex w-full mb-6 border-b border-[#333]">
            <Link
              href={loginUrl}
              className="flex-1 pb-3.5 text-center text-[12px] sm:text-[13px] font-bold tracking-[0.1em] uppercase transition-colors text-[#777] hover:text-white"
            >
              LOGIN
            </Link>
            <Link
              href="/signup"
              className="cursor-pointer flex-1 pb-3.5 text-center text-[12px] sm:text-[13px] font-bold tracking-[0.1em] uppercase transition-colors border-b-2 border-[#d4933a] text-[#d4933a] "
            >
              CREATE ACCOUNT
            </Link>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-xl text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          {/* Form */}
          <form className="flex flex-col gap-2.5" onSubmit={handleSignup}>
            <div className="flex flex-col gap-1">
              <label className="text-white text-[13px] font-medium">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666]" strokeWidth={2} />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter full name"
                  required
                  className="w-full bg-[#1e1e1e] border border-[#333] focus:border-[#d4933a] focus:bg-[#222] text-white rounded-xl py-3 pl-11 pr-4 outline-none text-[14px] placeholder-[#666] transition-all"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-white text-[13px] font-medium">Email address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666]" strokeWidth={2} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email"
                  required
                  className="w-full bg-[#1e1e1e] border border-[#333] focus:border-[#d4933a] focus:bg-[#222] text-white rounded-xl py-3 pl-11 pr-4 outline-none text-[14px] placeholder-[#666] transition-all"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-white text-[13px] font-medium">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666]" strokeWidth={2} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                  className="w-full bg-[#1e1e1e] border border-[#333] focus:border-[#d4933a] focus:bg-[#222] text-white rounded-xl py-3 pl-11 pr-11 outline-none text-[14px] placeholder-[#666] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 text-[#666] hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" strokeWidth={2} /> : <Eye className="w-4 h-4" strokeWidth={2} />}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-white text-[13px] font-medium">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666]" strokeWidth={2} />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm password"
                  required
                  className="w-full bg-[#1e1e1e] border border-[#333] focus:border-[#d4933a] focus:bg-[#222] text-white rounded-xl py-3 pl-11 pr-11 outline-none text-[14px] placeholder-[#666] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 text-[#666] hover:text-white transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" strokeWidth={2} /> : <Eye className="w-4 h-4" strokeWidth={2} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={loading}
              className="cursor-pointer w-full bg-[#d4933a] hover:bg-[#c28532] disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors text-[14px] sm:text-[15px] shadow-lg mt-1.5"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          {/* Social Login */}
          <div className="mt-6 flex items-center justify-between">
            <span className="border-b border-[#333] w-1/5 lg:w-1/4"></span>
            <span className="text-xs text-center text-[#777] uppercase">Or login with</span>
            <span className="border-b border-[#333] w-1/5 lg:w-1/4"></span>
          </div>

          <button 
            type="button" 
            onClick={() => window.location.href = `${API_URL}/auth/google/login`}
            className="w-full mt-6 bg-[#222] hover:bg-[#333] border border-[#333] text-white font-semibold py-3 rounded-xl transition-colors text-[14px] sm:text-[15px] shadow-lg flex items-center justify-center gap-2 cursor-pointer"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Sign up with Google
          </button>

          {/* Footer Text */}
          <p className="text-center text-[#777] text-xs sm:text-[12px] mt-6">
            By continuing you agree to our{" "}
            <a href="#" className="text-[#d4933a] hover:underline">
              Terms
            </a>{" "}
            and{" "}
            <a href="#" className="text-[#d4933a] hover:underline">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}