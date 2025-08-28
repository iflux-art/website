import { redirect } from "next/navigation";

/**
 * 管理后台主入口
 * 将用户重定向到仪表盘页面
 */
export default function AdminRedirectPage() {
  redirect("/admin/dashboard");
}
