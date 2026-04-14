import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getPageModel } from "@/models";
import { ObjectId } from "mongodb";
import { normalizePage } from "@/lib/store/pages/pageHelpers";

/**
 * Enhanced route to handle both MongoDB ObjectIDs and Slugs
 */
async function getQuery(slugOrId: string) {
  if (ObjectId.isValid(slugOrId)) {
    return { _id: new ObjectId(slugOrId) };
  }
  return { slug: slugOrId };
}

// GET a single page by slug or ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slugOrId: string }> },
) {
  try {
    const { slugOrId } = await params;
    const PageModel = await getPageModel();
    const query = await getQuery(slugOrId);
    
    const page = await PageModel.findOne(query);

    if (!page) {
      return NextResponse.json(
        { success: false, message: "Page not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, page: normalizePage(page) });
  } catch (error) {
    console.error("Error fetching page:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch page" },
      { status: 500 },
    );
  }
}

// PUT update an existing page
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slugOrId: string }> },
) {
  try {
    const { slugOrId } = await params;
    const body = await req.json();
    const PageModel = await getPageModel();
    
    // We strictly use ID for updates if possible to ensure we're hitting the right record
    const query = await getQuery(slugOrId);
    const existingTarget = await PageModel.findOne(query);

    if (!existingTarget) {
      return NextResponse.json(
        { success: false, message: "Page not found for update" },
        { status: 404 },
      );
    }

    const targetId = existingTarget._id;

    // Check slug uniqueness if it's being updated
    if (body.slug && body.slug !== existingTarget.slug) {
      const slugConflict = await PageModel.findOne({
        slug: body.slug,
        _id: { $ne: targetId },
      });
      if (slugConflict) {
        return NextResponse.json(
          { success: false, message: "A page with this slug already exists" },
          { status: 400 },
        );
      }
    }

    const { _id, ...updateData } = body;
    const normalizedStatus =
      updateData.status === "published" || updateData.isPublished
        ? "published"
        : updateData.status === "draft"
          ? "draft"
          : undefined;

    if (normalizedStatus) {
      updateData.status = normalizedStatus;
      updateData.isPublished = normalizedStatus === "published";
    } else if (typeof updateData.isPublished === "boolean") {
      updateData.status = updateData.isPublished ? "published" : "draft";
    }

    updateData.updatedAt = new Date();

    const result = await PageModel.updateOne(
      { _id: targetId },
      { $set: updateData },
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Page not found" },
        { status: 404 },
      );
    }

    const updatedPage = await PageModel.findOne({ _id: targetId });

    if (!updatedPage) {
      return NextResponse.json(
        { success: false, message: "Page not found after update" },
        { status: 404 },
      );
    }

    revalidatePath("/");
    revalidatePath("/admin/pages");

    return NextResponse.json({
      success: true,
      message: "Page updated successfully",
      page: normalizePage(updatedPage),
    });
  } catch (error) {
    console.error("Error updating page:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update page" },
      { status: 500 },
    );
  }
}

// DELETE a page
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ slugOrId: string }> },
) {
  try {
    const { slugOrId } = await params;
    const PageModel = await getPageModel();
    const query = await getQuery(slugOrId);
    
    // For safer deletion, find the record first
    const existingTarget = await PageModel.findOne(query);
    if (!existingTarget) {
      return NextResponse.json(
        { success: false, message: "Page not found" },
        { status: 404 },
      );
    }

    const result = await PageModel.deleteOne({ _id: existingTarget._id });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Failed to delete page" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Page deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting page:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete page" },
      { status: 500 },
    );
  }
}
