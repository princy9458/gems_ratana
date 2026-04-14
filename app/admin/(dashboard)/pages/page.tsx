"use client";

import React, { useEffect, useMemo, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/lib/store/hooks";
import { fetchPagesThunk, deletePageThunk } from "@/lib/store/pages/pageThunk";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Pencil,
  Trash2,
  FileText,
  Loader2,
  Archive,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { Page } from "@/lib/store/pages/pageType";
import {
  getRouteLabel,
  getStatusLabel,
  normalizePage,
} from "@/lib/store/pages/pageHelpers";
import { cn } from "@/lib/utils";
import { setCurrentPages } from "@/lib/store/pages/pagesSlice";

type PageRow = {
  key: string;
  title: string;
  slug: string;
  status: string;
  page?: Page;
  canonicalSlug?: string;
  isCanonical: boolean;
};

const CANONICAL_PAGES: Array<{ slug: string; routeLabel: string }> = [];

function PagesPageContent() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { allPages: pages, isLoading: loading, isAllPageFetched } = useSelector(
    (state: RootState) => state.pages,
  );

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isAllPageFetched) {
      dispatch(fetchPagesThunk());
    }
  }, [dispatch, isAllPageFetched, mounted]);

  const rows = useMemo<PageRow[]>(() => {
    return pages.map(normalizePage).map((page) => ({
      key: page._id || page.slug,
      title: page.title,
      slug: page.slug,
      status: getStatusLabel(page),
      page,
      isCanonical: false,
    }));
  }, [pages]);

  const handleDelete = async (page: PageRow) => {
    if (!page.page?._id) return;
    if (!confirm(`Are you sure you want to delete the page "${page.title}"?`)) {
      return;
    }

    setDeletingId(page.page._id);
    const toastId = toast.loading(`Deleting ${page.title}...`);

    try {
      const resultAction = await dispatch(deletePageThunk(page.page._id));
      if (deletePageThunk.fulfilled.match(resultAction)) {
        toast.success(`${page.title} deleted successfully`, { id: toastId });
      } else {
        toast.error(
          `Delete failed: ${resultAction.payload || "Unknown error"}`,
          { id: toastId },
        );
      }
    } catch (err) {
      toast.error("Network error. Please try again.", { id: toastId });
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (row: PageRow) => {
    if (row.page?._id) {
      dispatch(setCurrentPages(row.page));
      router.push(`/admin/pages/${row.page._id}/edit`);
    }
  };

  if (!mounted) return null;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 p-4 sm:p-8">
      <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-[#121212] via-[#080808] to-[#1b1506] p-6 shadow-2xl shadow-black/30">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-400/20 bg-amber-400/10 text-amber-300 shadow-lg shadow-amber-500/10">
              <FileText size={22} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.35em] text-amber-200/50">
                Site Content
              </p>
              <h1 className="mt-2 text-3xl font-semibold text-white md:text-4xl">
                Pages Manager
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-white/60">
                Manage the home, about, contact and custom pages from one dark luxury workspace.
              </p>
            </div>
          </div>
          <Button
            onClick={() => router.push("/admin/pages/new")}
            className="h-11 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-600 px-6 text-[10px] font-black uppercase tracking-[0.32em] text-black shadow-lg shadow-amber-500/20 hover:from-amber-300 hover:to-amber-500"
          >
            <Plus size={14} className="mr-2" /> Add New Page
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#0f0f0f] shadow-2xl shadow-black/20">
        <Table>
          <TableHeader className="bg-white/5">
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="h-14 pl-6 text-[10px] font-black uppercase tracking-[0.28em] text-white/40">
                Page Name
              </TableHead>
              <TableHead className="h-14 text-[10px] font-black uppercase tracking-[0.28em] text-white/40">
                Slug
              </TableHead>
              <TableHead className="h-14 text-[10px] font-black uppercase tracking-[0.28em] text-white/40">
                Status
              </TableHead>
              <TableHead className="h-14 pr-6 text-right text-[10px] font-black uppercase tracking-[0.28em] text-white/40">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow className="border-white/10">
                <TableCell colSpan={4} className="h-72 text-center">
                  <div className="flex flex-col items-center gap-3 text-white/50">
                    <Loader2 className="h-8 w-8 animate-spin text-amber-300/40" />
                    <span className="text-[10px] font-black uppercase tracking-[0.35em]">
                      Loading pages...
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ) : rows.length === 0 ? (
              <TableRow className="border-white/10">
                <TableCell colSpan={4} className="h-72 text-center">
                  <div className="flex flex-col items-center gap-3 text-white/30">
                    <Archive size={40} />
                    <span className="text-[10px] font-black uppercase tracking-[0.35em]">
                      No pages found
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => {
                const routeLabel = row.isCanonical
                  ? CANONICAL_PAGES.find((page) => page.slug === row.slug)?.routeLabel ||
                    getRouteLabel(row.slug)
                  : getRouteLabel(row.slug);

                return (
                  <TableRow
                    key={row.key}
                    className="group border-white/10 transition-colors hover:bg-white/5"
                  >
                    <TableCell className="pl-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-amber-400/10 bg-amber-400/10 text-amber-300 transition-transform duration-300 group-hover:scale-105">
                          <Sparkles size={18} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-white">
                            {row.title}
                          </span>
                          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white/30">
                            {row.isCanonical ? "Core page" : "Custom page"}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-amber-100/80">
                        {routeLabel}
                      </code>
                    </TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          "inline-flex rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.28em]",
                          row.status === "Published"
                            ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
                            : "border-white/10 bg-white/5 text-white/50",
                        )}
                      >
                        {row.status}
                      </span>
                    </TableCell>
                    <TableCell className="pr-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="rounded-xl border border-white/10 bg-white/5 px-4 text-[10px] font-black uppercase tracking-[0.25em] text-white/70 hover:bg-amber-400/10 hover:text-amber-200"
                          onClick={() => handleEdit(row)}
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="rounded-xl border border-white/10 bg-white/5 px-4 text-[10px] font-black uppercase tracking-[0.25em] text-white/70 hover:bg-rose-500/10 hover:text-rose-300"
                          disabled={deletingId === row.page?._id || !row.page?._id}
                          onClick={() => handleDelete(row)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default function PagesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-amber-300/40" />
          <span className="text-[10px] font-black uppercase tracking-[0.35em] text-white/40">
            Initializing Pages Manager...
          </span>
        </div>
      }
    >
      <PagesPageContent />
    </Suspense>
  );
}
