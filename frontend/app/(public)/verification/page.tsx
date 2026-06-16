"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function VerificationPage() {
  return (
    <div className="relative min-h-screen bg-[#0b0a0a] flex flex-col w-full font-sans">
      <Navbar />

      <main className="mt-10 mb-12 flex-grow flex flex-col items-center justify-center pt-24 pb-12 px-4 sm:px-6 relative z-10">
        <div className="w-full max-w-md bg-[#111111] border border-[#222] rounded-[2rem] p-8 sm:p-12 text-center shadow-xl flex flex-col items-center">
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6 border border-green-500/20 shadow-[0_0_30px_rgba(34,197,94,0.15)]">
            <CheckCircle2 className="w-10 h-10 text-green-500" strokeWidth={1.5} />
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-serif text-white tracking-wide font-medium mb-4">
            Application Received
          </h1>
          
          <p className="text-[#888] text-sm sm:text-base leading-relaxed mb-8 font-light">
            Thank you for applying to become a partner. Your profile is currently <span className="text-[#d4933a] font-medium">PENDING</span> verification from our moderators. 
            We will review your details and Emirate ID shortly.
          </p>

          <Link 
            href="/"
            className="w-full bg-[#222] hover:bg-[#333] border border-[#333] hover:border-[#444] text-white font-medium tracking-wide py-3.5 rounded-xl transition-all text-sm"
          >
            Return to Home
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
