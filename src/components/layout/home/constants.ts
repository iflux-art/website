/**
 * 首页相关常量配置
 * 统一管理首页的各种配置数据
 */

import {
  Code,
  Palette,
  Lightbulb,
  Pencil,
  BookOpen,
  FileText,
  Compass,
  Github,
} from 'lucide-react';

// 根据时间段的问候语数据
export const GREETINGS_BY_TIME = {
  // 早上（6:00-10:00）
  morning: [
    '美好的一天开始啦！',
    '早安打工人！',
    '咖啡加满，烦恼减半',
    '今天的KPI是活着下班！',
    '早八人集合！',
    '叮！您的人形闹钟上线！',
    '太阳晒屁股啦！',
    '再不起床，老板要扣钱啦！',
    '早上好，今天也要元气满满！',
    '新的一天，新的开始，努力加油！',
    '阳光明媚，心情也要跟着好起来！',
    '早起的鸟儿有虫吃，快来享受美好的一天！',
    '今天的目标：让自己开心！',
    '早晨的第一杯水，给你一天的活力！',
    '清晨的阳光，照亮你前行的路！',
    '早安，今天也要做最好的自己！',
    '起床啦，世界在等着你去探索！',
    '早晨的空气是最清新的，深呼吸，开始新的一天！',
    '今天的你，值得拥有最好的！',
    '早安，给自己一个微笑，迎接新挑战！',
    '早晨的第一缕阳光，带来无限可能！',
    '新的一天，新的机会，抓住它！',
    '早安，愿你今天的每一刻都充满惊喜！',
    '早起的你，已经赢了大半天！',
    '今天的你，注定不平凡！',
    '早安，愿你心想事成，万事如意！',
    '清晨的第一声问候，愿你拥有美好的一天！',
  ],
  // 中午（11:00-13:00）
  noon: [
    '干饭不积极，思想有问题！',
    '请速速充值生命值！',
    '午睡是人类进步的阶梯',
    '你趴桌流口水的样子很可爱~',
    "开启'进食+摸鱼'双充模式",
    '午餐时间到，别忘了给自己加油！',
    '吃饱了才有力气继续奋斗！',
    '午餐是一天中最重要的仪式！',
    '别让工作占据了你的胃，快去吃饭吧！',
    '午餐时间，放松一下，给自己充充电！',
    '吃好喝好，才能更好地工作！',
    '午餐是对自己辛苦工作的奖励！',
    '别再盯着屏幕了，去享受美食吧！',
    '午餐时间，给自己一个小小的放松！',
    '吃饭的时候，别忘了喝水哦！',
    '午餐是一天的中场休息，别错过！',
    '给自己一个美味的午餐，继续加油！',
    '午餐时间，放下工作，享受美好！',
    '吃好午餐，才能有力气迎接下午的挑战！',
    '午餐是一天中最幸福的时刻！',
    '别让工作压垮你，午餐时间好好犒劳自己！',
    '午餐时间，给自己一个小小的奖励！',
    '吃饱了，才能更好地思考！',
    '午餐是一天中最值得期待的时刻！',
    '午餐时间，放松心情，享受美食！',
  ],
  // 下午（14:00-17:00）
  afternoon: [
    '下午茶时间到！',
    '奶茶是成年人的甜甜圈',
    '撑住！马上就要下班啦！',
    '下午的阳光，正好适合小憩一会！',
    '工作再忙，也要记得喝水哦！',
    '放松一下，给自己来杯咖啡！',
    '下午的时光，适合思考和创作！',
    '别忘了，下午茶是一天的甜蜜时刻！',
    '给自己一个短暂的休息，重新出发！',
    '下午的工作效率，往往在于心态！',
    '小憩片刻，灵感会悄然而至！',
    '下午的阳光，照亮了你的努力！',
    '工作之余，来一段轻松的音乐吧！',
    '别让疲惫打败你，给自己加油！',
    '下午的时光，适合与朋友分享！',
    '放下工作，享受一杯美味的饮品！',
    '给自己一个微笑，迎接新的挑战！',
    '下午的时光，适合反思与总结！',
    '别忘了，努力的同时也要享受生活！',
    '下午的阳光，温暖而不刺眼！',
    '给自己一个小小的奖励，继续前行！',
    '下午的时光，适合计划明天的目标！',
    '放松心情，享受这段美好的时光！',
  ],
  // 晚上（18:00-23:00）
  evening: [
    "请切换至'躺平模式'",
    '警告手机：禁止弹出工作消息！',
    '游戏虽好，健康更重要',
    '晚安全宇宙！',
    '夜深了，别忘了给自己一个放松的时刻！',
    '今晚的月亮特别圆，适合思考人生！',
    '放下工作，享受一杯热茶，温暖心灵！',
    '夜晚是创作的最佳时机，灵感随时可能降临！',
    '别让工作占据你的夜晚，给自己一点时间！',
    '夜晚的星空，点亮你心中的梦想！',
    '放松心情，听一段轻音乐，享受宁静！',
    '夜晚是思考的时刻，整理一下明天的计划！',
    '给自己一个小小的奖励，享受美味的夜宵！',
    '夜深人静，适合读一本好书，沉浸其中！',
    '别忘了给自己一个美好的晚安，明天会更好！',
    '夜晚的时光，适合与朋友分享快乐！',
    '放下手机，享受与家人共度的温馨时光！',
    '夜晚是放飞自我的时刻，尽情享受吧！',
    '给自己一个放松的夜晚，明天再出发！',
    '夜晚的宁静，给你带来无限的思考空间！',
    '享受夜晚的美好，明天再继续奋斗！',
    '夜晚是梦想的起点，勇敢追逐吧！',
    '给自己一个温暖的拥抱，晚安！',
    '夜晚的每一刻，都是新的开始！',
  ],
  // 凌晨（0:00-5:00）
  lateNight: [
    "您已进入'阴间作息区'",
    "建议立即执行'躺倒关机'指令！",
    '秃头预警！',
    '你的头发正在连夜离家出走…',
    '月亮不睡你不睡，水滴筹里你最贵！',
    '速速睡觉，这是命令',
    '凌晨的星空，诉说着无尽的梦想！',
    '夜深人静，思绪如潮水般涌来！',
    '在这个静谧的时刻，给自己一个小小的愿望！',
    '月光洒在窗前，仿佛在为你加油！',
    '深夜的咖啡，伴随你思考人生的意义！',
    '黑夜是创作的最佳时机，灵感随时可能降临！',
    '在这个时刻，放下所有的烦恼，享受宁静！',
    '夜深了，别忘了给自己一个温暖的拥抱！',
    '在星空下，许下一个美好的愿望！',
    '深夜的思考，往往能带来意想不到的启发！',
    '月亮是夜的守护者，陪伴你度过每一个孤独的时刻！',
    '在这个时刻，给自己一个小小的奖励！',
    '夜晚的宁静，给你带来无限的思考空间！',
    '深夜的时光，适合与自己对话！',
    '在这个时刻，放下手机，享受与自己独处的时光！',
    '夜深了，给自己一个放松的时刻，明天再出发！',
    '在这个静谧的时刻，思考明天的目标！',
    '夜晚是梦想的起点，勇敢追逐吧！',
    '在星空下，感受生命的美好与奇妙！',
    '深夜的时光，适合反思与总结！',
  ],
} as const;

