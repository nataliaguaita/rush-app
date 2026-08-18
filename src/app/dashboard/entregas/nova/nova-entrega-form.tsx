"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { createEntrega } from "../actions";
import { toast } from "sonner";
import type { ClienteWithEnderecos } from "@/types/database";

export function NovaEntregaForm({
  clientes,
}: {
  clientes: ClienteWithEnderecos[];
}) {
  const [selectedClienteId, setSelectedClienteId] = useState<string>("");
  const [selectedEnderecoId, setSelectedEnderecoId] = useState<string>("");

  const selectedCliente = clientes.find((c) => c.id === selectedClienteId);
  const enderecos = selectedCliente?.enderecos ?? [];

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        try {
          await createEntrega(new FormData(e.currentTarget));
          toast.success("Entrega cadastrada!");
          window.location.href = "/dashboard/entregas";
        } catch (err: any) {
          toast.error("Erro ao criar entrega", { description: err.message });
        }
      }}
      className="space-y-4"
    >
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard/entregas">
          <Button variant="ghost" size="icon" type="button">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <span className="text-lg font-semibold">Voltar</span>
      </div>

      {/* Cliente */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Cliente</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Selecionar Cliente *</Label>
            <Select
              name="cliente_id"
              value={selectedClienteId}
              onValueChange={(v) => {
                setSelectedClienteId(v ?? "");
                setSelectedEnderecoId("");
              }}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Escolha um cliente" />
              </SelectTrigger>
              <SelectContent>
                {clientes.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedCliente && (
            <div className="space-y-2">
              <Label>Endereço de Entrega *</Label>
              <Select
                name="endereco_id"
                value={selectedEnderecoId}
                onValueChange={(v) => setSelectedEnderecoId(v ?? "")}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Escolha o endereço" />
                </SelectTrigger>
                <SelectContent>
                  {enderecos.map((e) => (
                    <SelectItem key={e.id} value={e.id}>
                      {e.label ? `${e.label} — ` : ""}
                      {e.rua}, {e.numero}
                      {e.bairro ? ` (${e.bairro})` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {enderecos.length === 0 && (
                <p className="text-sm text-destructive">
                  Este cliente não possui endereços cadastrados.{" "}
                  <Link
                    href={`/dashboard/clientes/${selectedClienteId}`}
                    className="underline"
                  >
                    Adicionar endereço
                  </Link>
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detalhes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Detalhes da Entrega</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="valor">Valor (R$)</Label>
            <Input
              id="valor"
              name="valor"
              type="number"
              step="0.01"
              min="0"
              placeholder="0,00"
            />
          </div>

          <div className="space-y-2">
            <Label>O motoboy deve:</Label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  name="actions"
                  value="entregar"
                  defaultChecked
                  className="rounded"
                />
                Entregar
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  name="actions"
                  value="receber"
                  className="rounded"
                />
                Receber
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  name="actions"
                  value="assinar_nota"
                  className="rounded"
                />
                Assinar Nota
              </label>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>Programar Entrega</Label>
            <Select name="scheduled_period">
              <SelectTrigger>
                <SelectValue placeholder="Sem programação" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="manha">Manhã</SelectItem>
                <SelectItem value="tarde">Tarde</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="is_urgent"
                className="rounded"
              />
              <AlertTriangle className="h-4 w-4 text-destructive" />
              Urgente
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="return_reminder"
                className="rounded"
              />
              Lembrete de devolução
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Interessado */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Interessado (opcional)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="interested_name">Nome</Label>
            <Input id="interested_name" name="interested_name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="interested_note">Observação</Label>
            <Input id="interested_note" name="interested_note" />
          </div>
        </CardContent>
      </Card>

      {/* Observações */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Observações</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            name="notes"
            placeholder="Observações sobre a entrega..."
            rows={3}
          />
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3 pb-8">
        <Link href="/dashboard/entregas">
          <Button variant="outline" type="button">
            Cancelar
          </Button>
        </Link>
        <Button type="submit">Finalizar Cadastro</Button>
      </div>
    </form>
  );
}
