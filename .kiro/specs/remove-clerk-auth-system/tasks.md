# 移除 Clerk 验证系统实施计划

- [x] 1. 移除 Clerk 相关依赖和配置





  - 从 package.json 中移除 @clerk/nextjs, @clerk/elements, @clerk/types 依赖包
  - 清理环境变量文件中的 Clerk 相关配置
  - 更新 .env.example 文件移除 Clerk 相关环境变量示例
  - _需求: 2.1, 2.2, 2.4, 2.5_

- [x] 2. 删除身份验证相关页面和路由





  - [x] 2.1 删除登录注册页面


    - 删除 src/app/sign-in/[[...sign-in]]/page.tsx 文件
    - 删除 src/app/sign-up/[[...sign-up]]/page.tsx 文件
    - 删除 src/app/auth/callback/page.tsx 文件
    - _需求: 4.2_

  - [x] 2.2 删除管理后台页面


    - 删除 src/app/admin/page.tsx 文件
    - 删除整个 src/app/admin 目录（如果存在子页面）
    - _需求: 3.2, 3.3_

  - [x] 2.3 删除网址导航页面


    - 删除 src/app/links/page.tsx 文件
    - _需求: 3.1_

- [x] 3. 移除身份验证功能模块





  - [x] 3.1 删除 auth 功能模块


    - 删除整个 src/features/auth 目录及其所有子文件
    - _需求: 4.1, 5.1_

  - [x] 3.2 删除 admin 功能模块


    - 删除整个 src/features/admin 目录及其所有子文件
    - _需求: 4.1, 5.2_

  - [x] 3.3 删除 links 功能模块


    - 删除整个 src/features/links 目录及其所有子文件
    - _需求: 4.1, 5.3_

- [x] 4. 创建独立的友链数据模型





  - [x] 4.1 创建友链专用类型定义


    - 在 src/features/friends/types 中创建独立的友链数据类型
    - 定义 FriendLink 接口替代对 LinksItem 的依赖
    - _需求: 1.4_

  - [x] 4.2 重构友链相关组件


    - 修改 src/features/friends/components/friends-page-container.tsx 使用新的数据类型
    - 更新友链相关的 hooks 和服务
    - _需求: 1.4_

- [x] 5. 移除身份验证相关状态存储





  - [x] 5.1 删除身份验证状态存储


    - 删除 src/stores/auth-store.standard.ts 文件
    - _需求: 4.3, 5.1_

  - [x] 5.2 删除管理相关状态存储


    - 删除 src/stores/admin-store.standard.ts 文件
    - 删除 src/stores/links-data-store.standard.ts 文件
    - 删除 src/stores/link-filter-store.standard.ts 文件
    - _需求: 4.3, 5.2, 5.3_

  - [x] 5.3 更新状态存储导出


    - 修改 src/stores/index.ts 移除已删除状态存储的导出
    - _需求: 5.4_

- [x] 6. 修改应用根布局





  - 修改 src/app/layout.tsx 移除 ClerkProvider 包装器
  - 更新导入语句移除 Clerk 相关导入
  - 确保应用仍能正常渲染
  - _需求: 2.3, 4.1_

- [x] 7. 更新中间件配置


  - [x] 7.1 移除 Clerk 中间件


    - 修改 src/middleware.ts 移除 clerkMiddleware 和相关导入
    - 移除路由保护逻辑（isProtectedRoute）
    - _需求: 2.2, 2.3_

  - [x] 7.2 简化 CSP 配置


    - 从 CSP_CONFIG 中移除所有 Clerk 相关的域名和资源
    - 更新安全头配置移除 Clerk 特定配置
    - _需求: 2.5_

- [x] 8. 更新导航配置和组件





  - [x] 8.1 更新导航配置


    - 修改 src/components/layout/navbar/nav-config.ts 移除 links 相关配置
    - 移除 ADMIN_MENU_ITEMS 配置
    - 更新 NAV_PATHS 移除 links 路径映射
    - _需求: 6.4, 3.4_

  - [x] 8.2 修改导航菜单组件


    - 修改 src/components/layout/navbar/nav-card-menu.tsx 移除管理菜单相关代码
    - 移除 useUser hook 的使用和条件渲染逻辑
    - 移除 AdminMenu 组件
    - _需求: 6.1, 6.2, 6.5_

- [x] 9. 清理相关导入和引用





  - [x] 9.1 清理组件导入


    - 搜索并移除所有指向已删除 features 的导入语句
    - 更新 src/features/home/hooks/use-site-stats.ts 移除 links 相关统计
    - _需求: 5.4_

  - [x] 9.2 清理类型导入


    - 搜索并移除所有 LinksItem, LinksCategory 等已删除类型的导入
    - 更新相关组件使用新的友链数据类型
    - _需求: 5.4_

- [ ] 10. 更新测试文件
  - [ ] 10.1 删除相关测试文件
    - 删除 src/stores/__tests__/admin-store.test.ts 文件
    - 删除所有 auth, admin, links 功能相关的测试文件
    - _需求: 5.1, 5.2, 5.3_

  - [ ] 10.2 更新保留的测试文件
    - 修改 src/features/friends/hooks/__tests__/use-friends-state.test.ts 使用新的数据类型
    - 更新其他可能引用已删除类型的测试文件
    - _需求: 1.4_

- [ ] 11. 验证核心页面功能
  - [ ] 11.1 测试首页功能
    - 验证首页（/）正常加载和显示
    - 确保首页不包含任何身份验证相关组件
    - _需求: 1.1_

  - [ ] 11.2 测试博客页面功能
    - 验证博客页面（/blog）正常加载和显示
    - 确保博客功能不受 Clerk 移除影响
    - _需求: 1.2_

  - [ ] 11.3 测试文档页面功能
    - 验证文档页面（/docs）正常加载和显示
    - 确保文档功能不受 Clerk 移除影响
    - _需求: 1.3_

  - [ ] 11.4 测试友链页面功能
    - 验证友链页面（/friends）正常加载和显示
    - 确保友链功能使用新的数据模型正常工作
    - _需求: 1.4_

  - [ ] 11.5 测试关于页面功能
    - 验证关于页面（/about）正常加载和显示
    - 确保关于页面功能不受 Clerk 移除影响
    - _需求: 1.5_

- [ ] 12. 验证已删除页面返回 404
  - [ ] 12.1 测试 links 页面 404
    - 验证访问 /links 返回 404 错误页面
    - _需求: 3.1_

  - [ ] 12.2 测试 admin 页面 404
    - 验证访问 /admin 返回 404 错误页面
    - 验证访问任何 /admin/* 子路径返回 404 错误页面
    - _需求: 3.2, 3.3_

- [ ] 13. 最终构建和部署测试
  - [ ] 13.1 本地构建测试
    - 运行 npm run build 确保应用能成功构建
    - 运行 npm run start 确保生产版本正常启动
    - _需求: 2.1_

  - [ ] 13.2 功能回归测试
    - 手动测试所有保留页面的完整功能
    - 验证导航菜单只显示可用页面链接
    - 确保没有控制台错误或警告
    - _需求: 1.1, 1.2, 1.3, 1.4, 1.5, 6.1, 6.2_