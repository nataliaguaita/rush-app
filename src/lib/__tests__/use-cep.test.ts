import { renderHook, act, waitFor } from "@testing-library/react";
import { useCep } from "../use-cep";

describe("useCep", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.resetAllMocks();
  });

  it("does nothing for an incomplete CEP", async () => {
    const onResult = jest.fn();
    const { result } = renderHook(() => useCep(onResult));

    await act(async () => {
      await result.current.fetchCep("1234");
    });

    expect(global.fetch).not.toHaveBeenCalled();
    expect(onResult).not.toHaveBeenCalled();
    expect(result.current.loading).toBe(false);
  });

  it("strips non-digit formatting before calling the API", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      json: async () => ({
        logradouro: "Rua A",
        bairro: "Centro",
        localidade: "Curitiba",
      }),
    });
    const onResult = jest.fn();
    const { result } = renderHook(() => useCep(onResult));

    await act(async () => {
      await result.current.fetchCep("80230-130");
    });

    expect(global.fetch).toHaveBeenCalledWith(
      "https://viacep.com.br/ws/80230130/json/"
    );
    expect(onResult).toHaveBeenCalledWith({
      rua: "Rua A",
      bairro: "Centro",
      cidade: "Curitiba",
    });
  });

  it("defaults missing fields to empty strings", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      json: async () => ({}),
    });
    const onResult = jest.fn();
    const { result } = renderHook(() => useCep(onResult));

    await act(async () => {
      await result.current.fetchCep("80230130");
    });

    expect(onResult).toHaveBeenCalledWith({ rua: "", bairro: "", cidade: "" });
  });

  it("does not call onResult when the CEP is not found (erro: true)", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      json: async () => ({ erro: true }),
    });
    const onResult = jest.fn();
    const { result } = renderHook(() => useCep(onResult));

    await act(async () => {
      await result.current.fetchCep("00000000");
    });

    expect(onResult).not.toHaveBeenCalled();
    expect(result.current.filled).toBe(false);
  });

  it("swallows network errors without calling onResult", async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error("network down"));
    const onResult = jest.fn();
    const { result } = renderHook(() => useCep(onResult));

    await act(async () => {
      await result.current.fetchCep("80230130");
    });

    expect(onResult).not.toHaveBeenCalled();
    expect(result.current.loading).toBe(false);
  });

  it("sets loading true while the request is in flight", async () => {
    let resolveFetch!: (value: unknown) => void;
    (global.fetch as jest.Mock).mockReturnValue(
      new Promise((resolve) => {
        resolveFetch = resolve;
      })
    );
    const onResult = jest.fn();
    const { result } = renderHook(() => useCep(onResult));

    let fetchPromise!: Promise<void>;
    act(() => {
      fetchPromise = result.current.fetchCep("80230130");
    });

    await waitFor(() => expect(result.current.loading).toBe(true));

    await act(async () => {
      resolveFetch({
        json: async () => ({
          logradouro: "Rua A",
          bairro: "Centro",
          localidade: "Curitiba",
        }),
      });
      await fetchPromise;
    });

    expect(result.current.loading).toBe(false);
  });

  it("marks filled true on success then reverts after 2s", async () => {
    jest.useFakeTimers({ doNotFake: ["queueMicrotask"] });
    (global.fetch as jest.Mock).mockResolvedValue({
      json: async () => ({
        logradouro: "Rua A",
        bairro: "Centro",
        localidade: "Curitiba",
      }),
    });
    const onResult = jest.fn();
    const { result } = renderHook(() => useCep(onResult));

    await act(async () => {
      await result.current.fetchCep("80230130");
    });

    expect(result.current.filled).toBe(true);

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(result.current.filled).toBe(false);
  });
});
