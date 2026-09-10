"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
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
import type { EntregaWithRelations, Profile } from "@/types/database";

interface PesquisarEntregaDialogProps {
  entregadores: Pick<Profile, "id" | "name">[];
  triggerClassName?: string;
}

interface ClienteOption {
  id: string;
  name: string;
}

export function PesquisarEntregaDialog({
  entregadores,
  triggerClassName,
}: PesquisarEntregaDialogProps) {
  const supabase = createClient();
  const [open, setOpen] = useState(false);
  const [orderNumberQuery, setOrderNumberQuery] = useState("");
  const [clienteQuery, setClienteQuery] = useState("");
  const [entregadorId, setEntregadorId] = useState("");
  const [data, setData] = useState("");
  const [searched, setSearched] = useState(false);
  const [searching, setSearching] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [results, setResults] = useState<EntregaWithRelations[]>([]);

  const [clientes, setClientes] = useState<ClienteOption[]>([]);
  const [clientesLoaded, setClientesLoaded] = useState(false);
  const [selectedClienteId, setSelectedClienteId] = useState<string | null>(null);
  const [selectedClienteName, setSelectedClienteName] = useState("");
  const clienteBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (clienteBoxRef.current && !clienteBoxRef.current.contains(e.target as Node)) {
        setClienteQuery("");
        setActiveIndex(-1);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const filteredClientes = (() => {
    if (!clienteQuery.trim()) return [];
    const q = clienteQuery.toLowerCase();
    return clientes.filter((c) => c.name.toLowerCase().includes(q));
  })();

  const hasFilters = orderNumberQuery.trim() || selectedClienteId || entregadorId || data;

  async function loadClientes() {
    if (clientesLoaded) return;
    const { data: clientesData } = await supabase
      .from("clientes")
      .select("id, name")
      .eq("active", true)
      .order("name");
    setClientes(clientesData ?? []);
    setClientesLoaded(true);
  }

  async function handleSearch() {
    if (!hasFilters) return;
    setSearching(true);

    let query = supabase
      .from("entregas")
      .select(
        "*, cliente:clientes(*), endereco:enderecos(*), entregador:profiles!entregas_entregador_id_fkey(id, name)"
      )
      .order("created_at", { ascending: false });

    if (orderNumberQuery.trim()) {
      const num = Number(orderNumberQuery.replace(/^#/, "").trim());
      query = query.eq("order_number", num);
    }
    if (selectedClienteId) query = query.eq("cliente_id", selectedClienteId);
    if (entregadorId) query = query.eq("entregador_id", entregadorId);
    if (data) {
      query = query.eq("scheduled_date", data);
    }

    const { data: found } = await query.limit(50);
    setResults(found ?? []);
    setSearching(false);
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
    setResults([]);
  }

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (nextOpen) loadClientes();
    else handleClear();
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
          <Button variant="outline" className={triggerClassName}>
            <Search className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Pesquisar Entrega</span>
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
              <div className="relative" ref={clienteBoxRef}>
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
            <Label>Entregador</Label>
            <Select
              value={entregadorId}
              onValueChange={(v) => {
                setEntregadorId(v as string);
                setSearched(false);
              }}
              items={Object.fromEntries([["", "Todos"], ...entregadores.map((ent) => [ent.id, ent.name])])}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Todos os entregadores" />
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
              disabled={!hasFilters || searching}
              className="flex-1"
            >
              <Search className="mr-2 h-4 w-4" />
              {searching ? "Pesquisando..." : "Pesquisar"}
            </Button>
            {hasFilters && (
              <Button variant="outline" onClick={handleClear}>
                Limpar
              </Button>
            )}
          </div>

          {/* Results */}
          {searched && (
            <div className="pt-2 border-t">
              <p className="text-sm text-muted-foreground mb-3">
                {results.length === 0
                  ? "Nenhuma entrega encontrada."
                  : `${results.length} entrega${results.length > 1 ? "s" : ""} encontrada${results.length > 1 ? "s" : ""}.`}
              </p>
              <div className="space-y-4">
              {results.map((entrega) => {
                return (
                  <Link key={entrega.id} href={`/dashboard/entregas/${entrega.id}`} onClick={() => setOpen(false)} className="block">
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
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
