"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { fadeIn } from "@/lib/animations";

export interface FriendLink {
  name: string;
  url: string;
  desc: string;
  icon: string;
}

interface FriendLinkCardProps {
  link: FriendLink;
  index: number;
}

/**
 * 友情链接卡片组件
 * 用于显示友情链接页面中的友链卡片
 */
export function FriendLinkCard({ link, index }: FriendLinkCardProps) {
  return (
    <motion.div
      variants={fadeIn}
      initial="initial"
      animate="animate"
      whileHover={{ y: -5 }}
    >
      <Card className="h-full hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 font-bold">
              {link.icon}
            </div>
            <div>
              <div className="font-medium">{link.name}</div>
              <div className="text-sm text-muted-foreground">
                {link.desc}
              </div>
            </div>
          </a>
        </CardContent>
      </Card>
    </motion.div>
  );
}