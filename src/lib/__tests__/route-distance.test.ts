import { calcRouteDistanceKm, ordemRealizada } from "../route-distance";

describe("calcRouteDistanceKm", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("returns 0 without calling the API when there are no waypoints", async () => {
    const result = await calcRouteDistanceKm([], "tarde");

    expect(result).toBe(0);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("returns the rounded distance in km on success", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      json: async () => ({
        code: "Ok",
        routes: [{ distance: 12345 }],
      }),
    });

    const result = await calcRouteDistanceKm(
      [{ lat: -25.5, lng: -49.3 }],
      "tarde"
    );

    expect(result).toBe(12.3);
  });

  it("builds a one-way route (no return leg) for the afternoon period", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      json: async () => ({ code: "Ok", routes: [{ distance: 1000 }] }),
    });

    await calcRouteDistanceKm([{ lat: -25.5, lng: -49.3 }], "tarde");

    const [url] = (global.fetch as jest.Mock).mock.calls[0];
    const coordsSegment = decodeURIComponent(url).split("driving/")[1].split("?")[0];
    expect(coordsSegment.split(";")).toHaveLength(2);
  });

  it("builds a round-trip route (return leg to origin) for the morning period", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      json: async () => ({ code: "Ok", routes: [{ distance: 1000 }] }),
    });

    await calcRouteDistanceKm([{ lat: -25.5, lng: -49.3 }], "manha");

    const [url] = (global.fetch as jest.Mock).mock.calls[0];
    const coordsSegment = decodeURIComponent(url).split("driving/")[1].split("?")[0];
    const points = coordsSegment.split(";");
    expect(points).toHaveLength(3);
    expect(points[0]).toBe(points[2]);
  });

  it("returns 0 when the API reports a non-Ok code", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      json: async () => ({ code: "NoRoute" }),
    });

    const result = await calcRouteDistanceKm(
      [{ lat: -25.5, lng: -49.3 }],
      "tarde"
    );

    expect(result).toBe(0);
  });

  it("returns 0 when the routes array is missing", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      json: async () => ({ code: "Ok", routes: [] }),
    });

    const result = await calcRouteDistanceKm(
      [{ lat: -25.5, lng: -49.3 }],
      "tarde"
    );

    expect(result).toBe(0);
  });

  it("propagates a network failure", async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error("network down"));

    await expect(
      calcRouteDistanceKm([{ lat: -25.5, lng: -49.3 }], "tarde")
    ).rejects.toThrow("network down");
  });
});

describe("ordemRealizada", () => {
  it("ordena pela hora da finalização, com updated_at quando não há delivered_at (recusa)", () => {
    const lista = [
      { id: "c", delivered_at: "2026-09-23T13:05:00Z", updated_at: "2026-09-23T13:05:00Z" },
      { id: "a", delivered_at: "2026-09-23T12:42:00Z", updated_at: "2026-09-23T12:42:00Z" },
      { id: "b", delivered_at: null, updated_at: "2026-09-23T12:55:00Z" },
    ];

    expect(ordemRealizada(lista).map((e) => e.id)).toEqual(["a", "b", "c"]);
  });
});
