# 组件审计报告

生成时间: 2025/5/19 23:06:11

## 组件统计

| 类别 | 数量 |
|------|------|
| ui | 30 |
| features | 36 |
| layout | 24 |
| uncategorized | 2 |
| **总计** | **92** |

## 组件问题

共发现 89 个组件存在问题：

| 组件名 | 类别 | 问题 |
|--------|------|------|
| author-card | uncategorized | 缺少注释, 不在独立目录中 |
| author-card | features | 不在独立目录中 |
| blog-card | features | 不在独立目录中 |
| blog-content | features | 不在独立目录中 |
| blog-list | features | 不在独立目录中 |
| blog-sidebar | features | 不在独立目录中 |
| post-card | features | 缺少注释, 不在独立目录中 |
| related-posts | features | 不在独立目录中 |
| tag-cloud | features | 不在独立目录中 |
| card-list.test | features | 缺少类型定义, 缺少导出, 不在独立目录中 |
| card-list | features | 缺少index导出文件 |
| advertisement-card | features | 缺少类型定义, 缺少注释, 不在独立目录中 |
| back-to-top-button | features | 不在独立目录中 |
| breadcrumb | features | 不在独立目录中 |
| category-card | features | 缺少注释, 不在独立目录中 |
| doc-category-card | features | 缺少注释, 不在独立目录中 |
| toc-client-wrapper | features | 不在独立目录中 |
| toc-improved | features | 不在独立目录中 |
| toc | features | 缺少index导出文件 |
| doc-category-card | features | 不在独立目录中 |
| recent-docs-list | features | 不在独立目录中 |
| doc-sidebar | features | 不在独立目录中 |
| sidebar-improved | features | 不在独立目录中 |
| friend-card | features | 不在独立目录中 |
| friend-cards | features | 不在独立目录中 |
| friend-link-application | features | 不在独立目录中 |
| friend-link-card | features | 不在独立目录中 |
| logo | features | 缺少类型定义, 缺少注释 |
| category-card | features | 不在独立目录中 |
| category-page | features | 不在独立目录中 |
| resource-card | features | 不在独立目录中 |
| resource-filter | features | 不在独立目录中 |
| resource-list | features | 不在独立目录中 |
| search-dialog | features | 缺少类型定义, 不在独立目录中 |
| theme-toggle | features | 缺少类型定义 |
| travelling | features | 缺少类型定义 |
| footer | layout | 缺少类型定义, 缺少注释 |
| blog-posts-section | layout | 不在独立目录中 |
| blog-section | layout | 不在独立目录中 |
| contact-section | layout | 缺少类型定义, 缺少注释, 不在独立目录中 |
| cta-section | layout | 不在独立目录中 |
| feature-card | layout | 缺少注释, 不在独立目录中 |
| feature-cards | layout | 缺少注释, 不在独立目录中 |
| features-section | layout | 不在独立目录中 |
| friends-section | layout | 缺少类型定义, 不在独立目录中 |
| fullscreen-scroll-controller | layout | 不在独立目录中 |
| hero-section | layout | 不在独立目录中 |
| navigation-section | layout | 缺少类型定义, 不在独立目录中 |
| new-contact-section | layout | 缺少类型定义, 不在独立目录中 |
| new-friends-section | layout | 不在独立目录中 |
| new-hero-section | layout | 缺少类型定义, 不在独立目录中 |
| new-navigation-section | layout | 不在独立目录中 |
| scroll-indicator | layout | 不在独立目录中 |
| mobile-menu | layout | 不在独立目录中 |
| nav-items | layout | 缺少类型定义, 不在独立目录中 |
| navbar.test | layout | 缺少类型定义, 缺少导出, 不在独立目录中 |
| navbar | layout | 缺少类型定义 |
| category-card | layout | 缺少注释, 不在独立目录中 |
| page-transition | layout | 不在独立目录中 |
| alert | ui | 缺少注释, 不在独立目录中 |
| scroll-animation | ui | 不在独立目录中 |
| animation-sequence | ui | 不在独立目录中 |
| avatar | ui | 缺少类型定义, 缺少注释 |
| button.test | ui | 缺少类型定义, 缺少导出, 不在独立目录中 |
| button | ui | 缺少注释 |
| card | ui | 缺少类型定义, 缺少注释 |
| collapsible | ui | 缺少类型定义, 缺少注释 |
| command | ui | 缺少注释 |
| dialog | ui | 缺少注释 |
| fullscreen-scroll | ui | 不在独立目录中 |
| input | ui | 缺少注释 |
| lazy-component | ui | 不在独立目录中 |
| lazy-image | ui | 不在独立目录中 |
| callout | ui | 缺少注释, 不在独立目录中 |
| code-block | ui | 不在独立目录中 |
| code-group | ui | 不在独立目录中 |
| copy | ui | 缺少类型定义, 不在独立目录中 |
| enhanced-table | ui | 缺少注释, 不在独立目录中 |
| image | ui | 不在独立目录中 |
| link | ui | 不在独立目录中 |
| mdx-typography | ui | 不在独立目录中 |
| note | ui | 不在独立目录中 |
| outlet | ui | 不在独立目录中 |
| pre | ui | 不在独立目录中 |
| stepper | ui | 不在独立目录中 |
| page-transition | ui | 不在独立目录中 |
| scroll-animation | ui | 不在独立目录中 |
| sheet | ui | 缺少注释 |
| textarea | ui | 缺少注释, 不在独立目录中 |

## 重构建议

- 为 20 个组件添加类型定义
- 为 23 个组件添加注释
- 将 74 个组件移动到独立目录
- 为 2 个组件创建index导出文件
