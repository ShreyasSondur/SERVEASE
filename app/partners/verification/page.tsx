"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ShieldCheck, Circle, Mail, ArrowRight, Clock } from "lucide-react";
import Link from "next/link";

export default function VerificationPage() {
  return (
    <div className="relative min-h-screen bg-[#0b0a0a] flex flex-col w-full font-sans">
      <Navbar />

      <main className="flex-grow flex flex-col items-center justify-center pt-24 pb-12 px-4 sm:px-6 relative z-10">
        <div className="w-full max-w-2xl flex flex-col items-center">

          {/* Shield Icon with Gradient Ring */}
          <div className="relative w-28 h-28 mb-8">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#222] via-[#333] to-[#d4933a] p-[1px]">
              <div className="w-full h-full bg-[#0b0a0a] rounded-full flex items-center justify-center">
                <ShieldCheck className="w-12 h-12 text-[#d4933a]" strokeWidth={1.5} />
              </div>
            </div>
            {/* Subtle glow */}
            <div className="absolute inset-0 rounded-full bg-[#d4933a]/10 blur-xl pointer-events-none"></div>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-[34px] font-serif text-white mb-4 text-center tracking-wide font-normal">
            Your account is being <span className="text-[#d4933a]">verified</span>
          </h1>

          {/* Subtitle */}
          <p className="text-[#888] text-sm md:text-[15px] text-center max-w-md leading-relaxed mb-10 font-light">
            Thanks for signing up! Our team is reviewing your details. You'll be notified once your account is approved.
          </p>

          {/* Divider with Gold Dot */}
          <div className="relative w-full max-w-[280px] flex items-center justify-center mb-8">
            <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-[#333] to-transparent"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-[#d4933a] relative z-10 shadow-[0_0_8px_rgba(212,147,58,0.8)]"></div>
          </div>

          {/* Time Estimate */}
          <div className="flex items-center gap-2.5 mb-8 text-[#777] text-sm">
            <Circle className="w-4 h-4" strokeWidth={1.5} />
            <span>Usually takes less then 24 hours</span>
          </div>

          {/* Email Notification Card */}
          <div className="w-full max-w-md bg-[#111111] border border-[#222] rounded-2xl p-5 flex items-center gap-5 mb-10 shadow-lg">
            <div className="w-12 h-12 rounded-full border border-[#d4933a]/20 bg-[#d4933a]/5 flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5 text-[#d4933a]" strokeWidth={1.5} />
            </div>
            <p className="text-[#888] text-sm leading-relaxed">
              We'll send you an email<br />
              once your account is verified.
            </p>
          </div>

          {/* Back to Home Link */}
          <Link
            href="/"
            className="flex items-center gap-2 text-[#d4933a] text-sm md:text-[15px] font-medium hover:text-[#c28532] transition-colors group"
          >
            Back to home
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={2} />
          </Link>

        </div>
      </main>
    </div>
  );
}
