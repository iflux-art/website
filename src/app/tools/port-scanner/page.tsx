'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Copy, Check, Wifi, Search, Shield } from 'lucide-react';
import Link from 'next/link';

interface PortResult {
  port: number;
  status: 'open' | 'closed' | 'filtered';
  service: string;
  description: string;
}

export default function PortScannerPage() {
  const [target, setTarget] = useState('');
  const [portRange, setPortRange] = useState('1-1000');
  const [scanType, setScanType] = useState<'common' | 'range' | 'specific'>('common');
  const [specificPorts, setSpecificPorts] = useState('');
  const [results, setResults] = useState<PortResult[]>([]);
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  // 常用端口列表
  const commonPorts = [
    { port: 21, service: 'FTP', description: '文件传输协议' },
    { port: 22, service: 'SSH', description: '安全外壳协议' },
    { port: 23, service: 'Telnet', description: '远程登录协议' },
    { port: 25, service: 'SMTP', description: '简单邮件传输协议' },
    { port: 53, service: 'DNS', description: '域名系统' },
    { port: 80, service: 'HTTP', description: '超文本传输协议' },
    { port: 110, service: 'POP3', description: '邮局协议版本3' },
    { port: 143, service: 'IMAP', description: '互联网消息访问协议' },
    { port: 443, service: 'HTTPS', description: '安全超文本传输协议' },
    { port: 993, service: 'IMAPS', description: '安全IMAP' },
    { port: 995, service: 'POP3S', description: '安全POP3' },
    { port: 3389, service: 'RDP', description: '远程桌面协议' },
    { port: 5432, service: 'PostgreSQL', description: 'PostgreSQL数据库' },
    { port: 3306, service: 'MySQL', description: 'MySQL数据库' },
    { port: 1433, service: 'MSSQL', description: 'Microsoft SQL Server' },
    { port: 6379, service: 'Redis', description: 'Redis数据库' },
    { port: 27017, service: 'MongoDB', description: 'MongoDB数据库' },
    { port: 8080, service: 'HTTP-Alt', description: '备用HTTP端口' },
    { port: 8443, service: 'HTTPS-Alt', description: '备用HTTPS端口' },
    { port: 9200, service: 'Elasticsearch', description: 'Elasticsearch搜索引擎' },
  ];

  // 获取端口服务信息
  const getPortService = (port: number): { service: string; description: string } => {
    const found = commonPorts.find(p => p.port === port);
    return found ? { service: found.service, description: found.description } : 
           { service: 'Unknown', description: '未知服务' };
  };

  // 验证目标地址
  const isValidTarget = (target: string): boolean => {
    // IP地址验证
    const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    // 域名验证
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.([a-zA-Z]{2,}\.?)+$/;
    
    return ipRegex.test(target) || domainRegex.test(target) || target === 'localhost';
  };

  // 解析端口范围
  const parsePortRange = (range: string): number[] => {
    const ports: number[] = [];
    const parts = range.split(',');
    
    for (const part of parts) {
      const trimmed = part.trim();
      if (trimmed.includes('-')) {
        const [start, end] = trimmed.split('-').map(p => parseInt(p.trim()));
        if (start && end && start <= end && start > 0 && end <= 65535) {
          for (let i = start; i <= end; i++) {
            ports.push(i);
          }
        }
      } else {
        const port = parseInt(trimmed);
        if (port > 0 && port <= 65535) {
          ports.push(port);
        }
      }
    }
    
    return [...new Set(ports)].sort((a, b) => a - b);
  };

  // 模拟端口扫描
  const simulatePortScan = async (port: number): Promise<PortResult> => {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, Math.random() * 100 + 50));
    
    // 模拟扫描结果
    const { service, description } = getPortService(port);
    
    // 常用端口更可能开放
    const isCommonPort = commonPorts.some(p => p.port === port);
    const randomFactor = Math.random();
    
    let status: 'open' | 'closed' | 'filtered';
    if (isCommonPort && randomFactor > 0.3) {
      status = 'open';
    } else if (randomFactor > 0.8) {
      status = 'filtered';
    } else {
      status = 'closed';
    }
    
    return { port, status, service, description };
  };

  // 执行端口扫描
  const startScan = async () => {
    if (!target.trim()) {
      setError('请输入目标地址');
      return;
    }

    const cleanTarget = target.trim().toLowerCase().replace(/^https?:\/\//, '');
    
    if (!isValidTarget(cleanTarget)) {
      setError('请输入有效的IP地址或域名');
      return;
    }

    let portsToScan: number[] = [];

    switch (scanType) {
      case 'common':
        portsToScan = commonPorts.map(p => p.port);
        break;
      case 'range':
        portsToScan = parsePortRange(portRange);
        break;
      case 'specific':
        portsToScan = parsePortRange(specificPorts);
        break;
    }

    if (portsToScan.length === 0) {
      setError('没有有效的端口需要扫描');
      return;
    }

    if (portsToScan.length > 1000) {
      setError('端口数量过多，请减少扫描范围');
      return;
    }

    setScanning(true);
    setError('');
    setResults([]);
    setProgress(0);

    const scanResults: PortResult[] = [];

    for (let i = 0; i < portsToScan.length; i++) {
      const port = portsToScan[i];
      const result = await simulatePortScan(port);
      scanResults.push(result);
      setProgress(((i + 1) / portsToScan.length) * 100);
      
      // 实时更新结果
      setResults([...scanResults]);
    }

    setScanning(false);
  };

  // 停止扫描
  const stopScan = () => {
    setScanning(false);
  };

  // 复制结果
  const copyResults = async () => {
    const openPorts = results.filter(r => r.status === 'open');
    const report = `端口扫描报告
================
目标: ${target}
扫描时间: ${new Date().toLocaleString()}
扫描端口数: ${results.length}
开放端口数: ${openPorts.length}

开放端口详情:
${openPorts.map(p => `${p.port}\t${p.service}\t${p.description}`).join('\n')}

完整扫描结果:
${results.map(p => `${p.port}\t${p.status}\t${p.service}\t${p.description}`).join('\n')}`;

    try {
      await navigator.clipboard.writeText(report);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  // 清空结果
  const clearResults = () => {
    setResults([]);
    setProgress(0);
  };

  const openPorts = results.filter(r => r.status === 'open');
  const closedPorts = results.filter(r => r.status === 'closed');
  const filteredPorts = results.filter(r => r.status === 'filtered');

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
          <Wifi className="h-8 w-8" />
          网络端口扫描器
        </h1>
        <p className="text-muted-foreground mt-2">
          扫描目标主机的开放端口，检测网络服务状态
        </p>
      </div>

      {/* 扫描配置 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>扫描配置</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">目标地址</label>
            <input
              type="text"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="输入IP地址或域名，如：192.168.1.1 或 example.com"
              className="w-full p-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              disabled={scanning}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">扫描类型</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <Button
                variant={scanType === 'common' ? 'default' : 'outline'}
                onClick={() => setScanType('common')}
                disabled={scanning}
                className="justify-start"
              >
                常用端口
              </Button>
              <Button
                variant={scanType === 'range' ? 'default' : 'outline'}
                onClick={() => setScanType('range')}
                disabled={scanning}
                className="justify-start"
              >
                端口范围
              </Button>
              <Button
                variant={scanType === 'specific' ? 'default' : 'outline'}
                onClick={() => setScanType('specific')}
                disabled={scanning}
                className="justify-start"
              >
                指定端口
              </Button>
            </div>
          </div>

          {scanType === 'range' && (
            <div>
              <label className="block text-sm font-medium mb-2">端口范围</label>
              <input
                type="text"
                value={portRange}
                onChange={(e) => setPortRange(e.target.value)}
                placeholder="如：1-1000 或 80,443,8080"
                className="w-full p-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                disabled={scanning}
              />
            </div>
          )}

          {scanType === 'specific' && (
            <div>
              <label className="block text-sm font-medium mb-2">指定端口</label>
              <input
                type="text"
                value={specificPorts}
                onChange={(e) => setSpecificPorts(e.target.value)}
                placeholder="如：80,443,8080,3306,5432"
                className="w-full p-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                disabled={scanning}
              />
            </div>
          )}

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
              {error}
            </div>
          )}

          <div className="flex gap-2">
            {!scanning ? (
              <Button onClick={startScan} className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                开始扫描
              </Button>
            ) : (
              <Button onClick={stopScan} variant="outline" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                停止扫描
              </Button>
            )}
            
            {results.length > 0 && (
              <>
                <Button onClick={copyResults} variant="outline" className="flex items-center gap-2">
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? '已复制' : '复制结果'}
                </Button>
                <Button onClick={clearResults} variant="outline">
                  清空结果
                </Button>
              </>
            )}
          </div>

          {/* 进度条 */}
          {scanning && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>扫描进度</span>
                <span>{progress.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 扫描统计 */}
      {results.length > 0 && (
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">{results.length}</div>
                <div className="text-sm text-muted-foreground">总扫描</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{openPorts.length}</div>
                <div className="text-sm text-muted-foreground">开放</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">{closedPorts.length}</div>
                <div className="text-sm text-muted-foreground">关闭</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-600">{filteredPorts.length}</div>
                <div className="text-sm text-muted-foreground">过滤</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 扫描结果 */}
      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>扫描结果</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {results.map((result, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    result.status === 'open' ? 'bg-green-50 border-green-200' :
                    result.status === 'filtered' ? 'bg-yellow-50 border-yellow-200' :
                    'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="font-mono font-medium w-16">{result.port}</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      result.status === 'open' ? 'bg-green-100 text-green-800' :
                      result.status === 'filtered' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {result.status.toUpperCase()}
                    </span>
                    <span className="font-medium">{result.service}</span>
                    <span className="text-sm text-muted-foreground">{result.description}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 使用说明 */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>使用说明</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">端口状态说明</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• <strong>开放 (Open)</strong>：端口正在监听连接</li>
              <li>• <strong>关闭 (Closed)</strong>：端口没有服务监听</li>
              <li>• <strong>过滤 (Filtered)</strong>：端口被防火墙过滤</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">扫描类型</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• <strong>常用端口</strong>：扫描最常见的20个端口</li>
              <li>• <strong>端口范围</strong>：扫描指定范围内的端口</li>
              <li>• <strong>指定端口</strong>：扫描特定的端口列表</li>
            </ul>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
            <h4 className="font-medium mb-2 text-yellow-800 dark:text-yellow-200">⚠️ 重要提醒</h4>
            <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
              <li>• 这是一个演示工具，显示的是模拟扫描结果</li>
              <li>• 仅对自己拥有的系统进行端口扫描</li>
              <li>• 未经授权的端口扫描可能违法</li>
              <li>• 实际使用需要相应的网络权限</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
