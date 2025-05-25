'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Plus, Check, Trash2, Edit, Calendar, Flag, Filter } from 'lucide-react';
import Link from 'next/link';

interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  category: string;
  dueDate: string;
  createdAt: Date;
  completedAt?: Date;
}

export default function TodoManagerPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState({
    title: '',
    description: '',
    priority: 'medium' as const,
    category: '',
    dueDate: ''
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  // 从本地存储加载数据
  useEffect(() => {
    const saved = localStorage.getItem('todos');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setTodos(parsed.map((todo: any) => ({
          ...todo,
          createdAt: new Date(todo.createdAt),
          completedAt: todo.completedAt ? new Date(todo.completedAt) : undefined
        })));
      } catch (err) {
        console.error('加载待办事项失败:', err);
      }
    }
  }, []);

  // 保存到本地存储
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  // 添加待办事项
  const addTodo = () => {
    if (!newTodo.title.trim()) return;

    const todo: Todo = {
      id: Date.now().toString(),
      title: newTodo.title.trim(),
      description: newTodo.description.trim(),
      completed: false,
      priority: newTodo.priority,
      category: newTodo.category.trim() || '默认',
      dueDate: newTodo.dueDate,
      createdAt: new Date()
    };

    setTodos(prev => [todo, ...prev]);
    setNewTodo({
      title: '',
      description: '',
      priority: 'medium',
      category: '',
      dueDate: ''
    });
  };

  // 切换完成状态
  const toggleTodo = (id: string) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id 
        ? { 
            ...todo, 
            completed: !todo.completed,
            completedAt: !todo.completed ? new Date() : undefined
          }
        : todo
    ));
  };

  // 删除待办事项
  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  // 编辑待办事项
  const editTodo = (id: string, updates: Partial<Todo>) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id ? { ...todo, ...updates } : todo
    ));
    setEditingId(null);
  };

  // 清空已完成
  const clearCompleted = () => {
    setTodos(prev => prev.filter(todo => !todo.completed));
  };

  // 获取所有分类
  const categories = [...new Set(todos.map(todo => todo.category))];

  // 过滤待办事项
  const filteredTodos = todos.filter(todo => {
    if (filter === 'active' && todo.completed) return false;
    if (filter === 'completed' && !todo.completed) return false;
    if (categoryFilter && todo.category !== categoryFilter) return false;
    if (priorityFilter && todo.priority !== priorityFilter) return false;
    return true;
  });

  // 统计信息
  const stats = {
    total: todos.length,
    active: todos.filter(t => !t.completed).length,
    completed: todos.filter(t => t.completed).length,
    overdue: todos.filter(t => !t.completed && t.dueDate && new Date(t.dueDate) < new Date()).length
  };

  // 获取优先级颜色
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  // 检查是否过期
  const isOverdue = (dueDate: string) => {
    return dueDate && new Date(dueDate) < new Date();
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
          <Check className="h-8 w-8" />
          待办事项管理
        </h1>
        <p className="text-muted-foreground mt-2">
          管理您的任务和待办事项，提高工作效率
        </p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-sm text-muted-foreground">总计</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.active}</div>
            <div className="text-sm text-muted-foreground">进行中</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <div className="text-sm text-muted-foreground">已完成</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
            <div className="text-sm text-muted-foreground">已过期</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 添加待办事项 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              添加待办事项
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">标题</label>
              <input
                type="text"
                value={newTodo.title}
                onChange={(e) => setNewTodo(prev => ({ ...prev, title: e.target.value }))}
                placeholder="输入待办事项标题..."
                className="w-full p-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && addTodo()}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">描述</label>
              <textarea
                value={newTodo.description}
                onChange={(e) => setNewTodo(prev => ({ ...prev, description: e.target.value }))}
                placeholder="详细描述..."
                className="w-full h-20 p-3 border border-border rounded-lg bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">优先级</label>
                <select
                  value={newTodo.priority}
                  onChange={(e) => setNewTodo(prev => ({ ...prev, priority: e.target.value as any }))}
                  className="w-full p-2 border border-border rounded-lg bg-background"
                >
                  <option value="low">低</option>
                  <option value="medium">中</option>
                  <option value="high">高</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">分类</label>
                <input
                  type="text"
                  value={newTodo.category}
                  onChange={(e) => setNewTodo(prev => ({ ...prev, category: e.target.value }))}
                  placeholder="工作、生活..."
                  className="w-full p-2 border border-border rounded-lg bg-background"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">截止日期</label>
              <input
                type="date"
                value={newTodo.dueDate}
                onChange={(e) => setNewTodo(prev => ({ ...prev, dueDate: e.target.value }))}
                className="w-full p-2 border border-border rounded-lg bg-background"
              />
            </div>

            <Button onClick={addTodo} className="w-full" disabled={!newTodo.title.trim()}>
              添加待办事项
            </Button>
          </CardContent>
        </Card>

        {/* 待办事项列表 */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  待办事项列表
                </div>
                {stats.completed > 0 && (
                  <Button onClick={clearCompleted} variant="outline" size="sm">
                    清空已完成
                  </Button>
                )}
              </CardTitle>
              
              {/* 过滤器 */}
              <div className="flex flex-wrap gap-2">
                <div className="flex gap-1">
                  {['all', 'active', 'completed'].map((f) => (
                    <Button
                      key={f}
                      variant={filter === f ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilter(f as any)}
                    >
                      {f === 'all' ? '全部' : f === 'active' ? '进行中' : '已完成'}
                    </Button>
                  ))}
                </div>

                {categories.length > 0 && (
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="px-2 py-1 border border-border rounded text-sm bg-background"
                  >
                    <option value="">所有分类</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                )}

                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="px-2 py-1 border border-border rounded text-sm bg-background"
                >
                  <option value="">所有优先级</option>
                  <option value="high">高优先级</option>
                  <option value="medium">中优先级</option>
                  <option value="low">低优先级</option>
                </select>
              </div>
            </CardHeader>
            <CardContent>
              {filteredTodos.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {filter === 'all' ? '暂无待办事项' : 
                   filter === 'active' ? '暂无进行中的事项' : '暂无已完成的事项'}
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {filteredTodos.map((todo) => (
                    <div
                      key={todo.id}
                      className={`p-4 border border-border rounded-lg ${
                        todo.completed ? 'bg-muted/50' : 'bg-background'
                      } ${isOverdue(todo.dueDate) && !todo.completed ? 'border-red-200 bg-red-50' : ''}`}
                    >
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => toggleTodo(todo.id)}
                          className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center ${
                            todo.completed 
                              ? 'bg-green-500 border-green-500 text-white' 
                              : 'border-gray-300 hover:border-green-500'
                          }`}
                        >
                          {todo.completed && <Check className="h-3 w-3" />}
                        </button>

                        <div className="flex-1">
                          {editingId === todo.id ? (
                            <div className="space-y-2">
                              <input
                                type="text"
                                defaultValue={todo.title}
                                onBlur={(e) => editTodo(todo.id, { title: e.target.value })}
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    editTodo(todo.id, { title: e.currentTarget.value });
                                  }
                                }}
                                className="w-full p-2 border border-border rounded bg-background"
                                autoFocus
                              />
                            </div>
                          ) : (
                            <>
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className={`font-medium ${todo.completed ? 'line-through text-muted-foreground' : ''}`}>
                                  {todo.title}
                                </h3>
                                <span className={`px-2 py-1 rounded text-xs ${getPriorityColor(todo.priority)}`}>
                                  {todo.priority === 'high' ? '高' : todo.priority === 'medium' ? '中' : '低'}
                                </span>
                                <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs">
                                  {todo.category}
                                </span>
                              </div>
                              
                              {todo.description && (
                                <p className={`text-sm mb-2 ${todo.completed ? 'line-through text-muted-foreground' : 'text-muted-foreground'}`}>
                                  {todo.description}
                                </p>
                              )}

                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                {todo.dueDate && (
                                  <div className={`flex items-center gap-1 ${isOverdue(todo.dueDate) && !todo.completed ? 'text-red-600' : ''}`}>
                                    <Calendar className="h-3 w-3" />
                                    {new Date(todo.dueDate).toLocaleDateString('zh-CN')}
                                    {isOverdue(todo.dueDate) && !todo.completed && ' (已过期)'}
                                  </div>
                                )}
                                <div>
                                  创建: {todo.createdAt.toLocaleDateString('zh-CN')}
                                </div>
                                {todo.completedAt && (
                                  <div>
                                    完成: {todo.completedAt.toLocaleDateString('zh-CN')}
                                  </div>
                                )}
                              </div>
                            </>
                          )}
                        </div>

                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingId(editingId === todo.id ? null : todo.id)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteTodo(todo.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 使用说明 */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>使用说明</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">功能特点</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• 添加、编辑、删除待办事项</li>
              <li>• 设置优先级和分类</li>
              <li>• 设置截止日期，自动提醒过期</li>
              <li>• 多种过滤和排序方式</li>
              <li>• 数据自动保存到本地</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">优先级说明</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• <span className="text-red-600">高优先级</span>：紧急重要的任务</li>
              <li>• <span className="text-yellow-600">中优先级</span>：一般重要的任务</li>
              <li>• <span className="text-green-600">低优先级</span>：不紧急的任务</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">使用技巧</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• 使用分类来组织不同类型的任务</li>
              <li>• 设置合理的截止日期避免拖延</li>
              <li>• 定期清理已完成的任务</li>
              <li>• 优先处理高优先级和即将过期的任务</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
