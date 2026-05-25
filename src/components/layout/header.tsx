"use client";

import { useState } from "react";
import { Bell, LogOut, Menu, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "@/components/layout/sidebar";

export function Header({ userName }: { userName: string }) {
  const router = useRouter();
  const [logoutError, setLogoutError] = useState<string | null>(null);

  const handleLogout = async () => {
    const response = await fetch("/api/auth/logout", { method: "POST" });
    if (!response.ok) {
      setLogoutError("Sign out failed. Please try again.");
      return;
    }
    setLogoutError(null);
    router.push("/login");
    router.refresh();
  };

  return (
    <header className="bg-card/60 supports-[backdrop-filter]:bg-card/50 sticky top-0 z-20 border-b backdrop-blur">
      <div className="flex h-16 items-center gap-3 px-4 lg:px-6">
        <Sheet>
          <SheetTrigger asChild>
            <Button className="md:hidden" variant="outline" size="icon">
              <Menu className="size-4" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <Sidebar />
          </SheetContent>
        </Sheet>

        <div className="relative hidden max-w-sm flex-1 md:block">
          <Search className="text-muted-foreground absolute top-2.5 left-3 size-4" />
          <Input className="pl-9" placeholder="Search metrics, users, alerts..." />
        </div>

        <div className="ml-auto flex items-center gap-2">
          {logoutError ? <p className="hidden text-xs text-rose-500 sm:block">{logoutError}</p> : null}
          <Button variant="outline" size="icon" className="relative">
            <Bell className="size-4" />
            <span className="bg-primary absolute top-1.5 right-1.5 size-2 rounded-full" />
          </Button>
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="px-2">
                <Avatar className="size-8">
                  <AvatarFallback>{userName.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => router.push("/profile")}>Profile</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => router.push("/settings")}>Settings</DropdownMenuItem>
              <DropdownMenuItem onSelect={handleLogout}>
                <LogOut className="mr-2 size-4" /> Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
