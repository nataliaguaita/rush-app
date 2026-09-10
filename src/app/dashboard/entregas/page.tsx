"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, AlertTriangle, RefreshCw, ChevronLeft, ChevronRight, Sun, Sunset, Truck, Users } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format, addDays, subDays } from "date-fns";
import { KanbanBoard } from "./kanban-board";
import { StaleEntregasBanner } from "@/components/stale-entregas-banner";
import type { EntregaWithRelations, Profile } from "@/types/database";

export default function EntregasPage() {
  const [entregas, setEntregas] = useState<EntregaWithRelations[]>([]);
  const [entregadores, setEntregadores] = useState<Pick<Profile, "id" | "name">[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => format(new Date(), "yyyy-MM-dd"));
  const [selectedPeriod, setSelectedPeriod] = useState<"todos" | "manha" | "tarde" | "em_rota">("todos");
  const supabase = createClient();

  const load = useCallback(
    async ({ silent = false } = {}) => {
      if (silent) setRefreshing(true);
      setError(false);

      const { data: e, error: entregasError } = await supabase
        .from("entregas")
        .select("*, cliente:clientes(*), endereco:enderecos(*)")
        .eq("scheduled_date", selectedDate)
        .in("status", ["aguardando_atribuicao", "rota_definida", "retornada"])
        .or("return_confirmed.is.null,return_confirmed.eq.false")
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
    [selectedDate, supabase],
  );

  useEffect(() => {
    queueMicrotask(load);

    const channel = supabase
      .channel("entregas-kanban")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "entregas" },
        () => load({ silent: true }),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [load, supabase]);

  const filteredEntregas = selectedPeriod === "todos"
    ? entregas
    : selectedPeriod === "em_rota"
    ? entregas.filter((e) => e.status === "rota_definida")
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
        <div className="hidden flex-wrap items-center gap-2 sm:flex">
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
              className={`flex items-center gap-1 border-r border-input px-2.5 text-xs font-medium transition-colors ${
                selectedPeriod === "tarde"
                  ? "bg-blue-500 text-white"
                  : "text-muted-foreground hover:bg-accent"
              }`}
              onClick={() => setSelectedPeriod("tarde")}
            >
              <Sunset className="h-3.5 w-3.5" />
              Tarde
            </button>
            <button
              type="button"
              className={`flex items-center gap-1 rounded-r-md px-2.5 text-xs font-medium transition-colors ${
                selectedPeriod === "em_rota"
                  ? "bg-slate-500 text-white"
                  : "text-muted-foreground hover:bg-accent"
              }`}
              onClick={() => setSelectedPeriod("em_rota")}
            >
              <Truck className="h-3.5 w-3.5" />
              Em Rota
            </button>
          </div>
          <Button
            variant="outline"
            onClick={() => load({ silent: true })}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 sm:mr-2 ${refreshing ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Atualizar</span>
          </Button>
          <Link href="/dashboard/entregas/nova-grupo">
            <Button variant="outline">
              <Users className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Entrega em Grupo</span>
            </Button>
          </Link>
          <Link href="/dashboard/entregas/nova">
            <Button className="bg-blue-500 text-white hover:bg-blue-600">
              <Plus className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Nova Entrega</span>
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:hidden">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 shrink-0"
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
            className="h-8 flex-1 text-center text-sm"
          />
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 shrink-0"
            onClick={() =>
              setSelectedDate(
                format(addDays(new Date(selectedDate + "T00:00:00"), 1), "yyyy-MM-dd"),
              )
            }
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex h-9 rounded-md border border-input">
          <button
            type="button"
            className={`flex flex-1 items-center justify-center gap-1 rounded-l-md text-xs font-medium transition-colors ${
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
            className={`flex flex-1 items-center justify-center gap-1 border-x border-input text-xs font-medium transition-colors ${
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
            className={`flex flex-1 items-center justify-center gap-1 border-r border-input text-xs font-medium transition-colors ${
              selectedPeriod === "tarde"
                ? "bg-blue-500 text-white"
                : "text-muted-foreground hover:bg-accent"
            }`}
            onClick={() => setSelectedPeriod("tarde")}
          >
            <Sunset className="h-3.5 w-3.5" />
            Tarde
          </button>
          <button
            type="button"
            className={`flex flex-1 items-center justify-center gap-1 rounded-r-md text-xs font-medium transition-colors ${
              selectedPeriod === "em_rota"
                ? "bg-slate-500 text-white"
                : "text-muted-foreground hover:bg-accent"
            }`}
            onClick={() => setSelectedPeriod("em_rota")}
          >
            <Truck className="h-3.5 w-3.5" />
            Em Rota
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="shrink-0"
            onClick={() => load({ silent: true })}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button className="w-full flex-1 bg-blue-500 text-white hover:bg-blue-600">
                  <Plus className="mr-2 h-4 w-4" />
                  Nova Entrega
                </Button>
              }
            />
            <DropdownMenuContent align="end">
              <DropdownMenuItem render={<Link href="/dashboard/entregas/nova" />}>
                <Plus className="h-4 w-4" />
                Nova Entrega
              </DropdownMenuItem>
              <DropdownMenuItem render={<Link href="/dashboard/entregas/nova-grupo" />}>
                <Users className="h-4 w-4" />
                Entrega em Grupo
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <StaleEntregasBanner />

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
