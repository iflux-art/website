'use client';

import React from 'react';
import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

type CalloutType = 'info' | 'success' | 'warning' | 'error';

interface MDXCalloutProps {
  type?: CalloutType;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const CALLOUT_CONFIG = {
  info: {
    icon: Info,
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-800',
    titleColor: 'text-blue-900',
  },
  success: {
    icon: CheckCircle,
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    textColor: 'text-green-800',
    titleColor: 'text-green-900',
  },
  warning: {
    icon: AlertTriangle,
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    textColor: 'text-yellow-800',
    titleColor: 'text-yellow-900',
  },
  error: {
    icon: AlertCircle,
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    textColor: 'text-red-800',
    titleColor: 'text-red-900',
  },
};

/**
 * MDX 提示框组件
 * - 支持多种类型：info, success, warning, error
 * - 自动配色方案
 * - 支持标题和内容
 * - 响应式设计
 */
export const MDXCallout = ({ type = 'info', title, children, className = '' }: MDXCalloutProps) => {
  const config = CALLOUT_CONFIG[type];
  const Icon = config.icon;

  return (
    <div
      className={`
      my-6 rounded-lg border p-4
      ${config.bgColor}
      ${config.borderColor}
      ${config.textColor}
      ${className}
    `}
    >
      <div className="flex items-start space-x-3">
        <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          {title && <h4 className={`font-medium mb-2 ${config.titleColor}`}>{title}</h4>}
          <div className="prose-sm">{children}</div>
        </div>
      </div>
    </div>
  );
};
