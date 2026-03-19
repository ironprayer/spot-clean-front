"use client";

import { useEffect } from "react";
import { useMapStore } from "@/store/mapStore";

const SEOUL = { lat: 37.5665, lng: 126.978 };

const GEO_OPTIONS: PositionOptions = {
  enableHighAccuracy: true, // GPS 우선 사용
  timeout: 10_000,          // 10초 내 응답 없으면 에러
  maximumAge: 0,            // 캐시된 위치 사용 안 함
};

export function useGeolocation() {
  const { setCurrentPosition, setLocationError } = useMapStore();

  useEffect(() => {
    if (!navigator.geolocation) {
      setCurrentPosition(SEOUL);
      setLocationError("이 브라우저는 위치 서비스를 지원하지 않습니다.");
      return;
    }

    // watchPosition: 위치가 바뀔 때마다 자동 업데이트
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setCurrentPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setLocationError(null);
      },
      (err) => {
        setCurrentPosition(SEOUL);
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setLocationError("위치 권한이 거부되었습니다. 브라우저 설정에서 허용해 주세요.");
            break;
          case err.POSITION_UNAVAILABLE:
            setLocationError("위치를 가져올 수 없습니다.");
            break;
          case err.TIMEOUT:
            setLocationError("위치 요청 시간이 초과되었습니다.");
            break;
          default:
            setLocationError("위치를 가져오는 중 오류가 발생했습니다.");
        }
      },
      GEO_OPTIONS
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [setCurrentPosition, setLocationError]);
}
