"use client";

import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Search, MapPin, ChevronDown, ArrowRight,
  ChevronLeft, ChevronRight, BadgeCheck,
  Calendar, Target, CheckCircle2, X, MessageCircle, Phone, Tag, Briefcase, Filter
} from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";
import ImageCarousel from "@/components/ImageCarousel";

export default function Deals() {
  const [searchQuery, setSearchQuery] = useState("");
  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  // Catalog data
  const [emirates, setEmirates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [globalServices, setGlobalServices] = useState<any[]>([]);

  // Selected filters
  const [selectedEmirate, setSelectedEmirate] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedGlobalService, setSelectedGlobalService] = useState("");
  const [selectedSort, setSelectedSort] = useState("");

  useEffect(() => {
    const fetchCatalogAndDeals = async () => {
      try {
        const [emRes, cityRes, catRes] = await Promise.all([
          api.get("/catalog/emirates"),
          api.get("/catalog/cities"),
          api.get("/catalog/services")
        ]);
        setEmirates(emRes.data);
        setCities(cityRes.data);
        setGlobalServices(catRes.data);

        // Pre-populate from URL query params
        const params = new URLSearchParams(window.location.search);
        const qParam = params.get("q") || "";
        const emirateParam = params.get("emirate") || "";
        const areaParam = params.get("area") || "";
        const categoryIdParam = params.get("category_id") || "";

        let emirateId = "";
        let cityId = "";
        let globalServiceId = "";

        if (emirateParam) {
          const matchedEm = emRes.data.find((e: any) => e.name.toLowerCase() === emirateParam.toLowerCase());
          if (matchedEm) {
            emirateId = matchedEm.id.toString();
            setSelectedEmirate(emirateId);
          }
        }

        if (areaParam) {
          const matchedCity = cityRes.data.find((c: any) => c.name.toLowerCase() === areaParam.toLowerCase());
          if (matchedCity) {
            cityId = matchedCity.id.toString();
            setSelectedCity(cityId);
          }
        }

        if (categoryIdParam) {
          const matchedGs = catRes.data.find((s: any) => s.id.toString() === categoryIdParam);
          if (matchedGs) {
            globalServiceId = matchedGs.id.toString();
            setSelectedGlobalService(globalServiceId);
            setSearchQuery(matchedGs.name);
          }
        } else if (qParam) {
          setSearchQuery(qParam);
          const matchedGs = catRes.data.find((s: any) => s.name.toLowerCase() === qParam.toLowerCase());
          if (matchedGs) {
            globalServiceId = matchedGs.id.toString();
            setSelectedGlobalService(globalServiceId);
          }
        }

        const token = localStorage.getItem("token");
        if (token) {
          try {
             const userRes = await api.get("/auth/me");
             setUserProfile(userRes.data);
          } catch(e) {
             console.error(e);
          }
        }
        setIsLoggedIn(!!token);
        setCheckedAuth(true);

        setLoading(true);
        let url = `/deals/?page=1&limit=${limit}&`;
        if (emirateId) url += `emirate_id=${emirateId}&`;
        if (cityId) url += `city_id=${cityId}&`;
        if (globalServiceId) {
          url += `category_id=${globalServiceId}&`;
        } else if (qParam) {
          url += `q=${encodeURIComponent(qParam)}&`;
        }
        if (selectedSort) url += `sort=${selectedSort}&`;

        const response = await api.get(url);
        setDeals(response.data.items || []);
        setTotalItems(response.data.total || 0);
        setTotalPages(Math.ceil((response.data.total || 0) / limit) || 1);
        setCurrentPage(1);
      } catch (err) {
        console.error("Failed to load catalog and search deals:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCatalogAndDeals();
  }, []);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checkedAuth, setCheckedAuth] = useState(false);
  const [selectedServiceForContact, setSelectedServiceForContact] = useState<any>(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showAuthRequiredModal, setShowAuthRequiredModal] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [showPhoneRequiredModal, setShowPhoneRequiredModal] = useState(false);
  const [phoneNumberInput, setPhoneNumberInput] = useState("");
  const [isSubmittingPhone, setIsSubmittingPhone] = useState(false);
  const [phoneError, setPhoneError] = useState("");

  const emirateRef = useRef<HTMLDivElement>(null);
  const cityRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);
  
  const [isEmirateOpen, setIsEmirateOpen] = useState(false);
  const [isCityOpen, setIsCityOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isServiceOpen, setIsServiceOpen] = useState(false);
  const serviceRef = useRef<HTMLDivElement>(null);
  const [ads, setAds] = useState<Record<string, any>>({});

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (emirateRef.current && !emirateRef.current.contains(event.target as Node)) {
        setIsEmirateOpen(false);
      }
      if (cityRef.current && !cityRef.current.contains(event.target as Node)) {
        setIsCityOpen(false);
      }
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
      if (serviceRef.current && !serviceRef.current.contains(event.target as Node)) {
        setIsServiceOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    api.get("/ads").then(res => {
      const adsMap: Record<string, any> = {};
      res.data.forEach((ad: any) => adsMap[ad.position] = ad);
      setAds(adsMap);
    }).catch(() => {});
  }, []);

  const fetchDeals = async (pageToFetch = 1) => {
    setLoading(true);
    try {
      let url = `/deals/?page=${pageToFetch}&limit=${limit}&`;
      if (selectedEmirate) url += `emirate_id=${selectedEmirate}&`;
      if (selectedCity) url += `city_id=${selectedCity}&`;
      if (selectedGlobalService) {
        url += `category_id=${selectedGlobalService}&`;
      } else if (searchQuery) {
        url += `q=${encodeURIComponent(searchQuery)}&`;
      }
      if (selectedSort) {
        url += `sort=${selectedSort}&`;
      }

      const response = await api.get(url);
      setDeals(response.data.items || []);
      setTotalItems(response.data.total || 0);
      setTotalPages(Math.ceil((response.data.total || 0) / limit) || 1);
      setCurrentPage(pageToFetch);
    } catch (error: any) {
      if (error.response?.status === 401) {
        setIsLoggedIn(false);
      }
      console.error("Failed to fetch deals:", error);
    } finally {
      setLoading(false);
    }
  };



  const handleSearch = () => {
    fetchDeals(1);
  };

  const handleContact = async (deal: any) => {
    if (!localStorage.getItem("token")) {
      setSelectedServiceForContact(deal);
      setShowAuthRequiredModal(true);
      return;
    } 

    if (userProfile && !userProfile.phone_number) {
      setSelectedServiceForContact(deal);
      setShowPhoneRequiredModal(true);
      return;
    }

    if (!userProfile) {
      try {
        const userRes = await api.get("/auth/me");
        setUserProfile(userRes.data);
        if (!userRes.data.phone_number) {
           setSelectedServiceForContact(deal);
           setShowPhoneRequiredModal(true);
           return;
        }
      } catch (e) {
        setShowAuthRequiredModal(true);
        return;
      }
    }

    setSelectedServiceForContact(deal);
    setShowContactModal(true);
  };

  const currentEmirateName = emirates.find(e => e.id.toString() === selectedEmirate)?.name || "All Emirates";
  const currentCityName = cities.find(c => c.id.toString() === selectedCity)?.name || "All Areas";

  return (
    <div className="relative min-h-screen bg-[#111111] flex flex-col w-full font-sans">
      <Navbar />

      <main className="flex-grow pt-28 md:pt-32 pb-20 md:pb-24 px-4 sm:px-6 md:px-10 lg:px-12 max-w-[1400px] mx-auto w-full">
        {ads.add1?.is_active && ads.add1?.image_url && (
          <div className="w-full mb-8 block lg:hidden">
            <img src={ads.add1.image_url} alt="Ad" className="w-full max-h-[150px] object-cover rounded-2xl border border-[#333] shadow-lg" />
          </div>
        )}
        {/* Search Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="w-full mx-auto bg-[#1a1a1a] rounded-2xl md:rounded-full border border-[#333] flex flex-col md:flex-row items-center p-2 md:p-1.5 mb-12 md:mb-20 shadow-xl transition-all"
        >
          <div className="flex items-center flex-1 w-full pl-4 md:pl-6 gap-3 py-3 md:py-0 relative" ref={serviceRef}>
            <Search className="w-5 h-5 text-white/50 shrink-0" strokeWidth={2} />
            <input
              type="text"
              placeholder="What service do you need?"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsServiceOpen(true);
                setSelectedGlobalService("");
              }}
              onFocus={() => setIsServiceOpen(true)}
              className="w-full bg-transparent border-0 outline-none text-white placeholder-[#777] text-[14px] md:text-[15px] font-normal focus:ring-0"
            />
            {isServiceOpen && searchQuery && (
              <div className="absolute left-0 right-0 top-full mt-2 sm:mt-6 rounded-2xl bg-[#1c1c1c] border border-[#333] p-2 shadow-2xl z-50 flex flex-col gap-1 max-h-[250px] overflow-y-auto custom-scrollbar">
                {globalServices.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase())).length > 0 ? (
                  globalServices
                    .filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((service) => (
                      <button
                        key={service.id}
                        type="button"
                        onClick={() => {
                          setSearchQuery(service.name);
                          setSelectedGlobalService(service.id.toString());
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

            {/* Area Dropdown */}
            <div className="relative flex items-center justify-between md:justify-start w-full md:w-[170px] gap-3 px-4 md:px-6 py-3.5 md:py-3 text-white border-b md:border-b-0 md:border-r border-[#333] h-full" ref={cityRef}>
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
                    All Areas
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

            {/* Sort Dropdown */}
            <div className="relative flex items-center justify-between md:justify-start w-full md:w-[170px] gap-3 px-4 md:px-6 py-3.5 md:py-3 text-white h-full" ref={sortRef}>
              <button
                type="button"
                onClick={() => {
                  setIsSortOpen(!isSortOpen);
                  setIsEmirateOpen(false);
                  setIsCityOpen(false);
                }}
                className="flex items-center justify-between w-full gap-3 text-left text-sm md:text-[14px] font-medium text-white hover:text-[#d4933a] transition-colors duration-200"
              >
                <div className="flex items-center gap-2 truncate">
                  <Filter className="w-4 h-4 text-white/50 shrink-0" strokeWidth={1.5} />
                  <span className="truncate">{selectedSort === "alpha_asc" ? "A to Z" : selectedSort === "alpha_desc" ? "Z to A" : selectedSort === "oldest" ? "Oldest to Newest" : "Newest to Oldest"}</span>
                </div>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-[#888] shrink-0 transition-transform duration-300 ${isSortOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isSortOpen && (
                <div className="absolute left-0 right-0 md:left-4 md:right-auto top-full mt-2 md:w-[190px] rounded-2xl bg-[#1c1c1c] border border-[#333] p-2 shadow-2xl z-50 flex flex-col gap-1 custom-scrollbar">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedSort("");
                      setIsSortOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm rounded-xl transition-all duration-150 ${selectedSort === "" ? "bg-[#d4933a]/10 text-[#d4933a] font-medium" : "text-[#D4D2CD] hover:text-white hover:bg-white/5"}`}
                  >
                    Newest to Oldest
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedSort("oldest");
                      setIsSortOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm rounded-xl transition-all duration-150 ${selectedSort === "oldest" ? "bg-[#d4933a]/10 text-[#d4933a] font-medium" : "text-[#D4D2CD] hover:text-white hover:bg-white/5"}`}
                  >
                    Oldest to Newest
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedSort("alpha_asc");
                      setIsSortOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm rounded-xl transition-all duration-150 ${selectedSort === "alpha_asc" ? "bg-[#d4933a]/10 text-[#d4933a] font-medium" : "text-[#D4D2CD] hover:text-white hover:bg-white/5"}`}
                  >
                    Alphabetical (A-Z)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedSort("alpha_desc");
                      setIsSortOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm rounded-xl transition-all duration-150 ${selectedSort === "alpha_desc" ? "bg-[#d4933a]/10 text-[#d4933a] font-medium" : "text-[#D4D2CD] hover:text-white hover:bg-white/5"}`}
                  >
                    Alphabetical (Z-A)
                  </button>
                </div>
              )}
            </div>

            <div className="w-full md:w-auto p-1.5 md:p-0 md:ml-2">
              <button type="submit" className="cursor-pointer w-full md:w-auto bg-[#d4933a] hover:bg-[#c28532] text-white px-7 py-3 rounded-xl md:rounded-full flex items-center justify-center gap-2 text-[14px] md:text-[15px] font-medium transition-colors">
                Search
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </form>

        {/* Content Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Deals List */}
          <div className="flex-1 flex flex-col gap-10 md:gap-14">
          {loading ? (
            <div className="flex flex-col gap-10 md:gap-14 animate-pulse">
              {[1, 2, 3].map((n) => (
                <div key={n} className="flex flex-col lg:flex-row gap-5 md:gap-8">
                  {/* Image Placeholder */}
                  <div className="w-full lg:w-[320px] h-[220px] md:h-[250px] bg-[#1f2022] rounded-2xl flex-shrink-0"></div>
                  {/* Content Placeholder */}
                  <div className="flex flex-col flex-1 py-1 space-y-4">
                    {/* Title */}
                    <div className="h-6 bg-[#1f2022] rounded-lg w-3/4"></div>
                    {/* Description */}
                    <div className="space-y-2">
                      <div className="h-4 bg-[#1f2022] rounded-lg w-full"></div>
                      <div className="h-4 bg-[#1f2022] rounded-lg w-5/6"></div>
                    </div>
                    {/* Badges / Meta */}
                    <div className="h-4 bg-[#1f2022] rounded-lg w-1/3 mt-auto"></div>
                    {/* Footer / Buttons */}
                    <div className="h-10 bg-[#1f2022] rounded-xl w-40 mt-4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : deals.length === 0 ? (
            <div className="text-white text-center py-10">No deals found.</div>
          ) : (
            deals.map((deal: any, index: number) => (
              <div key={deal.id} className="flex flex-col">
                <div className="flex flex-col lg:flex-row gap-5 md:gap-8">
                  {/* Image Carousel */}
                  <div className="relative w-full lg:w-[320px] h-[220px] md:h-[250px] rounded-2xl flex-shrink-0 overflow-hidden shadow-lg">
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

          {/* Ad 1 (Top Right) */}
          {ads.add1?.is_active && ads.add1?.image_url && (
            <div className="hidden lg:block w-[300px] shrink-0">
              <div className="sticky top-24">
                {ads.add1.redirect_url ? (
                  <a href={ads.add1.redirect_url} target="_blank" rel="noopener noreferrer" className="block cursor-pointer">
                    <img src={ads.add1.image_url} alt="Advertisement" className="w-full h-[680px] rounded-2xl shadow-lg border border-[#333] object-cover transition-transform hover:scale-[1.01]" />
                  </a>
                ) : (
                  <img src={ads.add1.image_url} alt="Advertisement" className="w-full h-[680px] rounded-2xl shadow-lg border border-[#333] object-cover" />
                )}
              </div>
            </div>
          )}
        </div>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-center items-center mt-12 gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => {
                fetchDeals(currentPage - 1);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-[#222] border border-[#333] text-white hover:bg-[#333] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => {
                  fetchDeals(page);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-medium transition-colors ${
                  currentPage === page
                    ? "bg-[#d4933a] text-white"
                    : "bg-[#222] border border-[#333] text-white hover:bg-[#333]"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() => {
                fetchDeals(currentPage + 1);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-[#222] border border-[#333] text-white hover:bg-[#333] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
        {/* Ad 2 (Bottom Center) */}
        {ads.add2?.is_active && ads.add2?.image_url && (
          <div className="w-full mt-16">
            {ads.add2.redirect_url ? (
              <a href={ads.add2.redirect_url} target="_blank" rel="noopener noreferrer" className="block cursor-pointer">
                <img src={ads.add2.image_url} alt="Advertisement" className="w-full h-auto max-h-[250px] object-cover rounded-2xl shadow-lg border border-[#333] transition-transform hover:scale-[1.01]" />
              </a>
            ) : (
              <img src={ads.add2.image_url} alt="Advertisement" className="w-full h-auto max-h-[250px] object-cover rounded-2xl shadow-lg border border-[#333]" />
            )}
          </div>
        )}
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
                  <span className="text-[15px] font-medium">{selectedServiceForContact.partner?.phone ? `+971 ${selectedServiceForContact.partner.phone.replace(/^\+?971/, '').trim()}` : ''}</span>
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
                href={selectedServiceForContact.partner?.phone ? `tel:+971${selectedServiceForContact.partner.phone.replace(/^\+?971/, '').replace(/\D/g, '')}` : '#'}
                className="flex-1 bg-[#222] hover:bg-[#333] border border-[#333] hover:border-[#d4933a] text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Phone className="w-4 h-4" /> Call Now
              </a>
              <a 
                href={selectedServiceForContact.partner?.phone ? `https://wa.me/971${selectedServiceForContact.partner.phone.replace(/^\+?971/, '').replace(/\D/g, '')}` : '#'}
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

      {/* Phone Required Modal */}
      {showPhoneRequiredModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#151515] border border-[#222] rounded-3xl p-8 max-w-md w-full shadow-2xl animate-fade-in relative text-white">
            <button
              onClick={() => setShowPhoneRequiredModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-16 h-16 rounded-full bg-[#d4933a]/10 border border-[#d4933a]/30 flex items-center justify-center mx-auto mb-6">
              <Phone className="w-8 h-8 text-[#d4933a]" />
            </div>
            <h2 className="text-2xl font-semibold text-white mb-2 text-center tracking-wide">Phone Number Required</h2>
            <p className="text-[#888] text-sm leading-relaxed mb-6 text-center">
              Please provide your phone number to view contact details. This helps service providers reach you if needed.
            </p>
            
            {phoneError && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-xl text-red-500 text-sm text-center">
                {phoneError}
              </div>
            )}

            <form onSubmit={async (e) => {
              e.preventDefault();
              setPhoneError("");
              if (!phoneNumberInput || phoneNumberInput.length < 5) {
                setPhoneError("Please enter a valid phone number");
                return;
              }
              setIsSubmittingPhone(true);
              try {
                const res = await api.put("/auth/me/phone", { phone_number: "+971 " + phoneNumberInput });
                setUserProfile(res.data);
                setShowPhoneRequiredModal(false);
                setShowContactModal(true);
              } catch (err: any) {
                setPhoneError(err.response?.data?.detail || "Failed to save phone number");
              } finally {
                setIsSubmittingPhone(false);
              }
            }}>
              <div className="flex flex-col gap-1 mb-6">
                <label className="text-white text-[13px] font-medium">Phone Number</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#666]" strokeWidth={2} />
                    <span className="text-[#888] text-[14px] font-medium">+971</span>
                  </div>
                  <input
                    type="tel"
                    value={phoneNumberInput}
                    onChange={(e) => setPhoneNumberInput(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="50 123 4567"
                    required
                    className="w-full bg-[#1e1e1e] border border-[#333] focus:border-[#d4933a] focus:bg-[#222] text-white rounded-xl py-3 pl-[84px] pr-4 outline-none text-[14px] placeholder-[#666] transition-all"
                  />
                </div>
              </div>
              
              <button
                type="submit"
                disabled={isSubmittingPhone}
                className="w-full bg-[#d4933a] hover:bg-[#c28532] disabled:opacity-50 text-white py-3.5 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(212,147,58,0.25)] cursor-pointer"
              >
                {isSubmittingPhone ? "Saving..." : "Save & View Contact"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
