import { useState } from "react";
import { AI_MODELS, getModelById } from "@/data/home/ai-models";
import { performAIChat } from "@/components/layout/home/ai/ai-service";
import type { Message } from "@/types/home-types";

export function useAIChat() {
  const [selectedModelId, setSelectedModelId] = useState(AI_MODELS[0].id);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (inputValue: string) => {
    if (!inputValue.trim()) return;
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue.trim(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    try {
      const selectedModel = getModelById(selectedModelId) || AI_MODELS[0];
      const aiResponse = await performAIChat(
        userMessage.content,
        [...messages, userMessage],
        selectedModel,
      );
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: aiResponse,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "处理请求时出现未知错误";
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: `❌ 抱歉，处理您的请求时出现了错误：${errorMessage}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([]);
  };

  return {
    selectedModelId,
    setSelectedModelId,
    messages,
    setMessages,
    isLoading,
    handleSend,
    handleClear,
  };
}
