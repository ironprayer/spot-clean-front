"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import exifr from "exifr";
import { useMapStore } from "@/store/mapStore";
import { distanceKm } from "@/lib/geo";

const MAX_PHOTOS = 5;
const MAX_RADIUS_KM = 0.3; // 300m

interface PhotoItem {
  file: File;
  preview: string;
  gps: { lat: number; lng: number } | null;
  distKm: number | null;
  error: string | null;
}

export default function ReportPage() {
  const router = useRouter();
  const { currentPosition } = useMapStore();

  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFiles = useCallback(
    async (files: FileList) => {
      const slots = MAX_PHOTOS - photos.length;
      const toProcess = Array.from(files).slice(0, slots);

      const items: PhotoItem[] = await Promise.all(
        toProcess.map(async (file): Promise<PhotoItem> => {
          const preview = URL.createObjectURL(file);

          let gpsData: { latitude: number; longitude: number } | null = null;
          try {
            gpsData = await exifr.gps(file);
          } catch {
            // exifr throws on unsupported formats
          }

          if (!gpsData) {
            return {
              file,
              preview,
              gps: null,
              distKm: null,
              error: "GPS 정보가 없는 사진은 업로드할 수 없습니다.",
            };
          }

          const { latitude: lat, longitude: lng } = gpsData;
          const dist = distanceKm(currentPosition.lat, currentPosition.lng, lat, lng);

          if (dist > MAX_RADIUS_KM) {
            return {
              file,
              preview,
              gps: { lat, lng },
              distKm: dist,
              error: `현재 위치에서 ${(dist * 1000).toFixed(0)}m 떨어진 사진입니다. (300m 초과)`,
            };
          }

          return { file, preview, gps: { lat, lng }, distKm: dist, error: null };
        })
      );

      setPhotos((prev) => [...prev, ...items]);
    },
    [photos.length, currentPosition]
  );

  const removePhoto = (index: number) => {
    setPhotos((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const validPhotos = photos.filter((p) => !p.error);
  const hasInvalid = photos.some((p) => p.error);
  const canSubmit =
    validPhotos.length > 0 && description.trim().length > 0 && !submitting;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    // TODO: FormData API call
    console.log("신고 제출:", {
      description,
      location: currentPosition,
      photos: validPhotos.map((p) => ({ name: p.file.name, gps: p.gps })),
    });
    router.back();
  };

  return (
    <main className="h-screen flex flex-col bg-gray-50">
      {/* ── Header ── */}
      <header className="bg-white border-b border-gray-100 px-4 pt-safe shrink-0">
        <div className="flex items-center gap-3 py-4">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 active:bg-gray-200 transition-colors"
            aria-label="뒤로"
          >
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-base font-bold text-gray-900">쓰레기 신고하기</h1>
        </div>
      </header>

      {/* ── Scrollable body ── */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 flex flex-col gap-4 pb-6">

          {/* ── Photo upload ── */}
          <section className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-800">사진 첨부</h2>
              <span className="text-xs text-gray-400">{photos.length} / {MAX_PHOTOS}</span>
            </div>

            <div className="flex gap-3 flex-wrap">
              {/* Add button */}
              {photos.length < MAX_PHOTOS && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-1 hover:border-green-400 hover:bg-green-50 active:bg-green-100 transition-colors"
                >
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="text-[10px] text-gray-400">추가</span>
                </button>
              )}

              {/* Thumbnails */}
              {photos.map((photo, i) => (
                <div key={i} className="relative">
                  <div
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 ${
                      photo.error ? "border-red-400" : "border-green-400"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={photo.preview} alt="" className="w-full h-full object-cover" />
                  </div>

                  {/* Status badge */}
                  <div
                    className={`absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full flex items-center justify-center shadow ${
                      photo.error ? "bg-red-500" : "bg-green-500"
                    }`}
                  >
                    {photo.error ? (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    ) : (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>

                  {/* Remove button */}
                  <button
                    onClick={() => removePhoto(i)}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gray-700 hover:bg-gray-900 rounded-full flex items-center justify-center shadow transition-colors"
                    aria-label="사진 제거"
                  >
                    <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => e.target.files && processFiles(e.target.files)}
              onClick={(e) => {
                (e.target as HTMLInputElement).value = "";
              }}
            />

            <p className="text-xs text-gray-400 mt-3">
              사진의 GPS 정보를 읽어 현재 위치 반경 300m 이내의 사진만 업로드됩니다.
            </p>
          </section>

          {/* ── Photo location info ── */}
          {photos.length > 0 && (
            <section className="bg-white rounded-2xl p-4 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-800 mb-3">사진 위치 정보</h2>
              <div className="flex flex-col gap-2">
                {photos.map((photo, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-3 p-3 rounded-xl ${
                      photo.error ? "bg-red-50" : "bg-green-50"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photo.preview}
                      alt=""
                      className="w-10 h-10 rounded-lg object-cover shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-700 truncate">
                        {photo.file.name}
                      </p>

                      {photo.gps ? (
                        <p className="text-[11px] text-gray-500 mt-0.5 font-mono">
                          {photo.gps.lat.toFixed(5)}, {photo.gps.lng.toFixed(5)}
                        </p>
                      ) : (
                        <p className="text-[11px] text-gray-400 mt-0.5">GPS 정보 없음</p>
                      )}

                      {photo.distKm !== null && (
                        <p
                          className={`text-[11px] font-semibold mt-0.5 ${
                            photo.error ? "text-red-600" : "text-green-600"
                          }`}
                        >
                          현재 위치에서 {photo.distKm.toFixed(2)} km
                        </p>
                      )}

                      {photo.error && (
                        <p className="text-[11px] text-red-500 mt-0.5 leading-tight">
                          {photo.error}
                        </p>
                      )}
                    </div>

                    {/* Status icon */}
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                        photo.error ? "bg-red-100" : "bg-green-100"
                      }`}
                    >
                      {photo.error ? (
                        <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {hasInvalid && (
                <div className="mt-3 flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2.5">
                  <svg className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <p className="text-xs text-amber-700">유효하지 않은 사진은 제출 시 제외됩니다.</p>
                </div>
              )}
            </section>
          )}

          {/* ── Description ── */}
          <section className="bg-white rounded-2xl p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-800 mb-3">내용</h2>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="쓰레기 위치와 상태를 설명해 주세요.&#10;(예: 공원 입구 쪽 벤치 아래에 봉투째 버려진 쓰레기가 있습니다.)"
              rows={5}
              className="w-full text-sm text-gray-800 placeholder-gray-400 border border-gray-100 bg-gray-50 rounded-xl px-3 py-2.5 resize-none focus:outline-none focus:border-green-400 focus:bg-white transition-colors leading-relaxed"
            />
            <p className="text-xs text-gray-400 mt-1 text-right">{description.length}자</p>
          </section>

          {/* ── Current location ── */}
          <section className="bg-white rounded-2xl p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-800 mb-2">신고 위치</h2>
            <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-3 py-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-500">현재 위치 (자동 감지)</p>
                <p className="text-xs font-mono text-gray-700 mt-0.5">
                  {currentPosition.lat.toFixed(6)}, {currentPosition.lng.toFixed(6)}
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* ── Submit button ── */}
      <div className="bg-white border-t border-gray-100 px-4 py-4 pb-safe shrink-0">
        {validPhotos.length === 0 && photos.length > 0 && (
          <p className="text-xs text-center text-red-500 mb-3">
            유효한 사진이 없습니다. 300m 이내에서 찍은 사진을 추가해 주세요.
          </p>
        )}
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className={`w-full py-3.5 rounded-2xl font-semibold text-sm transition-colors ${
            canSubmit
              ? "bg-green-500 hover:bg-green-600 active:bg-green-700 text-white shadow-sm"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        >
          {submitting ? "제출 중..." : "신고하기"}
        </button>
      </div>
    </main>
  );
}
