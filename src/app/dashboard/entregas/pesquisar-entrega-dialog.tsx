"use client";

import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusBadge } from "@/components/status-badge";
import Link from "next/link";
import { Search, MapPin, AlertTriangle, X } from "lucide-react";
import { formatOrderNumber } from "@/lib/status";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface PesquisarEntregaDialogProps {
  entregas: any[];
  entregadores: any[];
}

export function PesquisarEntregaDialog({
  entregas,
  entregadores,
}: PesquisarEntregaDialogProps) {
  const [open, setOpen] = useState(false);
  const [orderNumberQuery, setOrderNumberQuery] = useState("");
  const [clienteQuery, setClienteQuery] = useState("");
  const [entregadorId, setEntregadorId] = useState("");
  const [data, setData] = useState("");
  const [searched, setSearched] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const clientes = useMemo(() => {
    const map = new Map<string, string>();
    for (const e of entregas) {
      if (e.cliente?.id && e.cliente?.name) {
        map.set(e.cliente.id, e.cliente.name);
      }
    }
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [entregas]);

  const filteredClientes = useMemo(() => {
    if (!clienteQuery.trim()) return [];
    const q = clienteQuery.toLowerCase();
    return clientes.filter((c) => c.name.toLowerCase().includes(q));
  }, [clientes, clienteQuery]);

  const [selectedClienteId, setSelectedClienteId] = useState<string | null>(null);
  const [selectedClienteName, setSelectedClienteName] = useState("");

  const results = useMemo(() => {
    if (!searched) return [];
    return entregas.filter((e) => {
      if (orderNumberQuery.trim()) {
        const num = orderNumberQuery.replace(/^#/, "").trim();
        if (!String(e.order_number).includes(num)) return false;
      }
      if (selectedClienteId && e.cliente_id !== selectedClienteId) return false;
      if (entregadorId && e.entregador_id !== entregadorId) return false;
      if (data) {
        const deliveredAt = e.delivered_at;
        if (!deliveredAt) return false;
        const deliveredDate = new Date(deliveredAt).toISOString().split("T")[0];
        if (deliveredDate !== data) return false;
      }
      return true;
    });
  }, [entregas, orderNumberQuery, selectedClienteId, entregadorId, data, searched]);

  const hasFilters = orderNumberQuery.trim() || selectedClienteId || entregadorId || data;

  function handleSearch() {
    if (!hasFilters) return;
    setSearched(true);
  }

  function handleClear() {
    setOrderNumberQuery("");
    setClienteQuery("");
    setEntregadorId("");
    setData("");
    setSelectedClienteId(null);
    setSelectedClienteName("");
    setSearched(false);
  }

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (!nextOpen) handleClear();
  }

  function selectCliente(id: string, name: string) {
    setSelectedClienteId(id);
    setSelectedClienteName(name);
    setClienteQuery("");
    setActiveIndex(-1);
  }

  function handleClienteKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (filteredClientes.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % filteredClientes.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i <= 0 ? filteredClientes.length - 1 : i - 1));
    } else if (e.key === "Enter") {
      if (activeIndex >= 0) {
        e.preventDefault();
        const c = filteredClientes[activeIndex];
        selectCliente(c.id, c.name);
      }
    } else if (e.key === "Escape") {
      setActiveIndex(-1);
      setClienteQuery("");
    }
  }

  function clearCliente() {
    setSelectedClienteId(null);
    setSelectedClienteName("");
    setSearched(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button variant="outline">
            <Search className="mr-2 h-4 w-4" />
            Pesquisar Entrega
          </Button>
        }
      />
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Pesquisar Entrega</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Número da entrega */}
          <div className="space-y-2">
            <Label>Número da entrega</Label>
            <Input
              placeholder="Ex: 42 ou #0042"
              value={orderNumberQuery}
              onChange={(e) => {
                setOrderNumberQuery(e.target.value);
                setSearched(false);
              }}
            />
          </div>

          {/* Cliente search */}
          <div className="space-y-2">
            <Label>Cliente</Label>
            {selectedClienteId ? (
              <div className="flex items-center gap-2 rounded-lg border border-input bg-muted/30 px-3 py-2 text-sm">
                <span className="flex-1">{selectedClienteName}</span>
                <button
                  type="button"
                  onClick={clearCliente}
                  aria-label="Limpar cliente selecionado"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="relative">
                <Input
                  role="combobox"
                  aria-expanded={filteredClientes.length > 0}
                  aria-controls="cliente-listbox"
                  aria-activedescendant={activeIndex >= 0 ? `cliente-option-${activeIndex}` : undefined}
                  placeholder="Digite o nome do cliente..."
                  value={clienteQuery}
                  onChange={(e) => {
                    setClienteQuery(e.target.value);
                    setSearched(false);
                    setActiveIndex(-1);
                  }}
                  onKeyDown={handleClienteKeyDown}
                />
                {filteredClientes.length > 0 && (
                  <div
                    id="cliente-listbox"
                    role="listbox"
                    className="absolute top-full left-0 z-10 mt-1 w-full rounded-lg border bg-popover shadow-md max-h-40 overflow-y-auto"
                  >
                    {filteredClientes.map((c, i) => (
                      <button
                        key={c.id}
                        id={`cliente-option-${i}`}
                        role="option"
                        aria-selected={i === activeIndex}
                        type="button"
                        className={`w-full px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground ${
                          i === activeIndex ? "bg-accent text-accent-foreground" : ""
                        }`}
                        onClick={() => selectCliente(c.id, c.name)}
                        onMouseEnter={() => setActiveIndex(i)}
                      >
                        {c.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Entregador select */}
          <div className="space-y-2">
            <Label>Motoboy</Label>
            <Select
              value={entregadorId}
              onValueChange={(v) => {
                setEntregadorId(v as string);
                setSearched(false);
              }}
              items={Object.fromEntries([["", "Todos"], ...entregadores.map((ent) => [ent.id, ent.name])])}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Todos os motoboys" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos</SelectItem>
                {entregadores.map((ent) => (
                  <SelectItem key={ent.id} value={ent.id}>
                    {ent.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Data */}
          <div className="space-y-2">
            <Label>Data da entrega</Label>
            <Input
              type="date"
              value={data}
              onChange={(e) => {
                setData(e.target.value);
                setSearched(false);
              }}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              onClick={handleSearch}
              disabled={!hasFilters}
              className="flex-1"
            >
              <Search className="mr-2 h-4 w-4" />
              Pesquisar
            </Button>
            {hasFilters && (
              <Button variant="outline" onClick={handleClear}>
                Limpar
              </Button>
            )}
          </div>

          {/* Results */}
          {searched && (
            <div className="space-y-3 pt-2 border-t">
              <p className="text-sm text-muted-foreground">
                {results.length === 0
                  ? "Nenhuma entrega encontrada."
                  : `${results.length} entrega${results.length > 1 ? "s" : ""} encontrada${results.length > 1 ? "s" : ""}.`}
              </p>
              {results.map((entrega) => {
                return (
                  <Link key={entrega.id} href={`/dashboard/entregas/${entrega.id}`} onClick={() => setOpen(false)}>
                    <Card className="transition-colors hover:bg-muted/50 cursor-pointer">
                      <CardContent className="py-3">
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-mono text-muted-foreground">{formatOrderNumber(entrega.order_number)}</span>
                            <span className="text-sm font-medium">
                              {entrega.cliente?.name ?? "Cliente"}
                            </span>
                            {entrega.is_urgent && (
                              <Badge variant="destructive" className="text-xs">
                                <AlertTriangle className="mr-1 h-3 w-3" />
                                Urgente
                              </Badge>
                            )}
                            <StatusBadge status={entrega.status} />
                          </div>
                          {entrega.endereco && (
                            <p className="flex items-center gap-1 text-xs text-muted-foreground">
                              <MapPin className="h-3 w-3" />
                              {entrega.endereco.rua}, {entrega.endereco.numero}
                              {entrega.endereco.bairro
                                ? ` - ${entrega.endereco.bairro}`
                                : ""}
                            </p>
                          )}
                          {entrega.entregador && (
                            <p className="text-xs text-muted-foreground">
                              Entregador: {entrega.entregador.name}
                            </p>
                          )}
                          {entrega.delivered_at && (
                            <p className="text-xs text-muted-foreground">
                              Entregue em:{" "}
                              {format(
                                new Date(entrega.delivered_at),
                                "dd/MM/yyyy 'às' HH:mm",
                                { locale: ptBR }
                              )}
                            </p>
                          )}
                          {entrega.valor && (
                            <p className="text-xs font-medium">
                              R$ {Number(entrega.valor).toFixed(2)}
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
