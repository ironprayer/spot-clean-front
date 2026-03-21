"use client";

import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import BottomNav from "@/components/ui/BottomNav";

// ── Types ──────────────────────────────────────────────────────────────────────

type TabKey = "cleanup" | "report";
type DateFilter = "all" | "week" | "month";
type ReportStatus = "reported" | "inProgress" | "completed";
type TrashUnit = "개" | "L";

interface CleanupRecord {
  id: string;
  date: Date;
  thumbnailUrl?: string;
  trashCount: number;
  trashUnit: TrashUnit;
  zone: string;
  notes?: string;
}

interface ReportRecord {
  id: string;
  date: Date;
  status: ReportStatus;
  thumbnailUrl?: string;
  zone: string;
}

interface MyStats {
  totalCleanups: number;
  totalTrashCount: number;   // 개
  totalTrashL: number;        // L
  activeZones: number;
  streakDays: number;
}

// ── Dummy data ─────────────────────────────────────────────────────────────────

function daysAgo(n: number) {
  return new Date(Date.now() - n * 86400_000);
}

const CLEANUP_RECORDS: CleanupRecord[] = [
  { id: "c1",  date: daysAgo(0),  trashCount: 43, trashUnit: "개", zone: "마포구 상암동", notes: "공원 입구 쪽이 깨끗해졌다!" },
  { id: "c2",  date: daysAgo(1),  trashCount: 2.5, trashUnit: "L",  zone: "서대문구 홍제동" },
  { id: "c3",  date: daysAgo(2),  trashCount: 17, trashUnit: "개", zone: "은평구 불광동", notes: "비 온 다음 날이라 유리 파편이 많았음" },
  { id: "c4",  date: daysAgo(5),  trashCount: 30, trashUnit: "개", zone: "마포구 망원동" },
  { id: "c5",  date: daysAgo(7),  trashCount: 1.0, trashUnit: "L",  zone: "용산구 한남동" },
  { id: "c6",  date: daysAgo(9),  trashCount: 55, trashUnit: "개", zone: "종로구 혜화동", notes: "대학로 공연 후 쓰레기가 많았음. 혼자서 55개 수거 😤" },
  { id: "c7",  date: daysAgo(12), trashCount: 22, trashUnit: "개", zone: "마포구 합정동" },
  { id: "c8",  date: daysAgo(14), trashCount: 3.0, trashUnit: "L",  zone: "성동구 성수동" },
  { id: "c9",  date: daysAgo(16), trashCount: 11, trashUnit: "개", zone: "은평구 불광동" },
  { id: "c10", date: daysAgo(20), trashCount: 38, trashUnit: "개", zone: "마포구 상암동", notes: "주말 행사 뒤라 엄청 많았다. 그래도 뿌듯!" },
  { id: "c11", date: daysAgo(23), trashCount: 9,  trashUnit: "개", zone: "서대문구 홍제동" },
  { id: "c12", date: daysAgo(28), trashCount: 2.0, trashUnit: "L",  zone: "종로구 혜화동" },
  { id: "c13", date: daysAgo(31), trashCount: 14, trashUnit: "개", zone: "마포구 망원동" },
  { id: "c14", date: daysAgo(35), trashCount: 27, trashUnit: "개", zone: "용산구 이태원동", notes: "이태원 골목길 구석구석" },
  { id: "c15", date: daysAgo(40), trashCount: 6,  trashUnit: "개", zone: "성동구 성수동" },
  { id: "c16", date: daysAgo(44), trashCount: 1.5, trashUnit: "L",  zone: "마포구 합정동" },
  { id: "c17", date: daysAgo(50), trashCount: 33, trashUnit: "개", zone: "은평구 불광동" },
  { id: "c18", date: daysAgo(54), trashCount: 19, trashUnit: "개", zone: "종로구 혜화동" },
  { id: "c19", date: daysAgo(60), trashCount: 41, trashUnit: "개", zone: "마포구 상암동", notes: "아침 6시에 혼자서 한 시간 활동" },
  { id: "c20", date: daysAgo(65), trashCount: 5,  trashUnit: "개", zone: "서대문구 홍제동" },
];

