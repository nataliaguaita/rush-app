"use client";

import { useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RECEIVER_ROLE_LABELS } from "@/lib/status";
import type { EntregaWithRelations, ReceiverRole } from "@/types/database";
import { finalizarPeloPainel } from "../actions";

type Modo = "entregue" | "recusada" | null;

export function FinalizarPainelCard({
  entrega,
  onDone,
}: {
  entrega: EntregaWithRelations;
  onDone: () => void;
}) {
  const [modo, setModo] = useState<Modo>(null);
  const [nome, setNome] = useState("");
  const [papel, setPapel] = useState<ReceiverRole | "">("");
  const [obs, setObs] = useState("");
  const [quando, setQuando] = useState(() => format(new Date(), "yyyy-MM-dd'T'HH:mm"));
  const [motivo, setMotivo] = useState("");
  const [saving, setSaving] = useState(false);

  const isRetornada = entrega.status === "retornada";

  async function submit(f: Parameters<typeof finalizarPeloPainel>[1], msg: string) {
    setSaving(true);
    try {
      await finalizarPeloPainel(entrega.id, f);
      toast.success(msg);
      onDone();
    } catch (err) {
      toast.error("Erro ao finalizar entrega", { description: err instanceof Error ? err.message : undefined });
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className="border-amber-500/40">
      <CardHeader>
        <CardTitle className="text-lg">Finalizar pelo painel</CardTitle>
        <p className="text-xs text-muted-foreground">
          Use quando o entregador não conseguiu finalizar pelo app. Fica registrado que foi finalizada por você.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {isRetornada ? (
          <Button
            disabled={saving}
            onClick={() => submit({ tipo: "retorno" }, "Retorno confirmado.")}
          >
            Confirmar retorno
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              variant={modo === "entregue" ? "default" : "outline"}
              size="sm"
              onClick={() => setModo("entregue")}
            >
              Marcar como entregue
            </Button>
            <Button
              variant={modo === "recusada" ? "default" : "outline"}
              size="sm"
              onClick={() => setModo("recusada")}
            >
              Marcar como recusada
            </Button>
          </div>
        )}

        {modo === "entregue" && !isRetornada && (
          <form
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              submit(
                {
                  tipo: "entregue",
                  receiver_name: nome,
                  receiver_role: papel || null,
                  receiver_note: obs,
                  delivered_at: new Date(quando).toISOString(),
                },
                "Entrega finalizada.",
              );
            }}
          >
            <div className="space-y-1">
              <Label htmlFor="fp-nome">Recebido por</Label>
              <Input id="fp-nome" required value={nome} onChange={(e) => setNome(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>Papel (opcional)</Label>
              <Select value={papel} onValueChange={(v) => setPapel(v as ReceiverRole)}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  {Object.entries(RECEIVER_ROLE_LABELS).map(([k, label]) => (
                    <SelectItem key={k} value={k}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="fp-quando">Entregue em</Label>
              <Input
                id="fp-quando"
                type="datetime-local"
                required
                max={format(new Date(), "yyyy-MM-dd'T'HH:mm")}
                value={quando}
                onChange={(e) => setQuando(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="fp-obs">Observação (opcional)</Label>
              <Textarea id="fp-obs" value={obs} onChange={(e) => setObs(e.target.value)} />
            </div>
            <Button type="submit" disabled={saving}>Confirmar entrega</Button>
          </form>
        )}

        {modo === "recusada" && !isRetornada && (
          <form
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              submit({ tipo: "recusada", motivo }, "Entrega marcada como recusada.");
            }}
          >
            <div className="space-y-1">
              <Label htmlFor="fp-motivo">Motivo da recusa</Label>
              <Textarea id="fp-motivo" required value={motivo} onChange={(e) => setMotivo(e.target.value)} />
            </div>
            <Button type="submit" disabled={saving}>Confirmar recusa</Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
