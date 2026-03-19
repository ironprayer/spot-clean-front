"use client";

import { useCallback, useEffect, useRef } from "react";
import { GoogleMap, OverlayView, Circle } from "@react-google-maps/api";

const MAP_CONTAINER_STYLE = { width: "100%", height: "100%" };
const RADIUS_M = 300;

export interface PhotoMapPoint {
  preview: string;
  lat: number;
  lng: number;
  hasError: boolean;
}

interface MiniMapProps {
  currentPosition: { lat: number; lng: number };
  photos: PhotoMapPoint[];
}

export default function MiniMap({ currentPosition, photos }: MiniMapProps) {
  const mapRef = useRef<google.maps.Map | null>(null);

  const fitBounds = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;

    if (photos.length === 0) {
      map.setCenter(currentPosition);
      map.setZoom(17);
      return;
    }

    const bounds = new google.maps.LatLngBounds();
    bounds.extend(currentPosition);
    photos.forEach((p) => bounds.extend({ lat: p.lat, lng: p.lng }));
    map.fitBounds(bounds, 56);
  }, [currentPosition, photos]);

  const onLoad = useCallback(
    (map: google.maps.Map) => {
      mapRef.current = map;
      fitBounds();
    },
    [fitBounds]
  );

  // 사진 추가/제거 시 지도 범위 재조정
  useEffect(() => {
    fitBounds();
  }, [fitBounds]);

  return (
    <GoogleMap
      mapContainerStyle={MAP_CONTAINER_STYLE}
      center={currentPosition}
      zoom={17}
      onLoad={onLoad}
      options={{
        disableDefaultUI: true,
        zoomControl: false,
        gestureHandling: "cooperative",
        clickableIcons: false,
        styles: [
          { featureType: "poi", stylers: [{ visibility: "off" }] },
          { featureType: "transit", stylers: [{ visibility: "off" }] },
        ],
      }}
    >
      {/* 300m 반경 원 */}
      <Circle
        center={currentPosition}
        radius={RADIUS_M}
        options={{
          fillColor: "#22c55e",
          fillOpacity: 0.07,
          strokeColor: "#22c55e",
          strokeOpacity: 0.6,
          strokeWeight: 1.5,
        }}
      />

      {/* 현재 위치 마커 */}
      <OverlayView
        position={currentPosition}
        mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
        getPixelPositionOffset={() => ({ x: -12, y: -12 })}
      >
        <div className="w-6 h-6 relative">
          <div className="absolute inset-0 bg-green-400 rounded-full opacity-40 animate-ping" />
          <div className="absolute inset-[4px] bg-green-500 rounded-full border-2 border-white shadow-md" />
        </div>
      </OverlayView>

      {/* 사진 위치 마커 */}
      {photos.map((photo, i) => (
        <OverlayView
          key={i}
          position={{ lat: photo.lat, lng: photo.lng }}
          mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
          getPixelPositionOffset={(w) => ({ x: -(w / 2), y: -60 })}
        >
          <div className="flex flex-col items-center">
            {/* 사진 썸네일 */}
            <div
              className={`w-12 h-12 rounded-xl overflow-hidden border-2 shadow-lg ${
                photo.hasError ? "border-red-400" : "border-white"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo.preview} alt="" className="w-full h-full object-cover" />
            </div>

            {/* 말풍선 꼬리 */}
            <div
              className={`w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent ${
                photo.hasError ? "border-t-red-400" : "border-t-white"
              }`}
            />
          </div>
        </OverlayView>
      ))}
    </GoogleMap>
  );
}
