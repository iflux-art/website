import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';

/**
 * 广告卡片组件
 *
 * 用于在侧边栏中显示广告内容
 * 样式已优化，适应自适应侧边栏布局
 *
 * @returns 广告卡片组件
 */
export function AdvertisementCard() {
  return (
    <Card className="overflow-hidden border border-border/60 shadow-sm">
      <CardContent className="p-0">
        <Image
          src="/images/works.jpg"
          alt="Advertisement"
          width={800}
          height={450}
          className="w-full h-auto"
        />
      </CardContent>
    </Card>
  );
}