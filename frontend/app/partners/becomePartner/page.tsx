"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ImagePlus, Loader2, CheckCircle2, ChevronDown, MapPin, Target } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import axios from "axios";
import { compressImage } from "@/lib/imageCompressor";

export default function BecomePartner() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    emirate: "",
    city: "",
    emirate_id_number: "",
    emirates_id_url: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [hasConsent, setHasConsent] = useState(false);
  const [error, setError] = useState("");
  const [checkingAuth, setCheckingAuth] = useState(true);

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

  const [emirates, setEmirates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);

  useEffect(() => {
    const checkRole = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setCheckingAuth(false);
          return;
        }
        const res = await api.get("/auth/me");
        const role = res.data.role;
        if (role === "PARTNER" || role === "ADMIN") {
          router.push("/partners/dashboard");
          return;
        }
      } catch (err) {
        console.error("Failed to check auth status on mount", err);
      }
      setCheckingAuth(false);
    };
    checkRole();

    const fetchLocations = async () => {
      try {
        const [emRes, cityRes] = await Promise.all([
          api.get("/catalog/emirates"),
          api.get("/catalog/cities")
        ]);
        setEmirates(emRes.data);
        setCities(cityRes.data);
      } catch (err) {
        console.error("Failed to fetch locations:", err);
      }
    };
    fetchLocations();
  }, [router]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      setError("Cloudinary configuration missing in environment variables.");
      return;
    }

    setUploadingImage(true);
    setUploadProgress(0);
    setError("");

    try {
      let fileToUpload = file;
      try {
        fileToUpload = await compressImage(file);
      } catch (compressErr) {
        console.warn("Client-side compression failed, uploading original file", compressErr);
      }

      const uploadData = new FormData();
      uploadData.append("file", fileToUpload);
      uploadData.append("upload_preset", uploadPreset);

      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        uploadData,
        {
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setUploadProgress(percentCompleted);
            }
          },
        }
      );

      if (res.data.secure_url) {
        setFormData({ ...formData, emirates_id_url: res.data.secure_url });
      } else {
        setError("Failed to upload image.");
      }
    } catch (err) {
      console.error("Cloudinary upload failed", err);
      setError("Failed to upload image.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.emirate) {
      setError("Please select your Emirate.");
      return;
    }
    if (!formData.city) {
      setError("Please select your City.");
      return;
    }
    if (!formData.emirates_id_url) {
      setError("Please upload your Emirate ID image.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await api.post("/partner/apply", formData);
      router.push("/verification");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to submit application. Please try again.");
      setIsSubmitting(false);
    }
  };
  if (checkingAuth) {
    return (
      <div className="relative min-h-screen bg-[#0b0a0a] flex flex-col w-full font-sans">
        <Navbar />
        <main className="mt-10 mb-12 flex-grow flex flex-col items-center justify-center pt-24 pb-12 px-4 sm:px-6 relative z-10">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-10 h-10 text-[#d4933a] animate-spin" />
            <span className="text-gray-400 text-sm font-light">Checking authorization...</span>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#0b0a0a] flex flex-col w-full font-sans">
      <Navbar />

      <main className="mt-10 mb-12 flex-grow flex flex-col items-center justify-center pt-24 pb-12 px-3 sm:px-6 relative z-10">
        <div className="w-full max-w-xl bg-[#131313]/90 border border-[#222] rounded-3xl sm:rounded-[2.5rem] p-5 sm:p-10 shadow-2xl relative">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-[26px] font-serif text-white tracking-wide font-normal mb-2">
              ENTER YOUR DETAILS
            </h1>
            <p className="text-[#888] text-xs sm:text-sm">Join our network of elite service professionals.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-xl text-sm text-center">
                {error}
              </div>
            )}
            
            {/* Name Row */}
            <div className="flex flex-col sm:flex-row gap-3.5 sm:gap-4">
              <div className="flex flex-col gap-1 flex-1">
                <label className="text-[#888] text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase pl-1">
                  First Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
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
                  required
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
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
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
                <div className="relative w-full" ref={emirateRef}>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEmirateOpen(!isEmirateOpen);
                      setIsCityOpen(false);
                    }}
                    className="w-full bg-[#1c1c1c] border border-[#2a2a2a] focus:border-[#d4933a] text-white rounded-xl py-3 px-4 outline-none text-[13px] transition-colors flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-2 text-left truncate">
                      <MapPin className="w-4 h-4 text-white/50 shrink-0" strokeWidth={1.5} />
                      <span className={formData.emirate ? "text-white" : "text-[#777]"}>
                        {formData.emirate || "Select Emirate"}
                      </span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-[#888] shrink-0 transition-transform duration-300 ${isEmirateOpen ? "rotate-180" : ""}`} />
                  </button>

                  {isEmirateOpen && (
                    <div className="absolute left-0 right-0 top-full mt-2 max-h-[250px] overflow-y-auto rounded-2xl bg-[#1a1a1a] border border-[#333] p-2 shadow-2xl z-50 flex flex-col gap-1 custom-scrollbar">
                      {emirates.length === 0 ? (
                        <div className="text-[#666] text-xs py-2 text-center">Loading Emirates...</div>
                      ) : (
                        emirates.map((e) => (
                          <button
                            key={e.id}
                            type="button"
                            onClick={() => {
                              setFormData({ ...formData, emirate: e.name, city: "" });
                              setIsEmirateOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2.5 text-[13px] rounded-xl transition-all duration-150 ${formData.emirate === e.name
                              ? "bg-[#d4933a]/10 text-[#d4933a] font-semibold"
                              : "text-[#D4D2CD] hover:text-white hover:bg-white/5"
                              }`}
                          >
                            {e.name}
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* City */}
              <div className="flex flex-col gap-1 flex-1">
                <label className="text-[#888] text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase pl-1">
                  City
                </label>
                <div className="relative w-full" ref={cityRef}>
                  <button
                    type="button"
                    disabled={!formData.emirate}
                    onClick={() => {
                      setIsCityOpen(!isCityOpen);
                      setIsEmirateOpen(false);
                    }}
                    className="w-full bg-[#1c1c1c] border border-[#2a2a2a] focus:border-[#d4933a] text-white rounded-xl py-3 px-4 outline-none text-[13px] transition-colors flex items-center justify-between cursor-pointer disabled:opacity-50"
                  >
                    <div className="flex items-center gap-2 text-left truncate">
                      <Target className="w-4 h-4 text-white/50 shrink-0" strokeWidth={1.5} />
                      <span className={formData.city ? "text-white" : "text-[#777]"}>
                        {formData.city || "Select City"}
                      </span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-[#888] shrink-0 transition-transform duration-300 ${isCityOpen ? "rotate-180" : ""}`} />
                  </button>

                  {isCityOpen && formData.emirate && (
                    <div className="absolute left-0 right-0 top-full mt-2 max-h-[250px] overflow-y-auto rounded-2xl bg-[#1a1a1a] border border-[#333] p-2 shadow-2xl z-50 flex flex-col gap-1 custom-scrollbar">
                      {cities
                        .filter(c => {
                          const em = emirates.find(e => e.name === formData.emirate);
                          return em && c.emirate_id === em.id;
                        }).length === 0 ? (
                          <div className="text-[#666] text-xs py-2 text-center">No cities found</div>
                        ) : (
                          cities
                            .filter(c => {
                              const em = emirates.find(e => e.name === formData.emirate);
                              return em && c.emirate_id === em.id;
                            })
                            .map((c) => (
                              <button
                                key={c.id}
                                type="button"
                                onClick={() => {
                                  setFormData({ ...formData, city: c.name });
                                  setIsCityOpen(false);
                                }}
                                className={`w-full text-left px-4 py-2.5 text-[13px] rounded-xl transition-all duration-150 ${formData.city === c.name
                                  ? "bg-[#d4933a]/10 text-[#d4933a] font-semibold"
                                  : "text-[#D4D2CD] hover:text-white hover:bg-white/5"
                                  }`}
                              >
                                {c.name}
                              </button>
                            ))
                        )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Emirate ID Number */}
            <div className="flex flex-col gap-1">
              <label className="text-[#888] text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase pl-1">
                Emirate ID Number
              </label>
              <input
                type="text"
                required
                value={formData.emirate_id_number}
                onChange={(e) => setFormData({ ...formData, emirate_id_number: e.target.value })}
                placeholder="784-1234-5678901-2"
                className="w-full bg-[#1c1c1c] border border-[#2a2a2a] focus:border-[#d4933a] focus:bg-[#222] text-white rounded-xl py-3 px-4 outline-none text-[13px] transition-colors"
              />
            </div>

            {/* Upload Emirate ID */}
            <div className="flex flex-col gap-1 mt-1">
              <label className="text-[#888] text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase pl-1">
                Emirate ID
              </label>
              {formData.emirates_id_url ? (
                <div className="w-full bg-[#16221f] border border-emerald-500/20 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-300">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-emerald-400 text-sm font-semibold tracking-wide">Emirate ID Uploaded</p>
                      <p className="text-[#888] text-[11px]">Your document is ready for submission.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto justify-end sm:justify-start">
                    <a 
                      href={formData.emirates_id_url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="group relative cursor-pointer block"
                    >
                      <Image 
                        src={formData.emirates_id_url} 
                        alt="Emirate ID Thumbnail" 
                        width={56}
                        height={40}
                        className="object-cover rounded-lg border border-[#333] group-hover:border-[#d4933a] transition-all" 
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </div>
                    </a>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, emirates_id_url: "" })}
                      className="text-red-400 hover:text-red-300 text-xs font-semibold px-2.5 py-1.5 rounded-lg hover:bg-red-500/10 transition-all cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <div className="relative w-full border-2 border-dashed border-[#333] hover:border-[#d4933a] bg-[#1a1a1a] rounded-xl py-6 sm:py-8 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors group overflow-hidden">
                  {uploadingImage ? (
                    <div className="flex flex-col items-center gap-3 w-full max-w-[200px] px-4">
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-5 h-5 text-[#d4933a] animate-spin" />
                        <span className="text-[#d4933a] text-[10px] tracking-wider font-semibold uppercase">
                          Uploading {uploadProgress}%
                        </span>
                      </div>
                      {/* Progress Bar */}
                      <div className="w-full h-1.5 bg-[#2a2a2a] rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#d4933a] rounded-full transition-all duration-300 ease-out"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <ImagePlus className="w-6 h-6 text-[#666] group-hover:text-[#d4933a] transition-colors" strokeWidth={1.5} />
                      <span className="text-[#666] text-[10px] tracking-wider font-semibold uppercase group-hover:text-[#d4933a] transition-colors mt-1">
                        Upload in PNG/JPEG Format
                      </span>
                    </>
                  )}
                  <input 
                    type="file" 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                    accept="image/png, image/jpeg" 
                    onChange={handleImageUpload}
                    disabled={uploadingImage || isSubmitting}
                  />
                </div>
              )}
            </div>

            {/* Consent Checkbox */}
            <div className="flex flex-col gap-2 mt-4">
              <div 
                className="flex items-start gap-3 group cursor-pointer"
                onClick={() => setHasConsent(!hasConsent)}
              >
                <div
                  className={`w-5 h-5 mt-0.5 rounded border flex items-center justify-center transition-colors shrink-0 ${hasConsent
                    ? "bg-[#d4933a] border-[#d4933a]"
                    : "bg-transparent border-[#555] group-hover:border-[#d4933a]"
                    }`}
                >
                  {hasConsent && (
                    <svg viewBox="0 0 14 14" fill="none" className="w-3.5 h-3.5 text-white">
                      <path
                        d="M11.6666 3.5L5.24992 9.91667L2.33325 7"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
                <span className="text-[#a3a3a3] text-[12px] leading-relaxed group-hover:text-[#c2c2c2] transition-colors select-none">
                  I consent to the collection and processing of my personal details for verification purposes. I confirm that all the information provided is accurate.
                </span>
              </div>
              
              <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-3 mt-2 flex items-start gap-2">
                <svg className="w-4 h-4 text-[#C58434] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="text-[#666] text-[11px] leading-snug">
                  <strong>Secure & Encrypted.</strong> We take your privacy seriously. Your details are securely encrypted and will only be used for our internal partnership verification. We will never share your personal information with third parties.
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              disabled={isSubmitting || uploadingImage || !hasConsent}
              className="cursor-pointer w-full bg-[#d4933a] hover:bg-[#c28532] disabled:opacity-50 text-white font-bold tracking-wider uppercase py-3.5 rounded-xl transition-colors text-[13px] sm:text-[14px] mt-2 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Application"
              )}
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