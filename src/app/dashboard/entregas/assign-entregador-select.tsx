"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { assignEntregador } from "./actions";
import { toast } from "sonner";

export function AssignEntregadorSelect({
  entregaId,
  entregadores,
}: {
  entregaId: string;
  entregadores: { id: string; name: string }[];
}) {
  async function handleAssign(value: string | null) {
    if (!value) return;
    await assignEntregador(entregaId, value);
    toast.success("Entregador atribuído!");
  }

  return (
    <Select onValueChange={handleAssign}>
      <SelectTrigger className="w-44">
        <SelectValue placeholder="Atribuir entregador" />
      </SelectTrigger>
      <SelectContent>
        {entregadores.map((ent) => (
          <SelectItem key={ent.id} value={ent.id}>
            {ent.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
