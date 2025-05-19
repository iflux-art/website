import Link from 'next/link';
import { DocItem } from '@/lib/docs';

interface RecentDocsListProps {
  docs: DocItem[];
}

export function RecentDocsList({ docs }: RecentDocsListProps) {
  if (docs.length === 0) {
    return (
      <div className="text-center py-10">
        <p>暂无文档</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {docs.map(doc => (
        <Link 
          key={`${doc.category}-${doc.slug}`} 
          href={`/docs/${doc.category}/${doc.slug}`}
          className="block p-4 border border-border rounded-lg hover:border-primary/50 hover:shadow-sm transition-all"
        >
          <h3 className="text-lg font-medium hover:text-primary transition-colors">{doc.title}</h3>
          <p className="text-muted-foreground mt-1">{doc.description}</p>
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm text-muted-foreground">{doc.category}</span>
            {doc.date && <span className="text-xs text-muted-foreground">{doc.date}</span>}
          </div>
        </Link>
      ))}
    </div>
  );
}