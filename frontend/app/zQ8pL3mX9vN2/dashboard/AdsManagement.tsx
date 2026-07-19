import { useState, useEffect } from "react";
import { Save, Image as ImageIcon, Loader2, UploadCloud } from "lucide-react";
import api from "@/lib/api";

export default function AdsManagement() {
  const [ads, setAds] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Form states for ad1
  const [ad1Image, setAd1Image] = useState("");
  const [ad1Redirect, setAd1Redirect] = useState("");
  const [ad1Active, setAd1Active] = useState(false);

  // Form states for ad2
  const [ad2Image, setAd2Image] = useState("");
  const [ad2Redirect, setAd2Redirect] = useState("");
  const [ad2Active, setAd2Active] = useState(false);

  const [uploading1, setUploading1] = useState(false);
  const [uploading2, setUploading2] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, position: "add1" | "add2") => {
    const file = e.target.files?.[0];
    if (!file) return;

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      setMessage({ type: "error", text: "Cloudinary configuration missing" });
      return;
    }

    if (position === "add1") setUploading1(true);
    else setUploading2(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.secure_url) {
        if (position === "add1") setAd1Image(data.secure_url);
        else setAd2Image(data.secure_url);
      } else {
        setMessage({ type: "error", text: "Upload failed: " + (data.error?.message || "Unknown error") });
      }
    } catch (err) {
      console.error("Upload error", err);
      setMessage({ type: "error", text: "Network error during upload" });
    } finally {
      if (position === "add1") setUploading1(false);
      else setUploading2(false);
      e.target.value = ''; // Reset input
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      setLoading(true);
      const res = await api.get("/ads");
      if (res.status === 200) {
        const data = res.data;
        const adsMap: Record<string, any> = {};
        data.forEach((ad: any) => {
          adsMap[ad.position] = ad;
        });
        setAds(adsMap);

        if (adsMap["add1"]) {
          setAd1Image(adsMap["add1"].image_url || "");
          setAd1Redirect(adsMap["add1"].redirect_url || "");
          setAd1Active(adsMap["add1"].is_active || false);
        }
        if (adsMap["add2"]) {
          setAd2Image(adsMap["add2"].image_url || "");
          setAd2Redirect(adsMap["add2"].redirect_url || "");
          setAd2Active(adsMap["add2"].is_active || false);
        }
      }
    } catch (err) {
      console.error("Failed to fetch ads", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (position: string, imageUrl: string, redirectUrl: string, isActive: boolean) => {
    try {
      setSaving(true);
      setMessage({ type: "", text: "" });
      const res = await api.patch(`/ads/${position}`, {
        image_url: imageUrl,
        redirect_url: redirectUrl,
        is_active: isActive
      });

      if (res.status === 200) {
        setMessage({ type: "success", text: `${position} updated successfully!` });
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      } else {
        setMessage({ type: "error", text: `Failed to update ${position}` });
      }
    } catch (err) {
      console.error("Error saving ad", err);
      setMessage({ type: "error", text: "Network error occurred while saving." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-[#888]">Loading Ads Configuration...</div>;
  }

  return (
    <div className="animate-fade-in max-w-4xl">
      <div className="flex items-center gap-3 mb-8">
        <ImageIcon className="w-8 h-8 text-[#d4933a]" />
        <h2 className="text-2xl font-medium text-white tracking-wide">Advertisement Management</h2>
      </div>

      {message.text && (
        <div className={`p-4 rounded-xl mb-6 font-medium flex items-center justify-between ${
          message.type === "success" ? "bg-green-500/10 text-green-500 border border-green-500/20" : "bg-red-500/10 text-red-500 border border-red-500/20"
        }`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Ad 1 Configuration */}
        <div className="bg-[#151515] border border-[#222] p-6 rounded-2xl flex flex-col gap-6 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white text-lg font-semibold tracking-wide">Ad 1 (Top Right / Mobile Top)</h3>
              <p className="text-[#888] text-sm mt-1">Vertical layout ad typically placed in sidebars. <span className="text-white/60">(Ideal size: 300px × 680px)</span></p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={ad1Active} onChange={async (e) => {
                const checked = e.target.checked;
                setAd1Active(checked);
                await handleSave("add1", ad1Image, ad1Redirect, checked);
              }} />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#d4933a]"></div>
            </label>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-white">Ad Image</label>
              <label className="cursor-pointer bg-[#222] hover:bg-[#333] border border-[#333] text-white px-4 py-3 rounded-xl text-sm transition-colors flex items-center justify-center gap-2 relative">
                {uploading1 ? <Loader2 className="w-5 h-5 animate-spin" /> : <UploadCloud className="w-5 h-5" />}
                <span className="font-medium">{uploading1 ? "Uploading..." : "Upload Local Image"}</span>
                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, "add1")} disabled={uploading1} />
              </label>
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-white">Redirect URL (Optional)</label>
              <input
                type="text"
                value={ad1Redirect}
                onChange={(e) => setAd1Redirect(e.target.value)}
                placeholder="https://example.com/promotion"
                className="w-full bg-black border border-[#333] text-white p-3 rounded-xl focus:border-[#d4933a] focus:ring-1 focus:ring-[#d4933a] outline-none transition-all placeholder:text-[#555]"
              />
            </div>
          </div>

          {ad1Image && (
            <div className="w-full max-w-[200px] h-[300px] bg-black rounded-xl overflow-hidden relative border border-[#333] self-center">
              <img src={ad1Image} alt="Ad 1 Preview" className="w-full h-full object-cover" />
            </div>
          )}

          <button
            onClick={() => handleSave("add1", ad1Image, ad1Redirect, ad1Active)}
            disabled={saving}
            className="w-full mt-auto bg-white/10 hover:bg-white/20 text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            Save Ad 1
          </button>
        </div>

        {/* Ad 2 Configuration */}
        <div className="bg-[#151515] border border-[#222] p-6 rounded-2xl flex flex-col gap-6 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white text-lg font-semibold tracking-wide">Ad 2 (Bottom Center)</h3>
              <p className="text-[#888] text-sm mt-1">Horizontal layout ad placed above the footer. <span className="text-white/60">(Ideal size: 1200px × 250px)</span></p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={ad2Active} onChange={async (e) => {
                const checked = e.target.checked;
                setAd2Active(checked);
                await handleSave("add2", ad2Image, ad2Redirect, checked);
              }} />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#d4933a]"></div>
            </label>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-white">Ad Image</label>
              <label className="cursor-pointer bg-[#222] hover:bg-[#333] border border-[#333] text-white px-4 py-3 rounded-xl text-sm transition-colors flex items-center justify-center gap-2 relative">
                {uploading2 ? <Loader2 className="w-5 h-5 animate-spin" /> : <UploadCloud className="w-5 h-5" />}
                <span className="font-medium">{uploading2 ? "Uploading..." : "Upload Local Image"}</span>
                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, "add2")} disabled={uploading2} />
              </label>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-white">Redirect URL (Optional)</label>
              <input
                type="text"
                value={ad2Redirect}
                onChange={(e) => setAd2Redirect(e.target.value)}
                placeholder="https://example.com/promotion"
                className="w-full bg-black border border-[#333] text-white p-3 rounded-xl focus:border-[#d4933a] focus:ring-1 focus:ring-[#d4933a] outline-none transition-all placeholder:text-[#555]"
              />
            </div>
          </div>

          {ad2Image && (
            <div className="w-full h-[150px] bg-black rounded-xl overflow-hidden relative border border-[#333]">
              <img src={ad2Image} alt="Ad 2 Preview" className="w-full h-full object-cover" />
            </div>
          )}

          <button
            onClick={() => handleSave("add2", ad2Image, ad2Redirect, ad2Active)}
            disabled={saving}
            className="w-full mt-auto bg-white/10 hover:bg-white/20 text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            Save Ad 2
          </button>
        </div>
      </div>
    </div>
  );
}
