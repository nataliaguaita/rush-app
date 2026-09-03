"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
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
import { formatOrderNumber } from "@/lib/status";
import Link from "next/link";
import {
  MapPin,
  AlertTriangle,
  Clock,
  Navigation,
  Camera,
  CheckCircle,
  XCircle,
  Loader2,
  Package,
  Banknote,
  FileSignature,
} from "lucide-react";
import {
  iniciarEntrega,
  registrarEntrega,
  registrarRecusa,
  uploadFotoEntrega,
  removerFotosEntrega,
} from "./actions";
import { toast } from "sonner";

const actionConfig: Record<string, { label: string; icon: typeof Package }> = {
  entregar: { label: "Entregar", icon: Package },
  receber: { label: "Receber", icon: Banknote },
  assinar_nota: { label: "Assinar Nota", icon: FileSignature },
  receber_e_assinar: { label: "Receber e Assinar", icon: Banknote },
};

const receiverRoles = [
  { value: "secretaria", label: "Secretária" },
  { value: "porteiro", label: "Porteiro" },
  { value: "morador_vizinho", label: "Morador / Vizinho" },
  { value: "proprietario", label: "Proprietário da Compra" },
  { value: "outro", label: "Outro" },
];

function usePersistedState<T>(key: string, initial: T): [T, (v: T | ((prev: T) => T)) => void] {
  const [value, setValue] = useState<T>(() => {
    try {
      const saved = sessionStorage.getItem(key);
      return saved ? JSON.parse(saved) : initial;
    } catch { return initial; }
  });
  const set = useCallback((v: T | ((prev: T) => T)) => {
    setValue((prev) => {
      const next = typeof v === "function" ? (v as (p: T) => T)(prev) : v;
      try { sessionStorage.setItem(key, JSON.stringify(next)); } catch {}
      return next;
    });
  }, [key]);
  return [value, set];
}

