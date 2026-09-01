"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Shield, Truck } from "lucide-react";
import Link from "next/link";
import type { Profile } from "@/types/database";

export default function ConfiguracoesPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [stats, setStats] = useState({ users: 0, clientes: 0, entregadores: 0 });
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace("/login"); return; }

      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      if (!data || data.role !== "admin") { router.replace("/dashboard"); return; }

      setProfile(data as Profile);

      const { count: totalUsers } = await supabase.from("profiles").select("*", { count: "exact", head: true });
      const { count: totalClientes } = await supabase.from("clientes").select("*", { count: "exact", head: true });
      const { count: totalEntregadores } = await supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "entregador");

      setStats({ users: totalUsers ?? 0, clientes: totalClientes ?? 0, entregadores: totalEntregadores ?? 0 });
    }
    load();
  }, []);

  if (!profile) {
    return <div className="flex h-screen items-center justify-center text-muted-foreground">Carregando...</div>;
  }

  return (
    <AppShell profile={profile}>
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Configurações</h1>
          <p className="text-muted-foreground">Painel administrativo do Rush App</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <Link href="/dashboard/cadastros">
            <Card className="transition-shadow hover:shadow-md cursor-pointer">
              <CardHeader className="pb-2">
                <Shield className="h-5 w-5 text-muted-foreground" />
                <CardTitle className="text-base">Usuários</CardTitle>
                <CardDescription>Gerenciar contas</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{stats.users}</p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/dashboard/clientes">
            <Card className="transition-shadow hover:shadow-md cursor-pointer">
              <CardHeader className="pb-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                <CardTitle className="text-base">Clientes</CardTitle>
                <CardDescription>Base de clientes</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{stats.clientes}</p>
              </CardContent>
            </Card>
          </Link>
          <Card>
            <CardHeader className="pb-2">
              <Truck className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-base">Entregadores</CardTitle>
              <CardDescription>Ativos no sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats.entregadores}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
