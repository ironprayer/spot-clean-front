export type ReportStatus = "reported" | "inProgress" | "completed";

export interface Report {
  id: string;
  latitude: number;
  longitude: number;
  status: ReportStatus;
  thumbnailUrl?: string;
  reportedAt: Date;
  completedAt?: Date;
}

export function isReportVisible(report: Report): boolean {
  if (report.status !== "completed") return true;
  if (!report.completedAt) return true;
  const hoursSinceCompletion =
    (Date.now() - report.completedAt.getTime()) / (1000 * 60 * 60);
  return hoursSinceCompletion < 24;
}

export function reportFromJson(json: Record<string, unknown>): Report {
  return {
    id: json["id"] as string,
    latitude: json["latitude"] as number,
    longitude: json["longitude"] as number,
    status: json["status"] as ReportStatus,
    thumbnailUrl: json["thumbnail_url"] as string | undefined,
    reportedAt: new Date(json["reported_at"] as string),
    completedAt: json["completed_at"]
      ? new Date(json["completed_at"] as string)
      : undefined,
  };
}
