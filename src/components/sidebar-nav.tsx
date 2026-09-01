"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { Profile } from "@/types/database";
import {
  LayoutDashboard,
  Package,
  Users,
  UserPlus,
  Settings,
  Truck,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { logout } from "@/app/login/actions";

const adminLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/entregas", label: "Entregas", icon: Package },
  { href: "/dashboard/entregas/nova", label: "Nova Entrega", icon: Truck },
  { href: "/dashboard/clientes", label: "Clientes", icon: Users },
  { href: "/dashboard/cadastros", label: "Cadastros", icon: UserPlus },
  { href: "/configuracoes", label: "Configurações", icon: Settings },
];

const vendedorLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/entregas", label: "Entregas", icon: Package },
  { href: "/dashboard/entregas/nova", label: "Nova Entrega", icon: Truck },
  { href: "/dashboard/clientes", label: "Clientes", icon: Users },
];

const SIDEBAR_COLLAPSED_KEY = "sidebar-collapsed";

export function SidebarNav({
  profile,
  collapsible = true,
  onNavigate,
}: {
  profile: Profile;
  collapsible?: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const links = profile.role === "admin" ? adminLinks : vendedorLinks;
  const [collapsedPref, setCollapsedPref] = useState(false);
  const collapsed = collapsible && collapsedPref;

  useEffect(() => {
    if (!collapsible) return;
    setCollapsedPref(localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === "true");
  }, [collapsible]);

  function toggleCollapsed() {
    setCollapsedPref((prev) => {
      const next = !prev;
      localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(next));
      return next;
    });
  }

  return (
    <aside
      className={cn(
        "flex h-full flex-col border-r bg-card transition-[width] duration-200",
        collapsible ? (collapsed ? "w-17" : "w-60") : "w-full"
      )}
    >
      <div className="flex items-center gap-2 border-b px-4 py-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary">
          <Truck className="h-4 w-4 text-primary-foreground" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">Rush App</p>
            <p className="truncate text-xs text-muted-foreground">
              Dental Marechal
            </p>
          </div>
        )}
      </div>

      {collapsible && (
        <button
          type="button"
          onClick={toggleCollapsed}
          title={collapsed ? "Expandir menu" : "Recolher menu"}
          className="flex items-center justify-center gap-2 border-b py-2 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          {collapsed ? (
            <PanelLeftOpen className="h-4 w-4" />
          ) : (
            <>
              <PanelLeftClose className="h-4 w-4" />
              Recolher
            </>
          )}
        </button>
      )}

      <nav className="flex-1 space-y-1 p-2">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive =
            pathname === link.href ||
            (link.href !== "/dashboard" && pathname.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              title={collapsed ? link.label : undefined}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                collapsed && "justify-center",
                isActive
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!collapsed && link.label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-2 border-t p-3">
        {!collapsed && (
          <div className="px-3">
            <p className="truncate text-sm font-medium">{profile.name}</p>
            <p className="text-xs text-muted-foreground capitalize">
              {profile.role}
            </p>
          </div>
        )}
        <ThemeToggle collapsed={collapsed} />
        <Button
          variant="ghost"
          size={collapsed ? "icon" : "sm"}
          className={cn(
            "text-muted-foreground",
            !collapsed && "w-full justify-start gap-2"
          )}
          title="Sair"
          onClick={() => logout()}
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && "Sair"}
        </Button>
      </div>
    </aside>
  );
}
