import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Truck, CheckCircle, Clock } from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();

  const today = new Date().toISOString().split("T")[0];

  const { data: entregas } = await supabase
    .from("entregas")
    .select("id, status, entregador_id")
    .gte("created_at", `${today}T00:00:00`)
    .lte("created_at", `${today}T23:59:59`);

  const total = entregas?.length ?? 0;
  const pendentes =
    entregas?.filter((e) => e.status === "aguardando_atribuicao").length ?? 0;
  const emRota =
    entregas?.filter((e) => e.status === "em_rota").length ?? 0;
  const concluidas =
    entregas?.filter((e) => e.status === "entregue").length ?? 0;

  const metrics = [
    {
      title: "Total de Entregas Hoje",
      value: total,
      icon: Package,
      color: "text-blue-600",
    },
    {
      title: "Entregas Pendentes",
      value: pendentes,
      icon: Clock,
      color: "text-yellow-600",
    },
    {
      title: "Em Rota",
      value: emRota,
      icon: Truck,
      color: "text-orange-600",
    },
    {
      title: "Concluídas",
      value: concluidas,
      icon: CheckCircle,
      color: "text-green-600",
    },
  ];

  // Visão por entregador
  const { data: entregadores } = await supabase
    .from("profiles")
    .select("id, name")
    .eq("role", "entregador")
    .eq("active", true);

  const entregadorStats = (entregadores ?? []).map((ent) => {
    const entregasDoEntregador =
      entregas?.filter((e) => e.entregador_id === ent.id) ?? [];
    const feitas = entregasDoEntregador.filter(
      (e) => e.status === "entregue"
    ).length;
    return {
      ...ent,
      total: entregasDoEntregador.length,
      feitas,
    };
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Torre de Controle</h1>
        <p className="text-muted-foreground">
          Visão geral das entregas de hoje
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {metric.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${metric.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{metric.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Visão por Entregador</CardTitle>
        </CardHeader>
        <CardContent>
          {entregadorStats.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nenhum entregador cadastrado.
            </p>
          ) : (
            <div className="space-y-3">
              {entregadorStats.map((ent) => (
                <div
                  key={ent.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                      {ent.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium">{ent.name}</span>
                  </div>
                  <Badge variant={ent.feitas === ent.total && ent.total > 0 ? "default" : "secondary"}>
                    {ent.feitas}/{ent.total} concluídas
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
