'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Send, Copy, Check, Plus, Trash2, Globe } from 'lucide-react';
import Link from 'next/link';

interface Header {
  key: string;
  value: string;
  enabled: boolean;
}

interface ApiResponse {
  status: number;
  statusText: string;
  headers: { [key: string]: string };
  data: any;
  time: number;
  size: number;
}

export default function ApiTesterPage() {
  const [method, setMethod] = useState<'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'>('GET');
  const [url, setUrl] = useState('');
  const [headers, setHeaders] = useState<Header[]>([
    { key: 'Content-Type', value: 'application/json', enabled: true }
  ]);
  const [body, setBody] = useState('');
  const [bodyType, setBodyType] = useState<'json' | 'form' | 'text'>('json');
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  // 添加请求头
  const addHeader = () => {
    setHeaders(prev => [...prev, { key: '', value: '', enabled: true }]);
  };

  // 删除请求头
  const removeHeader = (index: number) => {
    setHeaders(prev => prev.filter((_, i) => i !== index));
  };

  // 更新请求头
  const updateHeader = (index: number, field: 'key' | 'value' | 'enabled', value: string | boolean) => {
    setHeaders(prev => prev.map((header, i) => 
      i === index ? { ...header, [field]: value } : header
    ));
  };

  // 发送请求
  const sendRequest = async () => {
    if (!url.trim()) {
      setError('请输入API地址');
      return;
    }

    setLoading(true);
    setError('');
    const startTime = Date.now();

    try {
      // 构建请求头
      const requestHeaders: { [key: string]: string } = {};
      headers.forEach(header => {
        if (header.enabled && header.key && header.value) {
          requestHeaders[header.key] = header.value;
        }
      });

      // 构建请求配置
      const config: RequestInit = {
        method,
        headers: requestHeaders,
      };

      // 添加请求体
      if (['POST', 'PUT', 'PATCH'].includes(method) && body.trim()) {
        if (bodyType === 'json') {
          try {
            JSON.parse(body); // 验证JSON格式
            config.body = body;
          } catch (err) {
            throw new Error('请求体JSON格式错误');
          }
        } else {
          config.body = body;
        }
      }

      // 模拟API请求（实际项目中这里会发送真实请求）
      const mockResponse = await simulateApiRequest(url, config);
      const endTime = Date.now();

      setResponse({
        ...mockResponse,
        time: endTime - startTime,
        size: JSON.stringify(mockResponse.data).length
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : '请求失败');
    } finally {
      setLoading(false);
    }
  };

  // 模拟API请求
  const simulateApiRequest = async (url: string, config: RequestInit): Promise<Omit<ApiResponse, 'time' | 'size'>> => {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));

    // 模拟不同的响应
    if (url.includes('error')) {
      return {
        status: 500,
        statusText: 'Internal Server Error',
        headers: { 'content-type': 'application/json' },
        data: { error: 'Internal server error', message: 'Something went wrong' }
      };
    }

    if (url.includes('notfound')) {
      return {
        status: 404,
        statusText: 'Not Found',
        headers: { 'content-type': 'application/json' },
        data: { error: 'Not found', message: 'Resource not found' }
      };
    }

    // 根据请求方法返回不同响应
    const mockData = {
      GET: { id: 1, name: 'John Doe', email: 'john@example.com', posts: [1, 2, 3] },
      POST: { id: 2, message: 'Created successfully', data: JSON.parse(config.body as string || '{}') },
      PUT: { id: 1, message: 'Updated successfully', data: JSON.parse(config.body as string || '{}') },
      DELETE: { message: 'Deleted successfully' },
      PATCH: { id: 1, message: 'Partially updated', data: JSON.parse(config.body as string || '{}') }
    };

    return {
      status: 200,
      statusText: 'OK',
      headers: {
        'content-type': 'application/json',
        'x-response-time': '123ms',
        'server': 'nginx/1.18.0'
      },
      data: mockData[config.method as keyof typeof mockData] || mockData.GET
    };
  };

  // 复制响应
  const copyResponse = async (content: string, type: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  // 清空
  const clearAll = () => {
    setUrl('');
    setBody('');
    setResponse(null);
    setError('');
  };

  // 加载示例
  const loadExample = () => {
    setUrl('https://jsonplaceholder.typicode.com/users/1');
    setMethod('GET');
    setHeaders([
      { key: 'Content-Type', value: 'application/json', enabled: true },
      { key: 'Accept', value: 'application/json', enabled: true }
    ]);
  };

  // 格式化JSON
  const formatJson = (obj: any): string => {
    try {
      return JSON.stringify(obj, null, 2);
    } catch {
      return String(obj);
    }
  };

  const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];

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
          API测试工具
        </h1>
        <p className="text-muted-foreground mt-2">
          测试REST API接口，支持多种HTTP方法和自定义请求头
        </p>
      </div>

      {/* 请求配置 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>请求配置</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* URL和方法 */}
          <div className="flex gap-2">
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value as any)}
              className="p-3 border border-border rounded-lg bg-background min-w-[100px]"
            >
              {methods.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="输入API地址，如：https://api.example.com/users"
              className="flex-1 p-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <Button
              onClick={sendRequest}
              disabled={loading || !url.trim()}
              className="px-6 flex items-center gap-2"
            >
              <Send className="h-4 w-4" />
              {loading ? '发送中...' : '发送'}
            </Button>
          </div>

          {/* 操作按钮 */}
          <div className="flex gap-2">
            <Button onClick={loadExample} variant="outline" size="sm">
              加载示例
            </Button>
            <Button onClick={clearAll} variant="outline" size="sm">
              清空
            </Button>
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 请求详情 */}
        <div className="space-y-6">
          {/* 请求头 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                请求头
                <Button onClick={addHeader} variant="outline" size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {headers.map((header, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={header.enabled}
                      onChange={(e) => updateHeader(index, 'enabled', e.target.checked)}
                      className="rounded"
                    />
                    <input
                      type="text"
                      value={header.key}
                      onChange={(e) => updateHeader(index, 'key', e.target.value)}
                      placeholder="Header名称"
                      className="flex-1 p-2 border border-border rounded bg-background text-sm"
                    />
                    <input
                      type="text"
                      value={header.value}
                      onChange={(e) => updateHeader(index, 'value', e.target.value)}
                      placeholder="Header值"
                      className="flex-1 p-2 border border-border rounded bg-background text-sm"
                    />
                    <Button
                      onClick={() => removeHeader(index)}
                      variant="ghost"
                      size="sm"
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 请求体 */}
          {['POST', 'PUT', 'PATCH'].includes(method) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  请求体
                  <select
                    value={bodyType}
                    onChange={(e) => setBodyType(e.target.value as any)}
                    className="text-sm p-1 border border-border rounded bg-background"
                  >
                    <option value="json">JSON</option>
                    <option value="form">Form Data</option>
                    <option value="text">Plain Text</option>
                  </select>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder={
                    bodyType === 'json' ? '{\n  "key": "value"\n}' :
                    bodyType === 'form' ? 'key1=value1&key2=value2' :
                    '请求体内容'
                  }
                  className="w-full h-32 p-3 border border-border rounded-lg bg-background font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </CardContent>
            </Card>
          )}
        </div>

        {/* 响应结果 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              响应结果
              {response && (
                <div className="flex gap-2">
                  <Button
                    onClick={() => copyResponse(formatJson(response.data), 'response')}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    {copied === 'response' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copied === 'response' ? '已复制' : '复制'}
                  </Button>
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!response ? (
              <div className="text-center py-12 text-muted-foreground">
                发送请求后将显示响应结果
              </div>
            ) : (
              <div className="space-y-4">
                {/* 状态信息 */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between">
                    <span>状态码:</span>
                    <span className={`font-mono ${
                      response.status >= 200 && response.status < 300 ? 'text-green-600' :
                      response.status >= 400 ? 'text-red-600' : 'text-yellow-600'
                    }`}>
                      {response.status} {response.statusText}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>响应时间:</span>
                    <span className="font-mono">{response.time}ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span>响应大小:</span>
                    <span className="font-mono">{response.size} bytes</span>
                  </div>
                </div>

                {/* 响应头 */}
                <div>
                  <h4 className="font-medium mb-2">响应头</h4>
                  <div className="bg-muted/50 p-3 rounded-lg font-mono text-xs space-y-1">
                    {Object.entries(response.headers).map(([key, value]) => (
                      <div key={key}>
                        <span className="text-blue-600">{key}:</span> {value}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 响应体 */}
                <div>
                  <h4 className="font-medium mb-2">响应体</h4>
                  <div className="bg-muted/50 p-3 rounded-lg font-mono text-xs max-h-64 overflow-auto">
                    <pre>{formatJson(response.data)}</pre>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 使用说明 */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>使用说明</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">支持的HTTP方法</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• <strong>GET</strong>：获取资源</li>
              <li>• <strong>POST</strong>：创建资源</li>
              <li>• <strong>PUT</strong>：更新资源（完整更新）</li>
              <li>• <strong>PATCH</strong>：更新资源（部分更新）</li>
              <li>• <strong>DELETE</strong>：删除资源</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">功能特点</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• 支持自定义请求头</li>
              <li>• 支持JSON、表单、纯文本请求体</li>
              <li>• 显示详细的响应信息</li>
              <li>• 响应时间和大小统计</li>
              <li>• 一键复制响应内容</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">测试技巧</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• 使用示例URL测试基本功能</li>
              <li>• 添加Authorization头进行身份验证</li>
              <li>• 检查响应状态码判断请求是否成功</li>
              <li>• 使用JSON格式发送结构化数据</li>
            </ul>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h4 className="font-medium mb-2 text-blue-800 dark:text-blue-200">💡 演示说明</h4>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              这是一个演示工具，当前显示的是模拟响应数据。实际使用时需要配置CORS或使用代理服务器来避免跨域问题。
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
