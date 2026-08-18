"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { EntregaCard } from "./entrega-card";

export default function EntregadorPage() {
  const [entregas, setEntregas] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("entregas")
        .select("*, cliente:clientes(*), endereco:enderecos(*)")
        .eq("entregador_id", user.id)
        .in("status", ["rota_definida", "em_rota"])
        .order("is_urgent", { ascending: false })
        .order("route_order", { ascending: true })
        .order("created_at", { ascending: true });

      setEntregas(data ?? []);
    }
    load();
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold">Entregas do Dia</h1>
        <p className="text-sm text-muted-foreground">{entregas.length} entregas pendentes</p>
      </div>

      {entregas.length === 0 ? (
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
