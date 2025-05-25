'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Copy, Check, Calendar, Clock } from 'lucide-react';
import Link from 'next/link';

export default function DateCalculatorPage() {
  const [mode, setMode] = useState<'diff' | 'add' | 'format' | 'age'>('diff');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [baseDate, setBaseDate] = useState('');
  const [addYears, setAddYears] = useState(0);
  const [addMonths, setAddMonths] = useState(0);
  const [addDays, setAddDays] = useState(0);
  const [birthDate, setBirthDate] = useState('');
  const [formatDate, setFormatDate] = useState('');
  const [results, setResults] = useState<any>(null);
  const [copied, setCopied] = useState<string | null>(null);

  // 计算日期差
  const calculateDateDiff = () => {
    if (!startDate || !endDate) return null;

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) return null;

    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = Math.abs(
      (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth())
    );
    const diffYears = Math.abs(end.getFullYear() - start.getFullYear());

    const hours = Math.floor(diffTime / (1000 * 60 * 60));
    const minutes = Math.floor(diffTime / (1000 * 60));
    const seconds = Math.floor(diffTime / 1000);

    return {
      days: diffDays,
      weeks: diffWeeks,
      months: diffMonths,
      years: diffYears,
      hours,
      minutes,
      seconds,
      workdays: calculateWorkdays(start, end),
      direction: end > start ? '未来' : '过去',
    };
  };

  // 计算工作日
  const calculateWorkdays = (start: Date, end: Date): number => {
    let workdays = 0;
    const current = new Date(start);

    while (current <= end) {
      const dayOfWeek = current.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        // 不是周末
        workdays++;
      }
      current.setDate(current.getDate() + 1);
    }

    return workdays;
  };

  // 日期加减
  const calculateDateAdd = () => {
    if (!baseDate) return null;

    const base = new Date(baseDate);
    if (isNaN(base.getTime())) return null;

    const result = new Date(base);
    result.setFullYear(result.getFullYear() + addYears);
    result.setMonth(result.getMonth() + addMonths);
    result.setDate(result.getDate() + addDays);

    return {
      originalDate: base.toLocaleDateString('zh-CN'),
      resultDate: result.toLocaleDateString('zh-CN'),
      resultDateISO: result.toISOString().split('T')[0],
      dayOfWeek: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][result.getDay()],
      weekOfYear: getWeekOfYear(result),
      dayOfYear: getDayOfYear(result),
    };
  };

  // 计算年龄
  const calculateAge = () => {
    if (!birthDate) return null;

    const birth = new Date(birthDate);
    const today = new Date();

    if (isNaN(birth.getTime()) || birth > today) return null;

    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    let days = today.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += lastMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    const totalDays = Math.floor((today.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = years * 12 + months;

    // 下一个生日
    const nextBirthday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBirthday < today) {
      nextBirthday.setFullYear(today.getFullYear() + 1);
    }
    const daysToNextBirthday = Math.ceil(
      (nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    return {
      years,
      months,
      days,
      totalDays,
      totalWeeks,
      totalMonths,
      nextBirthday: nextBirthday.toLocaleDateString('zh-CN'),
      daysToNextBirthday,
      zodiacSign: getZodiacSign(birth.getMonth() + 1, birth.getDate()),
      chineseZodiac: getChineseZodiac(birth.getFullYear()),
    };
  };

  // 日期格式化
  const formatDateString = () => {
    if (!formatDate) return null;

    const date = new Date(formatDate);
    if (isNaN(date.getTime())) return null;

    return {
      iso: date.toISOString(),
      isoDate: date.toISOString().split('T')[0],
      isoTime: date.toISOString().split('T')[1],
      local: date.toISOString().replace('T', ' ').split('.')[0],
      localDate: date.toISOString().split('T')[0],
      localTime: date.toISOString().split('T')[1].split('.')[0],
      utc: date.toUTCString(),
      timestamp: date.getTime(),
      timestampSeconds: Math.floor(date.getTime() / 1000),
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
      dayOfWeek: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][date.getDay()],
      weekOfYear: getWeekOfYear(date),
      dayOfYear: getDayOfYear(date),
      quarter: Math.floor(date.getMonth() / 3) + 1,
    };
  };

  // 获取星座
  const getZodiacSign = (month: number, day: number): string => {
    const signs = [
      '摩羯座',
      '水瓶座',
      '双鱼座',
      '白羊座',
      '金牛座',
      '双子座',
      '巨蟹座',
      '狮子座',
      '处女座',
      '天秤座',
      '天蝎座',
      '射手座',
    ];
    const dates = [20, 19, 21, 20, 21, 22, 23, 23, 23, 24, 23, 22];
    return day < dates[month - 1] ? signs[month - 1] : signs[month % 12];
  };

  // 获取生肖
  const getChineseZodiac = (year: number): string => {
    const animals = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];
    return animals[(year - 1900) % 12];
  };

  // 获取第几周
  const getWeekOfYear = (date: Date): number => {
    const start = new Date(date.getFullYear(), 0, 1);
    const days = Math.floor((date.getTime() - start.getTime()) / (24 * 60 * 60 * 1000));
    return Math.ceil((days + start.getDay() + 1) / 7);
  };

  // 获取第几天
  const getDayOfYear = (date: Date): number => {
    const start = new Date(date.getFullYear(), 0, 1);
    return Math.floor((date.getTime() - start.getTime()) / (24 * 60 * 60 * 1000)) + 1;
  };

  // 执行计算
  const calculate = () => {
    let result = null;
    switch (mode) {
      case 'diff':
        result = calculateDateDiff();
        break;
      case 'add':
        result = calculateDateAdd();
        break;
      case 'age':
        result = calculateAge();
        break;
      case 'format':
        result = formatDateString();
        break;
    }
    setResults(result);
  };

  // 复制结果
  const copyResult = async (value: string, type: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  // 设置今天
  const setToday = (field: 'start' | 'end' | 'base' | 'birth' | 'format') => {
    const today = new Date().toISOString().split('T')[0];
    switch (field) {
      case 'start':
        setStartDate(today);
        break;
      case 'end':
        setEndDate(today);
        break;
      case 'base':
        setBaseDate(today);
        break;
      case 'birth':
        setBirthDate(today);
        break;
      case 'format':
        setFormatDate(today);
        break;
    }
  };

  React.useEffect(() => {
    calculate();
  }, [mode, startDate, endDate, baseDate, addYears, addMonths, addDays, birthDate, formatDate]);

  const modes = [
    { key: 'diff', name: '日期差计算', icon: Calendar },
    { key: 'add', name: '日期加减', icon: Clock },
    { key: 'age', name: '年龄计算', icon: Calendar },
    { key: 'format', name: '日期格式化', icon: Clock },
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
          <Calendar className="h-8 w-8" />
          日期计算器
        </h1>
        <p className="text-muted-foreground mt-2">计算日期差、日期加减、年龄计算和日期格式转换</p>
      </div>

      {/* 模式选择 */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {modes.map(m => {
            const IconComponent = m.icon;
            return (
              <Button
                key={m.key}
                variant={mode === m.key ? 'default' : 'outline'}
                onClick={() => setMode(m.key as any)}
                className="flex items-center gap-2"
              >
                <IconComponent className="h-4 w-4" />
                {m.name}
              </Button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 输入面板 */}
        <Card>
          <CardHeader>
            <CardTitle>
              {mode === 'diff' && '日期差计算'}
              {mode === 'add' && '日期加减'}
              {mode === 'age' && '年龄计算'}
              {mode === 'format' && '日期格式化'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 日期差计算 */}
            {mode === 'diff' && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2">开始日期</label>
                  <div className="flex gap-2">
                    <input
                      type="date"
                      value={startDate}
                      onChange={e => setStartDate(e.target.value)}
                      className="flex-1 p-3 border border-border rounded-lg bg-background"
                    />
                    <Button onClick={() => setToday('start')} variant="outline" size="sm">
                      今天
                    </Button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">结束日期</label>
                  <div className="flex gap-2">
                    <input
                      type="date"
                      value={endDate}
                      onChange={e => setEndDate(e.target.value)}
                      className="flex-1 p-3 border border-border rounded-lg bg-background"
                    />
                    <Button onClick={() => setToday('end')} variant="outline" size="sm">
                      今天
                    </Button>
                  </div>
                </div>
              </>
            )}

            {/* 日期加减 */}
            {mode === 'add' && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2">基准日期</label>
                  <div className="flex gap-2">
                    <input
                      type="date"
                      value={baseDate}
                      onChange={e => setBaseDate(e.target.value)}
                      className="flex-1 p-3 border border-border rounded-lg bg-background"
                    />
                    <Button onClick={() => setToday('base')} variant="outline" size="sm">
                      今天
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">年</label>
                    <input
                      type="number"
                      value={addYears}
                      onChange={e => setAddYears(Number(e.target.value))}
                      className="w-full p-3 border border-border rounded-lg bg-background"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">月</label>
                    <input
                      type="number"
                      value={addMonths}
                      onChange={e => setAddMonths(Number(e.target.value))}
                      className="w-full p-3 border border-border rounded-lg bg-background"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">日</label>
                    <input
                      type="number"
                      value={addDays}
                      onChange={e => setAddDays(Number(e.target.value))}
                      className="w-full p-3 border border-border rounded-lg bg-background"
                    />
                  </div>
                </div>
              </>
            )}

            {/* 年龄计算 */}
            {mode === 'age' && (
              <div>
                <label className="block text-sm font-medium mb-2">出生日期</label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={birthDate}
                    onChange={e => setBirthDate(e.target.value)}
                    className="flex-1 p-3 border border-border rounded-lg bg-background"
                  />
                  <Button onClick={() => setToday('birth')} variant="outline" size="sm">
                    今天
                  </Button>
                </div>
              </div>
            )}

            {/* 日期格式化 */}
            {mode === 'format' && (
              <div>
                <label className="block text-sm font-medium mb-2">日期</label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={formatDate}
                    onChange={e => setFormatDate(e.target.value)}
                    className="flex-1 p-3 border border-border rounded-lg bg-background"
                  />
                  <Button onClick={() => setToday('format')} variant="outline" size="sm">
                    今天
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 结果面板 */}
        <Card>
          <CardHeader>
            <CardTitle>计算结果</CardTitle>
          </CardHeader>
          <CardContent>
            {!results ? (
              <div className="text-center py-8 text-muted-foreground">请输入日期进行计算</div>
            ) : (
              <div className="space-y-3">
                {/* 日期差结果 */}
                {mode === 'diff' && results && (
                  <>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex justify-between">
                        <span>相差天数:</span>
                        <span className="font-mono">{results.days} 天</span>
                      </div>
                      <div className="flex justify-between">
                        <span>相差周数:</span>
                        <span className="font-mono">{results.weeks} 周</span>
                      </div>
                      <div className="flex justify-between">
                        <span>相差月数:</span>
                        <span className="font-mono">{results.months} 月</span>
                      </div>
                      <div className="flex justify-between">
                        <span>相差年数:</span>
                        <span className="font-mono">{results.years} 年</span>
                      </div>
                      <div className="flex justify-between">
                        <span>工作日:</span>
                        <span className="font-mono">{results.workdays} 天</span>
                      </div>
                      <div className="flex justify-between">
                        <span>总小时:</span>
                        <span className="font-mono">{results.hours.toLocaleString()} 小时</span>
                      </div>
                    </div>
                  </>
                )}

                {/* 日期加减结果 */}
                {mode === 'add' && results && (
                  <>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>原始日期:</span>
                        <span className="font-mono">{results.originalDate}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>结果日期:</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono">{results.resultDate}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyResult(results.resultDateISO, 'result')}
                          >
                            {copied === 'result' ? (
                              <Check className="h-3 w-3" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span>星期:</span>
                        <span>{results.dayOfWeek}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>第几周:</span>
                        <span>第 {results.weekOfYear} 周</span>
                      </div>
                      <div className="flex justify-between">
                        <span>第几天:</span>
                        <span>第 {results.dayOfYear} 天</span>
                      </div>
                    </div>
                  </>
                )}

                {/* 年龄计算结果 */}
                {mode === 'age' && results && (
                  <>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>年龄:</span>
                        <span className="font-mono">
                          {results.years} 岁 {results.months} 月 {results.days} 天
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>总天数:</span>
                        <span className="font-mono">{results.totalDays.toLocaleString()} 天</span>
                      </div>
                      <div className="flex justify-between">
                        <span>总周数:</span>
                        <span className="font-mono">{results.totalWeeks.toLocaleString()} 周</span>
                      </div>
                      <div className="flex justify-between">
                        <span>总月数:</span>
                        <span className="font-mono">{results.totalMonths} 月</span>
                      </div>
                      <div className="flex justify-between">
                        <span>下次生日:</span>
                        <span>{results.nextBirthday}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>距离生日:</span>
                        <span>{results.daysToNextBirthday} 天</span>
                      </div>
                      <div className="flex justify-between">
                        <span>星座:</span>
                        <span>{results.zodiacSign}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>生肖:</span>
                        <span>{results.chineseZodiac}</span>
                      </div>
                    </div>
                  </>
                )}

                {/* 日期格式化结果 */}
                {mode === 'format' && results && (
                  <>
                    <div className="space-y-2 text-sm">
                      {[
                        { label: 'ISO 格式', value: results.iso, key: 'iso' },
                        { label: 'ISO 日期', value: results.isoDate, key: 'isoDate' },
                        { label: '本地格式', value: results.local, key: 'local' },
                        { label: 'UTC 格式', value: results.utc, key: 'utc' },
                        { label: '时间戳', value: results.timestamp.toString(), key: 'timestamp' },
                        {
                          label: '时间戳(秒)',
                          value: results.timestampSeconds.toString(),
                          key: 'timestampSeconds',
                        },
                      ].map(item => (
                        <div key={item.key} className="flex justify-between items-center">
                          <span>{item.label}:</span>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs">{item.value}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyResult(item.value, item.key)}
                            >
                              {copied === item.key ? (
                                <Check className="h-3 w-3" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
