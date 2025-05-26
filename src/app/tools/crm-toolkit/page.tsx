'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Users, Phone, Mail, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function CRMToolkitPage() {
  const [activeTab, setActiveTab] = useState<'contacts' | 'follow' | 'template' | 'analysis'>('contacts');

  // 客户信息管理
  const ContactManager = () => {
    const [contacts, setContacts] = useState([
      { id: 1, name: '张三', phone: '13800138000', email: 'zhang@example.com', status: 'active', value: 5000 },
      { id: 2, name: '李四', phone: '13900139000', email: 'li@example.com', status: 'potential', value: 3000 }
    ]);
    const [newContact, setNewContact] = useState({ name: '', phone: '', email: '', value: 0 });

    const addContact = () => {
      if (newContact.name && newContact.phone) {
        setContacts([...contacts, { 
          id: Date.now(), 
          ...newContact, 
          status: 'potential' 
        }]);
        setNewContact({ name: '', phone: '', email: '', value: 0 });
      }
    };

    return (
      <Card>
        <CardHeader><CardTitle>客户信息管理</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              placeholder="客户姓名"
              value={newContact.name}
              onChange={(e) => setNewContact({...newContact, name: e.target.value})}
              className="p-3 border rounded-lg"
            />
            <input
              placeholder="联系电话"
              value={newContact.phone}
              onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
              className="p-3 border rounded-lg"
            />
            <input
              placeholder="邮箱地址"
              value={newContact.email}
              onChange={(e) => setNewContact({...newContact, email: e.target.value})}
              className="p-3 border rounded-lg"
            />
            <input
              type="number"
              placeholder="客户价值"
              value={newContact.value}
              onChange={(e) => setNewContact({...newContact, value: Number(e.target.value)})}
              className="p-3 border rounded-lg"
            />
          </div>
          <Button onClick={addContact} className="w-full">添加客户</Button>
          
          <div className="space-y-2">
            {contacts.map(contact => (
              <div key={contact.id} className="p-3 border rounded-lg flex justify-between items-center">
                <div>
                  <div className="font-medium">{contact.name}</div>
                  <div className="text-sm text-muted-foreground">{contact.phone} | {contact.email}</div>
                </div>
                <div className="text-right">
                  <div className={`text-xs px-2 py-1 rounded ${
                    contact.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {contact.status === 'active' ? '活跃' : '潜在'}
                  </div>
                  <div className="text-sm">¥{contact.value}</div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center">
              <div className="text-2xl font-bold">{contacts.length}</div>
              <div className="text-sm text-muted-foreground">总客户数</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{contacts.filter(c => c.status === 'active').length}</div>
              <div className="text-sm text-muted-foreground">活跃客户</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">¥{contacts.reduce((sum, c) => sum + c.value, 0)}</div>
              <div className="text-sm text-muted-foreground">总价值</div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // 跟进提醒
  const FollowUpReminder = () => {
    const [reminders, setReminders] = useState([
      { id: 1, client: '张三', task: '电话回访', date: '2024-01-15', priority: 'high' },
      { id: 2, client: '李四', task: '发送报价', date: '2024-01-16', priority: 'medium' }
    ]);
    const [newReminder, setNewReminder] = useState({ client: '', task: '', date: '', priority: 'medium' });

    const addReminder = () => {
      if (newReminder.client && newReminder.task && newReminder.date) {
        setReminders([...reminders, { id: Date.now(), ...newReminder }]);
        setNewReminder({ client: '', task: '', date: '', priority: 'medium' });
      }
    };

    return (
      <Card>
        <CardHeader><CardTitle>跟进提醒</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              placeholder="客户名称"
              value={newReminder.client}
              onChange={(e) => setNewReminder({...newReminder, client: e.target.value})}
              className="p-3 border rounded-lg"
            />
            <input
              placeholder="跟进任务"
              value={newReminder.task}
              onChange={(e) => setNewReminder({...newReminder, task: e.target.value})}
              className="p-3 border rounded-lg"
            />
            <input
              type="date"
              value={newReminder.date}
              onChange={(e) => setNewReminder({...newReminder, date: e.target.value})}
              className="p-3 border rounded-lg"
            />
            <select
              value={newReminder.priority}
              onChange={(e) => setNewReminder({...newReminder, priority: e.target.value})}
              className="p-3 border rounded-lg"
            >
              <option value="low">低优先级</option>
              <option value="medium">中优先级</option>
              <option value="high">高优先级</option>
            </select>
          </div>
          <Button onClick={addReminder} className="w-full">添加提醒</Button>
          
          <div className="space-y-2">
            {reminders.map(reminder => (
              <div key={reminder.id} className="p-3 border rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">{reminder.client}</div>
                    <div className="text-sm">{reminder.task}</div>
                    <div className="text-xs text-muted-foreground">{reminder.date}</div>
                  </div>
                  <div className={`text-xs px-2 py-1 rounded ${
                    reminder.priority === 'high' ? 'bg-red-100 text-red-800' :
                    reminder.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {reminder.priority === 'high' ? '高' : reminder.priority === 'medium' ? '中' : '低'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  // 沟通模板
  const CommunicationTemplate = () => {
    const [templateType, setTemplateType] = useState('greeting');
    const [customMessage, setCustomMessage] = useState('');
    const [templates] = useState({
      greeting: '您好！感谢您对我们产品的关注，我是您的专属顾问，有任何问题随时联系我。',
      follow: '您好，上次我们聊到的产品方案，您考虑得怎么样了？如有疑问欢迎随时沟通。',
      offer: '根据您的需求，我为您准备了专属优惠方案，详情请查看附件，期待您的回复。',
      thanks: '感谢您选择我们的产品！我们将为您提供优质的服务，有任何问题请及时联系。'
    });

    const generateMessage = () => {
      const template = templates[templateType as keyof typeof templates];
      setCustomMessage(template);
    };

    return (
      <Card>
        <CardHeader><CardTitle>沟通模板</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <select
            value={templateType}
            onChange={(e) => setTemplateType(e.target.value)}
            className="w-full p-3 border rounded-lg"
          >
            <option value="greeting">初次问候</option>
            <option value="follow">跟进沟通</option>
            <option value="offer">报价邀请</option>
            <option value="thanks">感谢话术</option>
          </select>
          
          <Button onClick={generateMessage} className="w-full">生成模板</Button>
          
          <div>
            <label className="block text-sm mb-2">消息内容</label>
            <textarea
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="在此编辑消息内容"
              className="w-full p-3 border rounded-lg h-32"
            />
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1">
              <Phone className="h-4 w-4 mr-2" />
              发送短信
            </Button>
            <Button variant="outline" className="flex-1">
              <Mail className="h-4 w-4 mr-2" />
              发送邮件
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  // 客户分析
  const CustomerAnalysis = () => {
    const mockData = {
      totalCustomers: 156,
      activeCustomers: 89,
      newThisMonth: 23,
      avgValue: 4500,
      segments: [
        { name: '高价值客户', count: 25, percentage: 16 },
        { name: '中价值客户', count: 78, percentage: 50 },
        { name: '低价值客户', count: 53, percentage: 34 }
      ],
      sources: [
        { name: '线上推广', count: 45, percentage: 29 },
        { name: '朋友推荐', count: 67, percentage: 43 },
        { name: '线下活动', count: 44, percentage: 28 }
      ]
    };

    return (
      <Card>
        <CardHeader><CardTitle>客户分析</CardTitle></CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{mockData.totalCustomers}</div>
              <div className="text-sm text-muted-foreground">总客户数</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{mockData.activeCustomers}</div>
              <div className="text-sm text-muted-foreground">活跃客户</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{mockData.newThisMonth}</div>
              <div className="text-sm text-muted-foreground">本月新增</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">¥{mockData.avgValue}</div>
              <div className="text-sm text-muted-foreground">平均价值</div>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-3">客户价值分布</h4>
            <div className="space-y-2">
              {mockData.segments.map((segment, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm">{segment.name}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${segment.percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium w-12">{segment.count}人</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-3">客户来源</h4>
            <div className="space-y-2">
              {mockData.sources.map((source, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm">{source.name}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${source.percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium w-12">{source.count}人</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const tabs = [
    { key: 'contacts', name: '客户管理', icon: Users },
    { key: 'follow', name: '跟进提醒', icon: Calendar },
    { key: 'template', name: '沟通模板', icon: Mail },
    { key: 'analysis', name: '客户分析', icon: Phone },
  ];

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
          <Users className="h-8 w-8" />
          客户管理工具
        </h1>
        <p className="text-muted-foreground mt-2">
          客户关系管理工具，包括客户信息、跟进提醒、沟通模板
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
                  onClick={() => setActiveTab(tab.key as any)}
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

      {activeTab === 'contacts' && <ContactManager />}
      {activeTab === 'follow' && <FollowUpReminder />}
      {activeTab === 'template' && <CommunicationTemplate />}
      {activeTab === 'analysis' && <CustomerAnalysis />}
    </div>
  );
}
