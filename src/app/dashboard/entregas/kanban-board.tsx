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
  Clock,
  Check,
  ChevronUp,
  ChevronDown,
  Users,
  Package,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { persistColumnState, releaseRoute, applyRouteChange, applyAddressChange } from "./actions";
import type { RouteChangeType } from "@/types/database";
import { formatOrderNumber, formatScheduledDate } from "@/lib/status";
import Link from "next/link";

const UNASSIGNED = "unassigned";
const GROUP_PREFIX = "group:";

function isGroupId(id: string) {
  return id.startsWith(GROUP_PREFIX);
}
function toGroupId(groupId: string) {
  return GROUP_PREFIX + groupId;
}
function fromGroupId(visualId: string) {
  return visualId.slice(GROUP_PREFIX.length);
}

// ---- Types ----

interface VisualItem {
  visualId: string;
  type: "single" | "group";
  entregas: any[];
  entregaIds: string[];
}

// ---- Route optimization ----

import { ORIGIN_LAT, ORIGIN_LNG } from "@/lib/constants";

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

function nearestNeighborSort(
  ids: string[],
  getCoords: (id: string) => { lat: number; lng: number } | null,
  startLat: number,
  startLng: number,
): { ordered: string[]; lastLat: number; lastLng: number } {
  const ordered: string[] = [];
  let curLat = startLat;
  let curLng = startLng;

  const remaining = ids.filter((id) => getCoords(id) != null);
  const noCoords = ids.filter((id) => getCoords(id) == null);

  while (remaining.length > 0) {
    let nearestIdx = 0;
    let nearestDist = Infinity;
    for (let i = 0; i < remaining.length; i++) {
      const c = getCoords(remaining[i])!;
      const d = haversine(curLat, curLng, c.lat, c.lng);
      if (d < nearestDist) {
        nearestDist = d;
        nearestIdx = i;
      }
    }
    const id = remaining.splice(nearestIdx, 1)[0];
    ordered.push(id);
    const c = getCoords(id)!;
    curLat = c.lat;
    curLng = c.lng;
  }

  ordered.push(...noCoords);
  return { ordered, lastLat: curLat, lastLng: curLng };
}

function optimizeVisualRoute(
  visualIds: string[],
  itemsMap: Record<string, VisualItem>,
): string[] {
  const getCoords = (vid: string) => {
    const item = itemsMap[vid];
    if (!item) return null;
    const e = item.entregas[0];
    if (e?.endereco?.lat != null && e?.endereco?.lng != null) {
      return { lat: e.endereco.lat, lng: e.endereco.lng };
    }
    return null;
  };

  const isUrgent = (vid: string) => itemsMap[vid]?.entregas[0]?.is_urgent;
  const isManha = (vid: string) => itemsMap[vid]?.entregas[0]?.scheduled_period === "manha";

  const urgent = visualIds.filter(isUrgent);
  const normal = visualIds.filter((id) => !isUrgent(id));

  const sortGroup = (ids: string[], startLat: number, startLng: number) => {
    const manha = ids.filter(isManha);
    const tarde = ids.filter((id) => !isManha(id));
    const manhaResult = nearestNeighborSort(manha, getCoords, startLat, startLng);
    const tardeStart = manha.length > 0
      ? { lat: manhaResult.lastLat, lng: manhaResult.lastLng }
      : { lat: startLat, lng: startLng };
    const tardeResult = nearestNeighborSort(tarde, getCoords, tardeStart.lat, tardeStart.lng);
    const lastResult = tarde.length > 0 ? tardeResult : manhaResult;
    return { ordered: [...manhaResult.ordered, ...tardeResult.ordered], lastLat: lastResult.lastLat, lastLng: lastResult.lastLng };
  };

  const urgentResult = sortGroup(urgent, ORIGIN_LAT, ORIGIN_LNG);
  const normalStart = urgent.length > 0
    ? { lat: urgentResult.lastLat, lng: urgentResult.lastLng }
    : { lat: ORIGIN_LAT, lng: ORIGIN_LNG };
  const normalResult = sortGroup(normal, normalStart.lat, normalStart.lng);

  return [...urgentResult.ordered, ...normalResult.ordered];
}

