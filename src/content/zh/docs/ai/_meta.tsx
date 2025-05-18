// 文档分类的元数据配置
// 用于定义文档的顺序和层级结构

const meta = {
  // 分类名称
  ai: {
    // 分类标题
    title: "人工智能",
    // 文档项目，可以是字符串（文件名）或嵌套对象（子分类）
    items: [
      // 直接引用文档
      "introduction",
      "getting-started",
      // 子分类
      {
        "基础概念": [
          "concepts",
          "models",
          "training"
        ]
      },
      // 另一个子分类
      {
        "高级应用": [
          "applications",
          "case-studies"
        ]
      }
    ]
  }
};

export default meta;