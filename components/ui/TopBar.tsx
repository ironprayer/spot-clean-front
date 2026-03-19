"use client";

export default function TopBar() {
  return (
    <div className="flex items-center gap-2 bg-white/85 backdrop-blur-xl rounded-2xl shadow-md px-4 py-3 border border-white/60 pointer-events-auto">
      {/* Logo */}
      <div className="w-8 h-8 bg-green-500 rounded-xl flex items-center justify-center shrink-0">
        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 008 20C19 20 22 3 22 3c-1 2-8 2-8 2 2.5-2.5 5-4 5-4-2 0-7 2-8 8-.5-.5-1.5-2.5 0-6-3 1.5-4 6.5-4 6.5-1 0-1.5-.5-1.5-.5C2 11 3 9 3 8.5 1 10 .5 14 2 16c-.5 1-1 3-1 3 0 0 3-1 4-3z"/>
        </svg>
      </div>

      <span className="text-base font-bold text-gray-900 flex-1 tracking-tight">Spot Clean</span>

      {/* Search */}
      <button
        className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 active:bg-gray-200 transition-colors"
        aria-label="검색"
      >
        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>

      {/* Notification */}
      <button
        className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 active:bg-gray-200 transition-colors relative"
        aria-label="알림"
      >
        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-1 ring-white" />
      </button>
    </div>
  );
}
