import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { getDocSidebar } from "@/lib/content";
import { DocListItem } from "@/types";

interface SidebarNavItem {
  type?: "menu" | "separator" | "page" | "item" | "category";
  title: string;
  href?: string;
  isExternal?: boolean;
  filePath?: string;
  items?: SidebarNavItem[];
  label?: string;
  open?: boolean;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ category: string }> },
) {
  try {
    const resolvedParams = await params;
    const categoryParam = resolvedParams.category;
    const decodedCategory = decodeURIComponent(categoryParam);

    const categoryDir = path.join(
      process.cwd(),
      "src",
      "content",
      "docs",
      decodedCategory,
    );

    if (
      !fs.existsSync(categoryDir) ||
      !fs.statSync(categoryDir).isDirectory()
    ) {
      return NextResponse.json(
        { error: `分类 ${decodedCategory} 不存在` },
        { status: 404 },
      );
    }

    const sidebarItems = getDocSidebar(decodedCategory);
    const docs: DocListItem[] = [];

    const flattenSidebarItems = (items: SidebarNavItem[], parentPath = "") => {
      items.forEach((item) => {
        if (
          item.type !== "separator" &&
          item.href &&
          !item.isExternal &&
          item.filePath
        ) {
          const slug = item.filePath.split("/").pop() || "";

          docs.push({
            slug,
            title: item.title,
            path: item.href,
            description: item.label || item.title,
            category: resolvedParams.category,
          });
        }

        if (item.items && item.items.length > 0) {
          flattenSidebarItems(
            item.items,
            parentPath + (item.filePath ? `/${item.filePath}` : ""),
          );
        }
      });
    };

    flattenSidebarItems(sidebarItems);

    if (docs.length === 0) {
      console.log(`使用旧方法获取分类 ${decodedCategory} 的文档列表`);

      const fallbackDocs = fs
        .readdirSync(categoryDir)
        .filter((file) => file.endsWith(".mdx") || file.endsWith(".md"))
        .map((file) => {
          const docPath = path.join(categoryDir, file);
          const docContent = fs.readFileSync(docPath, "utf8");
          const { data } = matter(docContent);
          const slug = file.replace(/\.(mdx|md)$/, "");

          return {
            slug,
            title: data.title || slug,
            description: data.description || data.title || slug,
            path: `/docs/${decodedCategory}/${slug}`,
          };
        });

      return NextResponse.json(fallbackDocs);
    }

    return NextResponse.json(docs);
  } catch (error) {
    const categoryName =
      typeof params === "object" && params !== null && "category" in params
        ? decodeURIComponent((await params).category)
        : "未知分类";
    console.error(`获取分类 ${categoryName} 的文档列表时出错:`, error);
    return NextResponse.json({ error: "获取文档列表失败" }, { status: 500 });
  }
}
