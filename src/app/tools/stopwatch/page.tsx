'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Play, Pause, Square, RotateCcw, Clock } from 'lucide-react';
import Link from 'next/link';

export default function StopwatchPage() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const [mode, setMode] = useState<'stopwatch' | 'timer'>('stopwatch');
  const [timerMinutes, setTimerMinutes] = useState(5);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerTime, setTimerTime] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        if (mode === 'stopwatch') {
          setTime(prev => prev + 10);
        } else {
          setTimerTime(prev => {
            if (prev <= 10) {
              setIsRunning(false);
              return 0;
            }
            return prev - 10;
          });
        }
      }, 10);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, mode]);

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const ms = Math.floor((milliseconds % 1000) / 10);
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  const start = () => {
    if (mode === 'timer' && timerTime === 0) {
      setTimerTime((timerMinutes * 60 + timerSeconds) * 1000);
    }
    setIsRunning(true);
  };

  const pause = () => {
    setIsRunning(false);
  };

  const stop = () => {
    setIsRunning(false);
    if (mode === 'stopwatch') {
      setTime(0);
      setLaps([]);
    } else {
      setTimerTime(0);
    }
  };

  const reset = () => {
    setIsRunning(false);
    if (mode === 'stopwatch') {
      setTime(0);
      setLaps([]);
    } else {
      setTimerTime((timerMinutes * 60 + timerSeconds) * 1000);
    }
  };

  const addLap = () => {
    if (mode === 'stopwatch' && time > 0) {
      setLaps(prev => [time, ...prev]);
    }
  };

  const clearLaps = () => {
    setLaps([]);
  };

  const currentTime = mode === 'stopwatch' ? time : timerTime;
  const displayTime = formatTime(currentTime);

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
          <Clock className="h-8 w-8" />
          秒表计时器
        </h1>
        <p className="text-muted-foreground mt-2">
          精确的秒表和倒计时功能，支持计次记录
        </p>
      </div>

      {/* 模式选择 */}
      <div className="mb-6">
        <div className="flex gap-2">
          <Button
            variant={mode === 'stopwatch' ? 'default' : 'outline'}
            onClick={() => {
              setMode('stopwatch');
              stop();
            }}
          >
            秒表
          </Button>
          <Button
            variant={mode === 'timer' ? 'default' : 'outline'}
            onClick={() => {
              setMode('timer');
              stop();
            }}
          >
            倒计时
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 主计时器 */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-8">
              {/* 时间显示 */}
              <div className="text-center mb-8">
                <div className="text-6xl md:text-8xl font-mono font-bold tracking-wider">
                  {displayTime}
                </div>
                {mode === 'timer' && timerTime === 0 && (
                  <div className="text-2xl text-red-600 mt-4 font-bold">
                    时间到！
                  </div>
                )}
              </div>

              {/* 倒计时设置 */}
              {mode === 'timer' && !isRunning && timerTime === 0 && (
                <div className="mb-6 flex justify-center gap-4">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium">分钟:</label>
                    <input
                      type="number"
                      min="0"
                      max="59"
                      value={timerMinutes}
                      onChange={(e) => setTimerMinutes(Number(e.target.value))}
                      className="w-16 p-2 border border-border rounded text-center"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium">秒钟:</label>
                    <input
                      type="number"
                      min="0"
                      max="59"
                      value={timerSeconds}
                      onChange={(e) => setTimerSeconds(Number(e.target.value))}
                      className="w-16 p-2 border border-border rounded text-center"
                    />
                  </div>
                </div>
              )}

              {/* 控制按钮 */}
              <div className="flex justify-center gap-4">
                {!isRunning ? (
                  <Button
                    onClick={start}
                    size="lg"
                    className="flex items-center gap-2 px-8"
                    disabled={mode === 'timer' && timerMinutes === 0 && timerSeconds === 0}
                  >
                    <Play className="h-5 w-5" />
                    开始
                  </Button>
                ) : (
                  <Button
                    onClick={pause}
                    size="lg"
                    variant="outline"
                    className="flex items-center gap-2 px-8"
                  >
                    <Pause className="h-5 w-5" />
                    暂停
                  </Button>
                )}

                <Button
                  onClick={stop}
                  size="lg"
                  variant="outline"
                  className="flex items-center gap-2 px-8"
                >
                  <Square className="h-5 w-5" />
                  停止
                </Button>

                <Button
                  onClick={reset}
                  size="lg"
                  variant="outline"
                  className="flex items-center gap-2 px-8"
                >
                  <RotateCcw className="h-5 w-5" />
                  重置
                </Button>

                {mode === 'stopwatch' && (
                  <Button
                    onClick={addLap}
                    size="lg"
                    variant="outline"
                    className="px-8"
                    disabled={time === 0}
                  >
                    计次
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 计次记录 */}
        {mode === 'stopwatch' && (
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  计次记录
                  {laps.length > 0 && (
                    <Button onClick={clearLaps} variant="outline" size="sm">
                      清空
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {laps.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    暂无计次记录
                  </div>
                ) : (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {laps.map((lapTime, index) => {
                      const lapNumber = laps.length - index;
                      const previousLap = index < laps.length - 1 ? laps[index + 1] : 0;
                      const splitTime = lapTime - previousLap;
                      
                      return (
                        <div
                          key={index}
                          className="flex justify-between items-center p-3 border border-border rounded-lg bg-muted/50"
                        >
                          <span className="font-medium">计次 {lapNumber}</span>
                          <div className="text-right">
                            <div className="font-mono text-sm">
                              {formatTime(lapTime)}
                            </div>
                            <div className="font-mono text-xs text-muted-foreground">
                              +{formatTime(splitTime)}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* 快速倒计时 */}
        {mode === 'timer' && (
          <div>
            <Card>
              <CardHeader>
                <CardTitle>快速设置</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { name: '1分钟', minutes: 1, seconds: 0 },
                    { name: '3分钟', minutes: 3, seconds: 0 },
                    { name: '5分钟', minutes: 5, seconds: 0 },
                    { name: '10分钟', minutes: 10, seconds: 0 },
                    { name: '15分钟', minutes: 15, seconds: 0 },
                    { name: '20分钟', minutes: 20, seconds: 0 },
                    { name: '25分钟', minutes: 25, seconds: 0 },
                    { name: '30分钟', minutes: 30, seconds: 0 },
                  ].map((preset) => (
                    <Button
                      key={preset.name}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setTimerMinutes(preset.minutes);
                        setTimerSeconds(preset.seconds);
                        setTimerTime(0);
                        setIsRunning(false);
                      }}
                      className="text-xs"
                    >
                      {preset.name}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* 使用说明 */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>使用说明</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">秒表功能</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• 精确到百分之一秒的计时</li>
              <li>• 支持暂停和继续计时</li>
              <li>• 计次功能记录中间时间</li>
              <li>• 显示每次计次的间隔时间</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">倒计时功能</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• 自定义分钟和秒钟</li>
              <li>• 快速设置常用时间</li>
              <li>• 时间到达时显示提醒</li>
              <li>• 支持暂停和重置</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">使用场景</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• 运动训练和比赛计时</li>
              <li>• 工作时间管理（番茄工作法）</li>
              <li>• 烹饪和烘焙计时</li>
              <li>• 学习和休息时间控制</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
