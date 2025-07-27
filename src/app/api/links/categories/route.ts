import { NextResponse } from "next/server";
import categories from "@/config/links/categories.json";

export async function GET() {
  try {
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error reading links categories:", error);
    return NextResponse.json(
      {
        error: "Failed to read categories",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
