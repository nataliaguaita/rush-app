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
import { AlertTriangle, ChevronLeft, Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createEntrega } from "../actions";
import { toast } from "sonner";
import { useUnsavedChanges } from "@/lib/use-unsaved-changes";
import { format } from "date-fns";
import type { ClienteWithEnderecos, LocalFrequente } from "@/types/database";
import { EnderecoPicker } from "../endereco-picker";
import type { OpenGroup } from "./page";

export function NovaEntregaForm({
  clientes,
  openGroups = [],
  locaisFrequentes = [],
}: {
  clientes: ClienteWithEnderecos[];
  openGroups?: OpenGroup[];
  locaisFrequentes?: LocalFrequente[];
}) {
  // Função para detectar automaticamente o período baseado no horário atual
  const getAutoPeriod = (): "manha" | "tarde" => {
    const now = new Date();
    const hour = now.getHours();
    // 6h às 11h = manhã, 11h às 18h = tarde
    return hour >= 6 && hour < 11 ? "manha" : "tarde";
  };

  const [selectedGroupId, setSelectedGroupId] = useState<string>("none");
  const [selectedClienteId, setSelectedClienteId] = useState<string>("");
  const [selectedEnderecoId, setSelectedEnderecoId] = useState<string>("");
  const [clienteSearch, setClienteSearch] = useState("");
  const [showClienteDropdown, setShowClienteDropdown] = useState(false);
  const [actionReceber, setActionReceber] = useState(false);
  const [actionAssinar, setActionAssinar] = useState(false);
  const [actionReceberAssinar, setActionReceberAssinar] = useState(false);
  const [returnReminder, setReturnReminder] = useState(false);
  const [scheduledDate, setScheduledDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [scheduledPeriod, setScheduledPeriod] = useState<"manha" | "tarde">(getAutoPeriod());
  const [valor, setValor] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { formRef, dialog } = useUnsavedChanges();

  const selectedCliente = clientes.find((c) => c.id === selectedClienteId);
  const enderecos = (selectedCliente?.enderecos ?? []).filter((e) => e.active !== false);

  const filteredClientes = useMemo(() => {
    if (!clienteSearch.trim()) return clientes;
    const q = clienteSearch.toLowerCase();
    return clientes.filter(
      (c) => c.name.toLowerCase().includes(q) || c.codigo_externo?.toLowerCase().includes(q)
    );
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
    if (checked) { setActionAssinar(false); setActionReceberAssinar(false); }
  }

  function handleAssinar(checked: boolean) {
    setActionAssinar(checked);
    if (checked) { setActionReceber(false); setActionReceberAssinar(false); }
  }

  function handleReceberAssinar(checked: boolean) {
    setActionReceberAssinar(checked);
    if (checked) { setActionReceber(false); setActionAssinar(false); }
  }

  function handleValorChange(e: React.ChangeEvent<HTMLInputElement>) {
    setValor(e.target.value.replace(/[^\d,]/g, ""));
  }

  function handleValorBlur() {
    if (!valor) return;
    const num = parseFloat(valor.replace(",", "."));
    if (isNaN(num)) { setValor(""); return; }
    setValor(num.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
  }

  function parseValor(formatted: string): string {
    if (!formatted) return "";
    return formatted.replace(/\./g, "").replace(",", ".");
  }

  return (
    <form
      ref={formRef}
      onSubmit={async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
          const fd = new FormData(e.currentTarget);
          fd.set("valor", parseValor(valor));
          await createEntrega(fd);
          toast.success("Entrega cadastrada!");
          router.push("/dashboard/entregas");
          router.refresh();
        } catch (err) {
          toast.error("Erro ao criar entrega", {
            description: err instanceof Error ? err.message : undefined,
          });
          setIsSubmitting(false);
        }
      }}
      className="space-y-4 w-full sm:w-[50vw] sm:min-w-[340px] mx-auto"
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
              placeholder="Digite o nome do cliente ou o código..."
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
                    {c.codigo_externo && (
                      <span className="ml-2 text-xs text-muted-foreground">#{c.codigo_externo}</span>
                    )}
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

          {selectedGroupId !== "none" && (
            <input type="hidden" name="endereco_id" value={openGroups.find((g) => g.groupId === selectedGroupId)?.enderecoId ?? ""} />
          )}

          {selectedCliente && selectedGroupId === "none" && (
            <EnderecoPicker
              clienteId={selectedClienteId}
              enderecos={enderecos}
              locaisFrequentes={locaisFrequentes}
              value={selectedEnderecoId}
              onChange={setSelectedEnderecoId}
            />
          )}
        </CardContent>
      </Card>

      {/* Detalhes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Detalhes da Entrega</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="valor">Valor</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">R$</span>
                <Input
                  id="valor"
                  name="valor_display"
                  value={valor}
                  onChange={handleValorChange}
                  onBlur={handleValorBlur}
                  placeholder="0,00"
                  className="pl-9"
                  inputMode="decimal"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="numero_sacolas">Nº de Sacolas</Label>
              <Input
                id="numero_sacolas"
                name="numero_sacolas"
                type="number"
                min="1"
                defaultValue="1"
                inputMode="numeric"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>O entregador deve:</Label>
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
              <div className="flex items-center gap-2">
                <Checkbox
                  id="action-receber-assinar"
                  name="actions"
                  value="receber_e_assinar"
                  checked={actionReceberAssinar}
                  onCheckedChange={handleReceberAssinar}
                />
                <Label htmlFor="action-receber-assinar" className="text-sm font-normal">Receber e Assinar Nota</Label>
              </div>
            </div>
          </div>
          {/* Hidden input to always send entregar */}
          <input type="hidden" name="actions" value="entregar" />

          <Separator />

          <div className="space-y-2">
            <Label>Programar Entrega:</Label>
            <div className="flex gap-2">
              <Label>Turno:</Label>
              <Select name="scheduled_period" value={scheduledPeriod} items={{ manha: "Manhã", tarde: "Tarde" }} onValueChange={(value) => setScheduledPeriod(value as "manha" | "tarde")}>
                <SelectTrigger className="w-28">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manha">Manhã</SelectItem>
                  <SelectItem value="tarde">Tarde</SelectItem>
                </SelectContent>
              </Select>
              <Label>Data:</Label>
              <Input
                type="date"
                name="scheduled_date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="flex-1"
              />
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

      {/* Vincular a grupo */}
      {openGroups.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-violet-600" />
              Vincular a um Grupo
            </CardTitle>
            <p className="text-sm text-muted-foreground">Opcional — adicione esta entrega a um grupo existente do dia.</p>
          </CardHeader>
          <CardContent>
            <select
              className="flex h-10 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
              value={selectedGroupId}
              onChange={(e) => {
                const v = e.target.value;
                setSelectedGroupId(v);
                if (v && v !== "none") {
                  const group = openGroups.find((g) => g.groupId === v);
                  if (group) {
                    setSelectedEnderecoId(group.enderecoId);
                  }
                }
              }}
            >
              <option value="none">Nenhum grupo (entrega individual)</option>
              {openGroups.map((g) => (
                <option key={g.groupId} value={g.groupId}>{g.label}</option>
              ))}
            </select>
            {selectedGroupId !== "none" && (
              <input type="hidden" name="group_id" value={selectedGroupId} />
            )}
          </CardContent>
        </Card>
      )}

      <div className="flex justify-end gap-3 pb-8">
        <Link href="/dashboard/entregas">
          <Button variant="outline" type="button">
            Cancelar
          </Button>
        </Link>
        <Button type="submit" loading={isSubmitting}>Finalizar Cadastro</Button>
      </div>
      {dialog}
    </form>
  );
}
