'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { User, Lock } from 'lucide-react';

interface LoginDialogProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function LoginDialog({ children, open, onOpenChange }: LoginDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // 使用外部控制的open状态或内部状态
  const isOpen = open !== undefined ? open : internalOpen;
  const setIsOpen = onOpenChange || setInternalOpen;

  const handleUsernameSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;

    setIsLoading(true);
    setError('');

    try {
      // 临时硬编码的用户名密码验证
      if (username === 'ifa2025' && password === 'Hogyoku2025') {
        // 模拟登录成功，设置本地存储
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('loginTime', Date.now().toString());

        // 关闭对话框并跳转到管理页面
        setIsOpen(false);
        window.location.href = '/admin';
      } else {
        setError('用户名或密码错误');
      }
    } catch (err) {
      console.error('用户名登录错误:', err);
      setError('登录失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDialogClose = () => {
    setIsOpen(false);
    // 重置状态
    setUsername('');
    setPassword('');
    setError('');
    setIsLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md [&>button]:hidden">
        {/* 隐藏的DialogTitle用于无障碍访问 */}
        <DialogTitle className="sr-only">管理员登录</DialogTitle>

        {/* 自定义头部 */}
        <div className="text-center space-y-4 pt-6">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center">
            <User className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">管理员登录</h2>
            <p className="text-muted-foreground mt-2">请输入用户名和密码以访问管理界面</p>
          </div>
        </div>

        <div className="px-6 space-y-6">
          {/* 错误信息 */}
          {error && (
            <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 p-3 rounded-lg flex items-center gap-2">
              <div className="w-2 h-2 bg-destructive rounded-full flex-shrink-0"></div>
              {error}
            </div>
          )}

          {/* 用户名密码登录表单 */}
          <form onSubmit={handleUsernameSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">用户名</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="username"
                  type="text"
                  placeholder="请输入用户名"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  required
                  disabled={isLoading}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">密码</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="请输入密码"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="pl-10"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading || !username || !password}
              className="w-full h-12 text-base font-medium"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  登录中...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  登录
                </div>
              )}
            </Button>
          </form>
        </div>

        {/* 底部信息 */}
        <div className="px-6 pb-6">
          <div className="text-center">
            <Button
              variant="ghost"
              onClick={handleDialogClose}
              className="text-muted-foreground hover:text-foreground"
            >
              取消登录
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
