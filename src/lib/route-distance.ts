import { ORIGIN_LAT, ORIGIN_LNG } from "./constants";

export async function calcRouteDistanceKm(
  waypoints: { lat: number; lng: number }[],
  period: "manha" | "tarde",
): Promise<number> {
  if (waypoints.length === 0) return 0;

  const coords = [
    `${ORIGIN_LNG},${ORIGIN_LAT}`,
    ...waypoints.map((w) => `${w.lng},${w.lat}`),
    ...(period === "manha" ? [`${ORIGIN_LNG},${ORIGIN_LAT}`] : []),
  ].join(";");

  const res = await fetch(
    `https://router.project-osrm.org/route/v1/driving/${coords}?overview=false`,
  );
  const data = await res.json();
  if (data.code !== "Ok" || !data.routes?.[0]) return 0;
  return Math.round((data.routes[0].distance / 1000) * 10) / 10;
}
