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

export interface Category {
  id: CategoryId;
  name: string;
  description: string;
  order: number;
}

export interface Item {
  id: string;
  title: string;
  description: string;
  url: string;
  icon: string;
  iconType: "image" | "text";
  tags: string[];
  featured: boolean;
  category: CategoryId;
  createdAt: string;
  updatedAt: string;
}
