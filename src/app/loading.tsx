import { ProgressBarLoading } from "@/components/layout";

/**
 * 全局加载状态页面
 * 显示进度条加载状态
 */
const Loading = () => (
  <div className="min-h-screen bg-background">
    <div className="container mx-auto px-4 py-6 lg:py-8">
      <ProgressBarLoading />
    </div>
  </div>
);

export default Loading;
