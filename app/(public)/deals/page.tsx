"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Search, MapPin, ChevronDown, ArrowRight,
  ChevronLeft, ChevronRight, BadgeCheck,
  Calendar, Target, CheckCircle2
} from "lucide-react";
import Link from "next/link";

const MOCK_DEALS = [
  {
    id: 1,
    title: "Wall Painting Services Dubai | Fast Clean",
    tags: ["Interior Wall Painting", "Exterior Wall Painting", "Interior Wall Painting", "Wallpaper Removal"],
    isVerified: true,
    isExclusive: true,
    discountText: "UPTO 50% OFF ON FIRST SERVICE",
    location: "Sobha Hartland, Dubai",
    date: "20-04-2026",
  },
  {
    id: 2,
    title: "Wall Painting Services Dubai | Fast Clean",
    tags: ["Interior Wall Painting", "Exterior Wall Painting", "Interior Wall Painting", "Wallpaper Removal"],
    isVerified: true,
    isExclusive: true,
    discountText: "UPTO 50% OFF ON FIRST SERVICE",
    location: "Sobha Hartland, Dubai",
    date: "20-04-2026",
  },
  {
    id: 3,
    title: "Wall Painting Services Dubai | Fast Clean",
    tags: ["Interior Wall Painting", "Exterior Wall Painting", "Interior Wall Painting", "Wallpaper Removal"],
    isVerified: true,
    isExclusive: true,
    discountText: "",
    location: "Sobha Hartland, Dubai",
    date: "20-04-2026",
  },
  {
    id: 4,
    title: "Wall Painting Services Dubai | Fast Clean",
    tags: ["Interior Wall Painting", "Exterior Wall Painting", "Interior Wall Painting", "Wallpaper Removal"],
    isVerified: true,
    isExclusive: true,
    discountText: "",
    location: "Sobha Hartland, Dubai",
    date: "20-04-2026",
  },
  {
    id: 5,
    title: "Wall Painting Services Dubai | Fast Clean",
    tags: ["Interior Wall Painting", "Exterior Wall Painting", "Interior Wall Painting", "Wallpaper Removal"],
    isVerified: true,
    isExclusive: true,
    discountText: "",
    location: "Sobha Hartland, Dubai",
    date: "20-04-2026",
  },
  {
    id: 6,
    title: "Wall Painting Services Dubai | Fast Clean",
    tags: ["Interior Wall Painting", "Exterior Wall Painting", "Interior Wall Painting", "Wallpaper Removal"],
    isVerified: true,
    isExclusive: true,
    discountText: "",
    location: "Sobha Hartland, Dubai",
    date: "20-04-2026",
  },
];

