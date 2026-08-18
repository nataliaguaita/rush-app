"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { addEndereco } from "../actions";
import { toast } from "sonner";

export function AddEnderecoForm({
  clienteId,
  onSaved,
}: {
  clienteId: string;
  onSaved: () => void;
}) {
  const [open, setOpen] = useState(false);

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
    setOpen(false);
    onSaved();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-lg border p-4">
      <div className="space-y-2">
        <Label>Apelido</Label>
        <Input name="label" placeholder='Ex: "Filial"' />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-2 space-y-2">
          <Label>Rua *</Label>
          <Input name="rua" required />
        </div>
        <div className="space-y-2">
          <Label>Nº *</Label>
          <Input name="numero" required />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Complemento</Label>
        <Input name="complemento" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label>Bairro</Label>
          <Input name="bairro" />
        </div>
        <div className="space-y-2">
          <Label>Cidade *</Label>
          <Input name="cidade" required />
        </div>
      </div>
      <div className="w-1/3 space-y-2">
        <Label>CEP</Label>
        <Input name="cep" />
      </div>
      <div className="flex gap-2">
        <button type="submit" className="rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/80">
          Salvar
        </button>
        <Button type="button" variant="ghost" size="sm" onClick={() => setOpen(false)}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
