import React from "react";
import { AppGrid } from "@/features/layout";
import { LinkCard } from "@/features/links/components";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TwikooComment } from "@/features/comment";
import { LinksItem } from "@/features/links/types";
import friendsData from "@/content/links/friends.json";
import {
  ExternalLink,
  Heart,
  Users,
  MessageCircle,
  HandHeart,
  Globe,
} from "lucide-react";

// 友链表单URL配置
const FRIEND_LINK_FORM_URL =
  "https://ocnzi0a8y98s.feishu.cn/share/base/form/shrcnB0sog9RdZVM8FLJNXVsFFb";

export default function FriendsPage() {
  const friendsItems: LinksItem[] = friendsData.map((item) => ({
    ...item,
    category: item.category as any,
    iconType: ((item as any).iconType || "image") as "image" | "text",
  }));

  if (friendsItems.length === 0) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <p className="mb-4 text-muted-foreground">暂无友情链接</p>
            <a
              href={FRIEND_LINK_FORM_URL}
              target="_blank"
              rel="noreferrer"
              className="text-primary hover:underline"
            >
              申请友链
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <AppGrid columns={5} className="items-stretch">
        {friendsItems.map((item) => (
          <LinkCard
            key={item.id}
            title={item.title}
            description={item.description || item.url}
            href={item.url}
            icon={item.icon}
            iconType={item.iconType as "image" | "text" | undefined}
            isExternal={true}
            className="h-full"
          />
        ))}
      </AppGrid>

      {/* 申请友链版块 */}
      <div className="mt-16 mb-12">
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-background to-primary/10">
          <CardContent className="p-8">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/30">
                <HandHeart className="h-8 w-8 text-primary" />
              </div>

              <h2 className="mb-4 text-2xl font-bold">申请友情链接</h2>
              <p className="mb-6 leading-relaxed text-muted-foreground">
                欢迎与我们交换友情链接！我们希望与优质的网站建立合作关系，共同成长。
                如果您的网站内容优质、更新活跃，欢迎申请友链。
              </p>

              <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Globe className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">内容优质</div>
                    <div className="text-sm text-muted-foreground">
                      原创内容为主
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">更新活跃</div>
                    <div className="text-sm text-muted-foreground">
                      定期更新内容
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Heart className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">互相支持</div>
                    <div className="text-sm text-muted-foreground">
                      共同成长进步
                    </div>
                  </div>
                </div>
              </div>

              <Button size="lg" className="group" asChild>
                <a href={FRIEND_LINK_FORM_URL} target="_blank" rel="noreferrer">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  申请友情链接
                  <ExternalLink className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 评论区 */}
      <div className="mt-12">
        <TwikooComment />
      </div>
    </div>
  );
}
