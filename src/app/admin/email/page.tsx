'use client';

import React, { useState } from 'react';
import { AdminLayout } from '@/components/layout/admin-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Mail, 
  Plus, 
  Settings, 
  Inbox, 
  Send, 
  Archive,
  Star,
  Reply,
  Forward,
  Trash2
} from 'lucide-react';

// 模拟邮件数据
const mockEmails = [
  {
    id: '1',
    from: 'user@example.com',
    subject: '关于网站合作的询问',
    preview: '您好，我对您的网站很感兴趣，希望能够进行合作...',
    date: '2024-01-15 14:30',
    isRead: false,
    isStarred: true,
    account: 'admin@iflux.art'
  },
  {
    id: '2',
    from: 'support@service.com',
    subject: '系统维护通知',
    preview: '我们将在本周末进行系统维护，预计维护时间为...',
    date: '2024-01-15 10:15',
    isRead: true,
    isStarred: false,
    account: 'admin@iflux.art'
  },
  {
    id: '3',
    from: 'newsletter@tech.com',
    subject: '技术周报 - 第52期',
    preview: '本周技术要闻：React 19 发布，Next.js 新特性...',
    date: '2024-01-14 09:00',
    isRead: true,
    isStarred: false,
    account: 'tech@iflux.art'
  }
];

// 模拟邮箱账户
const mockAccounts = [
  {
    id: '1',
    email: 'admin@iflux.art',
    name: '主邮箱',
    type: 'IMAP',
    unreadCount: 5
  },
  {
    id: '2',
    email: 'tech@iflux.art',
    name: '技术邮箱',
    type: 'POP3',
    unreadCount: 2
  }
];

export default function EmailAdminPage() {
  const [selectedAccount, setSelectedAccount] = useState('all');
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [showCompose, setShowCompose] = useState(false);

  const filteredEmails = selectedAccount === 'all' 
    ? mockEmails 
    : mockEmails.filter(email => email.account === selectedAccount);

  const selectedEmailData = mockEmails.find(email => email.id === selectedEmail);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* 页面标题 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Mail className="h-8 w-8" />
              邮箱管理
            </h1>
            <p className="text-muted-foreground mt-2">
              管理多个邮箱账户，统一收发邮件
            </p>
          </div>
          
          <div className="flex gap-2">
            <Dialog open={showAddAccount} onOpenChange={setShowAddAccount}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  添加邮箱
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>添加邮箱账户</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email">邮箱地址</Label>
                    <Input id="email" placeholder="example@domain.com" />
                  </div>
                  <div>
                    <Label htmlFor="password">密码</Label>
                    <Input id="password" type="password" placeholder="邮箱密码或应用密码" />
                  </div>
                  <div>
                    <Label htmlFor="protocol">协议类型</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="选择协议" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="imap">IMAP</SelectItem>
                        <SelectItem value="pop3">POP3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="server">服务器地址</Label>
                    <Input id="server" placeholder="imap.example.com" />
                  </div>
                  <div>
                    <Label htmlFor="port">端口</Label>
                    <Input id="port" placeholder="993" />
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button variant="outline" onClick={() => setShowAddAccount(false)} className="flex-1">
                      取消
                    </Button>
                    <Button className="flex-1">添加</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            
            <Dialog open={showCompose} onOpenChange={setShowCompose}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  写邮件
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>写邮件</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="to">收件人</Label>
                    <Input id="to" placeholder="recipient@example.com" />
                  </div>
                  <div>
                    <Label htmlFor="subject">主题</Label>
                    <Input id="subject" placeholder="邮件主题" />
                  </div>
                  <div>
                    <Label htmlFor="content">内容</Label>
                    <Textarea id="content" rows={10} placeholder="邮件内容..." />
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button variant="outline" onClick={() => setShowCompose(false)} className="flex-1">
                      取消
                    </Button>
                    <Button className="flex-1">
                      <Send className="h-4 w-4 mr-2" />
                      发送
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* 邮箱账户选择 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Inbox className="h-5 w-5" />
              邮箱账户
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button
                variant={selectedAccount === 'all' ? 'default' : 'outline'}
                onClick={() => setSelectedAccount('all')}
                className="rounded-full"
              >
                全部邮箱
                <Badge variant="secondary" className="ml-2">
                  {mockEmails.filter(e => !e.isRead).length}
                </Badge>
              </Button>
              {mockAccounts.map((account) => (
                <Button
                  key={account.id}
                  variant={selectedAccount === account.email ? 'default' : 'outline'}
                  onClick={() => setSelectedAccount(account.email)}
                  className="rounded-full"
                >
                  {account.name}
                  {account.unreadCount > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {account.unreadCount}
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 邮件列表和详情 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 邮件列表 */}
          <Card>
            <CardHeader>
              <CardTitle>邮件列表</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-0">
                {filteredEmails.map((email) => (
                  <div
                    key={email.id}
                    className={`p-4 border-b cursor-pointer hover:bg-accent transition-colors ${
                      selectedEmail === email.id ? 'bg-accent' : ''
                    } ${!email.isRead ? 'font-semibold' : ''}`}
                    onClick={() => setSelectedEmail(email.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {email.isStarred && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                          <span className="text-sm font-medium truncate">{email.from}</span>
                          {!email.isRead && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                        </div>
                        <h4 className="text-sm font-medium truncate mb-1">{email.subject}</h4>
                        <p className="text-xs text-muted-foreground truncate">{email.preview}</p>
                      </div>
                      <div className="text-xs text-muted-foreground ml-2">
                        {email.date.split(' ')[1]}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 邮件详情 */}
          <Card>
            <CardHeader>
              <CardTitle>邮件详情</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedEmailData ? (
                <div className="space-y-4">
                  <div className="border-b pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold">{selectedEmailData.subject}</h3>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm">
                          <Reply className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Forward className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Archive className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p>发件人: {selectedEmailData.from}</p>
                      <p>收件人: {selectedEmailData.account}</p>
                      <p>时间: {selectedEmailData.date}</p>
                    </div>
                  </div>
                  <div className="prose prose-sm max-w-none">
                    <p>{selectedEmailData.preview}</p>
                    <p>这是邮件的完整内容。在实际应用中，这里会显示邮件的完整HTML或纯文本内容。</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>选择一封邮件查看详情</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
