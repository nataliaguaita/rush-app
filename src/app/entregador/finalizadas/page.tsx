"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle, XCircle, MapPin, Clock, AlertTriangle, ChevronLeft, ChevronRight, Users } from "lucide-react";
import { format, addDays, subDays, startOfDay, endOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { RECEIVER_ROLE_LABELS, formatOrderNumber } from "@/lib/status";

export default function EntregasFinalizadasPage() {
  const [entregas, setEntregas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => format(new Date(), "yyyy-MM-dd"));
  const supabase = createClient();

  const load = useCallback(async (dateStr: string) => {
    setLoading(true);
    setError(false);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    const dayStart = startOfDay(new Date(dateStr + "T00:00:00")).toISOString();
    const dayEnd = endOfDay(new Date(dateStr + "T00:00:00")).toISOString();

    const { data, error: fetchError } = await supabase
      .from("entregas")
      .select("*, cliente:clientes(*), endereco:enderecos(*), fotos:entrega_fotos(storage_path)")
      .eq("entregador_id", user.id)
      .in("status", ["entregue", "recusada"])
      .gte("updated_at", dayStart)
      .lte("updated_at", dayEnd)
      .order("updated_at", { ascending: false });

    if (fetchError) {
      setError(true);
      setLoading(false);
      return;
    }

    const list = data ?? [];
    const fotoCache = new Map<string, string>();
    const entregasComFoto = await Promise.all(
      list.map(async (entrega: any) => {
        const path = entrega.fotos?.[0]?.storage_path;
        if (path) {
          if (fotoCache.has(path)) {
            return { ...entrega, fotoUrl: fotoCache.get(path) };
          }
          const { data: signed } = await supabase.storage.from("entregas").createSignedUrl(path, 3600);
          const url = signed?.signedUrl ?? null;
          if (url) fotoCache.set(path, url);
          return { ...entrega, fotoUrl: url };
        }
        return entrega;
      })
    );

    // Share photo URLs within groups
    const groupPhotos = new Map<string, string>();
    for (const e of entregasComFoto) {
      if (e.group_id && e.fotoUrl && !groupPhotos.has(e.group_id)) {
        groupPhotos.set(e.group_id, e.fotoUrl);
      }
    }
    for (const e of entregasComFoto) {
      if (e.group_id && !e.fotoUrl && groupPhotos.has(e.group_id)) {
        e.fotoUrl = groupPhotos.get(e.group_id);
      }
    }

    setEntregas(entregasComFoto);
    setLoading(false);
  }, []);

  useEffect(() => {
    load(selectedDate);
  }, [load, selectedDate]);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold">Entregas Finalizadas</h1>
        <p className="text-sm text-muted-foreground">Histórico de entregas concluídas</p>
      </div>

      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setSelectedDate(format(subDays(new Date(selectedDate + "T00:00:00"), 1), "yyyy-MM-dd"))}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          max={format(new Date(), "yyyy-MM-dd")}
          className="w-auto text-center"
        />
        <Button
          variant="outline"
          size="icon"
          disabled={selectedDate === format(new Date(), "yyyy-MM-dd")}
          onClick={() => setSelectedDate(format(addDays(new Date(selectedDate + "T00:00:00"), 1), "yyyy-MM-dd"))}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {error ? (
        <Card className="border-destructive/30">
          <CardContent className="flex flex-col items-center gap-2 py-10 text-center">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <p className="text-sm font-medium">Não foi possível carregar o histórico.</p>
            <p className="text-sm text-muted-foreground">Verifique sua conexão e tente novamente.</p>
            <Button variant="outline" size="sm" className="mt-2" onClick={() => load(selectedDate)}>
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
            Nenhuma entrega finalizada neste dia.
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {entregas.map((entrega) => (
              <Card key={entrega.id} className="overflow-hidden">
                  <div className="flex">
                    {entrega.fotoUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={entrega.fotoUrl}
                        alt="Foto da entrega"
                        className="w-24 shrink-0 object-cover -my-(--card-spacing)"
                      />
                    )}
                    <CardContent className="flex-1 space-y-2">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono text-muted-foreground">{formatOrderNumber(entrega.order_number)}</span>
                            {entrega.group_id && (
                              <Badge variant="outline" className="border-violet-500/50 bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400 text-[10px] px-1.5 py-0">
                                <Users className="mr-0.5 h-2.5 w-2.5" />
                                Grupo{entrega.endereco?.label ? `: ${entrega.endereco.label}` : ""}
                              </Badge>
                            )}
                          </div>
                          <span className="text-base font-semibold">{entrega.cliente?.name}</span>
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
                      {entrega.endereco && (
                        <p className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {entrega.endereco.rua}, {entrega.endereco.numero}
                        </p>
                      )}
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
                  </div>
                </Card>
          ))}
        </div>
      )}
    </div>
  );
}
