'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Copy, Check, Hash, RefreshCw, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function UuidGeneratorPage() {
  const [uuids, setUuids] = useState<string[]>([]);
  const [version, setVersion] = useState<'v1' | 'v4'>('v4');
  const [count, setCount] = useState(1);
  const [format, setFormat] = useState<'default' | 'uppercase' | 'nohyphens' | 'brackets'>('default');
  const [copied, setCopied] = useState<string | null>(null);

  // 生成 UUID v4
  const generateUUIDv4 = (): string => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  // 生成 UUID v1 (简化版本，基于时间戳)
  const generateUUIDv1 = (): string => {
    const timestamp = Date.now();
    const random = Math.random().toString(16).substring(2, 15);
    const clockSeq = Math.floor(Math.random() * 16384);
    const node = Math.random().toString(16).substring(2, 14);
    
    const timeLow = (timestamp & 0xffffffff).toString(16).padStart(8, '0');
    const timeMid = ((timestamp >> 32) & 0xffff).toString(16).padStart(4, '0');
    const timeHigh = (((timestamp >> 48) & 0x0fff) | 0x1000).toString(16).padStart(4, '0');
    const clockSeqHigh = ((clockSeq >> 8) | 0x80).toString(16).padStart(2, '0');
    const clockSeqLow = (clockSeq & 0xff).toString(16).padStart(2, '0');
    
    return `${timeLow}-${timeMid}-${timeHigh}-${clockSeqHigh}${clockSeqLow}-${node}`;
  };

  // 格式化 UUID
  const formatUUID = (uuid: string): string => {
    switch (format) {
      case 'uppercase':
        return uuid.toUpperCase();
      case 'nohyphens':
        return uuid.replace(/-/g, '');
      case 'brackets':
        return `{${uuid}}`;
      default:
        return uuid;
    }
  };

  // 生成 UUID
  const generateUUIDs = () => {
    const newUuids: string[] = [];
    for (let i = 0; i < count; i++) {
      const uuid = version === 'v4' ? generateUUIDv4() : generateUUIDv1();
      newUuids.push(formatUUID(uuid));
    }
    setUuids(newUuids);
  };

  // 复制单个 UUID
  const copyUUID = async (uuid: string) => {
    try {
      await navigator.clipboard.writeText(uuid);
      setCopied(uuid);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  // 复制所有 UUID
  const copyAllUUIDs = async () => {
    try {
      const allUuids = uuids.join('\n');
      await navigator.clipboard.writeText(allUuids);
      setCopied('all');
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  // 清空列表
  const clearUUIDs = () => {
    setUuids([]);
  };

  // 初始生成
  useEffect(() => {
    generateUUIDs();
  }, [version, format]);

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
          <Hash className="h-8 w-8" />
          UUID 生成器
        </h1>
        <p className="text-muted-foreground mt-2">
          生成各种版本和格式的 UUID（通用唯一标识符）
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 设置面板 */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>生成设置</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* UUID 版本 */}
              <div>
                <label className="block text-sm font-medium mb-2">UUID 版本</label>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      value="v4"
                      checked={version === 'v4'}
                      onChange={(e) => setVersion(e.target.value as 'v4')}
                      className="rounded"
                    />
                    <span className="text-sm">Version 4 (随机)</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      value="v1"
                      checked={version === 'v1'}
                      onChange={(e) => setVersion(e.target.value as 'v1')}
                      className="rounded"
                    />
                    <span className="text-sm">Version 1 (基于时间)</span>
                  </label>
                </div>
              </div>

              {/* 生成数量 */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  生成数量: {count}
                </label>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={count}
                  onChange={(e) => setCount(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>1</span>
                  <span>100</span>
                </div>
              </div>

              {/* 格式选择 */}
              <div>
                <label className="block text-sm font-medium mb-2">输出格式</label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value as any)}
                  className="w-full p-2 border border-border rounded-lg bg-background"
                >
                  <option value="default">默认格式</option>
                  <option value="uppercase">大写</option>
                  <option value="nohyphens">无连字符</option>
                  <option value="brackets">带花括号</option>
                </select>
              </div>

              {/* 操作按钮 */}
              <div className="space-y-2">
                <Button onClick={generateUUIDs} className="w-full flex items-center gap-2">
                  <RefreshCw className="h-4 w-4" />
                  生成 UUID
                </Button>
                {uuids.length > 0 && (
                  <>
                    <Button onClick={copyAllUUIDs} variant="outline" className="w-full flex items-center gap-2">
                      {copied === 'all' ? (
                        <>
                          <Check className="h-4 w-4" />
                          已复制全部
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          复制全部
                        </>
                      )}
                    </Button>
                    <Button onClick={clearUUIDs} variant="outline" className="w-full flex items-center gap-2">
                      <Trash2 className="h-4 w-4" />
                      清空列表
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 结果面板 */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>生成的 UUID</CardTitle>
            </CardHeader>
            <CardContent>
              {uuids.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  点击"生成 UUID"按钮开始生成
                </div>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {uuids.map((uuid, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border border-border rounded-lg bg-muted/50 hover:bg-muted"
                    >
                      <span className="font-mono text-sm flex-1 mr-2">{uuid}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyUUID(uuid)}
                        className="flex items-center gap-2"
                      >
                        {copied === uuid ? (
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
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* 格式示例 */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>格式示例</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div>
                  <div className="font-medium mb-1">默认格式</div>
                  <div className="font-mono p-2 bg-muted/50 rounded">
                    550e8400-e29b-41d4-a716-446655440000
                  </div>
                </div>
                <div>
                  <div className="font-medium mb-1">大写</div>
                  <div className="font-mono p-2 bg-muted/50 rounded">
                    550E8400-E29B-41D4-A716-446655440000
                  </div>
                </div>
                <div>
                  <div className="font-medium mb-1">无连字符</div>
                  <div className="font-mono p-2 bg-muted/50 rounded">
                    550e8400e29b41d4a716446655440000
                  </div>
                </div>
                <div>
                  <div className="font-medium mb-1">带花括号</div>
                  <div className="font-mono p-2 bg-muted/50 rounded">
                    {'{550e8400-e29b-41d4-a716-446655440000}'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 使用说明 */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>使用说明</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">UUID 版本说明</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• <strong>Version 1</strong>：基于时间戳和 MAC 地址，保证时间顺序</li>
              <li>• <strong>Version 4</strong>：基于随机数，最常用的版本</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">UUID 特点</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• 全球唯一性：重复概率极低</li>
              <li>• 标准格式：8-4-4-4-12 位十六进制数字</li>
              <li>• 无需中央管理：可在任何地方生成</li>
              <li>• 跨平台兼容：所有编程语言都支持</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">常见用途</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• 数据库主键</li>
              <li>• 文件名和目录名</li>
              <li>• 会话标识符</li>
              <li>• API 请求 ID</li>
              <li>• 分布式系统中的唯一标识</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
