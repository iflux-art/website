import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { NavDocItem } from '@/lib/content';

interface DocPaginationProps {
  prevDoc: NavDocItem | null;
  nextDoc: NavDocItem | null;
}

export function DocPagination({ prevDoc, nextDoc }: DocPaginationProps) {
  if (!prevDoc && !nextDoc) return null;

  return (
    <div className="mt-12 flex justify-between gap-4">
      {prevDoc ? (
        <Card className="flex-1 max-w-[48%] shadow-sm rounded-xl hover:shadow-md transition-all">
          <CardContent className="p-5">
            <Link href={prevDoc.path} className="flex flex-col">
              <span className="text-sm text-muted-foreground flex items-center">
                <ChevronLeft className="h-4 w-4 mr-1" />
                上一页
              </span>
              <span className="font-semibold tracking-tight">{prevDoc.title}</span>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="flex-1 max-w-[48%]"></div>
      )}
      {nextDoc ? (
        <Card className="flex-1 max-w-[48%] shadow-sm rounded-xl hover:shadow-md transition-all">
          <CardContent className="p-5">
            <Link href={nextDoc.path} className="flex flex-col items-end text-right">
              <span className="text-sm text-muted-foreground flex items-center">
                下一页
                <ChevronRight className="h-4 w-4 ml-1" />
              </span>
              <span className="font-semibold tracking-tight">{nextDoc.title}</span>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="flex-1 max-w-[48%]"></div>
      )}
    </div>
  );
}
