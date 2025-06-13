import algoliasearch from 'algoliasearch';

// 从环境变量中获取配置
const {
  NEXT_PUBLIC_ALGOLIA_APP_ID,
  ALGOLIA_ADMIN_KEY,
  NEXT_PUBLIC_ALGOLIA_INDEX_NAME
} = process.env;

async function configureAlgolia() {
  try {
    // 初始化客户端
    const client = algoliasearch(NEXT_PUBLIC_ALGOLIA_APP_ID, ALGOLIA_ADMIN_KEY);
    const index = client.initIndex(NEXT_PUBLIC_ALGOLIA_INDEX_NAME);

    // 配置索引设置
    await index.setSettings({
      // 定义可搜索的属性及其优先级
      searchableAttributes: [
        'unordered(title)',    // 标题不需要考虑词序
        'description',         // 描述
        'unordered(tags)',     // 标签不需要考虑词序
        'category'            // 分类
      ],

      // 定义可用于过滤的属性
      attributesForFaceting: [
        'type',               // 内容类型（文档/博客/工具）
        'category',           // 分类
        'searchable(tags)'    // 可搜索的标签
      ],

      // 定义用于排序的属性
      customRanking: [
        'desc(popularity)',    // 按受欢迎程度降序
        'desc(date)'          // 按日期降序
      ],

      // 定义用于高亮和片段的属性
      attributesToHighlight: [
        'title',
        'description'
      ],
      highlightPreTag: '<mark>',
      highlightPostTag: '</mark>',
      snippetEllipsisText: '...',

      // 其他设置
      distinct: true,         // 去重
      maxValuesPerFacet: 100  // 每个 facet 最多返回的值数量
    });

    // 创建专门用于搜索的 API 密钥，限制权限
    const searchApiKey = await client.generateSecuredApiKey(
      process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY,
      {
        filters: '', // 可以添加默认过滤条件
        validUntil: Math.floor(Date.now() / 1000) + 3600 * 24 * 30 // 30天有效期
      }
    );

    console.log('✅ Algolia 索引配置成功');
    console.log('🔑 生成的搜索 API 密钥:', searchApiKey);

  } catch (error) {
    console.error('❌ Algolia 配置失败:', error);
    process.exit(1);
  }
}

configureAlgolia();
