'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, FileText, Calculator, Calendar, Clock, Copy, Check } from 'lucide-react';
import Link from 'next/link';

export default function OfficeToolkitPage() {
  const [activeTab, setActiveTab] = useState<'invoice' | 'expense' | 'meeting' | 'schedule'>('invoice');
  const [copied, setCopied] = useState<string | null>(null);

  // 复制内容
  const copyContent = async (content: string, id: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  // 发票生成器
  const InvoiceGenerator = () => {
    const [invoiceData, setInvoiceData] = useState({
      invoiceNumber: 'INV-' + Date.now().toString().slice(-6),
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      company: '我的公司',
      clientName: '客户名称',
      clientAddress: '客户地址',
      items: [
        { description: '服务项目1', quantity: 1, price: 1000, total: 1000 }
      ]
    });

    const addItem = () => {
      setInvoiceData(prev => ({
        ...prev,
        items: [...prev.items, { description: '', quantity: 1, price: 0, total: 0 }]
      }));
    };

    const updateItem = (index: number, field: string, value: any) => {
      const newItems = [...invoiceData.items];
      newItems[index] = { ...newItems[index], [field]: value };
      if (field === 'quantity' || field === 'price') {
        newItems[index].total = newItems[index].quantity * newItems[index].price;
      }
      setInvoiceData(prev => ({ ...prev, items: newItems }));
    };

    const totalAmount = invoiceData.items.reduce((sum, item) => sum + item.total, 0);

    const generateInvoiceText = () => {
      return `发票

发票号: ${invoiceData.invoiceNumber}
开票日期: ${invoiceData.date}
付款期限: ${invoiceData.dueDate}

开票方: ${invoiceData.company}
收票方: ${invoiceData.clientName}
地址: ${invoiceData.clientAddress}

项目明细:
${invoiceData.items.map((item, index) => 
  `${index + 1}. ${item.description} - 数量: ${item.quantity} - 单价: ¥${item.price} - 小计: ¥${item.total}`
).join('\n')}

总计: ¥${totalAmount}

感谢您的业务！`;
    };

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>发票信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">发票号</label>
                <input
                  type="text"
                  value={invoiceData.invoiceNumber}
                  onChange={(e) => setInvoiceData(prev => ({ ...prev, invoiceNumber: e.target.value }))}
                  className="w-full p-2 border border-border rounded-lg bg-background"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">开票日期</label>
                <input
                  type="date"
                  value={invoiceData.date}
                  onChange={(e) => setInvoiceData(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full p-2 border border-border rounded-lg bg-background"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">付款期限</label>
                <input
                  type="date"
                  value={invoiceData.dueDate}
                  onChange={(e) => setInvoiceData(prev => ({ ...prev, dueDate: e.target.value }))}
                  className="w-full p-2 border border-border rounded-lg bg-background"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">开票方</label>
                <input
                  type="text"
                  value={invoiceData.company}
                  onChange={(e) => setInvoiceData(prev => ({ ...prev, company: e.target.value }))}
                  className="w-full p-2 border border-border rounded-lg bg-background"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">收票方</label>
                <input
                  type="text"
                  value={invoiceData.clientName}
                  onChange={(e) => setInvoiceData(prev => ({ ...prev, clientName: e.target.value }))}
                  className="w-full p-2 border border-border rounded-lg bg-background"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">客户地址</label>
              <input
                type="text"
                value={invoiceData.clientAddress}
                onChange={(e) => setInvoiceData(prev => ({ ...prev, clientAddress: e.target.value }))}
                className="w-full p-2 border border-border rounded-lg bg-background"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              项目明细
              <Button onClick={addItem} size="sm">添加项目</Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {invoiceData.items.map((item, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-2 p-3 border border-border rounded-lg">
                  <input
                    type="text"
                    placeholder="项目描述"
                    value={item.description}
                    onChange={(e) => updateItem(index, 'description', e.target.value)}
                    className="md:col-span-2 p-2 border border-border rounded bg-background"
                  />
                  <input
                    type="number"
                    placeholder="数量"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, 'quantity', Number(e.target.value))}
                    className="p-2 border border-border rounded bg-background"
                  />
                  <input
                    type="number"
                    placeholder="单价"
                    value={item.price}
                    onChange={(e) => updateItem(index, 'price', Number(e.target.value))}
                    className="p-2 border border-border rounded bg-background"
                  />
                  <div className="p-2 bg-muted rounded text-center font-mono">
                    ¥{item.total}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 text-right">
              <div className="text-lg font-bold">总计: ¥{totalAmount}</div>
            </div>

            <div className="mt-4">
              <Button
                onClick={() => copyContent(generateInvoiceText(), 'invoice')}
                className="flex items-center gap-2"
              >
                {copied === 'invoice' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied === 'invoice' ? '已复制' : '复制发票'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // 费用报销计算器
  const ExpenseCalculator = () => {
    const [expenses, setExpenses] = useState([
      { category: '交通费', amount: 0, description: '' },
      { category: '餐饮费', amount: 0, description: '' },
      { category: '住宿费', amount: 0, description: '' },
      { category: '其他', amount: 0, description: '' }
    ]);

    const updateExpense = (index: number, field: string, value: any) => {
      const newExpenses = [...expenses];
      newExpenses[index] = { ...newExpenses[index], [field]: value };
      setExpenses(newExpenses);
    };

    const addExpense = () => {
      setExpenses(prev => [...prev, { category: '其他', amount: 0, description: '' }]);
    };

    const totalExpense = expenses.reduce((sum, expense) => sum + expense.amount, 0);

    const generateExpenseReport = () => {
      return `费用报销单

报销日期: ${new Date().toISOString().split('T')[0]}

费用明细:
${expenses.map((expense, index) => 
  `${index + 1}. ${expense.category}: ¥${expense.amount} - ${expense.description}`
).join('\n')}

总计: ¥${totalExpense}

申请人: ___________
部门: ___________
日期: ___________`;
    };

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            费用报销计算器
            <Button onClick={addExpense} size="sm">添加费用</Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {expenses.map((expense, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-2 p-3 border border-border rounded-lg">
              <input
                type="text"
                placeholder="费用类别"
                value={expense.category}
                onChange={(e) => updateExpense(index, 'category', e.target.value)}
                className="p-2 border border-border rounded bg-background"
              />
              <input
                type="number"
                placeholder="金额"
                value={expense.amount}
                onChange={(e) => updateExpense(index, 'amount', Number(e.target.value))}
                className="p-2 border border-border rounded bg-background"
              />
              <input
                type="text"
                placeholder="说明"
                value={expense.description}
                onChange={(e) => updateExpense(index, 'description', e.target.value)}
                className="p-2 border border-border rounded bg-background"
              />
            </div>
          ))}

          <div className="text-right">
            <div className="text-lg font-bold">总计: ¥{totalExpense}</div>
          </div>

          <Button
            onClick={() => copyContent(generateExpenseReport(), 'expense')}
            className="flex items-center gap-2"
          >
            {copied === 'expense' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied === 'expense' ? '已复制' : '复制报销单'}
          </Button>
        </CardContent>
      </Card>
    );
  };

  // 会议记录模板
  const MeetingNotes = () => {
    const [meetingData, setMeetingData] = useState({
      title: '',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().slice(0, 5),
      attendees: '',
      agenda: '',
      notes: '',
      actionItems: ''
    });

    const generateMeetingNotes = () => {
      return `会议记录

会议主题: ${meetingData.title}
日期: ${meetingData.date}
时间: ${meetingData.time}
参会人员: ${meetingData.attendees}

会议议程:
${meetingData.agenda}

会议记录:
${meetingData.notes}

行动项目:
${meetingData.actionItems}

记录人: ___________
日期: ${new Date().toISOString().split('T')[0]}`;
    };

    return (
      <Card>
        <CardHeader>
          <CardTitle>会议记录</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">会议主题</label>
              <input
                type="text"
                value={meetingData.title}
                onChange={(e) => setMeetingData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full p-2 border border-border rounded-lg bg-background"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">日期</label>
              <input
                type="date"
                value={meetingData.date}
                onChange={(e) => setMeetingData(prev => ({ ...prev, date: e.target.value }))}
                className="w-full p-2 border border-border rounded-lg bg-background"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">时间</label>
              <input
                type="time"
                value={meetingData.time}
                onChange={(e) => setMeetingData(prev => ({ ...prev, time: e.target.value }))}
                className="w-full p-2 border border-border rounded-lg bg-background"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">参会人员</label>
            <input
              type="text"
              value={meetingData.attendees}
              onChange={(e) => setMeetingData(prev => ({ ...prev, attendees: e.target.value }))}
              placeholder="用逗号分隔多个人员"
              className="w-full p-2 border border-border rounded-lg bg-background"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">会议议程</label>
            <textarea
              value={meetingData.agenda}
              onChange={(e) => setMeetingData(prev => ({ ...prev, agenda: e.target.value }))}
              rows={3}
              className="w-full p-2 border border-border rounded-lg bg-background resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">会议记录</label>
            <textarea
              value={meetingData.notes}
              onChange={(e) => setMeetingData(prev => ({ ...prev, notes: e.target.value }))}
              rows={5}
              className="w-full p-2 border border-border rounded-lg bg-background resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">行动项目</label>
            <textarea
              value={meetingData.actionItems}
              onChange={(e) => setMeetingData(prev => ({ ...prev, actionItems: e.target.value }))}
              rows={3}
              className="w-full p-2 border border-border rounded-lg bg-background resize-none"
            />
          </div>

          <Button
            onClick={() => copyContent(generateMeetingNotes(), 'meeting')}
            className="flex items-center gap-2"
          >
            {copied === 'meeting' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied === 'meeting' ? '已复制' : '复制会议记录'}
          </Button>
        </CardContent>
      </Card>
    );
  };

  // 工作计划表
  const WorkSchedule = () => {
    const [tasks, setTasks] = useState([
      { time: '09:00', task: '', priority: 'medium' },
      { time: '10:00', task: '', priority: 'medium' },
      { time: '11:00', task: '', priority: 'medium' },
      { time: '14:00', task: '', priority: 'medium' },
      { time: '15:00', task: '', priority: 'medium' },
      { time: '16:00', task: '', priority: 'medium' }
    ]);

    const updateTask = (index: number, field: string, value: string) => {
      const newTasks = [...tasks];
      newTasks[index] = { ...newTasks[index], [field]: value };
      setTasks(newTasks);
    };

    const addTask = () => {
      setTasks(prev => [...prev, { time: '', task: '', priority: 'medium' }]);
    };

    const generateSchedule = () => {
      return `工作计划表

日期: ${new Date().toISOString().split('T')[0]}

时间安排:
${tasks.map((task, index) => 
  `${task.time} - ${task.task} [${task.priority === 'high' ? '高优先级' : task.priority === 'medium' ? '中优先级' : '低优先级'}]`
).join('\n')}

备注:
- 高优先级任务请优先完成
- 预留时间处理突发事务
- 定期回顾和调整计划`;
    };

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            工作计划表
            <Button onClick={addTask} size="sm">添加任务</Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {tasks.map((task, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-2 p-3 border border-border rounded-lg">
              <input
                type="time"
                value={task.time}
                onChange={(e) => updateTask(index, 'time', e.target.value)}
                className="p-2 border border-border rounded bg-background"
              />
              <input
                type="text"
                placeholder="任务内容"
                value={task.task}
                onChange={(e) => updateTask(index, 'task', e.target.value)}
                className="md:col-span-2 p-2 border border-border rounded bg-background"
              />
              <select
                value={task.priority}
                onChange={(e) => updateTask(index, 'priority', e.target.value)}
                className="p-2 border border-border rounded bg-background"
              >
                <option value="low">低优先级</option>
                <option value="medium">中优先级</option>
                <option value="high">高优先级</option>
              </select>
            </div>
          ))}

          <Button
            onClick={() => copyContent(generateSchedule(), 'schedule')}
            className="flex items-center gap-2"
          >
            {copied === 'schedule' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied === 'schedule' ? '已复制' : '复制计划表'}
          </Button>
        </CardContent>
      </Card>
    );
  };

  const tabs = [
    { key: 'invoice', name: '发票生成', icon: FileText },
    { key: 'expense', name: '费用报销', icon: Calculator },
    { key: 'meeting', name: '会议记录', icon: Calendar },
    { key: 'schedule', name: '工作计划', icon: Clock },
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
          <FileText className="h-8 w-8" />
          办公效率工具集
        </h1>
        <p className="text-muted-foreground mt-2">
          提高办公效率的实用工具，包括发票生成、费用计算、会议记录等
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

      {/* 内容区域 */}
      {activeTab === 'invoice' && <InvoiceGenerator />}
      {activeTab === 'expense' && <ExpenseCalculator />}
      {activeTab === 'meeting' && <MeetingNotes />}
      {activeTab === 'schedule' && <WorkSchedule />}

      {/* 使用说明 */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>使用说明</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">功能介绍</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• <strong>发票生成</strong>：快速生成标准格式的发票</li>
              <li>• <strong>费用报销</strong>：计算和整理费用报销单</li>
              <li>• <strong>会议记录</strong>：标准化的会议记录模板</li>
              <li>• <strong>工作计划</strong>：日程安排和任务管理</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">使用技巧</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• 填写完信息后点击复制按钮获取格式化文本</li>
              <li>• 可以将复制的内容粘贴到文档或邮件中</li>
              <li>• 建议保存常用的模板信息以提高效率</li>
              <li>• 根据实际需要调整和完善生成的内容</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
