import { Metadata } from "next";
import PageContentRenderer from "@/components/pages/PageContentRenderer";
import AboutGemPage from "@/components/pages/AboutGemPage";
import { getPageData } from "@/lib/getPageData";
import { normalizePage, isPagePublished } from "@/lib/store/pages/pageHelpers";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageData("about");

  if (page && isPagePublished(page)) {
    return {
      title: page.seo?.metaTitle || page.title || "About GemsRatna",
      description: page.seo?.metaDescription || "",
      keywords: page.seo?.keywords || undefined,
      openGraph: {
        title: page.seo?.metaTitle || page.title || "About GemsRatna",
        description: page.seo?.metaDescription || "",
        images: page.seo?.ogImage ? [page.seo.ogImage] : undefined,
      },
    };
  }

  return {
    title: "About GemsRatna",
    description: "Learn more about our story, mission and gemstone craftsmanship.",
  };
}

export default async function AboutPage() {
  const page = await getPageData("about");

  if (page && isPagePublished(page) && page.sections?.some((s: any) => s.enabled)) {
    return <PageContentRenderer page={normalizePage(page)} />;
  }

  return <AboutGemPage />;
}
