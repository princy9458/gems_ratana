import { connectTenantDB } from "./db";
import { isHex } from "@/lib/utils";
import { ObjectId } from "mongodb";
import { normalizePage } from "./store/pages/pageHelpers";

function serialize(obj: any) {
  return JSON.parse(JSON.stringify(obj));
}

async function resolveHeroMedia(db: Awaited<ReturnType<typeof connectTenantDB>>, hero: any) {
  const mediaIds = Array.isArray(hero?.mediaIds) ? hero.mediaIds.filter(Boolean) : [];
  const mediaColl = db.collection("media");
  let sorted: any[] = [];

  if (mediaIds.length > 0) {
    const objectIds = mediaIds
      .map((id: string) => {
        try {
          return new ObjectId(id);
        } catch {
          return null;
        }
      })
      .filter(Boolean) as ObjectId[];

    if (objectIds.length > 0) {
      const media = await mediaColl
        .find({ _id: { $in: objectIds }, isActive: { $ne: false } })
        .toArray();

      const byId = new Map(media.map((item: any) => [String(item._id), item]));
      sorted = mediaIds
        .map((id: string, index: number) => {
          const item = byId.get(id);
          if (!item) return null;
          return {
            ...item,
            order: typeof item.order === "number" ? item.order : index,
          };
        })
        .filter(Boolean)
        .sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0));
    }
  }

  if (sorted.length === 0) {
    sorted = await mediaColl
      .find({ category: "hero", isActive: { $ne: false } })
      .sort({ order: 1, createdAt: -1 })
      .toArray();
  }

  return {
    ...hero,
    mediaItems: sorted,
    images: sorted
      .filter((item: any) => item?.type !== "video")
      .map((item: any) => item.url)
      .filter(Boolean),
  };
}

export async function getPageData(slug: string) {
  console.log("Fetching page data for slug:", slug);
  const db = await connectTenantDB();
  const page = await db.collection("pages").findOne({ slug });
  if (!page) return null;

  const enrichedHero = await resolveHeroMedia(db, page.hero);
  const enrichedSections = Array.isArray(page.sections)
    ? await Promise.all(
        page.sections.map(async (section: any) => {
          if (section?.type !== "hero") return section;
          const content = await resolveHeroMedia(db, section.content);
          return { ...section, content };
        }),
      )
    : [];

  return serialize(normalizePage({
    ...page,
    hero: enrichedHero,
    sections: enrichedSections,
  }));
}

export async function getSingleProduct(id: string) {
  const db = await connectTenantDB();
  const productColl = db.collection("products");

  const matchStage: any = {};
  if (isHex(id)) {
    matchStage._id = new ObjectId(id);
  } else {
    matchStage.slug = id;
  }

  const products = await productColl
    .aggregate([
      {
        $match: matchStage,
      },
      {
        $lookup: {
          from: "variants",
          localField: "_id",
          foreignField: "productId",
          as: "variants",
        },
      },

      // {
      //   $addFields: {
      //     variants: {
      //       $sortArray: {
      //         input: "$variants",
      //         sortBy: { createdAt: -1 },
      //       },
      //     },
      //   },
      // },
    ])
    .toArray();

  return serialize(products[0]);
}
