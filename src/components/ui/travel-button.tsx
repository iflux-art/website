'use client';

import * as React from 'react';
import { TramFront } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * 开往按钮组件属性
 * 目前不需要任何属性，但保留此接口以便将来扩展
 */
export interface TravelButtonProps {}

/**
 * 开往按钮组件
 * 点击跳转到开往友链接力网站，实现网站之间的随机跳转
 *
 * @example
 * <TravelButton />
 */
export function TravelButton({}: TravelButtonProps = {}) {
  return (
    <Button
      variant="ghost"
      size="icon"
      title="开往"
      onClick={() => window.open('https://www.travellings.cn/go.html', '_blank')}
    >
      <div
        className="transition-all duration-300 hover:scale-105 active:scale-90"
        style={{
          transformOrigin: 'center',
          transform: 'scale(1)',
        }}
      >
        <TramFront className="h-[1.1rem] w-[1.1rem]" />
      </div>
      <span className="sr-only">开往</span>
    </Button>
  );
}

/**
 * @deprecated 请使用 TravelButton 替代 Travelling，Travelling 将在未来版本中移除
 */
export { TravelButton as Travelling };
