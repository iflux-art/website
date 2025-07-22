import type { AIModel } from "packages/config/chat/ai-models";

// 内联 Message 类型定义
export interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
}

/**
 * AI对话功能
 * @param query 用户输入
 * @param messages 聊天历史
 * @param selectedModel 当前选中的模型
 */
export const performAIChat = async (
  query: string,
  messages: Message[],
  selectedModel: AIModel,
): Promise<string> => {
  try {
    const conversationHistory = messages.map((msg) => ({
      role: msg.type === "user" ? "user" : "assistant",
      content: msg.content,
    }));

    conversationHistory.push({ role: "user", content: query });

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: query,
        modelId: selectedModel.id,
        messages: conversationHistory,
      }),
    });

    if (!response.ok) {
      throw new Error(
        (await response.json()).error || `HTTP ${response.status}`,
      );
    }

    return (await response.json()).response || "抱歉，我无法生成回复。";
  } catch (error) {
    console.error("AI对话错误:", error);
    return `AI服务暂时不可用: ${error instanceof Error ? error.message : "未知错误"}`;
  }
};
