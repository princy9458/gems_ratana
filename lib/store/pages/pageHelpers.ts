import { Page, PageStatus, PageSEO, PageBlock, SectionType } from "./pageType";

export const DEFAULT_SEO: PageSEO = {
  metaTitle: "",
  metaDescription: "",
  keywords: "",
  ogImage: "",
};

export const DEFAULT_HERO = {
  title: "Wear Your Destiny",
  subtitle: "Authentic Ratna for Wealth, Health & Success",
  eyebrow: "Unlock The Power Of Gemstones",
  images: [],
  mediaIds: [],
  buttonText: "Discover Aura",
  buttonLink: "/aura",
  overlayOpacity: 40,
  autoPlay: true,
  imageAlt: "Premium gemstone hero",
};

const createId = (prefix: string, index: number) => `${prefix}-${index + 1}`;

const DEFAULT_COLLECTION_ITEMS = [
  { name: "Moti (Pearl)", image: "/assets/images/pearl_moti.png" },
  { name: "Panna (Emerald)", image: "/assets/images/emerald_panna.png" },
  { name: "Neelam (Sapphire)", image: "/assets/images/sapphire_neelam.png" },
  { name: "Manik (Ruby)", image: "/assets/images/ruby_manik.png" },
  { name: "Pukhraj (Yellow Sapphire)", image: "/assets/images/yellow_sapphire.png" },
];

const DEFAULT_WHYP = [
  {
    title: "Certified Authentic",
    description: "Every gemstone is authenticated by world-class laboratories ensuring 100% natural origin.",
  },
  {
    title: "Expert Veda Guidance",
    description: "Personalized gemstone recommendations based on deep Vedic astrology research.",
  },
  {
    title: "Insured Global Shipping",
    description: "Secured, insured, and tracked shipping to your doorstep, anywhere in the world.",
  },
  {
    title: "Ancestral Quality",
    description: "Sourced directly from mines with focus on color, clarity and positive energy vibrations.",
  },
];

const DEFAULT_PRODUCT_ITEMS = [
  {
    name: "Natural Blue Sapphire",
    price: "₹45,000",
    image: "/assets/images/sapphire_neelam.png",
    tag: "HOT",
  },
  {
    name: "Rare Burmese Ruby",
    price: "₹82,000",
    image: "/assets/images/ruby_manik.png",
    tag: "NEW",
  },
  {
    name: "Zambian Emerald Ring",
    price: "₹55,000",
    image: "/assets/images/emerald_panna.png",
    tag: "HOT",
  },
  {
    name: "South Sea Pearl",
    price: "₹12,500",
    image: "/assets/images/pearl_moti.png",
    tag: "NEW",
  },
];

const DEFAULT_FEATURE_ITEMS = [
  {
    title: "Energy Healing",
    description: "Balance your chakras with natural stone vibrations.",
    icon: "Zap",
  },
  {
    title: "Protection",
    description: "Shield yourself from negative planetary influences.",
    icon: "ShieldCheck",
  },
  {
    title: "Wealth Attraction",
    description: "Align your energy with the frequency of abundance.",
    icon: "Award",
  },
  {
    title: "Love & Relationships",
    description: "Foster harmony and emotional stability in your life.",
    icon: "Heart",
  },
];

const DEFAULT_TESTIMONIAL_ITEMS = [
  {
    name: "Rajesh Sharma",
    content:
      "The quality of the Pukhraj I received is exceptional. I've felt a significant shift in my clarity and focus.",
    image: "https://i.pravatar.cc/150?u=rajesh",
  },
  {
    name: "Ananya Iyer",
    content:
      "Stunning design and the gemstone recommendation was spot on. Highly recommend Gems_Ratna!",
    image: "https://i.pravatar.cc/150?u=ananya",
  },
  {
    name: "Vikram Malhotra",
    content:
      "Truly luxury experience. The certificate of authenticity gives me peace of mind.",
    image: "https://i.pravatar.cc/150?u=vikram",
  },
];

