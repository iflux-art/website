'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, BookOpen, Brain, Timer, Target } from 'lucide-react';
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';

type TabKey = 'flashcard' | 'pomodoro' | 'quiz' | 'progress';

interface Tab {
  key: TabKey;
  name: string;
  icon: LucideIcon;
}
export default function StudyToolkitPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('flashcard');

  // 闪卡学习
  const FlashcardTool = () => {
    const [cards, setCards] = useState([
      { front: '什么是React？', back: 'React是一个用于构建用户界面的JavaScript库' },
      { front: '什么是组件？', back: '组件是React应用的基本构建块，可以重复使用' }
    ]);
    const [currentCard, setCurrentCard] = useState(0);
    const [showBack, setShowBack] = useState(false);
    const [newCard, setNewCard] = useState({ front: '', back: '' });

    const addCard = () => {
      if (newCard.front && newCard.back) {
        setCards(prev => [...prev, newCard]);
        setNewCard({ front: '', back: '' });
      }
    };

    const nextCard = () => {
      setCurrentCard((prev) => (prev + 1) % cards.length);
      setShowBack(false);
    };

    const prevCard = () => {
      setCurrentCard((prev) => (prev - 1 + cards.length) % cards.length);
      setShowBack(false);
    };

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>添加新卡片</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">正面（问题）</label>
              <input
                type="text"
                value={newCard.front}
                onChange={(e) => setNewCard(prev => ({ ...prev, front: e.target.value }))}
                className="w-full p-2 border border-border rounded-lg bg-background"
                placeholder="输入问题..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">背面（答案）</label>
              <textarea
                value={newCard.back}
                onChange={(e) => setNewCard(prev => ({ ...prev, back: e.target.value }))}
                rows={3}
                className="w-full p-2 border border-border rounded-lg bg-background resize-none"
                placeholder="输入答案..."
              />
            </div>
            <Button onClick={addCard} disabled={!newCard.front || !newCard.back}>
              添加卡片
            </Button>
          </CardContent>
        </Card>

        {cards.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                闪卡学习
                <span className="text-sm text-muted-foreground">
                  {currentCard + 1} / {cards.length}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div 
                className="min-h-[200px] p-6 border-2 border-dashed border-border rounded-lg cursor-pointer flex items-center justify-center text-center bg-muted/50"
                onClick={() => setShowBack(!showBack)}
              >
                <div>
                  <div className="text-lg font-medium mb-2">
                    {showBack ? '答案' : '问题'}
                  </div>
                  <div className="text-base">
                    {showBack ? cards[currentCard].back : cards[currentCard].front}
                  </div>
                  <div className="text-sm text-muted-foreground mt-4">
                    点击查看{showBack ? '问题' : '答案'}
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <Button onClick={prevCard} variant="outline">
                  上一张
                </Button>
                <Button onClick={() => setShowBack(!showBack)} variant="outline">
                  {showBack ? '显示问题' : '显示答案'}
                </Button>
                <Button onClick={nextCard} variant="outline">
                  下一张
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  // 番茄钟
  const PomodoroTimer = () => {
    const [timeLeft, setTimeLeft] = useState(25 * 60); // 25分钟
    const [isRunning, setIsRunning] = useState(false);
    const [mode, setMode] = useState<'work' | 'break'>('work');
    const [sessions, setSessions] = useState(0);

    useEffect(() => {
      let interval: NodeJS.Timeout;
      
      if (isRunning && timeLeft > 0) {
        interval = setInterval(() => {
          setTimeLeft(prev => prev - 1);
        }, 1000);
      } else if (timeLeft === 0) {
        setIsRunning(false);
        if (mode === 'work') {
          setSessions(prev => prev + 1);
          setMode('break');
          setTimeLeft(5 * 60); // 5分钟休息
        } else {
          setMode('work');
          setTimeLeft(25 * 60); // 25分钟工作
        }
      }

      return () => clearInterval(interval);
    }, [isRunning, timeLeft, mode]);

    const formatTime = (seconds: number) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const resetTimer = () => {
      setIsRunning(false);
      setTimeLeft(mode === 'work' ? 25 * 60 : 5 * 60);
    };

    return (
      <Card>
        <CardHeader>
          <CardTitle>番茄钟学习法</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="text-6xl font-mono font-bold mb-4">
              {formatTime(timeLeft)}
            </div>
            <div className="text-lg mb-4">
              {mode === 'work' ? '🍅 专注时间' : '☕ 休息时间'}
            </div>
            <div className="text-sm text-muted-foreground">
              已完成 {sessions} 个番茄钟
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <Button 
              onClick={() => setIsRunning(!isRunning)}
              variant={isRunning ? 'destructive' : 'default'}
            >
              {isRunning ? '暂停' : '开始'}
            </Button>
            <Button onClick={resetTimer} variant="outline">
              重置
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button
              onClick={() => {
                setMode('work');
                setTimeLeft(25 * 60);
                setIsRunning(false);
              }}
              variant={mode === 'work' ? 'default' : 'outline'}
            >
              工作模式 (25分钟)
            </Button>
            <Button
              onClick={() => {
                setMode('break');
                setTimeLeft(5 * 60);
                setIsRunning(false);
              }}
              variant={mode === 'break' ? 'default' : 'outline'}
            >
              休息模式 (5分钟)
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  // 小测验
  const QuizTool = () => {
    const [questions, setQuestions] = useState([
      {
        question: 'JavaScript中声明变量的关键字有哪些？',
        options: ['var, let, const', 'int, float, string', 'public, private', 'if, else, for'],
        correct: 0
      },
      {
        question: 'React中用于管理状态的Hook是？',
        options: ['useEffect', 'useState', 'useContext', 'useReducer'],
        correct: 1
      }
    ]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [score, setScore] = useState(0);
    const [newQuestion, setNewQuestion] = useState({
      question: '',
      options: ['', '', '', ''],
      correct: 0
    });

    const addQuestion = () => {
      if (newQuestion.question && newQuestion.options.every(opt => opt)) {
        setQuestions(prev => [...prev, newQuestion]);
        setNewQuestion({
          question: '',
          options: ['', '', '', ''],
          correct: 0
        });
      }
    };

    const submitAnswer = () => {
      if (selectedAnswer === questions[currentQuestion].correct) {
        setScore(prev => prev + 1);
      }
      setShowResult(true);
    };

    const nextQuestion = () => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        alert(`测验完成！得分：${score}/${questions.length}`);
        setCurrentQuestion(0);
        setScore(0);
        setSelectedAnswer(null);
        setShowResult(false);
      }
    };

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>添加新题目</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">题目</label>
              <input
                type="text"
                value={newQuestion.question}
                onChange={(e) => setNewQuestion(prev => ({ ...prev, question: e.target.value }))}
                className="w-full p-2 border border-border rounded-lg bg-background"
                placeholder="输入题目..."
              />
            </div>
            
            {newQuestion.options.map((option, index) => (
              <div key={index}>
                <label className="block text-sm font-medium mb-2">选项 {String.fromCharCode(65 + index)}</label>
                <input
                  type="text"
                  value={option}
                  onChange={(e) => {
                    const newOptions = [...newQuestion.options];
                    newOptions[index] = e.target.value;
                    setNewQuestion(prev => ({ ...prev, options: newOptions }));
                  }}
                  className="w-full p-2 border border-border rounded-lg bg-background"
                  placeholder={`输入选项 ${String.fromCharCode(65 + index)}...`}
                />
              </div>
            ))}

            <div>
              <label className="block text-sm font-medium mb-2">正确答案</label>
              <select
                value={newQuestion.correct}
                onChange={(e) => setNewQuestion(prev => ({ ...prev, correct: Number(e.target.value) }))}
                className="w-full p-2 border border-border rounded-lg bg-background"
              >
                {newQuestion.options.map((_, index) => (
                  <option key={index} value={index}>
                    选项 {String.fromCharCode(65 + index)}
                  </option>
                ))}
              </select>
            </div>

            <Button onClick={addQuestion}>添加题目</Button>
          </CardContent>
        </Card>

        {questions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                小测验
                <span className="text-sm text-muted-foreground">
                  {currentQuestion + 1} / {questions.length}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-lg font-medium mb-4">
                {questions[currentQuestion].question}
              </div>

              <div className="space-y-2">
                {questions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => !showResult && setSelectedAnswer(index)}
                    className={`w-full p-3 text-left border rounded-lg transition-colors ${
                      selectedAnswer === index
                        ? showResult
                          ? index === questions[currentQuestion].correct
                            ? 'bg-green-100 border-green-500 text-green-800'
                            : 'bg-red-100 border-red-500 text-red-800'
                          : 'bg-primary/10 border-primary'
                        : showResult && index === questions[currentQuestion].correct
                        ? 'bg-green-100 border-green-500 text-green-800'
                        : 'border-border hover:bg-muted/50'
                    }`}
                    disabled={showResult}
                  >
                    {String.fromCharCode(65 + index)}. {option}
                  </button>
                ))}
              </div>

              <div className="flex justify-between">
                {!showResult ? (
                  <Button 
                    onClick={submitAnswer} 
                    disabled={selectedAnswer === null}
                  >
                    提交答案
                  </Button>
                ) : (
                  <Button onClick={nextQuestion}>
                    {currentQuestion < questions.length - 1 ? '下一题' : '完成测验'}
                  </Button>
                )}
                <div className="text-sm text-muted-foreground">
                  当前得分：{score}/{currentQuestion + (showResult ? 1 : 0)}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  // 学习进度
  const ProgressTracker = () => {
    const [goals, setGoals] = useState([
      { subject: 'JavaScript', target: 100, current: 65, unit: '小时' },
      { subject: 'React', target: 50, current: 30, unit: '小时' },
      { subject: '算法', target: 200, current: 120, unit: '题目' }
    ]);

    const [newGoal, setNewGoal] = useState({
      subject: '',
      target: 0,
      current: 0,
      unit: '小时'
    });

    const addGoal = () => {
      if (newGoal.subject && newGoal.target > 0) {
        setGoals(prev => [...prev, newGoal]);
        setNewGoal({ subject: '', target: 0, current: 0, unit: '小时' });
      }
    };

    const updateProgress = (index: number, value: number) => {
      const newGoals = [...goals];
      newGoals[index].current = Math.min(value, newGoals[index].target);
      setGoals(newGoals);
    };

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>添加学习目标</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
                type="text"
                placeholder="学习科目"
                value={newGoal.subject}
                onChange={(e) => setNewGoal(prev => ({ ...prev, subject: e.target.value }))}
                className="p-2 border border-border rounded-lg bg-background"
              />
              <input
                type="number"
                placeholder="目标数量"
                value={newGoal.target}
                onChange={(e) => setNewGoal(prev => ({ ...prev, target: Number(e.target.value) }))}
                className="p-2 border border-border rounded-lg bg-background"
              />
              <input
                type="number"
                placeholder="当前进度"
                value={newGoal.current}
                onChange={(e) => setNewGoal(prev => ({ ...prev, current: Number(e.target.value) }))}
                className="p-2 border border-border rounded-lg bg-background"
              />
              <select
                value={newGoal.unit}
                onChange={(e) => setNewGoal(prev => ({ ...prev, unit: e.target.value }))}
                className="p-2 border border-border rounded-lg bg-background"
              >
                <option value="小时">小时</option>
                <option value="天">天</option>
                <option value="题目">题目</option>
                <option value="页">页</option>
              </select>
            </div>
            <Button onClick={addGoal}>添加目标</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>学习进度</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {goals.map((goal, index) => {
              const progress = (goal.current / goal.target) * 100;
              return (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{goal.subject}</span>
                    <span className="text-sm text-muted-foreground">
                      {goal.current} / {goal.target} {goal.unit}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {progress.toFixed(1)}% 完成
                    </span>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateProgress(index, goal.current + 1)}
                      >
                        +1
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateProgress(index, goal.current + 5)}
                      >
                        +5
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    );
  };

  const tabs: Tab[] = [
    { key: 'flashcard', name: '闪卡学习', icon: BookOpen },
    { key: 'pomodoro', name: '番茄钟', icon: Timer },
    { key: 'quiz', name: '小测验', icon: Brain },
    { key: 'progress', name: '学习进度', icon: Target },
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
          <BookOpen className="h-8 w-8" />
          学习工具集
        </h1>
        <p className="text-muted-foreground mt-2">
          提高学习效率的工具，包括闪卡记忆、番茄钟、测验和进度跟踪
        </p>
      </div>

      {/* 功能标签页 */}
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

      {/* 内容区域 */}
      {activeTab === 'flashcard' && <FlashcardTool />}
      {activeTab === 'pomodoro' && <PomodoroTimer />}
      {activeTab === 'quiz' && <QuizTool />}
      {activeTab === 'progress' && <ProgressTracker />}

      {/* 使用说明 */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>使用说明</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">功能介绍</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• <strong>闪卡学习</strong>：创建和使用闪卡进行记忆训练</li>
              <li>• <strong>番茄钟</strong>：使用番茄工作法提高专注力</li>
              <li>• <strong>小测验</strong>：创建测验检验学习效果</li>
              <li>• <strong>学习进度</strong>：跟踪和管理学习目标</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">学习建议</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• 使用闪卡进行重复记忆，提高记忆效果</li>
              <li>• 番茄钟帮助保持专注，避免疲劳</li>
              <li>• 定期进行测验，检验学习成果</li>
              <li>• 设定明确的学习目标并跟踪进度</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}