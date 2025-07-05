import { z } from 'zod';

// Links form data schema
export const LinksFormDataSchema = z.object({
  title: z.string().min(1),
  url: z.string().url(),
  description: z.string().optional(),
  category: z.string().min(1),
  tags: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
  icon: z.string().optional(),
});

// Links item schema
export const LinksItemSchema = LinksFormDataSchema.extend({
  id: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// Links category schema
export const LinksCategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  order: z.number(),
});
