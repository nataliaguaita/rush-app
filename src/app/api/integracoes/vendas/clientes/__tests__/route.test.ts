/**
 * @jest-environment node
 */
import { POST } from "../route";
import { createClient } from "@supabase/supabase-js";
import { tratarEnderecoExterno } from "@/lib/parse-endereco-externo";
import { geocode } from "@/lib/geocode";
import type { EnderecoTratado } from "@/lib/parse-endereco-externo";

jest.mock("@supabase/supabase-js", () => ({ createClient: jest.fn() }));
jest.mock("@/lib/parse-endereco-externo", () => ({ tratarEnderecoExterno: jest.fn() }));
jest.mock("@/lib/geocode", () => ({ geocode: jest.fn() }));

interface Operation {
  table: string;
  op: "insert" | "update" | "delete";
  payload?: unknown;
}

function createSupabaseMock(responseQueues: Record<string, unknown[]>) {
  const operations: Operation[] = [];

  function chainable(table: string, result: unknown) {
    const obj: Record<string, unknown> = {
      select: () => obj,
      eq: () => obj,
      order: () => obj,
      insert: (payload: unknown) => {
        operations.push({ table, op: "insert", payload });
        return obj;
      },
      update: (payload: unknown) => {
        operations.push({ table, op: "update", payload });
        return obj;
      },
      delete: () => {
        operations.push({ table, op: "delete" });
        return obj;
      },
      maybeSingle: () => Promise.resolve(result),
      single: () => Promise.resolve(result),
      then: (resolve: (v: unknown) => void) => Promise.resolve(result).then(resolve),
    };
    return obj;
  }

  const from = jest.fn((table: string) => {
    const queue = responseQueues[table];
    const result = queue && queue.length ? queue.shift() : { data: null, error: null };
    return chainable(table, result);
  });

  return { client: { from }, operations };
}

function req(body: unknown) {
  return { json: async () => body } as unknown as Request;
}

function enderecoTratado(overrides: Partial<EnderecoTratado>): EnderecoTratado {
  return {
    rua: "Rua das Flores",
    numero: "100",
    complemento: null,
    bairro: "Centro",
    cidade: "Curitiba",
    cep: "80010000",
    precisaRevisao: false,
    ...overrides,
  };
}

describe("POST /api/integracoes/vendas/clientes", () => {
  beforeEach(() => {
    process.env.VENDAS_SYNC_TOKEN = "test-token";
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.test";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "service-role-key";
    jest.clearAllMocks();
  });

  it("não cadastra cliente novo com endereço fora da região atendida", async () => {
    (tratarEnderecoExterno as jest.Mock).mockResolvedValue(enderecoTratado({ cidade: "Londrina" }));
    const { client, operations } = createSupabaseMock({
      clientes_excluidos_integracao: [{ data: [] }],
      clientes: [{ data: null }], // select existente -> não existe
    });
    (createClient as jest.Mock).mockReturnValue(client);

    const res = await POST(
      req({
        token: "test-token",
        clientes: [{ codigo: "C1", nome: "Fulano", endereco: "Rua das Flores, 100", cep: "86010-000" }],
      })
    );
    const json = await res.json();

    expect(json.processados).toBe(0);
    expect(json.revisao_necessaria).toContain("C1");
    expect(operations.some((o) => o.table === "clientes" && o.op === "insert")).toBe(false);
    expect(geocode).not.toHaveBeenCalled();
  });

  it("cadastra cliente novo ativo com endereço dentro da região", async () => {
    (tratarEnderecoExterno as jest.Mock).mockResolvedValue(enderecoTratado({ cidade: "Curitiba" }));
    (geocode as jest.Mock).mockResolvedValue({ lat: -25.43, lng: -49.27 });
    const { client, operations } = createSupabaseMock({
      clientes_excluidos_integracao: [{ data: [] }],
      clientes: [{ data: null }, { data: { id: "novo-id" }, error: null }],
      enderecos: [{ data: null }], // ainda não tem endereço geocodificado
    });
    (createClient as jest.Mock).mockReturnValue(client);

    const res = await POST(
      req({
        token: "test-token",
        clientes: [{ codigo: "C2", nome: "Ciclana", endereco: "Rua das Flores, 100", cep: "80010-000" }],
      })
    );
    const json = await res.json();

    expect(json.processados).toBe(1);
    expect(json.revisao_necessaria).not.toContain("C2");
    const insertCliente = operations.find((o) => o.table === "clientes" && o.op === "insert");
    expect((insertCliente?.payload as { active: boolean }).active).toBe(true);
    expect(operations.some((o) => o.table === "enderecos" && o.op === "insert")).toBe(true);
  });

  it("cliente já existente fora da região não é descartado nem tem active alterado", async () => {
    (tratarEnderecoExterno as jest.Mock).mockResolvedValue(enderecoTratado({ cidade: "Londrina" }));
    const { client, operations } = createSupabaseMock({
      clientes_excluidos_integracao: [{ data: [] }],
      clientes: [{ data: { id: "existing-id" } }, { error: null }], // select existente -> existe; update -> ok
      enderecos: [{ data: { lat: -23.3 } }], // já geocodificado antes, não mexe de novo
    });
    (createClient as jest.Mock).mockReturnValue(client);

    const res = await POST(
      req({
        token: "test-token",
        clientes: [{ codigo: "C3", nome: "Beltrano", endereco: "Rua das Flores, 100", cep: "86010-000" }],
      })
    );
    const json = await res.json();

    expect(json.processados).toBe(1);
    const updateCliente = operations.find((o) => o.table === "clientes" && o.op === "update");
    expect(updateCliente).toBeDefined();
    expect((updateCliente?.payload as Record<string, unknown>).active).toBeUndefined();
    expect(geocode).not.toHaveBeenCalled();
  });

  it("rejeita com token inválido", async () => {
    const res = await POST(req({ token: "errado", clientes: [] }));
    expect(res.status).toBe(401);
  });
});
