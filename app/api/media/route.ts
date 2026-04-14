import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { ObjectId } from "mongodb";
import { connectTenantDB } from "@/lib/db";

function ensureUploadDir() {
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  return uploadDir;
}

export async function POST(req: NextRequest) {
  try {
    console.log("POST /api/media called");
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const title = String(formData.get("title") || "");
    const category = String(formData.get("category") || "hero").toLowerCase();
    const alt = String(formData.get("alt") || "");
    const isActive = String(formData.get("isActive") || "true") === "true";
    const type = String(formData.get("type") || (file?.type?.startsWith("video/") ? "video" : "image"));
    const order = Number(formData.get("order") || 0);

    console.log("MEDIA BODY:", {
      title,
      category,
      alt,
      isActive,
      type,
      order,
      fileName: file?.name,
    });

    if (!file) {
      return NextResponse.json({ success: false, error: "No file uploaded" }, { status: 400 });
    }

    const uploadDir = ensureUploadDir();
    const safeName = `${Date.now()}-${file.name}`.replace(/\s+/g, "-");
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.promises.writeFile(path.join(uploadDir, safeName), buffer);

    const db = await connectTenantDB();
    const mediaDoc = {
      filename: title || file.name,
      title: title || file.name,
      alt,
      category,
      isActive,
      order,
      type: type === "video" ? "video" : "image",
      url: `/uploads/${safeName}`,
      size: buffer.length,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const insertResult = await db.collection("media").insertOne(mediaDoc);
    const saved = {
      ...mediaDoc,
      _id: insertResult.insertedId,
    };

    console.log("MEDIA SAVED:", saved);
    return NextResponse.json({ success: true, data: saved });
  } catch (error) {
    console.error("Error in POST /api/media:", error);
    return NextResponse.json(
      { success: false, error: "Failed to upload media" },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const category = searchParams.get("category");
    const active = searchParams.get("active");
    const ids = searchParams.get("ids");

    const db = await connectTenantDB();
    const query: any = {};

    if (category) query.category = category.toLowerCase();
    if (active === "true") query.isActive = true;
    if (ids) {
      query._id = {
        $in: ids
          .split(",")
          .map((id) => id.trim())
          .filter(Boolean)
          .map((id) => new ObjectId(id)),
      };
    }

    const media = await db.collection("media").find(query).sort({ order: 1, createdAt: -1 }).toArray();
    return NextResponse.json({ success: true, data: media });
  } catch (error) {
    console.error("Error in GET /api/media:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch media" },
      { status: 500 },
    );
  }
}
