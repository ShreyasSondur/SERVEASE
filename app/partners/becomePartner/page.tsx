"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ImagePlus } from "lucide-react";
import Link from "next/link";

export default function BecomePartner() {
  return (
    <div className="relative min-h-screen bg-[#0b0a0a] flex flex-col w-full font-sans">
      <Navbar />

      <main className="mt-10  mb-12 flex-grow flex flex-col items-center justify-center pt-24 pb-12 px-4 sm:px-6 relative z-10">
        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-2xl sm:text-3xl md:text-[32px] font-serif text-white tracking-wide font-normal mb-1">
              ENTER YOUR DETAILS
            </h1>
            <p className="text-[#888] text-sm">Join our network of elite service professionals.</p>
          </div>

          {/* Form */}
          <form className="flex flex-col gap-3.5 w-full max-w-xl mx-auto">
            {/* Name Row */}
            <div className="flex flex-col sm:flex-row gap-3.5 sm:gap-4">
              <div className="flex flex-col gap-1 flex-1">
                <label className="text-[#888] text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase pl-1">
                  First Name
                </label>
                <input
                  type="text"
                  placeholder="John"
                  className="w-full bg-[#1c1c1c] border border-[#2a2a2a] focus:border-[#d4933a] focus:bg-[#222] text-white rounded-xl py-3 px-4 outline-none text-[13px] transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1 flex-1">
                <label className="text-[#888] text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase pl-1">
                  Last Name
                </label>
                <input
                  type="text"
                  placeholder="Doe"
                  className="w-full bg-[#1c1c1c] border border-[#2a2a2a] focus:border-[#d4933a] focus:bg-[#222] text-white rounded-xl py-3 px-4 outline-none text-[13px] transition-colors"
                />
              </div>
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-1">
              <label className="text-[#888] text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase pl-1">
                Phone
              </label>
              <div className="flex gap-2">
                <div className="bg-[#1c1c1c] border border-[#2a2a2a] text-white rounded-xl py-3 px-4 flex items-center justify-center text-[13px] font-medium shrink-0">
                  +971
                </div>
                <input
                  type="tel"
                  placeholder="50 123 4567"
                  className="w-full bg-[#1c1c1c] border border-[#2a2a2a] focus:border-[#d4933a] focus:bg-[#222] text-white rounded-xl py-3 px-4 outline-none text-[13px] transition-colors"
                />
              </div>
            </div>

            {/* Emirates & City Row */}
            <div className="flex flex-col sm:flex-row gap-3.5 sm:gap-4">
              {/* Emirates */}
              <div className="flex flex-col gap-1 flex-1">
                <label className="text-[#888] text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase pl-1">
                  Emirates
                </label>
                <select className="w-full bg-[#1c1c1c] border border-[#2a2a2a] focus:border-[#d4933a] focus:bg-[#222] text-white rounded-xl py-3 px-4 outline-none text-[13px] transition-colors appearance-none cursor-pointer">
                  <option value="" disabled selected className="text-[#666]">Select Emirate</option>
                  <option value="dubai">Dubai</option>
                  <option value="abu-dhabi">Abu Dhabi</option>
                  <option value="sharjah">Sharjah</option>
                  <option value="ajman">Ajman</option>
                  <option value="ras-al-khaimah">Ras Al Khaimah</option>
                  <option value="fujairah">Fujairah</option>
                  <option value="umm-al-quwain">Umm Al Quwain</option>
                </select>
              </div>

              {/* City */}
              <div className="flex flex-col gap-1 flex-1">
                <label className="text-[#888] text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase pl-1">
                  City
                </label>
                <input
                  type="text"
                  placeholder="e.g. Marina"
                  className="w-full bg-[#1c1c1c] border border-[#2a2a2a] focus:border-[#d4933a] focus:bg-[#222] text-white rounded-xl py-3 px-4 outline-none text-[13px] transition-colors"
                />
              </div>
            </div>

            {/* Emirate ID Number */}
            <div className="flex flex-col gap-1">
              <label className="text-[#888] text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase pl-1">
                Emirate ID Number
              </label>
              <input
                type="text"
                placeholder="784-1234-5678901-2"
                className="w-full bg-[#1c1c1c] border border-[#2a2a2a] focus:border-[#d4933a] focus:bg-[#222] text-white rounded-xl py-3 px-4 outline-none text-[13px] transition-colors"
              />
            </div>

            {/* Upload Emirate ID */}
            <div className="flex flex-col gap-1 mt-1">
              <label className="text-[#888] text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase pl-1">
                Upload Emirate ID
              </label>
              <div className="w-full border-2 border-dashed border-[#333] hover:border-[#d4933a] bg-[#1a1a1a] rounded-xl py-6 sm:py-8 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors group">
                <ImagePlus className="w-6 h-6 text-[#666] group-hover:text-[#d4933a] transition-colors" strokeWidth={1.5} />
                <span className="text-[#666] text-[10px] tracking-wider font-semibold uppercase group-hover:text-[#d4933a] transition-colors mt-1">
                  Upload in PNG/JPEG Format
                </span>
                <input type="file" className="hidden" accept="image/png, image/jpeg" />
              </div>
            </div>

            {/* Submit Button */}
            <button className="cursor-pointer w-full bg-[#d4933a] hover:bg-[#c28532] text-white font-bold tracking-wider uppercase py-3.5 rounded-xl transition-colors text-[13px] sm:text-[14px] mt-2">
              Submit
            </button>
          </form>

          {/* Footer Text */}
          <p className="text-center text-[#666] text-xs mt-6 px-4">
            By submitting, you agree to our{" "}
            <Link href="#" className="text-[#d4933a] hover:text-white transition-colors">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="#" className="text-[#d4933a] hover:text-white transition-colors">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}