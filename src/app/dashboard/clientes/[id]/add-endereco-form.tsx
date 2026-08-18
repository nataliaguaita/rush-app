"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { addEndereco } from "../actions";

export function AddEnderecoForm({ clienteId }: { clienteId: string }) {
  const [open, setOpen] = useState(false);
  const addWithId = addEndereco.bind(null, clienteId);

  if (!open) {
    return (
      <Button
        variant="outline"
        className="w-full"
        onClick={() => setOpen(true)}
      >
        <Plus className="mr-2 h-4 w-4" />
        Adicionar Endereço
      </Button>
    );
  }

  return (
    <form
      action={async (formData) => {
        await addWithId(formData);
        setOpen(false);
      }}
      className="space-y-3 rounded-lg border p-4"
    >
      <div className="space-y-2">
        <Label htmlFor="new-label">Apelido</Label>
        <Input id="new-label" name="label" placeholder='Ex: "Filial"' />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-2 space-y-2">
          <Label htmlFor="new-rua">Rua *</Label>
          <Input id="new-rua" name="rua" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="new-numero">Nº *</Label>
          <Input id="new-numero" name="numero" required />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="new-complemento">Complemento</Label>
        <Input id="new-complemento" name="complemento" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="new-bairro">Bairro</Label>
          <Input id="new-bairro" name="bairro" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="new-cidade">Cidade *</Label>
          <Input id="new-cidade" name="cidade" required />
        </div>
      </div>
      <div className="w-1/3 space-y-2">
        <Label htmlFor="new-cep">CEP</Label>
        <Input id="new-cep" name="cep" />
      </div>
      <div className="flex gap-2">
        <Button type="submit" size="sm">
          Salvar
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setOpen(false)}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
