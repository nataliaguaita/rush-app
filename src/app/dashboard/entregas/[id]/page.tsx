"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/status-badge";
import { RECEIVER_ROLE_LABELS } from "@/lib/status";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeft,
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
  Pencil,
  Share2,
} from "lucide-react";
import { formatOrderNumber } from "@/lib/status";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { updateEntrega } from "../actions";
import { toast } from "sonner";
import Link from "next/link";

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
  const [editing, setEditing] = useState(false);
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
      const urls = await Promise.all(
        fotosData.map(async (f: any) => {
          const { data } = await supabase.storage
            .from("entregas")
            .createSignedUrl(f.storage_path, 3600);
          return data?.signedUrl ?? "";
        })
      );
      setFotosUrls(urls.filter(Boolean));
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

  const canEdit = entrega?.status === "aguardando_atribuicao";

  async function shareWhatsApp() {
    const deliveredDate = format(new Date(entrega.delivered_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
    const text = [
      `✅ Entrega ${formatOrderNumber(entrega.order_number)} realizada!`,
      entrega.receiver_name ? `Recebido por: ${entrega.receiver_name}` : null,
      `Data: ${deliveredDate}`,
    ].filter(Boolean).join("\n");

    if (fotosUrls.length > 0 && navigator.canShare) {
      try {
        const res = await fetch(fotosUrls[0]);
        const blob = await res.blob();
        const file = new File([blob], "comprovante-entrega.jpg", { type: blob.type });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({ text, files: [file] });
          return;
        }
      } catch {
        // fallback below
      }
    }

    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
  }

  if (loading) {
    return (
      <div className="space-y-4 w-[50vw] min-w-[340px] mx-auto">
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
      <div className="space-y-4 w-[50vw] min-w-[340px] mx-auto">
        <Button variant="ghost" onClick={() => router.back()}>
          <ChevronLeft className="mr-2 h-4 w-4" />
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
          <ChevronLeft className="mr-2 h-4 w-4" />
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

  if (editing) {
    return (
      <EditEntregaView
        entrega={entrega}
        onCancel={() => setEditing(false)}
        onSaved={() => {
          setEditing(false);
          load();
        }}
      />
    );
  }

  return (
    <div className="space-y-4 w-[50vw] min-w-[340px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">
            Entrega {formatOrderNumber(entrega.order_number)}
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <StatusBadge status={entrega.status} />
            {entrega.is_urgent && (
              <Badge variant="destructive">
                <AlertTriangle className="mr-1 h-3 w-3" />
                Urgente
              </Badge>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {canEdit && (
            <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
              <Pencil className="mr-1 h-4 w-4" />
              Editar
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ChevronLeft className="mr-1 h-4 w-4" />
            Voltar
          </Button>
        </div>
      </div>

      {/* Cliente e Valor */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Cliente</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <User className="mt-0.5 h-4 w-4 text-muted-foreground shrink-0" />
            <div>
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
        <CardHeader>
          <CardTitle className="text-lg">Endereço</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground shrink-0" />
            <div className="flex-1 min-w-0">
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
          <CardHeader>
            <CardTitle className="text-lg">Observações e Notas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">

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
        <CardHeader>
          <CardTitle className="text-lg">Responsáveis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
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
          <CardHeader>
            <CardTitle className="text-lg">Informações da Finalização</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">

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

            {entrega.status === "entregue" && entrega.delivered_at && (
              <Button variant="outline" size="sm" onClick={shareWhatsApp} className="w-full">
                <Share2 className="mr-2 h-4 w-4" />
                Compartilhar via WhatsApp
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function EditEntregaView({
  entrega,
  onCancel,
  onSaved,
}: {
  entrega: any;
  onCancel: () => void;
  onSaved: () => void;
}) {
  const [valor, setValor] = useState(() => {
    if (entrega.valor == null) return "";
    return Number(entrega.valor).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  });
  const [actionReceber, setActionReceber] = useState(entrega.actions?.includes("receber") ?? false);
  const [actionAssinar, setActionAssinar] = useState(entrega.actions?.includes("assinar_nota") ?? false);
  const [scheduledDate, setScheduledDate] = useState(entrega.scheduled_date ?? format(new Date(), "yyyy-MM-dd"));
  const [scheduledPeriod, setScheduledPeriod] = useState(entrega.scheduled_period ?? "manha");
  const [isUrgent, setIsUrgent] = useState(entrega.is_urgent ?? false);
  const [returnReminder, setReturnReminder] = useState(entrega.return_reminder ?? false);
  const [returnNotes, setReturnNotes] = useState(entrega.interested_note ?? "");
  const [interestedName, setInterestedName] = useState(entrega.interested_name ?? "");
  const [notes, setNotes] = useState(entrega.notes ?? "");
  const [saving, setSaving] = useState(false);

  function formatCurrency(raw: string) {
    const digits = raw.replace(/\D/g, "");
    if (!digits) return "";
    const num = parseInt(digits, 10) / 100;
    return num.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function parseValor(formatted: string): string {
    if (!formatted) return "";
    return formatted.replace(/\./g, "").replace(",", ".");
  }

  function handleReceber(checked: boolean) {
    setActionReceber(checked);
    if (checked) setActionAssinar(false);
  }

  function handleAssinar(checked: boolean) {
    setActionAssinar(checked);
    if (checked) setActionReceber(false);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData(e.currentTarget);
      fd.set("valor", parseValor(valor));
      await updateEntrega(entrega.id, fd);
      toast.success("Entrega atualizada!");
      onSaved();
    } catch (err: any) {
      toast.error("Erro ao atualizar entrega", { description: err.message });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mx-auto max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">
            Editar Entrega {formatOrderNumber(entrega.order_number)}
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <StatusBadge status={entrega.status} />
          </div>
        </div>
        <Button variant="outline" size="sm" type="button" onClick={onCancel}>
          <ChevronLeft className="mr-1 h-4 w-4" />
          Voltar
        </Button>
      </div>

      {/* Detalhes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Detalhes da Entrega</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="valor">Valor</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">R$</span>
              <Input
                id="valor"
                name="valor_display"
                value={valor}
                onChange={(e) => setValor(formatCurrency(e.target.value))}
                placeholder="0,00"
                className="pl-9"
                inputMode="numeric"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>O motoboy deve:</Label>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 opacity-70">
                <Checkbox id="action-entregar" checked disabled />
                <Label htmlFor="action-entregar" className="text-sm font-normal">Entregar</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="action-receber"
                  name="actions"
                  value="receber"
                  checked={actionReceber}
                  onCheckedChange={handleReceber}
                />
                <Label htmlFor="action-receber" className="text-sm font-normal">Receber</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="action-assinar"
                  name="actions"
                  value="assinar_nota"
                  checked={actionAssinar}
                  onCheckedChange={handleAssinar}
                />
                <Label htmlFor="action-assinar" className="text-sm font-normal">Assinar Nota</Label>
              </div>
            </div>
          </div>
          <input type="hidden" name="actions" value="entregar" />

          <Separator />

          <div className="space-y-2">
            <Label>Programar Entrega</Label>
            <div className="flex gap-2">
              <Input
                type="date"
                name="scheduled_date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="flex-1"
              />
              <Select
                name="scheduled_period"
                value={scheduledPeriod}
                onValueChange={setScheduledPeriod}
                items={{ manha: "Manhã", tarde: "Tarde" }}
              >
                <SelectTrigger className="w-28">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manha">Manhã</SelectItem>
                  <SelectItem value="tarde">Tarde</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-2">
              <Checkbox
                id="is_urgent"
                name="is_urgent"
                checked={isUrgent}
                onCheckedChange={(v) => setIsUrgent(!!v)}
              />
              <Label htmlFor="is_urgent" className="flex items-center gap-1.5 text-sm font-normal">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                Urgente
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="return_reminder"
                name="return_reminder"
                checked={returnReminder}
                onCheckedChange={(v) => setReturnReminder(!!v)}
              />
              <Label htmlFor="return_reminder" className="text-sm font-normal">Lembrete de devolução</Label>
            </div>
          </div>

          {returnReminder && (
            <div className="space-y-2">
              <Label htmlFor="return_notes">O que deve ser pego de devolução?</Label>
              <Textarea
                id="return_notes"
                name="return_notes"
                value={returnNotes}
                onChange={(e) => setReturnNotes(e.target.value)}
                placeholder="Material, local de retirada, observações..."
                rows={2}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Interessado */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Interessado (opcional)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="interested_name">Nome</Label>
            <Input
              id="interested_name"
              name="interested_name"
              value={interestedName}
              onChange={(e) => setInterestedName(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Observações */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Observações</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            name="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Observações sobre a entrega..."
            rows={3}
          />
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3 pb-8">
        <Button variant="outline" type="button" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </div>
    </form>
  );
}