// 推荐标签数据
export const RECOMMENDATION_TAGS = {
  initial: [
    { icon: Code, text: '网页开发', href: '/docs/web-development' },
    { icon: Palette, text: '深入研究', href: '/docs/research' },
    { icon: Lightbulb, text: '项目模式', href: '/docs/project-patterns' },
    { icon: Pencil, text: '图像生成', href: '/docs/image-generation' },
  ],
  more: [
    { icon: BookOpen, text: '文档中心', href: '/docs' },
    { icon: FileText, text: '博客文章', href: '/blog' },
    { icon: Compass, text: '网址导航', href: '/navigation' },
    { icon: Github, text: 'GitHub', href: 'https://github.com/iflux-art/web' },
  ],
} as const;

// 搜索引擎配置
export const SEARCH_ENGINES = [
  { id: 'local', name: '本地搜索' },
  { id: 'web', name: '联网搜索' },
] as const;

// AI模型配置
export const AI_MODELS = [
  {
    id: 'none',
    name: '仅搜索',
    description: '只进行搜索，不使用AI回答',
  },
  {
    id: 'deepseek-chat',
    name: 'DeepSeek Chat',
    description: '强大的中文对话模型',
  },
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    description: '快速响应的轻量级模型',
  },
  {
    id: 'claude-3-haiku',
    name: 'Claude 3 Haiku',
    description: '平衡性能与速度的模型',
  },
] as const;

