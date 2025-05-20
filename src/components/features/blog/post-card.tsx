"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { PostCardProps } from "./post-card.types";

export function PostCard({ slug, title, excerpt }: PostCardProps) {
  return (
    <motion.article
      className="border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <p className="text-muted-foreground mb-4">{excerpt}</p>
        <Link
          href={`/blog/${slug}`}
          className="text-primary hover:underline"
        >
          阅读全文 →
        </Link>
      </div>
    </motion.article>
  );
}