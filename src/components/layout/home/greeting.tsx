'use client';

import React, { useState, useEffect } from 'react';

// 根据时间段的问候语数据
const greetingsByTimeOfDay = {
  // 早上（6:00-10:00）
  morning: [
    "美好的一天开始啦！",
    "早安打工人！",
    "咖啡加满，烦恼减半",
    "今天的KPI是活着下班！",
    "早八人集合！",
    "叮！您的人形闹钟上线！",
    "太阳晒屁股啦！",
    "再不起床，老板要扣钱啦！"
  ],
  // 中午（11:00-13:00）
  noon: [
    "干饭不积极，思想有问题！",
    "请速速充值生命值！",
    "午睡是人类进步的阶梯",
    "你趴桌流口水的样子很可爱~",
    "开启'进食+摸鱼'双充模式"
  ],
  // 下午（14:00-17:00）
  afternoon: [
    "下午茶时间到！",
    "奶茶是成年人的甜甜圈",
    "撑住！马上就要下班啦！"
  ],
  // 晚上（18:00-23:00）
  evening: [
    "请切换至'躺平模式'",
    "警告手机：禁止弹出工作消息！",
    "游戏虽好，健康更重要",
    "晚安全宇宙！"
  ],
  // 凌晨（0:00-5:00）
  lateNight: [
    "您已进入'阴间作息区'",
    "建议立即执行'躺倒关机'指令！",
    "秃头预警！",
    "你的头发正在连夜离家出走…",
    "月亮不睡你不睡，水滴筹里你最贵！",
    "速速睡觉，这是命令"
  ]
};

// 获取当前时间段的函数
const getTimeOfDay = (): keyof typeof greetingsByTimeOfDay => {
  const hour = new Date().getHours();
  
  if (hour >= 6 && hour <= 10) return 'morning';
  if (hour >= 11 && hour <= 13) return 'noon';
  if (hour >= 14 && hour <= 17) return 'afternoon';
  if (hour >= 18 && hour <= 23) return 'evening';
  return 'lateNight'; // 0-5点
};

// 获取随机问候语的函数
const getRandomGreeting = (): string => {
  const timeOfDay = getTimeOfDay();
  const greetings = greetingsByTimeOfDay[timeOfDay];
  const randomIndex = Math.floor(Math.random() * greetings.length);
  return greetings[randomIndex];
};

interface GreetingProps {
  className?: string;
}

/**
 * 问候语组件
 * 根据当前时间显示不同的问候语
 */
export function Greeting({ className }: GreetingProps) {
  const [greeting, setGreeting] = useState('');

  // 刷新问候语的函数
  const refreshGreeting = () => {
    setGreeting(getRandomGreeting());
  };

  // 在组件挂载时设置随机问候语
  useEffect(() => {
    refreshGreeting();
  }, []);

  return (
    <h1
      className={`text-xl md:text-2xl text-muted-foreground mb-5 cursor-pointer hover:text-muted-foreground/70 transition-colors font-normal ${className || ''}`}
      onClick={refreshGreeting}
      title="点击刷新问候语"
    >
      {greeting}
    </h1>
  );
}
