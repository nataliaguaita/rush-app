"use client";

import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import { useCep } from "@/lib/use-cep";
import { createLocal, updateLocal } from "./actions";
import type { LocalFrequente } from "@/types/database";

export function LocalDialog({
  local,
  onSaved,
}: {
  local?: LocalFrequente;
  onSaved: () => void;
}) {
  const isEdit = !!local;
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [semNumero, setSemNumero] = useState(local?.numero === "S/N");
  const [rua, setRua] = useState(local?.rua ?? "");
  const [bairro, setBairro] = useState(local?.bairro ?? "");
  const [cidade, setCidade] = useState(local?.cidade ?? "");

  const handleCepResult = useCallback((data: { rua: string; bairro: string; cidade: string }) => {
    setRua(data.rua);
    setBairro(data.bairro);
    setCidade(data.cidade);
  }, []);
  const { fetchCep, loading: cepLoading, filled: cepFilled } = useCep(handleCepResult);
  const cepHighlight = cepFilled ? "ring-2 ring-green-500/50 transition-shadow" : "transition-shadow";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData(e.currentTarget);
      if (isEdit) {
        await updateLocal(local.id, formData);
        toast.success("Local atualizado!");
      } else {
        await createLocal(formData);
        toast.success("Local cadastrado!");
      }
      setOpen(false);
      onSaved();
    } catch (err: any) {
      toast.error(isEdit ? "Erro ao atualizar local" : "Erro ao cadastrar local", { description: err.message });
    }
    setLoading(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          isEdit ? (
            <Button variant="outline" size="sm">Editar</Button>
          ) : (
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Endereço Fixo
            </Button>
          )
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar Endereço Fixo" : "Novo Endereço Fixo"}</DialogTitle>
          <DialogDescription>
            Locais reutilizáveis para entregas em grupo (cursos, eventos, etc.)
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="name">Nome *</Label>
            <Input id="name" name="name" required defaultValue={local?.name ?? ""} placeholder="Ex: Curso de Especialização" />
          </div>
          <div className="w-full sm:w-1/3 space-y-2">
            <Label>CEP</Label>
            <div className="relative">
              <Input
                name="cep"
                defaultValue={local?.cep ?? ""}
                placeholder="00000-000"
                onChange={(e) => fetchCep(e.target.value)}
              />
              {cepLoading && (
                <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="sm:col-span-2 space-y-2">
              <Label>Rua *</Label>
              <Input name="rua" required value={rua} onChange={(e) => setRua(e.target.value)} className={cepHighlight} />
            </div>
            <div className="space-y-2">
              <Label>Nº *</Label>
              {semNumero && <input type="hidden" name="numero" value="S/N" />}
              <Input
                name={semNumero ? undefined : "numero"}
                required={!semNumero}
                disabled={semNumero}
                placeholder={semNumero ? "S/N" : "Nº"}
                defaultValue={local?.numero === "S/N" ? "" : (local?.numero ?? "")}
              />
              <label className="flex items-center gap-2 text-sm">
                <Checkbox checked={semNumero} onCheckedChange={(v) => setSemNumero(!!v)} />
                Sem número
              </label>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Complemento</Label>
            <Input name="complemento" defaultValue={local?.complemento ?? ""} />
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Bairro</Label>
              <Input name="bairro" value={bairro} onChange={(e) => setBairro(e.target.value)} className={cepHighlight} />
            </div>
            <div className="space-y-2">
              <Label>Cidade *</Label>
              <Input name="cidade" required value={cidade} onChange={(e) => setCidade(e.target.value)} className={cepHighlight} />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
