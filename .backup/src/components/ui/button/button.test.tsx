/**
 * 按钮组件单元测试
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './button';

describe('Button 组件', () => {
  // 测试基本渲染
  test('正确渲染按钮文本', () => {
    render(<Button>测试按钮</Button>);
    expect(screen.getByRole('button', { name: /测试按钮/i })).toBeInTheDocument();
  });

  // 测试不同变体
  test('渲染不同变体的按钮', () => {
    const { rerender } = render(<Button variant="default">默认按钮</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-primary');

    rerender(<Button variant="destructive">危险按钮</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-destructive');

    rerender(<Button variant="outline">轮廓按钮</Button>);
    expect(screen.getByRole('button')).toHaveClass('border');
  });

  // 测试不同尺寸
  test('渲染不同尺寸的按钮', () => {
    const { rerender } = render(<Button size="default">默认尺寸</Button>);
    expect(screen.getByRole('button')).toHaveClass('h-10');

    rerender(<Button size="sm">小尺寸</Button>);
    expect(screen.getByRole('button')).toHaveClass('h-9');

    rerender(<Button size="lg">大尺寸</Button>);
    expect(screen.getByRole('button')).toHaveClass('h-11');
  });

  // 测试点击事件
  test('点击按钮触发onClick事件', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>点击按钮</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  // 测试禁用状态
  test('禁用状态下按钮不可点击', () => {
    const handleClick = jest.fn();
    render(<Button disabled onClick={handleClick}>禁用按钮</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  // 测试可访问性
  test('按钮具有正确的可访问性属性', () => {
    render(<Button aria-label="可访问按钮">按钮</Button>);
    const button = screen.getByRole('button');
    
    expect(button).toHaveAttribute('aria-label', '可访问按钮');
  });
});