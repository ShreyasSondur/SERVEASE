"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { ArrowLeft, User, Phone, MapPin, Briefcase, FileText, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function PartnerDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [partner, setPartner] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPartner = async () => {
      try {
        const res = await api.get(`/admin/partners/${params.id}`);
        setPartner(res.data);
      } catch (err: any) {
        setError(err.response?.data?.detail || "Failed to load partner details.");
      } finally {
        setLoading(false);
      }
    };
    fetchPartner();
  }, [params.id]);

  const verifyPartner = async () => {
    if (confirm("Are you sure you want to verify this partner?")) {
      try {
        await api.patch(`/admin/verify/${partner.id}`);
        setPartner({ ...partner, status: "VERIFIED", is_verified: true });
        router.push("/admin/dashboard?tab=Partners");
      } catch (e) {
        console.error(e);
      }
    }
  };

  const suspendPartner = async () => {
    try {
      await api.patch(`/admin/suspend/${partner.id}`);
      setPartner({ ...partner, status: "SUSPENDED", is_verified: false });
    } catch (e) {
      console.error(e);
    }
  };

  const banPartner = async () => {
    if (confirm("Are you sure you want to ban this partner?")) {
      try {
        await api.patch(`/admin/ban/${partner.id}`);
        setPartner({ ...partner, status: "BANNED", is_verified: false });
      } catch (e) {
        console.error(e);
      }
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-[#0b0a0a] flex items-center justify-center text-white">Loading...</div>;
  }

  if (error || !partner) {
    return (
      <div className="min-h-screen bg-[#0b0a0a] flex flex-col items-center justify-center text-white">
        <p className="text-red-500 mb-4">{error || "Partner not found."}</p>
        <button onClick={() => router.back()} className="text-[#d4933a] hover:underline">Go Back</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0a0a] font-sans text-white">
      <Navbar />
      
      <main className="max-w-[1000px] mx-auto px-4 sm:px-6 pt-32 pb-12">
        <button onClick={() => router.back()} className="cursor-pointer flex items-center gap-2 text-[#888] hover:text-[#d4933a] mb-8 transition-colors text-sm font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>

        <div className="bg-[#111] border border-[#222] rounded-[2rem] overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="bg-[#151515] px-8 py-6 border-b border-[#222] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-serif tracking-wide text-white mb-2">
                {partner.business_name || `${partner.first_name} ${partner.last_name}`}
              </h1>
              <div className="flex items-center gap-3">
                <span className={`text-xs px-2.5 py-1 rounded-md font-semibold tracking-wide uppercase ${
                  partner.status === 'VERIFIED' ? 'bg-green-500/20 text-green-400' : 
                  partner.status === 'BANNED' ? 'bg-red-500/20 text-red-400' : 
                  partner.status === 'SUSPENDED' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-white/10 text-gray-300'
                }`}>
                  {partner.status}
                </span>
                <span className="text-[#666] text-xs">ID: {partner.id}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {partner.status !== "VERIFIED" && partner.status !== "BANNED" && (
                <button onClick={verifyPartner} className="cursor-pointer flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-[0_0_15px_rgba(34,197,94,0.2)]">
                  <CheckCircle2 className="w-4 h-4" /> Approve
                </button>
              )}
              {partner.status === "VERIFIED" && (
                <button onClick={suspendPartner} className="cursor-pointer flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all">
                  <AlertTriangle className="w-4 h-4" /> Suspend
                </button>
              )}
              {partner.status !== "BANNED" && (
                <button onClick={banPartner} className="cursor-pointer flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 hover:border-red-500/50 px-5 py-2.5 rounded-xl text-sm font-bold transition-all">
                  <XCircle className="w-4 h-4" /> Ban
                </button>
              )}
            </div>
          </div>

          {/* Details Content */}
          <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Info Section */}
            <div className="space-y-8">
              <div>
                <h3 className="text-[#d4933a] font-medium text-lg mb-4 flex items-center gap-2">
                  <User className="w-5 h-5" /> Personal Information
                </h3>
                <div className="grid grid-cols-2 gap-6 bg-[#151515] p-5 rounded-2xl border border-[#222]">
                  <div>
                    <p className="text-[#888] text-[10px] uppercase font-bold tracking-widest mb-1">First Name</p>
                    <p className="text-white text-[15px]">{partner.first_name}</p>
                  </div>
                  <div>
                    <p className="text-[#888] text-[10px] uppercase font-bold tracking-widest mb-1">Last Name</p>
                    <p className="text-white text-[15px]">{partner.last_name}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-[#888] text-[10px] uppercase font-bold tracking-widest mb-1">Phone Number</p>
                    <p className="text-white text-[15px] flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-[#555]" /> +971 {partner.phone}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-[#d4933a] font-medium text-lg mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5" /> Location Details
                </h3>
                <div className="grid grid-cols-2 gap-6 bg-[#151515] p-5 rounded-2xl border border-[#222]">
                  <div>
                    <p className="text-[#888] text-[10px] uppercase font-bold tracking-widest mb-1">Emirate</p>
                    <p className="text-white text-[15px]">{partner.emirate}</p>
                  </div>
                  <div>
                    <p className="text-[#888] text-[10px] uppercase font-bold tracking-widest mb-1">City/Area</p>
                    <p className="text-white text-[15px]">{partner.city}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-[#d4933a] font-medium text-lg mb-4 flex items-center gap-2">
                  <Briefcase className="w-5 h-5" /> Business Info
                </h3>
                <div className="grid grid-cols-1 gap-6 bg-[#151515] p-5 rounded-2xl border border-[#222]">
                  <div>
                    <p className="text-[#888] text-[10px] uppercase font-bold tracking-widest mb-1">Business Name</p>
                    <p className="text-white text-[15px]">{partner.business_name || "N/A"}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-[#888] text-[10px] uppercase font-bold tracking-widest mb-1">Services Limit</p>
                      <p className="text-white text-[15px]">{partner.services_limit}</p>
                    </div>
                    <div>
                      <p className="text-[#888] text-[10px] uppercase font-bold tracking-widest mb-1">Deals Limit</p>
                      <p className="text-white text-[15px]">{partner.deals_limit}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Document Section */}
            <div className="space-y-4">
              <h3 className="text-[#d4933a] font-medium text-lg mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" /> Identity Document
              </h3>
              <div className="bg-[#151515] p-6 rounded-2xl border border-[#222] flex flex-col items-center">
                <div className="w-full mb-6">
                  <p className="text-[#888] text-[10px] uppercase font-bold tracking-widest mb-1 text-center">Emirate ID Number</p>
                  <p className="text-white text-lg font-mono text-center tracking-widest bg-[#111] py-3 rounded-xl border border-[#333]">{partner.emirate_id_number}</p>
                </div>
                
                <p className="text-[#888] text-[10px] uppercase font-bold tracking-widest mb-3 self-start">Emirate ID Scan</p>
                <div className="w-full relative rounded-xl overflow-hidden border-2 border-[#333] bg-[#000] group">
                  <img 
                    src={partner.emirates_id_url} 
                    alt="Emirate ID" 
                    className="w-full h-auto object-contain transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                    <a 
                      href={partner.emirates_id_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-[#d4933a] hover:bg-[#c28532] text-white px-6 py-3 rounded-xl font-bold tracking-wide transition-colors shadow-xl"
                    >
                      Open Original Image
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
