"use client";

import { useEffect } from "react";
import { useMapStore } from "@/store/mapStore";
import type { ZoneStat } from "@/types/zoneStat";

// Ported from zone_service.dart _buildFixedZones
const CENTER_LAT = 37.5665;
const CENTER_LNG = 126.978;
const DELTA = 0.001;
const GRID_SIZE = 10;
const ORIGIN = 4;

const SCORES: number[][] = [
  [85, 70, 60, 45, 35, 50, 65, 80, 90, 75],
  [72, 55, 40, 28, 20, 35, 55, 70, 85, 68],
  [60, 42, 30, 15, 25, 40, 62, 75, 80, 55],
  [50, 35, 25, 75, 55, 30, 48, 65, 72, 45],
  [40, 28, 18, 55, 25, 42, 60, 70, 65, 38],
  [55, 45, 30, 42, 38, 45, 58, 75, 80, 50],
  [70, 60, 48, 55, 50, 62, 72, 85, 90, 65],
  [80, 72, 65, 70, 65, 75, 82, 90, 95, 78],
  [88, 80, 75, 80, 78, 85, 90, 95, 88, 82],
  [92, 85, 82, 88, 85, 90, 92, 88, 82, 78],
];

function buildFixedZones(): ZoneStat[] {
  const zones: ZoneStat[] = [];
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      zones.push({
        lat: CENTER_LAT + (row - ORIGIN) * DELTA,
        lng: CENTER_LNG + (col - ORIGIN) * DELTA,
        latDelta: DELTA,
        lngDelta: DELTA,
        score: SCORES[row][col],
      });
    }
  }
  return zones;
}

const FIXED_ZONES = buildFixedZones();

export function useZoneStats() {
  const { setZones } = useMapStore();

  useEffect(() => {
    // TODO: replace with real API call via apiClient
    setZones(FIXED_ZONES);
  }, [setZones]);
}
