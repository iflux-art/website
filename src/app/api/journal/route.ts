import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import matter from "gray-matter";
import { JournalEntry } from "@/types/journal-types";

function getMdxFiles(): JournalEntry[] {
  console.log("Starting to fetch MDX files...");
  const entries: JournalEntry[] = [];
  const contentTypes = ["blog", "docs"] as const;

  for (const type of contentTypes) {
    const dir = path.join(process.cwd(), "src", "content", type);
    console.log(`Checking ${type} directory: ${dir}`);
    if (!fs.existsSync(dir)) {
      console.warn(`Directory not found: ${dir}`);
      continue;
    }

    // 递归函数来查找所有 MDX 文件
    const findMdxInDirectory = (dir: string) => {
      try {
        const items = fs.readdirSync(dir, { withFileTypes: true });

        for (const item of items) {
          const itemPath = path.join(dir, item.name);

          if (item.isDirectory()) {
            findMdxInDirectory(itemPath);
          } else if (
            item.isFile() &&
            (item.name.endsWith(".mdx") || item.name.endsWith(".md"))
          ) {
            try {
              console.log(`Processing file: ${itemPath}`);
              const fileContent = fs.readFileSync(itemPath, "utf8");
              const { data } = matter(fileContent);

              // 确保文档有日期
              if (data.date) {
                // 获取文档相对路径
                // 构建文章路径和URL
                const relativeDir = path.relative(
                  path.join(process.cwd(), "src", "content"),
                  itemPath,
                );
                const fileName = path
                  .basename(relativeDir)
                  .replace(/\.(mdx|md)$/, "");
                const urlPath = relativeDir
                  .replace(/\.(mdx|md)$/, "")
                  .replace(/\\/g, "/");
                console.log("Building URL:", {
                  type,
                  relativeDir,
                  fileName,
                  urlPath,
                });

                const entry: JournalEntry = {
                  id: `${type}:${fileName}`,
                  slug: fileName,
                  title: data.title || fileName,
                  description: data.description || data.excerpt || "",
                  date: data.date,
                  url: `/${urlPath}`,
                  type: type === "docs" ? "doc" : "blog",
                };

                console.log(`Found entry: ${entry.id}`);
                entries.push(entry);
              }
            } catch (error) {
              console.error(`Error processing file ${itemPath}:`, error);
            }
          }
        }
      } catch (error) {
        console.error(`Error reading directory ${dir}:`, error);
      }
    };

    findMdxInDirectory(dir);
  }

  // 按日期排序（从新到旧）
  return entries.sort((a, b) => {
    const dateA = a.date ? new Date(a.date).getTime() : 0;
    const dateB = b.date ? new Date(b.date).getTime() : 0;
    return dateB - dateA;
  });
}

export async function GET() {
  console.log("Received GET request to /api/journal");

  try {
    const entries = getMdxFiles();
    console.log(`Successfully retrieved ${entries.length} entries`);

    return new NextResponse(JSON.stringify(entries), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error in /api/journal:", error);

    return new NextResponse(
      JSON.stringify({ error: "Failed to fetch journal entries" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }
}
