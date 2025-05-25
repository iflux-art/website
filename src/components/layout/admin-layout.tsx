'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  Globe, 
  Mail, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Home
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const adminMenuItems = [
  {
    key: 'dashboard',
    label: '仪表板',
    icon: Home,
    href: '/admin',
  },
  {
    key: 'navigation',
    label: '网址管理',
    icon: Globe,
    href: '/admin/navigation',
  },
  {
    key: 'email',
    label: '邮箱管理',
    icon: Mail,
    href: '/admin/email',
  },
  {
    key: 'settings',
    label: '系统设置',
    icon: Settings,
    href: '/admin/settings',
  },
];

export function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // 检查登录状态
  useEffect(() => {
    const checkAuth = () => {
      const loggedIn = localStorage.getItem('isLoggedIn');
      const loginTime = localStorage.getItem('loginTime');
      
      if (loggedIn === 'true' && loginTime) {
        // 检查登录是否过期（24小时）
        const now = Date.now();
        const loginTimestamp = parseInt(loginTime);
        const isExpired = now - loginTimestamp > 24 * 60 * 60 * 1000;
        
        if (isExpired) {
          handleLogout();
        } else {
          setIsLoggedIn(true);
        }
      } else {
        router.push('/');
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('loginTime');
    setIsLoggedIn(false);
    router.push('/');
  };

  const isActiveRoute = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(href);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">验证登录状态...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* 移动端顶部栏 */}
      <div className="lg:hidden bg-background border-b px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-semibold">管理后台</h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      <div className="flex">
        {/* 侧边栏 */}
        <aside
          className={cn(
            'fixed inset-y-0 left-0 z-50 w-64 bg-card border-r transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          <div className="flex flex-col h-full">
            {/* 侧边栏头部 */}
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold">管理后台</h2>
              <p className="text-sm text-muted-foreground mt-1">系统管理界面</p>
            </div>

            {/* 导航菜单 */}
            <nav className="flex-1 p-4 space-y-2">
              {adminMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = isActiveRoute(item.href);
                
                return (
                  <Link
                    key={item.key}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* 侧边栏底部 */}
            <div className="p-4 border-t">
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="w-full justify-start text-muted-foreground hover:text-foreground"
              >
                <LogOut className="h-4 w-4 mr-3" />
                退出登录
              </Button>
            </div>
          </div>
        </aside>

        {/* 移动端遮罩 */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* 主内容区 */}
        <main className="flex-1 lg:ml-0">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
