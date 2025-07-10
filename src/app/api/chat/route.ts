import { NextRequest, NextResponse } from "next/server";
import { getModelById, getApiModelName } from "@/data/home/ai-models";
import { ModelNotFoundError } from "@/lib/errors";
import type { ChatMessage, ApiRequestBody } from "@/types";

export async function POST(request: NextRequest) {
  try {
    // 验证请求体
    const requestBody = await request.json();

    // 手动验证请求体
    if (
      !requestBody.message ||
      typeof requestBody.message !== "string" ||
      requestBody.message.trim().length === 0
    ) {
      return NextResponse.json(
        { error: { code: "BadRequest", message: "消息内容不能为空" } },
        { status: 400 },
      );
    }

    const message = requestBody.message;
    const modelId = requestBody.modelId || "deepseek-chat";
    const conversationHistory = requestBody.messages;

    // 获取模型配置
    const model = getModelById(modelId);
    if (!model) {
      const error = new ModelNotFoundError(modelId);
      return NextResponse.json(
        { error: { code: error.name, message: error.message } },
        { status: error.statusCode },
      );
    }

    // 检查API密钥
    const apiKey = process.env[model.apiKeyEnv];
    if (!apiKey || apiKey === `your_${model.apiKeyEnv.toLowerCase()}_here`) {
      return NextResponse.json(
        {
          error: {
            code: "ApiKeyNotConfiguredError",
            message: `${model.name} API密钥未配置，请在环境变量中配置后重试。`,
          },
        },
        { status: 403 },
      );
    }

    // 构建消息历史，包含系统提示和对话历史
    const messages: ChatMessage[] = [];

    // 如果有对话历史，添加到消息中（排除系统消息）
    if (conversationHistory && Array.isArray(conversationHistory)) {
      const userMessages: ChatMessage[] = conversationHistory.filter(
        (msg): msg is ChatMessage => msg.role !== "system",
      );
      messages.push(...userMessages);
    } else {
      // 如果没有对话历史，只添加当前消息
      messages.push({
        role: "user",
        content: message,
      });
    }

    // 构建请求体
    const apiRequestPayload: ApiRequestBody = {
      messages,
      temperature: model.temperature,
      max_tokens: model.maxTokens,
      stream: false,
    };

    // 根据不同的模型设置不同的参数
    apiRequestPayload.model = getApiModelName(model.id);

    // 构建请求头
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    };

    // OpenRouter 需要额外的头部
    if (model.id.includes("openrouter")) {
      headers["HTTP-Referer"] =
        process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
      headers["X-Title"] = "AI Search Assistant";
    }

    // 智谱AI 需要特殊的认证方式
    if (model.id === "zhipu-glm") {
      // 智谱AI使用JWT token认证
      headers["Authorization"] = `Bearer ${apiKey}`;
    }

    // MiniMax 需要特殊的头部
    if (model.id === "minimax-chat") {
      headers["Authorization"] = `Bearer ${apiKey}`;
      headers["Content-Type"] = "application/json";
    }

    // 调用AI API
    // 优化API请求处理
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10秒超时

    try {
      const response = await fetch(model.apiUrl, {
        method: "POST",
        headers,
        body: JSON.stringify(apiRequestPayload),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.text();
        console.error(`${model.name} API错误:`, errorData);
        let errorMessage = `${model.name} API请求失败: ${response.status}`;
        try {
          const errorJson = JSON.parse(errorData);
          if (errorJson.error?.message) {
            errorMessage = errorJson.error.message;
            if (
              errorMessage.includes("Insufficient Balance") ||
              errorMessage.includes("quota")
            ) {
              errorMessage = `${model.name} API余额不足，请充值后继续使用。`;
            }
          }
        } catch {
          // 忽略JSON解析错误，使用默认错误信息
        }
        return NextResponse.json(
          { error: errorMessage },
          { status: response.status },
        );
      }

      const data = await response.json();
      const aiResponse =
        data.choices?.[0]?.message?.content || "抱歉，我无法生成回复。";

      return NextResponse.json({
        success: true,
        response: aiResponse,
        usage: data.usage,
        model: model.name,
        isDemo: false,
      });
    } catch (error: any) {
      clearTimeout(timeoutId);
      if (error?.name === "AbortError") {
        console.error(`${model.name} API请求超时`);
        return NextResponse.json(
          {
            error: {
              code: "TimeoutError",
              message: `${model.name} API请求超时`,
            },
          },
          { status: 504 },
        );
      }
      console.error("API路由错误:", error);
      return NextResponse.json(
        { error: { code: "InternalServerError", message: "服务器内部错误" } },
        { status: 500 },
      );
    }
  } catch {
    return NextResponse.json(
      { error: { code: "BadRequest", message: "请求参数错误" } },
      { status: 400 },
    );
  }
}
