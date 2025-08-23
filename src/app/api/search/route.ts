import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { performServerSearch } from '@/features/search/lib/server-search';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.trim() ?? '';
    const type = searchParams.get('type') ?? 'all';
    const limit = parseInt(searchParams.get('limit') ?? '10', 10);

    if (!query) {
      return NextResponse.json({ results: [] });
    }

    const { results } = await performServerSearch(query, type, limit);
    return NextResponse.json({ results });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
