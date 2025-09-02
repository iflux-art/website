import { NextResponse } from "next/server";
import { generateCategoriesFromFiles } from "@/features/links/lib/categories";

export async function GET() {
  try {
    const categories = await generateCategoriesFromFiles();
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error reading links categories:", error);
    return NextResponse.json(
      {
        error: "Failed to read categories",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
