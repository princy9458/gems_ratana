import { Metadata } from "next";
import GemHomePage from "@/components/pages/GemHomePage";
import PageContentRenderer from "@/components/pages/PageContentRenderer";
import { getPageData } from "@/lib/getPageData";
import { isPagePublished, normalizeHero } from "@/lib/store/pages/pageHelpers";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const withDynamicHero = (page: any) => {
  if (!page) return page;

  const hero = normalizeHero(page.hero);
  const sections = Array.isArray(page.sections)
    ? page.sections.map((section: any) =>
        section?.type === "hero"
          ? {
              ...section,
              content: normalizeHero(section.content || page.hero || hero),
            }
          : section,
      )
    : [];

  return {
    ...page,
    hero,
    sections,
  };
};

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageData("home");

  if (page && isPagePublished(page)) {
    return {
      title: page.seo?.metaTitle || page.title || "Home",
      description: page.seo?.metaDescription || "",
      keywords: page.seo?.keywords || undefined,
      openGraph: {
        title: page.seo?.metaTitle || page.title || "Home",
        description: page.seo?.metaDescription || "",
        images: page.seo?.ogImage ? [page.seo.ogImage] : undefined,
      },
    };
  }

  return {
    title: "GemsRatna | Premium Natural Gemstones",
    description:
      "Luxury gemstone jewelry, healing crystals and spiritual products designed to convert.",
  };
}

export default async function Page() {
  const page = await getPageData("home");

  const hasActiveSections = Array.isArray(page?.sections) && page.sections.some((s: any) => s.enabled);
  const hero = normalizeHero(page?.hero);

  // Keeping the live homepage experience on "/" until the CMS-rendered version is intentionally deployed.
  // if (page && isPagePublished(page) && hasActiveSections) {
  //   return <PageContentRenderer page={withDynamicHero(page)} />;
  // }

  return <GemHomePage hero={hero} />;
}
