import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { connectTenantDB } from "@/lib/db";
import { ObjectId } from "mongodb";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files: any[] = formData.getAll("files") as any[];
    const name: string[] = formData.getAll("name") as string[];
    const altText: string[] = formData.getAll("altText") as string[];
    const foldername: string[] = formData.getAll("foldername") as string[];
    const category: string[] = formData.getAll("category") as string[];
    const isActive: string[] = formData.getAll("isActive") as string[];
    const order: string[] = formData.getAll("order") as string[];

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    let array: any[] = [];

    for (let i = 0; i < files.length; i++) {
      const singleFile = files[i];
      const singleName = name[i];
      const singleAltText = altText[i] || "ALT TEXT NOT ADDED";
      const singleFoldername = foldername[i] || "Uncategorized";
      const singleCategory = (category[i] || singleFoldername || "hero").toLowerCase();
      const singleIsActive = isActive[i] ? isActive[i] === "true" : true;
      const singleOrder = order[i] ? Number(order[i]) : i;

      const filename: string = singleName
        ? singleName
        : `media-${Date.now()}-${singleFile.name}`;

      const renamedFile = new File([singleFile], filename, {
        type: singleFile.type,
      });

      const buffer: Buffer = Buffer.from(await renamedFile.arrayBuffer());

      await fs.promises.writeFile(path.join(uploadDir, filename), buffer);

      array.push({
        filename: filename,
        alt: singleAltText,
        foldername: singleFoldername,
        category: singleCategory,
        url: `/uploads/${filename}`,
        size: buffer.length,
        type: singleFile.type?.startsWith("video/") ? "video" : "image",
        isActive: singleIsActive,
        order: singleOrder,
        createdAt: new Date(),
      });
    }

    if (array.length > 0) {
      const db = await connectTenantDB();
      const mediaColl = await db.collection("media");
      const insertResult = await mediaColl.insertMany(array);
      array = array.map((item: any, index: number) => {
        item._id = insertResult.insertedIds[index];
        return item;
      });
    }

    return NextResponse.json({ success: true, data: array });
  } catch (error) {
    console.error("Error uploading media:", error);
    return NextResponse.json(
      { error: "Failed to upload media" },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const category = searchParams.get("category");
    const ids = searchParams.get("ids");
    const active = searchParams.get("active");
    const db = await connectTenantDB();
    const mediaColl = await db.collection("media");
    const query: any = {};
    if (category) query.category = category.toLowerCase();
    if (active === "true") query.isActive = true;
    if (ids) {
      const objectIds = ids
        .split(",")
        .map((id) => id.trim())
        .filter(Boolean)
        .map((id) => new ObjectId(id));
      query._id = { $in: objectIds };
    }
    const media = await mediaColl.find(query).sort({ order: 1, createdAt: -1 }).toArray();
    return NextResponse.json({ success: true, data: media });
  } catch (error) {
    console.error("Error fetching media:", error);
    return NextResponse.json(
      { error: "Failed to fetch media" },
      { status: 500 },
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const updates = Array.isArray(body?.updates) ? body.updates : [];
    const db = await connectTenantDB();
    const mediaColl = await db.collection("media");

    const results = [];
    for (const update of updates) {
      if (!update?._id) continue;
      const { _id, ...rest } = update;
      const result = await mediaColl.updateOne(
        { _id: new ObjectId(_id) },
        { $set: rest },
      );
      results.push(result);
    }

    return NextResponse.json({ success: true, data: results });
  } catch (error) {
    console.error("Error updating media:", error);
    return NextResponse.json(
      { error: "Failed to update media" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    const db = await connectTenantDB();
    const mediaColl = await db.collection("media");
    const deleteResult = await mediaColl.deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ success: true, data: deleteResult });
  } catch (error) {
    console.error("Error deleting media:", error);
    return NextResponse.json(
      { error: "Failed to delete media" },
      { status: 500 },
    );
  }
}
