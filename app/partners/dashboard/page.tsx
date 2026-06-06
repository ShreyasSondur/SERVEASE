"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Briefcase, Tag, Calendar, Pencil, Trash2, Plus, ArrowRight } from "lucide-react";
import Link from "next/link";

const STATS = [
  { label: "Services Posted", current: 1, max: 6, icon: Briefcase },
  { label: "Deals Posted", current: 2, max: 2, icon: Tag },
];

const DEALS = [
  {
    id: 1,
    title: "Painting Services",
    desc: "Get upto 20% off on all interior wall painting services",
    valid: "30 May, 2026",
    status: "Active",
  },
  {
    id: 2,
    title: "Deep Cleaning Services",
    desc: "Exclusive deep cleaning package for 2 BHK apartments",
    valid: "15 Jun, 2026",
    status: "Active",
  },
];

const SERVICES = [
  {
    id: 1,
    title: "Wall Painting Services Dubai | Fast Clean",
    tags: ["Interior Wall Painting", "Exterior Wall Painting", "Texture Painting"],
    status: "Active",
  },
  {
    id: 2,
    title: "AC Servicing & Maintenance | Expert Care",
    tags: ["AC Repair", "AC Installation", "Duct Cleaning"],
    status: "Active",
  },
  {
    id: 3,
    title: "Professional Plumbing Services | 24/7",
    tags: ["Pipe Leakage", "Water Heater", "Bathroom Fittings"],
    status: "Active",
  },
  {
    id: 4,
    title: "Home Deep Cleaning | Move-in Special",
    tags: ["Deep Cleaning", "Sanitization", "Sofa Cleaning"],
    status: "Active",
  },
  {
    id: 5,
    title: "Electrical Repairs & Fitting | Safe Fix",
    tags: ["Wiring", "Lighting", "Panel Upgrade"],
    status: "Active",
  },
];

