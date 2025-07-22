"use client";

import React, { useState } from "react";
import { Button } from "packages/ui/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "packages/ui/components/ui/card";
import { ArrowLeft, Smile, Star, Hash, Type } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";

type TabKey = "emoji" | "emoticon" | "special" | "math";

interface Tab {
  key: TabKey;
  name: string;
  icon: LucideIcon;
}

const tabs: Tab[] = [
  { key: "emoji", name: "Emoji表情", icon: Smile },
  { key: "emoticon", name: "颜文字", icon: Type },
  { key: "special", name: "特殊符号", icon: Star },
  { key: "math", name: "数学符号", icon: Hash },
];
export default function SymbolCollectionPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("emoji");
  const [copied, setCopied] = useState<string | null>(null);

  const copySymbol = async (symbol: string) => {
    try {
      await navigator.clipboard.writeText(symbol);
      setCopied(symbol);
      setTimeout(() => setCopied(null), 1000);
    } catch (err) {
      console.error("复制失败:", err);
    }
  };

  // Emoji 表情符号
  const emojis = {
    笑脸: [
      "😀",
      "😃",
      "😄",
      "😁",
      "😆",
      "😅",
      "😂",
      "🤣",
      "😊",
      "😇",
      "🙂",
      "🙃",
      "😉",
      "😌",
      "😍",
      "🥰",
      "😘",
      "😗",
      "😙",
      "😚",
    ],
    手势: [
      "👍",
      "👎",
      "👌",
      "✌️",
      "🤞",
      "🤟",
      "🤘",
      "🤙",
      "👈",
      "👉",
      "👆",
      "🖕",
      "👇",
      "☝️",
      "👋",
      "🤚",
      "🖐️",
      "✋",
      "🖖",
      "👏",
    ],
    动物: [
      "🐶",
      "🐱",
      "🐭",
      "🐹",
      "🐰",
      "🦊",
      "🐻",
      "🐼",
      "🐨",
      "🐯",
      "🦁",
      "🐮",
      "🐷",
      "🐸",
      "🐵",
      "🙈",
      "🙉",
      "🙊",
      "🐒",
      "🐔",
    ],
    食物: [
      "🍎",
      "🍊",
      "🍋",
      "🍌",
      "🍉",
      "🍇",
      "🍓",
      "🍈",
      "🍒",
      "🍑",
      "🥭",
      "🍍",
      "🥥",
      "🥝",
      "🍅",
      "🍆",
      "🥑",
      "🥦",
      "🥒",
      "🌶️",
    ],
    交通: [
      "🚗",
      "🚕",
      "🚙",
      "🚌",
      "🚎",
      "🏎️",
      "🚓",
      "🚑",
      "🚒",
      "🚐",
      "🛻",
      "🚚",
      "🚛",
      "🚜",
      "🏍️",
      "🛵",
      "🚲",
      "🛴",
      "🛹",
      "🚁",
    ],
    符号: [
      "❤️",
      "💛",
      "💚",
      "💙",
      "💜",
      "🖤",
      "🤍",
      "🤎",
      "💔",
      "❣️",
      "💕",
      "💞",
      "💓",
      "💗",
      "💖",
      "💘",
      "💝",
      "💟",
      "☮️",
      "✝️",
    ],
  };

  // 颜文字
  const emoticons = {
    开心: [
      "(^_^)",
      "(^o^)",
      "(^▽^)",
      "(≧∇≦)",
      "(´∀｀)",
      "(*^_^*)",
      "(＾◡＾)",
      "(◕‿◕)",
      "(｡◕‿◕｡)",
      "(✿◠‿◠)",
    ],
    难过: [
      "(T_T)",
      "(;_;)",
      "(╥﹏╥)",
      "(´；ω；`)",
      "(｡•́︿•̀｡)",
      "(◞‸◟)",
      "(╯︵╰)",
      "(个_个)",
      "(ಥ﹏ಥ)",
      "(༎ຶ‿༎ຶ)",
    ],
    生气: [
      "(╯°□°）╯",
      "(ノಠ益ಠ)ノ",
      "(╬ಠ益ಠ)",
      "(ಠ_ಠ)",
      "(-_-#)",
      "(¬_¬)",
      "(눈_눈)",
      "(｀皿´)",
      "(#｀皿´)",
      "(╯‵□′)╯",
    ],
    惊讶: [
      "(⊙_⊙)",
      "(°o°)",
      "(◎_◎)",
      "(⊙o⊙)",
      "(゜-゜)",
      "(◉_◉)",
      "(@_@)",
      "(⊙﹏⊙)",
      "(°△°)",
      "(￣□￣)",
    ],
    害羞: [
      "(//▽//)",
      "(*/ω＼*)",
      "(〃∇〃)",
      "(*/∇＼*)",
      "(⁄ ⁄•⁄ω⁄•⁄ ⁄)",
      "(´∀｀)♡",
      "(´ε｀ )",
      "(´∀｀*)ε｀ )",
      "(*´∀｀*)",
      "(´▽｀)",
    ],
    卖萌: [
      "(´･ω･`)",
      "(｡◕‿‿◕｡)",
      "(◕‿◕)♡",
      "(´｡• ᵕ •｡`)",
      "(◡ ω ◡)",
      "(´∀｀)♡",
      "(◕‿◕)✿",
      "(｡♥‿♥｡)",
      "(◕ᴗ◕✿)",
      "(◍•ᴗ•◍)",
    ],
  };

  // 特殊符号
  const specialSymbols = {
    箭头: [
      "→",
      "←",
      "↑",
      "↓",
      "↗",
      "↖",
      "↘",
      "↙",
      "⇒",
      "⇐",
      "⇑",
      "⇓",
      "⟶",
      "⟵",
      "⟷",
      "↔",
      "⇔",
      "⇄",
      "⇅",
      "↕",
    ],
    星星: [
      "★",
      "☆",
      "✦",
      "✧",
      "✩",
      "✪",
      "✫",
      "✬",
      "✭",
      "✮",
      "✯",
      "✰",
      "✱",
      "✲",
      "✳",
      "✴",
      "✵",
      "✶",
      "✷",
      "✸",
    ],
    符号: [
      "♠",
      "♣",
      "♥",
      "♦",
      "♤",
      "♧",
      "♡",
      "♢",
      "♔",
      "♕",
      "♖",
      "♗",
      "♘",
      "♙",
      "♚",
      "♛",
      "♜",
      "♝",
      "♞",
      "♟",
    ],
    货币: [
      "$",
      "¢",
      "£",
      "¤",
      "¥",
      "₦",
      "€",
      "₹",
      "₽",
      "₩",
      "₪",
      "₫",
      "₱",
      "₡",
      "₨",
      "₵",
      "₴",
      "₸",
      "₼",
      "₿",
    ],
    标点: [
      "‚",
      "„",
      '"',
      '"',
      "'",
      "'",
      "‹",
      "›",
      "«",
      "»",
      "‖",
      "¦",
      "§",
      "¶",
      "†",
      "‡",
      "•",
      "‰",
      "′",
      "″",
    ],
    数学: [
      "±",
      "×",
      "÷",
      "∞",
      "∝",
      "∑",
      "∏",
      "∫",
      "∂",
      "∆",
      "∇",
      "√",
      "∛",
      "∜",
      "≈",
      "≠",
      "≤",
      "≥",
      "∈",
      "∉",
    ],
  };

  // 数学符号
  const mathSymbols = {
    基础: [
      "＋",
      "－",
      "×",
      "÷",
      "＝",
      "≠",
      "≈",
      "≡",
      "∝",
      "∞",
      "∅",
      "∴",
      "∵",
      "∀",
      "∃",
      "∄",
      "∈",
      "∉",
      "∋",
      "∌",
    ],
    比较: [
      "＜",
      "＞",
      "≤",
      "≥",
      "≪",
      "≫",
      "≮",
      "≯",
      "≰",
      "≱",
      "≲",
      "≳",
      "≴",
      "≵",
      "≶",
      "≷",
      "≸",
      "≹",
      "≺",
      "≻",
    ],
    几何: [
      "∠",
      "∡",
      "∢",
      "⊥",
      "∥",
      "∦",
      "△",
      "▲",
      "▽",
      "▼",
      "◇",
      "◆",
      "□",
      "■",
      "○",
      "●",
      "◯",
      "⊙",
      "⊚",
      "⊛",
    ],
    集合: [
      "∪",
      "∩",
      "∁",
      "⊂",
      "⊃",
      "⊄",
      "⊅",
      "⊆",
      "⊇",
      "⊈",
      "⊉",
      "⊊",
      "⊋",
      "⊌",
      "⊍",
      "⊎",
      "⊏",
      "⊐",
      "⊑",
      "⊒",
    ],
    运算: [
      "√",
      "∛",
      "∜",
      "∑",
      "∏",
      "∐",
      "∫",
      "∬",
      "∭",
      "∮",
      "∯",
      "∰",
      "∱",
      "∲",
      "∳",
      "∂",
      "∆",
      "∇",
      "±",
      "∓",
    ],
    逻辑: [
      "∧",
      "∨",
      "¬",
      "⊕",
      "⊗",
      "⊙",
      "⊥",
      "⊤",
      "⊢",
      "⊣",
      "⊨",
      "⊭",
      "⊮",
      "⊯",
      "⊰",
      "⊱",
      "⊲",
      "⊳",
      "⊴",
      "⊵",
    ],
  };

  const renderSymbolGrid = (symbols: Record<string, string[]>) => {
    return Object.entries(symbols).map(([category, symbolList]) => (
      <div key={category} className="mb-8">
        <div className="mb-4 flex items-center gap-2">
          <div className="h-1 w-4 rounded-full bg-primary"></div>
          <h3 className="text-lg font-semibold text-foreground">{category}</h3>
          <div className="h-px flex-1 bg-border"></div>
          <span className="text-sm text-muted-foreground">
            {symbolList.length}个符号
          </span>
        </div>
        <div className="grid grid-cols-8 gap-2 sm:grid-cols-10 md:grid-cols-12 lg:grid-cols-15 xl:grid-cols-20">
          {symbolList.map((symbol, index) => (
            <div key={index} className="group relative">
              <Button
                variant="outline"
                className="h-12 w-12 border-border/50 text-lg transition-all duration-200 hover:scale-110 hover:border-primary/50 hover:bg-primary hover:text-primary-foreground hover:shadow-md"
                onClick={() => copySymbol(symbol)}
              >
                {symbol}
              </Button>
              {copied === symbol && (
                <div className="animate-in fade-in-0 zoom-in-95 absolute -top-8 left-1/2 -translate-x-1/2 transform rounded bg-green-500 px-2 py-1 text-xs text-white shadow-lg duration-200">
                  已复制
                </div>
              )}
              <div className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 transform rounded bg-popover px-2 py-1 text-xs whitespace-nowrap text-popover-foreground opacity-0 shadow-md transition-opacity duration-200 group-hover:opacity-100">
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
        <div className="mb-4 flex items-center gap-4">
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
          <div className="flex overflow-x-auto border-b">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex min-w-[120px] flex-1 items-center justify-center gap-2 border-b-2 p-4 text-center transition-colors ${
                    activeTab === tab.key
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
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
            {activeTab === "emoji" && (
              <>
                <Smile className="h-5 w-5 text-primary" />
                Emoji表情符号
              </>
            )}
            {activeTab === "emoticon" && (
              <>
                <Type className="h-5 w-5 text-primary" />
                颜文字表情
              </>
            )}
            {activeTab === "special" && (
              <>
                <Star className="h-5 w-5 text-primary" />
                特殊符号
              </>
            )}
            {activeTab === "math" && (
              <>
                <Hash className="h-5 w-5 text-primary" />
                数学符号
              </>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent max-h-[70vh] overflow-y-auto pr-2">
            {activeTab === "emoji" && renderSymbolGrid(emojis)}
            {activeTab === "emoticon" && renderSymbolGrid(emoticons)}
            {activeTab === "special" && renderSymbolGrid(specialSymbols)}
            {activeTab === "math" && renderSymbolGrid(mathSymbols)}
          </div>
        </CardContent>
      </Card>

      {/* 使用说明 */}
      <Card className="mt-6 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary"></div>
            使用说明
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid gap-6 text-sm md:grid-cols-2">
            <div className="space-y-3">
              <div className="mb-3 flex items-center gap-2">
                <div className="h-1 w-3 rounded-full bg-blue-500"></div>
                <h4 className="font-medium text-foreground">功能特点</h4>
              </div>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <div className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-400"></div>
                  包含丰富的Emoji表情符号，涵盖各种情感和场景
                </li>
                <li className="flex items-start gap-2">
                  <div className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-400"></div>
                  提供经典颜文字表情，适合文本聊天使用
                </li>
                <li className="flex items-start gap-2">
                  <div className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-400"></div>
                  收录常用特殊符号，包括箭头、星星、货币等
                </li>
                <li className="flex items-start gap-2">
                  <div className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-400"></div>
                  完整的数学符号集合，满足学术和专业需求
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <div className="mb-3 flex items-center gap-2">
                <div className="h-1 w-3 rounded-full bg-green-500"></div>
                <h4 className="font-medium text-foreground">使用方法</h4>
              </div>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <div className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-green-400"></div>
                  点击任意符号即可复制到剪贴板
                </li>
                <li className="flex items-start gap-2">
                  <div className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-green-400"></div>
                  复制成功后会显示"已复制"提示
                </li>
                <li className="flex items-start gap-2">
                  <div className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-green-400"></div>
                  可在任何支持文本输入的地方粘贴使用
                </li>
                <li className="flex items-start gap-2">
                  <div className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-green-400"></div>
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
