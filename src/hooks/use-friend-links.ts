/**
 * 友情链接钩子函数
 * @module hooks/use-friend-links
 */

import { useState, useEffect } from 'react';
import { friendLinks, friendLinkRequirements } from '@/data/friends';
import { FriendLink } from '@/components/features/friends/friend-link-card';

/**
 * 友情链接钩子函数返回类型
 */
interface UseFriendLinksReturn {
  /**
   * 友情链接列表
   */
  links: FriendLink[];
  
  /**
   * 友情链接申请条件
   */
  requirements: string[];
  
  /**
   * 申请友情链接
   * @param name 网站名称
   * @param url 网站地址
   * @param desc 网站描述
   * @param icon 网站图标
   */
  applyFriendLink: (name: string, url: string, desc: string, icon: { type: 'emoji' | 'image'; value: string }) => void;
}

/**
 * 友情链接钩子函数
 * @returns 友情链接数据和操作
 */
export function useFriendLinks(): UseFriendLinksReturn {
  const [links, setLinks] = useState<FriendLink[]>(friendLinks);
  
  // 申请友情链接
  const applyFriendLink = (name: string, url: string, desc: string, icon: { type: 'emoji' | 'image'; value: string }) => {
    // 这里可以添加申请逻辑，例如发送请求到服务器
    console.log('申请友情链接:', { name, url, desc, icon });
    alert('感谢您的申请，我们会尽快审核！');
  };
  
  return {
    links,
    requirements: friendLinkRequirements,
    applyFriendLink
  };
}
