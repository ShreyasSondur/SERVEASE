"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { User as UserIcon, Mail, Shield, CheckCircle, Clock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }
        const res = await api.get("/auth/me");
        setUser(res.data);
      } catch (err: any) {
        console.error("Failed to fetch profile", err);
        setError("Failed to load profile. Please try logging in again.");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0A0A] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C9983F]"></div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-[#0B0A0A] flex flex-col items-center justify-center p-6 text-center">
        <div className="text-red-500 mb-4 text-xl">{error || "User not found"}</div>
        <button
          onClick={() => router.push("/login")}
          className="px-6 py-2 bg-[#C9983F] text-white rounded font-serif font-medium hover:bg-[#a67c33] transition-colors"
        >
          Go to Login
        </button>
      </div>
    );
  }

  const getRoleDisplay = (role: string) => {
    switch(role?.toUpperCase()) {
      case 'ADMIN': return 'Administrator';
      case 'MODERATOR': return 'Moderator';
      case 'PARTNER': return 'Service Partner';
      default: return 'Customer';
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0B0A0A] flex flex-col w-full font-sans text-white">
      <Navbar />

      <main className="flex-grow w-full max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8 py-10 pt-28 pb-20">
        <div className="max-w-4xl mx-auto animate-fade-in">
          
          {/* Header Section */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-serif text-[#C9983F] mb-4">My Profile</h1>
            <p className="text-[#D4D2CD] text-lg font-light">View and manage your personal details.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Profile Card */}
            <div className="col-span-1">
              <div className="bg-[#151515] border border-[#222] rounded-[2rem] p-8 flex flex-col items-center text-center shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-[#C9983F]/20 to-transparent"></div>
                
                <div className="w-32 h-32 rounded-full border-4 border-[#1A1A1A] bg-[#222] flex items-center justify-center mb-6 relative z-10 shadow-lg">
                  <UserIcon className="w-16 h-16 text-[#C9983F]" />
                </div>
                
                <h2 className="text-2xl font-serif font-medium text-white truncate w-full mb-1">
                  {user.email.split('@')[0]}
                </h2>
                <div className="inline-block px-3 py-1 rounded-full bg-[#C9983F]/10 border border-[#C9983F]/30 text-[#C9983F] text-xs font-bold tracking-wider uppercase mb-6">
                  {getRoleDisplay(user.role)}
                </div>
                
              </div>
            </div>

            {/* Details Section */}
            <div className="col-span-1 md:col-span-2 space-y-6">
              
              <div className="bg-[#151515] border border-[#222] rounded-[2rem] p-8 shadow-xl">
                <h3 className="text-xl font-serif text-[#C9983F] mb-6 flex items-center gap-2">
                  <Shield className="w-5 h-5" /> Account Information
                </h3>
                
                <div className="space-y-6">
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-[#1A1A1A] rounded-xl border border-[#2A2A2A]">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#C9983F]/10 flex items-center justify-center">
                        <Mail className="w-5 h-5 text-[#C9983F]" />
                      </div>
                      <div>
                        <p className="text-xs text-[#888] uppercase tracking-wider font-bold mb-1">Email Address</p>
                        <p className="text-white font-medium">{user.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-[#1A1A1A] rounded-xl border border-[#2A2A2A]">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#C9983F]/10 flex items-center justify-center">
                        <Clock className="w-5 h-5 text-[#C9983F]" />
                      </div>
                      <div>
                        <p className="text-xs text-[#888] uppercase tracking-wider font-bold mb-1">Status</p>
                        <div className="flex items-center gap-2">
                          {user.is_active ? (
                            <><CheckCircle className="w-4 h-4 text-green-500" /> <span className="text-white font-medium">Active</span></>
                          ) : (
                            <span className="text-red-500 font-medium">Inactive</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
            
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
