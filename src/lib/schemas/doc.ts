import { z } from 'zod';

// Doc category schema
export const DocCategorySchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  count: z.number().optional(),
  order: z.number().optional(),
});

// Sidebar item schema
export type SidebarItem = {
  title: string;
  path?: string;
  items?: SidebarItem[];
  defaultOpen?: boolean;
};
export const SidebarItemSchema: z.ZodType<SidebarItem> = z.object({
  title: z.string(),
  path: z.string().optional(),
  items: z.lazy(() => z.array(SidebarItemSchema)).optional(),
  defaultOpen: z.boolean().optional(),
});
