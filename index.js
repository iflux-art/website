// Cloudflare Workers 入口文件
// 这个文件用于处理 Cloudflare Pages 的请求

export default {
  async fetch(request) {
    try {
      // 获取请求的 URL
      const url = new URL(request.url);

      // 对于 Cloudflare Pages + Next.js，通常不需要自定义逻辑
      // 这个文件主要是为了满足 wrangler.toml 中的 main 字段要求

      // 如果是 API 路由，返回简单的响应
      if (url.pathname.startsWith('/api/')) {
        return new Response(
          JSON.stringify({
            message: 'iFluxArt API 正在运行',
            path: url.pathname,
            timestamp: new Date().toISOString(),
          }),
          {
            headers: {
              'Content-Type': 'application/json;charset=UTF-8',
              'Access-Control-Allow-Origin': '*',
            },
          }
        );
      }

      // 对于其他路由，返回简单的 HTML 响应
      return new Response(
        `
        <!DOCTYPE html>
        <html>
        <head>
          <title>iFluxArt</title>
          <meta charset="UTF-8">
        </head>
        <body>
          <h1>iFluxArt Next.js 应用正在运行</h1>
          <p>路径: ${url.pathname}</p>
          <p>时间: ${new Date().toLocaleString()}</p>
        </body>
        </html>
      `,
        {
          headers: { 'Content-Type': 'text/html;charset=UTF-8' },
        }
      );
    } catch (error) {
      return new Response(
        JSON.stringify({
          error: '发生错误',
          message: error.message,
          timestamp: new Date().toISOString(),
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        }
      );
    }
  },
};
