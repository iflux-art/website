import { getDocSidebar } from '@/lib/content';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ category: string }> }
): Promise<Response> {
  try {
    const resolvedParams = await params;
    const items = getDocSidebar(resolvedParams.category);
    return Response.json(items);
  } catch (err) {
    console.error('Error fetching sidebar structure:', err);
    return Response.json({ error: 'Failed to fetch sidebar structure' }, { status: 500 });
  }
}
