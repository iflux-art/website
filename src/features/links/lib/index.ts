import { LinksItem, LinksCategory } from "../types";

// 定义分类结构，基于实际文件夹结构
const categoryStructure = {
  // 根目录文件
  profile: {
    name: "个人主页",
    file: () => import("@/content/links/profile.json"),
  },
  friends: {
    name: "友情链接",
    file: () => import("@/content/links/friends.json"),
  },

  // category 文件夹下的分类
  ai: {
    name: "人工智能",
    children: {
      api: {
        name: "API",
        file: () => import("@/content/links/category/ai/api.json"),
      },
      chat: {
        name: "聊天",
        file: () => import("@/content/links/category/ai/chat.json"),
      },
      creative: {
        name: "创意",
        file: () => import("@/content/links/category/ai/creative.json"),
      },
      models: {
        name: "模型",
        file: () => import("@/content/links/category/ai/models.json"),
      },
      platforms: {
        name: "平台",
        file: () => import("@/content/links/category/ai/platforms.json"),
      },
      resources: {
        name: "资源",
        file: () => import("@/content/links/category/ai/resources.json"),
      },
      services: {
        name: "服务",
        file: () => import("@/content/links/category/ai/services.json"),
      },
      tools: {
        name: "工具",
        file: () => import("@/content/links/category/ai/tools.json"),
      },
    },
  },

  audio: {
    name: "音频",
    children: {
      daw: {
        name: "DAW",
        file: () => import("@/content/links/category/audio/daw.json"),
      },
      distribution: {
        name: "发行",
        file: () => import("@/content/links/category/audio/distribution.json"),
      },
      processing: {
        name: "处理",
        file: () => import("@/content/links/category/audio/processing.json"),
      },
    },
  },

  design: {
    name: "设计",
    children: {
      colors: {
        name: "配色",
        file: () => import("@/content/links/category/design/colors.json"),
      },
      fonts: {
        name: "字体",
        file: () => import("@/content/links/category/design/fonts.json"),
      },
      "image-processing": {
        name: "图像处理",
        file: () =>
          import("@/content/links/category/design/image-processing.json"),
      },
      tools: {
        name: "工具",
        file: () => import("@/content/links/category/design/tools.json"),
      },
    },
  },

  development: {
    name: "开发",
    children: {
      apis: {
        name: "API",
        file: () => import("@/content/links/category/development/apis.json"),
      },
      cloud: {
        name: "云服务",
        file: () => import("@/content/links/category/development/cloud.json"),
      },
      containers: {
        name: "容器",
        file: () =>
          import("@/content/links/category/development/containers.json"),
      },
      databases: {
        name: "数据库",
        file: () =>
          import("@/content/links/category/development/databases.json"),
      },
      frameworks: {
        name: "框架",
        file: () =>
          import("@/content/links/category/development/frameworks.json"),
      },
      git: {
        name: "Git",
        file: () => import("@/content/links/category/development/git.json"),
      },
      hosting: {
        name: "托管",
        file: () => import("@/content/links/category/development/hosting.json"),
      },
      monitoring: {
        name: "监控",
        file: () =>
          import("@/content/links/category/development/monitoring.json"),
      },
      security: {
        name: "安全",
        file: () =>
          import("@/content/links/category/development/security.json"),
      },
      tools: {
        name: "工具",
        file: () => import("@/content/links/category/development/tools.json"),
      },
    },
  },

  office: {
    name: "办公",
    children: {
      documents: {
        name: "文档",
        file: () => import("@/content/links/category/office/documents.json"),
      },
      pdf: {
        name: "PDF",
        file: () => import("@/content/links/category/office/pdf.json"),
      },
    },
  },

  operation: {
    name: "运营",
    children: {
      ecommerce: {
        name: "电商",
        file: () => import("@/content/links/category/operation/ecommerce.json"),
      },
      marketing: {
        name: "营销",
        file: () => import("@/content/links/category/operation/marketing.json"),
      },
    },
  },

  productivity: {
    name: "效率",
    children: {
      browsers: {
        name: "浏览器",
        file: () =>
          import("@/content/links/category/productivity/browsers.json"),
      },
      "cloud-storage": {
        name: "云存储",
        file: () =>
          import("@/content/links/category/productivity/cloud-storage.json"),
      },
      email: {
        name: "邮箱",
        file: () => import("@/content/links/category/productivity/email.json"),
      },
      search: {
        name: "搜索",
        file: () => import("@/content/links/category/productivity/search.json"),
      },
      "system-tools": {
        name: "系统工具",
        file: () =>
          import("@/content/links/category/productivity/system-tools.json"),
      },
    },
  },

  video: {
    name: "视频",
    children: {
      editing: {
        name: "编辑",
        file: () => import("@/content/links/category/video/editing.json"),
      },
    },
  },
};

// 动态导入所有分类数据
async function loadAllLinksData(): Promise<LinksItem[]> {
  const allItems: LinksItem[] = [];

  try {
    // 遍历所有分类
    for (const [categoryId, categoryInfo] of Object.entries(
      categoryStructure,
    )) {
      if ("file" in categoryInfo) {
        // 根目录文件
        try {
          const moduleData = await categoryInfo.file();
          const items = moduleData.default;

          const processedItems = items.map((item: any) => ({
            ...item,
            category: categoryId as any,
            iconType: item.iconType || ("image" as const),
          }));

          allItems.push(...processedItems);
        } catch (error) {
          console.warn(`Failed to load ${categoryId}:`, error);
        }
      } else if ("children" in categoryInfo) {
        // 有子分类的目录
        for (const [subCategoryId, subCategoryInfo] of Object.entries(
          categoryInfo.children,
        )) {
          try {
            const moduleData = await subCategoryInfo.file();
            const items = moduleData.default;

            const processedItems = items.map((item: any) => ({
              ...item,
              category: `${categoryId}/${subCategoryId}` as any,
              iconType: item.iconType || ("image" as const),
            }));

            allItems.push(...processedItems);
          } catch (error) {
            console.warn(
              `Failed to load ${categoryId}/${subCategoryId}:`,
              error,
            );
          }
        }
      }
    }

    return allItems;
  } catch (error) {
    console.error("Error loading links data:", error);
    return [];
  }
}

// 生成分类结构数据
function generateCategoriesData(): LinksCategory[] {
  const categories: LinksCategory[] = [];

  for (const [categoryId, categoryInfo] of Object.entries(categoryStructure)) {
    if ("file" in categoryInfo) {
      // 根目录文件作为独立分类
      categories.push({
        id: categoryId as any,
        name: categoryInfo.name,
        order: categories.length,
      });
    } else if ("children" in categoryInfo) {
      // 有子分类的目录
      const children = Object.entries(categoryInfo.children).map(
        ([subId, subInfo], index) => ({
          id: `${categoryId}/${subId}` as any,
          name: subInfo.name,
          order: index,
        }),
      );

      categories.push({
        id: categoryId as any,
        name: categoryInfo.name,
        order: categories.length,
        collapsible: true,
        children,
      });
    }
  }

  return categories;
}

export { loadAllLinksData, generateCategoriesData, categoryStructure };
