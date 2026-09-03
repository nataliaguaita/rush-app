"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { updateEndereco } from "../actions";
import { toast } from "sonner";
import { useCep } from "@/lib/use-cep";

export function EditEnderecoForm({
  endereco,
  onSaved,
  onCancel,
}: {
  endereco: any;
  onSaved: () => void;
  onCancel: () => void;
}) {
  const [rua, setRua] = useState(endereco.rua ?? "");
  const [bairro, setBairro] = useState(endereco.bairro ?? "");
  const [cidade, setCidade] = useState(endereco.cidade ?? "");
  const [loading, setLoading] = useState(false);

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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    try {
      await updateEndereco(endereco.id, new FormData(e.currentTarget));
      toast.success("Endereço atualizado!");
      onSaved();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-lg border p-4">
      <div className="space-y-2">
        <Label>Apelido</Label>
        <Input name="label" defaultValue={endereco.label ?? ""} placeholder='Ex: "Filial"' />
      </div>
      <div className="w-full sm:w-1/3 space-y-2">
        <Label>CEP</Label>
        <div className="relative">
          <Input
            name="cep"
            defaultValue={endereco.cep ?? ""}
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
          <Input name="numero" required defaultValue={endereco.numero ?? ""} />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Complemento</Label>
        <Input name="complemento" defaultValue={endereco.complemento ?? ""} />
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
        <Button type="submit" size="sm" disabled={loading}>
          {loading ? "Salvando..." : "Salvar"}
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
