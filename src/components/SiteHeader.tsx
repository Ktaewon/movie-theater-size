"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "비교" },
  { href: "/report", label: "제보" },
  { href: "/admin", label: "관리" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur supports-backdrop-filter:bg-background/75">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="inline-flex size-7 items-center justify-center rounded-md bg-primary text-xs text-primary-foreground">
            S
          </span>
          <span>스크린미터</span>
        </Link>
        <nav className="flex items-center gap-1">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Button
                key={link.href}
                asChild
                variant={active ? "secondary" : "ghost"}
                size="sm"
                className={cn(!active && "text-muted-foreground")}
              >
                <Link href={link.href}>{link.label}</Link>
              </Button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
