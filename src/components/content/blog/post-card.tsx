"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface PostCardProps {
  slug: string;
  title: string;
  excerpt: string;
  lang: string;
}

export function PostCard({ slug, title, excerpt, lang }: PostCardProps) {
  return (
    <motion.article 
      className="border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <p className="text-muted-foreground mb-4">{excerpt}</p>
        <Link 
          href={`/${lang}/blog/${slug}`} 
          className="text-primary hover:underline"
        >
          {lang === 'zh' ? '阅读全文 →' : 'Read more →'}
        </Link>
      </div>
    </motion.article>
  );
}