import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export async function getAllTags() {
  const postsDirectory = path.join(process.cwd(), 'src/content/blog');
  if (!fs.existsSync(postsDirectory)) return [];
  
  const fileNames = fs.readdirSync(postsDirectory);
  
  const allTags = new Set<string>();
  
  fileNames.forEach((fileName) => {
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data } = matter(fileContents);
    
    if (data.tags && Array.isArray(data.tags)) {
      data.tags.forEach((tag: string) => allTags.add(tag));
    }
  });
  
  return Array.from(allTags);
}

export default async function BlogPageServer() {
  const allTags = await getAllTags();
  
  return {
    props: {
      allTags
    }
  };
}