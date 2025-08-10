/**
 * Links 功能相关类型定义
 * 统一管理 links 相关类型定义，供前后端、hooks、组件复用
 */

export type CategoryId =
  | "ai"
  | "ai-chat"
  | "ai-image"
  | "ai-code"
  | "ai-writing"
  | "development"
  | "dev-editor"
  | "dev-framework"
  | "dev-api"
  | "dev-deploy"
  | "design"
  | "design-tool"
  | "design-icon"
  | "design-color"
  | "design-font"
  | "audio"
  | "video"
  | "office"
  | "office-doc"
  | "office-meeting"
  | "office-project"
  | "productivity"
  | "productivity-note"
  | "productivity-time"
  | "productivity-automation"
  | "operation"
  | "profile"
  | "friends";

/** 链接子分类 */
export interface LinksSubCategory {
  id: CategoryId;
  name: string;
  description?: string;
  icon?: string;
  order?: number;
}

/** 链接分类 */
export interface LinksCategory {
  id: CategoryId;
  name: string;
  description?: string;
  icon?: string;
  order?: number;
  collapsible?: boolean; // 是否支持折叠
  children?: LinksSubCategory[]; // 子分类
}

/** 链接条目 */
export interface LinksItem {
  id: string;
  title: string;
  description: string;
  url: string;
  icon: string;
  iconType?: "image" | "text";
  tags: string[];
  featured: boolean;
  category: CategoryId;
  createdAt?: string;
  updatedAt?: string;
}

// 表单数据类型（如有需要）
export interface LinksFormData {
  title: string;
  description: string;
  url: string;
  icon: string;
  iconType: "image" | "text";
  tags: string[];
  featured: boolean;
  category: CategoryId;
}
