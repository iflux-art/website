import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  try {
    // 设置请求头模拟浏览器
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      },
      // 设置超时
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // 提取网站信息
    const title = 
      $('meta[property="og:title"]').attr('content') ||
      $('meta[name="twitter:title"]').attr('content') ||
      $('title').text() ||
      '';

    const description = 
      $('meta[property="og:description"]').attr('content') ||
      $('meta[name="twitter:description"]').attr('content') ||
      $('meta[name="description"]').attr('content') ||
      '';

    // 提取图标
    let icon = '';
    const iconSelectors = [
      'link[rel="icon"]',
      'link[rel="shortcut icon"]',
      'link[rel="apple-touch-icon"]',
      'link[rel="apple-touch-icon-precomposed"]',
    ];

    for (const selector of iconSelectors) {
      const iconHref = $(selector).attr('href');
      if (iconHref) {
        icon = new URL(iconHref, url).href;
        break;
      }
    }

    // 如果没有找到图标，尝试默认路径
    if (!icon) {
      const urlObj = new URL(url);
      icon = `${urlObj.protocol}//${urlObj.hostname}/favicon.ico`;
    }

    const image = 
      $('meta[property="og:image"]').attr('content') ||
      $('meta[name="twitter:image"]').attr('content') ||
      '';

    return NextResponse.json({
      title: title.trim(),
      description: description.trim(),
      icon,
      image: image ? new URL(image, url).href : '',
    });

  } catch (error) {
    console.error('Error parsing website:', error);
    
    // 返回基础信息
    const urlObj = new URL(url);
    return NextResponse.json({
      title: urlObj.hostname.replace('www.', ''),
      description: '',
      icon: `${urlObj.protocol}//${urlObj.hostname}/favicon.ico`,
      image: '',
    });
  }
}
