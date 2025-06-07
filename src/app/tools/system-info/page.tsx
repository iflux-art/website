'use client';

interface UserAgentData {
  platform?: string;
}

interface NetworkInformation {
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
  saveData?: boolean;
}

interface NavigatorExtended extends Navigator {
  userAgentData?: UserAgentData;
  deviceMemory?: number;
  connection?: NetworkInformation;
  mozConnection?: NetworkInformation;
  webkitConnection?: NetworkInformation;
}

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Copy, Check, Monitor, RefreshCw, Download } from 'lucide-react';
import Link from 'next/link';

interface SystemInfo {
  browser: {
    name: string;
    version: string;
    engine: string;
    userAgent: string;
  };
  system: {
    platform: string;
    architecture: string;
    language: string;
    languages: string[];
    timezone: string;
    cookieEnabled: boolean;
    onlineStatus: boolean;
  };
  screen: {
    width: number;
    height: number;
    availWidth: number;
    availHeight: number;
    colorDepth: number;
    pixelDepth: number;
    devicePixelRatio: number;
  };
  viewport: {
    width: number;
    height: number;
    innerWidth: number;
    innerHeight: number;
  };
  hardware: {
    cores: number;
    memory: number;
    connection?: {
      effectiveType: string;
      downlink: number;
      rtt: number;
    };
  };
  features: {
    localStorage: boolean;
    sessionStorage: boolean;
    indexedDB: boolean;
    webGL: boolean;
    webRTC: boolean;
    geolocation: boolean;
    notifications: boolean;
    serviceWorker: boolean;
    webAssembly: boolean;
  };
}

