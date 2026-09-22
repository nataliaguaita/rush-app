import { createClient } from "@/lib/supabase/client";
import { cancelEntrega } from "../actions";

jest.mock("@/lib/supabase/client", () => ({ createClient: jest.fn() }));
jest.mock("@/lib/geocode", () => ({ geocode: jest.fn() }));

test("cancelar grava motivo e quem cancelou", async () => {
  const builder = {
    select: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({ data: { status: "aguardando_atribuicao" } }),
    then: (r: (v: unknown) => void) => r({ error: null }),
  };
  (createClient as jest.Mock).mockReturnValue({
    auth: { getUser: jest.fn().mockResolvedValue({ data: { user: { id: "admin-1" } } }) },
    from: jest.fn(() => builder),
  });
  await cancelEntrega("e1", "pedido duplicado");
  expect(builder.update).toHaveBeenCalledWith({
    status: "cancelada",
    cancel_reason: "pedido duplicado",
    cancelado_por: "admin-1",
  });
});
