"use client";

import { useEffect, useRef } from "react";
import { renderHeatmapTile } from "@/lib/heatmapTile";
import type { ZoneStat } from "@/types/zoneStat";

interface HeatmapOverlayProps {
  map: google.maps.Map | null;
  zones: ZoneStat[];
  opacity: number;
}

export default function HeatmapOverlay({ map, zones, opacity }: HeatmapOverlayProps) {
  const overlayRef = useRef<google.maps.ImageMapType | null>(null);

  // Create ImageMapType once when map and zones are ready
  useEffect(() => {
    if (!map || zones.length === 0) return;

    const zonesSnapshot = zones;

    const imageMapType = new google.maps.ImageMapType({
      getTileUrl(coord, zoom) {
        return renderHeatmapTile(coord.x, coord.y, zoom, zonesSnapshot);
      },
      tileSize: new google.maps.Size(256, 256),
      opacity,
      name: "heatmap",
    });

    map.overlayMapTypes.push(imageMapType);
    overlayRef.current = imageMapType;

    return () => {
      const idx = map.overlayMapTypes.getArray().indexOf(imageMapType);
      if (idx !== -1) map.overlayMapTypes.removeAt(idx);
      overlayRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, zones]);

  // Opacity change: CSS-level via setOpacity — no tile re-request
  useEffect(() => {
    overlayRef.current?.setOpacity(opacity);
  }, [opacity]);

  return null;
}
