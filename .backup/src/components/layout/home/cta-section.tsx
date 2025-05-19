"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { fadeIn, slideUp } from "@/lib/animations/base";

interface CTASectionProps {
  title?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  className?: string;
}

/**
 * 首页CTA区域组件
 * 用于显示号召性动作区域，引导用户进一步探索
 */
export function CTASection({
  title = "开始探索",
  description = "点击上方任意模块，开始探索网站的各个功能区域。每个模块都有独立的页面和功能，方便您快速找到所需的信息。",
  buttonText = "了解更多",
  buttonLink = "/docs",
  className = "py-20 bg-primary/5 rounded-lg my-10 mx-6",
}: CTASectionProps) {
  return (
    <div className={className}>
      <div className="container mx-auto px-6 text-center">
        <motion.h2
          className="text-3xl md:text-4xl font-bold mb-6"
          variants={slideUp}
        >
          {title}
        </motion.h2>

        <motion.p
          className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto"
          variants={slideUp}
        >
          {description}
        </motion.p>

        <motion.div variants={fadeIn}>
          <Button size="lg" asChild>
            <Link href={buttonLink}>{buttonText}</Link>
          </Button>
        </motion.div>
      </div>
    </div>
  );
}