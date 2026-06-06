"use client";

import { useState, useRef, useEffect } from "react";
import { Search, MapPin, ChevronDown, ArrowRight } from "lucide-react";

const UAE_CITIES = [
  "Dubai",
  "Abu Dhabi",
  "Sharjah",
  "Ajman",
  "Ras Al Khaimah",
  "Fujairah",
  "Umm Al Quwain",
];

export default function Hero() {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("Dubai");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Searching for "${searchQuery}" in ${location}`);
  };

  return (
    <section className="relative min-h-screen flex items-center w-full bg-[#0b0a0a]">
      {/* Background Image & Rich Overlay Gradients */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src="/images/hero-section-bg.png"
          alt="Painter detailing a black wall"
          className="h-full w-full object-cover object-center md:object-[center_35%] select-none pointer-events-none"
        />
        {/* Mobile: stronger overlay for readability */}
        <div className="absolute inset-0 bg-[#0b0a0a]/70 md:hidden" />
        <div className="absolute inset-0 hero-overlay hidden md:block" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 mx-auto max-w-[1600px] w-full flex items-center min-h-screen px-5 sm:px-8 md:px-12 lg:px-12">
        <div className="w-full lg:w-[60%] xl:w-[55%] flex justify-center lg:justify-end xl:justify-center">
          <div className="w-full max-w-2xl flex flex-col items-start text-left pt-24 pb-12 sm:pt-28 md:-mt-16 md:pt-0 md:pb-0">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/5 px-3 py-1 sm:px-4 sm:py-1.5 text-[10px] sm:text-xs md:text-sm font-semibold uppercase tracking-wider text-gold select-none animate-fade-in">
              <span className="h-[1px] w-3 sm:w-4 bg-gold/60" />
              The UAE Concierge
            </div>

            {/* Heading */}
            <h1 className="mt-6 sm:mt-8 font-serif text-4xl sm:text-5xl md:text-6xl lg:text-[72px] font-light tracking-tight text-white leading-[1.1] animate-slide-up">
              Find trusted <br />
              Professionals <br />
              <span className="text-gold text-glow">for every Job.</span>
            </h1>

            {/* Subheading */}
            <p className="mt-4 sm:mt-6 text-sm sm:text-base md:text-lg text-[#D4D2CD] font-light leading-relaxed font-sans animate-fade-in delay-200">
              From small fixes to big projects — connect with verified workers nearby. It&apos;s free for customers.
            </p>

            {/* Search Form */}
            <form
              onSubmit={handleSearch}
              className="mt-8 sm:mt-10 w-full max-w-2xl bg-[#1c1c1c] p-2 sm:p-1.5 flex flex-col sm:flex-row items-center rounded-2xl sm:rounded-full border border-[#333] shadow-2xl relative transition-all duration-300"
            >
              {/* Left Section: Search Input */}
              <div className="flex items-center flex-1 w-full px-4 sm:pl-6 sm:pr-4 gap-3 py-3 sm:py-0">
                <Search className="w-5 h-5 text-white/50 shrink-0" strokeWidth={2} />
                <input
                  type="text"
                  placeholder="What service do you need?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-0 outline-none text-white placeholder-[#666] text-sm sm:text-[15px] md:text-base font-normal focus:ring-0 focus:outline-none"
                />
              </div>

              {/* Right Section: Location & Search Button */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center w-full sm:w-auto border-t sm:border-t-0 sm:border-l border-[#333] pt-2 sm:pt-0 sm:pl-2">
                <div className="relative flex items-center justify-between sm:justify-start w-full sm:w-auto px-4 sm:px-4 py-3 sm:py-0" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 text-left text-sm sm:text-[15px] md:text-base font-medium text-white hover:text-[#d4933a] transition-colors duration-200"
                  >
                    <MapPin className="w-4 h-4 text-white/50" strokeWidth={1.5} />
                    <span className="truncate min-w-[50px]">{location}</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-white/40 transition-transform duration-300 ${
                        isDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Location Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute left-0 bottom-full sm:bottom-auto sm:top-full mb-2 sm:mt-6 w-52 rounded-2xl bg-[#1c1c1c] border border-[#333] p-2 shadow-2xl z-50 flex flex-col gap-1">
                      {UAE_CITIES.map((city) => (
                        <button
                          key={city}
                          type="button"
                          onClick={() => {
                            setLocation(city);
                            setIsDropdownOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 text-sm rounded-xl transition-all duration-150 ${
                            location === city
                              ? "bg-[#d4933a]/10 text-[#d4933a] font-medium"
                              : "text-[#D4D2CD] hover:text-white hover:bg-white/5"
                          }`}
                        >
                          {city}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Search Button */}
                <div className="w-full sm:w-auto p-1.5 sm:p-0 sm:ml-2">
                  <button
                    type="submit"
                    className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl sm:rounded-full bg-[#d4933a] hover:bg-[#c28532] text-white font-medium py-3 sm:py-3 px-5 sm:px-8 text-sm sm:text-[15px] md:text-base shadow-lg transition-all duration-300 cursor-pointer"
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
