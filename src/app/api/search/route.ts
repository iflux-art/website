import { NextRequest, NextResponse } from 'next/server';
import { searchContent } from '@/components/features/search/content-search';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const limit = parseInt(searchParams.get('limit') || '8');

    if (!query) {
      return NextResponse.json({ results: [] });
    }

    const results = searchContent(query, limit);

    return NextResponse.json({
      results,
      total: results.length,
    });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
