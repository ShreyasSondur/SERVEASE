"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CheckCircle2, AlertTriangle, XCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";

export default function VerificationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await api.get("/auth/me");
        const role = res.data.role;

        // If they are an Admin, they don't have a partner profile but can access the dashboard.
        if (role === "ADMIN") {
          router.push("/partners/dashboard");
          return;
        }

        try {
          const profRes = await api.get("/partner/profile");
          const partnerStatus = profRes.data.status;
          setStatus(partnerStatus);
          
          if (partnerStatus === "VERIFIED") {
            router.push("/partners/dashboard");
            return;
          }
        } catch (profileErr) {
          if (role === "USER") {
            router.push("/partners/becomePartner");
            return;
          }
        }
        setLoading(false);
      } catch (err) {
        router.push("/login");
      }
    };
    checkStatus();
  }, [router]);

  if (loading) {
    return (
      <div className="relative min-h-screen bg-[#0b0a0a] flex flex-col w-full font-sans">
        <Navbar />
        <main className="mt-10 mb-12 flex-grow flex flex-col items-center justify-center pt-24 pb-12 px-4 sm:px-6 relative z-10">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-10 h-10 text-[#d4933a] animate-spin" />
            <span className="text-gray-400 text-sm font-light">Loading verification status...</span>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const renderContent = () => {
    switch (status) {
      case "SUSPENDED":
        return (
          <div className="w-full max-w-md bg-[#111111] border border-[#222] rounded-[2rem] p-8 sm:p-12 text-center shadow-xl flex flex-col items-center">
            <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center mb-6 border border-amber-500/20 shadow-[0_0_30px_rgba(245,158,11,0.15)]">
              <AlertTriangle className="w-10 h-10 text-amber-500" strokeWidth={1.5} />
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-serif text-white tracking-wide font-medium mb-4">
              Account Suspended
            </h1>
            
            <p className="text-[#888] text-sm sm:text-base leading-relaxed mb-8 font-light">
              Your partner account has been <span className="text-amber-500 font-medium">SUSPENDED</span>. This may be temporary. Please check your email or contact support to resolve this suspension.
            </p>

            <Link 
              href="/"
              className="w-full bg-[#222] hover:bg-[#333] border border-[#333] hover:border-[#444] text-white font-medium tracking-wide py-3.5 rounded-xl transition-all text-sm"
            >
              Return to Home
            </Link>
          </div>
        );

      case "BANNED":
        return (
          <div className="w-full max-w-md bg-[#111111] border border-[#222] rounded-[2rem] p-8 sm:p-12 text-center shadow-xl flex flex-col items-center">
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6 border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.15)]">
              <XCircle className="w-10 h-10 text-red-500" strokeWidth={1.5} />
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-serif text-white tracking-wide font-medium mb-4">
              Account Banned
            </h1>
            
            <p className="text-[#888] text-sm sm:text-base leading-relaxed mb-8 font-light">
              Your partner profile has been <span className="text-red-500 font-medium">BANNED</span> due to violations of our terms of service. You no longer have access to the partner dashboard.
            </p>

            <Link 
              href="/"
              className="w-full bg-[#222] hover:bg-[#333] border border-[#333] hover:border-[#444] text-white font-medium tracking-wide py-3.5 rounded-xl transition-all text-sm"
            >
              Return to Home
            </Link>
          </div>
        );

      case "PENDING":
      default:
        return (
          <div className="w-full max-w-md bg-[#111111] border border-[#222] rounded-[2rem] p-8 sm:p-12 text-center shadow-xl flex flex-col items-center">
            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6 border border-green-500/20 shadow-[0_0_30px_rgba(34,197,94,0.15)]">
              <CheckCircle2 className="w-10 h-10 text-green-500" strokeWidth={1.5} />
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-serif text-white tracking-wide font-medium mb-4">
              Application Received
            </h1>
            
            <p className="text-[#888] text-sm sm:text-base leading-relaxed mb-8 font-light">
              Thank you for applying to become a partner. Your profile is currently <span className="text-[#d4933a] font-medium">PENDING</span> verification from our moderators. 
              We will review your details and Emirate ID shortly.
            </p>

            <Link 
              href="/"
              className="w-full bg-[#222] hover:bg-[#333] border border-[#333] hover:border-[#444] text-white font-medium tracking-wide py-3.5 rounded-xl transition-all text-sm"
            >
              Return to Home
            </Link>
          </div>
        );
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0b0a0a] flex flex-col w-full font-sans">
      <Navbar />

      <main className="mt-10 mb-12 flex-grow flex flex-col items-center justify-center pt-24 pb-12 px-4 sm:px-6 relative z-10">
        {renderContent()}
      </main>

      <Footer />
    </div>
  );
}
