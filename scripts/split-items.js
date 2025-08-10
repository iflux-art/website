const fs = require("fs");
const path = require("path");

// Paths
const ITEMS_PATH = path.join("src", "content", "links", "items", "items.json");
const CATEGORY_BASE_DIR = path.join("src", "content", "links", "category");

// Ensure file exists
function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(filePath, data) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
}

// Categorization mapping similar to process-links.js
function categorizeItem(item) {
  const { category, tags = [], description = "", title = "" } = item;
  const text = [title, description, ...tags].join(" ");

  // Normalize helper
  const hasAnyTag = (arr) => tags.some((t) => arr.includes(t));

  if (category === "ai-chat") return "ai/chat";

  if (category === "ai") {
    if (hasAnyTag(["大语言模型", "AI对话", "智能助手", "多模态", "大模型"]))
      return "ai/chat";
    if (hasAnyTag(["API平台", "开发者资源", "模型接口", "API", "开发平台"]))
      return "ai/api";
    if (hasAnyTag(["部署工具", "套壳应用", "浏览器插件"])) return "ai/tools";
    if (hasAnyTag(["订阅平台"])) return "ai/services";
    if (hasAnyTag(["教程", "官方文档", "学习资源", "社区", "行业标准"]))
      return "ai/resources";
    if (hasAnyTag(["套盒应用"])) return "ai/platforms";
    if (hasAnyTag(["视频生成", "AIGC", "内容创作"])) return "ai/creative";
    // default bucket for AI if unsure
    return "ai/tools";
  }

  if (category === "development") {
    if (hasAnyTag(["云服务"])) return "development/tools";
    return "development/frameworks";
  }

  if (category === "productivity") {
    if (hasAnyTag(["搜索", "搜索引擎", "学术搜索"]))
      return "productivity/search";
    if (hasAnyTag(["翻译", "翻译工具"])) return "productivity/translation";
    if (hasAnyTag(["浏览器", "浏览器插件"])) return "productivity/browsers";
    if (hasAnyTag(["邮箱", "邮件"])) return "productivity/email";
    if (hasAnyTag(["云存储", "网盘"])) return "productivity/cloud-storage";
    if (hasAnyTag(["系统工具", "效率工具"])) return "productivity/system-tools";
    return "productivity/tools";
  }

  if (category === "design") {
    if (hasAnyTag(["配色", "颜色工具"])) return "design/colors";
    if (hasAnyTag(["字体", "字体资源"])) return "design/fonts";
    if (hasAnyTag(["图像处理", "图片编辑"])) return "design/image-processing";
    return "design/tools";
  }

  if (category === "audio") {
    if (hasAnyTag(["音频处理", "音频编辑"])) return "audio/processing";
    if (hasAnyTag(["DAW", "音乐制作"])) return "audio/daw";
    if (hasAnyTag(["音乐发行", "音频分发"])) return "audio/distribution";
    if (hasAnyTag(["音频资源", "音效库"])) return "audio/resources";
    return "audio/tools";
  }

  if (category === "operation") {
    if (hasAnyTag(["营销", "市场营销"])) return "operation/marketing";
    if (hasAnyTag(["社交媒体", "社交平台"])) return "operation/social-media";
    if (hasAnyTag(["电商", "电子商务"])) return "operation/ecommerce";
    if (hasAnyTag(["视频平台"])) return "operation/video-platforms";
    return "operation/tools";
  }

  if (category === "office") {
    if (hasAnyTag(["文档处理", "文档工具"])) return "office/documents";
    if (hasAnyTag(["PDF", "PDF工具"])) return "office/pdf";
    if (hasAnyTag(["演示", "PPT", "AIPPT"])) return "office/presentation";
    if (hasAnyTag(["笔记", "笔记工具"])) return "office/notes";
    if (hasAnyTag(["思维导图"])) return "office/mindmaps";
    if (hasAnyTag(["OCR", "文字识别"])) return "office/ocr";
    return "office/tools";
  }

  if (category === "video") {
    return "video/editing";
  }

  // profile/friends or others remain as-is (root-level)
  return category;
}

