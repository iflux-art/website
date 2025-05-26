'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Cloud, Sun, CloudRain, Thermometer } from 'lucide-react';
import Link from 'next/link';

export default function WeatherToolkitPage() {
  const [activeTab, setActiveTab] = useState<'current' | 'forecast' | 'analysis' | 'clothing'>('current');

  // 当前天气
  const CurrentWeather = () => {
    const [city, setCity] = useState('北京');
    const [weather, setWeather] = useState<any>(null);

    const checkWeather = () => {
      // 模拟天气数据
      const mockWeather = {
        city,
        temperature: Math.round(Math.random() * 30 + 5),
        condition: ['晴', '多云', '阴', '小雨', '大雨'][Math.floor(Math.random() * 5)],
        humidity: Math.round(Math.random() * 40 + 40),
        windSpeed: Math.round(Math.random() * 10 + 5),
        pressure: Math.round(Math.random() * 50 + 1000),
        visibility: Math.round(Math.random() * 20 + 10),
        uvIndex: Math.round(Math.random() * 10),
        feelsLike: Math.round(Math.random() * 30 + 5)
      };
      setWeather(mockWeather);
    };

    const getWeatherIcon = (condition: string) => {
      switch (condition) {
        case '晴': return <Sun className="h-8 w-8 text-yellow-500" />;
        case '多云': return <Cloud className="h-8 w-8 text-gray-500" />;
        case '阴': return <Cloud className="h-8 w-8 text-gray-600" />;
        case '小雨':
        case '大雨': return <CloudRain className="h-8 w-8 text-blue-500" />;
        default: return <Sun className="h-8 w-8 text-yellow-500" />;
      }
    };

    return (
      <Card>
        <CardHeader><CardTitle>当前天气</CardTitle></CardHeader>
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

          {weather && (
            <div className="space-y-4">
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                <h3 className="text-xl font-bold mb-2">{weather.city}</h3>
                <div className="flex items-center justify-center gap-4 mb-4">
                  {getWeatherIcon(weather.condition)}
                  <div>
                    <div className="text-4xl font-bold">{weather.temperature}°C</div>
                    <div className="text-muted-foreground">{weather.condition}</div>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  体感温度: {weather.feelsLike}°C
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-muted-foreground">湿度</div>
                  <div className="text-lg font-bold">{weather.humidity}%</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-muted-foreground">风速</div>
                  <div className="text-lg font-bold">{weather.windSpeed} km/h</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-muted-foreground">气压</div>
                  <div className="text-lg font-bold">{weather.pressure} hPa</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-muted-foreground">能见度</div>
                  <div className="text-lg font-bold">{weather.visibility} km</div>
                </div>
              </div>

              <div className="p-4 bg-yellow-50 rounded-lg">
                <h4 className="font-medium mb-2">紫外线指数</h4>
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold">{weather.uvIndex}</div>
                  <div className="text-sm">
                    {weather.uvIndex <= 2 && '低'}
                    {weather.uvIndex > 2 && weather.uvIndex <= 5 && '中等'}
                    {weather.uvIndex > 5 && weather.uvIndex <= 7 && '高'}
                    {weather.uvIndex > 7 && weather.uvIndex <= 10 && '很高'}
                    {weather.uvIndex > 10 && '极高'}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {weather.uvIndex > 5 && '建议使用防晒霜和遮阳帽'}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  // 天气预报
  const WeatherForecast = () => {
    const [forecast, setForecast] = useState<any[]>([]);

    const generateForecast = () => {
      const conditions = ['晴', '多云', '阴', '小雨', '大雨'];
      const mockForecast = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() + i);
        return {
          date: date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }),
          weekday: date.toLocaleDateString('zh-CN', { weekday: 'short' }),
          condition: conditions[Math.floor(Math.random() * conditions.length)],
          high: Math.round(Math.random() * 15 + 20),
          low: Math.round(Math.random() * 10 + 10),
          humidity: Math.round(Math.random() * 30 + 50),
          windSpeed: Math.round(Math.random() * 8 + 3)
        };
      });
      setForecast(mockForecast);
    };

    React.useEffect(() => {
      generateForecast();
    }, []);

    return (
      <Card>
        <CardHeader><CardTitle>7天预报</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {forecast.map((day, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="text-center min-w-[60px]">
                    <div className="font-medium">{day.weekday}</div>
                    <div className="text-sm text-muted-foreground">{day.date}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {day.condition === '晴' && <Sun className="h-5 w-5 text-yellow-500" />}
                    {day.condition === '多云' && <Cloud className="h-5 w-5 text-gray-500" />}
                    {day.condition === '阴' && <Cloud className="h-5 w-5 text-gray-600" />}
                    {(day.condition === '小雨' || day.condition === '大雨') && <CloudRain className="h-5 w-5 text-blue-500" />}
                    <span className="text-sm">{day.condition}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-sm text-muted-foreground">
                    湿度 {day.humidity}%
                  </div>
                  <div className="text-sm text-muted-foreground">
                    风速 {day.windSpeed}km/h
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{day.high}°</div>
                    <div className="text-sm text-muted-foreground">{day.low}°</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium mb-2">本周天气趋势</h4>
            <div className="text-sm space-y-1">
              <div>• 平均气温: {Math.round(forecast.reduce((sum, day) => sum + (day.high + day.low) / 2, 0) / forecast.length)}°C</div>
              <div>• 最高气温: {Math.max(...forecast.map(day => day.high))}°C</div>
              <div>• 最低气温: {Math.min(...forecast.map(day => day.low))}°C</div>
              <div>• 雨天: {forecast.filter(day => day.condition.includes('雨')).length} 天</div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // 气象分析
  const WeatherAnalysis = () => {
    const [selectedMetric, setSelectedMetric] = useState('temperature');

    const metrics = [
      { value: 'temperature', label: '温度变化', unit: '°C' },
      { value: 'humidity', label: '湿度变化', unit: '%' },
      { value: 'pressure', label: '气压变化', unit: 'hPa' },
      { value: 'wind', label: '风速变化', unit: 'km/h' }
    ];

    const generateData = () => {
      return Array.from({ length: 24 }, (_, i) => ({
        hour: i,
        value: Math.round(Math.random() * 20 + 10)
      }));
    };

    const data = generateData();

    return (
      <Card>
        <CardHeader><CardTitle>气象分析</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">选择指标</label>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="w-full p-2 border rounded-lg"
            >
              {metrics.map(metric => (
                <option key={metric.value} value={metric.value}>{metric.label}</option>
              ))}
            </select>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-3">24小时趋势图</h4>
            <div className="h-32 flex items-end justify-between gap-1">
              {data.map((point, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div
                    className="bg-blue-500 w-2 rounded-t"
                    style={{ height: `${(point.value / 30) * 100}%` }}
                  ></div>
                  <div className="text-xs mt-1">{point.hour}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="p-3 bg-green-50 rounded-lg text-center">
              <div className="text-lg font-bold text-green-600">
                {Math.max(...data.map(d => d.value))}
              </div>
              <div className="text-sm text-muted-foreground">最高值</div>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg text-center">
              <div className="text-lg font-bold text-blue-600">
                {Math.round(data.reduce((sum, d) => sum + d.value, 0) / data.length)}
              </div>
              <div className="text-sm text-muted-foreground">平均值</div>
            </div>
            <div className="p-3 bg-red-50 rounded-lg text-center">
              <div className="text-lg font-bold text-red-600">
                {Math.min(...data.map(d => d.value))}
              </div>
              <div className="text-sm text-muted-foreground">最低值</div>
            </div>
          </div>

          <div className="p-4 bg-yellow-50 rounded-lg">
            <h4 className="font-medium mb-2">气象知识</h4>
            <div className="text-sm space-y-1">
              <div>• 气压下降通常预示着天气变坏</div>
              <div>• 湿度过高或过低都会影响舒适度</div>
              <div>• 温差大的天气容易引发感冒</div>
              <div>• 风速影响体感温度</div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // 穿衣建议
  const ClothingAdvice = () => {
    const [temperature, setTemperature] = useState(20);
    const [weather, setWeather] = useState('晴');
    const [activity, setActivity] = useState('日常');

    const getClothingAdvice = () => {
      let advice = [];
      
      if (temperature < 0) {
        advice.push('羽绒服或厚棉衣');
        advice.push('保暖内衣');
        advice.push('厚毛衣');
        advice.push('保暖裤');
        advice.push('厚袜子和保暖鞋');
        advice.push('帽子、手套、围巾');
      } else if (temperature < 10) {
        advice.push('厚外套或毛呢大衣');
        advice.push('毛衣或卫衣');
        advice.push('长裤');
        advice.push('保暖鞋');
      } else if (temperature < 20) {
        advice.push('薄外套或开衫');
        advice.push('长袖衬衫或T恤');
        advice.push('长裤或牛仔裤');
        advice.push('运动鞋或休闲鞋');
      } else if (temperature < 25) {
        advice.push('长袖或短袖T恤');
        advice.push('薄外套（早晚）');
        advice.push('长裤或九分裤');
        advice.push('透气鞋');
      } else {
        advice.push('短袖T恤或背心');
        advice.push('短裤或薄长裤');
        advice.push('凉鞋或透气鞋');
        advice.push('防晒帽');
      }

      // 根据天气调整
      if (weather.includes('雨')) {
        advice.push('雨伞或雨衣');
        advice.push('防水鞋');
      }
      
      if (weather === '晴' && temperature > 20) {
        advice.push('防晒霜');
        advice.push('太阳镜');
      }

      // 根据活动调整
      if (activity === '运动') {
        advice = advice.filter(item => !item.includes('正装'));
        advice.push('运动服');
        advice.push('运动鞋');
        advice.push('毛巾');
      }

      return advice;
    };

    const clothingAdvice = getClothingAdvice();

    return (
      <Card>
        <CardHeader><CardTitle>穿衣建议</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">温度 (°C)</label>
              <input
                type="number"
                value={temperature}
                onChange={(e) => setTemperature(Number(e.target.value))}
                className="w-full p-2 border rounded-lg"
                min="-20"
                max="45"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">天气</label>
              <select
                value={weather}
                onChange={(e) => setWeather(e.target.value)}
                className="w-full p-2 border rounded-lg"
              >
                <option value="晴">晴</option>
                <option value="多云">多云</option>
                <option value="阴">阴</option>
                <option value="小雨">小雨</option>
                <option value="大雨">大雨</option>
                <option value="雪">雪</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">活动</label>
              <select
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
                className="w-full p-2 border rounded-lg"
              >
                <option value="日常">日常</option>
                <option value="运动">运动</option>
                <option value="正式">正式场合</option>
                <option value="户外">户外活动</option>
              </select>
            </div>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium mb-3">推荐穿搭</h4>
            <div className="grid grid-cols-2 gap-2">
              {clothingAdvice.map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <h4 className="font-medium mb-2">舒适度指数</h4>
              <div className="text-sm space-y-1">
                <div>温度: {temperature > 18 && temperature < 26 ? '舒适' : '不适'}</div>
                <div>穿衣: {clothingAdvice.length <= 6 ? '简单' : '复杂'}</div>
              </div>
            </div>
            
            <div className="p-3 bg-yellow-50 rounded-lg">
              <h4 className="font-medium mb-2">健康提醒</h4>
              <div className="text-sm space-y-1">
                {temperature < 10 && <div>• 注意保暖，预防感冒</div>}
                {temperature > 30 && <div>• 注意防暑，多喝水</div>}
                {weather.includes('雨') && <div>• 注意防雨，避免淋湿</div>}
                <div>• 根据体感温度调整穿着</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const tabs = [
    { key: 'current', name: '当前天气', icon: Sun },
    { key: 'forecast', name: '天气预报', icon: Cloud },
    { key: 'analysis', name: '气象分析', icon: Thermometer },
    { key: 'clothing', name: '穿衣建议', icon: CloudRain },
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
          <Cloud className="h-8 w-8" />
          天气工具集
        </h1>
        <p className="text-muted-foreground mt-2">
          天气预报工具，包括实时天气、预报查询、气象分析、灾害预警
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

      {activeTab === 'current' && <CurrentWeather />}
      {activeTab === 'forecast' && <WeatherForecast />}
      {activeTab === 'analysis' && <WeatherAnalysis />}
      {activeTab === 'clothing' && <ClothingAdvice />}
    </div>
  );
}
