/**
 * 全局共享组件统一导出
 * 集中管理所有通用共享组件，便于引用和维护
 * 业务相关组件已移动到对应的 features 目录中
 */

// ==================== MDX 组件 ====================
export { default as ClientMDXRenderer } from "./mdx/client-mdx-renderer";
export { MDXComponents } from "./mdx/mdx-components";
export { MDXImg } from "./mdx/mdx-img";
export { MDXLink } from "./mdx/mdx-link";
export { MDXBlockquote } from "./mdx/mdx-blockquote";

// ==================== 主题提供者 ====================
export { ThemeProvider } from "./theme/theme-provider";

// ==================== 全局功能组件 ====================
export { GlobalContextMenu } from "./global-context-menu";

// ==================== 业务按钮组件 ====================
export { GitHubButton } from "./button/github-button";
export { TravelButton } from "./button/travel-button";

// ==================== UI 组件库 ====================
export { Button, buttonVariants } from "./ui/button";
export { Alert, AlertTitle, AlertDescription } from "./ui/alert";
export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "./ui/alert-dialog";
export { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
export { BackButton } from "./ui/back-button";
export { Badge, badgeVariants } from "./ui/badge";
export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from "./ui/card";
export { Collapsible, CollapsibleTrigger, CollapsibleContent } from "./ui/collapsible";
export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
} from "./ui/context-menu";
export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
} from "./ui/dropdown-menu";
export { Input } from "./ui/input";
export { Label } from "./ui/label";
export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
} from "./ui/select";
export { Separator } from "./ui/separator";
export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
} from "./ui/sheet";
export { Switch } from "./ui/switch";
export { Textarea } from "./ui/textarea";
