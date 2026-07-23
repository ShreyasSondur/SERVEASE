"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { User, BadgeCheck, MapPin, X, Phone, MessageCircle, Calendar, Tag, ArrowLeft } from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";
import ImageCarousel from "@/components/ImageCarousel";

export default function DealDetail() {
  const params = useParams();
  const router = useRouter();
  const [deal, setDeal] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showContactModal, setShowContactModal] = useState(false);
  const [showAuthRequiredModal, setShowAuthRequiredModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checkedAuth, setCheckedAuth] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [showPhoneRequiredModal, setShowPhoneRequiredModal] = useState(false);
  const [phoneNumberInput, setPhoneNumberInput] = useState("");
  const [isSubmittingPhone, setIsSubmittingPhone] = useState(false);
  const [phoneError, setPhoneError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    setCheckedAuth(true);

    const fetchDeal = async () => {
      try {
        const res = await api.get(`/deals/${params.id}`);
        setDeal(res.data);
      } catch (err: any) {
        setError(err.response?.data?.detail || "Failed to load deal details.");
      } finally {
        setLoading(false);
      }
    };
    if (params.id) {
      fetchDeal();
    }
  }, [params.id]);

  const handleContactClick = async () => {
    if (!localStorage.getItem("token")) {
      setShowAuthRequiredModal(true);
      return;
    } 

    if (userProfile && !userProfile.phone_number) {
      setShowPhoneRequiredModal(true);
      return;
    }

    if (!userProfile) {
      try {
        const userRes = await api.get("/auth/me");
        setUserProfile(userRes.data);
        if (!userRes.data.phone_number) {
           setShowPhoneRequiredModal(true);
           return;
        }
      } catch (e) {
        setShowAuthRequiredModal(true);
        return;
      }
    }

    setShowContactModal(true);
  };

  if (loading) {
    return (
      <div className="relative min-h-screen bg-[#0b0a0a] flex flex-col w-full font-sans text-white">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <p className="text-gray-400">Loading deal details...</p>
        </div>
        <Footer />
      </div>
    );
  }


  if (error || !deal) {
    return (
      <div className="relative min-h-screen bg-[#0b0a0a] flex flex-col w-full font-sans text-white">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center gap-4">
          <p className="text-red-500">{error || "Deal not found."}</p>
          <button onClick={() => router.back()} className="text-[#d4933a] hover:underline">
            Go Back
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const service = deal;
  const partnerName = service.partner?.business_name || `${service.partner?.first_name} ${service.partner?.last_name}`;

  return (
    <div className="relative min-h-screen bg-[#0b0a0a] flex flex-col w-full font-sans text-white">
      <Navbar />

      <main className="flex-grow w-full max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8 py-10 pt-28">
        {/* Back Navigation */}
        <div className="mb-6 animate-fade-in">
          <Link 
            href="/deals" 
            className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm font-semibold tracking-wide cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to Deals
          </Link>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl md:text-[32px] font-medium mb-6 sm:mb-8 text-white tracking-wide animate-fade-in">
          {service.title}
        </h1>
        
        {/* Top Grid: Image & Info Cards */}
        <div className="flex flex-col lg:flex-row gap-5 sm:gap-6 mb-6 sm:mb-8 animate-slide-up">
          
          {/* Left: Image Card */}
          <div className="w-full lg:w-[65%] rounded-2xl min-h-[250px] sm:min-h-[350px] lg:min-h-[400px] shadow-lg overflow-hidden relative">
            <ImageCarousel
              images={service.images}
              imageUrl={service.image_url}
              title={service.title}
              featuredBadge={
                <div className="bg-[#22c55e]/90 backdrop-blur-sm text-white text-[11px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-md">
                  <Tag className="w-3.5 h-3.5" /> EXCLUSIVE DEAL
                </div>
              }
            />
          </div>

          {/* Right: Info Cards */}
          <div className="w-full lg:w-[35%] flex flex-col gap-4 sm:gap-5">
            
            {/* Discount / Exclusive Card */}
            <div className="bg-[#151515] border border-green-500/30 rounded-2xl p-5 sm:p-6 shadow-md transition-colors hover:border-green-500/50 bg-green-500/[0.02]">
              <h3 className="text-green-400 text-[11px] font-bold uppercase tracking-widest mb-3 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5" /> Special Offer
              </h3>
              <p className="text-2xl font-bold text-white mb-2 leading-tight">
                {deal.discount_desc}
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-400 font-medium mb-5">
                <Calendar className="w-3.5 h-3.5" />
                <span>Expires: {new Date(deal.expiry_date).toLocaleDateString()}</span>
              </div>
              <button 
                onClick={handleContactClick}
                className="w-full bg-[#d4933a] hover:bg-[#c28532] text-white font-bold tracking-wide py-3.5 rounded-xl text-sm transition-all shadow-[0_0_15px_rgba(212,147,58,0.2)] hover:shadow-[0_0_25px_rgba(212,147,58,0.4)] cursor-pointer"
              >
                Contact Now
              </button>
            </div>

            {/* Posted By Card */}
            <div className="bg-[#151515] border border-[#222] rounded-2xl p-5 sm:p-6 shadow-md transition-colors hover:border-[#333]">
              <h3 className="text-[#aaa] text-[11px] font-bold uppercase tracking-widest mb-4">
                Posted By
              </h3>
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-full border border-[#d4933a]/50 bg-[#d4933a]/10 flex items-center justify-center shrink-0">
                  <User className="w-5 h-5 text-[#d4933a]" strokeWidth={1.5} />
                </div>
                <div>
                  <h4 className="font-medium text-[15px] sm:text-[16px] text-white tracking-wide">
                    {partnerName}
                  </h4>
                  {service.partner?.is_verified && (
                    <div className="flex items-center gap-1.5 mt-1">
                      <BadgeCheck className="w-3.5 h-3.5 text-[#3b82f6]" strokeWidth={2.5} />
                      <span className="text-[#3b82f6] text-[10px] font-bold uppercase tracking-wider">
                        Verified Partner
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Details Card */}
            <div className="bg-[#151515] border border-[#222] rounded-2xl p-5 sm:p-6 shadow-md transition-colors hover:border-[#333]">
              <h3 className="text-[#d4933a] text-[13px] font-semibold mb-4 tracking-wide">
                Details
              </h3>
              <div className="flex flex-col gap-3.5">
                <div className="flex justify-between items-center text-[13px] sm:text-sm">
                  <span className="text-[#888]">Service Category</span>
                  <span className="text-white font-medium text-right">{service.category?.name || "Global Service"}</span>
                </div>

                <div className="flex justify-between items-center text-[13px] sm:text-sm">
                  <span className="text-[#888]">Location</span>
                  <span className="text-white font-medium text-right flex items-center gap-1 justify-end">
                    <MapPin className="w-3.5 h-3.5 text-[#888]" />
                    {service.city?.name || "Dubai"}, UAE
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Description Section */}
        <div className="bg-[#151515] border border-[#222] rounded-2xl p-5 sm:p-6 md:p-8 mb-12 shadow-md animate-slide-up" style={{ animationDelay: "150ms" }}>
          <h3 className="text-[#d4933a] text-lg font-medium mb-4 tracking-wide">
            Description
          </h3>
          <div className="text-[#d4d2cd] text-sm sm:text-[15px] leading-relaxed font-light whitespace-pre-wrap">
            {service.description}
          </div>
        </div>
        
      </main>
      
      <Footer />

      {/* Auth required modal */}
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
              <Link href={`/login?redirect=/deals/${deal.id}`}>
                <button className="w-full bg-[#d4933a] hover:bg-[#c28532] text-white py-3.5 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(212,147,58,0.25)] cursor-pointer">
                  Log In
                </button>
              </Link>
              <Link href={`/signup?redirect=/deals/${deal.id}`}>
                <button className="w-full bg-[#222] border border-[#333] hover:border-[#444] text-[#aaa] hover:text-white py-3.5 rounded-xl font-bold transition-all cursor-pointer">
                  Register for Free
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Contact Details Popup Modal */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#151515] border border-[#222] rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl animate-fade-in relative text-white">
            <button 
              onClick={() => setShowContactModal(false)} 
              className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h3 className="text-xl font-bold tracking-wide text-white mb-2">
              Contact Provider
            </h3>
            <p className="text-[#d4933a] text-[15px] font-semibold mb-1 font-serif">
              {partnerName}
            </p>
            <p className="text-xs text-green-400 font-medium mb-6">
              Deal: {deal.discount_desc}
            </p>
            
            <div className="flex flex-col gap-4 mb-8">
              <div className="flex items-center gap-3 bg-[#111] p-4 rounded-xl border border-[#222]">
                <Phone className="w-5 h-5 text-white/50" />
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-wider text-gray-500">Phone Number</span>
                  <span className="text-[15px] font-medium">{service.partner?.phone ? `+971 ${service.partner.phone.replace(/^\+?971/, '').trim()}` : ''}</span>
                </div>
              </div>
              
              {service.partner?.email && (
                <div className="flex items-center gap-3 bg-[#111] p-4 rounded-xl border border-[#222]">
                  <span className="text-[15px] text-white/50 font-bold shrink-0">@</span>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-wider text-gray-500">Email Address</span>
                    <span className="text-[15px] font-medium">{service.partner?.email}</span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <a 
                href={service.partner?.phone ? `tel:+971${service.partner.phone.replace(/^\+?971/, '').replace(/\D/g, '')}` : '#'}
                className="flex-1 bg-[#222] hover:bg-[#333] border border-[#333] hover:border-[#d4933a] text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Phone className="w-4 h-4" /> Call Now
              </a>
              <a 
                href={service.partner?.phone ? `https://wa.me/971${service.partner.phone.replace(/^\+?971/, '').replace(/\D/g, '')}?text=${encodeURIComponent(`Hi, I'd like to inquire about your deal: ${deal.discount_desc} for ${service.title}`)}` : '#'}
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
