'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Copy, Check, Link as LinkIcon, ExternalLink, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface ShortenedUrl {
  id: string;
  originalUrl: string;
  shortCode: string;
  shortUrl: string;
  createdAt: Date;
  clicks: number;
}

export default function UrlShortenerPage() {
  const [originalUrl, setOriginalUrl] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [shortenedUrls, setShortenedUrls] = useState<ShortenedUrl[]>([]);
  const [copied, setCopied] = useState<string | null>(null);
  const [error, setError] = useState('');

  // 验证 URL 格式
  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // 生成随机短码
  const generateShortCode = (): string => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  // 检查短码是否已存在
  const isCodeExists = (code: string): boolean => {
    return shortenedUrls.some(url => url.shortCode === code);
  };

  // 缩短 URL
  const shortenUrl = () => {
    if (!originalUrl.trim()) {
      setError('请输入要缩短的 URL');
      return;
    }

    if (!isValidUrl(originalUrl)) {
      setError('请输入有效的 URL 格式');
      return;
    }

    let shortCode = customCode.trim();
    
    // 如果没有自定义短码，生成随机短码
    if (!shortCode) {
      do {
        shortCode = generateShortCode();
      } while (isCodeExists(shortCode));
    } else {
      // 验证自定义短码
      if (!/^[a-zA-Z0-9_-]+$/.test(shortCode)) {
        setError('自定义短码只能包含字母、数字、下划线和连字符');
        return;
      }
      
      if (shortCode.length < 3 || shortCode.length > 20) {
        setError('自定义短码长度应在 3-20 个字符之间');
        return;
      }
      
      if (isCodeExists(shortCode)) {
        setError('该短码已存在，请选择其他短码');
        return;
      }
    }

    const newShortenedUrl: ShortenedUrl = {
      id: Date.now().toString(),
      originalUrl,
      shortCode,
      shortUrl: `https://short.ly/${shortCode}`,
      createdAt: new Date(),
      clicks: 0,
    };

    setShortenedUrls(prev => [newShortenedUrl, ...prev]);
    setOriginalUrl('');
    setCustomCode('');
    setError('');
  };

  // 复制短链接
  const copyShortUrl = async (shortUrl: string) => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(shortUrl);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  // 删除短链接
  const deleteUrl = (id: string) => {
    setShortenedUrls(prev => prev.filter(url => url.id !== id));
  };

  // 模拟点击统计
  const simulateClick = (id: string) => {
    setShortenedUrls(prev => 
      prev.map(url => 
        url.id === id ? { ...url, clicks: url.clicks + 1 } : url
      )
    );
  };

  // 清空所有
  const clearAll = () => {
    setShortenedUrls([]);
  };

  // 加载示例
  const loadExample = () => {
    setOriginalUrl('https://www.example.com/very/long/url/path/with/many/parameters?param1=value1&param2=value2');
  };

  // 批量导入
  const handleBatchImport = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const urls = event.target.value.split('\n').filter(url => url.trim());
    const newUrls: ShortenedUrl[] = [];

    urls.forEach(url => {
      if (isValidUrl(url.trim())) {
        let shortCode;
        do {
          shortCode = generateShortCode();
        } while (isCodeExists(shortCode) || newUrls.some(u => u.shortCode === shortCode));

        newUrls.push({
          id: Date.now().toString() + Math.random(),
          originalUrl: url.trim(),
          shortCode,
          shortUrl: `https://short.ly/${shortCode}`,
          createdAt: new Date(),
          clicks: 0,
        });
      }
    });

    if (newUrls.length > 0) {
      setShortenedUrls(prev => [...newUrls, ...prev]);
      event.target.value = '';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 返回按钮 */}
      <div className="mb-6">
        <Link href="/tools">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            返回工具列表
          </Button>
        </Link>
      </div>

      {/* 页面标题 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <LinkIcon className="h-8 w-8" />
          网址缩短器
        </h1>
        <p className="text-muted-foreground mt-2">
          将长网址转换为简短易记的链接，支持自定义短码和点击统计
        </p>
      </div>

      {/* URL 缩短表单 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>缩短网址</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">原始网址</label>
            <input
              type="url"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              placeholder="输入要缩短的网址，如：https://www.example.com"
              className="w-full p-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">自定义短码 (可选)</label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">https://short.ly/</span>
              <input
                type="text"
                value={customCode}
                onChange={(e) => setCustomCode(e.target.value)}
                placeholder="自定义短码"
                className="flex-1 p-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                maxLength={20}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              留空将自动生成随机短码。只能包含字母、数字、下划线和连字符，长度 3-20 个字符。
            </p>
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
              {error}
            </div>
          )}

          <div className="flex gap-2">
            <Button onClick={shortenUrl} className="flex-1">
              生成短链接
            </Button>
            <Button onClick={loadExample} variant="outline">
              加载示例
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 批量导入 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>批量导入</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <label className="block text-sm font-medium mb-2">批量网址 (每行一个)</label>
            <textarea
              onChange={handleBatchImport}
              placeholder="粘贴多个网址，每行一个..."
              className="w-full h-24 p-3 border border-border rounded-lg bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </CardContent>
      </Card>

      {/* 短链接列表 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            短链接列表 ({shortenedUrls.length})
            {shortenedUrls.length > 0 && (
              <Button onClick={clearAll} variant="outline" size="sm">
                清空所有
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {shortenedUrls.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              暂无短链接，请先创建一个
            </div>
          ) : (
            <div className="space-y-4">
              {shortenedUrls.map((url) => (
                <div key={url.id} className="border border-border rounded-lg p-4 bg-muted/50">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      {/* 短链接 */}
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-lg">{url.shortUrl}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyShortUrl(url.shortUrl)}
                          className="flex items-center gap-1"
                        >
                          {copied === url.shortUrl ? (
                            <>
                              <Check className="h-4 w-4" />
                              已复制
                            </>
                          ) : (
                            <>
                              <Copy className="h-4 w-4" />
                              复制
                            </>
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => simulateClick(url.id)}
                          className="flex items-center gap-1"
                        >
                          <ExternalLink className="h-4 w-4" />
                          访问
                        </Button>
                      </div>

                      {/* 原始链接 */}
                      <div className="text-sm text-muted-foreground mb-2 break-all">
                        原始链接: {url.originalUrl}
                      </div>

                      {/* 统计信息 */}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>创建时间: {url.createdAt.toLocaleString()}</span>
                        <span>点击次数: {url.clicks}</span>
                        <span>短码: {url.shortCode}</span>
                      </div>
                    </div>

                    {/* 删除按钮 */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteUrl(url.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 使用说明 */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>使用说明</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">功能特点</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• 支持任意有效 URL 的缩短</li>
              <li>• 可自定义短码或自动生成</li>
              <li>• 点击统计和访问记录</li>
              <li>• 批量导入多个网址</li>
              <li>• 一键复制短链接</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">自定义短码规则</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• 长度：3-20 个字符</li>
              <li>• 字符：字母、数字、下划线(_)、连字符(-)</li>
              <li>• 不能与已有短码重复</li>
              <li>• 区分大小写</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">注意事项</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• 这是一个演示工具，生成的短链接仅用于展示</li>
              <li>• 实际使用需要配置真实的短链接服务</li>
              <li>• 数据仅保存在浏览器本地，刷新页面会丢失</li>
              <li>• 点击统计为模拟数据</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
