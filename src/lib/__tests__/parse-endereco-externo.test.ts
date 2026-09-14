import { tratarEnderecoExterno } from "../parse-endereco-externo";

describe("tratarEnderecoExterno", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("splits rua/numero/complemento and fills bairro/cidade from CEP", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      json: async () => ({ bairro: "Centro", localidade: "Curitiba" }),
    });

    const result = await tratarEnderecoExterno("Rua Marechal, 123 - Apto 4", "80230-130");

    expect(result).toEqual({
      rua: "Rua Marechal",
      numero: "123",
      complemento: "Apto 4",
      bairro: "Centro",
      cidade: "Curitiba",
      cep: "80230130",
      precisaRevisao: false,
    });
  });

  it("flags precisaRevisao when no numero is found in the text", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      json: async () => ({ bairro: "Centro", localidade: "Curitiba" }),
    });

    const result = await tratarEnderecoExterno("Rua sem numero nenhum", "80230130");

    expect(result.numero).toBe("S/N");
    expect(result.precisaRevisao).toBe(true);
  });

  it("flags precisaRevisao and skips lookup when CEP is not 8 digits", async () => {
    const result = await tratarEnderecoExterno("Rua Tal, 123", "123");

    expect(global.fetch).not.toHaveBeenCalled();
    expect(result.cidade).toBeNull();
    expect(result.precisaRevisao).toBe(true);
  });

  it("flags precisaRevisao when ViaCEP returns erro", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      json: async () => ({ erro: true }),
    });

    const result = await tratarEnderecoExterno("Rua Tal, 123", "00000000");

    expect(result.cidade).toBeNull();
    expect(result.precisaRevisao).toBe(true);
  });
});
