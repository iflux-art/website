"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * 新版首页英雄区组件
 */
export function NewHeroSection() {

  return (
    <div className="relative w-full flex flex-col justify-center overflow-hidden">
      {/* 背景效果 */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] dark:opacity-[0.03] z-0" />

        {/* 装饰性圆形 */}
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-70" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-70" />
      </div>

      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 max-w-5xl w-full px-6 md:px-8 mx-auto">
          {/* 左侧内容 */}
          <motion.div
            className="lg:flex-[0.55] text-center lg:text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-block mb-4 px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
            >
              全新设计 · 更佳体验
            </motion.div>

            <motion.h1
              className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              iFluxArt
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              斐启智境 · 流韵新生
            </motion.p>

            <motion.p
              className="text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              探索前沿技术，分享创新思想，连接全球开发者社区
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <Button size="lg" asChild>
                <Link href="/docs">浏览文档</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/blog">阅读博客</Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* 右侧图像 */}
          <motion.div
            className="lg:flex-[0.45] relative"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <div className="relative w-full aspect-square max-w-md lg:ml-0">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl transform rotate-3"></div>
              <div className="absolute inset-0 bg-card border border-border rounded-2xl shadow-xl overflow-hidden transform -rotate-3">
                <div className="absolute top-0 left-0 right-0 h-12 bg-muted flex items-center px-4">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                </div>
                <div className="pt-12 p-6">
                  <div className="w-full h-32 bg-primary/10 rounded-md mb-4 flex items-center justify-center">
                    <span className="text-primary font-medium">iFluxArt</span>
                  </div>
                  <div className="space-y-2">
                    <div className="w-full h-4 bg-muted rounded"></div>
                    <div className="w-2/3 h-4 bg-muted rounded"></div>
                    <div className="w-5/6 h-4 bg-muted rounded"></div>
                    <div className="w-1/2 h-4 bg-muted rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
