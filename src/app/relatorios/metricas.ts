import { format } from "date-fns";
import type { DeliveryPeriod } from "@/types/database";

interface EntregaConcluida {
  entregador_id: string | null;
  scheduled_date: string | null;
  scheduled_period: DeliveryPeriod | null;
  delivered_at: string | null;
}

// Entregas do turno da manhã precisam ser concluídas antes desta hora.
const FIM_TURNO_MANHA = 12;

// Entregue no dia agendado e dentro do turno (manhã antes das 12h; tarde até o fim do dia).
export function entregueNoPrazo(e: EntregaConcluida): boolean {
  if (!e.delivered_at || !e.scheduled_date) return false;
  const entregue = new Date(e.delivered_at);
  if (format(entregue, "yyyy-MM-dd") !== e.scheduled_date) return false;
  return e.scheduled_period !== "manha" || entregue.getHours() < FIM_TURNO_MANHA;
}

// Mediana, em minutos, do intervalo entre finalizações consecutivas do mesmo
// entregador, no mesmo dia e turno. A primeira entrega de cada rota não entra
// (o início da rota não é confiável) e a mediana ignora paradas isoladas.
export function intervaloMedianoEntreEntregas(entregues: EntregaConcluida[]): number | null {
  const rotas = new Map<string, number[]>();
  for (const e of entregues) {
    if (!e.delivered_at || !e.entregador_id) continue;
    const key = `${e.entregador_id}|${e.scheduled_date}|${e.scheduled_period}`;
    const lista = rotas.get(key) ?? [];
    lista.push(new Date(e.delivered_at).getTime());
    rotas.set(key, lista);
  }

  const intervalos: number[] = [];
  for (const tempos of rotas.values()) {
    tempos.sort((a, b) => a - b);
    for (let i = 1; i < tempos.length; i++) intervalos.push((tempos[i] - tempos[i - 1]) / 60000);
  }
  if (intervalos.length === 0) return null;

  intervalos.sort((a, b) => a - b);
  const meio = Math.floor(intervalos.length / 2);
  return intervalos.length % 2 ? intervalos[meio] : (intervalos[meio - 1] + intervalos[meio]) / 2;
}
