"use client";

import { useEffect, useRef, useState } from "react";
import { subscribeScroll } from "@/lib/scrollStore";
import { VIDEO_ROOMS, roomAtProgress } from "@/lib/videoTimeline";

export default function ProgressIndicator() {
  const fillRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(1);

  useEffect(() => {
    return subscribeScroll((s) => {
      if (fillRef.current) {
        fillRef.current.style.transform = `scaleY(${s.progress})`;
      }
      const room = roomAtProgress(s.progress);
      setIndex(VIDEO_ROOMS.findIndex((r) => r.key === room.key) + 1);
    });
  }, []);

  return (
    <div className="pointer-events-none fixed inset-y-0 right-6 z-40 hidden flex-col items-center justify-center gap-3 mix-blend-difference sm:flex">
      <span className="font-body text-[10px] tabular-nums tracking-widest2 text-white/70">
        {String(index).padStart(2, "0")}
      </span>
      <div className="relative h-32 w-px overflow-hidden bg-white/25">
        <div
          ref={fillRef}
          className="absolute inset-x-0 top-0 h-full origin-top scale-y-0 bg-white"
        />
      </div>
      <span className="font-body text-[10px] tabular-nums tracking-widest2 text-white/40">
        {String(VIDEO_ROOMS.length).padStart(2, "0")}
      </span>
    </div>
  );
}
