type Ordenavel = { route_order: number | null; created_at: string };

/** Ordem da rota usada pelo organizador e pelo dashboard: route_order, sem ordem no fim, empate pela data de cadastro. */
export function compareRouteOrder(a: Ordenavel, b: Ordenavel) {
  if (a.route_order != null && b.route_order != null && a.route_order !== b.route_order) {
    return a.route_order - b.route_order;
  }
  if (a.route_order != null && b.route_order == null) return -1;
  if (a.route_order == null && b.route_order != null) return 1;
  return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
}
