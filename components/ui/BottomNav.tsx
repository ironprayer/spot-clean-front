"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type NavTab = "map" | "list" | "stats" | "my";

interface NavItem {
  key: NavTab;
  label: string;
  icon: React.ReactNode;
}

function MapIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6-3V7m6 16l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4" />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M4 6h16M4 10h16M4 14h16M4 18h16" />
    </svg>
  );
}

function StatsIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );
}

function PersonIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}

const NAV_ITEMS: NavItem[] = [
  { key: "map", label: "지도", icon: <MapIcon /> },
  { key: "list", label: "목록", icon: <ListIcon /> },
  { key: "stats", label: "통계", icon: <StatsIcon /> },
  { key: "my", label: "마이", icon: <PersonIcon /> },
];

export default function BottomNav() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<NavTab>("map");

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white/90 backdrop-blur-xl border-t border-gray-100 shadow-2xl">
      <div className="relative flex items-end justify-around px-2 pt-3 pb-safe">
        {/* Left two items */}
        {NAV_ITEMS.slice(0, 2).map((item) => (
          <NavButton
            key={item.key}
            item={item}
            active={activeTab === item.key}
            onPress={() => setActiveTab(item.key)}
          />
        ))}

        {/* Center FAB placeholder */}
        <div className="w-16 flex-shrink-0 flex flex-col items-center pb-1">
          <span className="text-[10px] text-gray-400 mt-8">신고</span>
        </div>

        {/* Right two items */}
        {NAV_ITEMS.slice(2).map((item) => (
          <NavButton
            key={item.key}
            item={item}
            active={activeTab === item.key}
            onPress={() => setActiveTab(item.key)}
          />
        ))}
      </div>

      {/* Center FAB — protrudes above nav */}
      <div className="absolute left-1/2 -translate-x-1/2 -top-6">
        <button
          onClick={() => router.push("/report")}
          className="w-14 h-14 bg-green-500 hover:bg-green-600 active:bg-green-700 rounded-full shadow-xl flex items-center justify-center ring-4 ring-white transition-colors"
          aria-label="쓰레기 신고하기"
        >
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    </nav>
  );
}

interface NavButtonProps {
  item: NavItem;
  active: boolean;
  onPress: () => void;
}

function NavButton({ item, active, onPress }: NavButtonProps) {
  return (
    <button
      onClick={onPress}
      className={`flex flex-col items-center gap-0.5 px-4 py-1 rounded-xl transition-colors ${
        active ? "text-green-600" : "text-gray-400 hover:text-gray-600"
      }`}
    >
      {item.icon}
      <span className={`text-[10px] font-medium ${active ? "text-green-600" : "text-gray-400"}`}>
        {item.label}
      </span>
    </button>
  );
}
