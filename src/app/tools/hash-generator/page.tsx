'use client';

import React, { useState, useEffect } from 'react';
import { Hash, Copy, Check, RotateCcw, FileDown } from 'lucide-react';
import { ToolLayout } from '@/components/layout/tool-layout';
import { ToolActions } from '@/components/ui/tool-actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { hashUtils, exampleData } from '@/lib/tool-utils';

export default function HashGeneratorPage() {
  const [input, setInput] = useState('');
  const [results, setResults] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const generateHashes = async () => {
    if (!input.trim()) {
      setResults({});
      return;
    }

    setLoading(true);
    try {
      const md5Result = await hashUtils.md5(input);
      const sha256Result = await hashUtils.sha256(input);

      setResults({
        md5: md5Result.success ? md5Result.data! : md5Result.error!,
        sha256: sha256Result.success ? sha256Result.data! : sha256Result.error!,
      });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
      setResults({
        md5: '计算失败',
        sha256: '计算失败',
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(''), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  const clearAll = () => {
    setInput('');
    setResults({});
    setCopied('');
  };

  const loadExample = () => {
    setInput(exampleData.longText());
  };

  useEffect(() => {
    generateHashes();
  }, [input]);

  const actions = [
    {
      label: '加载示例',
      onClick: loadExample,
      icon: FileDown,
      variant: 'outline' as const,
    },
    {
      label: '清空',
      onClick: clearAll,
      icon: RotateCcw,
      variant: 'outline' as const,
    },
  ];

  const helpContent = (
    <div className="space-y-4">
      <div>
        <h4 className="font-medium mb-2">支持的哈希算法</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• <strong>MD5</strong>：128位哈希值，常用于文件校验</li>
          <li>• <strong>SHA-256</strong>：256位哈希值，安全性更高</li>
          <li>• <strong>实时计算</strong>：输入内容时自动计算哈希值</li>
        </ul>
      </div>
      <div>
        <h4 className="font-medium mb-2">使用场景</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• 文件完整性校验</li>
          <li>• 密码哈希存储</li>
          <li>• 数据指纹生成</li>
          <li>• 区块链和加密应用</li>
        </ul>
      </div>
      <div>
        <h4 className="font-medium mb-2">安全提示</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• MD5 已不推荐用于安全敏感场景</li>
          <li>• SHA-256 适用于大多数安全应用</li>
          <li>• 敏感数据请在本地处理</li>
        </ul>
      </div>
    </div>
  );

  return (
    <ToolLayout
      title="哈希生成器"
      description="生成文本的 MD5、SHA-256 等哈希值"
      icon={Hash}
      actions={<ToolActions actions={actions} />}
      helpContent={helpContent}
    >
      <div className="space-y-6">
        {/* 输入区域 */}
        <Card>
          <CardHeader>
            <CardTitle>输入文本</CardTitle>
          </CardHeader>
          <CardContent>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="输入要计算哈希值的文本..."
              className="w-full h-32 p-3 border border-border rounded-lg bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <div className="mt-2 text-sm text-muted-foreground">
              字符数：{input.length}
            </div>
          </CardContent>
        </Card>

        {/* 结果区域 */}
        <Card>
          <CardHeader>
            <CardTitle>哈希结果</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* MD5 */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium">MD5</label>
                  {results.md5 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(results.md5, 'md5')}
                      className="h-8 px-2"
                    >
                      {copied === 'md5' ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                </div>
                <div className="p-3 bg-muted/50 rounded-lg font-mono text-sm break-all">
                  {loading ? '计算中...' : results.md5 || '请输入文本'}
                </div>
              </div>

              {/* SHA-256 */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium">SHA-256</label>
                  {results.sha256 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(results.sha256, 'sha256')}
                      className="h-8 px-2"
                    >
                      {copied === 'sha256' ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                </div>
                <div className="p-3 bg-muted/50 rounded-lg font-mono text-sm break-all">
                  {loading ? '计算中...' : results.sha256 || '请输入文本'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}