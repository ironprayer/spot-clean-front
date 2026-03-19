"use client";

import { useEffect, useState } from "react";
import type { Report } from "@/types/report";

interface ActiveCleanupBannerProps {
  report: Report;
  startedAt: number;
  onComplete: () => void;
}

function formatElapsed(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export default function ActiveCleanupBanner({
  report,
  startedAt,
  onComplete,
}: ActiveCleanupBannerProps) {
  const [elapsed, setElapsed] = useState(Date.now() - startedAt);

  useEffect(() => {
    const id = setInterval(() => {
      setElapsed(Date.now() - startedAt);
    }, 1000);
    return () => clearInterval(id);
  }, [startedAt]);

  return (
    <div className="fixed bottom-[68px] left-0 right-0 z-20 px-4 pb-2">
      <div className="bg-white rounded-2xl shadow-lg border border-orange-100 flex items-center overflow-hidden">
        {/* Left accent */}
        <div className="w-1 self-stretch bg-orange-400 shrink-0" />

        {/* Text */}
        <div className="flex-1 px-4 py-3">
          <p className="text-xs font-semibold text-orange-500 mb-0.5">줍는 중</p>
          <p className="text-sm text-gray-700 truncate">신고 #{report.id}</p>
        </div>

        {/* Timer */}
        <span className="text-sm font-mono text-gray-500 pr-3">{formatElapsed(elapsed)}</span>

        {/* Complete button */}
        <button
          onClick={onComplete}
          className="mr-3 px-4 py-2 bg-green-500 hover:bg-green-600 active:bg-green-700 text-white text-sm font-semibold rounded-xl transition-colors"
        >
          완료 ✓
        </button>
      </div>
    </div>
  );
}
