"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Package,
  DollarSign,
  TrendingUp,
  TrendingDown,
  XCircle,
  Sun,
  Sunset,
  Printer,
  FileText,
  MapPin,
  Users,
  Truck,
  Clock,
  Route,
} from "lucide-react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  startOfYear,
  endOfYear,
  subMonths,
  subWeeks,
  subYears,
  subDays,
  differenceInMinutes,
  differenceInCalendarDays,
} from "date-fns";
import type { Profile } from "@/types/database";

const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

const HeatmapCard = dynamic(() => import("./heatmap").then((m) => m.HeatmapCard), {
  ssr: false,
  loading: () => (
    <div className="flex h-80 w-full items-center justify-center text-sm text-muted-foreground">
      Carregando mapa...
    </div>
  ),
});

function computeCoreStats(entregasList: any[], rotasList: any[]) {
  const entregues = entregasList.filter((e) => e.status === "entregue");
  const recusadas = entregasList.filter((e) => e.status === "recusada");
  const canceladas = entregasList.filter((e) => e.status === "cancelada");
  const manha = entregasList.filter((e) => e.scheduled_period === "manha");
  const tarde = entregasList.filter((e) => e.scheduled_period === "tarde");

  const valorTotal = entregues.reduce((sum, e) => sum + (e.valor ?? 0), 0);
  const ticketMedio = entregues.length > 0 ? valorTotal / entregues.length : 0;
  const taxaRecusa = entregasList.length > 0 ? (recusadas.length / entregasList.length) * 100 : 0;

  const tempos = entregues
    .filter((e) => e.delivered_at && e.created_at)
    .map((e) => differenceInMinutes(new Date(e.delivered_at), new Date(e.created_at)));
  const tempoMedio = tempos.length > 0 ? tempos.reduce((a, b) => a + b, 0) / tempos.length : 0;

  const kmTotal = rotasList.reduce((sum, r) => sum + r.distance_km, 0);

  return {
    total: entregasList.length,
    entregues: entregues.length,
    recusadas: recusadas.length,
    canceladas: canceladas.length,
    manha: manha.length,
    tarde: tarde.length,
    valorTotal,
    ticketMedio,
    taxaRecusa,
    tempoMedio,
    kmTotal,
  };
}

function pctChange(curr: number, prev: number): number | null {
  if (prev === 0) return curr === 0 ? 0 : null;
  return ((curr - prev) / prev) * 100;
}

