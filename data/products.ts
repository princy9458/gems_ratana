export interface Product {
  id: number | any;
  title: string;
  price: string;
  category: string;
  rating: number;
  reviews: number;
  badge: string;
  description: string;
  img: string;
  specs?: { label: string; value: string }[];
}

export const products: Product[] = [
  {
    id: "natural-blue-sapphire",
    title: "Natural Blue Sapphire (Neelam)",
    price: "₹45,000",
    category: "Precious Stones",
    rating: 5.0,
    reviews: 124,
    badge: "Bestseller",
    description: "Experience the swift, karmic power of a certified natural Blue Sapphire. Hand-selected for exceptional clarity and vivid hue, specifically aligned for Saturn energy.",
    img: "/assets/images/sapphire_neelam.png",
    specs: [
      { label: "Carat Weight", value: "4.50 Cts" },
      { label: "Origin", value: "Sri Lanka (Ceylon)" },
      { label: "Certification", value: "GTL/GIA Certified" },
    ],
  },
  {
    id: 2,
    title: "Burmese Ruby Ring (Manik)",
    price: "₹1,20,000",
    category: "Astrological Rings",
    rating: 4.9,
    reviews: 86,
    badge: "Vault",
    description: "A cosmic masterpiece. This untreated Burmese Ruby empowers the wearer with divine Sun energy, invoking confidence, leadership, and vitality.",
    img: "/assets/images/ruby_manik.png",
    specs: [
      { label: "Carat Weight", value: "2.10 Cts" },
      { label: "Material", value: "18K Gold Setting" },
      { label: "Origin", value: "Myanmar (Burma)" },
    ],
  },
  {
    id: 3,
    title: "Zambian Emerald (Panna)",
    price: "₹32,000",
    category: "Precious Stones",
    rating: 4.8,
    reviews: 52,
    badge: "Classic",
    description: "Vibrant lush green Emerald from Zambia. Known for activating Mercury, enhancing intelligence, communication, and business acumen.",
    img: "/assets/images/emerald_panna.png",
    specs: [
      { label: "Carat Weight", value: "3.25 Cts" },
      { label: "Treatment", value: "Unheated/Untreated" },
    ]
  },
  {
    id: 4,
    title: "Yellow Sapphire (Pukhraj)",
    price: "₹55,000",
    category: "Precious Stones",
    rating: 5.0,
    reviews: 45,
    badge: "Top Rated",
    description: "Illuminate your fate with the Yellow Sapphire. Its bright, warm glow corresponds to Jupiter, bringing wealth, prosperity, and divine grace.",
    img: "/assets/images/yellow_sapphire.png",
    specs: [
      { label: "Clarity", value: "VVS" },
      { label: "Origin", value: "Sri Lanka" },
    ]
  },
  {
    id: 5,
    title: "South Sea Pearl (Moti)",
    price: "₹12,500",
    category: "Organic Gems",
    rating: 4.7,
    reviews: 210,
    badge: "Limited",
    description: "A perfectly round, lustrous South Sea Pearl. Ideal for stabilizing lunar energies and bringing peace and emotional balance.",
    img: "/assets/images/pearl_moti.png",
    specs: [
      { label: "Size", value: "11mm" },
      { label: "Shape", value: "Perfectly Round" },
    ]
  },
  {
    id: 6,
    title: "Hessonite Garnet (Gomed)",
    price: "₹18,000",
    category: "Semi-Precious Stones",
    rating: 4.9,
    reviews: 38,
    badge: "Essential",
    description: "Celebrate the raw, grounding power of Hessonite. Perfectly suited to balance the shadow planet Rahu.",
    img: "https://images.unsplash.com/photo-1615800098779-1be8b7b25e79?auto=format&fit=crop&q=80&w=1400", 
  },
  {
    id: 7,
    title: "Red Coral Pendant (Moonga)",
    price: "₹25,000",
    category: "Pendants",
    rating: 4.9,
    reviews: 42,
    badge: "Premium",
    description: "Transform your courage with our Mediterranean Red Coral properly aligned in an astrological silver setting for Mars.",
    img: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=1200", 
  },
  {
    id: 8,
    title: "Amethyst Crystal Cluster",
    price: "₹8,000",
    category: "Healing Crystals",
    rating: 4.4,
    reviews: 28,
    badge: "Essential",
    description: "A raw, powerful Amethyst geode cluster perfect for spiritual cleansing and meditation altars.",
    img: "https://images.unsplash.com/photo-1567360425618-1594206637d2?auto=format&fit=crop&q=80&w=1200",
  },
];

export interface Category {
  id: string;
  name: string;
  description: string;
  img: string;
}

export const categories: Category[] = [
  {
    id: "precious-stones",
    name: "Precious Stones",
    description: "The primary Navratnas. High-impact karmic gemstones strictly graded for astrological use.",
    img: "/assets/images/ruby_manik.png",
  },
  {
    id: "semi-precious-stones",
    name: "Semi-Precious Stones",
    description: "Powerful secondary stones (Uparatnas) serving as highly effective cosmic alternatives.",
    img: "https://images.unsplash.com/photo-1615800098779-1be8b7b25e79?auto=format&fit=crop&q=80&w=2000",
  },
  {
    id: "astrological-rings",
    name: "Astrological Rings",
    description: "Bespoke rings crafted with specific skin-touch settings in precious metals.",
    img: "https://images.unsplash.com/photo-1599643478514-4a5202300408?auto=format&fit=crop&q=80&w=2000",
  },
  {
    id: "pendants",
    name: "Pendants",
    description: "Elegant, spiritual pendants designed to keep cosmic energy close to the heart.",
    img: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=2000",
  },
  {
    id: "healing-crystals",
    name: "Healing Crystals",
    description: "Raw geodes, clusters, and tumbled stones for holistic aura cleansing.",
    img: "https://images.unsplash.com/photo-1567360425618-1594206637d2?auto=format&fit=crop&q=80&w=2000",
  },
  {
    id: "organic-gems",
    name: "Organic Gems",
    description: "Pearls and Corals naturally formed in the depths of the ocean.",
    img: "/assets/images/pearl_moti.png",
  },
];
