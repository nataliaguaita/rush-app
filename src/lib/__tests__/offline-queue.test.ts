import { derivePendingIds, isNetworkError, type QueuedOp } from "../offline-queue";

describe("isNetworkError", () => {
  it("treats a fetch TypeError as a network error", () => {
    expect(isNetworkError(new TypeError("Failed to fetch"))).toBe(true);
  });

  it("recognizes network failures wrapped as plain Errors by supabase", () => {
    expect(isNetworkError(new Error("TypeError: Failed to fetch"))).toBe(true);
    expect(isNetworkError(new Error("NetworkError when attempting to fetch resource"))).toBe(true);
    expect(isNetworkError(new Error("Load failed"))).toBe(true);
  });

  it("does not swallow real server errors — those must surface, not be queued", () => {
    expect(isNetworkError(new Error("new row violates row-level security policy"))).toBe(false);
    expect(isNetworkError(new Error("duplicate key value violates unique constraint"))).toBe(false);
  });
});

describe("derivePendingIds", () => {
  const ops: QueuedOp[] = [
    { kind: "iniciar", entregaId: "a" },
    { kind: "foto", entregaId: "b", filename: "x.jpg" },
    { kind: "entrega", entregaId: "b", dados: { receiver_name: "Ana", receiver_role: "porteiro" } },
    { kind: "recusa", entregaId: "c", motivo: "ausente" },
    { kind: "retorno", entregaId: "d" },
    { kind: "copiarFoto", entregaId: "b", targetEntregaIds: ["e"] },
  ];

  it("locks only entregas with a finalizing op queued", () => {
    expect(derivePendingIds(ops)).toEqual(new Set(["b", "c", "d"]));
  });

  it("does not lock an entrega that only has a photo or a start queued", () => {
    const pending = derivePendingIds([
      { kind: "iniciar", entregaId: "a" },
      { kind: "foto", entregaId: "a", filename: "x.jpg" },
    ]);
    expect(pending.has("a")).toBe(false);
  });

  it("returns an empty set for an empty queue", () => {
    expect(derivePendingIds([])).toEqual(new Set());
  });
});
