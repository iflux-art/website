'use client';

type CurrencyPair = 'CNY-USD' | 'USD-CNY' | 'CNY-EUR' | 'EUR-CNY' | 'CNY-JPY' | 'JPY-CNY';

type TabKey = 'health' | 'travel' | 'cooking' | 'shopping' | 'pets' | 'weather' | 'time';

interface Tab {
  key: TabKey;
  name: string;
  icon: React.ElementType;
}
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Heart, Plane, ChefHat, ShoppingCart, PawPrint, Cloud, Clock } from 'lucide-react';
import Link from 'next/link';

export default function LifestyleToolkitPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('health');

  // 健康管理
  const HealthTools = () => {
    const [height, setHeight] = useState(170);
    const [weight, setWeight] = useState(65);
    const [bmi, setBmi] = useState<number | null>(null);

    const calculateBMI = () => {
      const heightInMeters = height / 100;
      const calculatedBMI = weight / (heightInMeters * heightInMeters);
      setBmi(calculatedBMI);
    };

    const getBMICategory = (bmi: number) => {
      if (bmi < 18.5) return { category: '偏瘦', color: 'text-blue-600' };
      if (bmi < 24) return { category: '正常', color: 'text-green-600' };
      if (bmi < 28) return { category: '超重', color: 'text-yellow-600' };
      return { category: '肥胖', color: 'text-red-600' };
    };

    return (
      <Card>
        <CardHeader>
          <CardTitle>健康管理工具</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">身高 (cm)</label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="w-full p-3 border border-border rounded-lg bg-background"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">体重 (kg)</label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="w-full p-3 border border-border rounded-lg bg-background"
              />
            </div>
          </div>

          <Button onClick={calculateBMI} className="w-full">
            计算BMI
          </Button>

          {bmi && (
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold">{bmi.toFixed(1)}</div>
                <div className={`text-lg font-medium ${getBMICategory(bmi).color}`}>
                  {getBMICategory(bmi).category}
                </div>
              </div>
              <div className="mt-4 text-sm space-y-1">
                <div>• 偏瘦: BMI &lt; 18.5</div>
                <div>• 正常: 18.5 ≤ BMI &lt; 24</div>
                <div>• 超重: 24 ≤ BMI &lt; 28</div>
                <div>• 肥胖: BMI ≥ 28</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  // 旅行助手
  const TravelTools = () => {
    const [fromCurrency, setFromCurrency] = useState('CNY');
    const [toCurrency, setToCurrency] = useState('USD');
    const [amount, setAmount] = useState(100);
    const [convertedAmount, setConvertedAmount] = useState<number | null>(null);

    const exchangeRates: Record<CurrencyPair, number> = {
      'CNY-USD': 0.14,
      'USD-CNY': 7.2,
      'CNY-EUR': 0.13,
      'EUR-CNY': 7.8,
      'CNY-JPY': 20.5,
      'JPY-CNY': 0.049
    };

    const convertCurrency = () => {
      const rateKey = `${fromCurrency}-${toCurrency}`;
      const rate = exchangeRates[rateKey] || 1;
      setConvertedAmount(amount * rate);
    };

    return (
      <Card>
        <CardHeader>
          <CardTitle>旅行助手工具</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">从</label>
              <select
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                className="w-full p-3 border border-border rounded-lg bg-background"
              >
                <option value="CNY">人民币 (CNY)</option>
                <option value="USD">美元 (USD)</option>
                <option value="EUR">欧元 (EUR)</option>
                <option value="JPY">日元 (JPY)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">到</label>
              <select
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                className="w-full p-3 border border-border rounded-lg bg-background"
              >
                <option value="USD">美元 (USD)</option>
                <option value="CNY">人民币 (CNY)</option>
                <option value="EUR">欧元 (EUR)</option>
                <option value="JPY">日元 (JPY)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">金额</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full p-3 border border-border rounded-lg bg-background"
              />
            </div>
          </div>

          <Button onClick={convertCurrency} className="w-full">
            汇率转换
          </Button>

          {convertedAmount && (
            <div className="p-4 bg-muted/50 rounded-lg text-center">
              <div className="text-lg">
                {amount} {fromCurrency} = <span className="font-bold text-primary">{convertedAmount.toFixed(2)} {toCurrency}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  // 烹饪工具
  const CookingTools = () => {
    const [minutes, setMinutes] = useState(5);
    const [seconds, setSeconds] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);
    const [isRunning, setIsRunning] = useState(false);

    React.useEffect(() => {
      let interval: NodeJS.Timeout;
      if (isRunning && timeLeft > 0) {
        interval = setInterval(() => {
          setTimeLeft(timeLeft - 1);
        }, 1000);
      } else if (timeLeft === 0 && isRunning) {
        setIsRunning(false);
        alert('时间到！');
      }
      return () => clearInterval(interval);
    }, [isRunning, timeLeft]);

    const startTimer = () => {
      const totalSeconds = minutes * 60 + seconds;
      setTimeLeft(totalSeconds);
      setIsRunning(true);
    };

    const stopTimer = () => {
      setIsRunning(false);
    };

    const resetTimer = () => {
      setIsRunning(false);
      setTimeLeft(0);
    };

    const formatTime = (seconds: number) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
      <Card>
        <CardHeader>
          <CardTitle>烹饪定时器</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">分钟</label>
              <input
                type="number"
                min="0"
                max="60"
                value={minutes}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMinutes(Number(e.target.value))}
                className="w-full p-3 border border-border rounded-lg bg-background"
                disabled={isRunning}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">秒</label>
              <input
                type="number"
                min="0"
                max="59"
                value={seconds}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSeconds(Number(e.target.value))}
                className="w-full p-3 border border-border rounded-lg bg-background"
                disabled={isRunning}
              />
            </div>
          </div>

          <div className="text-center">
            <div className="text-4xl font-mono font-bold mb-4">
              {timeLeft > 0 ? formatTime(timeLeft) : formatTime(minutes * 60 + seconds)}
            </div>
            <div className="flex gap-2 justify-center">
              <Button onClick={startTimer} disabled={isRunning}>
                开始
              </Button>
              <Button onClick={stopTimer} disabled={!isRunning} variant="outline">
                暂停
              </Button>
              <Button onClick={resetTimer} variant="outline">
                重置
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const tabs: Tab[] = [
    { key: 'health', name: '健康管理', icon: Heart },
    { key: 'travel', name: '旅行助手', icon: Plane },
    { key: 'cooking', name: '烹饪工具', icon: ChefHat },
    { key: 'shopping', name: '购物助手', icon: ShoppingCart },
    { key: 'pets', name: '宠物护理', icon: PawPrint },
    { key: 'weather', name: '天气查询', icon: Cloud },
    { key: 'time', name: '时间管理', icon: Clock },
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
          <Heart className="h-8 w-8" />
          生活服务工具集
        </h1>
        <p className="text-muted-foreground mt-2">
          综合生活服务工具，包括健康管理、旅行助手、烹饪工具、购物助手、宠物护理、天气查询、时间管理
        </p>
      </div>

      {/* 标签页导航 */}
      <Card className="mb-6">
        <CardContent className="p-0">
          <div className="flex border-b overflow-x-auto">
            {tabs.map(tab => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 min-w-[120px] p-4 text-center border-b-2 transition-colors flex items-center justify-center gap-2 ${
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

      {/* 工具内容 */}
      <div className="max-w-2xl mx-auto">
        {activeTab === 'health' && <HealthTools />}
        {activeTab === 'travel' && <TravelTools />}
        {activeTab === 'cooking' && <CookingTools />}
        {activeTab !== 'health' && activeTab !== 'travel' && activeTab !== 'cooking' && (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-muted-foreground">
                {activeTab === 'shopping' && '购物助手功能开发中...'}
                {activeTab === 'pets' && '宠物护理功能开发中...'}
                {activeTab === 'weather' && '天气查询功能开发中...'}
                {activeTab === 'time' && '时间管理功能开发中...'}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}