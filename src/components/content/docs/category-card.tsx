"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface CategoryCardProps {
  category: string;
  title: string;
  description: string;
  docCount: number;
  lang: string;
}

export function CategoryCard({ category, title, description, docCount, lang }: CategoryCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-all border border-border">
      <CardContent className="p-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <h2 className="text-xl font-semibold mb-2">{title}</h2>
          <p className="text-muted-foreground mb-4 line-clamp-2">{description}</p>
          <p className="text-sm text-muted-foreground">
            {lang === 'zh' ? `${docCount} 篇文档` : `${docCount} document${docCount > 1 ? 's' : ''}`}
          </p>
        </motion.div>
      </CardContent>
      <CardFooter className="p-0">
        <Link 
          href={`/${lang}/docs/${category}`} 
          className="w-full p-4 bg-muted/50 hover:bg-muted flex items-center justify-between text-primary"
        >
          <span>{lang === 'zh' ? '浏览文档' : 'Browse docs'}</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </CardFooter>
    </Card>
  );
}