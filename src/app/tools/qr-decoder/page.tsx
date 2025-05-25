'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Upload, Camera, Copy, Check, QrCode, FileImage } from 'lucide-react';
import Link from 'next/link';

interface QRResult {
  text: string;
  format: string;
  type: 'url' | 'text' | 'email' | 'phone' | 'wifi' | 'vcard' | 'sms' | 'unknown';
  metadata?: {
    url?: string;
    email?: string;
    phone?: string;
    wifi?: {
      ssid: string;
      password: string;
      security: string;
    };
    vcard?: {
      name: string;
      phone: string;
      email: string;
      organization: string;
    };
  };
}

export default function QRDecoderPage() {
  const [result, setResult] = useState<QRResult | null>(null);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraActive, setCameraActive] = useState(false);

  // 分析二维码内容类型
  const analyzeQRContent = (text: string): QRResult => {
    let type: QRResult['type'] = 'unknown';
    let metadata: QRResult['metadata'] = {};

    // URL检测
    if (text.match(/^https?:\/\//i)) {
      type = 'url';
      metadata.url = text;
    }
    // 邮箱检测
    else if (text.match(/^mailto:/i)) {
      type = 'email';
      const email = text.replace(/^mailto:/i, '').split('?')[0];
      metadata.email = email;
    }
    // 电话检测
    else if (text.match(/^tel:/i)) {
      type = 'phone';
      const phone = text.replace(/^tel:/i, '');
      metadata.phone = phone;
    }
    // WiFi检测
    else if (text.match(/^WIFI:/i)) {
      type = 'wifi';
      const wifiMatch = text.match(/WIFI:T:([^;]*);S:([^;]*);P:([^;]*);/i);
      if (wifiMatch) {
        metadata.wifi = {
          security: wifiMatch[1],
          ssid: wifiMatch[2],
          password: wifiMatch[3]
        };
      }
    }
    // vCard检测
    else if (text.match(/^BEGIN:VCARD/i)) {
      type = 'vcard';
      const nameMatch = text.match(/FN:([^\r\n]*)/i);
      const phoneMatch = text.match(/TEL:([^\r\n]*)/i);
      const emailMatch = text.match(/EMAIL:([^\r\n]*)/i);
      const orgMatch = text.match(/ORG:([^\r\n]*)/i);
      
      metadata.vcard = {
        name: nameMatch ? nameMatch[1] : '',
        phone: phoneMatch ? phoneMatch[1] : '',
        email: emailMatch ? emailMatch[1] : '',
        organization: orgMatch ? orgMatch[1] : ''
      };
    }
    // SMS检测
    else if (text.match(/^sms:/i)) {
      type = 'sms';
      const phone = text.replace(/^sms:/i, '').split('?')[0];
      metadata.phone = phone;
    }
    // 邮箱地址检测
    else if (text.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      type = 'email';
      metadata.email = text;
    }
    // 电话号码检测
    else if (text.match(/^[\+]?[1-9][\d]{3,14}$/)) {
      type = 'phone';
      metadata.phone = text;
    }
    // 普通文本
    else {
      type = 'text';
    }

    return {
      text,
      format: 'QR Code',
      type,
      metadata
    };
  };

  // 模拟二维码解析
  const simulateQRDecode = async (imageData: string): Promise<QRResult> => {
    // 模拟处理时间
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 模拟不同类型的二维码内容
    const sampleResults = [
      'https://www.example.com',
      'mailto:contact@example.com',
      'tel:+8613812345678',
      'WIFI:T:WPA;S:MyWiFi;P:password123;',
      'BEGIN:VCARD\nVERSION:3.0\nFN:张三\nTEL:13812345678\nEMAIL:zhangsan@example.com\nORG:示例公司\nEND:VCARD',
      'sms:13812345678?body=Hello',
      'contact@example.com',
      '13812345678',
      '这是一段普通的文本内容，可能包含一些重要信息。'
    ];

    const randomResult = sampleResults[Math.floor(Math.random() * sampleResults.length)];
    return analyzeQRContent(randomResult);
  };

  // 处理文件上传
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('请选择图片文件');
      return;
    }

    setProcessing(true);
    setError('');
    setResult(null);

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const imageData = e.target?.result as string;
        try {
          const qrResult = await simulateQRDecode(imageData);
          setResult(qrResult);
        } catch (err) {
          setError('无法识别二维码，请确保图片清晰且包含有效的二维码');
        } finally {
          setProcessing(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError('文件读取失败');
      setProcessing(false);
    }

    // 清空文件输入
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 启动摄像头
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } // 优先使用后置摄像头
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (err) {
      setError('无法访问摄像头，请检查权限设置');
    }
  };

  // 停止摄像头
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setCameraActive(false);
    }
  };

  // 拍照识别
  const captureAndDecode = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);

    setProcessing(true);
    setError('');

    try {
      const imageData = canvas.toDataURL();
      const qrResult = await simulateQRDecode(imageData);
      setResult(qrResult);
      stopCamera();
    } catch (err) {
      setError('无法识别二维码，请调整角度和距离后重试');
    } finally {
      setProcessing(false);
    }
  };

  // 复制结果
  const copyResult = async () => {
    if (!result) return;

    try {
      await navigator.clipboard.writeText(result.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  // 清空结果
  const clearResult = () => {
    setResult(null);
    setError('');
    stopCamera();
  };

  // 获取类型图标
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'url': return '🌐';
      case 'email': return '📧';
      case 'phone': return '📞';
      case 'wifi': return '📶';
      case 'vcard': return '👤';
      case 'sms': return '💬';
      default: return '📄';
    }
  };

  // 获取类型名称
  const getTypeName = (type: string) => {
    switch (type) {
      case 'url': return '网址链接';
      case 'email': return '邮箱地址';
      case 'phone': return '电话号码';
      case 'wifi': return 'WiFi信息';
      case 'vcard': return '联系人名片';
      case 'sms': return '短信';
      case 'text': return '纯文本';
      default: return '未知类型';
    }
  };

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
          <QrCode className="h-8 w-8" />
          二维码解析器
        </h1>
        <p className="text-muted-foreground mt-2">
          上传图片或使用摄像头扫描二维码，解析其中的内容
        </p>
      </div>

      {/* 上传和扫描区域 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>选择识别方式</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!cameraActive ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 文件上传 */}
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <FileImage className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={processing}
                  className="mb-2"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  上传图片
                </Button>
                <p className="text-sm text-muted-foreground">
                  支持 JPG、PNG、GIF 等格式
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              {/* 摄像头扫描 */}
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <Camera className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <Button
                  onClick={startCamera}
                  disabled={processing}
                  variant="outline"
                  className="mb-2"
                >
                  <Camera className="h-4 w-4 mr-2" />
                  启动摄像头
                </Button>
                <p className="text-sm text-muted-foreground">
                  实时扫描二维码
                </p>
              </div>
            </div>
          ) : (
            /* 摄像头预览 */
            <div className="space-y-4">
              <div className="relative bg-black rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-64 object-cover"
                />
                <canvas ref={canvasRef} className="hidden" />
              </div>
              <div className="flex justify-center gap-2">
                <Button
                  onClick={captureAndDecode}
                  disabled={processing}
                  className="flex items-center gap-2"
                >
                  <QrCode className="h-4 w-4" />
                  {processing ? '识别中...' : '拍照识别'}
                </Button>
                <Button onClick={stopCamera} variant="outline">
                  停止摄像头
                </Button>
              </div>
            </div>
          )}

          {processing && (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">正在识别二维码...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-4">
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                {error}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 识别结果 */}
      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="text-2xl">{getTypeIcon(result.type)}</span>
                识别结果 - {getTypeName(result.type)}
              </span>
              <div className="flex gap-2">
                <Button
                  onClick={copyResult}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? '已复制' : '复制'}
                </Button>
                <Button onClick={clearResult} variant="outline" size="sm">
                  清空
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 原始内容 */}
            <div>
              <h4 className="font-medium mb-2">原始内容</h4>
              <div className="p-3 bg-muted/50 rounded-lg font-mono text-sm whitespace-pre-wrap break-all">
                {result.text}
              </div>
            </div>

            {/* 解析信息 */}
            {result.metadata && (
              <div>
                <h4 className="font-medium mb-2">解析信息</h4>
                <div className="space-y-2">
                  {result.type === 'url' && result.metadata.url && (
                    <div className="flex justify-between text-sm">
                      <span>网址:</span>
                      <a 
                        href={result.metadata.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline break-all"
                      >
                        {result.metadata.url}
                      </a>
                    </div>
                  )}

                  {result.type === 'email' && result.metadata.email && (
                    <div className="flex justify-between text-sm">
                      <span>邮箱:</span>
                      <a 
                        href={`mailto:${result.metadata.email}`}
                        className="text-blue-600 hover:underline"
                      >
                        {result.metadata.email}
                      </a>
                    </div>
                  )}

                  {result.type === 'phone' && result.metadata.phone && (
                    <div className="flex justify-between text-sm">
                      <span>电话:</span>
                      <a 
                        href={`tel:${result.metadata.phone}`}
                        className="text-blue-600 hover:underline"
                      >
                        {result.metadata.phone}
                      </a>
                    </div>
                  )}

                  {result.type === 'wifi' && result.metadata.wifi && (
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>网络名称:</span>
                        <span className="font-mono">{result.metadata.wifi.ssid}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>密码:</span>
                        <span className="font-mono">{result.metadata.wifi.password}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>加密方式:</span>
                        <span className="font-mono">{result.metadata.wifi.security}</span>
                      </div>
                    </div>
                  )}

                  {result.type === 'vcard' && result.metadata.vcard && (
                    <div className="space-y-1 text-sm">
                      {result.metadata.vcard.name && (
                        <div className="flex justify-between">
                          <span>姓名:</span>
                          <span>{result.metadata.vcard.name}</span>
                        </div>
                      )}
                      {result.metadata.vcard.phone && (
                        <div className="flex justify-between">
                          <span>电话:</span>
                          <span>{result.metadata.vcard.phone}</span>
                        </div>
                      )}
                      {result.metadata.vcard.email && (
                        <div className="flex justify-between">
                          <span>邮箱:</span>
                          <span>{result.metadata.vcard.email}</span>
                        </div>
                      )}
                      {result.metadata.vcard.organization && (
                        <div className="flex justify-between">
                          <span>组织:</span>
                          <span>{result.metadata.vcard.organization}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* 使用说明 */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>使用说明</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">支持的二维码类型</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• <strong>网址链接</strong>：自动识别HTTP/HTTPS链接</li>
              <li>• <strong>邮箱地址</strong>：支持mailto格式和普通邮箱</li>
              <li>• <strong>电话号码</strong>：支持tel格式和普通号码</li>
              <li>• <strong>WiFi信息</strong>：包含网络名称、密码和加密方式</li>
              <li>• <strong>联系人名片</strong>：vCard格式的联系人信息</li>
              <li>• <strong>短信</strong>：SMS格式的短信内容</li>
              <li>• <strong>纯文本</strong>：任意文本内容</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">使用技巧</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• 确保二维码图片清晰，避免模糊或变形</li>
              <li>• 使用摄像头时保持适当距离，让二维码完整显示</li>
              <li>• 光线充足的环境下识别效果更好</li>
              <li>• 支持的图片格式：JPG、PNG、GIF、WebP等</li>
            </ul>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h4 className="font-medium mb-2 text-blue-800 dark:text-blue-200">💡 演示说明</h4>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              这是一个演示工具，当前显示的是模拟识别结果。实际的二维码识别需要专业的图像处理库（如ZXing、jsQR等）。
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
