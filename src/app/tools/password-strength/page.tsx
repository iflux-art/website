'use client';

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Shield, Eye, EyeOff, RefreshCw, Copy, Check } from 'lucide-react';
import Link from 'next/link';

interface PasswordAnalysis {
  score: number;
  strength: 'very-weak' | 'weak' | 'fair' | 'good' | 'strong';
  feedback: string[];
  suggestions: string[];
  entropy: number;
  crackTime: string;
  checks: {
    length: boolean;
    lowercase: boolean;
    uppercase: boolean;
    numbers: boolean;
    symbols: boolean;
    common: boolean;
    repeated: boolean;
    sequential: boolean;
  };
}

export default function PasswordStrengthPage() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);

  // 常见密码列表（简化版）
  const commonPasswords = [
    'password', '123456', '123456789', 'qwerty', 'abc123', 'password123',
    'admin', 'letmein', 'welcome', 'monkey', '1234567890', 'iloveyou'
  ];

  // 分析密码强度
  const analysis = useMemo((): PasswordAnalysis => {
    if (!password) {
      return {
        score: 0,
        strength: 'very-weak',
        feedback: [],
        suggestions: ['请输入密码进行分析'],
        entropy: 0,
        crackTime: '立即',
        checks: {
          length: false,
          lowercase: false,
          uppercase: false,
          numbers: false,
          symbols: false,
          common: true,
          repeated: true,
          sequential: true,
        }
      };
    }

    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      numbers: /\d/.test(password),
      symbols: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
      common: !commonPasswords.includes(password.toLowerCase()),
      repeated: !hasRepeatedChars(password),
      sequential: !hasSequentialChars(password),
    };

    let score = 0;
    const feedback: string[] = [];
    const suggestions: string[] = [];

    // 长度检查
    if (checks.length) {
      score += 20;
      feedback.push('✓ 长度符合要求（8位以上）');
    } else {
      suggestions.push('密码长度至少需要8位字符');
    }

    // 字符类型检查
    if (checks.lowercase) {
      score += 10;
      feedback.push('✓ 包含小写字母');
    } else {
      suggestions.push('添加小写字母 (a-z)');
    }

    if (checks.uppercase) {
      score += 10;
      feedback.push('✓ 包含大写字母');
    } else {
      suggestions.push('添加大写字母 (A-Z)');
    }

    if (checks.numbers) {
      score += 10;
      feedback.push('✓ 包含数字');
    } else {
      suggestions.push('添加数字 (0-9)');
    }

    if (checks.symbols) {
      score += 15;
      feedback.push('✓ 包含特殊符号');
    } else {
      suggestions.push('添加特殊符号 (!@#$%^&*等)');
    }

    // 安全性检查
    if (checks.common) {
      score += 15;
      feedback.push('✓ 不是常见密码');
    } else {
      feedback.push('✗ 这是常见密码，容易被破解');
      suggestions.push('避免使用常见密码');
    }

    if (checks.repeated) {
      score += 10;
      feedback.push('✓ 没有重复字符');
    } else {
      feedback.push('✗ 包含重复字符');
      suggestions.push('避免连续重复字符');
    }

    if (checks.sequential) {
      score += 10;
      feedback.push('✓ 没有连续字符');
    } else {
      feedback.push('✗ 包含连续字符');
      suggestions.push('避免连续字符序列');
    }

    // 长度加分
    if (password.length >= 12) score += 10;
    if (password.length >= 16) score += 10;

    // 计算熵值
    const charset = getCharsetSize(password);
    const entropy = Math.log2(Math.pow(charset, password.length));

    // 确定强度等级
    let strength: PasswordAnalysis['strength'];
    if (score >= 90) strength = 'strong';
    else if (score >= 70) strength = 'good';
    else if (score >= 50) strength = 'fair';
    else if (score >= 30) strength = 'weak';
    else strength = 'very-weak';

    // 计算破解时间
    const crackTime = calculateCrackTime(entropy);

    return {
      score,
      strength,
      feedback,
      suggestions,
      entropy,
      crackTime,
      checks,
    };
  }, [password]);

  // 检查重复字符
  const hasRepeatedChars = (pwd: string): boolean => {
    return /(.)\1{2,}/.test(pwd);
  };

  // 检查连续字符
  const hasSequentialChars = (pwd: string): boolean => {
    const sequences = ['abc', '123', 'qwe', 'asd', 'zxc'];
    const reversedSequences = sequences.map(s => s.split('').reverse().join(''));
    const allSequences = [...sequences, ...reversedSequences];
    
    return allSequences.some(seq => pwd.toLowerCase().includes(seq));
  };

  // 获取字符集大小
  const getCharsetSize = (pwd: string): number => {
    let size = 0;
    if (/[a-z]/.test(pwd)) size += 26;
    if (/[A-Z]/.test(pwd)) size += 26;
    if (/\d/.test(pwd)) size += 10;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd)) size += 32;
    return size || 1;
  };

  // 计算破解时间
  const calculateCrackTime = (entropy: number): string => {
    const attempts = Math.pow(2, entropy - 1);
    const attemptsPerSecond = 1e9; // 假设每秒10亿次尝试
    const seconds = attempts / attemptsPerSecond;

    if (seconds < 1) return '立即';
    if (seconds < 60) return `${Math.round(seconds)}秒`;
    if (seconds < 3600) return `${Math.round(seconds / 60)}分钟`;
    if (seconds < 86400) return `${Math.round(seconds / 3600)}小时`;
    if (seconds < 31536000) return `${Math.round(seconds / 86400)}天`;
    if (seconds < 31536000000) return `${Math.round(seconds / 31536000)}年`;
    return '数千年';
  };

  // 生成强密码
  const generateStrongPassword = () => {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    const allChars = lowercase + uppercase + numbers + symbols;
    let newPassword = '';
    
    // 确保包含每种字符类型
    newPassword += lowercase[Math.floor(Math.random() * lowercase.length)];
    newPassword += uppercase[Math.floor(Math.random() * uppercase.length)];
    newPassword += numbers[Math.floor(Math.random() * numbers.length)];
    newPassword += symbols[Math.floor(Math.random() * symbols.length)];
    
    // 填充到16位
    for (let i = 4; i < 16; i++) {
      newPassword += allChars[Math.floor(Math.random() * allChars.length)];
    }
    
    // 打乱顺序
    newPassword = newPassword.split('').sort(() => Math.random() - 0.5).join('');
    
    setPassword(newPassword);
  };

  // 复制密码
  const copyPassword = async () => {
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  // 获取强度颜色
  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'very-weak': return 'text-red-600 bg-red-50 border-red-200';
      case 'weak': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'fair': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'good': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'strong': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  // 获取强度文本
  const getStrengthText = (strength: string) => {
    switch (strength) {
      case 'very-weak': return '非常弱';
      case 'weak': return '弱';
      case 'fair': return '一般';
      case 'good': return '良好';
      case 'strong': return '强';
      default: return '未知';
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
          <Shield className="h-8 w-8" />
          密码强度检测
        </h1>
        <p className="text-muted-foreground mt-2">
          检测密码强度，提供安全建议，生成强密码
        </p>
      </div>

      {/* 密码输入 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>密码输入</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="输入要检测的密码..."
              className="w-full p-3 pr-20 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
              {password && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={copyPassword}
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={generateStrongPassword} className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              生成强密码
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 强度分析 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 强度评分 */}
        <Card>
          <CardHeader>
            <CardTitle>强度评分</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 总体评分 */}
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">{analysis.score}/100</div>
              <div className={`inline-block px-4 py-2 rounded-lg border ${getStrengthColor(analysis.strength)}`}>
                {getStrengthText(analysis.strength)}
              </div>
            </div>

            {/* 进度条 */}
            <div className="space-y-2">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full transition-all duration-300 ${
                    analysis.strength === 'very-weak' ? 'bg-red-500' :
                    analysis.strength === 'weak' ? 'bg-orange-500' :
                    analysis.strength === 'fair' ? 'bg-yellow-500' :
                    analysis.strength === 'good' ? 'bg-blue-500' :
                    'bg-green-500'
                  }`}
                  style={{ width: `${analysis.score}%` }}
                />
              </div>
            </div>

            {/* 详细信息 */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between">
                <span>密码长度:</span>
                <span className="font-mono">{password.length}</span>
              </div>
              <div className="flex justify-between">
                <span>熵值:</span>
                <span className="font-mono">{analysis.entropy.toFixed(1)} bits</span>
              </div>
              <div className="flex justify-between col-span-2">
                <span>预估破解时间:</span>
                <span className="font-mono">{analysis.crackTime}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 安全检查 */}
        <Card>
          <CardHeader>
            <CardTitle>安全检查</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { key: 'length', label: '长度 ≥ 8位', check: analysis.checks.length },
                { key: 'lowercase', label: '包含小写字母', check: analysis.checks.lowercase },
                { key: 'uppercase', label: '包含大写字母', check: analysis.checks.uppercase },
                { key: 'numbers', label: '包含数字', check: analysis.checks.numbers },
                { key: 'symbols', label: '包含特殊符号', check: analysis.checks.symbols },
                { key: 'common', label: '非常见密码', check: analysis.checks.common },
                { key: 'repeated', label: '无重复字符', check: analysis.checks.repeated },
                { key: 'sequential', label: '无连续字符', check: analysis.checks.sequential },
              ].map((item) => (
                <div key={item.key} className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                    item.check ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                  }`}>
                    {item.check ? '✓' : '✗'}
                  </div>
                  <span className={item.check ? 'text-green-700' : 'text-red-700'}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 反馈建议 */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>分析反馈</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 优点 */}
              <div>
                <h4 className="font-medium mb-3 text-green-700">✓ 优点</h4>
                <div className="space-y-2">
                  {analysis.feedback.filter(f => f.startsWith('✓')).map((item, index) => (
                    <div key={index} className="text-sm text-green-600 bg-green-50 p-2 rounded">
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* 改进建议 */}
              <div>
                <h4 className="font-medium mb-3 text-orange-700">⚠ 改进建议</h4>
                <div className="space-y-2">
                  {analysis.suggestions.map((item, index) => (
                    <div key={index} className="text-sm text-orange-600 bg-orange-50 p-2 rounded">
                      {item}
                    </div>
                  ))}
                  {analysis.feedback.filter(f => f.startsWith('✗')).map((item, index) => (
                    <div key={index} className="text-sm text-red-600 bg-red-50 p-2 rounded">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 使用说明 */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>密码安全指南</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">强密码特征</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• 长度至少8位，推荐12位以上</li>
              <li>• 包含大小写字母、数字和特殊符号</li>
              <li>• 避免使用个人信息（姓名、生日等）</li>
              <li>• 避免使用常见密码和字典词汇</li>
              <li>• 避免重复字符和连续字符</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">密码管理建议</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• 为不同账户使用不同密码</li>
              <li>• 定期更换重要账户密码</li>
              <li>• 使用密码管理器存储密码</li>
              <li>• 启用双因素认证</li>
              <li>• 不要在公共场所输入密码</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">破解时间说明</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• 基于暴力破解方式的理论计算</li>
              <li>• 假设攻击者每秒尝试10亿次</li>
              <li>• 实际破解时间可能因攻击方式而异</li>
              <li>• 社会工程学攻击可能绕过强密码</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
