"use client";

import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import {
  Activity,
  ArrowUpRight,
  BarChart3,
  Layers,
  Package,
  ShoppingCart,
  Tag,
  Boxes,
  Zap,
  Globe,
  Shield,
  Clock,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Target,
  Terminal,
  Lock,
  Radio,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { useAppSelector } from "@/lib/store/hooks";

const revenueData = [
  { month: "JAN", revenue: 4200 },
  { month: "FEB", revenue: 5100 },
  { month: "MAR", revenue: 3800 },
  { month: "APR", revenue: 6200 },
  { month: "MAY", revenue: 7300 },
  { month: "JUN", revenue: 8100 },
  { month: "JUL", revenue: 9400 },
];

const statDefinitions = [
  {
    key: "products",
    label: "Total Products",
    icon: Package,
    subLabel: "In Stock",
    trend: "+2.1%",
    isUp: true,
  },
  {
    key: "categories",
    label: "Total Categories",
    icon: Layers,
    subLabel: "Category Structure",
    trend: "+12.4%",
    isUp: true,
  },
  {
    key: "orders",
    label: "Total Orders",
    icon: ShoppingCart,
    subLabel: "Recent Activity",
    trend: "+12%",
    isUp: true,
  },
  {
    key: "attributes",
    label: "Product Attributes",
    icon: Tag,
    subLabel: "Management Hub",
    trend: "Nominal",
    isUp: false,
  },
];

export default function AdminDashboard() {
  const { allCategories, categoryLoading } = useAppSelector(
    (state: RootState) => state.adminCategories,
  );
  const { allattributes, attributeLoading } = useAppSelector(
    (state: RootState) => state.adminAttributes,
  );

  const { allProducts, loading } = useAppSelector(
    (state: RootState) => state.adminProducts,
  );

  const { gemsratnaUser: user } = useSelector((state: RootState) => state.auth);

  const mainLoading = categoryLoading && attributeLoading && loading;

  const stats = {
    products: allProducts?.length || 0,
    categories: allCategories?.length || 0,
    orders: 0,
    attributes: allattributes?.length || 0,
  };

  return (
    <div className="flex flex-col space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* HEADER SECTION */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b border-white/5">
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-gold opacity-60">
            <Terminal size={14} />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] italic">
              System Authorization: Master Access
            </span>
          </div>
          <h1 className="text-5xl font-head font-black text-white uppercase tracking-tighter leading-none">
            Dashboard
          </h1>
          <p className="text-sm font-medium text-white/40 italic flex items-center gap-2">
            Monitoring inventory and store performance on the{" "}
            <span className="text-gold font-bold uppercase tracking-widest text-[10px] ring-1 ring-gold/20 px-2 py-0.5 bg-gold/5 rounded-sm italic">
              GemsRatna Management
            </span>{" "}
            grid.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-charcoal p-4 rounded-sm border border-white/5 shadow-2xl shadow-black/40">
          <div className="flex flex-col items-end px-4 border-r border-white/5">
            <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] mb-1">
              System Status 
            </span>
            <span className="text-emerald-400 font-bold flex items-center gap-2 text-xs uppercase tracking-widest italic outline-none">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-lg shadow-emerald-500/40" />{" "}
              Live Sync
            </span>
          </div>
          <div className="flex flex-col items-end px-2">
            <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] mb-1">
              Sync Status
            </span>
            <span className="text-white/80 font-bold text-xs uppercase tracking-widest italic">
              Encrypted
            </span>
          </div>
        </div>
      </section>

      {/* STATS CARDS */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statDefinitions.map((stat, idx) => (
          <motion.div
            key={stat.key}
            className="group relative bg-charcoal border border-white/5 p-6 rounded-sm hover:border-gold/30 transition-all duration-500 shadow-2xl shadow-black/40 overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 -rotate-45 translate-x-12 -translate-y-12 transition-transform group-hover:scale-150 duration-700" />

            <div className="relative z-10 flex items-start justify-between mb-8">
              <div className="h-14 w-14 flex items-center justify-center rounded-sm bg-olive/10 border border-olive/30 group-hover:bg-olive group-hover:text-white transition-all ring-1 ring-gold/5 group-hover:ring-gold/20 shadow-inner">
                <stat.icon
                  size={24}
                  className="text-gold group-hover:text-white transition-colors duration-300"
                />
              </div>
              <div
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-sm text-[9px] font-black uppercase tracking-widest border italic",
                  stat.isUp
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    : "bg-white/5 text-white/30 border-white/5",
                )}
              >
                {stat.isUp ? (
                  <TrendingUp size={12} />
                ) : (
                  <Radio size={12} className="animate-pulse" />
                )}{" "}
                {stat.trend}
              </div>
            </div>

            <div className="relative z-10 space-y-2">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 group-hover:text-gold/50 transition-colors">
                {stat.label}
              </p>
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-head font-black text-white tracking-tighter tabular-nums leading-none">
                  {mainLoading ? "---" : stats[stat.key as keyof typeof stats]}
                </span>
                <span className="text-white/20 font-bold text-[9px] uppercase tracking-widest italic group-hover:text-gold/30 transition-colors">
                  {stat.subLabel}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </section>

      {/* CHARTS AND LISTS */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* REVENUE CHART */}
        <div className="lg:col-span-2 bg-charcoal border border-white/5 rounded-sm p-10 shadow-2xl shadow-black/60 relative overflow-hidden group">
          <div className="absolute top-0 right-0 mt-6 mr-6 opacity-5 group-hover:opacity-20 transition-opacity">
            <BarChart3 size={120} className="text-white" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
            <div className="space-y-2">
              <h3 className="text-2xl font-head font-black text-white uppercase tracking-tighter">
                Retail <span className="text-gold/80 italic">Performance</span>
              </h3>
              <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] italic flex items-center gap-2">
                <span className="w-4 h-px bg-white/10" /> 30-Day Sales Performance
              </p>
            </div>
            <div className="flex gap-3">
              <button className="h-10 px-6 bg-olive text-white text-[10px] font-black uppercase tracking-widest rounded-sm hover:bg-olive-lt transition-all active:scale-95 shadow-xl shadow-olive/10">
                Analyze Data
              </button>
              <button className="h-10 px-6 bg-white/5 border border-white/10 text-white/40 text-[10px] font-black uppercase tracking-widest rounded-sm hover:text-white hover:border-gold/30 transition-all">
                Export Ledger
              </button>
            </div>
          </div>

          <div className="relative z-10 h-[380px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={revenueData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="tacticalRevenueGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#c9a227" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#c9a227" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="4 4"
                  vertical={false}
                  stroke="rgba(255,255,255,0.03)"
                />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "rgba(255,255,255,0.2)",
                    fontSize: 10,
                    fontWeight: 900,
                    letterSpacing: "0.15em",
                  }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "rgba(255,255,255,0.2)",
                    fontSize: 10,
                    fontWeight: 900,
                  }}
                  tickFormatter={(val) => `₹${val / 1000}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1a1c1a",
                    border: "1px solid rgba(201,162,39,0.2)",
                    borderRadius: "0",
                    fontSize: "12px",
                    color: "#fff",
                    fontWeight: 900,
                  }}
                  itemStyle={{ color: "#c9a227" }}
                  cursor={{ stroke: "rgba(201,162,39,0.3)", strokeWidth: 2 }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#c9a227"
                  strokeWidth={4}
                  fill="url(#tacticalRevenueGradient)"
                  dot={{
                    r: 5,
                    fill: "#c9a227",
                    stroke: "#111210",
                    strokeWidth: 3,
                  }}
                  activeDot={{
                    r: 8,
                    fill: "#c9a227",
                    stroke: "#fff",
                    strokeWidth: 2,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* RECENT ACTIVITY */}
        <div className="bg-charcoal border border-white/5 rounded-sm p-10 space-y-10 shadow-2xl shadow-black/60 relative group">
          <div className="flex items-center justify-between pb-4 border-b border-white/5">
            <h3 className="text-xl font-head font-black text-white uppercase tracking-tighter italic">
              Recent <span className="text-gold/80">Orders</span>
            </h3>
            <div className="px-3 py-1.5 rounded-full bg-emerald-500/10 text-[8px] font-black uppercase text-emerald-400 tracking-[0.2em] border border-emerald-500/20 active-ring">
              Live Feed Active
            </div>
          </div>

          <div className="space-y-6">
            {[
              {
                label: "Ruby Pendant Ordered",
                time: "2 min ago",
                icon: ShoppingCart,
                status: "Confirmed",
              },
              {
                label: "Sapphire Stock Replenished",
                time: "1 hour ago",
                icon: Package,
                status: "Inbound",
              },
              {
                label: "Astrology Consultation Booked",
                time: "3 hours ago",
                icon: Layers,
                status: "Complete",
              },
              {
                label: "Stock Alert: Emerald Rings",
                time: "1 day ago",
                icon: Activity,
                status: "Alert",
              },
            ].map((activity, i) => (
              <div
                key={i}
                className="flex gap-5 group cursor-pointer p-4 rounded-sm border border-transparent hover:border-white/5 hover:bg-white/5 transition-all relative overflow-hidden"
              >
                <div className="h-12 w-12 flex-shrink-0 flex items-center justify-center rounded-sm bg-olive/10 border border-olive/30 text-olive-lt group-hover:bg-olive group-hover:text-white transition-all ring-1 ring-gold/5">
                  <activity.icon size={20} />
                </div>
                <div className="flex flex-col justify-center overflow-hidden space-y-1.5">
                  <p className="text-xs font-black text-white uppercase tracking-tight truncate group-hover:text-gold transition-colors">
                    {activity.label}
                  </p>
                  <div className="flex items-center gap-3">
                    <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest italic">
                      {activity.time}
                    </span>
                    <span
                      className={cn(
                        "text-[9px] font-black px-2 py-0.5 rounded-full border tracking-[0.2em] uppercase",
                        activity.status === "Alert"
                          ? "bg-red/10 text-red border-red/20"
                          : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
                      )}
                    >
                      {activity.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-8 rounded-sm bg-ink/60 border border-white/5 space-y-4 shadow-inner relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-gold/5 -rotate-45 translate-x-8 -translate-y-8" />
            <div className="flex items-center gap-3">
              <Shield className="text-gold" size={18} />
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white italic">
                System Security // Active
              </h4>
            </div>
            <p className="text-[10px] text-white/30 leading-relaxed italic font-medium uppercase tracking-wider">
              All transactions are securely synchronized. System data protection active.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
