/**
 * AI模型数据
 * 包含支持的AI模型配置
 */

export interface AIModel {
  id: string;
  name: string;
  provider: string;
  description: string;
  icon: string;
  color: string;
  apiUrl: string;
  apiKeyEnv: string;
  maxTokens: number;
  temperature: number;
}

export const AI_MODELS: AIModel[] = [
  {
    id: "silicon-flow-qwen",
    name: "Qwen (硅基流动)",
    provider: "SiliconFlow",
    description: "通义千问模型，中文理解能力强",
    icon: "Bot",
    color: "from-cyan-500 to-blue-500",
    apiUrl: "https://api.siliconflow.cn/v1/chat/completions",
    apiKeyEnv: "SILICONFLOW_API_KEY",
    maxTokens: 2000,
    temperature: 0.7,
  },
  {
    id: "silicon-flow-llama",
    name: "Llama (硅基流动)",
    provider: "SiliconFlow",
    description: "Meta Llama 模型，开源强大",
    icon: "Bot",
    color: "from-orange-500 to-red-500",
    apiUrl: "https://api.siliconflow.cn/v1/chat/completions",
    apiKeyEnv: "SILICONFLOW_API_KEY",
    maxTokens: 2000,
    temperature: 0.7,
  },
  {
    id: "openrouter-claude",
    name: "Claude (OpenRouter)",
    provider: "OpenRouter",
    description: "Anthropic Claude 模型",
    icon: "Bot",
    color: "from-purple-500 to-pink-500",
    apiUrl: "https://openrouter.ai/api/v1/chat/completions",
    apiKeyEnv: "OPENROUTER_API_KEY",
    maxTokens: 2000,
    temperature: 0.7,
  },
  {
    id: "openrouter-gemini",
    name: "Gemini (OpenRouter)",
    provider: "OpenRouter",
    description: "Google Gemini 模型",
    icon: "Bot",
    color: "from-blue-500 to-green-500",
    apiUrl: "https://openrouter.ai/api/v1/chat/completions",
    apiKeyEnv: "OPENROUTER_API_KEY",
    maxTokens: 2000,
    temperature: 0.7,
  },
  {
    id: "moonshot-v1",
    name: "Moonshot (Kimi)",
    provider: "Moonshot",
    description: "Moonshot AI 大模型，长文本处理能力强",
    icon: "Bot",
    color: "from-indigo-500 to-purple-500",
    apiUrl: "https://api.moonshot.cn/v1/chat/completions",
    apiKeyEnv: "MOONSHOT_API_KEY",
    maxTokens: 2000,
    temperature: 0.7,
  },
  {
    id: "zhipu-glm",
    name: "GLM (智谱AI)",
    provider: "ZhipuAI",
    description: "智谱AI GLM 模型，中文能力优秀",
    icon: "Bot",
    color: "from-teal-500 to-blue-500",
    apiUrl: "https://open.bigmodel.cn/api/paas/v4/chat/completions",
    apiKeyEnv: "ZHIPU_API_KEY",
    maxTokens: 2000,
    temperature: 0.7,
  },
  {
    id: "baichuan-chat",
    name: "Baichuan (百川)",
    provider: "Baichuan",
    description: "百川智能大模型，中文理解优秀",
    icon: "Bot",
    color: "from-green-600 to-blue-600",
    apiUrl: "https://api.baichuan-ai.com/v1/chat/completions",
    apiKeyEnv: "BAICHUAN_API_KEY",
    maxTokens: 2000,
    temperature: 0.7,
  },
  {
    id: "minimax-chat",
    name: "MiniMax",
    provider: "MiniMax",
    description: "MiniMax 大模型，多模态能力强",
    icon: "Bot",
    color: "from-yellow-500 to-orange-500",
    apiUrl: "https://api.minimax.chat/v1/text/chatcompletion_v2",
    apiKeyEnv: "MINIMAX_API_KEY",
    maxTokens: 2000,
    temperature: 0.7,
  },
];

/**
 * 获取默认模型
 * @returns 默认模型
 */
export const getDefaultModel = (): AIModel => {
  return AI_MODELS[0];
};

/**
 * 根据ID获取模型
 * @param id 模型ID
 * @returns 匹配的模型或undefined
 */
export const getModelById = (id: string): AIModel | undefined => {
  return AI_MODELS.find((model) => model.id === id);
};

/**
 * 获取模型对应的API请求模型名称
 * @param modelId 模型ID
 * @returns API请求使用的模型名称
 */
export const getApiModelName = (modelId: string): string => {
  if (modelId.includes("deepseek")) return "deepseek-chat";
  if (modelId === "silicon-flow-qwen") return "Qwen/Qwen2.5-7B-Instruct";
  if (modelId === "silicon-flow-deepseek") return "deepseek-ai/DeepSeek-V2.5";
  if (modelId === "silicon-flow-llama")
    return "meta-llama/Meta-Llama-3.1-8B-Instruct";
  if (modelId === "openrouter-gpt4") return "openai/gpt-4-turbo";
  if (modelId === "openrouter-claude") return "anthropic/claude-3.5-sonnet";
  if (modelId === "openrouter-gemini") return "google/gemini-pro-1.5";
  if (modelId.includes("github")) return "gpt-4";
  if (modelId === "moonshot-v1") return "moonshot-v1-8k";
  if (modelId === "zhipu-glm") return "glm-4";
  if (modelId === "baichuan-chat") return "Baichuan2-Turbo";
  if (modelId === "minimax-chat") return "abab6.5s-chat";
  return "gpt-4"; // default fallback
}; 