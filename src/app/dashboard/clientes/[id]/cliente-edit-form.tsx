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
import type { Cliente } from "@/types/database";
import { updateCliente } from "../actions";

export function ClienteEditForm({ cliente }: { cliente: Cliente }) {
  const updateWithId = updateCliente.bind(null, cliente.id);

  return (
    <form action={updateWithId}>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Editar Dados</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              name="name"
              defaultValue={cliente.name}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">WhatsApp / Telefone</Label>
            <Input
              id="phone"
              name="phone"
              defaultValue={cliente.phone ?? ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="active">Status</Label>
            <Select name="active" defaultValue={String(cliente.active)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Ativo</SelectItem>
                <SelectItem value="false">Inativo</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit">Salvar Alterações</Button>
        </CardContent>
      </Card>
    </form>
  );
}
