"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ToolLayoutProps {
  // 通用布局属性
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;

  // 工具特定属性
  title?: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  actions?: React.ReactNode;
  helpContent?: React.ReactNode;
  showBackButton?: boolean;
}

export const ToolLayout: React.FC<ToolLayoutProps> = ({
  children,
  className,
  containerClassName,
  title,
  description,
  icon: Icon,
  actions,
  helpContent,
  showBackButton = false,
}) => {
  return (
    <div className={cn("min-h-screen bg-background", className)}>
      <div className={cn("container mx-auto px-4 py-8", containerClassName)}>
        {/* 返回按钮 */}
        {showBackButton && (
          <div className="mb-6">
            <Link href="/tools">
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                返回工具列表
              </Button>
            </Link>
          </div>
        )}

        {/* 页面标题 */}
        {(title || Icon) && (
          <div className="mb-8">
            <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight">
              {Icon && <Icon className="h-8 w-8" />}
              {title}
            </h1>
            {description && (
              <p className="mt-2 text-muted-foreground">{description}</p>
            )}
          </div>
        )}

        {/* 操作按钮区域 */}
        {actions && <div className="mb-6">{actions}</div>}

        {/* 主要内容区域 */}
        <div className="mx-auto">{children}</div>

        {/* 使用说明 */}
        {helpContent && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>使用说明</CardTitle>
            </CardHeader>
            <CardContent>{helpContent}</CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
