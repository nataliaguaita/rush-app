import { entregueNoPrazo, intervaloMedianoEntreEntregas } from "../metricas";

// Horário local, para o teste não depender do fuso da máquina.
const at = (dia: number, h: number, m = 0) => new Date(2026, 8, dia, h, m).toISOString();

test("no prazo exige dia agendado e, na manhã, antes das 12h", () => {
  const base = { entregador_id: "a", scheduled_date: "2026-09-23" };
  expect(entregueNoPrazo({ ...base, scheduled_period: "manha", delivered_at: at(23, 11, 50) })).toBe(true);
  expect(entregueNoPrazo({ ...base, scheduled_period: "manha", delivered_at: at(23, 12, 10) })).toBe(false);
  expect(entregueNoPrazo({ ...base, scheduled_period: "tarde", delivered_at: at(23, 18) })).toBe(true);
  expect(entregueNoPrazo({ ...base, scheduled_period: "tarde", delivered_at: at(24, 9) })).toBe(false);
});

test("intervalo ignora a 1ª entrega da rota e a troca de turno, e usa a mediana", () => {
  const e = (entregador_id: string, scheduled_period: "manha" | "tarde", h: number, m: number) => ({
    entregador_id, scheduled_period, scheduled_date: "2026-09-23", delivered_at: at(23, h, m),
  });
  const entregues = [
    e("a", "manha", 9, 0), e("a", "manha", 9, 10), e("a", "manha", 9, 30), e("a", "manha", 11, 30), // 10, 20, 120
    e("a", "tarde", 14, 0), e("a", "tarde", 14, 15), // 15 (não conta 11:30 → 14:00)
    e("b", "manha", 9, 5), // rota com uma entrega só: nenhum intervalo
  ];
  expect(intervaloMedianoEntreEntregas(entregues)).toBe(17.5); // mediana de [10, 15, 20, 120]
  expect(intervaloMedianoEntreEntregas([e("b", "manha", 9, 5)])).toBeNull();
});
