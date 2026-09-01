"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/status-badge";
import { Plus, MapPin, AlertTriangle, RefreshCw } from "lucide-react";
import { AssignEntregadorSelect } from "./assign-entregador-select";
import { PesquisarEntregaDialog } from "./pesquisar-entrega-dialog";

export default function EntregasPage() {
  const [entregas, setEntregas] = useState<any[]>([]);
  const [entregadores, setEntregadores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);
  const supabase = createClient();

  const load = useCallback(async ({ silent = false } = {}) => {
    if (silent) setRefreshing(true);
    setError(false);

    const { data: e, error: entregasError } = await supabase
      .from("entregas")
      .select("*, cliente:clientes(*), endereco:enderecos(*), entregador:profiles!entregas_entregador_id_fkey(*)")
      .order("is_urgent", { ascending: false })
      .order("created_at", { ascending: false });

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
  }, []);

  useEffect(() => {
    load();

    const channel = supabase
      .channel("entregas-list")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "entregas" },
        () => load({ silent: true })
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [load]);

  const pendentes = entregas.filter((e) => e.status === "aguardando_atribuicao");
  const emAndamento = entregas.filter((e) => e.status === "rota_definida" || e.status === "em_rota");
  const finalizadas = entregas.filter((e) => e.status === "entregue" || e.status === "recusada");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Entregas</h1>
          <p className="text-muted-foreground">{entregas.length} entregas</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => load({ silent: true })} disabled={refreshing}>
            <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            <span className="sr-only sm:not-sr-only">Atualizar</span>
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
            <p className="text-sm font-medium">Não foi possível carregar as entregas.</p>
            <p className="text-sm text-muted-foreground">Verifique sua conexão e tente novamente.</p>
            <Button variant="outline" size="sm" className="mt-2" onClick={() => load()}>
              Tentar novamente
            </Button>
          </CardContent>
        </Card>
      ) : loading ? (
        <ListSkeleton />
      ) : (
        <Tabs defaultValue="pendentes">
          <div className="relative">
            <TabsList className="w-full overflow-x-auto sm:w-auto">
              <TabsTrigger value="pendentes">Pendentes ({pendentes.length})</TabsTrigger>
              <TabsTrigger value="andamento">Em Andamento ({emAndamento.length})</TabsTrigger>
              <TabsTrigger value="finalizadas">Finalizadas ({finalizadas.length})</TabsTrigger>
              <TabsTrigger value="todas">Todas ({entregas.length})</TabsTrigger>
            </TabsList>
            <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-muted to-transparent sm:hidden" />
          </div>

          <TabsContent value="pendentes" className="mt-4">
            <EntregaList entregas={pendentes} entregadores={entregadores} />
          </TabsContent>
          <TabsContent value="andamento" className="mt-4">
            <EntregaList entregas={emAndamento} entregadores={entregadores} />
          </TabsContent>
          <TabsContent value="finalizadas" className="mt-4">
            <EntregaList entregas={finalizadas} entregadores={entregadores} />
          </TabsContent>
          <TabsContent value="todas" className="mt-4">
            <EntregaList entregas={entregas} entregadores={entregadores} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}

function EntregaList({ entregas, entregadores }: { entregas: any[]; entregadores: any[] }) {
  if (entregas.length === 0) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-muted-foreground">
          Nenhuma entrega nesta categoria.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {entregas.map((entrega) => (
        <Link key={entrega.id} href={`/dashboard/entregas/${entrega.id}`}>
          <Card className="transition-colors hover:bg-muted/50 cursor-pointer">
            <CardContent className="py-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium">{entrega.cliente?.name ?? "Cliente"}</span>
                    {entrega.is_urgent && (
                      <Badge variant="destructive" className="text-xs">
                        <AlertTriangle className="mr-1 h-3 w-3" />
                        Urgente
                      </Badge>
                    )}
                    <StatusBadge status={entrega.status} />
                  </div>
                  {entrega.endereco && (
                    <p className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {entrega.endereco.rua}, {entrega.endereco.numero}
                      {entrega.endereco.bairro ? ` - ${entrega.endereco.bairro}` : ""}
                    </p>
                  )}
                  {entrega.valor && (
                    <p className="text-sm font-medium">R$ {Number(entrega.valor).toFixed(2)}</p>
                  )}
                  {entrega.entregador && (
                    <p className="text-xs text-muted-foreground">Entregador: {entrega.entregador.name}</p>
                  )}
                </div>
                {entrega.status === "aguardando_atribuicao" && (
                  <div onClick={(e) => e.preventDefault()}>
                    <AssignEntregadorSelect entregaId={entrega.id} entregadores={entregadores} />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}

function ListSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-9 w-full max-w-md" />
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="space-y-2 py-4">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-56" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
