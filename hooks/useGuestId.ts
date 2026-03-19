"use client";

import { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { useMapStore } from "@/store/mapStore";

const GUEST_ID_KEY = "guest_id";

export function useGuestId(): string | null {
  const { guestId, setGuestId } = useMapStore();

  useEffect(() => {
    let id = localStorage.getItem(GUEST_ID_KEY);
    if (!id) {
      id = uuidv4();
      localStorage.setItem(GUEST_ID_KEY, id);
    }
    setGuestId(id);
  }, [setGuestId]);

  return guestId;
}
