'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Copy, Check, Clock, Calendar, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function TimestampConverterPage() {
  const [activeTab, setActiveTab] = useState('converter');
  const [timestamp, setTimestamp] = useState('');
  const [datetime, setDatetime] = useState('');
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  // 时区转换相关状态
  const [sourceTimezone, setSourceTimezone] = useState('Asia/Shanghai');
  const [targetTimezone, setTargetTimezone] = useState('America/New_York');
  const [sourceDateTime, setSourceDateTime] = useState('');

  // 日期计算相关状态
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [addDays, setAddDays] = useState('0');
  const [baseDate, setBaseDate] = useState('');

  // 更新当前时间
  useEffect(() => {
    // 初始化当前时间
    setCurrentTime(new Date());

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 时间戳转日期时间
  const timestampToDatetime = () => {
    try {
      const ts = parseInt(timestamp);
      if (isNaN(ts)) {
        alert('请输入有效的时间戳');
        return;
      }

      // 判断是秒级还是毫秒级时间戳
      const date = ts.toString().length === 10 ? new Date(ts * 1000) : new Date(ts);

      if (isNaN(date.getTime())) {
        alert('无效的时间戳');
        return;
      }

      // 格式化为本地时间
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');

      setDatetime(`${year}-${month}-${day} ${hours}:${minutes}:${seconds}`);
    } catch {
      // 忽略具体错误信息，仅显示通用提示
      alert('转换失败，请检查时间戳格式');
    }
  };

  // 日期时间转时间戳
  const datetimeToTimestamp = () => {
    try {
      const date = new Date(datetime);

      if (isNaN(date.getTime())) {
        alert('请输入有效的日期时间格式');
        return;
      }

      const ts = Math.floor(date.getTime() / 1000);
      setTimestamp(ts.toString());
    } catch {
      // 忽略具体错误信息，仅显示通用提示
      alert('转换失败，请检查日期时间格式');
    }
  };

  // 获取当前时间戳
  const getCurrentTimestamp = () => {
    const now = Math.floor(Date.now() / 1000);
    setTimestamp(now.toString());
  };

  // 获取当前日期时间
  const getCurrentDatetime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    setDatetime(`${year}-${month}-${day} ${hours}:${minutes}:${seconds}`);
  };

  // 复制到剪贴板
  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  // 时区转换
  const convertTimezone = (dateTimeStr: string, fromTz: string, toTz: string) => {
    try {
      const date = new Date(dateTimeStr);
      if (isNaN(date.getTime())) return null;

      return {
        original: date.toLocaleString('zh-CN', { timeZone: fromTz }),
        converted: date.toLocaleString('zh-CN', { timeZone: toTz }),
        timestamp: Math.floor(date.getTime() / 1000),
        iso: date.toISOString(),
      };
    } catch {
      // 时区转换失败时返回 null
      return null;
    }
  };

  // 日期差计算
  const calculateDateDiff = (start: string, end: string) => {
    try {
      const startDate = new Date(start);
      const endDate = new Date(end);

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return null;

      const diffMs = endDate.getTime() - startDate.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      const diffSeconds = Math.floor(diffMs / 1000);

      return {
        days: diffDays,
        hours: diffHours,
        minutes: diffMinutes,
        seconds: diffSeconds,
        milliseconds: diffMs,
      };
    } catch {
      // 日期差计算失败时返回 null
      return null;
    }
  };

  // 日期加减
  const addDaysToDate = (dateStr: string, days: number) => {
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return null;

      date.setDate(date.getDate() + days);
      return {
        result: date.toISOString().split('T')[0],
        formatted: date.toLocaleDateString('zh-CN'),
        timestamp: Math.floor(date.getTime() / 1000),
      };
    } catch {
      // 日期计算失败时返回 null
      return null;
    }
  };

  // 常用时区列表
  const timezones = [
    { value: 'Asia/Shanghai', label: '北京时间 (UTC+8)' },
    { value: 'America/New_York', label: '纽约时间 (UTC-5/-4)' },
    { value: 'America/Los_Angeles', label: '洛杉矶时间 (UTC-8/-7)' },
    { value: 'Europe/London', label: '伦敦时间 (UTC+0/+1)' },
    { value: 'Europe/Paris', label: '巴黎时间 (UTC+1/+2)' },
    { value: 'Asia/Tokyo', label: '东京时间 (UTC+9)' },
    { value: 'Asia/Seoul', label: '首尔时间 (UTC+9)' },
    { value: 'Australia/Sydney', label: '悉尼时间 (UTC+10/+11)' },
    { value: 'UTC', label: 'UTC 时间' },
  ];

  // 清空所有
  const clearAll = () => {
    setTimestamp('');
    setDatetime('');
  };

  // 格式化当前时间显示
  const formatCurrentTime = (date: Date) => {
    return {
      datetime: date.toISOString().replace('T', ' ').split('.')[0],
      timestamp: Math.floor(date.getTime() / 1000),
      timestampMs: date.getTime(),
      iso: date.toISOString(),
      utc: date.toUTCString(),
    };
  };

  const currentTimeInfo = currentTime ? formatCurrentTime(currentTime) : null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Link href="/tools">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">时间戳转换器</h1>
            <p className="text-muted-foreground">
              时间格式转换工具，支持时间戳转换、时区转换、日期格式化、时间计算
            </p>
          </div>
        </div>
      </div>

      {/* 标签页 */}
      <Card className="mb-6">
        <CardContent className="p-0">
          <div className="flex border-b">
            {[
              { key: 'converter', name: '时间戳转换', icon: Clock },
              { key: 'timezone', name: '时区转换', icon: RefreshCw },
              { key: 'calculator', name: '日期计算', icon: Calendar },
            ].map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
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

      {/* 时间戳转换标签页 */}
      {activeTab === 'converter' && (
        <>
          {/* 当前时间显示 */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5" />
                当前时间
              </CardTitle>
            </CardHeader>
            <CardContent>
              {currentTimeInfo ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">本地时间</div>
                    <div className="font-mono text-lg">{currentTimeInfo.datetime}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">时间戳（秒）</div>
                    <div className="font-mono text-lg flex items-center gap-2">
                      {currentTimeInfo.timestamp}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          copyToClipboard(currentTimeInfo.timestamp.toString(), 'current-timestamp')
                        }
                      >
                        {copied === 'current-timestamp' ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">时间戳（毫秒）</div>
                    <div className="font-mono text-lg flex items-center gap-2">
                      {currentTimeInfo.timestampMs}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          copyToClipboard(
                            currentTimeInfo.timestampMs.toString(),
                            'current-timestamp-ms'
                          )
                        }
                      >
                        {copied === 'current-timestamp-ms' ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted-foreground">正在加载当前时间...</div>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 时间戳转日期时间 */}
            <Card>
              <CardHeader>
                <CardTitle>时间戳 → 日期时间</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">时间戳</label>
                  <input
                    type="text"
                    value={timestamp}
                    onChange={(e) => setTimestamp(e.target.value)}
                    placeholder="输入时间戳（支持秒级和毫秒级）"
                    className="w-full p-3 border border-border rounded-lg bg-background font-mono focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={timestampToDatetime} className="flex-1">
                    转换
                  </Button>
                  <Button onClick={getCurrentTimestamp} variant="outline">
                    当前时间戳
                  </Button>
                </div>

                {datetime && (
                  <div>
                    <label className="block text-sm font-medium mb-2">转换结果</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={datetime}
                        readOnly
                        className="flex-1 p-3 border border-border rounded-lg bg-muted/50 font-mono"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(datetime, 'datetime')}
                      >
                        {copied === 'datetime' ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 日期时间转时间戳 */}
            <Card>
              <CardHeader>
                <CardTitle>日期时间 → 时间戳</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">日期时间</label>
                  <input
                    type="text"
                    value={datetime}
                    onChange={(e) => setDatetime(e.target.value)}
                    placeholder="YYYY-MM-DD HH:mm:ss"
                    className="w-full p-3 border border-border rounded-lg bg-background font-mono focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={datetimeToTimestamp} className="flex-1">
                    转换
                  </Button>
                  <Button onClick={getCurrentDatetime} variant="outline">
                    当前时间
                  </Button>
                </div>

                {timestamp && (
                  <div>
                    <label className="block text-sm font-medium mb-2">转换结果</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={timestamp}
                        readOnly
                        className="flex-1 p-3 border border-border rounded-lg bg-muted/50 font-mono"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(timestamp, 'timestamp')}
                      >
                        {copied === 'timestamp' ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* 操作按钮 */}
          <div className="mt-6 flex justify-center">
            <Button onClick={clearAll} variant="outline">
              清空所有
            </Button>
          </div>
        </>
      )}

      {/* 时区转换标签页 */}
      {activeTab === 'timezone' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>时区转换</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">源时区</label>
                  <select
                    value={sourceTimezone}
                    onChange={(e) => setSourceTimezone(e.target.value)}
                    className="w-full p-2 border border-border rounded-lg bg-background"
                  >
                    {timezones.map((tz) => (
                      <option key={tz.value} value={tz.value}>
                        {tz.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">目标时区</label>
                  <select
                    value={targetTimezone}
                    onChange={(e) => setTargetTimezone(e.target.value)}
                    className="w-full p-2 border border-border rounded-lg bg-background"
                  >
                    {timezones.map((tz) => (
                      <option key={tz.value} value={tz.value}>
                        {tz.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">输入时间</label>
                <input
                  type="datetime-local"
                  value={sourceDateTime}
                  onChange={(e) => setSourceDateTime(e.target.value)}
                  className="w-full p-3 border border-border rounded-lg bg-background"
                />
              </div>

              {sourceDateTime &&
                (() => {
                  const result = convertTimezone(sourceDateTime, sourceTimezone, targetTimezone);
                  if (!result) return <p className="text-red-500">时间格式错误</p>;

                  return (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                          <h4 className="font-medium text-blue-700 dark:text-blue-300 mb-2">
                            源时间
                          </h4>
                          <p className="font-mono">{result.original}</p>
                          <p className="text-sm text-muted-foreground">{sourceTimezone}</p>
                        </div>
                        <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                          <h4 className="font-medium text-green-700 dark:text-green-300 mb-2">
                            转换后
                          </h4>
                          <p className="font-mono">{result.converted}</p>
                          <p className="text-sm text-muted-foreground">{targetTimezone}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-3 bg-muted/50 rounded-lg">
                          <div className="text-sm text-muted-foreground">时间戳</div>
                          <div className="font-mono flex items-center gap-2">
                            {result.timestamp}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                copyToClipboard(result.timestamp.toString(), 'tz-timestamp')
                              }
                            >
                              {copied === 'tz-timestamp' ? (
                                <Check className="h-3 w-3" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </Button>
                          </div>
                        </div>
                        <div className="p-3 bg-muted/50 rounded-lg">
                          <div className="text-sm text-muted-foreground">ISO格式</div>
                          <div className="font-mono flex items-center gap-2">
                            {result.iso}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(result.iso, 'tz-iso')}
                            >
                              {copied === 'tz-iso' ? (
                                <Check className="h-3 w-3" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
            </CardContent>
          </Card>
        </div>
      )}

      {/* 日期计算标签页 */}
      {activeTab === 'calculator' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>日期差计算</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">开始日期</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full p-3 border border-border rounded-lg bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">结束日期</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full p-3 border border-border rounded-lg bg-background"
                  />
                </div>
              </div>

              {startDate &&
                endDate &&
                (() => {
                  const diff = calculateDateDiff(startDate, endDate);
                  if (!diff) return <p className="text-red-500">日期格式错误</p>;

                  return (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold">{Math.abs(diff.days)}</div>
                        <div className="text-sm text-muted-foreground">天</div>
                      </div>
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold">{Math.abs(diff.hours)}</div>
                        <div className="text-sm text-muted-foreground">小时</div>
                      </div>
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold">{Math.abs(diff.minutes)}</div>
                        <div className="text-sm text-muted-foreground">分钟</div>
                      </div>
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold">{Math.abs(diff.seconds)}</div>
                        <div className="text-sm text-muted-foreground">秒</div>
                      </div>
                    </div>
                  );
                })()}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>日期加减</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">基准日期</label>
                  <input
                    type="date"
                    value={baseDate}
                    onChange={(e) => setBaseDate(e.target.value)}
                    className="w-full p-3 border border-border rounded-lg bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">增减天数</label>
                  <input
                    type="number"
                    value={addDays}
                    onChange={(e) => setAddDays(e.target.value)}
                    placeholder="正数为增加，负数为减少"
                    className="w-full p-3 border border-border rounded-lg bg-background"
                  />
                </div>
              </div>

              {baseDate &&
                (() => {
                  const result = addDaysToDate(baseDate, parseInt(addDays) || 0);
                  if (!result) return <p className="text-red-500">日期格式错误</p>;

                  return (
                    <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                      <h4 className="font-medium text-green-700 dark:text-green-300 mb-2">
                        计算结果
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>结果日期：</span>
                          <span className="font-mono">{result.result}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>格式化：</span>
                          <span className="font-mono">{result.formatted}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>时间戳：</span>
                          <span className="font-mono">{result.timestamp}</span>
                        </div>
                      </div>
                    </div>
                  );
                })()}
            </CardContent>
          </Card>
        </div>
      )}

      {/* 使用说明 */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>使用说明</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">时间戳格式</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>
                • <strong>秒级时间戳</strong>：10位数字，如 1640995200
              </li>
              <li>
                • <strong>毫秒级时间戳</strong>：13位数字，如 1640995200000
              </li>
              <li>• 工具会自动识别时间戳类型</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">日期时间格式</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• 标准格式：YYYY-MM-DD HH:mm:ss</li>
              <li>• 支持格式：2024-01-01 12:00:00</li>
              <li>• 也支持：2024/01/01 12:00:00</li>
              <li>• ISO格式：2024-01-01T12:00:00Z</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">常见用途</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• 数据库时间字段转换</li>
              <li>• API 接口时间参数处理</li>
              <li>• 日志文件时间分析</li>
              <li>• 程序开发时间调试</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
