"use client";

import { useEffect } from "react";

interface CompleteCleanupSheetProps {
  elapsedMs: number;
  onConfirm: () => void;
  onClose: () => void;
}

function formatElapsed(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export default function CompleteCleanupSheet({
  elapsedMs,
  onConfirm,
  onClose,
}: CompleteCleanupSheetProps) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/20 z-40" onClick={onClose} />

      {/* Sheet */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-xl p-4"
        role="dialog"
        aria-modal="true"
      >
        {/* Handle bar */}
        <div className="flex justify-center mb-4">
          <div className="w-10 h-1 rounded-full bg-gray-300" />
        </div>

        <h2 className="text-lg font-bold text-gray-800 mb-1">줍기 완료</h2>
        <p className="text-sm text-gray-500 mb-6">
          수고하셨습니다! 경과 시간:{" "}
          <span className="font-semibold text-gray-700">{formatElapsed(elapsedMs)}</span>
        </p>

        <button
          onClick={onConfirm}
          className="w-full py-3 bg-green-500 hover:bg-green-600 active:bg-green-700 text-white font-semibold rounded-xl transition-colors"
        >
          완료하기
        </button>

        <div className="h-4" />
      </div>
    </>
  );
}
