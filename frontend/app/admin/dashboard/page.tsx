"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
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
  Download,
  PlusCircle,
  ShieldAlert
} from "lucide-react";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const TABS = [
    { name: "Dashboard", icon: Home },
    { name: "Partners", icon: Users },
    { name: "Verify Partner", icon: CheckSquare },
    { name: "Suspended", icon: X },
    { name: "Mods", icon: ShieldAlert },
    { name: "Verify Mods", icon: CheckSquare },
    { name: "User Logs", icon: FileText },
    { name: "Analytics", icon: BarChart2 },
    { name: "Add Catalog", icon: PlusCircle },
  ];

  const [stats, setStats] = useState({ users: 0, partners: 0, services: 0, deals: 0 });
  const [partners, setPartners] = useState<any[]>([]);
  const [mods, setMods] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Catalog forms
  const [catName, setCatName] = useState("");
  const [catDesc, setCatDesc] = useState("");
  const [emirateName, setEmirateName] = useState("");
  const [cityName, setCityName] = useState("");
  const [cityEmirateId, setCityEmirateId] = useState("");
  const [catalogMsg, setCatalogMsg] = useState({ type: "", text: "" });

  // Catalog lists
  const [catalogServices, setCatalogServices] = useState<any[]>([]);
  const [catalogEmirates, setCatalogEmirates] = useState<any[]>([]);
  const [catalogCities, setCatalogCities] = useState<any[]>([]);

  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    // Auth Guard
    const checkAuth = async () => {
      try {
        const res = await api.get("/auth/me");
        if (res.data.role !== "ADMIN" && res.data.role !== "MODERATOR") {
          window.location.href = "/login";
        }
        setUserRole(res.data.role);
        fetchData();
      } catch (err) {
        window.location.href = "/login";
      }
    };
    checkAuth();
  }, [activeTab]);

  const [searchAnalytics, setSearchAnalytics] = useState<any[]>([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === "Dashboard") {
        const res = await api.get("/admin/dashboard");
        setStats(res.data);
      } else if (activeTab === "Partners" || activeTab === "Verify Partner" || activeTab === "Suspended") {
        const res = await api.get("/admin/partners");
        setPartners(res.data);
      } else if (activeTab === "Mods" || activeTab === "Verify Mods") {
        const res = await api.get("/admin/mods");
        setMods(res.data);
      } else if (activeTab === "User Logs") {
        const res = await api.get("/admin/logs");
        setLogs(res.data);
      } else if (activeTab === "Add Catalog") {
        const [emRes, cityRes, servRes] = await Promise.all([
          api.get("/catalog/emirates"),
          api.get("/catalog/cities"),
          api.get("/catalog/services")
        ]);
        setCatalogEmirates(emRes.data);
        setCatalogCities(cityRes.data);
        setCatalogServices(servRes.data);
      } else if (activeTab === "Analytics") {
        const res = await api.get("/admin/analytics/searches");
        // Aggregate by Emirate/City for basic chart demo
        const agg: Record<string, number> = {};
        res.data.forEach((s: any) => {
          const key = `Query: ${s.query || 'All'}`;
          agg[key] = (agg[key] || 0) + 1;
        });
        const chartData = Object.keys(agg).map(k => ({ label: k, count: agg[k] }));
        setSearchAnalytics(chartData);
      }
    } catch (err) {
      console.error("Failed to fetch data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const verifyPartner = async (id: number) => {
    try {
      await api.patch(`/admin/verify/${id}`);
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  const suspendPartner = async (id: number) => {
    try {
      await api.patch(`/admin/suspend/${id}`); // permanent suspension until manual reactivation
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  const banPartner = async (id: number) => {
    try {
      if (confirm("Are you sure you want to ban this partner? Their services and deals will become inactive.")) {
        await api.patch(`/admin/ban/${id}`);
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const verifyMod = async (id: number) => {
    try {
      await api.patch(`/admin/mods/verify/${id}`);
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  const addCategory = async (e: any) => {
    e.preventDefault();
    try {
      await api.post("/admin/categories", { name: catName, description: catDesc });
      setCatalogMsg({ type: "success", text: "Global Service added successfully" });
      setCatName("");
      setCatDesc("");
      fetchData();
    } catch (e) {
      setCatalogMsg({ type: "error", text: "Failed to add service" });
    }
  };

  const addEmirate = async (e: any) => {
    e.preventDefault();
    try {
      await api.post("/admin/emirates", { name: emirateName });
      setCatalogMsg({ type: "success", text: "Emirate added successfully" });
      setEmirateName("");
      fetchData();
    } catch (e) {
      setCatalogMsg({ type: "error", text: "Failed to add Emirate" });
    }
  };

  const addCity = async (e: any) => {
    e.preventDefault();
    if (!cityEmirateId) {
      setCatalogMsg({ type: "error", text: "Please select an Emirate first" });
      return;
    }
    try {
      await api.post("/admin/cities", { name: cityName, emirate_id: parseInt(cityEmirateId) });
      setCatalogMsg({ type: "success", text: "City added successfully" });
      setCityName("");
      fetchData();
    } catch (e) {
      setCatalogMsg({ type: "error", text: "Failed to add city" });
    }
  };

  const downloadSearches = async () => {
    try {
      const res = await api.get("/admin/analytics/searches");
      const csvContent = "data:text/csv;charset=utf-8," 
        + "ID,Query,EmirateID,CityID,Timestamp\n"
        + res.data.map((row: any) => `${row.id},${row.query || ""},${row.emirate_id || ""},${row.city_id || ""},${row.timestamp}`).join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "search_history.csv");
      document.body.appendChild(link);
      link.click();
    } catch (e) {
      console.error(e);
    }
  };

  if (!userRole) {
    return <div className="min-h-screen bg-[#0b0a0a] text-[#888] flex items-center justify-center font-sans">Checking authorization...</div>;
  }

  const renderContent = () => {
    if (loading && activeTab !== "Add Catalog" && activeTab !== "Analytics") {
      return <div className="text-[#888]">Loading...</div>;
    }

    switch (activeTab) {
      case "Dashboard":
        return (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-medium mb-8 text-white tracking-wide">Dashboard Overview</h2>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
               {[
                 { title: "Total Users", count: stats.users },
                 { title: "Total Partners", count: stats.partners },
                 { title: "Total Services", count: stats.services },
                 { title: "Total Deals", count: stats.deals },
               ].map((stat, idx) => (
                 <div key={idx} className="bg-[#151515] border border-[#222] rounded-xl p-6 shadow-md hover:border-[#333] transition-colors group">
                   <div className="w-10 h-10 rounded-lg bg-[#d4933a]/10 flex items-center justify-center mb-4 group-hover:bg-[#d4933a]/20 transition-colors">
                      <BarChart2 className="w-5 h-5 text-[#d4933a]" />
                   </div>
                   <p className="text-[#888] text-[11px] uppercase tracking-wider font-bold mb-1">
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
            <h2 className="text-2xl font-medium mb-8 text-white tracking-wide">Partners Management</h2>
            <div className="flex flex-col gap-3">
              {partners.map((p) => (
                <div key={p.id} className="bg-[#151515] border border-[#222] rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between hover:bg-[#1a1a1a] transition-colors gap-4">
                  <div>
                    <span className="text-white text-[15px]">{p.business_name}</span>
                    <span className={`ml-3 text-xs px-2 py-1 rounded text-white ${p.status === 'VERIFIED' ? 'bg-green-500/20 text-green-400' : p.status === 'BANNED' ? 'bg-red-500/20 text-red-400' : 'bg-white/10 text-gray-300'}`}>
                      {p.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {p.status === "VERIFIED" && (
                      <button onClick={() => suspendPartner(p.id)} className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-colors">
                        Suspend
                      </button>
                    )}
                    {p.status !== "BANNED" && (
                      <button onClick={() => banPartner(p.id)} className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-colors">
                        Ban
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "Suspended":
        return (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-medium mb-8 text-white tracking-wide">Suspended Partners</h2>
            <div className="flex flex-col gap-3">
              {partners.filter(p => p.status === "SUSPENDED").map((p) => (
                <div key={p.id} className="bg-[#151515] border border-[#222] rounded-xl p-4 flex items-center justify-between hover:bg-[#1a1a1a] transition-colors">
                  <div>
                    <span className="text-white text-[15px]">{p.business_name}</span>
                  </div>
                  <button onClick={() => verifyPartner(p.id)} className="bg-green-500 hover:bg-green-600 text-white px-4 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-colors">
                    Un-suspend
                  </button>
                </div>
              ))}
              {partners.filter(p => p.status === "SUSPENDED").length === 0 && (
                <div className="text-gray-500 text-sm">No suspended partners.</div>
              )}
            </div>
          </div>
        );

      case "Verify Partner":
        return (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-medium mb-8 text-white tracking-wide">Pending Partners</h2>
            <div className="flex flex-col gap-3">
              {partners.filter(p => p.status === "PENDING").map((p) => (
                <div key={p.id} className="bg-[#151515] border border-[#222] rounded-xl p-4 flex items-center justify-between hover:bg-[#1a1a1a] transition-colors">
                  <div>
                    <span className="text-white text-[15px]">{p.business_name}</span>
                    <a href={p.emirates_id_url} target="_blank" className="ml-3 text-xs text-[#d4933a] hover:underline">View ID</a>
                  </div>
                  <button onClick={() => verifyPartner(p.id)} className="bg-green-500 hover:bg-green-600 text-white px-4 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-colors">
                    Approve
                  </button>
                </div>
              ))}
              {partners.filter(p => p.status === "PENDING").length === 0 && (
                <div className="text-gray-500 text-sm">No pending partners.</div>
              )}
            </div>
          </div>
        );

      case "Mods":
        return (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-medium mb-8 text-white tracking-wide">Active Moderators</h2>
            <div className="flex flex-col gap-3">
              {mods.filter(m => m.is_active).map((m) => (
                <div key={m.id} className="bg-[#151515] border border-[#222] rounded-xl p-4 flex items-center justify-between hover:bg-[#1a1a1a] transition-colors">
                  <span className="text-white text-[15px]">{m.email}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case "Verify Mods":
        return (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-medium mb-8 text-white tracking-wide">Pending Moderators (Admin Only)</h2>
            <div className="flex flex-col gap-3">
              {mods.filter(m => !m.is_active).map((m) => (
                <div key={m.id} className="bg-[#151515] border border-[#222] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0 hover:bg-[#1a1a1a] transition-colors">
                  <span className="text-white text-[15px]">{m.email}</span>
                  <div className="flex items-center gap-3">
                    <button onClick={() => verifyMod(m.id)} className="bg-green-500 hover:bg-green-600 text-white p-1.5 rounded-lg transition-colors">
                      <Check className="w-4 h-4" strokeWidth={3} />
                    </button>
                  </div>
                </div>
              ))}
              {mods.filter(m => !m.is_active).length === 0 && (
                <div className="text-gray-500 text-sm">No pending moderators.</div>
              )}
            </div>
          </div>
        );

      case "User Logs":
        return (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-medium mb-8 text-white tracking-wide">Activity Logs</h2>
            <div className="flex flex-col gap-3">
              {logs.map((l) => (
                <div key={l.id} className="bg-[#151515] border border-[#222] rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0 hover:bg-[#1a1a1a] transition-colors shadow-sm">
                  <span className="text-[#e5e5e5] text-[14px] sm:text-[15px] font-light">
                    <span className="font-bold text-[#d4933a] mr-2">[{l.action}]</span> 
                    {l.description} (User: {l.user_id})
                  </span>
                  <span className="text-[#888] text-[11px] sm:text-[12px] uppercase tracking-wider">
                    {new Date(l.timestamp).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );

      case "Analytics":
        const maxSearches = Math.max(...searchAnalytics.map(s => s.count), 5000); // Default to 5000 for aesthetic scaling
        return (
          <div className="animate-fade-in space-y-6">
            <h2 className="text-2xl font-medium text-white tracking-wide mb-6">Analytics</h2>
            
            {/* Filter Section */}
            <div className="bg-[#1f2022] border border-[#2e2f31] rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                 <Filter className="text-[#3b82f6] w-6 h-6" strokeWidth={2} /> 
                 <h3 className="text-[#d4933a] text-xl font-medium">Filter</h3>
              </div>
              <div className="flex flex-col sm:flex-row items-end gap-6">
                <div className="flex-1 w-full">
                   <label className="text-[#888] text-[10px] uppercase font-bold tracking-widest mb-2 block">Time Period</label>
                   <select className="w-full bg-[#111] border border-[#333] rounded-lg py-3 px-4 text-white outline-none focus:border-[#d4933a] appearance-none">
                     <option>This Week</option>
                     <option>This Month</option>
                     <option>This Year</option>
                     <option>All Time</option>
                   </select>
                </div>
                <div className="flex-1 w-full">
                   <label className="text-[#888] text-[10px] uppercase font-bold tracking-widest mb-2 block">EMIRATES</label>
                   <select className="w-full bg-[#111] border border-[#333] rounded-lg py-3 px-4 text-white outline-none focus:border-[#d4933a] appearance-none">
                     <option>All</option>
                     <option>Dubai</option>
                     <option>Abu Dhabi</option>
                     <option>Sharjah</option>
                   </select>
                </div>
                <button className="bg-[#d4933a] hover:bg-[#c28532] text-white py-3 px-8 rounded-lg font-bold transition-all h-[46px] whitespace-nowrap">
                  Apply Filter
                </button>
              </div>
            </div>

            {/* Search Per Service Graph */}
            <div className="bg-[#1f2022] border border-[#2e2f31] rounded-xl p-8 pb-12 mt-6">
              <h3 className="text-[#d4933a] text-xl font-medium mb-1">Search Per Service</h3>
              <p className="text-[#888] text-xs mb-12">Total Number of Searches for each services</p>
              
              <div className="relative h-[300px] w-full mt-8">
                {/* Y-axis lines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                  {[5000, 2000, 1000, 100, 50, 0].map(val => (
                    <div key={val} className="flex items-center w-full">
                      <span className="w-12 text-[#888] text-[10px] text-right pr-4">{val}</span>
                      <div className="flex-1 border-t border-[#333]"></div>
                    </div>
                  ))}
                </div>
                
                {/* Bars container */}
                <div className="absolute inset-0 pl-16 flex items-end justify-around pb-[1px] pr-4">
                  {searchAnalytics.length === 0 ? (
                    <div className="absolute inset-0 flex items-center justify-center text-[#888] text-sm">
                      No search data available.
                    </div>
                  ) : (
                    searchAnalytics.map((item, idx) => {
                      // Visual scaling to match the non-linear aesthetic of the reference image
                      // In a real app this would use a logarithmic scale function from d3 or similar
                      let heightPct = 0;
                      if (item.count > 0) {
                        heightPct = Math.max((item.count / maxSearches) * 100, 5); // min 5% height to be visible
                      }

                      return (
                        <div key={idx} className="relative flex flex-col items-center w-20 group">
                          <span className="absolute -top-6 text-white text-xs">{item.count}</span>
                          <div 
                            className="w-full bg-[#d4933a] rounded-t-sm transition-all duration-1000 ease-out"
                            style={{ height: `${heightPct}%` }}
                          ></div>
                          <span className="absolute -bottom-8 text-white text-[11px] font-medium text-center w-full truncate px-1">
                            {item.label}
                          </span>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>
            </div>

            {/* Download Search Data */}
            <div className="bg-[#1f2022] border border-[#2e2f31] rounded-xl p-8 mt-6">
              <h3 className="text-white text-lg font-medium mb-1">Download Search Data</h3>
              <p className="text-[#888] text-xs mb-8">Download user search data based on selected filters</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {[
                  { title: "Today", desc: "Download today's search data" },
                  { title: "This week", desc: "Download this week's search data" },
                  { title: "This Month", desc: "Download this month's search data" },
                  { title: "This Year", desc: "Download this year's search data" },
                  { title: "All time", desc: "Download all time search data" }
                ].map((card, i) => (
                  <div key={i} className="border border-[#333] rounded-xl p-5 flex flex-col items-center text-center bg-[#18191a]">
                      <div className="w-10 h-10 rounded-full border border-[#d4933a]/50 text-[#d4933a] flex items-center justify-center mb-4 bg-[#d4933a]/10">
                        <Calendar className="w-4 h-4" strokeWidth={2} />
                      </div>
                      <h4 className="text-white text-sm font-medium mb-1">{card.title}</h4>
                      <p className="text-[#888] text-[10px] mb-5 h-8 leading-tight">{card.desc}</p>
                      <button 
                        onClick={downloadSearches}
                        className="w-full bg-[#222] border border-[#333] hover:border-[#d4933a] hover:text-[#d4933a] text-[#888] py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
                      >
                        Download <Download className="w-3.5 h-3.5" />
                      </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "Add Catalog":
        return (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-medium text-white tracking-wide">Catalog Management</h2>
            </div>
            
            {catalogMsg.text && (
              <div className={`mb-6 p-4 rounded-xl border flex items-center gap-3 ${
                catalogMsg.type === 'success' 
                  ? 'bg-green-500/10 border-green-500/30 text-green-400' 
                  : 'bg-red-500/10 border-red-500/30 text-red-400'
              }`}>
                {catalogMsg.type === 'success' ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
                <span className="font-medium text-[15px]">{catalogMsg.text}</span>
              </div>
            )}
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Column 1: Global Services */}
              <div className="space-y-6">
                {/* Add Service Form */}
                <div className="bg-[#151515] border border-[#222] rounded-2xl p-6 shadow-lg">
                  <h3 className="text-[#d4933a] text-lg font-medium mb-1">Global Services</h3>
                  <p className="text-[#888] text-xs mb-6">Create the top-level services partners can offer.</p>
                  
                  <form onSubmit={addCategory} className="flex flex-col gap-4">
                    <div>
                      <label className="text-[#888] text-[10px] uppercase font-bold tracking-widest mb-1.5 block pl-1">Service Name</label>
                      <input value={catName} onChange={e => setCatName(e.target.value)} required placeholder="e.g. House Cleaning" className="w-full bg-[#111] border border-[#333] focus:border-[#d4933a] rounded-xl px-4 py-3 text-white outline-none text-[13px] transition-colors" />
                    </div>
                    <div>
                      <label className="text-[#888] text-[10px] uppercase font-bold tracking-widest mb-1.5 block pl-1">Description (Optional)</label>
                      <input value={catDesc} onChange={e => setCatDesc(e.target.value)} placeholder="e.g. Deep cleaning for apartments and villas" className="w-full bg-[#111] border border-[#333] focus:border-[#d4933a] rounded-xl px-4 py-3 text-white outline-none text-[13px] transition-colors" />
                    </div>
                    <button type="submit" className="mt-2 bg-[#d4933a] hover:bg-[#c28532] text-white py-3 rounded-xl text-[14px] font-bold transition-colors w-full sm:w-auto self-end px-8">
                      Create Service
                    </button>
                  </form>
                </div>

                {/* List Services */}
                <div className="bg-[#151515] border border-[#222] rounded-2xl p-6 shadow-lg">
                  <h3 className="text-white text-[15px] font-medium mb-4">Existing Services ({catalogServices.length})</h3>
                  <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {catalogServices.map(s => (
                      <div key={s.id} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-3 flex flex-col gap-1">
                        <span className="text-white text-sm font-medium">{s.name}</span>
                        {s.description && <span className="text-[#888] text-[11px]">{s.description}</span>}
                      </div>
                    ))}
                    {catalogServices.length === 0 && <span className="text-[#666] text-sm">No services created yet.</span>}
                  </div>
                </div>
              </div>

              {/* Column 2: Locations */}
              <div className="space-y-6">
                {/* Add Emirate Form */}
                <div className="bg-[#151515] border border-[#222] rounded-2xl p-6 shadow-lg">
                  <h3 className="text-[#d4933a] text-lg font-medium mb-1">Emirates</h3>
                  <p className="text-[#888] text-xs mb-6">Define the major regions of operation.</p>
                  
                  <form onSubmit={addEmirate} className="flex flex-col sm:flex-row gap-4 items-end">
                    <div className="w-full">
                      <label className="text-[#888] text-[10px] uppercase font-bold tracking-widest mb-1.5 block pl-1">Emirate Name</label>
                      <input value={emirateName} onChange={e => setEmirateName(e.target.value)} required placeholder="e.g. Dubai" className="w-full bg-[#111] border border-[#333] focus:border-[#d4933a] rounded-xl px-4 py-3 text-white outline-none text-[13px] transition-colors" />
                    </div>
                    <button type="submit" className="bg-[#d4933a] hover:bg-[#c28532] text-white py-3 px-6 rounded-xl text-[14px] font-bold transition-colors whitespace-nowrap w-full sm:w-auto h-[46px]">
                      Add Emirate
                    </button>
                  </form>
                </div>

                {/* Add City Form */}
                <div className="bg-[#151515] border border-[#222] rounded-2xl p-6 shadow-lg">
                  <h3 className="text-[#d4933a] text-lg font-medium mb-1">Cities / Areas</h3>
                  <p className="text-[#888] text-xs mb-6">Add specific cities or areas within an Emirate.</p>
                  
                  <form onSubmit={addCity} className="flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="w-full sm:w-1/2">
                        <label className="text-[#888] text-[10px] uppercase font-bold tracking-widest mb-1.5 block pl-1">Select Emirate</label>
                        <select required value={cityEmirateId} onChange={e => setCityEmirateId(e.target.value)} className="w-full bg-[#111] border border-[#333] focus:border-[#d4933a] rounded-xl px-4 py-3 text-[#e5e5e5] outline-none text-[13px] transition-colors appearance-none">
                          <option value="" disabled className="text-[#666]">Choose Emirate...</option>
                          {catalogEmirates.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                        </select>
                      </div>
                      <div className="w-full sm:w-1/2">
                        <label className="text-[#888] text-[10px] uppercase font-bold tracking-widest mb-1.5 block pl-1">City Name</label>
                        <input value={cityName} onChange={e => setCityName(e.target.value)} required placeholder="e.g. Marina" className="w-full bg-[#111] border border-[#333] focus:border-[#d4933a] rounded-xl px-4 py-3 text-white outline-none text-[13px] transition-colors" />
                      </div>
                    </div>
                    <button type="submit" className="mt-2 bg-[#d4933a] hover:bg-[#c28532] text-white py-3 rounded-xl text-[14px] font-bold transition-colors w-full sm:w-auto self-end px-8">
                      Add City
                    </button>
                  </form>
                </div>

                {/* List Emirates & Cities */}
                <div className="bg-[#151515] border border-[#222] rounded-2xl p-6 shadow-lg">
                  <h3 className="text-white text-[15px] font-medium mb-4">Locations Directory</h3>
                  <div className="flex flex-col gap-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {catalogEmirates.map(emirate => (
                      <div key={emirate.id} className="border border-[#2a2a2a] rounded-xl overflow-hidden">
                        <div className="bg-[#1a1a1a] px-4 py-3 border-b border-[#2a2a2a]">
                          <span className="text-[#d4933a] font-bold text-sm tracking-wide">{emirate.name}</span>
                        </div>
                        <div className="bg-[#111] p-3 flex flex-wrap gap-2">
                          {catalogCities.filter(c => c.emirate_id === emirate.id).map(city => (
                            <span key={city.id} className="bg-[#222] text-[#e5e5e5] border border-[#333] text-[11px] px-3 py-1.5 rounded-lg">
                              {city.name}
                            </span>
                          ))}
                          {catalogCities.filter(c => c.emirate_id === emirate.id).length === 0 && (
                            <span className="text-[#555] text-xs italic px-2">No cities added yet</span>
                          )}
                        </div>
                      </div>
                    ))}
                    {catalogEmirates.length === 0 && <span className="text-[#666] text-sm">No locations created yet.</span>}
                  </div>
                </div>
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
        <nav className="flex-grow px-4 flex flex-col gap-1 overflow-y-auto pb-6">
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
          <button 
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full bg-[#151515] hover:bg-red-500/10 text-[#888] hover:text-red-400 border border-[#222] hover:border-red-500/30 py-3.5 rounded-xl transition-all text-[13px] font-medium cursor-pointer"
          >
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
