import { z } from 'zod';
import { NextResponse } from 'next/server';
import { ApiResponse } from '@/types';

export function validateRequest<T extends z.ZodTypeAny>(schema: T, data: unknown): z.infer<T> {
  try {
    return schema.parse(data);
  } catch {
    throw new Error('Invalid request data');
  }
}

export function createApiResponse<T>(data?: T, error?: ApiResponse['error']) {
  return NextResponse.json({ data, error } satisfies ApiResponse<T>);
}

export const PaginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
});

export const IdSchema = z.object({
  id: z.string().min(1),
});
