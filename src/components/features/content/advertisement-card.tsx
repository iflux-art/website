import { Card, CardContent, CardFooter } from '@/components/ui/card';
import Image from 'next/image';

export function AdvertisementCard() {
  return (
    <div>
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <Image 
            src="/images/works.jpg" 
            alt="Advertisement" 
            width={800}
            height={450}
            className="w-full h-auto"
          />
        </CardContent>
        <CardFooter className="p-3 text-xs text-muted-foreground">
          广告位招租，有意者请联系管理员。
        </CardFooter>
      </Card>
    </div>
  );
}