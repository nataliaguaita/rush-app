export function GpsBadge({ lat, lng }: { lat?: number | null; lng?: number | null }) {
  if (lat && lng) return null;
  return (
    <span className="text-[10px] text-amber-500" title="Sem coordenadas GPS">
      sem GPS
    </span>
  );
}
