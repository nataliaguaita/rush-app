"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { CheckCircle, XCircle, MapPin, Clock, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { RECEIVER_ROLE_LABELS } from "@/lib/status";

export default function EntregasFinalizadasPage() {
  const [entregas, setEntregas] = useState<any[]>([]);
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

    const { data, error: fetchError } = await supabase
      .from("entregas")
      .select("*, cliente:clientes(*), endereco:enderecos(*)")
      .eq("entregador_id", user.id)
      .in("status", ["entregue", "recusada"])
      .order("updated_at", { ascending: false });

    if (fetchError) {
      setError(true);
      setLoading(false);
      return;
    }

    setEntregas(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold">Entregas Finalizadas</h1>
        <p className="text-sm text-muted-foreground">Histórico de entregas concluídas</p>
      </div>

      {error ? (
        <Card className="border-destructive/30">
          <CardContent className="flex flex-col items-center gap-2 py-10 text-center">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <p className="text-sm font-medium">Não foi possível carregar o histórico.</p>
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
              </CardContent>
            </Card>
          ))}
        </div>
      ) : entregas.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            Nenhuma entrega finalizada.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {entregas.map((entrega) => (
            <Link key={entrega.id} href={`/dashboard/entregas/${entrega.id}`}>
              <Card className="transition-colors hover:bg-muted/50 cursor-pointer">
                <CardContent className="py-4 space-y-2">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0 space-y-1">
                      <span className="font-medium">{entrega.cliente?.name}</span>
                      {entrega.endereco && (
                        <p className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {entrega.endereco.rua}, {entrega.endereco.numero}
                        </p>
                      )}
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        entrega.status === "entregue"
                          ? "border-transparent bg-status-success/10 text-status-success"
                          : "border-transparent bg-destructive/10 text-destructive"
                      }
                    >
                      {entrega.status === "entregue" ? (
                        <><CheckCircle className="mr-1 h-3 w-3" />Entregue</>
                      ) : (
                        <><XCircle className="mr-1 h-3 w-3" />Recusada</>
                      )}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground space-y-0.5">
                    {entrega.delivered_at && (
                      <p className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {format(new Date(entrega.delivered_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                      </p>
                    )}
                    {entrega.receiver_name && (
                      <p>Recebido por: <strong>{entrega.receiver_name}</strong>
                        {entrega.receiver_role && ` (${RECEIVER_ROLE_LABELS[entrega.receiver_role] ?? entrega.receiver_role})`}
                      </p>
                    )}
                    {entrega.refusal_reason && (
                      <p className="text-destructive">Motivo: {entrega.refusal_reason}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
