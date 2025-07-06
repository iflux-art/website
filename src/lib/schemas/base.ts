import { z } from "zod";

// Helper schema for Timestamp type
export const TimestampSchema = z
  .union([
    z.string().datetime(),
    z.date(),
    z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid date string",
    }),
  ])
  .transform((val) => new Date(val));

// Base content schema
export const BaseContentSchema = z.object({
  slug: z.string(),
  title: z.string(),
  description: z.string(),
  tags: z.array(z.string()).optional(),
  date: TimestampSchema.optional(),
  category: z.string().optional(),
});
