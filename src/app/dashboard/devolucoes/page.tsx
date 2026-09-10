"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, Check, Undo2 } from "lucide-react";
import { format } from "date-fns";
import { formatOrderNumber } from "@/lib/status";
import { darBaixaDevolucao, desfazerBaixaDevolucao } from "./actions";
import type { Cliente, Entrega, Profile } from "@/types/database";

type EntregaDevolucao = Entrega & {
  cliente: Pick<Cliente, "name"> | null;
  entregador: Pick<Profile, "id" | "name"> | null;
};

function pendencyBadges(entrega: Pick<Entrega, "actions" | "return_reminder">): string[] {
  const badges: string[] = [];
  if (entrega.actions?.includes("assinar_nota")) badges.push("Nota assinada");
  if (entrega.actions?.includes("receber") || entrega.actions?.includes("receber_e_assinar")) {
    badges.push("Nota + comprovante");
  }
  if (entrega.return_reminder) badges.push("Material (troca/crédito)");
  return badges;
}

export default function DevolucoesPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [entregas, setEntregas] = useState<EntregaDevolucao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [tab, setTab] = useState<"pendentes" | "conferidas">("pendentes");
  const [busyId, setBusyId] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace("/login"); return; }
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      if (!data || data.role !== "admin") { router.replace("/dashboard"); return; }
      setProfile(data as Profile);
    }
    checkAuth();
  }, [router, supabase]);

  const load = useCallback(async () => {
    setError(false);
    const { data, error: loadError } = await supabase
      .from("entregas")
      .select("*, cliente:clientes(name), entregador:profiles!entregas_entregador_id_fkey(id, name)")
      .in("status", ["entregue", "retornada", "recusada"])
      .or("actions.cs.{assinar_nota},actions.cs.{receber},actions.cs.{receber_e_assinar},return_reminder.eq.true")
      .order("delivered_at", { ascending: true, nullsFirst: true });

    if (loadError) {
      setError(true);
      setLoading(false);
      return;
    }

    setEntregas(data ?? []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    if (!profile) return;
    queueMicrotask(load);
  }, [profile, load]);

  const relevantes = entregas.filter((e) => pendencyBadges(e).length > 0);
  const pendentes = relevantes.filter((e) => !e.nota_devolvida);
  const conferidas = relevantes.filter((e) => e.nota_devolvida);
  const lista = tab === "pendentes" ? pendentes : conferidas;

  async function handleBaixa(id: string) {
    setBusyId(id);
    try {
      await darBaixaDevolucao(id);
      await load();
    } finally {
      setBusyId(null);
    }
  }

  async function handleDesfazer(id: string) {
    setBusyId(id);
    try {
      await desfazerBaixaDevolucao(id);
      await load();
    } finally {
      setBusyId(null);
    }
  }

  if (!profile) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Devoluções</h1>
        <p className="text-muted-foreground">
          Controle de nota, comprovante e material a devolver das entregas finalizadas.
        </p>
      </div>

      <div className="flex h-9 w-fit rounded-md border border-input">
        <button
          type="button"
          className={`flex items-center gap-1.5 rounded-l-md px-3 text-sm font-medium transition-colors ${
            tab === "pendentes" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent"
          }`}
          onClick={() => setTab("pendentes")}
        >
          Pendentes {pendentes.length > 0 && `(${pendentes.length})`}
        </button>
        <button
          type="button"
          className={`flex items-center gap-1.5 rounded-r-md px-3 text-sm font-medium transition-colors ${
            tab === "conferidas" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent"
          }`}
          onClick={() => setTab("conferidas")}
        >
          Conferidas
        </button>
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
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : lista.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            {tab === "pendentes" ? "Nenhuma pendência de devolução." : "Nenhuma devolução conferida ainda."}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {lista.map((entrega) => (
            <Card
              key={entrega.id}
              className="cursor-pointer transition-colors hover:bg-muted/40"
              onClick={() => router.push(`/dashboard/entregas/${entrega.id}`)}
            >
              <CardContent className="flex flex-wrap items-center justify-between gap-3 py-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{formatOrderNumber(entrega.order_number)}</span>
                    <span className="text-sm text-muted-foreground">{entrega.cliente?.name}</span>
                    {entrega.valor != null && (
                      <span className="text-sm font-medium text-emerald-600">
                        R$ {Number(entrega.valor).toFixed(2)}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                    <span>{entrega.entregador?.name ?? "Sem entregador"}</span>
                    <span>·</span>
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
                </div>
                {tab === "pendentes" ? (
                  <Button
                    size="sm"
                    disabled={busyId === entrega.id}
                    onClick={(e) => { e.stopPropagation(); handleBaixa(entrega.id); }}
                  >
                    <Check className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Conferido</span>
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={busyId === entrega.id}
                    onClick={(e) => { e.stopPropagation(); handleDesfazer(entrega.id); }}
                  >
                    <Undo2 className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Desfazer</span>
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
