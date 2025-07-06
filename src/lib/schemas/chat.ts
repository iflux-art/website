import { z } from "zod";

// Chat message schema
export const ChatMessageSchema = z.object({
  role: z.enum(["system", "user", "assistant"]),
  content: z.string(),
});

// API request body schema
export const ApiRequestBodySchema = z.object({
  messages: z.array(ChatMessageSchema),
  temperature: z.number().min(0).max(2),
  max_tokens: z.number().min(1),
  stream: z.boolean(),
  model: z.string().optional(),
});
