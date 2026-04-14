"use client";

import { useState, useRef } from "react";
import {
  Settings,
  Store,
  Mail,
  Coins,
  Image as ImageIcon,
  Upload,
  Save,
  CheckCircle2,
  Globe,
  Layout,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export default function GlobalSettingsPage() {
  const [toast, setToast] = useState("");
  const [saving, setSaving] = useState(false);

  // Form State
  const [storeName, setStoreName] = useState("GemsRatna");
  const [adminEmail, setAdminEmail] = useState("admin@gemsratna.com");
  const [currency, setCurrency] = useState("INR");
  const [logoPreview, setLogoPreview] = useState<string | null>("/assets/Image/logo.png");
  
  const logoInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setLogoPreview(URL.createObjectURL(file));
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    showToast("Global settings updated successfully!");
    setSaving(false);
  };

  const sectionHeaderClass = "flex items-center gap-3 mb-6 p-1";
  const cardClass = "rounded-[2rem] border border-white/10 bg-[#0f0f0f] p-8 shadow-2xl relative overflow-hidden group";
  const iconBoxClass = "flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-gold shadow-lg group-hover:bg-gold/10 group-hover:border-gold/20 transition-all duration-500";
  const inputContainerClass = "space-y-2";
  const labelClass = "text-[10px] font-black uppercase tracking-[0.3em] text-white/30 ml-1";

  return (
    <div className="space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-24 right-8 z-[99999] flex items-center gap-3 rounded-2xl bg-emerald-500 px-6 py-4 text-sm font-bold text-white shadow-2xl shadow-emerald-500/20 ring-1 ring-white/20 animate-in slide-in-from-right-4 transition-all">
          <CheckCircle2 size={18} />
          {toast}
        </div>
      )}

      {/* ── HEADER SECTION ────────────────────────────── */}
      <div className="rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-[#121212] via-[#080808] to-[#1b1506] p-10 shadow-3xl shadow-black/80 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <Settings size={180} />
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
          <div className="flex items-start gap-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl border border-gold/20 bg-gold/10 text-gold shadow-2xl shadow-gold/10">
              <Globe size={28} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gold/60 mb-2">
                System Configuration
              </p>
              <h1 className="text-4xl font-black text-white uppercase tracking-tighter leading-none">
                Global Settings
              </h1>
              <p className="mt-3 text-sm font-medium text-white/40 italic max-w-xl">
                Manage your store's identity, communication, and localization from one centralized workspace.
              </p>
            </div>
          </div>
          
          <Button
            onClick={handleSave}
            disabled={saving}
            className="h-14 px-10 bg-gold hover:bg-gold/90 text-black font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-2xl shadow-gold/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            {saving ? (
              <span className="flex items-center gap-2">
                <span className="h-3 w-3 border-2 border-black border-t-transparent rounded-full animate-spin" />
                Synchronizing...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Save size={14} />
                Persist Changes
              </span>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ── LEFT COLUMN: GENERAL INFO ────────────────── */}
        <div className="lg:col-span-12 xl:col-span-8 space-y-8">
          
          {/* Store Identification */}
          <section className={cardClass}>
            <div className={sectionHeaderClass}>
              <div className={iconBoxClass}>
                <Store size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight leading-none">Store Identity</h2>
                <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mt-1.5 italic">Public Brand Details</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className={inputContainerClass}>
                <Label className={labelClass}>Public Store Name</Label>
                <div className="relative group/input">
                  <div className="absolute inset-0 bg-gold/5 opacity-0 group-focus-within/input:opacity-100 rounded-xl transition-opacity pointer-events-none" />
                  <Input
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    className="h-14 bg-white/[0.03] border-white/10 rounded-xl px-4 text-white focus:border-gold/50 focus:ring-gold/20 transition-all font-medium"
                    placeholder="Enter store name"
                  />
                </div>
              </div>

              <div className={inputContainerClass}>
                <Label className={labelClass}>Technical Admin Email</Label>
                <div className="relative group/input">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within/input:text-gold transition-colors" size={16} />
                  <Input
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="h-14 bg-white/[0.03] border-white/10 rounded-xl pl-12 pr-4 text-white focus:border-gold/50 focus:ring-gold/20 transition-all font-medium"
                    placeholder="admin@example.com"
                  />
                </div>
              </div>

              <div className={inputContainerClass}>
                <Label className={labelClass}>Operational Currency (ISO)</Label>
                <div className="relative group/input">
                  <Coins className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within/input:text-gold transition-colors" size={16} />
                  <Input
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="h-14 bg-white/[0.03] border-white/10 rounded-xl pl-12 pr-4 text-white focus:border-gold/50 focus:ring-gold/20 transition-all font-medium font-mono"
                    placeholder="INR, USD, EUR..."
                  />
                </div>
              </div>
              
              <div className={inputContainerClass}>
                <Label className={labelClass}>Measurement Unit</Label>
                <select className="flex h-14 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white focus:border-gold/50 focus:outline-none focus:ring-2 focus:ring-gold/20 transition-all font-medium appearance-none">
                  <option value="met" className="bg-[#0f0f0f]">Metric (mm, gm)</option>
                  <option value="imp" className="bg-[#0f0f0f]">Imperial (in, oz)</option>
                </select>
              </div>
            </div>
          </section>

          {/* Localization & Region */}
          <section className={cardClass}>
            <div className={sectionHeaderClass}>
              <div className={iconBoxClass}>
                <Layout size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight leading-none">Regional Settings</h2>
                <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mt-1.5 italic">Timezone & Locale</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className={inputContainerClass}>
                <Label className={labelClass}>Primary Language</Label>
                <select className="flex h-14 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white focus:border-gold/50 focus:outline-none focus:ring-2 focus:ring-gold/20 transition-all font-medium appearance-none">
                  <option value="en" className="bg-[#0f0f0f]">English (Global)</option>
                  <option value="hi" className="bg-[#0f0f0f]">Hindi (India)</option>
                </select>
              </div>
              
              <div className={inputContainerClass}>
                <Label className={labelClass}>System Timezone</Label>
                <select className="flex h-14 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white focus:border-gold/50 focus:outline-none focus:ring-2 focus:ring-gold/20 transition-all font-medium appearance-none">
                  <option value="ist" className="bg-[#0f0f0f]">(GMT+05:30) Mumbai, New Delhi</option>
                  <option value="utc" className="bg-[#0f0f0f]">(GMT+00:00) UTC Standard</option>
                </select>
              </div>
            </div>
          </section>
        </div>

        {/* ── RIGHT COLUMN: BRANDING ───────────────────── */}
        <div className="lg:col-span-12 xl:col-span-4 space-y-8">
          
          {/* Brand Assets */}
          <section className={cardClass}>
            <div className={sectionHeaderClass}>
              <div className={iconBoxClass}>
                <ImageIcon size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight leading-none">Visual Brand</h2>
                <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mt-1.5 italic">Official Gem Logos</p>
              </div>
            </div>

            <div className="space-y-8">
              <div className="space-y-4">
                <Label className={labelClass}>Main Identity Logo</Label>
                <div className="relative group/logo rounded-[2rem] border-2 border-dashed border-white/10 bg-white/[0.02] p-8 text-center hover:border-gold/30 hover:bg-gold/[0.02] transition-all duration-500 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-gold/5 to-transparent opacity-0 group-hover/logo:opacity-100 transition-opacity pointer-events-none" />
                  
                  <div className="relative z-10 mx-auto flex h-24 w-full items-center justify-center rounded-2xl bg-[#080808] border border-white/5 shadow-2xl p-4 mb-6 group-hover/logo:scale-[1.02] transition-transform duration-500">
                    <img
                      src={logoPreview || "/assets/Image/logo.png"}
                      alt="Store Logo"
                      className="max-h-full max-w-full object-contain filter drop-shadow-[0_0_10px_rgba(212,175,55,0.1)]"
                    />
                  </div>
                  
                  <input
                    type="file"
                    ref={logoInputRef}
                    onChange={handleLogoUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  
                  <Button
                    onClick={() => logoInputRef.current?.click()}
                    variant="ghost"
                    className="h-10 px-6 rounded-xl border border-white/10 bg-white/5 text-[9px] font-black uppercase tracking-[0.2em] text-white hover:bg-gold hover:text-black transition-all"
                  >
                    <Upload size={14} className="mr-2" />
                    Upload New Asset
                  </Button>
                  
                  <p className="mt-4 text-[9px] font-bold text-white/20 italic tracking-widest uppercase">
                    Recommend: 512x128 Transparent SVG
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-gold/5 border border-gold/10">
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-5 w-5 rounded-full bg-gold/10 flex items-center justify-center text-gold">
                    <Settings size={12} strokeWidth={3} />
                  </div>
                  <p className="text-[10px] leading-relaxed text-gold/60 font-medium italic">
                    Visual assets are automatically optimized and cached via our global CDN for maximum delivery speed.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* System Info */}
          <section className="p-8 rounded-[2rem] border border-white/5 bg-[#0a0a0a] relative overflow-hidden">
             <div className="absolute -bottom-10 -right-10 opacity-[0.03] rotate-12">
               <Globe size={160} />
             </div>
             <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-6 italic">Server Status</h3>
             <ul className="space-y-4">
               {[
                 { label: "Environment", value: "Production" },
                 { label: "Database", value: "Cluster-Gold" },
                 { label: "API Version", value: "v2.4.0" }
               ].map((item, idx) => (
                 <li key={idx} className="flex items-center justify-between border-b border-white/5 pb-2">
                   <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">{item.label}</span>
                   <span className="text-[10px] text-gold font-black uppercase tracking-widest">{item.value}</span>
                 </li>
               ))}
             </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