export default function Dashboard() {
  return (
    <div className="relative min-h-screen bg-[#0b0a0a] flex flex-col w-full font-sans text-white">
      <Navbar />

      <main className="flex-grow w-full max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 py-10 pt-28">
        
        {/* Top Header & Stats */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-12 animate-fade-in">
          <div>
            <h1 className="text-3xl md:text-[40px] font-serif font-light mb-2 tracking-wide">
              My <span className="text-[#d4933a]">Services</span>
            </h1>
            <p className="text-[#888] text-sm max-w-sm font-light">
              Manage, update or remove the services you have posted.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            {STATS.map((stat, idx) => (
              <div key={idx} className="w-full sm:w-56 bg-[#131313] border border-[#222] rounded-2xl p-5 flex flex-col gap-4 shadow-lg hover:border-[#333] transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#d4933a]/10 border border-[#d4933a]/20 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(212,147,58,0.15)]">
                    <stat.icon className="w-5 h-5 text-[#d4933a]" strokeWidth={1.5} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold font-serif text-white flex items-baseline gap-1.5">
                      {stat.current} <span className="text-sm font-sans font-normal text-[#666]">/ {stat.max}</span>
                    </div>
                    <div className="text-[10px] uppercase tracking-widest text-[#888] font-semibold mt-0.5">
                      {stat.label}
                    </div>
                  </div>
                </div>
                <div className="w-full bg-[#222] h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-[#d4933a] h-full rounded-full" 
                    style={{ width: `${(stat.current / stat.max) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Exclusive Deals Section */}
        <div className="bg-[#111111] border border-[#222] rounded-[2rem] p-6 sm:p-8 mb-12 shadow-xl animate-slide-up">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-5">
            <div className="flex items-start gap-4">
              <Tag className="text-[#d4933a] w-6 h-6 mt-1" strokeWidth={1.5} />
              <div>
                <h2 className="text-xl sm:text-2xl font-medium text-white tracking-wide">
                  Exclusive Deals ({DEALS.length}/2)
                </h2>
                <p className="text-[#888] text-xs sm:text-sm mt-1 font-light">
                  Promote your best services with exclusive offers.
                </p>
              </div>
            </div>
            <button className="cursor-pointer w-full sm:w-auto bg-[#d4933a] hover:bg-[#c28532] text-white px-5 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(212,147,58,0.2)] hover:shadow-[0_0_25px_rgba(212,147,58,0.4)]">
              <Plus className="w-4 h-4" strokeWidth={2.5} /> Add a new deal
            </button>
          </div>

          {/* Deals Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            {DEALS.map((deal) => (
              <div key={deal.id} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl flex flex-col sm:flex-row overflow-hidden group hover:border-[#d4933a]/50 transition-colors shadow-lg">
                {/* Image Placeholder */}
                <div className="w-full sm:w-[40%] aspect-video sm:aspect-auto bg-[#e5e5e5] flex items-center justify-center shrink-0 relative overflow-hidden">
                  <span className="text-black/50 text-xs font-semibold tracking-wider uppercase z-10">image</span>
                  {/* Subtle hover zoom effect on image placeholder */}
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                
                {/* Content */}
                <div className="flex flex-col flex-1 p-5 sm:p-6">
                  <h3 className="font-medium text-[16px] mb-1.5 text-white">{deal.title}</h3>
                  <p className="text-[#aaa] text-xs sm:text-[13px] mb-4 leading-relaxed font-light">{deal.desc}</p>
                  
                  <div className="flex items-center gap-2 mb-6 text-[#d4933a] text-xs font-medium bg-[#d4933a]/5 w-fit px-3 py-1.5 rounded-lg border border-[#d4933a]/10">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Valid till {deal.valid}</span>
                  </div>

                  <div className="mt-auto border-t border-[#2a2a2a] pt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                      <span className="text-[#aaa] font-medium">{deal.status}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <button className="cursor-pointer flex items-center gap-1.5 text-xs text-[#888] hover:text-white transition-colors font-medium">
                        <Pencil className="w-3.5 h-3.5" /> Edit
                      </button>
                      <button className="cursor-pointer flex items-center gap-1.5 text-xs text-[#888] hover:text-red-400 transition-colors font-medium">
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* All Services Section */}
        <div className="animate-slide-up" style={{ animationDelay: "100ms" }}>
          <div className="flex items-center justify-between mb-6 border-b border-[#222] pb-4">
            <h3 className="text-[#d4933a] font-medium text-[15px] tracking-wide">
              All Services ({SERVICES.length})
            </h3>
          </div>

          {/* Desktop Table View (Hidden on mobile) */}
          <div className="hidden lg:block bg-[#111111] border border-[#222] rounded-[2rem] overflow-hidden shadow-xl">
            <div className="grid grid-cols-12 gap-4 px-6 py-5 border-b border-[#222] bg-[#151515] text-[#888] text-xs font-bold uppercase tracking-widest">
              <div className="col-span-7">Services</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-3 text-right pr-2">Action</div>
            </div>
            
            <div className="divide-y divide-[#222]">
              {SERVICES.map((service) => (
                <div key={service.id} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-[#151515] transition-colors group">
                  <div className="col-span-7 flex gap-5 items-center pr-4">
                    <div className="w-36 h-24 bg-[#e5e5e5] rounded-xl shrink-0 flex items-center justify-center shadow-inner relative overflow-hidden">
                      <span className="text-black/50 text-[10px] font-bold uppercase tracking-wider">image</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-[15px] text-white mb-2.5 truncate">{service.title}</h4>
                      <div className="flex flex-wrap gap-2">
                        {service.tags.map((tag, i) => (
                          <span key={i} className="text-[10px] text-[#888] font-medium uppercase tracking-wider bg-[#222] px-2 py-1 rounded-md">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-span-2 flex items-center gap-2.5">
                    <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                    <span className="text-sm text-[#aaa] font-medium">{service.status}</span>
                  </div>
                  
                  <div className="col-span-3 flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="cursor-pointer bg-[#222] hover:bg-[#333] border border-[#333] hover:border-[#444] text-white px-4 py-2 rounded-lg flex items-center gap-2 text-xs font-medium transition-all shadow-sm">
                      <Pencil className="w-3.5 h-3.5 text-[#aaa]" /> Edit
                    </button>
                    <button className="cursor-pointer bg-[#222] hover:bg-red-500/10 border border-[#333] hover:border-red-500/30 text-white hover:text-red-400 px-4 py-2 rounded-lg flex items-center gap-2 text-xs font-medium transition-all shadow-sm">
                      <Trash2 className="w-3.5 h-3.5 opacity-70" /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Card View for Services (Hidden on Desktop) */}
          <div className="lg:hidden flex flex-col gap-4">
            {SERVICES.map((service) => (
              <div key={service.id} className="bg-[#111111] border border-[#222] rounded-2xl overflow-hidden flex flex-col shadow-lg">
                <div className="w-full aspect-video bg-[#e5e5e5] flex items-center justify-center shrink-0">
                  <span className="text-black/50 text-[10px] font-bold uppercase tracking-wider">image</span>
                </div>
                <div className="p-5">
                  <h4 className="font-medium text-[15px] text-white mb-3">{service.title}</h4>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {service.tags.map((tag, i) => (
                      <span key={i} className="text-[10px] text-[#888] font-medium uppercase tracking-wider bg-[#222] px-2 py-1 rounded-md">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="border-t border-[#222] pt-4 mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                      <span className="text-sm text-[#aaa] font-medium">{service.status}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button className="bg-[#222] hover:bg-[#333] text-white p-2 rounded-lg transition-colors">
                        <Pencil className="w-4 h-4 text-[#aaa]" />
                      </button>
                      <button className="bg-[#222] hover:bg-red-500/10 text-white hover:text-red-400 p-2 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4 opacity-70" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
