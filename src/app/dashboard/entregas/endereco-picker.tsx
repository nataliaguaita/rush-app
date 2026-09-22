"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Bookmark, MapPin } from "lucide-react";
import type { Endereco, LocalFrequente } from "@/types/database";
import { useCep } from "@/lib/use-cep";
import { useGeocodeCheck } from "@/lib/use-geocode-check";
import { GeocodeWarning } from "@/components/geocode-warning";

// Escolha de endereço da entrega: um dos cadastrados do cliente ou um novo
// (opcionalmente salvo no cliente). Envia endereco_id ou custom_* no FormData,
// lidos por resolveEnderecoId em ../actions.
export function EnderecoPicker({
  clienteId,
  enderecos,
  locaisFrequentes,
  value,
  onChange,
}: {
  clienteId: string;
  enderecos: Endereco[];
  locaisFrequentes: LocalFrequente[];
  value: string;
  onChange: (enderecoId: string) => void;
}) {
  const [useCustomAddress, setUseCustomAddress] = useState(false);
  const [customAddr, setCustomAddr] = useState({ cep: "", rua: "", numero: "", complemento: "", bairro: "", cidade: "", label: "" });
  const [saveToCliente, setSaveToCliente] = useState(false);
  const [selectedLocalId, setSelectedLocalId] = useState("");
  const [localSearch, setLocalSearch] = useState("");
  const [showLocalDropdown, setShowLocalDropdown] = useState(false);
  const localDropdownRef = useRef<HTMLDivElement>(null);

  const handleCepResult = useCallback((data: { rua: string; bairro: string; cidade: string }) => {
    setCustomAddr((prev) => ({ ...prev, rua: data.rua, bairro: data.bairro, cidade: data.cidade }));
  }, []);
  const { fetchCep, filled: cepFilled } = useCep(handleCepResult);
  const cepHighlight = cepFilled ? "ring-2 ring-green-500/50 transition-shadow" : "transition-shadow";
  const geoCheck = useGeocodeCheck();

  const selectedLocal = locaisFrequentes.find((l) => l.id === selectedLocalId);

  const filteredLocais = useMemo(() => {
    if (!localSearch.trim()) return locaisFrequentes;
    const q = localSearch.toLowerCase();
    return locaisFrequentes.filter((l) => l.name.toLowerCase().includes(q));
  }, [locaisFrequentes, localSearch]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (localDropdownRef.current && !localDropdownRef.current.contains(e.target as Node)) {
        setShowLocalDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function selectLocal(localId: string) {
    setSelectedLocalId(localId);
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
      geoCheck.markResult(!!(local.lat && local.lng));
    }
  }

  return (
    <div className="space-y-2">
      {!useCustomAddress && (
        <>
          <Label>Endereço de Entrega *</Label>
          <Select
            name="endereco_id"
            value={value}
            onValueChange={(v) => onChange(v ?? "")}
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
        </>
      )}
      {enderecos.length === 0 && !useCustomAddress && (
        <p className="text-sm text-destructive">
          Este cliente não possui endereços cadastrados.{" "}
          <Link
            href={`/dashboard/clientes/${clienteId}`}
            className="underline"
          >
            Adicionar endereço
          </Link>
        </p>
      )}

      <button
        type="button"
        className="flex items-center gap-1.5 text-sm text-primary hover:underline mt-1"
        onClick={() => {
          setUseCustomAddress(!useCustomAddress);
          if (!useCustomAddress) onChange("");
        }}
      >
        <MapPin className="h-3.5 w-3.5" />
        {useCustomAddress ? "Usar endereço cadastrado" : "Usar outro endereço para esta entrega"}
      </button>

      {useCustomAddress && (
        <div className="space-y-3 rounded-md border p-3 bg-muted/30">
          <input type="hidden" name="custom_address" value="true" />

          {locaisFrequentes.length > 0 && (
            <div className="relative space-y-1" ref={localDropdownRef}>
              <Label className="text-xs flex items-center gap-1.5">
                <Bookmark className="h-3.5 w-3.5" />
                Endereço fixo / curso salvo
              </Label>
              <Input
                placeholder="Digite ou selecione um endereço salvo..."
                value={selectedLocal ? selectedLocal.name : localSearch}
                onChange={(e) => {
                  setLocalSearch(e.target.value);
                  setSelectedLocalId("");
                  setShowLocalDropdown(true);
                }}
                onFocus={() => setShowLocalDropdown(true)}
                autoComplete="off"
                className="h-8 text-sm"
              />
              {showLocalDropdown && filteredLocais.length > 0 && !selectedLocal && (
                <div className="absolute z-50 top-full left-0 right-0 mt-1 max-h-48 overflow-y-auto rounded-md border bg-popover shadow-md">
                  {filteredLocais.map((l) => (
                    <button
                      key={l.id}
                      type="button"
                      className="w-full px-3 py-2 text-left text-sm hover:bg-accent transition-colors"
                      onClick={() => {
                        selectLocal(l.id);
                        setLocalSearch(l.name);
                        setShowLocalDropdown(false);
                      }}
                    >
                      {l.name} — {l.rua}, {l.numero}{l.bairro ? ` (${l.bairro})` : ""}
                    </button>
                  ))}
                </div>
              )}
              <p className="text-xs text-muted-foreground">Selecionar preenche os campos abaixo — você ainda pode ajustá-los.</p>
            </div>
          )}

          <div className="grid grid-cols-[1fr_2fr] gap-2">
            <div className="space-y-1">
              <Label className="text-xs">CEP</Label>
              <Input
                name="custom_cep"
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
                name="custom_rua"
                value={customAddr.rua}
                onChange={(e) => { setCustomAddr((p) => ({ ...p, rua: e.target.value })); geoCheck.reset(); }}
                required
                className={`h-8 text-sm ${cepHighlight}`}
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="space-y-1">
              <Label className="text-xs">Número *</Label>
              <Input
                name="custom_numero"
                value={customAddr.numero === "S/N" ? "" : customAddr.numero}
                onChange={(e) => { setCustomAddr((p) => ({ ...p, numero: e.target.value })); geoCheck.reset(); }}
                required={customAddr.numero !== "S/N"}
                disabled={customAddr.numero === "S/N"}
                className="h-8 text-sm"
              />
              <label className="flex items-center gap-2 text-xs">
                <Checkbox
                  checked={customAddr.numero === "S/N"}
                  onCheckedChange={(checked) => { setCustomAddr((p) => ({ ...p, numero: checked ? "S/N" : "" })); geoCheck.reset(); }}
                />
                Sem número
              </label>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Complemento</Label>
              <Input
                name="custom_complemento"
                value={customAddr.complemento}
                onChange={(e) => setCustomAddr((p) => ({ ...p, complemento: e.target.value }))}
                className="h-8 text-sm"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Bairro</Label>
              <Input
                name="custom_bairro"
                value={customAddr.bairro}
                onChange={(e) => { setCustomAddr((p) => ({ ...p, bairro: e.target.value })); geoCheck.reset(); }}
                className={`h-8 text-sm ${cepHighlight}`}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-xs">Cidade *</Label>
              <Input
                name="custom_cidade"
                value={customAddr.cidade}
                onChange={(e) => { setCustomAddr((p) => ({ ...p, cidade: e.target.value })); geoCheck.reset(); }}
                onBlur={() => geoCheck.check(customAddr.rua, customAddr.numero, customAddr.cidade)}
                required
                className={`h-8 text-sm ${cepHighlight}`}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Apelido</Label>
              <Input
                name="custom_label"
                value={customAddr.label}
                onChange={(e) => setCustomAddr((p) => ({ ...p, label: e.target.value }))}
                placeholder="Ex: Escritório"
                className="h-8 text-sm"
              />
            </div>
          </div>

          <GeocodeWarning status={geoCheck.status} />

          <div className="flex items-center gap-2 pt-1">
            <Checkbox
              id="save_to_cliente"
              name="save_to_cliente"
              checked={saveToCliente}
              onCheckedChange={(v) => setSaveToCliente(!!v)}
            />
            <Label htmlFor="save_to_cliente" className="text-sm font-normal">
              Salvar este endereço no cadastro do cliente
            </Label>
          </div>
        </div>
      )}
    </div>
  );
}
