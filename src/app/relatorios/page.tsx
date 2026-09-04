"use client";

import { useEffect, useMemo, useState } from "react";
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
  XCircle,
  Sun,
  Sunset,
  Printer,
  FileText,
  MapPin,
  Users,
  Truck,
  Clock,
} from "lucide-react";
import {
  format,
  startOfMonth,
  endOfMonth,
  subMonths,
  differenceInMinutes,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Profile } from "@/types/database";

const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export default function RelatoriosPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [entregas, setEntregas] = useState<any[]>([]);
  const [rotas, setRotas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [printMode, setPrintMode] = useState<"resumo" | "completo" | null>(null);

  const now = new Date();
  const [startDate, setStartDate] = useState(() => format(startOfMonth(now), "yyyy-MM-dd"));
  const [endDate, setEndDate] = useState(() => format(endOfMonth(now), "yyyy-MM-dd"));

  const router = useRouter();
  const supabase = createClient();

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
      const [entregasRes, rotasRes] = await Promise.all([
        supabase
          .from("entregas")
          .select(`
            id, valor, status, scheduled_period, scheduled_date,
            delivered_at, created_at, entregador_id,
            cliente:clientes(name),
            endereco:enderecos(bairro),
            entregador:profiles!entregas_entregador_id_fkey(id, name)
          `)
          .gte("scheduled_date", startDate)
          .lte("scheduled_date", endDate),
        supabase
          .from("rotas_diarias")
          .select("*")
          .gte("data", startDate)
          .lte("data", endDate),
      ]);
      setEntregas(entregasRes.data ?? []);
      setRotas(rotasRes.data ?? []);
      setLoading(false);
    }
    load();
  }, [profile, startDate, endDate]);

  function selectMonth(offset: number) {
    const month = subMonths(now, offset);
    setStartDate(format(startOfMonth(month), "yyyy-MM-dd"));
    setEndDate(format(endOfMonth(month), "yyyy-MM-dd"));
  }

  function handlePrint(mode: "resumo" | "completo") {
    setPrintMode(mode);
    setTimeout(() => {
      window.print();
      setPrintMode(null);
    }, 100);
  }

  const stats = useMemo(() => {
    const entregues = entregas.filter((e) => e.status === "entregue");
    const recusadas = entregas.filter((e) => e.status === "recusada");
    const canceladas = entregas.filter((e) => e.status === "cancelada");
    const manha = entregas.filter((e) => e.scheduled_period === "manha");
    const tarde = entregas.filter((e) => e.scheduled_period === "tarde");

    const valorTotal = entregues.reduce((sum, e) => sum + (e.valor ?? 0), 0);
    const ticketMedio = entregues.length > 0 ? valorTotal / entregues.length : 0;
    const taxaRecusa = entregas.length > 0 ? (recusadas.length / entregas.length) * 100 : 0;

    const tempos = entregues
      .filter((e) => e.delivered_at && e.created_at)
      .map((e) => differenceInMinutes(new Date(e.delivered_at), new Date(e.created_at)));
    const tempoMedio = tempos.length > 0 ? tempos.reduce((a, b) => a + b, 0) / tempos.length : 0;

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
    const kmTotal = Array.from(kmByDriver.values()).reduce((a, b) => a + b, 0);

    const drivers = Array.from(driverMap.entries())
      .map(([id, d]) => ({ id, ...d, km: kmByDriver.get(id) ?? 0 }))
      .sort((a, b) => b.count - a.count);

    // Top clients
    const clientMap = new Map<string, number>();
    for (const e of entregas) {
      const name = e.cliente?.name ?? "Desconhecido";
      clientMap.set(name, (clientMap.get(name) ?? 0) + 1);
    }
    const topClientes = Array.from(clientMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
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

    return {
      total: entregas.length,
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
      drivers,
      topClientes,
      topBairros,
    };
  }, [entregas, rotas]);

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
          .no-print { display: none !important; }
          .print-break { page-break-before: always; }
          body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
        }
      `}</style>

      <div className="mx-auto max-w-6xl space-y-6">
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
          {Array.from({ length: 6 }, (_, i) => {
            const month = subMonths(now, i);
            const mStart = format(startOfMonth(month), "yyyy-MM-dd");
            const isActive = startDate === mStart;
            return (
              <Button
                key={i}
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => selectMonth(i)}
              >
                {format(month, "MMM yyyy", { locale: ptBR })}
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
            {/* KPI cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <KpiCard icon={Package} label="Total de Entregas" value={String(stats.total)} sub={`${stats.entregues} entregues${stats.canceladas > 0 ? ` · ${stats.canceladas} cancelada${stats.canceladas !== 1 ? "s" : ""}` : ""}`} />
              <KpiCard icon={DollarSign} label="Valor Total" value={brl.format(stats.valorTotal)} sub={`Ticket médio: ${brl.format(stats.ticketMedio)}`} />
              <KpiCard icon={XCircle} label="Taxa de Recusa" value={`${stats.taxaRecusa.toFixed(1)}%`} sub={`${stats.recusadas} recusada${stats.recusadas !== 1 ? "s" : ""}`} />
              <KpiCard icon={Sun} label="Manhã / Tarde" value={`${stats.manha} / ${stats.tarde}`} sub={<span className="flex items-center gap-2"><Sun className="h-3 w-3 text-amber-500" /> Manhã <Sunset className="h-3 w-3 text-blue-500" /> Tarde</span>} />
              <KpiCard icon={Clock} label="Tempo Médio" value={formatTempo(stats.tempoMedio)} sub="Criação até entrega" />
            </div>

            {/* Per-driver table */}
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
                          <th className="pb-2 font-medium text-right">Km</th>
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
                          </tr>
                        ))}
                        <tr className="font-semibold">
                          <td className="pt-2">Total</td>
                          <td className="pt-2 text-center">{stats.total}</td>
                          <td className="pt-2 text-center">{stats.manha}</td>
                          <td className="pt-2 text-center">{stats.tarde}</td>
                          <td className="pt-2 text-right">{brl.format(stats.valorTotal)}</td>
                          <td className="pt-2 text-right">{stats.kmTotal > 0 ? `${stats.kmTotal.toFixed(1)} km` : "—"}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Rankings */}
            {printMode !== "resumo" && (
              <div className="grid gap-4 sm:grid-cols-2 print-break">
                <RankingCard
                  icon={Users}
                  title="Top Clientes"
                  items={stats.topClientes}
                />
                <RankingCard
                  icon={MapPin}
                  title="Top Bairros"
                  items={stats.topBairros}
                />
              </div>
            )}
          </>
        )}
      </div>
    </AppShell>
  );
}

function KpiCard({ icon: Icon, label, value, sub }: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  sub: React.ReactNode;
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
