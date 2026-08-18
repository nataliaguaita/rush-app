import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SidebarNav } from "@/components/sidebar-nav";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Shield, Truck } from "lucide-react";
import Link from "next/link";

export default async function ConfiguracoesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") redirect("/dashboard");

  const { count: totalUsers } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true });

  const { count: totalClientes } = await supabase
    .from("clientes")
    .select("*", { count: "exact", head: true });

  const { count: totalEntregadores } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("role", "entregador");

  return (
    <div className="flex h-screen">
      <SidebarNav profile={profile} />
      <main className="flex-1 overflow-y-auto bg-muted/30 p-6">
        <div className="mx-auto max-w-4xl space-y-6">
          <div>
            <h1 className="text-2xl font-bold">Configurações</h1>
            <p className="text-muted-foreground">
              Painel administrativo do Rush App
            </p>
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
                  <p className="text-2xl font-bold">{totalUsers ?? 0}</p>
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
                  <p className="text-2xl font-bold">{totalClientes ?? 0}</p>
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
                <p className="text-2xl font-bold">{totalEntregadores ?? 0}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
