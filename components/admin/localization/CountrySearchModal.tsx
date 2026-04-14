"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Globe, Loader2, Check, Plus } from "lucide-react";
import { mappedLanguages } from "./mappedLanguageCode";

interface CountrySearchModalProps {
  onSelect: (data: { languages: any[]; currencies: any[]; countryName: string }) => void;
  trigger?: React.ReactNode;
}

export const CountrySearchModal = ({ onSelect, trigger }: CountrySearchModalProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!search.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(() => {
      handleSearch();
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await fetch(`https://restcountries.com/v3.1/name/${search}`);
      if (!resp.ok) throw new Error("Cosmic coordinate not found");
      const data = await resp.json();
      setResults(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setResults([]);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (country: any) => {
    const languages = country.languages
      ? Object.entries(country.languages).map(([code, name]) => {
          const mappedCode = mappedLanguages[code.toLowerCase()] || code;
          return {
            code: mappedCode,
            name: name as string,
            enabled: true,
          };
        })
      : [];

    const currencies = country.currencies
      ? Object.entries(country.currencies).map(([code, info]: [string, any]) => ({
          code,
          name: info.name,
          symbol: info.symbol || code,
          enabled: true
        }))
      : [];

    onSelect({
      languages,
      currencies,
      countryName: country.name.common
    });
    setOpen(false);
    setSearch("");
    setResults([]);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-[#cc9900] hover:bg-[#b08400] text-black font-extrabold flex items-center gap-2 uppercase tracking-widest text-[10px] rounded-2xl shadow-xl shadow-gold/20">
            <Plus className="w-4 h-4" /> ADD ASTROLOGIC REGION
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-[#0a0a0a] border-white/10 text-white p-0 overflow-hidden shadow-2xl rounded-3xl">
        <div className="p-6 bg-[#111] border-b border-white/5">
          <DialogHeader>
            <DialogTitle className="text-xl font-black uppercase tracking-[0.2em] text-amber-500 flex items-center gap-3">
              <Globe className="w-6 h-6 text-amber-500" />
              Global <span className="text-white">Regions</span>
            </DialogTitle>
            <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest mt-1">Discover geographical nodes for shipping</p>
          </DialogHeader>
          <div className="mt-6 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <Input
              placeholder="LOCATE BY COUNTRY NAME (E.G. PERU, JAPAN)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 py-6 bg-black/40 border-white/10 text-xs font-bold tracking-widest focus:border-amber-500/50 rounded-2xl uppercase transition-all outline-none"
            />
          </div>
        </div>

        <div className="max-h-[350px] overflow-y-auto p-3 space-y-1">
          {loading && (
            <div className="flex items-center justify-center p-12 gap-3 text-white/30">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Aligning Planetary Data...</span>
            </div>
          )}

          {!loading && results.map((country: any) => (
            <button
              key={country.cca3}
              onClick={() => handleSelect(country)}
              className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 transition-colors group text-left border border-transparent hover:border-amber-500/30"
            >
              <div className="flex items-center gap-5">
                <span className="text-3xl drop-shadow-lg">{country.flag}</span>
                <div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">{country.name.common}</h4>
                  <p className="text-[9px] text-amber-500/70 font-black uppercase tracking-[0.2em] mt-1">
                    {country.region} • {country.subregion}
                  </p>
                </div>
              </div>
              <Check className="w-5 h-5 text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          ))}

          {!loading && search && results.length === 0 && !error && (
             <div className="p-12 text-center text-white/30">
                <Globe className="w-10 h-10 mx-auto mb-4 opacity-20" />
                <p className="text-[10px] font-black uppercase tracking-widest">No Cosmic Coordinates Found for "{search}"</p>
             </div>
          )}

          {error && (
            <div className="p-8 text-center text-rose-500/80">
              <p className="text-[10px] font-black uppercase tracking-widest text-center mx-auto bg-rose-500/10 w-fit px-4 py-2 rounded-xl">Aura Disruption: {error}</p>
            </div>
          )}
        </div>

        <div className="p-5 bg-[#111] border-t border-white/5 flex justify-center">
            <p className="text-[9px] text-white/20 font-bold uppercase tracking-widest">
                Source: Universal Geospatial Matrix
            </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
