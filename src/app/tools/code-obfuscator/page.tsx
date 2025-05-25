'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Copy, Check, Shield, Download, Upload } from 'lucide-react';
import Link from 'next/link';

export default function CodeObfuscatorPage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [language, setLanguage] = useState<'javascript' | 'css' | 'html'>('javascript');
  const [obfuscationLevel, setObfuscationLevel] = useState<'light' | 'medium' | 'heavy'>('medium');
  const [options, setOptions] = useState({
    renameVariables: true,
    renameFunctions: true,
    removeComments: true,
    removeWhitespace: true,
    stringEncoding: false,
    controlFlowFlattening: false,
    deadCodeInjection: false,
  });
  const [copied, setCopied] = useState(false);

  // 生成随机变量名
  const generateRandomName = (length: number = 6): string => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = chars[Math.floor(Math.random() * 52)]; // 首字符必须是字母
    for (let i = 1; i < length; i++) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
  };

  // JavaScript混淆
  const obfuscateJavaScript = (code: string): string => {
    let obfuscated = code;

    // 移除注释
    if (options.removeComments) {
      obfuscated = obfuscated
        .replace(/\/\*[\s\S]*?\*\//g, '') // 多行注释
        .replace(/\/\/.*$/gm, ''); // 单行注释
    }

    // 移除多余空白
    if (options.removeWhitespace) {
      obfuscated = obfuscated
        .replace(/\s+/g, ' ')
        .replace(/;\s*}/g, ';}')
        .replace(/{\s*/g, '{')
        .replace(/}\s*/g, '}')
        .trim();
    }

    // 变量名混淆
    if (options.renameVariables) {
      const varPattern = /\b(var|let|const)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g;
      const varMap = new Map<string, string>();
      
      obfuscated = obfuscated.replace(varPattern, (match, keyword, varName) => {
        if (!varMap.has(varName)) {
          varMap.set(varName, generateRandomName());
        }
        return `${keyword} ${varMap.get(varName)}`;
      });

      // 替换变量引用
      varMap.forEach((newName, oldName) => {
        const regex = new RegExp(`\\b${oldName}\\b`, 'g');
        obfuscated = obfuscated.replace(regex, newName);
      });
    }

    // 函数名混淆
    if (options.renameFunctions) {
      const funcPattern = /function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g;
      const funcMap = new Map<string, string>();
      
      obfuscated = obfuscated.replace(funcPattern, (match, funcName) => {
        if (!funcMap.has(funcName)) {
          funcMap.set(funcName, generateRandomName());
        }
        return `function ${funcMap.get(funcName)}`;
      });

      // 替换函数调用
      funcMap.forEach((newName, oldName) => {
        const regex = new RegExp(`\\b${oldName}\\(`, 'g');
        obfuscated = obfuscated.replace(regex, `${newName}(`);
      });
    }

    // 字符串编码
    if (options.stringEncoding) {
      obfuscated = obfuscated.replace(/'([^']*)'/g, (match, str) => {
        const encoded = str.split('').map((char: string) => 
          '\\x' + char.charCodeAt(0).toString(16).padStart(2, '0')
        ).join('');
        return `'${encoded}'`;
      });
    }

    // 控制流平坦化（简化版）
    if (options.controlFlowFlattening) {
      obfuscated = obfuscated.replace(/if\s*\(([^)]+)\)\s*{([^}]+)}/g, 
        (match, condition, body) => {
          const randomVar = generateRandomName();
          return `var ${randomVar}=${condition}?function(){${body}}:function(){};${randomVar}();`;
        }
      );
    }

    // 死代码注入
    if (options.deadCodeInjection) {
      const deadCode = [
        `var ${generateRandomName()}=Math.random();`,
        `if(false){console.log('${generateRandomName()}');}`,
        `var ${generateRandomName()}=function(){return 42;};`
      ];
      
      const lines = obfuscated.split(';');
      for (let i = 1; i < lines.length; i += 2) {
        lines.splice(i, 0, deadCode[Math.floor(Math.random() * deadCode.length)]);
      }
      obfuscated = lines.join(';');
    }

    return obfuscated;
  };

  // CSS混淆
  const obfuscateCSS = (code: string): string => {
    let obfuscated = code;

    // 移除注释
    if (options.removeComments) {
      obfuscated = obfuscated.replace(/\/\*[\s\S]*?\*\//g, '');
    }

    // 移除空白
    if (options.removeWhitespace) {
      obfuscated = obfuscated
        .replace(/\s+/g, ' ')
        .replace(/;\s*}/g, ';}')
        .replace(/{\s*/g, '{')
        .replace(/}\s*/g, '}')
        .replace(/:\s*/g, ':')
        .replace(/;\s*/g, ';')
        .trim();
    }

    // 类名混淆
    if (options.renameVariables) {
      const classPattern = /\.([a-zA-Z_-][a-zA-Z0-9_-]*)/g;
      const classMap = new Map<string, string>();
      
      obfuscated = obfuscated.replace(classPattern, (match, className) => {
        if (!classMap.has(className)) {
          classMap.set(className, generateRandomName());
        }
        return `.${classMap.get(className)}`;
      });
    }

    return obfuscated;
  };

  // HTML混淆
  const obfuscateHTML = (code: string): string => {
    let obfuscated = code;

    // 移除注释
    if (options.removeComments) {
      obfuscated = obfuscated.replace(/<!--[\s\S]*?-->/g, '');
    }

    // 移除空白
    if (options.removeWhitespace) {
      obfuscated = obfuscated
        .replace(/>\s+</g, '><')
        .replace(/\s+/g, ' ')
        .trim();
    }

    // 属性值编码
    if (options.stringEncoding) {
      obfuscated = obfuscated.replace(/="([^"]*)"/g, (match, value) => {
        if (value.length > 0 && !/^[a-zA-Z0-9-_]+$/.test(value)) {
          const encoded = value.split('').map((char: string) => 
            '&#' + char.charCodeAt(0) + ';'
          ).join('');
          return `="${encoded}"`;
        }
        return match;
      });
    }

    return obfuscated;
  };

  // 执行混淆
  const obfuscateCode = () => {
    if (!input.trim()) {
      setOutput('');
      return;
    }

    let result = '';
    
    switch (language) {
      case 'javascript':
        result = obfuscateJavaScript(input);
        break;
      case 'css':
        result = obfuscateCSS(input);
        break;
      case 'html':
        result = obfuscateHTML(input);
        break;
    }

    setOutput(result);
  };

  // 复制结果
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  // 下载文件
  const downloadFile = () => {
    if (!output) return;

    const extensions: { [key: string]: string } = {
      javascript: 'js',
      css: 'css',
      html: 'html'
    };

    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `obfuscated.${extensions[language]}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // 上传文件
  const uploadFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setInput(e.target?.result as string);
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  // 清空
  const clearAll = () => {
    setInput('');
    setOutput('');
  };

  // 加载示例
  const loadExample = () => {
    const examples: { [key: string]: string } = {
      javascript: `function calculateSum(numbers) {
    // 计算数组总和
    let total = 0;
    for (let i = 0; i < numbers.length; i++) {
        total += numbers[i];
    }
    return total;
}

const myArray = [1, 2, 3, 4, 5];
const result = calculateSum(myArray);
console.log("总和是:", result);`,
      css: `.container {
    /* 容器样式 */
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

.button {
    background-color: #007bff;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.button:hover {
    background-color: #0056b3;
}`,
      html: `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <!-- 页面元信息 -->
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>示例页面</title>
</head>
<body>
    <div class="container">
        <h1 class="title">欢迎来到我的网站</h1>
        <p class="description">这是一个示例页面</p>
        <button class="button" onclick="alert('Hello!')">点击我</button>
    </div>
</body>
</html>`
    };

    setInput(examples[language] || '');
  };

  // 根据混淆级别设置选项
  const setObfuscationOptions = (level: typeof obfuscationLevel) => {
    setObfuscationLevel(level);
    
    switch (level) {
      case 'light':
        setOptions({
          renameVariables: false,
          renameFunctions: false,
          removeComments: true,
          removeWhitespace: true,
          stringEncoding: false,
          controlFlowFlattening: false,
          deadCodeInjection: false,
        });
        break;
      case 'medium':
        setOptions({
          renameVariables: true,
          renameFunctions: true,
          removeComments: true,
          removeWhitespace: true,
          stringEncoding: false,
          controlFlowFlattening: false,
          deadCodeInjection: false,
        });
        break;
      case 'heavy':
        setOptions({
          renameVariables: true,
          renameFunctions: true,
          removeComments: true,
          removeWhitespace: true,
          stringEncoding: true,
          controlFlowFlattening: true,
          deadCodeInjection: true,
        });
        break;
    }
  };

  // 实时混淆
  React.useEffect(() => {
    if (input) {
      obfuscateCode();
    }
  }, [input, language, options]);

  const languages = [
    { value: 'javascript', name: 'JavaScript' },
    { value: 'css', name: 'CSS' },
    { value: 'html', name: 'HTML' },
  ];

  const levels = [
    { value: 'light', name: '轻度', desc: '仅移除注释和空白' },
    { value: 'medium', name: '中度', desc: '重命名变量和函数' },
    { value: 'heavy', name: '重度', desc: '全面混淆和保护' },
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
          <Shield className="h-8 w-8" />
          代码混淆工具
        </h1>
        <p className="text-muted-foreground mt-2">
          混淆代码以保护源码，防止逆向工程
        </p>
      </div>

      {/* 设置面板 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>混淆设置</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">语言</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className="w-full p-2 border border-border rounded-lg bg-background"
              >
                {languages.map((lang) => (
                  <option key={lang.value} value={lang.value}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">混淆级别</label>
              <select
                value={obfuscationLevel}
                onChange={(e) => setObfuscationOptions(e.target.value as any)}
                className="w-full p-2 border border-border rounded-lg bg-background"
              >
                {levels.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.name} - {level.desc}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <label className="cursor-pointer w-full">
                <Button variant="outline" className="w-full flex items-center gap-2" asChild>
                  <span>
                    <Upload className="h-4 w-4" />
                    上传文件
                  </span>
                </Button>
                <input
                  type="file"
                  accept=".js,.css,.html,.txt"
                  onChange={uploadFile}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* 详细选项 */}
          <div className="border-t pt-4">
            <h4 className="font-medium mb-3">混淆选项</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(options).map(([key, value]) => (
                <label key={key} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => setOptions(prev => ({ ...prev, [key]: e.target.checked }))}
                    className="rounded"
                  />
                  <span className="text-sm">
                    {key === 'renameVariables' && '重命名变量'}
                    {key === 'renameFunctions' && '重命名函数'}
                    {key === 'removeComments' && '移除注释'}
                    {key === 'removeWhitespace' && '移除空白'}
                    {key === 'stringEncoding' && '字符串编码'}
                    {key === 'controlFlowFlattening' && '控制流平坦化'}
                    {key === 'deadCodeInjection' && '死代码注入'}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 操作按钮 */}
      <div className="mb-6 flex flex-wrap gap-2">
        <Button onClick={obfuscateCode} className="flex items-center gap-2">
          <Shield className="h-4 w-4" />
          混淆代码
        </Button>
        <Button onClick={loadExample} variant="outline">
          加载示例
        </Button>
        <Button onClick={clearAll} variant="outline">
          清空
        </Button>
      </div>

      {/* 主要内容区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 输入区域 */}
        <Card>
          <CardHeader>
            <CardTitle>原始代码</CardTitle>
          </CardHeader>
          <CardContent>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`输入${languages.find(l => l.value === language)?.name}代码...`}
              className="w-full h-96 p-3 border border-border rounded-lg bg-background font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </CardContent>
        </Card>

        {/* 输出区域 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              混淆后代码
              <div className="flex gap-2">
                {output && (
                  <>
                    <Button
                      onClick={copyToClipboard}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
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
                    <Button
                      onClick={downloadFile}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      下载
                    </Button>
                  </>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <textarea
              value={output}
              readOnly
              placeholder="混淆后的代码将显示在这里..."
              className="w-full h-96 p-3 border border-border rounded-lg bg-muted/50 font-mono text-sm resize-none"
            />
            
            {output && (
              <div className="mt-2 text-xs text-muted-foreground">
                原始大小: {input.length} 字符 | 混淆后: {output.length} 字符 | 
                压缩率: {((1 - output.length / input.length) * 100).toFixed(1)}%
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 使用说明 */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>使用说明</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">混淆技术</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• <strong>变量重命名</strong>：将有意义的变量名替换为随机字符</li>
              <li>• <strong>函数重命名</strong>：混淆函数名以隐藏功能</li>
              <li>• <strong>字符串编码</strong>：对字符串进行编码处理</li>
              <li>• <strong>控制流平坦化</strong>：改变代码执行流程</li>
              <li>• <strong>死代码注入</strong>：插入无用代码干扰分析</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">混淆级别</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• <strong>轻度</strong>：仅压缩代码，保持可读性</li>
              <li>• <strong>中度</strong>：重命名标识符，平衡保护和性能</li>
              <li>• <strong>重度</strong>：全面混淆，最强保护但可能影响性能</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">注意事项</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• 混淆会增加代码大小和执行时间</li>
              <li>• 混淆后的代码难以调试</li>
              <li>• 建议在生产环境中使用</li>
              <li>• 混淆不能完全防止逆向工程</li>
            </ul>
          </div>
          <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
            <h4 className="font-medium mb-2 text-orange-800 dark:text-orange-200">⚠️ 重要提醒</h4>
            <p className="text-sm text-orange-700 dark:text-orange-300">
              这是一个简化的演示工具。实际的代码混淆需要专业的工具（如UglifyJS、Terser、javascript-obfuscator等）来确保代码的正确性和安全性。
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
