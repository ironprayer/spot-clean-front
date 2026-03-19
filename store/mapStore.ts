import { create } from "zustand";
import type { Report, ReportStatus } from "@/types/report";
import type { ZoneStat } from "@/types/zoneStat";

export type StatusFilter = "all" | ReportStatus;

interface MapState {
  guestId: string | null;
  currentPosition: { lat: number; lng: number };
  locationError: string | null;
  overlayOpacity: number;
  zones: ZoneStat[];
  reports: Report[];
  selectedReport: Report | null;
  isLoading: boolean;
  statusFilter: StatusFilter;
  activeCleanup: Report | null;
  cleanupStartedAt: number | null;

  setGuestId: (id: string) => void;
  setCurrentPosition: (pos: { lat: number; lng: number }) => void;
  setLocationError: (error: string | null) => void;
  setOverlayOpacity: (opacity: number) => void;
  setZones: (zones: ZoneStat[]) => void;
  setReports: (reports: Report[]) => void;
  setSelectedReport: (report: Report | null) => void;
  setIsLoading: (loading: boolean) => void;
  setStatusFilter: (filter: StatusFilter) => void;
  setActiveCleanup: (report: Report | null) => void;
  setCleanupStartedAt: (ts: number | null) => void;
  updateReportStatus: (id: string, status: ReportStatus) => void;
}

export const useMapStore = create<MapState>((set) => ({
  guestId: null,
  currentPosition: { lat: 37.5665, lng: 126.978 }, // Seoul fallback
  locationError: null,
  overlayOpacity: 0.4,
  zones: [],
  reports: [],
  selectedReport: null,
  isLoading: true,
  statusFilter: "all",
  activeCleanup: null,
  cleanupStartedAt: null,

  setGuestId: (id) => set({ guestId: id }),
  setCurrentPosition: (pos) => set({ currentPosition: pos }),
  setLocationError: (error) => set({ locationError: error }),
  setOverlayOpacity: (opacity) => set({ overlayOpacity: opacity }),
  setZones: (zones) => set({ zones }),
  setReports: (reports) => set({ reports }),
  setSelectedReport: (report) => set({ selectedReport: report }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setStatusFilter: (filter) => set({ statusFilter: filter }),
  setActiveCleanup: (report) => set({ activeCleanup: report }),
  setCleanupStartedAt: (ts) => set({ cleanupStartedAt: ts }),
  updateReportStatus: (id, status) =>
    set((state) => ({
      reports: state.reports.map((r) => (r.id === id ? { ...r, status } : r)),
    })),
}));
