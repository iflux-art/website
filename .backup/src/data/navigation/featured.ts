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