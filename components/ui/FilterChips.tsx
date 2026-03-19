"use client";

import { useMapStore } from "@/store/mapStore";
import type { StatusFilter } from "@/store/mapStore";

const FILTERS: {
  key: StatusFilter;
  label: string;
  activeClass: string;
  dot?: string;
}[] = [
  { key: "all", label: "전체", activeClass: "bg-gray-800 text-white shadow-sm" },
  {
    key: "reported",
    label: "신고됨",
    activeClass: "bg-red-50 text-red-600 border border-red-200",
    dot: "bg-red-500",
  },
  {
    key: "inProgress",
    label: "진행중",
    activeClass: "bg-yellow-50 text-yellow-700 border border-yellow-200",
    dot: "bg-yellow-400",
  },
  {
    key: "completed",
    label: "완료",
    activeClass: "bg-green-50 text-green-600 border border-green-200",
    dot: "bg-green-500",
  },
];

export default function FilterChips() {
  const { statusFilter, setStatusFilter } = useMapStore();

  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide pointer-events-auto">
      {FILTERS.map(({ key, label, activeClass, dot }) => {
        const active = statusFilter === key;
        return (
          <button
            key={key}
            onClick={() => setStatusFilter(key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all shrink-0 ${
              active
                ? activeClass
                : "bg-white/80 backdrop-blur-sm text-gray-500 border border-gray-200/80 shadow-sm"
            }`}
          >
            {dot && <span className={`w-2 h-2 rounded-full ${dot}`} />}
            {label}
          </button>
        );
      })}
    </div>
  );
}
