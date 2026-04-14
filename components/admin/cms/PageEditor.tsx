"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { 
  ArrowLeft, 
  Eye, 
  FileText, 
  LayoutGrid, 
  PlusCircle, 
  EyeOff,
  Image as ImageIcon,
  Menu,
  ShieldCheck,
  Star,
  Lock,
  Plus,
  Sparkles,
  Settings,
  Trash2,
  Loader2,
  Save,
  GripVertical,
  ChevronUp,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence, Reorder, useDragControls } from "motion/react";
import { Page, PageBlock, SectionType, PageStatus } from "@/lib/store/pages/pageType";
import { createPageDraft, createDefaultSectionContent, normalizeHero, normalizeSectionContent } from "@/lib/store/pages/pageHelpers";
import { MediaLibraryModal } from "../media/MediaLibraryModal";

interface PageEditorProps {
  initialData?: Page;
  onSave: (page: Page) => Promise<void>;
  isLoading?: boolean;
}

const SECTION_INFO: Record<SectionType, { title: string; icon: any; color: string }> = {
  hero: { title: "Hero Section", icon: Sparkles, color: "text-amber-400" },
  collections: { title: "Collections", icon: LayoutGrid, color: "text-blue-400" },
  why: { title: "Why Section", icon: ShieldCheck, color: "text-emerald-400" },
  products: { title: "Products", icon: LayoutGrid, color: "text-indigo-400" },
  features: { title: "Features", icon: Sparkles, color: "text-cyan-400" },
  cta: { title: "Call to Action", icon: PlusCircle, color: "text-rose-400" },
  testimonials: { title: "Testimonials", icon: FileText, color: "text-emerald-400" },
  faq: { title: "FAQ", icon: FileText, color: "text-purple-400" },
  blog: { title: "Blog Posts", icon: FileText, color: "text-orange-400" },
  usp: { title: "Unique Selling Points", icon: Settings, color: "text-indigo-400" },
  navbar: { title: "Navigation Menu", icon: Menu, color: "text-white" },
  trustbar: { title: "Trust Signals", icon: ShieldCheck, color: "text-amber-200" },
  footer: { title: "Footer", icon: Menu, color: "text-slate-300" },
};

const HOME_SECTION_BLUEPRINTS: Array<{ type: SectionType; adminTitle: string }> = [
  { type: "hero", adminTitle: "Hero Section" },
  { type: "collections", adminTitle: "Collections" },
  { type: "why", adminTitle: "Why Section" },
  { type: "products", adminTitle: "Products" },
  { type: "features", adminTitle: "Features" },
  { type: "testimonials", adminTitle: "Testimonials" },
  { type: "cta", adminTitle: "Call to Action" },
  { type: "footer", adminTitle: "Footer" },
];

