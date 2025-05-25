'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Copy, Check, Globe, Search, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function DomainLookupPage() {
  const [domain, setDomain] = useState('');
  const [domainInfo, setDomainInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  // 验证域名格式
  const isValidDomain = (domain: string): boolean => {
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.([a-zA-Z]{2,}\.?)+$/;
    return domainRegex.test(domain);
  };

  // 查询域名信息
  const lookupDomain = async () => {
    if (!domain.trim()) {
      setError('请输入域名');
      return;
    }

    const cleanDomain = domain.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '');
    
    if (!isValidDomain(cleanDomain)) {
      setError('请输入有效的域名格式');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // 模拟域名查询结果（实际项目中需要使用真实的域名查询API）
      const mockData = {
        domain: cleanDomain,
        registrar: 'Example Registrar Inc.',
        registrationDate: '2020-01-15',
        expirationDate: '2025-01-15',
        lastUpdated: '2023-06-10',
        status: ['clientTransferProhibited', 'clientUpdateProhibited'],
        nameServers: [
          'ns1.example.com',
          'ns2.example.com',
          'ns3.example.com',
          'ns4.example.com'
        ],
        registrant: {
          name: 'Privacy Protected',
          organization: 'Domains By Proxy, LLC',
          country: 'US',
          email: 'privacy@example.com'
        },
        dnssec: 'unsigned',
        available: false,
        whoisServer: 'whois.example.com',
        createdDate: '2020-01-15T10:30:00Z',
        updatedDate: '2023-06-10T15:45:00Z',
        expiresDate: '2025-01-15T10:30:00Z'
      };

      // 根据域名添加一些变化
      if (cleanDomain.includes('google')) {
        mockData.registrar = 'MarkMonitor Inc.';
        mockData.registrant.organization = 'Google LLC';
        mockData.registrant.country = 'US';
      } else if (cleanDomain.includes('github')) {
        mockData.registrar = 'CSC Corporate Domains, Inc.';
        mockData.registrant.organization = 'GitHub, Inc.';
        mockData.registrant.country = 'US';
      }

      setDomainInfo(mockData);
    } catch (err) {
      setError('查询失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 复制信息
  const copyInfo = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  // 复制完整报告
  const copyFullReport = async () => {
    if (!domainInfo) return;

    const report = `域名查询报告
================
域名: ${domainInfo.domain}
注册商: ${domainInfo.registrar}
注册日期: ${domainInfo.registrationDate}
到期日期: ${domainInfo.expirationDate}
最后更新: ${domainInfo.lastUpdated}
状态: ${domainInfo.status.join(', ')}
DNSSEC: ${domainInfo.dnssec}
可用性: ${domainInfo.available ? '可注册' : '已注册'}

域名服务器:
${domainInfo.nameServers.map((ns: string) => `- ${ns}`).join('\n')}

注册人信息:
姓名/组织: ${domainInfo.registrant.name}
组织: ${domainInfo.registrant.organization}
国家: ${domainInfo.registrant.country}
邮箱: ${domainInfo.registrant.email}

查询时间: ${new Date().toLocaleString()}`;

    try {
      await navigator.clipboard.writeText(report);
      setCopied('report');
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  // 清空结果
  const clearResults = () => {
    setDomainInfo(null);
    setError('');
  };

  // 使用示例域名
  const useExampleDomain = (exampleDomain: string) => {
    setDomain(exampleDomain);
  };

  const exampleDomains = [
    'google.com',
    'github.com',
    'stackoverflow.com',
    'mozilla.org',
    'wikipedia.org'
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
          <Globe className="h-8 w-8" />
          域名查询工具
        </h1>
        <p className="text-muted-foreground mt-2">
          查询域名的注册信息、到期时间、DNS 服务器等详细信息
        </p>
      </div>

      {/* 查询输入 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>域名查询</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">域名</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="输入域名，如：example.com"
                className="flex-1 p-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && lookupDomain()}
              />
              <Button
                onClick={lookupDomain}
                disabled={loading}
                className="px-6 flex items-center gap-2"
              >
                <Search className="h-4 w-4" />
                {loading ? '查询中...' : '查询'}
              </Button>
            </div>
            {error && (
              <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded">
                {error}
              </div>
            )}
          </div>

          {/* 示例域名 */}
          <div>
            <label className="block text-sm font-medium mb-2">示例域名</label>
            <div className="flex flex-wrap gap-2">
              {exampleDomains.map((example) => (
                <Button
                  key={example}
                  onClick={() => useExampleDomain(example)}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  {example}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 查询结果 */}
      {domainInfo && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* 基本信息 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                基本信息
                <Button
                  onClick={copyFullReport}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  {copied === 'report' ? (
                    <>
                      <Check className="h-3 w-3" />
                      已复制
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      复制报告
                    </>
                  )}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span>域名:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono">{domainInfo.domain}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyInfo(domainInfo.domain, 'domain')}
                    >
                      {copied === 'domain' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    </Button>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span>注册商:</span>
                  <span>{domainInfo.registrar}</span>
                </div>
                <div className="flex justify-between">
                  <span>注册日期:</span>
                  <span>{domainInfo.registrationDate}</span>
                </div>
                <div className="flex justify-between">
                  <span>到期日期:</span>
                  <span className="text-orange-600">{domainInfo.expirationDate}</span>
                </div>
                <div className="flex justify-between">
                  <span>最后更新:</span>
                  <span>{domainInfo.lastUpdated}</span>
                </div>
                <div className="flex justify-between">
                  <span>DNSSEC:</span>
                  <span className={domainInfo.dnssec === 'signed' ? 'text-green-600' : 'text-gray-600'}>
                    {domainInfo.dnssec}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>状态:</span>
                  <span className={domainInfo.available ? 'text-green-600' : 'text-blue-600'}>
                    {domainInfo.available ? '可注册' : '已注册'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* DNS 信息 */}
          <Card>
            <CardHeader>
              <CardTitle>DNS 信息</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">域名服务器</h4>
                  <div className="space-y-2">
                    {domainInfo.nameServers.map((ns: string, index: number) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                        <span className="font-mono text-sm">{ns}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyInfo(ns, `ns-${index}`)}
                        >
                          {copied === `ns-${index}` ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">域名状态</h4>
                  <div className="space-y-1">
                    {domainInfo.status.map((status: string, index: number) => (
                      <div key={index} className="text-sm bg-muted/50 p-2 rounded">
                        {status}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 注册人信息 */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>注册人信息</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span>姓名/组织:</span>
                  <span>{domainInfo.registrant.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>组织:</span>
                  <span>{domainInfo.registrant.organization}</span>
                </div>
                <div className="flex justify-between">
                  <span>国家:</span>
                  <span>{domainInfo.registrant.country}</span>
                </div>
                <div className="flex justify-between">
                  <span>邮箱:</span>
                  <span>{domainInfo.registrant.email}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 操作按钮 */}
      {domainInfo && (
        <div className="mb-6 flex justify-center gap-4">
          <Button
            onClick={() => window.open(`https://${domainInfo.domain}`, '_blank')}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            访问网站
          </Button>
          <Button onClick={clearResults} variant="outline">
            清空结果
          </Button>
        </div>
      )}

      {/* 使用说明 */}
      <Card>
        <CardHeader>
          <CardTitle>使用说明</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">查询信息说明</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• <strong>注册商</strong>：域名注册服务提供商</li>
              <li>• <strong>注册日期</strong>：域名首次注册的时间</li>
              <li>• <strong>到期日期</strong>：域名到期时间，需要续费</li>
              <li>• <strong>DNSSEC</strong>：域名系统安全扩展状态</li>
              <li>• <strong>域名服务器</strong>：负责解析该域名的 DNS 服务器</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">域名状态说明</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• <strong>clientTransferProhibited</strong>：禁止转移</li>
              <li>• <strong>clientUpdateProhibited</strong>：禁止更新</li>
              <li>• <strong>clientDeleteProhibited</strong>：禁止删除</li>
              <li>• <strong>serverHold</strong>：服务器暂停</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">注意事项</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• 这是一个演示工具，显示的是模拟数据</li>
              <li>• 实际使用需要接入真实的 WHOIS 查询服务</li>
              <li>• 某些域名可能启用了隐私保护</li>
              <li>• 查询频率可能受到限制</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
