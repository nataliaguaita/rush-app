"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/status-badge";
import { Package, Truck, CheckCircle, Clock, MapPin, RefreshCw, AlertTriangle } from "lucide-react";

export default function DashboardPage() {
  const [metrics, setMetrics] = useState({ total: 0, pendentes: 0, emRota: 0, concluidas: 0 });
  const [entregadores, setEntregadores] = useState<any[]>([]);
  const [entregasPorEntregador, setEntregasPorEntregador] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);
  const supabase = createClient();

  const loadData = useCallback(async ({ silent = false } = {}) => {
    if (silent) setRefreshing(true);
    setError(false);

    const today = new Date().toISOString().split("T")[0];

    const { data: entregas, error: entregasError } = await supabase
      .from("entregas")
      .select("*, cliente:clientes(*), endereco:enderecos(*)")
      .gte("created_at", `${today}T00:00:00`)
      .lte("created_at", `${today}T23:59:59`)
      .order("route_order", { ascending: true, nullsFirst: false });

    const { data: ent, error: entregadoresError } = await supabase
      .from("profiles")
      .select("id, name")
      .eq("role", "entregador")
      .eq("active", true);

    if (entregasError || entregadoresError) {
      setError(true);
      setLoading(false);
      setRefreshing(false);
      return;
    }

    const all = entregas ?? [];
    setMetrics({
      total: all.length,
      pendentes: all.filter((e: any) => e.status === "aguardando_atribuicao").length,
      emRota: all.filter((e: any) => e.status === "em_rota").length,
      concluidas: all.filter((e: any) => e.status === "entregue").length,
    });

    setEntregadores(ent ?? []);

    const porEntregador: Record<string, any[]> = {};
    for (const entregador of ent ?? []) {
      porEntregador[entregador.id] = all.filter((e: any) => e.entregador_id === entregador.id);
    }
    setEntregasPorEntregador(porEntregador);
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    loadData();

    const channel = supabase
      .channel("dashboard-entregas")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "entregas" },
        () => loadData({ silent: true })
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadData]);

  const cards = [
    { title: "Total de Entregas Hoje", value: metrics.total, icon: Package, className: "text-muted-foreground" },
    { title: "Entregas Pendentes", value: metrics.pendentes, icon: Clock, className: "text-status-pending" },
    { title: "Em Rota", value: metrics.emRota, icon: Truck, className: "text-status-active" },
    { title: "Concluídas", value: metrics.concluidas, icon: CheckCircle, className: "text-status-success" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Torre de Controle</h1>
          <p className="text-muted-foreground">Visão geral das entregas de hoje</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => loadData({ silent: true })}
          disabled={refreshing}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          Atualizar
        </Button>
      </div>

      {error ? (
        <Card className="border-destructive/30">
          <CardContent className="flex flex-col items-center gap-2 py-10 text-center">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <p className="text-sm font-medium">Não foi possível carregar os dados.</p>
            <p className="text-sm text-muted-foreground">Verifique sua conexão e tente novamente.</p>
            <Button variant="outline" size="sm" className="mt-2" onClick={() => loadData()}>
              Tentar novamente
            </Button>
          </CardContent>
        </Card>
      ) : loading ? (
        <DashboardSkeleton />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map((m) => {
              const Icon = m.icon;
              return (
                <Card key={m.title}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">{m.title}</CardTitle>
                    <Icon className={`h-4 w-4 ${m.className}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{m.value}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div>
            <h2 className="mb-3 text-lg font-semibold">Visão por Entregador</h2>
            {entregadores.length === 0 ? (
              <Card>
                <CardContent className="py-10 text-center text-muted-foreground">
                  Nenhum entregador cadastrado.
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {entregadores.map((entregador) => {
                  const entregasDoEntregador = entregasPorEntregador[entregador.id] ?? [];
                  const feitas = entregasDoEntregador.filter((e: any) => e.status === "entregue").length;
                  return (
                    <Card key={entregador.id}>
                      <CardHeader className="flex flex-row items-center justify-between gap-2">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                            {entregador.name.charAt(0).toUpperCase()}
                          </div>
                          <CardTitle className="truncate text-base">{entregador.name}</CardTitle>
                        </div>
                        <Badge variant={feitas === entregasDoEntregador.length && entregasDoEntregador.length > 0 ? "default" : "secondary"}>
                          {feitas}/{entregasDoEntregador.length}
                        </Badge>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {entregasDoEntregador.length === 0 ? (
                          <p className="text-sm text-muted-foreground">Nenhuma entrega atribuída.</p>
                        ) : (
                          entregasDoEntregador.map((entrega: any, index: number) => (
                            <div key={entrega.id} className="flex gap-3 rounded-lg border p-3">
                              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold">
                                {index + 1}
                              </div>
                              <div className="min-w-0 flex-1 space-y-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="truncate font-medium">{entrega.cliente?.name ?? "Cliente"}</span>
                                  <StatusBadge status={entrega.status} className="text-xs" />
                                </div>
                                {entrega.endereco && (
                                  <p className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <MapPin className="h-3 w-3 shrink-0" />
                                    <span className="truncate">
                                      {entrega.endereco.rua}, {entrega.endereco.numero}
                                      {entrega.endereco.bairro ? ` - ${entrega.endereco.bairro}` : ""}
                                    </span>
                                  </p>
                                )}
                              </div>
                            </div>
                          ))
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-12" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
