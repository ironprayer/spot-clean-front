"use client";

import { useEffect } from "react";
import { useMapStore } from "@/store/mapStore";

const SEOUL = { lat: 37.5665, lng: 126.978 };

export function useGeolocation() {
  const { setCurrentPosition } = useMapStore();

  useEffect(() => {
    if (!navigator.geolocation) {
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCurrentPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      () => {
        // Permission denied or error — fall back to Seoul
        setCurrentPosition(SEOUL);
      }
    );
  }, [setCurrentPosition]);
}
