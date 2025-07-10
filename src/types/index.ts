// 基础类型
export * from "./base-types";
export * from "./data-types";
export * from "./api-types";

// 应用特定类型
export * from "./blog-types";
export * from "./docs-types";
export * from "./journal-types";
export * from "./links-types";
export * from "./search-types";
export * from "./tools-types";
export * from "./nav-types";

// MDX 相关类型
export * from "./mdx-core-types";
export * from "./mdx-component-types";

// Hooks 相关类型
export * from "./hooks";

// 内容相关类型
export * from "./content";

// Web Vitals 相关类型
export * from "./web-vitals-types";

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
