"use client";

import { useEffect, useState } from "react";
import { loadAllLinksData } from "@/features/links/lib";
import type { LinksItem } from "@/features/links/types";

export default function LinksTestPage() {
  const [data, setData] = useState<LinksItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        console.log("开始加载链接数据...");
        const result = await loadAllLinksData("test-page");
        console.log("数据加载完成:", result.length);
        setData(result);
        setLoading(false);
      } catch (err) {
        console.error("加载数据失败:", err);
        setError(err instanceof Error ? err.message : "未知错误");
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return <div className="p-4">加载中...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">错误: {error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">链接数据测试页面</h1>
      <p>总共加载了 {data.length} 个链接</p>
      <div className="mt-4">
        <h2 className="text-xl font-semibold mb-2">前10个链接:</h2>
        <ul className="list-disc pl-5">
          {data.slice(0, 10).map(item => (
            <li key={item.id} className="mb-1">
              <strong>{item.title}</strong> - {item.url}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
