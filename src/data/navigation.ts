/**
 * 导航分类数据
 */
export const navigationCategories = [
  {
    id: 'ai',
    title: 'AI工具',
    description: '人工智能和机器学习相关工具',
    icon: '🤖',
    color: 'bg-[oklch(0.95_0.03_240)] dark:bg-[oklch(0.2_0.05_240)]'
  },
  {
    id: 'design',
    title: '设计资源',
    description: 'UI/UX设计工具和资源',
    icon: '🎨',
    color: 'bg-[oklch(0.95_0.03_300)] dark:bg-[oklch(0.2_0.05_300)]'
  },
  {
    id: 'development',
    title: '开发工具',
    description: '编程和开发相关工具',
    icon: '💻',
    color: 'bg-[oklch(0.95_0.03_140)] dark:bg-[oklch(0.2_0.05_140)]'
  },
  {
    id: 'productivity',
    title: '效率工具',
    description: '提高工作效率的应用和服务',
    icon: '⚡',
    color: 'bg-[oklch(0.95_0.03_80)] dark:bg-[oklch(0.2_0.05_80)]'
  }
];

/**
 * 精选资源数据
 */
export function getFeaturedResources() {
  return [
    {
      title: "Figma",
      description: "专业的在线设计工具，支持协作和原型设计",
      url: "https://www.figma.com",
      category: "设计",
      icon: "🎨",
      author: "Figma, Inc.",
      free: true
    },
    {
      title: "ChatGPT",
      description: "OpenAI开发的强大AI对话模型",
      url: "https://chat.openai.com",
      category: "AI",
      icon: "🤖",
      author: "OpenAI",
      free: true
    },
    {
      title: "VS Code",
      description: "微软开发的轻量级代码编辑器",
      url: "https://code.visualstudio.com",
      category: "开发",
      icon: "💻",
      author: "Microsoft",
      free: true
    }
  ];
}

/**
 * 最新资源数据
 */
export function getRecentResources() {
  return [
    {
      title: "Notion",
      description: "集笔记、知识库、任务管理于一体的协作平台",
      url: "https://www.notion.so",
      category: "效率",
      icon: "📝",
      author: "Notion Labs",
      free: true
    },
    {
      title: "Midjourney",
      description: "AI图像生成工具，可创建高质量艺术图像",
      url: "https://www.midjourney.com",
      category: "AI",
      icon: "🖼️",
      author: "Midjourney, Inc.",
      free: false
    },
    {
      title: "Vercel",
      description: "前端应用部署平台，支持Next.js等框架",
      url: "https://vercel.com",
      category: "开发",
      icon: "🚀",
      author: "Vercel, Inc.",
      free: true
    }
  ];
}

/**
 * AI工具资源数据
 */
export const aiResources = [
  {
    title: "ChatGPT",
    description: "OpenAI开发的强大AI对话模型，可用于文本生成、问答和创意写作",
    url: "https://chat.openai.com",
    category: "AI对话",
    icon: "🤖",
    author: "OpenAI",
    free: true
  },
  {
    title: "Midjourney",
    description: "AI图像生成工具，可创建高质量艺术图像和概念设计",
    url: "https://www.midjourney.com",
    category: "图像生成",
    icon: "🖼️",
    author: "Midjourney, Inc.",
    free: false
  },
  {
    title: "Runway ML",
    description: "创意AI工具集，支持视频编辑、图像生成和风格迁移",
    url: "https://runwayml.com",
    category: "创意AI",
    icon: "🎬",
    author: "Runway AI, Inc.",
    free: false
  },
  {
    title: "Hugging Face",
    description: "开源AI社区和平台，提供数千个预训练模型和数据集",
    url: "https://huggingface.co",
    category: "AI开发",
    icon: "🤗",
    author: "Hugging Face",
    free: true
  },
  {
    title: "Perplexity AI",
    description: "AI搜索引擎，提供准确的信息和引用来源",
    url: "https://www.perplexity.ai",
    category: "AI搜索",
    icon: "🔍",
    author: "Perplexity AI",
    free: true
  },
  {
    title: "Anthropic Claude",
    description: "先进的AI助手，专注于有帮助、诚实和无害的回答",
    url: "https://www.anthropic.com/claude",
    category: "AI对话",
    icon: "💬",
    author: "Anthropic",
    free: true
  }
];

/**
 * 设计资源数据
 */