export default function RelatoriosPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [entregas, setEntregas] = useState<any[]>([]);
  const [rotas, setRotas] = useState<any[]>([]);
  const [prevEntregas, setPrevEntregas] = useState<any[]>([]);
  const [prevRotas, setPrevRotas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [printMode, setPrintMode] = useState<"resumo" | "completo" | null>(null);

  const now = new Date();
  const [startDate, setStartDate] = useState(() => format(startOfMonth(now), "yyyy-MM-dd"));
  const [endDate, setEndDate] = useState(() => format(endOfMonth(now), "yyyy-MM-dd"));

  const router = useRouter();
  const supabase = createClient();

  function selectRange(start: Date, end: Date) {
    setStartDate(format(start, "yyyy-MM-dd"));
    setEndDate(format(end, "yyyy-MM-dd"));
  }

  const presets = [
    { label: "Hoje", start: now, end: now, prevStart: subDays(now, 1), prevEnd: subDays(now, 1) },
    {
      label: "Esta Semana",
      start: startOfWeek(now, { weekStartsOn: 1 }),
      end: endOfWeek(now, { weekStartsOn: 1 }),
      prevStart: startOfWeek(subWeeks(now, 1), { weekStartsOn: 1 }),
      prevEnd: endOfWeek(subWeeks(now, 1), { weekStartsOn: 1 }),
    },
    {
      label: "Este Mês",
      start: startOfMonth(now),
      end: endOfMonth(now),
      prevStart: startOfMonth(subMonths(now, 1)),
      prevEnd: endOfMonth(subMonths(now, 1)),
    },
    {
      label: "Último Mês",
      start: startOfMonth(subMonths(now, 1)),
      end: endOfMonth(subMonths(now, 1)),
      prevStart: startOfMonth(subMonths(now, 2)),
      prevEnd: endOfMonth(subMonths(now, 2)),
    },
    {
      label: "Este Ano",
      start: startOfYear(now),
      end: endOfYear(now),
      prevStart: startOfYear(subYears(now, 1)),
      prevEnd: endOfYear(subYears(now, 1)),
    },
  ];

  // Comparison baseline: matching preset uses its calendar-aware previous period,
  // a custom range falls back to the immediately preceding period of equal length.
  const { prevStart, prevEnd } = useMemo(() => {
    const match = presets.find(
      (p) => format(p.start, "yyyy-MM-dd") === startDate && format(p.end, "yyyy-MM-dd") === endDate
    );
    if (match) {
      return { prevStart: format(match.prevStart, "yyyy-MM-dd"), prevEnd: format(match.prevEnd, "yyyy-MM-dd") };
    }
    const start = new Date(startDate + "T00:00:00");
    const end = new Date(endDate + "T00:00:00");
    const days = differenceInCalendarDays(end, start) + 1;
    const pEnd = subDays(start, 1);
    const pStart = subDays(pEnd, days - 1);
    return { prevStart: format(pStart, "yyyy-MM-dd"), prevEnd: format(pEnd, "yyyy-MM-dd") };
  }, [startDate, endDate]);

  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace("/login"); return; }
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      if (!data || data.role !== "admin") { router.replace("/dashboard"); return; }
      setProfile(data as Profile);
    }
    checkAuth();
  }, []);

  useEffect(() => {
    if (!profile) return;
    async function load() {
      setLoading(true);
      const entregaColumns = `
        id, valor, status, scheduled_period, scheduled_date,
        delivered_at, created_at, entregador_id,
        cliente:clientes(name),
        endereco:enderecos(bairro, lat, lng),
        entregador:profiles!entregas_entregador_id_fkey(id, name)
      `;
      const [entregasRes, rotasRes, prevEntregasRes, prevRotasRes] = await Promise.all([
        supabase.from("entregas").select(entregaColumns).gte("scheduled_date", startDate).lte("scheduled_date", endDate),
        supabase.from("rotas_diarias").select("*").gte("data", startDate).lte("data", endDate),
        supabase.from("entregas").select(entregaColumns).gte("scheduled_date", prevStart).lte("scheduled_date", prevEnd),
        supabase.from("rotas_diarias").select("*").gte("data", prevStart).lte("data", prevEnd),
      ]);
      setEntregas(entregasRes.data ?? []);
      setRotas(rotasRes.data ?? []);
      setPrevEntregas(prevEntregasRes.data ?? []);
      setPrevRotas(prevRotasRes.data ?? []);
      setLoading(false);
    }
    load();
  }, [profile, startDate, endDate, prevStart, prevEnd]);

  function handlePrint(mode: "resumo" | "completo") {
    setPrintMode(mode);
    setTimeout(() => {
      window.print();
      setPrintMode(null);
    }, 100);
  }

  const stats = useMemo(() => {
    const core = computeCoreStats(entregas, rotas);

    // Per-driver stats
    const driverMap = new Map<string, { name: string; count: number; valor: number; manha: number; tarde: number }>();
    for (const e of entregas) {
      if (!e.entregador_id || !e.entregador) continue;
      const d = driverMap.get(e.entregador_id) ?? { name: e.entregador.name, count: 0, valor: 0, manha: 0, tarde: 0 };
      d.count++;
      if (e.status === "entregue") d.valor += e.valor ?? 0;
      if (e.scheduled_period === "manha") d.manha++;
      if (e.scheduled_period === "tarde") d.tarde++;
      driverMap.set(e.entregador_id, d);
    }

    // Add km from rotas
    const kmByDriver = new Map<string, number>();
    for (const r of rotas) {
      kmByDriver.set(r.entregador_id, (kmByDriver.get(r.entregador_id) ?? 0) + r.distance_km);
    }

    const drivers = Array.from(driverMap.entries())
      .map(([id, d]) => ({ id, ...d, km: kmByDriver.get(id) ?? 0 }))
      .sort((a, b) => b.count - a.count);

    // Top clients (volume + revenue)
    const clientMap = new Map<string, { count: number; valor: number }>();
    for (const e of entregas) {
      const name = e.cliente?.name ?? "Desconhecido";
      const c = clientMap.get(name) ?? { count: 0, valor: 0 };
      c.count++;
      if (e.status === "entregue") c.valor += e.valor ?? 0;
      clientMap.set(name, c);
    }
    const topClientes = Array.from(clientMap.entries())
      .map(([name, v]) => ({ name, ...v }))
      .sort((a, b) => b.valor - a.valor)
      .slice(0, 10);

    // Top bairros
    const bairroMap = new Map<string, number>();
    for (const e of entregas) {
      const bairro = e.endereco?.bairro ?? "Sem bairro";
      bairroMap.set(bairro, (bairroMap.get(bairro) ?? 0) + 1);
    }
    const topBairros = Array.from(bairroMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Heatmap points (only entregas with geocoded addresses)
    const heatPoints = entregas
      .filter((e) => typeof e.endereco?.lat === "number" && typeof e.endereco?.lng === "number")
      .map((e) => ({ lat: e.endereco.lat as number, lng: e.endereco.lng as number }));

    return { ...core, drivers, topClientes, topBairros, heatPoints };
  }, [entregas, rotas]);

  const prevStats = useMemo(() => computeCoreStats(prevEntregas, prevRotas), [prevEntregas, prevRotas]);

  function formatTempo(minutos: number) {
    if (minutos < 60) return `${Math.round(minutos)}min`;
    const h = Math.floor(minutos / 60);
    const m = Math.round(minutos % 60);
    return m > 0 ? `${h}h ${m}min` : `${h}h`;
  }

  if (!profile) {
    return <div className="flex h-screen items-center justify-center text-muted-foreground">Carregando...</div>;
  }

  return (
    <AppShell profile={profile}>
      <style>{`
        @media print {
          @page { size: A4; margin: 12mm; }
          .no-print { display: none !important; }
          .print-break { page-break-before: always; }
          body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
          [data-slot="card"], table tr { break-inside: avoid; }
          .overflow-x-auto { overflow: visible !important; }
          table { font-size: 11px; }
        }
      `}</style>

      <div className="mx-auto max-w-6xl space-y-6 print:max-w-none">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 no-print">
          <div>
            <h1 className="text-2xl font-bold">Relatórios</h1>
            <p className="text-muted-foreground">Análise de entregas e desempenho</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => handlePrint("resumo")}>
              <FileText className="mr-2 h-4 w-4" />
              PDF Resumo
            </Button>
            <Button variant="outline" size="sm" onClick={() => handlePrint("completo")}>
              <Printer className="mr-2 h-4 w-4" />
              PDF Completo
            </Button>
          </div>
        </div>

        {/* Print header (visible only when printing) */}
        <div className="hidden print:block">
          <h1 className="text-xl font-bold">Relatório de Entregas — Dental Marechal</h1>
          <p className="text-sm text-muted-foreground">
            Período: {new Date(startDate + "T00:00:00").toLocaleDateString("pt-BR")} a{" "}
            {new Date(endDate + "T00:00:00").toLocaleDateString("pt-BR")}
          </p>
        </div>

        {/* Period filter */}
        <div className="flex flex-wrap items-center gap-2 no-print">
          {presets.map((preset) => {
            const pStart = format(preset.start, "yyyy-MM-dd");
            const pEnd = format(preset.end, "yyyy-MM-dd");
            const isActive = startDate === pStart && endDate === pEnd;
            return (
              <Button
                key={preset.label}
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => selectRange(preset.start, preset.end)}
              >
                {preset.label}
              </Button>
            );
          })}
          <div className="flex items-center gap-1 ml-auto">
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="h-8 w-auto text-sm"
            />
            <span className="text-muted-foreground text-sm">a</span>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="h-8 w-auto text-sm"
            />
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center text-muted-foreground">Carregando dados...</div>
        ) : (
          <>
            {/* ── KPIs ── */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <KpiCard
                icon={Package}
                label="Total de Entregas"
                value={String(stats.total)}
                sub={`${stats.entregues} entregues${stats.canceladas > 0 ? ` · ${stats.canceladas} cancelada${stats.canceladas !== 1 ? "s" : ""}` : ""}`}
                delta={pctChange(stats.total, prevStats.total)}
              />
              <KpiCard
                icon={DollarSign}
                label="Valor Total"
                value={brl.format(stats.valorTotal)}
                sub={`Ticket médio: ${brl.format(stats.ticketMedio)}`}
                delta={pctChange(stats.valorTotal, prevStats.valorTotal)}
              />
              <KpiCard
                icon={Route}
                label="Quilometragem Total"
                value={stats.kmTotal > 0 ? `${stats.kmTotal.toFixed(1)} km` : "—"}
                sub="Rodado no período"
                delta={pctChange(stats.kmTotal, prevStats.kmTotal)}
              />
              <KpiCard
                icon={XCircle}
                label="Taxa de Recusa"
                value={`${stats.taxaRecusa.toFixed(1)}%`}
                sub={`${stats.recusadas} recusada${stats.recusadas !== 1 ? "s" : ""}`}
                delta={pctChange(stats.taxaRecusa, prevStats.taxaRecusa)}
              />
              <KpiCard
                icon={Sun}
                label="Manhã / Tarde"
                value={`${stats.manha} / ${stats.tarde}`}
                sub={<span className="flex items-center gap-2"><Sun className="h-3 w-3 text-amber-500" /> Manhã <Sunset className="h-3 w-3 text-blue-500" /> Tarde</span>}
                delta={pctChange(stats.manha + stats.tarde, prevStats.manha + prevStats.tarde)}
              />
              <KpiCard
                icon={Clock}
                label="Tempo Médio"
                value={formatTempo(stats.tempoMedio)}
                sub="Criação até entrega"
                delta={pctChange(stats.tempoMedio, prevStats.tempoMedio)}
              />
            </div>

            {/* ── Entregadores: Desempenho e Eficiência ── */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Entregadores — Desempenho e Eficiência</h2>

              <div className="grid gap-4 sm:grid-cols-2">
                <BarListCard
                  icon={DollarSign}
                  title="Valor por Entregador"
                  items={[...stats.drivers].sort((a, b) => b.valor - a.valor).map((d) => ({ name: d.name, value: d.valor }))}
                  format={(v) => brl.format(v)}
                />
                <StackedBarCard
                  icon={Truck}
                  title="Volume por Entregador e Turno"
                  items={stats.drivers.map((d) => ({ name: d.name, manha: d.manha, tarde: d.tarde }))}
                />
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Truck className="h-4 w-4" />
                    Desempenho por Entregador
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {stats.drivers.length === 0 ? (
                    <p className="py-4 text-center text-sm text-muted-foreground">Nenhum dado no período.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b text-left text-muted-foreground">
                            <th className="pb-2 font-medium">Entregador</th>
                            <th className="pb-2 font-medium text-center">Entregas</th>
                            <th className="pb-2 font-medium text-center">Manhã</th>
                            <th className="pb-2 font-medium text-center">Tarde</th>
                            <th className="pb-2 font-medium text-right">Valor Entregue</th>
                            <th className="pb-2 font-medium text-right">Km Rodado</th>
                            <th className="pb-2 font-medium text-right">Km/Entrega</th>
                          </tr>
                        </thead>
                        <tbody>
                          {stats.drivers.map((d) => (
                            <tr key={d.id} className="border-b last:border-0">
                              <td className="py-2.5 font-medium">{d.name}</td>
                              <td className="py-2.5 text-center">{d.count}</td>
                              <td className="py-2.5 text-center">{d.manha}</td>
                              <td className="py-2.5 text-center">{d.tarde}</td>
                              <td className="py-2.5 text-right">{brl.format(d.valor)}</td>
                              <td className="py-2.5 text-right">{d.km > 0 ? `${d.km.toFixed(1)} km` : "—"}</td>
                              <td className="py-2.5 text-right">{d.km > 0 && d.count > 0 ? `${(d.km / d.count).toFixed(1)} km` : "—"}</td>
                            </tr>
                          ))}
                          <tr className="font-semibold">
                            <td className="pt-2">Total</td>
                            <td className="pt-2 text-center">{stats.total}</td>
                            <td className="pt-2 text-center">{stats.manha}</td>
                            <td className="pt-2 text-center">{stats.tarde}</td>
                            <td className="pt-2 text-right">{brl.format(stats.valorTotal)}</td>
                            <td className="pt-2 text-right">{stats.kmTotal > 0 ? `${stats.kmTotal.toFixed(1)} km` : "—"}</td>
                            <td className="pt-2 text-right">{stats.kmTotal > 0 && stats.total > 0 ? `${(stats.kmTotal / stats.total).toFixed(1)} km` : "—"}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* ── Geografia e Demanda ── */}
            {printMode !== "resumo" && (
              <div className="space-y-4 print-break">
                <h2 className="text-lg font-semibold">Localização e Clientes — Geografia e Demanda</h2>

                <Card className="no-print">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <MapPin className="h-4 w-4" />
                      Mapa de Calor das Entregas
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {stats.heatPoints.length === 0 ? (
                      <p className="py-4 text-center text-sm text-muted-foreground">Nenhum endereço geocodificado no período.</p>
                    ) : (
                      <HeatmapCard points={stats.heatPoints} />
                    )}
                  </CardContent>
                </Card>

                <div className="grid gap-4 sm:grid-cols-2">
                  <RankingCard icon={MapPin} title="Top Bairros" items={stats.topBairros} />
                  <ClientesTable items={stats.topClientes} />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </AppShell>
  );
}

function KpiCard({ icon: Icon, label, value, sub, delta }: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  sub: React.ReactNode;
  delta?: number | null;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{sub}</p>
        {delta !== undefined && <DeltaLabel value={delta} />}
      </CardContent>
    </Card>
  );
}

function DeltaLabel({ value }: { value: number | null }) {
  if (value === null) {
    return <p className="text-xs italic text-muted-foreground mt-3">sem dado no período anterior</p>;
  }
  const Icon = value >= 0 ? TrendingUp : TrendingDown;
  return (
    <p className="flex items-center gap-1 text-xs italic text-emerald-600 mt-3">
      <Icon className="h-3 w-3" />
      {value >= 0 ? "+" : ""}{value.toFixed(1)}% vs. período anterior
    </p>
  );
}

function BarListCard({ icon: Icon, title, items, format: fmt }: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  items: { name: string; value: number }[];
  format: (v: number) => string;
}) {
  const max = items[0]?.value ?? 1;
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Icon className="h-4 w-4" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="py-4 text-center text-sm text-muted-foreground">Sem dados no período.</p>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.name} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="truncate">{item.name}</span>
                  <span className="shrink-0 font-medium ml-2">{fmt(item.value)}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${max > 0 ? (item.value / max) * 100 : 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function StackedBarCard({ icon: Icon, title, items }: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  items: { name: string; manha: number; tarde: number }[];
}) {
  const max = Math.max(1, ...items.map((i) => i.manha + i.tarde));
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Icon className="h-4 w-4" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="py-4 text-center text-sm text-muted-foreground">Sem dados no período.</p>
        ) : (
          <div className="space-y-3">
            {items.map((item) => {
              const total = item.manha + item.tarde;
              return (
                <div key={item.name} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="truncate">{item.name}</span>
                    <span className="shrink-0 font-medium ml-2">{total}</span>
                  </div>
                  <div className="flex h-2 w-full overflow-hidden rounded-full bg-muted" style={{ width: `${max > 0 ? (total / max) * 100 : 0}%` }}>
                    <div className="h-full bg-amber-500" style={{ width: total > 0 ? `${(item.manha / total) * 100}%` : "0%" }} />
                    <div className="h-full bg-blue-500" style={{ width: total > 0 ? `${(item.tarde / total) * 100}%` : "0%" }} />
                  </div>
                </div>
              );
            })}
            <div className="flex items-center gap-4 pt-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-500" /> Manhã</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-blue-500" /> Tarde</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ClientesTable({ items }: { items: { name: string; count: number; valor: number }[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Users className="h-4 w-4" />
          Top Clientes (Volume e Valor)
        </CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="py-4 text-center text-sm text-muted-foreground">Sem dados no período.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="pb-2 font-medium">Cliente</th>
                  <th className="pb-2 font-medium text-center">Qtd Entregas</th>
                  <th className="pb-2 font-medium text-right">Valor Total</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.name} className="border-b last:border-0">
                    <td className="py-2.5 font-medium truncate max-w-[200px]">{item.name}</td>
                    <td className="py-2.5 text-center">{item.count}</td>
                    <td className="py-2.5 text-right">{brl.format(item.valor)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function RankingCard({ icon: Icon, title, items }: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  items: { name: string; count: number }[];
}) {
  const max = items[0]?.count ?? 1;
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Icon className="h-4 w-4" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="py-4 text-center text-sm text-muted-foreground">Sem dados no período.</p>
        ) : (
          <div className="space-y-3">
            {items.map((item, i) => (
              <div key={item.name} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="truncate">
                    <span className="text-muted-foreground mr-2">{i + 1}.</span>
                    {item.name}
                  </span>
                  <span className="shrink-0 font-medium ml-2">{item.count}</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${(item.count / max) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
