// AI模型配置
export interface SearchResult {
  title: string;
  content: string;
  url?: string;
  score?: number;
}

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
  supportedModes: ('ai' | 'local' | 'web')[];
}

export const AI_MODELS: AIModel[] = [
  {
    id: 'none',
    name: '选择模型',
    provider: 'None',
    description: '本地搜索，不使用AI回答',
    icon: 'Bot',
    color: 'from-gray-400 to-gray-600',
    apiUrl: '',
    apiKeyEnv: '',
    maxTokens: 0,
    temperature: 0,
    supportedModes: ['local', 'web'],
  },
  {
    id: 'silicon-flow-qwen',
    name: 'Qwen (硅基流动)',
    provider: 'SiliconFlow',
    description: '通义千问模型，中文理解能力强',
    icon: 'Bot',
    color: 'from-cyan-500 to-blue-500',
    apiUrl: 'https://api.siliconflow.cn/v1/chat/completions',
    apiKeyEnv: 'SILICONFLOW_API_KEY',
    maxTokens: 2000,
    temperature: 0.7,
    supportedModes: ['ai', 'local', 'web'],
  },
  {
    id: 'silicon-flow-llama',
    name: 'Llama (硅基流动)',
    provider: 'SiliconFlow',
    description: 'Meta Llama 模型，开源强大',
    icon: 'Bot',
    color: 'from-orange-500 to-red-500',
    apiUrl: 'https://api.siliconflow.cn/v1/chat/completions',
    apiKeyEnv: 'SILICONFLOW_API_KEY',
    maxTokens: 2000,
    temperature: 0.7,
    supportedModes: ['ai', 'local', 'web'],
  },
  {
    id: 'openrouter-claude',
    name: 'Claude (OpenRouter)',
    provider: 'OpenRouter',
    description: 'Anthropic Claude 模型',
    icon: 'Bot',
    color: 'from-purple-500 to-pink-500',
    apiUrl: 'https://openrouter.ai/api/v1/chat/completions',
    apiKeyEnv: 'OPENROUTER_API_KEY',
    maxTokens: 2000,
    temperature: 0.7,
    supportedModes: ['ai', 'local', 'web'],
  },
  {
    id: 'openrouter-gemini',
    name: 'Gemini (OpenRouter)',
    provider: 'OpenRouter',
    description: 'Google Gemini 模型',
    icon: 'Bot',
    color: 'from-blue-500 to-green-500',
    apiUrl: 'https://openrouter.ai/api/v1/chat/completions',
    apiKeyEnv: 'OPENROUTER_API_KEY',
    maxTokens: 2000,
    temperature: 0.7,
    supportedModes: ['ai', 'local', 'web'],
  },
  {
    id: 'moonshot-v1',
    name: 'Moonshot (Kimi)',
    provider: 'Moonshot',
    description: 'Moonshot AI 大模型，长文本处理能力强',
    icon: 'Bot',
    color: 'from-indigo-500 to-purple-500',
    apiUrl: 'https://api.moonshot.cn/v1/chat/completions',
    apiKeyEnv: 'MOONSHOT_API_KEY',
    maxTokens: 2000,
    temperature: 0.7,
    supportedModes: ['ai', 'local', 'web'],
  },
  {
    id: 'zhipu-glm',
    name: 'GLM (智谱AI)',
    provider: 'ZhipuAI',
    description: '智谱AI GLM 模型，中文能力优秀',
    icon: 'Bot',
    color: 'from-teal-500 to-blue-500',
    apiUrl: 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
    apiKeyEnv: 'ZHIPU_API_KEY',
    maxTokens: 2000,
    temperature: 0.7,
    supportedModes: ['ai', 'local', 'web'],
  },
  {
    id: 'baichuan-chat',
    name: 'Baichuan (百川)',
    provider: 'Baichuan',
    description: '百川智能大模型，中文理解优秀',
    icon: 'Bot',
    color: 'from-green-600 to-blue-600',
    apiUrl: 'https://api.baichuan-ai.com/v1/chat/completions',
    apiKeyEnv: 'BAICHUAN_API_KEY',
    maxTokens: 2000,
    temperature: 0.7,
    supportedModes: ['ai', 'local', 'web'],
  },
  {
    id: 'minimax-chat',
    name: 'MiniMax',
    provider: 'MiniMax',
    description: 'MiniMax 大模型，多模态能力强',
    icon: 'Bot',
    color: 'from-yellow-500 to-orange-500',
    apiUrl: 'https://api.minimax.chat/v1/text/chatcompletion_v2',
    apiKeyEnv: 'MINIMAX_API_KEY',
    maxTokens: 2000,
    temperature: 0.7,
    supportedModes: ['ai', 'local', 'web'],
  },
];

// 获取默认模型
export const getDefaultModel = (): AIModel => {
  return AI_MODELS[0]; // DeepSeek 作为默认模型
};

// 根据ID获取模型
export const getModelById = (id: string): AIModel | undefined => {
  return AI_MODELS.find(model => model.id === id);
};

// 获取可用的模型（检查环境变量）
export const getAvailableModels = (): AIModel[] => {
  return AI_MODELS.filter(model => {
    const apiKey = process.env[model.apiKeyEnv];
    return apiKey && apiKey !== `your_${model.apiKeyEnv.toLowerCase()}_here`;
  });
};

// 生成演示回复的函数
export const generateDemoResponse = (
  message: string,
  searchMode: string,
  searchResults?: SearchResult[],
  modelName: string = 'AI'
): string => {
  const responses = {
    ai: [
      `关于"${message}"，这是一个很有趣的问题。根据我的理解，我可以从以下几个方面来分析...`,
      `针对您提到的"${message}"，我建议可以从这些角度来思考：首先是基础概念的理解，其次是实际应用场景...`,
      `您的问题"${message}"涉及到多个层面。让我为您详细解答一下相关的要点和建议...`,
    ],
    local: [
      `基于本地搜索结果，关于"${message}"的问题，我找到了以下相关内容：\n\n${
        searchResults?.map((r, i) => `${i + 1}. ${r.title}: ${r.content}`).join('\n') ||
        '暂无相关结果'
      }\n\n结合这些信息，我建议...`,
      `根据本地文档和工具的搜索结果，"${message}"相关的内容如下：\n\n${
        searchResults?.map(r => `• ${r.title} - ${r.content}`).join('\n') || '未找到相关内容'
      }\n\n基于这些资源，您可以...`,
    ],
    web: [
      `通过网络搜索"${message}"，我找到了以下相关信息：\n\n${
        searchResults
          ?.map((r, i) => `${i + 1}. ${r.title}\n   ${r.content}\n   来源：${r.url}`)
          .join('\n\n') || '暂无网络搜索结果'
      }\n\n综合这些网络资源，我的建议是...`,
      `基于网络搜索结果，关于"${message}"的最新信息如下：\n\n${
        searchResults?.map(r => `• ${r.title} (${r.url})\n  ${r.content}`).join('\n\n') ||
        '未找到相关网络内容'
      }\n\n根据这些信息，您可以进一步...`,
    ],
  };

  const modeResponses = responses[searchMode as keyof typeof responses] || responses.ai;
  const randomResponse = modeResponses[Math.floor(Math.random() * modeResponses.length)];

  return `🤖 **${modelName} 演示模式回复**\n\n${randomResponse}\n\n---\n💡 *这是演示回复。要获得真实的AI回答，请配置有效的API密钥。*`;
};
