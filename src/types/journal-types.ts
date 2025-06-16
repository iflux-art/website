export interface Frontmatter {
  title: string;
  description?: string;
  date: string;
  type?: 'blog' | 'doc' | 'note';
  slug?: string;
}

export interface MDXEntry {
  frontmatter: Frontmatter;
  slug: string;
  content: string;
}

export interface JournalEntry {
  id: string;
  title: string;
  description?: string;
  date: string;
  type: 'blog' | 'doc';
  url: string;
}

export interface JournalState {
  entries: JournalEntry[];
  loading: boolean;
  error: Error | null;
}
