"use client";

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
} from "lucide-react";
import { Button } from "@/components/ui/button";
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

export function SidebarNav({ profile }: { profile: Profile }) {
  const pathname = usePathname();
  const links = profile.role === "admin" ? adminLinks : vendedorLinks;

  return (
    <aside className="flex h-full w-60 flex-col border-r bg-card">
      <div className="flex items-center gap-2 border-b px-4 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <Truck className="h-4 w-4 text-primary-foreground" />
        </div>
        <div>
          <p className="text-sm font-semibold">Rush App</p>
          <p className="text-xs text-muted-foreground">Dental Marechal</p>
        </div>
      </div>

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
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t p-3">
        <div className="mb-2 px-3">
          <p className="text-sm font-medium truncate">{profile.name}</p>
          <p className="text-xs text-muted-foreground capitalize">
            {profile.role}
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2 text-muted-foreground"
          onClick={() => logout()}
        >
          <LogOut className="h-4 w-4" />
          Sair
        </Button>
      </div>
    </aside>
  );
}
