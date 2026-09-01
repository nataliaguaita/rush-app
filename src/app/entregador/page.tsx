"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { EntregaCard } from "./entrega-card";

export default function EntregadorPage() {
  const [entregas, setEntregas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);
  const supabase = createClient();

  const load = useCallback(async ({ silent = false } = {}) => {
    if (silent) setRefreshing(true);
    setError(false);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      setRefreshing(false);
      return;
    }

    const { data, error: fetchError } = await supabase
      .from("entregas")
      .select("*, cliente:clientes(*), endereco:enderecos(*)")
      .eq("entregador_id", user.id)
      .in("status", ["rota_definida", "em_rota"])
      .order("is_urgent", { ascending: false })
      .order("route_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (fetchError) {
      setError(true);
      setLoading(false);
      setRefreshing(false);
      return;
    }

    setEntregas(data ?? []);
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    load();

    const channel = supabase
      .channel("entregador-rota")
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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold">Entregas do Dia</h1>
          <p className="text-sm text-muted-foreground">{entregas.length} entregas pendentes</p>
        </div>
        <Button variant="outline" size="icon" onClick={() => load({ silent: true })} disabled={refreshing} aria-label="Atualizar">
          <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
        </Button>
      </div>

      {error ? (
        <Card className="border-destructive/30">
          <CardContent className="flex flex-col items-center gap-2 py-10 text-center">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <p className="text-sm font-medium">Não foi possível carregar suas entregas.</p>
            <p className="text-sm text-muted-foreground">Verifique sua conexão e tente novamente.</p>
            <Button variant="outline" size="sm" className="mt-2" onClick={() => load()}>
              Tentar novamente
            </Button>
          </CardContent>
        </Card>
      ) : loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="space-y-2 py-4">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-56" />
                <Skeleton className="mt-2 h-11 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : entregas.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            Nenhuma entrega designada para você hoje.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {entregas.map((entrega, index) => (
            <EntregaCard key={entrega.id} entrega={entrega} isFirst={index === 0} />
          ))}
        </div>
      )}
    </div>
  );
}
