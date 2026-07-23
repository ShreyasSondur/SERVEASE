"use client";

import { useState, useEffect, Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Phone } from "lucide-react";
import api from "@/lib/api";
import { useSearchParams } from "next/navigation";

function PhoneContent() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  useEffect(() => {
    // Check if user already has a phone number, if so redirect
    const checkUser = async () => {
      try {
        const res = await api.get("/auth/me");
        if (res.data.phone_number) {
          window.location.href = redirect;
        }
      } catch (err) {
        // If not logged in, redirect to login
        window.location.href = `/login?redirect=${encodeURIComponent(redirect)}`;
      }
    };
    checkUser();
  }, [redirect]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!phoneNumber || phoneNumber.length < 5) {
      setError("Please enter a valid phone number");
      return;
    }

    setLoading(true);
    try {
      await api.put("/auth/me/phone", {
        phone_number: "+971 " + phoneNumber,
      });
      window.location.href = redirect;
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to update phone number. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-grow flex items-center justify-center pt-28 pb-20 px-4 sm:px-6 relative z-10">
      <div className="w-full max-w-md bg-[#1a1a1a] rounded-2xl shadow-2xl p-6 sm:p-8 md:p-8 border border-[#2a2a2a]">
        {/* Header */}
        <div className="text-center mb-5 sm:mb-6">
          <div className="w-16 h-16 rounded-full bg-[#d4933a]/10 border border-[#d4933a]/30 flex items-center justify-center mx-auto mb-4">
            <Phone className="w-8 h-8 text-[#d4933a]" />
          </div>
          <h1 className="text-2xl sm:text-[26px] font-semibold text-white mb-1.5 font-sans tracking-wide">
            Add Your Phone Number
          </h1>
          <p className="text-[#777] text-sm">
            We need your phone number to complete your profile and help service providers reach you.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-xl text-red-500 text-sm text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label className="text-white text-[13px] font-medium">Phone Number</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#666]" strokeWidth={2} />
                <span className="text-[#888] text-[14px] font-medium">+971</span>
              </div>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="50 123 4567"
                required
                className="w-full bg-[#1e1e1e] border border-[#333] focus:border-[#d4933a] focus:bg-[#222] text-white rounded-xl py-3 pl-[84px] pr-4 outline-none text-[14px] placeholder-[#666] transition-all"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="cursor-pointer w-full bg-[#d4933a] hover:bg-[#c28532] disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors text-[14px] sm:text-[15px] shadow-lg mt-2"
          >
            {loading ? "Saving..." : "Continue"}
          </button>
        </form>
      </div>
    </main>
  );
}

export default function PhoneCollectionPage() {
  return (
    <div className="relative min-h-screen bg-[#111111] flex flex-col w-full font-sans">
      <Navbar />
      <Suspense fallback={<div className="flex-grow pt-32 pb-20 text-white text-center">Loading...</div>}>
        <PhoneContent />
      </Suspense>
      <Footer />
    </div>
  );
}
