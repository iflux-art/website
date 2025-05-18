"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { scrollRevealUp, staggerContainer, staggerItem, cardHover } from "@/lib/animations";

interface CategoryLink {
  name: string;
  url: string;
  desc: string;
}

interface CategoryCardProps {
  id: string;
  name: string;
  icon: string;
  links: CategoryLink[];
  index: number;
  lang: string;
}

export function CategoryCard({ id, name, icon, links, index, lang }: CategoryCardProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.section
      ref={ref}
      id={id}
      className="scroll-mt-24 border border-border rounded-lg p-6 hover:shadow-md transition-all duration-300"
      variants={scrollRevealUp}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      transition={{ delay: index * 0.1 }}
      whileHover={cardHover}
    >
      <motion.h2 
        className="text-xl font-semibold mb-4 flex items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 + index * 0.1 }}
      >
        <motion.span 
          className="bg-primary/10 text-primary p-1.5 rounded"
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.5 }}
        >
          {icon}
        </motion.span>
        {name}
      </motion.h2>
      <motion.ul 
        className="space-y-3"
        variants={staggerContainer}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        {links.map((link, linkIndex) => (
          <motion.li 
            key={link.url}
            variants={staggerItem}
            custom={linkIndex}
            whileHover={{ x: 5 }}
          >
            <motion.a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between hover:text-primary transition-colors p-2 rounded-md hover:bg-accent/50"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>{link.name}</span>
              <span className="text-muted-foreground text-sm">
                {link.desc}
              </span>
            </motion.a>
          </motion.li>
        ))}
      </motion.ul>
    </motion.section>
  );
}