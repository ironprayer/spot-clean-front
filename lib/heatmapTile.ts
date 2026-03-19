import type { ZoneStat } from "@/types/zoneStat";

const TILE_SIZE = 256;

// Ported from heatmap_tile_provider.dart
function lngToPixelX(lng: number, worldSize: number): number {
  return ((lng + 180.0) / 360.0) * worldSize;
}

function latToPixelY(lat: number, worldSize: number): number {
  const sinLat = Math.sin((lat * Math.PI) / 180.0);
  return (0.5 - Math.log((1 + sinLat) / (1 - sinLat)) / (4 * Math.PI)) * worldSize;
}

// HSV to RGB — matches Flutter HSVColor.fromAHSV(1.0, hue, 0.9, 0.85)
function hsvToRgb(h: number, s: number, v: number): [number, number, number] {
  const hi = Math.floor(h / 60) % 6;
  const f = h / 60 - Math.floor(h / 60);
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);

  let r: number, g: number, b: number;
  switch (hi) {
    case 0: [r, g, b] = [v, t, p]; break;
    case 1: [r, g, b] = [q, v, p]; break;
    case 2: [r, g, b] = [p, v, t]; break;
    case 3: [r, g, b] = [p, q, v]; break;
    case 4: [r, g, b] = [t, p, v]; break;
    default: [r, g, b] = [v, p, q];
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

/**
 * Renders a single heatmap tile to a data URI.
 * Tiles are rendered at full opacity (center=1.0 → edge=0.0 radial fade).
 * Overall opacity is controlled by ImageMapType.setOpacity() — no tile re-render needed.
 */
export function renderHeatmapTile(
  tileX: number,
  tileY: number,
  zoom: number,
  zones: ZoneStat[]
): string {
  const worldSize = TILE_SIZE * Math.pow(2, zoom);

  const canvas = document.createElement("canvas");
  canvas.width = TILE_SIZE;
  canvas.height = TILE_SIZE;
  const ctx = canvas.getContext("2d")!;

  for (const zone of zones) {
    const cx = lngToPixelX(zone.lng, worldSize) - tileX * TILE_SIZE;
    const cy = latToPixelY(zone.lat, worldSize) - tileY * TILE_SIZE;
    const r = Math.min(
      Math.max((zone.lngDelta / 360.0) * worldSize, 20),
      150
    );

    if (cx + r < 0 || cx - r > TILE_SIZE || cy + r < 0 || cy - r > TILE_SIZE) {
      continue;
    }

    // score 0→red(0°), 100→green(120°) — same as Flutter hue = score * 1.2
    const hue = zone.score * 1.2;
    const [red, green, blue] = hsvToRgb(hue, 0.9, 0.85);

    const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    gradient.addColorStop(0, `rgba(${red},${green},${blue},1)`);
    gradient.addColorStop(1, `rgba(${red},${green},${blue},0)`);

    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
  }

  return canvas.toDataURL("image/png");
}
