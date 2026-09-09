import { renderHook, waitFor } from "@testing-library/react";
import { createClient } from "@/lib/supabase/client";
import { useStaleEntregas, type StaleEntrega } from "../use-stale-entregas";

jest.mock("@/lib/supabase/client", () => ({
  createClient: jest.fn(),
}));

const mockedCreateClient = createClient as jest.Mock;

function makeSupabaseMock() {
  const order = jest.fn();
  const builder = {
    select: jest.fn().mockReturnThis(),
    in: jest.fn().mockReturnThis(),
    or: jest.fn().mockReturnThis(),
    lt: jest.fn().mockReturnThis(),
    order,
  };
  const from = jest.fn(() => builder);

  let realtimeCallback: (() => void) | undefined;
  const channel: { on: jest.Mock; subscribe: jest.Mock } = {
    on: jest.fn((_event: string, _filter: unknown, cb: () => void) => {
      realtimeCallback = cb;
      return channel;
    }),
    subscribe: jest.fn().mockReturnThis(),
  };
  const channelFn = jest.fn(() => channel);
  const removeChannel = jest.fn();

  const supabase = { from, channel: channelFn, removeChannel };

  return {
    supabase,
    order,
    from,
    channelFn,
    removeChannel,
    triggerRealtimeEvent: () => realtimeCallback?.(),
  };
}

const sampleEntrega: StaleEntrega = {
  id: "1",
  order_number: 42,
  status: "em_rota",
  created_at: "2026-09-01T00:00:00.000Z",
  cliente: { name: "Cliente Teste" },
};

describe("useStaleEntregas", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("starts with an empty list before the query resolves", () => {
    const { supabase, order } = makeSupabaseMock();
    order.mockReturnValue(new Promise(() => {})); // never resolves
    mockedCreateClient.mockReturnValue(supabase);

    const { result } = renderHook(() => useStaleEntregas());

    expect(result.current).toEqual([]);
  });

  it("loads stale entregas on mount", async () => {
    const { supabase, order } = makeSupabaseMock();
    order.mockResolvedValue({ data: [sampleEntrega] });
    mockedCreateClient.mockReturnValue(supabase);

    const { result } = renderHook(() => useStaleEntregas());

    await waitFor(() => expect(result.current).toEqual([sampleEntrega]));
  });

  it("queries only stale statuses older than the threshold", async () => {
    const { supabase, order, from } = makeSupabaseMock();
    order.mockResolvedValue({ data: [] });
    mockedCreateClient.mockReturnValue(supabase);
    const builder = from.mock.results[0];

    renderHook(() => useStaleEntregas());

    await waitFor(() => expect(order).toHaveBeenCalled());
    expect(from).toHaveBeenCalledWith("entregas");
    void builder;
  });

  it("defaults to an empty array when the query returns no data", async () => {
    const { supabase, order } = makeSupabaseMock();
    order.mockResolvedValue({ data: null });
    mockedCreateClient.mockReturnValue(supabase);

    const { result } = renderHook(() => useStaleEntregas());

    await waitFor(() => expect(order).toHaveBeenCalled());
    expect(result.current).toEqual([]);
  });

  it("reloads when a realtime postgres_changes event fires", async () => {
    const { supabase, order, triggerRealtimeEvent } = makeSupabaseMock();
    order
      .mockResolvedValueOnce({ data: [] })
      .mockResolvedValueOnce({ data: [sampleEntrega] });
    mockedCreateClient.mockReturnValue(supabase);

    const { result } = renderHook(() => useStaleEntregas());

    await waitFor(() => expect(result.current).toEqual([]));

    triggerRealtimeEvent();

    await waitFor(() => expect(result.current).toEqual([sampleEntrega]));
    expect(order).toHaveBeenCalledTimes(2);
  });

  it("unsubscribes from the realtime channel on unmount", () => {
    const { supabase, order, channelFn, removeChannel } = makeSupabaseMock();
    order.mockResolvedValue({ data: [] });
    mockedCreateClient.mockReturnValue(supabase);

    const { unmount } = renderHook(() => useStaleEntregas());
    unmount();

    expect(removeChannel).toHaveBeenCalledWith(channelFn.mock.results[0].value);
  });

  it("ignores a query response that resolves after unmount", async () => {
    const { supabase, order } = makeSupabaseMock();
    let resolveOrder!: (value: { data: StaleEntrega[] }) => void;
    order.mockReturnValue(
      new Promise((resolve) => {
        resolveOrder = resolve;
      })
    );
    mockedCreateClient.mockReturnValue(supabase);

    const { result, unmount } = renderHook(() => useStaleEntregas());
    unmount();
    resolveOrder({ data: [sampleEntrega] });

    // flush microtasks
    await Promise.resolve();
    await Promise.resolve();

    expect(result.current).toEqual([]);
  });

  it("does not crash the app when the query rejects", async () => {
    const { supabase, order } = makeSupabaseMock();
    order.mockRejectedValue(new Error("network down"));
    mockedCreateClient.mockReturnValue(supabase);

    const { result } = renderHook(() => useStaleEntregas());

    await waitFor(() => expect(order).toHaveBeenCalled());
    // flush the rejection
    await new Promise((r) => setTimeout(r, 0));

    expect(result.current).toEqual([]);
  });
});
