// 基础类型
export * from "./common";

// 应用特定类型
export * from "./blog-types";
export * from "./docs-types";
export * from "./journal-types";
export * from "./links-types";
export * from "./search-types";
export * from "./mdx-types";
export * from "./nav-types";

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

// hooks
export * from "./hooks";
export * from "./hooks-internal";
