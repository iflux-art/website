// Cloudflare Workers 入口文件
// 这个文件用于处理 Cloudflare Pages 的请求

export default {
  async fetch(request, env, ctx) {
    // 这里是一个简单的代理，将请求转发到 Next.js 应用
    // 在 Cloudflare Pages 中，这通常由 Cloudflare 自动处理
    // 但我们需要提供这个文件作为入口点
    
    try {
      // 对于 Cloudflare Pages + Next.js，通常不需要自定义逻辑
      // 这个文件主要是为了满足 wrangler.toml 中的 main 字段要求
      
      // 如果您需要自定义逻辑，可以在这里添加
      // 例如：URL 重写、自定义缓存控制等
      
      // 默认情况下，我们只是返回一个简单的响应
      // 实际部署时，Cloudflare 会忽略这个文件，使用内置的处理程序
      return new Response("iFluxArt Next.js 应用正在运行", {
        headers: { "Content-Type": "text/plain;charset=UTF-8" }
      });
    } catch (error) {
      return new Response(`发生错误: ${error.message}`, {
        status: 500,
        headers: { "Content-Type": "text/plain;charset=UTF-8" }
      });
    }
  }
};
