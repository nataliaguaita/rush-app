"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
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
import { AlertTriangle, Bookmark, ChevronLeft, MapPin, Plus, Trash2, Users } from "lucide-react";
import Link from "next/link";
import { createEntregaGrupo } from "./actions";
import { toast } from "sonner";
import { format } from "date-fns";
import type { ClienteWithEnderecos, LocalFrequente } from "@/types/database";
import { useCep } from "@/lib/use-cep";

interface Destinatario {
  id: string;
  clienteId: string;
  clienteSearch: string;
  valor: string;
  numeroSacolas: string;
  actionReceber: boolean;
  actionAssinar: boolean;
  actionReceberAssinar: boolean;
  interestedName: string;
  notes: string;
}

function emptyDestinatario(): Destinatario {
  return {
    id: crypto.randomUUID(),
    clienteId: "",
    clienteSearch: "",
    valor: "",
    numeroSacolas: "1",
    actionReceber: false,
    actionAssinar: false,
    actionReceberAssinar: false,
    interestedName: "",
    notes: "",
  };
}

export function NovaEntregaGrupoForm({
  clientes,
  locaisFrequentes = [],
}: {
  clientes: ClienteWithEnderecos[];
  locaisFrequentes?: LocalFrequente[];
}) {
  // Função para detectar automaticamente o período baseado no horário atual
  const getAutoPeriod = (): "manha" | "tarde" => {
    const now = new Date();
    const hour = now.getHours();
    // 6h às 11h = manhã, 11h às 18h = tarde
    return hour >= 6 && hour < 11 ? "manha" : "tarde";
  };

  // Address state (shared for all deliveries in the group)
  const [addressMode, setAddressMode] = useState<"cliente" | "custom">("custom");
  const [addressClienteId, setAddressClienteId] = useState("");
  const [addressClienteSearch, setAddressClienteSearch] = useState("");
  const [showAddressClienteDropdown, setShowAddressClienteDropdown] = useState(false);
  const [selectedEnderecoId, setSelectedEnderecoId] = useState("");
  const [customAddr, setCustomAddr] = useState({ cep: "", rua: "", numero: "", complemento: "", bairro: "", cidade: "", label: "" });
  const [selectedLocalId, setSelectedLocalId] = useState("");
  const [saveLocal, setSaveLocal] = useState(false);
  const addressDropdownRef = useRef<HTMLDivElement>(null);

  const handleCepResult = useCallback((data: { rua: string; bairro: string; cidade: string }) => {
    setCustomAddr((prev) => ({ ...prev, rua: data.rua, bairro: data.bairro, cidade: data.cidade }));
  }, []);
  const { fetchCep, loading: cepLoading, filled: cepFilled } = useCep(handleCepResult);
  const cepHighlight = cepFilled ? "ring-2 ring-green-500/50 transition-shadow" : "transition-shadow";

  // Scheduling (shared)
  const [scheduledDate, setScheduledDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [scheduledPeriod, setScheduledPeriod] = useState<"manha" | "tarde">(getAutoPeriod());

  // Destinatários
  const [destinatarios, setDestinatarios] = useState<Destinatario[]>([emptyDestinatario()]);
  const [submitting, setSubmitting] = useState(false);

  const addressCliente = clientes.find((c) => c.id === addressClienteId);
  const enderecos = (addressCliente?.enderecos ?? []).filter((e) => e.active !== false);

  const filteredAddressClientes = useMemo(() => {
    if (!addressClienteSearch.trim()) return clientes;
    const q = addressClienteSearch.toLowerCase();
    return clientes.filter((c) => c.name.toLowerCase().includes(q));
  }, [clientes, addressClienteSearch]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (addressDropdownRef.current && !addressDropdownRef.current.contains(e.target as Node)) {
        setShowAddressClienteDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function selectLocal(localId: string) {
    setSelectedLocalId(localId);
    if (!localId) return;
    const local = locaisFrequentes.find((l) => l.id === localId);
    if (local) {
      setCustomAddr({
        cep: local.cep ?? "",
        rua: local.rua,
        numero: local.numero,
        complemento: local.complemento ?? "",
        bairro: local.bairro ?? "",
        cidade: local.cidade,
        label: local.name,
      });
      setSaveLocal(false);
    }
  }

  function addDestinatario() {
    setDestinatarios((prev) => [...prev, emptyDestinatario()]);
  }

  function removeDestinatario(id: string) {
    setDestinatarios((prev) => prev.length > 1 ? prev.filter((d) => d.id !== id) : prev);
  }

  function updateDestinatario(id: string, updates: Partial<Destinatario>) {
    setDestinatarios((prev) => prev.map((d) => d.id === id ? { ...d, ...updates } : d));
  }

  function parseValor(formatted: string): string {
    if (!formatted) return "";
    return formatted.replace(/\./g, "").replace(",", ".");
  }

  function formatValor(val: string): string {
    if (!val) return "";
    const num = parseFloat(val.replace(",", "."));
    if (isNaN(num)) return "";
    return num.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);

    try {
      const fd = new FormData(e.currentTarget);

      const destData = destinatarios.map((d) => {
        const actions: string[] = ["entregar"];
        if (d.actionReceber) actions.push("receber");
        if (d.actionAssinar) actions.push("assinar_nota");
        if (d.actionReceberAssinar) actions.push("receber_e_assinar");
        return {
          clienteId: d.clienteId,
          valor: parseValor(d.valor),
          numeroSacolas: parseInt(d.numeroSacolas, 10) || 1,
          actions,
          interestedName: d.interestedName || null,
          notes: d.notes || null,
        };
      });

      await createEntregaGrupo({
        addressMode,
        addressClienteId: addressMode === "cliente" ? addressClienteId : undefined,
        enderecoId: addressMode === "cliente" ? selectedEnderecoId : undefined,
        customAddress: addressMode === "custom" ? {
          cep: customAddr.cep || null,
          rua: customAddr.rua,
          numero: customAddr.numero,
          complemento: customAddr.complemento || null,
          bairro: customAddr.bairro || null,
          cidade: customAddr.cidade,
          label: customAddr.label || null,
        } : undefined,
        scheduledDate: fd.get("scheduled_date") as string,
        scheduledPeriod: fd.get("scheduled_period") as "manha" | "tarde",
        isUrgent: fd.get("is_urgent") === "on",
        destinatarios: destData,
        saveLocal: addressMode === "custom" && saveLocal,
      });

      toast.success(`${destinatarios.length} entregas em grupo cadastradas!`);
      window.location.href = "/dashboard/entregas";
    } catch (err: any) {
      toast.error("Erro ao criar entregas em grupo", { description: err.message });
    }
    setSubmitting(false);
  }

  const hasValidAddress = addressMode === "cliente"
    ? !!selectedEnderecoId
    : !!(customAddr.rua && customAddr.numero && customAddr.cidade);

  const allDestinatariosValid = destinatarios.every((d) => !!d.clienteId);

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-[50vw] min-w-[340px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Users className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Entrega em Grupo</h1>
        </div>
        <Link href="/dashboard/entregas">
          <Button variant="outline" size="sm" type="button">
            <ChevronLeft className="mr-1 h-4 w-4" />
            Voltar
          </Button>
        </Link>
      </div>

      {/* Endereço de Entrega (compartilhado) */}
      <Card className="overflow-visible">
        <CardHeader>
          <CardTitle className="text-lg">Endereço de Entrega</CardTitle>
          <p className="text-sm text-muted-foreground">Todas as entregas do grupo serão enviadas para este endereço.</p>
        </CardHeader>
        <CardContent className="space-y-4 overflow-visible">
          <div className="flex gap-2">
            <Button
              type="button"
              variant={addressMode === "custom" ? "default" : "outline"}
              size="sm"
              onClick={() => setAddressMode("custom")}
            >
              Digitar endereço
            </Button>
            <Button
              type="button"
              variant={addressMode === "cliente" ? "default" : "outline"}
              size="sm"
              onClick={() => setAddressMode("cliente")}
            >
              Usar endereço de cliente
            </Button>
          </div>

          {addressMode === "cliente" && (
            <div className="space-y-3">
              <div className="relative" ref={addressDropdownRef}>
                <Label>Cliente (dono do endereço)</Label>
                <Input
                  placeholder="Digite o nome do cliente..."
                  value={addressCliente ? addressCliente.name : addressClienteSearch}
                  onChange={(e) => {
                    setAddressClienteSearch(e.target.value);
                    setAddressClienteId("");
                    setSelectedEnderecoId("");
                    setShowAddressClienteDropdown(true);
                  }}
                  onFocus={() => setShowAddressClienteDropdown(true)}
                  autoComplete="off"
                />
                {showAddressClienteDropdown && filteredAddressClientes.length > 0 && !addressCliente && (
                  <div className="absolute z-50 top-full left-0 right-0 mt-1 max-h-48 overflow-y-auto rounded-md border bg-popover shadow-md">
                    {filteredAddressClientes.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        className="w-full px-3 py-2 text-left text-sm hover:bg-accent transition-colors"
                        onClick={() => {
                          setAddressClienteId(c.id);
                          setAddressClienteSearch(c.name);
                          setSelectedEnderecoId("");
                          setShowAddressClienteDropdown(false);
                        }}
                      >
                        {c.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {addressCliente && (
                <div className="space-y-2">
                  <Label>Endereço *</Label>
                  <Select value={selectedEnderecoId} onValueChange={(v) => setSelectedEnderecoId(v ?? "")}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Escolha o endereço" />
                    </SelectTrigger>
                    <SelectContent>
                      {enderecos.map((e) => (
                        <SelectItem key={e.id} value={e.id}>
                          {e.label ? `${e.label} — ` : ""}{e.rua}, {e.numero}{e.bairro ? ` (${e.bairro})` : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          )}

          {addressMode === "custom" && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-xs flex items-center gap-1.5">
                  <Bookmark className="h-3.5 w-3.5" />
                  Locais salvos
                </Label>
                <Link href="/dashboard/locais" target="_blank" className="text-xs text-muted-foreground underline-offset-2 hover:underline">
                  Gerenciar
                </Link>
              </div>
              {locaisFrequentes.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {locaisFrequentes.map((l) => (
                    <button
                      key={l.id}
                      type="button"
                      className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs transition-colors ${
                        selectedLocalId === l.id
                          ? "border-violet-500 bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300"
                          : "border-input hover:bg-accent hover:text-accent-foreground"
                      }`}
                      onClick={() => selectLocal(l.id)}
                    >
                      <MapPin className="h-3 w-3" />
                      {l.name}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">Nenhum local salvo ainda.</p>
              )}
            </div>
          )}

          {addressMode === "custom" && (
            <div className="space-y-3">
              <div className="grid grid-cols-[1fr_2fr] gap-2">
                <div className="space-y-1">
                  <Label className="text-xs">CEP</Label>
                  <Input
                    value={customAddr.cep}
                    onChange={(e) => {
                      const v = e.target.value;
                      setCustomAddr((p) => ({ ...p, cep: v }));
                      if (v.replace(/\D/g, "").length === 8) fetchCep(v);
                    }}
                    placeholder="00000-000"
                    className="h-8 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Rua *</Label>
                  <Input
                    value={customAddr.rua}
                    onChange={(e) => setCustomAddr((p) => ({ ...p, rua: e.target.value }))}
                    required
                    className={`h-8 text-sm ${cepHighlight}`}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs">Número *</Label>
                  <Input
                    value={customAddr.numero === "S/N" ? "" : customAddr.numero}
                    onChange={(e) => setCustomAddr((p) => ({ ...p, numero: e.target.value }))}
                    required={customAddr.numero !== "S/N"}
                    disabled={customAddr.numero === "S/N"}
                    className="h-8 text-sm"
                  />
                  <label className="flex items-center gap-2 text-xs">
                    <Checkbox
                      checked={customAddr.numero === "S/N"}
                      onCheckedChange={(checked) => setCustomAddr((p) => ({ ...p, numero: checked ? "S/N" : "" }))}
                    />
                    Sem número
                  </label>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Complemento</Label>
                  <Input
                    value={customAddr.complemento}
                    onChange={(e) => setCustomAddr((p) => ({ ...p, complemento: e.target.value }))}
                    className="h-8 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Bairro</Label>
                  <Input
                    value={customAddr.bairro}
                    onChange={(e) => setCustomAddr((p) => ({ ...p, bairro: e.target.value }))}
                    className={`h-8 text-sm ${cepHighlight}`}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs">Cidade *</Label>
                  <Input
                    value={customAddr.cidade}
                    onChange={(e) => setCustomAddr((p) => ({ ...p, cidade: e.target.value }))}
                    required
                    className={`h-8 text-sm ${cepHighlight}`}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Apelido do local</Label>
                  <Input
                    value={customAddr.label}
                    onChange={(e) => setCustomAddr((p) => ({ ...p, label: e.target.value }))}
                    placeholder="Ex: Curso de Especialização"
                    className="h-8 text-sm"
                  />
                </div>
              </div>
              {!selectedLocalId && (
                <div className="flex items-center gap-2 pt-1">
                  <Checkbox
                    id="save_local"
                    checked={saveLocal}
                    onCheckedChange={(v) => setSaveLocal(!!v)}
                  />
                  <Label htmlFor="save_local" className="text-xs font-normal flex items-center gap-1.5">
                    <Bookmark className="h-3.5 w-3.5" />
                    Salvar este local para uso futuro
                  </Label>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Programação (compartilhada) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Programação</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              type="date"
              name="scheduled_date"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              className="flex-1"
            />
            <Select name="scheduled_period" value={scheduledPeriod} onValueChange={(value) => setScheduledPeriod(value as "manha" | "tarde")}>
              <SelectTrigger className="w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="manha">Manhã</SelectItem>
                <SelectItem value="tarde">Tarde</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="is_urgent" name="is_urgent" />
            <Label htmlFor="is_urgent" className="flex items-center gap-1.5 text-sm font-normal">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              Urgente
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Destinatários */}
      <Card className="overflow-visible">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Destinatários</CardTitle>
              <p className="text-sm text-muted-foreground">{destinatarios.length} destinatário{destinatarios.length !== 1 ? "s" : ""}</p>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={addDestinatario}>
              <Plus className="mr-1 h-4 w-4" />
              Adicionar
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {destinatarios.map((dest, idx) => (
            <DestinatarioRow
              key={dest.id}
              dest={dest}
              index={idx}
              clientes={clientes}
              canRemove={destinatarios.length > 1}
              onUpdate={(updates) => updateDestinatario(dest.id, updates)}
              onRemove={() => removeDestinatario(dest.id)}
              formatValor={formatValor}
            />
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3 pb-8">
        <Link href="/dashboard/entregas">
          <Button variant="outline" type="button">Cancelar</Button>
        </Link>
        <Button
          type="submit"
          disabled={submitting || !hasValidAddress || !allDestinatariosValid}
        >
          {submitting ? "Cadastrando..." : `Cadastrar ${destinatarios.length} Entrega${destinatarios.length !== 1 ? "s" : ""}`}
        </Button>
      </div>
    </form>
  );
}

function DestinatarioRow({
  dest,
  index,
  clientes,
  canRemove,
  onUpdate,
  onRemove,
  formatValor,
}: {
  dest: Destinatario;
  index: number;
  clientes: ClienteWithEnderecos[];
  canRemove: boolean;
  onUpdate: (updates: Partial<Destinatario>) => void;
  onRemove: () => void;
  formatValor: (v: string) => string;
}) {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedCliente = clientes.find((c) => c.id === dest.clienteId);

  const filtered = useMemo(() => {
    if (!dest.clienteSearch.trim()) return clientes;
    const q = dest.clienteSearch.toLowerCase();
    return clientes.filter((c) => c.name.toLowerCase().includes(q));
  }, [clientes, dest.clienteSearch]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="rounded-lg border p-3 space-y-3 bg-muted/20">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-muted-foreground">#{index + 1}</span>
        {canRemove && (
          <button type="button" onClick={onRemove} className="text-muted-foreground hover:text-destructive">
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Cliente */}
      <div className="relative" ref={dropdownRef}>
        <Label className="text-xs">Cliente *</Label>
        <Input
          placeholder="Digite o nome do cliente..."
          value={selectedCliente ? selectedCliente.name : dest.clienteSearch}
          onChange={(e) => {
            onUpdate({ clienteSearch: e.target.value, clienteId: "" });
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
          autoComplete="off"
          className="h-8 text-sm"
        />
        {showDropdown && filtered.length > 0 && !selectedCliente && (
          <div className="absolute z-50 top-full left-0 right-0 mt-1 max-h-36 overflow-y-auto rounded-md border bg-popover shadow-md">
            {filtered.map((c) => (
              <button
                key={c.id}
                type="button"
                className="w-full px-3 py-1.5 text-left text-sm hover:bg-accent transition-colors"
                onClick={() => {
                  onUpdate({ clienteId: c.id, clienteSearch: c.name });
                  setShowDropdown(false);
                }}
              >
                {c.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Valor + Sacolas */}
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <Label className="text-xs">Valor</Label>
          <div className="relative">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">R$</span>
            <Input
              value={dest.valor}
              onChange={(e) => onUpdate({ valor: e.target.value.replace(/[^\d,]/g, "") })}
              onBlur={() => onUpdate({ valor: formatValor(dest.valor) })}
              placeholder="0,00"
              className="h-8 text-sm pl-7"
              inputMode="decimal"
            />
          </div>
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Sacolas</Label>
          <Input
            type="number"
            min="1"
            value={dest.numeroSacolas}
            onChange={(e) => onUpdate({ numeroSacolas: e.target.value })}
            className="h-8 text-sm"
            inputMode="numeric"
          />
        </div>
      </div>

      {/* Ações */}
      <div className="space-y-1">
        <Label className="text-xs">Ação do entregador</Label>
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-1.5">
            <Checkbox checked disabled className="h-3.5 w-3.5" />
            <span className="text-xs text-muted-foreground">Entregar</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Checkbox
              checked={dest.actionReceber}
              onCheckedChange={(v) => onUpdate({ actionReceber: !!v, actionAssinar: false, actionReceberAssinar: false })}
              className="h-3.5 w-3.5"
            />
            <span className="text-xs">Receber</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Checkbox
              checked={dest.actionAssinar}
              onCheckedChange={(v) => onUpdate({ actionAssinar: !!v, actionReceber: false, actionReceberAssinar: false })}
              className="h-3.5 w-3.5"
            />
            <span className="text-xs">Assinar Nota</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Checkbox
              checked={dest.actionReceberAssinar}
              onCheckedChange={(v) => onUpdate({ actionReceberAssinar: !!v, actionReceber: false, actionAssinar: false })}
              className="h-3.5 w-3.5"
            />
            <span className="text-xs">Receber e Assinar</span>
          </div>
        </div>
      </div>

      {/* Interessado + Obs (collapsed) */}
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <Label className="text-xs">Interessado</Label>
          <Input
            value={dest.interestedName}
            onChange={(e) => onUpdate({ interestedName: e.target.value })}
            placeholder="Nome (opcional)"
            className="h-8 text-sm"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Observação</Label>
          <Input
            value={dest.notes}
            onChange={(e) => onUpdate({ notes: e.target.value })}
            placeholder="Opcional"
            className="h-8 text-sm"
          />
        </div>
      </div>
    </div>
  );
}
