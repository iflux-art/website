/**
 * 文档文件系统工具函数
 * @module lib/docs-fs
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { DocMetaItem, DocSidebarItem } from '@/types/docs';

/**
 * 获取文档目录结构
 * 
 * @param rootDir 根目录路径
 * @param relativePath 相对路径
 * @param meta 元数据配置
 * @returns 文档目录结构
 */
export function getDocDirectoryStructure(
  rootDir: string,
  relativePath: string = '',
  meta: Record<string, DocMetaItem | string> = {}
): DocSidebarItem[] {
  const fullPath = path.join(rootDir, relativePath);
  
  // 检查目录是否存在
  if (!fs.existsSync(fullPath) || !fs.statSync(fullPath).isDirectory()) {
    console.error(`目录不存在: ${fullPath}`);
    return [];
  }
  
  // 读取目录内容
  const items = fs.readdirSync(fullPath, { withFileTypes: true });
  
  // 检查是否存在 _meta.json 文件
  const metaFilePath = path.join(fullPath, '_meta.json');
  let localMeta: Record<string, DocMetaItem | string> = {};
  
  if (fs.existsSync(metaFilePath)) {
    try {
      const metaContent = fs.readFileSync(metaFilePath, 'utf8');
      localMeta = JSON.parse(metaContent);
    } catch (error) {
      console.error(`解析 _meta.json 文件失败: ${metaFilePath}`, error);
    }
  }
  
  // 合并元数据
  const combinedMeta = { ...meta, ...localMeta };
  
  // 获取所有文件和目录
  const files: string[] = [];
  const directories: string[] = [];
  
  items.forEach(item => {
    // 忽略以 _ 或 . 开头的文件和目录
    if (item.name.startsWith('_') || item.name.startsWith('.')) {
      return;
    }
    
    if (item.isDirectory()) {
      directories.push(item.name);
    } else if (item.isFile() && (item.name.endsWith('.md') || item.name.endsWith('.mdx'))) {
      files.push(item.name.replace(/\.(md|mdx)$/, ''));
    }
  });
  
  // 如果有元数据配置，按照元数据配置的顺序排序
  const orderedItems: string[] = [];
  const metaKeys = Object.keys(combinedMeta);
  
  // 首先添加元数据中定义的项目
  metaKeys.forEach(key => {
    // 检查是否是文件或目录
    if (files.includes(key) || directories.includes(key)) {
      orderedItems.push(key);
    }
  });
  
  // 然后添加未在元数据中定义的项目
  [...directories, ...files].forEach(item => {
    if (!orderedItems.includes(item)) {
      orderedItems.push(item);
    }
  });
  
  // 构建侧边栏项目
  return orderedItems.map(item => {
    const itemRelativePath = path.join(relativePath, item);
    const itemFullPath = path.join(rootDir, itemRelativePath);
    const isDirectory = fs.existsSync(itemFullPath) && fs.statSync(itemFullPath).isDirectory();
    
    // 获取元数据配置
    const itemMeta = combinedMeta[item];
    const metaConfig = typeof itemMeta === 'string' ? { title: itemMeta } : itemMeta || {};
    
    // 如果是目录，递归获取子项目
    if (isDirectory) {
      const children = getDocDirectoryStructure(rootDir, itemRelativePath, {});
      
      return {
        title: metaConfig.title || item,
        href: metaConfig.href,
        items: children,
        collapsed: metaConfig.collapsed,
        type: metaConfig.type,
        isExternal: !!metaConfig.href && metaConfig.href.startsWith('http'),
        filePath: itemRelativePath
      };
    }
    
    // 如果是文件，读取文件内容获取标题
    let title = metaConfig.title || item;
    
    try {
      const filePath = path.join(itemFullPath + '.mdx');
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        const { data } = matter(content);
        if (data.title) {
          title = data.title;
        }
      } else {
        const mdFilePath = path.join(itemFullPath + '.md');
        if (fs.existsSync(mdFilePath)) {
          const content = fs.readFileSync(mdFilePath, 'utf8');
          const { data } = matter(content);
          if (data.title) {
            title = data.title;
          }
        }
      }
    } catch (error) {
      console.error(`读取文件内容失败: ${itemFullPath}`, error);
    }
    
    return {
      title,
      href: metaConfig.href || `/docs/${itemRelativePath}`,
      type: metaConfig.type || 'page',
      isExternal: !!metaConfig.href && metaConfig.href.startsWith('http'),
      filePath: itemRelativePath
    };
  });
}

/**
 * 获取文档分类的侧边栏结构
 * 
 * @param category 分类名称
 * @returns 侧边栏结构
 */
export function getDocSidebar(category: string): DocSidebarItem[] {
  const rootDir = path.join(process.cwd(), 'src', 'content', 'docs');
  const categoryPath = path.join(rootDir, category);
  
  if (!fs.existsSync(categoryPath) || !fs.statSync(categoryPath).isDirectory()) {
    console.error(`分类不存在: ${category}`);
    return [];
  }
  
  return getDocDirectoryStructure(rootDir, category);
}
