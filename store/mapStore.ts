import { create } from "zustand";
import type { Report, ReportStatus } from "@/types/report";
import type { ZoneStat } from "@/types/zoneStat";

export type StatusFilter = "all" | ReportStatus;

interface MapState {
  guestId: string | null;
  currentPosition: { lat: number; lng: number };
  overlayOpacity: number;
  zones: ZoneStat[];
  reports: Report[];
  selectedReport: Report | null;
  isLoading: boolean;
  statusFilter: StatusFilter;

  setGuestId: (id: string) => void;
  setCurrentPosition: (pos: { lat: number; lng: number }) => void;
  setOverlayOpacity: (opacity: number) => void;
  setZones: (zones: ZoneStat[]) => void;
  setReports: (reports: Report[]) => void;
  setSelectedReport: (report: Report | null) => void;
  setIsLoading: (loading: boolean) => void;
  setStatusFilter: (filter: StatusFilter) => void;
}

export const useMapStore = create<MapState>((set) => ({
  guestId: null,
  currentPosition: { lat: 37.5665, lng: 126.978 }, // Seoul fallback
  overlayOpacity: 0.4,
  zones: [],
  reports: [],
  selectedReport: null,
  isLoading: true,
  statusFilter: "all",

  setGuestId: (id) => set({ guestId: id }),
  setCurrentPosition: (pos) => set({ currentPosition: pos }),
  setOverlayOpacity: (opacity) => set({ overlayOpacity: opacity }),
  setZones: (zones) => set({ zones }),
  setReports: (reports) => set({ reports }),
  setSelectedReport: (report) => set({ selectedReport: report }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setStatusFilter: (filter) => set({ statusFilter: filter }),
}));
