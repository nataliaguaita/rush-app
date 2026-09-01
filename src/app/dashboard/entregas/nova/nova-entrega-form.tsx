"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
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
import { AlertTriangle, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { createEntrega } from "../actions";
import { toast } from "sonner";
import { format } from "date-fns";
import type { ClienteWithEnderecos } from "@/types/database";

export function NovaEntregaForm({
  clientes,
}: {
  clientes: ClienteWithEnderecos[];
}) {
  const [selectedClienteId, setSelectedClienteId] = useState<string>("");
  const [selectedEnderecoId, setSelectedEnderecoId] = useState<string>("");
  const [clienteSearch, setClienteSearch] = useState("");
  const [showClienteDropdown, setShowClienteDropdown] = useState(false);
  const [actionReceber, setActionReceber] = useState(false);
  const [actionAssinar, setActionAssinar] = useState(false);
  const [returnReminder, setReturnReminder] = useState(false);
  const [scheduledDate, setScheduledDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [valor, setValor] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedCliente = clientes.find((c) => c.id === selectedClienteId);
  const enderecos = selectedCliente?.enderecos ?? [];

  const filteredClientes = useMemo(() => {
    if (!clienteSearch.trim()) return clientes;
    const q = clienteSearch.toLowerCase();
    return clientes.filter((c) => c.name.toLowerCase().includes(q));
  }, [clientes, clienteSearch]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowClienteDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleReceber(checked: boolean) {
    setActionReceber(checked);
    if (checked) setActionAssinar(false);
  }

  function handleAssinar(checked: boolean) {
    setActionAssinar(checked);
    if (checked) setActionReceber(false);
  }

  function formatCurrency(raw: string) {
    const digits = raw.replace(/\D/g, "");
    if (!digits) return "";
    const num = parseInt(digits, 10) / 100;
    return num.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function handleValorChange(e: React.ChangeEvent<HTMLInputElement>) {
    setValor(formatCurrency(e.target.value));
  }

  function parseValor(formatted: string): string {
    if (!formatted) return "";
    return formatted.replace(/\./g, "").replace(",", ".");
  }

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        try {
          const fd = new FormData(e.currentTarget);
          fd.set("valor", parseValor(valor));
          await createEntrega(fd);
          toast.success("Entrega cadastrada!");
          window.location.href = "/dashboard/entregas";
        } catch (err: any) {
          toast.error("Erro ao criar entrega", { description: err.message });
        }
      }}
      className="space-y-4 w-[50vw] min-w-[340px] mx-auto"
    >
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Nova Entrega</h1>
        <Link href="/dashboard/entregas">
          <Button variant="outline" size="sm" type="button">
            <ChevronLeft className="mr-1 h-4 w-4" />
            Voltar
          </Button>
        </Link>
      </div>

      {/* Cliente */}
      <Card className="overflow-visible">
        <CardHeader>
          <CardTitle className="text-lg">Cliente</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 overflow-visible">
          <div className="space-y-2 relative" ref={dropdownRef}>
            <Label>Selecionar Cliente *</Label>
            <Input
              placeholder="Digite o nome do cliente..."
              value={selectedCliente ? selectedCliente.name : clienteSearch}
              onChange={(e) => {
                setClienteSearch(e.target.value);
                setSelectedClienteId("");
                setSelectedEnderecoId("");
                setShowClienteDropdown(true);
              }}
              onFocus={() => setShowClienteDropdown(true)}
              autoComplete="off"
            />
            <input type="hidden" name="cliente_id" value={selectedClienteId} />
            {showClienteDropdown && filteredClientes.length > 0 && !selectedCliente && (
              <div className="absolute z-50 top-full left-0 right-0 mt-1 max-h-48 overflow-y-auto rounded-md border bg-popover shadow-md">
                {filteredClientes.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    className="w-full px-3 py-2 text-left text-sm hover:bg-accent transition-colors"
                    onClick={() => {
                      setSelectedClienteId(c.id);
                      setClienteSearch(c.name);
                      setSelectedEnderecoId("");
                      setShowClienteDropdown(false);
                    }}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            )}
            {showClienteDropdown && filteredClientes.length === 0 && clienteSearch && (
              <div className="absolute z-50 top-full left-0 right-0 mt-1 rounded-md border bg-popover shadow-md px-3 py-2 text-sm text-muted-foreground">
                Nenhum cliente encontrado
              </div>
            )}
          </div>

          {selectedCliente && (
            <div className="space-y-2">
              <Label>Endereço de Entrega *</Label>
              <Select
                name="endereco_id"
                value={selectedEnderecoId}
                onValueChange={(v) => setSelectedEnderecoId(v ?? "")}
                required
                items={Object.fromEntries(enderecos.map((e) => [e.id, `${e.label ? `${e.label} — ` : ""}${e.rua}, ${e.numero}${e.bairro ? ` (${e.bairro})` : ""}`]))}
              >
                <SelectTrigger className="w-full">
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
            <Label htmlFor="valor">Valor</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">R$</span>
              <Input
                id="valor"
                name="valor_display"
                value={valor}
                onChange={handleValorChange}
                placeholder="0,00"
                className="pl-9"
                inputMode="numeric"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>O motoboy deve:</Label>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 opacity-70">
                <Checkbox
                  id="action-entregar"
                  checked
                  disabled
                />
                <Label htmlFor="action-entregar" className="text-sm font-normal">Entregar</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="action-receber"
                  name="actions"
                  value="receber"
                  checked={actionReceber}
                  onCheckedChange={handleReceber}
                />
                <Label htmlFor="action-receber" className="text-sm font-normal">Receber</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="action-assinar"
                  name="actions"
                  value="assinar_nota"
                  checked={actionAssinar}
                  onCheckedChange={handleAssinar}
                />
                <Label htmlFor="action-assinar" className="text-sm font-normal">Assinar Nota</Label>
              </div>
            </div>
          </div>
          {/* Hidden input to always send entregar */}
          <input type="hidden" name="actions" value="entregar" />

          <Separator />

          <div className="space-y-2">
            <Label>Programar Entrega</Label>
            <div className="flex gap-2">
              <Input
                type="date"
                name="scheduled_date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="flex-1"
              />
              <Select name="scheduled_period" defaultValue="manha" items={{ manha: "Manhã", tarde: "Tarde" }}>
                <SelectTrigger className="w-28">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manha">Manhã</SelectItem>
                  <SelectItem value="tarde">Tarde</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-2">
              <Checkbox id="is_urgent" name="is_urgent" />
              <Label htmlFor="is_urgent" className="flex items-center gap-1.5 text-sm font-normal">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                Urgente
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="return_reminder"
                name="return_reminder"
                checked={returnReminder}
                onCheckedChange={(v) => setReturnReminder(!!v)}
              />
              <Label htmlFor="return_reminder" className="text-sm font-normal">Lembrete de devolução</Label>
            </div>
          </div>

          {returnReminder && (
            <div className="space-y-2">
              <Label htmlFor="return_notes">O que deve ser pego de devolução?</Label>
              <Textarea
                id="return_notes"
                name="return_notes"
                placeholder="Material, local de retirada, observações..."
                rows={2}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Interessado */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Interessado (opcional)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="interested_name">Nome</Label>
            <Input id="interested_name" name="interested_name" />
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
