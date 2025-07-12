import type { LinksItem, LinksCategory } from "@/types";

// 客户端使用的函数
export async function fetchLinksData(): Promise<LinksItem[]> {
  const res = await fetch("/api/links", { cache: "no-store" });
  const data = await res.json();
  return Array.isArray(data) ? data : data.items || [];
}

export async function fetchLinksCategories(): Promise<LinksCategory[]> {
  const res = await fetch("/api/links/categories", { cache: "no-store" });
  return await res.json();
}
