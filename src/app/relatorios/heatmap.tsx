"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";

export function HeatmapCard({ points }: { points: { lat: number; lng: number }[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const heatRef = useRef<L.Layer | null>(null);
  const pointsRef = useRef(points);

  useEffect(() => {
    pointsRef.current = points;
  }, [points]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = L.map(containerRef.current).setView([-14.235, -51.9253], 4);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(map);
    mapRef.current = map;

    function renderHeat() {
      if (heatRef.current) {
        map.removeLayer(heatRef.current);
        heatRef.current = null;
      }
      const pts = pointsRef.current;
      // ponytail: container can still be zero-size right after mount (tab not yet visible,
      // layout not settled); skip and let the next resize/point update retry.
      if (pts.length === 0 || map.getSize().x === 0 || map.getSize().y === 0) return;
      const latLngs = pts.map((p): [number, number] => [p.lat, p.lng]);
      // ponytail: leaflet.heat has no official types, cast to access L.heatLayer
      heatRef.current = (L as any).heatLayer(latLngs, { radius: 22, blur: 18 }).addTo(map);
      map.fitBounds(L.latLngBounds(latLngs), { padding: [24, 24], maxZoom: 15 });
    }

    const resizeObserver = new ResizeObserver((entries) => {
      const { width, height } = entries[0]?.contentRect ?? { width: 0, height: 0 };
      // ponytail: a transient zero-size read (tab hidden mid-layout) would otherwise
      // make Leaflet recompute its pixel origin around (0,0) and reset the view
      if (width === 0 || height === 0) return;
      map.invalidateSize();
      if (!heatRef.current) renderHeat();
    });
    resizeObserver.observe(containerRef.current);
    (map as unknown as { __renderHeat: () => void }).__renderHeat = renderHeat;
    renderHeat();

    return () => {
      resizeObserver.disconnect();
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current as unknown as { __renderHeat?: () => void } | null;
    map?.__renderHeat?.();
  }, [points]);

  return <div ref={containerRef} className="h-80 w-full rounded-md" />;
}
