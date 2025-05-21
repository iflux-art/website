import { NextResponse } from 'next/server';

export const runtime = 'edge';

/**
 * 获取精选资源
 */
export async function GET() {
  try {
    // 精选资源数据
    const featuredResources = [
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
    
    return NextResponse.json(featuredResources);
  } catch (error) {
    console.error('获取精选资源失败:', error);
    return NextResponse.json(
      { error: '获取精选资源失败' },
      { status: 500 }
    );
  }
}
