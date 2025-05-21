import { NextResponse } from 'next/server';

export const runtime = 'edge';

/**
 * 获取网站图标 API
 * 
 * 使用 Google 的 favicon 服务获取网站图标
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');
    
    if (!url) {
      return NextResponse.json(
        { error: '缺少 url 参数' },
        { status: 400 }
      );
    }
    
    // 解析域名
    let domain;
    try {
      domain = new URL(url).hostname;
    } catch (error) {
      return NextResponse.json(
        { error: '无效的 URL' },
        { status: 400 }
      );
    }
    
    // 返回 Google 的 favicon 服务 URL
    const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    
    return NextResponse.json({ faviconUrl });
  } catch (error) {
    console.error('获取网站图标失败:', error);
    return NextResponse.json(
      { error: '获取网站图标失败' },
      { status: 500 }
    );
  }
}
