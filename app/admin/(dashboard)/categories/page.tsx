"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import {
  FolderTree,
  Plus,
  Edit,
  Trash,
  Search,
  ChevronRight,
  ChevronDown,
  Package,
  Layout,
  FileText,
  Save,
  X,
  Boxes,
  Tag,
  Upload,
  Database,
  Terminal,
  Zap,
  Globe,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { RootState } from "@/lib/store/store";
import {
  createCategory,
  deleteCategory,
  updateCategory,
  fetchCategories,
  bulkImportCategories,
} from "@/lib/store/categories/categoriesThunk";
import {
  CategoryRecord,
  CategoryType,
} from "@/lib/store/categories/categoriesSlices";
import { ImportModal } from "@/components/admin/ImportModal";
import { MediaLibraryModal } from "@/components/admin/media/MediaLibraryModal";
import { ImageIcon } from "lucide-react";

const categorySampleData = [
  {
    name: "PRECIOUS GEMSTONES",
    slug: "precious-gemstones",
    type: "product",
    description: "Rare and precious Vedic gemstones.",
    pageStatus: "published",
    metaTitle: "Precious Gemstones Collection",
    metaDescription:
      "GemsRatna: Authentic lab-certified precious gemstones.",
  },
];

type CategoryDraft = {
  name: string;
  slug: string;
  type: CategoryType;
  parentId: string | null;
  description: string;
  pageStatus: string;
  bannerImageUrl: string;
  metaTitle: string;
  metaDescription: string;
};

function createDraft(type: CategoryType = "product"): CategoryDraft {
  return {
    name: "",
    slug: "",
    type,
    parentId: null,
    description: "",
    pageStatus: "published",
    bannerImageUrl: "",
    metaTitle: "",
    metaDescription: "",
  };
}

function toDraft(record: CategoryRecord): CategoryDraft {
  return {
    name: record.name || record.title || "",
    slug: record.slug || "",
    type: record.type || "product",
    parentId: record.parentId || null,
    description: record.description || "",
    pageStatus: record.pageStatus || "published",
    bannerImageUrl: record.bannerImageUrl || "",
    metaTitle: record.metaTitle || "",
    metaDescription: record.metaDescription || "",
  };
}

