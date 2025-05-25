'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Copy, Check, Globe, MapPin, Wifi } from 'lucide-react';
import Link from 'next/link';

export default function IpLookupPage() {
  const [ipAddress, setIpAddress] = useState('');
  const [currentIp, setCurrentIp] = useState('');
  const [ipInfo, setIpInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  // 获取当前用户IP
  useEffect(() => {
    getCurrentIp();
  }, []);

  const getCurrentIp = async () => {
    try {
      // 模拟获取IP（实际项目中需要使用真实的IP查询服务）
      const mockIp = '8.8.8.8'; // 使用Google DNS作为示例
      setCurrentIp(mockIp);
      setIpAddress(mockIp);
    } catch (err) {
      console.error('获取IP失败:', err);
    }
  };

  // 验证IP地址格式
  const isValidIp = (ip: string): boolean => {
    const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
    return ipv4Regex.test(ip) || ipv6Regex.test(ip);
  };

  // 查询IP信息
  const lookupIp = async () => {
    if (!ipAddress.trim()) {
      setError('请输入IP地址');
      return;
    }

    if (!isValidIp(ipAddress.trim())) {
      setError('请输入有效的IP地址');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // 模拟IP查询结果（实际项目中需要使用真实的IP查询API）
      const mockData = {
        ip: ipAddress.trim(),
        country: '美国',
        countryCode: 'US',
        region: '加利福尼亚州',
        regionCode: 'CA',
        city: '山景城',
        zipCode: '94043',
        latitude: 37.4056,
        longitude: -122.0775,
        timezone: 'America/Los_Angeles',
        isp: 'Google LLC',
        organization: 'Google Public DNS',
        asn: 'AS15169',
        mobile: false,
        proxy: false,
        hosting: true,
      };

      // 添加一些随机性使示例更真实
      if (ipAddress.startsWith('192.168.') || ipAddress.startsWith('10.') || ipAddress.startsWith('172.')) {
        mockData.country = '本地网络';
        mockData.city = '内网地址';
        mockData.isp = '本地网络';
        mockData.hosting = false;
      }

      setIpInfo(mockData);
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

  // 清空结果
  const clearResults = () => {
    setIpInfo(null);
    setError('');
  };

  // 使用示例IP
  const useExampleIp = (ip: string) => {
    setIpAddress(ip);
  };

  const exampleIps = [
    { ip: '8.8.8.8', name: 'Google DNS' },
    { ip: '1.1.1.1', name: 'Cloudflare DNS' },
    { ip: '114.114.114.114', name: '114 DNS' },
    { ip: '208.67.222.222', name: 'OpenDNS' },
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
          IP 地址查询
        </h1>
        <p className="text-muted-foreground mt-2">
          查询 IP 地址的地理位置、ISP 信息等详细信息
        </p>
      </div>

      {/* 当前IP显示 */}
      {currentIp && (
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wifi className="h-5 w-5" />
                <span className="text-sm">您的IP地址：</span>
                <span className="font-mono font-medium">{currentIp}</span>
              </div>
              <Button
                onClick={() => useExampleIp(currentIp)}
                variant="outline"
                size="sm"
              >
                查询此IP
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 查询输入 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>IP 地址查询</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">IP 地址</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={ipAddress}
                onChange={(e) => setIpAddress(e.target.value)}
                placeholder="输入 IP 地址，如：8.8.8.8"
                className="flex-1 p-3 border border-border rounded-lg bg-background font-mono focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <Button
                onClick={lookupIp}
                disabled={loading}
                className="px-6"
              >
                {loading ? '查询中...' : '查询'}
              </Button>
            </div>
            {error && (
              <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded">
                {error}
              </div>
            )}
          </div>

          {/* 示例IP */}
          <div>
            <label className="block text-sm font-medium mb-2">常用 DNS 服务器</label>
            <div className="flex flex-wrap gap-2">
              {exampleIps.map((example) => (
                <Button
                  key={example.ip}
                  onClick={() => useExampleIp(example.ip)}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  {example.name} ({example.ip})
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 查询结果 */}
      {ipInfo && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              查询结果
              <Button onClick={clearResults} variant="outline" size="sm">
                清空
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 基本信息 */}
              <div className="space-y-4">
                <h4 className="font-medium flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  基本信息
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span>IP 地址:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono">{ipInfo.ip}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyInfo(ipInfo.ip, 'ip')}
                      >
                        {copied === 'ip' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                      </Button>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span>国家:</span>
                    <span>{ipInfo.country} ({ipInfo.countryCode})</span>
                  </div>
                  <div className="flex justify-between">
                    <span>地区:</span>
                    <span>{ipInfo.region} ({ipInfo.regionCode})</span>
                  </div>
                  <div className="flex justify-between">
                    <span>城市:</span>
                    <span>{ipInfo.city}</span>
                  </div>
                  {ipInfo.zipCode && (
                    <div className="flex justify-between">
                      <span>邮编:</span>
                      <span>{ipInfo.zipCode}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>时区:</span>
                    <span>{ipInfo.timezone}</span>
                  </div>
                </div>
              </div>

              {/* 网络信息 */}
              <div className="space-y-4">
                <h4 className="font-medium flex items-center gap-2">
                  <Wifi className="h-4 w-4" />
                  网络信息
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>ISP:</span>
                    <span>{ipInfo.isp}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>组织:</span>
                    <span>{ipInfo.organization}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ASN:</span>
                    <span>{ipInfo.asn}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>移动网络:</span>
                    <span>{ipInfo.mobile ? '是' : '否'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>代理服务器:</span>
                    <span>{ipInfo.proxy ? '是' : '否'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>托管服务:</span>
                    <span>{ipInfo.hosting ? '是' : '否'}</span>
                  </div>
                </div>
              </div>

              {/* 地理位置 */}
              <div className="space-y-4 md:col-span-2">
                <h4 className="font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  地理位置
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between">
                    <span>纬度:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono">{ipInfo.latitude}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyInfo(ipInfo.latitude.toString(), 'lat')}
                      >
                        {copied === 'lat' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                      </Button>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span>经度:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono">{ipInfo.longitude}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyInfo(ipInfo.longitude.toString(), 'lng')}
                      >
                        {copied === 'lng' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* 地图链接 */}
                <div className="flex gap-2">
                  <Button
                    onClick={() => window.open(`https://www.google.com/maps?q=${ipInfo.latitude},${ipInfo.longitude}`, '_blank')}
                    variant="outline"
                    size="sm"
                  >
                    在 Google 地图中查看
                  </Button>
                  <Button
                    onClick={() => copyInfo(`${ipInfo.latitude},${ipInfo.longitude}`, 'coords')}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    {copied === 'coords' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    复制坐标
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 使用说明 */}
      <Card>
        <CardHeader>
          <CardTitle>使用说明</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">支持的IP格式</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• <strong>IPv4</strong>：如 192.168.1.1、8.8.8.8</li>
              <li>• <strong>IPv6</strong>：如 2001:4860:4860::8888</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">查询信息说明</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• <strong>ISP</strong>：互联网服务提供商</li>
              <li>• <strong>ASN</strong>：自治系统号码</li>
              <li>• <strong>代理服务器</strong>：是否通过代理访问</li>
              <li>• <strong>托管服务</strong>：是否为数据中心IP</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">注意事项</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• 内网IP（如192.168.x.x）无法查询地理位置</li>
              <li>• 查询结果仅供参考，实际位置可能有偏差</li>
              <li>• 某些IP可能被隐私保护，信息有限</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
