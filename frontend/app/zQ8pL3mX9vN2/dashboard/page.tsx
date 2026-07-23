"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import Link from "next/link";
import {
  Home,
  Users,
  CheckSquare,
  FileText,
  BarChart2,
  LogOut,
  Search,
  X,
  User,
  Check,
  Menu,
  Filter,
  ChevronDown,
  Calendar,
  Download,
  PlusCircle,
  ShieldAlert,
  Trash2,
  Eye,
  EyeOff,
  Image as ImageIcon
} from "lucide-react";

import AdsManagement from "./AdsManagement";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const ALL_TABS = [
    { name: "Dashboard", icon: Home, roles: ["ADMIN", "MODERATOR"] },
    { name: "Partners", icon: Users, roles: ["ADMIN", "MODERATOR"] },
    { name: "Verify Partner", icon: CheckSquare, roles: ["ADMIN", "MODERATOR"] },
    { name: "Suspended", icon: X, roles: ["ADMIN", "MODERATOR"] },
    { name: "Users", icon: Users, roles: ["ADMIN"] },
    { name: "Mods", icon: ShieldAlert, roles: ["ADMIN"] },
    { name: "Verify Mods", icon: CheckSquare, roles: ["ADMIN"] },
    { name: "User Logs", icon: FileText, roles: ["ADMIN"] },
    { name: "Analytics", icon: BarChart2, roles: ["ADMIN"] },
    { name: "Ads", icon: ImageIcon, roles: ["ADMIN"] },
    { name: "Add Catalog", icon: PlusCircle, roles: ["ADMIN"] },
  ];

  const [stats, setStats] = useState({ users: 0, partners: 0, services: 0, deals: 0 });
  const [partners, setPartners] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
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

  // Search state for partners
  const [partnerSearch, setPartnerSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [logSearch, setLogSearch] = useState("");
  const [modSearch, setModSearch] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab");
      if (tabParam && ALL_TABS.some(t => t.name === tabParam)) {
        setActiveTab(tabParam);
      }
    }
  }, []);

  useEffect(() => {
    // Auth Guard - run only once
    const checkAuth = async () => {
      try {
        const res = await api.get("/auth/me");
        if (res.data.role !== "ADMIN" && res.data.role !== "MODERATOR") {
          window.location.href = "/login";
        }
        setUserRole(res.data.role);
      } catch (err) {
        window.location.href = "/login";
      }
    };
    if (!userRole) {
      checkAuth();
    }
  }, [userRole]);

  useEffect(() => {
    if (userRole) {
      fetchData();
    }
  }, [activeTab, userRole]);

  const [searchAnalytics, setSearchAnalytics] = useState<any[]>([]);
  const [analyticsTime, setAnalyticsTime] = useState("All Time");
  const [analyticsEmirate, setAnalyticsEmirate] = useState("All");
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [downloadingTime, setDownloadingTime] = useState<string | null>(null);

  const applyAnalyticsFilter = async () => {
    setAnalyticsLoading(true);
    try {
      const res = await api.get(`/admin/search-history?time_period=${analyticsTime}&emirate=${analyticsEmirate}`);
      const agg: Record<string, number> = {};
      res.data.forEach((s: any) => {
        const key = s.query || s.category || 'General Search';
        agg[key] = (agg[key] || 0) + 1;
      });
      const chartData = Object.keys(agg)
        .map(k => ({ label: k, count: agg[k] }))
        .sort((a, b) => b.count - a.count);
      setSearchAnalytics(chartData);
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === "Dashboard") {
        const res = await api.get("/admin/dashboard");
        setStats(res.data);
      } else if (activeTab === "Partners" || activeTab === "Verify Partner" || activeTab === "Suspended") {
        const res = await api.get("/admin/partners");
        setPartners(res.data);
      } else if (activeTab === "Users") {
        const res = await api.get("/admin/users");
        setUsers(res.data);
      } else if (activeTab === "Mods" || activeTab === "Verify Mods") {
        const res = await api.get("/admin/mods");
        setMods(res.data);
      } else if (activeTab === "User Logs") {
        const res = await api.get("/admin/activity-logs");
        setLogs(res.data);
      } else if (activeTab === "Add Catalog") {
        const [emRes, cityRes, servRes] = await Promise.all([
          api.get("/catalog/emirates?include_hidden=true"),
          api.get("/catalog/cities"),
          api.get("/catalog/services")
        ]);
        setCatalogEmirates(emRes.data);
        setCatalogCities(cityRes.data);
        setCatalogServices(servRes.data);
      } else if (activeTab === "Analytics") {
        const res = await api.get(`/admin/search-history?time_period=${analyticsTime}&emirate=${analyticsEmirate}`);
        // Aggregate by Category/Query for basic chart demo
        const agg: Record<string, number> = {};
        res.data.forEach((s: any) => {
          const key = s.query || s.category || 'General Search';
          agg[key] = (agg[key] || 0) + 1;
        });
        const chartData = Object.keys(agg)
          .map(k => ({ label: k, count: agg[k] }))
          .sort((a, b) => b.count - a.count);
        setSearchAnalytics(chartData);
      } else if (activeTab === "Ads") {
        // Ads handles its own fetch
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
    if (confirm("Are you sure you want to verify this partner?")) {
      try {
        await api.patch(`/admin/verify/${id}`);
        setActiveTab("Partners");
        fetchData();
      } catch (e) {
        console.error(e);
      }
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
    if (confirm("Are you sure you want to verify this mod?")) {
      try {
        await api.patch(`/admin/mods/verify/${id}`);
        fetchData();
      } catch (e) {
        console.error(e);
      }
    }
  };

  const banMod = async (id: number) => {
    if (confirm("Are you sure you want to change the ban status of this moderator?")) {
      try {
        await api.patch(`/admin/mods/ban/${id}`);
        fetchData();
      } catch (e) {
        console.error(e);
      }
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
      setCatalogMsg({ type: "success", text: "Area added successfully" });
      setCityName("");
      fetchData();
    } catch (e) {
      setCatalogMsg({ type: "error", text: "Failed to add area" });
    }
  };

  const deleteCategory = async (id: number) => {
    if (confirm("Are you sure you want to delete this service category? All partner services and deals offering this category will be deleted permanently.")) {
      try {
        await api.delete(`/admin/categories/${id}`);
        setCatalogMsg({ type: "success", text: "Global Service deleted successfully" });
        fetchData();
      } catch (e) {
        setCatalogMsg({ type: "error", text: "Failed to delete service category" });
      }
    }
  };

  const deleteEmirate = async (id: number) => {
    if (confirm("Are you sure you want to delete this emirate? All areas under this emirate, as well as partner services and deals in those areas, will be deleted permanently.")) {
      try {
        await api.delete(`/admin/emirates/${id}`);
        setCatalogMsg({ type: "success", text: "Emirate deleted successfully" });
        fetchData();
      } catch (e) {
        setCatalogMsg({ type: "error", text: "Failed to delete emirate" });
      }
    }
  };

  const toggleEmirateVisibility = async (id: number) => {
    const originalEmirates = [...catalogEmirates];
    setCatalogEmirates(prev =>
      prev.map(e => e.id === id ? { ...e, is_visible: !e.is_visible } : e)
    );
    try {
      const res = await api.put(`/admin/emirates/${id}/toggle-visibility`);
      setCatalogEmirates(prev =>
        prev.map(e => e.id === id ? { ...e, is_visible: res.data.is_visible } : e)
      );
    } catch (err) {
      setCatalogEmirates(originalEmirates);
      setCatalogMsg({ type: "error", text: "Failed to update Emirate visibility" });
    }
  };

  const deleteCity = async (id: number) => {
    if (confirm("Are you sure you want to delete this city?")) {
      try {
        await api.delete(`/admin/cities/${id}`);
        fetchData();
      } catch (e) {
        console.error(e);
      }
    }
  };

  const exportUsersCSV = () => {
    setDownloadingTime("Users List");
    setTimeout(() => {
      try {
        const sortedUsers = [...users]
          .filter((u: any) =>
            (u.full_name || "").toLowerCase().includes(userSearch.toLowerCase()) ||
            (u.email || "").toLowerCase().includes(userSearch.toLowerCase())
          )
          .sort((a, b) => (a.full_name || "").localeCompare(b.full_name || ""));

        const headers = ["ID", "Username", "Email", "Phone Number", "Role", "Created At"];
        const csvContent = [
          headers.join(","),
          ...sortedUsers.map((u: any) => `${u.id},"${u.full_name || ""}","${u.email || ""}","${u.phone_number || ""}","${u.role || ""}","${u.created_at || ""}"`)
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "users_export.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (e) {
        console.error(e);
      } finally {
        setDownloadingTime(null);
      }
    }, 600);
  };

  const downloadSearches = async (timePeriod: string) => {
    setDownloadingTime(timePeriod);
    try {
      const res = await api.get(`/admin/search-history?time_period=${timePeriod}&emirate=${analyticsEmirate}`);
      const headers = ["ID", "User Role", "Username", "Email", "Phone", "Query", "Category", "Emirate", "City", "Timestamp"];
      const csvContent = [
        headers.join(","),
        ...res.data.map((row: any) => 
          `${row.id},"${row.user_role || "Guest"}","${row.username || "Guest"}","${row.email || "Guest"}","${row.phone || "Guest"}","${row.query || ""}","${row.category || ""}","${row.emirate || ""}","${row.city || ""}","${row.timestamp}"`
        )
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `search_history_${timePeriod.replace(/\s+/g, '_')}_${analyticsEmirate}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error(e);
    } finally {
      setTimeout(() => {
        setDownloadingTime(null);
      }, 600);
    }
  };

  if (!userRole) {
    return (
      <div className="min-h-screen bg-[#0b0a0a] flex items-center justify-center text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#d4933a]"></div>
      </div>
    );
  }

  const renderContent = () => {
    if (loading && activeTab !== "Ads") {
      switch (activeTab) {
        case "Dashboard":
          return (
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-[#1f2022] rounded-lg w-1/4 mb-8"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-32 bg-[#1f2022] rounded-xl"></div>
                ))}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                <div className="h-96 bg-[#1f2022] rounded-xl"></div>
                <div className="h-96 bg-[#1f2022] rounded-xl"></div>
              </div>
            </div>
          );
        case "Partners":
        case "Users":
          return (
            <div className="animate-pulse space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div className="h-8 bg-[#1f2022] rounded-lg w-1/4"></div>
                <div className="h-10 bg-[#1f2022] rounded-lg w-32"></div>
              </div>
              <div className="h-12 bg-[#1f2022] rounded-xl w-full mb-6"></div>
              <div className="bg-[#1f2022] rounded-xl p-6 space-y-4">
                <div className="h-6 bg-[#2a2b2d] rounded w-full"></div>
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-14 bg-[#222325] rounded-lg w-full"></div>
                ))}
              </div>
            </div>
          );
        case "Mods":
          return (
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-[#1f2022] rounded-lg w-1/4 mb-8"></div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 h-80 bg-[#1f2022] rounded-xl"></div>
                <div className="lg:col-span-2 bg-[#1f2022] rounded-xl p-6 space-y-4">
                  <div className="h-6 bg-[#2a2b2d] rounded w-full"></div>
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-14 bg-[#222325] rounded-lg w-full"></div>
                  ))}
                </div>
              </div>
            </div>
          );
        case "User Logs":
          return (
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-[#1f2022] rounded-lg w-1/4 mb-8"></div>
              <div className="h-12 bg-[#1f2022] rounded-xl w-full mb-6"></div>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-20 bg-[#1f2022] rounded-xl w-full"></div>
                ))}
              </div>
            </div>
          );
        case "Add Catalog":
          return (
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-[#1f2022] rounded-lg w-1/4 mb-8"></div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="h-96 bg-[#1f2022] rounded-xl"></div>
                <div className="h-96 bg-[#1f2022] rounded-xl"></div>
              </div>
            </div>
          );
        case "Analytics":
          return (
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-[#1f2022] rounded-lg w-1/4 mb-8"></div>
              {/* Filter Placeholder */}
              <div className="h-32 bg-[#1f2022] rounded-xl w-full mb-6"></div>
              {/* Graph Container Placeholder */}
              <div className="h-[360px] bg-[#1f2022] rounded-xl w-full mb-6"></div>
              {/* Download Section Placeholder */}
              <div className="h-64 bg-[#1f2022] rounded-xl w-full"></div>
            </div>
          );
        default:
          return (
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-[#1f2022] rounded-lg w-1/4 mb-4"></div>
              <div className="h-64 bg-[#1f2022] rounded-xl w-full"></div>
            </div>
          );
      }
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
        const filteredAndSortedPartners = partners
          .filter(p => p.status === "VERIFIED" || p.status === "BANNED")
          .filter(p => {
            const searchLower = partnerSearch.toLowerCase();
            const name = (p.business_name || `${p.first_name} ${p.last_name}`).toLowerCase();
            const idString = String(p.id);
            return name.includes(searchLower) || idString.includes(searchLower);
          })
          .sort((a, b) => {
            const nameA = (a.business_name || `${a.first_name} ${a.last_name}`).toLowerCase();
            const nameB = (b.business_name || `${b.first_name} ${b.last_name}`).toLowerCase();
            return nameA.localeCompare(nameB);
          });

        return (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-medium mb-8 text-white tracking-wide">Partners Management</h2>

            <div className="mb-6 relative w-full sm:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888]" />
              <input
                type="text"
                placeholder="Search by Name or ID..."
                value={partnerSearch}
                onChange={(e) => setPartnerSearch(e.target.value)}
                className="w-full bg-[#151515] border border-[#333] focus:border-[#d4933a] rounded-xl pl-10 pr-4 py-3 text-white outline-none text-[13px] transition-colors"
              />
            </div>

            <div className="flex flex-col gap-3">
              {filteredAndSortedPartners.map((p) => (
                <div key={p.id} className="bg-[#151515] border border-[#222] rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between hover:bg-[#1a1a1a] transition-colors gap-4">
                  <div>
                    <span className="text-[#888] text-[12px] font-mono mr-3">ID: {p.id}</span>
                    <span className="text-white text-[15px]">{p.business_name || `${p.first_name} ${p.last_name}`}</span>
                    <span className={`ml-3 text-xs px-2 py-1 rounded text-white ${p.status === 'VERIFIED' ? 'bg-green-500/20 text-green-400' : p.status === 'BANNED' ? 'bg-red-500/20 text-red-400' : 'bg-white/10 text-gray-300'}`}>
                      {p.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/zQ8pL3mX9vN2/dashboard/partner/${p.id}`} className="bg-[#222] hover:bg-[#333] border border-[#333] hover:border-[#d4933a] text-[#888] hover:text-[#d4933a] px-4 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all">
                      View Details
                    </Link>
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
                <div key={p.id} className="bg-[#151515] border border-[#222] rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between hover:bg-[#1a1a1a] transition-colors gap-4">
                  <div>
                    <span className="text-[#888] text-[12px] font-mono mr-3">ID: {p.id}</span>
                    <span className="text-white text-[15px]">{p.business_name || `${p.first_name} ${p.last_name}`}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/zQ8pL3mX9vN2/dashboard/partner/${p.id}`} className="bg-[#222] hover:bg-[#333] border border-[#333] hover:border-[#d4933a] text-[#888] hover:text-[#d4933a] px-4 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all">
                      View Details
                    </Link>
                    <button onClick={() => verifyPartner(p.id)} className="bg-green-500 hover:bg-green-600 text-white px-4 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-colors">
                      Un-suspend
                    </button>
                  </div>
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
                <div key={p.id} className="bg-[#151515] border border-[#222] rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between hover:bg-[#1a1a1a] transition-colors gap-4">
                  <div>
                    <span className="text-[#888] text-[12px] font-mono mr-3">ID: {p.id}</span>
                    <span className="text-white text-[15px]">{p.business_name || `${p.first_name} ${p.last_name}`}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/zQ8pL3mX9vN2/dashboard/partner/${p.id}`} className="bg-[#222] hover:bg-[#333] border border-[#333] hover:border-[#d4933a] text-[#888] hover:text-[#d4933a] px-4 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all">
                      View Details
                    </Link>
                    <button onClick={() => verifyPartner(p.id)} className="bg-green-500 hover:bg-green-600 text-white px-4 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-colors">
                      Approve
                    </button>
                  </div>
                </div>
              ))}
              {partners.filter(p => p.status === "PENDING").length === 0 && (
                <div className="text-gray-500 text-sm">No pending partners.</div>
              )}
            </div>
          </div>
        );

      case "Users":
        return (
          <div className="animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div>
                <h1 className="text-3xl font-bold text-white tracking-wide font-serif mb-2">Users Directory</h1>
                <p className="text-[#888] text-sm">View, search, and export standard users</p>
              </div>
              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                  <Search className="w-4 h-4 text-[#888] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="w-full bg-[#1c1c1c] border border-[#333] text-white rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-[#d4933a]"
                  />
                </div>
                <button
                  onClick={exportUsersCSV}
                  className="flex items-center gap-2 bg-[#1c1c1c] hover:bg-[#2a2a2a] border border-[#333] text-[#d4933a] px-4 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Export</span>
                </button>
              </div>
            </div>

            <div className="bg-[#151515] border border-[#222] rounded-3xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="bg-[#1a1a1a] border-b border-[#222]">
                      <th className="p-5 text-[#888] font-semibold text-xs uppercase tracking-wider w-20">ID</th>
                      <th className="p-5 text-[#888] font-semibold text-xs uppercase tracking-wider">Username</th>
                      <th className="p-5 text-[#888] font-semibold text-xs uppercase tracking-wider">Email</th>
                      <th className="p-5 text-[#888] font-semibold text-xs uppercase tracking-wider">Phone Number</th>
                      <th className="p-5 text-[#888] font-semibold text-xs uppercase tracking-wider">Role</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#222]">
                    {[...users]
                      .filter((u: any) =>
                        (u.full_name || "").toLowerCase().includes(userSearch.toLowerCase()) ||
                        (u.email || "").toLowerCase().includes(userSearch.toLowerCase())
                      )
                      .sort((a, b) => (a.full_name || "").localeCompare(b.full_name || ""))
                      .map((u: any) => (
                        <tr key={u.id} className="hover:bg-[#1a1a1a] transition-colors">
                          <td className="p-5 text-[#aaa] font-medium text-sm">#{u.id}</td>
                          <td className="p-5">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-[#222] flex items-center justify-center shrink-0 border border-[#333]">
                                <User className="w-4 h-4 text-[#888]" />
                              </div>
                              <span className="text-white font-medium text-sm">{u.full_name || "N/A"}</span>
                            </div>
                          </td>
                          <td className="p-5">
                            <span className="text-[#888] text-sm">{u.email}</span>
                          </td>
                          <td className="p-5">
                            <span className="text-[#888] text-sm">{u.phone_number || "N/A"}</span>
                          </td>
                          <td className="p-5">
                            <span className={`text-xs px-2 py-1 rounded font-medium ${u.role === 'PARTNER' ? 'bg-[#d4933a]/20 text-[#d4933a]' : 'bg-[#222] text-[#888]'}`}>
                              {u.role || 'USER'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    {users.length === 0 && (
                      <tr>
                        <td colSpan={3} className="p-10 text-center text-[#888] text-sm">
                          No users found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case "Mods":
        const filteredMods = mods.filter(m => m.is_active || m.is_banned).filter(m => {
          const searchLower = modSearch.toLowerCase();
          const name = (m.full_name || "").toLowerCase();
          const email = (m.email || "").toLowerCase();
          const idString = String(m.id);
          return name.includes(searchLower) || email.includes(searchLower) || idString.includes(searchLower);
        });

        return (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-medium mb-8 text-white tracking-wide">Current & Banned Moderators</h2>

            <div className="mb-6 relative w-full sm:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888]" />
              <input
                type="text"
                placeholder="Search by Name, Email, or ID..."
                value={modSearch}
                onChange={(e) => setModSearch(e.target.value)}
                className="w-full bg-[#151515] border border-[#333] focus:border-[#d4933a] rounded-xl pl-10 pr-4 py-3 text-white outline-none text-[13px] transition-colors"
              />
            </div>

            <div className="flex flex-col gap-3">
              {filteredMods.map((m) => {
                let statusBadge: React.ReactNode = null;
                if (m.is_banned) {
                  statusBadge = <span className="ml-3 text-xs px-2 py-1 rounded bg-red-500/20 text-red-400">Banned</span>;
                } else {
                  statusBadge = <span className="ml-3 text-xs px-2 py-1 rounded bg-green-500/20 text-green-400">Active</span>;
                }

                return (
                  <div key={m.id} className="bg-[#151515] border border-[#222] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-[#1a1a1a] transition-colors gap-4">
                    <div>
                      <span className="text-[#888] text-[12px] font-mono mr-3">ID: {m.id}</span>
                      <span className="text-white text-[15px]">{m.full_name || m.email} <span className="text-gray-500 text-xs ml-2">({m.email})</span></span>
                      {statusBadge}
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={() => banMod(m.id)} className={`${m.is_banned ? 'bg-gray-600 hover:bg-gray-700' : 'bg-red-500 hover:bg-red-600'} text-white px-4 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-colors`}>
                        {m.is_banned ? 'Unban' : 'Ban'}
                      </button>
                    </div>
                  </div>
                );
              })}
              {filteredMods.length === 0 && (
                <div className="text-gray-500 text-sm">No moderators found.</div>
              )}
            </div>
          </div>
        );

      case "Verify Mods":
        return (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-medium mb-8 text-white tracking-wide">Pending Moderators</h2>
            <div className="flex flex-col gap-3">
              {mods.filter(m => !m.is_active && !m.is_banned).map((m) => (
                <div key={m.id} className="bg-[#151515] border border-[#222] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0 hover:bg-[#1a1a1a] transition-colors">
                  <div>
                    <span className="text-[#888] text-[12px] font-mono mr-3">ID: {m.id}</span>
                    <span className="text-white text-[15px]">{m.full_name || m.email} <span className="text-gray-500 text-xs ml-2">({m.email})</span></span>
                    <span className="ml-3 text-xs px-2 py-1 rounded bg-yellow-500/20 text-yellow-400">Pending</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => verifyMod(m.id)} className="bg-green-500 hover:bg-green-600 text-white px-4 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-colors flex items-center gap-2">
                      <Check className="w-4 h-4" strokeWidth={3} /> Approve
                    </button>
                    <button onClick={() => banMod(m.id)} className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-colors">
                      Reject / Ban
                    </button>
                  </div>
                </div>
              ))}
              {mods.filter(m => !m.is_active && !m.is_banned).length === 0 && (
                <div className="text-gray-500 text-sm">No pending moderators.</div>
              )}
            </div>
          </div>
        );

      case "User Logs":
        const filteredLogs = logs.filter(l => {
          const searchLower = logSearch.toLowerCase();
          const action = (l.action || "").toLowerCase();
          const desc = (l.description || "").toLowerCase();
          const actor = (l.actor_name || "").toLowerCase();
          const partnerName = (l.target_partner_name || "").toLowerCase();
          const actorId = String(l.actor_id || "").toLowerCase();
          const partnerId = String(l.target_partner_id || "").toLowerCase();
          const userId = String(l.user_id || "").toLowerCase();

          return action.includes(searchLower) ||
            desc.includes(searchLower) ||
            actor.includes(searchLower) ||
            partnerName.includes(searchLower) ||
            actorId.includes(searchLower) ||
            partnerId.includes(searchLower) ||
            userId.includes(searchLower);
        });

        return (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-medium mb-8 text-white tracking-wide">Activity Logs</h2>

            {/* Search Input */}
            <div className="mb-6 relative w-full sm:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888]" />
              <input
                type="text"
                placeholder="Search by Action, Mod, Partner, ID..."
                value={logSearch}
                onChange={(e) => setLogSearch(e.target.value)}
                className="w-full bg-[#151515] border border-[#333] focus:border-[#d4933a] rounded-xl pl-10 pr-4 py-3 text-white outline-none text-[13px] transition-colors"
              />
            </div>

            <div className="flex flex-col gap-3">
              {filteredLogs.map((l) => {
                let actorRoleDisplay = l.actor_role === "ADMIN" ? "admin" : (l.actor_role === "MODERATOR" ? "mod" : "system");
                const actorNameStr = l.actor_name && l.actor_name !== "System" ? l.actor_name : "System";
                const actorIdStr = l.actor_id ? l.actor_id : "N/A";

                const actorPrefix = l.actor_role === "ADMIN" ? "admin" : `${actorRoleDisplay} - (${actorNameStr} - (${actorIdStr}))`;

                let mainText = "";
                if (l.target_partner_name) {
                  let actionText = (l.action || "").toLowerCase().replace(/_/g, ' ');
                  if (l.action === "VERIFY_PARTNER") actionText = "verified";
                  else if (l.action === "SUSPEND_PARTNER") actionText = "suspended";
                  else if (l.action === "BAN_PARTNER") actionText = "banned";

                  mainText = `${actorPrefix} ${actionText} (${l.target_partner_name} - (${l.target_partner_id}))`;
                } else {
                  mainText = `${actorPrefix} performed action`;
                }

                return (
                  <div key={l.id} className="bg-[#151515] border border-[#222] rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0 hover:bg-[#1a1a1a] transition-colors shadow-sm">
                    <div className="flex flex-col gap-1 text-[#e5e5e5] text-[14px] sm:text-[15px] font-sans">
                      <div className="font-medium text-white/90">
                        {mainText}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-bold text-[#d4933a] text-xs tracking-wider">[{l.action}]</span>
                        <span className="text-[#888] text-xs truncate max-w-[300px] sm:max-w-md">{l.description}</span>
                      </div>
                    </div>
                    <span className="text-[#888] text-[11px] sm:text-[12px] uppercase tracking-wider shrink-0 pl-0 sm:pl-4">
                      {new Date(l.timestamp).toLocaleString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                );
              })}
              {filteredLogs.length === 0 && (
                <div className="text-gray-500 text-sm pl-2">No matching logs found.</div>
              )}
            </div>
          </div>
        );

      case "Analytics":
        const actualMax = Math.max(...searchAnalytics.map(s => s.count), 0);
        let maxSearches = 10;
        if (actualMax > 0) {
          if (actualMax <= 10) maxSearches = 10;
          else if (actualMax <= 50) maxSearches = 50;
          else if (actualMax <= 100) maxSearches = 100;
          else if (actualMax <= 200) maxSearches = 200;
          else if (actualMax <= 500) maxSearches = 500;
          else if (actualMax <= 1000) maxSearches = 1000;
          else maxSearches = Math.ceil(actualMax / 500) * 500;
        }
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
                  <select 
                    value={analyticsTime}
                    onChange={(e) => setAnalyticsTime(e.target.value)}
                    className="w-full bg-[#111] border border-[#333] rounded-lg py-3 px-4 text-white outline-none focus:border-[#d4933a] appearance-none cursor-pointer"
                    style={{ cursor: "pointer" }}
                  >
                    <option>Today</option>
                    <option>This Week</option>
                    <option>This Month</option>
                    <option>This Year</option>
                    <option>All Time</option>
                  </select>
                </div>
                <div className="flex-1 w-full">
                  <label className="text-[#888] text-[10px] uppercase font-bold tracking-widest mb-2 block">EMIRATES</label>
                  <select 
                    value={analyticsEmirate}
                    onChange={(e) => setAnalyticsEmirate(e.target.value)}
                    className="w-full bg-[#111] border border-[#333] rounded-lg py-3 px-4 text-white outline-none focus:border-[#d4933a] appearance-none cursor-pointer"
                    style={{ cursor: "pointer" }}
                  >
                    <option>All</option>
                    <option>Dubai</option>
                    <option>Abu Dhabi</option>
                    <option>Sharjah</option>
                  </select>
                </div>
                <button 
                  onClick={applyAnalyticsFilter}
                  disabled={analyticsLoading}
                  className="bg-[#d4933a] hover:bg-[#c28532] text-white py-3 px-8 rounded-lg font-bold transition-all h-[46px] whitespace-nowrap cursor-pointer flex items-center justify-center min-w-[150px] disabled:opacity-50"
                >
                  {analyticsLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  ) : (
                    "Apply Filter"
                  )}
                </button>
              </div>
            </div>

            {/* Search Per Service Graph */}
            <div className="bg-[#1f2022] border border-[#2e2f31] rounded-xl p-8 pb-6 mt-6 relative overflow-hidden">
              {/* Spinner Overlay */}
              {(loading || analyticsLoading) && (
                <div className="absolute inset-0 bg-[#1f2022]/85 backdrop-blur-[2px] z-20 flex flex-col items-center justify-center gap-3">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#d4933a]"></div>
                  <span className="text-[#d4933a] text-sm font-medium tracking-wide">Loading search metrics...</span>
                </div>
              )}

              <h3 className="text-[#d4933a] text-xl font-medium mb-1">Search Per Service</h3>
              <p className="text-[#888] text-xs mb-12">Total Number of Searches for each services</p>

              <div className="relative h-[290px] w-full mt-8">
                {/* Y-axis lines (Grid spans exactly 250px height) */}
                <div className="absolute top-0 left-0 right-0 h-[250px] flex flex-col justify-between pointer-events-none">
                  {[maxSearches, Math.round(maxSearches * 0.8), Math.round(maxSearches * 0.6), Math.round(maxSearches * 0.4), Math.round(maxSearches * 0.2), 0].map((val, i) => (
                    <div key={i} className="flex items-center w-full">
                      <span className="w-12 text-[#888] text-[10px] text-right pr-4">{val}</span>
                      <div className="flex-1 border-t border-[#333]"></div>
                    </div>
                  ))}
                </div>

                {/* Bars container (Scroll area covers full 290px, shifted left-16 to avoid Y-axis overlap) */}
                <div className="absolute top-0 bottom-0 left-16 right-0 flex items-start justify-start gap-4 pr-4 overflow-x-auto scrollbar-hide h-[290px]">
                  {searchAnalytics.length === 0 ? (
                    <div className="absolute inset-0 flex items-center justify-center text-[#888] text-sm">
                      No search data available.
                    </div>
                  ) : (
                    searchAnalytics.map((item, idx) => {
                      let heightPct = 0;
                      if (item.count > 0) {
                        heightPct = Math.max((item.count / maxSearches) * 100, 5); // min 5% height to be visible
                      }

                      return (
                        <div key={idx} className="relative flex flex-col items-center h-[290px] w-20 min-w-[90px] group">
                          {/* Container for count and bar to keep baseline aligned to 0 line */}
                          <div className="h-[250px] w-full flex flex-col justify-end items-center">
                            {/* Count text */}
                            <span className="text-white text-xs mb-2 font-medium">{item.count}</span>
                            
                            {/* Yellow Bar */}
                            <div
                              className="w-full bg-[#d4933a] rounded-t-sm transition-all duration-1000 ease-out shadow-[0_-2px_10px_rgba(212,147,58,0.2)]"
                              style={{ height: `${heightPct * 0.8}%` }}
                            ></div>
                          </div>
                          
                          {/* Service Label (Placed below the 0 baseline) */}
                          <div className="h-[40px] flex items-start justify-center mt-2 w-full">
                            <span 
                              className="text-[#d2d2d2] text-[11px] font-medium text-center w-full line-clamp-2 px-1 break-words cursor-help" 
                              title={item.label}
                            >
                              {item.label}
                            </span>
                          </div>
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
                  { title: "Today", timePeriod: "Today", desc: "Download today's search data" },
                  { title: "This week", timePeriod: "This Week", desc: "Download this week's search data" },
                  { title: "This Month", timePeriod: "This Month", desc: "Download this month's search data" },
                  { title: "This Year", timePeriod: "This Year", desc: "Download this year's search data" },
                  { title: "All time", timePeriod: "All Time", desc: "Download all time search data" }
                ].map((card, i) => (
                  <div key={i} className="border border-[#333] rounded-xl p-5 flex flex-col items-center text-center bg-[#18191a]">
                    <div className="w-10 h-10 rounded-full border border-[#d4933a]/50 text-[#d4933a] flex items-center justify-center mb-4 bg-[#d4933a]/10">
                      <Calendar className="w-4 h-4" strokeWidth={2} />
                    </div>
                    <h4 className="text-white text-sm font-medium mb-1">{card.title}</h4>
                    <p className="text-[#888] text-[10px] mb-5 h-8 leading-tight">{card.desc}</p>
                    <button
                      onClick={() => downloadSearches(card.timePeriod)}
                      disabled={downloadingTime !== null}
                      className="w-full bg-[#222] border border-[#333] hover:border-[#d4933a] hover:text-[#d4933a] text-[#888] py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {downloadingTime === card.timePeriod ? "Downloading..." : "Download"} <Download className="w-3.5 h-3.5" />
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
              <div className={`mb-6 p-4 rounded-xl border flex items-center gap-3 ${catalogMsg.type === 'success'
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
                      <div key={s.id} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-3 flex items-center justify-between gap-4">
                        <div className="flex flex-col gap-1">
                          <span className="text-white text-sm font-medium">{s.name}</span>
                          {s.description && <span className="text-[#888] text-[11px]">{s.description}</span>}
                        </div>
                        <button
                          onClick={() => deleteCategory(s.id)}
                          className="text-[#888] hover:text-[#ff4d4d] hover:bg-[#252525] p-1.5 rounded-lg transition-colors shrink-0"
                          title="Delete Service Category"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
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

                {/* Add Area Form */}
                <div className="bg-[#151515] border border-[#222] rounded-2xl p-6 shadow-lg">
                  <h3 className="text-[#d4933a] text-lg font-medium mb-1">Areas</h3>
                  <p className="text-[#888] text-xs mb-6">Add specific areas within an Emirate.</p>

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
                        <label className="text-[#888] text-[10px] uppercase font-bold tracking-widest mb-1.5 block pl-1">Area Name</label>
                        <input value={cityName} onChange={e => setCityName(e.target.value)} required placeholder="e.g. Marina" className="w-full bg-[#111] border border-[#333] focus:border-[#d4933a] rounded-xl px-4 py-3 text-white outline-none text-[13px] transition-colors" />
                      </div>
                    </div>
                    <button type="submit" className="mt-2 bg-[#d4933a] hover:bg-[#c28532] text-white py-3 rounded-xl text-[14px] font-bold transition-colors w-full sm:w-auto self-end px-8">
                      Add Area
                    </button>
                  </form>
                </div>

                {/* List Emirates & Cities */}
                <div className="bg-[#151515] border border-[#222] rounded-2xl p-6 shadow-lg">
                  <h3 className="text-white text-[15px] font-medium mb-4">Locations Directory</h3>
                  <div className="flex flex-col gap-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {catalogEmirates.map(emirate => (
                      <div key={emirate.id} className="border border-[#2a2a2a] rounded-xl overflow-hidden shrink-0">
                        <div className="bg-[#1a1a1a] px-4 py-3 border-b border-[#2a2a2a] flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className={`font-bold text-sm tracking-wide ${emirate.is_visible ? "text-[#d4933a]" : "text-white/40 line-through"}`}>{emirate.name}</span>
                            {!emirate.is_visible && (
                              <span className="text-[10px] bg-red-500/10 text-red-500 border border-red-500/20 px-1.5 py-0.5 rounded-md font-medium">Hidden</span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => toggleEmirateVisibility(emirate.id)}
                              className={`relative inline-flex h-5.5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none mr-1.5 self-center ${emirate.is_visible ? "bg-[#d4933a]" : "bg-[#252525]"
                                }`}
                              title={emirate.is_visible ? "Hide Emirate from site" : "Show Emirate on site"}
                            >
                              <span
                                className={`pointer-events-none inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${emirate.is_visible ? "translate-x-4.5" : "translate-x-0"
                                  }`}
                              />
                            </button>
                            <button
                              onClick={() => deleteEmirate(emirate.id)}
                              className="text-[#888] hover:text-[#ff4d4d] hover:bg-[#252525] p-1.5 rounded-lg transition-colors"
                              title="Delete Emirate"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div className="bg-[#111] p-3 flex flex-wrap gap-2">
                          {catalogCities.filter(c => c.emirate_id === emirate.id).map(city => (
                            <span key={city.id} className="bg-[#222] text-[#e5e5e5] border border-[#333] text-[11px] pl-3 pr-2 py-1.5 rounded-lg flex items-center gap-1.5">
                              <span>{city.name}</span>
                              <button
                                onClick={() => deleteCity(city.id)}
                                className="text-gray-500 hover:text-[#ff4d4d] hover:bg-[#333] p-0.5 rounded transition-colors"
                                title="Delete Area"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </span>
                          ))}
                          {catalogCities.filter(c => c.emirate_id === emirate.id).length === 0 && (
                            <span className="text-[#555] text-xs italic px-2">No areas added yet</span>
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

      case "Ads":
        return <AdsManagement />;

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
        <Link href="/">
          <h1 className="text-xl font-bold italic tracking-wide cursor-pointer hover:opacity-80 transition-opacity">
            <span className="text-white">SERV</span><span className="text-[#d4933a]">IZ</span>
          </h1>
        </Link>
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
          <Link href="/">
            <h1 className="text-[28px] font-bold italic tracking-wide cursor-pointer hover:opacity-80 transition-opacity">
              <span className="text-white">SERV</span><span className="text-[#d4933a]">IZ</span>
            </h1>
          </Link>
        </div>

        <div className="p-8 lg:hidden mt-12 border-b border-[#222] mb-4">
          <span className="text-[#888] text-[10px] uppercase tracking-widest font-bold">Menu</span>
        </div>

        {/* Navigation */}
        <nav className="flex-grow px-4 flex flex-col gap-1 overflow-y-auto pb-6">
          {ALL_TABS.filter(tab => userRole && tab.roles.includes(userRole)).map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.name;
            return (
              <button
                key={tab.name}
                onClick={() => {
                  setActiveTab(tab.name);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-4 px-6 py-4 transition-all duration-200 border-l-[3px]
                  ${isActive
                    ? "bg-[#d4933a]/10 text-[#d4933a] border-[#d4933a] font-medium"
                    : "text-[#888] border-transparent hover:bg-[#1a1a1a] hover:text-white"
                  }`}
              >
                <Icon className="w-[18px] h-[18px]" />
                <span className="text-[14px] tracking-wide">{tab.name}</span>
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

      {/* Download Loader Overlay */}
      {downloadingTime && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-[9999] flex flex-col items-center justify-center gap-3">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#d4933a]"></div>
          <span className="text-white text-base font-medium tracking-wide">Preparing your search history report for {downloadingTime}...</span>
        </div>
      )}

    </div>
  );
}
