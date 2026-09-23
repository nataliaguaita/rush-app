import { compareRouteOrder } from "../route-order";

test("ordena por route_order, empate pela data de cadastro e sem ordem no fim", () => {
  const e = (id: string, route_order: number | null, created_at: string) => ({ id, route_order, created_at });
  const lista = [
    e("sem-ordem", null, "2026-09-22T10:00:00Z"),
    e("2-nova", 2, "2026-09-23T12:00:00Z"),
    e("1", 1, "2026-09-22T19:00:00Z"),
    e("2-antiga", 2, "2026-09-22T19:45:00Z"),
  ];
  expect(lista.sort(compareRouteOrder).map((x) => x.id)).toEqual(["1", "2-antiga", "2-nova", "sem-ordem"]);
});
