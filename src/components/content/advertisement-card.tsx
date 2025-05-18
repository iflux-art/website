import { Card, CardContent, CardFooter } from '@/components/ui/card';

interface AdvertisementCardProps {
  lang: string;
}

export function AdvertisementCard({ lang }: AdvertisementCardProps) {
  return (
    <div>
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <img 
            src="/images/works.jpg" 
            alt="Advertisement" 
            className="w-full h-auto"
          />
        </CardContent>
        <CardFooter className="p-3 text-xs text-muted-foreground">
          {lang === 'zh' ? '广告' : 'Advertisement'}
        </CardFooter>
      </Card>
    </div>
  );
}