// 背景样式类型
export const BACKGROUND_STYLES = [
  'default',
  'particles',
  'gradient-mesh',
  'noise',
  'wave',
  'geometric',
] as const;

// 时间段类型
export type TimeOfDay = keyof typeof GREETINGS_BY_TIME;

// 背景样式类型
export type BackgroundStyle = (typeof BACKGROUND_STYLES)[number];

// 搜索引擎类型
export type SearchEngineId = (typeof SEARCH_ENGINES)[number]['id'];

// AI模型类型
export type AIModelId = (typeof AI_MODELS)[number]['id'];

// 工具数据
export const TOOLS = [
  {
    id: 'json-formatter',
    name: 'JSON 格式化',
    description: '格式化和验证JSON数据',
    path: '/tools/json-formatter',
    tags: ['JSON', '格式化', '验证'],
  },
  {
    id: 'base64-encoder',
    name: 'Base64 编解码',
    description: 'Base64编码和解码工具',
    path: '/tools/base64-encoder',
    tags: ['Base64', '编码', '解码'],
  },
  {
    id: 'url-encoder',
    name: 'URL 编解码',
    description: 'URL编码和解码工具',
    path: '/tools/url-encoder',
    tags: ['URL', '编码', '解码'],
  },
  {
    id: 'password-generator',
    name: '密码生成器',
    description: '生成安全的随机密码',
    path: '/tools/password-generator',
    tags: ['密码', '生成器', '安全'],
  },
  {
    id: 'uuid-generator',
    name: 'UUID 生成器',
    description: '生成各种版本的UUID',
    path: '/tools/uuid-generator',
    tags: ['UUID', '生成器', '唯一标识'],
  },
  {
    id: 'hash-generator',
    name: '哈希生成器',
    description: '生成MD5、SHA等哈希值',
    path: '/tools/hash-generator',
    tags: ['哈希', 'MD5', 'SHA'],
  },
  {
    id: 'regex-tester',
    name: '正则表达式测试',
    description: '测试和验证正则表达式',
    path: '/tools/regex-tester',
    tags: ['正则', '测试', '验证'],
  },
  {
    id: 'timestamp-converter',
    name: '时间戳转换',
    description: '时间戳与日期时间相互转换',
    path: '/tools/timestamp-converter',
    tags: ['时间戳', '转换', '日期'],
  },
  {
    id: 'qr-generator',
    name: '二维码生成器',
    description: '生成各种类型的二维码',
    path: '/tools/qr-generator',
    tags: ['二维码', '生成器', 'QR'],
  },
  {
    id: 'color-picker',
    name: '颜色选择器',
    description: '选择和转换颜色格式',
    path: '/tools/color-picker',
    tags: ['颜色', '选择器', '转换'],
  },
] as const;

// 网址导航数据
export const NAVIGATION_SITES = [
  {
    name: 'GitHub',
    description: '全球最大的代码托管平台',
    url: 'https://github.com',
    category: '开发工具',
  },
  {
    name: 'Stack Overflow',
    description: '程序员问答社区',
    url: 'https://stackoverflow.com',
    category: '开发工具',
  },
  {
    name: 'MDN Web Docs',
    description: 'Web开发文档和教程',
    url: 'https://developer.mozilla.org',
    category: '文档',
  },
  {
    name: 'Can I Use',
    description: '浏览器兼容性查询',
    url: 'https://caniuse.com',
    category: '开发工具',
  },
  {
    name: 'CodePen',
    description: '在线代码编辑器',
    url: 'https://codepen.io',
    category: '开发工具',
  },
  {
    name: 'Figma',
    description: '在线设计协作工具',
    url: 'https://figma.com',
    category: '设计工具',
  },
  {
    name: 'Dribbble',
    description: '设计师作品展示平台',
    url: 'https://dribbble.com',
    category: '设计工具',
  },
  {
    name: 'Unsplash',
    description: '免费高质量图片库',
    url: 'https://unsplash.com',
    category: '素材',
  },
] as const;
