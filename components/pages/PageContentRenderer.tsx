"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Page, PageBlock } from "@/lib/store/pages/pageType";
import { normalizeHero } from "@/lib/store/pages/pageHelpers";
import { 
  Sparkles, 
  ChevronRight, 
  Star, 
  CheckCircle2, 
  Gem, 
  Truck, 
  ShieldCheck, 
  Headphones,
  ArrowRight,
  Menu,
  Search,
  ShoppingBag,
  Lock,
  Zap,
  Heart,
  ChevronLeft
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function PageContentRenderer({ page }: { page: Page }) {
  useEffect(() => {
    console.log("Frontend Data:", page);
  }, [page]);

  const hasRenderableSections = Array.isArray(page.sections) && page.sections.length > 0;
  const hasHeroSection = Array.isArray(page.sections)
    ? page.sections.some((section) => section.type === "hero")
    : false;

  return (
    <main className="min-h-screen bg-[#f8f5ef] text-[#0a0a0a]">
      {!hasHeroSection && page.hero ? <HeroSection content={page.hero} /> : null}
      {hasRenderableSections ? (
        page.sections
          .filter((s) => s.enabled)
          .map((section) => <SectionRenderer key={section.id} section={section} />)
      ) : null}
    </main>
  );
}

const SectionRenderer = ({ section }: { section: PageBlock }) => {
  const { type, content } = section;

  switch (type) {
    case "navbar":
      return <NavbarSection content={content} />;
    case "hero":
      return <HeroSection content={content} />;
    case "trustbar":
      return <TrustBarSection content={content} />;
    case "collections":
      return <CollectionsSection content={content} />;
    case "why":
      return <WhySection content={content} />;
    case "products":
      return <ProductsSection content={content} />;
    case "features":
      return <FeaturesSection content={content} />;
    case "footer":
      return <FooterSection content={content} />;
    case "cta":
      return <CTASection content={content} />;
    case "testimonials":
      return <TestimonialsSection content={content} />;
    case "faq":
      return <FAQSection content={content} />;
    case "blog":
      return <BlogSection content={content} />;
    case "usp":
      return <USPSection content={content} />;
    default:
      return null;
  }
};

/* --- Section Components --- */

const NavbarSection = ({ content }: { content: any }) => (
  <header className="fixed top-0 inset-x-0 z-[100] transition-all duration-500 bg-white/70 backdrop-blur-md border-b border-black/5">
    <div className="mx-auto max-w-7xl px-6 lg:px-10 h-20 flex items-center justify-between">
      <div className="flex items-center gap-2">
        {content.logoImage ? (
          <img src={content.logoImage} className="h-8 w-auto invert" alt="Logo" />
        ) : (
          <div className="flex items-center gap-3">
             <div className="h-2 w-2 rounded-full bg-[#101828] animate-pulse" />
             <span className="text-xl font-black tracking-tighter text-[#101828] uppercase italic">{content.logo || 'GEMS_RATNA'}</span>
          </div>
        )}
      </div>

      <nav className="hidden lg:flex items-center gap-10">
        {(content.links || []).map((link: any) => (
          <Link 
            key={link.id} 
            href={link.href} 
            className="text-[10px] font-black uppercase tracking-[0.25em] text-[#101828]/60 hover:text-[#101828] transition-colors"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-6">
        <button className="text-[#101828]/60 hover:text-[#101828] transition-colors"><Search size={20} /></button>
        <button className="text-[#101828]/60 hover:text-[#101828] transition-colors relative">
          <ShoppingBag size={20} />
          <span className="absolute -top-1 -right-1 h-3.5 w-3.5 bg-amber-400 rounded-full text-[8px] font-black text-black flex items-center justify-center">0</span>
        </button>
      </div>
    </div>
  </header>
);

const HeroSection = ({ content }: { content: any }) => {
  const [current, setCurrent] = useState(0);
  const hero = normalizeHero(content);
  const mediaSlides = Array.isArray(hero.mediaItems) && hero.mediaItems.length > 0
    ? hero.mediaItems.filter((item: any) => item?.isActive !== false)
    : [];
  const slides = mediaSlides.length > 0 ? mediaSlides : (hero.images || []).map((url: string, index: number) => ({
    _id: `${url}-${index}`,
    url,
    type: "image",
    isActive: true,
    order: index,
  }));
  const shouldAutoplay = hero.autoPlay !== false && slides.length > 1;

  useEffect(() => {
    console.log("HERO DATA:", hero);
  }, [hero]);

  useEffect(() => {
    if (shouldAutoplay) {
      const timer = setInterval(() => {
        setCurrent(prev => (prev + 1) % slides.length);
      }, 5000);
      return () => clearInterval(timer);
    }
    setCurrent(0);
  }, [slides.length, shouldAutoplay]);

  if (slides.length === 0) return null;

  return (
    <section className="relative w-full min-h-screen flex items-center justify-start bg-[#f8f5ef] text-[#0a0a0a] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={`${slides[current] || "hero"}-${current}`}
          initial={{ opacity: 0, scale: 1.03 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          {slides[current] ? (
            slides[current].type === "video" ? (
              <video
                src={slides[current].url}
                className="absolute inset-0 w-full h-full object-cover opacity-70"
                autoPlay
                loop
                muted
                playsInline
              />
            ) : (
              <img
                src={slides[current].url}
                alt="hero"
                className="absolute inset-0 w-full h-full object-cover opacity-70"
              />
            )
          ) : (
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(212,175,55,0.16),_transparent_40%),linear-gradient(180deg,_#f8f5ef_0%,_#ede5d7_100%)]" />
          )}
          <div className="absolute inset-0 bg-white/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#f8f5ef]/90 via-[#f8f5ef]/55 to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 max-w-5xl px-10 lg:px-16 pt-24 lg:pt-0">
        <p className="uppercase tracking-[0.45em] text-sm mb-4 text-neutral-500">
          {hero.eyebrow || "Unlock the Power of Gemstones"}
        </p>
        <h1 className="font-serif text-6xl leading-[0.9] md:text-8xl lg:text-[7.5rem] tracking-tight text-[#101828] max-w-4xl break-words hyphens-auto">
          {hero.title || "Default Title"}
        </h1>
        <p className="mt-6 text-lg md:text-2xl text-neutral-600 max-w-xl leading-relaxed">
          {hero.subtitle}
        </p>
        {hero.buttonText && (
          <Link
            href={hero.buttonLink || "#"}
            className="inline-block mt-8 px-8 py-3 bg-[#d4af37] text-black font-medium rounded-full hover:bg-[#c9a32f] transition shadow-lg shadow-[#d4af37]/20"
          >
            {hero.buttonText}
          </Link>
        )}

        {slides.length > 1 && (
          <div className="mt-12 flex items-center gap-4">
            {slides.map((_: string, idx: number) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                className={`h-1 rounded-full transition-all ${
                  idx === current ? "w-12 bg-[#101828]" : "w-6 bg-[#101828]/20"
                }`}
                aria-label={`Go to hero slide ${idx + 1}`}
              />
            ))}
            <span className="ml-4 text-xs uppercase tracking-[0.35em] text-neutral-500">
              0{current + 1} / 0{slides.length}
            </span>
          </div>
        )}
      </div>
    </section>
  );
};

const TrustBarSection = ({ content }: { content: any }) => {
  const ICON_MAP: any = {
    Star: Star,
    ShieldCheck: ShieldCheck,
    Truck: Truck,
    Lock: Lock
  };

  return (
  <section className="bg-[#fcfbf8] py-6 border-b border-neutral-100">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {(content.items || []).map((item: any) => {
            const IconComp = ICON_MAP[item.icon] || Star;
            return (
              <div key={item.id} className="flex items-center justify-center lg:justify-start gap-3">
                <IconComp size={16} className="text-neutral-300" />
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-black italic">
                  {item.text}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const CollectionsSection = ({ content }: { content: any }) => (
  <section className="py-32 bg-[#f8f5ef]">
    <div className="mx-auto max-w-7xl px-6 lg:px-10">
      <div className="text-center mb-24">
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="h-px w-10 bg-neutral-200" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-400">
            {content.subtitle}
          </span>
          <div className="h-px w-10 bg-neutral-200" />
        </div>
        <h2 className="text-5xl md:text-8xl font-bold text-[#0a0a0a] italic tracking-tighter leading-tight">
          {content.title}
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {(content.items || []).map((item: any, i: number) => (
          <Link
            key={item.id || i}
            href={item.link || "#"}
            className="group cursor-pointer block"
          >
            <div className="aspect-[3/4] bg-neutral-200 rounded-[2.5rem] overflow-hidden mb-8 border border-neutral-100 relative shadow-sm group-hover:shadow-2xl group-hover:-translate-y-2 transition-all duration-700">
              {item.image ? (
                <img
                  src={item.image}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                  alt={item.name || item.title || `Collection ${i + 1}`}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center opacity-10 bg-neutral-300">
                  <Gem size={80} />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                <span className="text-[10px] font-black uppercase tracking-widest text-white flex items-center gap-2">
                  View Ritual <ArrowRight size={14} />
                </span>
              </div>
              <div className="absolute bottom-6 left-6 text-white text-xl font-bold tracking-tight">
                {item.name || item.title}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  </section>
);

const WhySection = ({ content }: { content: any }) => (
  <section className="py-32 bg-[#fcfbf8]">
    <div className="mx-auto max-w-7xl px-6 lg:px-10">
      <div className="text-center mb-24">
        <h2 className="text-5xl md:text-8xl font-bold text-[#0a0a0a] italic tracking-tighter leading-tight">
          {content.title}
        </h2>
      </div>

      <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-4">
        {(content.points || []).map((item: any) => (
          <div key={item.id} className="text-center px-4">
            <h3 className="text-2xl font-bold text-[#111827] mb-4">
              {item.title}
            </h3>
            <p className="text-neutral-500 italic leading-relaxed">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const ProductsSection = ({ content }: { content: any }) => (
  <section className="py-32 bg-[#f8f5ef]">
    <div className="mx-auto max-w-7xl px-6 lg:px-10">
      <div className="text-center mb-20">
        <h2 className="text-5xl md:text-8xl font-bold text-[#0a0a0a] italic tracking-tighter leading-tight">
          {content.title}
        </h2>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8">
        {(content.items || []).map((item: any) => (
          <div key={item.id} className="group">
            <div className="relative overflow-hidden rounded-[2.5rem] aspect-[4/5] mb-6">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              {item.tag && (
                <span className="absolute top-4 left-4 rounded-full bg-white px-4 py-2 text-[10px] font-black tracking-[0.3em] text-[#111827]">
                  {item.tag}
                </span>
              )}
            </div>
            <h3 className="text-3xl font-bold text-[#111827] mb-2">
              {item.name}
            </h3>
            <p className="text-neutral-400 font-semibold">{item.price}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const FeaturesSection = ({ content }: { content: any }) => {
  const ICON_MAP: any = {
    Zap,
    ShieldCheck,
    Award: Gem,
    Heart,
    Truck,
    Lock,
  };

  return (
    <section className="py-32 bg-[#05081a] text-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="text-center mb-24">
          <h2 className="text-5xl md:text-8xl font-bold italic tracking-tighter">
            {content.title}
          </h2>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-10">
          {(content.items || []).map((item: any) => {
            const IconComp = ICON_MAP[item.icon] || Sparkles;
            return (
              <div key={item.id} className="text-center">
                <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full border border-white/10 bg-white/5">
                  <IconComp size={36} />
                </div>
                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                <p className="text-white/55 leading-relaxed">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const TestimonialsSection = ({ content }: { content: any }) => (
  <section className="py-32 bg-[#faf8f5]">
    <div className="mx-auto max-w-7xl px-6 lg:px-10">
      <div className="text-center mb-24">
        <h2 className="text-5xl md:text-8xl font-bold italic tracking-tighter text-[#0a0a0a]">
          {content.title}
        </h2>
      </div>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
        {(content.items || []).map((item: any) => {
          const message = item.message || item.content || "";
          return (
            <div key={item.id} className="bg-white border border-neutral-100 p-12 rounded-[3rem] shadow-sm">
              <div className="flex items-center gap-4 mb-8">
                <img
                  src={item.image || item.avatar || "https://i.pravatar.cc/150?u=guest"}
                  alt={item.name}
                  className="h-14 w-14 rounded-full object-cover"
                />
                <h4 className="font-bold text-[#0a0a0a] text-xl">{item.name}</h4>
              </div>
              <p className="text-xl text-neutral-700 leading-relaxed italic">
                {message}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  </section>
);

const CTASection = ({ content }: { content: any }) => {
  const isAccent = content.theme === "accent";
  return (
    <section className="py-20 px-6 bg-[#faf8f5]">
      <div
        className={`mx-auto max-w-6xl rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden ${
          isAccent
            ? "bg-[#111827] text-white shadow-2xl"
            : "bg-white border border-neutral-100 text-black shadow-lg"
        }`}
      >
        {content.backgroundImage && (
          <div className="absolute inset-0 opacity-10">
            <img
              src={content.backgroundImage}
              className="w-full h-full object-cover"
              alt=""
            />
          </div>
        )}
        <div className="relative z-10 max-w-3xl mx-auto">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40 mb-6 block">
            {content.subtitle}
          </span>
          <h2 className="text-4xl md:text-7xl font-bold mb-10 italic tracking-tight leading-[1.1]">
            {content.title}
          </h2>
          <Link
            href={content.buttonLink || "#"}
            className={`px-14 py-6 rounded-full font-black uppercase tracking-widest text-xs transition-all shadow-2xl ${
              isAccent
                ? "bg-amber-400 text-black hover:bg-amber-300 hover:scale-105"
                : "bg-[#101828] text-white hover:bg-neutral-900 group"
            }`}
          >
            <div className="flex items-center gap-3">
              {content.buttonText}
              <ArrowRight
                size={16}
                className={isAccent ? "" : "group-hover:translate-x-2 transition-transform"}
              />
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};

const FooterSection = ({ content }: { content: any }) => (
  <footer className="bg-[#030816] text-white py-24">
    <div className="mx-auto max-w-7xl px-6 lg:px-10">
      <div className="grid gap-12 xl:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div>
          <h3 className="text-4xl font-bold mb-6 italic">
            {content.brandName || "Gems_Ratna"}
          </h3>
          <p className="max-w-xl text-white/60 leading-relaxed italic text-lg">
            {content.brandText}
          </p>
        </div>
        <div>
          <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/50 mb-6">
            Links
          </h4>
          <div className="space-y-4">
            {(content.links || []).map((link: any) => (
              <Link key={link.id} href={link.href} className="block text-white/70 hover:text-white transition-colors">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/50 mb-6">
            Contact
          </h4>
          <div className="space-y-3 text-white/70">
            {content.contact?.phone && <p>{content.contact.phone}</p>}
            {content.contact?.email && <p>{content.contact.email}</p>}
            {content.contact?.address && <p>{content.contact.address}</p>}
          </div>
        </div>
      </div>
    </div>
  </footer>
);

const FAQSection = ({ content }: { content: any }) => (
  <section className="py-32 bg-[#fcfbf8]">
    <div className="mx-auto max-w-4xl px-6 lg:px-10">
       <div className="text-center mb-20">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-400 block mb-4">Gnosis & Understanding</span>
          <h2 className="text-5xl font-bold italic tracking-tighter text-[#0a0a0a]">{content.title}</h2>
       </div>

       <div className="space-y-6">
          {(content.items || []).map((item: any) => (
            <div key={item.id} className="border-b border-neutral-100 pb-8 hover:px-4 transition-all duration-500 cursor-pointer group">
               <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-neutral-800 group-hover:text-amber-600 transition-colors uppercase tracking-tight">{item.question}</h3>
                  <div className="h-10 w-10 rounded-full border border-neutral-100 flex items-center justify-center group-hover:bg-[#0a0a0a] group-hover:text-white transition-all"><ArrowRight size={18} className="group-hover:rotate-45" /></div>
               </div>
               <p className="mt-4 text-neutral-500 leading-relaxed text-sm max-w-2xl">{item.answer}</p>
            </div>
          ))}
       </div>
    </div>
  </section>
);

const BlogSection = ({ content }: { content: any }) => (
  <section className="py-32 bg-[#f8f5ef]">
    <div className="mx-auto max-w-7xl px-6 lg:px-10">
       <div className="flex items-end justify-between mb-20">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-neutral-400 mb-4 block italic">The Ritual Journal</span>
            <h2 className="text-6xl font-black italic tracking-tighter text-[#0a0a0a]">{content.title}</h2>
          </div>
          <Link href="/blog" className="text-[10px] font-black uppercase tracking-widest text-[#0a0a0a] border-b border-[#0a0a0a] pb-1 hover:text-amber-600 hover:border-amber-600 transition-colors">Enter The Library</Link>
       </div>
       <div className={`grid gap-12 ${content.layout === 'list' ? 'grid-cols-1' : 'md:grid-cols-3'}`}>
          {[1, 2, 3].slice(0, content.maxPosts).map(i => (
            <div key={i} className={`group ${content.layout === 'list' ? 'flex gap-12 items-center' : ''}`}>
               <div className={`rounded-[3rem] overflow-hidden bg-neutral-200 border border-neutral-100 aspect-[4/5] mb-8 group-hover:shadow-2xl transition-all duration-700 ${content.layout === 'list' ? 'w-1/3 mb-0' : 'w-full'}`}>
                 <div className="w-full h-full flex items-center justify-center opacity-10 bg-neutral-300">
                   <Gem size={100} />
                 </div>
               </div>
               <div className={content.layout === 'list' ? 'flex-1' : ''}>
                 <span className="text-[9px] font-black uppercase tracking-[0.2em] text-amber-600 mb-4 block">Alchemical Insights • 12 MIN READ</span>
                 <h3 className="text-3xl font-black mb-6 group-hover:text-amber-600 transition-colors italic tracking-tighter leading-tight text-[#0a0a0a]">The Sacred Symmetry Of Natural Diamonds</h3>
                 <p className="text-neutral-500 text-sm line-clamp-2 leading-relaxed mb-10 italic">Explore the celestial patterns and ancient wisdom encoded within the most resilient element on earth...</p>
                 <Link href="#" className="inline-flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-[#0a0a0a] group-hover:text-amber-600 transition-colors underline decoration-1 underline-offset-8">Study The Ritual</Link>
               </div>
            </div>
          ))}
       </div>
    </div>
  </section>
);

const USPSection = ({ content }: { content: any }) => {
  const ICON_MAP: any = {
    Gem: Gem,
    Truck: Truck,
    Shield: ShieldCheck,
    Support: Headphones,
    Star: Star,
    Lock: Lock
  };

  return (
    <section className="py-32 bg-[#0a0a0a] text-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
         {content.title && <h2 className="text-5xl font-black italic tracking-tighter text-center mb-24">{content.title}</h2>}
         <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-16">
            {(content.items || []).map((item: any) => {
              const IconComp = ICON_MAP[item.icon] || Gem;
              return (
                <div key={item.id} className="text-center group">
                   <div className="w-24 h-24 mx-auto rounded-[2rem] bg-white/5 flex items-center justify-center mb-10 border border-white/5 group-hover:bg-amber-400 group-hover:text-black transition-all duration-700 transform group-hover:-rotate-12">
                      <IconComp size={40} />
                   </div>
                   <h3 className="text-2xl font-bold mb-6 italic tracking-tight uppercase">{item.title}</h3>
                   <p className="text-white/40 leading-relaxed text-sm max-w-xs mx-auto italic">{item.description}</p>
                </div>
              );
            })}
         </div>
      </div>
    </section>
  );
};
