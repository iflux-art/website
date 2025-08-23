'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import type { AppGridProps } from '../types/page-container';
import { gridColsMap, gridGapMap } from '../lib/page-container-utils';

/**
 * 通用网格布局组件
 * 用于创建响应式的网格布局
 */
export const AppGrid = ({ children, className, columns = 3, gap = 'default' }: AppGridProps) => (
  <div className={cn('mb-8 grid', gridColsMap[columns], gridGapMap[gap], className)}>
    {children}
  </div>
);
