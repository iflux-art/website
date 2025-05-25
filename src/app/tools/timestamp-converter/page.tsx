'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Copy, Check, Clock, Calendar, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function TimestampConverterPage() {
  const [timestamp, setTimestamp] = useState('');
  const [datetime, setDatetime] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [copied, setCopied] = useState<string | null>(null);

  // 更新当前时间
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 时间戳转日期时间
  const timestampToDatetime = () => {
    try {
      const ts = parseInt(timestamp);
      if (isNaN(ts)) {
        alert('请输入有效的时间戳');
        return;
      }

      // 判断是秒级还是毫秒级时间戳
      const date = ts.toString().length === 10 ? new Date(ts * 1000) : new Date(ts);

      if (isNaN(date.getTime())) {
        alert('无效的时间戳');
        return;
      }

      // 格式化为本地时间
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');

      setDatetime(`${year}-${month}-${day} ${hours}:${minutes}:${seconds}`);
    } catch (error) {
      alert('转换失败，请检查时间戳格式');
    }
  };

  // 日期时间转时间戳
  const datetimeToTimestamp = () => {
    try {
      const date = new Date(datetime);

      if (isNaN(date.getTime())) {
        alert('请输入有效的日期时间格式');
        return;
      }

      const ts = Math.floor(date.getTime() / 1000);
      setTimestamp(ts.toString());
    } catch (error) {
      alert('转换失败，请检查日期时间格式');
    }
  };

  // 获取当前时间戳
  const getCurrentTimestamp = () => {
    const now = Math.floor(Date.now() / 1000);
    setTimestamp(now.toString());
  };

  // 获取当前日期时间
  const getCurrentDatetime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    setDatetime(`${year}-${month}-${day} ${hours}:${minutes}:${seconds}`);
  };

  // 复制到剪贴板
  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  // 清空所有
  const clearAll = () => {
    setTimestamp('');
    setDatetime('');
  };

  // 格式化当前时间显示
  const formatCurrentTime = (date: Date) => {
    return {
      datetime: date.toISOString().replace('T', ' ').split('.')[0],
      timestamp: Math.floor(date.getTime() / 1000),
      timestampMs: date.getTime(),
      iso: date.toISOString(),
      utc: date.toUTCString(),
    };
  };

  const currentTimeInfo = formatCurrentTime(currentTime);

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
          <Clock className="h-8 w-8" />
          时间戳转换工具
        </h1>
        <p className="text-muted-foreground mt-2">
          时间戳与日期时间互相转换，支持秒级和毫秒级时间戳
        </p>
      </div>

      {/* 当前时间显示 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            当前时间
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">本地时间</div>
              <div className="font-mono text-lg">{currentTimeInfo.datetime}</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">时间戳（秒）</div>
              <div className="font-mono text-lg flex items-center gap-2">
                {currentTimeInfo.timestamp}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    copyToClipboard(currentTimeInfo.timestamp.toString(), 'current-timestamp')
                  }
                >
                  {copied === 'current-timestamp' ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">时间戳（毫秒）</div>
              <div className="font-mono text-lg flex items-center gap-2">
                {currentTimeInfo.timestampMs}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    copyToClipboard(currentTimeInfo.timestampMs.toString(), 'current-timestamp-ms')
                  }
                >
                  {copied === 'current-timestamp-ms' ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 时间戳转日期时间 */}
        <Card>
          <CardHeader>
            <CardTitle>时间戳 → 日期时间</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">时间戳</label>
              <input
                type="text"
                value={timestamp}
                onChange={e => setTimestamp(e.target.value)}
                placeholder="输入时间戳（支持秒级和毫秒级）"
                className="w-full p-3 border border-border rounded-lg bg-background font-mono focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={timestampToDatetime} className="flex-1">
                转换
              </Button>
              <Button onClick={getCurrentTimestamp} variant="outline">
                当前时间戳
              </Button>
            </div>

            {datetime && (
              <div>
                <label className="block text-sm font-medium mb-2">转换结果</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={datetime}
                    readOnly
                    className="flex-1 p-3 border border-border rounded-lg bg-muted/50 font-mono"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(datetime, 'datetime')}
                  >
                    {copied === 'datetime' ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 日期时间转时间戳 */}
        <Card>
          <CardHeader>
            <CardTitle>日期时间 → 时间戳</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">日期时间</label>
              <input
                type="text"
                value={datetime}
                onChange={e => setDatetime(e.target.value)}
                placeholder="YYYY-MM-DD HH:mm:ss"
                className="w-full p-3 border border-border rounded-lg bg-background font-mono focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={datetimeToTimestamp} className="flex-1">
                转换
              </Button>
              <Button onClick={getCurrentDatetime} variant="outline">
                当前时间
              </Button>
            </div>

            {timestamp && (
              <div>
                <label className="block text-sm font-medium mb-2">转换结果</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={timestamp}
                    readOnly
                    className="flex-1 p-3 border border-border rounded-lg bg-muted/50 font-mono"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(timestamp, 'timestamp')}
                  >
                    {copied === 'timestamp' ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 操作按钮 */}
      <div className="mt-6 flex justify-center">
        <Button onClick={clearAll} variant="outline">
          清空所有
        </Button>
      </div>

      {/* 使用说明 */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>使用说明</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">时间戳格式</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>
                • <strong>秒级时间戳</strong>：10位数字，如 1640995200
              </li>
              <li>
                • <strong>毫秒级时间戳</strong>：13位数字，如 1640995200000
              </li>
              <li>• 工具会自动识别时间戳类型</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">日期时间格式</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• 标准格式：YYYY-MM-DD HH:mm:ss</li>
              <li>• 支持格式：2024-01-01 12:00:00</li>
              <li>• 也支持：2024/01/01 12:00:00</li>
              <li>• ISO格式：2024-01-01T12:00:00Z</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">常见用途</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• 数据库时间字段转换</li>
              <li>• API 接口时间参数处理</li>
              <li>• 日志文件时间分析</li>
              <li>• 程序开发时间调试</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
