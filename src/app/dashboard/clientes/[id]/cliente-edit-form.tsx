"use client";

import { useState } from "react";
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
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    try {
      await updateCliente(cliente.id, new FormData(e.currentTarget));
      toast.success("Cliente atualizado!");
      onSaved();
    } finally {
      setLoading(false);
    }
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
          <Button type="submit" disabled={loading}>
            {loading ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}
