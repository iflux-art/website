'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface NavCardProps {
  title: string;
  description: string;
  href: string;
  isActive: boolean;
  onClose?: () => void;
}

/**
 * 导航卡片组件
 * 用于移动菜单中显示导航项
 */
export function NavCard({ title, description, href, isActive, onClose }: NavCardProps) {
  const router = useRouter();

  // 处理点击事件
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();

    // 先关闭菜单
    if (onClose) {
      onClose();
    }

    // 然后导航到目标页面
    // 使用setTimeout确保菜单关闭动画有时间执行
    setTimeout(() => {
      router.push(href);
    }, 100);
  };

  return (
    <div className="w-full opacity-0 translate-y-5 animate-in fade-in slide-in-from-bottom-5 duration-300 fill-mode-forwards hover:scale-[1.02] active:scale-[0.98] transition-transform">
      <a href={href} className="block w-full" onClick={handleClick}>
        <div
          className={cn(
            'rounded-xl p-6 h-full shadow-sm transition-all duration-300',
            isActive
              ? 'bg-primary/10 border border-primary/20'
              : 'bg-card border border-border hover:bg-accent hover:border-primary/20'
          )}
        >
          <h3
            className={cn(
              'text-xl font-semibold tracking-tight mb-2',
              isActive ? 'text-primary' : 'text-foreground'
            )}
          >
            {title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        </div>
      </a>
    </div>
  );
}
