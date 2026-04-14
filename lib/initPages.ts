import { Db } from "mongodb";
import { DEFAULT_HERO } from "./store/pages/pageHelpers";

export async function initPagesCollection(db: Db) {
  const pagesCollection = db.collection("pages");

  const defaultPages = [
    {
      page: "home",
      slug: "home",
      title: "Home Page",
      status: "published",
      hero: {
        ...DEFAULT_HERO,
        images: [],
        mediaIds: [],
      },
      sections: [
        {
          id: "hero-1",
          type: "hero",
          enabled: true,
          content: {
            ...DEFAULT_HERO,
            images: [],
            mediaIds: [],
          }
        },
        {
          id: "collections-1",
          type: "collections",
          enabled: true,
          content: {
            title: "Imperial Earth Elements",
            subtitle: "Curated Rareness",
            items: [
              { id: "c1", name: "Moti (Pearl)", image: "/assets/images/pearl_moti.png", link: "/collections/pearl" },
              { id: "c2", name: "Panna (Emerald)", image: "/assets/images/emerald_panna.png", link: "/collections/emerald" },
              { id: "c3", name: "Neelam (Sapphire)", image: "/assets/images/sapphire_neelam.png", link: "/collections/sapphire" },
              { id: "c4", name: "Manik (Ruby)", image: "/assets/images/ruby_manik.png", link: "/collections/ruby" },
              { id: "c5", name: "Pukhraj (Yellow Sapphire)", image: "/assets/images/yellow_sapphire.png", link: "/collections/yellow-sapphire" },
            ],
          },
        },
        {
          id: "why-1",
          type: "why",
          enabled: true,
          content: {
            title: "Why Gems_Ratna",
            points: [
              { id: "w1", title: "Certified Authentic", description: "Every gemstone is authenticated by world-class laboratories ensuring 100% natural origin." },
              { id: "w2", title: "Expert Veda Guidance", description: "Personalized gemstone recommendations based on deep Vedic astrology research." },
              { id: "w3", title: "Insured Global Shipping", description: "Secured, insured, and tracked shipping to your doorstep, anywhere in the world." },
              { id: "w4", title: "Ancestral Quality", description: "Sourced directly from mines with focus on color, clarity and positive energy vibrations." },
            ],
          },
        },
        {
          id: "products-1",
          type: "products",
          enabled: true,
          content: {
            title: "The Imperial Collection",
            items: [
              { id: "p1", name: "Natural Blue Sapphire", price: "₹45,000", image: "/assets/images/sapphire_neelam.png", tag: "HOT" },
              { id: "p2", name: "Rare Burmese Ruby", price: "₹82,000", image: "/assets/images/ruby_manik.png", tag: "NEW" },
              { id: "p3", name: "Zambian Emerald Ring", price: "₹55,000", image: "/assets/images/emerald_panna.png", tag: "HOT" },
              { id: "p4", name: "South Sea Pearl", price: "₹12,500", image: "/assets/images/pearl_moti.png", tag: "NEW" },
            ],
          },
        },
        {
          id: "features-1",
          type: "features",
          enabled: true,
          content: {
            title: "The Soul Transmutation",
            items: [
              { id: "f1", title: "Energy Healing", description: "Balance your chakras with natural stone vibrations.", icon: "Zap" },
              { id: "f2", title: "Protection", description: "Shield yourself from negative planetary influences.", icon: "ShieldCheck" },
              { id: "f3", title: "Wealth Attraction", description: "Align your energy with the frequency of abundance.", icon: "Award" },
              { id: "f4", title: "Love & Relationships", description: "Foster harmony and emotional stability in your life.", icon: "Heart" },
            ],
          },
        },
        {
          id: "testimonials-1",
          type: "testimonials",
          enabled: true,
          content: {
            title: "The Memoirs",
            items: [
              { id: "t1", name: "Rajesh Sharma", content: "The quality of the Pukhraj I received is exceptional. I've felt a significant shift in my clarity and focus.", image: "https://i.pravatar.cc/150?u=rajesh", rating: 5 },
              { id: "t2", name: "Ananya Iyer", content: "Stunning design and the gemstone recommendation was spot on. Highly recommend Gems_Ratna!", image: "https://i.pravatar.cc/150?u=ananya", rating: 5 },
              { id: "t3", name: "Vikram Malhotra", content: "Truly luxury experience. The certificate of authenticity gives me peace of mind.", image: "https://i.pravatar.cc/150?u=vikram", rating: 5 },
            ],
          },
        },
        {
          id: "cta-1",
          type: "cta",
          enabled: true,
          content: {
            title: "Claim Your Destiny",
            subtitle: "Speak to an expert",
            buttonText: "Request Orientation",
            buttonLink: "/contact",
            theme: "accent",
          },
        },
        {
          id: "footer-1",
          type: "footer",
          enabled: true,
          content: {
            brandName: "Gems_Ratna",
            brandText: "Purveyors of the Earth's most profound vibrational specimens. Our gems are meticulously sourced and rituals-prepared to align with your cosmic path.",
            links: [
              { id: "fl1", label: "All Treasures", href: "/shop" },
              { id: "fl2", label: "Zodiac Guide", href: "/zodiac" },
              { id: "fl3", label: "The Elements", href: "/elements" },
              { id: "fl4", label: "Brand Story", href: "/about" },
            ],
            contact: {
              phone: "+91 98765 43210",
              email: "concierge@gemsratna.com",
            },
          },
        },
      ],
      seo: {
        metaTitle: "GemsRatna | Wear Your Destiny",
        metaDescription: "Premium natural gemstones and spiritual wellness products.",
        keywords: ["gemstones", "ratna", "luxury"],
        ogImage: ""
      }
    },
    {
      page: "about",
      slug: "about",
      title: "About GemsRatna",
      status: "published",
      hero: {
        title: "About GemsRatna",
        subtitle: "Our journey in gemstones",
        images: [],
        mediaIds: [],
        buttonText: "Explore Collection",
        buttonLink: "/shop",
      },
      sections: [
        {
          id: "about-hero-1",
          type: "hero",
          enabled: true,
          content: {
            title: "About GemsRatna",
            subtitle: "Our journey in gemstones",
            images: [],
            mediaIds: [],
            buttonText: "Explore Collection",
            buttonLink: "/shop",
            eyebrow: "About GemsRatna",
          },
        }
      ],
      seo: {
        metaTitle: "About GemsRatna | GemsRatna",
        metaDescription: "Learn about our history",
        keywords: ["about", "gemsratna", "history"],
        ogImage: ""
      }
    }
  ];

  let insertedCount = 0;
  for (const pageItem of defaultPages) {
    // We check for slug or page to avoid duplicates
    const existing = await pagesCollection.findOne({ 
      $or: [{ page: pageItem.page }, { slug: pageItem.slug }] 
    });

    if (!existing) {
      await pagesCollection.insertOne({
        ...pageItem,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      insertedCount += 1;
    }
  }

  if (insertedCount > 0) {
    console.log(`CMS Pages seeded with ${insertedCount} default record(s).`);
  }
}
