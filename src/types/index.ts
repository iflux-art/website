// 基础类型
export * from "@/types/base-types";
export * from "@/types/data-types";
export * from "@/types/api-types";

// 应用特定类型
export * from "@/types/blog-types";
export * from "@/types/docs-types";
export * from "@/types/journal-types";
export * from "@/types/links-types";
export * from "@/types/search-types";
export * from "@/types/tools-types";
export * from "@/types/nav-types";

// MDX 相关类型
export * from "@/types/mdx-core-types";
export * from "@/types/mdx-component-types";
export * from "@/types/mdx-types";
export * from "@/types/metadata-types";

// Hooks 相关类型
export * from "@/types/hooks";

// 内容相关类型
export * from "@/types/content";

// Web Vitals 相关类型
export * from "@/types/web-vitals-types";

// API响应类型
export interface ApiResponse<T = unknown> {
  data?: T;
  error?: {
    code: number;
    message: string;
  };
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
  };
}
