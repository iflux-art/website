import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default function Home() {
  // 重定向到默认语言页面
  redirect("/zh");
  
  return null;
}
