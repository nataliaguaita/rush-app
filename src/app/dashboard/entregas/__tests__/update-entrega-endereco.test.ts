import { createClient } from "@/lib/supabase/client";
import { updateEntrega } from "../actions";

jest.mock("@/lib/supabase/client", () => ({ createClient: jest.fn() }));
jest.mock("@/lib/geocode", () => ({ geocode: jest.fn().mockResolvedValue({ lat: 1, lng: 2 }) }));

function mockSupabase() {
  const entregas = {
    select: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    eq: jest.fn(function (this: unknown) { return this; }),
    single: jest.fn().mockResolvedValue({ data: { status: "aguardando_atribuicao", cliente_id: "c1" } }),
    then: (r: (v: unknown) => void) => r({ error: null }),
  };
  const enderecos = {
    insert: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({ data: { id: "novo-end" }, error: null }),
  };
  (createClient as jest.Mock).mockReturnValue({
    from: jest.fn((t: string) => (t === "enderecos" ? enderecos : entregas)),
  });
  return { entregas, enderecos };
}

test("troca para outro endereço cadastrado do cliente", async () => {
  const { entregas, enderecos } = mockSupabase();
  const fd = new FormData();
  fd.set("endereco_id", "end-2");
  await updateEntrega("e1", fd);
  expect(enderecos.insert).not.toHaveBeenCalled();
  expect(entregas.update).toHaveBeenCalledWith(expect.objectContaining({ endereco_id: "end-2" }));
});

test("endereço novo salvo no cliente vira o endereço da entrega", async () => {
  const { entregas, enderecos } = mockSupabase();
  const fd = new FormData();
  fd.set("custom_address", "true");
  fd.set("custom_rua", "rua nova");
  fd.set("custom_numero", "10");
  fd.set("custom_cidade", "curitiba");
  fd.set("save_to_cliente", "on");
  await updateEntrega("e1", fd);
  expect(enderecos.insert).toHaveBeenCalledWith(expect.objectContaining({ cliente_id: "c1", rua: "Rua Nova", lat: 1 }));
  expect(entregas.update).toHaveBeenCalledWith(expect.objectContaining({ endereco_id: "novo-end" }));
});

test("vincula a um grupo só quando group_id vem no form", async () => {
  const { entregas } = mockSupabase();
  const fd = new FormData();
  fd.set("endereco_id", "end-grupo");
  fd.set("group_id", "g1");
  await updateEntrega("e1", fd);
  expect(entregas.update).toHaveBeenCalledWith(expect.objectContaining({ group_id: "g1", endereco_id: "end-grupo" }));

  fd.delete("group_id");
  await updateEntrega("e1", fd);
  expect(entregas.update.mock.calls[1][0]).not.toHaveProperty("group_id");
});
