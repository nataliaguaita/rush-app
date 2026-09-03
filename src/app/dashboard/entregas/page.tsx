"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, AlertTriangle, RefreshCw, ChevronLeft, ChevronRight, Sun, Sunset, Users } from "lucide-react";
import { format, addDays, subDays } from "date-fns";
import { KanbanBoard } from "./kanban-board";

export default function EntregasPage() {
  const [entregas, setEntregas] = useState<any[]>([]);
  const [entregadores, setEntregadores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => format(new Date(), "yyyy-MM-dd"));
  const [selectedPeriod, setSelectedPeriod] = useState<"todos" | "manha" | "tarde">("todos");
  const supabase = createClient();

  const load = useCallback(
    async ({ silent = false } = {}) => {
      if (silent) setRefreshing(true);
      setError(false);

      const { data: e, error: entregasError } = await supabase
        .from("entregas")
        .select("*, cliente:clientes(*), endereco:enderecos(*)")
        .gte("created_at", `${selectedDate}T00:00:00`)
        .lte("created_at", `${selectedDate}T23:59:59`)
        .in("status", ["aguardando_atribuicao", "rota_definida"])
        .order("route_order", { ascending: true, nullsFirst: true });

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

      setEntregas(e ?? []);
      setEntregadores(ent ?? []);
      setLoading(false);
      setRefreshing(false);
    },
    [selectedDate],
  );

  useEffect(() => {
    load();

    const channel = supabase
      .channel("entregas-kanban")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "entregas" },
        () => load({ silent: true }),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [load]);

  const filteredEntregas = selectedPeriod === "todos"
    ? entregas
    : entregas.filter((e) => e.scheduled_period === selectedPeriod);

  const pendentes = filteredEntregas.filter((e) => !e.entregador_id).length;
  const atribuidas = filteredEntregas.filter(
    (e) => e.entregador_id && e.status === "aguardando_atribuicao",
  ).length;
  const liberadas = filteredEntregas.filter((e) => e.status === "rota_definida").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Organizar Entregas</h1>
          <p className="text-muted-foreground">
            {filteredEntregas.length} entrega{filteredEntregas.length !== 1 ? "s" : ""}
            {pendentes > 0 && ` · ${pendentes} sem entregador`}
            {atribuidas > 0 && ` · ${atribuidas} atribuída${atribuidas > 1 ? "s" : ""}`}
            {liberadas > 0 && ` · ${liberadas} liberada${liberadas > 1 ? "s" : ""}`}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() =>
              setSelectedDate(
                format(subDays(new Date(selectedDate + "T00:00:00"), 1), "yyyy-MM-dd"),
              )
            }
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="h-8 w-auto text-center text-sm"
          />
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() =>
              setSelectedDate(
                format(addDays(new Date(selectedDate + "T00:00:00"), 1), "yyyy-MM-dd"),
              )
            }
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <div className="flex h-8 rounded-md border border-input">
            <button
              type="button"
              className={`flex items-center gap-1 rounded-l-md px-2.5 text-xs font-medium transition-colors ${
                selectedPeriod === "todos"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent"
              }`}
              onClick={() => setSelectedPeriod("todos")}
            >
              Todos
            </button>
            <button
              type="button"
              className={`flex items-center gap-1 border-x border-input px-2.5 text-xs font-medium transition-colors ${
                selectedPeriod === "manha"
                  ? "bg-amber-500 text-white"
                  : "text-muted-foreground hover:bg-accent"
              }`}
              onClick={() => setSelectedPeriod("manha")}
            >
              <Sun className="h-3.5 w-3.5" />
              Manhã
            </button>
            <button
              type="button"
              className={`flex items-center gap-1 rounded-r-md px-2.5 text-xs font-medium transition-colors ${
                selectedPeriod === "tarde"
                  ? "bg-blue-500 text-white"
                  : "text-muted-foreground hover:bg-accent"
              }`}
              onClick={() => setSelectedPeriod("tarde")}
            >
              <Sunset className="h-3.5 w-3.5" />
              Tarde
            </button>
          </div>
          <Button
            variant="outline"
            onClick={() => load({ silent: true })}
            disabled={refreshing}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            Atualizar
          </Button>
          <Link href="/dashboard/entregas/nova-grupo">
            <Button variant="outline">
              <Users className="mr-2 h-4 w-4" />
              Entrega em Grupo
            </Button>
          </Link>
          <Link href="/dashboard/entregas/nova">
            <Button className="bg-blue-500 text-white hover:bg-blue-600">
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
            <p className="text-sm font-medium">Não foi possível carregar as entregas.</p>
            <Button variant="outline" size="sm" className="mt-2" onClick={() => load()}>
              Tentar novamente
            </Button>
          </CardContent>
        </Card>
      ) : loading ? (
        <KanbanSkeleton />
      ) : (
        <KanbanBoard entregas={filteredEntregas} entregadores={entregadores} />
      )}
    </div>
  );
}

function KanbanSkeleton() {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="min-w-[280px] flex-1 space-y-2">
          <Skeleton className="h-10 w-full rounded-t-lg" />
          <div className="space-y-2 rounded-b-lg border-2 border-dashed border-transparent p-2">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
