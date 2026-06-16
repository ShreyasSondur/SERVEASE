"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { User, BadgeCheck, MapPin } from "lucide-react";

// Mock data matching the screenshot
const SERVICE_DATA = {
  title: "Wall Painting Services Dubai | Fast Clean",
  postedBy: {
    name: "Sheik Nayaaz",
    verified: true,
  },
  details: {
    providerType: "Licensed Company",
    emergencyService: "Available 24/7",
    yearEstablished: "2023",
  },
  location: "Dubailand, Dubai, UAE",
  servicesIncluded: "Interior Wall Painting, Exterior / Villa Painting, Wallpaper Removal & Installation, Waterproofing / Damp Repair, Wood Painting, Decorative / Accent Walls, Ceiling Painting, Post-Painting Deep Clean",
  description: `Fixit All Solutions – Painting, Carpentry, Plumbing, Gypsum Board, and AC Services for Villas, Offices, Buildings, Apartments Companies in Dubai.

Painting – High-quality interior and exterior painting.
Carpentry – Custom woodwork and fittings.
Plumbing – Expert solutions for all your plumbing needs.
Gypsum Board – Stylish, durable partitions.
AC Services – Reliable AC maintenance and repair.
Contact us today for a free quote!`
};

export default function ServiceDetail() {
  return (
    <div className="relative min-h-screen bg-[#0b0a0a] flex flex-col w-full font-sans text-white">
      <Navbar />

      <main className="flex-grow w-full max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8 py-10 pt-28">
        {/* Title */}
        <h1 className="text-2xl sm:text-3xl md:text-[32px] font-medium mb-6 sm:mb-8 text-white tracking-wide animate-fade-in">
          {SERVICE_DATA.title}
        </h1>
        
        {/* Top Grid: Image & Info Cards */}
        <div className="flex flex-col lg:flex-row gap-5 sm:gap-6 mb-6 sm:mb-8 animate-slide-up">
          
          {/* Left: Image Placeholder (stretches to match right column height on desktop) */}
          <div className="w-full lg:w-[65%] bg-[#a3a3a3] rounded-2xl flex items-center justify-center min-h-[250px] sm:min-h-[350px] lg:min-h-0 shadow-lg overflow-hidden relative">
            <span className="text-black/40 text-sm sm:text-base font-bold tracking-widest uppercase relative z-10">
              image
            </span>
            {/* Subtle inset shadow */}
            <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.1)] pointer-events-none"></div>
          </div>

          {/* Right: Info Cards */}
          <div className="w-full lg:w-[35%] flex flex-col gap-4 sm:gap-5">
            
            {/* Posted By Card */}
            <div className="bg-[#151515] border border-[#222] rounded-2xl p-5 sm:p-6 shadow-md transition-colors hover:border-[#333]">
              <h3 className="text-[#aaa] text-[11px] font-bold uppercase tracking-widest mb-4">
                Posted By
              </h3>
              <div className="flex items-center gap-3.5 mb-5">
                <div className="w-11 h-11 rounded-full border border-[#d4933a]/50 bg-[#d4933a]/10 flex items-center justify-center shrink-0">
                  <User className="w-5 h-5 text-[#d4933a]" strokeWidth={1.5} />
                </div>
                <div>
                  <h4 className="font-medium text-[15px] sm:text-[16px] text-white tracking-wide">
                    {SERVICE_DATA.postedBy.name}
                  </h4>
                  {SERVICE_DATA.postedBy.verified && (
                    <div className="flex items-center gap-1.5 mt-1">
                      <BadgeCheck className="w-3.5 h-3.5 text-[#3b82f6]" strokeWidth={2.5} />
                      <span className="text-[#3b82f6] text-[10px] font-bold uppercase tracking-wider">
                        Verified User
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <button className="w-full bg-[#d4933a] hover:bg-[#c28532] text-white font-bold tracking-wide py-3.5 rounded-xl text-sm transition-all shadow-[0_0_15px_rgba(212,147,58,0.2)] hover:shadow-[0_0_25px_rgba(212,147,58,0.4)]">
                Contact Now
              </button>
            </div>

            {/* Details Card */}
            <div className="bg-[#151515] border border-[#222] rounded-2xl p-5 sm:p-6 shadow-md transition-colors hover:border-[#333]">
              <h3 className="text-[#d4933a] text-[13px] font-semibold mb-4 tracking-wide">
                Details
              </h3>
              <div className="flex flex-col gap-3.5">
                <div className="flex justify-between items-center text-[13px] sm:text-sm">
                  <span className="text-[#888]">Provider Type</span>
                  <span className="text-white font-medium text-right">{SERVICE_DATA.details.providerType}</span>
                </div>
                <div className="flex justify-between items-center text-[13px] sm:text-sm">
                  <span className="text-[#888]">Emergency Service</span>
                  <span className="text-white font-medium text-right">{SERVICE_DATA.details.emergencyService}</span>
                </div>
                <div className="flex justify-between items-center text-[13px] sm:text-sm">
                  <span className="text-[#888]">Year of Establishment</span>
                  <span className="text-white font-medium text-right">{SERVICE_DATA.details.yearEstablished}</span>
                </div>
              </div>
            </div>

            {/* Location Card */}
            <div className="bg-[#151515] border border-[#222] rounded-2xl p-5 sm:p-6 shadow-md transition-colors hover:border-[#333]">
              <h3 className="text-[#d4933a] text-[13px] font-semibold mb-3 tracking-wide">
                Location
              </h3>
              <div className="flex items-start gap-2.5 text-[13px] sm:text-sm text-[#ddd]">
                <MapPin className="w-4 h-4 text-[#888] shrink-0 mt-0.5" strokeWidth={2} />
                <span className="leading-relaxed font-light">{SERVICE_DATA.location}</span>
              </div>
            </div>

          </div>
        </div>

        {/* Services Included Section */}
        <div className="bg-[#151515] border border-[#222] rounded-2xl p-5 sm:p-6 md:p-8 mb-5 sm:mb-6 shadow-md animate-slide-up" style={{ animationDelay: "100ms" }}>
          <h3 className="text-[#d4933a] text-lg font-medium mb-3 tracking-wide">
            Services:
          </h3>
          <p className="text-[#d4d2cd] text-sm sm:text-[15px] leading-relaxed font-light">
            {SERVICE_DATA.servicesIncluded}
          </p>
        </div>

        {/* Description Section */}
        <div className="bg-[#151515] border border-[#222] rounded-2xl p-5 sm:p-6 md:p-8 mb-12 shadow-md animate-slide-up" style={{ animationDelay: "150ms" }}>
          <h3 className="text-[#d4933a] text-lg font-medium mb-4 tracking-wide">
            Description
          </h3>
          <div className="text-[#d4d2cd] text-sm sm:text-[15px] leading-relaxed font-light whitespace-pre-wrap">
            {SERVICE_DATA.description}
          </div>
        </div>
        
      </main>
      
      <Footer />
    </div>
  );
}
