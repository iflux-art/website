'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/cards/card';
import { ArrowLeft, Smile, Star, Hash, Type } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import Link from 'next/link';

type TabKey = 'emoji' | 'emoticon' | 'special' | 'math';

interface Tab {
  key: TabKey;
  name: string;
  icon: LucideIcon;
}

const tabs: Tab[] = [
  { key: 'emoji', name: 'Emoji表情', icon: Smile },
  { key: 'emoticon', name: '颜文字', icon: Type },
  { key: 'special', name: '特殊符号', icon: Star },
  { key: 'math', name: '数学符号', icon: Hash },
];
export default function SymbolCollectionPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('emoji');
  const [copied, setCopied] = useState<string | null>(null);

  const copySymbol = async (symbol: string) => {
    try {
      await navigator.clipboard.writeText(symbol);
      setCopied(symbol);
      setTimeout(() => setCopied(null), 1000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  // Emoji 表情符号
  const emojis = {
    笑脸: [
      '😀',
      '😃',
      '😄',
      '😁',
      '😆',
      '😅',
      '😂',
      '🤣',
      '😊',
      '😇',
      '🙂',
      '🙃',
      '😉',
      '😌',
      '😍',
      '🥰',
      '😘',
      '😗',
      '😙',
      '😚',
    ],
    手势: [
      '👍',
      '👎',
      '👌',
      '✌️',
      '🤞',
      '🤟',
      '🤘',
      '🤙',
      '👈',
      '👉',
      '👆',
      '🖕',
      '👇',
      '☝️',
      '👋',
      '🤚',
      '🖐️',
      '✋',
      '🖖',
      '👏',
    ],
    动物: [
      '🐶',
      '🐱',
      '🐭',
      '🐹',
      '🐰',
      '🦊',
      '🐻',
      '🐼',
      '🐨',
      '🐯',
      '🦁',
      '🐮',
      '🐷',
      '🐸',
      '🐵',
      '🙈',
      '🙉',
      '🙊',
      '🐒',
      '🐔',
    ],
    食物: [
      '🍎',
      '🍊',
      '🍋',
      '🍌',
      '🍉',
      '🍇',
      '🍓',
      '🍈',
      '🍒',
      '🍑',
      '🥭',
      '🍍',
      '🥥',
      '🥝',
      '🍅',
      '🍆',
      '🥑',
      '🥦',
      '🥒',
      '🌶️',
    ],
    交通: [
      '🚗',
      '🚕',
      '🚙',
      '🚌',
      '🚎',
      '🏎️',
      '🚓',
      '🚑',
      '🚒',
      '🚐',
      '🛻',
      '🚚',
      '🚛',
      '🚜',
      '🏍️',
      '🛵',
      '🚲',
      '🛴',
      '🛹',
      '🚁',
    ],
    符号: [
      '❤️',
      '💛',
      '💚',
      '💙',
      '💜',
      '🖤',
      '🤍',
      '🤎',
      '💔',
      '❣️',
      '💕',
      '💞',
      '💓',
      '💗',
      '💖',
      '💘',
      '💝',
      '💟',
      '☮️',
      '✝️',
    ],
  };

  // 颜文字
  const emoticons = {
    开心: [
      '(^_^)',
      '(^o^)',
      '(^▽^)',
      '(≧∇≦)',
      '(´∀｀)',
      '(*^_^*)',
      '(＾◡＾)',
      '(◕‿◕)',
      '(｡◕‿◕｡)',
      '(✿◠‿◠)',
    ],
    难过: [
      '(T_T)',
      '(;_;)',
      '(╥﹏╥)',
      '(´；ω；`)',
      '(｡•́︿•̀｡)',
      '(◞‸◟)',
      '(╯︵╰)',
      '(个_个)',
      '(ಥ﹏ಥ)',
      '(༎ຶ‿༎ຶ)',
    ],
    生气: [
      '(╯°□°）╯',
      '(ノಠ益ಠ)ノ',
      '(╬ಠ益ಠ)',
      '(ಠ_ಠ)',
      '(-_-#)',
      '(¬_¬)',
      '(눈_눈)',
      '(｀皿´)',
      '(#｀皿´)',
      '(╯‵□′)╯',
    ],
    惊讶: [
      '(⊙_⊙)',
      '(°o°)',
      '(◎_◎)',
      '(⊙o⊙)',
      '(゜-゜)',
      '(◉_◉)',
      '(@_@)',
      '(⊙﹏⊙)',
      '(°△°)',
      '(￣□￣)',
    ],
    害羞: [
      '(//▽//)',
      '(*/ω＼*)',
      '(〃∇〃)',
      '(*/∇＼*)',
      '(⁄ ⁄•⁄ω⁄•⁄ ⁄)',
      '(´∀｀)♡',
      '(´ε｀ )',
      '(´∀｀*)ε｀ )',
      '(*´∀｀*)',
      '(´▽｀)',
    ],
    卖萌: [
      '(´･ω･`)',
      '(｡◕‿‿◕｡)',
      '(◕‿◕)♡',
      '(´｡• ᵕ •｡`)',
      '(◡ ω ◡)',
      '(´∀｀)♡',
      '(◕‿◕)✿',
      '(｡♥‿♥｡)',
      '(◕ᴗ◕✿)',
      '(◍•ᴗ•◍)',
    ],
  };

  // 特殊符号
  const specialSymbols = {
    箭头: [
      '→',
      '←',
      '↑',
      '↓',
      '↗',
      '↖',
      '↘',
      '↙',
      '⇒',
      '⇐',
      '⇑',
      '⇓',
      '⟶',
      '⟵',
      '⟷',
      '↔',
      '⇔',
      '⇄',
      '⇅',
      '↕',
    ],
    星星: [
      '★',
      '☆',
      '✦',
      '✧',
      '✩',
      '✪',
      '✫',
      '✬',
      '✭',
      '✮',
      '✯',
      '✰',
      '✱',
      '✲',
      '✳',
      '✴',
      '✵',
      '✶',
      '✷',
      '✸',
    ],
    符号: [
      '♠',
      '♣',
      '♥',
      '♦',
      '♤',
      '♧',
      '♡',
      '♢',
      '♔',
      '♕',
      '♖',
      '♗',
      '♘',
      '♙',
      '♚',
      '♛',
      '♜',
      '♝',
      '♞',
      '♟',
    ],
    货币: [
      '$',
      '¢',
      '£',
      '¤',
      '¥',
      '₦',
      '€',
      '₹',
      '₽',
      '₩',
      '₪',
      '₫',
      '₱',
      '₡',
      '₨',
      '₵',
      '₴',
      '₸',
      '₼',
      '₿',
    ],
    标点: [
      '‚',
      '„',
      '"',
      '"',
      "'",
      "'",
      '‹',
      '›',
      '«',
      '»',
      '‖',
      '¦',
      '§',
      '¶',
      '†',
      '‡',
      '•',
      '‰',
      '′',
      '″',
    ],
    数学: [
      '±',
      '×',
      '÷',
      '∞',
      '∝',
      '∑',
      '∏',
      '∫',
      '∂',
      '∆',
      '∇',
      '√',
      '∛',
      '∜',
      '≈',
      '≠',
      '≤',
      '≥',
      '∈',
      '∉',
    ],
  };

  // 数学符号
  const mathSymbols = {
    基础: [
      '＋',
      '－',
      '×',
      '÷',
      '＝',
      '≠',
      '≈',
      '≡',
      '∝',
      '∞',
      '∅',
      '∴',
      '∵',
      '∀',
      '∃',
      '∄',
      '∈',
      '∉',
      '∋',
      '∌',
    ],
    比较: [
      '＜',
      '＞',
      '≤',
      '≥',
      '≪',
      '≫',
      '≮',
      '≯',
      '≰',
      '≱',
      '≲',
      '≳',
      '≴',
      '≵',
      '≶',
      '≷',
      '≸',
      '≹',
      '≺',
      '≻',
    ],
    几何: [
      '∠',
      '∡',
      '∢',
      '⊥',
      '∥',
      '∦',
      '△',
      '▲',
      '▽',
      '▼',
      '◇',
      '◆',
      '□',
      '■',
      '○',
      '●',
      '◯',
      '⊙',
      '⊚',
      '⊛',
    ],
    集合: [
      '∪',
      '∩',
      '∁',
      '⊂',
      '⊃',
      '⊄',
      '⊅',
      '⊆',
      '⊇',
      '⊈',
      '⊉',
      '⊊',
      '⊋',
      '⊌',
      '⊍',
      '⊎',
      '⊏',
      '⊐',
      '⊑',
      '⊒',
    ],
    运算: [
      '√',
      '∛',
      '∜',
      '∑',
      '∏',
      '∐',
      '∫',
      '∬',
      '∭',
      '∮',
      '∯',
      '∰',
      '∱',
      '∲',
      '∳',
      '∂',
      '∆',
      '∇',
      '±',
      '∓',
    ],
    逻辑: [
      '∧',
      '∨',
      '¬',
      '⊕',
      '⊗',
      '⊙',
      '⊥',
      '⊤',
      '⊢',
      '⊣',
      '⊨',
      '⊭',
      '⊮',
      '⊯',
      '⊰',
      '⊱',
      '⊲',
      '⊳',
      '⊴',
      '⊵',
    ],
  };

  const renderSymbolGrid = (symbols: Record<string, string[]>) => {
    return Object.entries(symbols).map(([category, symbolList]) => (
      <div key={category} className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-1 w-4 bg-primary rounded-full"></div>
          <h3 className="text-lg font-semibold text-foreground">{category}</h3>
          <div className="flex-1 h-px bg-border"></div>
          <span className="text-sm text-muted-foreground">{symbolList.length}个符号</span>
        </div>
        <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 lg:grid-cols-15 xl:grid-cols-20 gap-2">
          {symbolList.map((symbol, index) => (
            <div key={index} className="relative group">
              <Button
                variant="outline"
                className="h-12 w-12 text-lg hover:bg-primary hover:text-primary-foreground hover:scale-110 transition-all duration-200 border-border/50 hover:border-primary/50 hover:shadow-md"
                onClick={() => copySymbol(symbol)}
              >
                {symbol}
              </Button>
              {copied === symbol && (
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-xs px-2 py-1 rounded shadow-lg animate-in fade-in-0 zoom-in-95 duration-200">
                  已复制
                </div>
              )}
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-popover text-popover-foreground text-xs px-2 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                点击复制
              </div>
            </div>
          ))}
        </div>
      </div>
    ));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Link href="/tools">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">符号大全</h1>
            <p className="text-muted-foreground">
              完整的符号集合，包含Emoji、颜文字、特殊符号、数学符号，支持一键复制
            </p>
          </div>
        </div>
      </div>

      {/* 标签页导航 */}
      <Card className="mb-6">
        <CardContent className="p-0">
          <div className="flex border-b overflow-x-auto">
            {tabs.map(tab => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 min-w-[120px] p-4 text-center border-b-2 transition-colors flex items-center justify-center gap-2 ${
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

      {/* 符号内容 */}
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            {activeTab === 'emoji' && (
              <>
                <Smile className="h-5 w-5 text-primary" />
                Emoji表情符号
              </>
            )}
            {activeTab === 'emoticon' && (
              <>
                <Type className="h-5 w-5 text-primary" />
                颜文字表情
              </>
            )}
            {activeTab === 'special' && (
              <>
                <Star className="h-5 w-5 text-primary" />
                特殊符号
              </>
            )}
            {activeTab === 'math' && (
              <>
                <Hash className="h-5 w-5 text-primary" />
                数学符号
              </>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="max-h-[70vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
            {activeTab === 'emoji' && renderSymbolGrid(emojis)}
            {activeTab === 'emoticon' && renderSymbolGrid(emoticons)}
            {activeTab === 'special' && renderSymbolGrid(specialSymbols)}
            {activeTab === 'math' && renderSymbolGrid(mathSymbols)}
          </div>
        </CardContent>
      </Card>

      {/* 使用说明 */}
      <Card className="mt-6 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <div className="h-2 w-2 bg-primary rounded-full"></div>
            使用说明
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-1 w-3 bg-blue-500 rounded-full"></div>
                <h4 className="font-medium text-foreground">功能特点</h4>
              </div>
              <ul className="text-muted-foreground space-y-2">
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  包含丰富的Emoji表情符号，涵盖各种情感和场景
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  提供经典颜文字表情，适合文本聊天使用
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  收录常用特殊符号，包括箭头、星星、货币等
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  完整的数学符号集合，满足学术和专业需求
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-1 w-3 bg-green-500 rounded-full"></div>
                <h4 className="font-medium text-foreground">使用方法</h4>
              </div>
              <ul className="text-muted-foreground space-y-2">
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                  点击任意符号即可复制到剪贴板
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                  复制成功后会显示"已复制"提示
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                  可在任何支持文本输入的地方粘贴使用
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                  支持响应式布局和快捷操作
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
