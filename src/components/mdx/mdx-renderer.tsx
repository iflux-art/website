// SSR 阶段不再渲染 MDX 内容，防止 rehype-pretty-code 被打包
export const MDXRenderer = () => {
  return null;
};

export default MDXRenderer;
