'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Volume2, Download, Play, Pause } from 'lucide-react';
import Link from 'next/link';

export default function PaymentVoicePage() {
  const [amount, setAmount] = useState('');
  const [platform, setPlatform] = useState('alipay');
  const [voiceText, setVoiceText] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);

  const generateVoiceText = () => {
    if (!amount.trim()) return;

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      alert('请输入有效的金额');
      return;
    }

    const templates = {
      alipay: `支付宝到账${amountNum}元`,
      wechat: `微信收款${amountNum}元`,
      bank: `银行卡收入${amountNum}元`,
    };

    setVoiceText(templates[platform as keyof typeof templates]);
  };

  const playVoice = () => {
    if (!voiceText) return;

    if ('speechSynthesis' in window) {
      // 停止当前播放
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(voiceText);
      utterance.lang = 'zh-CN';
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);

      window.speechSynthesis.speak(utterance);
    } else {
      alert('您的浏览器不支持语音合成功能');
    }
  };

  const stopVoice = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }
  };

  const downloadVoice = () => {
    if (!voiceText) return;

    // 创建一个简单的音频提示文件
    const blob = new Blob([`语音内容: ${voiceText}\n\n使用说明:\n1. 复制上述文本\n2. 使用文字转语音软件生成音频\n3. 设置为收款提示音`], 
      { type: 'text/plain;charset=utf-8' });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${platform}_${amount}元_到账语音.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

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
          <Volume2 className="h-8 w-8" />
          支付到账语音生成器
        </h1>
        <p className="text-muted-foreground mt-2">
          生成支付宝、微信等平台的到账语音提示
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>语音设置</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">支付平台</label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full p-3 border border-border rounded-lg bg-background"
                >
                  <option value="alipay">支付宝</option>
                  <option value="wechat">微信支付</option>
                  <option value="bank">银行卡</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">金额（元）</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="输入金额..."
                  min="0"
                  step="0.01"
                  className="w-full p-3 border border-border rounded-lg bg-background"
                />
              </div>
            </div>

            <Button onClick={generateVoiceText} className="w-full">
              生成语音文本
            </Button>
          </CardContent>
        </Card>

        {voiceText && (
          <Card>
            <CardHeader>
              <CardTitle>语音预览</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-lg font-medium text-center">{voiceText}</p>
              </div>

              <div className="flex gap-2 justify-center">
                <Button
                  onClick={isPlaying ? stopVoice : playVoice}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  {isPlaying ? '停止播放' : '试听语音'}
                </Button>
                <Button
                  onClick={downloadVoice}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  下载文本
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>使用说明</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <h4 className="font-medium mb-2">功能说明</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• 支持支付宝、微信、银行卡等多种支付平台</li>
                  <li>• 可自定义任意金额的到账语音</li>
                  <li>• 支持浏览器内语音试听</li>
                  <li>• 可下载语音文本用于其他TTS软件</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">使用步骤</h4>
                <ol className="text-sm text-muted-foreground space-y-1">
                  <li>1. 选择支付平台类型</li>
                  <li>2. 输入到账金额</li>
                  <li>3. 点击生成语音文本</li>
                  <li>4. 试听语音效果</li>
                  <li>5. 下载文本文件用于制作音频</li>
                </ol>
              </div>
              <div>
                <h4 className="font-medium mb-2">注意事项</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• 本工具仅用于娱乐和学习目的</li>
                  <li>• 请勿用于欺诈或误导他人</li>
                  <li>• 语音效果因浏览器而异</li>
                  <li>• 建议使用专业TTS软件制作高质量音频</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
