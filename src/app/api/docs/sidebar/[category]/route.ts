import { z } from 'zod';
import { getDocSidebar } from '@/lib/content';
import { SidebarItemSchema } from '@/lib/schemas/doc';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ category: string }> }
): Promise<Response> {
  try {
    const resolvedParams = await params;
    const items = getDocSidebar(resolvedParams.category);
    // 使用zod验证数据
    const validatedItems = z.array(SidebarItemSchema).parse(items);
    return Response.json(validatedItems);
  } catch (err) {
    console.error('Error fetching sidebar structure:', err);
    return Response.json(
      {
        error: 'Failed to fetch sidebar structure',
        details: err instanceof Error ? err.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
