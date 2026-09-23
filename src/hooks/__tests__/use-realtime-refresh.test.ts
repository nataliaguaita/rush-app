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
});
