'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Plus, Search, Edit, Trash2, Save, FileText, Tag, Download } from 'lucide-react';
import Link from 'next/link';

interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  category: string;
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [editForm, setEditForm] = useState({
    title: '',
    content: '',
    tags: '',
    category: '',
  });

  // 从本地存储加载笔记
  useEffect(() => {
    const saved = localStorage.getItem('notes');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setNotes(
          parsed.map((note: any) => ({
            ...note,
            createdAt: new Date(note.createdAt),
            updatedAt: new Date(note.updatedAt),
          }))
        );
      } catch (err) {
        console.error('加载笔记失败:', err);
      }
    }
  }, []);

  // 保存到本地存储
  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  // 创建新笔记
  const createNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: '新笔记',
      content: '',
      tags: [],
      category: '默认',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setNotes(prev => [newNote, ...prev]);
    setSelectedNote(newNote);
    setEditForm({
      title: newNote.title,
      content: newNote.content,
      tags: newNote.tags.join(', '),
      category: newNote.category,
    });
    setIsEditing(true);
  };

  // 选择笔记
  const selectNote = (note: Note) => {
    if (isEditing) {
      saveNote();
    }
    setSelectedNote(note);
    setEditForm({
      title: note.title,
      content: note.content,
      tags: note.tags.join(', '),
      category: note.category,
    });
    setIsEditing(false);
  };

  // 保存笔记
  const saveNote = () => {
    if (!selectedNote) return;

    const tags = editForm.tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    const updatedNote: Note = {
      ...selectedNote,
      title: editForm.title.trim() || '无标题',
      content: editForm.content,
      tags,
      category: editForm.category.trim() || '默认',
      updatedAt: new Date(),
    };

    setNotes(prev => prev.map(note => (note.id === selectedNote.id ? updatedNote : note)));
    setSelectedNote(updatedNote);
    setIsEditing(false);
  };

  // 删除笔记
  const deleteNote = (id: string) => {
    if (confirm('确定要删除这个笔记吗？')) {
      setNotes(prev => prev.filter(note => note.id !== id));
      if (selectedNote?.id === id) {
        setSelectedNote(null);
        setIsEditing(false);
      }
    }
  };

  // 导出笔记
  const exportNote = (note: Note) => {
    const content = `# ${note.title}

**分类**: ${note.category}
**标签**: ${note.tags.join(', ')}
**创建时间**: ${note.createdAt.toLocaleString('zh-CN')}
**更新时间**: ${note.updatedAt.toLocaleString('zh-CN')}

---

${note.content}`;

    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${note.title}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // 导出所有笔记
  const exportAllNotes = () => {
    const content = notes
      .map(
        note => `# ${note.title}

**分类**: ${note.category}
**标签**: ${note.tags.join(', ')}
**创建时间**: ${note.createdAt.toISOString().replace('T', ' ').split('.')[0]}
**更新时间**: ${note.updatedAt.toISOString().replace('T', ' ').split('.')[0]}

---

${note.content}

---

`
      )
      .join('\n\n');

    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `所有笔记_${new Date().toISOString().split('T')[0]}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // 获取所有分类
  const categories = [...new Set(notes.map(note => note.category))];

  // 获取所有标签
  const allTags = [...new Set(notes.flatMap(note => note.tags))];

  // 过滤笔记
  const filteredNotes = notes.filter(note => {
    const matchesSearch =
      !searchTerm ||
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = !selectedCategory || note.category === selectedCategory;
    const matchesTag = !selectedTag || note.tags.includes(selectedTag);

    return matchesSearch && matchesCategory && matchesTag;
  });

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
          <FileText className="h-8 w-8" />
          笔记工具
        </h1>
        <p className="text-muted-foreground mt-2">创建、编辑和管理您的笔记，支持标签和分类</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* 侧边栏 */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>笔记列表</span>
                <div className="flex gap-1">
                  <Button onClick={createNote} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                  {notes.length > 0 && (
                    <Button onClick={exportAllNotes} variant="outline" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 搜索 */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="搜索笔记..."
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* 分类过滤 */}
              {categories.length > 0 && (
                <div>
                  <label className="block text-sm font-medium mb-2">分类</label>
                  <select
                    value={selectedCategory}
                    onChange={e => setSelectedCategory(e.target.value)}
                    className="w-full p-2 border border-border rounded-lg bg-background text-sm"
                  >
                    <option value="">所有分类</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* 标签过滤 */}
              {allTags.length > 0 && (
                <div>
                  <label className="block text-sm font-medium mb-2">标签</label>
                  <select
                    value={selectedTag}
                    onChange={e => setSelectedTag(e.target.value)}
                    className="w-full p-2 border border-border rounded-lg bg-background text-sm"
                  >
                    <option value="">所有标签</option>
                    {allTags.map(tag => (
                      <option key={tag} value={tag}>
                        {tag}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* 笔记列表 */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredNotes.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    {notes.length === 0 ? '暂无笔记' : '没有匹配的笔记'}
                  </div>
                ) : (
                  filteredNotes.map(note => (
                    <div
                      key={note.id}
                      onClick={() => selectNote(note)}
                      className={`p-3 border border-border rounded-lg cursor-pointer hover:bg-muted/50 ${
                        selectedNote?.id === note.id ? 'bg-muted border-primary' : 'bg-background'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm truncate">{note.title}</h3>
                          <p className="text-xs text-muted-foreground mt-1">
                            {note.updatedAt.toLocaleDateString('zh-CN')}
                          </p>
                          {note.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {note.tags.slice(0, 2).map(tag => (
                                <span
                                  key={tag}
                                  className="px-1 py-0.5 bg-blue-50 text-blue-600 rounded text-xs"
                                >
                                  {tag}
                                </span>
                              ))}
                              {note.tags.length > 2 && (
                                <span className="text-xs text-muted-foreground">
                                  +{note.tags.length - 2}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={e => {
                            e.stopPropagation();
                            deleteNote(note.id);
                          }}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 主编辑区域 */}
        <div className="lg:col-span-3">
          {!selectedNote ? (
            <Card>
              <CardContent className="p-12 text-center">
                <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">选择或创建笔记</h3>
                <p className="text-muted-foreground mb-4">
                  从左侧列表选择一个笔记，或创建新的笔记开始编写
                </p>
                <Button onClick={createNote} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  创建新笔记
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.title}
                        onChange={e => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                        className="text-lg font-semibold bg-transparent border-none outline-none focus:ring-0"
                        placeholder="笔记标题"
                      />
                    ) : (
                      <h2 className="text-lg font-semibold">{selectedNote.title}</h2>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {isEditing ? (
                      <Button onClick={saveNote} className="flex items-center gap-2">
                        <Save className="h-4 w-4" />
                        保存
                      </Button>
                    ) : (
                      <>
                        <Button
                          onClick={() => setIsEditing(true)}
                          variant="outline"
                          className="flex items-center gap-2"
                        >
                          <Edit className="h-4 w-4" />
                          编辑
                        </Button>
                        <Button
                          onClick={() => exportNote(selectedNote)}
                          variant="outline"
                          className="flex items-center gap-2"
                        >
                          <Download className="h-4 w-4" />
                          导出
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {/* 元信息 */}
                {isEditing ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">分类</label>
                      <input
                        type="text"
                        value={editForm.category}
                        onChange={e => setEditForm(prev => ({ ...prev, category: e.target.value }))}
                        placeholder="笔记分类"
                        className="w-full p-2 border border-border rounded bg-background text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">标签 (用逗号分隔)</label>
                      <input
                        type="text"
                        value={editForm.tags}
                        onChange={e => setEditForm(prev => ({ ...prev, tags: e.target.value }))}
                        placeholder="标签1, 标签2, 标签3"
                        className="w-full p-2 border border-border rounded bg-background text-sm"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                    <span>分类: {selectedNote.category}</span>
                    <span>创建: {selectedNote.createdAt.toLocaleString('zh-CN')}</span>
                    <span>更新: {selectedNote.updatedAt.toLocaleString('zh-CN')}</span>
                    {selectedNote.tags.length > 0 && (
                      <div className="flex items-center gap-1">
                        <Tag className="h-3 w-3" />
                        {selectedNote.tags.map(tag => (
                          <span
                            key={tag}
                            className="px-1 py-0.5 bg-blue-50 text-blue-600 rounded text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <textarea
                    value={editForm.content}
                    onChange={e => setEditForm(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="开始编写您的笔记..."
                    className="w-full h-96 p-4 border border-border rounded-lg bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                ) : (
                  <div className="prose prose-sm max-w-none">
                    {selectedNote.content ? (
                      <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                        {selectedNote.content}
                      </pre>
                    ) : (
                      <div className="text-center py-12 text-muted-foreground">
                        <p>这个笔记还没有内容</p>
                        <Button
                          onClick={() => setIsEditing(true)}
                          variant="outline"
                          className="mt-4"
                        >
                          开始编写
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
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
              <li>• 创建、编辑、删除笔记</li>
              <li>• 支持分类和标签管理</li>
              <li>• 全文搜索功能</li>
              <li>• 导出单个或所有笔记为 Markdown 格式</li>
              <li>• 数据自动保存到本地</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">使用技巧</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• 使用有意义的标题便于查找</li>
              <li>• 合理使用分类和标签组织笔记</li>
              <li>• 定期导出重要笔记作为备份</li>
              <li>• 使用搜索功能快速找到需要的内容</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
