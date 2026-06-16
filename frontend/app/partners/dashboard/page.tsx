"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Briefcase, Tag, Calendar, Pencil, Trash2, Plus, ArrowRight, X } from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";

export default function Dashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [deals, setDeals] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [emirates, setEmirates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // For cascaded dropdown
  const [selectedEmirate, setSelectedEmirate] = useState("");

  // Modals
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showDealModal, setShowDealModal] = useState(false);

  // Form states
  const [serviceForm, setServiceForm] = useState({ title: "", description: "", category_id: "", city_id: "" });
  const [dealForm, setDealForm] = useState({ service_id: "", discount_desc: "", expiry_date: "" });
  const [formError, setFormError] = useState("");

  const [userRole, setUserRole] = useState<string | null>(null);

  const [uploadingImages, setUploadingImages] = useState(false);
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get("/auth/me");
        const role = res.data.role;
        setUserRole(role);

        // Even if they are PARTNER or ADMIN, we should check their profile status
        // But for USERs, they definitely need a check
        if (role !== "ADMIN") {
          try {
            const profRes = await api.get("/partner/profile");
            const status = profRes.data.status;
            if (status === "PENDING" || status === "SUSPENDED") {
              window.location.href = "/verification";
              return;
            }
          } catch (profileErr) {
            if (role === "USER") {
              // No profile and is USER -> should not be in dashboard
              window.location.href = "/partners/becomePartner";
              return;
            }
          }
        }

        if (role !== "PARTNER" && role !== "ADMIN") {
          window.location.href = "/login";
          return;
        }

        fetchData();
      } catch (err) {
        window.location.href = "/login";
      }
    };
    checkAuth();
  }, []);

  const fetchData = async () => {
    try {
      const [profRes, servRes, dealsRes, emRes, cityRes, catRes] = await Promise.all([
        api.get("/partner/profile"),
        api.get("/partner/services"),
        api.get("/partner/deals"),
        api.get("/catalog/emirates"),
        api.get("/catalog/cities"),
        api.get("/catalog/services")
      ]);
      setProfile(profRes.data);
      setServices(servRes.data);
      setDeals(dealsRes.data);
      setEmirates(emRes.data);
      setCities(cityRes.data);
      setCategories(catRes.data);
    } catch (error) {
      console.error("Failed to fetch partner data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (files: File[]) => {
    if (images.length + files.length > 4) {
      setFormError("Maximum 4 images allowed per service.");
      return;
    }
    
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    
    if (!cloudName || !uploadPreset) {
      setFormError("Cloudinary configuration missing in environment variables.");
      return;
    }

    setUploadingImages(true);
    const uploadedUrls: string[] = [];

    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", uploadPreset);

        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (data.secure_url) {
          uploadedUrls.push(data.secure_url);
        }
      }
      setImages((prev) => [...prev, ...uploadedUrls]);
    } catch (err) {
      console.error("Cloudinary upload failed", err);
      setFormError("Failed to upload images.");
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    
    if (services.length >= (profile?.services_limit || 6)) {
      setFormError("You have reached the maximum limit of services.");
      return;
    }

    try {
      await api.post("/partner/services", { ...serviceForm, images });
      setShowServiceModal(false);
      setServiceForm({ title: "", description: "", category_id: "", city_id: "" });
      setImages([]);
      fetchData();
    } catch (err: any) {
      setFormError(err.response?.data?.detail || "Failed to add service");
    }
  };

  const handleAddDeal = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (deals.length >= (profile?.deals_limit || 2)) {
      setFormError("You have reached the maximum limit of deals.");
      return;
    }

    try {
      await api.post("/partner/deals", {
        ...dealForm,
        expiry_date: new Date(dealForm.expiry_date).toISOString()
      });
      setShowDealModal(false);
      fetchData();
    } catch (err: any) {
      setFormError(err.response?.data?.detail || "Failed to add deal");
    }
  };

  const handleDeleteService = async (id: number) => {
    if (confirm("Are you sure you want to delete this service?")) {
      try {
        await api.delete(`/partner/services/${id}`);
        fetchData();
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleDeleteDeal = async (id: number) => {
    if (confirm("Are you sure you want to delete this deal?")) {
      try {
        await api.delete(`/partner/deals/${id}`);
        fetchData();
      } catch (e) {
        console.error(e);
      }
    }
  };

  const STATS = [
    { label: "Services Posted", current: services.length, max: profile?.services_limit || 6, icon: Briefcase },
    { label: "Deals Posted", current: deals.length, max: profile?.deals_limit || 2, icon: Tag },
  ];

  if (!userRole) {
    return <div className="min-h-screen bg-[#0b0a0a] text-[#888] flex items-center justify-center font-sans">Checking authorization...</div>;
  }

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
                    style={{ width: `${stat.max > 0 ? (stat.current / stat.max) * 100 : 0}%` }}
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
                  Exclusive Deals ({deals.length}/{profile?.deals_limit || 2})
                </h2>
                <p className="text-[#888] text-xs sm:text-sm mt-1 font-light">
                  Promote your best services with exclusive offers.
                </p>
              </div>
            </div>
            <button onClick={() => setShowDealModal(true)} disabled={deals.length >= (profile?.deals_limit || 2)} className="cursor-pointer w-full sm:w-auto bg-[#d4933a] hover:bg-[#c28532] disabled:opacity-50 text-white px-5 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(212,147,58,0.2)] hover:shadow-[0_0_25px_rgba(212,147,58,0.4)]">
              <Plus className="w-4 h-4" strokeWidth={2.5} /> Add a new deal
            </button>
          </div>

          {/* Deals Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            {loading ? (
              <div className="text-white">Loading deals...</div>
            ) : deals.length === 0 ? (
              <div className="text-[#888]">No deals posted yet.</div>
            ) : (
              deals.map((deal: any) => (
                <div key={deal.id} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl flex flex-col sm:flex-row overflow-hidden group hover:border-[#d4933a]/50 transition-colors shadow-lg">
                  {/* Content */}
                  <div className="flex flex-col flex-1 p-5 sm:p-6">
                    <h3 className="font-medium text-[16px] mb-1.5 text-white">{deal.service?.title || "Special Deal"}</h3>
                    <p className="text-[#aaa] text-xs sm:text-[13px] mb-4 leading-relaxed font-light">{deal.discount_desc}</p>
                    
                    <div className="flex items-center gap-2 mb-6 text-[#d4933a] text-xs font-medium bg-[#d4933a]/5 w-fit px-3 py-1.5 rounded-lg border border-[#d4933a]/10">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Valid till {new Date(deal.expiry_date).toLocaleDateString()}</span>
                    </div>

                    <div className="mt-auto border-t border-[#2a2a2a] pt-4 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs">
                        <div className={`w-2 h-2 rounded-full ${deal.is_active ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'}`}></div>
                        <span className="text-[#aaa] font-medium">{deal.is_active ? 'Active' : 'Inactive'}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <button onClick={() => handleDeleteDeal(deal.id)} className="cursor-pointer flex items-center gap-1.5 text-xs text-[#888] hover:text-red-400 transition-colors font-medium">
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* All Services Section */}
        <div className="animate-slide-up" style={{ animationDelay: "100ms" }}>
          <div className="flex items-center justify-between mb-6 border-b border-[#222] pb-4">
            <h3 className="text-[#d4933a] font-medium text-[15px] tracking-wide">
              All Services ({services.length})
            </h3>
            <button onClick={() => setShowServiceModal(true)} disabled={services.length >= (profile?.services_limit || 6)} className="cursor-pointer bg-[#222] disabled:opacity-50 hover:bg-[#333] text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all">
              <Plus className="w-3.5 h-3.5" /> Add Service
            </button>
          </div>

          <div className="hidden lg:block bg-[#111111] border border-[#222] rounded-[2rem] overflow-hidden shadow-xl">
            <div className="grid grid-cols-12 gap-4 px-6 py-5 border-b border-[#222] bg-[#151515] text-[#888] text-xs font-bold uppercase tracking-widest">
              <div className="col-span-7">Services</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-3 text-right pr-2">Action</div>
            </div>
            
            <div className="divide-y divide-[#222]">
              {loading ? (
                <div className="p-6 text-white text-center">Loading services...</div>
              ) : services.length === 0 ? (
                <div className="p-6 text-[#888] text-center">No services posted yet.</div>
              ) : services.map((service: any) => (
                <div key={service.id} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-[#151515] transition-colors group">
                  <div className="col-span-7 flex gap-5 items-center pr-4">
                    <div className="w-20 h-14 bg-[#1a1a1a] rounded overflow-hidden">
                      {service.images && service.images.length > 0 ? (
                        <img src={service.images[0]} alt="service" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-[#555]">No Img</div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-[15px] text-white mb-1 truncate">{service.title}</h4>
                      <div className="flex flex-wrap gap-2">
                        <span className="text-[10px] text-[#888] font-medium uppercase tracking-wider bg-[#222] px-2 py-1 rounded-md">
                          {service.description.substring(0, 30)}...
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-span-2 flex items-center gap-2.5">
                    <div className={`w-2 h-2 rounded-full ${service.is_active ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'}`}></div>
                    <span className="text-sm text-[#aaa] font-medium">{service.is_active ? 'Active' : 'Inactive'}</span>
                  </div>
                  
                  <div className="col-span-3 flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleDeleteService(service.id)} className="cursor-pointer bg-[#222] hover:bg-red-500/10 border border-[#333] hover:border-red-500/30 text-white hover:text-red-400 px-4 py-2 rounded-lg flex items-center gap-2 text-xs font-medium transition-all shadow-sm">
                      <Trash2 className="w-3.5 h-3.5 opacity-70" /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Add Service Modal */}
      {showServiceModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-[#111] border border-[#333] rounded-2xl p-6 w-full max-w-md relative">
            <button onClick={() => setShowServiceModal(false)} className="absolute top-4 right-4 text-[#888] hover:text-white"><X /></button>
            <h2 className="text-xl font-medium mb-4 text-white tracking-wide">Add New Service</h2>
            {formError && <div className="text-red-500 text-sm mb-4">{formError}</div>}
            <form onSubmit={handleAddService} className="flex flex-col gap-4">
              <input required placeholder="Listing Title" value={serviceForm.title} onChange={e => setServiceForm({...serviceForm, title: e.target.value})} className="bg-[#1a1a1a] border border-[#333] rounded px-4 py-3 text-white outline-none focus:border-[#d4933a]" />
              <textarea required placeholder="Description" value={serviceForm.description} onChange={e => setServiceForm({...serviceForm, description: e.target.value})} className="bg-[#1a1a1a] border border-[#333] rounded px-4 py-3 text-white outline-none focus:border-[#d4933a] min-h-[100px]" />
              <select required value={serviceForm.category_id} onChange={e => setServiceForm({...serviceForm, category_id: e.target.value})} className="bg-[#1a1a1a] border border-[#333] rounded px-4 py-3 text-[#aaa] outline-none focus:border-[#d4933a]">
                <option value="">Select Global Service...</option>
                {categories.map(c => <option key={c.id} value={c.id} className="text-white">{c.name}</option>)}
              </select>

              <select value={selectedEmirate} onChange={e => {
                setSelectedEmirate(e.target.value);
                setServiceForm({...serviceForm, city_id: ""});
              }} className="bg-[#1a1a1a] border border-[#333] rounded px-4 py-3 text-[#aaa] outline-none focus:border-[#d4933a]">
                <option value="">Select Emirate...</option>
                {emirates.map(e => <option key={e.id} value={e.id} className="text-white">{e.name}</option>)}
              </select>

              <select required disabled={!selectedEmirate} value={serviceForm.city_id} onChange={e => setServiceForm({...serviceForm, city_id: e.target.value})} className="bg-[#1a1a1a] border border-[#333] rounded px-4 py-3 text-[#aaa] outline-none focus:border-[#d4933a] disabled:opacity-50">
                <option value="">Select City...</option>
                {cities.filter(c => c.emirate_id.toString() === selectedEmirate).map(c => <option key={c.id} value={c.id} className="text-white">{c.name}</option>)}
              </select>
              
              <div className="border border-dashed border-[#333] p-4 rounded bg-[#1a1a1a] text-center">
                <input 
                  type="file" 
                  multiple 
                  accept="image/*" 
                  onChange={(e) => {
                    if (e.target.files) handleImageUpload(Array.from(e.target.files));
                  }} 
                  className="hidden" 
                  id="image-upload" 
                />
                <label htmlFor="image-upload" className="cursor-pointer text-[#d4933a] hover:underline text-sm font-medium">
                  {uploadingImages ? "Uploading..." : `Upload Images (${images.length}/4)`}
                </label>
              </div>
              {images.length > 0 && (
                <div className="flex gap-2 flex-wrap mt-2">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative w-16 h-16 rounded overflow-hidden border border-[#333]">
                      <img src={img} alt="preview" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => removeImage(idx)} className="absolute top-1 right-1 bg-black/70 rounded-full p-0.5 hover:bg-red-500/80 text-white"><X className="w-3 h-3" /></button>
                    </div>
                  ))}
                </div>
              )}

              <button type="submit" disabled={uploadingImages || images.length > 4} className="bg-[#d4933a] hover:bg-[#c28532] disabled:opacity-50 text-white py-3 rounded-lg font-bold mt-2">Create Service</button>
            </form>
          </div>
        </div>
      )}

      {/* Add Deal Modal */}
      {showDealModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-[#111] border border-[#333] rounded-2xl p-6 w-full max-w-md relative">
            <button onClick={() => setShowDealModal(false)} className="absolute top-4 right-4 text-[#888] hover:text-white"><X /></button>
            <h2 className="text-xl font-medium mb-4 text-white tracking-wide">Add Exclusive Deal</h2>
            {formError && <div className="text-red-500 text-sm mb-4">{formError}</div>}
            <form onSubmit={handleAddDeal} className="flex flex-col gap-4">
              <select required value={dealForm.service_id} onChange={e => setDealForm({...dealForm, service_id: e.target.value})} className="bg-[#1a1a1a] border border-[#333] rounded px-4 py-3 text-white outline-none focus:border-[#d4933a]">
                <option value="">Select Service...</option>
                {services.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
              </select>
              <textarea required placeholder="Discount Description (e.g. 20% OFF Plumbing)" value={dealForm.discount_desc} onChange={e => setDealForm({...dealForm, discount_desc: e.target.value})} className="bg-[#1a1a1a] border border-[#333] rounded px-4 py-3 text-white outline-none focus:border-[#d4933a] min-h-[100px]" />
              <input required type="date" value={dealForm.expiry_date} onChange={e => setDealForm({...dealForm, expiry_date: e.target.value})} className="bg-[#1a1a1a] border border-[#333] rounded px-4 py-3 text-[#aaa] outline-none focus:border-[#d4933a]" />
              <button type="submit" className="bg-[#d4933a] hover:bg-[#c28532] text-white py-3 rounded-lg font-bold mt-2">Publish Deal</button>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
