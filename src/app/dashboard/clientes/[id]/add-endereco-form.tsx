"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Loader2 } from "lucide-react";
import { addEndereco } from "../actions";
import { toast } from "sonner";
import { useCep } from "@/lib/use-cep";

export function AddEnderecoForm({
  clienteId,
  onSaved,
  onCancel,
  startOpen = false,
}: {
  clienteId: string;
  onSaved: () => void;
  onCancel?: () => void;
  startOpen?: boolean;
}) {
  const [open, setOpen] = useState(startOpen);
  const [semNumero, setSemNumero] = useState(false);
  const [rua, setRua] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const handleCepResult = useCallback(
    (data: { rua: string; bairro: string; cidade: string }) => {
      setRua(data.rua);
      setBairro(data.bairro);
      setCidade(data.cidade);
    },
    []
  );
  const { fetchCep, loading: cepLoading, filled: cepFilled } = useCep(handleCepResult);
  const cepHighlight = cepFilled ? "ring-2 ring-green-500/50 transition-shadow" : "transition-shadow";

  if (!open) {
    return (
      <Button variant="outline" className="w-full" onClick={() => setOpen(true)}>
        <Plus className="mr-2 h-4 w-4" />
        Adicionar Endereço
      </Button>
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await addEndereco(clienteId, new FormData(e.currentTarget));
    toast.success("Endereço adicionado!");
    setRua(""); setBairro(""); setCidade("");
    setOpen(false);
    onSaved();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-lg border p-4">
      <div className="space-y-2">
        <Label>Apelido</Label>
        <Input name="label" placeholder='Ex: "Filial"' />
      </div>
      <div className="w-full sm:w-1/3 space-y-2">
        <Label>CEP</Label>
        <div className="relative">
          <Input
            name="cep"
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
          <Input name={semNumero ? undefined : "numero"} required={!semNumero} disabled={semNumero} placeholder={semNumero ? "S/N" : "Nº"} />
          <label className="flex items-center gap-2 text-sm">
            <Checkbox checked={semNumero} onCheckedChange={(v) => setSemNumero(!!v)} />
            Sem número
          </label>
        </div>
      </div>
      <div className="space-y-2">
        <Label>Complemento</Label>
        <Input name="complemento" />
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
      <div className="flex gap-2">
        <button type="submit" className="rounded-lg bg-blue-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-600">
          Salvar
        </button>
        <Button type="button" variant="ghost" size="sm" onClick={() => { setOpen(false); onCancel?.(); }}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
