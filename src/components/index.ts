/**
 * 全局共享组件统一导出
 * 集中管理所有通用共享组件，便于引用和维护
 * 业务相关组件已移动到对应的 features 目录中
 */

// ==================== MDX 组件 ====================
export {
  ClientMDXRenderer,
  MDXComponents,
  MDXImg,
  MDXLink,
  MDXBlockquote,
  MDXCode,
} from "@/features/content/components/mdx";

// ==================== 主题提供者 ====================
export { ThemeProvider } from "./theme/theme-provider";

// ==================== 业务按钮组件 ====================
export { GitHubButton } from "./button/github-button";
export { TravelButton } from "./button/travel-button";

// ==================== UI 组件库 ====================
export { BackButton } from "./ui/back-button";
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
export { Badge } from "./ui/badge";
export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from "./ui/card";
export { Input } from "./ui/input";
export { Label } from "./ui/label";
export { Switch } from "./ui/switch";
export { Textarea } from "./ui/textarea";
