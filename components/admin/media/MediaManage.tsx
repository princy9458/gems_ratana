"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Upload,
  X,
  Search,
  Image as ImageIcon,
  Clock,
  Trash2,
  Plus,
  Copy,
  FolderOpen,
  CheckCircle2,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface MediaItem {
  _id: string;
  id?: string;
  filename: string;
  title?: string;
  url: string;
  alt: string;
  size: number;
  foldername: string;
  category?: string;
  type: string;
  isActive?: boolean;
  order?: number;
  createdAt: string;
}

const PREDEFINED_FOLDERS = ["Hero", "Gems", "Collections", "Blog", "SEO"];

export const MediaUploader = ({ 
  onSelect, 
  hideHeader = false 
}: { 
  onSelect?: (item: MediaItem) => void; 
  hideHeader?: boolean;
}) => {
  const [activeTab, setActiveTab] = useState<string>("library");
  const [selectedFiles, setSelectedFiles] = useState<any[]>([]);
  const [mediaLibrary, setMediaLibrary] = useState<MediaItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewingMedia, setViewingMedia] = useState<MediaItem | null>(null);
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isIngestOpen, setIsIngestOpen] = useState(false);
  const [mediaTitle, setMediaTitle] = useState("");
  const [mediaCategory, setMediaCategory] = useState<string>("Hero");

  const fetchMedia = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/media?active=true");
      const data = await response.json();
      if (data.success) {
        setMediaLibrary(data.data);
      }
    } catch (error) {
      toast.error("Failed to fetch media library");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleFileSelect = (e: any) => {
    const files = Array.from(e.target.files);
    const fileObjects = files.map((file: any) => ({
      file,
      filename: file.name,
      alt: "",
      preview: URL.createObjectURL(file),
      size: (file.size / 1024).toFixed(0) + " KB",
      foldername: mediaCategory || selectedFolder || "Hero",
      type: file.type?.startsWith("video/") ? "video" : "image",
    }));
    setSelectedFiles([...selectedFiles, ...fileObjects]);
    setActiveTab("upload");
  };

  const handleDrop = (e: any) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const fileObjects = files.map((file: any) => ({
      file,
      filename: file.name,
      alt: "",
      preview: URL.createObjectURL(file),
      size: (file.size / 1024).toFixed(0) + " KB",
      foldername: mediaCategory || selectedFolder || "Hero",
      type: file.type?.startsWith("video/") ? "video" : "image",
    }));
    setSelectedFiles([...selectedFiles, ...fileObjects]);
    setActiveTab("upload");
  };

  const updateFileMetadata = (index: number, field: string, value: string) => {
    const updated = [...selectedFiles];
    updated[index][field] = value;
    setSelectedFiles(updated);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    const toastId = toast.loading("Uploading spiritual assets...");
    try {
      const uploadedItems: any[] = [];

      for (const fileItem of selectedFiles) {
        console.log("Uploading...", fileItem.filename);

        const formData = new FormData();
        formData.append("file", fileItem.file);
        formData.append("title", mediaTitle || fileItem.filename);
        formData.append("category", (fileItem.foldername || mediaCategory || "Hero").toLowerCase());
        formData.append("alt", fileItem.alt || "");
        formData.append("isActive", "true");
        formData.append("type", fileItem.type || "image");
        formData.append("order", String(fileItem.order ?? uploadedItems.length));

        const response = await fetch("/api/media", {
          method: "POST",
          body: formData,
        });

        console.log("Upload response status:", response.status);
        const data = await response.json();
        console.log("Upload response:", data);

        if (!response.ok || !data.success) {
          throw new Error(data.error || "Upload failed");
        }

        if (data.data) {
          uploadedItems.push(data.data);
        }
      }

      if (uploadedItems.length > 0) {
        setMediaLibrary([...uploadedItems, ...mediaLibrary]);
      }
      setSelectedFiles([]);
      setActiveTab("library");
      setMediaTitle("");
      setMediaCategory("Hero");
      setIsIngestOpen(false);
      await fetchMedia();
      toast.success("Assets uploaded and cataloged", { id: toastId });
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error instanceof Error ? error.message : "Network error during upload", { id: toastId });
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to remove this asset?")) return;

    const toastId = toast.loading("Removing asset...");
    try {
      const response = await fetch("/api/admin/media", {
        method: "DELETE",
        body: JSON.stringify({ id }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if (data.success) {
        setMediaLibrary(mediaLibrary.filter(m => m._id !== id));
        toast.success("Asset removed from library", { id: toastId });
        if (viewingMedia?._id === id) setViewingMedia(null);
        if (selectedItem?._id === id) setSelectedItem(null);
      } else {
        toast.error("Deletion failed", { id: toastId });
      }
    } catch (error) {
      toast.error("Error during removal", { id: toastId });
    }
  };

  const copyUrl = (url: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(url);
    toast.success("Asset URL copied to clipboard");
  };

  const filteredMedia = mediaLibrary.filter((item) => {
    const matchesSearch =
      item.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.alt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFolder =
      selectedFolder === null || item.foldername === selectedFolder;
    return matchesSearch && matchesFolder;
  });

  return (
    <div className="min-h-[600px] bg-[#0a0a0a] text-white p-6 font-['Inter',sans-serif]">
      <div className="max-w-6xl mx-auto">
        {/* Superior Header */}
        {!hideHeader && (
          <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="h-14 w-14 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/5">
                <ImageIcon size={28} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">Media Library</h1>
                <p className="text-white/40 text-[10px] uppercase font-black tracking-[0.3em] mt-1">Premium Brand Assets</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => {
                  console.log("Ingest New Media clicked");
                  setIsIngestOpen(true);
                  setActiveTab("upload");
                }}
                className="bg-amber-500 hover:bg-amber-400 text-black px-8 py-3.5 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center gap-3 shadow-xl shadow-amber-500/10"
              >
                <Plus size={16} />
                Upload New Media
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Sidebar: Folder Management */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-[#111] border border-white/5 p-6 rounded-[2rem] shadow-2xl">
              <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-white/30 mb-6 flex items-center gap-3">
                <FolderOpen size={14} className="text-amber-400" />
                Media Folders
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedFolder(null)}
                  className={cn(
                    "w-full text-left px-5 py-3.5 rounded-2xl text-xs font-bold transition-all border",
                    selectedFolder === null 
                      ? "bg-amber-500 border-amber-500 text-black shadow-lg shadow-amber-500/10" 
                      : "text-white/40 hover:text-white border-transparent hover:bg-white/5"
                  )}
                >
                  All Media
                </button>
                {PREDEFINED_FOLDERS.map(folder => (
                  <button
                    key={folder}
                    onClick={() => setSelectedFolder(folder)}
                    className={cn(
                      "w-full text-left px-5 py-3.5 rounded-2xl text-xs font-bold transition-all border",
                      selectedFolder === folder 
                        ? "bg-amber-500 border-amber-500 text-black shadow-lg shadow-amber-500/10" 
                        : "text-white/40 hover:text-white border-transparent hover:bg-white/5"
                    )}
                  >
                    {folder}
                  </button>
                ))}
              </div>
            </div>

            {selectedItem && onSelect && (
               <motion.div 
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="bg-white/5 border border-amber-500/20 p-6 rounded-[2rem] text-center"
               >
                 <div className="aspect-square rounded-2xl overflow-hidden mb-4 border border-white/10">
                   <img src={selectedItem.url} className="w-full h-full object-cover" alt="" />
                 </div>
                 <button 
                   onClick={() => onSelect(selectedItem)}
                   className="w-full bg-amber-500 text-black py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-amber-500/20 hover:scale-[1.02] transition-transform"
                 >
                   Confirm Selection
                 </button>
               </motion.div>
            )}
          </div>

          {/* Main Vault Workspace */}
          <div className="lg:col-span-9 space-y-8">
            <div className="flex flex-col md:flex-row gap-5">
              <div className="relative flex-1 group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-amber-400 transition-colors" size={20} />
                <input
                  type="text"
                  placeholder="Search media by filename or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#111] border border-white/5 pl-14 pr-6 py-4 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all font-medium"
                />
              </div>
              <div className="flex bg-[#111] border border-white/5 p-1 rounded-2xl shadow-inner">
                {["library", "upload"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      "px-8 py-3 rounded-[0.85rem] text-[10px] font-black uppercase tracking-widest transition-all",
                      activeTab === tab 
                        ? "bg-white/10 text-white shadow-lg" 
                        : "text-white/20 hover:text-white"
                    )}
                  >
                    {tab === "library" ? "Library" : "Upload"}
                  </button>
                ))}
              </div>
            </div>

            <AnimatePresence mode="wait">
              {activeTab === "upload" ? (
                <motion.div
                  key="upload"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="space-y-6"
                >
                  <div 
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    onClick={() => document.getElementById("fileInput")?.click()}
                    className="border-2 border-dashed border-white/10 rounded-[3rem] p-16 text-center cursor-pointer hover:bg-white/5 transition-all group relative overflow-hidden bg-[#0d0d0d]"
                  >
                    <input id="fileInput" type="file" multiple accept="image/*,video/*" onChange={handleFileSelect} className="hidden" />
                    <div className="relative z-10">
                      <div className="w-20 h-20 mx-auto mb-6 bg-amber-400/10 rounded-[1.5rem] flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg border border-amber-400/5">
                        <Upload className="text-amber-400" size={32} />
                      </div>
                      <p className="text-xl font-bold text-white mb-2">Upload assets to the library</p>
                      <p className="text-sm text-white/30 font-medium">Drag-and-drop or select media files</p>
                    </div>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#151005,_transparent)] opacity-40 group-hover:opacity-60 transition-opacity" />
                  </div>

                  {selectedFiles.length > 0 && (
                    <div className="space-y-4">
                      {selectedFiles.map((file, index) => (
                        <div key={index} className="bg-[#111] border border-white/5 p-5 rounded-[1.5rem] flex gap-6 items-center shadow-lg">
                          <div className="relative h-24 w-24 flex-shrink-0 rounded-xl overflow-hidden shadow-xl border border-white/10">
                            <img src={file.preview} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 space-y-4 min-w-0">
                            <div className="flex justify-between items-center">
                              <p className="text-sm font-bold truncate max-w-[200px]">{file.filename}</p>
                              <button onClick={() => removeFile(index)} className="h-8 w-8 text-white/20 hover:text-rose-500 transition-colors">
                                <X size={20} />
                              </button>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-1.5">
                                <label className="text-[9px] font-black uppercase tracking-widest text-white/20 ml-1">Metadata (Alt)</label>
                                <input 
                                  type="text" placeholder="Visual description..." value={file.alt}
                                  onChange={e => updateFileMetadata(index, "alt", e.target.value)}
                                  className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-2 text-xs focus:ring-1 focus:ring-amber-500/40 outline-none"
                                />
                              </div>
                              <div className="space-y-1.5">
                                <label className="text-[9px] font-black uppercase tracking-widest text-white/20 ml-1">Media Folder</label>
                                <select 
                                  value={file.foldername}
                                  onChange={e => updateFileMetadata(index, "foldername", e.target.value)}
                                  className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-2 text-xs focus:ring-1 focus:ring-amber-500/40 outline-none h-9 appearance-none"
                                >
                                  {PREDEFINED_FOLDERS.map(f => <option key={f} value={f}>{f}</option>)}
                                </select>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      <button 
                        onClick={handleUpload}
                        className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-black font-black uppercase tracking-[0.25em] py-5 rounded-[1.5rem] transition-all shadow-2xl shadow-amber-500/20 hover:scale-[1.01] active:scale-[0.99] mt-4"
                      >
                        Upload {selectedFiles.length} Assets to Library
                      </button>
                    </div>
                  )}
                </motion.div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                  {isLoading ? (
                     <div className="col-span-full py-20 text-center flex flex-col items-center gap-4">
                        <div className="h-10 w-10 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Loading Media Library...</p>
                     </div>
                  ) : (
                    <AnimatePresence>
                      {filteredMedia.map((item, idx) => (
                        <motion.div
                          key={item._id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.03 }}
                          onClick={() => {
                            if (onSelect) {
                              setSelectedItem(item);
                            } else {
                              setViewingMedia(item);
                            }
                          }}
                          className={cn(
                            "group relative aspect-square bg-[#111] rounded-[2rem] overflow-hidden cursor-pointer border-2 transition-all duration-300 shadow-xl",
                            selectedItem?._id === item._id 
                              ? "border-amber-500 scale-[0.98] ring-4 ring-amber-500/20 shadow-amber-500/10" 
                              : "border-white/5 hover:border-white/10"
                          )}
                        >
                          <img src={item.url} alt={item.alt} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                          <div className={cn(
                                "absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 transition-opacity duration-300",
                                selectedItem?._id === item._id && "opacity-100 bg-amber-500/20"
                              )}>
                             <div className="h-12 w-12 rounded-full bg-amber-500 text-black flex items-center justify-center shadow-2xl scale-0 group-hover:scale-100 transition-transform">
                               <Check size={24} />
                             </div>
                          </div>
                          <div className="absolute inset-x-0 bottom-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform bg-gradient-to-t from-black to-transparent">
                             <div className="flex gap-2">
                                <button onClick={(e) => { e.stopPropagation(); setViewingMedia(item); }} className="flex-1 bg-white/10 hover:bg-white/20 p-2 rounded-xl backdrop-blur-md transition-colors">
                                  <ImageIcon size={14} />
                                </button>
                                <button onClick={(e) => copyUrl(item.url, e)} className="flex-1 bg-white/10 hover:bg-white/20 p-2 rounded-xl backdrop-blur-md transition-colors">
                                  <Copy size={14} />
                                </button>
                                <button onClick={(e) => handleDelete(item._id, e)} className="flex-1 bg-rose-500/20 hover:bg-rose-500/40 p-2 rounded-xl backdrop-blur-md transition-colors text-rose-300">
                                  <Trash2 size={14} />
                                </button>
                             </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  )}
                  
                  {filteredMedia.length === 0 && !isLoading && (
                    <div className="col-span-full py-32 text-center opacity-20">
                      <ImageIcon size={64} className="mx-auto mb-6" />
                      <p className="text-sm font-black uppercase tracking-[0.4em]">The library is empty</p>
                    </div>
                  )}
                </div>
              )}
            </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {isIngestOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 p-4 backdrop-blur-md"
            onClick={() => setIsIngestOpen(false)}
          >
            <motion.div
              initial={{ y: 16, scale: 0.98 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 16, scale: 0.98 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-3xl rounded-[2rem] border border-white/10 bg-[#0d0d0d] p-6 shadow-2xl"
            >
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-white">Upload New Media</h2>
                  <p className="mt-1 text-[10px] font-black uppercase tracking-[0.3em] text-white/35">
                    Open the upload interface and add assets to the library
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsIngestOpen(false)}
                  className="rounded-full border border-white/10 p-2 text-white/50 transition-colors hover:bg-white/5 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2 md:col-span-2">
                  <label className="ml-1 text-[9px] font-black uppercase tracking-widest text-white/25">
                    Media Title
                  </label>
                  <input
                    value={mediaTitle}
                    onChange={(e) => setMediaTitle(e.target.value)}
                    placeholder="Optional title for uploaded media"
                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-amber-500/30"
                  />
                </div>

                <div className="space-y-2">
                  <label className="ml-1 text-[9px] font-black uppercase tracking-widest text-white/25">
                    Category
                  </label>
                  <select
                    value={mediaCategory}
                    onChange={(e) => setMediaCategory(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-amber-500/30"
                  >
                    {PREDEFINED_FOLDERS.map((folder) => (
                      <option key={folder} value={folder}>
                        {folder}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="ml-1 text-[9px] font-black uppercase tracking-widest text-white/25">
                    Supported
                  </label>
                  <div className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white/50">
                    Images and videos
                  </div>
                </div>

                <label
                  htmlFor="mediaIngestFile"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  className="md:col-span-2 flex cursor-pointer flex-col items-center justify-center rounded-[2rem] border-2 border-dashed border-white/10 bg-white/5 px-6 py-16 text-center transition-colors hover:bg-white/10"
                >
                  <Upload className="mb-4 text-amber-400" size={32} />
                  <p className="text-lg font-bold text-white">Drop files here or click to browse</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.25em] text-white/35">
                    PNG, JPG, MP4, MOV supported
                  </p>
                </label>
                <input
                  id="mediaIngestFile"
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>

              {selectedFiles.length > 0 && (
                <div className="mt-6 space-y-3">
                  <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/35">
                    {selectedFiles.length} file(s) queued
                  </p>
                  <div className="max-h-44 space-y-3 overflow-auto pr-1">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="flex items-center gap-4 rounded-2xl border border-white/5 bg-white/5 p-3">
                        <img src={file.preview} alt="" className="h-14 w-14 rounded-xl object-cover" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-bold text-white">{file.filename}</p>
                          <p className="text-xs text-white/35">{file.type} · {file.foldername}</p>
                        </div>
                        <button
                          onClick={() => removeFile(index)}
                          className="rounded-xl p-2 text-white/30 transition-colors hover:bg-white/5 hover:text-rose-400"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  onClick={() => setIsIngestOpen(false)}
                  className="rounded-2xl border border-white/10 px-5 py-3 text-xs font-black uppercase tracking-widest text-white/60 transition-colors hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    console.log("Uploading...");
                    await handleUpload();
                  }}
                  className="rounded-2xl bg-amber-500 px-5 py-3 text-xs font-black uppercase tracking-widest text-black transition-colors hover:bg-amber-400"
                >
                  Upload Media
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

        {/* Cinematic Detail Overlay */}
        <AnimatePresence>
          {viewingMedia && (
            <div 
              className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-black/95 backdrop-blur-2xl"
              onClick={() => setViewingMedia(null)}
            >
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 30 }}
                onClick={e => e.stopPropagation()}
                className="bg-[#0a0a0a] border border-white/10 w-full max-w-4xl rounded-[3.5rem] overflow-hidden shadow-2xl relative"
              >
                <button onClick={() => setViewingMedia(null)} className="absolute top-8 right-8 h-12 w-12 bg-white/5 text-white/40 rounded-2xl hover:bg-white/10 hover:text-white transition-all z-10 flex items-center justify-center">
                  <X size={20} />
                </button>
                
                <div className="grid md:grid-cols-2">
                  <div className="bg-black/80 flex items-center justify-center p-10 min-h-[400px]">
                    <img src={viewingMedia.url} alt={viewingMedia.alt} className="max-w-full max-h-[600px] rounded-3xl shadow-2xl ring-1 ring-white/10" />
                  </div>
                  <div className="p-12 space-y-8 flex flex-col justify-center">
                    <div>
                      <span className="text-amber-500 text-[10px] font-black uppercase tracking-[0.4em] mb-2 block">{viewingMedia.foldername} Library</span>
                      <h3 className="text-3xl font-bold tracking-tight text-white">{viewingMedia.filename}</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="bg-white/5 p-5 rounded-3xl border border-white/5">
                         <div className="flex items-center gap-3 mb-2 text-white/20">
                            <Clock size={14} />
                            <span className="text-[9px] font-black uppercase tracking-widest">Asset Scale</span>
                         </div>
                         <p className="text-lg font-bold text-amber-200">{(viewingMedia.size / 1024).toFixed(0)} KB</p>
                      </div>
                      <div className="bg-white/5 p-5 rounded-3xl border border-white/5">
                         <div className="flex items-center gap-3 mb-2 text-white/20">
                            <ImageIcon size={14} />
                            <span className="text-[9px] font-black uppercase tracking-widest">Class</span>
                         </div>
                         <p className="text-lg font-bold text-white">Image</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[9px] font-black uppercase tracking-widest text-white/20 ml-2">Alternative Text</label>
                      <div className="text-sm bg-black p-5 rounded-2xl border border-white/5 text-white/60 leading-relaxed italic">
                        {viewingMedia.alt || "No descriptive metadata provided."}
                      </div>
                    </div>

                    <div className="pt-4 flex gap-4">
                      {onSelect ? (
                        <button 
                          onClick={() => {
                            onSelect(viewingMedia);
                            setViewingMedia(null);
                          }}
                          className="flex-1 bg-amber-500 hover:bg-amber-400 text-black font-black uppercase tracking-widest text-[10px] py-5 rounded-2xl transition-all shadow-xl shadow-amber-500/20 flex items-center justify-center gap-3"
                        >
                          <CheckCircle2 size={18} />
                          Assign to Content
                        </button>
                      ) : (
                        <button 
                          onClick={(e) => copyUrl(viewingMedia.url, e)}
                          className="flex-1 bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-widest text-[10px] py-5 rounded-2xl transition-all flex items-center justify-center gap-3 border border-white/10"
                        >
                          <Copy size={18} />
                          Copy Media URL
                        </button>
                      )}
                      <button 
                        onClick={(e) => handleDelete(viewingMedia._id, e)}
                        className="h-16 w-16 bg-rose-500/10 hover:bg-rose-500 text-white/40 hover:text-white rounded-2xl transition-all flex items-center justify-center border border-rose-500/20"
                      >
                        <Trash2 size={24} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
