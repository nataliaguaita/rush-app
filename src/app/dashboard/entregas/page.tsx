"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, MapPin, AlertTriangle } from "lucide-react";
import { AssignEntregadorSelect } from "./assign-entregador-select";

const statusLabels: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  aguardando_atribuicao: { label: "Aguardando", variant: "secondary" },
  rota_definida: { label: "Rota Definida", variant: "outline" },
  em_rota: { label: "Em Rota", variant: "default" },
  entregue: { label: "Entregue", variant: "default" },
  recusada: { label: "Recusada", variant: "destructive" },
};

export default function EntregasPage() {
  const [entregas, setEntregas] = useState<any[]>([]);
  const [entregadores, setEntregadores] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: e } = await supabase
        .from("entregas")
        .select("*, cliente:clientes(*), endereco:enderecos(*), entregador:profiles!entregas_entregador_id_fkey(*)")
        .order("is_urgent", { ascending: false })
        .order("created_at", { ascending: false });

      setEntregas(e ?? []);

      const { data: ent } = await supabase
        .from("profiles")
        .select("id, name")
        .eq("role", "entregador")
        .eq("active", true);

      setEntregadores(ent ?? []);
    }
    load();
  }, []);

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
        <Link href="/dashboard/entregas/nova">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nova Entrega
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="pendentes">
        <TabsList className="w-full overflow-x-auto sm:w-auto">
          <TabsTrigger value="pendentes">Pendentes ({pendentes.length})</TabsTrigger>
          <TabsTrigger value="andamento">Em Andamento ({emAndamento.length})</TabsTrigger>
          <TabsTrigger value="finalizadas">Finalizadas ({finalizadas.length})</TabsTrigger>
          <TabsTrigger value="todas">Todas ({entregas.length})</TabsTrigger>
        </TabsList>

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
      {entregas.map((entrega) => {
        const statusInfo = statusLabels[entrega.status] ?? { label: entrega.status, variant: "secondary" as const };
        return (
          <Card key={entrega.id}>
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
                    <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
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
                  <AssignEntregadorSelect entregaId={entrega.id} entregadores={entregadores} />
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
