"use client";

import { useState } from "react";
import Image from "next/image";
import { Menu } from "lucide-react";
import type { Profile } from "@/types/database";
import { SidebarNav } from "@/components/sidebar-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";

export function AppShell({
  profile,
  children,
}: {
  profile: Profile;
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen flex-col md:flex-row">
      <header className="flex items-center justify-between border-b bg-card px-4 py-3 md:hidden">
        <Image src="/logo.svg" alt="Rush" width={100} height={23} />
        <div className="flex items-center gap-1">
          <ThemeToggle collapsed />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Abrir menu</span>
          </Button>
        </div>
      </header>

      <div className="hidden md:flex">
        <SidebarNav profile={profile} />
      </div>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-72 p-0">
          <SheetTitle className="sr-only">Menu</SheetTitle>
          <SidebarNav
            profile={profile}
            collapsible={false}
            onNavigate={() => setMobileOpen(false)}
          />
        </SheetContent>
      </Sheet>

      <main className="flex-1 overflow-y-auto bg-muted/30 p-4 md:p-6">
        {children}
      </main>
    </div>
  );
}
