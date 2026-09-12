"use client";

import { useEffect, useRef } from "react";
import { subscribeScroll } from "@/lib/scrollStore";

export function useScrollScrub(
  videoRef: React.RefObject<HTMLVideoElement>,
  duration: number,
  enabled: boolean
) {
  const targetTime = useRef(0);
  const raf = useRef<number>();

  useEffect(() => {
    if (!enabled) return;
    const video = videoRef.current;
    if (!video) return;

    const tick = () => {
      raf.current = requestAnimationFrame(tick);
      if (video.readyState < 2) return; // not enough data to seek yet
      const current = video.currentTime;
      const diff = targetTime.current - current;
      // Small dead-zone avoids constant sub-frame seeking jitter; anything
      // larger snaps toward the target rather than fully teleporting, so
      // fast scroll flicks still read as motion rather than a hard cut.
      if (Math.abs(diff) < 0.02) return;
      const step = Math.abs(diff) > 1.2 ? diff : diff * 0.35;
      const next = Math.min(duration - 0.05, Math.max(0, current + step));
      video.currentTime = next;
    };

    const unsubscribe = subscribeScroll((s) => {
      targetTime.current = s.progress * duration;
    });

    raf.current = requestAnimationFrame(tick);

    return () => {
      unsubscribe();
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [videoRef, duration, enabled]);
}
