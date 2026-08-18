import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, AlertTriangle } from "lucide-react";
import { EntregaCard } from "./entrega-card";

export default async function EntregadorPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: entregas } = await supabase
    .from("entregas")
    .select("*, cliente:clientes(*), endereco:enderecos(*)")
    .eq("entregador_id", user.id)
    .in("status", ["rota_definida", "em_rota"])
    .order("is_urgent", { ascending: false })
    .order("route_order", { ascending: true })
    .order("created_at", { ascending: true });

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold">Entregas do Dia</h1>
        <p className="text-sm text-muted-foreground">
          {entregas?.length ?? 0} entregas pendentes
        </p>
      </div>

      {!entregas || entregas.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            Nenhuma entrega designada para você hoje.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {entregas.map((entrega, index) => (
            <EntregaCard
              key={entrega.id}
              entrega={entrega}
              isFirst={index === 0}
            />
          ))}
        </div>
      )}
    </div>
  );
}
