"use client";

import { Marker } from "@react-google-maps/api";
import { getMarkerIcon, getDotIcon } from "./MarkerPin";
import type { Report } from "@/types/report";

// zoom >= ICON_ZOOM_THRESHOLD → 아이콘, 미만 → 점
const ICON_ZOOM_THRESHOLD = 14;

interface ReportMarkersProps {
  reports: Report[];
  zoom: number;
  onMarkerClick: (report: Report) => void;
}

export default function ReportMarkers({ reports, zoom, onMarkerClick }: ReportMarkersProps) {
  const useIcons = zoom >= ICON_ZOOM_THRESHOLD;

  return (
    <>
      {reports.map((report) => (
        <Marker
          key={report.id}
          position={{ lat: report.latitude, lng: report.longitude }}
          icon={useIcons ? getMarkerIcon(report.status) : getDotIcon(report.status)}
          onClick={() => onMarkerClick(report)}
        />
      ))}
    </>
  );
}
