import { z } from "zod";
import { BaseContentSchema } from "./base";

// Blog post schema
export const BlogPostSchema = BaseContentSchema.extend({
  author: z.string().optional(),
  authorAvatar: z.string().url().nullable().optional(),
  authorBio: z.string().optional(),
  published: z.boolean().optional(),
  excerpt: z.string(),
  featured: z.boolean().optional(),
  image: z.string().url().optional(),
  readingTime: z.number().optional(),
  views: z.number().optional(),
  likes: z.number().optional(),
});

// Blog category schema
export const BlogCategorySchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  count: z.number().optional(),
  order: z.number().optional(),
  color: z.string().optional(),
  icon: z.string().optional(),
});

// Related post schema
export const RelatedPostSchema = BaseContentSchema.pick({
  slug: true,
  title: true,
  description: true,
  date: true,
  category: true,
}).extend({
  excerpt: z.string(),
  relevanceScore: z.number().optional(),
});

// Tag count schema
export const TagCountSchema = z.object({
  tag: z.string(),
  count: z.number(),
  color: z.string().optional(),
});

// Array of blog posts schema
export const BlogPostsArraySchema = z.array(BlogPostSchema);
