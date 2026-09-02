"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { Profile } from "@/types/database";
import Image from "next/image";
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
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { logout } from "@/app/login/actions";

const ctaLink = { href: "/dashboard/entregas/nova", label: "Nova Entrega", icon: Plus };

const adminLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/entregas", label: "Organizar Entregas", icon: Package },
  { href: "/dashboard/clientes", label: "Clientes", icon: Users },
  { href: "/dashboard/cadastros", label: "Cadastros", icon: UserPlus },
  { href: "/configuracoes", label: "Configurações", icon: Settings },
];

const vendedorLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/entregas", label: "Organizar Entregas", icon: Package },
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
  const [collapsedPref, setCollapsedPref] = useState(
    () => collapsible && localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === "true"
  );
  const collapsed = collapsible && collapsedPref;

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
      <div className="flex items-center justify-center border-b px-4 py-[10px]">
        {collapsed ? (
          <Image src="/icon.svg" alt="Rush" width={28} height={28} className="shrink-0" />
        ) : (
          <Image src="/logo.svg" alt="Rush" width={100} height={23} className="shrink-0" />
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

      <nav className="flex-1 p-2">
        <Link
          href={ctaLink.href}
          title={collapsed ? ctaLink.label : undefined}
          onClick={onNavigate}
          className={cn(
            "flex items-center gap-2 rounded-md bg-blue-500 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600",
            collapsed && "justify-center"
          )}
        >
          <Plus className="h-4 w-4 shrink-0" />
          {!collapsed && ctaLink.label}
        </Link>
        <div className="my-2 border-b" />
        <div className="space-y-1">
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
        </div>
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
