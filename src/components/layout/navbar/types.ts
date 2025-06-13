
/**
 * 导航组件的基础属性接口
 */
export interface NavProps {
  /**
   * 点击后的回调函数（用于关闭移动菜单）
   */
  onClose?: () => void;

  /**
   * 自定义类名
   */
  className?: string;
}

/**
 * 导航菜单组件的属性接口
 */
export interface NavMenuProps extends NavProps {
  /**
   * 显示模式：links 为链接列表，cards 为卡片模式
   */
  mode: 'links' | 'cards';
}

/**
 * 搜索对话框的属性接口
 */
export interface SearchDialogProps {
  /**
   * 对话框是否打开
   */
  open: boolean;

  /**
   * 对话框开关状态改变时的回调函数
   */
  onOpenChange: (open: boolean) => void;
}