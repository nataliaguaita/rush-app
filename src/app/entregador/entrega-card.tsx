"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import {
  MapPin,
  AlertTriangle,
  Navigation,
  Camera,
  CheckCircle,
  XCircle,
} from "lucide-react";
import {
  iniciarEntrega,
  registrarEntrega,
  registrarRecusa,
  uploadFotoEntrega,
} from "./actions";
import { toast } from "sonner";

const receiverRoles = [
  { value: "secretaria", label: "Secretária" },
  { value: "porteiro", label: "Porteiro" },
  { value: "morador_vizinho", label: "Morador / Vizinho" },
  { value: "proprietario", label: "Proprietário da Compra" },
];

export function EntregaCard({
  entrega,
  isFirst,
}: {
  entrega: any;
  isFirst: boolean;
}) {
  const [mode, setMode] = useState<"idle" | "registrar" | "recusar">("idle");
  const [loading, setLoading] = useState(false);

  const endereco = entrega.endereco;
  const isEmRota = entrega.status === "em_rota";

  function openNavigation() {
    const address = `${endereco.rua}, ${endereco.numero}, ${endereco.cidade}`;
    const encoded = encodeURIComponent(address);
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${encoded}`,
      "_blank"
    );
  }

  async function handleIniciar() {
    await iniciarEntrega(entrega.id);
    openNavigation();
  }

  async function handleRegistrar(formData: FormData) {
    setLoading(true);
    await registrarEntrega(entrega.id, formData);
    toast.success("Entrega registrada!");
    setLoading(false);
  }

  async function handleRecusar(formData: FormData) {
    setLoading(true);
    await registrarRecusa(entrega.id, formData);
    toast.info("Recusa registrada.");
    setLoading(false);
  }

  async function handleFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("foto", file);
    await uploadFotoEntrega(entrega.id, fd);
    toast.success("Foto enviada!");
  }

  return (
    <Card className={isFirst && !isEmRota ? "border-primary" : ""}>
      <CardContent className="py-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">{entrega.cliente?.name}</span>
              {entrega.is_urgent && (
                <Badge variant="destructive" className="text-xs">
                  <AlertTriangle className="mr-1 h-3 w-3" />
                  Urgente
                </Badge>
              )}
            </div>
            <p className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {endereco?.rua}, {endereco?.numero}
              {endereco?.bairro ? ` - ${endereco.bairro}` : ""}
            </p>
            {entrega.valor && (
              <p className="text-sm">R$ {Number(entrega.valor).toFixed(2)}</p>
            )}
            {entrega.notes && (
              <p className="text-xs text-muted-foreground italic">
                {entrega.notes}
              </p>
            )}
          </div>
          <Badge variant={isEmRota ? "default" : "secondary"}>
            {isEmRota ? "Em Rota" : "Aguardando"}
          </Badge>
        </div>

        {/* Actions */}
        {mode === "idle" && (
          <div className="flex gap-2">
            {!isEmRota && isFirst ? (
              <Button className="flex-1" onClick={handleIniciar}>
                <Navigation className="mr-2 h-4 w-4" />
                Iniciar Entrega
              </Button>
            ) : isEmRota ? (
              <>
                <Button onClick={openNavigation} variant="outline" size="sm">
                  <Navigation className="mr-1 h-3 w-3" />
                  Navegar
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => setMode("registrar")}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Registrar Entrega
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setMode("recusar")}
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              </>
            ) : null}
          </div>
        )}

        {/* Registro de Entrega */}
        {mode === "registrar" && (
          <form action={handleRegistrar} className="space-y-3 border-t pt-3">
            <div className="space-y-2">
              <Label>Quem recebeu? *</Label>
              <Input name="receiver_name" required placeholder="Nome" />
            </div>
            <div className="space-y-2">
              <Label>Cargo *</Label>
              <Select name="receiver_role" required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {receiverRoles.map((r) => (
                    <SelectItem key={r.value} value={r.value}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Foto do local</Label>
              <Input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFoto}
              />
            </div>
            <div className="space-y-2">
              <Label>Observação</Label>
              <Textarea name="receiver_note" rows={2} />
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? "Salvando..." : "Confirmar Entrega"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setMode("idle")}
              >
                Cancelar
              </Button>
            </div>
          </form>
        )}

        {/* Recusa */}
        {mode === "recusar" && (
          <form action={handleRecusar} className="space-y-3 border-t pt-3">
            <div className="space-y-2">
              <Label>Motivo da recusa *</Label>
              <Textarea name="refusal_reason" required rows={2} />
            </div>
            <div className="flex gap-2">
              <Button
                type="submit"
                variant="destructive"
                disabled={loading}
                className="flex-1"
              >
                {loading ? "Salvando..." : "Confirmar Recusa"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setMode("idle")}
              >
                Cancelar
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
