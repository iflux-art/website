'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Play, Wifi, Download, Upload, Clock, Copy, Check } from 'lucide-react';
import Link from 'next/link';

interface SpeedTestResult {
  downloadSpeed: number;
  uploadSpeed: number;
  ping: number;
  jitter: number;
  timestamp: Date;
  server: string;
}

export default function SpeedTestPage() {
  const [testing, setTesting] = useState(false);
  const [currentTest, setCurrentTest] = useState<'ping' | 'download' | 'upload' | null>(null);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<SpeedTestResult | null>(null);
  const [history, setHistory] = useState<SpeedTestResult[]>([]);
  const [copied, setCopied] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  // 模拟网络测速
  const runSpeedTest = async () => {
    setTesting(true);
    setProgress(0);
    setResults(null);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      // 测试延迟
      setCurrentTest('ping');
      const ping = await testPing(controller.signal);
      setProgress(33);

      if (controller.signal.aborted) return;

      // 测试下载速度
      setCurrentTest('download');
      const downloadSpeed = await testDownloadSpeed(controller.signal);
      setProgress(66);

      if (controller.signal.aborted) return;

      // 测试上传速度
      setCurrentTest('upload');
      const uploadSpeed = await testUploadSpeed(controller.signal);
      setProgress(100);

      if (controller.signal.aborted) return;

      const result: SpeedTestResult = {
        downloadSpeed,
        uploadSpeed,
        ping: ping.average,
        jitter: ping.jitter,
        timestamp: new Date(),
        server: 'Test Server (模拟)'
      };

      setResults(result);
      setHistory(prev => [result, ...prev.slice(0, 9)]); // 保留最近10次记录

    } catch (error) {
      if (!controller.signal.aborted) {
        console.error('测速失败:', error);
        alert('测速失败，请重试');
      }
    } finally {
      setTesting(false);
      setCurrentTest(null);
      setProgress(0);
      abortControllerRef.current = null;
    }
  };

  // 停止测试
  const stopTest = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  // 测试延迟
  const testPing = async (signal: AbortSignal): Promise<{ average: number; jitter: number }> => {
    const pings: number[] = [];
    
    for (let i = 0; i < 5; i++) {
      if (signal.aborted) throw new Error('Aborted');
      
      const start = performance.now();
      
      // 模拟网络请求
      await new Promise(resolve => {
        const delay = Math.random() * 50 + 20; // 20-70ms
        setTimeout(resolve, delay);
      });
      
      const end = performance.now();
      pings.push(end - start);
      
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    const average = pings.reduce((a, b) => a + b, 0) / pings.length;
    const jitter = Math.max(...pings) - Math.min(...pings);

    return { average, jitter };
  };

  // 测试下载速度
  const testDownloadSpeed = async (signal: AbortSignal): Promise<number> => {
    // 模拟下载测试
    const duration = 3000; // 3秒
    const startTime = Date.now();
    
    while (Date.now() - startTime < duration) {
      if (signal.aborted) throw new Error('Aborted');
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // 模拟速度结果 (Mbps)
    return Math.random() * 80 + 20; // 20-100 Mbps
  };

  // 测试上传速度
  const testUploadSpeed = async (signal: AbortSignal): Promise<number> => {
    // 模拟上传测试
    const duration = 3000; // 3秒
    const startTime = Date.now();
    
    while (Date.now() - startTime < duration) {
      if (signal.aborted) throw new Error('Aborted');
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // 模拟速度结果 (Mbps)
    return Math.random() * 40 + 10; // 10-50 Mbps
  };

  // 复制结果
  const copyResults = async () => {
    if (!results) return;

    const report = `网络测速结果
================
测试时间: ${results.timestamp.toLocaleString()}
服务器: ${results.server}

下载速度: ${results.downloadSpeed.toFixed(2)} Mbps
上传速度: ${results.uploadSpeed.toFixed(2)} Mbps
延迟: ${results.ping.toFixed(1)} ms
抖动: ${results.jitter.toFixed(1)} ms`;

    try {
      await navigator.clipboard.writeText(report);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  // 获取网络质量评级
  const getNetworkGrade = (downloadSpeed: number): { grade: string; color: string } => {
    if (downloadSpeed >= 100) return { grade: 'A+', color: 'text-green-600' };
    if (downloadSpeed >= 50) return { grade: 'A', color: 'text-green-600' };
    if (downloadSpeed >= 25) return { grade: 'B', color: 'text-blue-600' };
    if (downloadSpeed >= 10) return { grade: 'C', color: 'text-yellow-600' };
    if (downloadSpeed >= 5) return { grade: 'D', color: 'text-orange-600' };
    return { grade: 'F', color: 'text-red-600' };
  };

  // 格式化速度
  const formatSpeed = (speed: number): string => {
    if (speed >= 1000) {
      return `${(speed / 1000).toFixed(2)} Gbps`;
    }
    return `${speed.toFixed(2)} Mbps`;
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
          <Wifi className="h-8 w-8" />
          网络测速工具
        </h1>
        <p className="text-muted-foreground mt-2">
          测试网络下载速度、上传速度和延迟
        </p>
      </div>

      {/* 测速控制 */}
      <Card className="mb-6">
        <CardContent className="p-8 text-center">
          {!testing ? (
            <div className="space-y-4">
              <div className="text-6xl font-bold text-primary mb-4">
                {results ? formatSpeed(results.downloadSpeed) : '--'}
              </div>
              <div className="text-muted-foreground mb-6">
                {results ? '下载速度' : '点击开始测速'}
              </div>
              <Button
                onClick={runSpeedTest}
                size="lg"
                className="px-8 py-4 text-lg flex items-center gap-2"
              >
                <Play className="h-5 w-5" />
                开始测速
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-4xl font-bold text-primary mb-4">
                {progress}%
              </div>
              <div className="text-lg mb-4">
                {currentTest === 'ping' && '正在测试延迟...'}
                {currentTest === 'download' && '正在测试下载速度...'}
                {currentTest === 'upload' && '正在测试上传速度...'}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
                <div 
                  className="bg-primary h-3 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <Button
                onClick={stopTest}
                variant="outline"
                className="px-6 py-2"
              >
                停止测试
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 测试结果 */}
      {results && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <Download className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold">{formatSpeed(results.downloadSpeed)}</div>
              <div className="text-sm text-muted-foreground">下载速度</div>
              <div className={`text-lg font-bold mt-1 ${getNetworkGrade(results.downloadSpeed).color}`}>
                {getNetworkGrade(results.downloadSpeed).grade}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <Upload className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-bold">{formatSpeed(results.uploadSpeed)}</div>
              <div className="text-sm text-muted-foreground">上传速度</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <Clock className="h-8 w-8 mx-auto mb-2 text-orange-600" />
              <div className="text-2xl font-bold">{results.ping.toFixed(1)} ms</div>
              <div className="text-sm text-muted-foreground">延迟</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <Wifi className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <div className="text-2xl font-bold">{results.jitter.toFixed(1)} ms</div>
              <div className="text-sm text-muted-foreground">抖动</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 详细信息和历史记录 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 详细信息 */}
        {results && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                测试详情
                <Button
                  onClick={copyResults}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? '已复制' : '复制结果'}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>测试时间:</span>
                <span className="font-mono">{results.timestamp.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>测试服务器:</span>
                <span>{results.server}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>下载速度:</span>
                <span className="font-mono text-blue-600">{formatSpeed(results.downloadSpeed)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>上传速度:</span>
                <span className="font-mono text-green-600">{formatSpeed(results.uploadSpeed)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>延迟:</span>
                <span className="font-mono text-orange-600">{results.ping.toFixed(1)} ms</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>抖动:</span>
                <span className="font-mono text-purple-600">{results.jitter.toFixed(1)} ms</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>网络评级:</span>
                <span className={`font-bold ${getNetworkGrade(results.downloadSpeed).color}`}>
                  {getNetworkGrade(results.downloadSpeed).grade}
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 历史记录 */}
        <Card>
          <CardHeader>
            <CardTitle>测试历史</CardTitle>
          </CardHeader>
          <CardContent>
            {history.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                暂无测试记录
              </div>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {history.map((record, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg bg-muted/50">
                    <div>
                      <div className="font-medium text-sm">
                        {formatSpeed(record.downloadSpeed)} ↓ / {formatSpeed(record.uploadSpeed)} ↑
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {record.timestamp.toLocaleString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm">{record.ping.toFixed(1)} ms</div>
                      <div className={`text-xs font-bold ${getNetworkGrade(record.downloadSpeed).color}`}>
                        {getNetworkGrade(record.downloadSpeed).grade}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 网络质量说明 */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>网络质量评级</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">下载速度评级</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-green-600 font-bold">A+ (100+ Mbps)</span>
                  <span>超高速，支持4K流媒体</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-600 font-bold">A (50-100 Mbps)</span>
                  <span>高速，支持多设备使用</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-600 font-bold">B (25-50 Mbps)</span>
                  <span>良好，支持高清视频</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-yellow-600 font-bold">C (10-25 Mbps)</span>
                  <span>一般，基本网络需求</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-orange-600 font-bold">D (5-10 Mbps)</span>
                  <span>较慢，影响使用体验</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-red-600 font-bold">F (&lt;5 Mbps)</span>
                  <span>很慢，严重影响使用</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">延迟评级</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-green-600 font-bold">优秀 (&lt;20ms)</span>
                  <span>实时应用无延迟</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-600 font-bold">良好 (20-50ms)</span>
                  <span>在线游戏流畅</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-yellow-600 font-bold">一般 (50-100ms)</span>
                  <span>网页浏览正常</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-orange-600 font-bold">较差 (100-200ms)</span>
                  <span>有明显延迟感</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-red-600 font-bold">很差 (&gt;200ms)</span>
                  <span>严重影响使用</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h4 className="font-medium mb-2 text-blue-800 dark:text-blue-200">💡 测试说明</h4>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              这是一个演示工具，显示的是模拟测速结果。实际的网络测速需要真实的测试服务器和网络请求。测试结果仅供参考，实际网络性能可能因多种因素而异。
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
