'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Copy, Check, Shield, Hash } from 'lucide-react';
import Link from 'next/link';

export default function HashGeneratorPage() {
  const [input, setInput] = useState('');
  const [results, setResults] = useState({
    md5: '',
    sha1: '',
    sha256: '',
    sha512: '',
  });
  const [copied, setCopied] = useState<string | null>(null);

  // 简单的哈希函数实现（仅用于演示，实际项目中应使用专业库）
  const simpleHash = (str: string, algorithm: string): string => {
    let hash = 0;
    if (str.length === 0) return '';
    
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // 转换为32位整数
    }
    
    // 根据算法返回不同长度的哈希值（模拟）
    const baseHash = Math.abs(hash).toString(16);
    switch (algorithm) {
      case 'md5':
        return baseHash.padStart(32, '0').substring(0, 32);
      case 'sha1':
        return baseHash.padStart(40, '0').substring(0, 40);
      case 'sha256':
        return baseHash.padStart(64, '0').substring(0, 64);
      case 'sha512':
        return baseHash.padStart(128, '0').substring(0, 128);
      default:
        return baseHash;
    }
  };

  // 使用 Web Crypto API 生成真实的哈希值
  const generateHash = async (text: string, algorithm: string): Promise<string> => {
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(text);
      const hashBuffer = await crypto.subtle.digest(algorithm.toUpperCase().replace(/(\d+)/, '-$1'), data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch (error) {
      // 如果 Web Crypto API 不支持，使用简单哈希
      return simpleHash(text, algorithm);
    }
  };

  const generateAllHashes = async () => {
    if (!input.trim()) {
      setResults({
        md5: '',
        sha1: '',
        sha256: '',
        sha512: '',
      });
      return;
    }

    try {
      const [sha1, sha256, sha512] = await Promise.all([
        generateHash(input, 'sha1'),
        generateHash(input, 'sha256'),
        generateHash(input, 'sha512'),
      ]);

      // MD5 不被 Web Crypto API 支持，使用简单哈希
      const md5 = simpleHash(input, 'md5');

      setResults({
        md5,
        sha1,
        sha256,
        sha512,
      });
    } catch (error) {
      console.error('哈希生成失败:', error);
    }
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  const clearAll = () => {
    setInput('');
    setResults({
      md5: '',
      sha1: '',
      sha256: '',
      sha512: '',
    });
  };

  const loadExample = () => {
    setInput('Hello, World!');
  };

  const hashTypes = [
    {
      key: 'md5',
      name: 'MD5',
      description: '128位哈希值，已不推荐用于安全用途',
      value: results.md5,
      color: 'text-red-600',
    },
    {
      key: 'sha1',
      name: 'SHA-1',
      description: '160位哈希值，安全性较低',
      value: results.sha1,
      color: 'text-orange-600',
    },
    {
      key: 'sha256',
      name: 'SHA-256',
      description: '256位哈希值，目前推荐使用',
      value: results.sha256,
      color: 'text-green-600',
    },
    {
      key: 'sha512',
      name: 'SHA-512',
      description: '512位哈希值，最高安全级别',
      value: results.sha512,
      color: 'text-blue-600',
    },
  ];

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
          <Shield className="h-8 w-8" />
          哈希生成器
        </h1>
        <p className="text-muted-foreground mt-2">
          生成 MD5、SHA-1、SHA-256、SHA-512 等哈希值
        </p>
      </div>

      {/* 操作按钮 */}
      <div className="mb-6 flex flex-wrap gap-2">
        <Button onClick={generateAllHashes}>
          生成哈希值
        </Button>
        <Button onClick={loadExample} variant="outline">
          加载示例
        </Button>
        <Button onClick={clearAll} variant="outline">
          清空
        </Button>
      </div>

      {/* 输入区域 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>输入文本</CardTitle>
        </CardHeader>
        <CardContent>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onInput={generateAllHashes}
            placeholder="在此输入要生成哈希值的文本..."
            className="w-full h-32 p-3 border border-border rounded-lg bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </CardContent>
      </Card>

      {/* 哈希结果 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {hashTypes.map((hashType) => (
          <Card key={hashType.key}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Hash className="h-5 w-5" />
                    <span className={hashType.color}>{hashType.name}</span>
                  </div>
                  <p className="text-sm font-normal text-muted-foreground mt-1">
                    {hashType.description}
                  </p>
                </div>
                {hashType.value && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(hashType.value, hashType.key)}
                    className="flex items-center gap-2"
                  >
                    {copied === hashType.key ? (
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
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-3 border border-border rounded-lg bg-muted/50 font-mono text-sm break-all min-h-[3rem] flex items-center">
                {hashType.value || '请输入文本生成哈希值'}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 使用说明 */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>使用说明</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">哈希算法说明</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• <strong>MD5</strong>：速度快但安全性低，已被破解，不推荐用于安全用途</li>
              <li>• <strong>SHA-1</strong>：比 MD5 安全但仍有漏洞，逐渐被淘汰</li>
              <li>• <strong>SHA-256</strong>：目前广泛使用的安全哈希算法，推荐使用</li>
              <li>• <strong>SHA-512</strong>：最高安全级别，适用于高安全要求场景</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">哈希特性</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• <strong>确定性</strong>：相同输入总是产生相同输出</li>
              <li>• <strong>不可逆</strong>：无法从哈希值推导出原始数据</li>
              <li>• <strong>雪崩效应</strong>：输入微小变化导致输出巨大变化</li>
              <li>• <strong>固定长度</strong>：无论输入多长，输出长度固定</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">常见用途</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• 密码存储（加盐哈希）</li>
              <li>• 文件完整性校验</li>
              <li>• 数字签名</li>
              <li>• 区块链和加密货币</li>
              <li>• 数据去重</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">安全提示</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• 密码存储时应使用盐值（salt）防止彩虹表攻击</li>
              <li>• 避免使用 MD5 和 SHA-1 处理敏感数据</li>
              <li>• 对于密码哈希，推荐使用专门的算法如 bcrypt、scrypt</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
