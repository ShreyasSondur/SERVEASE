"use client";

import { useState, useRef, useEffect } from "react";
import { Search, MapPin, ChevronDown, ArrowRight, Target } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import api from "@/lib/api";

export default function Hero() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [emirates, setEmirates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [globalServices, setGlobalServices] = useState<any[]>([]);

  const [selectedEmirateId, setSelectedEmirateId] = useState("");
  const [selectedCityId, setSelectedCityId] = useState("");
  const [loading, setLoading] = useState(true);

  const [isEmirateOpen, setIsEmirateOpen] = useState(false);
  const [isCityOpen, setIsCityOpen] = useState(false);
  const [isServiceOpen, setIsServiceOpen] = useState(false);
  const [selectedGlobalServiceId, setSelectedGlobalServiceId] = useState("");

  const emirateRef = useRef<HTMLDivElement>(null);
  const cityRef = useRef<HTMLDivElement>(null);
  const serviceRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (emirateRef.current && !emirateRef.current.contains(event.target as Node)) {
        setIsEmirateOpen(false);
      }
      if (cityRef.current && !cityRef.current.contains(event.target as Node)) {
        setIsCityOpen(false);
      }
      if (serviceRef.current && !serviceRef.current.contains(event.target as Node)) {
        setIsServiceOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch catalog data
  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const [emRes, cityRes, catRes] = await Promise.all([
          api.get("/catalog/emirates"),
          api.get("/catalog/cities"),
          api.get("/catalog/services")
        ]);
        setEmirates(emRes.data);
        setCities(cityRes.data);
        setGlobalServices(catRes.data);

        // Try IP geolocation for auto-fill
        try {
          const geoRes = await fetch("https://ipapi.co/json/");
          const geoData = await geoRes.json();
          if (geoData.country_name === "United Arab Emirates") {
            const matchedEm = emRes.data.find((e: any) => e.name.toLowerCase() === geoData.region.toLowerCase() || e.name.toLowerCase() === geoData.city.toLowerCase());
            if (matchedEm) {
              setSelectedEmirateId(matchedEm.id.toString());
              const matchedCity = cityRes.data.find((c: any) => c.emirate_id === matchedEm.id && c.name.toLowerCase() === geoData.city.toLowerCase());
              if (matchedCity) {
                setSelectedCityId(matchedCity.id.toString());
              } else {
                setSelectedCityId("");
              }
            } else {
              setSelectedEmirateId("");
              setSelectedCityId("");
            }
          } else {
            setSelectedEmirateId("");
            setSelectedCityId("");
          }
        } catch (geoErr) {
          console.error("Geo fallback error:", geoErr);
          setSelectedEmirateId("");
          setSelectedCityId("");
        }
      } catch (err) {
        console.error("Failed to load catalog data in hero:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCatalog();
  }, []);

  // Update city when emirate changes
  useEffect(() => {
    if (selectedEmirateId) {
      const filteredCities = cities.filter(c => c.emirate_id.toString() === selectedEmirateId);
      if (!filteredCities.find(c => c.id.toString() === selectedCityId)) {
        if (filteredCities.length > 0) {
          setSelectedCityId(filteredCities[0].id.toString());
        } else {
          setSelectedCityId("");
        }
      }
    }
  }, [selectedEmirateId, cities]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const emirateName = emirates.find(em => em.id.toString() === selectedEmirateId)?.name || "";
    const cityName = cities.find(c => c.id.toString() === selectedCityId)?.name || "";

    let url = `/services?q=${encodeURIComponent(searchQuery)}&emirate=${encodeURIComponent(emirateName)}&area=${encodeURIComponent(cityName)}`;
    if (selectedGlobalServiceId) {
      url += `&category_id=${selectedGlobalServiceId}`;
    }
    router.push(url);
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
              <div className="flex items-center flex-1 w-full px-4 sm:pl-6 sm:pr-4 gap-3 py-3 sm:py-0 relative" ref={serviceRef}>
                <Search className="w-5 h-5 text-[#888] shrink-0" strokeWidth={2} />
                <input
                  type="text"
                  placeholder="What service do you need?"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsServiceOpen(true);
                    setSelectedGlobalServiceId("");
                  }}
                  onFocus={() => setIsServiceOpen(true)}
                  className="w-full bg-transparent border-0 outline-none text-white placeholder-[#666] text-sm sm:text-[15px] md:text-base font-normal focus:ring-0 focus:outline-none"
                />
                
                {/* Service Suggestions Dropdown */}
                {isServiceOpen && searchQuery && (
                  <div className="absolute left-0 right-0 top-full mt-2 sm:mt-6 rounded-2xl bg-[#1c1c1c] border border-[#333] p-2 shadow-2xl z-50 flex flex-col gap-1 max-h-[250px] overflow-y-auto custom-scrollbar">
                    {globalServices.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase())).length > 0 ? (
                      globalServices
                        .filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
                        .map((service) => (
                          <button
                            key={service.id}
                            type="button"
                            onClick={() => {
                              setSearchQuery(service.name);
                              setSelectedGlobalServiceId(service.id.toString());
                              setIsServiceOpen(false);
                            }}
                            className="w-full text-left px-4 py-2.5 text-sm rounded-xl transition-all duration-150 text-[#D4D2CD] hover:text-white hover:bg-white/5"
                          >
                            {service.name}
                          </button>
                        ))
                    ) : (
                      <div className="px-4 py-2.5 text-sm text-[#888]">No matching services found.</div>
                    )}
                  </div>
                )}
              </div>

              {/* Middle Section: City Dropdown */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center w-full sm:w-auto border-t sm:border-t-0 sm:border-l border-[#333] pt-2 sm:pt-0">
                {/* Middle Section: Emirate Dropdown */}
                <div className="relative flex items-center justify-between sm:justify-start w-full sm:w-auto px-4 py-3 sm:py-0 min-w-[150px]" ref={emirateRef}>
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => {
                      setIsEmirateOpen(!isEmirateOpen);
                      setIsCityOpen(false);
                    }}
                    className="flex items-center justify-between w-full gap-3 text-left text-sm sm:text-[14px] font-medium text-white hover:text-[#d4933a] transition-colors duration-200 disabled:opacity-50"
                  >
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#888]" strokeWidth={1.5} />
                      <span className="truncate">{emirates.find(em => em.id.toString() === selectedEmirateId)?.name || "All Emirates"}</span>
                    </div>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-[#888] transition-transform duration-300 ${isEmirateOpen ? "rotate-180" : ""
                        }`}
                    />
                  </button>

                  {/* Emirate Dropdown Menu */}
                  {isEmirateOpen && (
                    <div className="absolute left-0 right-0 sm:right-auto sm:left-0 bottom-full sm:bottom-auto sm:top-full mb-2 sm:mt-6 sm:w-[180px] rounded-2xl bg-[#1c1c1c] border border-[#333] p-2 shadow-2xl z-50 flex flex-col gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedEmirateId("");
                          setSelectedCityId("");
                          setIsEmirateOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm rounded-xl transition-all duration-150 ${selectedEmirateId === ""
                          ? "bg-[#d4933a]/10 text-[#d4933a] font-medium"
                          : "text-[#D4D2CD] hover:text-white hover:bg-white/5"
                          }`}
                      >
                        All Emirates
                      </button>
                      {emirates.map((em) => (
                        <button
                          key={em.id}
                          type="button"
                          onClick={() => {
                            setSelectedEmirateId(em.id.toString());
                            setIsEmirateOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 text-sm rounded-xl transition-all duration-150 ${selectedEmirateId === em.id.toString()
                            ? "bg-[#d4933a]/10 text-[#d4933a] font-medium"
                            : "text-[#D4D2CD] hover:text-white hover:bg-white/5"
                            }`}
                        >
                          {em.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right Section: City Dropdown */}
                <div className="relative flex items-center justify-between sm:justify-start w-full sm:w-auto px-4 py-3 sm:py-0 border-t sm:border-t-0 sm:border-l border-[#333] min-w-[180px]" ref={cityRef}>
                  <button
                    type="button"
                    disabled={loading || !selectedEmirateId}
                    onClick={() => {
                      setIsCityOpen(!isCityOpen);
                      setIsEmirateOpen(false);
                    }}
                    className="flex items-center justify-between w-full gap-3 text-left text-sm sm:text-[14px] font-medium text-white hover:text-[#d4933a] transition-colors duration-200 disabled:opacity-50"
                  >
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-[#888]" strokeWidth={1.5} />
                      <span className="truncate">{cities.find(c => c.id.toString() === selectedCityId)?.name || "All Cities"}</span>
                    </div>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-[#888] transition-transform duration-300 ${isCityOpen ? "rotate-180" : ""
                        }`}
                    />
                  </button>

                  {/* City Dropdown Menu */}
                  {isCityOpen && selectedEmirateId && (
                    <div className="absolute left-0 right-0 bottom-full sm:bottom-auto sm:top-full mb-2 sm:mt-6 sm:w-[220px] max-h-[300px] overflow-y-auto rounded-2xl bg-[#1c1c1c] border border-[#333] p-2 shadow-2xl z-50 flex flex-col gap-1 custom-scrollbar">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCityId("");
                          setIsCityOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm rounded-xl transition-all duration-150 ${selectedCityId === ""
                          ? "bg-[#d4933a]/10 text-[#d4933a] font-medium"
                          : "text-[#D4D2CD] hover:text-white hover:bg-white/5"
                          }`}
                      >
                        All Cities
                      </button>
                      {cities.filter(c => c.emirate_id.toString() === selectedEmirateId).map((city) => (
                        <button
                          key={city.id}
                          type="button"
                          onClick={() => {
                            setSelectedCityId(city.id.toString());
                            setIsCityOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 text-sm rounded-xl transition-all duration-150 ${selectedCityId === city.id.toString()
                            ? "bg-[#d4933a]/10 text-[#d4933a] font-medium"
                            : "text-[#D4D2CD] hover:text-white hover:bg-white/5"
                            }`}
                        >
                          {city.name}
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
