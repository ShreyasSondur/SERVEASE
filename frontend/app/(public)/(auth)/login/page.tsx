"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import api, { API_URL } from "@/lib/api";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [signupUrl, setSignupUrl] = useState("/signup");

  useEffect(() => {
    // Check if URL has ?token=... from OAuth callback
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    if (token) {
      localStorage.setItem("token", token);
      const redirectPath = urlParams.get("redirect") || "/";
      window.location.href = redirectPath;
    }
    
    // Carry over query params to signup link
    if (window.location.search) {
      setSignupUrl(`/signup${window.location.search}`);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // FastAPI OAuth2PasswordRequestForm expects URL encoded form data
      const formData = new URLSearchParams();
      formData.append("username", email);
      formData.append("password", password);

      const response = await api.post("/auth/login", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      if (response.data.requires_otp) {
        sessionStorage.setItem("temp_token", response.data.temp_token);
        const urlParams = new URLSearchParams(window.location.search);
        const redirectPath = urlParams.get("redirect") || "/zQ8pL3mX9vN2/dashboard";
        window.location.href = `/login/otp?redirect=${encodeURIComponent(redirectPath)}`;
        return;
      }

      if (response.data.access_token) {
        localStorage.setItem("token", response.data.access_token);
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
            console.error("Failed to fetch user role on login", meErr);
          }
        } else if (redirectPath === "/") {
          try {
            const userRes = await api.get("/auth/me");
            const role = userRes.data.role;
            if (role === "ADMIN" || role === "MODERATOR") {
              redirectPath = "/zQ8pL3mX9vN2/dashboard";
            }
          } catch (meErr) {
            console.error("Failed to fetch user role on login", meErr);
          }
        }
        
        window.location.href = redirectPath;
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Redirect to backend Google auth endpoint
    window.location.href = `${API_URL}/auth/google/login`;
  };

  return (
    <div className="relative min-h-screen bg-[#111111] flex flex-col w-full font-sans">
      <Navbar />

      <main className="flex-grow flex items-center justify-center pt-28 pb-20 px-4 sm:px-6 relative z-10">
        <div className="w-full max-w-md bg-[#1a1a1a] rounded-2xl shadow-2xl p-6 sm:p-8 md:p-8 border border-[#2a2a2a]">
          {/* Header */}
          <div className="text-center mb-5 sm:mb-6">
            <h1 className="text-2xl sm:text-[26px] font-semibold text-white mb-1.5 font-sans tracking-wide">
              Sign in to your account
            </h1>
            <p className="text-[#777] text-sm">Enter your credentials to continue</p>
          </div>

          {/* Tabs */}
          <div className="flex w-full mb-6 border-b border-[#333]">
            <Link
              href="/login"
              className="flex-1 pb-3.5 text-center text-[12px] sm:text-[13px] font-bold tracking-[0.1em] uppercase transition-colors border-b-2 border-[#d4933a] text-[#d4933a]"
            >
              LOGIN
            </Link>
            <Link
              href={signupUrl}
              className="flex-1 pb-3.5 text-center text-[12px] sm:text-[13px] font-bold tracking-[0.1em] uppercase transition-colors text-[#777] hover:text-white"
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
          <form className="flex flex-col gap-4" onSubmit={handleLogin}>
            <div className="flex flex-col gap-1.5">
              <label className="text-white text-[13px] font-medium">Email address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666]" strokeWidth={2} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full bg-[#1e1e1e] border border-[#333] focus:border-[#d4933a] focus:bg-[#222] text-white rounded-xl py-3 pl-11 pr-4 outline-none text-[14px] placeholder-[#666] transition-all"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-white text-[13px] font-medium">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666]" strokeWidth={2} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full bg-[#1e1e1e] border border-[#333] focus:border-[#d4933a] focus:bg-[#222] text-white rounded-xl py-3 pl-11 pr-11 outline-none text-[14px] placeholder-[#666] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#666] hover:text-white transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" strokeWidth={2} /> : <Eye className="w-4 h-4" strokeWidth={2} />}
                </button>
              </div>
            </div>

            {/* Remember me & Forgot Password */}
            <div className="flex items-center justify-between mt-1 mb-1">
              <label className="flex items-center gap-3 group">
                <div
                  className={`w-4 h-4 rounded border flex items-center justify-center transition-colors cursor-pointer ${rememberMe
                    ? "bg-[#d4933a] border-[#d4933a]"
                    : "bg-transparent border-[#555] group-hover:border-[#d4933a]"
                    }`}
                  onClick={() => setRememberMe(!rememberMe)}
                >
                  {rememberMe && (
                    <svg viewBox="0 0 14 14" fill="none" className="w-3 h-3 text-white">
                      <path
                        d="M11.6666 3.5L5.24992 9.91667L2.33325 7"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
                <span className="text-[#e2e2e2] text-sm hover:text-white transition-colors select-none">
                  Remember me
                </span>
              </label>
              <a href="#" className="text-[#d4933a] text-sm cursor-pointer font-medium hover:underline">
                Forgot Password?
              </a>
            </div>

            {/* Submit Button */}
            <button 
              disabled={loading}
              type="submit" 
              className="w-full cursor-pointer bg-[#d4933a] hover:bg-[#c28532] disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors text-[14px] sm:text-[15px] shadow-lg mt-1"
            >
              {loading ? "Logging in..." : "Login"}
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
            onClick={handleGoogleLogin}
            className="w-full mt-6 bg-[#222] hover:bg-[#333] border border-[#333] text-white font-semibold py-3 rounded-xl transition-colors text-[14px] sm:text-[15px] shadow-lg flex items-center justify-center gap-2 cursor-pointer"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Sign in with Google
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