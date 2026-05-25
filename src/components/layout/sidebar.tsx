"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bot, ChartColumnIncreasing, Settings, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", icon: ChartColumnIncreasing, label: "Dashboard" },
  { href: "/profile", icon: UserRound, label: "Profile" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-full flex-col bg-sidebar px-3 py-4">
      <div className="mb-8 flex items-center gap-2 px-2">
        <div className="bg-primary/15 text-primary flex size-9 items-center justify-center rounded-lg">
          <Bot className="size-5" />
        </div>
        <div>
          <p className="font-semibold tracking-tight">Aether Analytics</p>
          <p className="text-muted-foreground text-xs">AI Intelligence Hub</p>
        </div>
      </div>
      <nav className="space-y-1">
        {navItems.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition",
                active ? "bg-sidebar-primary text-sidebar-primary-foreground" : "text-sidebar-foreground/80"
              )}
            >
              <item.icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
