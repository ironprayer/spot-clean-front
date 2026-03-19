"use client";

import { useCallback } from "react";
import { LoadScript } from "@react-google-maps/api";
import { useMapStore } from "@/store/mapStore";
import { useGuestId } from "@/hooks/useGuestId";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useReports } from "@/hooks/useReports";
import { useZoneStats } from "@/hooks/useZoneStats";
import MapView from "@/components/map/MapView";
import ReportSheet from "@/components/report/ReportSheet";
import SplashScreen from "@/components/ui/SplashScreen";
import type { Report } from "@/types/report";
import mapStyleJson from "@/public/map_style.json";

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

export default function Home() {
  // Initialize all data sources
  useGuestId();
  useGeolocation();
  useReports();
  useZoneStats();

  const { isLoading, selectedReport, setSelectedReport } = useMapStore();

  const handleReportClick = useCallback(
    (report: Report) => setSelectedReport(report),
    [setSelectedReport]
  );

  const handleCloseSheet = useCallback(
    () => setSelectedReport(null),
    [setSelectedReport]
  );

  const handleStartCleanup = useCallback(
    (report: Report) => {
      setSelectedReport(null);
      // TODO: call API to transition status to inProgress
      console.log("줍기 시작:", report.id);
    },
    [setSelectedReport]
  );

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <main className="h-screen w-screen relative">
      <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} loadingElement={<SplashScreen />}>
        <MapView mapStyle={mapStyleJson as google.maps.MapTypeStyle[]} onReportClick={handleReportClick} />
      </LoadScript>

      <ReportSheet
        report={selectedReport}
        onClose={handleCloseSheet}
        onStartCleanup={handleStartCleanup}
      />
    </main>
  );
}
