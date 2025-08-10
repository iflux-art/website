const fs = require("fs");
const path = require("path");

// 读取原始数据
const itemsPath = "src/content/links/items.json";
const itemsData = JSON.parse(fs.readFileSync(itemsPath, "utf8"));

console.log(`总共有 ${itemsData.length} 个链接项目`);

// 分析现有分类
const categoryStats = {};
itemsData.forEach((item) => {
  const category = item.category;
  if (!categoryStats[category]) {
    categoryStats[category] = [];
  }
  categoryStats[category].push(item);
});

console.log("\n现有分类统计:");
Object.keys(categoryStats).forEach((category) => {
  console.log(`${category}: ${categoryStats[category].length} 个项目`);
});

// 根据导航网站最佳实践，定义分类映射规则
const categoryMapping = {
  // AI 相关分类映射
  ai: {
    // 根据 tags 和 description 进一步细分
    chat: ["大语言模型", "AI对话", "智能助手", "多模态", "大模型"],
    api: ["API平台", "开发者资源", "模型接口", "API", "开发平台"],
    tools: ["部署工具", "套壳应用", "浏览器插件"],
    services: ["订阅平台"],
    resources: ["教程", "官方文档", "学习资源", "社区", "行业标准"],
    platforms: ["套盒应用"], // 修正拼写错误
  },
  "ai-chat": "ai/chat", // ai-chat 应该归并到 ai/chat
  audio: {
    processing: ["音频处理", "音频编辑"],
    daw: ["DAW", "音乐制作"],
    distribution: ["音乐发行", "音频分发"],
    resources: ["音频资源", "音效库"],
  },
  design: {
    tools: ["设计工具", "图形设计"],
    colors: ["配色", "颜色工具"],
    fonts: ["字体", "字体资源"],
    "image-processing": ["图像处理", "图片编辑"],
  },
  development: {
    frameworks: ["框架", "开发框架"],
    tools: ["开发工具", "云服务"],
  },
  office: {
    documents: ["文档处理", "文档工具"],
    pdf: ["PDF", "PDF工具"],
    presentation: ["演示", "PPT", "AIPPT"],
    notes: ["笔记", "笔记工具"],
    mindmaps: ["思维导图"],
    ocr: ["OCR", "文字识别"],
  },
  operation: {
    marketing: ["营销", "市场营销"],
    "social-media": ["社交媒体", "社交平台"],
    ecommerce: ["电商", "电子商务"],
    "video-platforms": ["视频平台"],
  },
  productivity: {
    search: ["搜索", "搜索引擎"],
    translation: ["翻译", "翻译工具"],
    browsers: ["浏览器"],
    email: ["邮箱", "邮件"],
    "cloud-storage": ["云存储", "网盘"],
    "system-tools": ["系统工具", "效率工具"],
  },
  video: {
    editing: ["视频编辑", "视频制作", "视频生成", "AIGC"],
  },
};

// 智能分类函数
function categorizeItem(item) {
  const { category, tags = [], description = "", title = "" } = item;
  const allText = [title, description, ...tags].join(" ").toLowerCase();

  // 如果是 ai-chat，直接映射到 ai/chat
  if (category === "ai-chat") {
    return "ai/chat";
  }

  // 如果是 ai 分类，需要进一步细分
  if (category === "ai") {
    // 检查是否是聊天类
    if (
      tags.some((tag) =>
        ["大语言模型", "AI对话", "智能助手", "多模态", "大模型"].includes(tag),
      )
    ) {
      return "ai/chat";
    }
    // 检查是否是 API 类
    if (
      tags.some((tag) =>
        ["API平台", "开发者资源", "模型接口", "API", "开发平台"].includes(tag),
      )
    ) {
      return "ai/api";
    }
    // 检查是否是工具类
    if (
      tags.some((tag) => ["部署工具", "套壳应用", "浏览器插件"].includes(tag))
    ) {
      return "ai/tools";
    }
    // 检查是否是服务类
    if (tags.some((tag) => ["订阅平台"].includes(tag))) {
      return "ai/services";
    }
    // 检查是否是资源类
    if (
      tags.some((tag) =>
        ["教程", "官方文档", "学习资源", "社区", "行业标准"].includes(tag),
      )
    ) {
      return "ai/resources";
    }
    // 检查是否是平台类
    if (tags.some((tag) => ["套盒应用"].includes(tag))) {
      return "ai/platforms";
    }
    // 默认归类到 ai/tools
    return "ai/tools";
  }

  // 其他分类保持不变，但需要检查是否需要细分
  if (category === "development") {
    if (tags.some((tag) => ["云服务"].includes(tag))) {
      return "development/tools";
    }
    return "development/frameworks";
  }

  // 视频相关
  if (category === "video") {
    return "video/editing";
  }

  // 其他分类暂时保持原样
  return category;
}

// 更新所有项目的分类
const updatedItems = itemsData.map((item) => ({
  ...item,
  category: categorizeItem(item),
}));

// 按新分类重新统计
const newCategoryStats = {};
updatedItems.forEach((item) => {
  const category = item.category;
  if (!newCategoryStats[category]) {
    newCategoryStats[category] = [];
  }
  newCategoryStats[category].push(item);
});

console.log("\n更新后分类统计:");
Object.keys(newCategoryStats)
  .sort()
  .forEach((category) => {
    console.log(`${category}: ${newCategoryStats[category].length} 个项目`);
  });

// 保存更新后的数据到临时文件
fs.writeFileSync(
  "updated_items.json",
  JSON.stringify(updatedItems, null, 2),
  "utf8",
);

console.log("\n已保存更新后的数据到 updated_items.json");
console.log("请检查分类是否正确，然后运行下一步脚本来拆分文件");
