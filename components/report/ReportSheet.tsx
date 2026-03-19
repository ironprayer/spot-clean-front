"use client";

import { useEffect, useRef } from "react";
import type { Report, ReportStatus } from "@/types/report";

interface ReportSheetProps {
  report: Report | null;
  onClose: () => void;
  onStartCleanup: (report: Report) => void;
}

const STATUS_LABEL: Record<ReportStatus, string> = {
  reported: "신고됨",
  inProgress: "처리 중",
  completed: "완료",
};

const STATUS_COLOR: Record<ReportStatus, string> = {
  reported: "text-red-600 bg-red-50",
  inProgress: "text-orange-600 bg-orange-50",
  completed: "text-green-600 bg-green-50",
};

function formatDate(date: Date): string {
  return (
    `${date.getFullYear()}.` +
    `${String(date.getMonth() + 1).padStart(2, "0")}.` +
    `${String(date.getDate()).padStart(2, "0")} ` +
    `${String(date.getHours()).padStart(2, "0")}:` +
    `${String(date.getMinutes()).padStart(2, "0")}`
  );
}

export default function ReportSheet({ report, onClose, onStartCleanup }: ReportSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);

  // Close on backdrop click
  useEffect(() => {
    if (!report) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [report, onClose]);

  if (!report) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 z-40"
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        ref={sheetRef}
        className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-xl p-4 pb-safe"
        role="dialog"
        aria-modal="true"
      >
        {/* Handle bar */}
        <div className="flex justify-center mb-4">
          <div className="w-10 h-1 rounded-full bg-gray-300" />
        </div>

        {/* Content */}
        <div className="flex gap-4 mb-4">
          {/* Thumbnail */}
          <div className="w-20 h-20 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
            {report.thumbnailUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={report.thumbnailUrl}
                alt="신고 사진"
                className="w-full h-full object-cover"
              />
            ) : (
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col gap-2 flex-1">
            <span
              className={`self-start text-xs font-bold px-2 py-1 rounded ${STATUS_COLOR[report.status]}`}
            >
              {STATUS_LABEL[report.status]}
            </span>
            <div>
              <p className="text-xs text-gray-500">신고 일시</p>
              <p className="text-sm font-medium">{formatDate(report.reportedAt)}</p>
            </div>
            {report.completedAt && (
              <div>
                <p className="text-xs text-gray-500">완료 일시</p>
                <p className="text-sm font-medium">{formatDate(report.completedAt)}</p>
              </div>
            )}
          </div>
        </div>

        {/* CTA — only for reported status */}
        {report.status === "reported" && (
          <button
            onClick={() => onStartCleanup(report)}
            className="w-full py-3 bg-green-500 hover:bg-green-600 active:bg-green-700 text-white font-semibold rounded-xl transition-colors"
          >
            줍기 시작
          </button>
        )}

        {/* Safe area bottom spacer */}
        <div className="h-4" />
      </div>
    </>
  );
}
