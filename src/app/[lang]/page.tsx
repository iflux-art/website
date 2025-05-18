import Link from "next/link";
import { FeatureCards } from "@/components/home/feature-cards";

export default function Page({
  params,
}: {
  params: { lang: string }
}) {
  return (
    <main className="container mx-auto py-10 px-4">
      <section className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">
          {params.lang === "zh" ? "欢迎访问我的网站" : "Welcome to My Website"}
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {params.lang === "zh" 
            ? "这是一个使用 Next.js 和 TailwindCSS 构建的模块化网站，包含文档、博客、导航和友链等功能模块"
            : "This is a modular website built with Next.js and TailwindCSS, featuring documentation, blog, navigation, and friend links"}
        </p>
      </section>

      <FeatureCards lang={params.lang} />

      <section className="bg-muted/30 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">
          {params.lang === "zh" ? "开始探索" : "Start Exploring"}
        </h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          {params.lang === "zh" 
            ? "点击上方任意模块，开始探索网站的各个功能区域。每个模块都有独立的页面和功能，方便您快速找到所需的信息。"
            : "Click on any module above to start exploring the various functional areas of the website. Each module has its own page and features, making it easy for you to quickly find the information you need."}
        </p>
        <Link href={`/${params.lang}/docs`} className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors inline-block">
          {params.lang === "zh" ? "了解更多" : "Learn More"}
        </Link>
      </section>
    </main>
  )
}