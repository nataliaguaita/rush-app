"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/types/database";
import { Package, CheckCircle, PackageX, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { logout } from "@/app/login/actions";

const links = [
  { href: "/entregador", label: "Entregas", icon: Package },
  { href: "/entregador/finalizadas", label: "Finalizadas", icon: CheckCircle },
  { href: "/entregador/devolucoes", label: "Devoluções", icon: PackageX },
];

export function EntregadorHeader({ profile }: { profile: Profile }) {
  const router = useRouter();
  return (
    <header className="border-b bg-card">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-2 px-4 py-3">
        <Image src="/logo.svg" alt="Rush" width={100} height={23} className="shrink-0" />
        <div className="flex min-w-0 items-center gap-2">
          <span className="hidden truncate text-sm text-muted-foreground sm:inline">
            {profile.name}
          </span>
          <ThemeToggle collapsed />
          <Button variant="ghost" size="icon" onClick={() => logout(router)} aria-label="Sair">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}

export function EntregadorBottomNav() {
  const pathname = usePathname();
  const [pendingDevolucoes, setPendingDevolucoes] = useState(0);
  const supabase = createClient();

  useEffect(() => {
    async function loadCount() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { count } = await supabase
        .from("entregas")
        .select("id", { count: "exact", head: true })
        .eq("entregador_id", user.id)
        .eq("nota_devolvida", false)
        .in("status", ["entregue", "retornada", "recusada"])
        .or("actions.cs.{assinar_nota},actions.cs.{receber},actions.cs.{receber_e_assinar},return_reminder.eq.true");
      setPendingDevolucoes(count ?? 0);
    }
    loadCount();

    const channel = supabase
      .channel("entregador-nav-devolucoes")
      .on("postgres_changes", { event: "*", schema: "public", table: "entregas" }, loadCount)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t bg-card pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto flex max-w-3xl">
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
                "flex flex-1 flex-col items-center gap-1 py-2 text-xs transition-colors",
                isActive
                  ? "text-[#0090FF] font-medium"
                  : "text-muted-foreground"
              )}
            >
              <span className="relative">
                <Icon className="h-5 w-5" />
                {link.href === "/entregador/devolucoes" && pendingDevolucoes > 0 && (
                  <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-destructive-foreground">
                    {pendingDevolucoes > 9 ? "9+" : pendingDevolucoes}
                  </span>
                )}
              </span>
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

// Keep backward compat export
export { EntregadorHeader as EntregadorNav };
