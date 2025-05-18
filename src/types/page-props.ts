export interface PageProps {
  params: {
    slug: string[];
    tag?: string;
  };
  searchParams?: { [key: string]: string | string[] | undefined };
}