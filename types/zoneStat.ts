export interface ZoneStat {
  lat: number;
  lng: number;
  latDelta: number;
  lngDelta: number;
  score: number;
}

export function zoneStatFromJson(json: Record<string, unknown>): ZoneStat {
  return {
    lat: json["lat"] as number,
    lng: json["lng"] as number,
    latDelta: json["lat_delta"] as number,
    lngDelta: json["lng_delta"] as number,
    score: json["score"] as number,
  };
}
