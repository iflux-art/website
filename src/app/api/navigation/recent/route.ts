import { NextResponse } from 'next/server';

export const runtime = 'edge';

/**
 * 获取最新资源
 */
export async function GET() {
  try {
    // 最新资源数据
    const recentResources = [
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
    
    return NextResponse.json(recentResources);
  } catch (error) {
    console.error('获取最新资源失败:', error);
    return NextResponse.json(
      { error: '获取最新资源失败' },
      { status: 500 }
    );
  }
}
