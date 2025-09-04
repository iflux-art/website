import { Card, CardContent } from "@/components/ui/card";
import type { NavDocItem } from "@/features/navigation/types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

export interface DocPaginationProps {
  prevDoc?: NavDocItem | null;
  nextDoc?: NavDocItem | null;
}

export const DocPagination = ({ prevDoc, nextDoc }: DocPaginationProps) => {
  if (!(prevDoc || nextDoc)) return null;

  return (
    <div className="mt-4 flex justify-between gap-4">
      {prevDoc ? (
        <Card className="max-w-[48%] flex-1 rounded-xl transition-all hover:shadow-md">
          <CardContent className="p-5">
            <Link href={prevDoc.path} className="flex flex-col">
              <span className="flex items-center text-sm text-muted-foreground">
                <ChevronLeft className="mr-1 h-4 w-4" />
                上一页
              </span>
              <span className="font-semibold tracking-tight">{prevDoc.title}</span>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="max-w-[48%] flex-1" />
      )}
      {nextDoc ? (
        <Card className="max-w-[48%] flex-1 rounded-xl transition-all hover:shadow-md">
          <CardContent className="p-5">
            <Link href={nextDoc.path} className="flex flex-col items-end text-right">
              <span className="flex items-center text-sm text-muted-foreground">
                下一页
                <ChevronRight className="ml-1 h-4 w-4" />
              </span>
              <span className="font-semibold tracking-tight">{nextDoc.title}</span>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="max-w-[48%] flex-1" />
      )}
    </div>
  );
};
