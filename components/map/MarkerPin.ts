import type { ReportStatus } from "@/types/report";

interface MarkerIcon {
  url: string;
  anchor: google.maps.Point;
  scaledSize: google.maps.Size;
}

// ── Zoom-in icons (emoji-style SVGs) ──────────────────────────────────────────

function buildTreeIcon(): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="44" viewBox="0 0 40 44">
    <rect x="17" y="31" width="6" height="11" rx="1" fill="#92400e"/>
    <polygon points="20,26 34,30 6,30" fill="#22c55e"/>
    <polygon points="20,19 32,24 8,24" fill="#16a34a"/>
    <polygon points="20,12 30,18 10,18" fill="#15803d"/>
    <polygon points="20,4 27,12 13,12" fill="#166534"/>
  </svg>`;
}

function buildPickerIcon(): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="44" viewBox="0 0 40 44">
    <!-- Head -->
    <circle cx="22" cy="7" r="5" fill="#f97316"/>
    <!-- Torso -->
    <line x1="22" y1="12" x2="18" y2="24" stroke="#f97316" stroke-width="3" stroke-linecap="round"/>
    <!-- Left arm (holding stick) -->
    <line x1="22" y1="16" x2="10" y2="22" stroke="#f97316" stroke-width="2.5" stroke-linecap="round"/>
    <!-- Right arm -->
    <line x1="22" y1="16" x2="28" y2="20" stroke="#f97316" stroke-width="2.5" stroke-linecap="round"/>
    <!-- Left leg -->
    <line x1="18" y1="24" x2="14" y2="36" stroke="#f97316" stroke-width="2.5" stroke-linecap="round"/>
    <!-- Right leg (bent, picking up) -->
    <line x1="18" y1="24" x2="26" y2="30" stroke="#f97316" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="26" y1="30" x2="22" y2="38" stroke="#f97316" stroke-width="2.5" stroke-linecap="round"/>
    <!-- Picker stick -->
    <line x1="10" y1="22" x2="6" y2="38" stroke="#78716c" stroke-width="2" stroke-linecap="round"/>
    <!-- Trash at bottom of stick -->
    <circle cx="6" cy="39" r="3" fill="#78716c"/>
  </svg>`;
}

function buildTrashIcon(): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="44" viewBox="0 0 40 44">
    <!-- Handle -->
    <path d="M15 8 Q15 4 20 4 Q25 4 25 8" stroke="#dc2626" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <!-- Lid -->
    <rect x="8" y="9" width="24" height="5" rx="2" fill="#dc2626"/>
    <!-- Body -->
    <path d="M11 14 L13 38 Q13 40 15 40 L25 40 Q27 40 27 38 L29 14 Z" fill="#ef4444"/>
    <!-- Lines -->
    <line x1="17" y1="18" x2="16" y2="36" stroke="white" stroke-width="1.5" stroke-linecap="round" opacity="0.7"/>
    <line x1="20" y1="18" x2="20" y2="36" stroke="white" stroke-width="1.5" stroke-linecap="round" opacity="0.7"/>
    <line x1="23" y1="18" x2="24" y2="36" stroke="white" stroke-width="1.5" stroke-linecap="round" opacity="0.7"/>
  </svg>`;
}

// ── Zoom-out dots ─────────────────────────────────────────────────────────────

const DOT_COLORS: Record<ReportStatus, string> = {
  completed: "#22c55e",
  inProgress: "#eab308",
  reported: "#ef4444",
};

function buildDot(color: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
    <circle cx="8" cy="8" r="6" fill="${color}" stroke="white" stroke-width="2"/>
  </svg>`;
}

function buildActiveDot(): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28">
    <circle cx="14" cy="14" r="13" fill="#f97316" opacity="0.25"/>
    <circle cx="14" cy="14" r="8" fill="#f97316" stroke="white" stroke-width="2.5"/>
  </svg>`;
}

function buildActivePickerIcon(): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="56" viewBox="0 0 48 56">
    <!-- Outer pulse ring -->
    <circle cx="24" cy="10" r="14" fill="#fed7aa" opacity="0.5"/>
    <!-- Head -->
    <circle cx="26" cy="8" r="6" fill="#ea580c"/>
    <!-- Torso -->
    <line x1="26" y1="14" x2="22" y2="28" stroke="#ea580c" stroke-width="3.5" stroke-linecap="round"/>
    <!-- Left arm (holding stick) -->
    <line x1="26" y1="19" x2="12" y2="26" stroke="#ea580c" stroke-width="3" stroke-linecap="round"/>
    <!-- Right arm -->
    <line x1="26" y1="19" x2="33" y2="24" stroke="#ea580c" stroke-width="3" stroke-linecap="round"/>
    <!-- Left leg -->
    <line x1="22" y1="28" x2="17" y2="42" stroke="#ea580c" stroke-width="3" stroke-linecap="round"/>
    <!-- Right leg (bent, picking up) -->
    <line x1="22" y1="28" x2="31" y2="36" stroke="#ea580c" stroke-width="3" stroke-linecap="round"/>
    <line x1="31" y1="36" x2="26" y2="46" stroke="#ea580c" stroke-width="3" stroke-linecap="round"/>
    <!-- Picker stick -->
    <line x1="12" y1="26" x2="7" y2="46" stroke="#78716c" stroke-width="2.5" stroke-linecap="round"/>
    <!-- Trash at bottom of stick -->
    <circle cx="7" cy="47" r="4" fill="#78716c"/>
  </svg>`;
}

// ── Public API ────────────────────────────────────────────────────────────────

const ICON_BUILDERS: Record<ReportStatus, () => string> = {
  completed: buildTreeIcon,
  inProgress: buildPickerIcon,
  reported: buildTrashIcon,
};

export function getMarkerIcon(status: ReportStatus): MarkerIcon {
  const svg = ICON_BUILDERS[status]();
  return {
    url: `data:image/svg+xml,${encodeURIComponent(svg)}`,
    anchor: new google.maps.Point(20, 44),
    scaledSize: new google.maps.Size(40, 44),
  };
}

export function getDotIcon(status: ReportStatus): MarkerIcon {
  const svg = buildDot(DOT_COLORS[status]);
  return {
    url: `data:image/svg+xml,${encodeURIComponent(svg)}`,
    anchor: new google.maps.Point(8, 8),
    scaledSize: new google.maps.Size(16, 16),
  };
}

export function getActiveMarkerIcon(): MarkerIcon {
  const svg = buildActivePickerIcon();
  return {
    url: `data:image/svg+xml,${encodeURIComponent(svg)}`,
    anchor: new google.maps.Point(24, 56),
    scaledSize: new google.maps.Size(48, 56),
  };
}

export function getActiveDotIcon(): MarkerIcon {
  const svg = buildActiveDot();
  return {
    url: `data:image/svg+xml,${encodeURIComponent(svg)}`,
    anchor: new google.maps.Point(14, 14),
    scaledSize: new google.maps.Size(28, 28),
  };
}
