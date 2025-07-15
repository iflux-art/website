// 基础类型
export * from "@/types/base-types";
export * from "@/types/data-types";
export * from "@/types/api-types";

// 业务主类型
export * from "@/types/blog-types";
export * from "@/types/docs-types";
export * from "@/types/journal-types";
export * from "@/types/search-types";
export * from "@/types/nav-types";

// MDX 相关类型
export * from "@/types/mdx-component-types";
export * from "@/types/metadata-types";

// 通用组件类型
export * from "@/types/common-component-types";

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
