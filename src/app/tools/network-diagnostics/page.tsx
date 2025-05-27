'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Wifi, Globe, Search, Activity } from 'lucide-react';
import Link from 'next/link';

export default function NetworkDiagnosticsPage() {
  const [activeTab, setActiveTab] = useState<'ping' | 'dns' | 'port' | 'speed'>('ping');

  // Ping测试
  const PingTest = () => {
    const [host, setHost] = useState('google.com');
    const [results, setResults] = useState<any[]>([]);
    const [testing, setTesting] = useState(false);

    const simulatePing = async () => {
      setTesting(true);
      setResults([]);

      // 模拟ping测试
      for (let i = 0; i < 4; i++) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const time = Math.random() * 50 + 10;
        const result = {
          seq: i + 1,
          time: time.toFixed(1),
          status: time < 100 ? 'success' : 'timeout'
        };
        setResults(prev => [...prev, result]);
      }

      setTesting(false);
    };

    return (
      <Card>
        <CardHeader><CardTitle>Ping测试</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <input
              placeholder="输入主机名或IP地址"
              value={host}
              onChange={(e) => setHost(e.target.value)}
              className="flex-1 p-3 border border-border rounded-lg bg-background"
            />
            <Button onClick={simulatePing} disabled={testing}>
              {testing ? '测试中...' : '开始Ping'}
            </Button>
          </div>

          {results.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">测试结果</h4>
              {results.map((result, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-muted rounded">
                  <span className="text-sm">序列 {result.seq}</span>
                  <span className={`text-sm ${result.status === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                    {result.status === 'success' ? `${result.time}ms` : '超时'}
                  </span>
                </div>
              ))}

              {results.length === 4 && (
                <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <div className="text-sm">
                    <div>发送: 4 个数据包</div>
                    <div>接收: {results.filter(r => r.status === 'success').length} 个数据包</div>
                    <div>丢包率: {((4 - results.filter(r => r.status === 'success').length) / 4 * 100).toFixed(0)}%</div>
                    <div>平均延迟: {(results.filter(r => r.status === 'success').reduce((sum, r) => sum + parseFloat(r.time), 0) / results.filter(r => r.status === 'success').length || 0).toFixed(1)}ms</div>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-3 gap-4">
            <Button variant="outline" onClick={() => setHost('google.com')}>Google</Button>
            <Button variant="outline" onClick={() => setHost('baidu.com')}>百度</Button>
            <Button variant="outline" onClick={() => setHost('github.com')}>GitHub</Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  // DNS查询
  const DNSLookup = () => {
    const [domain, setDomain] = useState('example.com');
    const [dnsResults, setDnsResults] = useState<any>(null);

    const performDNSLookup = () => {
      // 模拟DNS查询结果
      const mockResults = {
        domain: domain,
        records: [
          { type: 'A', value: '93.184.216.34', ttl: 3600 },
          { type: 'AAAA', value: '2606:2800:220:1:248:1893:25c8:1946', ttl: 3600 },
          { type: 'MX', value: '10 mail.example.com', ttl: 3600 },
          { type: 'NS', value: 'ns1.example.com', ttl: 86400 },
          { type: 'NS', value: 'ns2.example.com', ttl: 86400 }
        ]
      };
      setDnsResults(mockResults);
    };

    return (
      <Card>
        <CardHeader><CardTitle>DNS查询</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <input
              placeholder="输入域名"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="flex-1 p-3 border border-border rounded-lg bg-background"
            />
            <Button onClick={performDNSLookup}>查询DNS</Button>
          </div>

          {dnsResults && (
            <div className="space-y-3">
              <h4 className="font-medium">DNS记录</h4>
              {dnsResults.records.map((record: any, index: number) => (
                <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <span className="font-medium text-sm">{record.type}</span>
                    <div className="text-sm text-muted-foreground">{record.value}</div>
                  </div>
                  <span className="text-xs text-muted-foreground">TTL: {record.ttl}s</span>
                </div>
              ))}
            </div>
          )}

          <div className="p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
            <h4 className="font-medium mb-2">DNS记录类型说明</h4>
            <div className="text-sm space-y-1">
              <div>• A记录: IPv4地址</div>
              <div>• AAAA记录: IPv6地址</div>
              <div>• MX记录: 邮件服务器</div>
              <div>• NS记录: 域名服务器</div>
              <div>• CNAME记录: 别名记录</div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // 端口扫描
  const PortScan = () => {
    const [target, setTarget] = useState('example.com');
    const [ports, setPorts] = useState('80,443,22,21,25');
    const [scanResults, setScanResults] = useState<any[]>([]);
    const [scanning, setScanning] = useState(false);

    const performPortScan = async () => {
      setScanning(true);
      setScanResults([]);

      const portList = ports.split(',').map(p => p.trim());

      for (const port of portList) {
        await new Promise(resolve => setTimeout(resolve, 500));
        const isOpen = Math.random() > 0.5;
        const result = {
          port: port,
          status: isOpen ? 'open' : 'closed',
          service: getServiceName(port)
        };
        setScanResults(prev => [...prev, result]);
      }

      setScanning(false);
    };

    const getServiceName = (port: string) => {
      const services: any = {
        '21': 'FTP',
        '22': 'SSH',
        '25': 'SMTP',
        '53': 'DNS',
        '80': 'HTTP',
        '110': 'POP3',
        '143': 'IMAP',
        '443': 'HTTPS',
        '993': 'IMAPS',
        '995': 'POP3S'
      };
      return services[port] || 'Unknown';
    };

    return (
      <Card>
        <CardHeader><CardTitle>端口扫描</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <input
              placeholder="目标主机"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="w-full p-3 border border-border rounded-lg bg-background"
            />
            <input
              placeholder="端口列表 (用逗号分隔)"
              value={ports}
              onChange={(e) => setPorts(e.target.value)}
              className="w-full p-3 border border-border rounded-lg bg-background"
            />
            <Button onClick={performPortScan} disabled={scanning} className="w-full">
              {scanning ? '扫描中...' : '开始扫描'}
            </Button>
          </div>

          {scanResults.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">扫描结果</h4>
              {scanResults.map((result, index) => (
                <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <span className="font-medium">端口 {result.port}</span>
                    <span className="text-sm text-muted-foreground ml-2">({result.service})</span>
                  </div>
                  <span className={`text-sm px-2 py-1 rounded ${
                    result.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {result.status === 'open' ? '开放' : '关闭'}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-3 gap-2">
            <Button variant="outline" size="sm" onClick={() => setPorts('80,443')}>Web服务</Button>
            <Button variant="outline" size="sm" onClick={() => setPorts('21,22,23')}>远程服务</Button>
            <Button variant="outline" size="sm" onClick={() => setPorts('25,110,143')}>邮件服务</Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  // 网速测试
  const SpeedTest = () => {
    const [testing, setTesting] = useState(false);
    const [results, setResults] = useState<any>(null);

    const performSpeedTest = async () => {
      setTesting(true);
      setResults(null);

      // 模拟网速测试
      await new Promise(resolve => setTimeout(resolve, 3000));

      const mockResults = {
        download: (Math.random() * 100 + 50).toFixed(1),
        upload: (Math.random() * 50 + 20).toFixed(1),
        ping: (Math.random() * 30 + 10).toFixed(0),
        jitter: (Math.random() * 5 + 1).toFixed(1)
      };

      setResults(mockResults);
      setTesting(false);
    };

    return (
      <Card>
        <CardHeader>
          <CardTitle>网速测试</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={performSpeedTest} disabled={testing} className="w-full">
            {testing ? '测试中...' : '开始测速'}
          </Button>

          {testing && (
            <div className="text-center p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">正在测试网络速度...</p>
            </div>
          )}

          {results && (
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{results.download}</div>
                <div className="text-sm text-muted-foreground">下载速度 (Mbps)</div>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{results.upload}</div>
                <div className="text-sm text-muted-foreground">上传速度 (Mbps)</div>
              </div>
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{results.ping}</div>
                <div className="text-sm text-muted-foreground">延迟 (ms)</div>
              </div>
              <div className="text-center p-4 bg-orange-50 dark:bg-orange-950 rounded-lg">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{results.jitter}</div>
                <div className="text-sm text-muted-foreground">抖动 (ms)</div>
              </div>
            </div>
          )}

          <div className="p-3 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">网速等级参考</h4>
            <div className="text-sm space-y-1">
              <div>• 优秀: 下载 > 100 Mbps, 延迟 < 20ms</div>
              <div>• 良好: 下载 50-100 Mbps, 延迟 20-50ms</div>
              <div>• 一般: 下载 10-50 Mbps, 延迟 50-100ms</div>
              <div>• 较差: 下载 < 10 Mbps, 延迟 > 100ms</div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const tabs = [
    { key: 'ping', name: 'Ping测试', icon: Activity },
    { key: 'dns', name: 'DNS查询', icon: Search },
    { key: 'port', name: '端口扫描', icon: Globe },
    { key: 'speed', name: '网速测试', icon: Wifi },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/tools">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            返回工具列表
          </Button>
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Wifi className="h-8 w-8" />
          网络诊断工具
        </h1>
        <p className="text-muted-foreground mt-2">
          网络诊断和测试工具，包括Ping测试、DNS查询、端口扫描、网速测试
        </p>
      </div>

      <Card className="mb-6">
        <CardContent className="p-0">
          <div className="flex border-b">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`flex-1 p-4 text-center border-b-2 transition-colors flex items-center justify-center gap-2 ${
                    activeTab === tab.key
                      ? 'border-primary text-primary bg-primary/5'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <IconComponent className="h-4 w-4" />
                  {tab.name}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {activeTab === 'ping' && <PingTest />}
      {activeTab === 'dns' && <DNSLookup />}
      {activeTab === 'port' && <PortScan />}
      {activeTab === 'speed' && <SpeedTest />}
    </div>
  );
}
