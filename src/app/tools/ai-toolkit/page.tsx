'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Brain, MessageSquare, Image, FileText, Copy, Check } from 'lucide-react';
import Link from 'next/link';

export default function AIToolkitPage() {
  const [activeTab, setActiveTab] = useState<'chat' | 'image' | 'text' | 'code'>('chat');
  const [copied, setCopied] = useState<string | null>(null);

  const copyContent = async (content: string, id: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  // AI对话助手
  const ChatAssistant = () => {
    const [messages, setMessages] = useState([
      { role: 'assistant', content: '你好！我是AI助手，有什么可以帮助你的吗？' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const sendMessage = async () => {
      if (!input.trim()) return;

      const userMessage = { role: 'user', content: input };
      setMessages([...messages, userMessage]);
      setInput('');
      setIsLoading(true);

      // 模拟AI响应
      setTimeout(() => {
        const responses = [
          '这是一个很好的问题！让我来帮你分析一下...',
          '根据你的描述，我建议你可以尝试以下几种方法...',
          '我理解你的需求，这里有一些相关的信息...',
          '让我为你提供一个详细的解答...'
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        setMessages(prev => [...prev, { role: 'assistant', content: randomResponse }]);
        setIsLoading(false);
      }, 1000);
    };

    return (
      <Card>
        <CardHeader><CardTitle>AI对话助手</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="h-96 border rounded-lg p-4 overflow-y-auto bg-gray-50">
            {messages.map((message, index) => (
              <div key={index} className={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                <div className={`inline-block max-w-[80%] p-3 rounded-lg ${
                  message.role === 'user' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white border'
                }`}>
                  {message.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="text-left">
                <div className="inline-block bg-white border p-3 rounded-lg">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              className="flex-1 p-2 border rounded-lg"
              placeholder="输入你的问题..."
              disabled={isLoading}
            />
            <Button onClick={sendMessage} disabled={isLoading || !input.trim()}>
              发送
            </Button>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium mb-2">使用提示</h4>
            <div className="text-sm space-y-1">
              <div>• 尽量描述清楚你的问题或需求</div>
              <div>• 可以询问学习、工作、生活等各方面问题</div>
              <div>• 支持多轮对话，可以追问和澄清</div>
              <div>• 注意：这是演示版本，实际使用需要接入真实AI服务</div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // 图像生成
  const ImageGenerator = () => {
    const [prompt, setPrompt] = useState('');
    const [style, setStyle] = useState('realistic');
    const [size, setSize] = useState('512x512');
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const generateImage = () => {
      if (!prompt.trim()) return;

      setIsGenerating(true);
      
      // 模拟图像生成
      setTimeout(() => {
        // 使用占位图片服务
        const imageUrl = `https://picsum.photos/512/512?random=${Date.now()}`;
        setGeneratedImage(imageUrl);
        setIsGenerating(false);
      }, 2000);
    };

    const styles = [
      { value: 'realistic', label: '写实风格' },
      { value: 'cartoon', label: '卡通风格' },
      { value: 'anime', label: '动漫风格' },
      { value: 'oil_painting', label: '油画风格' },
      { value: 'watercolor', label: '水彩风格' },
      { value: 'sketch', label: '素描风格' }
    ];

    const sizes = [
      { value: '256x256', label: '256×256' },
      { value: '512x512', label: '512×512' },
      { value: '1024x1024', label: '1024×1024' }
    ];

    return (
      <Card>
        <CardHeader><CardTitle>AI图像生成</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">描述你想要的图像</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full p-2 border rounded-lg h-24"
              placeholder="例如：一只可爱的小猫坐在花园里，阳光明媚，高清摄影"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">风格</label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full p-2 border rounded-lg"
              >
                {styles.map(s => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">尺寸</label>
              <select
                value={size}
                onChange={(e) => setSize(e.target.value)}
                className="w-full p-2 border rounded-lg"
              >
                {sizes.map(s => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>

          <Button 
            onClick={generateImage} 
            disabled={isGenerating || !prompt.trim()}
            className="w-full"
          >
            {isGenerating ? '生成中...' : '生成图像'}
          </Button>

          {generatedImage && (
            <div className="space-y-3">
              <div className="border rounded-lg p-4 bg-gray-50">
                <img 
                  src={generatedImage} 
                  alt="Generated" 
                  className="w-full max-w-md mx-auto rounded-lg"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">下载图像</Button>
                <Button variant="outline" className="flex-1">重新生成</Button>
              </div>
            </div>
          )}

          <div className="p-4 bg-purple-50 rounded-lg">
            <h4 className="font-medium mb-2">提示词技巧</h4>
            <div className="text-sm space-y-1">
              <div>• 详细描述主体、环境、光线、色彩</div>
              <div>• 使用艺术风格关键词：油画、水彩、素描等</div>
              <div>• 添加质量词：高清、4K、专业摄影等</div>
              <div>• 避免版权内容和敏感主题</div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // 文本生成
  const TextGenerator = () => {
    const [textType, setTextType] = useState('article');
    const [topic, setTopic] = useState('');
    const [length, setLength] = useState('medium');
    const [tone, setTone] = useState('professional');
    const [generatedText, setGeneratedText] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const textTypes = [
      { value: 'article', label: '文章' },
      { value: 'summary', label: '摘要' },
      { value: 'email', label: '邮件' },
      { value: 'social', label: '社交媒体' },
      { value: 'product', label: '产品描述' },
      { value: 'story', label: '故事' }
    ];

    const lengths = [
      { value: 'short', label: '短（100-200字）' },
      { value: 'medium', label: '中（300-500字）' },
      { value: 'long', label: '长（800-1000字）' }
    ];

    const tones = [
      { value: 'professional', label: '专业' },
      { value: 'casual', label: '随意' },
      { value: 'friendly', label: '友好' },
      { value: 'formal', label: '正式' },
      { value: 'creative', label: '创意' },
      { value: 'persuasive', label: '说服性' }
    ];

    const generateText = () => {
      if (!topic.trim()) return;

      setIsGenerating(true);
      
      // 模拟文本生成
      setTimeout(() => {
        const sampleTexts = {
          article: `关于"${topic}"的深度分析

在当今快速发展的时代，${topic}已经成为了一个备受关注的话题。通过深入研究和分析，我们可以发现这个领域存在着许多值得探讨的问题和机遇。

首先，我们需要了解${topic}的基本概念和发展历程。从历史的角度来看，这个领域经历了多个重要的发展阶段，每个阶段都有其独特的特点和贡献。

其次，当前${topic}面临的主要挑战包括技术创新、市场竞争、政策法规等多个方面。这些挑战既是障碍，也是推动行业发展的动力。

最后，展望未来，${topic}将朝着更加智能化、个性化的方向发展，为社会带来更多的价值和便利。`,
          
          summary: `${topic}要点总结：

1. 核心概念：${topic}是指...
2. 主要特点：具有创新性、实用性、可持续性等特征
3. 应用领域：广泛应用于多个行业和场景
4. 发展趋势：未来将朝着更加智能化的方向发展
5. 关键建议：建议关注技术创新和用户体验的平衡`,

          email: `主题：关于${topic}的重要通知

尊敬的同事/客户，

希望这封邮件能够找到您身体健康，工作顺利。

我写信是想与您分享关于${topic}的最新信息。经过我们团队的深入研究和分析，我们认为这个话题对我们的业务发展具有重要意义。

具体来说，我们建议采取以下行动：
- 深入了解相关技术和市场趋势
- 制定相应的战略规划
- 加强团队协作和沟通

如果您有任何问题或建议，请随时与我联系。期待您的回复。

此致
敬礼`
        };

        const text = sampleTexts[textType as keyof typeof sampleTexts] || sampleTexts.article;
        setGeneratedText(text);
        setIsGenerating(false);
      }, 1500);
    };

    return (
      <Card>
        <CardHeader><CardTitle>AI文本生成</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">主题或关键词</label>
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full p-2 border rounded-lg"
              placeholder="例如：人工智能、环保、健康生活"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">文本类型</label>
              <select
                value={textType}
                onChange={(e) => setTextType(e.target.value)}
                className="w-full p-2 border rounded-lg"
              >
                {textTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">长度</label>
              <select
                value={length}
                onChange={(e) => setLength(e.target.value)}
                className="w-full p-2 border rounded-lg"
              >
                {lengths.map(len => (
                  <option key={len.value} value={len.value}>{len.label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">语调</label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full p-2 border rounded-lg"
              >
                {tones.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
          </div>

          <Button 
            onClick={generateText} 
            disabled={isGenerating || !topic.trim()}
            className="w-full"
          >
            {isGenerating ? '生成中...' : '生成文本'}
          </Button>

          {generatedText && (
            <div className="space-y-3">
              <div className="relative">
                <textarea
                  value={generatedText}
                  onChange={(e) => setGeneratedText(e.target.value)}
                  className="w-full p-4 border rounded-lg h-64 bg-gray-50"
                  placeholder="生成的文本将显示在这里..."
                />
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute top-2 right-2"
                  onClick={() => copyContent(generatedText, 'text')}
                >
                  {copied === 'text' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">重新生成</Button>
                <Button variant="outline" className="flex-1">优化文本</Button>
              </div>
            </div>
          )}

          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-medium mb-2">写作建议</h4>
            <div className="text-sm space-y-1">
              <div>• 明确目标受众和写作目的</div>
              <div>• 使用具体的关键词和描述</div>
              <div>• 选择合适的语调和风格</div>
              <div>• 生成后可以进一步编辑和优化</div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // 代码生成
  const CodeGenerator = () => {
    const [language, setLanguage] = useState('javascript');
    const [description, setDescription] = useState('');
    const [framework, setFramework] = useState('none');
    const [generatedCode, setGeneratedCode] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const languages = [
      { value: 'javascript', label: 'JavaScript' },
      { value: 'python', label: 'Python' },
      { value: 'java', label: 'Java' },
      { value: 'cpp', label: 'C++' },
      { value: 'html', label: 'HTML' },
      { value: 'css', label: 'CSS' }
    ];

    const frameworks = [
      { value: 'none', label: '无框架' },
      { value: 'react', label: 'React' },
      { value: 'vue', label: 'Vue.js' },
      { value: 'angular', label: 'Angular' },
      { value: 'express', label: 'Express.js' },
      { value: 'django', label: 'Django' }
    ];

    const generateCode = () => {
      if (!description.trim()) return;

      setIsGenerating(true);
      
      // 模拟代码生成
      setTimeout(() => {
        const codeTemplates = {
          javascript: `// ${description}
function processData(data) {
    // 数据处理逻辑
    const result = data.map(item => {
        return {
            ...item,
            processed: true,
            timestamp: new Date().toISOString()
        };
    });
    
    return result;
}

// 使用示例
const sampleData = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' }
];

const processedData = processData(sampleData);
console.log(processedData);`,

          python: `# ${description}
def process_data(data):
    """
    处理数据的函数
    """
    result = []
    for item in data:
        processed_item = {
            **item,
            'processed': True,
            'timestamp': datetime.now().isoformat()
        }
        result.append(processed_item)
    
    return result

# 使用示例
from datetime import datetime

sample_data = [
    {'id': 1, 'name': 'Item 1'},
    {'id': 2, 'name': 'Item 2'}
]

processed_data = process_data(sample_data)
print(processed_data)`,

          html: `<!-- ${description} -->
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>页面标题</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>欢迎使用</h1>
        <p>这是一个示例页面。</p>
    </div>
</body>
</html>`
        };

        const code = codeTemplates[language as keyof typeof codeTemplates] || codeTemplates.javascript;
        setGeneratedCode(code);
        setIsGenerating(false);
      }, 1500);
    };

    return (
      <Card>
        <CardHeader><CardTitle>AI代码生成</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">功能描述</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border rounded-lg h-20"
              placeholder="描述你想要实现的功能，例如：创建一个用户登录表单"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">编程语言</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full p-2 border rounded-lg"
              >
                {languages.map(lang => (
                  <option key={lang.value} value={lang.value}>{lang.label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">框架</label>
              <select
                value={framework}
                onChange={(e) => setFramework(e.target.value)}
                className="w-full p-2 border rounded-lg"
              >
                {frameworks.map(fw => (
                  <option key={fw.value} value={fw.value}>{fw.label}</option>
                ))}
              </select>
            </div>
          </div>

          <Button 
            onClick={generateCode} 
            disabled={isGenerating || !description.trim()}
            className="w-full"
          >
            {isGenerating ? '生成中...' : '生成代码'}
          </Button>

          {generatedCode && (
            <div className="space-y-3">
              <div className="relative">
                <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{generatedCode}</code>
                </pre>
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute top-2 right-2"
                  onClick={() => copyContent(generatedCode, 'code')}
                >
                  {copied === 'code' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">重新生成</Button>
                <Button variant="outline" className="flex-1">优化代码</Button>
              </div>
            </div>
          )}

          <div className="p-4 bg-orange-50 rounded-lg">
            <h4 className="font-medium mb-2">代码生成提示</h4>
            <div className="text-sm space-y-1">
              <div>• 详细描述功能需求和预期行为</div>
              <div>• 指定输入输出格式和数据类型</div>
              <div>• 提及性能要求和约束条件</div>
              <div>• 生成的代码需要测试和调试</div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const tabs = [
    { key: 'chat', name: 'AI对话', icon: MessageSquare },
    { key: 'image', name: '图像生成', icon: Image },
    { key: 'text', name: '文本生成', icon: FileText },
    { key: 'code', name: '代码生成', icon: Brain },
  ] as const;

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
          <Brain className="h-8 w-8" />
          AI工具集
        </h1>
        <p className="text-muted-foreground mt-2">
          人工智能工具，包括AI对话、图像生成、文本创作、代码生成、数据分析
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

      {activeTab === 'chat' && <ChatAssistant />}
      {activeTab === 'image' && <ImageGenerator />}
      {activeTab === 'text' && <TextGenerator />}
      {activeTab === 'code' && <CodeGenerator />}
    </div>
  );
}