export default function SystemInfoPage() {
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // 检测浏览器信息
  const detectBrowser = () => {
    const ua = navigator.userAgent;
    let name = 'Unknown';
    let version = 'Unknown';
    let engine = 'Unknown';

    if (ua.includes('Chrome') && !ua.includes('Edg')) {
      name = 'Chrome';
      version = ua.match(/Chrome\/([0-9.]+)/)?.[1] || 'Unknown';
      engine = 'Blink';
    } else if (ua.includes('Firefox')) {
      name = 'Firefox';
      version = ua.match(/Firefox\/([0-9.]+)/)?.[1] || 'Unknown';
      engine = 'Gecko';
    } else if (ua.includes('Safari') && !ua.includes('Chrome')) {
      name = 'Safari';
      version = ua.match(/Version\/([0-9.]+)/)?.[1] || 'Unknown';
      engine = 'WebKit';
    } else if (ua.includes('Edg')) {
      name = 'Edge';
      version = ua.match(/Edg\/([0-9.]+)/)?.[1] || 'Unknown';
      engine = 'Blink';
    } else if (ua.includes('Opera') || ua.includes('OPR')) {
      name = 'Opera';
      version = ua.match(/(?:Opera|OPR)\/([0-9.]+)/)?.[1] || 'Unknown';
      engine = 'Blink';
    }

    return { name, version, engine, userAgent: ua };
  };

  // 检测系统信息
  const detectSystem = () => {
    const platform = navigator.platform;
    const languages = navigator.languages || [navigator.language];
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    return {
      platform,
      architecture: (navigator as NavigatorExtended).userAgentData?.platform || 'Unknown',
      language: navigator.language,
      languages: Array.from(languages),
      timezone,
      cookieEnabled: navigator.cookieEnabled,
      onlineStatus: navigator.onLine,
    };
  };

  // 检测屏幕信息
  const detectScreen = () => {
    return {
      width: screen.width,
      height: screen.height,
      availWidth: screen.availWidth,
      availHeight: screen.availHeight,
      colorDepth: screen.colorDepth,
      pixelDepth: screen.pixelDepth,
      devicePixelRatio: window.devicePixelRatio,
    };
  };

  // 检测视口信息
  const detectViewport = () => {
    return {
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight,
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight,
    };
  };

  // 检测硬件信息
  const detectHardware = () => {
    const cores = navigator.hardwareConcurrency || 1;
    const memory = (navigator as NavigatorExtended).deviceMemory || 0;

    let connection;
    const conn =
      (navigator as NavigatorExtended).connection ||
      (navigator as NavigatorExtended).mozConnection ||
      (navigator as NavigatorExtended).webkitConnection;
    if (conn) {
      connection = {
        effectiveType: conn.effectiveType || 'Unknown',
        downlink: conn.downlink || 0,
        rtt: conn.rtt || 0,
      };
    }

    return { cores, memory, connection };
  };

  // 检测功能支持
  const detectFeatures = () => {
    return {
      localStorage: typeof Storage !== 'undefined' && !!window.localStorage,
      sessionStorage: typeof Storage !== 'undefined' && !!window.sessionStorage,
      indexedDB: !!window.indexedDB,
      webGL: !!window.WebGLRenderingContext,
      webRTC: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
      geolocation: !!navigator.geolocation,
      notifications: 'Notification' in window,
      serviceWorker: 'serviceWorker' in navigator,
      webAssembly: typeof WebAssembly === 'object',
    };
  };

  // 收集所有信息
  const collectSystemInfo = () => {
    setLoading(true);

    setTimeout(() => {
      const info: SystemInfo = {
        browser: detectBrowser(),
        system: detectSystem(),
        screen: detectScreen(),
        viewport: detectViewport(),
        hardware: detectHardware(),
        features: detectFeatures(),
      };

      setSystemInfo(info);
      setLoading(false);
    }, 500);
  };

  // 复制信息
  const copyInfo = async (content: string, type: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

const copyFullReport = async () => {
  if (!systemInfo) return;

  const report = `系统信息报告
================
检测时间: ${new Date().toISOString().replace('T', ' ').split('.')[0]}

浏览器信息:
- 浏览器: ${systemInfo.browser.name} ${systemInfo.browser.version}
- 引擎: ${systemInfo.browser.engine}
- User Agent: ${systemInfo.browser.userAgent}

系统信息:
- 平台: ${systemInfo.system.platform}
- 架构: ${systemInfo.system.architecture}
- 语言: ${systemInfo.system.language}
- 支持语言: ${systemInfo.system.languages.join(', ')}
- 时区: ${systemInfo.system.timezone}
- Cookie启用: ${systemInfo.system.cookieEnabled ? '是' : '否'}
- 在线状态: ${systemInfo.system.onlineStatus ? '在线' : '离线'}

屏幕信息:
- 分辨率: ${systemInfo.screen.width} × ${systemInfo.screen.height}
- 可用区域: ${systemInfo.screen.availWidth} × ${systemInfo.screen.availHeight}
- 色深: ${systemInfo.screen.colorDepth} bit
- 像素比: ${systemInfo.screen.devicePixelRatio}

视口信息:
- 视口大小: ${systemInfo.viewport.width} × ${systemInfo.viewport.height}
- 窗口大小: ${systemInfo.viewport.innerWidth} × ${systemInfo.viewport.innerHeight}

硬件信息:
- CPU核心数: ${systemInfo.hardware.cores}
- 内存: ${systemInfo.hardware.memory || '未知'} GB
${systemInfo.hardware.connection
  ? `- 网络类型: ${systemInfo.hardware.connection.effectiveType}
- 下行速度: ${systemInfo.hardware.connection.downlink} Mbps
- 延迟: ${systemInfo.hardware.connection.rtt} ms`
  : ''}

功能支持:
- Local Storage: ${systemInfo.features.localStorage ? '支持' : '不支持'}
- Session Storage: ${systemInfo.features.sessionStorage ? '支持' : '不支持'}
- IndexedDB: ${systemInfo.features.indexedDB ? '支持' : '不支持'}
- WebGL: ${systemInfo.features.webGL ? '支持' : '不支持'}
- WebRTC: ${systemInfo.features.webRTC ? '支持' : '不支持'}
- 地理位置: ${systemInfo.features.geolocation ? '支持' : '不支持'}
- 通知: ${systemInfo.features.notifications ? '支持' : '不支持'}
- Service Worker: ${systemInfo.features.serviceWorker ? '支持' : '不支持'}
- WebAssembly: ${systemInfo.features.webAssembly ? '支持' : '不支持'}`;

  await copyInfo(report, 'report');
};

  // 下载报告
  const downloadReport = () => {
    if (!systemInfo) return;

    const report = `系统信息报告 - ${new Date().toISOString().split('T')[0]}

浏览器: ${systemInfo.browser.name} ${systemInfo.browser.version}
系统: ${systemInfo.system.platform}
分辨率: ${systemInfo.screen.width}×${systemInfo.screen.height}
CPU核心: ${systemInfo.hardware.cores}
内存: ${systemInfo.hardware.memory || '未知'} GB

详细信息请查看完整报告。`;

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `system-info-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // 初始化
  useEffect(() => {
    collectSystemInfo();

    // 监听窗口大小变化
    const handleResize = () => {
      if (systemInfo) {
        setSystemInfo(prev =>
          prev
            ? {
                ...prev,
                viewport: detectViewport(),
              }
            : null
        );
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (loading || !systemInfo) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">正在检测系统信息...</p>
        </div>
      </div>
    );
  }

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
          <Monitor className="h-8 w-8" />
          系统信息检测
        </h1>
        <p className="text-muted-foreground mt-2">检测浏览器、系统、硬件和功能支持信息</p>
      </div>

      {/* 操作按钮 */}
      <div className="mb-6 flex flex-wrap gap-2">
        <Button onClick={collectSystemInfo} className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          刷新信息
        </Button>
        <Button onClick={copyFullReport} variant="outline" className="flex items-center gap-2">
          {copied === 'report' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied === 'report' ? '已复制' : '复制完整报告'}
        </Button>
        <Button onClick={downloadReport} variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          下载报告
        </Button>
      </div>

      {/* 信息卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 浏览器信息 */}
        <Card>
          <CardHeader>
            <CardTitle>浏览器信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>浏览器:</span>
              <span className="font-mono">{systemInfo.browser.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>版本:</span>
              <span className="font-mono">{systemInfo.browser.version}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>引擎:</span>
              <span className="font-mono">{systemInfo.browser.engine}</span>
            </div>
            <div className="pt-2 border-t">
              <div className="text-xs text-muted-foreground mb-1">User Agent:</div>
              <div className="text-xs font-mono bg-muted/50 p-2 rounded break-all">
                {systemInfo.browser.userAgent}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 系统信息 */}
        <Card>
          <CardHeader>
            <CardTitle>系统信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>平台:</span>
              <span className="font-mono">{systemInfo.system.platform}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>语言:</span>
              <span className="font-mono">{systemInfo.system.language}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>时区:</span>
              <span className="font-mono text-xs">{systemInfo.system.timezone}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Cookie:</span>
              <span className={systemInfo.system.cookieEnabled ? 'text-green-600' : 'text-red-600'}>
                {systemInfo.system.cookieEnabled ? '启用' : '禁用'}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>在线状态:</span>
              <span className={systemInfo.system.onlineStatus ? 'text-green-600' : 'text-red-600'}>
                {systemInfo.system.onlineStatus ? '在线' : '离线'}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* 屏幕信息 */}
        <Card>
          <CardHeader>
            <CardTitle>屏幕信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>分辨率:</span>
              <span className="font-mono">
                {systemInfo.screen.width} × {systemInfo.screen.height}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>可用区域:</span>
              <span className="font-mono">
                {systemInfo.screen.availWidth} × {systemInfo.screen.availHeight}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>色深:</span>
              <span className="font-mono">{systemInfo.screen.colorDepth} bit</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>像素比:</span>
              <span className="font-mono">{systemInfo.screen.devicePixelRatio}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>视口:</span>
              <span className="font-mono">
                {systemInfo.viewport.width} × {systemInfo.viewport.height}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* 硬件信息 */}
        <Card>
          <CardHeader>
            <CardTitle>硬件信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>CPU核心:</span>
              <span className="font-mono">{systemInfo.hardware.cores}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>内存:</span>
              <span className="font-mono">{systemInfo.hardware.memory || '未知'} GB</span>
            </div>
            {systemInfo.hardware.connection && (
              <>
                <div className="flex justify-between text-sm">
                  <span>网络类型:</span>
                  <span className="font-mono">{systemInfo.hardware.connection.effectiveType}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>下行速度:</span>
                  <span className="font-mono">{systemInfo.hardware.connection.downlink} Mbps</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>延迟:</span>
                  <span className="font-mono">{systemInfo.hardware.connection.rtt} ms</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* 功能支持 */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>功能支持</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(systemInfo.features).map(([key, supported]) => (
                <div key={key} className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${supported ? 'bg-green-500' : 'bg-red-500'}`}
                  />
                  <span className="text-sm">{key}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 使用说明 */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>信息说明</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">检测内容</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>
                • <strong>浏览器信息</strong>：浏览器类型、版本、渲染引擎
              </li>
              <li>
                • <strong>系统信息</strong>：操作系统、语言、时区设置
              </li>
              <li>
                • <strong>屏幕信息</strong>：分辨率、色深、像素比
              </li>
              <li>
                • <strong>硬件信息</strong>：CPU核心数、内存、网络连接
              </li>
              <li>
                • <strong>功能支持</strong>：Web API和技术支持情况
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">隐私说明</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• 所有检测都在浏览器本地进行</li>
              <li>• 不会收集或上传任何个人信息</li>
              <li>• 信息仅用于技术分析和兼容性测试</li>
              <li>• 可以安全地分享给技术支持人员</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}