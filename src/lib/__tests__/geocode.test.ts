import { geocode } from "../geocode";

describe("geocode", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("returns parsed coordinates on a successful match", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      json: async () => [{ lat: "-25.4308", lon: "-49.2676" }],
    });

    const result = await geocode("R. Mal. Deodoro", "500", "Curitiba");

    expect(result).toEqual({ lat: -25.4308, lng: -49.2676 });
  });

  it("calls the Nominatim API with the expected query and headers", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      json: async () => [{ lat: "1", lon: "2" }],
    });

    await geocode("Rua A", "10", "Curitiba");

    expect(global.fetch).toHaveBeenCalledTimes(1);
    const [url, options] = (global.fetch as jest.Mock).mock.calls[0];
    expect(url).toContain("https://nominatim.openstreetmap.org/search?");
    expect(url).toContain(
      new URLSearchParams({
        q: "Rua A, 10, Curitiba, Brazil",
        format: "json",
        limit: "1",
      }).toString()
    );
    expect(options).toEqual({ headers: { "User-Agent": "RushApp/1.0" } });
  });

  it("falls back to a query without the house number when the full match fails", async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({ json: async () => [] })
      .mockResolvedValueOnce({ json: async () => [{ lat: "-25.37", lon: "-49.19" }] });

    const result = await geocode("Estrada da Ribeira", "4567", "Colombo");

    expect(result).toEqual({ lat: -25.37, lng: -49.19 });
    expect(global.fetch).toHaveBeenCalledTimes(2);
    const [urlComNumero] = (global.fetch as jest.Mock).mock.calls[0];
    const [urlSemNumero] = (global.fetch as jest.Mock).mock.calls[1];
    expect(urlComNumero).toContain(
      new URLSearchParams({ q: "Estrada da Ribeira, 4567, Colombo, Brazil" }).toString()
    );
    expect(urlSemNumero).toContain(
      new URLSearchParams({ q: "Estrada da Ribeira, Colombo, Brazil" }).toString()
    );
  });

  it("returns null when no results are found", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      json: async () => [],
    });

    const result = await geocode("Endereco Inexistente", "1", "Curitiba");

    expect(result).toBeNull();
  });

  it("returns null when fetch rejects (network error)", async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error("network down"));

    const result = await geocode("Rua A", "10", "Curitiba");

    expect(result).toBeNull();
  });

  it("returns null when the response body is not valid JSON", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      json: async () => {
        throw new Error("invalid json");
      },
    });

    const result = await geocode("Rua A", "10", "Curitiba");

    expect(result).toBeNull();
  });
});
