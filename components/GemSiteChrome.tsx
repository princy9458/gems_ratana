"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Search,
  ShoppingCart,
  Moon,
  Sun,
  Menu,
  X,
  ArrowUp,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  Phone,
  HelpCircle,
  User,
  Heart,
  Sparkles,
  Gem,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Link, useLocation, useNavigate } from "@/lib/router";
import { useAppSelector } from "@/lib/store/hooks";
import { selectCartCount } from "@/lib/store/cart/cartSlice";
import { products } from "@/data/products";

const PRIMARY_NAV = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Contact", href: "/contact" },
  { label: "FAQ", href: "/faq" },
];

const GEM_CATEGORIES = [
  { label: "Ruby", href: "/shop" },
  { label: "Emerald", href: "/shop" },
  { label: "Sapphire", href: "/shop" },
  { label: "Pearl", href: "/shop" },
  { label: "Yellow Sapphire", href: "/shop" },
];

function SearchOverlay({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    } else {
      setQuery("");
    }
  }, [isOpen]);

  const filteredProducts =
    query.trim().length > 1
      ? products.filter((product) => {
          const title = product.title ?? "";
          const category = product.category ?? "";
          return (
            title.toLowerCase().includes(query.toLowerCase()) ||
            category.toLowerCase().includes(query.toLowerCase())
          );
        })
      : [];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[3000] bg-background/95 px-4 pt-24 backdrop-blur-xl sm:px-[5%] sm:pt-32"
        >
          <button
            onClick={onClose}
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-border transition-all hover:bg-surface sm:right-10 sm:top-10"
          >
            <X size={22} />
          </button>

          <div className="mx-auto w-full max-w-3xl">
            <div className="relative mb-8 sm:mb-12">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted sm:left-6"
                size={22}
              />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search gemstones, cuts & more..."
                className="h-16 w-full rounded-[24px] border border-border bg-surface pl-12 pr-4 text-lg font-bold outline-none transition-all placeholder:text-muted/30 focus:border-secondary sm:h-20 sm:pl-16 sm:pr-8 sm:text-2xl"
              />
            </div>

            {filteredProducts.length > 0 && (
              <div className="max-h-[45vh] overflow-auto rounded-3xl border border-border bg-surface p-3 shadow-2xl">
                {filteredProducts.slice(0, 8).map((product) => (
                  <button
                    key={product.id}
                    onClick={() => {
                      navigate(`/product/${product.id}`);
                      onClose();
                    }}
                    className="flex w-full items-center gap-4 rounded-2xl px-4 py-3 text-left transition-colors hover:bg-background"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/10 text-secondary">
                      <Gem size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-foreground">
                        {product.title}
                      </p>
                      <p className="text-sm text-muted">
                        {product.category}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border bg-surface px-[5%] pb-10 pt-20">
      <div className="mb-16 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-6">
          <Link href="/" className="block">
            <img
              src="/assets/Image/favicon.svg"
              alt="GemsRatna"
              className="h-16 w-auto"
            />
          </Link>

          <p className="max-w-[320px] font-semibold text-muted">
            Premium natural gemstones, trusted consultation, and carefully
            curated ratna collections for your journey.
          </p>

          <div className="flex gap-4">
            {[
              { name: "Instagram", icon: Instagram, url: "#" },
              { name: "Facebook", icon: Facebook, url: "#" },
              { name: "Twitter", icon: Twitter, url: "#" },
              { name: "Youtube", icon: Youtube, url: "#" },
            ].map((social) => (
              <a
                key={social.name}
                href={social.url}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border transition-all hover:border-secondary hover:text-secondary"
              >
                <span className="sr-only">{social.name}</span>
                <social.icon size={18} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="mb-6 text-[11px] font-black uppercase tracking-[2px] text-foreground">
            Explore
          </h4>
          <ul className="space-y-4">
            {[
              { name: "Shop Gems", href: "/shop" },
              { name: "About GemsRatna", href: "/about" },
              { name: "Consultation", href: "/contact" },
              { name: "FAQ", href: "/faq" },
            ].map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className="font-bold text-muted transition-colors hover:text-secondary"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-6 text-[11px] font-black uppercase tracking-[2px] text-foreground">
            Services
          </h4>
          <ul className="space-y-4">
            {[
              { name: "Gem Recommendation", href: "/contact" },
              { name: "Custom Orders", href: "/contact" },
              { name: "Certification Help", href: "/faq" },
              { name: "Gift Orders", href: "/contact" },
            ].map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className="font-bold text-muted transition-colors hover:text-secondary"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-6 text-[11px] font-black uppercase tracking-[2px] text-foreground">
            Support
          </h4>
          <ul className="space-y-4">
            {[
              { name: "Shipping & Delivery", href: "/faq" },
              { name: "Authenticity", href: "/faq" },
              { name: "Gemstone Care", href: "/faq" },
              { name: "Contact", href: "/contact" },
            ].map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className="font-bold text-muted transition-colors hover:text-secondary"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="huge-watermark">gemsratna</div>

      <div className="md:flex flex-col items-center justify-between gap-6 border-t border-border pt-4 text-center md:flex-row">
        <p className="py-2 text-[14px] font-medium transition-colors text-[#0b1610]">
          © 2026 GemsRatna. All rights reserved.
        </p>
        <div className="flex items-center justify-center gap-8">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="group inline-flex items-center text-[14px] font-medium transition-colors text-[#0b1610] hover:text-[#98c45f]"
          >
            Back to Top <ArrowUp size={14} className="ml-1" />
          </button>
          <div className="hidden gap-8 md:flex">
            <a
              href="/faq"
              className="text-[14px] font-medium transition-colors text-[#0b1610] hover:text-[#98c45f]"
            >
              Terms
            </a>
            <a
              href="/faq"
              className="text-[14px] font-medium transition-colors text-[#0b1610] hover:text-[#98c45f]"
            >
              Privacy
            </a>
            <a
              href="/faq"
              className="text-[14px] font-medium transition-colors text-[#0b1610] hover:text-[#98c45f]"
            >
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function Header({
  theme,
  toggleTheme,
  onSearchOpen,
}: {
  theme: string;
  toggleTheme: () => void;
  onSearchOpen: () => void;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const cartCount = useAppSelector(selectCartCount);
  const { pathname } = useLocation();

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-[1100] w-full border-b border-border bg-background/95 backdrop-blur-xl">
        <div className="hidden items-center justify-between border-b border-border px-4 py-2 text-[12px] text-muted lg:flex">
          <div className="flex items-center gap-6 font-medium">
            <Link href="/" className="hover:text-secondary transition-colors">
              Home
            </Link>
            <Link href="/shop" className="hover:text-secondary transition-colors">
              Shop
            </Link>
            <Link href="/about" className="hover:text-secondary transition-colors">
              About
            </Link>
            <Link
              href="/contact"
              className="hover:text-secondary transition-colors"
            >
              Contact
            </Link>
          </div>

          <div className="flex items-center gap-3 font-medium">
            <a
              href="tel:+919810159604"
              className="flex items-center gap-1.5 hover:text-secondary transition-colors"
            >
              <Phone size={13} /> +91 98101 59604
            </a>
            <div className="h-3.5 w-px bg-border/80" />
            <Link
              href="/contact"
              className="flex items-center gap-1.5 hover:text-secondary transition-colors"
            >
              <HelpCircle size={13} /> Book Consultation
            </Link>
            <div className="h-3.5 w-px bg-border/80" />
            <Link
              href="/faq"
              className="flex items-center gap-1.5 hover:text-secondary transition-colors"
            >
              <HelpCircle size={13} /> Gem Guide
            </Link>
            <Link
              href="/admin"
              className="flex items-center gap-1.5 rounded-md bg-secondary/10 px-2 py-1 font-medium text-secondary transition-all hover:bg-secondary/20"
            >
              <User size={14} /> Admin
            </Link>
          </div>
        </div>

        <div className="flex items-center justify-between px-4 py-4 sm:px-[5%] xl:px-[8%]">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 -ml-2 text-foreground lg:hidden"
          >
            <Menu size={24} />
          </button>

          <Link href="/" className="block shrink-0 py-1">
            <img
              src="/assets/Image/favicon.svg"
              alt="GemsRatna"
              className="h-14 w-auto object-contain sm:h-18"
            />
          </Link>

          <div
            className="relative hidden max-w-2xl flex-1 cursor-text items-center rounded-sm border border-border bg-surface px-4 text-muted transition-colors hover:border-secondary lg:mx-12 lg:flex"
            onClick={onSearchOpen}
          >
            <span className="text-[14px]">Search gemstones, cuts & more...</span>
            <Search size={20} className="absolute right-4 text-muted" />
          </div>

          <div className="flex shrink-0 items-center gap-4 sm:gap-8">
            <button
              onClick={toggleTheme}
              className="hidden flex-col items-center gap-1 text-muted transition-colors hover:text-secondary sm:flex"
            >
              {theme === "dark" ? <Sun size={22} /> : <Moon size={22} />}
              <span className="hidden text-[11px] font-medium lg:block">
                Theme
              </span>
            </button>
            <Link
              href="/about"
              className="hidden flex-col items-center gap-1 text-muted transition-colors hover:text-secondary lg:flex"
            >
              <Sparkles size={22} />
              <span className="text-[11px] font-medium">Our Story</span>
            </Link>
            <Link
              href="/contact"
              className="hidden flex-col items-center gap-1 text-muted transition-colors hover:text-secondary sm:flex"
            >
              <User size={22} />
              <span className="text-[11px] font-medium">Profile</span>
            </Link>
            <Link
              href="/contact"
              className="hidden flex-col items-center gap-1 text-muted transition-colors hover:text-secondary sm:flex"
            >
              <Heart size={22} />
              <span className="text-[11px] font-medium">Wishlist</span>
            </Link>
            <Link
              href="/cart"
              className="flex flex-col items-center gap-1 text-muted transition-colors hover:text-secondary"
            >
              <div className="relative">
                <ShoppingCart size={22} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-2 flex h-[16px] w-[16px] items-center justify-center rounded-full bg-secondary text-[9px] font-bold text-white">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden text-[11px] font-medium lg:block">
                Cart ({cartCount})
              </span>
            </Link>
          </div>
        </div>

        <div className="hidden border-t border-border bg-background lg:block">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-2 px-4 py-3">
            {PRIMARY_NAV.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  pathname === item.href
                    ? "bg-secondary/10 text-secondary"
                    : "text-foreground hover:bg-surface hover:text-secondary"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="border-t border-border bg-background lg:hidden">
          <div className="flex gap-2 overflow-x-auto px-4 py-3">
            {GEM_CATEGORIES.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="whitespace-nowrap rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-secondary hover:text-secondary"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </header>

      {scrolled && <div className="hidden h-[53px] w-full lg:block" />}

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[2000] bg-black/50 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed left-0 top-0 z-[2001] h-full w-[min(85vw,350px)] overflow-y-auto bg-background px-5 py-6 shadow-2xl lg:hidden"
            >
              <div className="mb-6 flex items-center justify-between">
                <img
                  src="/assets/Image/favicon.svg"
                  alt="GemsRatna"
                  className="h-10 w-auto"
                />
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 text-muted"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="space-y-3">
                {PRIMARY_NAV.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`block rounded-2xl border border-border px-4 py-3 text-lg font-semibold transition-colors ${
                      pathname === item.href
                        ? "bg-secondary/10 text-secondary"
                        : "text-foreground"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default function GemSiteChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setTheme] = useState("light");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const nextTheme = "light";
    setTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
    localStorage.setItem("theme", nextTheme);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsSearchOpen(false);
  }, [pathname]);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
    localStorage.setItem("theme", nextTheme);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header
        theme={theme}
        toggleTheme={toggleTheme}
        onSearchOpen={() => setIsSearchOpen(true)}
      />
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <main className="w-full flex-1">{children}</main>
      <Footer />
    </div>
  );
}
