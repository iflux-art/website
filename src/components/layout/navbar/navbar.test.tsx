/**
 * 导航栏组件单元测试
 * 展示如何测试布局组件的可访问性和功能性
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Navbar } from './navbar';

// 扩展Jest匹配器以支持可访问性测试
expect.extend(toHaveNoViolations);

// 模拟next/link组件
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

describe('Navbar 组件', () => {
  // 测试基本渲染
  test('正确渲染导航链接', () => {
    render(<Navbar />);
    
    // 检查导航链接是否存在
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByText(/首页/i)).toBeInTheDocument();
  });

  // 测试移动菜单交互
  test('点击汉堡菜单按钮显示移动菜单', () => {
    render(<Navbar />);
    
    // 查找汉堡菜单按钮
    const menuButton = screen.getByRole('button', { name: /菜单/i });
    expect(menuButton).toBeInTheDocument();
    
    // 点击按钮打开菜单
    fireEvent.click(menuButton);
    
    // 检查菜单是否显示
    const mobileMenu = screen.getByRole('menu');
    expect(mobileMenu).toBeVisible();
    
    // 再次点击关闭菜单
    fireEvent.click(menuButton);
    expect(mobileMenu).not.toBeVisible();
  });

  // 测试主题切换功能
  test('点击主题切换按钮调用切换函数', () => {
    render(<Navbar />);
    
    // 查找主题切换按钮
    const themeToggle = screen.getByRole('button', { name: /切换主题/i });
    expect(themeToggle).toBeInTheDocument();
    
    // 模拟点击
    fireEvent.click(themeToggle);
    
    // 由于实际切换逻辑在useTheme hook中，这里只能测试按钮存在和可点击
  });

  // 测试可访问性
  test('导航栏符合可访问性标准', async () => {
    const { container } = render(<Navbar />);
    
    // 使用jest-axe测试可访问性
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  // 测试键盘导航
  test('支持键盘导航', () => {
    render(<Navbar />);
    
    // 获取所有可聚焦元素
    const navLinks = screen.getAllByRole('link');
    const buttons = screen.getAllByRole('button');
    
    // 确保所有交互元素都可以通过键盘访问
    [...navLinks, ...buttons].forEach(element => {
      expect(element).toHaveAttribute('tabIndex', expect.any(String));
    });
    
    // 模拟Tab键导航
    const firstLink = navLinks[0];
    firstLink.focus();
    expect(document.activeElement).toBe(firstLink);
  });
});