export const designResources = [
  {
    title: "Figma",
    description: "专业的在线设计工具，支持协作和原型设计，是UI/UX设计师的首选工具",
    url: "https://www.figma.com",
    category: "设计工具",
    icon: "🎨",
    author: "Figma, Inc.",
    free: true
  },
  {
    title: "Dribbble",
    description: "设计师社区平台，展示UI、插画、网页和移动应用设计作品",
    url: "https://dribbble.com",
    category: "设计灵感",
    icon: "🏀",
    author: "Dribbble LLC",
    free: true
  },
  {
    title: "Behance",
    description: "创意作品展示平台，包含各类设计项目和创意作品集",
    url: "https://www.behance.net",
    category: "作品集",
    icon: "🎭",
    author: "Adobe",
    free: true
  },
  {
    title: "Coolors",
    description: "色彩搭配生成工具，帮助设计师快速创建和探索配色方案",
    url: "https://coolors.co",
    category: "配色工具",
    icon: "🎨",
    author: "Coolors",
    free: true
  },
  {
    title: "Unsplash",
    description: "免费高质量图片资源网站，提供可商用的摄影作品",
    url: "https://unsplash.com",
    category: "图片资源",
    icon: "📷",
    author: "Unsplash Inc.",
    free: true
  },
  {
    title: "Adobe Creative Cloud",
    description: "专业创意设计软件套件，包含Photoshop、Illustrator等工具",
    url: "https://www.adobe.com/creativecloud.html",
    category: "设计软件",
    icon: "🖌️",
    author: "Adobe Inc.",
    free: false
  }
];

/**
 * 开发工具资源数据
 */
export const developmentResources = [
  {
    title: "VS Code",
    description: "微软开发的轻量级代码编辑器，拥有丰富的插件生态系统",
    url: "https://code.visualstudio.com",
    category: "编辑器",
    icon: "💻",
    author: "Microsoft",
    free: true
  },
  {
    title: "GitHub",
    description: "代码托管和协作平台，支持Git版本控制和项目管理",
    url: "https://github.com",
    category: "版本控制",
    icon: "🐙",
    author: "GitHub, Inc.",
    free: true
  },
  {
    title: "Vercel",
    description: "前端应用部署平台，支持Next.js等框架的自动部署和预览",
    url: "https://vercel.com",
    category: "部署",
    icon: "🚀",
    author: "Vercel, Inc.",
    free: true
  },
  {
    title: "Stack Overflow",
    description: "程序员问答社区，解决编程问题的最大资源库",
    url: "https://stackoverflow.com",
    category: "社区",
    icon: "❓",
    author: "Stack Exchange Inc.",
    free: true
  },
  {
    title: "MDN Web Docs",
    description: "Web技术文档库，提供HTML、CSS和JavaScript等详细参考资料",
    url: "https://developer.mozilla.org",
    category: "文档",
    icon: "📚",
    author: "Mozilla",
    free: true
  },
  {
    title: "CodePen",
    description: "在线代码编辑器和社区，用于测试和展示HTML、CSS和JavaScript代码片段",
    url: "https://codepen.io",
    category: "工具",
    icon: "✏️",
    author: "CodePen",
    free: true
  }
];

/**
 * 效率工具资源数据
 */
export const productivityResources = [
  {
    title: "Notion",
    description: "集笔记、知识库、任务管理于一体的协作平台，提高团队协作效率",
    url: "https://www.notion.so",
    category: "全能工具",
    icon: "📝",
    author: "Notion Labs",
    free: true
  },
  {
    title: "Trello",
    description: "可视化项目管理工具，基于看板方法组织任务和工作流程",
    url: "https://trello.com",
    category: "项目管理",
    icon: "📋",
    author: "Atlassian",
    free: true
  },
  {
    title: "Todoist",
    description: "简洁高效的任务管理应用，帮助用户组织日常工作和生活",
    url: "https://todoist.com",
    category: "任务管理",
    icon: "✅",
    author: "Doist",
    free: true
  },
  {
    title: "Obsidian",
    description: "基于本地Markdown文件的知识库工具，支持双向链接和图谱可视化",
    url: "https://obsidian.md",
    category: "知识管理",
    icon: "🧠",
    author: "Obsidian",
    free: true
  },
  {
    title: "Grammarly",
    description: "AI驱动的写作助手，提供拼写、语法检查和写作建议",
    url: "https://www.grammarly.com",
    category: "写作工具",
    icon: "✍️",
    author: "Grammarly, Inc.",
    free: true
  },
  {
    title: "Calendly",
    description: "智能日程安排工具，简化会议预约流程，避免来回邮件沟通",
    url: "https://calendly.com",
    category: "日程管理",
    icon: "📅",
    author: "Calendly LLC",
    free: true
  }
];