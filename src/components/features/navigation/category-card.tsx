"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ArrowRight } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { fadeIn } from "@/lib/animations";

export interface Category {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

interface CategoryCardProps {
  category: Category;
}

/**
 * 分类卡片组件
 * 用于显示导航页面中的分类卡片
 */
export function CategoryCard({ category }: CategoryCardProps) {
  const { ref } = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <motion.div
      ref={ref}
      variants={fadeIn}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
    >
      <Link href={`/navigation/${category.id}`}>
        <Card className={`h-full border-2 hover:border-primary transition-colors overflow-hidden`}>
          <CardContent className={`p-6 ${category.color}`}>
            <div className="text-4xl mb-4">{category.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{category.title}</h3>
            <p className="text-muted-foreground">{category.description}</p>
          </CardContent>
          <CardFooter className="p-4 flex justify-end">
            <div className="flex items-center text-sm font-medium">
              浏览
              <ArrowRight className="ml-1 h-4 w-4" />
            </div>
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  );
}