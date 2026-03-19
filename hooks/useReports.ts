"use client";

import { useEffect } from "react";
import { useMapStore } from "@/store/mapStore";
import type { Report } from "@/types/report";
import { isReportVisible } from "@/types/report";

// Dummy data matching map_screen.dart
const DUMMY_REPORTS: Report[] = [
  {
    id: "1",
    latitude: 37.5665,
    longitude: 126.978,
    status: "reported",
    reportedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: "2",
    latitude: 37.5675,
    longitude: 126.979,
    status: "inProgress",
    reportedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
  },
  {
    id: "3",
    latitude: 37.5655,
    longitude: 126.977,
    status: "completed",
    reportedAt: new Date(Date.now() - 10 * 60 * 60 * 1000),
    completedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
  },
];

export function useReports() {
  const { setReports, setIsLoading } = useMapStore();

  useEffect(() => {
    // TODO: replace with real API call via apiClient
    const visible = DUMMY_REPORTS.filter(isReportVisible);
    setReports(visible);
    setIsLoading(false);
  }, [setReports, setIsLoading]);
}
