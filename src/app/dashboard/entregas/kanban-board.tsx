"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import {
  GripVertical,
  MapPin,
  AlertTriangle,
  Route,
  Send,
  Sun,
  Sunset,
  Calendar,
  Clock,
  Check,
} from "lucide-react";
import { persistColumnState, releaseRoute, togglePostponed } from "./actions";
import { formatOrderNumber, formatScheduledDate } from "@/lib/status";
import Link from "next/link";

const UNASSIGNED = "unassigned";

// ---- Route optimization ----

function haversine(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const START_LAT = -25.4284;
const START_LNG = -49.2733;

function nearestNeighborSort(
  ids: string[],
  map: Record<string, any>,
  startLat: number,
  startLng: number,
): { ordered: string[]; lastLat: number; lastLng: number } {
  const ordered: string[] = [];
  let curLat = startLat;
  let curLng = startLng;

  const remaining = ids.filter(
    (id) => map[id]?.endereco?.lat != null && map[id]?.endereco?.lng != null,
  );
  const noCoords = ids.filter(
    (id) => map[id]?.endereco?.lat == null || map[id]?.endereco?.lng == null,
  );

  while (remaining.length > 0) {
    let nearestIdx = 0;
    let nearestDist = Infinity;
    for (let i = 0; i < remaining.length; i++) {
      const e = map[remaining[i]];
      const d = haversine(curLat, curLng, e.endereco.lat, e.endereco.lng);
      if (d < nearestDist) {
        nearestDist = d;
        nearestIdx = i;
      }
    }
    const id = remaining.splice(nearestIdx, 1)[0];
    ordered.push(id);
    curLat = map[id].endereco.lat;
    curLng = map[id].endereco.lng;
  }

  ordered.push(...noCoords);
  return { ordered, lastLat: curLat, lastLng: curLng };
}

function optimizeRoute(ids: string[], map: Record<string, any>): string[] {
  const urgent = ids.filter((id) => map[id]?.is_urgent);
  const normal = ids.filter((id) => !map[id]?.is_urgent);

  const urgentResult = nearestNeighborSort(urgent, map, START_LAT, START_LNG);
  const normalStart = urgent.length > 0
    ? { lat: urgentResult.lastLat, lng: urgentResult.lastLng }
    : { lat: START_LAT, lng: START_LNG };
  const normalResult = nearestNeighborSort(normal, map, normalStart.lat, normalStart.lng);

  return [...urgentResult.ordered, ...normalResult.ordered];
}

// ---- Sortable card ----

function SortableCard({
  id,
  entrega,
  entregadores,
  currentColumnId,
  onAssign,
  onTogglePostponed,
}: {
  id: string;
  entrega: any;
  entregadores: { id: string; name: string }[];
  currentColumnId: string;
  onAssign: (entregaId: string, targetColumnId: string) => void;
  onTogglePostponed: (entregaId: string, postponed: boolean) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  const isReleased = entrega.status === "rota_definida";

  return (
    <div ref={setNodeRef} style={style}>
      <Card className={isDragging ? "ring-2 ring-primary" : ""}>
        <CardContent className="space-y-2 px-3 py-3">
          <div className="flex gap-2">
            <div
              className="flex cursor-grab items-center text-muted-foreground hover:text-foreground active:cursor-grabbing"
              {...attributes}
              {...listeners}
            >
              <GripVertical className="h-4 w-4" />
            </div>

            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-muted-foreground">{formatOrderNumber(entrega.order_number)}</span>
                <Link
                  href={`/dashboard/entregas/${entrega.id}`}
                  className="truncate font-medium hover:underline"
                >
                  {entrega.cliente?.name ?? "Cliente"}
                </Link>
                {entrega.is_urgent && (
                  <Badge variant="destructive" className="shrink-0 text-xs">
                    <AlertTriangle className="mr-1 h-3 w-3" />
                    Urgente
                  </Badge>
                )}
              </div>
              {entrega.endereco && (
                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3 shrink-0" />
                  <span className="truncate">
                    {entrega.endereco.rua}, {entrega.endereco.numero}
                    {entrega.endereco.bairro ? ` - ${entrega.endereco.bairro}` : ""}
                  </span>
                </p>
              )}
              <div className="flex flex-wrap items-center gap-1.5">
                {entrega.scheduled_date && (
                  <span className="text-xs font-semibold text-primary">
                    {formatScheduledDate(entrega.scheduled_date)}
                  </span>
                )}
                {entrega.scheduled_period === "manha" && (
                  <Badge variant="outline" className="h-5 border-amber-500/50 bg-amber-50 px-1.5 text-[10px] text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
                    <Sun className="mr-0.5 h-2.5 w-2.5" />
                    Manhã
                  </Badge>
                )}
                {entrega.scheduled_period === "tarde" && (
                  <Badge variant="outline" className="h-5 border-blue-500/50 bg-blue-50 px-1.5 text-[10px] text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
                    <Sunset className="mr-0.5 h-2.5 w-2.5" />
                    Tarde
                  </Badge>
                )}
                {isReleased && (
                  <Badge variant="outline" className="h-5 border-green-500/50 bg-green-50 px-1.5 text-[10px] text-green-700 dark:bg-green-500/10 dark:text-green-400">
                    <Check className="mr-0.5 h-2.5 w-2.5" />
                    Liberada
                  </Badge>
                )}
                {entrega.is_postponed && (
                  <Badge variant="outline" className="h-5 border-red-500/50 bg-red-50 px-1.5 text-[10px] text-red-700 dark:bg-red-500/10 dark:text-red-400">
                    <Clock className="mr-0.5 h-2.5 w-2.5" />
                    Adiada
                  </Badge>
                )}
                {!entrega.endereco?.lat && (
                  <span className="text-[10px] text-amber-500" title="Sem coordenadas GPS">
                    sem GPS
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-1.5" onClick={(e) => e.stopPropagation()}>
            <Select value={currentColumnId} onValueChange={(v) => v && onAssign(id, v)} items={Object.fromEntries([[UNASSIGNED, "Sem motoboy"], ...entregadores.map((ent) => [ent.id, ent.name])])}>
              <SelectTrigger className="h-7 w-full text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={UNASSIGNED}>Sem motoboy</SelectItem>
                {entregadores.map((ent) => (
                  <SelectItem key={ent.id} value={ent.id}>
                    {ent.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {currentColumnId !== UNASSIGNED && (
              <button
                type="button"
                title={entrega.is_postponed ? "Remover adiamento" : "Marcar como adiada"}
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md border text-xs transition-colors ${
                  entrega.is_postponed
                    ? "border-amber-500/50 bg-amber-50 text-amber-600 hover:bg-amber-100"
                    : "border-input text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
                onClick={() => onTogglePostponed(id, !entrega.is_postponed)}
              >
                <Clock className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function CardPreview({ entrega }: { entrega: any }) {
  if (!entrega) return null;
  return (
    <Card className="w-[300px] shadow-lg ring-2 ring-primary">
      <CardContent className="px-3 py-3">
        <p className="truncate font-medium">
          <span className="text-xs font-mono text-muted-foreground mr-1">{formatOrderNumber(entrega.order_number)}</span>
          {entrega.cliente?.name ?? "Cliente"}
        </p>
        {entrega.endereco && (
          <p className="truncate text-xs text-muted-foreground">
            <MapPin className="mr-1 inline h-3 w-3" />
            {entrega.endereco.rua}, {entrega.endereco.numero}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

// ---- Optimize dialog ----

function OptimizeButton({
  columnEntregaIds,
  entregasMap,
  onOptimize,
}: {
  columnEntregaIds: string[];
  entregasMap: Record<string, any>;
  onOptimize: () => void;
}) {
  const hasEnough = columnEntregaIds.filter(
    (id) => entregasMap[id]?.endereco?.lat != null,
  ).length >= 2;

  if (!hasEnough) return null;

  return (
    <button
      type="button"
      className="inline-flex h-7 items-center gap-1 rounded-md bg-[oklch(0.55_0.19_260)] px-2.5 text-xs font-medium text-white hover:opacity-80"
      onClick={() => {
        onOptimize();
        toast.success("Rota otimizada!");
      }}
    >
      <Route className="h-3.5 w-3.5" />
      Otimizar
    </button>
  );
}

// ---- Column ----

function KanbanColumn({
  columnId,
  title,
  entregaIds,
  entregasMap,
  entregadores,
  onAssign,
  onTogglePostponed,
  onOptimize,
  onRelease,
}: {
  columnId: string;
  title: string;
  entregaIds: string[];
  entregasMap: Record<string, any>;
  entregadores: { id: string; name: string }[];
  onAssign: (entregaId: string, targetColumnId: string) => void;
  onTogglePostponed: (entregaId: string, postponed: boolean) => void;
  onOptimize?: (columnId: string) => void;
  onRelease?: () => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: columnId });
  const isEntregador = columnId !== UNASSIGNED;

  const unreleasedCount = entregaIds.filter(
    (id) => entregasMap[id]?.status === "aguardando_atribuicao",
  ).length;

  return (
    <div className="flex min-w-[280px] flex-1 flex-col">
      <div className="mb-2 flex items-center justify-between gap-2 rounded-t-lg bg-muted/50 px-3 py-2">
        <div className="flex items-center gap-2">
          {isEntregador && (
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
              {title.charAt(0).toUpperCase()}
            </div>
          )}
          <span className="text-sm font-semibold">{title}</span>
          <Badge variant="secondary" className="text-xs">
            {entregaIds.length}
          </Badge>
        </div>
        {isEntregador && onOptimize && (
          <OptimizeButton
            columnEntregaIds={entregaIds}
            entregasMap={entregasMap}
            onOptimize={() => onOptimize(columnId)}
          />
        )}
      </div>

      <div
        ref={setNodeRef}
        className={`flex min-h-[120px] flex-1 flex-col gap-2 rounded-b-lg border-2 border-dashed p-2 transition-colors ${
          isOver ? "border-primary/50 bg-primary/5" : "border-transparent"
        }`}
      >
        <SortableContext items={entregaIds} strategy={verticalListSortingStrategy}>
          {entregaIds.map((id) => (
            <SortableCard
              key={id}
              id={id}
              entrega={entregasMap[id]}
              entregadores={entregadores}
              currentColumnId={columnId}
              onAssign={onAssign}
              onTogglePostponed={onTogglePostponed}
            />
          ))}
        </SortableContext>

        {entregaIds.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            {isEntregador ? "Arraste entregas para cá" : "Todas atribuídas"}
          </p>
        )}
      </div>

      {isEntregador && unreleasedCount > 0 && (
        <Button className="mt-2 w-full" onClick={onRelease}>
          <Send className="mr-2 h-4 w-4" />
          Liberar {unreleasedCount} entrega{unreleasedCount > 1 ? "s" : ""}
        </Button>
      )}
    </div>
  );
}

// ---- Board ----

interface KanbanBoardProps {
  entregas: any[];
  entregadores: { id: string; name: string }[];
}

export function KanbanBoard({ entregas, entregadores }: KanbanBoardProps) {
  const [columns, _setColumns] = useState<Record<string, string[]>>({});
  const [entregasMap, setEntregasMap] = useState<Record<string, any>>({});
  const [activeId, setActiveId] = useState<string | null>(null);
  const columnsRef = useRef<Record<string, string[]>>({});
  const dragSourceRef = useRef<string | null>(null);
  const [pendingDrag, setPendingDrag] = useState<{
    execute: () => void;
    rollback: () => void;
  } | null>(null);

  const setColumns = useCallback(
    (fn: (prev: Record<string, string[]>) => Record<string, string[]>) => {
      _setColumns((prev) => {
        const next = fn(prev);
        columnsRef.current = next;
        return next;
      });
    },
    [],
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  useEffect(() => {
    const map: Record<string, any> = {};
    const cols: Record<string, string[]> = { [UNASSIGNED]: [] };
    for (const ent of entregadores) cols[ent.id] = [];

    const sorted = [...entregas].sort((a, b) => {
      if (a.route_order != null && b.route_order != null) return a.route_order - b.route_order;
      if (a.route_order != null) return -1;
      if (b.route_order != null) return 1;
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    });

    for (const e of sorted) {
      map[e.id] = e;
      if (e.entregador_id && cols[e.entregador_id]) {
        cols[e.entregador_id].push(e.id);
      } else {
        cols[UNASSIGNED].push(e.id);
      }
    }

    columnsRef.current = cols;
    _setColumns(cols);
    setEntregasMap(map);
  }, [entregas, entregadores]);

  function handleDragStart(event: DragStartEvent) {
    const id = event.active.id as string;
    setActiveId(id);
    const cols = columnsRef.current;
    dragSourceRef.current =
      Object.keys(cols).find((col) => cols[col].includes(id)) ?? null;
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    setColumns((prev) => {
      const aid = active.id as string;
      const oid = over.id as string;

      const srcCol = Object.keys(prev).find((col) => prev[col].includes(aid));
      let dstCol = Object.keys(prev).find((col) => prev[col].includes(oid));
      if (!dstCol && prev[oid]) dstCol = oid;
      if (!srcCol || !dstCol || srcCol === dstCol) return prev;

      const srcItems = prev[srcCol].filter((i) => i !== aid);
      const dstItems = [...prev[dstCol]];
      const overIdx = dstItems.indexOf(oid);
      dstItems.splice(overIdx >= 0 ? overIdx : dstItems.length, 0, aid);

      return { ...prev, [srcCol]: srcItems, [dstCol]: dstItems };
    });
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;

    const aid = active.id as string;
    const oid = over.id as string;
    const originalCol = dragSourceRef.current;
    dragSourceRef.current = null;

    const cols = columnsRef.current;
    const currentCol = Object.keys(cols).find((col) => cols[col].includes(aid));
    if (!currentCol) return;

    const snapshotCols = { ...cols };
    for (const k of Object.keys(snapshotCols)) snapshotCols[k] = [...snapshotCols[k]];

    const persist = () => {
      if (currentCol === originalCol) {
        const items = cols[currentCol];
        const oldIdx = items.indexOf(aid);
        const newIdx = items.indexOf(oid);
        if (oldIdx !== newIdx && newIdx >= 0) {
          const newItems = arrayMove(items, oldIdx, newIdx);
          setColumns(() => ({ ...cols, [currentCol]: newItems }));
          persistColumnState(currentCol === UNASSIGNED ? null : currentCol, newItems);
        }
      } else if (originalCol) {
        persistColumnState(
          originalCol === UNASSIGNED ? null : originalCol,
          cols[originalCol],
        );
        persistColumnState(
          currentCol === UNASSIGNED ? null : currentCol,
          cols[currentCol],
        );
      }
    };

    const rollback = () => {
      setColumns(() => snapshotCols);
      columnsRef.current = snapshotCols;
    };

    // Check if any involved entrega is already released
    const involvedIds = currentCol === originalCol
      ? cols[currentCol]
      : [...(originalCol ? cols[originalCol] : []), ...cols[currentCol]];
    const hasReleased = involvedIds.some(
      (id) => entregasMap[id]?.status === "rota_definida",
    );

    if (hasReleased) {
      setPendingDrag({ execute: persist, rollback });
    } else {
      persist();
    }
  }

  const handleAssign = useCallback(
    (entregaId: string, targetColumnId: string) => {
      setColumns((prev) => {
        const srcCol = Object.keys(prev).find((col) => prev[col].includes(entregaId));
        if (!srcCol || srcCol === targetColumnId) return prev;
        if (!prev[targetColumnId]) return prev;

        const srcItems = prev[srcCol].filter((id) => id !== entregaId);
        const dstItems = [...prev[targetColumnId], entregaId];

        persistColumnState(srcCol === UNASSIGNED ? null : srcCol, srcItems);
        persistColumnState(
          targetColumnId === UNASSIGNED ? null : targetColumnId,
          dstItems,
        );

        return { ...prev, [srcCol]: srcItems, [targetColumnId]: dstItems };
      });
    },
    [setColumns],
  );

  const handleTogglePostponed = useCallback(
    (entregaId: string, postponed: boolean) => {
      setEntregasMap((prev) => ({
        ...prev,
        [entregaId]: { ...prev[entregaId], is_postponed: postponed },
      }));
      togglePostponed(entregaId, postponed)
        .then(() => toast.success(postponed ? "Entrega marcada como adiada" : "Adiamento removido"))
        .catch(() => toast.error("Erro ao atualizar"));
    },
    [],
  );

  const handleOptimize = useCallback(
    (columnId: string) => {
      setColumns((prev) => {
        const ids = prev[columnId];
        if (!ids) return prev;
        const optimized = optimizeRoute(ids, entregasMap);
        persistColumnState(columnId === UNASSIGNED ? null : columnId, optimized);
        return { ...prev, [columnId]: optimized };
      });
    },
    [entregasMap, setColumns],
  );

  const handleRelease = useCallback(
    (columnId: string) => {
      const cols = columnsRef.current;
      const ids = cols[columnId]?.filter(
        (id) => entregasMap[id]?.status === "aguardando_atribuicao",
      );
      if (!ids?.length) return;

      releaseRoute(ids)
        .then(() => {
          setEntregasMap((prev) => {
            const next = { ...prev };
            for (const id of ids) next[id] = { ...next[id], status: "rota_definida" };
            return next;
          });
          toast.success(
            `${ids.length} entrega${ids.length > 1 ? "s" : ""} liberada${ids.length > 1 ? "s" : ""}!`,
          );
        })
        .catch(() => toast.error("Erro ao liberar rota"));
    },
    [entregasMap],
  );

  const columnOrder = [UNASSIGNED, ...entregadores.map((e) => e.id)];

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {columnOrder.map((colId) => {
          const entregador = entregadores.find((e) => e.id === colId);
          return (
            <KanbanColumn
              key={colId}
              columnId={colId}
              title={colId === UNASSIGNED ? "Sem Motoboy" : (entregador?.name ?? "Motoboy")}
              entregaIds={columns[colId] ?? []}
              entregasMap={entregasMap}
              entregadores={entregadores}
              onAssign={handleAssign}
              onTogglePostponed={handleTogglePostponed}
              onOptimize={colId !== UNASSIGNED ? handleOptimize : undefined}
              onRelease={colId !== UNASSIGNED ? () => handleRelease(colId) : undefined}
            />
          );
        })}
      </div>

      <DragOverlay>
        {activeId ? <CardPreview entrega={entregasMap[activeId]} /> : null}
      </DragOverlay>

      <AlertDialog
        open={pendingDrag !== null}
        onOpenChange={(open) => {
          if (!open) {
            pendingDrag?.rollback();
            setPendingDrag(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Alterar rota liberada?</AlertDialogTitle>
            <AlertDialogDescription>
              Algumas entregas já foram liberadas para o motoboy. Alterar a ordem vai atualizar a rota dele em tempo real.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                pendingDrag?.rollback();
                setPendingDrag(null);
              }}
            >
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                pendingDrag?.execute();
                setPendingDrag(null);
              }}
            >
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DndContext>
  );
}
