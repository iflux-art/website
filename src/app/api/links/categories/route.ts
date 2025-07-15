import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const filePath = path.join(process.cwd(), "src/config/links/categories.json");

export async function GET() {
  try {
    const config = await fs.readFile(filePath, "utf-8");
    const categories = JSON.parse(config);
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
