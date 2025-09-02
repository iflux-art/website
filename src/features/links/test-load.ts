// 链接数据加载测试

import { loadAllLinksData } from "@/features/links/lib";

async function testLoadLinks() {
  console.log("开始加载链接数据...");
  try {
    const data = await loadAllLinksData("test");
    console.log(`成功加载链接数据, 条目数量: ${data.length}`);
    // 打印一些样本数据
    if (data.length > 0) {
      console.log("第一项数据样本:", JSON.stringify(data[0], null, 2));
    }
  } catch (error) {
    console.error("加载链接数据失败:", error);
  }
}

// 执行测试
testLoadLinks();
