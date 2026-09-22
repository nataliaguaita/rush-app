import { createClient } from "@/lib/supabase/client";
import { finalizarPeloPainel } from "../actions";

jest.mock("@/lib/supabase/client", () => ({ createClient: jest.fn() }));
jest.mock("@/lib/geocode", () => ({ geocode: jest.fn() }));

function mockSupabase(rows: { id: string }[]) {
  const builder = {
    update: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    in: jest.fn().mockReturnThis(),
    or: jest.fn().mockReturnThis(),
    select: jest.fn().mockResolvedValue({ data: rows, error: null }),
  };
  (createClient as jest.Mock).mockReturnValue({
    auth: { getUser: jest.fn().mockResolvedValue({ data: { user: { id: "admin-1" } } }) },
    from: jest.fn(() => builder),
  });
  return builder;
}

test("entregue grava status, recebedor e quem finalizou, só se ainda estiver em rota", async () => {
  const b = mockSupabase([{ id: "e1" }]);
  await finalizarPeloPainel("e1", {
    tipo: "entregue",
    receiver_name: " maria silva ",
    receiver_role: null,
    receiver_note: "",
    delivered_at: "2026-09-21T15:00:00.000Z",
  });
  expect(b.update).toHaveBeenCalledWith({
    status: "entregue",
    receiver_name: "Maria Silva",
    receiver_role: null,
    receiver_note: null,
    delivered_at: "2026-09-21T15:00:00.000Z",
    finalizado_por: "admin-1",
  });
  expect(b.in).toHaveBeenCalledWith("status", ["rota_definida", "em_rota"]);
  expect(b.eq).toHaveBeenCalledWith("id", "e1");
});

test("retorno só confirma entregas retornadas ainda não confirmadas", async () => {
  const b = mockSupabase([{ id: "e1" }]);
  await finalizarPeloPainel("e1", { tipo: "retorno" });
  expect(b.update).toHaveBeenCalledWith(expect.objectContaining({ return_confirmed: true, finalizado_por: "admin-1" }));
  expect(b.eq).toHaveBeenCalledWith("status", "retornada");
});

test("erro se o entregador já finalizou (nenhuma linha atualizada)", async () => {
  mockSupabase([]);
  await expect(finalizarPeloPainel("e1", { tipo: "recusada", motivo: "fechado" })).rejects.toThrow("já foi finalizada");
});