export default function Deals() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="relative min-h-screen bg-[#111111] flex flex-col w-full font-sans">
      <Navbar />

      <main className="flex-grow pt-28 md:pt-32 pb-20 md:pb-24 px-4 sm:px-6 md:px-10 lg:px-12 max-w-[1200px] mx-auto w-full">
        {/* Search Bar */}
        <div className="w-full mx-auto bg-[#1a1a1a] rounded-2xl md:rounded-full border border-[#333] flex flex-col md:flex-row items-center p-2 md:p-1.5 mb-12 md:mb-20 shadow-xl transition-all">
          <div className="flex items-center flex-1 w-full pl-4 md:pl-6 gap-3 py-3 md:py-0">
            <Search className="w-5 h-5 text-white/50 shrink-0" strokeWidth={2} />
            <input
              type="text"
              placeholder="What service do you need?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-0 outline-none text-white placeholder-[#777] text-[14px] md:text-[15px] font-normal focus:ring-0"
            />
          </div>

          {/* Dividers and Dropdowns */}
          <div className="flex flex-col md:flex-row items-center w-full md:w-auto border-t md:border-t-0 md:border-l border-[#333]">
            <button className="flex items-center justify-between md:justify-start w-full md:w-auto gap-3 px-4 md:px-6 py-3.5 md:py-3 text-white hover:text-[#d4933a] transition-colors border-b md:border-b-0 md:border-r border-[#333] h-full">
              <div className="flex items-center gap-2 md:gap-3">
                <Target className="w-4 h-4 text-white/50" strokeWidth={1.5} />
                <span className="text-[13px] md:text-[14px] font-medium whitespace-nowrap">Sobha Hartland</span>
              </div>
              <ChevronDown className="w-4 h-4 ml-2 md:ml-1 text-white/40" />
            </button>
            <button className="flex items-center justify-between md:justify-start w-full md:w-auto gap-3 px-4 md:px-6 py-3.5 md:py-3 text-white hover:text-[#d4933a] transition-colors h-full">
              <div className="flex items-center gap-2 md:gap-3">
                <MapPin className="w-4 h-4 text-white/50" strokeWidth={1.5} />
                <span className="text-[13px] md:text-[14px] font-medium whitespace-nowrap">Dubai</span>
              </div>
              <ChevronDown className="w-4 h-4 ml-2 md:ml-1 text-white/40" />
            </button>
            <div className="w-full md:w-auto p-1.5 md:p-0 md:ml-2">
              <button className="w-full md:w-auto bg-[#d4933a] hover:bg-[#c28532] text-white px-7 py-3 rounded-xl md:rounded-full flex items-center justify-center gap-2 text-[14px] md:text-[15px] font-medium transition-colors">
                Search
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Deals List */}
        <div className="flex flex-col gap-10 md:gap-14">
          {MOCK_DEALS.map((deal, index) => (
            <div key={deal.id} className="flex flex-col">
              <div className="flex flex-col lg:flex-row gap-5 md:gap-8">
                {/* Image Placeholder */}
                <div className="relative w-full lg:w-[320px] h-[200px] md:h-[220px] bg-[#a3a3a3] rounded-2xl flex-shrink-0 overflow-hidden shadow-lg">
                  {deal.isExclusive && (
                    <div className="absolute top-3 left-3 md:top-4 md:left-4 bg-white/90 backdrop-blur-sm text-[#22c55e] text-[9px] md:text-[10px] font-bold px-2.5 py-1.5 rounded-[6px] flex items-center gap-1.5 uppercase tracking-wider shadow-sm">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#22c55e]" strokeWidth={2.5} /> EXCLUSIVE
                    </div>
                  )}

                  {/* Carousel Controls */}
                  <button className="absolute left-2 md:left-3 top-1/2 -translate-y-1/2 w-6 h-6 md:w-7 md:h-7 bg-white/40 hover:bg-white/60 rounded flex items-center justify-center transition-colors">
                    <ChevronLeft className="w-3 h-3 md:w-4 md:h-4 text-black/70" />
                  </button>
                  <button className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 w-6 h-6 md:w-7 md:h-7 bg-white/40 hover:bg-white/60 rounded flex items-center justify-center transition-colors">
                    <ChevronRight className="w-3 h-3 md:w-4 md:h-4 text-black/70" />
                  </button>
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 py-1">
                  <h2 className="text-white text-lg sm:text-xl md:text-[22px] font-semibold mb-2 md:mb-3 tracking-wide">
                    {deal.title}
                  </h2>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-x-2 md:gap-x-3 gap-y-1.5 md:gap-y-2 mb-4 md:mb-6">
                    {deal.tags.map((tag, i) => (
                      <span key={i} className="text-[#A3A3A3] text-[11px] md:text-[12px] font-light">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Verified & Discount */}
                  <div className="flex flex-col gap-2 mb-auto pb-3 md:pb-4">
                    {deal.isVerified && (
                      <div className="flex items-center gap-1.5">
                        <BadgeCheck className="w-3.5 h-3.5 md:w-4 md:h-4 text-black fill-[#2196F3]" strokeWidth={1} />
                        <span className="text-[#2196F3] text-[10px] md:text-[11px] font-bold uppercase tracking-wider">
                          VERIFIED USER
                        </span>
                      </div>
                    )}
                    {deal.discountText && (
                      <div className="flex items-center gap-1.5">
                        <BadgeCheck className="w-3.5 h-3.5 md:w-4 md:h-4 text-black fill-[#22c55e]" strokeWidth={1} />
                        <span className="text-[#22c55e] text-[10px] md:text-[11px] font-bold uppercase tracking-wider">
                          {deal.discountText}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Footer info */}
                  <div className="flex items-center gap-4 md:gap-6 mt-3 md:mt-4 pt-3 md:pt-4">
                    <div className="flex items-center gap-1.5 md:gap-2 text-white/80">
                      <MapPin className="w-3.5 h-3.5 md:w-[14px] md:h-[14px] text-white/50" strokeWidth={2} />
                      <span className="text-[12px] md:text-[13px] font-medium tracking-wide truncate max-w-[120px] sm:max-w-none">{deal.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5 md:gap-2 text-white/80">
                      <Calendar className="w-3.5 h-3.5 md:w-[14px] md:h-[14px] text-white/50" strokeWidth={2} />
                      <span className="text-[12px] md:text-[13px] font-medium tracking-wide">{deal.date}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons - Side-by-side on mobile, stacked on desktop */}
                <div className="grid grid-cols-2 lg:flex lg:flex-col lg:justify-center gap-3 md:gap-4 w-full lg:w-[180px] shrink-0 mt-4 md:mt-6 lg:mt-0">
                  <Link href="/deals/view-more">
                    <button className="w-full bg-white hover:bg-gray-100 text-black py-2.5 md:py-3 rounded-full font-bold text-[13px] md:text-[14px] transition-colors shadow-md cursor-pointer">
                      View More
                    </button></Link>
                  <button className="w-full bg-[#d4933a] hover:bg-[#c28532] text-white py-2.5 md:py-3 rounded-full font-bold text-[13px] md:text-[14px] transition-colors shadow-lg cursor-pointer">
                    Contact Now
                  </button>
                </div>
              </div>

              {/* Divider */}
              {index < MOCK_DEALS.length - 1 && (
                <div className="w-full h-px bg-white/10 mt-8 md:mt-14" />
              )}
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
