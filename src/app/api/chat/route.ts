import { NextRequest, NextResponse } from "next/server";
import {
  getModelById,
  generateDemoResponse,
} from "@/components/layout/home/data/ai-models";
import { z } from "zod";
import { ChatMessageSchema, ApiRequestBodySchema } from "@/lib/schemas/chat";
import type { SearchResult as AISearchResult } from "@/components/layout/home/data/ai-models";

// 定义ChatMessage类型
type ChatMessage = z.infer<typeof ChatMessageSchema>;

export async function POST(request: NextRequest) {
  try {
    // 验证请求体
    const requestBody = await request.json();
    const {
      message,
      searchMode,
      searchResults,
      modelId = "deepseek-chat",
      messages: conversationHistory,
    } = z
      .object({
        message: z.string().min(1),
        searchMode: z.enum(["ai", "local", "web"]),
        searchResults: z
          .array(
            z.object({
              title: z.string(),
              excerpt: z.string(),
              path: z.string(),
              type: z.string(),
              icon: z.string().optional(),
            }),
          )
          .optional(),
        modelId: z.string().optional(),
        messages: z.array(ChatMessageSchema).optional(),
      })
      .parse(requestBody);

    // 获取模型配置
    const model = getModelById(modelId);
    if (!model) {
      return NextResponse.json(
        { error: `未找到模型: ${modelId}` },
        { status: 400 },
      );
    }

    // 检查API密钥
    const apiKey = process.env[model.apiKeyEnv];
    if (!apiKey || apiKey === `your_${model.apiKeyEnv.toLowerCase()}_here`) {
      // 转换搜索结果类型
      const convertedResults = searchResults?.map(
        (result) =>
          ({
            title: result.title,
            content: result.excerpt,
            url: result.path,
            score: 0, // 默认分数
            icon: "🔍", // 默认搜索图标
          }) as AISearchResult,
      );

      // 返回演示回复
      const demoResponse = generateDemoResponse(
        message,
        searchMode,
        convertedResults,
        model.name,
      );
      return NextResponse.json({
        success: true,
        response: demoResponse,
        isDemo: true,
        message: `${model.name} API密钥未配置，当前为演示模式`,
        model: model.name,
      });
    }

    // 根据搜索模式构建不同的提示词
    let systemPrompt = "";
    const userMessage = message;

    if (searchMode === "ai") {
      // 纯AI对话模式
      systemPrompt = `你是一个智能助手，请用中文回答用户的问题。回答要准确、有用、友好。

回答格式要求：
1. 使用清晰的段落结构
2. 重要信息用**粗体**标记
3. 列表使用数字或项目符号
4. 适当使用换行保持可读性
5. 回答要有逻辑性和条理性`;
    } else if (searchMode === "local") {
      // 本地搜索模式
      systemPrompt = `你是一个智能助手，用户正在搜索本地内容。请基于以下搜索结果回答用户的问题：\n\n搜索结果：\n$${
        searchResults
          ?.map(
            (result, index) =>
              `${index + 1}. ${result.title}: ${result.excerpt}`,
          )
          .join("\n") || "暂无搜索结果"
      }\n\n请结合这些搜索结果，用中文为用户提供准确、有用的回答。如果搜索结果与问题相关，请引用相关内容；如果搜索结果不够充分，请基于你的知识补充回答。\n\n回答格式要求：\n1. 使用清晰的段落结构\n2. 重要信息用**粗体**标记\n3. 列表使用数字或项目符号\n4. 适当使用换行保持可读性`;
    } else if (searchMode === "web") {
      // 联网搜索模式
      systemPrompt = `你是一个智能助手，用户正在搜索网络内容。请基于以下网络搜索结果回答用户的问题：\n\n网络搜索结果：\n$${
        searchResults
          ?.map(
            (result, index) =>
              `${index + 1}. ${result.title}: ${result.excerpt} (来源: ${result.path})`,
          )
          .join("\n") || "暂无搜索结果"
      }\n\n请结合这些网络搜索结果，用中文为用户提供准确、有用的回答。如果搜索结果与问题相关，请引用相关内容和来源；如果搜索结果不够充分，请基于你的知识补充回答。\n\n回答格式要求：\n1. 使用清晰的段落结构\n2. 重要信息用**粗体**标记\n3. 列表使用数字或项目符号\n4. 适当使用换行保持可读性`;
    }

    // 构建消息历史，包含系统提示和对话历史
    const messages: ChatMessage[] = [
      {
        role: "system",
        content: systemPrompt,
      },
    ];

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
        content: userMessage,
      });
    }

    // 构建请求体
    const apiRequestPayload = ApiRequestBodySchema.parse({
      messages,
      temperature: model.temperature,
      max_tokens: model.maxTokens,
      stream: false,
    });

    // 根据不同的模型设置不同的参数
    if (model.id.includes("deepseek")) {
      apiRequestPayload.model = "deepseek-chat";
    } else if (model.id === "silicon-flow-qwen") {
      apiRequestPayload.model = "Qwen/Qwen2.5-7B-Instruct";
    } else if (model.id === "silicon-flow-deepseek") {
      apiRequestPayload.model = "deepseek-ai/DeepSeek-V2.5";
    } else if (model.id === "silicon-flow-llama") {
      apiRequestPayload.model = "meta-llama/Meta-Llama-3.1-8B-Instruct";
    } else if (model.id === "openrouter-gpt4") {
      apiRequestPayload.model = "openai/gpt-4-turbo";
    } else if (model.id === "openrouter-claude") {
      apiRequestPayload.model = "anthropic/claude-3.5-sonnet";
    } else if (model.id === "openrouter-gemini") {
      apiRequestPayload.model = "google/gemini-pro-1.5";
    } else if (model.id.includes("github")) {
      apiRequestPayload.model = "gpt-4";
    } else if (model.id === "moonshot-v1") {
      apiRequestPayload.model = "moonshot-v1-8k";
    } else if (model.id === "zhipu-glm") {
      apiRequestPayload.model = "glm-4";
    } else if (model.id === "baichuan-chat") {
      apiRequestPayload.model = "Baichuan2-Turbo";
    } else if (model.id === "minimax-chat") {
      apiRequestPayload.model = "abab6.5s-chat";
    }

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
    const response = await fetch(model.apiUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(apiRequestPayload),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error(`${model.name} API错误:`, errorData);

      // 解析错误信息
      let errorMessage = `${model.name} API请求失败: ${response.status}`;
      try {
        const errorJson = JSON.parse(errorData);
        if (errorJson.error?.message) {
          errorMessage = errorJson.error.message;

          // 特殊处理余额不足的情况
          if (
            errorMessage.includes("Insufficient Balance") ||
            errorMessage.includes("quota")
          ) {
            errorMessage = `${model.name} API余额不足，请充值后继续使用。当前将使用演示模式回复。`;

            // 转换搜索结果类型
            const convertedResults = searchResults?.map(
              (result) =>
                ({
                  title: result.title,
                  content: result.excerpt, // 使用 excerpt 代替 description
                  url: result.path, // 使用 path 代替 url
                }) as AISearchResult,
            );

            // 返回演示回复
            const demoResponse = generateDemoResponse(
              message,
              searchMode,
              convertedResults,
              model.name,
            );
            return NextResponse.json({
              success: true,
              response: demoResponse,
              isDemo: true,
              model: model.name,
            });
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

    // 提取AI回复
    const aiResponse =
      data.choices?.[0]?.message?.content || "抱歉，我无法生成回复。";

    return NextResponse.json({
      success: true,
      response: aiResponse,
      usage: data.usage,
      model: model.name,
      isDemo: false,
    });
  } catch (error) {
    console.error("API路由错误:", error);
    return NextResponse.json({ error: "服务器内部错误" }, { status: 500 });
  }
}
