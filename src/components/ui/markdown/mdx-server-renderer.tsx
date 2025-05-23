// 不再需要导入 MDXRemote 和 compileMDX

interface MdxServerRendererProps {
  content: string;
}

/**
 * MDX 服务器渲染器组件
 *
 * 用于在服务器端渲染 MDX 内容
 */
export async function MdxServerRenderer({ content }: MdxServerRendererProps) {
  // 处理内容中的 ResourceCard 和 ResourceGrid 组件
  // 将 <ResourceCard ... /> 转换为 <div data-resource-card ... />
  // 处理布尔属性，将 featured 转换为 data-featured="true"
  let processedContent = content
    // 处理 ResourceGrid 组件
    .replace(/<ResourceGrid([^>]*)>/g, '<div data-resource-grid$1>')
    .replace(/<\/ResourceGrid>/g, '</div>')

    // 处理 ResourceCard 组件的自闭合标签
    .replace(
      /<ResourceCard([^>]*)\s+featured(\s+[^>]*)?\/>/g,
      '<div data-resource-card$1 data-featured="true"$2></div>'
    )
    .replace(/<ResourceCard([^>]*)\/>/g, '<div data-resource-card$1></div>')

    // 处理 ResourceCard 组件的开始标签
    .replace(
      /<ResourceCard([^>]*)\s+featured(\s+[^>]*)?>/g,
      '<div data-resource-card$1 data-featured="true"$2>'
    )
    .replace(/<ResourceCard([^>]*)>/g, '<div data-resource-card$1>')

    // 处理 ResourceCard 组件的结束标签
    .replace(/<\/ResourceCard>/g, '</div>');

  try {
    // 使用简单的方法：直接返回处理后的内容
    // 这样可以避免在服务器组件中使用 MDXRemote
    return processedContent;
  } catch (error) {
    console.error('MDX 渲染错误:', error);
    return `<div class="p-4 border border-red-500 bg-red-50 text-red-700 rounded">
      <h3 class="font-bold">MDX 渲染错误</h3>
      <p>${(error as Error).message}</p>
    </div>`;
  }
}
