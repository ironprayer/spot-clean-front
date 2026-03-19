"use client";

import { useCallback, useState } from "react";
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
import ActiveCleanupBanner from "@/components/ui/ActiveCleanupBanner";
import CompleteCleanupSheet from "@/components/ui/CompleteCleanupSheet";
import { apiClient } from "@/lib/apiClient";
import type { Report } from "@/types/report";
import mapStyleJson from "@/public/map_style.json";

export default function Home() {
  // Initialize all data sources
  useGuestId();
  useGeolocation();
  useReports();
  useZoneStats();

  const {
    isLoading,
    selectedReport,
    setSelectedReport,
    guestId,
    activeCleanup,
    cleanupStartedAt,
    setActiveCleanup,
    setCleanupStartedAt,
    updateReportStatus,
  } = useMapStore();

  const [showCompleteSheet, setShowCompleteSheet] = useState(false);

  const handleReportClick = useCallback(
    (report: Report) => setSelectedReport(report),
    [setSelectedReport]
  );

  const handleCloseSheet = useCallback(
    () => setSelectedReport(null),
    [setSelectedReport]
  );

  const handleStartCleanup = useCallback(
    async (report: Report) => {
      setSelectedReport(null);
      try {
        await apiClient.patch(
          `/reports/${report.id}/status`,
          { status: "inProgress" },
          guestId ?? undefined
        );
      } catch {
        // Proceed optimistically even if API fails
      }
      updateReportStatus(report.id, "inProgress");
      setActiveCleanup(report);
      setCleanupStartedAt(Date.now());
    },
    [setSelectedReport, guestId, updateReportStatus, setActiveCleanup, setCleanupStartedAt]
  );

  const handleCompleteCleanup = useCallback(async () => {
    if (!activeCleanup) return;
    try {
      await apiClient.patch(
        `/reports/${activeCleanup.id}/status`,
        { status: "completed" },
        guestId ?? undefined
      );
    } catch {
      // Proceed optimistically even if API fails
    }
    updateReportStatus(activeCleanup.id, "completed");
    setActiveCleanup(null);
    setCleanupStartedAt(null);
  }, [activeCleanup, guestId, updateReportStatus, setActiveCleanup, setCleanupStartedAt]);

  const handleCompleteConfirm = useCallback(async () => {
    setShowCompleteSheet(false);
    await handleCompleteCleanup();
  }, [handleCompleteCleanup]);

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

      {activeCleanup && cleanupStartedAt !== null && (
        <ActiveCleanupBanner
          report={activeCleanup}
          startedAt={cleanupStartedAt}
          onComplete={() => setShowCompleteSheet(true)}
        />
      )}

      {showCompleteSheet && cleanupStartedAt !== null && (
        <CompleteCleanupSheet
          elapsedMs={Date.now() - cleanupStartedAt}
          onConfirm={handleCompleteConfirm}
          onClose={() => setShowCompleteSheet(false)}
        />
      )}

      <ReportSheet
        report={selectedReport}
        onClose={handleCloseSheet}
        onStartCleanup={handleStartCleanup}
      />
    </main>
  );
}
