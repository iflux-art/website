import { User } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';

/**
 * 作者卡片组件属性
 * 
 * @interface AuthorCardProps
 */
interface AuthorCardProps {
  /**
   * 作者名称
   */
  author: string;
  
  /**
   * 作者头像 URL
   */
  authorAvatar: string | null;
  
  /**
   * 作者简介
   */
  authorBio: string;
}

/**
 * 作者卡片组件
 * 
 * 用于显示博客文章的作者信息，包括头像、名称和简介
 * 
 * @param {AuthorCardProps} props - 组件属性
 * @returns {JSX.Element} 作者卡片组件
 * 
 * @example
 * ```tsx
 * <AuthorCard 
 *   author="Bowie"
 *   authorAvatar="/images/bowie.jpg"
 *   authorBio="iflux.art | 斐流艺创"
 * />
 * ```
 */
export function AuthorCard({ author, authorAvatar, authorBio }: AuthorCardProps) {
  return (
    <div className="mt-12 border-t pt-8">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Avatar 
              src={authorAvatar || undefined} 
              alt={author}
              className="h-12 w-12"
              fallback={<User className="h-6 w-6" />}
            />
            <div>
              <h3 className="font-medium">{author}</h3>
              <p className="text-sm text-muted-foreground mt-1">{authorBio}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="px-6 py-4 bg-muted/50 text-xs">
          © 版权声明：本文著作权归作者所有，未经许可不得转载。
        </CardFooter>
      </Card>
    </div>
  );
}
