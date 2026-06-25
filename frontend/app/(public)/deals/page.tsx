"use client";

import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Search, MapPin, ChevronDown, ArrowRight,
  ChevronLeft, ChevronRight, BadgeCheck,
  Calendar, Target, CheckCircle2, X, MessageCircle, Phone, Tag, Briefcase
} from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";
import ImageCarousel from "@/components/ImageCarousel";

export default function Deals() {
  const [searchQuery, setSearchQuery] = useState("");
  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Catalog data
  const [emirates, setEmirates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [globalServices, setGlobalServices] = useState<any[]>([]);

  // Selected filters
  const [selectedEmirate, setSelectedEmirate] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedGlobalService, setSelectedGlobalService] = useState("");

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
      } catch (err) {
        console.error("Failed to fetch catalog:", err);
      }
    };
    fetchCatalog();
  }, []);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checkedAuth, setCheckedAuth] = useState(false);
  const [selectedServiceForContact, setSelectedServiceForContact] = useState<any>(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showAuthRequiredModal, setShowAuthRequiredModal] = useState(false);

  const emirateRef = useRef<HTMLDivElement>(null);
  const cityRef = useRef<HTMLDivElement>(null);
  
  const [isEmirateOpen, setIsEmirateOpen] = useState(false);
  const [isCityOpen, setIsCityOpen] = useState(false);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (emirateRef.current && !emirateRef.current.contains(event.target as Node)) {
        setIsEmirateOpen(false);
      }
      if (cityRef.current && !cityRef.current.contains(event.target as Node)) {
        setIsCityOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchDeals = async () => {
    setLoading(true);
    try {
      let url = "/deals/?";
      if (selectedEmirate) url += `emirate_id=${selectedEmirate}&`;
      if (selectedCity) url += `city_id=${selectedCity}&`;
      if (selectedGlobalService) url += `category_id=${selectedGlobalService}&`;
      if (searchQuery) url += `q=${encodeURIComponent(searchQuery)}&`;

      const response = await api.get(url);
      setDeals(response.data);
    } catch (error: any) {
      if (error.response?.status === 401) {
        setIsLoggedIn(false);
      }
      console.error("Failed to fetch deals:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    setCheckedAuth(true);
    fetchDeals();
  }, []);

  const handleSearch = () => {
    fetchDeals();
  };

  const handleContact = (deal: any) => {
    if (!localStorage.getItem("token")) {
      setShowAuthRequiredModal(true);
    } else {
      setSelectedServiceForContact(deal);
      setShowContactModal(true);
    }
  };

  const currentEmirateName = emirates.find(e => e.id.toString() === selectedEmirate)?.name || "All Emirates";
  const currentCityName = cities.find(c => c.id.toString() === selectedCity)?.name || "All Cities";

  return (
    <div className="relative min-h-screen bg-[#111111] flex flex-col w-full font-sans">
      <Navbar />

      <main className="flex-grow pt-28 md:pt-32 pb-20 md:pb-24 px-4 sm:px-6 md:px-10 lg:px-12 max-w-[1200px] mx-auto w-full">
        {/* Search Bar */}
        <div className="w-full mx-auto bg-[#1a1a1a] rounded-2xl md:rounded-full border border-[#333] flex flex-col md:flex-row items-center p-2 md:p-1.5 mb-12 md:mb-20 shadow-xl transition-all">
          <div className="flex items-center flex-1 w-full pl-4 md:pl-6 gap-3 py-3 md:py-0">
            <Search className="w-5 h-5 text-white/50 shrink-0" strokeWidth={2} />
            {/* Global Services Dropdown */}
            <input
              type="text"
              list="global-services-list"
              placeholder="What service do you need?"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                // Try to find a matching global service to set ID
                const matched = globalServices.find(s => s.name.toLowerCase() === e.target.value.toLowerCase());
                setSelectedGlobalService(matched ? matched.id.toString() : "");
              }}
              className="w-full bg-transparent border-0 outline-none text-white placeholder-[#777] text-[14px] md:text-[15px] font-normal focus:ring-0"
            />
            <datalist id="global-services-list">
              {globalServices.map((gs) => (
                <option key={gs.id} value={gs.name} />
              ))}
            </datalist>
          </div>

          {/* Dividers and Dropdowns */}
          <div className="flex flex-col md:flex-row items-center w-full md:w-auto border-t md:border-t-0 md:border-l border-[#333]">
            {/* Emirate Dropdown */}
            <div className="relative flex items-center justify-between md:justify-start w-full md:w-[170px] gap-3 px-4 md:px-6 py-3.5 md:py-3 text-white border-b md:border-b-0 md:border-r border-[#333] h-full" ref={emirateRef}>
              <button
                type="button"
                onClick={() => {
                  setIsEmirateOpen(!isEmirateOpen);
                  setIsCityOpen(false);
                }}
                className="flex items-center justify-between w-full gap-3 text-left text-sm md:text-[14px] font-medium text-white hover:text-[#d4933a] transition-colors duration-200"
              >
                <div className="flex items-center gap-2 truncate">
                  <MapPin className="w-4 h-4 text-white/50 shrink-0" strokeWidth={1.5} />
                  <span className="truncate">{currentEmirateName}</span>
                </div>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-[#888] shrink-0 transition-transform duration-300 ${isEmirateOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isEmirateOpen && (
                <div className="absolute left-0 right-0 md:left-4 md:right-auto top-full mt-2 md:w-[180px] rounded-2xl bg-[#1c1c1c] border border-[#333] p-2 shadow-2xl z-50 flex flex-col gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedEmirate("");
                      setSelectedCity("");
                      setIsEmirateOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm rounded-xl transition-all duration-150 ${selectedEmirate === ""
                      ? "bg-[#d4933a]/10 text-[#d4933a] font-medium"
                      : "text-[#D4D2CD] hover:text-white hover:bg-white/5"
                      }`}
                  >
                    All Emirates
                  </button>
                  {emirates.map((e) => (
                    <button
                      key={e.id}
                      type="button"
                      onClick={() => {
                        setSelectedEmirate(e.id.toString());
                        setSelectedCity("");
                        setIsEmirateOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm rounded-xl transition-all duration-150 ${selectedEmirate === e.id.toString()
                        ? "bg-[#d4933a]/10 text-[#d4933a] font-medium"
                        : "text-[#D4D2CD] hover:text-white hover:bg-white/5"
                        }`}
                    >
                      {e.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* City Dropdown */}
            <div className="relative flex items-center justify-between md:justify-start w-full md:w-[170px] gap-3 px-4 md:px-6 py-3.5 md:py-3 text-white h-full" ref={cityRef}>
              <button
                type="button"
                disabled={!selectedEmirate}
                onClick={() => {
                  setIsCityOpen(!isCityOpen);
                  setIsEmirateOpen(false);
                }}
                className="flex items-center justify-between w-full gap-3 text-left text-sm md:text-[14px] font-medium text-white hover:text-[#d4933a] transition-colors duration-200 disabled:opacity-50"
              >
                <div className="flex items-center gap-2 truncate">
                  <Target className="w-4 h-4 text-white/50 shrink-0" strokeWidth={1.5} />
                  <span className="truncate">{currentCityName}</span>
                </div>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-[#888] shrink-0 transition-transform duration-300 ${isCityOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isCityOpen && selectedEmirate && (
                <div className="absolute left-0 right-0 md:left-4 md:right-auto top-full mt-2 md:w-[190px] max-h-[250px] overflow-y-auto rounded-2xl bg-[#1c1c1c] border border-[#333] p-2 shadow-2xl z-50 flex flex-col gap-1 custom-scrollbar">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCity("");
                      setIsCityOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm rounded-xl transition-all duration-150 ${selectedCity === ""
                      ? "bg-[#d4933a]/10 text-[#d4933a] font-medium"
                      : "text-[#D4D2CD] hover:text-white hover:bg-white/5"
                      }`}
                  >
                    All Cities
                  </button>
                  {cities
                    .filter(c => c.emirate_id.toString() === selectedEmirate)
                    .map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          setSelectedCity(c.id.toString());
                          setIsCityOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm rounded-xl transition-all duration-150 ${selectedCity === c.id.toString()
                          ? "bg-[#d4933a]/10 text-[#d4933a] font-medium"
                          : "text-[#D4D2CD] hover:text-white hover:bg-white/5"
                          }`}
                      >
                        {c.name}
                      </button>
                    ))}
                </div>
              )}
            </div>

            <div className="w-full md:w-auto p-1.5 md:p-0 md:ml-2">
              <button onClick={handleSearch} className="cursor-pointer w-full md:w-auto bg-[#d4933a] hover:bg-[#c28532] text-white px-7 py-3 rounded-xl md:rounded-full flex items-center justify-center gap-2 text-[14px] md:text-[15px] font-medium transition-colors">
                Search
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Deals List */}
        <div className="flex flex-col gap-10 md:gap-14">
          {loading ? (
            <div className="text-white text-center py-10">Loading deals...</div>
          ) : deals.length === 0 ? (
            <div className="text-white text-center py-10">No deals found.</div>
          ) : (
            deals.map((deal: any, index: number) => (
              <div key={deal.id} className="flex flex-col">
                <div className="flex flex-col lg:flex-row gap-5 md:gap-8">
                  {/* Image Carousel */}
                  <div className="relative w-full lg:w-[320px] h-[200px] md:h-[220px] rounded-2xl flex-shrink-0 overflow-hidden shadow-lg">
                    <ImageCarousel
                      images={deal.images}
                      imageUrl={deal.image_url}
                      title={deal.title || "Deal Image"}
                      featuredBadge={
                        <div className="bg-white/90 backdrop-blur-sm text-[#22c55e] text-[9px] md:text-[10px] font-bold px-2.5 py-1.5 rounded-[6px] flex items-center gap-1.5 uppercase tracking-wider shadow-sm">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#22c55e]" strokeWidth={2.5} /> EXCLUSIVE
                        </div>
                      }
                    />
                  </div>

                  {/* Content */}
                  <div className="flex flex-col flex-1 py-1">
                    <h2 className="text-white text-lg sm:text-xl md:text-[22px] font-semibold mb-2 md:mb-3 tracking-wide">
                      {deal.title || "Special Deal"}
                    </h2>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-x-2 md:gap-x-3 gap-y-1.5 md:gap-y-2 mb-4 md:mb-6">
                      <span className="text-[#A3A3A3] text-[11px] md:text-[12px] font-light">
                        {deal.description}
                      </span>
                    </div>

                    {/* Verified & Discount */}
                    <div className="flex flex-col gap-2 mb-auto pb-3 md:pb-4">
                      <div className="flex items-center gap-1.5">
                        <BadgeCheck className="w-3.5 h-3.5 md:w-4 md:h-4 text-black fill-[#2196F3]" strokeWidth={1} />
                        <span className="text-[#2196F3] text-[10px] md:text-[11px] font-bold uppercase tracking-wider">
                          VERIFIED PARTNER
                        </span>
                      </div>
                      {deal.discount_desc && (
                        <div className="flex items-center gap-1.5">
                          <BadgeCheck className="w-3.5 h-3.5 md:w-4 md:h-4 text-black fill-[#22c55e]" strokeWidth={1} />
                          <span className="text-[#22c55e] text-[10px] md:text-[11px] font-bold uppercase tracking-wider">
                            {deal.discount_desc}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Footer info */}
                    <div className="flex items-center gap-4 md:gap-6 mt-3 md:mt-4 pt-3 md:pt-4">
                      <div className="flex items-center gap-1.5 md:gap-2 text-white/80">
                        <MapPin className="w-3.5 h-3.5 md:w-[14px] md:h-[14px] text-white/50" strokeWidth={2} />
                        <span className="text-[12px] md:text-[13px] font-medium tracking-wide truncate max-w-[120px] sm:max-w-none">{deal.city?.name || "Dubai"}</span>
                      </div>
                      <div className="flex items-center gap-1.5 md:gap-2 text-white/80">
                        <Briefcase className="w-3.5 h-3.5 md:w-[14px] md:h-[14px] text-white/50" strokeWidth={2} />
                        <span className="text-[12px] md:text-[13px] font-medium tracking-wide">{deal.category?.name || "Service"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 lg:flex lg:flex-col lg:justify-center gap-3 md:gap-4 w-full lg:w-[180px] shrink-0 mt-4 md:mt-6 lg:mt-0">
                    <Link href={`/deals/${deal.id}`}>
                      <button className="w-full bg-white hover:bg-gray-100 text-black py-2.5 md:py-3 rounded-full font-bold text-[13px] md:text-[14px] transition-colors shadow-md cursor-pointer">
                        View More
                      </button></Link>
                     <button 
                      onClick={() => handleContact(deal)}
                      className="w-full bg-[#d4933a] hover:bg-[#c28532] text-white py-2.5 md:py-3 rounded-full font-bold text-[13px] md:text-[14px] transition-colors shadow-lg cursor-pointer"
                     >
                      Contact Now
                     </button>
                  </div>
                </div>

                {/* Divider */}
                {index < deals.length - 1 && (
                  <div className="w-full h-px bg-white/10 mt-8 md:mt-14" />
                )}
              </div>
            ))
          )}
        </div>
      </main>

      <Footer />

      {/* Auth required prompt modal */}
      {showAuthRequiredModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#151515] border border-[#222] rounded-3xl p-8 max-w-md w-full text-center shadow-2xl animate-fade-in relative text-white">
            <button 
              onClick={() => setShowAuthRequiredModal(false)} 
              className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-16 h-16 rounded-full bg-[#d4933a]/10 border border-[#d4933a]/30 flex items-center justify-center mx-auto mb-6">
              <Phone className="w-8 h-8 text-[#d4933a]" />
            </div>
            <h2 className="text-2xl font-semibold text-white mb-3 tracking-wide">Login to View Contact</h2>
            <p className="text-[#888] text-sm leading-relaxed mb-8">
              Please log in or register for a free account to view this partner's contact details and connect with them.
            </p>
            <div className="flex flex-col gap-3">
              <Link href="/login?redirect=/deals">
                <button className="w-full bg-[#d4933a] hover:bg-[#c28532] text-white py-3.5 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(212,147,58,0.25)] cursor-pointer">
                  Log In
                </button>
              </Link>
              <Link href="/signup?redirect=/deals">
                <button className="w-full bg-[#222] border border-[#333] hover:border-[#444] text-[#aaa] hover:text-white py-3.5 rounded-xl font-bold transition-all cursor-pointer">
                  Register for Free
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Contact Modal */}
      {showContactModal && selectedServiceForContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#151515] border border-[#222] rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl animate-fade-in relative text-white">
            <button 
              onClick={() => {
                setShowContactModal(false);
                setSelectedServiceForContact(null);
              }} 
              className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h3 className="text-xl font-bold tracking-wide text-white mb-2">
              Contact Provider
            </h3>
            <p className="text-[#d4933a] text-[15px] font-semibold mb-6">
              {selectedServiceForContact.partner?.business_name || `${selectedServiceForContact.partner?.first_name} ${selectedServiceForContact.partner?.last_name}`}
            </p>
            
            <div className="flex flex-col gap-4 mb-8">
              <div className="flex items-center gap-3 bg-[#111] p-4 rounded-xl border border-[#222]">
                <Phone className="w-5 h-5 text-white/50" />
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-wider text-gray-500">Phone Number</span>
                  <span className="text-[15px] font-medium">{selectedServiceForContact.partner?.phone}</span>
                </div>
              </div>
              
              {selectedServiceForContact.partner?.email && (
                <div className="flex items-center gap-3 bg-[#111] p-4 rounded-xl border border-[#222]">
                  <span className="text-[15px] text-white/50 font-bold shrink-0">@</span>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-wider text-gray-500">Email Address</span>
                    <span className="text-[15px] font-medium">{selectedServiceForContact.partner?.email}</span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <a 
                href={`tel:${selectedServiceForContact.partner?.phone}`}
                className="flex-1 bg-[#222] hover:bg-[#333] border border-[#333] hover:border-[#d4933a] text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Phone className="w-4 h-4" /> Call Now
              </a>
              <a 
                href={`https://wa.me/${selectedServiceForContact.partner?.phone?.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-[#25D366] hover:bg-[#20ba5a] text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(37,211,102,0.25)] cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" /> WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
