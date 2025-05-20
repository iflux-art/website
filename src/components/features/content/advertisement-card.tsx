import { Card, CardContent, CardFooter } from '@/components/ui/card';
import Image from 'next/image';

export function AdvertisementCard() {
  return (
    <div className="mt-6 mb-6">
      <Image
        src="/images/works.jpg"
        alt="Advertisement"
        width={800}
        height={450}
        className="w-full h-auto rounded-md"
      />
    </div>
  );
}