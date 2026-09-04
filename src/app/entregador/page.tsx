"use client";

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { EntregaCard } from "./entrega-card";
import { EntregaGroupCard } from "./entrega-group-card";

export default function EntregadorPage() {
  const [entregas, setEntregas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);
  const [completedAt, setCompletedAt] = useState<string | null>(null);
  const [now, setNow] = useState(() => new Date());
  const supabase = createClient();

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(interval);
  }, []);

  const isNewDay = useMemo(() => {
    if (!completedAt) return false;
    const completed = new Date(completedAt);
    const midnight = new Date(completed);
    midnight.setHours(24, 0, 0, 0);
    return now >= midnight;
  }, [completedAt, now]);

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
      .in("status", ["rota_definida", "em_rota", "retornada"])
      .or("return_confirmed.is.null,return_confirmed.eq.false")
      .order("is_urgent", { ascending: false })
      .order("route_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (fetchError) {
      setError(true);
      setLoading(false);
      setRefreshing(false);
      return;
    }

    const list = data ?? [];
    setEntregas(list);
    if (list.length === 0 && !completedAt) {
      setCompletedAt(new Date().toISOString());
    } else if (list.length > 0) {
      setCompletedAt(null);
    }
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
        <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
          {isNewDay ? (
            <>
              <div className="text-6xl animate-pulse">📦</div>
              <div>
                <p className="text-lg font-semibold">Preparando sua rota...</p>
                <p className="text-sm text-muted-foreground">As entregas do dia estão sendo atribuídas. Aguarde!</p>
              </div>
            </>
          ) : (
            <>
              <div className="text-6xl animate-bounce">😄</div>
              <div>
                <p className="text-lg font-semibold">Tudo entregue!</p>
                <p className="text-sm text-muted-foreground">Você completou todas as entregas do dia. Bom trabalho!</p>
              </div>
            </>
          )}
        </div>
      ) : (
        <GroupedEntregaList entregas={entregas} />
      )}
    </div>
  );
}

function GroupedEntregaList({ entregas }: { entregas: any[] }) {
  const items = useMemo(() => {
    const result: { key: string; type: "single" | "group"; entregas: any[] }[] = [];
    const grouped = new Map<string, any[]>();
    const singles: any[] = [];

    for (const e of entregas) {
      if (e.group_id) {
        const list = grouped.get(e.group_id) || [];
        list.push(e);
        grouped.set(e.group_id, list);
      } else {
        singles.push(e);
      }
    }

    let globalIdx = 0;
    for (const e of entregas) {
      if (e.group_id) {
        const group = grouped.get(e.group_id);
        if (group && group[0].id === e.id) {
          result.push({ key: e.group_id, type: "group", entregas: group });
        }
      } else {
        result.push({ key: e.id, type: "single", entregas: [e] });
      }
    }

    return result;
  }, [entregas]);

  let isFirst = true;
  return (
    <div className="space-y-3">
      {items.map((item) => {
        const first = isFirst;
        isFirst = false;
        if (item.type === "group") {
          return <EntregaGroupCard key={item.key} entregas={item.entregas} isFirst={first} />;
        }
        return <EntregaCard key={item.key} entrega={item.entregas[0]} isFirst={first} />;
      })}
    </div>
  );
}
