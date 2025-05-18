"use client";

import { motion } from "framer-motion";

interface FriendCardProps {
  href: string;
  avatar: string;
  name: {
    zh: string;
    en: string;
  };
  description: {
    zh: string;
    en: string;
  };
  lang: string;
}

export function FriendCard({ href, avatar, name, description, lang }: FriendCardProps) {
  return (
    <motion.a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      className="border border-border rounded-lg p-4 hover:shadow-md transition-all hover:border-primary/50 flex flex-col items-center text-center"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="w-16 h-16 rounded-full bg-muted mb-3 overflow-hidden flex items-center justify-center text-2xl font-bold text-primary">
        {avatar}
      </div>
      <h3 className="font-medium mb-1">{name[lang as keyof typeof name]}</h3>
      <p className="text-sm text-muted-foreground">{description[lang as keyof typeof description]}</p>
    </motion.a>
  );
}