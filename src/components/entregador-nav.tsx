"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { Profile } from "@/types/database";
import { Package, CheckCircle, Truck, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { logout } from "@/app/login/actions";

export function EntregadorNav({
  profile,
}: {
  profile: Profile;
}) {
  const pathname = usePathname();

  const links = [
    { href: "/entregador", label: "Entregas", icon: Package },
    { href: "/entregador/finalizadas", label: "Finalizadas", icon: CheckCircle },
  ];

  return (
    <header className="border-b bg-card">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-2 px-4 py-3">
        <div className="flex shrink-0 items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Truck className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-semibold">Rush</span>
        </div>
        <div className="flex min-w-0 items-center gap-2">
          <span className="hidden truncate text-sm text-muted-foreground sm:inline">
            {profile.name}
          </span>
          <ThemeToggle collapsed />
          <Button variant="ghost" size="icon" onClick={() => logout()}>
              <LogOut className="h-4 w-4" />
            </Button>
        </div>
      </div>
      <nav className="mx-auto flex max-w-3xl border-t">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive =
            pathname === link.href ||
            (link.href !== "/entregador" && pathname.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex flex-1 items-center justify-center gap-2 py-2.5 text-sm transition-colors",
                isActive
                  ? "border-b-2 border-primary text-primary font-medium"
                  : "text-muted-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