export const PageEditor: React.FC<PageEditorProps> = ({
  initialData,
  onSave,
  isLoading = false,
}) => {
  const router = useRouter();
  const [page, setPage] = useState<Page>(initialData || createPageDraft());
  const [activeTab, setActiveTab] = useState("basic");

  useEffect(() => {
    if (initialData) {
      const hero = normalizeHero(initialData.hero);
      const sections = Array.isArray(initialData.sections) ? initialData.sections : [];
      const normalizedSections = sections.map((section) => ({
        ...section,
        content: normalizeSectionContent(section.type, section.content),
      }));
      const isHomePage = initialData.page === "home" || initialData.slug === "home";
      const missingHomeSections = isHomePage
        ? HOME_SECTION_BLUEPRINTS.filter(
            (blueprint) => !normalizedSections.some((section) => section.type === blueprint.type),
          ).map((blueprint, index) => ({
            id: `${blueprint.type}-${index + 1}`,
            type: blueprint.type,
            enabled: true,
            adminTitle: blueprint.adminTitle,
            content: createDefaultSectionContent(blueprint.type),
          }))
        : [];

      setPage({
        ...initialData,
        hero,
        sections: [...normalizedSections, ...missingHomeSections],
      });
    }
  }, [initialData]);

  const updateSeo = (updates: Partial<Page["seo"]>) => {
    setPage(prev => ({
      ...prev,
      seo: { ...prev.seo, ...updates }
    }));
  };

  const addSection = (type: SectionType) => {
    const newSection: PageBlock = {
      id: Math.random().toString(36).slice(2, 11),
      type,
      enabled: true,
      adminTitle: SECTION_INFO[type].title,
      content: createDefaultSectionContent(type),
    };
    setPage(prev => ({ ...prev, sections: [...prev.sections, newSection] }));
    toast.success(`${SECTION_INFO[type].title} added`);
  };

  const removeSection = (id: string) => {
    setPage(prev => ({
      ...prev,
      sections: prev.sections.filter(s => s.id !== id)
    }));
  };

  const updateSection = (id: string, updates: Partial<PageBlock>) => {
    setPage(prev => ({
      ...prev,
      sections: prev.sections.map(s => s.id === id ? { ...s, ...updates } : s)
    }));
  };

  const updateSectionContent = (id: string, contentUpdates: any) => {
    setPage(prev => ({
      ...prev,
      sections: prev.sections.map(s => {
        if (s.id !== id) return s;
        const nextContent = { ...s.content, ...contentUpdates };
        return { ...s, content: nextContent };
      }),
      ...(prev.sections.find(s => s.id === id && s.type === "hero")
        ? {
            hero: normalizeHero({
              ...prev.hero,
              ...prev.sections.find(s => s.id === id && s.type === "hero")?.content,
              ...contentUpdates,
            }),
          }
        : {}),
    }));
  };

  const sanitizeHeroForSave = (heroContent: any) => {
    if (!heroContent) return heroContent;
    const { mediaItems, ...rest } = heroContent;
    return {
      ...rest,
      mediaIds: Array.isArray(rest.mediaIds) ? rest.mediaIds.filter(Boolean) : [],
      images: Array.isArray(rest.images) ? rest.images.filter(Boolean) : [],
    };
  };

  const handleSave = async () => {
    if (!page.title || !page.slug) {
      toast.error("Please provide both a title and slug.");
      return;
    }

    const heroSection = page.sections.find(s => s.type === "hero");
    const updatedPage = {
      ...page,
      hero: sanitizeHeroForSave(normalizeHero(heroSection?.content || page.hero)),
      sections: page.sections.map((section) =>
        section.type === "hero"
          ? { ...section, content: sanitizeHeroForSave(normalizeHero(section.content || page.hero)) }
          : section,
      ),
    };

    console.log("Saving:", updatedPage);
    await onSave(updatedPage);
  };

  return (
    <div className="space-y-8 pb-32 text-white font-['Inter',sans-serif]">
      {/* Premium Header */}
      <div className="rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-[#111] via-[#0a0a0a] to-[#151005] p-8 shadow-2xl shadow-black/50">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-6">
            <Button
              variant="ghost"
              size="icon"
              className="h-14 w-14 rounded-2xl border border-white/5 bg-white/5 text-white hover:bg-white/10 transition-all"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-200/40">
                  Production Page Builder
                </p>
              </div>
              <h1 className="mt-2 text-4xl font-bold tracking-tight text-white md:text-5xl">
                {initialData ? page.title : "New Dynamic Page"}
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-4 rounded-[1.5rem] border border-white/5 bg-black/40 px-5 py-3.5 backdrop-blur-md">
              <div className="flex flex-col">
                <Label className="text-[9px] font-black uppercase tracking-widest text-white/30">Status</Label>
                <span className="text-xs font-bold text-amber-200 uppercase tracking-tighter">
                  {page.status}
                </span>
              </div>
              <Switch
                checked={page.status === "published"}
                onCheckedChange={(checked) =>
                  setPage({
                    ...page,
                    status: checked ? "published" : "draft",
                    isPublished: checked,
                  })
                }
                className="data-[state=checked]:bg-amber-500"
              />
            </div>

            <Button
              variant="outline"
              className="h-14 rounded-2xl border-white/5 bg-white/5 px-8 text-xs font-black uppercase tracking-widest text-white/70 hover:bg-white/10 hover:text-white transition-all"
              onClick={() => {
                if (!page.slug) {
                  toast.error("Please provide a slug before previewing.");
                  return;
                }
                // Save current state to local storage for the preview page to consume
                localStorage.setItem(`preview_draft_${page.slug}`, JSON.stringify(page));
                window.open(`/preview/${page.slug}`, '_blank');
              }}
            >
              <Eye className="mr-3 h-4 w-4" /> Unsaved Preview
            </Button>

            <Button
              type="button"
              className="h-14 rounded-2xl bg-amber-500 px-10 text-xs font-black uppercase tracking-widest text-black shadow-xl shadow-amber-500/20 hover:bg-amber-400 active:scale-95 transition-all cursor-pointer z-50"
              onClick={() => {
                console.log("UPDATE BUTTON CLICKED - Starting handleSave");
                void handleSave();
              }}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-3">
                  <Loader2 className="h-4 w-4 animate-spin text-black" />
                  <span>Saving...</span>
                </div>
              ) : (
                <>
                  <Save className="mr-3 h-4 w-4" />
                  {initialData ? "Update Page" : "Publish CMS"}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* Navigation Sidebar */}
        <div className="xl:col-span-3 space-y-4 sticky top-8">
          <div className="rounded-[2rem] border border-white/5 bg-black/40 p-3 backdrop-blur-md">
            <nav className="flex flex-col gap-2">
              {[
                { id: "basic", label: "General Settings", icon: FileText },
                { id: "sections", label: "Page Sections", icon: LayoutGrid },
                { id: "seo", label: "SEO & Social", icon: Settings },
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-4 rounded-2xl p-4 transition-all ${
                    activeTab === item.id 
                      ? "bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-lg shadow-amber-500/5 font-bold" 
                      : "text-white/40 hover:bg-white/5 hover:text-white border border-transparent"
                  }`}
                >
                  <item.icon size={20} />
                  <span className="text-xs font-black uppercase tracking-widest">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {activeTab === "sections" && (
            <div className="rounded-[2rem] border border-white/5 bg-black/40 p-6 backdrop-blur-md">
               <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-6 flex items-center gap-2">
                 <PlusCircle size={14} /> Available Sections
               </h3>
               <div className="grid grid-cols-1 gap-3">
                  {(Object.keys(SECTION_INFO) as SectionType[]).map(type => (
                    <button
                      key={type}
                      onClick={() => addSection(type)}
                      className="group flex flex-col items-start gap-1 rounded-2xl border border-white/5 bg-[#1a1a1a] p-4 text-left hover:bg-amber-500 hover:text-black transition-all duration-300 transform hover:-translate-y-1 shadow-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl bg-white/5 group-hover:bg-black/10 transition-colors`}>
                          {React.createElement(SECTION_INFO[type].icon, { size: 16 })}
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest">{SECTION_INFO[type].title}</span>
                      </div>
                    </button>
                  ))}
               </div>
            </div>
          )}
        </div>

        {/* Workspace */}
        <div className="xl:col-span-9">
          <AnimatePresence mode="wait">
             {activeTab === "basic" && (
                <motion.div
                  key="basic"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="rounded-[2.5rem] border border-white/5 bg-[#111] p-10 shadow-xl overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                      <FileText size={120} />
                    </div>
                    <h2 className="text-xl font-bold mb-8 flex items-center gap-3">
                      <div className="h-8 w-1 bg-amber-500 rounded-full" />
                      Core Identities
                    </h2>
                    <div className="grid gap-8">
                       <div className="space-y-3">
                          <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Page Title</Label>
                          <Input 
                            value={page.title} 
                            onChange={e => setPage({...page, title: e.target.value})}
                            className="h-16 rounded-2xl border-white/10 bg-white/5 text-xl font-bold px-6 focus:ring-amber-500/40"
                            placeholder="e.g. Our Sacred Collection"
                          />
                       </div>
                       <div className="space-y-3">
                          <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">URL Slug</Label>
                          <div className="relative">
                            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 font-bold">/</span>
                            <Input 
                              value={page.slug} 
                              onChange={e => setPage({...page, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})}
                              className="h-16 rounded-2xl border-white/10 bg-white/5 pl-10 text-lg font-mono focus:ring-amber-500/40"
                              placeholder="sacred-collection"
                            />
                          </div>
                       </div>
                    </div>
                  </div>
                </motion.div>
             )}

             {activeTab === "sections" && (
                <motion.div
                  key="sections"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <Reorder.Group 
                    axis="y" 
                    values={page.sections} 
                    onReorder={newSections => setPage({...page, sections: newSections})}
                    className="space-y-6"
                  >
                    {page.sections.map((section) => (
                      <Reorder.Item 
                        key={section.id} 
                        value={section}
                        className="group"
                      >
                        <SectionCard 
                          section={section} 
                          onUpdate={(u) => updateSection(section.id, u)}
                          onUpdateContent={(c) => updateSectionContent(section.id, c)}
                          onRemove={() => removeSection(section.id)}
                        />
                      </Reorder.Item>
                    ))}
                  </Reorder.Group>

                  {page.sections.length === 0 && (
                    <div className="rounded-[2.5rem] border border-dashed border-white/10 bg-white/5 p-20 text-center">
                      <Sparkles size={48} className="mx-auto mb-6 text-white/10" />
                      <p className="text-white/40 font-medium tracking-wide">No sections yet. Add your first block from the sidebar.</p>
                    </div>
                  )}
                </motion.div>
             )}

             {activeTab === "seo" && (
                <motion.div
                  key="seo"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="rounded-[2.5rem] border border-white/5 bg-[#111] p-10 shadow-xl">
                    <h2 className="text-xl font-bold mb-8 flex items-center gap-3 text-emerald-400">
                      <div className="h-8 w-1 bg-emerald-400 rounded-full" />
                      Search & Social Optimization
                    </h2>
                    <div className="grid gap-10">
                      <div className="grid lg:grid-cols-2 gap-10">
                        <div className="space-y-6">
                           <div className="space-y-3">
                              <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Meta Title</Label>
                              <Input 
                                value={page.seo.metaTitle} 
                                onChange={e => updateSeo({ metaTitle: e.target.value })}
                                className="h-14 rounded-2xl border-white/10 bg-white/5"
                                placeholder="Max 60 characters recommended"
                              />
                           </div>
                           <div className="space-y-3">
                              <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Meta Description</Label>
                              <Textarea 
                                value={page.seo.metaDescription} 
                                onChange={e => updateSeo({ metaDescription: e.target.value })}
                                className="min-h-[160px] rounded-2xl border-white/10 bg-white/5 p-4"
                                placeholder="A compelling summary for search results..."
                              />
                           </div>
                        </div>

                        <div className="space-y-6">
                           <div className="space-y-3">
                              <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Social Share Image (OG)</Label>
                              <div className="relative group/image aspect-video rounded-3xl border border-white/10 bg-black/40 overflow-hidden flex flex-col items-center justify-center border-dashed">
                                {page.seo.ogImage ? (
                                  <>
                                    <img src={page.seo.ogImage} className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700" alt="OG Preview" />
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/60">
                                      <MediaLibraryModal 
                                        onSelect={(m) => updateSeo({ ogImage: m.url })} 
                                        trigger={
                                          <Button className="bg-white text-black font-black uppercase tracking-widest text-[10px] h-12 rounded-xl">Replace Image</Button>
                                        } 
                                      />
                                    </div>
                                  </>
                                ) : (
                                  <div className="text-center p-6">
                                    <ImageIcon size={40} className="mx-auto mb-4 text-white/10" />
                                    <MediaLibraryModal 
                                      onSelect={(m) => updateSeo({ ogImage: m.url })} 
                                      trigger={
                                        <Button className="bg-amber-400 text-black font-black uppercase tracking-widest text-[10px] h-12 rounded-xl">Select Image</Button>
                                      } 
                                    />
                                    <p className="text-[10px] text-white/20 mt-4 tracking-widest font-black uppercase">1200x630 Recommended</p>
                                  </div>
                                )}
                              </div>
                           </div>
                           <div className="space-y-3">
                              <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Focus Keywords</Label>
                              <Input 
                                value={page.seo.keywords} 
                                onChange={e => updateSeo({ keywords: e.target.value })}
                                className="h-14 rounded-2xl border-white/10 bg-white/5"
                                placeholder="gems, spiritual, luxury (comma separated)"
                              />
                           </div>
                        </div>
                      </div>

                      {/* SERP PREVIEW */}
                      <div className="rounded-3xl bg-black/40 border border-white/5 p-8">
                         <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-6 flex items-center gap-2">
                           <Eye size={14} /> Google Search Preview
                         </h4>
                         <div className="space-y-1 max-w-xl">
                            <p className="text-sm text-white/40 truncate">https://gems-ratana.com/{page.slug}</p>
                            <p className="text-xl text-[#8ab4f8] font-medium leading-tight truncate">
                              {page.seo.metaTitle || page.title || "Page Title Placeholder"}
                            </p>
                            <p className="text-sm text-white/60 line-clamp-2 leading-relaxed">
                              {page.seo.metaDescription || "Enter a meta description to see how your page appears in search engine results. This summary is vital for click-through rates."}
                            </p>
                         </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
             )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

// Section Editor Component
const SectionCard = ({ section, onUpdate, onUpdateContent, onRemove }: { section: PageBlock; onUpdate: (u: any) => void; onUpdateContent: (c: any) => void; onRemove: () => void }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');
  const info = SECTION_INFO[section.type];

  return (
    <div className={`rounded-[2.5rem] border ${section.enabled ? 'border-white/10' : 'border-white/5 opacity-60'} bg-[#111] shadow-2xl transition-all duration-300`}>
      <div className="flex items-center justify-between p-6 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center gap-5">
           <div className="cursor-grab active:cursor-grabbing text-white/20 hover:text-white/40 transition-colors">
             <GripVertical size={20} />
           </div>
           <div className={`p-4 rounded-[1.25rem] bg-white/5 shadow-inner ${info.color}`}>
             {React.createElement(info.icon, { size: 24 })}
           </div>
           <div>
              <div className="flex items-center gap-3">
                <Input 
                  value={section.adminTitle}
                  onChange={(e) => onUpdate({ adminTitle: e.target.value })}
                  onClick={(e) => e.stopPropagation()}
                  className="h-8 w-fit bg-transparent border-none p-0 text-xl font-bold tracking-tight text-white focus-visible:ring-0"
                />
                {!section.enabled && <span className="bg-white/5 text-white/30 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter border border-white/5">Disabled</span>}
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mt-1">{section.type}</p>
           </div>
        </div>

        <div className="flex items-center gap-4" onClick={(e) => e.stopPropagation()}>
           <div className="flex items-center bg-black/40 p-1 rounded-xl border border-white/5 mr-4">
              <button 
                onClick={() => setViewMode('edit')}
                className={`px-4 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all ${viewMode === 'edit' ? 'bg-amber-500 text-black' : 'text-white/40 hover:text-white'}`}
              >
                Edit
              </button>
              <button 
                onClick={() => setViewMode('preview')}
                className={`px-4 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all ${viewMode === 'preview' ? 'bg-amber-500 text-black' : 'text-white/40 hover:text-white'}`}
              >
                Preview
              </button>
           </div>
           <div className="flex items-center gap-3 border-r border-white/5 pr-4 mr-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-white/20">{section.enabled ? 'Active' : 'Off'}</span>
              <Switch checked={section.enabled} onCheckedChange={(enabled) => onUpdate({ enabled })} className="data-[state=checked]:bg-emerald-500 h-5 w-9" />
           </div>
           <Button variant="ghost" size="icon" className="h-10 w-10 text-white/20 hover:text-rose-400 hover:bg-rose-400/10 rounded-xl" onClick={onRemove}>
             <Trash2 size={18} />
           </Button>
           <Button variant="ghost" size="icon" className="h-10 w-10 text-white/40 rounded-xl" onClick={() => setIsExpanded(!isExpanded)}>
             {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
           </Button>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-8 pt-2 border-t border-white/5">
               {viewMode === 'preview' ? (
                 <div className="rounded-[2rem] overflow-hidden border border-white/10 bg-black max-h-[500px] overflow-y-auto custom-scrollbar scale-[0.8] origin-top">
                    {/* Simulated Preview Rendering */}
                    <div className="pointer-events-none">
                      {section.type === 'hero' && <HeroSection content={section.content} />}
                      {section.type === 'collections' && <CollectionsSection content={section.content} />}
                      {section.type === 'why' && <WhySection content={section.content} />}
                      {section.type === 'products' && <ProductsSection content={section.content} />}
                      {section.type === 'features' && <FeaturesSection content={section.content} />}
                      {section.type === 'cta' && <CTASection content={section.content} />}
                      {section.type === 'testimonials' && <TestimonialsSection content={section.content} />}
                      {section.type === 'faq' && <FAQSection content={section.content} />}
                      {section.type === 'blog' && <BlogSection content={section.content} />}
                      {section.type === 'usp' && <USPSection content={section.content} />}
                      {section.type === 'navbar' && <NavbarSection content={section.content} />}
                      {section.type === 'trustbar' && <TrustBarSection content={section.content} />}
                      {section.type === 'footer' && <FooterSection content={section.content} />}
                    </div>
                 </div>
               ) : (
                 <div className="bg-black/20 rounded-[2rem] p-8 border border-white/5">
                   <div className="grid gap-8">
                     {section.type === 'hero' && <HeroEditor content={section.content} onChange={onUpdateContent} />}
                     {section.type === 'collections' && <CollectionsEditor content={section.content} onChange={onUpdateContent} />}
                     {section.type === 'why' && <WhyEditor content={section.content} onChange={onUpdateContent} />}
                     {section.type === 'products' && <ProductsEditor content={section.content} onChange={onUpdateContent} />}
                     {section.type === 'features' && <FeaturesEditor content={section.content} onChange={onUpdateContent} />}
                     {section.type === 'cta' && <CTAEditor content={section.content} onChange={onUpdateContent} />}
                     {section.type === 'testimonials' && <TestimonialsEditor content={section.content} onChange={onUpdateContent} />}
                     {section.type === 'faq' && <FAQEditor content={section.content} onChange={onUpdateContent} />}
                     {section.type === 'blog' && <BlogEditor content={section.content} onChange={onUpdateContent} />}
                     {section.type === 'usp' && <USPEditor content={section.content} onChange={onUpdateContent} />}
                     {section.type === 'navbar' && <NavbarEditor content={section.content} onChange={onUpdateContent} />}
                     {section.type === 'trustbar' && <TrustBarEditor content={section.content} onChange={onUpdateContent} />}
                     {section.type === 'footer' && <FooterEditor content={section.content} onChange={onUpdateContent} />}
                   </div>
                 </div>
               )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* --- Simplified Section Preview Renderers (Internal to Editor) --- */
const HeroSection = ({ content }: any) => {
  const hero = normalizeHero(content);
  const images = hero.images || [];
  const activeImage = images[0] || "";
  return (
    <div className="relative min-h-[420px] overflow-hidden rounded-[2rem] bg-black p-12 text-white">
      {activeImage && (
        <img
          src={activeImage}
          className="absolute inset-0 h-full w-full object-cover opacity-40"
          alt={hero.imageAlt || hero.title}
        />
      )}
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative z-10 max-w-3xl">
        <p className="mb-4 text-[10px] font-black uppercase tracking-[0.45em] text-white/40">
          {hero.eyebrow || "Unlock the Power of Gemstones"}
        </p>
        <h1 className="mb-4 font-serif text-5xl leading-[0.95] text-white md:text-7xl">
          {hero.title}
        </h1>
        <p className="mb-8 max-w-xl text-base text-white/65 md:text-xl">
          {hero.subtitle}
        </p>
        <div className="inline-flex rounded-full bg-amber-400 px-6 py-3 text-xs font-black uppercase tracking-[0.3em] text-black">
          {hero.buttonText}
        </div>
      </div>
    </div>
  );
};

const NavbarSection = ({ content }: any) => (
  <div className="bg-black/80 p-4 border-b border-white/5 flex items-center justify-between px-10">
    <div className="text-xl font-black tracking-tighter text-white uppercase italic">{content.logo || 'GEMS_RATNA'}</div>
    <div className="flex gap-6">
      {(content.links || []).map((l:any) => <span key={l.id} className="text-[10px] font-black uppercase text-white/60">{l.label}</span>)}
    </div>
  </div>
);

const TrustBarSection = ({ content }: any) => (
  <div className="bg-[#f5f5f5] py-4 flex justify-around text-black border-y border-neutral-200">
    {(content.items || []).map((t:any) => (
      <div key={t.id} className="flex items-center gap-3">
        <div className="h-6 w-6 bg-black/5 rounded-md" />
        <span className="text-[9px] font-black uppercase tracking-widest">{t.text}</span>
      </div>
    ))}
  </div>
);

const CollectionsSection = ({ content }: any) => (
  <div className="bg-black p-12">
    <h2 className="text-2xl font-bold mb-8 text-center">{content.title}</h2>
    <div className="grid grid-cols-4 gap-4">
      {[1,2,3,4].map(i => <div key={i} className="aspect-[3/4] bg-neutral-800 rounded-2xl border border-white/5" />)}
    </div>
  </div>
);

const WhySection = ({ content }: any) => (
  <div className="bg-white text-black p-12">
    <h2 className="text-3xl font-bold mb-8 text-center">{content.title}</h2>
    <div className="grid grid-cols-4 gap-4">
      {(content.points || []).map((point: any) => (
        <div key={point.id} className="rounded-2xl border border-neutral-200 p-4 bg-white">
          <p className="font-bold mb-2">{point.title}</p>
          <p className="text-xs text-neutral-500">{point.description}</p>
        </div>
      ))}
    </div>
  </div>
);

const ProductsSection = ({ content }: any) => (
  <div className="bg-[#faf8f5] text-black p-12">
    <h2 className="text-3xl font-bold mb-8 text-center">{content.title}</h2>
    <div className="grid grid-cols-4 gap-4">
      {(content.items || []).map((item: any) => (
        <div key={item.id} className="rounded-2xl overflow-hidden bg-white border border-neutral-200">
          <div className="aspect-[4/5] bg-neutral-200">
            {item.image ? <img src={item.image} className="w-full h-full object-cover" alt={item.name} /> : null}
          </div>
          <div className="p-4">
            <p className="font-bold">{item.name}</p>
            <p className="text-xs text-neutral-500">{item.price}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const FeaturesSection = ({ content }: any) => (
  <div className="bg-[#05081a] text-white p-12">
    <h2 className="text-3xl font-bold mb-8 text-center">{content.title}</h2>
    <div className="grid grid-cols-4 gap-4">
      {(content.items || []).map((item: any) => (
        <div key={item.id} className="rounded-2xl border border-white/10 p-4 bg-white/5">
          <p className="font-bold mb-2">{item.title}</p>
          <p className="text-xs text-white/60">{item.description}</p>
        </div>
      ))}
    </div>
  </div>
);

const CTASection = ({ content }: any) => (
  <div className="p-8">
    <div className={`p-10 rounded-[2rem] text-center ${content.theme === 'accent' ? 'bg-amber-400 text-black' : 'bg-neutral-900 text-white'}`}>
      <h2 className="text-2xl font-bold mb-4">{content.title}</h2>
      <div className="bg-current opacity-20 h-10 w-32 mx-auto rounded-full" />
    </div>
  </div>
);

const TestimonialsSection = ({ content }: any) => (
  <div className="p-12 bg-neutral-950">
    <div className="grid grid-cols-3 gap-4">
      {(content.items || []).map((t:any) => (
        <div key={t.id} className="p-6 bg-white/5 rounded-2xl border border-white/5 text-[10px]">
          <p className="italic mb-4">"{t.content || t.message || ""}"</p>
          <p className="font-bold">{t.name}</p>
        </div>
      ))}
    </div>
  </div>
);

const FooterSection = ({ content }: any) => (
  <div className="p-12 bg-[#030816] text-white">
    <div className="grid grid-cols-3 gap-8">
      <div>
        <p className="text-2xl font-bold mb-4">{content.brandName || "Gems_Ratna"}</p>
        <p className="text-xs text-white/50">{content.brandText}</p>
      </div>
      <div className="space-y-2">
        {(content.links || []).map((link: any) => (
          <p key={link.id} className="text-xs text-white/60">{link.label}</p>
        ))}
      </div>
      <div className="space-y-2">
        {content.contact?.phone && <p className="text-xs text-white/60">{content.contact.phone}</p>}
        {content.contact?.email && <p className="text-xs text-white/60">{content.contact.email}</p>}
      </div>
    </div>
  </div>
);

const FAQSection = ({ content }: any) => (
  <div className="p-12 bg-black">
    <div className="space-y-4">
      {(content.items || []).map((t:any) => (
        <div key={t.id} className="p-4 bg-white/5 border border-white/5 rounded-xl text-xs font-bold">{t.question}</div>
      ))}
    </div>
  </div>
);

const BlogSection = ({ content }: any) => (
  <div className="p-12 bg-black">
    <div className={`grid gap-4 ${content.layout === 'grid' ? 'grid-cols-3' : 'grid-cols-1'}`}>
      {[1,2,3].map(i => <div key={i} className="aspect-video bg-neutral-900 rounded-xl" />)}
    </div>
  </div>
);

const USPSection = ({ content }: any) => (
  <div className="p-12 bg-neutral-950">
    <div className="grid grid-cols-3 gap-8">
      {(content.items || []).map((t:any) => (
        <div key={t.id} className="text-center">
          <div className="h-10 w-10 bg-amber-400/20 mx-auto mb-4 rounded-lg" />
          <p className="text-xs font-bold">{t.title}</p>
        </div>
      ))}
    </div>
  </div>
);

/* --- Specific Section Editors --- */

const HeroEditor = ({ content, onChange }: { content: any; onChange: (u: any) => void }) => {
  const handleHeroPatch = (updates: any) => onChange(updates);

  return (
    <div className="space-y-8">
      <div className="grid lg:grid-cols-2 gap-10">
        <div className="space-y-6">
          <Field label="Hero Title" value={content.title} onChange={v => handleHeroPatch({ title: v })} />
          <Field label="Hero Subtitle" value={content.subtitle} onChange={v => handleHeroPatch({ subtitle: v })} textarea />
          <div className="grid grid-cols-2 gap-4">
            <Field label="Button Text" value={content.buttonText} onChange={v => handleHeroPatch({ buttonText: v })} />
            <Field label="Button Link" value={content.buttonLink} onChange={v => handleHeroPatch({ buttonLink: v })} />
          </div>

          <div className="flex items-center justify-between bg-white/5 p-6 rounded-[2rem]">
            <div className="space-y-1">
              <label className="text-xs font-bold text-white tracking-tight">Overlay Darkening</label>
              <p className="text-[9px] text-white/40 font-black uppercase tracking-widest">Global across all media</p>
            </div>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="100"
                value={content.overlayOpacity || 40}
                onChange={e => handleHeroPatch({ overlayOpacity: parseInt(e.target.value) })}
                className="accent-amber-500 w-32"
              />
              <span className="text-xs font-mono font-bold text-amber-200">{content.overlayOpacity || 40}%</span>
            </div>
          </div>
        </div>

        <HeroMediaPicker content={content} onChange={handleHeroPatch} />
      </div>
    </div>
  );
};

const HeroMediaPicker = ({ content, onChange }: { content: any; onChange: (u: any) => void }) => {
  const [availableMedia, setAvailableMedia] = useState<any[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const syncHeroPayload = (items: any[]) => {
    onChange({
      mediaIds: items.map((item) => String(item._id || item.id)),
      mediaItems: items,
      images: items.filter((item) => item?.type !== "video").map((item) => item.url).filter(Boolean),
    });
  };

  const persistMediaState = async (items: any[]) => {
    const updates = items.map((item, index) => ({
      _id: String(item._id || item.id),
      order: index,
      isActive: item.isActive !== false,
      category: "hero",
      type: item.type || "image",
    }));

    try {
      await fetch("/api/admin/media", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updates }),
      });
    } catch (error) {
      console.error("Failed to persist hero media order:", error);
    }
  };

  const hydrateSelected = (items: any[], fallbackIds: string[] = []) => {
    const normalized = items
      .filter(Boolean)
      .map((item, index) => ({
        ...item,
        _id: String(item._id || item.id),
        order: typeof item.order === "number" ? item.order : index,
        isActive: item.isActive !== false,
        category: item.category || "hero",
        type: item.type || (String(item.url || "").match(/\.(mp4|mov|webm)$/i) ? "video" : "image"),
      }))
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    if (normalized.length === 0 && fallbackIds.length > 0) {
      const matched = fallbackIds
        .map((id) => availableMedia.find((item) => String(item._id) === id))
        .filter(Boolean);
      return hydrateSelected(matched);
    }

    return normalized;
  };

  useEffect(() => {
    const loadMedia = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/admin/media?category=hero");
        const data = await response.json();
        if (data.success) {
          const sorted = (data.data || []).sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0));
          setAvailableMedia(sorted);
        }
      } catch (error) {
        console.error("Failed to load hero media", error);
      } finally {
        setLoading(false);
      }
    };

    loadMedia();
  }, []);

  useEffect(() => {
    const fallbackIds = Array.isArray(content.mediaIds) ? content.mediaIds.filter(Boolean) : [];
    const fromContent = Array.isArray(content.mediaItems) ? content.mediaItems : [];
    const source = fromContent.length > 0 ? fromContent : [];
    const nextSelected = hydrateSelected(source, fallbackIds);
    setSelectedMedia(nextSelected);
  }, [content.mediaIds, content.mediaItems, availableMedia]);

  const addMedia = (item: any) => {
    const normalized = {
      ...item,
      _id: String(item._id || item.id),
      order: selectedMedia.length,
      isActive: item.isActive !== false,
      category: "hero",
      type: item.type || (String(item.url || "").match(/\.(mp4|mov|webm)$/i) ? "video" : "image"),
    };
    const next = [...selectedMedia, normalized];
    setSelectedMedia(next);
    syncHeroPayload(next);
    void persistMediaState(next);
  };

  const removeMedia = (id: string) => {
    const next = selectedMedia
      .filter((item) => String(item._id) !== String(id))
      .map((item, index) => ({ ...item, order: index }));
    setSelectedMedia(next);
    syncHeroPayload(next);
    void persistMediaState(next);
  };

  const toggleActive = (id: string, isActive: boolean) => {
    const next = selectedMedia.map((item) =>
      String(item._id) === String(id) ? { ...item, isActive } : item,
    );
    setSelectedMedia(next);
    syncHeroPayload(next);
    void persistMediaState(next);
  };

  const reorderSelected = (items: any[]) => {
    const next = items.map((item, index) => ({ ...item, order: index }));
    setSelectedMedia(next);
    syncHeroPayload(next);
    void persistMediaState(next);
  };

  const selectedIds = new Set(selectedMedia.map((item) => String(item._id)));
  const previewItem = selectedMedia.find((item) => item.isActive !== false) || selectedMedia[0];

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border border-white/5 bg-black/30 p-5">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-200">Hero Media Picker</h3>
            <p className="mt-1 text-xs text-white/40">Filter: category = hero</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="h-9 rounded-xl border-white/10 text-xs font-bold"
            onClick={() => onChange({ mediaIds: selectedMedia.map((item) => String(item._id)), mediaItems: selectedMedia, images: selectedMedia.filter((item) => item.type !== "video").map((item) => item.url) })}
          >
            Apply Selection
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <div className="text-[10px] font-black uppercase tracking-widest text-white/30">Available Media</div>
            <div className="max-h-[320px] overflow-auto rounded-2xl border border-white/5 p-2">
              {loading ? (
                <div className="p-6 text-center text-white/40">Loading hero media...</div>
              ) : availableMedia.length === 0 ? (
                <div className="p-6 text-center text-white/40">No hero media found</div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {availableMedia.map((item) => {
                    const isSelected = selectedIds.has(String(item._id));
                    return (
                      <button
                        key={item._id}
                        type="button"
                        onClick={() => (!isSelected ? addMedia(item) : removeMedia(String(item._id)))}
                        className={`group overflow-hidden rounded-2xl border text-left transition-all ${
                          isSelected ? "border-amber-500/60 ring-2 ring-amber-500/20" : "border-white/5 hover:border-white/20"
                        }`}
                      >
                        <div className="aspect-[4/5] bg-black/40">
                          {item.type === "video" ? (
                            <video src={item.url} className="h-full w-full object-cover" muted playsInline />
                          ) : (
                            <img src={item.url} alt={item.alt || item.filename || ""} className="h-full w-full object-cover" />
                          )}
                        </div>
                        <div className="p-3">
                          <p className="truncate text-[11px] font-bold text-white">{item.filename || item.alt || "Media"}</p>
                          <p className="text-[9px] uppercase tracking-[0.25em] text-white/30">{item.category || "hero"}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <div className="text-[10px] font-black uppercase tracking-widest text-white/30">Selected Order</div>
            <Reorder.Group axis="y" values={selectedMedia} onReorder={reorderSelected} className="space-y-3">
              {selectedMedia.map((item) => (
                <Reorder.Item key={String(item._id)} value={item} className="rounded-2xl border border-white/5 bg-black/40 p-3">
                  <div className="flex items-center gap-3">
                    <button type="button" className="cursor-grab text-white/20">
                      <GripVertical size={18} />
                    </button>
                    <div className="h-14 w-14 overflow-hidden rounded-xl bg-white/5">
                      {item.type === "video" ? (
                        <video src={item.url} className="h-full w-full object-cover" muted playsInline />
                      ) : (
                        <img src={item.url} alt={item.alt || ""} className="h-full w-full object-cover" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-white">{item.filename || item.alt || "Media"}</p>
                      <p className="text-[9px] uppercase tracking-[0.25em] text-white/30">{item.type || "image"}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={item.isActive !== false}
                        onCheckedChange={(checked) => toggleActive(String(item._id), checked)}
                        className="data-[state=checked]:bg-emerald-500"
                      />
                      <button
                        type="button"
                        onClick={() => removeMedia(String(item._id))}
                        className="rounded-xl p-2 text-white/25 hover:bg-white/5 hover:text-rose-400"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </Reorder.Item>
              ))}
            </Reorder.Group>

            <div className="rounded-3xl border border-white/5 bg-white/5 p-4">
              <p className="mb-3 text-[10px] font-black uppercase tracking-[0.25em] text-white/30">Live Preview</p>
              {previewItem ? (
                <div className="relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/40 aspect-[16/10]">
                  {previewItem.type === "video" ? (
                    <video
                      src={previewItem.url}
                      className="absolute inset-0 h-full w-full object-cover"
                      autoPlay
                      loop
                      muted
                      playsInline
                    />
                  ) : (
                    <img src={previewItem.url} alt={previewItem.alt || ""} className="absolute inset-0 h-full w-full object-cover" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/60">
                      {content.eyebrow || "Unlock the Power of Gemstones"}
                    </p>
                    <p className="mt-2 text-lg font-bold text-white">{content.title || "Hero Title"}</p>
                  </div>
                </div>
              ) : (
                <div className="rounded-[1.5rem] border border-dashed border-white/10 py-14 text-center text-white/30">
                  Select hero media to preview
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const NavbarEditor = ({ content, onChange }: { content: any; onChange: (u: any) => void }) => (
  <div className="space-y-8">
    <div className="space-y-4 text-white">
      <Label className="text-[10px] font-black uppercase tracking-widest text-white/30">Brand Logo / Header Text</Label>
      <Input 
        value={content.logo} 
        onChange={e => onChange({ logo: e.target.value })} 
        className="h-14 bg-black/40 border-white/10 rounded-2xl text-xl font-black tracking-tighter"
        placeholder="GEMS_RATNA"
      />
    </div>
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-[10px] font-black uppercase tracking-widest text-white/30">Navigation Menu Items</Label>
        <Button onClick={() => onChange({ links: [...(content.links || []), { id: Math.random().toString(), label: "New Link", href: "/" }] })} variant="outline" size="sm" className="h-8 rounded-xl border-white/10">+ Add Link</Button>
      </div>
      <div className="grid gap-4">
        {(content.links || []).map((link: any, idx: number) => (
          <div key={link.id} className="flex items-center gap-4 bg-black/40 p-4 rounded-2xl border border-white/5">
            <Input 
              value={link.label} 
              onChange={e => {
                const newLinks = [...content.links];
                newLinks[idx] = { ...link, label: e.target.value };
                onChange({ links: newLinks });
              }} 
              className="h-10 bg-transparent border-white/5 rounded-xl text-[10px] font-black uppercase"
              placeholder="Label"
            />
            <Input 
              value={link.href} 
              onChange={e => {
                const newLinks = [...content.links];
                newLinks[idx] = { ...link, href: e.target.value };
                onChange({ links: newLinks });
              }} 
              className="h-10 bg-transparent border-white/10 rounded-xl text-[10px] font-medium"
              placeholder="URL (e.g. /shop)"
            />
            <button onClick={() => onChange({ links: content.links.filter((_:any, i:number) => i !== idx) })} className="text-white/20 hover:text-rose-400"><Trash2 size={16} /></button>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const TrustBarEditor = ({ content, onChange }: { content: any; onChange: (u: any) => void }) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
       <Label className="text-[10px] font-black uppercase tracking-widest text-white/30">Trust Signals</Label>
       <Button onClick={() => onChange({ items: [...(content.items || []), { id: Math.random().toString(), icon: "Star", text: "Trusted Badge" }] })} variant="outline" size="sm" className="h-8 rounded-xl border-white/10">+ Add Item</Button>
    </div>
    <div className="grid md:grid-cols-2 gap-4">
       {(content.items || []).map((item: any, idx: number) => (
         <div key={item.id} className="bg-black/40 p-5 rounded-2xl border border-white/5 flex flex-col gap-3">
            <div className="flex justify-between items-center mb-1">
               <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Signal #{idx+1}</span>
               <button onClick={() => onChange({ items: content.items.filter((_:any, i:number) => i !== idx) })} className="text-white/20 hover:text-rose-400"><Trash2 size={16} /></button>
            </div>
            <div className="flex gap-4">
               <select 
                 value={item.icon} 
                 onChange={e => {
                   const newItems = [...content.items];
                   newItems[idx] = { ...item, icon: e.target.value };
                   onChange({ items: newItems });
                 }}
                 className="h-10 bg-black/40 border border-white/5 rounded-xl px-2 text-[10px] font-bold text-white"
               >
                 <option value="Star">Star</option>
                 <option value="ShieldCheck">Shield</option>
                 <option value="Truck">Truck</option>
                 <option value="Lock">Lock</option>
               </select>
               <Input 
                 value={item.text} 
                 onChange={e => {
                   const newItems = [...content.items];
                   newItems[idx] = { ...item, text: e.target.value };
                   onChange({ items: newItems });
                 }} 
                 className="flex-1 h-10 bg-transparent border-white/10 rounded-xl text-xs font-bold"
                 placeholder="e.g. 4.8/5 Rated"
               />
            </div>
         </div>
       ))}
    </div>
  </div>
);

const CollectionsEditor = ({ content, onChange }: { content: any; onChange: (u: any) => void }) => (
  <div className="space-y-6">
    <div className="grid lg:grid-cols-2 gap-8">
      <Field label="Section Title" value={content.title} onChange={v => onChange({ title: v })} />
      <Field label="Section Subtitle" value={content.subtitle || ""} onChange={v => onChange({ subtitle: v })} />
    </div>
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-[10px] font-black uppercase tracking-widest text-white/30">Collection Cards</Label>
        <Button
          onClick={() =>
            onChange({
              items: [
                ...(content.items || []),
                { id: Math.random().toString(), name: "New Collection", image: "", link: "#" },
              ],
            })
          }
          variant="outline"
          size="sm"
          className="h-8 rounded-xl border-white/10"
        >
          + Add Item
        </Button>
      </div>
      <div className="space-y-4">
        {(content.items || []).map((item: any, idx: number) => (
          <div key={item.id || idx} className="bg-black/40 p-6 rounded-[2rem] border border-white/5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">Item #{idx + 1}</span>
              <button
                onClick={() =>
                  onChange({
                    items: (content.items || []).filter((_: any, i: number) => i !== idx),
                  })
                }
                className="text-white/20 hover:text-rose-400"
              >
                <Trash2 size={16} />
              </button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <Field
                label="Name"
                value={item.name}
                onChange={(v) => {
                  const next = [...(content.items || [])];
                  next[idx] = { ...item, name: v };
                  onChange({ items: next });
                }}
              />
              <Field
                label="Link"
                value={item.link || ""}
                onChange={(v) => {
                  const next = [...(content.items || [])];
                  next[idx] = { ...item, link: v };
                  onChange({ items: next });
                }}
              />
            </div>
            <Field
              label="Image URL"
              value={item.image}
              onChange={(v) => {
                const next = [...(content.items || [])];
                next[idx] = { ...item, image: v };
                onChange({ items: next });
              }}
            />
          </div>
        ))}
      </div>
    </div>
  </div>
);

const WhyEditor = ({ content, onChange }: { content: any; onChange: (u: any) => void }) => (
  <div className="space-y-6">
    <Field label="Section Title" value={content.title} onChange={(v) => onChange({ title: v })} />
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-[10px] font-black uppercase tracking-widest text-white/30">Why Points</Label>
        <Button
          onClick={() =>
            onChange({
              points: [
                ...(content.points || []),
                { id: Math.random().toString(), title: "New Point", description: "" },
              ],
            })
          }
          variant="outline"
          size="sm"
          className="h-8 rounded-xl border-white/10"
        >
          + Add Point
        </Button>
      </div>
      {(content.points || []).map((item: any, idx: number) => (
        <div key={item.id || idx} className="bg-black/40 p-6 rounded-[2rem] border border-white/5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Point #{idx + 1}</span>
            <button
              onClick={() =>
                onChange({
                  points: (content.points || []).filter((_: any, i: number) => i !== idx),
                })
              }
              className="text-white/20 hover:text-rose-400"
            >
              <Trash2 size={16} />
            </button>
          </div>
          <Field
            label="Title"
            value={item.title}
            onChange={(v) => {
              const next = [...(content.points || [])];
              next[idx] = { ...item, title: v };
              onChange({ points: next });
            }}
          />
          <Field
            label="Description"
            value={item.description}
            onChange={(v) => {
              const next = [...(content.points || [])];
              next[idx] = { ...item, description: v };
              onChange({ points: next });
            }}
            textarea
          />
        </div>
      ))}
    </div>
  </div>
);

const ProductsEditor = ({ content, onChange }: { content: any; onChange: (u: any) => void }) => (
  <div className="space-y-6">
    <Field label="Section Title" value={content.title} onChange={(v) => onChange({ title: v })} />
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-[10px] font-black uppercase tracking-widest text-white/30">Products</Label>
        <Button
          onClick={() =>
            onChange({
              items: [
                ...(content.items || []),
                { id: Math.random().toString(), name: "New Product", price: "", image: "", tag: "" },
              ],
            })
          }
          variant="outline"
          size="sm"
          className="h-8 rounded-xl border-white/10"
        >
          + Add Product
        </Button>
      </div>
      {(content.items || []).map((item: any, idx: number) => (
        <div key={item.id || idx} className="bg-black/40 p-6 rounded-[2rem] border border-white/5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Product #{idx + 1}</span>
            <button
              onClick={() =>
                onChange({
                  items: (content.items || []).filter((_: any, i: number) => i !== idx),
                })
              }
              className="text-white/20 hover:text-rose-400"
            >
              <Trash2 size={16} />
            </button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <Field
              label="Name"
              value={item.name}
              onChange={(v) => {
                const next = [...(content.items || [])];
                next[idx] = { ...item, name: v };
                onChange({ items: next });
              }}
            />
            <Field
              label="Price"
              value={item.price}
              onChange={(v) => {
                const next = [...(content.items || [])];
                next[idx] = { ...item, price: v };
                onChange({ items: next });
              }}
            />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <Field
              label="Tag"
              value={item.tag || ""}
              onChange={(v) => {
                const next = [...(content.items || [])];
                next[idx] = { ...item, tag: v };
                onChange({ items: next });
              }}
            />
            <Field
              label="Image URL"
              value={item.image}
              onChange={(v) => {
                const next = [...(content.items || [])];
                next[idx] = { ...item, image: v };
                onChange({ items: next });
              }}
            />
          </div>
        </div>
      ))}
    </div>
  </div>
);

const FeaturesEditor = ({ content, onChange }: { content: any; onChange: (u: any) => void }) => (
  <div className="space-y-6">
    <Field label="Section Title" value={content.title} onChange={(v) => onChange({ title: v })} />
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-[10px] font-black uppercase tracking-widest text-white/30">Feature Items</Label>
        <Button
          onClick={() =>
            onChange({
              items: [
                ...(content.items || []),
                { id: Math.random().toString(), title: "New Feature", description: "", icon: "Sparkles" },
              ],
            })
          }
          variant="outline"
          size="sm"
          className="h-8 rounded-xl border-white/10"
        >
          + Add Feature
        </Button>
      </div>
      {(content.items || []).map((item: any, idx: number) => (
        <div key={item.id || idx} className="bg-black/40 p-6 rounded-[2rem] border border-white/5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400">Feature #{idx + 1}</span>
            <button
              onClick={() =>
                onChange({
                  items: (content.items || []).filter((_: any, i: number) => i !== idx),
                })
              }
              className="text-white/20 hover:text-rose-400"
            >
              <Trash2 size={16} />
            </button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <Field
              label="Title"
              value={item.title}
              onChange={(v) => {
                const next = [...(content.items || [])];
                next[idx] = { ...item, title: v };
                onChange({ items: next });
              }}
            />
            <Field
              label="Icon Name"
              value={item.icon || ""}
              onChange={(v) => {
                const next = [...(content.items || [])];
                next[idx] = { ...item, icon: v };
                onChange({ items: next });
              }}
            />
          </div>
          <Field
            label="Description"
            value={item.description}
            onChange={(v) => {
              const next = [...(content.items || [])];
              next[idx] = { ...item, description: v };
              onChange({ items: next });
            }}
            textarea
          />
        </div>
      ))}
    </div>
  </div>
);

const FooterEditor = ({ content, onChange }: { content: any; onChange: (u: any) => void }) => (
  <div className="space-y-8">
    <div className="grid lg:grid-cols-2 gap-8">
      <Field label="Brand Name" value={content.brandName || ""} onChange={(v) => onChange({ brandName: v })} />
      <Field label="Brand Text" value={content.brandText} onChange={(v) => onChange({ brandText: v })} textarea />
    </div>

    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-[10px] font-black uppercase tracking-widest text-white/30">Footer Links</Label>
        <Button
          onClick={() =>
            onChange({
              links: [...(content.links || []), { id: Math.random().toString(), label: "New Link", href: "/" }],
            })
          }
          variant="outline"
          size="sm"
          className="h-8 rounded-xl border-white/10"
        >
          + Add Link
        </Button>
      </div>
      {(content.links || []).map((link: any, idx: number) => (
        <div key={link.id || idx} className="grid md:grid-cols-[1fr_1fr_auto] gap-4 bg-black/40 p-5 rounded-[2rem] border border-white/5">
          <Field
            label="Label"
            value={link.label}
            onChange={(v) => {
              const next = [...(content.links || [])];
              next[idx] = { ...link, label: v };
              onChange({ links: next });
            }}
          />
          <Field
            label="Href"
            value={link.href}
            onChange={(v) => {
              const next = [...(content.links || [])];
              next[idx] = { ...link, href: v };
              onChange({ links: next });
            }}
          />
          <div className="flex items-end">
            <button
              onClick={() =>
                onChange({
                  links: (content.links || []).filter((_: any, i: number) => i !== idx),
                })
              }
              className="h-14 w-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-white/20 hover:text-rose-400"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>

    <div className="grid lg:grid-cols-2 gap-8">
      <Field
        label="Phone"
        value={content.contact?.phone || ""}
        onChange={(v) => onChange({ contact: { ...(content.contact || {}), phone: v } })}
      />
      <Field
        label="Email"
        value={content.contact?.email || ""}
        onChange={(v) => onChange({ contact: { ...(content.contact || {}), email: v } })}
      />
    </div>
    <Field
      label="Address"
      value={content.contact?.address || ""}
      onChange={(v) => onChange({ contact: { ...(content.contact || {}), address: v } })}
      textarea
    />
  </div>
);

const CTAEditor = ({ content, onChange }: { content: any; onChange: (u: any) => void }) => (
  <div className="grid lg:grid-cols-2 gap-10">
    <div className="space-y-6">
      <Field label="CTA Headline" value={content.title} onChange={v => onChange({ title: v })} />
      <Field label="CTA Sub-headline" value={content.subtitle} onChange={v => onChange({ subtitle: v })} textarea />
      <div className="grid grid-cols-2 gap-4">
        <Field label="Action Button Label" value={content.buttonText} onChange={v => onChange({ buttonText: v })} />
        <Field label="Button Target Link" value={content.buttonLink} onChange={v => onChange({ buttonLink: v })} />
      </div>
    </div>
    <div className="space-y-6">
       <div className="space-y-3">
         <Label className="text-[10px] font-black uppercase tracking-widest text-white/30">CTA Theme Color</Label>
         <div className="flex bg-black/40 p-1 rounded-2xl border border-white/5">
           {['dark', 'light', 'accent'].map(t => (
             <button 
               key={t}
               onClick={() => onChange({ theme: t })}
               className={`flex-1 py-3 text-[10px] font-black uppercase tracking-[0.2em] rounded-[1.25rem] transition-all capitalize ${content.theme === t ? 'bg-amber-400 text-black' : 'text-white/40'}`}
             >
               {t}
             </button>
           ))}
         </div>
       </div>
       <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-widest text-white/30">Optional Background</label>
          <div className="h-[140px] rounded-3xl border border-white/10 bg-black/40 flex items-center justify-center overflow-hidden relative group">
             {content.backgroundImage ? (
               <>
                <img src={content.backgroundImage} className="w-full h-full object-cover opacity-50" alt="" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 gap-2">
                  <MediaLibraryModal onSelect={m => onChange({ backgroundImage: m.url })} trigger={<Button variant="ghost" size="sm" className="text-white hover:text-amber-400">Change</Button>} />
                  <Button variant="ghost" size="sm" onClick={() => onChange({ backgroundImage: "" })} className="text-white hover:text-rose-500">Reset</Button>
                </div>
               </>
             ) : (
                <MediaLibraryModal onSelect={m => onChange({ backgroundImage: m.url })} trigger={<Button variant="link" className="text-amber-200">Set Image Background</Button>} />
             )}
          </div>
       </div>
    </div>
  </div>
);

const TestimonialsEditor = ({ content, onChange }: { content: any; onChange: (u: any) => void }) => (
  <div className="space-y-6">
    <Field label="Section Heading" value={content.title} onChange={v => onChange({ title: v })} />
    <div className="space-y-4">
       {(content.items || []).map((item: any, idx: number) => (
         <div key={item.id} className="bg-black/40 p-6 rounded-[2rem] border border-white/5 space-y-4">
            <div className="flex justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Review #{idx+1}</span>
              <button onClick={() => onChange({ items: content.items.filter((_:any, i:number) => i !== idx) })} className="text-white/20 hover:text-rose-400"><Trash2 size={16} /></button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Name" value={item.name} onChange={v => {
                const newItems = [...content.items];
                newItems[idx] = { ...item, name: v };
                onChange({ items: newItems });
              }} />
              <Field label="Role/Context" value={item.role} onChange={v => {
                const newItems = [...content.items];
                newItems[idx] = { ...item, role: v };
                onChange({ items: newItems });
              }} />
            </div>
            <Field label="Testimonial Text" value={item.content} onChange={v => {
              const newItems = [...content.items];
              newItems[idx] = { ...item, content: v };
              onChange({ items: newItems });
            }} textarea />
         </div>
       ))}
       <Button onClick={() => onChange({ items: [...(content.items || []), { id: Math.random().toString(), name: "John Doe", role: "Collector", content: "Amazing energy!", rating: 5 }] })} variant="outline" className="w-full h-14 border-dashed border-white/10 text-white/40 hover:text-white rounded-2xl">
         + Add Testimonial
       </Button>
    </div>
  </div>
);

const FAQEditor = ({ content, onChange }: { content: any; onChange: (u: any) => void }) => (
  <div className="space-y-6">
    <Field label="Section Header" value={content.title} onChange={v => onChange({ title: v })} />
    <div className="space-y-4">
       {(content.items || []).map((item: any, idx: number) => (
         <div key={item.id} className="bg-black/40 p-6 rounded-[2rem] border border-white/5 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black uppercase tracking-widest text-purple-400">Question Item #{idx+1}</span>
              <button onClick={() => onChange({ items: content.items.filter((_:any, i:number) => i !== idx) })} className="text-white/20 hover:text-rose-400"><Trash2 size={16} /></button>
            </div>
            <Field label="Question" value={item.question} onChange={v => {
              const newItems = [...content.items];
              newItems[idx] = { ...item, question: v };
              onChange({ items: newItems });
            }} />
            <Field label="Answer" value={item.answer} onChange={v => {
              const newItems = [...content.items];
              newItems[idx] = { ...item, answer: v };
              onChange({ items: newItems });
            }} textarea />
         </div>
       ))}
       <Button onClick={() => onChange({ items: [...(content.items || []), { id: Math.random().toString(), question: "New Question", answer: "" }] })} variant="outline" className="w-full h-14 border-dashed border-white/10 text-white/40 hover:text-white rounded-2xl">
         + Add FAQ Item
       </Button>
    </div>
  </div>
);

const BlogEditor = ({ content, onChange }: { content: any; onChange: (u: any) => void }) => (
  <div className="grid lg:grid-cols-2 gap-8">
    <div className="space-y-6">
      <Field label="Blog Area Title" value={content.title} onChange={v => onChange({ title: v })} />
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase tracking-widest text-white/30">Card Count</Label>
          <Input type="number" value={content.maxPosts} onChange={e => onChange({ maxPosts: parseInt(e.target.value) })} className="h-14 bg-black/40 border-white/10" />
        </div>
        <div className="space-y-2">
           <Label className="text-[10px] font-black uppercase tracking-widest text-white/30">Layout Mode</Label>
           <select 
             value={content.layout} 
             onChange={e => onChange({ layout: e.target.value })}
             className="w-full h-14 bg-black/40 border border-white/10 rounded-2xl px-4 text-xs font-bold"
           >
             <option value="grid">Grid Display</option>
             <option value="list">List Display</option>
           </select>
        </div>
      </div>
      <div className="space-y-2">
         <Label className="text-[10px] font-black uppercase tracking-widest text-white/30">Category Filter (Optional)</Label>
         <Input 
           value={content.category || ''} 
           onChange={e => onChange({ category: e.target.value })} 
           className="h-14 bg-black/40 border-white/10 rounded-2xl px-4" 
           placeholder="e.g. spiritual, energy-healing"
         />
      </div>
    </div>
    <div className="bg-black/40 p-6 rounded-3xl border border-white/5 flex flex-col justify-center">
       <p className="text-[10px] text-orange-400 font-black uppercase tracking-widest mb-2 flex items-center gap-2">
         <Sparkles size={12} /> Live Post Sync
       </p>
       <p className="text-xs text-white/40 leading-relaxed italic">
         This section automatically pulls the latest published posts from your blog categories. You don't need to manually add posts here.
       </p>
    </div>
  </div>
);

const USPEditor = ({ content, onChange }: { content: any; onChange: (u: any) => void }) => (
  <div className="space-y-6">
    <Field label="Over-arching Heading (Optional)" value={content.title} onChange={v => onChange({ title: v })} />
    <div className="grid md:grid-cols-3 gap-6">
       {(content.items || []).map((item: any, idx: number) => (
         <div key={item.id} className="bg-black/40 p-6 rounded-[2rem] border border-white/5 space-y-4">
            <div className="flex justify-between items-center mb-2">
               <div className="h-10 w-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500">
                  <Sparkles size={18} />
               </div>
               <button onClick={() => onChange({ items: content.items.filter((_:any, i:number) => i !== idx) })} className="text-white/20 hover:text-rose-400"><Trash2 size={16} /></button>
            </div>
            <Field label="Point Title" value={item.title} onChange={v => {
              const newItems = [...content.items];
              newItems[idx] = { ...item, title: v };
              onChange({ items: newItems });
            }} />
            <Field label="Point Description" value={item.description} onChange={v => {
              const newItems = [...content.items];
              newItems[idx] = { ...item, description: v };
              onChange({ items: newItems });
            }} textarea />
         </div>
       ))}
       {content.items.length < 4 && (
         <button 
           onClick={() => onChange({ items: [...(content.items || []), { id: Math.random().toString(), icon: "Gem", title: "Authentic", description: "Natural gems." }] })}
           className="h-full min-h-[200px] border-2 border-dashed border-white/5 rounded-[2rem] flex flex-col items-center justify-center text-white/20 hover:text-amber-400 hover:border-amber-400/20 transition-all hover:bg-amber-400/5 group"
         >
           <Plus size={32} className="mb-2 group-hover:scale-110 transition-transform" />
           <span className="text-[10px] font-black uppercase tracking-widest">New Property</span>
         </button>
       )}
    </div>
  </div>
);

const Field = ({ label, value, onChange, placeholder, textarea = false }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; textarea?: boolean }) => (
  <div className="space-y-3">
    <Label className="text-[11px] font-black uppercase tracking-[0.22em] text-white/30">{label}</Label>
    {textarea ? (
      <Textarea 
        value={value} onChange={e => onChange(e.target.value)} 
        placeholder={placeholder} 
        className="min-h-[140px] rounded-2xl border-white/10 bg-black/40 p-5 text-sm leading-relaxed" 
      />
    ) : (
      <Input 
        value={value} onChange={e => onChange(e.target.value)} 
        placeholder={placeholder} 
        className="h-14 rounded-2xl border-white/10 bg-black/40 px-6 text-sm" 
      />
    )}
  </div>
);
