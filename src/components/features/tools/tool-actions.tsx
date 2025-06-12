'use client';

import React from 'react';
import { Button } from '@/components/ui/input/button';
import { LucideIcon } from 'lucide-react';

interface ActionButton {
  label: string;
  onClick: () => void;
  icon?: LucideIcon;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
  disabled?: boolean;
}

interface ToolActionsProps {
  actions: ActionButton[];
  className?: string;
}

export function ToolActions({ actions, className = '' }: ToolActionsProps) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {actions.map((action, index) => {
        const Icon = action.icon;
        return (
          <Button
            key={index}
            onClick={action.onClick}
            variant={action.variant || 'default'}
            disabled={action.disabled}
            className="flex items-center gap-2"
          >
            {Icon && <Icon className="h-4 w-4" />}
            {action.label}
          </Button>
        );
      })}
    </div>
  );
}
