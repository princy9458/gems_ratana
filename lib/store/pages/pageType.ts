export type SectionType = 
  | "hero" 
  | "collections" 
  | "why"
  | "products"
  | "features"
  | "cta" 
  | "testimonials" 
  | "faq" 
  | "blog" 
  | "usp"
  | "navbar"
  | "trustbar"
  | "footer";

export interface PageBlock {
  id: string;
  type: SectionType;
  enabled: boolean;
  adminTitle?: string;
  content: any; // Type-specific content
}

export interface HeroContent {
  title: string;
  subtitle: string;
  images: string[];
  mediaIds?: string[];
  mediaItems?: Array<{
    _id?: string;
    id?: string;
    url: string;
    type?: "image" | "video" | string;
    category?: string;
    isActive?: boolean;
    order?: number;
    alt?: string;
    filename?: string;
  }>;
  buttonText: string;
  buttonLink: string;
  eyebrow?: string;
  overlayOpacity?: number;
  autoPlay?: boolean;
  imageAlt?: string;
}

export interface NavbarLink {
  id: string;
  label: string;
  href: string;
}

export interface NavbarContent {
  logo: string;
  links: NavbarLink[];
}

export interface TrustItem {
  id: string;
  icon: string;
  text: string;
}

export interface TrustBarContent {
  items: TrustItem[];
}

export interface CollectionsContent {
  title: string;
  subtitle?: string;
  items: Array<{
    id: string;
    name: string;
    image: string;
    link?: string;
  }>;
}

export interface WhyPoint {
  id: string;
  title: string;
  description: string;
  icon?: string;
}

export interface WhyContent {
  title: string;
  points: WhyPoint[];
}

export interface ProductItem {
  id: string;
  name: string;
  price: string;
  image: string;
  tag?: string;
  link?: string;
}

export interface ProductsContent {
  title: string;
  items: ProductItem[];
}

export interface FeatureItem {
  id: string;
  title: string;
  description: string;
  icon?: string;
}

export interface FeaturesContent {
  title: string;
  items: FeatureItem[];
}

export interface CTAContent {
  title: string;
  subtitle: string;
  backgroundImage?: string;
  buttonText: string;
  buttonLink: string;
  theme?: "dark" | "light" | "accent";
}

export interface TestimonialItem {
  id: string;
  name: string;
  role?: string;
  content: string;
  avatar?: string;
  rating: number;
}

export interface TestimonialsContent {
  title: string;
  items: TestimonialItem[];
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface FAQContent {
  title: string;
  items: FAQItem[];
}

export interface BlogContent {
  title: string;
  layout: "grid" | "list";
  maxPosts: number;
  category?: string;
}

export interface USPItem {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface USPContent {
  title?: string;
  items: USPItem[];
}

export interface FooterLink {
  id: string;
  label: string;
  href: string;
}

export interface FooterContent {
  brandName?: string;
  brandText: string;
  links: FooterLink[];
  contact: {
    phone?: string;
    email?: string;
    address?: string;
  };
}

export type PageStatus = "draft" | "published";

export interface PageSEO {
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  ogImage: string;
}

export interface Page {
  _id?: string;
  page?: string; // Identifier e.g. "home"
  title: string;
  slug: string;
  status: PageStatus;
  isPublished: boolean;
  hero?: HeroContent | null;
  sections: PageBlock[];
  seo: PageSEO;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}