const DEFAULT_FOOTER = {
  brandName: "Gems_Ratna",
  brandText:
    "Purveyors of the Earth's most profound vibrational specimens. Our gems are meticulously sourced and rituals-prepared to align with your cosmic path.",
  links: [
    { id: "f1", label: "All Treasures", href: "/shop" },
    { id: "f2", label: "Zodiac Guide", href: "/zodiac" },
    { id: "f3", label: "The Elements", href: "/elements" },
    { id: "f4", label: "Brand Story", href: "/about" },
  ],
  contact: {
    phone: "+91 98765 43210",
    email: "concierge@gemsratna.com",
    address: "India",
  },
};

export const normalizeHero = (hero: any) => {
  const legacySlide = Array.isArray(hero?.slides) ? hero.slides[0] : undefined;
  const mediaItems = Array.isArray(hero?.mediaItems) ? hero.mediaItems : [];
  const activeMediaItems = mediaItems.filter((item: any) => item?.isActive !== false);
  const sortedMediaItems = activeMediaItems
    .slice()
    .sort((a: any, b: any) => (a?.order ?? 0) - (b?.order ?? 0));
  const mediaImages = sortedMediaItems
    .filter((item: any) => !item?.type || item.type === "image")
    .map((item: any) => item.url)
    .filter(Boolean);
  const mediaIds = Array.isArray(hero?.mediaIds) ? hero.mediaIds.filter(Boolean) : [];
  const legacyImages = Array.isArray(hero?.images)
    ? hero.images.filter(Boolean)
    : legacySlide?.image
      ? [legacySlide.image]
      : [];

  const normalized = {
    ...DEFAULT_HERO,
    ...(hero || {}),
    eyebrow: hero?.eyebrow || DEFAULT_HERO.eyebrow,
    title: hero?.title || legacySlide?.title || DEFAULT_HERO.title,
    subtitle: hero?.subtitle || legacySlide?.subtitle || DEFAULT_HERO.subtitle,
    images:
      mediaImages.length > 0
        ? mediaImages
        : legacyImages.length > 0
          ? legacyImages
          : DEFAULT_HERO.images,
    mediaIds,
    mediaItems: sortedMediaItems,
    buttonText:
      hero?.buttonText || legacySlide?.btnText || DEFAULT_HERO.buttonText,
    buttonLink:
      hero?.buttonLink || legacySlide?.btnLink || DEFAULT_HERO.buttonLink,
    overlayOpacity:
      typeof hero?.overlayOpacity === "number"
        ? hero.overlayOpacity
        : DEFAULT_HERO.overlayOpacity,
    autoPlay:
      typeof hero?.autoPlay === "boolean" ? hero.autoPlay : DEFAULT_HERO.autoPlay,
    imageAlt: hero?.imageAlt || legacySlide?.title || DEFAULT_HERO.imageAlt,
  };

  return normalized;
};

