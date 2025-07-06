import { z } from "zod";

// 搜索请求参数schema
export const SearchRequestSchema = z.object({
  q: z.string().min(1, "搜索内容不能为空"),
  type: z.enum(["doc", "blog", "tool", "link"]).optional(),
  limit: z.number().int().min(1).max(50).optional().default(8),
});

// 搜索结果项schema
export const SearchResultItemSchema = z.object({
  title: z.string(),
  path: z.string(),
  excerpt: z.string(),
  type: z.enum(["doc", "blog", "tool", "link"]),
  score: z.number().min(0),
  highlights: z
    .object({
      title: z.string().optional(),
      content: z.array(z.string()).optional(),
    })
    .optional(),
});

// 搜索响应schema
export const SearchResponseSchema = z.object({
  success: z.boolean(),
  results: z.array(SearchResultItemSchema),
  count: z.number().min(0),
  error: z.string().optional(),
});

// 搜索类型
export type SearchRequest = z.infer<typeof SearchRequestSchema>;
export type SearchResultItem = z.infer<typeof SearchResultItemSchema>;
export type SearchResponse = z.infer<typeof SearchResponseSchema>;
