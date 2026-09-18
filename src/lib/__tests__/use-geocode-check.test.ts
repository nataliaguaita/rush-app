import { renderHook, act } from "@testing-library/react";
import { useGeocodeCheck } from "../use-geocode-check";
import { geocode } from "../geocode";

jest.mock("../geocode", () => ({ geocode: jest.fn() }));

describe("useGeocodeCheck", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("stays idle when rua or cidade is empty", async () => {
    const { result } = renderHook(() => useGeocodeCheck());

    await act(async () => {
      await result.current.check("", "10", "Curitiba");
    });

    expect(geocode).not.toHaveBeenCalled();
    expect(result.current.status).toBe("idle");
  });

  it("marks ok when geocode finds coordinates", async () => {
    (geocode as jest.Mock).mockResolvedValue({ lat: -25.4, lng: -49.2 });
    const { result } = renderHook(() => useGeocodeCheck());

    await act(async () => {
      await result.current.check("Rua A", "10", "Curitiba");
    });

    expect(result.current.status).toBe("ok");
  });

  it("marks failed when geocode returns null", async () => {
    (geocode as jest.Mock).mockResolvedValue(null);
    const { result } = renderHook(() => useGeocodeCheck());

    await act(async () => {
      await result.current.check("Rua Inexistente", "10", "Curitiba");
    });

    expect(result.current.status).toBe("failed");
  });

  it("ignores a stale response after a newer check started", async () => {
    let resolveFirst!: (v: { lat: number; lng: number } | null) => void;
    (geocode as jest.Mock)
      .mockReturnValueOnce(new Promise((resolve) => { resolveFirst = resolve; }))
      .mockResolvedValueOnce(null);
    const { result } = renderHook(() => useGeocodeCheck());

    let firstCheck!: Promise<void>;
    act(() => {
      firstCheck = result.current.check("Rua A", "10", "Curitiba");
    });
    await act(async () => {
      await result.current.check("Rua B", "20", "Curitiba");
    });

    expect(result.current.status).toBe("failed"); // resultado da segunda checagem

    await act(async () => {
      resolveFirst({ lat: -25.4, lng: -49.2 }); // resposta atrasada da primeira
      await firstCheck;
    });

    expect(result.current.status).toBe("failed"); // não foi sobrescrito pela resposta antiga
  });

  it("reset clears the status", async () => {
    (geocode as jest.Mock).mockResolvedValue(null);
    const { result } = renderHook(() => useGeocodeCheck());

    await act(async () => {
      await result.current.check("Rua A", "10", "Curitiba");
    });
    expect(result.current.status).toBe("failed");

    act(() => result.current.reset());
    expect(result.current.status).toBe("idle");
  });

  it("markResult sets ok/failed directly without calling geocode", () => {
    const { result } = renderHook(() => useGeocodeCheck());

    act(() => result.current.markResult(true));
    expect(result.current.status).toBe("ok");
    expect(geocode).not.toHaveBeenCalled();

    act(() => result.current.markResult(false));
    expect(result.current.status).toBe("failed");
  });
});
