"use client";

import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Card, CardContent } from "@/components/ui/card";
import { slideUp } from "@/lib/animations";

export interface Resource {
  title: string;
  description: string;
  url: string;
  category: string;
  icon: string;
  author: string;
  free: boolean;
}

interface ResourceCardProps {
  resource: Resource;
  index: number;
}

/**
 * 资源卡片组件
 * 用于显示导航和友情链接页面中的资源卡片
 */
export function ResourceCard({ resource, index }: ResourceCardProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <motion.div
      ref={ref}
      variants={slideUp}
      initial="initial"
      animate={inView ? "animate" : "initial"}
      transition={{ delay: index * 0.1 }}
    >
      <a href={resource.url} target="_blank" rel="noopener noreferrer">
        <Card className="h-full hover:shadow-md transition-all hover:border-primary/50">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                {resource.icon && (
                  <span className="text-2xl mr-2">{resource.icon}</span>
                )}
                <h3 className="text-lg font-semibold">{resource.title}</h3>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-muted">{resource.category}</span>
            </div>
            <p className="text-muted-foreground mb-4">{resource.description}</p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{resource.author}</span>
              {resource.free ? (
                <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                  免费
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100">
                  付费
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      </a>
    </motion.div>
  );
}