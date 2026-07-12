"use client";

import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Lock, RefreshCw, CheckCircle, AlertCircle } from "lucide-react";
import api from "@/lib/api";

export default function OtpVerification() {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(60);
  const [tempToken, setTempToken] = useState<string | null>(null);
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Retrieve temp token
    const token = sessionStorage.getItem("temp_token");
    if (!token) {
      setError("No active login session found. Please log in again.");
    } else {
      setTempToken(token);
    }
  }, []);

  // Cooldown countdown timer
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleChange = (value: string, index: number) => {
    if (isNaN(Number(value))) return; // Allow numbers only
    
    const newOtp = [...otp];
    // Keep only the last character entered
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);
    setError("");

    // Automatically focus next input
    if (value !== "" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      // Focus previous field if current field is empty and backspace is pressed
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").trim();
    if (pasteData.length === 6 && /^\d+$/.test(pasteData)) {
      const newOtp = pasteData.split("");
      setOtp(newOtp);
      // Focus the last field
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError("");
    setSuccess("");

    const fullOtp = otp.join("");
    if (fullOtp.length !== 6) {
      setError("Please enter all 6 digits.");
      return;
    }

    if (!tempToken) {
      setError("Session expired. Please log in again.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/auth/verify-otp", {
        temp_token: tempToken,
        otp: fullOtp,
      });

      if (response.data.access_token) {
        setSuccess("Verification successful! Redirecting...");
        localStorage.setItem("token", response.data.access_token);
        sessionStorage.removeItem("temp_token");
        
        // Redirect to target path
        const urlParams = new URLSearchParams(window.location.search);
        const redirectPath = urlParams.get("redirect") || "/zQ8pL3mX9vN2/dashboard";
        
        setTimeout(() => {
          window.location.href = redirectPath;
        }, 1500);
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || "Verification failed. Please check the code and try again.");
    } finally {
      setLoading(false);
    }
  };

  // Auto-submit when all 6 digits are entered
  useEffect(() => {
    if (otp.join("").length === 6 && tempToken) {
      handleVerify();
    }
  }, [otp]);

  const handleResend = async () => {
    if (cooldown > 0 || resending) return;
    
    setError("");
    setSuccess("");
    setResending(true);

    try {
      await api.post("/auth/resend-otp", {
        temp_token: tempToken,
      });
      setSuccess("A new 6-digit verification code has been sent to your email.");
      setCooldown(60);
      setOtp(Array(6).fill(""));
      inputRefs.current[0]?.focus();
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to resend code. Please try again.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#111111] flex flex-col w-full font-sans">
      <Navbar />

      <main className="flex-grow flex items-center justify-center pt-28 pb-20 px-4 sm:px-6 relative z-10">
        <div className="w-full max-w-md bg-[#1a1a1a] rounded-2xl shadow-2xl p-6 sm:p-8 border border-[#2a2a2a]">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-[#d4933a]/10 border border-[#d4933a]/25 flex items-center justify-center text-[#d4933a] animate-pulse">
              <Lock className="w-8 h-8" strokeWidth={1.5} />
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl sm:text-[26px] font-semibold text-white mb-1.5 font-sans tracking-wide">
              Security Verification
            </h1>
            <p className="text-[#888] text-sm leading-relaxed px-4">
              Enter the 6-digit verification code sent to your registered admin email address.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm flex items-start gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-500 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400 text-sm flex items-start gap-3">
              <CheckCircle className="w-5 h-5 flex-shrink-0 text-green-500 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          {/* Form */}
          <form className="flex flex-col gap-6" onSubmit={handleVerify}>
            {/* OTP Digits Container */}
            <div className="flex justify-between gap-2.5 my-2">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  type="text"
                  pattern="[0-9]*"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  disabled={!tempToken || loading}
                  ref={(el) => {
                    inputRefs.current[idx] = el;
                  }}
                  onChange={(e) => handleChange(e.target.value, idx)}
                  onKeyDown={(e) => handleKeyDown(e, idx)}
                  onPaste={idx === 0 ? handlePaste : undefined}
                  className="w-12 h-14 sm:w-14 sm:h-16 bg-[#1e1e1e] border border-[#333] focus:border-[#d4933a] focus:bg-[#222] text-white rounded-xl text-center text-xl sm:text-2xl font-semibold outline-none transition-all duration-200 select-all"
                />
              ))}
            </div>

            {/* Verify Button */}
            <button
              disabled={loading || !tempToken}
              type="submit"
              className="w-full cursor-pointer bg-[#d4933a] hover:bg-[#c28532] disabled:opacity-50 text-white font-semibold py-3.5 rounded-xl transition-colors text-[14px] sm:text-[15px] shadow-lg flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify Code"
              )}
            </button>
          </form>

          {/* Resend Cooldown Option */}
          <div className="text-center mt-6">
            {cooldown > 0 ? (
              <p className="text-[#666] text-xs sm:text-[13px]">
                Didn't receive the email? Resend code in{" "}
                <span className="text-white font-medium">{cooldown}s</span>
              </p>
            ) : (
              <button
                type="button"
                disabled={resending || !tempToken}
                onClick={handleResend}
                className="text-[#d4933a] hover:text-[#c28532] text-xs sm:text-[13px] font-medium transition-colors hover:underline cursor-pointer flex items-center justify-center gap-1.5 mx-auto"
              >
                {resending ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Resending...
                  </>
                ) : (
                  "Resend Code"
                )}
              </button>
            )}
          </div>

          {/* Return to Login link */}
          <div className="text-center mt-6 pt-4 border-t border-[#2a2a2a]">
            <a
              href="/login"
              className="text-[#888] hover:text-white text-xs sm:text-[13px] transition-colors"
            >
              Back to Login
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
