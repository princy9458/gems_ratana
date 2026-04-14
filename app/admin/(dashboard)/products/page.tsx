"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  fetchProducts,
  deleteProduct,
  bulkImportProducts,
} from "@/lib/store/products/productsThunk";
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
  Edit,
  Trash,
  Eye,
  ChevronDown,
  ChevronUp,
  Upload,
  Image as ImageIcon,
  Package,
  Search,
  X,
  LayoutGrid,
  Rows,
  ChevronRight,
  MoreVertical,
  Filter,
  Download,
  Target,
  Zap,
  ShieldAlert,
  Database,
  Gem
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { RootState } from "@/lib/store/store";
import { ImportModal } from "@/components/admin/ImportModal";

function ProductsPageContent() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { allProducts: products, loading } = useAppSelector(
    (state: RootState) => state.adminProducts,
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [showImportModal, setShowImportModal] = useState(false);
  const [importing, setImporting] = useState(false);

  const handleImport = async (data: any[]) => {
    setImporting(true);
    try {
      const resultAction = await dispatch(bulkImportProducts(data));
      if (bulkImportProducts.fulfilled.match(resultAction)) {
        // dispatch(fetchProducts());
        return resultAction.payload;
      } else {
        throw new Error(
          (resultAction.payload as string) || "Bulk import protocol failed.",
        );
      }
    } finally {
      setImporting(false);
    }
  };

  const productSampleData = [
    {
      name: "Natural Blue Sapphire (Neelam)",
      sku: "GEM-SAP-001",
      type: "physical",
      price: 1499.99,
      status: "active",
      description: "Certified Ceylon Blue Sapphire for Vedic astrology.",
      categories: ["precious-gems", "sapphire"],
      images: [
        "https://images.unsplash.com/photo-1599557456722-1b15d2fbdd21?auto=format&fit=crop&q=80&w=800",
      ],
      options: [
        {
          label: "Carat",
          values: ["3.5", "5.0", "7.0"],
          useForVariants: true,
        },
        { label: "Origin", values: ["Ceylon", "Kashmir"], useForVariants: true },
      ],
      variants: [
        {
          sku: "GEM-SAP-001-35-CEY",
          title: "3.5 Carat / Ceylon",
          price: 1499.99,
          stock: 5,
          optionValues: { Carat: "3.5", Origin: "Ceylon" },
        },
      ],
    },
  ];

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Confirm removal of product: "${name}"?`)) return;
    const toastId = toast.loading(`Removing ${name}...`);
    try {
      const resultAction = await dispatch(deleteProduct(id));
      if (deleteProduct.fulfilled.match(resultAction)) {
        toast.success(`Product ${name} removed.`, { id: toastId });
        dispatch(fetchProducts());
      } else {
        toast.error("Removal denied by system constraints.", {
          id: toastId,
        });
      }
    } catch (err) {
      toast.error("Comms failure.", { id: toastId });
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="flex flex-col space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-white/5 pb-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-head font-black text-white uppercase tracking-tighter leading-none">
            Products{" "}
          </h1>
          <p className="text-sm text-white/40 font-medium italic flex items-center gap-2 uppercase tracking-widest text-[10px]">
            <Target size={12} className="text-gold" /> Cataloging product inventory and stock levels.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button
            className="h-12 px-6 bg-white/5 border border-white/10 text-white/40 font-head font-bold text-xs uppercase tracking-widest rounded-sm hover:text-white hover:border-gold/30 transition-all flex items-center gap-2 group"
            onClick={() => setShowImportModal(true)}
            disabled={importing}
          >
            <Upload
              size={16}
              className="group-hover:-translate-y-0.5 transition-transform"
            />{" "}
            Import Batch
          </button>
          <ImportModal
            isOpen={showImportModal}
            onClose={() => setShowImportModal(false)}
            onImport={handleImport}
            sampleData={productSampleData}
            title="Bulk Inventory Import"
            description="Upload JSON batch files to synchronize product inventory with the system."
            fileName="gems_ratna_products"
          />
          <Link href="/admin/products/new">
            <button className="h-12 px-8 bg-olive text-white hover:bg-olive-lt font-head font-bold text-xs uppercase tracking-widest rounded-sm transition-all active:scale-95 flex items-center gap-3 shadow-2xl shadow-olive/20">
              <Plus size={18} /> Add Product
            </button>
          </Link>
        </div>
      </div>

      {/* Toolbar Section */}
      <div className="flex flex-col lg:flex-row items-center gap-6 bg-charcoal p-5 rounded-sm border border-white/5 shadow-2xl shadow-black/60">
        <div className="relative flex-1 group w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-gold transition-colors" />
          <input
            placeholder="SEARCH PRODUCT BY NAME OR SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 h-12 bg-ink border border-white/10 rounded-sm text-xs font-bold uppercase tracking-widest text-white placeholder:text-white/20 focus:border-gold outline-none transition-all"
          />
        </div>
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <button className="h-12 px-6 flex-1 lg:flex-none border border-white/10 text-white/40 hover:text-white hover:border-gold/30 font-head font-bold text-xs uppercase tracking-widest rounded-sm transition-all flex items-center justify-center gap-2 italic">
            <Filter size={16} /> Product Filters
          </button>
          <button className="h-12 px-6 border border-white/10 text-white/40 hover:text-white hover:border-gold/30 font-head font-bold text-xs uppercase tracking-widest rounded-sm transition-all flex items-center justify-center gap-2 italic">
            <Download size={16} /> Export Ledger
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-charcoal border border-white/5 rounded-sm overflow-hidden shadow-2xl shadow-black/80">
        <Table>
          <TableHeader className="bg-ink/60 border-b border-white/5">
            <TableRow className="hover:bg-transparent border-white/5 h-16">
              <TableHead className="text-[10px] font-black uppercase tracking-[0.25em] text-white/20 px-8">
                Product Details
              </TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-[0.25em] text-white/20">
                SKU / Serial
              </TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-[0.25em] text-white/20">
                Availability
              </TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-[0.25em] text-white/20">
                Configuration
              </TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-[0.25em] text-white/20 text-right px-8">
                Management
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow className="border-none hover:bg-transparent">
                <TableCell colSpan={5} className="h-64 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="h-8 w-8 border-2 border-white/5 border-t-gold rounded-full animate-spin shadow-lg shadow-gold/20" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 italic animate-pulse">
                      Syncing Inventory Hub...
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredProducts.length === 0 ? (
              <TableRow className="border-none hover:bg-transparent">
                <TableCell colSpan={5} className="h-96 text-center p-12">
                  <div className="flex flex-col items-center gap-6 text-white/10 italic">
                    <div className="h-24 w-24 rounded-full border border-white/5 flex items-center justify-center bg-white/[0.02] shadow-inner">
                      <Gem
                        size={48}
                        strokeWidth={1}
                        className="opacity-40"
                      />
                    </div>
                    <span className="text-sm font-bold uppercase tracking-[0.3em] leading-relaxed">
                      No products found in inventory.
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((prod) => (
                <TableRow
                  key={prod._id}
                  className="group border-white/5 hover:bg-white/[0.02] transition-all duration-300"
                >
                  <TableCell className="px-8 py-6">
                    <div className="flex items-center gap-6">
                      <div className="h-16 w-16 rounded-sm overflow-hidden bg-ink border border-white/5 group-hover:border-gold/30 transition-all ring-1 ring-gold/0 group-hover:ring-gold/5">
                        {prod.gallery && prod.gallery[0] ? (
                          <img
                            src={String(prod.gallery[0].url)}
                            alt={String(prod.gallery[0].alt)}
                            className="h-full w-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-500"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-white/10">
                            <ImageIcon size={22} />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col space-y-1.5 overflow-hidden">
                        <span className="text-sm font-bold text-white uppercase tracking-tight leading-none group-hover:text-gold transition-colors italic truncate">
                          {prod.name}
                        </span>
                        <span className="text-lg font-head font-black text-gold/80 tracking-tighter leading-none">
                          ${prod.pricing?.price || prod.price || "0"}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-[9px] font-black text-white/20 px-3 py-1 bg-ink border border-white/5 rounded-sm uppercase tracking-widest italic group-hover:text-gold/40 group-hover:border-gold/20 transition-all">
                      {prod.sku || "UNASSIGNED"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div
                      className={cn(
                        "inline-flex items-center gap-2.5 px-4 py-1.5 rounded-sm text-[9px] font-black uppercase tracking-widest border italic",
                        prod.status === "active"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                          : "bg-white/5 text-white/30 border-white/10",
                      )}
                    >
                      <div
                        className={cn(
                          "h-1.5 w-1.5 rounded-full ring-2 ring-white/0 group-hover:ring-current/20",
                          prod.status === "active"
                            ? "bg-emerald-400"
                            : "bg-white/30",
                        )}
                      />
                      {prod.status}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3 text-white/30 italic group-hover:text-gold/50 transition-colors">
                      <Zap size={14} className="text-gold/50" />
                      <span className="text-[10px] font-black uppercase tracking-widest">
                        {prod.variants?.length || 0} Variations
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right px-8">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        className="h-10 w-10 rounded-sm border border-white/5 bg-white/[0.03] text-white/20 hover:text-gold hover:border-gold/30 hover:bg-gold/10 transition-all flex items-center justify-center group/btn shadow-xl active:scale-95"
                        onClick={() =>
                          router.push(`/admin/products/${prod._id}/edit`)
                        }
                        title="Modify Product"
                      >
                        <Edit
                          size={18}
                          className="group-hover/btn:scale-110 transition-transform"
                        />
                      </button>
                      <button
                        className="h-10 w-10 rounded-sm border border-white/5 bg-white/[0.03] text-white/20 hover:text-red hover:border-red/30 hover:bg-red/10 transition-all flex items-center justify-center group/btn shadow-xl active:scale-95"
                        onClick={() =>
                          handleDelete(String(prod._id), prod.name)
                        }
                        title="Remove Product"
                      >
                        <Trash
                          size={18}
                          className="group-hover/btn:scale-110 transition-transform"
                        />
                      </button>
                      <button
                        className="h-10 w-10 rounded-sm border border-white/5 bg-white/[0.03] text-white/20 hover:text-white hover:border-gold/30 hover:bg-gold/10 transition-all flex items-center justify-center group/btn shadow-xl"
                        title="Diagnostics"
                      >
                        <MoreVertical
                          size={18}
                          className="group-hover/btn:scale-110 transition-transform"
                        />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
          <div className="h-8 w-8 border-2 border-white/5 border-t-gold rounded-full animate-spin shadow-lg shadow-gold/20" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 italic">
            Initializing Product Hub...
          </span>
        </div>
      }
    >
      <ProductsPageContent />
    </Suspense>
  );
}
