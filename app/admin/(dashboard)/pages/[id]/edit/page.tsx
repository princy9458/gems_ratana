"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageEditor } from "@/components/admin/cms/PageEditor";
import { toast } from "sonner";
import { Page } from "@/lib/store/pages/pageType";
import { updatePageThunk, fetchPagesThunk } from "@/lib/store/pages/pageThunk";
import { useAppDispatch } from "@/lib/store/hooks";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { setCurrentPages } from "@/lib/store/pages/pagesSlice";
import { Loader2, PlusCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EditPage() {
  const { id } = useParams();
  const pageId = Array.isArray(id) ? id[0] : id;
  const dispatch = useAppDispatch();
  const router = useRouter();
  
  const {
    allPages,
    currentPages: page,
    isLoading: loading,
    isAllPageFetched
  } = useSelector((state: RootState) => state.pages);
  
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 1. Initial Data Fetching
  useEffect(() => {
    if (!isAllPageFetched) {
      console.log("Fetching pages for editor...");
      dispatch(fetchPagesThunk());
    }
  }, [dispatch, isAllPageFetched]);

  // 2. Set Current Page from URL ID
  useEffect(() => {
    if (pageId && allPages.length > 0) {
      const foundPage = allPages.find((p) => p._id === pageId);
      if (foundPage) {
        console.log("Setting current page for ID:", pageId);
        dispatch(setCurrentPages(foundPage));
        setError(null);
      } else if (isAllPageFetched) {
        setError("Page not found in database.");
      }
    }
  }, [pageId, allPages, isAllPageFetched, dispatch]);

  const handleUpdate = async (pageData: Page) => {
    if (!pageId) {
      toast.error("Missing page ID.");
      return;
    }

    setSaving(true);
    console.log("Saving:", pageData);
    const toastId = toast.loading("Updating Page Content...");

    try {
      const response = await fetch(`/api/pages/${pageId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pageData),
      });

      console.log("Update response status:", response.status, response.statusText);
      const result = await response.json();
      console.log("SERVER RESPONSE:", result);

      if (response.ok && result.success) {
        toast.success("Page content updated successfully", { id: toastId });
        // Refresh local state by fetching pages again in background
        dispatch(fetchPagesThunk());
        router.refresh();
        router.push("/admin/pages");
      } else {
        throw new Error(result.message || "Failed to update page");
      }
    } catch (err: any) {
      console.error("CRITICAL SAVE ERROR:", err);
      toast.error(err.message || "Network error. Please try again.", { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  if (loading && !page) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] gap-6 text-white/50">
        <Loader2 className="h-10 w-10 animate-spin text-amber-400" />
        <div className="text-center">
           <p className="text-[10px] font-black uppercase tracking-[0.4em] mb-2">Synchronizing Data</p>
           <p className="text-sm italic">Gathering page data from the library...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] gap-8 bg-[#0a0a0a] rounded-[2rem] border border-white/5 m-8">
        <div className="h-20 w-20 rounded-3xl bg-rose-500/10 flex items-center justify-center text-rose-500 border border-rose-500/20">
          <AlertCircle size={40} />
        </div>
        <div className="text-center space-y-3">
          <h2 className="text-2xl font-bold text-white">Vanished Page</h2>
          <p className="text-white/40 max-w-sm mx-auto text-sm italic">
            The page you are looking for has departed from this realm or never existed.
          </p>
        </div>
        <Button 
          onClick={() => router.push("/admin/pages")}
          className="bg-white text-black font-black uppercase tracking-widest text-[10px] h-12 px-10 rounded-xl"
        >
          Return to Pages List
        </Button>
      </div>
    );
  }

  if (!page) return null;

  return (
    <div className="p-4 sm:p-8 animate-in fade-in zoom-in-95 duration-700">
      <PageEditor 
        initialData={page} 
        onSave={handleUpdate} 
        isLoading={saving} 
      />
    </div>
  );
}
