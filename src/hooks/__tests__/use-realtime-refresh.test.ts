import { renderHook, act } from "@testing-library/react";
import { createClient } from "@/lib/supabase/client";
import { useRealtimeRefresh } from "../use-realtime-refresh";

jest.mock("@/lib/supabase/client", () => ({
  createClient: jest.fn(),
}));

describe("useRealtimeRefresh", () => {
  let onEvent: () => void;
  let onStatus: (status: string) => void;
  const removeChannel = jest.fn();

  beforeEach(() => {
    jest.useFakeTimers();
    removeChannel.mockClear();
    const channel: { on: jest.Mock; subscribe: jest.Mock } = {
      on: jest.fn((_e: string, _f: unknown, cb: () => void) => {
        onEvent = cb;
        return channel;
      }),
      subscribe: jest.fn((cb: (s: string) => void) => {
        onStatus = cb;
        return channel;
      }),
    };
    (createClient as jest.Mock).mockReturnValue({ channel: () => channel, removeChannel });
  });

  afterEach(() => jest.useRealTimers());

  it("agrupa rajadas, recarrega ao reconectar e limpa ao desmontar", () => {
    const cb = jest.fn();
    const { unmount } = renderHook(() => useRealtimeRefresh("c", "entregas", cb));

    act(() => onStatus("SUBSCRIBED")); // montagem: não recarrega
    act(() => {
      onEvent();
      onEvent();
      onEvent();
      jest.advanceTimersByTime(300);
    });
    expect(cb).toHaveBeenCalledTimes(1);

    act(() => {
      onStatus("SUBSCRIBED"); // reconexão
      jest.advanceTimersByTime(300);
    });
    expect(cb).toHaveBeenCalledTimes(2);

    unmount();
    expect(removeChannel).toHaveBeenCalled();
  });

  function setVisibility(state: "hidden" | "visible") {
    Object.defineProperty(document, "visibilityState", { value: state, configurable: true });
    document.dispatchEvent(new Event("visibilitychange"));
  }

  it("fecha o canal com a aba oculta e reabre + recarrega ao voltar", () => {
    const cb = jest.fn();
    renderHook(() => useRealtimeRefresh("c", "entregas", cb));
    act(() => onStatus("SUBSCRIBED"));

    act(() => setVisibility("hidden"));
    expect(removeChannel).toHaveBeenCalledTimes(1);

    act(() => {
      setVisibility("visible");
      onStatus("SUBSCRIBED"); // SUBSCRIBED da reabertura não conta como reconexão
      jest.advanceTimersByTime(300);
    });
    expect(cb).toHaveBeenCalledTimes(1);
  });

  it("com mine assina só as entregas do usuário logado", async () => {
    const on = jest.fn().mockReturnThis();
    const channel = { on, subscribe: jest.fn().mockReturnThis() };
    (createClient as jest.Mock).mockReturnValue({
      channel: () => channel,
      removeChannel,
      auth: { getSession: () => Promise.resolve({ data: { session: { user: { id: "u1" } } } }) },
    });

    renderHook(() => useRealtimeRefresh("c", "entregas", jest.fn(), { mine: true }));
    await act(async () => {});

    expect(on).toHaveBeenCalledWith(
      "postgres_changes",
      expect.objectContaining({ filter: "entregador_id=eq.u1" }),
      expect.any(Function),
    );
  });
});
