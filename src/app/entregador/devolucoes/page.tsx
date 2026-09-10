"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { formatOrderNumber, pendencyBadges } from "@/lib/status";
import type { Cliente, Entrega } from "@/types/database";

type EntregaDevolucao = Entrega & { cliente: Pick<Cliente, "name"> | null };

export default function DevolucoesEntregadorPage() {
  const [entregas, setEntregas] = useState<EntregaDevolucao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const supabase = createClient();

  const load = useCallback(async () => {
    setError(false);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error: loadError } = await supabase
      .from("entregas")
      .select("*, cliente:clientes(name)")
      .eq("entregador_id", user.id)
      .eq("nota_devolvida", false)
      .in("status", ["entregue", "retornada", "recusada"])
      .or("actions.cs.{assinar_nota},actions.cs.{receber},actions.cs.{receber_e_assinar},return_reminder.eq.true")
      .order("delivered_at", { ascending: true, nullsFirst: true });

    if (loadError) {
      setError(true);
      setLoading(false);
      return;
    }

    setEntregas((data ?? []).filter((e) => pendencyBadges(e).length > 0));
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    queueMicrotask(load);
  }, [load]);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold">Devoluções Pendentes</h1>
        <p className="text-sm text-muted-foreground">
          Notas, comprovantes e materiais que você ainda precisa entregar na base.
        </p>
      </div>

      {error ? (
        <Card className="border-destructive/30">
          <CardContent className="flex flex-col items-center gap-2 py-10 text-center">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <p className="text-sm font-medium">Não foi possível carregar as devoluções.</p>
            <Button variant="outline" size="sm" className="mt-2" onClick={() => load()}>
              Tentar novamente
            </Button>
          </CardContent>
        </Card>
      ) : loading ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : entregas.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            Nenhuma devolução pendente. 🎉
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {entregas.map((entrega) => (
            <Card key={entrega.id}>
              <CardContent className="space-y-1 py-4">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{formatOrderNumber(entrega.order_number)}</span>
                  <span className="text-sm text-muted-foreground">{entrega.cliente?.name}</span>
                </div>
                <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                  <span>
                    {entrega.delivered_at
                      ? format(new Date(entrega.delivered_at), "dd/MM/yyyy")
                      : entrega.scheduled_date}
                  </span>
                  {pendencyBadges(entrega).map((label) => (
                    <Badge key={label} variant="outline" className="text-xs">
                      {label}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
