"use client";

import { Marker } from "@react-google-maps/api";
import { getMarkerIcon } from "./MarkerPin";
import type { Report } from "@/types/report";

interface ReportMarkersProps {
  reports: Report[];
  onMarkerClick: (report: Report) => void;
}

export default function ReportMarkers({ reports, onMarkerClick }: ReportMarkersProps) {
  return (
    <>
      {reports.map((report) => (
        <Marker
          key={report.id}
          position={{ lat: report.latitude, lng: report.longitude }}
          icon={getMarkerIcon(report.status)}
          onClick={() => onMarkerClick(report)}
        />
      ))}
    </>
  );
}
