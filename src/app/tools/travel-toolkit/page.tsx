'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, MapPin, Calculator, Cloud, DollarSign } from 'lucide-react';
import Link from 'next/link';

interface WeatherCurrent {
  temp: number;
  condition: string;
  humidity: number;
  wind: number;
}

interface ForecastDay {
  date: string;
  high: number;
  low: number;
  condition: string;
}

interface WeatherData {
  city: string;
  current: WeatherCurrent;
  forecast: ForecastDay[];
}

type TabKey = 'planner' | 'budget' | 'weather' | 'currency';

interface Tab {
  key: TabKey;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
}

export default function TravelToolkitPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('planner');

  // 行程规划器
  const TripPlanner = () => {
    const [destination, setDestination] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [travelers, setTravelers] = useState(2);
    const [budget, setBudget] = useState(5000);

    const generateItinerary = () => {
      if (!destination || !startDate || !endDate) return null;

      const start = new Date(startDate);
      const end = new Date(endDate);
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

      return {
        destination,
        days,
        dailyBudget: Math.round(budget / days),
        suggestions: [
          '第1天: 抵达目的地，办理入住，市区观光',
          '第2天: 主要景点游览，当地美食体验',
          '第3天: 文化体验，购物，休闲活动',
          `第${days}天: 最后购物，准备离开`
        ]
      };
    };

    const itinerary = generateItinerary();

    return (
      <Card>
        <CardHeader><CardTitle>行程规划器</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">目的地</label>
              <input
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full p-2 border rounded-lg"
                placeholder="输入目的地"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">出行人数</label>
              <input
                type="number"
                value={travelers}
                onChange={(e) => setTravelers(Number(e.target.value))}
                className="w-full p-2 border rounded-lg"
                min="1"
                max="20"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">出发日期</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-2 border rounded-lg"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">返回日期</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full p-2 border rounded-lg"
              />
            </div>
            
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-2">总预算 (¥)</label>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full p-2 border rounded-lg"
                min="0"
              />
            </div>
          </div>

          {itinerary && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 bg-blue-50 rounded-lg text-center">
                  <div className="text-lg font-bold text-blue-600">{itinerary.days}</div>
                  <div className="text-sm text-muted-foreground">天数</div>
                </div>
                <div className="p-3 bg-green-50 rounded-lg text-center">
                  <div className="text-lg font-bold text-green-600">¥{itinerary.dailyBudget}</div>
                  <div className="text-sm text-muted-foreground">日均预算</div>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg text-center">
                  <div className="text-lg font-bold text-purple-600">{travelers}</div>
                  <div className="text-sm text-muted-foreground">出行人数</div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-3">建议行程</h4>
                <div className="space-y-2">
                  {itinerary.suggestions.map((suggestion, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div className="text-sm">{suggestion}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="p-4 bg-yellow-50 rounded-lg">
            <h4 className="font-medium mb-2">旅行清单</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>• 护照/身份证</div>
              <div>• 机票/车票</div>
              <div>• 酒店预订确认</div>
              <div>• 旅行保险</div>
              <div>• 充电器/转换插头</div>
              <div>• 常用药品</div>
              <div>• 现金/银行卡</div>
              <div>• 相机/手机</div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // 费用计算器
  const BudgetCalculator = () => {
    const [transportation, setTransportation] = useState(2000);
    const [accommodation, setAccommodation] = useState(1500);
    const [food, setFood] = useState(1000);
    const [activities, setActivities] = useState(800);
    const [shopping, setShopping] = useState(500);
    const [others, setOthers] = useState(200);

    const total = transportation + accommodation + food + activities + shopping + others;

    const categories = [
      { name: '交通', value: transportation, setter: setTransportation, color: 'bg-blue-500' },
      { name: '住宿', value: accommodation, setter: setAccommodation, color: 'bg-green-500' },
      { name: '餐饮', value: food, setter: setFood, color: 'bg-yellow-500' },
      { name: '活动', value: activities, setter: setActivities, color: 'bg-purple-500' },
      { name: '购物', value: shopping, setter: setShopping, color: 'bg-pink-500' },
      { name: '其他', value: others, setter: setOthers, color: 'bg-gray-500' },
    ];

    return (
      <Card>
        <CardHeader><CardTitle>费用计算器</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {categories.map((category) => (
              <div key={category.name} className="flex items-center gap-4">
                <div className={`w-4 h-4 rounded ${category.color}`}></div>
                <label className="w-16 text-sm font-medium">{category.name}</label>
                <input
                  type="number"
                  value={category.value}
                  onChange={(e) => category.setter(Number(e.target.value))}
                  className="flex-1 p-2 border rounded-lg"
                  min="0"
                />
                <span className="w-16 text-sm text-muted-foreground">
                  {((category.value / total) * 100).toFixed(1)}%
                </span>
              </div>
            ))}
          </div>

          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium">总费用</span>
              <span className="text-2xl font-bold text-blue-600">¥{total.toLocaleString()}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-green-50 rounded-lg text-center">
              <div className="text-lg font-bold text-green-600">¥{Math.round(total / 7)}</div>
              <div className="text-sm text-muted-foreground">日均费用 (7天)</div>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg text-center">
              <div className="text-lg font-bold text-purple-600">¥{Math.round(total / 2)}</div>
              <div className="text-sm text-muted-foreground">人均费用 (2人)</div>
            </div>
          </div>

          <div className="p-4 bg-yellow-50 rounded-lg">
            <h4 className="font-medium mb-2">省钱小贴士</h4>
            <div className="text-sm space-y-1">
              <div>• 提前预订机票和酒店可享受折扣</div>
              <div>• 选择当地交通工具而非出租车</div>
              <div>• 尝试当地街头美食，性价比更高</div>
              <div>• 寻找免费的景点和活动</div>
              <div>• 购买旅游套票可能更划算</div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // 天气查询
  const WeatherChecker = () => {
    const [city, setCity] = useState('北京');
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);

    const checkWeather = () => {
      // 模拟天气数据
      const mockWeather = {
        city,
        current: {
          temp: Math.round(Math.random() * 30 + 5),
          condition: ['晴', '多云', '阴', '小雨', '大雨'][Math.floor(Math.random() * 5)],
          humidity: Math.round(Math.random() * 40 + 40),
          wind: Math.round(Math.random() * 10 + 5)
        },
        forecast: Array.from({ length: 7 }, (_, i) => ({
          date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toLocaleDateString(),
          high: Math.round(Math.random() * 30 + 10),
          low: Math.round(Math.random() * 15 + 5),
          condition: ['晴', '多云', '阴', '小雨'][Math.floor(Math.random() * 4)]
        }))
      };
      setWeatherData(mockWeather);
    };

    return (
      <Card>
        <CardHeader><CardTitle>天气查询</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="flex-1 p-2 border rounded-lg"
              placeholder="输入城市名称"
            />
            <Button onClick={checkWeather}>查询天气</Button>
          </div>

          {weatherData && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium mb-2">{weatherData.city} - 当前天气</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-3xl font-bold text-blue-600">
                      {weatherData.current.temp}°C
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {weatherData.current.condition}
                    </div>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div>湿度: {weatherData.current.humidity}%</div>
                    <div>风速: {weatherData.current.wind} km/h</div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">7天预报</h4>
                <div className="space-y-2">
                  {weatherData.forecast.map((day: ForecastDay, index: number) => (
                    <div key={index} className="flex justify-between items-center p-2 border rounded">
                      <span className="text-sm">{day.date}</span>
                      <span className="text-sm">{day.condition}</span>
                      <span className="text-sm font-medium">
                        {day.high}°/{day.low}°
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-medium mb-2">穿衣建议</h4>
            <div className="text-sm space-y-1">
              <div>• 0-10°C: 厚外套、毛衣、长裤</div>
              <div>• 10-20°C: 薄外套、长袖、长裤</div>
              <div>• 20-25°C: 长袖或短袖、长裤</div>
              <div>• 25°C以上: 短袖、短裤、防晒</div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // 汇率转换
  const CurrencyConverter = () => {
    const [amount, setAmount] = useState(1000);
    const [fromCurrency, setFromCurrency] = useState('CNY');
    const [toCurrency, setToCurrency] = useState('USD');

    const exchangeRates: { [key: string]: number } = {
      'CNY': 1,
      'USD': 0.14,
      'EUR': 0.13,
      'JPY': 20.5,
      'GBP': 0.11,
      'KRW': 185,
      'THB': 4.9,
      'SGD': 0.19
    };

    const currencies = [
      { code: 'CNY', name: '人民币', symbol: '¥' },
      { code: 'USD', name: '美元', symbol: '$' },
      { code: 'EUR', name: '欧元', symbol: '€' },
      { code: 'JPY', name: '日元', symbol: '¥' },
      { code: 'GBP', name: '英镑', symbol: '£' },
      { code: 'KRW', name: '韩元', symbol: '₩' },
      { code: 'THB', name: '泰铢', symbol: '฿' },
      { code: 'SGD', name: '新加坡元', symbol: 'S$' }
    ];

    const convertCurrency = () => {
      const fromRate = exchangeRates[fromCurrency];
      const toRate = exchangeRates[toCurrency];
      return (amount / fromRate * toRate).toFixed(2);
    };

    return (
      <Card>
        <CardHeader><CardTitle>汇率转换</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">金额</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full p-2 border rounded-lg"
                min="0"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">从</label>
              <select
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                className="w-full p-2 border rounded-lg"
              >
                {currencies.map(currency => (
                  <option key={currency.code} value={currency.code}>
                    {currency.code} - {currency.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">到</label>
              <select
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                className="w-full p-2 border rounded-lg"
              >
                {currencies.map(currency => (
                  <option key={currency.code} value={currency.code}>
                    {currency.code} - {currency.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="p-4 bg-green-50 rounded-lg">
            <div className="text-center">
              <div className="text-lg">
                {amount} {fromCurrency} =
              </div>
              <div className="text-3xl font-bold text-green-600 mt-2">
                {convertCurrency()} {toCurrency}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {currencies.slice(0, 6).map(currency => (
              <div key={currency.code} className="p-2 border rounded text-center">
                <div className="font-medium">{currency.code}</div>
                <div className="text-sm text-muted-foreground">
                  1 CNY = {exchangeRates[currency.code]} {currency.code}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-yellow-50 rounded-lg">
            <h4 className="font-medium mb-2">汇率提醒</h4>
            <div className="text-sm space-y-1">
              <div>• 汇率实时变动，请以银行实际汇率为准</div>
              <div>• 建议提前兑换一些当地货币</div>
              <div>• 使用银联卡在境外取现可能更划算</div>
              <div>• 关注汇率走势，选择合适的兑换时机</div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const tabs: Tab[] = [
    { key: 'planner', name: '行程规划', icon: MapPin },
    { key: 'budget', name: '费用计算', icon: Calculator },
    { key: 'weather', name: '天气查询', icon: Cloud },
    { key: 'currency', name: '汇率转换', icon: DollarSign },
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
          <MapPin className="h-8 w-8" />
          旅行工具集
        </h1>
        <p className="text-muted-foreground mt-2">
          旅行助手工具，包括行程规划、费用计算、天气查询、汇率转换
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

      {activeTab === 'planner' && <TripPlanner />}
      {activeTab === 'budget' && <BudgetCalculator />}
      {activeTab === 'weather' && <WeatherChecker />}
      {activeTab === 'currency' && <CurrencyConverter />}
    </div>
  );
}