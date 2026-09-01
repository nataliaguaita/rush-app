"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/status-badge";
import { RECEIVER_ROLE_LABELS } from "@/lib/status";
import {
  ArrowLeft,
  MapPin,
  Copy,
  Check,
  AlertTriangle,
  Clock,
  User,
  Truck,
  FileText,
  Camera,
  DollarSign,
  Calendar,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const actionLabels: Record<string, string> = {
  entregar: "Entregar",
  receber: "Receber",
  assinar_nota: "Assinar Nota",
};

export default function EntregaDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [entrega, setEntrega] = useState<any>(null);
  const [criador, setCriador] = useState<any>(null);
  const [fotos, setFotos] = useState<any[]>([]);
  const [fotosUrls, setFotosUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const supabase = createClient();

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);

    const { data: e, error: fetchError } = await supabase
      .from("entregas")
      .select(
        "*, cliente:clientes(*), endereco:enderecos(*), entregador:profiles!entregas_entregador_id_fkey(*)"
      )
      .eq("id", params.id)
      .single();

    if (fetchError) {
      setError(true);
      setLoading(false);
      return;
    }

    if (!e) {
      setLoading(false);
      return;
    }

    setEntrega(e);

    const { data: creator } = await supabase
      .from("profiles")
      .select("id, name, role")
      .eq("id", e.created_by)
      .single();

    setCriador(creator);

    const { data: fotosData } = await supabase
      .from("entrega_fotos")
      .select("*")
      .eq("entrega_id", e.id)
      .order("created_at", { ascending: true });

    if (fotosData && fotosData.length > 0) {
      setFotos(fotosData);
      const urls = fotosData.map((f: any) => {
        const { data } = supabase.storage
          .from("entregas")
          .getPublicUrl(f.storage_path);
        return data.publicUrl;
      });
      setFotosUrls(urls);
    }

    setLoading(false);
  }, [params.id]);

  useEffect(() => {
    load();
  }, [load]);

  function formatEndereco(endereco: any): string {
    if (!endereco) return "";
    let addr = `${endereco.rua}, ${endereco.numero}`;
    if (endereco.complemento) addr += ` - ${endereco.complemento}`;
    if (endereco.bairro) addr += `, ${endereco.bairro}`;
    addr += `, ${endereco.cidade}`;
    if (endereco.cep) addr += ` - CEP ${endereco.cep}`;
    return addr;
  }

  async function copyAddress() {
    if (!entrega?.endereco) return;
    await navigator.clipboard.writeText(formatEndereco(entrega.endereco));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <Skeleton className="h-6 w-48" />
        </div>
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="space-y-2 py-4">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-56" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        <Card className="border-destructive/30">
          <CardContent className="flex flex-col items-center gap-2 py-10 text-center">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <p className="text-sm font-medium">Não foi possível carregar esta entrega.</p>
            <Button variant="outline" size="sm" className="mt-2" onClick={() => load()}>
              Tentar novamente
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!entrega) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            Entrega não encontrada.
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon-sm" onClick={() => router.back()} aria-label="Voltar">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-xl font-bold">Detalhes da Entrega</h1>
        </div>
        <div className="flex items-center gap-2">
          {entrega.is_urgent && (
            <Badge variant="destructive">
              <AlertTriangle className="mr-1 h-3 w-3" />
              Urgente
            </Badge>
          )}
          <StatusBadge status={entrega.status} />
        </div>
      </div>

      {/* Cliente e Valor */}
      <Card>
        <CardContent className="py-4 space-y-3">
          <div className="flex items-start gap-3">
            <User className="mt-0.5 h-4 w-4 text-muted-foreground shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Cliente</p>
              <p className="font-medium">{entrega.cliente?.name ?? "—"}</p>
              {entrega.cliente?.phone && (
                <p className="text-sm text-muted-foreground">{entrega.cliente.phone}</p>
              )}
            </div>
          </div>

          {entrega.valor != null && (
            <div className="flex items-start gap-3">
              <DollarSign className="mt-0.5 h-4 w-4 text-muted-foreground shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Valor</p>
                <p className="font-medium">R$ {Number(entrega.valor).toFixed(2)}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Endereço */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">Endereço</p>
              <p className="text-sm">{formatEndereco(entrega.endereco)}</p>
              {entrega.endereco?.label && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  ({entrega.endereco.label})
                </p>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={copyAddress}
              title="Copiar endereço"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Observações e Notas */}
      {(entrega.notes || entrega.interested_name || entrega.actions?.length > 0 || entrega.scheduled_period) && (
        <Card>
          <CardContent className="py-4 space-y-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <FileText className="h-4 w-4" />
              Observações e Notas
            </div>

            {entrega.actions?.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground">Ações</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {entrega.actions.map((a: string) => (
                    <Badge key={a} variant="outline" className="text-xs">
                      {actionLabels[a] ?? a}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {entrega.scheduled_period && (
              <div>
                <p className="text-xs text-muted-foreground">Período agendado</p>
                <p className="text-sm">
                  {entrega.scheduled_period === "manha" ? "Manhã" : "Tarde"}
                  {entrega.scheduled_date &&
                    ` — ${format(new Date(entrega.scheduled_date + "T12:00:00"), "dd/MM/yyyy", { locale: ptBR })}`}
                </p>
              </div>
            )}

            {entrega.notes && (
              <div>
                <p className="text-xs text-muted-foreground">Notas</p>
                <p className="text-sm whitespace-pre-wrap">{entrega.notes}</p>
              </div>
            )}

            {entrega.interested_name && (
              <div>
                <p className="text-xs text-muted-foreground">Interessado</p>
                <p className="text-sm">{entrega.interested_name}</p>
                {entrega.interested_note && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {entrega.interested_note}
                  </p>
                )}
              </div>
            )}

            {entrega.return_reminder && (
              <Badge variant="outline" className="text-xs">
                Lembrete de retorno ativo
              </Badge>
            )}
          </CardContent>
        </Card>
      )}

      {/* Responsáveis */}
      <Card>
        <CardContent className="py-4 space-y-3">
          <div className="flex items-start gap-3">
            <User className="mt-0.5 h-4 w-4 text-muted-foreground shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Cadastrado por</p>
              <p className="text-sm font-medium">{criador?.name ?? "—"}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Truck className="mt-0.5 h-4 w-4 text-muted-foreground shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Motoboy atribuído</p>
              <p className="text-sm font-medium">
                {entrega.entregador?.name ?? "Não atribuído"}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Calendar className="mt-0.5 h-4 w-4 text-muted-foreground shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Criada em</p>
              <p className="text-sm">
                {format(new Date(entrega.created_at), "dd/MM/yyyy 'às' HH:mm", {
                  locale: ptBR,
                })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informações da entrega (quando finalizada) */}
      {(entrega.status === "entregue" || entrega.status === "recusada") && (
        <Card>
          <CardContent className="py-4 space-y-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-4 w-4" />
              Informações da Finalização
            </div>

            {entrega.status === "entregue" && (
              <>
                {entrega.receiver_name && (
                  <div>
                    <p className="text-xs text-muted-foreground">Recebido por</p>
                    <p className="text-sm font-medium">
                      {entrega.receiver_name}
                      {entrega.receiver_role && (
                        <span className="font-normal text-muted-foreground">
                          {" "}— {RECEIVER_ROLE_LABELS[entrega.receiver_role] ?? entrega.receiver_role}
                        </span>
                      )}
                    </p>
                  </div>
                )}
                {entrega.receiver_note && (
                  <div>
                    <p className="text-xs text-muted-foreground">Observação do entregador</p>
                    <p className="text-sm whitespace-pre-wrap">{entrega.receiver_note}</p>
                  </div>
                )}
              </>
            )}

            {entrega.status === "recusada" && entrega.refusal_reason && (
              <div>
                <p className="text-xs text-muted-foreground">Motivo da recusa</p>
                <p className="text-sm text-destructive whitespace-pre-wrap">
                  {entrega.refusal_reason}
                </p>
              </div>
            )}

            {entrega.delivered_at && (
              <div>
                <p className="text-xs text-muted-foreground">
                  {entrega.status === "entregue" ? "Entregue em" : "Recusada em"}
                </p>
                <p className="text-sm">
                  {format(new Date(entrega.delivered_at), "dd/MM/yyyy 'às' HH:mm", {
                    locale: ptBR,
                  })}
                </p>
              </div>
            )}

            {/* Fotos */}
            {fotosUrls.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Camera className="h-4 w-4 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">
                    {fotosUrls.length === 1 ? "Foto da entrega" : `Fotos da entrega (${fotosUrls.length})`}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {fotosUrls.map((url, i) => (
                    <a
                      key={fotos[i]?.id ?? i}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block overflow-hidden rounded-lg border"
                    >
                      <img
                        src={url}
                        alt={`Foto ${i + 1}`}
                        className="h-40 w-full object-cover"
                      />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
