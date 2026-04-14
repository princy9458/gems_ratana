"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Users, 
  Plus, 
  Calendar, 
  Moon, 
  CheckCircle2, 
  Clock, 
  MoreHorizontal,
  Search,
  Filter,
  Download,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// Mock Data for Consultations
const MOCK_CONSULTATIONS = [
  {
    id: "CON-001",
    customer: "Aditya Sharma",
    email: "aditya.s@example.com",
    zodiac: "Leo / Simha",
    date: "2024-04-15",
    status: "Pending",
  },
  {
    id: "CON-002",
    customer: "Priya Patel",
    email: "priya.p@example.com",
    zodiac: "Virgo / Kanya",
    date: "2024-04-14",
    status: "Completed",
  },
  {
    id: "CON-003",
    customer: "Rahul Verma",
    email: "rahul.v@example.com",
    zodiac: "Scorpio / Vrishchika",
    date: "2024-04-13",
    status: "Completed",
  },
  {
    id: "CON-004",
    customer: "Ananya Iyer",
    email: "ananya.i@example.com",
    zodiac: "Aries / Mesha",
    date: "2024-04-12",
    status: "Pending",
  },
  {
    id: "CON-005",
    customer: "Vikram Singh",
    email: "vikram.s@example.com",
    zodiac: "Taurus / Vrishabha",
    date: "2024-04-10",
    status: "Completed",
  },
];

export default function ConsultationsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredConsultations = MOCK_CONSULTATIONS.filter((con) =>
    con.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    con.zodiac.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* ── HEADER SECTION ────────────────────────────── */}
      <div className="rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-[#121212] via-[#080808] to-[#1b1506] p-10 shadow-3xl shadow-black/80 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <Moon size={180} />
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
          <div className="flex items-start gap-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl border border-gold/20 bg-gold/10 text-gold shadow-2xl shadow-gold/10">
              <Sparkles size={28} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gold/60 mb-2">
                Astrological Guidance
              </p>
              <h1 className="text-4xl font-black text-white uppercase tracking-tighter leading-none">
                Consultations
              </h1>
              <p className="mt-3 text-sm font-medium text-white/40 italic max-w-xl">
                Manage expert sessions, zodiac readings, and spiritual guidance bookings from the GemsRatna central registry.
              </p>
            </div>
          </div>
          
          <Button
            className="h-14 px-10 bg-gold hover:bg-gold/90 text-black font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-2xl shadow-gold/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Plus size={14} className="mr-2" />
            Add New Consultation
          </Button>
        </div>
      </div>

      {/* ── TOOLBAR SECTION ───────────────────────────── */}
      <div className="flex flex-col lg:flex-row items-center gap-6 bg-[#0f0f0f] p-4 rounded-[2rem] border border-white/5 shadow-2xl">
        <div className="relative flex-1 group w-full">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-gold transition-colors" />
          <Input
            placeholder="Search bookings by customer or zodiac..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-14 pr-6 h-14 bg-white/[0.02] border-white/10 rounded-2xl text-xs font-bold uppercase tracking-widest text-white placeholder:text-white/20 focus:border-gold/50 focus:ring-gold/20 outline-none transition-all"
          />
        </div>
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <Button variant="ghost" className="h-14 px-8 border border-white/5 text-white/40 hover:text-white hover:bg-white/5 font-black text-[10px] uppercase tracking-widest rounded-2xl transition-all flex items-center gap-2 italic">
            <Filter size={16} /> Filters
          </Button>
          <Button variant="ghost" className="h-14 px-8 border border-white/5 text-white/40 hover:text-white hover:bg-white/5 font-black text-[10px] uppercase tracking-widest rounded-2xl transition-all flex items-center gap-2 italic">
            <Download size={16} /> Export
          </Button>
        </div>
      </div>

      {/* ── TABLE SECTION ─────────────────────────────── */}
      <div className="rounded-[2.5rem] border border-white/10 bg-[#0a0a0a] overflow-hidden shadow-3xl shadow-black/60 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
        
        <Table>
          <TableHeader className="bg-white/[0.03] border-b border-white/5 h-20">
            <TableRow className="hover:bg-transparent border-none">
              <TableHead className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 pl-10 border-none">Customer Name</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 border-none">Zodiac / Rashi</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 border-none">Scheduled Date</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 border-none">Session Status</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 pr-10 text-right border-none">Management</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredConsultations.map((con) => (
              <TableRow key={con.id} className="group border-b border-white/5 hover:bg-white/[0.02] transition-colors h-24">
                <TableCell className="pl-10">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gold group-hover:scale-110 transition-transform">
                      <Users size={20} />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm font-bold text-white group-hover:text-gold transition-colors">{con.customer}</span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/30">{con.email}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2.5">
                    <div className="h-2 w-2 rounded-full bg-gold/40" />
                    <span className="text-xs font-bold text-white/70 italic">{con.zodiac}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3 text-white/50">
                    <Calendar size={14} className="text-gold/50" />
                    <span className="text-xs font-medium">{new Date(con.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className={cn(
                    "inline-flex items-center gap-2 px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all",
                    con.status === "Completed" 
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 group-hover:bg-emerald-500/20" 
                      : "bg-amber-500/10 text-amber-500 border-amber-500/20 group-hover:bg-amber-500/20"
                  )}>
                    {con.status === "Completed" ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                    {con.status}
                  </div>
                </TableCell>
                <TableCell className="pr-10 text-right">
                  <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl border border-white/5 bg-white/5 text-white/20 hover:text-gold hover:border-gold/30 hover:bg-gold/10 transition-all">
                    <MoreHorizontal size={20} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredConsultations.length === 0 && (
          <div className="py-32 text-center">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/10 mb-6">
              <Search size={32} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No Consultations Found</h3>
            <p className="text-sm text-white/30 italic">Adjust your search or add a new guidance session.</p>
          </div>
        )}
      </div>

      {/* ── FOOTER STATS ─────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: "Total Sessions", value: "1,284", icon: Users, color: "text-blue-400" },
          { label: "Pending Reviews", value: "14", icon: Clock, color: "text-amber-400" },
          { label: "Success Rate", value: "99.2%", icon: Sparkles, color: "text-emerald-400" },
        ].map((stat, i) => (
          <div key={i} className="p-8 rounded-[2rem] border border-white/5 bg-[#0f0f0f] shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform">
              <stat.icon size={80} />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-3">{stat.label}</p>
            <h4 className={cn("text-3xl font-black tracking-tighter leading-none", stat.color)}>{stat.value}</h4>
          </div>
        ))}
      </div>
    </div>
  );
}
