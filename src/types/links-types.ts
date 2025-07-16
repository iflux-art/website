// links-types.ts
// 统一管理 links 相关类型定义，供前后端、hooks、组件复用

export type CategoryId =
  | "ai"
  | "development"
  | "design"
  | "audio"
  | "video"
  | "office"
  | "productivity"
  | "operation"
  | "profile"
  | "friends";

export interface LinksCategory {
  id: string;
  name: string;
  description: string;
  order: number;
  icon?: string;
  color?: string;
}

export interface LinksItem {
  id: string;
  title: string;
  description: string;
  url: string;
  icon?: string;
  iconType?: "image" | "text";
  tags: string[];
  featured?: boolean;
  category: CategoryId;
  createdAt: string;
  updatedAt: string;
  visits?: number;
  isActive?: boolean;
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
