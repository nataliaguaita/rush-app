"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateCliente } from "../actions";
import { toast } from "sonner";

export function ClienteEditForm({
  cliente,
  onSaved,
}: {
  cliente: any;
  onSaved: () => void;
}) {
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await updateCliente(cliente.id, new FormData(e.currentTarget));
    toast.success("Cliente atualizado!");
    onSaved();
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Editar Dados</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input id="name" name="name" defaultValue={cliente.name} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">WhatsApp / Telefone</Label>
            <Input id="phone" name="phone" defaultValue={cliente.phone ?? ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="active">Status</Label>
            <Select
              name="active"
              defaultValue={String(cliente.active)}
              items={{ true: "Ativo", false: "Inativo" }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Ativo</SelectItem>
                <SelectItem value="false">Inativo</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <button
            type="submit"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/80"
          >
            Salvar Alterações
          </button>
        </CardContent>
      </Card>
    </form>
  );
}
