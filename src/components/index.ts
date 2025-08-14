/**
 * 通用组件统一导出
 * 业务相关组件已移动到对应的 features 目录
 */

// 通用布局组件
export * from "./layout";

// 通用内容组件
export * from "./content";

// 通用侧边栏组件
export * from "./sidebar";

// 通用按钮组件
export * from "./button";

// 通用MDX组件
export * from "./mdx";

// 其他通用组件
export { ThemeProvider } from "./theme-provider";

// 业务相关组件已移动到：
// - Links 相关 -> @/features/links/components
// - Blog 相关 -> @/features/blog/components
// - Docs 相关 -> @/features/docs/components
// - Admin 相关 -> @/features/admin/components

// 注意：以下目录没有index.ts文件，需要直接导入具体组件：
// - ui/ (shadcn/ui组件)
// - navbar/
// - comment/
