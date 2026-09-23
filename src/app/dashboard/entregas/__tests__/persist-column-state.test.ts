import { createClient } from "@/lib/supabase/client";
import { persistColumnState } from "../actions";

jest.mock("@/lib/supabase/client", () => ({ createClient: jest.fn() }));
jest.mock("@/lib/geocode", () => ({ geocode: jest.fn() }));

test("reordenar numera depois das entregas já em rota ou entregues", async () => {
  const builder = {
    select: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    in: jest.fn().mockReturnThis(),
    not: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({ data: { scheduled_date: "2026-09-23" } }),
    limit: jest.fn().mockResolvedValue({ data: [{ route_order: 2 }] }),
    then: (r: (v: unknown) => void) => r({ error: null }),
  };
  (createClient as jest.Mock).mockReturnValue({ from: jest.fn(() => builder) });

  await persistColumnState("carlos", ["a", "b"]);

  expect(builder.update).toHaveBeenCalledWith({ entregador_id: "carlos", route_order: 3 });
  expect(builder.update).toHaveBeenCalledWith({ entregador_id: "carlos", route_order: 4 });
});
