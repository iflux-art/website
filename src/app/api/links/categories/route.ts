import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { z } from "zod";
import { LinksCategorySchema } from "@/lib/schemas/links";

const filePath = path.join(process.cwd(), "src/data/links/categories.json");

export async function GET() {
  try {
    const data = await fs.readFile(filePath, "utf-8");
    const categories = JSON.parse(data);
    // 使用zod验证数据
    const validatedCategories = z.array(LinksCategorySchema).parse(categories);
    return NextResponse.json(validatedCategories);
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
