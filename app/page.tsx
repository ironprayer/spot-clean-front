"use client";

import { useCallback } from "react";
import { useMapStore } from "@/store/mapStore";
import { useGuestId } from "@/hooks/useGuestId";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useReports } from "@/hooks/useReports";
import { useZoneStats } from "@/hooks/useZoneStats";
import MapView from "@/components/map/MapView";
import ReportSheet from "@/components/report/ReportSheet";
import SplashScreen from "@/components/ui/SplashScreen";
import TopBar from "@/components/ui/TopBar";
import FilterChips from "@/components/ui/FilterChips";
import BottomNav from "@/components/ui/BottomNav";
import type { Report } from "@/types/report";
import mapStyleJson from "@/public/map_style.json";

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
      <MapView mapStyle={mapStyleJson as google.maps.MapTypeStyle[]} onReportClick={handleReportClick} />

      {/* Top overlay: TopBar + FilterChips */}
      <div className="fixed top-0 left-0 right-0 z-30 pt-safe pointer-events-none">
        <div className="px-4 pt-3 flex flex-col gap-2">
          <TopBar />
          <FilterChips />
        </div>
      </div>

      <BottomNav />

      <ReportSheet
        report={selectedReport}
        onClose={handleCloseSheet}
        onStartCleanup={handleStartCleanup}
      />
    </main>
  );
}
