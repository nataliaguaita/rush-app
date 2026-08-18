import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, MapPin, Clock } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default async function EntregasFinalizadasPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: entregas } = await supabase
    .from("entregas")
    .select("*, cliente:clientes(*), endereco:enderecos(*)")
    .eq("entregador_id", user.id)
    .in("status", ["entregue", "recusada"])
    .order("updated_at", { ascending: false });

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold">Entregas Finalizadas</h1>
        <p className="text-sm text-muted-foreground">
          Histórico de entregas concluídas
        </p>
      </div>

      {!entregas || entregas.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            Nenhuma entrega finalizada.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {entregas.map((entrega) => (
            <Card key={entrega.id}>
              <CardContent className="py-4 space-y-2">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="font-medium">
                      {entrega.cliente?.name}
                    </span>
                    {entrega.endereco && (
                      <p className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {entrega.endereco.rua}, {entrega.endereco.numero}
                      </p>
                    )}
                  </div>
                  <Badge
                    variant={
                      entrega.status === "entregue" ? "default" : "destructive"
                    }
                  >
                    {entrega.status === "entregue" ? (
                      <>
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Entregue
                      </>
                    ) : (
                      <>
                        <XCircle className="mr-1 h-3 w-3" />
                        Recusada
                      </>
                    )}
                  </Badge>
                </div>

                <div className="text-xs text-muted-foreground space-y-0.5">
                  {entrega.delivered_at && (
                    <p className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {format(
                        new Date(entrega.delivered_at),
                        "dd/MM/yyyy 'às' HH:mm",
                        { locale: ptBR }
                      )}
                    </p>
                  )}
                  {entrega.receiver_name && (
                    <p>
                      Recebido por: <strong>{entrega.receiver_name}</strong>
                      {entrega.receiver_role &&
                        ` (${entrega.receiver_role.replace("_", " / ")})`}
                    </p>
                  )}
                  {entrega.refusal_reason && (
                    <p className="text-destructive">
                      Motivo: {entrega.refusal_reason}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
