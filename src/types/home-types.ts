// home-types.ts
// 归档 home 相关所有 props/type/interface 类型

import type { AIModel } from "@/data/home/ai-models";

// Greeting 组件 props
export interface GreetingProps {
  className?: string;
}

// RecommendationTags 组件 props
export interface RecommendationTagsProps {
  className?: string;
}

// SearchBox 组件 props
export interface SearchBoxProps {
  className?: string;
  onSearchModeChange?: (isSearchMode: boolean) => void;
}

// ModelSelector 组件 props
export interface ModelSelectorProps {
  selectedModelId: string;
  onSelect: (id: string) => void;
  AI_MODELS: AIModel[];
  className?: string;
}

// Message 类型（AI 聊天消息）
export interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
  aiResponse?: string;
}