function hyphenCategory(categoryPath) {
  // Convert e.g., "ai/chat" => "ai-chat"
  return categoryPath.includes("/")
    ? categoryPath.replace("/", "-")
    : categoryPath;
}

function groupBy(arr, keyFn) {
  return arr.reduce((acc, item) => {
    const key = keyFn(item);
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});
}

function main() {
  const onlyArg = process.argv.find((a) => a.startsWith("--only="));
  const onlyPrefix = onlyArg ? onlyArg.split("=")[1] : null; // e.g., 'ai'

  const items = readJson(ITEMS_PATH);

  // 1) Update categories for all items based on mapping
  const updated = items.map((it) => {
    const newPath = categorizeItem(it);
    return { ...it, category: newPath };
  });

  // 2) Pick which categories to split this run
  const toSplit = updated.filter((it) =>
    onlyPrefix ? it.category.startsWith(onlyPrefix + "/") : true,
  );
  const keep = updated.filter((it) =>
    onlyPrefix ? !it.category.startsWith(onlyPrefix + "/") : false,
  );

  // 3) Split to files under category folder
  const byCategory = groupBy(toSplit, (it) => it.category);

  let totalAdded = 0;
  let totalSkippedDup = 0;
  const report = [];

  for (const [categoryPath, itemsOfCat] of Object.entries(byCategory)) {
    const [top, sub] = categoryPath.split("/");
    if (!top || !sub) continue; // skip root-level here

    const targetFile = path.join(CATEGORY_BASE_DIR, top, `${sub}.json`);

    let existing = [];
    if (fs.existsSync(targetFile)) {
      try {
        existing = readJson(targetFile);
      } catch (e) {
        console.warn(`Failed to read ${targetFile}, initializing as empty.`);
        existing = [];
      }
    }

    const existingByUrl = new Map(
      existing.map((e) => [String(e.url).toLowerCase(), e]),
    );

    // Normalize category field to hyphen form for target files
    const targetCategoryId = hyphenCategory(categoryPath);

    let added = 0;
    let dup = 0;
    for (const item of itemsOfCat) {
      const key = String(item.url).toLowerCase();
      if (existingByUrl.has(key)) {
        dup++;
        continue;
      }
      existing.push({ ...item, category: targetCategoryId });
      existingByUrl.set(key, true);
      added++;
    }

    // Sort existing by createdAt ascending (fallback by title)
    existing.sort((a, b) => {
      const ta = a.createdAt || "";
      const tb = b.createdAt || "";
      if (ta && tb) return ta.localeCompare(tb);
      return (a.title || "").localeCompare(b.title || "");
    });

    writeJson(targetFile, existing);
    totalAdded += added;
    totalSkippedDup += dup;
    report.push({
      categoryPath,
      targetFile,
      added,
      dup,
      finalCount: existing.length,
    });
  }

  // 4) Write back remaining items to items.json (keeping updated categories)
  writeJson(ITEMS_PATH, keep);

  // 5) Console report
  console.log(
    `Processed ${toSplit.length} items for splitting${onlyPrefix ? ` (only=${onlyPrefix})` : ""}.`,
  );
  console.log(
    `Added ${totalAdded} new items across ${Object.keys(byCategory).length} categories.`,
  );
  console.log(`Skipped ${totalSkippedDup} duplicates (by URL).`);
  console.log(`Remaining items kept in ${ITEMS_PATH}: ${keep.length}`);
  console.log("Per-category results:");
  for (const r of report) {
    console.log(
      ` - ${r.categoryPath} -> ${r.added} added (${r.dup} dups), total ${r.finalCount}. File: ${r.targetFile}`,
    );
  }
}

if (require.main === module) {
  try {
    main();
  } catch (e) {
    console.error("Error during split:", e);
    process.exit(1);
  }
}