const REPORT_RECORDS: ReportRecord[] = [
  { id: "r1",  date: daysAgo(0),  status: "inProgress", zone: "마포구 상암동" },
  { id: "r2",  date: daysAgo(1),  status: "completed",  zone: "은평구 불광동" },
  { id: "r3",  date: daysAgo(3),  status: "reported",   zone: "서대문구 홍제동" },
  { id: "r4",  date: daysAgo(5),  status: "completed",  zone: "마포구 망원동" },
  { id: "r5",  date: daysAgo(7),  status: "completed",  zone: "용산구 한남동" },
  { id: "r6",  date: daysAgo(10), status: "reported",   zone: "종로구 혜화동" },
  { id: "r7",  date: daysAgo(13), status: "completed",  zone: "마포구 합정동" },
  { id: "r8",  date: daysAgo(17), status: "completed",  zone: "성동구 성수동" },
  { id: "r9",  date: daysAgo(22), status: "completed",  zone: "은평구 불광동" },
  { id: "r10", date: daysAgo(25), status: "inProgress", zone: "마포구 상암동" },
  { id: "r11", date: daysAgo(29), status: "completed",  zone: "서대문구 홍제동" },
  { id: "r12", date: daysAgo(33), status: "reported",   zone: "종로구 혜화동" },
  { id: "r13", date: daysAgo(38), status: "completed",  zone: "마포구 망원동" },
  { id: "r14", date: daysAgo(42), status: "completed",  zone: "용산구 이태원동" },
  { id: "r15", date: daysAgo(48), status: "completed",  zone: "성동구 성수동" },
];

const STATS: MyStats = {
  totalCleanups: CLEANUP_RECORDS.length,
  totalTrashCount: CLEANUP_RECORDS.filter(r => r.trashUnit === "개").reduce((s, r) => s + r.trashCount, 0),
  totalTrashL: CLEANUP_RECORDS.filter(r => r.trashUnit === "L").reduce((s, r) => s + r.trashCount, 0),
  activeZones: new Set(CLEANUP_RECORDS.map(r => r.zone)).size,
  streakDays: 3,
};

// ── Helpers ────────────────────────────────────────────────────────────────────

const PAGE_SIZE = 8;

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

function formatDate(d: Date) {
  const MM = String(d.getMonth() + 1).padStart(2, "0");
  const DD = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${d.getFullYear()}.${MM}.${DD} ${hh}:${mm}`;
}

function applyDateFilter<T extends { date: Date }>(items: T[], filter: DateFilter): T[] {
  if (filter === "all") return items;
  const now = Date.now();
  const cutoff = filter === "week" ? now - 7 * 86400_000 : now - 30 * 86400_000;
  return items.filter(r => r.date.getTime() >= cutoff);
}

// ── Stat Card ──────────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  accent: string;   // tailwind bg color class
  iconPath: string;
}

function StatCard({ label, value, sub, accent, iconPath }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm flex flex-col gap-3">
      <div className={`w-9 h-9 rounded-xl ${accent} flex items-center justify-center`}>
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={iconPath} />
        </svg>
      </div>
      <div>
        <p className="text-[11px] text-gray-400 font-medium mb-0.5">{label}</p>
        <p className="text-2xl font-extrabold text-gray-900 leading-none">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────

export default function MyPage() {
  const [tab, setTab] = useState<TabKey>("cleanup");
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const [cleanupPage, setCleanupPage] = useState(1);
  const [reportPage, setReportPage] = useState(1);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const filteredCleanups = useMemo(
    () => applyDateFilter(CLEANUP_RECORDS, dateFilter),
    [dateFilter]
  );
  const filteredReports = useMemo(
    () => applyDateFilter(REPORT_RECORDS, dateFilter),
    [dateFilter]
  );

  const visibleCleanups = filteredCleanups.slice(0, cleanupPage * PAGE_SIZE);
  const visibleReports  = filteredReports.slice(0, reportPage * PAGE_SIZE);
  const hasMoreCleanups = visibleCleanups.length < filteredCleanups.length;
  const hasMoreReports  = visibleReports.length < filteredReports.length;
  const hasMore = tab === "cleanup" ? hasMoreCleanups : hasMoreReports;

  const loadMore = useCallback(() => {
    if (tab === "cleanup") setCleanupPage(p => p + 1);
    else setReportPage(p => p + 1);
  }, [tab]);

  // Reset pagination when filter changes
  useEffect(() => {
    setCleanupPage(1);
    setReportPage(1);
  }, [dateFilter, tab]);

  // IntersectionObserver for infinite scroll
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasMore) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) loadMore(); },
      { rootMargin: "80px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, loadMore]);

  return (
    <main className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      {/* ── Header ── */}
      <header className="bg-white border-b border-gray-100 px-5 pt-safe shrink-0">
        <div className="py-4">
          <h1 className="text-xl font-extrabold text-gray-900">내 기록</h1>
          <p className="text-xs text-gray-400 mt-0.5">나의 환경 활동 히스토리</p>
        </div>
      </header>

      {/* ── Scrollable content ── */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-4 p-4 pb-28">

          {/* ── Stats grid ── */}
          <div className="grid grid-cols-2 gap-3">
            <StatCard
              label="총 줍기 횟수"
              value={`${STATS.totalCleanups}회`}
              accent="bg-green-500"
              iconPath="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
            <StatCard
              label="총 수거 쓰레기"
              value={`${STATS.totalTrashCount}개`}
              sub={`+ ${STATS.totalTrashL.toFixed(1)}L`}
              accent="bg-orange-500"
              iconPath="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
            <StatCard
              label="활동한 구역"
              value={`${STATS.activeZones}곳`}
              accent="bg-blue-500"
              iconPath="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <StatCard
              label="연속 활동"
              value={`${STATS.streakDays}일`}
              sub="현재 streak 🔥"
              accent="bg-purple-500"
              iconPath="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </div>

          {/* ── Tab + Date filter ── */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-gray-100">
              {([["cleanup", "줍기 기록"], ["report", "신고 기록"]] as [TabKey, string][]).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setTab(key)}
                  className={`flex-1 py-3 text-sm font-semibold transition-colors ${
                    tab === key
                      ? "text-green-600 border-b-2 border-green-500"
                      : "text-gray-400"
                  }`}
                >
                  {label}
                  <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
                    tab === key ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-400"
                  }`}>
                    {key === "cleanup" ? filteredCleanups.length : filteredReports.length}
                  </span>
                </button>
              ))}
            </div>

            {/* Date filter chips */}
            <div className="flex gap-2 px-4 py-3 overflow-x-auto scrollbar-none">
              {([["all", "전체"], ["week", "이번 주"], ["month", "이번 달"]] as [DateFilter, string][]).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setDateFilter(key)}
                  className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                    dateFilter === key
                      ? "bg-green-500 text-white"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* ── Activity list ── */}
          <div className="flex flex-col gap-2">
            {tab === "cleanup" ? (
              visibleCleanups.length > 0 ? (
                visibleCleanups.map(record => (
                  <CleanupItem key={record.id} record={record} />
                ))
              ) : (
                <EmptyState label="줍기 기록이 없습니다" />
              )
            ) : (
              visibleReports.length > 0 ? (
                visibleReports.map(record => (
                  <ReportItem key={record.id} record={record} />
                ))
              ) : (
                <EmptyState label="신고 기록이 없습니다" />
              )
            )}

            {/* Infinite scroll sentinel */}
            {hasMore && <div ref={sentinelRef} className="h-10" />}
            {!hasMore && (visibleCleanups.length > 0 || visibleReports.length > 0) && (
              <p className="text-center text-xs text-gray-300 py-4">모든 기록을 불러왔습니다</p>
            )}
          </div>
        </div>
      </div>

      <BottomNav />
    </main>
  );
}

