"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
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
import { formatOrderNumber } from "@/lib/status";
import {
  MapPin,
  AlertTriangle,
  Navigation,
  Camera,
  CheckCircle,
  XCircle,
  Loader2,
  Package,
  Users,
} from "lucide-react";
import {
  iniciarEntrega,
  registrarEntrega,
  registrarRecusa,
  uploadFotoEntrega,
  removerFotosEntrega,
  copiarFotoParaEntregas,
} from "./actions";
import { toast } from "sonner";

const receiverRoles = [
  { value: "secretaria", label: "Secretária" },
  { value: "porteiro", label: "Porteiro" },
  { value: "morador_vizinho", label: "Morador / Vizinho" },
  { value: "proprietario", label: "Proprietário da Compra" },
  { value: "outro", label: "Outro" },
];

export function EntregaGroupCard({
  entregas,
  isFirst,
}: {
  entregas: any[];
  isFirst: boolean;
}) {
  const [mode, setMode] = useState<"idle" | "registrar" | "recusar">("idle");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [fotoStatus, setFotoStatus] = useState<"idle" | "uploading" | "done" | "error">("idle");
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [fotoEntregaId, setFotoEntregaId] = useState<string | null>(null);
  const [receiverName, setReceiverName] = useState("");
  const [receiverRole, setReceiverRole] = useState("");
  const [customRole, setCustomRole] = useState("");
  const [confirmType, setConfirmType] = useState<"entrega" | "recusa" | null>(null);
  const pendingNote = useRef("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const firstEntrega = entregas[0];
  const endereco = firstEntrega?.endereco;
  const allEmRota = entregas.every((e) => e.status === "em_rota");
  const anyEmRota = entregas.some((e) => e.status === "em_rota");
  const pendingEntregas = entregas.filter((e) => e.status !== "entregue" && e.status !== "recusada" && e.status !== "retornada");

  function toggleSelected(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function selectAll() {
    setSelectedIds(new Set(pendingEntregas.map((e) => e.id)));
  }

  function openNavigation() {
    if (!endereco) return;
    const address = `${endereco.rua}, ${endereco.numero}, ${endereco.cidade}`;
    window.open(`geo:0,0?q=${encodeURIComponent(address)}`, "_self");
  }

  async function handleIniciar() {
    for (const e of entregas) {
      if (e.status === "rota_definida") await iniciarEntrega(e.id);
    }
    openNavigation();
  }

  function compressImage(file: File, maxSize = 1200, quality = 0.7): Promise<File> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxSize || height > maxSize) {
          const ratio = Math.min(maxSize / width, maxSize / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d")!.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (!blob) return reject(new Error("Falha ao comprimir"));
            resolve(new File([blob], file.name.replace(/\.\w+$/, ".jpg"), { type: "image/jpeg" }));
          },
          "image/jpeg",
          quality
        );
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }

  async function handleFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setFotoPreview(URL.createObjectURL(file));
    setFotoStatus("uploading");

    // Upload photo to the first selected entrega (or first entrega if none selected)
    const targetId = [...selectedIds][0] || firstEntrega.id;
    setFotoEntregaId(targetId);

    try {
      const compressed = await compressImage(file);
      const fd = new FormData();
      fd.append("foto", compressed);
      await uploadFotoEntrega(targetId, fd);
      setFotoStatus("done");
      toast.success("Foto enviada!");
    } catch {
      setFotoStatus("error");
      toast.error("Falha ao enviar a foto.");
    }
  }

  async function handleRegistrarBatch() {
    if (selectedIds.size === 0) return;
    setLoading(true);
    try {
      const ids = [...selectedIds];
      for (const id of ids) {
        await registrarEntrega(id, {
          receiver_name: receiverName,
          receiver_role: receiverRole,
          custom_role: receiverRole === "outro" ? customRole : undefined,
          receiver_note: pendingNote.current,
        });
      }
      if (fotoEntregaId && ids.length > 1) {
        const others = ids.filter((id) => id !== fotoEntregaId);
        await copiarFotoParaEntregas(fotoEntregaId, others);
      }
      toast.success(`${ids.length} entrega${ids.length > 1 ? "s" : ""} registrada${ids.length > 1 ? "s" : ""}!`);
      setMode("idle");
      setSelectedIds(new Set());
      setReceiverName("");
      setReceiverRole("");
      setCustomRole("");
      setFotoStatus("idle");
      setFotoPreview(null);
    } catch {
      toast.error("Falha ao registrar entregas.");
    }
    setLoading(false);
  }

  async function handleRecusarBatch() {
    if (selectedIds.size === 0) return;
    setLoading(true);
    try {
      const ids = [...selectedIds];
      for (const id of ids) {
        await registrarRecusa(id, pendingNote.current || "");
      }
      toast.info(`${ids.length} entrega${ids.length > 1 ? "s" : ""} recusada${ids.length > 1 ? "s" : ""}.`);
      setMode("idle");
      setSelectedIds(new Set());
    } catch {
      toast.error("Falha ao registrar recusa.");
    }
    setLoading(false);
  }

  function handleConfirmSubmit(e: React.FormEvent<HTMLFormElement>, type: "entrega" | "recusa") {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    pendingNote.current = (fd.get(type === "entrega" ? "receiver_note" : "refusal_reason") as string) || "";
    setConfirmType(type);
  }

  return (
    <Card className="relative overflow-hidden border-l-4 border-l-violet-500">
      <CardContent className="space-y-3">
        {/* Group Header */}
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0 space-y-1">
            {isFirst && !anyEmRota && (
              <p className="text-xs font-semibold tracking-wide text-primary uppercase">Próxima parada</p>
            )}
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="border-violet-500/50 bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400">
                <Users className="mr-1 h-3 w-3" />
                Grupo · {entregas.length} entregas
              </Badge>
              {firstEntrega.is_urgent && (
                <Badge variant="destructive" className="text-xs">
                  <AlertTriangle className="mr-1 h-3 w-3" />
                  Urgente
                </Badge>
              )}
            </div>
            {endereco && (
              <p className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-3 w-3" />
                {endereco.rua}, {endereco.numero}{endereco.bairro ? ` - ${endereco.bairro}` : ""}
              </p>
            )}
          </div>
        </div>

        {/* Destinatários list */}
        <div className="space-y-1.5">
          {entregas.map((e) => {
            const isDone = e.status === "entregue" || e.status === "recusada" || e.status === "retornada";
            return (
              <div
                key={e.id}
                className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-sm ${
                  isDone ? "bg-muted/50 line-through opacity-50" : "bg-muted/30"
                }`}
              >
                {mode !== "idle" && !isDone && (
                  <Checkbox
                    checked={selectedIds.has(e.id)}
                    onCheckedChange={() => toggleSelected(e.id)}
                    className="h-4 w-4"
                  />
                )}
                <span className="text-xs font-mono text-muted-foreground">{formatOrderNumber(e.order_number)}</span>
                <span className="flex-1 truncate font-medium">{e.cliente?.name}</span>
                <Badge variant="secondary" className="text-xs shrink-0">
                  <Package className="mr-0.5 h-2.5 w-2.5" />
                  {e.numero_sacolas ?? 1}
                </Badge>
                {isDone && (
                  <Badge variant={e.status === "entregue" ? "default" : "destructive"} className="text-xs shrink-0">
                    {e.status === "entregue" ? "Entregue" : e.status === "retornada" ? "Retornada" : "Recusada"}
                  </Badge>
                )}
              </div>
            );
          })}
        </div>

        {/* Actions */}
        {mode === "idle" && pendingEntregas.length > 0 && (
          <div className="flex flex-col gap-2 sm:flex-row">
            {!anyEmRota && isFirst ? (
              <Button size="lg" className="flex-1 min-h-12 bg-[#0090FF] text-white font-bold hover:bg-[#0090FF]/80" onClick={handleIniciar}>
                <Navigation className="mr-2 h-4 w-4" />
                Iniciar Entrega
              </Button>
            ) : anyEmRota ? (
              <>
                <Button onClick={openNavigation} variant="outline" size="lg" className="w-full sm:w-auto border-[#0090FF] text-[#0090FF] font-bold hover:bg-[#0090FF]/10">
                  <Navigation className="mr-1 h-4 w-4" />
                  Navegar
                </Button>
                <Button
                  size="lg"
                  className="w-full sm:flex-1 bg-[#0090FF] text-white font-bold hover:bg-[#0090FF]/80"
                  onClick={() => { setMode("registrar"); selectAll(); }}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Registrar Entregas
                </Button>
                <Button
                  variant="destructive"
                  size="lg"
                  className="w-full sm:w-auto gap-2"
                  onClick={() => { setMode("recusar"); }}
                >
                  <XCircle className="h-4 w-4" />
                  Recusar
                </Button>
              </>
            ) : null}
          </div>
        )}

        {/* Batch registration form */}
        {mode === "registrar" && (
          <form onSubmit={(e) => handleConfirmSubmit(e, "entrega")} className="space-y-3 border-t pt-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">{selectedIds.size} de {pendingEntregas.length} selecionada{selectedIds.size !== 1 ? "s" : ""}</p>
              <div className="flex gap-2">
                <Button type="button" variant="ghost" size="sm" onClick={selectAll}>Selecionar todas</Button>
                <Button type="button" variant="ghost" size="sm" onClick={() => setSelectedIds(new Set())}>Limpar</Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Quem recebeu? *</Label>
              <Input name="receiver_name" required placeholder="Nome" value={receiverName} onChange={(e) => setReceiverName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Cargo *</Label>
              <Select name="receiver_role" required value={receiverRole} onValueChange={(value) => setReceiverRole(value ?? "")}>
                <SelectTrigger size="lg" className="w-full">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {receiverRoles.map((r) => (
                    <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {receiverRole === "outro" && (
                <Input name="custom_role" required placeholder="Qual o cargo?" value={customRole} onChange={(e) => setCustomRole(e.target.value)} />
              )}
            </div>
            <div className="space-y-2">
              <Label>Foto do local *</Label>
              <input ref={fileInputRef} type="file" accept="image/*" capture="environment" onChange={handleFoto} className="hidden" />
              {fotoStatus === "idle" || fotoStatus === "error" ? (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-muted-foreground/30 p-6 text-muted-foreground transition-colors hover:border-[#0090FF] hover:text-[#0090FF]"
                >
                  <Camera className="h-5 w-5" />
                  <span className="text-sm font-medium">Tirar Foto</span>
                </button>
              ) : (
                <div className="relative overflow-hidden rounded-lg border">
                  {fotoPreview && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={fotoPreview} alt="Foto" className="h-32 w-full object-cover" />
                  )}
                  <div className="flex items-center justify-between p-2">
                    <div className="flex items-center gap-1.5 text-sm">
                      {fotoStatus === "uploading" && (
                        <><Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" /><span className="text-muted-foreground">Enviando...</span></>
                      )}
                      {fotoStatus === "done" && (
                        <><Camera className="h-3.5 w-3.5 text-status-success" /><span className="text-status-success">Foto anexada</span></>
                      )}
                    </div>
                    {fotoStatus === "done" && fotoEntregaId && (
                      <button
                        type="button"
                        onClick={async () => {
                          setFotoStatus("uploading");
                          try { await removerFotosEntrega(fotoEntregaId); } catch {}
                          setFotoStatus("idle");
                          setFotoPreview(null);
                        }}
                        className="text-xs text-muted-foreground hover:text-destructive"
                      >
                        Remover
                      </button>
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
                disabled={loading || fotoStatus === "uploading" || selectedIds.size === 0 || !receiverName.trim() || !receiverRole || (receiverRole === "outro" && !customRole.trim()) || fotoStatus !== "done"}
                className="flex-1 bg-[#0090FF] text-white font-bold hover:bg-[#0090FF]/80"
              >
                {fotoStatus === "uploading" ? "Aguardando foto..." : `Confirmar ${selectedIds.size} Entrega${selectedIds.size !== 1 ? "s" : ""}`}
              </Button>
              <Button type="button" size="lg" variant="ghost" onClick={() => { setMode("idle"); setSelectedIds(new Set()); }}>
                Cancelar
              </Button>
            </div>
          </form>
        )}

        {/* Batch refusal form */}
        {mode === "recusar" && (
          <form onSubmit={(e) => handleConfirmSubmit(e, "recusa")} className="space-y-3 border-t pt-3">
            <p className="text-sm text-muted-foreground">Selecione as entregas que foram recusadas:</p>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">{selectedIds.size} selecionada{selectedIds.size !== 1 ? "s" : ""}</p>
            </div>
            <div className="space-y-2">
              <Label>Motivo da recusa *</Label>
              <Textarea name="refusal_reason" required rows={2} />
            </div>
            <div className="flex gap-2">
              <Button type="submit" variant="destructive" size="lg" disabled={loading || selectedIds.size === 0} className="flex-1">
                Confirmar Recusa ({selectedIds.size})
              </Button>
              <Button type="button" size="lg" variant="ghost" onClick={() => { setMode("idle"); setSelectedIds(new Set()); }}>
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
              {confirmType === "entrega"
                ? `Confirmar ${selectedIds.size} entrega${selectedIds.size !== 1 ? "s" : ""}?`
                : `Confirmar recusa de ${selectedIds.size} entrega${selectedIds.size !== 1 ? "s" : ""}?`}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmType === "entrega"
                ? `Isso marca ${selectedIds.size} entrega${selectedIds.size !== 1 ? "s" : ""} como concluída${selectedIds.size !== 1 ? "s" : ""} e não pode ser desfeito.`
                : `Isso marca ${selectedIds.size} entrega${selectedIds.size !== 1 ? "s" : ""} como recusada${selectedIds.size !== 1 ? "s" : ""} e não pode ser desfeito.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Voltar</AlertDialogCancel>
            <AlertDialogAction
              variant={confirmType === "recusa" ? "destructive" : "default"}
              onClick={() => {
                if (confirmType === "entrega") handleRegistrarBatch();
                if (confirmType === "recusa") handleRecusarBatch();
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
