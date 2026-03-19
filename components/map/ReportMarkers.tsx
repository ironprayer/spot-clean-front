"use client";

import { Marker } from "@react-google-maps/api";
import { getMarkerIcon, getDotIcon, getActiveMarkerIcon, getActiveDotIcon } from "./MarkerPin";
import { useMapStore } from "@/store/mapStore";
import type { Report } from "@/types/report";

// zoom >= ICON_ZOOM_THRESHOLD → 아이콘, 미만 → 점
const ICON_ZOOM_THRESHOLD = 14;

interface ReportMarkersProps {
  reports: Report[];
  zoom: number;
  onMarkerClick: (report: Report) => void;
}

export default function ReportMarkers({ reports, zoom, onMarkerClick }: ReportMarkersProps) {
  const { statusFilter, activeCleanup } = useMapStore();
  const useIcons = zoom >= ICON_ZOOM_THRESHOLD;

  const visible = activeCleanup
    ? reports.filter((r) => r.id === activeCleanup.id)
    : statusFilter === "all"
    ? reports
    : reports.filter((r) => r.status === statusFilter);

  return (
    <>
      {visible.map((report) => {
        const isActive = activeCleanup?.id === report.id;
        return (
          <Marker
            key={report.id}
            position={{ lat: report.latitude, lng: report.longitude }}
            icon={
              isActive
                ? useIcons
                  ? getActiveMarkerIcon()
                  : getActiveDotIcon()
                : useIcons
                ? getMarkerIcon(report.status)
                : getDotIcon(report.status)
            }
            zIndex={isActive ? 10 : 1}
            onClick={() => onMarkerClick(report)}
          />
        );
      })}
    </>
  );
}
