'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Heart, Activity, Scale, Droplets } from 'lucide-react';
import Link from 'next/link';

export default function HealthToolkitPage() {
  const [activeTab, setActiveTab] = useState<'bmi' | 'bmr' | 'water' | 'heart'>('bmi');

  // BMI计算器
  const BMICalculator = () => {
    const [height, setHeight] = useState(170);
    const [weight, setWeight] = useState(65);
    const [result, setResult] = useState<any>(null);

    const calculateBMI = () => {
      const heightInMeters = height / 100;
      const bmi = weight / (heightInMeters * heightInMeters);
      
      let category = '';
      let color = '';
      let advice = '';

      if (bmi < 18.5) {
        category = '偏瘦';
        color = 'text-blue-600';
        advice = '建议增加营养摄入，适当增重';
      } else if (bmi < 24) {
        category = '正常';
        color = 'text-green-600';
        advice = '保持良好的生活习惯';
      } else if (bmi < 28) {
        category = '超重';
        color = 'text-orange-600';
        advice = '建议控制饮食，增加运动';
      } else {
        category = '肥胖';
        color = 'text-red-600';
        advice = '建议咨询医生，制定减重计划';
      }

      const idealWeightMin = 18.5 * heightInMeters * heightInMeters;
      const idealWeightMax = 24 * heightInMeters * heightInMeters;

      setResult({
        bmi: bmi.toFixed(1),
        category,
        color,
        advice,
        idealWeightRange: `${idealWeightMin.toFixed(1)} - ${idealWeightMax.toFixed(1)} kg`
      });
    };

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>BMI计算</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">身高 (cm)</label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="w-full p-3 border border-border rounded-lg bg-background"
                min="100"
                max="250"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">体重 (kg)</label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="w-full p-3 border border-border rounded-lg bg-background"
                min="30"
                max="200"
                step="0.1"
              />
            </div>

            <Button onClick={calculateBMI} className="w-full">
              计算BMI
            </Button>
          </CardContent>
        </Card>

        {result && (
          <Card>
            <CardHeader>
              <CardTitle>BMI结果</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-primary mb-2">{result.bmi}</div>
                <div className={`text-xl font-semibold ${result.color} mb-2`}>{result.category}</div>
                <div className="text-muted-foreground">{result.advice}</div>
              </div>

              <div className="space-y-4">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="text-sm font-medium mb-2">理想体重范围</div>
                  <div className="text-lg font-semibold">{result.idealWeightRange}</div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium">BMI分类标准</div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex justify-between">
                      <span>偏瘦</span>
                      <span>&lt; 18.5</span>
                    </div>
                    <div className="flex justify-between">
                      <span>正常</span>
                      <span>18.5 - 23.9</span>
                    </div>
                    <div className="flex justify-between">
                      <span>超重</span>
                      <span>24.0 - 27.9</span>
                    </div>
                    <div className="flex justify-between">
                      <span>肥胖</span>
                      <span>≥ 28.0</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  // 基础代谢率计算器
  const BMRCalculator = () => {
    const [gender, setGender] = useState<'male' | 'female'>('male');
    const [age, setAge] = useState(25);
    const [height, setHeight] = useState(170);
    const [weight, setWeight] = useState(65);
    const [activityLevel, setActivityLevel] = useState('moderate');
    const [result, setResult] = useState<any>(null);

    const calculateBMR = () => {
      let bmr = 0;

      // Harris-Benedict公式
      if (gender === 'male') {
        bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
      } else {
        bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
      }

      // 活动系数
      const activityMultipliers: { [key: string]: number } = {
        sedentary: 1.2,    // 久坐
        light: 1.375,      // 轻度活动
        moderate: 1.55,    // 中度活动
        active: 1.725,     // 高度活动
        veryActive: 1.9    // 极高活动
      };

      const tdee = bmr * activityMultipliers[activityLevel];

      setResult({
        bmr: bmr.toFixed(0),
        tdee: tdee.toFixed(0),
        weightLoss: (tdee - 500).toFixed(0),
        weightGain: (tdee + 500).toFixed(0)
      });
    };

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>基础代谢率计算</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">性别</label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="male"
                    checked={gender === 'male'}
                    onChange={(e) => setGender(e.target.value as 'male')}
                    className="mr-2"
                  />
                  男性
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="female"
                    checked={gender === 'female'}
                    onChange={(e) => setGender(e.target.value as 'female')}
                    className="mr-2"
                  />
                  女性
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">年龄</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full p-3 border border-border rounded-lg bg-background"
                min="10"
                max="100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">身高 (cm)</label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="w-full p-3 border border-border rounded-lg bg-background"
                min="100"
                max="250"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">体重 (kg)</label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="w-full p-3 border border-border rounded-lg bg-background"
                min="30"
                max="200"
                step="0.1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">活动水平</label>
              <select
                value={activityLevel}
                onChange={(e) => setActivityLevel(e.target.value)}
                className="w-full p-3 border border-border rounded-lg bg-background"
              >
                <option value="sedentary">久坐 (很少运动)</option>
                <option value="light">轻度活动 (每周1-3次轻度运动)</option>
                <option value="moderate">中度活动 (每周3-5次中度运动)</option>
                <option value="active">高度活动 (每周6-7次运动)</option>
                <option value="veryActive">极高活动 (每天2次运动或重体力劳动)</option>
              </select>
            </div>

            <Button onClick={calculateBMR} className="w-full">
              计算代谢率
            </Button>
          </CardContent>
        </Card>

        {result && (
          <Card>
            <CardHeader>
              <CardTitle>代谢率结果</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <div className="text-sm text-muted-foreground">基础代谢率 (BMR)</div>
                  <div className="text-2xl font-bold text-blue-600">{result.bmr} 卡路里/天</div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <div className="text-sm text-muted-foreground">总消耗 (TDEE)</div>
                  <div className="text-2xl font-bold text-green-600">{result.tdee} 卡路里/天</div>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                  <div className="text-sm text-muted-foreground">减重建议摄入</div>
                  <div className="text-2xl font-bold text-orange-600">{result.weightLoss} 卡路里/天</div>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                  <div className="text-sm text-muted-foreground">增重建议摄入</div>
                  <div className="text-2xl font-bold text-purple-600">{result.weightGain} 卡路里/天</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  // 饮水量计算器
  const WaterCalculator = () => {
    const [weight, setWeight] = useState(65);
    const [activityLevel, setActivityLevel] = useState('moderate');
    const [climate, setClimate] = useState('normal');
    const [result, setResult] = useState<any>(null);

    const calculateWater = () => {
      // 基础饮水量：体重 × 35ml
      let baseWater = weight * 35;

      // 活动调整
      const activityMultipliers: { [key: string]: number } = {
        low: 1,
        moderate: 1.2,
        high: 1.5
      };

      // 气候调整
      const climateMultipliers: { [key: string]: number } = {
        cold: 0.9,
        normal: 1,
        hot: 1.3
      };

      const totalWater = baseWater * activityMultipliers[activityLevel] * climateMultipliers[climate];
      const glasses = Math.ceil(totalWater / 250); // 按250ml一杯计算

      setResult({
        totalWater: totalWater.toFixed(0),
        glasses,
        hourlyIntake: (totalWater / 16).toFixed(0) // 按16小时清醒时间计算
      });
    };

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>饮水量计算</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">体重 (kg)</label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="w-full p-3 border border-border rounded-lg bg-background"
                min="30"
                max="200"
                step="0.1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">活动强度</label>
              <select
                value={activityLevel}
                onChange={(e) => setActivityLevel(e.target.value)}
                className="w-full p-3 border border-border rounded-lg bg-background"
              >
                <option value="low">低强度 (办公室工作)</option>
                <option value="moderate">中强度 (适量运动)</option>
                <option value="high">高强度 (大量运动)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">气候环境</label>
              <select
                value={climate}
                onChange={(e) => setClimate(e.target.value)}
                className="w-full p-3 border border-border rounded-lg bg-background"
              >
                <option value="cold">寒冷</option>
                <option value="normal">温和</option>
                <option value="hot">炎热</option>
              </select>
            </div>

            <Button onClick={calculateWater} className="w-full">
              计算饮水量
            </Button>
          </CardContent>
        </Card>

        {result && (
          <Card>
            <CardHeader>
              <CardTitle>饮水建议</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-blue-600 mb-2">{result.totalWater} ml</div>
                <div className="text-muted-foreground">每日建议饮水量</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <div className="text-sm text-muted-foreground">约等于</div>
                  <div className="text-2xl font-bold text-blue-600">{result.glasses} 杯水</div>
                  <div className="text-xs text-muted-foreground">按250ml/杯计算</div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <div className="text-sm text-muted-foreground">每小时饮水</div>
                  <div className="text-2xl font-bold text-green-600">{result.hourlyIntake} ml</div>
                  <div className="text-xs text-muted-foreground">按16小时清醒时间</div>
                </div>
              </div>

              <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-2">饮水小贴士</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• 起床后先喝一杯温水</li>
                  <li>• 餐前30分钟适量饮水</li>
                  <li>• 运动时及时补充水分</li>
                  <li>• 睡前1小时停止大量饮水</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  // 心率区间计算器
  const HeartRateCalculator = () => {
    const [age, setAge] = useState(25);
    const [restingHR, setRestingHR] = useState(60);
    const [result, setResult] = useState<any>(null);

    const calculateHeartRate = () => {
      const maxHR = 220 - age;
      const hrReserve = maxHR - restingHR;

      const zones = {
        recovery: {
          name: '恢复区间',
          min: Math.round(restingHR + hrReserve * 0.5),
          max: Math.round(restingHR + hrReserve * 0.6),
          description: '轻松恢复，促进血液循环'
        },
        aerobic: {
          name: '有氧区间',
          min: Math.round(restingHR + hrReserve * 0.6),
          max: Math.round(restingHR + hrReserve * 0.7),
          description: '提高心肺功能，燃烧脂肪'
        },
        anaerobic: {
          name: '无氧区间',
          min: Math.round(restingHR + hrReserve * 0.7),
          max: Math.round(restingHR + hrReserve * 0.8),
          description: '提高乳酸阈值，增强耐力'
        },
        vo2max: {
          name: 'VO2Max区间',
          min: Math.round(restingHR + hrReserve * 0.8),
          max: Math.round(restingHR + hrReserve * 0.9),
          description: '提高最大摄氧量'
        },
        neuromuscular: {
          name: '神经肌肉区间',
          min: Math.round(restingHR + hrReserve * 0.9),
          max: maxHR,
          description: '提高神经肌肉协调性'
        }
      };

      setResult({
        maxHR,
        zones
      });
    };

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>心率区间计算</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">年龄</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full p-3 border border-border rounded-lg bg-background"
                min="10"
                max="100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">静息心率 (次/分钟)</label>
              <input
                type="number"
                value={restingHR}
                onChange={(e) => setRestingHR(Number(e.target.value))}
                className="w-full p-3 border border-border rounded-lg bg-background"
                min="40"
                max="100"
              />
              <div className="text-xs text-muted-foreground mt-1">
                早晨起床前测量的心率
              </div>
            </div>

            <Button onClick={calculateHeartRate} className="w-full">
              计算心率区间
            </Button>
          </CardContent>
        </Card>

        {result && (
          <Card>
            <CardHeader>
              <CardTitle>心率训练区间</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4 text-center">
                <div className="text-sm text-muted-foreground">最大心率</div>
                <div className="text-2xl font-bold text-red-600">{result.maxHR} 次/分钟</div>
              </div>

              <div className="space-y-3">
                {Object.entries(result.zones).map(([key, zone]: [string, any]) => (
                  <div key={key} className="border border-border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <div className="font-medium">{zone.name}</div>
                      <div className="font-mono text-sm">
                        {zone.min} - {zone.max} 次/分钟
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">{zone.description}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  const tabs = [
    { key: 'bmi', name: 'BMI计算', icon: Scale },
    { key: 'bmr', name: '代谢率', icon: Activity },
    { key: 'water', name: '饮水量', icon: Droplets },
    { key: 'heart', name: '心率区间', icon: Heart },
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
          健康工具集
        </h1>
        <p className="text-muted-foreground mt-2">
          健康管理工具，包括BMI、代谢率、饮水量和心率计算
        </p>
      </div>

      {/* 功能标签页 */}
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

      {/* 内容区域 */}
      {activeTab === 'bmi' && <BMICalculator />}
      {activeTab === 'bmr' && <BMRCalculator />}
      {activeTab === 'water' && <WaterCalculator />}
      {activeTab === 'heart' && <HeartRateCalculator />}

      {/* 使用说明 */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>使用说明</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">功能介绍</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• <strong>BMI计算</strong>：评估体重是否正常</li>
              <li>• <strong>代谢率计算</strong>：计算每日热量需求</li>
              <li>• <strong>饮水量计算</strong>：个性化饮水建议</li>
              <li>• <strong>心率区间</strong>：运动心率训练指导</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">健康提醒</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• 计算结果仅供参考，不能替代专业医疗建议</li>
              <li>• 如有健康问题，请咨询专业医生</li>
              <li>• 保持规律运动和均衡饮食</li>
              <li>• 定期体检，关注身体健康</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
