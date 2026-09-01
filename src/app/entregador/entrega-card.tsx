"use client";

import { useRef, useState } from "react";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { StatusBadge } from "@/components/status-badge";
import Link from "next/link";
import {
  MapPin,
  AlertTriangle,
  Navigation,
  Camera,
  CheckCircle,
  XCircle,
  Loader2,
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
  const [fotoStatus, setFotoStatus] = useState<"idle" | "uploading" | "done" | "error">("idle");
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [confirmType, setConfirmType] = useState<"entrega" | "recusa" | null>(null);
  const pendingFormData = useRef<FormData | null>(null);

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

  async function handleRegistrar() {
    const formData = pendingFormData.current;
    if (!formData) return;
    setLoading(true);
    await registrarEntrega(entrega.id, formData);
    toast.success("Entrega registrada!");
    setLoading(false);
  }

  async function handleRecusar() {
    const formData = pendingFormData.current;
    if (!formData) return;
    setLoading(true);
    await registrarRecusa(entrega.id, formData);
    toast.info("Recusa registrada.");
    setLoading(false);
  }

  function handleConfirmSubmit(e: React.FormEvent<HTMLFormElement>, type: "entrega" | "recusa") {
    e.preventDefault();
    pendingFormData.current = new FormData(e.currentTarget);
    setConfirmType(type);
  }

  async function handleFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setFotoPreview(URL.createObjectURL(file));
    setFotoStatus("uploading");

    const fd = new FormData();
    fd.append("foto", file);
    try {
      await uploadFotoEntrega(entrega.id, fd);
      setFotoStatus("done");
      toast.success("Foto enviada!");
    } catch {
      setFotoStatus("error");
      toast.error("Falha ao enviar a foto. Tente novamente.");
    }
  }

  return (
    <Card
      className={
        isFirst && !isEmRota
          ? "border-l-4 border-l-primary bg-primary/5"
          : ""
      }
    >
      <CardContent className="py-4 space-y-3">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0 space-y-1">
            {isFirst && !isEmRota && (
              <p className="text-xs font-semibold tracking-wide text-primary uppercase">
                Próxima parada
              </p>
            )}
            <div className="flex flex-wrap items-center gap-2">
              <Link href={`/dashboard/entregas/${entrega.id}`} className="font-medium hover:underline">
                {entrega.cliente?.name}
              </Link>
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
          <StatusBadge status={entrega.status} />
        </div>

        {/* Actions */}
        {mode === "idle" && (
          <div className="flex flex-col gap-2 sm:flex-row">
            {!isEmRota && isFirst ? (
              <Button size="lg" className="flex-1" onClick={handleIniciar}>
                <Navigation className="mr-2 h-4 w-4" />
                Iniciar Entrega
              </Button>
            ) : isEmRota ? (
              <>
                <Button onClick={openNavigation} variant="outline" size="lg">
                  <Navigation className="mr-1 h-4 w-4" />
                  Navegar
                </Button>
                <Button
                  size="lg"
                  className="flex-1"
                  onClick={() => setMode("registrar")}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Registrar Entrega
                </Button>
                <Button
                  variant="destructive"
                  size="lg"
                  className="gap-2"
                  onClick={() => setMode("recusar")}
                >
                  <XCircle className="h-4 w-4" />
                  Recusar
                </Button>
              </>
            ) : null}
          </div>
        )}

        {/* Registro de Entrega */}
        {mode === "registrar" && (
          <form
            onSubmit={(e) => handleConfirmSubmit(e, "entrega")}
            className="space-y-3 border-t pt-3"
          >
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
              {fotoStatus !== "idle" && (
                <div className="flex items-center gap-2 rounded-lg border p-2">
                  {fotoPreview && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={fotoPreview}
                      alt="Pré-visualização da foto anexada"
                      className="h-12 w-12 shrink-0 rounded object-cover"
                    />
                  )}
                  <div className="flex min-w-0 flex-1 items-center gap-1.5 text-sm">
                    {fotoStatus === "uploading" && (
                      <>
                        <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin text-muted-foreground" />
                        <span className="text-muted-foreground">Enviando foto...</span>
                      </>
                    )}
                    {fotoStatus === "done" && (
                      <>
                        <Camera className="h-3.5 w-3.5 shrink-0 text-status-success" />
                        <span className="text-status-success">Foto anexada</span>
                      </>
                    )}
                    {fotoStatus === "error" && (
                      <>
                        <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-destructive" />
                        <span className="text-destructive">Falha ao enviar. Tente novamente.</span>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label>Observação</Label>
              <Textarea name="receiver_note" rows={2} />
            </div>
            <div className="flex gap-2">
              <Button
                type="submit"
                size="lg"
                disabled={loading || fotoStatus === "uploading"}
                className="flex-1"
              >
                {fotoStatus === "uploading" ? "Aguardando foto..." : "Confirmar Entrega"}
              </Button>
              <Button
                type="button"
                size="lg"
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
          <form
            onSubmit={(e) => handleConfirmSubmit(e, "recusa")}
            className="space-y-3 border-t pt-3"
          >
            <div className="space-y-2">
              <Label>Motivo da recusa *</Label>
              <Textarea name="refusal_reason" required rows={2} />
            </div>
            <div className="flex gap-2">
              <Button
                type="submit"
                variant="destructive"
                size="lg"
                disabled={loading}
                className="flex-1"
              >
                Confirmar Recusa
              </Button>
              <Button
                type="button"
                size="lg"
                variant="ghost"
                onClick={() => setMode("idle")}
              >
                Cancelar
              </Button>
            </div>
          </form>
        )}
      </CardContent>

      <AlertDialog open={confirmType !== null} onOpenChange={(open) => !open && setConfirmType(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmType === "entrega" ? "Confirmar entrega?" : "Confirmar recusa?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmType === "entrega"
                ? `Isso marca a entrega de "${entrega.cliente?.name}" como concluída e não pode ser desfeito.`
                : `Isso marca a entrega de "${entrega.cliente?.name}" como recusada e não pode ser desfeito.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => (pendingFormData.current = null)}>
              Voltar
            </AlertDialogCancel>
            <AlertDialogAction
              variant={confirmType === "recusa" ? "destructive" : "default"}
              onClick={() => {
                if (confirmType === "entrega") handleRegistrar();
                if (confirmType === "recusa") handleRecusar();
                setConfirmType(null);
              }}
            >
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
