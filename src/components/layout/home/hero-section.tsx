"use client";

import React from "react";
import Link from "next/link";
import { motion, MotionValue } from "framer-motion";
import { Button } from "@/components/ui/button";
import { slideUp } from "@/lib/animations/base";

interface HeroSectionProps {
  y1: MotionValue<number>;
  opacity1: MotionValue<number>;
}

/**
 * 首页英雄区组件
 * 显示网站的主标题、副标题和主要操作按钮
 */
export function HeroSection({ y1, opacity1 }: HeroSectionProps) {
  return (
    <motion.div
      className="relative h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden"
      initial="initial"
      animate="animate"
      variants={{
        initial: { opacity: 0 },
        animate: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
    >
      <motion.div
        className="absolute inset-0 -z-10"
        style={{ y: y1, opacity: opacity1 }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-background/80 z-10" />
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] dark:opacity-[0.02] z-0" />
      </motion.div>

      <div className="container px-4 text-center relative z-10">
        <motion.h1
          className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70"
          variants={slideUp}
        >
          iFluxArt
        </motion.h1>

        <motion.p
          className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10"
          variants={slideUp}
        >
          斐启智境 · 流韵新生
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          variants={slideUp}
        >
          <Button size="lg" asChild>
            <Link href="/docs">浏览文档</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/blog">阅读博客</Link>
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}