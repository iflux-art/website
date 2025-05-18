import { User } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';

interface AuthorCardProps {
  author: string;
  authorAvatar: string | null;
  authorBio: string;
  lang: string;
}

export function AuthorCard({ author, lang }: AuthorCardProps) {
  return (
    <div className="mt-12 border-t pt-8">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Avatar 
              src={"/images/bowie.jpg"} 
              alt={author}
              className="h-12 w-12"
              fallback={<User className="h-6 w-6" />}
            />
            <div>
              <h3 className="font-medium">{"Bowie"}</h3>
              <p className="text-sm text-muted-foreground mt-1">{"iflux.art | 斐流艺创"}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="px-6 py-4 bg-muted/50 text-xs">
          {lang === 'zh' 
            ? '© 版权声明：本文著作权归作者所有，未经许可不得转载。' 
            : '© Copyright: All rights reserved. No part of this article may be reproduced without permission.'}
        </CardFooter>
      </Card>
    </div>
  );
}