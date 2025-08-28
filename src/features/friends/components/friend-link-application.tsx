"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ExternalLink, HandHeart } from "lucide-react";
import Link from "next/link";
import type { FriendsPageConfig } from "../types";

interface FriendLinkApplicationProps {
  /** 友链页面配置 */
  config: FriendsPageConfig;
  /** 自定义类名 */
  className?: string;
}

/**
 * 友链申请卡片组件
 * 简化版，采用类似博客文章卡片的样式
 */
export const FriendLinkApplication = ({ config, className = "" }: FriendLinkApplicationProps) => {
  const { application, requirements } = config;

  return (
    <div className={`mt-8 ${className}`}>
      <Link href={application.formUrl} target="_blank" rel="noopener noreferrer" className="block">
        <Card className="group h-full overflow-hidden border transition-all duration-300 hover:border-primary/50 hover:shadow-lg touch-manipulation active:scale-[0.98]">
          <div className="flex h-full">
            {/* 左侧内容区域 */}
            <div className="flex flex-1 flex-col p-5 md:p-6">
              {/* 标题和徽章区 */}
              <div className="mb-2 sm:mb-3">
                <Badge variant="secondary" className="min-h-[28px] px-3 py-1 text-xs font-medium">
                  申请友链
                </Badge>
              </div>

              {/* 标题 */}
              <h2 className="mb-2 text-lg font-bold leading-tight transition-colors group-hover:text-primary sm:mb-3 sm:text-xl">
                {application.title}
              </h2>

              {/* 描述 */}
              <p className="mb-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground sm:mb-4">
                {application.description}
              </p>

              {/* 要求标签 */}
              <div className="mb-4 flex flex-wrap gap-1.5 sm:gap-2">
                {requirements.map(requirement => (
                  <Badge
                    key={requirement.title}
                    variant="outline"
                    className="min-h-[24px] border-muted-foreground/20 px-2 py-1 text-xs"
                  >
                    {requirement.title}
                  </Badge>
                ))}
              </div>

              {/* 推动底部按钮的间隔 */}
              <div className="flex-1" />

              {/* 底部按钮 */}
              <Button
                variant="ghost"
                size="sm"
                className="group mt-2 w-fit px-0 text-sm text-primary hover:bg-transparent hover:text-primary/80"
              >
                申请友情链接
                <ExternalLink className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>

            {/* 右侧图标区域 */}
            <div
              className="relative hidden flex-shrink-0 overflow-hidden rounded-r-[calc(var(--radius)-1px)] bg-gradient-to-br from-primary/5 via-background to-primary/10 lg:flex lg:items-center lg:justify-center"
              style={{ width: "25%", minWidth: "120px" }}
            >
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                <HandHeart className="h-10 w-10 text-primary" />
              </div>
            </div>
          </div>
        </Card>
      </Link>
    </div>
  );
};
