'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

interface CategoryCardProps {
  category: string;
  title: string;
  description: string;
  docCount: number;
}

export function CategoryCard({ category, title, description, docCount }: CategoryCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all border border-border rounded-xl shadow-sm">
      <CardContent className="p-8">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
          <h2 className="text-xl font-semibold tracking-tight mb-3">{title}</h2>
          <p className="text-muted-foreground mb-4 line-clamp-2">{description}</p>
          <p className="text-sm text-muted-foreground">{`${docCount} 篇文档`}</p>
        </motion.div>
      </CardContent>
      <CardFooter className="p-0">
        <Link
          href={`/docs/${category}`}
          className="w-full p-5 bg-muted/50 hover:bg-muted flex items-center justify-between text-primary font-medium transition-colors"
        >
          <span>浏览文档</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </CardFooter>
    </Card>
  );
}
