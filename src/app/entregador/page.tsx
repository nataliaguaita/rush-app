"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { EntregaCard } from "./entrega-card";
import { EntregaGroupCard } from "./entrega-group-card";
import type { EntregaWithRelations } from "@/types/database";

const LIST_CACHE = "rush-entregas-cache";

function readCache(): EntregaWithRelations[] | null {
  try {
    const raw = localStorage.getItem(LIST_CACHE);
    return raw ? (JSON.parse(raw) as EntregaWithRelations[]) : null;
  } catch { return null; }
}

export default function EntregadorPage() {
  const [entregas, setEntregas] = useState<EntregaWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);
  const [stale, setStale] = useState(false);
  const [completedAt, setCompletedAt] = useState<string | null>(null);
  const [now, setNow] = useState(() => new Date());
  const supabase = createClient();
  const knownIds = useRef<Set<string> | null>(null);

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

    // Sem rede caímos no cache: a rota já carregada continua utilizável e as
    // finalizações vão para a fila local.
    const fallbackToCache = () => {
      const cached = readCache();
      if (cached) {
        setEntregas(cached);
        setStale(true);
      } else {
        setError(true);
      }
      setLoading(false);
      setRefreshing(false);
    };

    const user = await supabase.auth.getUser()
      .then(({ data }) => data.user)
      .catch(() => null);

    if (!user) {
      fallbackToCache();
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
      fallbackToCache();
      return;
    }

    const list = data ?? [];
    setEntregas(list);
    setStale(false);
    try { localStorage.setItem(LIST_CACHE, JSON.stringify(list)); } catch {}

    const ids = new Set(list.map((e) => e.id));
    if (knownIds.current) {
      const newCount = list.filter((e) => !knownIds.current!.has(e.id)).length;
      if (newCount > 0) {
        toast.success(newCount > 1 ? `${newCount} novas entregas na sua rota!` : "Nova entrega na sua rota!");
        if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate([200, 100, 200]);
      }
    }
    knownIds.current = ids;

    if (list.length === 0 && !completedAt) {
      setCompletedAt(new Date().toISOString());
    } else if (list.length > 0) {
      setCompletedAt(null);
    }
    setLoading(false);
    setRefreshing(false);
  }, [completedAt, supabase]);

  useEffect(() => {
    queueMicrotask(load);

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
  }, [load, supabase]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold">Entregas do Dia</h1>
          <p className="text-sm text-muted-foreground">
            {entregas.length} entregas pendentes
            {stale && " · lista offline"}
          </p>
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

function GroupedEntregaList({ entregas }: { entregas: EntregaWithRelations[] }) {
  const items = useMemo(() => {
    const result: { key: string; type: "single" | "group"; entregas: EntregaWithRelations[] }[] = [];
    const grouped = new Map<string, EntregaWithRelations[]>();
    const singles: EntregaWithRelations[] = [];

    for (const e of entregas) {
      if (e.group_id) {
        const list = grouped.get(e.group_id) || [];
        list.push(e);
        grouped.set(e.group_id, list);
      } else {
        singles.push(e);
      }
    }

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
