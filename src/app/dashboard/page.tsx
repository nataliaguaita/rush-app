"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/status-badge";
import { RECEIVER_ROLE_LABELS } from "@/lib/status";
import { Package, Truck, CheckCircle, Clock, MapPin, RefreshCw, AlertTriangle, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { format, addDays, subDays } from "date-fns";
import Link from "next/link";
import { PesquisarEntregaDialog } from "./entregas/pesquisar-entrega-dialog";

export default function DashboardPage() {
  const [metrics, setMetrics] = useState({ total: 0, pendentes: 0, emRota: 0, concluidas: 0 });
  const [entregas, setEntregas] = useState<any[]>([]);
  const [entregadores, setEntregadores] = useState<any[]>([]);
  const [entregasPorEntregador, setEntregasPorEntregador] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => format(new Date(), "yyyy-MM-dd"));
  const supabase = createClient();

  const loadData = useCallback(async ({ silent = false } = {}) => {
    if (silent) setRefreshing(true);
    setError(false);

    const today = selectedDate;

    const { data: entregasData, error: entregasError } = await supabase
      .from("entregas")
      .select("*, cliente:clientes(*), endereco:enderecos(*), entregador:profiles!entregas_entregador_id_fkey(id, name)")
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

    const all = entregasData ?? [];
    setEntregas(all);
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
  }, [selectedDate]);

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
          <p className="text-muted-foreground">Visão geral das entregas</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => setSelectedDate(format(subDays(new Date(selectedDate + "T00:00:00"), 1), "yyyy-MM-dd"))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            max={format(new Date(), "yyyy-MM-dd")}
            className="h-8 w-auto text-center text-sm"
          />
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            disabled={selectedDate === format(new Date(), "yyyy-MM-dd")}
            onClick={() => setSelectedDate(format(addDays(new Date(selectedDate + "T00:00:00"), 1), "yyyy-MM-dd"))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            onClick={() => loadData({ silent: true })}
            disabled={refreshing}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            Atualizar
          </Button>
          <PesquisarEntregaDialog entregas={entregas} entregadores={entregadores} />
          <Link href="/dashboard/entregas/nova">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nova Entrega
            </Button>
          </Link>
        </div>
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
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
                            <Link
                              key={entrega.id}
                              href={`/dashboard/entregas/${entrega.id}`}
                              className="group relative flex gap-3 overflow-hidden rounded-lg border p-3 transition-colors hover:bg-muted/50"
                            >
                              {entrega.status === "em_rota" && (
                                <div className="absolute inset-x-0 bottom-0 h-0.5 overflow-hidden bg-status-active/20">
                                  <div className="h-full w-1/3 animate-[shimmer_1.5s_ease-in-out_infinite] bg-status-active" />
                                </div>
                              )}
                              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold">
                                {index + 1}
                              </div>
                              <div className="min-w-0 flex-1 space-y-1">
                                <span className="truncate font-medium block">{entrega.cliente?.name ?? "Cliente"}</span>
                                {entrega.endereco && (
                                  <p className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <MapPin className="h-3 w-3 shrink-0" />
                                    <span className="truncate">
                                      {entrega.endereco.rua}, {entrega.endereco.numero}
                                      {entrega.endereco.bairro ? ` - ${entrega.endereco.bairro}` : ""}
                                    </span>
                                  </p>
                                )}
                                {entrega.status === "entregue" && entrega.delivered_at && (
                                  <p className="text-xs text-status-success">
                                    {new Date(entrega.delivered_at).toLocaleDateString("pt-BR")} às{" "}
                                    {new Date(entrega.delivered_at).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                                    {entrega.receiver_name && (
                                      <> · {entrega.receiver_name}{entrega.receiver_role ? ` (${RECEIVER_ROLE_LABELS[entrega.receiver_role] ?? entrega.receiver_role})` : ""}</>
                                    )}
                                  </p>
                                )}
                              </div>
                              <div className="flex shrink-0 items-center">
                                <StatusBadge status={entrega.status} className="text-xs" />
                              </div>
                            </Link>
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
