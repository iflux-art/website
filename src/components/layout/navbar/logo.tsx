"use client";

import Link from "next/link";

export const Logo = () => (
  <Link href="/" className="inline-block" aria-label="iFluxArt - 返回首页">
    <h2 className="sm:text-md text-sm font-bold tracking-wide transition-colors hover:text-primary md:text-lg">
      iFluxArt
    </h2>
  </Link>
);
