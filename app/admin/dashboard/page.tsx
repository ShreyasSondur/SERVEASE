"use client";

import { useState } from "react";
import { 
  Home, 
  Users, 
  CheckSquare, 
  FileText, 
  BarChart2, 
  LogOut, 
  Search, 
  X, 
  Check, 
  Menu,
  Filter,
  ChevronDown,
  Calendar,
  Download
} from "lucide-react";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const TABS = [
    { name: "Dashboard", icon: Home },
    { name: "Partners", icon: Users },
    { name: "Verify Partner", icon: CheckSquare },
    { name: "Mods", icon: Users },
    { name: "Verify Mods", icon: CheckSquare },
    { name: "User Logs", icon: FileText },
    { name: "Analytics", icon: BarChart2 },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "Dashboard":
        return (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-medium mb-8 text-white tracking-wide">Dashboard</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {[
                { title: "Total Users", count: "1,239" },
                { title: "Total Partners", count: "8,756" },
                { title: "Total Services", count: "3,431" },
                { title: "Total Deals", count: "2,354" },
              ].map((stat, idx) => (
                <div key={idx} className="bg-[#151515] border border-[#222] rounded-xl p-6 shadow-md hover:border-[#333] transition-colors">
                  <p className="text-[#888] text-[11px] uppercase tracking-wider font-bold mb-3">
                    {stat.title}
                  </p>
                  <p className="text-3xl sm:text-[34px] font-bold text-white tracking-tight">
                    {stat.count}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );

      case "Partners":
        return (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-medium mb-8 text-white tracking-wide">Partners</h2>
            <div className="relative max-w-md mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888]" />
              <input 
                type="text" 
                placeholder="Search partners..."
                className="w-full bg-[#151515] border border-[#222] focus:border-[#d4933a] rounded-xl py-3 pl-11 pr-4 text-sm text-white outline-none transition-colors"
              />
            </div>
            <div className="flex flex-col gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-[#151515] border border-[#222] rounded-xl p-4 flex items-center justify-between hover:bg-[#1a1a1a] transition-colors">
                  <span className="text-white text-[15px]">Sheik Nayaaz</span>
                  <button className="bg-[#d4933a] hover:bg-[#c28532] text-white px-4 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-colors">
                    View More
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      case "Verify Partner":
        return (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-medium mb-8 text-white tracking-wide">Verify Partners</h2>
            <div className="flex flex-col gap-3">
              {[1, 2].map((i) => (
                <div key={i} className="bg-[#151515] border border-[#222] rounded-xl p-4 flex items-center justify-between hover:bg-[#1a1a1a] transition-colors">
                  <span className="text-white text-[15px]">Sheik Nayaaz</span>
                  <button className="bg-[#d4933a] hover:bg-[#c28532] text-white px-4 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-colors">
                    View More
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      case "Mods":
        return (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-medium mb-8 text-white tracking-wide">Moderators</h2>
            <div className="relative max-w-md mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888]" />
              <input 
                type="text" 
                placeholder="Search moderators..."
                className="w-full bg-[#151515] border border-[#222] focus:border-[#d4933a] rounded-xl py-3 pl-11 pr-4 text-sm text-white outline-none transition-colors"
              />
            </div>
            <div className="flex flex-col gap-3">
              {[1].map((i) => (
                <div key={i} className="bg-[#151515] border border-[#222] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0 hover:bg-[#1a1a1a] transition-colors">
                  <span className="text-white text-[15px]">UserName</span>
                  <a href="mailto:user@email.com" className="text-[#aaa] hover:text-white text-[13px] underline transition-colors">
                    user@email.com
                  </a>
                </div>
              ))}
            </div>
          </div>
        );

      case "Verify Mods":
        return (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-medium mb-8 text-white tracking-wide">Verify Moderators</h2>
            <div className="flex flex-col gap-3">
              {[1].map((i) => (
                <div key={i} className="bg-[#151515] border border-[#222] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0 hover:bg-[#1a1a1a] transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-32">
                    <span className="text-white text-[15px]">UserName</span>
                    <a href="mailto:user@email.com" className="text-[#aaa] hover:text-white text-[13px] underline transition-colors">
                      user@email.com
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-lg transition-colors">
                      <X className="w-4 h-4" strokeWidth={3} />
                    </button>
                    <button className="bg-green-500 hover:bg-green-600 text-white p-1.5 rounded-lg transition-colors">
                      <Check className="w-4 h-4" strokeWidth={3} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "User Logs":
        return (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-medium mb-8 text-white tracking-wide">User Logs</h2>
            <div className="flex flex-col gap-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-[#151515] border border-[#222] rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0 hover:bg-[#1a1a1a] transition-colors shadow-sm">
                  <span className="text-[#e5e5e5] text-[14px] sm:text-[15px] font-light">(Mod-User) Verified (Partner - Nayaaz)</span>
                  <span className="text-[#888] text-[11px] sm:text-[12px] uppercase tracking-wider">21/9/2025  9:34 PM</span>
                </div>
              ))}
            </div>
          </div>
        );

      case "Analytics":
        return (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-medium mb-8 text-white tracking-wide">Analytics</h2>
            
            {/* Filter Section */}
            <div className="bg-[#151515] border border-[#222] rounded-[1.5rem] p-6 sm:p-8 mb-6 shadow-md">
              <div className="flex items-center gap-2.5 mb-6">
                <Filter className="w-5 h-5 text-[#d4933a]" strokeWidth={2} />
                <h3 className="text-[#d4933a] text-[16px] font-semibold tracking-wide">Filter</h3>
              </div>
              <div className="flex flex-col sm:flex-row items-end gap-5">
                <div className="flex flex-col gap-2 w-full sm:w-1/3">
                  <label className="text-[10px] uppercase tracking-widest text-[#888] font-bold">Time Period</label>
                  <div className="relative">
                    <select className="w-full bg-[#111] border border-[#333] hover:border-[#444] text-white rounded-xl py-4 pl-5 pr-10 appearance-none outline-none text-[13px] focus:border-[#d4933a] transition-colors cursor-pointer shadow-inner">
                      <option>This Week</option>
                      <option>This Month</option>
                      <option>This Year</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-[#888] absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
                <div className="flex flex-col gap-2 w-full sm:w-1/3">
                  <label className="text-[10px] uppercase tracking-widest text-[#888] font-bold">Emirates</label>
                  <div className="relative">
                    <select className="w-full bg-[#111] border border-[#333] hover:border-[#444] text-white rounded-xl py-4 pl-5 pr-10 appearance-none outline-none text-[13px] focus:border-[#d4933a] transition-colors cursor-pointer shadow-inner">
                      <option>All</option>
                      <option>Dubai</option>
                      <option>Abu Dhabi</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-[#888] absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
                <button className="w-full sm:w-auto bg-[#d4933a] hover:bg-[#c28532] text-white font-bold tracking-widest uppercase py-4 px-8 rounded-xl transition-all text-[12px] shadow-lg">
                  Apply Filter
                </button>
              </div>
            </div>

            {/* Chart Section */}
            <div className="bg-[#151515] border border-[#222] rounded-[1.5rem] p-6 sm:p-8 mb-6 shadow-md overflow-x-auto">
              <h3 className="text-[#d4933a] text-[16px] font-medium mb-1 tracking-wide">Search Per Service</h3>
              <p className="text-[#888] text-[11px] mb-12">Total Number of Searches for each services</p>
              
              <div className="relative h-64 min-w-[500px] w-full flex items-end justify-around border-b border-[#333] pb-0 pt-6">
                 {/* Background grid lines */}
                 <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                    {[5000, 2000, 1000, 100, 50, 0].map(val => (
                       <div key={val} className="w-full border-t border-[#333] relative">
                         <span className="absolute -top-2.5 left-0 text-[10px] text-[#666] font-medium">{val}</span>
                       </div>
                    ))}
                 </div>
                 
                 {/* Bars */}
                 <div className="relative z-10 w-16 sm:w-20 bg-[#d4933a] rounded-t-md flex flex-col items-center justify-start group hover:bg-[#e0a045] transition-colors" style={{ height: "80%" }}>
                    <span className="text-[11px] text-white absolute -top-6 font-semibold">2433</span>
                    <span className="absolute -bottom-7 text-[11px] text-[#aaa] font-medium">Plumbing</span>
                 </div>
                 <div className="relative z-10 w-16 sm:w-20 bg-[#d4933a] rounded-t-md flex flex-col items-center justify-start group hover:bg-[#e0a045] transition-colors" style={{ height: "65%" }}>
                    <span className="text-[11px] text-white absolute -top-6 font-semibold">2000</span>
                    <span className="absolute -bottom-7 text-[11px] text-[#aaa] font-medium">Painting</span>
                 </div>
                 <div className="relative z-10 w-16 sm:w-20 bg-[#d4933a] rounded-t-md flex flex-col items-center justify-start group hover:bg-[#e0a045] transition-colors" style={{ height: "50%" }}>
                    <span className="text-[11px] text-white absolute -top-6 font-semibold">1500</span>
                    <span className="absolute -bottom-7 text-[11px] text-[#aaa] font-medium">Cleaning</span>
                 </div>
                 <div className="relative z-10 w-16 sm:w-20 bg-[#d4933a] rounded-t-md flex flex-col items-center justify-start group hover:bg-[#e0a045] transition-colors" style={{ height: "30%" }}>
                    <span className="text-[11px] text-white absolute -top-6 font-semibold">600</span>
                    <span className="absolute -bottom-7 text-[11px] text-[#aaa] font-medium">Ac Repair</span>
                 </div>
              </div>
              <div className="h-10"></div> {/* Spacer for bottom labels */}
            </div>

            {/* Download Search Data */}
            <div className="bg-[#151515] border border-[#222] rounded-[1.5rem] p-6 sm:p-8 shadow-md">
              <h3 className="text-white text-[16px] font-medium mb-1 tracking-wide">Download Search Data</h3>
              <p className="text-[#888] text-[11px] mb-8">Download user search data based on selected filters</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                 {[
                   { title: "Today", desc: "Download today's search data" },
                   { title: "This week", desc: "Download this week's search data" },
                   { title: "This Month", desc: "Download this month's search data" },
                   { title: "This Year", desc: "Download this year's search data" },
                   { title: "All time", desc: "Download all time search data" },
                 ].map((item, idx) => (
                   <div key={idx} className="bg-[#111] border border-[#333] hover:border-[#444] rounded-xl p-4 sm:p-5 flex flex-col gap-4 transition-colors group">
                     <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-lg bg-[#d4933a]/10 flex items-center justify-center shrink-0 border border-[#d4933a]/20 group-hover:bg-[#d4933a]/20 transition-colors">
                           <Calendar className="w-4 h-4 text-[#d4933a]" />
                        </div>
                        <div>
                           <h4 className="text-white text-[13px] sm:text-sm font-medium">{item.title}</h4>
                           <p className="text-[#777] text-[10px] sm:text-[11px] leading-snug mt-1">{item.desc}</p>
                        </div>
                     </div>
                     <button className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#161616] hover:bg-[#222] border border-[#333] hover:border-[#d4933a]/50 rounded-lg transition-all text-[#d4933a] text-[11px] font-bold tracking-widest uppercase mt-auto">
                        <span>Download</span>
                        <Download className="w-3.5 h-3.5" strokeWidth={2.5} />
                     </button>
                   </div>
                 ))}
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-medium mb-8 text-white tracking-wide">{activeTab}</h2>
            <p className="text-[#888]">This section is under construction.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0a0a] flex font-sans">
      
      {/* Mobile Header (Visible only on small screens) */}
      <div className="lg:hidden fixed top-0 left-0 w-full bg-[#0f0f0f] border-b border-[#222] flex items-center justify-between p-4 z-50">
        <h1 className="text-xl font-bold italic tracking-wide">
          <span className="text-white">SERV</span><span className="text-[#d4933a]">EASE</span>
        </h1>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-white p-2 bg-[#222] rounded-lg"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-[260px] bg-[#0f0f0f] border-r border-[#222] flex flex-col transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="p-8 hidden lg:block">
          <h1 className="text-[28px] font-bold italic tracking-wide">
            <span className="text-white">SERV</span><span className="text-[#d4933a]">EASE</span>
          </h1>
        </div>

        <div className="p-8 lg:hidden mt-12 border-b border-[#222] mb-4">
           <span className="text-[#888] text-[10px] uppercase tracking-widest font-bold">Menu</span>
        </div>

        {/* Navigation */}
        <nav className="flex-grow px-4 flex flex-col gap-1 overflow-y-auto">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.name;
            return (
              <button
                key={tab.name}
                onClick={() => {
                  setActiveTab(tab.name);
                  setIsMobileMenuOpen(false);
                }}
                className={`
                  flex items-center gap-3.5 px-4 py-3.5 rounded-xl transition-all duration-200 text-[13px] font-medium tracking-wide
                  ${isActive 
                    ? 'bg-[#222] text-white border border-[#333]' 
                    : 'text-[#888] hover:bg-[#151515] hover:text-[#d4d2cd] border border-transparent'
                  }
                `}
              >
                <tab.icon className={`w-4 h-4 ${isActive ? 'text-[#d4933a]' : ''}`} strokeWidth={isActive ? 2 : 1.5} />
                {tab.name}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 mt-auto border-t border-[#222]">
          <button className="flex items-center justify-center gap-2 w-full bg-[#151515] hover:bg-red-500/10 text-[#888] hover:text-red-400 border border-[#222] hover:border-red-500/30 py-3.5 rounded-xl transition-all text-[13px] font-medium">
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow w-full h-screen overflow-y-auto p-6 pt-24 lg:pt-10 lg:p-10">
        <div className="max-w-[1200px] mx-auto">
          {renderContent()}
        </div>
      </main>

    </div>
  );
}
