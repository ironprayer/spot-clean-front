"use client";

import { useCallback, useState } from "react";
import { GoogleMap } from "@react-google-maps/api";
import { useMapStore } from "@/store/mapStore";
import HeatmapOverlay from "./HeatmapOverlay";
import ReportMarkers from "./ReportMarkers";
import OpacitySlider from "./OpacitySlider";
import type { Report } from "@/types/report";

const MAP_CONTAINER_STYLE = { width: "100%", height: "100%" };

interface MapViewProps {
  mapStyle: google.maps.MapTypeStyle[];
  onReportClick: (report: Report) => void;
}

export default function MapView({ mapStyle, onReportClick }: MapViewProps) {
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const {
    currentPosition,
    overlayOpacity,
    setOverlayOpacity,
    zones,
    reports,
  } = useMapStore();

  const onLoad = useCallback((map: google.maps.Map) => {
    setMapInstance(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMapInstance(null);
  }, []);

  const handleLocateMe = useCallback(() => {
    if (!navigator.geolocation || !mapInstance) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      mapInstance.panTo({ lat: pos.coords.latitude, lng: pos.coords.longitude });
    });
  }, [mapInstance]);

  return (
    <div className="relative w-full h-full">
      <GoogleMap
        mapContainerStyle={MAP_CONTAINER_STYLE}
        center={currentPosition}
        zoom={15}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          styles: mapStyle,
          disableDefaultUI: true,
          zoomControl: false,
          fullscreenControl: false,
          streetViewControl: false,
          mapTypeControl: false,
        }}
      >
        <ReportMarkers reports={reports} onMarkerClick={onReportClick} />
      </GoogleMap>

      <HeatmapOverlay map={mapInstance} zones={zones} opacity={overlayOpacity} />

      {/* Opacity slider — bottom-left */}
      <div className="absolute left-4 bottom-28">
        <OpacitySlider value={overlayOpacity} onChange={setOverlayOpacity} />
      </div>

      {/* Locate me button — bottom-right FAB */}
      <button
        onClick={handleLocateMe}
        className="absolute right-4 bottom-28 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 active:bg-gray-100 transition-colors"
        aria-label="현재 위치로 이동"
      >
        <svg
          className="w-6 h-6 text-gray-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </button>
    </div>
  );
}