export function EntregaCard({
  entrega,
  isFirst,
}: {
  entrega: any;
  isFirst: boolean;
}) {
  const sk = `entrega-reg-${entrega.id}`;
  const [mode, setMode] = usePersistedState<"idle" | "registrar" | "recusar">(`${sk}-mode`, "idle");
  const [loading, setLoading] = useState(false);
  const [fotoStatus, setFotoStatus] = usePersistedState<"idle" | "uploading" | "done" | "error">(`${sk}-foto`, "idle");
  useEffect(() => {
    if (fotoStatus === "uploading") {
      setFotoStatus("idle");
    }
    const supabase = createClient();
    supabase
      .from("entrega_fotos")
      .select("storage_path")
      .eq("entrega_id", entrega.id)
      .limit(1)
      .then(({ data }) => {
        if (data && data.length > 0) {
          setFotoStatus("done");
          if (!fotoPreview) {
            const { data: urlData } = supabase.storage.from("entregas").getPublicUrl(data[0].storage_path);
            if (urlData?.publicUrl) setFotoPreview(urlData.publicUrl);
          }
        }
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [receiverName, setReceiverName] = usePersistedState(`${sk}-name`, "");
  const [receiverRole, setReceiverRole] = usePersistedState(`${sk}-role`, "");
  const [customRole, setCustomRole] = usePersistedState(`${sk}-custom`, "");
  const [confirmType, setConfirmType] = useState<"entrega" | "recusa" | null>(null);
  const pendingNote = useRef<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  function clearPersistedState() {
    try {
      for (const suffix of ["-mode", "-foto", "-name", "-role", "-custom"]) {
        sessionStorage.removeItem(sk + suffix);
      }
    } catch {}
  }

  const endereco = entrega.endereco;
  const isEmRota = entrega.status === "em_rota";

  function openNavigation() {
    const address = `${endereco.rua}, ${endereco.numero}, ${endereco.cidade}`;
    const encoded = encodeURIComponent(address);
    window.open(`geo:0,0?q=${encoded}`, "_self");
  }

  async function handleIniciar() {
    await iniciarEntrega(entrega.id);
    openNavigation();
  }

  async function handleRegistrar() {
    setLoading(true);
    try {
      await registrarEntrega(entrega.id, {
        receiver_name: receiverName,
        receiver_role: receiverRole,
        custom_role: receiverRole === "outro" ? customRole : undefined,
        receiver_note: pendingNote.current,
      });
      clearPersistedState();
      toast.success("Entrega registrada!");
    } catch {
      toast.error("Falha ao registrar entrega. Tente novamente.");
    }
    setLoading(false);
  }

  async function handleRecusar() {
    setLoading(true);
    try {
      await registrarRecusa(entrega.id, pendingNote.current || "");
      clearPersistedState();
      toast.info("Recusa registrada.");
    } catch {
      toast.error("Falha ao registrar recusa. Tente novamente.");
    }
    setLoading(false);
  }

  function handleConfirmSubmit(e: React.FormEvent<HTMLFormElement>, type: "entrega" | "recusa") {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    pendingNote.current = (fd.get(type === "entrega" ? "receiver_note" : "refusal_reason") as string) || "";
    setConfirmType(type);
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

    try {
      const compressed = await compressImage(file);
      const fd = new FormData();
      fd.append("foto", compressed);
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
      className={`relative overflow-hidden ${
        isFirst && !isEmRota
          ? "border-l-4 border-l-primary bg-primary/5"
          : ""
      }`}
    >
      {isEmRota && (
        <div className="absolute inset-x-0 bottom-0 h-0.5 overflow-hidden bg-status-active/20">
          <div className="h-full w-1/3 animate-[shimmer_1.5s_ease-in-out_infinite] bg-status-active" />
        </div>
      )}
      <CardContent className="space-y-3">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0 space-y-1">
            {isFirst && !isEmRota && (
              <p className="text-xs font-semibold tracking-wide text-primary uppercase">
                Próxima parada
              </p>
            )}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono text-muted-foreground">{formatOrderNumber(entrega.order_number)}</span>
              <Link href={`/dashboard/entregas/${entrega.id}`} className="text-base font-semibold hover:underline">
                {entrega.cliente?.name}
              </Link>
              {entrega.is_urgent && (
                <Badge variant="destructive" className="text-xs">
                  <AlertTriangle className="mr-1 h-3 w-3" />
                  Urgente
                </Badge>
              )}
              {entrega.is_postponed && (
                <Badge variant="outline" className="border-amber-500/50 text-xs text-amber-600">
                  <Clock className="mr-1 h-3 w-3" />
                  Adiada
                </Badge>
              )}
            </div>
            <p className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {endereco?.rua}, {endereco?.numero}
              {endereco?.bairro ? ` - ${endereco.bairro}` : ""}
            </p>
            {entrega.interested_name && (
              <p className="text-sm font-medium">Entregar para {entrega.interested_name}</p>
            )}
            {entrega.actions?.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {entrega.actions.filter((a: string) => {
                  if (a === "entregar") {
                    const hasOther = entrega.actions.includes("receber") || entrega.actions.includes("assinar_nota") || entrega.actions.includes("receber_e_assinar");
                    return !hasOther;
                  }
                  return true;
                }).map((a: string) => {
                  const cfg = actionConfig[a];
                  if (!cfg) return null;
                  const Icon = cfg.icon;
                  return (
                    <Badge key={a} variant="secondary" className="text-xs gap-1 border-emerald-500/30 bg-emerald-500/10 text-emerald-700">
                      <Icon className="h-3 w-3" />
                      {cfg.label}
                    </Badge>
                  );
                })}
                <Badge variant="secondary" className="text-xs gap-1 border-emerald-500/30 bg-emerald-500/10 text-emerald-700">
                  <Package className="h-3 w-3" />
                  {entrega.numero_sacolas ?? 1} {(entrega.numero_sacolas ?? 1) === 1 ? "sacola" : "sacolas"}
                </Badge>
              </div>
            )}
            {entrega.valor && entrega.actions?.includes("receber") && (
              <p className="text-sm font-medium text-emerald-600">R$ {Number(entrega.valor).toFixed(2)}</p>
            )}
            {entrega.notes && (
              <p className="text-xs text-muted-foreground italic">
                {entrega.notes}
              </p>
            )}
          </div>
          {isEmRota && <StatusBadge status={entrega.status} />}
        </div>

        {/* Actions */}
        {mode === "idle" && (
          <div className="flex flex-col gap-2 sm:flex-row">
            {!isEmRota && isFirst ? (
              <Button size="lg" className="flex-1 min-h-12 bg-[#0090FF] text-white font-bold hover:bg-[#0090FF]/80" onClick={handleIniciar}>
                <Navigation className="mr-2 h-4 w-4" />
                Iniciar Entrega
              </Button>
            ) : isEmRota ? (
              <>
                <Button onClick={openNavigation} variant="outline" size="lg" className="w-full sm:w-auto border-[#0090FF] text-[#0090FF] font-bold hover:bg-[#0090FF]/10">
                  <Navigation className="mr-1 h-4 w-4" />
                  Navegar
                </Button>
                <Button
                  size="lg"
                  className="w-full sm:flex-1 bg-[#0090FF] text-white font-bold hover:bg-[#0090FF]/80"
                  onClick={() => setMode("registrar")}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Registrar Entrega
                </Button>
                <Button
                  variant="destructive"
                  size="lg"
                  className="w-full sm:w-auto gap-2"
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
              <Input name="receiver_name" required placeholder="Nome" value={receiverName} onChange={(e) => setReceiverName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Cargo *</Label>
              <Select name="receiver_role" required value={receiverRole} onValueChange={(value) => setReceiverRole(value ?? "")} items={Object.fromEntries(receiverRoles.map((r) => [r.value, r.label]))}>
                <SelectTrigger size="lg" className="w-full">
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
              {receiverRole === "outro" && (
                <Input name="custom_role" required placeholder="Qual o cargo?" value={customRole} onChange={(e) => setCustomRole(e.target.value)} />
              )}
            </div>
            <div className="space-y-2">
              <Label>Foto do local *</Label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFoto}
                className="hidden"
              />
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
                    <img
                      src={fotoPreview}
                      alt="Pré-visualização da foto anexada"
                      className="h-32 w-full object-cover"
                    />
                  )}
                  <div className="flex items-center justify-between p-2">
                    <div className="flex items-center gap-1.5 text-sm">
                      {fotoStatus === "uploading" && (
                        <>
                          <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin text-muted-foreground" />
                          <span className="text-muted-foreground">Enviando...</span>
                        </>
                      )}
                      {fotoStatus === "done" && (
                        <>
                          <Camera className="h-3.5 w-3.5 shrink-0 text-status-success" />
                          <span className="text-status-success">Foto anexada</span>
                        </>
                      )}
                    </div>
                    {fotoStatus === "done" && (
                      <button
                        type="button"
                        onClick={async () => {
                          setFotoStatus("uploading");
                          try {
                            await removerFotosEntrega(entrega.id);
                          } catch {
                            toast.error("Falha ao remover foto.");
                          }
                          setFotoStatus("idle");
                          setFotoPreview(null);
                          if (fileInputRef.current) fileInputRef.current.value = "";
                        }}
                        className="text-xs text-muted-foreground hover:text-destructive"
                      >
                        Remover
                      </button>
                    )}
                  </div>
                </div>
              )}
              {fotoStatus === "error" && (
                <p className="text-xs text-destructive">Falha ao enviar. Toque para tentar novamente.</p>
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
                disabled={loading || fotoStatus === "uploading" || !receiverName.trim() || !receiverRole || (receiverRole === "outro" && !customRole.trim()) || fotoStatus !== "done"}
                className="flex-1 bg-[#0090FF] text-white font-bold hover:bg-[#0090FF]/80"
              >
                {fotoStatus === "uploading" ? "Aguardando foto..." : "Confirmar Entrega"}
              </Button>
              <Button
                type="button"
                size="lg"
                variant="ghost"
                onClick={() => { clearPersistedState(); setMode("idle"); }}
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
                onClick={() => { clearPersistedState(); setMode("idle"); }}
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
            <AlertDialogCancel>
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
