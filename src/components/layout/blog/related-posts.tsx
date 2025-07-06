import React from "react";
import { NavLink } from "@/components/ui/nav-link";
import { ArrowRightLeft } from "lucide-react";

interface RelatedPost {
  title: string;
  href: string;
  category?: string;
}

interface RelatedPostsProps {
  posts: RelatedPost[];
  currentSlug: string[];
}

export function RelatedPosts({ posts, currentSlug }: RelatedPostsProps) {
  if (!posts?.length) return null;

  const currentPath = `/blog/${currentSlug.join("/")}`;

  return (
    <div className="w-full">
      <h3 className="mb-4 flex items-center gap-2 px-3 text-left text-sm font-medium text-muted-foreground">
        <ArrowRightLeft className="h-4 w-4" />
        相关文章
      </h3>
      <nav className="space-y-1">
        {posts.map((post) => (
          <NavLink
            key={post.href}
            href={post.href}
            className="block w-full truncate text-sm"
            currentDoc={
              currentPath === post.href
                ? currentSlug[currentSlug.length - 1]
                : undefined
            }
          >
            {post.title}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
