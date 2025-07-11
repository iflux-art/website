import type { LucideIcon } from "lucide-react";

export interface Category {
  id: string;
  name: string;
  icon?: LucideIcon;
}

export interface TagType {
  name: string;
  count: number;
}

export interface FilterableItem {
  tags?: string[];
  category?: string;
}