function CategoriesPageContent() {
  const [saving, setSaving] = useState(false);
  const [typeFilter, setTypeFilter] = useState<CategoryType | "">("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CategoryDraft>(createDraft());
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [showImportModal, setShowImportModal] = useState(false);

  const { allCategories: categories, categoryLoading: loading } =
    useAppSelector((state: RootState) => state.adminCategories);

  const dispatch = useAppDispatch();

  const resetForm = () => {
    setForm(createDraft(typeFilter || "product"));
    setEditingId(null);
    setShowForm(false);
  };

  const handleImport = async (data: any[]) => {
    const resultAction = await dispatch(bulkImportCategories(data));
    if (bulkImportCategories.fulfilled.match(resultAction)) {
      dispatch(fetchCategories());
      return { message: `${data.length} CATEGORIES SYNCHRONIZED` };
    } else {
      throw new Error(
        (resultAction.payload as any)?.message || "Import failed",
      );
    }
  };

  const totals = useMemo(
    () => ({
      all: categories.length,
      product: categories.filter((item) => item.type === "product").length,
      portfolio: categories.filter((item) => item.type === "portfolio").length,
      blog: categories.filter((item) => item.type === "blog").length,
    }),
    [categories],
  );

  const openCreate = (parentId: string | null = null) => {
    setForm({ ...createDraft(typeFilter || "product"), parentId });
    setEditingId(null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openEdit = (record: CategoryRecord) => {
    setForm(toDraft(record));
    setEditingId(record._id!);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...form };
    if (!payload.name) {
      toast.error("Category Title required.");
      return;
    }

    setSaving(true);
    const tId = toast.loading("SYNCHRONIZING TAXONOMY...");
    try {
      if (editingId) {
        await dispatch(updateCategory({ id: editingId, payload })).unwrap();
        toast.success("CATEGORY UPDATED", { id: tId });
      } else {
        await dispatch(createCategory(payload)).unwrap();
        toast.success("CATEGORY CREATED", { id: tId });
      }
      resetForm();
      dispatch(fetchCategories());
    } catch (err: any) {
      toast.error(
        "CREATION FAILURE: " + (err?.message || "Operation Terminated"),
        { id: tId },
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (record: CategoryRecord) => {
    if (
      !confirm(
        `CONFIRM DELETION: Delete category "${record.name || record.title}"?`,
      )
    )
      return;
    const tId = toast.loading("REMOVING CATEGORY...");
    try {
      await dispatch(deleteCategory(record._id!)).unwrap();
      toast.success("CATEGORY REMOVED", { id: tId });
      dispatch(fetchCategories());
    } catch (err: any) {
      toast.error("REMOVAL FAILURE", { id: tId });
    }
  };

  const toggleExpand = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const newSet = new Set(expandedNodes);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setExpandedNodes(newSet);
  };

  const filteredCategories = useMemo(() => {
    let filtered = categories;
    if (typeFilter) {
      filtered = filtered.filter((c) => c.type === typeFilter);
    }
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter((c) => {
        const name = c.name || c.title || "";
        return (
          name.toLowerCase().includes(lowerQuery) ||
          c.slug.toLowerCase().includes(lowerQuery)
        );
      });
    }
    return filtered;
  }, [categories, searchQuery, typeFilter]);

  const tree = useMemo(() => {
    const map = new Map<string, CategoryRecord & { children: any[] }>();
    const roots: any[] = [];

    filteredCategories.forEach((c) => map.set(c._id, { ...c, children: [] }));

    map.forEach((c) => {
      if (c.parentId && map.has(c.parentId)) {
        map.get(c.parentId)!.children.push(c);
      } else {
        roots.push(c);
      }
    });

    return roots;
  }, [filteredCategories]);

  const renderRows = (nodes: any[], depth: number = 0): React.ReactNode[] => {
    return nodes.flatMap((node) => {
      const hasChildren = node.children.length > 0;
      const isExpanded = expandedNodes.has(node._id) || searchQuery.length > 0;
      const name = node.name || node.title || "Unnamed Category";

      const row = (
        <TableRow
          key={node._id}
          className={`group border-white/5 hover:bg-white/[0.02] transition-all duration-300 ${depth > 0 ? "bg-ink/20" : ""}`}
        >
          <TableCell
            className="w-full sm:w-[50%] px-8 py-6"
            style={{ paddingLeft: `${depth * 3 + 2}rem` }}
          >
            <div className="flex items-center gap-4">
              {hasChildren ? (
                <button
                  onClick={(e) => toggleExpand(node._id, e)}
                  className={`flex items-center justify-center w-6 h-6 rounded-sm transition-all border ${isExpanded ? "bg-gold/10 border-gold text-gold" : "bg-ink border-white/10 text-white/20 hover:text-white"}`}
                >
                  {isExpanded ? (
                    <ChevronDown size={14} />
                  ) : (
                    <ChevronRight size={14} />
                  )}
                </button>
              ) : (
                <div className="w-6 h-6 flex items-center justify-center">
                  <div className="w-1 h-1 rounded-full bg-white/10" />
                </div>
              )}

              <div
                className={`flex items-center justify-center w-10 h-10 rounded-sm border ${depth === 0 ? "bg-gold/5 border-gold/20 text-gold" : "bg-ink border-white/5 text-white/20"}`}
              >
                <FolderTree size={18} />
              </div>

              <div className="flex flex-col">
                <span
                  className={`font-black text-white uppercase tracking-tight group-hover:text-gold transition-colors ${depth === 0 ? "text-sm" : "text-xs"}`}
                >
                  {name}
                </span>
                <span className="text-[9px] font-mono font-bold text-white/20 uppercase tracking-widest italic">
                  /{node.slug}
                </span>
              </div>
            </div>
          </TableCell>
          <TableCell>
            <span className="text-[9px] font-black text-white/40 uppercase tracking-widest px-3 py-1 bg-ink border border-white/5 rounded-none italic">
              {node.type} Logic
            </span>
          </TableCell>
          <TableCell>
            <div className="flex items-center gap-2">
              <Zap size={12} className="text-gold/40" />
              <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">
                {node.children.length} Sub-Nodes
              </span>
            </div>
          </TableCell>
          <TableCell className="text-right px-8">
            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                className="h-9 w-9 bg-charcoal border border-white/5 text-white/20 hover:text-gold hover:border-gold/30 transition-all flex items-center justify-center"
                onClick={() => openCreate(node._id)}
                title="Add Sub-Category"
              >
                <Plus size={16} />
              </button>
              <button
                className="h-9 w-9 bg-charcoal border border-white/5 text-white/20 hover:text-gold hover:border-gold/30 transition-all flex items-center justify-center"
                onClick={() => openEdit(node)}
                title="Modify Category"
              >
                <Edit size={16} />
              </button>
              <button
                className="h-9 w-9 bg-charcoal border border-white/5 text-white/20 hover:text-red hover:border-red/30 transition-all flex items-center justify-center"
                onClick={() => handleDelete(node)}
                title="Remove Category"
              >
                <Trash size={16} />
              </button>
            </div>
          </TableCell>
        </TableRow>
      );

      if (isExpanded && hasChildren) {
        return [row, ...renderRows(node.children, depth + 1)];
      }

      return [row];
    });
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Tactical Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-white/5 pb-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-white uppercase tracking-tighter leading-none">
            Category <span className="text-gold">Management</span>
          </h1>
          <p className="text-[10px] text-white/40 font-black uppercase tracking-[0.3em] italic flex items-center gap-2">
            <Database size={12} className="text-gold" /> System hierarchy for
            product categorization and navigation.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button
            className="h-12 px-6 bg-charcoal border border-white/10 text-white/40 font-black text-[10px] uppercase tracking-widest hover:text-white transition-all flex items-center gap-3"
            onClick={() => setShowImportModal(true)}
          >
            <Upload size={16} /> Bulk Upload
          </button>
          <button
            className="h-12 px-10 bg-olive text-white hover:bg-olive-lt font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 flex items-center gap-3 shadow-2xl shadow-olive/20"
            onClick={() => openCreate(null)}
          >
            <Plus size={18} /> Add Category
          </button>
        </div>
      </div>

      {/* Stats Cluster */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          {
            label: "Total Categories",
            val: totals.all,
            icon: Boxes,
            color: "gold",
          },
          {
            label: "Product Categories",
            val: totals.product,
            icon: Package,
            color: "olive",
          },
          {
            label: "Portfolio Nodes",
            val: totals.portfolio,
            icon: Layout,
            color: "blue-500",
          },
          {
            label: "Blog Nodes",
            val: totals.blog,
            icon: FileText,
            color: "amber-500",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-charcoal border border-white/5 p-5 rounded-none shadow-2xl shadow-black/40 group hover:border-gold/20 transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] group-hover:text-white/40 transition-colors">
                {stat.label}
              </span>
              <stat.icon
                size={14}
                className={`text-${stat.color} opacity-40 group-hover:opacity-100 transition-opacity`}
              />
            </div>
            <div className="text-3xl font-black text-white tracking-widest">
              {stat.val}
            </div>
          </div>
        ))}
      </div>

      {/* Inline Editor Form */}
      {showForm && (
        <div className="bg-charcoal border-l-4 border-gold p-8 space-y-8 shadow-2xl shadow-black/60 animate-in slide-in-from-top-4 duration-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-ink border border-gold/20 flex items-center justify-center text-gold">
                <Tag size={20} />
              </div>
              <div>
                <h3 className="text-xl font-black text-white uppercase tracking-widest">
                  {editingId
                    ? "Modify Category"
                    : "Add New Category"}
                </h3>
                <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest italic mt-1">
                  Configure hierarchical categories for gemstone network.
                </p>
              </div>
            </div>
            <button
              onClick={resetForm}
              className="h-10 w-10 bg-ink border border-white/5 text-white/20 hover:text-white transition-all flex items-center justify-center"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">
                  Category Name
                </label>
                <input
                  placeholder="e.g. RINGS AND PENDANTS"
                  value={form.name}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full h-12 bg-ink border border-white/10 rounded-sm px-4 text-xs font-black text-white uppercase tracking-widest focus:border-gold outline-none"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">
                  Network Slug
                </label>
                <input
                  placeholder="rings-and-pendants"
                  value={form.slug}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      slug: e.target.value
                        .toLowerCase()
                        .replace(/[^a-z0-9-]/g, "-"),
                    }))
                  }
                  className="w-full h-12 bg-ink border border-white/10 rounded-sm px-4 text-xs font-mono font-bold text-gold lowercase tracking-widest focus:border-gold outline-none"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">
                  Taxonomy Type
                </label>
                <select
                  value={form.type}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      type: e.target.value as CategoryType,
                    }))
                  }
                  className="w-full h-12 bg-ink border border-white/10 rounded-sm px-4 text-xs font-black text-white uppercase tracking-widest focus:border-gold outline-none appearance-none"
                >
                  <option value="product">Gemstone Catalog</option>
                  <option value="portfolio">Portfolio Archive</option>
                  <option value="blog">Blog Stream</option>
                </select>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">
                  Parent Node
                </label>
                <select
                  value={form.parentId || "none"}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      parentId:
                        e.target.value === "none" ? null : e.target.value,
                    }))
                  }
                  className="w-full h-12 bg-ink border border-white/10 rounded-sm px-4 text-xs font-black text-white uppercase tracking-widest focus:border-gold outline-none appearance-none"
                >
                  <option value="none">-- NO PARENT (ROOT CATEGORY) --</option>
                  {categories
                    .filter((c) => c.type === form.type && c._id !== editingId)
                    .map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name || c.title}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">
                  Page Status
                </label>
                <select
                  value={form.pageStatus}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, pageStatus: e.target.value }))
                  }
                  className="w-full h-12 bg-ink border border-white/10 rounded-sm px-4 text-xs font-black text-white uppercase tracking-widest focus:border-gold outline-none appearance-none"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">
                  Banner Image
                </label>
                <div className="flex gap-2">
                  <input
                    placeholder="BANNER IMAGE URL"
                    value={form.bannerImageUrl}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        bannerImageUrl: e.target.value,
                      }))
                    }
                    className="flex-1 h-12 bg-ink border border-white/10 rounded-sm px-4 text-xs font-bold text-white tracking-widest focus:border-gold outline-none"
                  />
                  <MediaLibraryModal
                    onSelect={(media) =>
                      setForm((prev) => ({
                        ...prev,
                        bannerImageUrl: media.url,
                      }))
                    }
                    trigger={
                      <button
                        type="button"
                        className="h-12 w-12 bg-ink border border-white/10 text-gold hover:bg-gold/10 flex items-center justify-center transition-all"
                      >
                        <ImageIcon size={20} />
                      </button>
                    }
                  />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">
                  Category Description (Optional)
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Describe what items belong to this category..."
                  className="w-full h-24 bg-ink border border-white/10 rounded-sm p-4 text-xs font-bold text-white uppercase tracking-widest focus:border-gold outline-none resize-none"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">
                  Meta Title (SEO)
                </label>
                <input
                  placeholder="SEO meta title"
                  value={form.metaTitle}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, metaTitle: e.target.value }))
                  }
                  className="w-full h-12 bg-ink border border-white/10 rounded-sm px-4 text-xs font-bold text-white uppercase tracking-widest focus:border-gold outline-none"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">
                Global Meta description (SEO)
              </label>
              <textarea
                value={form.metaDescription}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    metaDescription: e.target.value,
                  }))
                }
                className="w-full h-24 bg-ink border border-white/10 rounded-sm p-4 text-xs font-bold text-white uppercase tracking-widest focus:border-gold outline-none resize-none"
              />
            </div>

            <div className="flex justify-end gap-4 pt-6 border-t border-white/5">
              <button
                type="button"
                onClick={resetForm}
                className="h-12 px-8 bg-charcoal border border-white/10 text-white/40 font-black text-[10px] uppercase tracking-widest hover:text-white"
              >
                Abort
              </button>
              <button
                type="submit"
                disabled={saving}
                className="h-12 px-12 bg-olive text-white font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-olive/20 flex items-center gap-3"
              >
                {saving ? (
                  <div className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <Save size={16} />
                )}
                {editingId ? "Update Category" : "Create Category"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Controls & Search */}
      <div className="flex flex-col sm:flex-row gap-6 items-center justify-between bg-charcoal p-5 rounded-none border border-white/5 shadow-2xl shadow-black/40">
        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto custom-scrollbar pb-2 sm:pb-0">
          {(["", "product", "portfolio", "blog"] as const).map((type) => (
            <button
              key={type || "all"}
              onClick={() => setTypeFilter(type)}
              className={`px-6 py-2 rounded-none text-[10px] font-black uppercase tracking-widest transition-all ${
                typeFilter === type
                  ? "bg-gold text-ink"
                  : "bg-ink border border-white/5 text-white/20 hover:text-white"
              }`}
            >
              {type || "Unified Grid"}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-[400px] group">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-gold transition-colors"
            size={16}
          />
          <input
            placeholder="SEARCH HIERARCHY MATRIX..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-12 pr-4 bg-ink border border-white/10 rounded-sm text-xs font-black uppercase tracking-widest text-white placeholder:text-white/10 focus:border-gold outline-none"
          />
        </div>
      </div>

      {/* Hierarchy Table */}
      <div className="bg-charcoal border border-white/5 rounded-none overflow-hidden shadow-2xl shadow-black/80">
        <Table>
          <TableHeader className="bg-ink/60 border-b border-white/5">
            <TableRow className="hover:bg-transparent border-none h-16">
              <TableHead className="text-[10px] font-black uppercase tracking-[0.25em] text-white/20 px-8">
                Category Hierarchy
              </TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-[0.25em] text-white/20 text-center">
                Protocol
              </TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-[0.25em] text-white/20">
                Sub-categories
              </TableHead>
              <TableHead className="text-right text-[10px] font-black uppercase tracking-[0.25em] text-white/20 px-8">
                Category Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow className="border-none hover:bg-transparent">
                <TableCell colSpan={4} className="h-64 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="h-8 w-8 border-2 border-white/5 border-t-gold rounded-full animate-spin shadow-lg shadow-gold/20" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 italic animate-pulse">
                      Syncing Category Tree...
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ) : tree.length === 0 ? (
              <TableRow className="border-none hover:bg-transparent">
                <TableCell colSpan={4} className="h-64 text-center">
                  <div className="flex flex-col items-center gap-6 opacity-10 italic">
                    <FolderTree size={48} />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em]">
                      No categories found in inventory.
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              renderRows(tree)
            )}
          </TableBody>
        </Table>
      </div>

      {/* Footer Intel */}
      <div className="flex items-center gap-3 opacity-40">
        <Terminal size={14} className="text-gold" />
        <span className="text-[8px] font-black text-white/40 uppercase tracking-[0.4em]">
          Admin Access Level: Authorized Level-4 | Inventory Sync: Active
        </span>
      </div>

      <ImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImport={handleImport}
        sampleData={categorySampleData}
        title="Category Import"
        description="Synchronize bulk categories via secure JSON manifest."
        fileName="categories"
      />
    </div>
  );
}

export default function CategoriesPage() {
  return (
    <div className="p-4 md:p-8 min-h-screen bg-ink">
      <Suspense
        fallback={
          <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
            <div className="h-8 w-8 border-2 border-white/5 border-t-gold rounded-full animate-spin shadow-lg shadow-gold/20" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 italic">
              Initializing Management Hub...
            </span>
          </div>
        }
      >
        <CategoriesPageContent />
      </Suspense>
    </div>
  );
}