export const normalizeSectionContent = (type: SectionType, content: any) => {
  switch (type) {
    case "hero":
      return normalizeHero(content);
    case "collections": {
      const items = Array.isArray(content?.items) && content.items.length > 0
        ? content.items
        : DEFAULT_COLLECTION_ITEMS.map((item, idx) => ({
            id: createId("collection", idx),
            ...item,
          }));
      return {
        title: content?.title || "Imperial Earth Elements",
        subtitle: content?.subtitle || "Curated Rareness",
        items,
      };
    }
    case "why": {
      const points = Array.isArray(content?.points) && content.points.length > 0
        ? content.points
        : DEFAULT_WHYP.map((point, idx) => ({
            id: createId("why", idx),
            ...point,
          }));
      return {
        title: content?.title || "Why Gems_Ratna",
        points,
      };
    }
    case "products": {
      const items = Array.isArray(content?.items) && content.items.length > 0
        ? content.items
        : DEFAULT_PRODUCT_ITEMS.map((item, idx) => ({
            id: createId("product", idx),
            ...item,
          }));
      return {
        title: content?.title || "The Imperial Collection",
        items,
      };
    }
    case "features": {
      const items = Array.isArray(content?.items) && content.items.length > 0
        ? content.items
        : DEFAULT_FEATURE_ITEMS.map((item, idx) => ({
            id: createId("feature", idx),
            ...item,
          }));
      return {
        title: content?.title || "The Soul Transmutation",
        items,
      };
    }
    case "testimonials": {
      const items = Array.isArray(content?.items) && content.items.length > 0
        ? content.items
        : DEFAULT_TESTIMONIAL_ITEMS.map((item, idx) => ({
            id: createId("testimonial", idx),
            ...item,
          }));
      return {
        title: content?.title || "The Memoirs",
        items: items.map((item: any, idx: number) => ({
          id: item.id || createId("testimonial", idx),
          name: item.name || "",
          role: item.role || "",
          content: item.content || item.message || "",
          avatar: item.avatar || item.image || "",
          rating: typeof item.rating === "number" ? item.rating : 5,
        })),
      };
    }
    case "cta":
      return {
        title: content?.title || "Claim Your Destiny",
        subtitle: content?.subtitle || "Speak to an expert",
        buttonText: content?.buttonText || "Request Orientation",
        buttonLink: content?.buttonLink || "/contact",
        theme: content?.theme || "accent",
      };
    case "footer":
      return {
        brandName: content?.brandName || DEFAULT_FOOTER.brandName,
        brandText: content?.brandText || DEFAULT_FOOTER.brandText,
        links: Array.isArray(content?.links) && content.links.length > 0 ? content.links : DEFAULT_FOOTER.links,
        contact: {
          phone: content?.contact?.phone || DEFAULT_FOOTER.contact.phone,
          email: content?.contact?.email || DEFAULT_FOOTER.contact.email,
          address: content?.contact?.address || DEFAULT_FOOTER.contact.address,
        },
      };
    case "navbar":
      return {
        logo: content?.logo || "",
        links: Array.isArray(content?.links) ? content.links : [],
      };
    case "trustbar":
      return {
        items: Array.isArray(content?.items) ? content.items : [],
      };
    case "faq":
    case "blog":
    case "usp":
      return content || {};
    default:
      return content || {};
  }
};

export const createDefaultSectionContent = (type: SectionType): any => {
  switch (type) {
    case "hero":
      return { ...DEFAULT_HERO, mediaIds: [], mediaItems: [] };
    case "navbar":
      return {
        logo: "",
        links: [
          { id: "1", label: "Shop", href: "/shop" },
          { id: "2", label: "Elements & Wishes", href: "/elements" },
          { id: "3", label: "Zodiac", href: "/zodiac" },
          { id: "4", label: "Brand", href: "/about" },
          { id: "5", label: "Contact", href: "/contact" }
        ]
      };
    case "trustbar":
      return {
        items: [
          { id: "1", icon: "Star", text: "4.8/5 Customer Rating" },
          { id: "2", icon: "ShieldCheck", text: "Certified Natural Gemstones" },
          { id: "3", icon: "Truck", text: "Free Shipping Across India" },
          { id: "4", icon: "Lock", text: "100% Secure Checkout" }
        ]
      };
    case "collections":
      return {
        title: "Imperial Earth Elements",
        subtitle: "Curated Rareness",
        items: DEFAULT_COLLECTION_ITEMS.map((item, idx) => ({
          id: createId("collection", idx),
          ...item,
        })),
      };
    case "why":
      return {
        title: "Why Gems_Ratna",
        points: DEFAULT_WHYP.map((item, idx) => ({
          id: createId("why", idx),
          ...item,
        })),
      };
    case "products":
      return {
        title: "The Imperial Collection",
        items: DEFAULT_PRODUCT_ITEMS.map((item, idx) => ({
          id: createId("product", idx),
          ...item,
        })),
      };
    case "features":
      return {
        title: "The Soul Transmutation",
        items: DEFAULT_FEATURE_ITEMS.map((item, idx) => ({
          id: createId("feature", idx),
          ...item,
        })),
      };
    case "cta":
      return {
        title: "Claim Your Destiny",
        subtitle: "Speak to an expert",
        buttonText: "Request Orientation",
        buttonLink: "/contact",
        theme: "accent",
      };
    case "testimonials":
      return {
        title: "The Memoirs",
        items: DEFAULT_TESTIMONIAL_ITEMS.map((item, idx) => ({
          id: createId("testimonial", idx),
          ...item,
          rating: 5,
        })),
      };
    case "faq":
      return {
        title: "Frequently Asked Questions",
        items: [],
      };
    case "blog":
      return {
        title: "Latest From Our Blog",
        layout: "grid",
        maxPosts: 3,
      };
    case "usp":
      return {
        title: "Why Choose Us",
        items: [
          { id: "1", icon: "Gem", title: "Authentic Gems", description: "100% certified natural gemstones" },
          { id: "2", icon: "Truck", title: "Fast Delivery", description: "Secure worldwide shipping" },
          { id: "3", icon: "Shield", title: "Secure Payment", description: "Your data is always protected" },
        ],
      };
    case "footer":
      return { ...DEFAULT_FOOTER };
    default:
      return {};
  }
};

