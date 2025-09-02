import { getDocSidebar } from "@/features/docs/lib";
import type { DocListItem } from "@/features/docs/types";
import { NextResponse } from "next/server";

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

/**
 * 递归展开sidebar项目
 */
const flattenSidebarItems = (
  items: SidebarNavItem[],
  categoryId: string,
  docs: DocListItem[],
  parentPath = ""
): void => {
  items.forEach(item => {
    if (item.type !== "separator" && item.href && !item.isExternal && item.filePath) {
      const slug = item.filePath.split("/").pop() ?? "";

      docs.push({
        slug,
        title: item.title,
        path: item.href,
        description: item.label ?? item.title,
        category: categoryId,
      });
    }

    if (item.items && item.items.length > 0) {
      flattenSidebarItems(
        item.items,
        categoryId,
        docs,
        parentPath + (item.filePath ? `/${item.filePath}` : "")
      );
    }
  });
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ category: string }> }
) {
  try {
    const resolvedParams = await params;
    const categoryParam = resolvedParams.category;
    const decodedCategory = decodeURIComponent(categoryParam);

    const sidebarItems = getDocSidebar(decodedCategory);
    const docs: DocListItem[] = [];

    flattenSidebarItems(sidebarItems, resolvedParams.category, docs);

    return NextResponse.json(docs);
  } catch (error) {
    console.error("Error getting document list for category:", error);
    return NextResponse.json({ error: "获取文档列表失败" }, { status: 500 });
  }
}
