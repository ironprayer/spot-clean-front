import type { ReportStatus } from "@/types/report";

interface MarkerIcon {
  url: string;
  anchor: google.maps.Point;
  scaledSize: google.maps.Size;
}

const STATUS_COLORS: Record<ReportStatus, string> = {
  reported: "#ef4444",
  inProgress: "#f97316",
  completed: "#22c55e",
};

// SVG pin matching the Flutter Canvas marker shape:
// circle head + triangle tail + white inner circle
function buildSvgPin(color: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="52" viewBox="0 0 48 52">
    <!-- Triangle tail -->
    <polygon points="12,16 24,48 36,16" fill="${color}" />
    <!-- Circle head -->
    <circle cx="24" cy="16" r="16" fill="${color}" />
    <!-- White inner circle -->
    <circle cx="24" cy="16" r="8" fill="white" />
  </svg>`;
  return svg;
}

export function getMarkerIcon(status: ReportStatus): MarkerIcon {
  const color = STATUS_COLORS[status];
  const svg = buildSvgPin(color);
  return {
    url: `data:image/svg+xml,${encodeURIComponent(svg)}`,
    // anchor at pin tip (bottom center)
    anchor: new google.maps.Point(24, 52),
    scaledSize: new google.maps.Size(48, 52),
  };
}