// ---- Sortable single card ----

function SortableCard({
  visualId,
  item,
  entregadores,
  currentColumnId,
  onAssign,
  onMoveUp,
  onMoveDown,
}: {
  visualId: string;
  item: VisualItem;
  entregadores: { id: string; name: string }[];
  currentColumnId: string;
  onAssign: (visualId: string, targetColumnId: string) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: visualId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  if (item.type === "group") {
    return (
      <div ref={setNodeRef} style={style}>
        <GroupCardContent
          item={item}
          isDragging={isDragging}
          attributes={attributes}
          listeners={listeners}
          entregadores={entregadores}
          currentColumnId={currentColumnId}
          visualId={visualId}
          onAssign={onAssign}
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
        />
      </div>
    );
  }

  const entrega = item.entregas[0];
  const isReleased = entrega.status === "rota_definida";
  const changeType = entrega.route_change_type as RouteChangeType | null;
  const cardBorder = changeType === "cancelada"
    ? "border-l-4 border-l-red-500 bg-red-50/50 dark:bg-red-500/5"
    : changeType === "adiada"
      ? "border-l-4 border-l-amber-500 bg-amber-50/50 dark:bg-amber-500/5"
      : changeType === "endereco_alterado"
        ? "border-l-4 border-l-blue-500 bg-blue-50/50 dark:bg-blue-500/5"
        : "";

  return (
    <div ref={setNodeRef} style={style}>
      <Card className={`${isDragging ? "ring-2 ring-primary" : ""} ${cardBorder}`}>
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
                <Link href={`/dashboard/entregas/${entrega.id}`} className="truncate font-medium hover:underline">
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
                  <span className="text-xs font-semibold text-primary">{formatScheduledDate(entrega.scheduled_date)}</span>
                )}
                {entrega.scheduled_period === "manha" && (
                  <Badge variant="outline" className="h-5 border-amber-500/50 bg-amber-50 px-1.5 text-[10px] text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
                    <Sun className="mr-0.5 h-2.5 w-2.5" />Manhã
                  </Badge>
                )}
                {entrega.scheduled_period === "tarde" && (
                  <Badge variant="outline" className="h-5 border-blue-500/50 bg-blue-50 px-1.5 text-[10px] text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
                    <Sunset className="mr-0.5 h-2.5 w-2.5" />Tarde
                  </Badge>
                )}
                {isReleased && (
                  <Badge variant="outline" className="h-5 border-green-500/50 bg-green-50 px-1.5 text-[10px] text-green-700 dark:bg-green-500/10 dark:text-green-400">
                    <Check className="mr-0.5 h-2.5 w-2.5" />Liberada
                  </Badge>
                )}
                {changeType === "adiada" && (
                  <Badge variant="outline" className="h-5 border-amber-500/50 bg-amber-100 px-1.5 text-[10px] text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
                    Rota alterada
                  </Badge>
                )}
                {changeType === "cancelada" && (
                  <Badge variant="outline" className="h-5 border-red-500/50 bg-red-100 px-1.5 text-[10px] text-red-700 dark:bg-red-500/10 dark:text-red-400">
                    Cancelada
                  </Badge>
                )}
                {changeType === "endereco_alterado" && (
                  <Badge variant="outline" className="h-5 border-blue-500/50 bg-blue-100 px-1.5 text-[10px] text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
                    <MapPin className="mr-0.5 h-2.5 w-2.5" />Endereço alterado
                  </Badge>
                )}
                {!entrega.endereco?.lat && (
                  <span className="text-[10px] text-amber-500" title="Sem coordenadas GPS">sem GPS</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-1.5" onClick={(e) => e.stopPropagation()}>
            {(onMoveUp || onMoveDown) && (
              <div className="flex shrink-0 gap-0.5 md:hidden">
                <button type="button" disabled={!onMoveUp} className="flex h-7 w-7 items-center justify-center rounded-md border border-input text-muted-foreground enabled:hover:bg-accent enabled:hover:text-foreground disabled:opacity-30" onClick={onMoveUp} aria-label="Mover para cima">
                  <ChevronUp className="h-4 w-4" />
                </button>
                <button type="button" disabled={!onMoveDown} className="flex h-7 w-7 items-center justify-center rounded-md border border-input text-muted-foreground enabled:hover:bg-accent enabled:hover:text-foreground disabled:opacity-30" onClick={onMoveDown} aria-label="Mover para baixo">
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>
            )}
            <Select value={currentColumnId} onValueChange={(v) => v && onAssign(visualId, v)} items={Object.fromEntries([[UNASSIGNED, "Sem entregador"], ...entregadores.map((ent) => [ent.id, ent.name])])}>
              <SelectTrigger className="h-7 w-full text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={UNASSIGNED}>Sem entregador</SelectItem>
                {entregadores.map((ent) => (
                  <SelectItem key={ent.id} value={ent.id}>{ent.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ---- Group card content ----

function GroupCardContent({
  item,
  isDragging,
  attributes,
  listeners,
  entregadores,
  currentColumnId,
  visualId,
  onAssign,
  onMoveUp,
  onMoveDown,
}: {
  item: VisualItem;
  isDragging: boolean;
  attributes: any;
  listeners: any;
  entregadores: { id: string; name: string }[];
  currentColumnId: string;
  visualId: string;
  onAssign: (visualId: string, targetColumnId: string) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}) {
  const entregas = item.entregas;
  const endereco = entregas[0]?.endereco;
  const label = endereco?.label;
  const hasUrgent = entregas.some((e: any) => e.is_urgent);
  const anyReleased = entregas.some((e: any) => e.status === "rota_definida");

  return (
    <Card className={`border-l-4 border-l-violet-500 ${isDragging ? "ring-2 ring-primary" : ""}`}>
      {/* Group header */}
      <div className="flex items-center gap-2 rounded-t-lg bg-violet-50 px-3 py-2 dark:bg-violet-500/10">
        <div
          className="flex cursor-grab items-center text-muted-foreground hover:text-foreground active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </div>
        <Users className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400" />
        <span className="text-xs font-semibold text-violet-700 dark:text-violet-300 truncate flex-1">
          {label || "Entrega em Grupo"}
        </span>
        <Badge variant="outline" className="text-[10px] border-violet-500/50 text-violet-700 dark:text-violet-400">
          {entregas.length}
        </Badge>
        {hasUrgent && (
          <Badge variant="destructive" className="text-[10px]">
            <AlertTriangle className="mr-0.5 h-2.5 w-2.5" />Urgente
          </Badge>
        )}
        {anyReleased && (
          <Badge variant="outline" className="h-5 border-green-500/50 bg-green-50 px-1.5 text-[10px] text-green-700 dark:bg-green-500/10 dark:text-green-400">
            <Check className="mr-0.5 h-2.5 w-2.5" />Liberada
          </Badge>
        )}
      </div>

      <CardContent className="space-y-1.5 px-3 py-2">
        {/* Address */}
        {endereco && (
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3 shrink-0" />
            <span className="truncate">
              {endereco.rua}, {endereco.numero}
              {endereco.bairro ? ` - ${endereco.bairro}` : ""}
            </span>
          </p>
        )}

        {/* List of clients */}
        <div className="space-y-0.5">
          {entregas.map((e: any) => (
            <div key={e.id} className="flex items-center gap-1.5 rounded px-1.5 py-0.5 text-xs bg-muted/40">
              <span className="font-mono text-muted-foreground text-[10px]">{formatOrderNumber(e.order_number)}</span>
              <Link href={`/dashboard/entregas/${e.id}`} className="truncate hover:underline flex-1">
                {e.cliente?.name ?? "Cliente"}
              </Link>
              <span className="text-muted-foreground shrink-0">
                <Package className="inline h-2.5 w-2.5 mr-0.5" />{e.numero_sacolas ?? 1}
              </span>
            </div>
          ))}
        </div>

        {/* Badges row */}
        <div className="flex flex-wrap items-center gap-1.5">
          {entregas[0]?.scheduled_date && (
            <span className="text-xs font-semibold text-primary">{formatScheduledDate(entregas[0].scheduled_date)}</span>
          )}
          {entregas[0]?.scheduled_period === "manha" && (
            <Badge variant="outline" className="h-5 border-amber-500/50 bg-amber-50 px-1.5 text-[10px] text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
              <Sun className="mr-0.5 h-2.5 w-2.5" />Manhã
            </Badge>
          )}
          {entregas[0]?.scheduled_period === "tarde" && (
            <Badge variant="outline" className="h-5 border-blue-500/50 bg-blue-50 px-1.5 text-[10px] text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
              <Sunset className="mr-0.5 h-2.5 w-2.5" />Tarde
            </Badge>
          )}
        </div>

        {/* Controls */}
        <div className="flex gap-1.5" onClick={(ev) => ev.stopPropagation()}>
          {(onMoveUp || onMoveDown) && (
            <div className="flex shrink-0 gap-0.5 md:hidden">
              <button type="button" disabled={!onMoveUp} className="flex h-7 w-7 items-center justify-center rounded-md border border-input text-muted-foreground enabled:hover:bg-accent enabled:hover:text-foreground disabled:opacity-30" onClick={onMoveUp}>
                <ChevronUp className="h-4 w-4" />
              </button>
              <button type="button" disabled={!onMoveDown} className="flex h-7 w-7 items-center justify-center rounded-md border border-input text-muted-foreground enabled:hover:bg-accent enabled:hover:text-foreground disabled:opacity-30" onClick={onMoveDown}>
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          )}
          <Select value={currentColumnId} onValueChange={(v) => v && onAssign(visualId, v)} items={Object.fromEntries([[UNASSIGNED, "Sem entregador"], ...entregadores.map((ent) => [ent.id, ent.name])])}>
            <SelectTrigger className="h-7 w-full text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={UNASSIGNED}>Sem entregador</SelectItem>
              {entregadores.map((ent) => (
                <SelectItem key={ent.id} value={ent.id}>{ent.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}

// ---- Card Preview (drag overlay) ----

function CardPreview({ item }: { item: VisualItem | null }) {
  if (!item) return null;
  if (item.type === "group") {
    const endereco = item.entregas[0]?.endereco;
    return (
      <Card className="w-[300px] shadow-lg ring-2 ring-violet-500 border-l-4 border-l-violet-500">
        <div className="flex items-center gap-2 bg-violet-50 px-3 py-2 dark:bg-violet-500/10 rounded-t-lg">
          <Users className="h-3.5 w-3.5 text-violet-600" />
          <span className="text-xs font-semibold text-violet-700 truncate">{endereco?.label || "Grupo"}</span>
          <Badge variant="outline" className="text-[10px] border-violet-500/50 text-violet-700">{item.entregas.length}</Badge>
        </div>
        <CardContent className="px-3 py-2">
          {endereco && (
            <p className="truncate text-xs text-muted-foreground">
              <MapPin className="mr-1 inline h-3 w-3" />{endereco.rua}, {endereco.numero}
            </p>
          )}
        </CardContent>
      </Card>
    );
  }
  const entrega = item.entregas[0];
  return (
    <Card className="w-[300px] shadow-lg ring-2 ring-primary">
      <CardContent className="px-3 py-3">
        <p className="truncate font-medium">
          <span className="text-xs font-mono text-muted-foreground mr-1">{formatOrderNumber(entrega.order_number)}</span>
          {entrega.cliente?.name ?? "Cliente"}
        </p>
        {entrega.endereco && (
          <p className="truncate text-xs text-muted-foreground">
            <MapPin className="mr-1 inline h-3 w-3" />{entrega.endereco.rua}, {entrega.endereco.numero}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

// ---- Optimize button ----

function OptimizeButton({ onOptimize, enabled }: { onOptimize: () => void; enabled: boolean }) {
  if (!enabled) return null;
  return (
    <button
      type="button"
      className="inline-flex h-7 items-center gap-1 rounded-md bg-[oklch(0.55_0.19_260)] px-2.5 text-xs font-medium text-white hover:opacity-80"
      onClick={() => { onOptimize(); toast.success("Rota otimizada!"); }}
    >
      <Route className="h-3.5 w-3.5" />Otimizar
    </button>
  );
}

// ---- Column ----

function KanbanColumn({
  columnId,
  title,
  visualIds,
  itemsMap,
  entregasMap,
  entregadores,
  onAssign,
  onOptimize,
  onRelease,
  onMove,
  unreleasedCount,
  totalEntregas,
}: {
  columnId: string;
  title: string;
  visualIds: string[];
  itemsMap: Record<string, VisualItem>;
  entregasMap: Record<string, any>;
  entregadores: { id: string; name: string }[];
  onAssign: (visualId: string, targetColumnId: string) => void;
  onOptimize?: (columnId: string) => void;
  onRelease?: () => void;
  onMove?: (columnId: string, visualId: string, direction: -1 | 1) => void;
  unreleasedCount: number;
  totalEntregas: number;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: columnId });
  const isEntregador = columnId !== UNASSIGNED;

  const hasEnoughForOptimize = visualIds.filter((vid) => {
    const e = itemsMap[vid]?.entregas[0];
    return e?.endereco?.lat != null;
  }).length >= 2;

  const allReleased = visualIds.length > 0 && visualIds.every((vid) => {
    const item = itemsMap[vid];
    if (!item) return false;
    return item.entregaIds.every((id) => entregasMap[id]?.status === "rota_definida");
  });

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
          <Badge variant="secondary" className="text-xs">{totalEntregas}</Badge>
        </div>
        {isEntregador && onOptimize && (
          <OptimizeButton onOptimize={() => onOptimize(columnId)} enabled={hasEnoughForOptimize && !allReleased} />
        )}
      </div>

      <div
        ref={setNodeRef}
        className={`flex min-h-[120px] flex-1 flex-col gap-2 rounded-b-lg border-2 border-dashed p-2 transition-colors ${
          isOver ? "border-primary/50 bg-primary/5" : "border-transparent"
        }`}
      >
        <SortableContext items={visualIds} strategy={verticalListSortingStrategy}>
          {visualIds.map((vid, idx) => (
            <SortableCard
              key={vid}
              visualId={vid}
              item={itemsMap[vid]}
              entregadores={entregadores}
              currentColumnId={columnId}
              onAssign={onAssign}
              onMoveUp={onMove && idx > 0 ? () => onMove(columnId, vid, -1) : undefined}
              onMoveDown={onMove && idx < visualIds.length - 1 ? () => onMove(columnId, vid, 1) : undefined}
            />
          ))}
        </SortableContext>

        {visualIds.length === 0 && (
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
  const [itemsMap, setItemsMap] = useState<Record<string, VisualItem>>({});
  const [entregasMap, setEntregasMap] = useState<Record<string, any>>({});
  const [activeId, setActiveId] = useState<string | null>(null);
  const columnsRef = useRef<Record<string, string[]>>({});
  const itemsMapRef = useRef<Record<string, VisualItem>>({});
  const dragSourceRef = useRef<string | null>(null);
  const [pendingDrag, setPendingDrag] = useState<{
    execute: () => void;
    rollback: () => void;
    affectedEntregaIds: string[];
  } | null>(null);
  const [routeChangeDialog, setRouteChangeDialog] = useState<{
    entregaIds: string[];
    execute: () => void;
    rollback: () => void;
  } | null>(null);
  const [routeChangeType, setRouteChangeType] = useState<RouteChangeType | null>(null);
  const [routeChangeNote, setRouteChangeNote] = useState("");
  const [routeChangeAddr, setRouteChangeAddr] = useState({ rua: "", numero: "", bairro: "", cidade: "" });

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

  // Expand visual ids to real entrega ids for persistence
  function expandToEntregaIds(visualIds: string[]): string[] {
    const result: string[] = [];
    for (const vid of visualIds) {
      const item = itemsMapRef.current[vid];
      if (item) {
        result.push(...item.entregaIds);
      }
    }
    return result;
  }

  // Build visual items from raw entregas
  useEffect(() => {
    const eMap: Record<string, any> = {};
    const groups: Record<string, any[]> = {};
    const singles: any[] = [];

    const sorted = [...entregas].sort((a, b) => {
      if (a.route_order != null && b.route_order != null) return a.route_order - b.route_order;
      if (a.route_order != null) return -1;
      if (b.route_order != null) return 1;
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    });

    for (const e of sorted) {
      eMap[e.id] = e;
      if (e.group_id) {
        if (!groups[e.group_id]) groups[e.group_id] = [];
        groups[e.group_id].push(e);
      } else {
        singles.push(e);
      }
    }

    // Build items map
    const iMap: Record<string, VisualItem> = {};
    for (const [gid, gEntregas] of Object.entries(groups)) {
      const vid = toGroupId(gid);
      iMap[vid] = {
        visualId: vid,
        type: "group",
        entregas: gEntregas,
        entregaIds: gEntregas.map((e) => e.id),
      };
    }
    for (const e of singles) {
      iMap[e.id] = {
        visualId: e.id,
        type: "single",
        entregas: [e],
        entregaIds: [e.id],
      };
    }

    // Build columns using visual ids
    // For groups, use the first entrega's assignment to determine column
    const cols: Record<string, string[]> = { [UNASSIGNED]: [] };
    for (const ent of entregadores) cols[ent.id] = [];

    const placed = new Set<string>();

    for (const e of sorted) {
      let vid: string;
      if (e.group_id) {
        vid = toGroupId(e.group_id);
      } else {
        vid = e.id;
      }
      if (placed.has(vid)) continue;
      placed.add(vid);

      if (e.entregador_id && cols[e.entregador_id]) {
        cols[e.entregador_id].push(vid);
      } else {
        cols[UNASSIGNED].push(vid);
      }
    }

    columnsRef.current = cols;
    itemsMapRef.current = iMap;
    _setColumns(cols);
    setItemsMap(iMap);
    setEntregasMap(eMap);
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
          persistColumnState(currentCol === UNASSIGNED ? null : currentCol, expandToEntregaIds(newItems));
        }
      } else if (originalCol) {
        persistColumnState(
          originalCol === UNASSIGNED ? null : originalCol,
          expandToEntregaIds(cols[originalCol]),
        );
        persistColumnState(
          currentCol === UNASSIGNED ? null : currentCol,
          expandToEntregaIds(cols[currentCol]),
        );
      }
    };

    const rollback = () => {
      setColumns(() => snapshotCols);
      columnsRef.current = snapshotCols;
    };

    const allVisualIds = currentCol === originalCol
      ? cols[currentCol]
      : [...(originalCol ? cols[originalCol] : []), ...cols[currentCol]];
    const allEntregaIds = expandToEntregaIds(allVisualIds);
    const hasReleased = allEntregaIds.some(
      (id) => entregasMap[id]?.status === "rota_definida",
    );

    if (hasReleased) {
      const draggedItem = itemsMapRef.current[aid];
      const draggedEntregaIds = draggedItem ? draggedItem.entregaIds : [aid];
      setPendingDrag({ execute: persist, rollback, affectedEntregaIds: draggedEntregaIds });
    } else {
      persist();
    }
  }

  const handleAssign = useCallback(
    (visualId: string, targetColumnId: string) => {
      setColumns((prev) => {
        const srcCol = Object.keys(prev).find((col) => prev[col].includes(visualId));
        if (!srcCol || srcCol === targetColumnId) return prev;
        if (!prev[targetColumnId]) return prev;

        const srcItems = prev[srcCol].filter((id) => id !== visualId);
        const dstItems = [...prev[targetColumnId], visualId];

        persistColumnState(srcCol === UNASSIGNED ? null : srcCol, expandToEntregaIds(srcItems));
        persistColumnState(
          targetColumnId === UNASSIGNED ? null : targetColumnId,
          expandToEntregaIds(dstItems),
        );

        return { ...prev, [srcCol]: srcItems, [targetColumnId]: dstItems };
      });
    },
    [setColumns],
  );


  const handleOptimize = useCallback(
    (columnId: string) => {
      setColumns((prev) => {
        const vids = prev[columnId];
        if (!vids) return prev;
        const optimized = optimizeVisualRoute(vids, itemsMapRef.current);
        persistColumnState(columnId === UNASSIGNED ? null : columnId, expandToEntregaIds(optimized));
        return { ...prev, [columnId]: optimized };
      });
    },
    [setColumns],
  );

  const handleRelease = useCallback(
    (columnId: string) => {
      const cols = columnsRef.current;
      const vids = cols[columnId];
      if (!vids) return;

      const entregaIds = expandToEntregaIds(vids);
      const unreleased = entregaIds.filter(
        (id) => entregasMap[id]?.status === "aguardando_atribuicao",
      );
      if (!unreleased.length) return;

      releaseRoute(unreleased)
        .then(() => {
          setEntregasMap((prev) => {
            const next = { ...prev };
            for (const id of unreleased) next[id] = { ...next[id], status: "rota_definida" };
            return next;
          });
          toast.success(
            `${unreleased.length} entrega${unreleased.length > 1 ? "s" : ""} liberada${unreleased.length > 1 ? "s" : ""}!`,
          );
        })
        .catch(() => toast.error("Erro ao liberar rota"));
    },
    [entregasMap],
  );

  const handleMove = useCallback(
    (columnId: string, visualId: string, direction: -1 | 1) => {
      setColumns((prev) => {
        const ids = prev[columnId];
        if (!ids) return prev;
        const idx = ids.indexOf(visualId);
        if (idx < 0) return prev;
        const newIdx = idx + direction;
        if (newIdx < 0 || newIdx >= ids.length) return prev;
        const newIds = arrayMove(ids, idx, newIdx);
        persistColumnState(columnId === UNASSIGNED ? null : columnId, expandToEntregaIds(newIds));
        return { ...prev, [columnId]: newIds };
      });
    },
    [setColumns],
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
          const vids = columns[colId] ?? [];
          const totalEntregas = vids.reduce((sum, vid) => sum + (itemsMap[vid]?.entregaIds.length ?? 0), 0);
          const unreleasedCount = expandToEntregaIds(vids).filter(
            (id) => entregasMap[id]?.status === "aguardando_atribuicao",
          ).length;
          return (
            <KanbanColumn
              key={colId}
              columnId={colId}
              title={colId === UNASSIGNED ? "Sem Entregador" : (entregador?.name ?? "Entregador")}
              visualIds={vids}
              itemsMap={itemsMap}
              entregasMap={entregasMap}
              entregadores={entregadores}
              onAssign={handleAssign}
              onOptimize={colId !== UNASSIGNED ? handleOptimize : undefined}
              onRelease={colId !== UNASSIGNED ? () => handleRelease(colId) : undefined}
              onMove={handleMove}
              unreleasedCount={unreleasedCount}
              totalEntregas={totalEntregas}
            />
          );
        })}
      </div>

      <DragOverlay>
        {activeId ? <CardPreview item={itemsMap[activeId] ?? null} /> : null}
      </DragOverlay>

      {/* Step 1: Confirm route change */}
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
              Algumas entregas já foram liberadas para o entregador. Alterar a ordem vai atualizar a rota dele em tempo real.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => { pendingDrag?.rollback(); setPendingDrag(null); }}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              const drag = pendingDrag!;
              setPendingDrag(null);
              setRouteChangeType(null);
              setRouteChangeNote("");
              setRouteChangeAddr({ rua: "", numero: "", bairro: "", cidade: "" });
              setRouteChangeDialog({
                entregaIds: drag.affectedEntregaIds,
                execute: drag.execute,
                rollback: drag.rollback,
              });
            }}>
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Step 2: Route change reason */}
      <Dialog
        open={routeChangeDialog !== null}
        onOpenChange={(open) => {
          if (!open) {
            routeChangeDialog?.rollback();
            setRouteChangeDialog(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Motivo da alteração</DialogTitle>
            <DialogDescription>
              Informe o motivo da mudança na rota. O motoboy será notificado.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="flex gap-2">
              <Button
                type="button"
                variant={routeChangeType === "adiada" ? "default" : "outline"}
                className={routeChangeType === "adiada" ? "flex-1 bg-amber-500 hover:bg-amber-600 text-white" : "flex-1"}
                onClick={() => setRouteChangeType("adiada")}
              >
                <Clock className="mr-2 h-4 w-4" />
                Adiada
              </Button>
              <Button
                type="button"
                variant={routeChangeType === "cancelada" ? "destructive" : "outline"}
                className="flex-1"
                onClick={() => setRouteChangeType("cancelada")}
              >
                <AlertTriangle className="mr-2 h-4 w-4" />
                Cancelada
              </Button>
              <Button
                type="button"
                variant={routeChangeType === "endereco_alterado" ? "default" : "outline"}
                className={routeChangeType === "endereco_alterado" ? "flex-1 bg-blue-500 hover:bg-blue-600 text-white" : "flex-1"}
                onClick={() => setRouteChangeType("endereco_alterado")}
              >
                <MapPin className="mr-2 h-4 w-4" />
                Endereço
              </Button>
            </div>
            {routeChangeType && (
              <p className="text-xs text-muted-foreground">
                {routeChangeType === "adiada"
                  ? "A entrega será entregue em outra ordem. O motoboy verá a nova posição na rota."
                  : routeChangeType === "cancelada"
                    ? "A entrega será cancelada e o motoboy será instruído a retornar com ela à Dental."
                    : "O endereço da entrega será alterado. O motoboy verá o novo endereço na rota."}
              </p>
            )}
            {routeChangeType === "endereco_alterado" && (
              <div className="space-y-2 rounded-md border p-3">
                <p className="text-xs font-medium">Novo endereço</p>
                <div className="grid grid-cols-[1fr_80px] gap-2">
                  <Input
                    placeholder="Rua *"
                    value={routeChangeAddr.rua}
                    onChange={(e) => setRouteChangeAddr((p) => ({ ...p, rua: e.target.value }))}
                  />
                  <Input
                    placeholder="Nº"
                    value={routeChangeAddr.numero}
                    onChange={(e) => setRouteChangeAddr((p) => ({ ...p, numero: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="Bairro"
                    value={routeChangeAddr.bairro}
                    onChange={(e) => setRouteChangeAddr((p) => ({ ...p, bairro: e.target.value }))}
                  />
                  <Input
                    placeholder="Cidade *"
                    value={routeChangeAddr.cidade}
                    onChange={(e) => setRouteChangeAddr((p) => ({ ...p, cidade: e.target.value }))}
                  />
                </div>
              </div>
            )}
            <div className="space-y-2">
              <Label>Observação para o motoboy {routeChangeType !== "endereco_alterado" ? "*" : ""}</Label>
              <Textarea
                value={routeChangeNote}
                onChange={(e) => setRouteChangeNote(e.target.value)}
                placeholder="Ex: Cliente não está no local, entregar amanhã..."
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => { routeChangeDialog?.rollback(); setRouteChangeDialog(null); }}>
              Cancelar
            </Button>
            <Button
              disabled={
                !routeChangeType
                || (routeChangeType !== "endereco_alterado" && !routeChangeNote.trim())
                || (routeChangeType === "endereco_alterado" && (!routeChangeAddr.rua.trim() || !routeChangeAddr.cidade.trim()))
              }
              onClick={async () => {
                const dialog = routeChangeDialog!;
                const type = routeChangeType!;
                const note = routeChangeNote.trim();

                dialog.execute();

                try {
                  if (type === "endereco_alterado") {
                    await Promise.all(
                      dialog.entregaIds.map((id) => applyAddressChange(id, routeChangeAddr, note))
                    );
                  } else {
                    await Promise.all(
                      dialog.entregaIds.map((id) => applyRouteChange(id, type, note))
                    );
                  }
                  setEntregasMap((prev) => {
                    const next = { ...prev };
                    for (const id of dialog.entregaIds) {
                      next[id] = {
                        ...next[id],
                        route_change_type: type,
                        route_change_note: note || (type === "endereco_alterado" ? `Novo: ${routeChangeAddr.rua}, ${routeChangeAddr.numero}` : null),
                        ...(type === "cancelada" ? { status: "retornada" } : {}),
                      };
                    }
                    return next;
                  });
                  toast.success(
                    type === "adiada"
                      ? "Entrega(s) marcada(s) como adiada(s)"
                      : type === "cancelada"
                        ? "Entrega(s) cancelada(s) — motoboy será notificado"
                        : "Endereço alterado — motoboy será notificado"
                  );
                } catch {
                  toast.error("Erro ao registrar alteração de rota");
                }

                setRouteChangeDialog(null);
              }}
            >
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DndContext>
  );
}
