'use client';

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Copy, Check, BarChart3, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function StatisticsCalculatorPage() {
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  // 解析数据
  const data = useMemo(() => {
    if (!input.trim()) return [];
    
    const numbers = input
      .split(/[,\s\n]+/)
      .map(str => parseFloat(str.trim()))
      .filter(num => !isNaN(num));
    
    return numbers.sort((a, b) => a - b);
  }, [input]);

  // 计算统计值
  const statistics = useMemo(() => {
    if (data.length === 0) return null;

    const n = data.length;
    const sum = data.reduce((acc, val) => acc + val, 0);
    const mean = sum / n;

    // 中位数
    const median = n % 2 === 0 
      ? (data[n / 2 - 1] + data[n / 2]) / 2 
      : data[Math.floor(n / 2)];

    // 众数
    const frequency: { [key: number]: number } = {};
    data.forEach(val => {
      frequency[val] = (frequency[val] || 0) + 1;
    });
    const maxFreq = Math.max(...Object.values(frequency));
    const modes = Object.keys(frequency)
      .filter(key => frequency[Number(key)] === maxFreq)
      .map(Number);

    // 方差和标准差
    const variance = data.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / n;
    const standardDeviation = Math.sqrt(variance);

    // 样本方差和样本标准差
    const sampleVariance = n > 1 ? data.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / (n - 1) : 0;
    const sampleStandardDeviation = Math.sqrt(sampleVariance);

    // 四分位数
    const q1Index = Math.floor(n * 0.25);
    const q3Index = Math.floor(n * 0.75);
    const q1 = data[q1Index];
    const q3 = data[q3Index];
    const iqr = q3 - q1;

    // 偏度和峰度
    const skewness = data.reduce((acc, val) => acc + Math.pow((val - mean) / standardDeviation, 3), 0) / n;
    const kurtosis = data.reduce((acc, val) => acc + Math.pow((val - mean) / standardDeviation, 4), 0) / n - 3;

    return {
      count: n,
      sum,
      mean,
      median,
      mode: modes.length === n ? '无众数' : modes.join(', '),
      min: data[0],
      max: data[n - 1],
      range: data[n - 1] - data[0],
      variance,
      standardDeviation,
      sampleVariance,
      sampleStandardDeviation,
      q1,
      q3,
      iqr,
      skewness,
      kurtosis,
    };
  }, [data]);

  // 复制结果
  const copyResult = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(label);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  // 复制所有结果
  const copyAllResults = async () => {
    if (!statistics) return;

    const report = `统计分析报告
================
数据个数: ${statistics.count}
总和: ${statistics.sum.toFixed(6)}
平均值: ${statistics.mean.toFixed(6)}
中位数: ${statistics.median.toFixed(6)}
众数: ${statistics.mode}
最小值: ${statistics.min.toFixed(6)}
最大值: ${statistics.max.toFixed(6)}
极差: ${statistics.range.toFixed(6)}
方差: ${statistics.variance.toFixed(6)}
标准差: ${statistics.standardDeviation.toFixed(6)}
样本方差: ${statistics.sampleVariance.toFixed(6)}
样本标准差: ${statistics.sampleStandardDeviation.toFixed(6)}
第一四分位数: ${statistics.q1.toFixed(6)}
第三四分位数: ${statistics.q3.toFixed(6)}
四分位距: ${statistics.iqr.toFixed(6)}
偏度: ${statistics.skewness.toFixed(6)}
峰度: ${statistics.kurtosis.toFixed(6)}

原始数据:
${input}`;

    try {
      await navigator.clipboard.writeText(report);
      setCopied('all');
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  // 清空
  const clearAll = () => {
    setInput('');
  };

  // 加载示例
  const loadExample = () => {
    setInput('12, 15, 18, 20, 22, 25, 28, 30, 32, 35, 38, 40, 42, 45, 48');
  };

  const statisticItems = statistics ? [
    { key: 'count', label: '数据个数', value: statistics.count.toString(), unit: '个' },
    { key: 'sum', label: '总和', value: statistics.sum.toFixed(6), unit: '' },
    { key: 'mean', label: '平均值', value: statistics.mean.toFixed(6), unit: '' },
    { key: 'median', label: '中位数', value: statistics.median.toFixed(6), unit: '' },
    { key: 'mode', label: '众数', value: statistics.mode, unit: '' },
    { key: 'min', label: '最小值', value: statistics.min.toFixed(6), unit: '' },
    { key: 'max', label: '最大值', value: statistics.max.toFixed(6), unit: '' },
    { key: 'range', label: '极差', value: statistics.range.toFixed(6), unit: '' },
    { key: 'variance', label: '方差', value: statistics.variance.toFixed(6), unit: '' },
    { key: 'standardDeviation', label: '标准差', value: statistics.standardDeviation.toFixed(6), unit: '' },
    { key: 'sampleVariance', label: '样本方差', value: statistics.sampleVariance.toFixed(6), unit: '' },
    { key: 'sampleStandardDeviation', label: '样本标准差', value: statistics.sampleStandardDeviation.toFixed(6), unit: '' },
    { key: 'q1', label: '第一四分位数 (Q1)', value: statistics.q1.toFixed(6), unit: '' },
    { key: 'q3', label: '第三四分位数 (Q3)', value: statistics.q3.toFixed(6), unit: '' },
    { key: 'iqr', label: '四分位距 (IQR)', value: statistics.iqr.toFixed(6), unit: '' },
    { key: 'skewness', label: '偏度', value: statistics.skewness.toFixed(6), unit: '' },
    { key: 'kurtosis', label: '峰度', value: statistics.kurtosis.toFixed(6), unit: '' },
  ] : [];

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
          <BarChart3 className="h-8 w-8" />
          统计计算器
        </h1>
        <p className="text-muted-foreground mt-2">
          计算数据集的各种统计指标，包括均值、方差、四分位数等
        </p>
      </div>

      {/* 操作按钮 */}
      <div className="mb-6 flex flex-wrap gap-2">
        <Button onClick={loadExample} variant="outline">
          加载示例
        </Button>
        <Button onClick={clearAll} variant="outline">
          清空
        </Button>
        {statistics && (
          <Button
            onClick={copyAllResults}
            variant="outline"
            className="flex items-center gap-2"
          >
            {copied === 'all' ? (
              <>
                <Check className="h-4 w-4" />
                已复制报告
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                复制完整报告
              </>
            )}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 数据输入 */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>数据输入</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  数据 (用逗号、空格或换行分隔)
                </label>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="输入数字数据，例如：&#10;1, 2, 3, 4, 5&#10;或&#10;1 2 3 4 5&#10;或每行一个数字"
                  className="w-full h-64 p-3 border border-border rounded-lg bg-background font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              
              {data.length > 0 && (
                <div className="text-sm text-muted-foreground">
                  已识别 {data.length} 个有效数字
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 统计结果 */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                统计结果
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!statistics ? (
                <div className="text-center py-12 text-muted-foreground">
                  请输入数字数据进行统计分析
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {statisticItems.map((item) => (
                    <div
                      key={item.key}
                      className="flex items-center justify-between p-3 border border-border rounded-lg bg-muted/50"
                    >
                      <div>
                        <div className="font-medium text-sm">{item.label}</div>
                        <div className="font-mono text-lg">
                          {item.value} {item.unit}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyResult(item.value, item.key)}
                        className="flex items-center gap-2"
                      >
                        {copied === item.key ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 数据预览 */}
      {data.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>数据预览 (已排序)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-mono text-sm bg-muted/50 p-3 rounded-lg max-h-32 overflow-y-auto">
              {data.join(', ')}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 统计说明 */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>统计指标说明</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">基本统计量</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• <strong>平均值</strong>：所有数据的算术平均</li>
              <li>• <strong>中位数</strong>：排序后位于中间位置的数值</li>
              <li>• <strong>众数</strong>：出现频率最高的数值</li>
              <li>• <strong>极差</strong>：最大值与最小值的差</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">离散程度</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• <strong>方差</strong>：数据偏离平均值的平方的平均数</li>
              <li>• <strong>标准差</strong>：方差的平方根，衡量数据的离散程度</li>
              <li>• <strong>样本方差/标准差</strong>：用于样本数据的无偏估计</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">四分位数</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• <strong>Q1</strong>：第一四分位数，25%的数据小于此值</li>
              <li>• <strong>Q3</strong>：第三四分位数，75%的数据小于此值</li>
              <li>• <strong>IQR</strong>：四分位距，Q3-Q1，衡量数据的中间50%的分布</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">分布形状</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• <strong>偏度</strong>：衡量分布的对称性，0为对称，正值右偏，负值左偏</li>
              <li>• <strong>峰度</strong>：衡量分布的尖锐程度，0为正态分布</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
