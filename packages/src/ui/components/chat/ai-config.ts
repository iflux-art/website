// AI相关样式常量
export const AI_STYLES = {
  button: "bg-gradient-to-r text-white rounded-lg px-4 py-2",
  input: "border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500",
  card: "bg-white rounded-xl shadow-md p-4",
};

import type { AIModel } from "packages/src/config/chat/ai-models";
export {
  AI_MODELS,
  getDefaultModel,
  getModelById,
} from "packages/src/config/chat/ai-models";
export type { AIModel }; 