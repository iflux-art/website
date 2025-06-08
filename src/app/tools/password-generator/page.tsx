'use client';

import React, { useState, useEffect } from 'react';
import { Shield, RefreshCw, Copy, Check, RotateCcw } from 'lucide-react';
import { ToolLayout } from '@/components/layout/tool-layout';
import { ToolActions } from '@/components/ui/tool-actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function PasswordGeneratorPage() {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(12);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [excludeSimilar, setExcludeSimilar] = useState(false);
  const [copied, setCopied] = useState(false);
  const [strength, setStrength] = useState(0);

  const generatePassword = () => {
    let charset = '';

    if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (includeNumbers) charset += '0123456789';
    if (includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (excludeSimilar) {
      charset = charset.replace(/[0O1lI]/g, '');
    }

    if (charset === '') {
      alert('请至少选择一种字符类型');
      return;
    }

    let result = '';
    for (let i = 0; i < length; i++) {
      result += charset.charAt(Math.floor(Math.random() * charset.length));
    }

    setPassword(result);
  };

  const calculateStrength = (pwd: string) => {
    let score = 0;

    // 长度评分
    if (pwd.length >= 8) score += 1;
    if (pwd.length >= 12) score += 1;
    if (pwd.length >= 16) score += 1;

    // 字符类型评分
    if (/[a-z]/.test(pwd)) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    return Math.min(score, 5);
  };

  const getStrengthText = (score: number) => {
    switch (score) {
      case 0:
      case 1:
        return '很弱';
      case 2:
        return '弱';
      case 3:
        return '中等';
      case 4:
        return '强';
      case 5:
        return '很强';
      default:
        return '未知';
    }
  };

  const getStrengthColor = (score: number) => {
    switch (score) {
      case 0:
      case 1:
        return 'text-red-600';
      case 2:
        return 'text-orange-600';
      case 3:
        return 'text-yellow-600';
      case 4:
        return 'text-blue-600';
      case 5:
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  const clearPassword = () => {
    setPassword('');
    setStrength(0);
  };

  useEffect(() => {
    if (password) {
      setStrength(calculateStrength(password));
    }
  }, [password]);

  useEffect(() => {
    generatePassword();
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols, excludeSimilar]);

  const actions = [
    {
      label: '生成密码',
      onClick: generatePassword,
      icon: RefreshCw,
    },
    {
      label: '复制密码',
      onClick: copyToClipboard,
      icon: copied ? Check : Copy,
      variant: 'outline' as const,
      disabled: !password,
    },
    {
      label: '清空',
      onClick: clearPassword,
      icon: RotateCcw,
      variant: 'outline' as const,
    },
  ];

  const helpContent = (
    <div className="space-y-4">
      <div>
        <h4 className="font-medium mb-2">安全建议</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• 建议密码长度至少 12 位字符</li>
          <li>• 包含大小写字母、数字和特殊符号</li>
          <li>• 不要在多个账户使用相同密码</li>
          <li>• 定期更换重要账户的密码</li>
          <li>• 使用密码管理器保存密码</li>
          <li>• 启用双因素认证增强安全性</li>
        </ul>
      </div>
    </div>
  );

  return (
    <ToolLayout
      title="密码生成器"
      description="生成安全的随机密码，保护您的账户安全"
      icon={Shield}
      actions={<ToolActions actions={actions} />}
      helpContent={helpContent}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 设置面板 */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>密码设置</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 密码长度 */}
              <div>
                <label className="block text-sm font-medium mb-2">密码长度: {length}</label>
                <input
                  type="range"
                  min="4"
                  max="50"
                  value={length}
                  onChange={e => setLength(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>4</span>
                  <span>50</span>
                </div>
              </div>

              {/* 字符类型 */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium">包含字符类型</h4>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={includeUppercase}
                    onChange={e => setIncludeUppercase(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">大写字母 (A-Z)</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={includeLowercase}
                    onChange={e => setIncludeLowercase(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">小写字母 (a-z)</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={includeNumbers}
                    onChange={e => setIncludeNumbers(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">数字 (0-9)</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={includeSymbols}
                    onChange={e => setIncludeSymbols(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">特殊符号 (!@#$%^&*)</span>
                </label>
              </div>

              {/* 高级选项 */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium">高级选项</h4>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={excludeSimilar}
                    onChange={e => setExcludeSimilar(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">排除相似字符 (0, O, 1, l, I)</span>
                </label>
              </div>

              {/* 生成按钮 */}
              <Button onClick={generatePassword} className="w-full flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                重新生成
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* 结果面板 */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>生成的密码</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 密码显示 */}
              <div className="relative">
                <input
                  type="text"
                  value={password}
                  readOnly
                  className="w-full p-4 border border-border rounded-lg bg-muted/50 font-mono text-lg text-center select-all"
                />
                {password && (
                  <Button
                    onClick={copyToClipboard}
                    variant="outline"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2"
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4" />
                        已复制
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        复制
                      </>
                    )}
                  </Button>
                )}
              </div>

              {/* 密码强度 */}
              {password && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">密码强度</span>
                    <span className={`text-sm font-medium ${getStrengthColor(strength)}`}>
                      {getStrengthText(strength)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        strength <= 1
                          ? 'bg-red-500'
                          : strength === 2
                          ? 'bg-orange-500'
                          : strength === 3
                          ? 'bg-yellow-500'
                          : strength === 4
                          ? 'bg-blue-500'
                          : 'bg-green-500'
                      }`}
                      style={{ width: `${(strength / 5) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* 密码分析 */}
              {password && (
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">长度:</span>
                    <span className="ml-2 font-mono">{password.length}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">字符类型:</span>
                    <span className="ml-2">
                      {[
                        /[A-Z]/.test(password) && '大写',
                        /[a-z]/.test(password) && '小写',
                        /[0-9]/.test(password) && '数字',
                        /[^A-Za-z0-9]/.test(password) && '符号',
                      ]
                        .filter(Boolean)
                        .join(', ')}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
}