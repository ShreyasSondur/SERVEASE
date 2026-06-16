"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ImagePlus, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

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
  const [error, setError] = useState("");

  const [emirates, setEmirates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);

  React.useEffect(() => {
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
  }, []);

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
    setError("");

    try {
      const uploadData = new FormData();
      uploadData.append("file", file);
      uploadData.append("upload_preset", uploadPreset);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: uploadData,
      });

      const data = await res.json();
      if (data.secure_url) {
        setFormData({ ...formData, emirates_id_url: data.secure_url });
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
  return (
    <div className="relative min-h-screen bg-[#0b0a0a] flex flex-col w-full font-sans">
      <Navbar />

      <main className="mt-10  mb-12 flex-grow flex flex-col items-center justify-center pt-24 pb-12 px-4 sm:px-6 relative z-10">
        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-2xl sm:text-3xl md:text-[32px] font-serif text-white tracking-wide font-normal mb-1">
              ENTER YOUR DETAILS
            </h1>
            <p className="text-[#888] text-sm">Join our network of elite service professionals.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 w-full max-w-xl mx-auto">
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
                <select 
                  required
                  value={formData.emirate}
                  onChange={(e) => setFormData({ ...formData, emirate: e.target.value, city: "" })}
                  className="w-full bg-[#1c1c1c] border border-[#2a2a2a] focus:border-[#d4933a] focus:bg-[#222] text-white rounded-xl py-3 px-4 outline-none text-[13px] transition-colors appearance-none cursor-pointer"
                >
                  <option value="" disabled className="text-[#666]">Select Emirate</option>
                  {emirates.map((e) => (
                    <option key={e.id} value={e.name}>{e.name}</option>
                  ))}
                </select>
              </div>

              {/* City */}
              <div className="flex flex-col gap-1 flex-1">
                <label className="text-[#888] text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase pl-1">
                  City
                </label>
                <select 
                  required
                  disabled={!formData.emirate}
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full bg-[#1c1c1c] border border-[#2a2a2a] focus:border-[#d4933a] focus:bg-[#222] text-white rounded-xl py-3 px-4 outline-none text-[13px] transition-colors appearance-none cursor-pointer disabled:opacity-50"
                >
                  <option value="" disabled className="text-[#666]">Select City</option>
                  {cities
                    .filter(c => {
                      const em = emirates.find(e => e.name === formData.emirate);
                      return em && c.emirate_id === em.id;
                    })
                    .map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
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
                Upload Emirate ID
              </label>
              <div className="relative w-full border-2 border-dashed border-[#333] hover:border-[#d4933a] bg-[#1a1a1a] rounded-xl py-6 sm:py-8 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors group overflow-hidden">
                {formData.emirates_id_url ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-[#1a1a1a]">
                    <img src={formData.emirates_id_url} alt="Emirate ID" className="h-full w-auto object-contain max-h-32" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-sm font-medium">Click to change</span>
                    </div>
                  </div>
                ) : uploadingImage ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="w-6 h-6 text-[#d4933a] animate-spin" />
                    <span className="text-[#d4933a] text-[10px] tracking-wider font-semibold uppercase">Uploading...</span>
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
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              disabled={isSubmitting || uploadingImage}
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