export function createPageDraft(): Page {
  const coreSections: PageBlock[] = [
    { id: "hero-1", type: "hero", enabled: true, adminTitle: "Hero Slider", content: createDefaultSectionContent("hero") },
    { id: "collections-1", type: "collections", enabled: true, adminTitle: "Collections", content: createDefaultSectionContent("collections") },
    { id: "why-1", type: "why", enabled: true, adminTitle: "Why Section", content: createDefaultSectionContent("why") },
    { id: "products-1", type: "products", enabled: true, adminTitle: "Products", content: createDefaultSectionContent("products") },
    { id: "features-1", type: "features", enabled: true, adminTitle: "Features", content: createDefaultSectionContent("features") },
    { id: "testimonials-1", type: "testimonials", enabled: true, adminTitle: "Testimonials", content: createDefaultSectionContent("testimonials") },
    { id: "cta-1", type: "cta", enabled: true, adminTitle: "Call to Action", content: createDefaultSectionContent("cta") },
    { id: "footer-1", type: "footer", enabled: true, adminTitle: "Footer", content: createDefaultSectionContent("footer") },
  ];

  return {
    title: "",
    slug: "",
    status: "draft",
    isPublished: false,
    hero: { ...DEFAULT_HERO },
    sections: coreSections,
    seo: { ...DEFAULT_SEO },
  };
}

const HOME_SECTION_TEMPLATES = createPageDraft().sections;

export function mergeHomeSections(sections: PageBlock[]) {
  const existingSections = Array.isArray(sections) ? sections : [];
  const existingTypes = new Set(existingSections.map((section) => section?.type));
  const missingSections = HOME_SECTION_TEMPLATES.filter((section) => !existingTypes.has(section.type));

  if (missingSections.length === 0) {
    return existingSections;
  }

  return [
    ...existingSections,
    ...missingSections.map((section) => ({
      ...section,
      content: normalizeSectionContent(section.type, section.content),
    })),
  ];
}

export function normalizePage(page: any): Page {
  const status: PageStatus = page?.status === "published" || page?.isPublished ? "published" : "draft";
  const sections = page?.page === "home" || page?.slug === "home"
    ? mergeHomeSections(Array.isArray(page?.sections) ? page.sections : [])
    : Array.isArray(page?.sections)
      ? page.sections
      : [];
  const heroSection = sections.find((section: PageBlock) => section?.type === "hero");
  const heroFromSection = heroSection?.content
    ? normalizeHero(heroSection.content)
    : null;
  const normalizedSections = sections.map((section: PageBlock) => ({
    ...section,
    content: normalizeSectionContent(section.type, section.content),
  }));
  
  return {
    _id: page?._id ? String(page._id) : undefined,
    page: page?.page || "",
    title: page?.title || "",
    slug: page?.slug || "",
    status,
    isPublished: status === "published",
    hero: normalizeHero(page?.hero || heroFromSection || DEFAULT_HERO),
    sections: normalizedSections,
    seo: {
      ...DEFAULT_SEO,
      ...(page?.seo || {}),
    },
    createdAt: page?.createdAt,
    updatedAt: page?.updatedAt,
  };
}

export function getStatusLabel(page: Partial<Page>) {
  return page.status === "published" ? "Published" : "Draft";
}

export function isPagePublished(page: Page): boolean {
  return page.status === "published" || page.isPublished === true;
}

export function getRouteLabel(slug: string): string {
  if (slug === "home") return "/";
  return `/${slug}`;
}
