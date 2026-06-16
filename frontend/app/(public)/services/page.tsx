"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Search, MapPin, ChevronDown, ArrowRight,
  ChevronLeft, ChevronRight, BadgeCheck,
  Calendar, Target, Star
} from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";

export default function Services() {
  const [searchQuery, setSearchQuery] = useState(""); // Can still be used for text search if needed, or as selected category id
  const [services, setServices] = useState<any[]>([]);
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
          api.get("/catalog/services") // This represents global services/categories
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

  const fetchServices = async () => {
    setLoading(true);
    try {
      let url = "/search?";
      if (selectedEmirate) url += `emirate_id=${selectedEmirate}&`;
      if (selectedCity) url += `city_id=${selectedCity}&`;
      if (selectedGlobalService) url += `category_id=${selectedGlobalService}&`;
      if (searchQuery) url += `q=${encodeURIComponent(searchQuery)}&`;

      const response = await api.get(url);
      setServices(response.data);
    } catch (error) {
      console.error("Failed to fetch services:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleSearch = () => {
    fetchServices();
  };

  return (
    <div className="relative min-h-screen bg-[#111111] flex flex-col w-full font-sans">
      <Navbar />

      <main className="flex-grow pt-28 md:pt-32 pb-20 md:pb-24 px-4 sm:px-6 md:px-10 lg:px-12 max-w-[1200px] mx-auto w-full">
        {/* Search Bar */}
        <div className="w-full mx-auto bg-[#1a1a1a] rounded-2xl md:rounded-full border border-[#333] flex flex-col md:flex-row items-center p-2 md:p-1.5 mb-12 md:mb-20 shadow-xl transition-all">
          <div className="flex items-center flex-1 w-full pl-4 md:pl-6 gap-3 py-3 md:py-0">
            <Search className="w-5 h-5 text-white/50 shrink-0" strokeWidth={2} />
            {/* Global Services Dropdown (Searchable via native select or text input with datalist) */}
            <input
              type="text"
              list="global-services-list"
              placeholder="What service do you need?"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                // Also try to find a matching global service to set ID
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
            <div className="relative flex items-center justify-between md:justify-start w-full md:w-auto gap-3 px-4 md:px-6 py-3.5 md:py-3 text-white border-b md:border-b-0 md:border-r border-[#333] h-full">
              <MapPin className="w-4 h-4 text-white/50" strokeWidth={1.5} />
              <select 
                value={selectedEmirate}
                onChange={(e) => {
                  setSelectedEmirate(e.target.value);
                  setSelectedCity(""); // reset city when emirate changes
                }}
                className="bg-transparent text-[13px] md:text-[14px] font-medium outline-none appearance-none cursor-pointer w-full md:w-[120px]"
              >
                <option value="" className="text-black">All Emirates</option>
                {emirates.map((e) => (
                  <option key={e.id} value={e.id} className="text-black">{e.name}</option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 ml-2 md:ml-1 text-white/40 pointer-events-none absolute right-4 md:right-4" />
            </div>

            {/* City Dropdown */}
            <div className="relative flex items-center justify-between md:justify-start w-full md:w-auto gap-3 px-4 md:px-6 py-3.5 md:py-3 text-white h-full">
              <Target className="w-4 h-4 text-white/50" strokeWidth={1.5} />
              <select 
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="bg-transparent text-[13px] md:text-[14px] font-medium outline-none appearance-none cursor-pointer w-full md:w-[120px]"
                disabled={!selectedEmirate}
              >
                <option value="" className="text-black">All Cities</option>
                {cities
                  .filter(c => !selectedEmirate || c.emirate_id.toString() === selectedEmirate)
                  .map((c) => (
                  <option key={c.id} value={c.id} className="text-black">{c.name}</option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 ml-2 md:ml-1 text-white/40 pointer-events-none absolute right-4 md:right-4" />
            </div>

            <div className="w-full md:w-auto p-1.5 md:p-0 md:ml-2">
              <button onClick={handleSearch} className="cursor-pointer w-full md:w-auto bg-[#d4933a] hover:bg-[#c28532] text-white px-7 py-3 rounded-xl md:rounded-full flex items-center justify-center gap-2 text-[14px] md:text-[15px] font-medium transition-colors">
                Search
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Services List */}
        <div className="flex flex-col gap-10 md:gap-14">
          {loading ? (
            <div className="text-white text-center py-10">Loading services...</div>
          ) : services.length === 0 ? (
            <div className="text-white text-center py-10">No services found.</div>
          ) : (
            services.map((service: any, index: number) => (
              <div key={service.id} className="flex flex-col">
                <div className="flex flex-col lg:flex-row gap-5 md:gap-8">
                  {/* Image Placeholder */}
                  <div className="relative w-full lg:w-[320px] h-[200px] md:h-[220px] bg-[#a3a3a3] rounded-2xl flex-shrink-0 overflow-hidden shadow-lg">
                    {service.image_url ? (
                       <img src={service.image_url} alt={service.title} className="w-full h-full object-cover" />
                    ) : (
                       <div className="w-full h-full flex items-center justify-center text-black/50">No Image</div>
                    )}
                    {service.isFeatured && (
                      <div className="absolute top-3 left-3 md:top-4 md:left-4 bg-white/90 backdrop-blur-sm text-[#c28532] text-[9px] md:text-[10px] font-bold px-2 py-1 rounded-[4px] flex items-center gap-1 uppercase tracking-wider">
                        <Star className="w-3 h-3 fill-[#c28532]" /> FEATURED
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
                      {service.title}
                    </h2>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-x-2 md:gap-x-3 gap-y-1.5 md:gap-y-2 mb-4 md:mb-6">
                      <span className="text-[#A3A3A3] text-[11px] md:text-[12px] font-light">
                        {service.description}
                      </span>
                    </div>

                    {/* Verified Badge */}
                    <div className="flex items-center gap-1.5 mb-auto pb-3 md:pb-4">
                      <BadgeCheck className="w-3.5 h-3.5 md:w-4 md:h-4 text-black fill-[#2196F3]" strokeWidth={1} />
                      <span className="text-[#2196F3] text-[10px] md:text-[11px] font-bold uppercase tracking-wider">
                        VERIFIED PARTNER
                      </span>
                    </div>

                    {/* Footer info */}
                    <div className="flex items-center gap-4 md:gap-6 mt-3 md:mt-4 pt-3 md:pt-4">
                      <div className="flex items-center gap-1.5 md:gap-2 text-white/80">
                        <MapPin className="w-3.5 h-3.5 md:w-[14px] md:h-[14px] text-white/50" strokeWidth={2} />
                        <span className="text-[12px] md:text-[13px] font-medium tracking-wide truncate max-w-[120px] sm:max-w-none">{service.city?.name || "Dubai"}</span>
                      </div>
                      <div className="flex items-center gap-1.5 md:gap-2 text-white/80">
                        <Calendar className="w-3.5 h-3.5 md:w-[14px] md:h-[14px] text-white/50" strokeWidth={2} />
                        <span className="text-[12px] md:text-[13px] font-medium tracking-wide">{new Date(service.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 lg:flex lg:flex-col lg:justify-center gap-3 md:gap-4 w-full lg:w-[180px] shrink-0 mt-4 md:mt-6 lg:mt-0">
                    <Link href={`/services/${service.id}`}>
                      <button className="w-full bg-white hover:bg-gray-100 text-black py-2.5 md:py-3 rounded-full font-bold text-[13px] md:text-[14px] transition-colors shadow-md cursor-pointer">
                        View More
                      </button></Link>
                    <button className="w-full bg-[#d4933a] hover:bg-[#c28532] text-white py-2.5 md:py-3 rounded-full font-bold text-[13px] md:text-[14px] transition-colors shadow-lg cursor-pointer">
                      Contact Now
                    </button>
                  </div>
                </div>

                {/* Divider */}
                {index < services.length - 1 && (
                  <div className="w-full h-px bg-white/10 mt-8 md:mt-14" />
                )}
              </div>
            ))
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}