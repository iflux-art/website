'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Camera, Aperture, Timer, Palette } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import Link from 'next/link';

type TabKey = 'exposure' | 'dof' | 'composition' | 'lighting';

interface Tab {
  key: TabKey;
  name: string;
  icon: LucideIcon;
}
export default function PhotographyToolkitPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('exposure');

  // 曝光计算器
  const ExposureCalculator = () => {
    const [aperture, setAperture] = useState(2.8);
    const [shutter, setShutter] = useState(60);
    const [iso, setIso] = useState(100);

    const calculateEV = () => {
      return Math.log2((aperture * aperture) / (1 / shutter)) + Math.log2(iso / 100);
    };

    const getExposureAdvice = () => {
      const ev = calculateEV();
      if (ev < 0) return { level: '欠曝', color: 'text-red-600', advice: '增加ISO或减慢快门速度' };
      if (ev > 15) return { level: '过曝', color: 'text-red-600', advice: '减少ISO或加快快门速度' };
      return { level: '正常', color: 'text-green-600', advice: '曝光参数合适' };
    };

    const advice = getExposureAdvice();

    return (
      <Card>
        <CardHeader><CardTitle>曝光计算器</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">光圈 (f/)</label>
              <select
                value={aperture}
                onChange={(e) => setAperture(Number(e.target.value))}
                className="w-full p-2 border rounded-lg"
              >
                <option value={1.4}>f/1.4</option>
                <option value={2}>f/2</option>
                <option value={2.8}>f/2.8</option>
                <option value={4}>f/4</option>
                <option value={5.6}>f/5.6</option>
                <option value={8}>f/8</option>
                <option value={11}>f/11</option>
                <option value={16}>f/16</option>
                <option value={22}>f/22</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">快门速度 (1/s)</label>
              <select
                value={shutter}
                onChange={(e) => setShutter(Number(e.target.value))}
                className="w-full p-2 border rounded-lg"
              >
                <option value={4000}>1/4000</option>
                <option value={2000}>1/2000</option>
                <option value={1000}>1/1000</option>
                <option value={500}>1/500</option>
                <option value={250}>1/250</option>
                <option value={125}>1/125</option>
                <option value={60}>1/60</option>
                <option value={30}>1/30</option>
                <option value={15}>1/15</option>
                <option value={8}>1/8</option>
                <option value={4}>1/4</option>
                <option value={2}>1/2</option>
                <option value={1}>1s</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">ISO</label>
              <select
                value={iso}
                onChange={(e) => setIso(Number(e.target.value))}
                className="w-full p-2 border rounded-lg"
              >
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={200}>200</option>
                <option value={400}>400</option>
                <option value={800}>800</option>
                <option value={1600}>1600</option>
                <option value={3200}>3200</option>
                <option value={6400}>6400</option>
                <option value={12800}>12800</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">曝光值 (EV)</h4>
              <div className="text-2xl font-bold">{calculateEV().toFixed(1)}</div>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">曝光状态</h4>
              <div className={`text-lg font-medium ${advice.color}`}>{advice.level}</div>
              <div className="text-sm text-muted-foreground mt-1">{advice.advice}</div>
            </div>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium mb-2">拍摄建议</h4>
            <div className="text-sm space-y-1">
              <div>• 人像摄影: f/1.4-f/2.8, 1/125s以上</div>
              <div>• 风景摄影: f/8-f/11, 根据光线调整快门</div>
              <div>• 运动摄影: f/2.8-f/5.6, 1/500s以上</div>
              <div>• 夜景摄影: f/8-f/11, 长曝光, ISO 100-400</div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // 景深计算器
  const DOFCalculator = () => {
    const [focalLength, setFocalLength] = useState(50);
    const [aperture, setAperture] = useState(2.8);
    const [distance, setDistance] = useState(3);
    const [sensorSize, setSensorSize] = useState('full');

    const calculateDOF = () => {
      const circleOfConfusion = sensorSize === 'full' ? 0.03 : 0.02;
      const hyperfocalDistance = (focalLength * focalLength) / (aperture * circleOfConfusion);
      const nearDistance = (distance * hyperfocalDistance) / (hyperfocalDistance + distance);
      const farDistance = (distance * hyperfocalDistance) / (hyperfocalDistance - distance);
      const totalDOF = farDistance - nearDistance;

      return {
        near: nearDistance.toFixed(2),
        far: farDistance > 1000 ? '∞' : farDistance.toFixed(2),
        total: totalDOF.toFixed(2),
        hyperfocal: (hyperfocalDistance / 1000).toFixed(2)
      };
    };

    const dof = calculateDOF();

    return (
      <Card>
        <CardHeader><CardTitle>景深计算器</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">焦距 (mm)</label>
              <input
                type="number"
                value={focalLength}
                onChange={(e) => setFocalLength(Number(e.target.value))}
                className="w-full p-2 border rounded-lg"
                min="10"
                max="600"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">光圈 (f/)</label>
              <select
                value={aperture}
                onChange={(e) => setAperture(Number(e.target.value))}
                className="w-full p-2 border rounded-lg"
              >
                <option value={1.4}>f/1.4</option>
                <option value={2}>f/2</option>
                <option value={2.8}>f/2.8</option>
                <option value={4}>f/4</option>
                <option value={5.6}>f/5.6</option>
                <option value={8}>f/8</option>
                <option value={11}>f/11</option>
                <option value={16}>f/16</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">对焦距离 (m)</label>
              <input
                type="number"
                value={distance}
                onChange={(e) => setDistance(Number(e.target.value))}
                className="w-full p-2 border rounded-lg"
                min="0.1"
                max="100"
                step="0.1"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">传感器尺寸</label>
              <select
                value={sensorSize}
                onChange={(e) => setSensorSize(e.target.value)}
                className="w-full p-2 border rounded-lg"
              >
                <option value="full">全画幅</option>
                <option value="crop">APS-C</option>
                <option value="micro">微型四三</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium mb-2">景深范围</h4>
              <div className="space-y-1">
                <div>近点: {dof.near}m</div>
                <div>远点: {dof.far}m</div>
                <div className="font-medium">总景深: {dof.total}m</div>
              </div>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium mb-2">超焦距</h4>
              <div className="text-2xl font-bold">{dof.hyperfocal}m</div>
              <div className="text-sm text-muted-foreground mt-1">
                对焦到此距离可获得最大景深
              </div>
            </div>
          </div>

          <div className="p-4 bg-yellow-50 rounded-lg">
            <h4 className="font-medium mb-2">景深控制技巧</h4>
            <div className="text-sm space-y-1">
              <div>• 大光圈(小f值): 浅景深，突出主体</div>
              <div>• 小光圈(大f值): 深景深，全景清晰</div>
              <div>• 长焦距: 景深更浅</div>
              <div>• 近距离拍摄: 景深更浅</div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // 构图指导
  const CompositionGuide = () => {
    const [selectedRule, setSelectedRule] = useState('thirds');

    const compositionRules = {
      thirds: {
        name: '三分法则',
        description: '将画面分为九等份，将主体放在交叉点上',
        tips: [
          '将地平线放在上三分之一或下三分之一处',
          '将主体放在左三分之一或右三分之一处',
          '避免将主体放在画面正中央',
          '利用交叉点增强视觉冲击力'
        ]
      },
      leading: {
        name: '引导线',
        description: '利用线条引导观者视线到主体',
        tips: [
          '利用道路、河流、栅栏等作为引导线',
          '对角线比水平线更有动感',
          '曲线比直线更优雅',
          '引导线应指向主体而非画面边缘'
        ]
      },
      symmetry: {
        name: '对称构图',
        description: '利用对称性创造平衡和谐的画面',
        tips: [
          '垂直对称适合建筑和倒影',
          '水平对称适合风景摄影',
          '放射对称适合花朵和建筑细节',
          '打破对称可以增加趣味性'
        ]
      },
      framing: {
        name: '框架构图',
        description: '利用前景元素形成自然框架',
        tips: [
          '利用树枝、拱门、窗户等作为框架',
          '框架应该补充而非干扰主体',
          '可以使用虚化的前景作为框架',
          '框架有助于增加画面层次感'
        ]
      }
    };

    const currentRule = compositionRules[selectedRule as keyof typeof compositionRules];

    return (
      <Card>
        <CardHeader><CardTitle>构图指导</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(compositionRules).map(([key, rule]) => (
              <Button
                key={key}
                variant={selectedRule === key ? 'default' : 'outline'}
                onClick={() => setSelectedRule(key)}
                className="h-auto p-4 text-left"
              >
                <div>
                  <div className="font-medium">{rule.name}</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {rule.description}
                  </div>
                </div>
              </Button>
            ))}
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-3">{currentRule.name}</h4>
            <p className="text-sm text-muted-foreground mb-3">{currentRule.description}</p>
            <div className="space-y-2">
              {currentRule.tips.map((tip, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="text-sm">{tip}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="p-3 bg-green-50 rounded-lg text-center">
              <div className="text-lg font-bold text-green-600">黄金比例</div>
              <div className="text-sm text-muted-foreground">1:1.618</div>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg text-center">
              <div className="text-lg font-bold text-blue-600">对角线</div>
              <div className="text-sm text-muted-foreground">增加动感</div>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg text-center">
              <div className="text-lg font-bold text-purple-600">留白</div>
              <div className="text-sm text-muted-foreground">突出主体</div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // 光线分析
  const LightingAnalysis = () => {
    const [lightType, setLightType] = useState('natural');
    const [timeOfDay, setTimeOfDay] = useState('golden');

    const lightingInfo = {
      natural: {
        golden: {
          name: '黄金时刻',
          time: '日出后1小时，日落前1小时',
          characteristics: '温暖柔和的光线，长阴影',
          best: '人像、风景、建筑摄影'
        },
        blue: {
          name: '蓝调时刻',
          time: '日落后30分钟',
          characteristics: '天空呈现深蓝色，城市灯光开始亮起',
          best: '城市夜景、建筑摄影'
        },
        harsh: {
          name: '正午强光',
          time: '上午10点-下午2点',
          characteristics: '强烈直射光，深阴影',
          best: '黑白摄影、阴影创作'
        },
        overcast: {
          name: '阴天',
          time: '全天',
          characteristics: '柔和均匀的光线，无明显阴影',
          best: '人像、微距、产品摄影'
        }
      }
    };

    return (
      <Card>
        <CardHeader><CardTitle>光线分析</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">光线类型</label>
              <select
                value={lightType}
                onChange={(e) => setLightType(e.target.value)}
                className="w-full p-2 border rounded-lg"
              >
                <option value="natural">自然光</option>
                <option value="artificial">人工光</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">时间/条件</label>
              <select
                value={timeOfDay}
                onChange={(e) => setTimeOfDay(e.target.value)}
                className="w-full p-2 border rounded-lg"
              >
                <option value="golden">黄金时刻</option>
                <option value="blue">蓝调时刻</option>
                <option value="harsh">正午强光</option>
                <option value="overcast">阴天</option>
              </select>
            </div>
          </div>

          {lightType === 'natural' && (
            <div className="p-4 bg-orange-50 rounded-lg">
              <h4 className="font-medium mb-2">
                {lightingInfo.natural[timeOfDay as keyof typeof lightingInfo.natural].name}
              </h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">时间: </span>
                  {lightingInfo.natural[timeOfDay as keyof typeof lightingInfo.natural].time}
                </div>
                <div>
                  <span className="font-medium">特点: </span>
                  {lightingInfo.natural[timeOfDay as keyof typeof lightingInfo.natural].characteristics}
                </div>
                <div>
                  <span className="font-medium">适合: </span>
                  {lightingInfo.natural[timeOfDay as keyof typeof lightingInfo.natural].best}
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h4 className="font-medium mb-2">色温指南</h4>
              <div className="text-sm space-y-1">
                <div>• 蜡烛光: 1900K (橙红色)</div>
                <div>• 白炽灯: 2700K (暖白色)</div>
                <div>• 日光: 5500K (中性白)</div>
                <div>• 阴天: 6500K (冷白色)</div>
                <div>• 蓝天: 10000K (蓝色)</div>
              </div>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium mb-2">光线方向</h4>
              <div className="text-sm space-y-1">
                <div>• 正面光: 均匀照明，缺乏立体感</div>
                <div>• 侧光: 增强质感和立体感</div>
                <div>• 逆光: 创造轮廓和氛围</div>
                <div>• 顶光: 产生戏剧性阴影</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const tabs: Tab[] = [
    { key: 'exposure', name: '曝光计算', icon: Aperture },
    { key: 'dof', name: '景深计算', icon: Camera },
    { key: 'composition', name: '构图指导', icon: Timer },
    { key: 'lighting', name: '光线分析', icon: Palette },
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
          <Camera className="h-8 w-8" />
          摄影工具集
        </h1>
        <p className="text-muted-foreground mt-2">
          摄影辅助工具，包括曝光计算、景深计算、构图指导、后期处理
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

      {activeTab === 'exposure' && <ExposureCalculator />}
      {activeTab === 'dof' && <DOFCalculator />}
      {activeTab === 'composition' && <CompositionGuide />}
      {activeTab === 'lighting' && <LightingAnalysis />}
    </div>
  );
}