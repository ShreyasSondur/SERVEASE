"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Briefcase, Tag, Calendar, Pencil, Trash2, Plus, ArrowRight, X, Upload } from "lucide-react";
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
  const [showEditServiceModal, setShowEditServiceModal] = useState(false);
  const [showDealModal, setShowDealModal] = useState(false);

  // Form states
  const [serviceForm, setServiceForm] = useState({ title: "", description: "", category_id: "", city_id: "", emergency_service: "Available 24/7", provider_type: "Licensed Company" });
  const [images, setImages] = useState<string[]>([]);
  
  // Edit Form states
  const [editingServiceId, setEditingServiceId] = useState<number | null>(null);
  const [editServiceForm, setEditServiceForm] = useState({ title: "", description: "", category_id: "", city_id: "", emergency_service: "", provider_type: "" });
  const [editImages, setEditImages] = useState<string[]>([]);
  const [selectedEditEmirate, setSelectedEditEmirate] = useState("");

  // Deal Form states
  const [dealForm, setDealForm] = useState({
    title: "",
    description: "",
    category_id: "",
    city_id: "",
    discount_desc: "",
    expiry_date: ""
  });
  const [dealImages, setDealImages] = useState<string[]>([]);
  const [selectedDealEmirate, setSelectedDealEmirate] = useState("");

  const [formError, setFormError] = useState("");
  const [userRole, setUserRole] = useState<string | null>(null);
  const [uploadingImages, setUploadingImages] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get("/auth/me");
        const role = res.data.role;
        setUserRole(role);

        if (role !== "PARTNER" && role !== "ADMIN") {
          if (role === "USER") {
            window.location.href = "/partners/becomePartner";
          } else {
            window.location.href = "/login";
          }
          return;
        }

        if (role === "PARTNER") {
          try {
            const profRes = await api.get("/partner/profile");
            const status = profRes.data.status;
            if (status === "PENDING" || status === "SUSPENDED" || status === "BANNED") {
              window.location.href = "/verification";
              return;
            }
          } catch (profileErr) {
            window.location.href = "/partners/becomePartner";
            return;
          }
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

  const handleImageUploadGeneric = async (
    files: File[], 
    currentList: string[], 
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (currentList.length + files.length > 4) {
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
      setter((prev) => [...prev, ...uploadedUrls]);
    } catch (err) {
      console.error("Cloudinary upload failed", err);
      setFormError("Failed to upload images.");
    } finally {
      setUploadingImages(false);
    }
  };

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    
    if (services.length >= (profile?.services_limit || 6)) {
      setFormError("You have reached the maximum limit of services.");
      return;
    }

    try {
      await api.post("/partner/services", {
        title: serviceForm.title,
        description: serviceForm.description,
        category_id: parseInt(serviceForm.category_id),
        city_id: parseInt(serviceForm.city_id),
        images,
        emergency_service: serviceForm.emergency_service,
        provider_type: serviceForm.provider_type
      });
      setShowServiceModal(false);
      setServiceForm({ title: "", description: "", category_id: "", city_id: "", emergency_service: "Available 24/7", provider_type: "Licensed Company" });
      setImages([]);
      setSelectedEmirate("");
      fetchData();
    } catch (err: any) {
      setFormError(err.response?.data?.detail || "Failed to add service");
    }
  };

  const handleOpenEditModal = (service: any) => {
    setEditingServiceId(service.id);
    setEditServiceForm({
      title: service.title,
      description: service.description,
      category_id: service.category_id.toString(),
      city_id: service.city_id.toString(),
      emergency_service: service.emergency_service || "Available 24/7",
      provider_type: service.provider_type || "Licensed Company"
    });
    setEditImages(service.images || []);
    
    const matchedCity = cities.find(c => c.id === service.city_id);
    if (matchedCity) {
      setSelectedEditEmirate(matchedCity.emirate_id.toString());
    } else {
      setSelectedEditEmirate("");
    }
    
    setShowEditServiceModal(true);
  };

  const handleEditService = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    try {
      await api.put(`/services/${editingServiceId}`, {
        title: editServiceForm.title,
        description: editServiceForm.description,
        category_id: parseInt(editServiceForm.category_id),
        city_id: parseInt(editServiceForm.city_id),
        images: editImages,
        emergency_service: editServiceForm.emergency_service,
        provider_type: editServiceForm.provider_type
      });
      setShowEditServiceModal(false);
      setEditingServiceId(null);
      setEditImages([]);
      setSelectedEditEmirate("");
      fetchData();
    } catch (err: any) {
      setFormError(err.response?.data?.detail || "Failed to update service");
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
        title: dealForm.title,
        description: dealForm.description,
        category_id: parseInt(dealForm.category_id),
        city_id: parseInt(dealForm.city_id),
        images: dealImages,
        discount_desc: dealForm.discount_desc,
        expiry_date: new Date(dealForm.expiry_date).toISOString()
      });

      setShowDealModal(false);
      setDealForm({
        title: "",
        description: "",
        category_id: "",
        city_id: "",
        discount_desc: "",
        expiry_date: ""
      });
      setDealImages([]);
      setSelectedDealEmirate("");
      fetchData();
    } catch (err: any) {
      setFormError(err.response?.data?.detail || "Failed to add deal");
    }
  };

  const handleDeleteService = async (id: number) => {
    if (confirm("Are you sure you want to delete this service? All deals associated with this service will also be removed.")) {
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

        {/* All Services Section - Overhauled to Premium Card Grid */}
        <div className="animate-slide-up" style={{ animationDelay: "100ms" }}>
          <div className="flex items-center justify-between mb-8 border-b border-[#222] pb-4">
            <h3 className="text-[#d4933a] font-medium text-lg tracking-wide flex items-center gap-2">
              <Briefcase className="w-5 h-5" /> All Services ({services.length})
            </h3>
            <button onClick={() => setShowServiceModal(true)} disabled={services.length >= (profile?.services_limit || 6)} className="cursor-pointer bg-[#d4933a] hover:bg-[#c28532] disabled:opacity-50 text-white px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all">
              <Plus className="w-4 h-4" /> Add Service
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full p-6 text-white text-center">Loading services...</div>
            ) : services.length === 0 ? (
              <div className="col-span-full p-12 text-[#888] text-center bg-[#111] rounded-[2rem] border border-[#222]">
                No services posted yet.
              </div>
            ) : (
              services.map((service: any) => (
                <div key={service.id} className="bg-[#151515] border border-[#222] hover:border-[#d4933a]/50 rounded-[2rem] overflow-hidden flex flex-col shadow-lg hover:shadow-xl transition-all duration-300 group">
                  {/* Service Image */}
                  <div className="relative w-full h-[200px] bg-[#1a1a1a] overflow-hidden">
                    {service.images && service.images.length > 0 ? (
                      <img src={service.images[0]} alt={service.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-[#555] bg-[#111]">No Image</div>
                    )}
                    
                    <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-[#d4933a] text-[10px] font-bold uppercase tracking-wider">
                      {service.category?.name || "Global Service"}
                    </div>
                  </div>
                  
                  {/* Service Info */}
                  <div className="p-6 flex flex-col flex-1">
                    <h4 className="font-semibold text-lg text-white mb-2 line-clamp-1 group-hover:text-[#d4933a] transition-colors">{service.title}</h4>
                    <p className="text-gray-400 text-xs font-light leading-relaxed mb-6 line-clamp-3">{service.description}</p>
                    
                    <div className="mt-auto border-t border-[#222] pt-5 flex items-center justify-between">
                      {/* Status */}
                      <div className="flex items-center gap-2">
                        <div className={`w-2.5 h-2.5 rounded-full ${service.is_active ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'}`}></div>
                        <span className="text-xs text-gray-400 font-medium">{service.is_active ? 'Active' : 'Inactive'}</span>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleOpenEditModal(service)} 
                          className="cursor-pointer bg-[#222] hover:bg-[#333] border border-[#333] hover:border-[#d4933a] text-white hover:text-[#d4933a] p-2.5 rounded-xl transition-all"
                          title="Edit Service"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteService(service.id)} 
                          className="cursor-pointer bg-[#222] hover:bg-red-500/10 border border-[#333] hover:border-red-500/30 text-gray-400 hover:text-red-400 p-2.5 rounded-xl transition-all"
                          title="Delete Service"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* Add Service Modal */}
      {showServiceModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-[#111] border border-[#333] rounded-3xl p-6 w-full max-w-md relative text-white animate-fade-in shadow-2xl">
            <button onClick={() => {
              setShowServiceModal(false);
              setImages([]);
              setServiceForm({ title: "", description: "", category_id: "", city_id: "", emergency_service: "Available 24/7", provider_type: "Licensed Company" });
              setFormError("");
            }} className="absolute top-4 right-4 text-[#888] hover:text-white cursor-pointer"><X /></button>
            <h2 className="text-xl font-bold mb-4 tracking-wide text-white">Add New Service</h2>
            {formError && <div className="text-red-500 text-sm mb-4">{formError}</div>}
            <form onSubmit={handleAddService} className="flex flex-col gap-4">
              <input required placeholder="Listing Title" value={serviceForm.title} onChange={e => setServiceForm({...serviceForm, title: e.target.value})} className="bg-[#1a1a1a] border border-[#333] rounded-xl px-4 py-3 text-white outline-none focus:border-[#d4933a] text-sm" />
              <textarea required placeholder="Description" value={serviceForm.description} onChange={e => setServiceForm({...serviceForm, description: e.target.value})} className="bg-[#1a1a1a] border border-[#333] rounded-xl px-4 py-3 text-white outline-none focus:border-[#d4933a] min-h-[100px] text-sm" />
              
              <select required value={serviceForm.category_id} onChange={e => setServiceForm({...serviceForm, category_id: e.target.value})} className="bg-[#1a1a1a] border border-[#333] rounded-xl px-4 py-3 text-[#aaa] outline-none focus:border-[#d4933a] text-sm">
                <option value="">Select Global Service...</option>
                {categories.map(c => <option key={c.id} value={c.id} className="text-white">{c.name}</option>)}
              </select>

              <select value={selectedEmirate} onChange={e => {
                setSelectedEmirate(e.target.value);
                setServiceForm({...serviceForm, city_id: ""});
              }} className="bg-[#1a1a1a] border border-[#333] rounded-xl px-4 py-3 text-[#aaa] outline-none focus:border-[#d4933a] text-sm">
                <option value="">Select Emirate...</option>
                {emirates.map(e => <option key={e.id} value={e.id} className="text-white">{e.name}</option>)}
              </select>

              <select required disabled={!selectedEmirate} value={serviceForm.city_id} onChange={e => setServiceForm({...serviceForm, city_id: e.target.value})} className="bg-[#1a1a1a] border border-[#333] rounded-xl px-4 py-3 text-[#aaa] outline-none focus:border-[#d4933a] disabled:opacity-50 text-sm">
                <option value="">Select City...</option>
                {cities.filter(c => c.emirate_id.toString() === selectedEmirate).map(c => <option key={c.id} value={c.id} className="text-white">{c.name}</option>)}
              </select>

              <select required value={serviceForm.emergency_service} onChange={e => setServiceForm({...serviceForm, emergency_service: e.target.value})} className="bg-[#1a1a1a] border border-[#333] rounded-xl px-4 py-3 text-[#aaa] outline-none focus:border-[#d4933a] text-sm">
                <option value="Available 24/7">Emergency Service: Available 24/7</option>
                <option value="During business hours only">Emergency Service: During business hours only</option>
                <option value="Not available">Emergency Service: Not available</option>
              </select>

              <select required value={serviceForm.provider_type} onChange={e => setServiceForm({...serviceForm, provider_type: e.target.value})} className="bg-[#1a1a1a] border border-[#333] rounded-xl px-4 py-3 text-[#aaa] outline-none focus:border-[#d4933a] text-sm">
                <option value="Licensed Company">Provider Type: Licensed Company</option>
                <option value="Freelancer">Provider Type: Freelancer</option>
                <option value="Individual Professional">Provider Type: Individual Professional</option>
              </select>
              
              <div className="border border-dashed border-[#333] p-4 rounded-xl bg-[#1a1a1a] text-center flex flex-col items-center gap-1">
                <input 
                  type="file" 
                  multiple 
                  accept="image/*" 
                  onChange={(e) => {
                    if (e.target.files) handleImageUploadGeneric(Array.from(e.target.files), images, setImages);
                  }} 
                  className="hidden" 
                  id="image-upload" 
                />
                <label htmlFor="image-upload" className="cursor-pointer text-[#d4933a] hover:underline text-sm font-semibold flex items-center gap-1">
                  <Upload className="w-4 h-4" /> {uploadingImages ? "Uploading..." : `Upload Images (${images.length}/4)`}
                </label>
              </div>
              {images.length > 0 && (
                <div className="flex gap-2 flex-wrap mt-2">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative w-16 h-16 rounded overflow-hidden border border-[#333]">
                      <img src={img} alt="preview" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => setImages(images.filter((_, i) => i !== idx))} className="absolute top-1 right-1 bg-black/70 rounded-full p-0.5 hover:bg-red-500/80 text-white"><X className="w-3.5 h-3.5" /></button>
                    </div>
                  ))}
                </div>
              )}

              <button type="submit" disabled={uploadingImages || images.length > 4} className="bg-[#d4933a] hover:bg-[#c28532] disabled:opacity-50 text-white py-3.5 rounded-xl font-bold mt-2 text-sm shadow-[0_0_15px_rgba(212,147,58,0.2)] hover:shadow-[0_0_25px_rgba(212,147,58,0.4)] cursor-pointer">Create Service</button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Service Modal */}
      {showEditServiceModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-[#111] border border-[#333] rounded-3xl p-6 w-full max-w-md relative text-white animate-fade-in shadow-2xl">
            <button onClick={() => {
              setShowEditServiceModal(false);
              setEditingServiceId(null);
              setEditImages([]);
              setFormError("");
            }} className="absolute top-4 right-4 text-[#888] hover:text-white cursor-pointer"><X /></button>
            <h2 className="text-xl font-bold mb-4 tracking-wide text-white">Edit Service</h2>
            {formError && <div className="text-red-500 text-sm mb-4">{formError}</div>}
            <form onSubmit={handleEditService} className="flex flex-col gap-4">
              <input required placeholder="Listing Title" value={editServiceForm.title} onChange={e => setEditServiceForm({...editServiceForm, title: e.target.value})} className="bg-[#1a1a1a] border border-[#333] rounded-xl px-4 py-3 text-white outline-none focus:border-[#d4933a] text-sm" />
              <textarea required placeholder="Description" value={editServiceForm.description} onChange={e => setEditServiceForm({...editServiceForm, description: e.target.value})} className="bg-[#1a1a1a] border border-[#333] rounded-xl px-4 py-3 text-white outline-none focus:border-[#d4933a] min-h-[100px] text-sm" />
              
              <select required value={editServiceForm.category_id} onChange={e => setEditServiceForm({...editServiceForm, category_id: e.target.value})} className="bg-[#1a1a1a] border border-[#333] rounded-xl px-4 py-3 text-[#aaa] outline-none focus:border-[#d4933a] text-sm">
                <option value="">Select Global Service...</option>
                {categories.map(c => <option key={c.id} value={c.id} className="text-white">{c.name}</option>)}
              </select>

              <select value={selectedEditEmirate} onChange={e => {
                setSelectedEditEmirate(e.target.value);
                setEditServiceForm({...editServiceForm, city_id: ""});
              }} className="bg-[#1a1a1a] border border-[#333] rounded-xl px-4 py-3 text-[#aaa] outline-none focus:border-[#d4933a] text-sm">
                <option value="">Select Emirate...</option>
                {emirates.map(e => <option key={e.id} value={e.id} className="text-white">{e.name}</option>)}
              </select>

              <select required disabled={!selectedEditEmirate} value={editServiceForm.city_id} onChange={e => setEditServiceForm({...editServiceForm, city_id: e.target.value})} className="bg-[#1a1a1a] border border-[#333] rounded-xl px-4 py-3 text-[#aaa] outline-none focus:border-[#d4933a] disabled:opacity-50 text-sm">
                <option value="">Select City...</option>
                {cities.filter(c => c.emirate_id.toString() === selectedEditEmirate).map(c => <option key={c.id} value={c.id} className="text-white">{c.name}</option>)}
              </select>

              <select required value={editServiceForm.emergency_service} onChange={e => setEditServiceForm({...editServiceForm, emergency_service: e.target.value})} className="bg-[#1a1a1a] border border-[#333] rounded-xl px-4 py-3 text-[#aaa] outline-none focus:border-[#d4933a] text-sm">
                <option value="Available 24/7">Emergency Service: Available 24/7</option>
                <option value="During business hours only">Emergency Service: During business hours only</option>
                <option value="Not available">Emergency Service: Not available</option>
              </select>

              <select required value={editServiceForm.provider_type} onChange={e => setEditServiceForm({...editServiceForm, provider_type: e.target.value})} className="bg-[#1a1a1a] border border-[#333] rounded-xl px-4 py-3 text-[#aaa] outline-none focus:border-[#d4933a] text-sm">
                <option value="Licensed Company">Provider Type: Licensed Company</option>
                <option value="Freelancer">Provider Type: Freelancer</option>
                <option value="Individual Professional">Provider Type: Individual Professional</option>
              </select>
              
              <div className="border border-dashed border-[#333] p-4 rounded-xl bg-[#1a1a1a] text-center flex flex-col items-center gap-1">
                <input 
                  type="file" 
                  multiple 
                  accept="image/*" 
                  onChange={(e) => {
                    if (e.target.files) handleImageUploadGeneric(Array.from(e.target.files), editImages, setEditImages);
                  }} 
                  className="hidden" 
                  id="edit-image-upload" 
                />
                <label htmlFor="edit-image-upload" className="cursor-pointer text-[#d4933a] hover:underline text-sm font-semibold flex items-center gap-1">
                  <Upload className="w-4 h-4" /> {uploadingImages ? "Uploading..." : `Upload Images (${editImages.length}/4)`}
                </label>
              </div>
              {editImages.length > 0 && (
                <div className="flex gap-2 flex-wrap mt-2">
                  {editImages.map((img, idx) => (
                    <div key={idx} className="relative w-16 h-16 rounded overflow-hidden border border-[#333]">
                      <img src={img} alt="preview" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => setEditImages(editImages.filter((_, i) => i !== idx))} className="absolute top-1 right-1 bg-black/70 rounded-full p-0.5 hover:bg-red-500/80 text-white"><X className="w-3.5 h-3.5" /></button>
                    </div>
                  ))}
                </div>
              )}

              <button type="submit" disabled={uploadingImages || editImages.length > 4} className="bg-[#d4933a] hover:bg-[#c28532] disabled:opacity-50 text-white py-3.5 rounded-xl font-bold mt-2 text-sm shadow-[0_0_15px_rgba(212,147,58,0.2)] hover:shadow-[0_0_25px_rgba(212,147,58,0.4)] cursor-pointer">Save Changes</button>
            </form>
          </div>
        </div>
      )}

      {/* Add Deal Modal (Includes custom standalone deal support) */}
      {showDealModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-[#111] border border-[#333] rounded-3xl p-6 w-full max-w-md relative text-white animate-fade-in shadow-2xl overflow-y-auto max-h-[90vh]">
            <button onClick={() => {
              setShowDealModal(false);
              setDealForm({
                title: "",
                description: "",
                category_id: "",
                city_id: "",
                discount_desc: "",
                expiry_date: ""
              });
              setDealImages([]);
              setSelectedDealEmirate("");
              setFormError("");
            }} className="absolute top-4 right-4 text-[#888] hover:text-white cursor-pointer"><X /></button>
            <h2 className="text-xl font-bold mb-4 tracking-wide text-white">Add Exclusive Deal</h2>
            
            {formError && <div className="text-red-500 text-sm mb-4">{formError}</div>}
            
            <form onSubmit={handleAddDeal} className="flex flex-col gap-4">
              <input required placeholder="Deal Title (e.g. Premium AC Deep Cleaning)" value={dealForm.title} onChange={e => setDealForm({...dealForm, title: e.target.value})} className="bg-[#1a1a1a] border border-[#333] rounded-xl px-4 py-3 text-white outline-none focus:border-[#d4933a] text-sm" />
              
              <textarea required placeholder="Deal Description / Scope" value={dealForm.description} onChange={e => setDealForm({...dealForm, description: e.target.value})} className="bg-[#1a1a1a] border border-[#333] rounded-xl px-4 py-3 text-white outline-none focus:border-[#d4933a] min-h-[80px] text-sm" />
              
              <select required value={dealForm.category_id} onChange={e => setDealForm({...dealForm, category_id: e.target.value})} className="bg-[#1a1a1a] border border-[#333] rounded-xl px-4 py-3 text-[#aaa] outline-none focus:border-[#d4933a] text-sm">
                <option value="">Select Service Category...</option>
                {categories.map(c => <option key={c.id} value={c.id} className="text-white">{c.name}</option>)}
              </select>

              <select value={selectedDealEmirate} onChange={e => {
                setSelectedDealEmirate(e.target.value);
                setDealForm({...dealForm, city_id: ""});
              }} className="bg-[#1a1a1a] border border-[#333] rounded-xl px-4 py-3 text-[#aaa] outline-none focus:border-[#d4933a] text-sm">
                <option value="">Select Emirate...</option>
                {emirates.map(e => <option key={e.id} value={e.id} className="text-white">{e.name}</option>)}
              </select>

              <select required disabled={!selectedDealEmirate} value={dealForm.city_id} onChange={e => setDealForm({...dealForm, city_id: e.target.value})} className="bg-[#1a1a1a] border border-[#333] rounded-xl px-4 py-3 text-[#aaa] outline-none focus:border-[#d4933a] disabled:opacity-50 text-sm">
                <option value="">Select City...</option>
                {cities.filter(c => c.emirate_id.toString() === selectedDealEmirate).map(c => <option key={c.id} value={c.id} className="text-white">{c.name}</option>)}
              </select>
              
              <div className="border border-dashed border-[#333] p-4 rounded-xl bg-[#1a1a1a] text-center flex flex-col items-center gap-1">
                <input 
                  type="file" 
                  multiple 
                  accept="image/*" 
                  onChange={(e) => {
                    if (e.target.files) handleImageUploadGeneric(Array.from(e.target.files), dealImages, setDealImages);
                  }} 
                  className="hidden" 
                  id="deal-image-upload" 
                />
                <label htmlFor="deal-image-upload" className="cursor-pointer text-[#d4933a] hover:underline text-sm font-semibold flex items-center gap-1">
                  <Upload className="w-4 h-4" /> {uploadingImages ? "Uploading..." : `Upload Deal Images (${dealImages.length}/4)`}
                </label>
              </div>
              {dealImages.length > 0 && (
                <div className="flex gap-2 flex-wrap mt-2">
                  {dealImages.map((img, idx) => (
                    <div key={idx} className="relative w-14 h-14 rounded overflow-hidden border border-[#333]">
                      <img src={img} alt="preview" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => setDealImages(dealImages.filter((_, i) => i !== idx))} className="absolute top-0.5 right-0.5 bg-black/70 rounded-full p-0.5 hover:bg-red-500/80 text-white"><X className="w-3.5 h-3.5" /></button>
                    </div>
                  ))}
                </div>
              )}

              <textarea required placeholder="Discount Description (e.g. 20% OFF AC Cleaning)" value={dealForm.discount_desc} onChange={e => setDealForm({...dealForm, discount_desc: e.target.value})} className="bg-[#1a1a1a] border border-[#333] rounded-xl px-4 py-3 text-white outline-none focus:border-[#d4933a] min-h-[80px] text-sm" />
              
              <div className="flex flex-col gap-1">
                <label className="text-xs text-[#888] pl-1 font-medium">Expiry Date</label>
                <input required type="date" value={dealForm.expiry_date} onChange={e => setDealForm({...dealForm, expiry_date: e.target.value})} className="bg-[#1a1a1a] border border-[#333] rounded-xl px-4 py-3 text-[#aaa] outline-none focus:border-[#d4933a] text-sm" />
              </div>
              
              <button type="submit" disabled={uploadingImages || dealImages.length > 4} className="bg-[#d4933a] hover:bg-[#c28532] text-white py-3.5 rounded-xl font-bold mt-2 text-sm shadow-[0_0_15px_rgba(212,147,58,0.2)] hover:shadow-[0_0_25px_rgba(212,147,58,0.4)] cursor-pointer">Publish Deal</button>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
