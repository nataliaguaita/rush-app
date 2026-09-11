"use client";

import { create } from "zustand";

const DB_NAME = "rush-offline";
const OPS = "ops";
const BLOBS = "blobs";

export type RegistroDados = {
  receiver_name: string;
  receiver_role: string;
  custom_role?: string;
  receiver_note?: string;
};

export type QueuedOp =
  | { kind: "iniciar"; entregaId: string }
  | { kind: "entrega"; entregaId: string; dados: RegistroDados }
  | { kind: "recusa"; entregaId: string; motivo: string }
  | { kind: "retorno"; entregaId: string }
  | { kind: "foto"; entregaId: string; filename: string }
  | { kind: "removerFotos"; entregaId: string }
  | { kind: "copiarFoto"; entregaId: string; targetEntregaIds: string[] };

export type Applier = (op: QueuedOp, blob?: Blob) => Promise<void>;

/** Ops que finalizam a entrega — travam o card contra um segundo registro. */
const FINAL_KINDS: QueuedOp["kind"][] = ["entrega", "recusa", "retorno"];

type QueueState = {
  count: number;
  pendingIds: Set<string>;
  syncing: boolean;
  failed: number;
};

export const useQueueStore = create<QueueState>(() => ({
  count: 0,
  pendingIds: new Set<string>(),
  syncing: false,
  failed: 0,
}));

export function derivePendingIds(ops: QueuedOp[]): Set<string> {
  return new Set(ops.filter((op) => FINAL_KINDS.includes(op.kind)).map((op) => op.entregaId));
}

export function isOffline(): boolean {
  return typeof navigator !== "undefined" && navigator.onLine === false;
}

export function isNetworkError(err: unknown): boolean {
  if (err instanceof TypeError) return true;
  const msg = err instanceof Error ? err.message : String(err ?? "");
  return /failed to fetch|fetch failed|networkerror|network request|load failed|timeout|err_internet|offline/i.test(msg);
}

let dbPromise: Promise<IDBDatabase> | null = null;

function db(): Promise<IDBDatabase> {
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = () => {
        const d = req.result;
        if (!d.objectStoreNames.contains(OPS)) d.createObjectStore(OPS, { autoIncrement: true });
        if (!d.objectStoreNames.contains(BLOBS)) d.createObjectStore(BLOBS);
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }
  return dbPromise;
}

function tx<T>(
  store: string,
  mode: IDBTransactionMode,
  fn: (s: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  return db().then(
    (d) =>
      new Promise<T>((resolve, reject) => {
        const req = fn(d.transaction(store, mode).objectStore(store));
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      }),
  );
}

/** Chaves autoIncrement saem em ordem crescente — é isso que garante o FIFO. */
async function readOps(): Promise<{ key: IDBValidKey; op: QueuedOp }[]> {
  const [keys, values] = await Promise.all([
    tx<IDBValidKey[]>(OPS, "readonly", (s) => s.getAllKeys()),
    tx<QueuedOp[]>(OPS, "readonly", (s) => s.getAll()),
  ]);
  return keys.map((key, i) => ({ key, op: values[i] }));
}

function countOps(): Promise<number> {
  return tx<number>(OPS, "readonly", (s) => s.count());
}

async function refresh(): Promise<number> {
  const list = await readOps();
  useQueueStore.setState({
    count: list.length,
    pendingIds: derivePendingIds(list.map((e) => e.op)),
  });
  return list.length;
}

export function initQueue(): Promise<number> {
  return refresh();
}

export async function enqueue(op: QueuedOp, blob?: Blob): Promise<void> {
  const key = await tx<IDBValidKey>(OPS, "readwrite", (s) => s.add(op));
  if (blob) await tx(BLOBS, "readwrite", (s) => s.put(blob, key as IDBValidKey));
  await refresh();
}

async function remove(key: IDBValidKey): Promise<void> {
  await tx(OPS, "readwrite", (s) => s.delete(key));
  await tx(BLOBS, "readwrite", (s) => s.delete(key));
}

export async function dropOps(match: (op: QueuedOp) => boolean): Promise<void> {
  for (const { key, op } of await readOps()) {
    if (match(op)) await remove(key);
  }
  await refresh();
}

/**
 * Envia agora se der; senão guarda para o flush.
 * Com a fila cheia tudo entra na fila — pular a fila quebraria a ordem
 * (copiarFoto depende da foto de origem já ter subido).
 */
export async function run(op: QueuedOp, apply: Applier, blob?: Blob): Promise<"sent" | "queued"> {
  if (isOffline() || (await countOps()) > 0) {
    await enqueue(op, blob);
    return "queued";
  }
  try {
    await apply(op, blob);
    return "sent";
  } catch (err) {
    if (!isNetworkError(err)) throw err;
    await enqueue(op, blob);
    return "queued";
  }
}

let flushing = false;

export async function flushQueue(apply: Applier): Promise<void> {
  if (flushing || isOffline()) return;
  flushing = true;
  useQueueStore.setState({ syncing: true });
  try {
    for (const { key, op } of await readOps()) {
      const blob =
        op.kind === "foto" ? await tx<Blob | undefined>(BLOBS, "readonly", (s) => s.get(key)) : undefined;

      if (op.kind === "foto" && !blob) {
        await remove(key);
        continue;
      }

      try {
        await apply(op, blob);
      } catch (err) {
        // Ainda sem rede: para aqui e mantém o resto da fila na ordem.
        if (isNetworkError(err)) return;
        // Erro definitivo (entrega apagada, permissão): descarta para não travar
        // a fila inteira, mas conta para avisar o entregador.
        useQueueStore.setState((s) => ({ failed: s.failed + 1 }));
      }
      await remove(key);
    }
  } finally {
    flushing = false;
    useQueueStore.setState({ syncing: false });
    await refresh();
  }
}

export function clearFailed(): void {
  useQueueStore.setState({ failed: 0 });
}