// ── Cleanup Item ───────────────────────────────────────────────────────────────

function CleanupItem({ record }: { record: CleanupRecord }) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm flex gap-3">
      {/* Thumbnail placeholder */}
      <div className="w-14 h-14 rounded-xl bg-green-50 flex items-center justify-center shrink-0 overflow-hidden">
        {record.thumbnailUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={record.thumbnailUrl} alt="" className="w-full h-full object-cover" />
        ) : (
          <svg className="w-6 h-6 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="text-xs text-gray-400">{formatDate(record.date)}</p>
          <span className="shrink-0 text-sm font-extrabold text-orange-500">
            {record.trashCount}{record.trashUnit}
          </span>
        </div>
        <p className="text-sm font-semibold text-gray-800 mt-0.5 truncate">{record.zone}</p>
        {record.notes && (
          <p className="text-xs text-gray-400 mt-1 leading-relaxed line-clamp-2">{record.notes}</p>
        )}
      </div>
    </div>
  );
}

// ── Report Item ────────────────────────────────────────────────────────────────

function ReportItem({ record }: { record: ReportRecord }) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3">
      {/* Icon */}
      <div className="w-14 h-14 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
        <svg className="w-6 h-6 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-400">{formatDate(record.date)}</p>
        <p className="text-sm font-semibold text-gray-800 mt-0.5 truncate">{record.zone}</p>
      </div>

      {/* Status badge */}
      <span className={`shrink-0 text-xs font-bold px-2.5 py-1 rounded-full ${STATUS_COLOR[record.status]}`}>
        {STATUS_LABEL[record.status]}
      </span>
    </div>
  );
}

// ── Empty State ────────────────────────────────────────────────────────────────

function EmptyState({ label }: { label: string }) {
  return (
    <div className="bg-white rounded-2xl p-10 shadow-sm flex flex-col items-center gap-3 text-center">
      <svg className="w-12 h-12 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
      <p className="text-sm text-gray-400">{label}</p>
    </div>
  );
}
