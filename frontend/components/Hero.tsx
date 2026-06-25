"use client";

import { useState, useRef, useEffect } from "react";
import { Search, MapPin, ChevronDown, ArrowRight, Target } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const EMIRATES_DATA: Record<string, string[]> = {
  "Dubai": ["Sobha Hartland", "Downtown Dubai", "Dubai Marina", "Jumeirah", "Business Bay", "Al Barsha", "Palm Jumeirah"],
  "Abu Dhabi": ["Al Reem Island", "Yas Island", "Saadiyat Island", "Khalifa City", "Al Raha Beach"],
  "Sharjah": ["Al Majaz", "Al Nahda", "Al Qasimia", "Muwaileh", "Al Taawun"],
  "Ajman": ["Al Rashidiya", "Al Nuaimiya", "Al Jurf", "Emirates City"],
  "Ras Al Khaimah": ["Al Hamra Village", "Mina Al Arab", "Al Marjan Island", "Dafan Al Nakheel"],
  "Fujairah": ["Al Faseel", "Dibba", "Sakamkam"],
  "Umm Al Quwain": ["Al Salamah", "Al Ramlah", "Al Maqtaa"]
};

const EMIRATES = Object.keys(EMIRATES_DATA);

export default function Hero() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [emirate, setEmirate] = useState("Dubai");
  const [area, setArea] = useState("Sobha Hartland");

  const [isEmirateOpen, setIsEmirateOpen] = useState(false);
  const [isAreaOpen, setIsAreaOpen] = useState(false);

  const emirateRef = useRef<HTMLDivElement>(null);
  const areaRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (emirateRef.current && !emirateRef.current.contains(event.target as Node)) {
        setIsEmirateOpen(false);
      }
      if (areaRef.current && !areaRef.current.contains(event.target as Node)) {
        setIsAreaOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Update area when emirate changes
  useEffect(() => {
    if (!EMIRATES_DATA[emirate].includes(area)) {
      setArea(EMIRATES_DATA[emirate][0]);
    }
  }, [emirate, area]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/services?q=${encodeURIComponent(searchQuery)}&emirate=${encodeURIComponent(emirate)}&area=${encodeURIComponent(area)}`);
  };

  return (
    <section className="relative min-h-screen flex items-center w-full bg-[#0b0a0a]">
      {/* Background Image & Rich Overlay Gradients */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Image
          src="/images/hero-section-bg.png"
          alt="Painter detailing a black wall"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center md:object-[center_35%] select-none pointer-events-none"
        />
        {/* Mobile: stronger overlay for readability */}
        <div className="absolute inset-0 bg-[#0b0a0a]/70 md:hidden" />
        <div className="absolute inset-0 hero-overlay hidden md:block" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 mx-auto max-w-[1600px] w-full flex items-center min-h-screen px-5 sm:px-8 md:px-12 lg:px-12">
        <div className="w-full lg:w-[60%] xl:w-[65%] flex justify-center lg:justify-end xl:justify-center">
          <div className="w-full max-w-4xl flex flex-col items-start text-left pt-24 pb-12 sm:pt-28 md:-mt-16 md:pt-0 md:pb-0">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#d4933a]/40 bg-[#d4933a]/5 px-3 py-1 sm:px-4 sm:py-1.5 text-[10px] sm:text-xs md:text-sm font-semibold uppercase tracking-wider text-[#d4933a] select-none animate-fade-in">
              <span className="h-[1px] w-3 sm:w-4 bg-[#d4933a]/60" />
              The UAE Concierge
            </div>

            {/* Heading */}
            <h1 className="mt-6 sm:mt-8 font-serif text-4xl sm:text-5xl md:text-6xl lg:text-[72px] font-light tracking-tight text-white leading-[1.1] animate-slide-up">
              Find trusted <br />
              Professionals <br />
              <span className="text-[#d4933a] text-glow">for every Job.</span>
            </h1>

            {/* Subheading */}
            <p className="mt-4 sm:mt-6 text-sm sm:text-base md:text-lg text-[#D4D2CD] font-light leading-relaxed font-sans animate-fade-in delay-200">
              From small fixes to big projects — connect with verified workers nearby.
            </p>

            {/* Search Form */}
            <form
              onSubmit={handleSearch}
              className="mt-8 sm:mt-10 w-full max-w-[850px] bg-[#1c1c1c] p-2 sm:p-1.5 flex flex-col sm:flex-row items-center rounded-2xl sm:rounded-full border border-[#333] shadow-2xl relative transition-all duration-300 animate-slide-up delay-300"
            >
              {/* Left Section: Search Input */}
              <div className="flex items-center flex-1 w-full px-4 sm:pl-6 sm:pr-4 gap-3 py-3 sm:py-0">
                <Search className="w-5 h-5 text-[#888] shrink-0" strokeWidth={2} />
                <input
                  type="text"
                  placeholder="What service do you need?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-0 outline-none text-white placeholder-[#666] text-sm sm:text-[15px] md:text-base font-normal focus:ring-0 focus:outline-none"
                />
              </div>

              {/* Middle Section: Area Dropdown */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center w-full sm:w-auto border-t sm:border-t-0 sm:border-l border-[#333] pt-2 sm:pt-0">
                <div className="relative flex items-center justify-between sm:justify-start w-full sm:w-auto px-4 py-3 sm:py-0 min-w-[180px]" ref={areaRef}>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAreaOpen(!isAreaOpen);
                      setIsEmirateOpen(false);
                    }}
                    className="flex items-center justify-between w-full gap-3 text-left text-sm sm:text-[14px] font-medium text-white hover:text-[#d4933a] transition-colors duration-200"
                  >
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-[#888]" strokeWidth={1.5} />
                      <span className="truncate">{area}</span>
                    </div>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-[#888] transition-transform duration-300 ${isAreaOpen ? "rotate-180" : ""
                        }`}
                    />
                  </button>

                  {/* Area Dropdown Menu */}
                  {isAreaOpen && (
                    <div className="absolute left-0 right-0 bottom-full sm:bottom-auto sm:top-full mb-2 sm:mt-6 sm:w-[220px] max-h-[300px] overflow-y-auto rounded-2xl bg-[#1c1c1c] border border-[#333] p-2 shadow-2xl z-50 flex flex-col gap-1 custom-scrollbar">
                      {EMIRATES_DATA[emirate].map((loc) => (
                        <button
                          key={loc}
                          type="button"
                          onClick={() => {
                            setArea(loc);
                            setIsAreaOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 text-sm rounded-xl transition-all duration-150 ${area === loc
                            ? "bg-[#d4933a]/10 text-[#d4933a] font-medium"
                            : "text-[#D4D2CD] hover:text-white hover:bg-white/5"
                            }`}
                        >
                          {loc}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right Section: Emirate Dropdown */}
                <div className="relative flex items-center justify-between sm:justify-start w-full sm:w-auto px-4 py-3 sm:py-0 border-t sm:border-t-0 sm:border-l border-[#333] min-w-[150px]" ref={emirateRef}>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEmirateOpen(!isEmirateOpen);
                      setIsAreaOpen(false);
                    }}
                    className="flex items-center justify-between w-full gap-3 text-left text-sm sm:text-[14px] font-medium text-white hover:text-[#d4933a] transition-colors duration-200"
                  >
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#888]" strokeWidth={1.5} />
                      <span className="truncate">{emirate}</span>
                    </div>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-[#888] transition-transform duration-300 ${isEmirateOpen ? "rotate-180" : ""
                        }`}
                    />
                  </button>

                  {/* Emirate Dropdown Menu */}
                  {isEmirateOpen && (
                    <div className="absolute left-0 right-0 sm:right-auto sm:left-0 bottom-full sm:bottom-auto sm:top-full mb-2 sm:mt-6 sm:w-[180px] rounded-2xl bg-[#1c1c1c] border border-[#333] p-2 shadow-2xl z-50 flex flex-col gap-1">
                      {EMIRATES.map((em) => (
                        <button
                          key={em}
                          type="button"
                          onClick={() => {
                            setEmirate(em);
                            setIsEmirateOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 text-sm rounded-xl transition-all duration-150 ${emirate === em
                            ? "bg-[#d4933a]/10 text-[#d4933a] font-medium"
                            : "text-[#D4D2CD] hover:text-white hover:bg-white/5"
                            }`}
                        >
                          {em}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Search Button */}
                <div className="w-full sm:w-auto p-1.5 sm:p-0 sm:ml-2">
                  <button
                    type="submit"
                    className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl sm:rounded-full bg-[#d4933a] hover:bg-[#c28532] text-white font-medium py-3 sm:py-3 px-5 sm:px-8 text-sm sm:text-[15px] md:text-base shadow-[0_0_20px_rgba(212,147,58,0.3)] transition-all duration-300 cursor-pointer"
                  >
                    <span>Search</span>
                    <ArrowRight className="w-4 h-4" strokeWidth={2} />
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
